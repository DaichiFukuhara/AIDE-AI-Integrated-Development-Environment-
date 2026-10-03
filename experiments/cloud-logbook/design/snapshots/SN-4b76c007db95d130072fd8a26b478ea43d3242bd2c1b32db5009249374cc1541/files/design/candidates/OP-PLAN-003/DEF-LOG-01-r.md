---
{
  "id": "DEF-LOG-01",
  "revision": 3,
  "semantic_revision": 3,
  "primary_parent": null,
  "parent_semantic_revision": null
}
---

# 定義変更の理由

同じsourceに自己申告の節目とhook観測が共存するため、既存フィールドに予約規約を加え意味版を3にする。SQLと旧データへの影響を小さくするため新フィールドを採らない。認証の証明と観測の分類を区別する。

直接・間接consumerはG-LOG/SG-TRACE/AP-FILE/SYS-LOGとE-002。4階層を同じ候補定義へ揃え、UI/CLI/API/DBはSYS-LOGの依拠先として評価する。E-001/旧bundle/旧監査は版1の歴史として維持し、過去の意味を変更したり旧合格を自動記録へ拡張したりしない。

AUD-PLAN-002の解消条件とUC-04の2026-10-03回答を取り込む。今回の脅威モデルは協調的観測で、改ざん耐性はNEXT-06の別計画候補。plan_revision 2の追加検証と限界に依拠する。
