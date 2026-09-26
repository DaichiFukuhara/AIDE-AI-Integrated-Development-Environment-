# CIV3-010〜012の修正と限定再監査

前回の[round 2](../claude-opus-5-5-high-round-2/report.md)でCIV3-001〜009はclosed。追加のmajor 2件・minor 1件を修正した。

| 指摘 | 修正 |
| --- | --- |
| CIV3-010 | messages/orchestrate/audit/stateで、未完了だけでなく同対象の完了済み非passと未解除保留も検索。修正待ちなら新規周期要求・費用予約を作らない。通知へのackと監査完了を区別し、修正subjectでのみ限定再監査へ進む。通信・基盤障害の回復は元要求の再開として扱う |
| CIV3-011 | records/audit/operationで、正式adoptionも交わる既存差分を必ず要求へ含め、提案分に事前IDを付ける。起点はscopeごとの項目baseline_refs、終点は今回subject。採用で基準を進める前に既存項目の漏れと累積保証を照合し、新旧項目を同じstate更新で解消する。残項目の起点は基準が進んでも変えない |
| CIV3-012 | budgets/messages/READMEで予算定義・配分と試行判断は学習、使用/予約台帳と監査送信は記録と明記。初期版は同じローカル担当の役割切替で予約する。外部作業者は予約済みの一実行だけを受け持ち、stateへ直接書かない。別プロセスから自律予約する拡張は対象外 |

今回のimplementation.diffはround 2に実際に渡したharness-v3と現在の差分。前回確定後、修正前の入力をローカルへ保存して作成した。round 2のprompt/実行情報/回答は不変で残す。
verification/claude-fixes-round-2/scenarios.mdの8ケースを静的に照合。Python・既存テスト・演習のファイルは前回の実行時と同一で、無変更のテストは再実行していない。

再監査ではCIV3-010〜012と変更の波及先を確認し、前回closedの9件は入力・依拠先が変わった範囲だけ回帰を確認する。新しい具体的な重大反例がある場合は理由付きで起票する。
