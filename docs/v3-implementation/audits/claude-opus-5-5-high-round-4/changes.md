# 残指摘ゼロに向けたCIV3-013〜015の修正

ユーザーは「完璧なものとなるまでループを回して、課題がなくなったら実装して」と依頼した。この回から、実装確定の条件をopen blocker/major/minorすべて0とする。通常のハーネスのaudit-pass条件と、この依頼の完了条件を区別する。
実装範囲は従来どおりA2のMarkdownハーネスと既存の補助ツール・製品例。独立監査は引き続きClaude CLI / Opus 5.5 / High。

| 指摘 | 修正 |
| --- | --- |
| CIV3-013 | budgets/stateで、口座のlimit等は不変計画・委任の写しと定義。definition_refと写しの同期、最新委任との判定時/送信直前照合、未同期保留を規定。intakeは学習役の定義後に記録役へ切り替えて保存 |
| CIV3-014 | recordにcycle_closedの第3の結果（失敗要求への修正待ち対応付け）を追加。orchestrate/messagesで実験終端とサイクル全体の未完了を区別し、後続監査受理と元通知の対応更新後に完了を再判定 |
| CIV3-015 | recordsに起点喪失からの回復手順。まず同一hashの復元、不能時はloss recordと新subjectで現行scope全体を初回相当監査。合格まで項目/保留を保持し、全体再検証に限って旧新版比較を代替。過去未確認の履歴は残す。subject/operation/audit/state/messagesへ必要項目を追加 |

11ケースをverification/claude-fixes-round-3/scenarios.mdで静的照合した。Python・テスト・製品例は無変更で、既存の実行証拠をhashで対応付ける。
前回は[round 3](../claude-opus-5-5-high-round-3/report.md)。当時のminor 3件を残した合格判定は履歴として保持し、今回の指摘ゼロとは扱わない。
