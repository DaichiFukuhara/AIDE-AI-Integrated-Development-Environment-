"""Count open and completed tasks without changing the input."""
import argparse
import json
from pathlib import Path


def summarize(tasks):
    if not isinstance(tasks, list):
        raise ValueError("Tasks must be a list")
    counts = {"open": 0, "done": 0, "total": 0}
    seen = set()
    for task in tasks:
        if not isinstance(task, dict):
            raise ValueError("Each task must be an object")
        task_id = task.get("id")
        status = task.get("status")
        if not isinstance(task_id, str) or not task_id.strip() or task_id in seen:
            raise ValueError("Task IDs must be nonempty and unique")
        if status not in ("open", "done"):
            raise ValueError("Unknown task status")
        seen.add(task_id)
        counts[status] += 1
        counts["total"] += 1
    return counts


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    args = parser.parse_args()
    try:
        result = summarize(json.loads(args.input.read_text(encoding="utf-8")))
    except (OSError, ValueError) as error:
        parser.exit(1, f"summary: {error}\n")
    print(json.dumps(result, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
