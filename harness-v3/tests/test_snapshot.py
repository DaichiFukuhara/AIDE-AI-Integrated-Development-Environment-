import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

TOOL = Path(__file__).resolve().parents[1] / "tools/snapshot.py"
spec = importlib.util.spec_from_file_location("snapshot", TOOL)
snapshot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(snapshot)


class SnapshotTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / "design").mkdir()
        (self.root / "design/master.md").write_text("# 目標\n最小の動作\n", encoding="utf-8")
        (self.root / "app.py").write_bytes(b"print('first')\r\n")

    def freeze(self):
        return snapshot.freeze(self.root, ["design/master.md", "app.py"])

    def test_deterministic_and_byte_preserving(self):
        a = self.freeze()
        b = snapshot.freeze(self.root, ["app.py", "design/master.md"])
        self.assertEqual(a, b)
        self.assertEqual((a / "files/app.py").read_bytes(), b"print('first')\r\n")
        self.assertEqual(snapshot.verify(a)["snapshot_id"], a.name)

    def test_new_input_does_not_rewrite_old_evidence(self):
        old = self.freeze()
        (self.root / "app.py").write_text("print('second')\n")
        new = self.freeze()
        self.assertNotEqual(old, new)
        self.assertEqual((old / "files/app.py").read_bytes(), b"print('first')\r\n")
        snapshot.verify(old)

    def test_tampered_or_missing_evidence_fails(self):
        frozen = self.freeze()
        (frozen / "files/app.py").write_bytes(b"changed")
        with self.assertRaises(snapshot.SnapshotError):
            snapshot.verify(frozen)
        with self.assertRaises(snapshot.SnapshotError):
            self.freeze()  # Existing damaged snapshot must never be silently repaired.
        (frozen / "files/app.py").unlink()
        with self.assertRaises(snapshot.SnapshotError):
            snapshot.verify(frozen)

    def test_manifest_corruption_fails(self):
        frozen = self.freeze()
        p = frozen / "manifest.json"
        data = json.loads(p.read_text())
        data["files"][0]["path"] = "../escape"
        p.write_text(json.dumps(data))
        with self.assertRaises(snapshot.SnapshotError):
            snapshot.verify(frozen)

    def test_path_escape_duplicate_and_empty_inputs_fail(self):
        for paths in (["../outside"], [str(self.root / "app.py")],
                      ["app.py", "app.py"], []):
            with self.subTest(paths=paths), self.assertRaises(snapshot.SnapshotError):
                snapshot.freeze(self.root, paths)
        self.assertFalse((self.root / "design/snapshots").exists())

    def test_failure_does_not_publish_partial_snapshot(self):
        with self.assertRaises(snapshot.SnapshotError):
            snapshot.freeze(self.root, ["app.py", "missing.py"])
        self.assertFalse((self.root / "design/snapshots").exists())

    def test_staging_write_failure_preserves_previous_snapshot(self):
        old = self.freeze()
        (self.root / "app.py").write_bytes(b"print('new')\n")
        write = Path.write_bytes

        def failing_write(path, data):
            if ".pending-" in str(path) and path.name == "master.md":
                raise OSError("injected write failure")
            return write(path, data)

        with patch.object(Path, "write_bytes", failing_write):
            with self.assertRaisesRegex(OSError, "injected write"):
                self.freeze()
        self.assertEqual(list(old.parent.iterdir()), [old])
        snapshot.verify(old)

    def test_publish_failure_does_not_expose_partial_bundle(self):
        old = self.freeze()
        (self.root / "app.py").write_bytes(b"print('new')\n")
        with patch.object(snapshot.os, "rename", side_effect=OSError("injected publish failure")):
            with self.assertRaisesRegex(OSError, "injected publish"):
                self.freeze()
        self.assertEqual(list(old.parent.iterdir()), [old])
        snapshot.verify(old)

    @unittest.skipUnless(os.name == "nt", "Windows junction case")
    def test_internal_junction_is_rejected_without_is_junction_api(self):
        target = self.root / "target"
        target.mkdir()
        (target / "input.txt").write_bytes(b"local")
        link = self.root / "inside-link"
        result = subprocess.run(["cmd", "/c", "mklink", "/J", str(link), str(target)],
                                capture_output=True, creationflags=subprocess.CREATE_NO_WINDOW)
        if result.returncode:
            self.skipTest("Creating junctions is unavailable on this host")
        try:
            # The detector must also work on Python 3.10/3.11 without Path.is_junction.
            with patch.object(Path, "is_junction", side_effect=AssertionError("new API used"), create=True):
                with self.assertRaisesRegex(snapshot.SnapshotError, "Link"):
                    snapshot.freeze(self.root, ["inside-link/input.txt"])
        finally:
            # Remove only this newly created junction, never its target or contents.
            link.rmdir()
        self.assertEqual((target / "input.txt").read_bytes(), b"local")

    def test_symbolic_link_is_rejected_when_available(self):
        try:
            (self.root / "link.py").symlink_to(self.root / "app.py")
        except OSError:
            self.skipTest("Creating symlinks is unavailable on this host")
        with self.assertRaises(snapshot.SnapshotError):
            snapshot.freeze(self.root, ["link.py"])

    def test_self_consistent_manifest_cannot_read_outside_bundle(self):
        body = {"format_version": 1, "files": [
            {"path": "../../app.py", "size": 16, "sha256": "0" * 64}
        ]}
        identity = snapshot.digest(snapshot.canonical(body))
        folder = self.root / ("SN-" + identity)
        folder.mkdir()
        manifest = dict(body, snapshot_id=folder.name, digest=identity)
        (folder / "manifest.json").write_bytes(snapshot.canonical(manifest))
        with self.assertRaisesRegex(snapshot.SnapshotError, "Project-relative"):
            snapshot.verify(folder)

    def test_cli_returns_failure_for_bad_input(self):
        p = subprocess.run([sys.executable, str(TOOL), "freeze", str(self.root), "missing"],
                           capture_output=True, text=True)
        self.assertEqual(p.returncode, 1)
        self.assertIn("snapshot:", p.stderr)


if __name__ == "__main__":
    unittest.main()
