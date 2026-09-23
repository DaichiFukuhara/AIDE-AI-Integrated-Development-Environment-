"""Immutable local input bundles; no audit, approval, or adoption decisions."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import stat
from pathlib import Path
import tempfile


class SnapshotError(ValueError):
    pass


def canonical(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=False,
                      separators=(",", ":"), allow_nan=False).encode("utf-8")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def checked_path(root, relative):
    """Reject traversal and links before reading or writing an input path."""
    relative = Path(relative)
    if relative.is_absolute() or not relative.parts or ".." in relative.parts:
        raise SnapshotError(f"Project-relative path required: {relative}")
    candidate = root / relative
    current = root
    for part in relative.parts:
        current = current / part
        try:
            info = current.lstat()
        except FileNotFoundError:
            continue
        reparse_point = getattr(info, "st_file_attributes", 0) & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0x400)
        if current.is_symlink() or reparse_point:
            raise SnapshotError(f"Link is not an immutable input path: {current}")
    if not candidate.resolve().is_relative_to(root):
        raise SnapshotError(f"Path outside project: {relative}")
    return candidate


def verify(folder):
    folder = Path(folder).resolve()
    manifest_path = checked_path(folder, "manifest.json")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if set(manifest) != {"format_version", "snapshot_id", "digest", "files"}:
        raise SnapshotError("Unexpected manifest fields")
    body = {key: manifest[key] for key in ("format_version", "files")}
    expected = digest(canonical(body))
    if (manifest["format_version"] != 1 or manifest["digest"] != expected
            or manifest["snapshot_id"] != "SN-" + expected
            or folder.name != manifest["snapshot_id"]):
        raise SnapshotError("Manifest identity mismatch")
    if not isinstance(manifest["files"], list) or not manifest["files"]:
        raise SnapshotError("Empty input bundle")
    seen = set()
    for entry in manifest["files"]:
        if set(entry) != {"path", "sha256", "size"}:
            raise SnapshotError("Unexpected file fields")
        relative = entry["path"]
        if not isinstance(relative, str) or relative.casefold() in seen:
            raise SnapshotError("Duplicate or invalid file path")
        seen.add(relative.casefold())
        # Validate relative independently; prefixing an absolute path would hide it.
        checked_path(folder, relative)
        file = checked_path(folder, Path("files") / relative)
        if not file.is_file():
            raise SnapshotError(f"Missing input: {relative}")
        data = file.read_bytes()
        if len(data) != entry["size"] or digest(data) != entry["sha256"]:
            raise SnapshotError(f"Input changed: {relative}")
    return manifest


def freeze(project, paths):
    project = Path(project).resolve()
    if not project.is_dir():
        raise SnapshotError("Project does not exist")
    container = checked_path(project, "design/snapshots")
    inputs, seen = [], set()
    for relative in paths:
        file = checked_path(project, relative)
        name = file.relative_to(project).as_posix()
        if name.casefold() in seen:
            raise SnapshotError(f"Duplicate input: {name}")
        seen.add(name.casefold())
        if not file.is_file() or file.resolve().is_relative_to(container.resolve()):
            raise SnapshotError(f"Expected a regular source file: {name}")
        data = file.read_bytes()
        inputs.append((name, data))
    if not inputs:
        raise SnapshotError("At least one input is required")
    inputs.sort(key=lambda item: item[0])
    body = {"format_version": 1, "files": [
        {"path": name, "sha256": digest(data), "size": len(data)}
        for name, data in inputs
    ]}
    identity = digest(canonical(body))
    manifest = dict(body, snapshot_id="SN-" + identity, digest=identity)
    destination = container / manifest["snapshot_id"]
    checked_path(project, destination.relative_to(project))
    if destination.exists():
        if verify(destination) != manifest:
            raise SnapshotError("Existing immutable snapshot differs")
        return destination
    container.mkdir(parents=True, exist_ok=True)
    # Only our private staging directory is cleaned up. Existing bundles are never rewritten.
    with tempfile.TemporaryDirectory(prefix=".pending-", dir=container) as temporary:
        staged = Path(temporary) / manifest["snapshot_id"]
        staged.mkdir()
        for name, data in inputs:
            target = staged / "files" / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        (staged / "manifest.json").write_bytes(canonical(manifest) + b"\n")
        verify(staged)
        try:
            os.rename(staged, destination)
        except OSError:
            # An identical concurrent freeze may have published this immutable bundle.
            if not destination.exists() or verify(destination) != manifest:
                raise
    return destination


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    create = commands.add_parser("freeze", help="Freeze explicitly selected project files")
    create.add_argument("project", type=Path)
    create.add_argument("files", nargs="+")
    check = commands.add_parser("verify", help="Check a saved bundle without changing it")
    check.add_argument("snapshot", type=Path)
    hash_json = commands.add_parser("hash-json", help="Canonical SHA-256 of a JSON input object")
    hash_json.add_argument("input", type=Path)
    args = parser.parse_args(argv)
    try:
        if args.command == "freeze":
            result = {"snapshot": str(freeze(args.project, args.files))}
        elif args.command == "verify":
            result = {"verified": verify(args.snapshot)["snapshot_id"]}
        else:
            obj = json.loads(args.input.read_text(encoding="utf-8"))
            if not isinstance(obj, dict):
                raise SnapshotError("Expected a JSON object")
            result = {"sha256": digest(canonical(obj))}
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(1, f"snapshot: {error}\n")
    print(json.dumps(result, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
