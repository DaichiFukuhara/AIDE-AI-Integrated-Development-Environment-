---
{
  "id": "PRECHECK-PLAN-003-NOTE",
  "revision": 1,
  "subject_hash": "12b4d977ec81c54f4b914d1cf1a628ef22b5a2635d2427cdb480839571c5b8d7",
  "plan_revision": 2,
  "result": "structural-pass",
  "semantic_audit": "not-executed",
  "checked_at": "2026-10-03T12:03:38.163806+00:00"
}
---

# 計画構造の確認

固定subjectの全参照hashとsnapshot、G-LOG→SG-TRACE→AP-FILE→SYS-LOGの主親・設計/根拠対（意味版3）をprecheck.pyで確認。DEF-LOG-01意味版3のconsumerを4階層とE-002へ閉じ、外部hookと内部queue/API/UIのownerはSYS-LOG、製品context間seamは理由付き非該当。

systemのUT-AUTO-01/02、subgoalのSIT-AUTO-01/SIT-REG-01、rootのFIT-AUTO-01/02/FIT-UI-02/HUMAN-AUTO-02を対応付けた。今回の追加条件は脅威モデル/README/画面、欠落3条件、env非出力、reason許可値、明示timeout/async締切、root設定マージ。合成入力は実機FITの代替にしない。全項目未実行。

計画に対象外・既存予算・追加委任・候補実装場所・停止点・UC-04回答とUC-01〜03未確認がある。.gitignoreの.local/除外を読取確認。SQL/14フィールド/手動CLIは無変更。確認はidentity/構造と対応関係に限定し、指摘の解消・独立合格は判定しない。
