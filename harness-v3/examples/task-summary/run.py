"""Execute the bounded test/fix/use exercise; reviewer decisions are not simulated as evidence."""
from pathlib import Path
import importlib.util
import json
import os
import subprocess
import sys
import tempfile

HERE = Path(__file__).resolve().parent
TOOL = HERE.parents[1] / "tools/snapshot.py"
spec = importlib.util.spec_from_file_location("snapshot", TOOL)
snapshot = importlib.util.module_from_spec(spec)
spec.loader.exec_module(snapshot)


def run():
    with tempfile.TemporaryDirectory(prefix="aide-v3-exercise-") as temporary:
        project = Path(temporary)
        for folder in ("src", "tests", "evidence"):
            (project / folder).mkdir()
        fixed = (HERE / "src/summary.py").read_text(encoding="utf-8")
        # Deliberately seeded defect: count completed tasks as open. Same acceptance tests.
        initial = fixed.replace('counts[status] += 1', 'counts["open"] += 1')
        (project / "src/summary.py").write_text(initial, encoding="utf-8")
        (project / "tests/test_summary.py").write_bytes((HERE / "tests/test_summary.py").read_bytes())
        env = dict(os.environ, AIDE_EXAMPLE_MODULE=str(project / "src/summary.py"),
                   PYTHONDONTWRITEBYTECODE="1")
        command = [sys.executable, "-B", "-m", "unittest", "discover", "-s", "tests", "-v"]
        failed = subprocess.run(command, cwd=project, env=env, capture_output=True, text=True,
                                encoding="utf-8", errors="replace")
        if failed.returncode == 0 or "FAIL: test_counts_mixed_statuses" not in failed.stderr:
            raise RuntimeError("The initial defect was not detected by the expected regression")
        (project / "evidence/trial-1.txt").write_text(failed.stdout + failed.stderr, encoding="utf-8")
        before = snapshot.freeze(project, ["src/summary.py", "tests/test_summary.py", "evidence/trial-1.txt"])
        (project / "src/summary.py").write_text(fixed, encoding="utf-8")
        passed = subprocess.run(command, cwd=project, env=env, capture_output=True, text=True,
                                encoding="utf-8", errors="replace")
        if passed.returncode:
            raise RuntimeError(passed.stdout + passed.stderr)
        (project / "tasks.json").write_bytes((HERE / "tasks.json").read_bytes())
        used = subprocess.run([sys.executable, "-B", "src/summary.py", "tasks.json"], cwd=project,
                              env=env, capture_output=True, text=True, encoding="utf-8")
        expected = {"done": 1, "open": 2, "total": 3}
        if used.returncode or json.loads(used.stdout) != expected:
            raise RuntimeError("CLI use did not match the acceptance condition")
        evidence = dict(test_exit_code=passed.returncode, test_output=passed.stdout + passed.stderr,
                        use_exit_code=used.returncode, use_output=used.stdout, expected=expected,
                        user_evaluation="not-observed", independent_audit="not-performed-by-example")
        (project / "evidence/trial-2.json").write_text(json.dumps(evidence, ensure_ascii=False, indent=2), encoding="utf-8")
        after = snapshot.freeze(project, ["src/summary.py", "tests/test_summary.py", "tasks.json", "evidence/trial-2.json"])
        snapshot.verify(before)
        snapshot.verify(after)
        if before == after or (before / "files/src/summary.py").read_text(encoding="utf-8") != initial:
            raise RuntimeError("Trial history was not preserved")
        return dict(result="pass", trial_1_exit_code=failed.returncode,
                    trial_1_output=failed.stdout + failed.stderr, trial_2=evidence,
                    snapshots_distinct=True, old_trial_preserved=True,
                    learning="Count each task by its explicit status; preserve the regression test.",
                    limit="Automated local exercise with sample data; no user study or audit decision.")


if __name__ == "__main__":
    print(json.dumps(run(), ensure_ascii=False, indent=2))
