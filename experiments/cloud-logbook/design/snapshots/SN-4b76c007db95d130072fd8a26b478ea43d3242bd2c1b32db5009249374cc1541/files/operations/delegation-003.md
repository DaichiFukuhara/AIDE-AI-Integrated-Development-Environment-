---
{
  "id": "DELEGATION-03",
  "revision": 1,
  "semantic_revision": 1,
  "experiment_id": "E-002",
  "cycle_id": "C-002",
  "previous_delegation_ref": {
    "id": "DELEGATION-02",
    "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/operations/delegation-002.md",
    "sha256": "ef9f016a14248e206e3942b588861c900f5ead281d54ae46923019242170a146",
    "semantic_revision": 1
  },
  "source": "利用者の2026-10-03 AUD-PLAN-002受理・改訂・再監査予約依頼とUC-04回答",
  "current_authority": "accept require-review; revise plan; reserve re-audit; stop before dispatch",
  "budget_definition_ref": {
    "id": "BUDGET-02",
    "immutable_ref": "design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822/files/experiments/budget-definition-002.md",
    "sha256": "a2bd9872ce8d029979c7dffaf7ce164fcc49992c8d71853a1efa87a593ab84f7",
    "semantic_revision": 1
  }
}
---

# 計画改訂の追加委任

DELEGATION-02を引き継ぎ、Codex一人がrecord/design/experiment/precheckの役割を切り替える。AUD-PLAN-002のidentity照合・snapshot固定・親子監査予約の精算・計画保留、新plan_revision 2とAR-PLAN-003の固定・予約までを許可する。再監査はClaude Opus 5.5が外部で担当する。Codexは監査実行・送信・実装・hook・設定作成を行わない。

UC-04は回答済み: 今回は協調的な見える化の限界を明記し欠落検出だけを追加、改ざん・停止耐性は不要。本格的改ざん耐性はNEXT-06へ分離する。自動hook/workerの資格方式はDELEGATION-02の環境変数限定案を置き換え、gitignore済み実験内.localファイルから読む将来案とする。モデルがそのファイルを読める限界も明記する。今回は資格ファイルを作らず読まない。

予算定義・全上限は変更しない。受理・改訂・precheck・要求保存をEXEC-RECORD-007の1バッチにまとめ、親子双方へ1回計上する。再監査はEXEC-AUDIT-PLAN-003を親子双方に予約するだけ。子の監査2枠が埋まるため将来のadoption監査は追加配分/予算変更の定義固定と同期までheld-budget。UC-01〜03は未確認。

読み書きはC:/Users/daich/claude-works配下だけ。TMP/TEMP/TMPDIRはexperiments/cloud-logbook/.local/tmp、pythonはPYTHONUTF8=1、UTF-8で保存する。ホーム、%TEMP%、%APPDATA%、~/.claude、~/.codex、外部ネットワーク、本番資格、課金、git操作、global npm/pip、レジストリ、ACL変更は禁止。旧snapshot・監査・試行は編集しない。製品/hook/設定は次段階の依頼まで作らない。
