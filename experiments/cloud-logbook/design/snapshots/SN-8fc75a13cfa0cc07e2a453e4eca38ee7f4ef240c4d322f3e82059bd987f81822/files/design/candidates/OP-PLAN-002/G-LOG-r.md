---
{
  "id": "G-LOG",
  "revision": 2,
  "semantic_revision": 2,
  "primary_parent": null,
  "parent_semantic_revision": null,
  "candidate_operation_id": "OP-PLAN-002",
  "adopted": false
}
---

# 自動記録を限定して試す理由

利用者は2026-10-03にNEXT-03を選びClaude Codeを最初の対象と決めた。手動の自己申告だけでは作業の動きを観測できないためhookの最小メタデータを追加する。全文転送・transcript解析・同期HTTP・新スキーマを採らず、キュー耐久性と旧データの互換性を保つ。監査保証や全ツール監視と混同しない。

NEXT-04は自動収集と手動更新による検証には不可欠ではなく今回除外。実機の入力・asyncが異なるときはFITの証拠から新計画へ戻す。予算は旧総枠の残りを配分し、不足はpausedとして利用者へ返す。
