import copy
import importlib.util
import os
from pathlib import Path
import unittest

source = Path(os.environ.get("AIDE_EXAMPLE_MODULE", Path(__file__).resolve().parents[1] / "src/summary.py"))
spec = importlib.util.spec_from_file_location("summary_under_test", source)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class SummaryTests(unittest.TestCase):
    def test_counts_mixed_statuses(self):
        tasks = [{"id": "調べる", "status": "done"},
                 {"id": "実装", "status": "open"}, {"id": "確認", "status": "open"}]
        self.assertEqual(module.summarize(tasks), {"open": 2, "done": 1, "total": 3})

    def test_empty(self):
        self.assertEqual(module.summarize([]), {"open": 0, "done": 0, "total": 0})

    def test_does_not_mutate_and_order_does_not_matter(self):
        tasks = [{"id": "a", "status": "done"}, {"id": "b", "status": "open"}]
        before = copy.deepcopy(tasks)
        self.assertEqual(module.summarize(tasks), module.summarize(list(reversed(tasks))))
        self.assertEqual(tasks, before)

    def test_rejects_duplicate_ids(self):
        with self.assertRaises(ValueError):
            module.summarize([{"id": "a", "status": "open"}, {"id": "a", "status": "done"}])

    def test_rejects_invalid_data(self):
        for tasks in ({}, [None], [{"id": "a", "status": "unknown"}],
                      [{"id": "", "status": "open"}], [{"id": 1, "status": "done"}]):
            with self.subTest(tasks=tasks), self.assertRaises(ValueError):
                module.summarize(tasks)


if __name__ == "__main__":
    unittest.main()
