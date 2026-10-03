---
{"id":"DELEGATION-02","revision":1,"semantic_revision":1,"experiment_id":"E-002","cycle_id":"C-002","source":"利用者の2026-10-03の依頼・決定","previous_delegation_ref":"operations/delegation.md","current_authority":"plan-only; reserve external audit; stop before dispatch"}
---

# E-002 の許可と担当

Codex が一人で intake → design → experiment/plan → precheck → record の役割を切り替える。今回の許可は計画、設計の候補、固定入力、構造検査、AR-PLAN-002 と予算予約の保存まで。state を書く反映担当は Codex 一人。独立監査は利用者指定の Claude Opus 5.5 が外部で担当し、今回 Codex から実行・メッセージ送信しない。

監査者へは保存済みの request、subject、snapshot、precheck を渡す。監査者が state/current を直接更新したり、追加監査を独自に起動したりしない。結果は要求 ID/hash/scope/phase/criteria_version と対応付けて返し、反映担当が受理と予算精算を行う。

plan 合格だけで実装着手を自動許可しない。UC-01〜03 の利用者確認、現在の S-CONTEXT・保留・予算照合、実装の明示依頼後に、E-002-plan.md の候補ファイル範囲と固定検証に限って進める。内部の標準ライブラリ選択・実装分割はその範囲内で担当が決められる。評価・設定範囲・予算を変える場合は新 plan_revision/subject/request が必要。

リポジトリのプロジェクト設定だけを候補とし、~/.claude、~/.codex、ホーム、%TEMP%、%APPDATA% を読まず変更しない。トークンは環境変数だけで渡し、設定、引数、Git、キュー、ログ、証拠に書かない。外部ネットワーク、本番接続、課金、git 操作、グローバル npm/pip、レジストリ、ACL 変更は今回の委任外。既存 snapshot・監査・試行を編集しない。

実 Claude Code セッションの検証は別段階。利用者が用意した実セッションと、リポジトリ内の無害な fixture、loopback サーバーだけを使う案である。新しい有料セッション・外部通信の開始は現在の許可に含まれない。既存モデルセッションの費用は unknown で、0円と扱わない。
