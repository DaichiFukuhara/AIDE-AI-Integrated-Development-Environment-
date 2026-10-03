---
{
  "id": "SG-TRACE",
  "revision": 3,
  "semantic_revision": 3,
  "primary_parent": "G-LOG",
  "parent_semantic_revision": 3,
  "candidate_operation_id": "OP-PLAN-003",
  "adopted": false
}
---

# 自動記録を限定して試す理由

利用者は2026-10-03にNEXT-03を選びClaude Codeを最初の対象と決めた。手動の自己申告だけでは作業の動きを観測できないためhookの最小メタデータを追加する。全文転送・transcript解析・同期HTTP・新スキーマを採らず、キュー耐久性と旧データの互換性を保つ。監査保証や全ツール監視と混同しない。

NEXT-04は自動収集と手動更新による検証には不可欠ではなく今回除外。実機の入力・asyncが異なるときはFITの証拠から新計画へ戻す。予算は旧総枠の残りを配分し、不足はpausedとして利用者へ返す。

AUD-PLAN-002の解消条件とUC-04の2026-10-03回答を取り込む。今回の脅威モデルは協調的観測で、改ざん耐性はNEXT-06の別計画候補。plan_revision 2の追加検証と限界に依拠する。
