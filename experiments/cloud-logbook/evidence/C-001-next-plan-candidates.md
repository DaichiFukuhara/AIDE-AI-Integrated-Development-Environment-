---
{
  "id": "C-001-NEXT-PLAN-CANDIDATES",
  "revision": 1,
  "cycle_id": "C-001",
  "state": "proposed-for-next-plan",
  "recorded_at": "2026-10-03T11:15:30.771975+00:00",
  "audit_ref": {
    "id": "AUD-ADOPT-002",
    "immutable_ref": "design/snapshots/SN-b8b093d9d560411450d3dfb284154696b239d7713edf544fcc8c25d58a2bfad7/files/audits/AUD-ADOPT-002.md",
    "sha256": "f3f94c7cb416631da6b6c5df52c4f6e40dd240ccf631a378370e06511a39efa2"
  },
  "existing_handoff_ref": "evidence/CORRECTION-004-handoff.md",
  "candidate_ids": [
    "NEXT-01",
    "NEXT-02",
    "NEXT-03",
    "NEXT-04",
    "NEXT-05"
  ]
}
---

# C-001から次計画への候補（未着手）
採用対象はIMPL-005のローカル技術的試験のみ。次の5件は新計画の候補であり、今回の製品コードは変更していない。優先順・実装・検証条件は次計画の学習担当が確定する。

| 候補 | 出所 | 次計画で決める内容 |
| --- | --- | --- |
| NEXT-01 起動時障害の再試行・ログアウト | AUD-ADOPT-002 / F-CLOUD-ADOPT-002（open minor、owner=SYS-LOG実装担当 Codex） | 再試行ボタンまたは再読み込み案内、cookie消去可能なログアウト、未知の400/401/403が続いた場合に再ログインを選べる方針。起動時障害・復旧・ログアウトを検証する。採用を妨げないが解消済みとはしない。 |
| NEXT-02 検索範囲の統一 | CORRECTION-004-HANDOFF | fixtureはイベント全体、SQLはtitle/body/reason/actor/project/run/next/evidenceのみ。source/phase/outcome/idを含める検索仕様と両adapterの一致を決める。 |
| NEXT-03 自己申告ログと自動記録の方針 | CORRECTION-004-HANDOFF | 現状はAIの自己申告。Claude Code hooks/Codex notifyによる自動記録・監視化は利用者の方針確認後に新計画で扱う。 |
| NEXT-04 一覧の自動更新 | CORRECTION-004-HANDOFF | 監視用途へ進む場合は定期取得と最終取得時刻表示、障害時の表示を計画する。 |
| NEXT-05 圧縮コードの整形 | CORRECTION-004-HANDOFF | service.mjs/app.js/styles.cssの1行圧縮を別サイクルで整形し、動作不変を確認する。 |

## 採用後も未確認・保留の確認
DEPLOY-01（実Supabase DB/Auth/RLS/RPC、実際のAuthエラー本文、Vercel HTTPS、Secure cookie）は未確認。本番資格・アカウント接続と課金条件の確認後、別計画で検証する。
SOURCES-01（Codex/Claudeのローカル・クラウド4実環境からのHTTPS送信）は未確認。ローカルで4source値を試した事実とは区別する。
HUMAN-01（本人の見やすさ・再開評価）、native download完了、他ブラウザ、長期運用、クラウドキュー持続性は未確認。製品全体完成はfalse。
FIT変更部分は独立監査の実ブラウザ9項目と自動29件で確認された。真の失効時のexport消去はブラウザでは個別観測されず、自動テストで確認。実Auth/HTTPSを保証しない。
固定ADOPT-002/TRIAL-005の「FIT未確認」は提出時点の履歴として保存し、現在の確認状況はAUD-ADOPT-002と受理記録を参照する。
