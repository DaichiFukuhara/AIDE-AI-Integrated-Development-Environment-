---
{
  "experiment_id": "E-001",
  "revision": 1,
  "plan_revision": 1,
  "cycle_id": "C-001",
  "previous_cycle_ref": "../harness-logbook/experiments/E-001.md",
  "state": "planned",
  "goal_refs": [
    "G-LOG",
    "SG-TRACE"
  ],
  "system_refs": [
    "SYS-LOG"
  ],
  "domain_context_refs": [
    "D-LOG",
    "CTX-LOG"
  ],
  "model_definition_refs": [
    "DEF-LOG-01"
  ],
  "baseline_bundle": null,
  "delegation_ref": "operations/delegation.md",
  "budget_account_refs": [
    "LOCAL-01"
  ],
  "budget": "experiments/budget-definition.md"
}
---

# クラウドとローカルで共通の記録を送れるか
最小出力はVercel用API・HTML/CSS/JS画面、Supabase SQL、Python標準CLI、設定例、4環境向けリポジトリ内の記録手順。実装と配備検証を別段階にする。新しい保存場所はexperiments/cloud-logbook、旧実験は変更しない。
| ID | 固定確認 | 必須 |
|---|---|---|
| UT-01 | 形式/URL/入力サイズ検証、トークン不一致・scope不一致拒否、閲覧セッション・所有者分離、同ID同内容再送と異内容409、CLI保存不変・lock・redirect/失敗後保持、秘密値非出力 | ローカル技術的試験採用に必須 |
| SIT-01 | 実CLI→実ローカルHTTP API→保存adapter→認証読取の対応、四source、検索・継続ページ、同時/再送、DB SQLの一意制約/RLS/RPC権限を独立確認。Supabase実接続前は境界stubで明示 | ローカル技術的試験採用に必須 |
| FIT-01 | 実ブラウザでログイン・実CLIログ表示・絞込・検索・詳細・書出し・通信失敗時旧表示・390px/desktop表示、ログアウトでログ消去 | ローカル技術的試験採用に必須 |
| DEPLOY-01 | 新規SupabaseにSQL適用・正当/不正資格とRLS/競合を実確認、Vercel配備とHTTPS送信・閲覧を実確認、秘密値なし | 本番利用に必須。資格/アカウント接続待ちなら未確認としてローカル試験採用を許容 |
| SOURCES-01 | Codex/Claudeのローカルとクラウドそれぞれから実HTTPS送信 | 4環境対応の実証に必須。source欄に4値を付けたローカル試験だけで4環境動作済みとしない |
| HUMAN-01 | 利用者の実際の見やすさ・再開評価 | 未確認を明示。本人評価まで全体完成としない |
初回計画checked前に製品実装しない。毎回固定実装・定義・委任・予算を照合し試行/audit予約。修正後は別trial。品質/定義/評価変更は新計画へ戻る。合格は独立adoption監査open major/blocker 0と同じ版の必須証拠。current切替はrecordのみ。
採否の終端・cycle_closed通知とack/理由付きperiodic判定を保存。資格待ちを完了済み配備としない。本番配備・4環境・本人評価の未確認を次の操作へ引き継ぐ。課金条件不明なら本番実行を保留する。
