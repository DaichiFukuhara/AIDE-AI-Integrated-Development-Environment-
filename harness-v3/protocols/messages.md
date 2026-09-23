# context間の受渡し

一つのローカル担当が順次実行しても同じ契約を使う。通信サーバーは不要。
要求は[operation](../templates/operation.md)、判定は[audit](../templates/audit.md)、確定順は[state](../templates/state.md)へ保存する。

## 4本のseam

このハーネスの所有者はG-V3。設計のseam revision 3を実現する。利用者の製品のseamとは区別する。

| seam | 提供 → 利用 | 必須の受渡し |
| --- | --- | --- |
| S-CONTEXT | 記録 → 学習 | 要求ID、対象goal/system。応答はbundle、版集合、委任、subject、phase/scope別baseline、未監査差分、進行判定、対応する確定結果 |
| S-PROPOSAL | 学習 → 記録 | operation_id、kind=plan/adoption/withdrawal/cycle_closed、experiment/plan_revision/cycle_id、scope、委任。計画・採用はbase_bundle、対象ID、差分、subject/hash、条件・契約影響 |
| S-AUDIT-INPUT | 記録 → 監査 | operation_id=audit_request_id、origin_operation_id、kind=plan/adoption/periodic/cancel、scope、subject/hash、criteria_version、baseline、累積差分、委任、観測時刻 |
| S-AUDIT-RESULT | 監査 → 記録 | 応答先ID、origin_operation_id、subject_hash、scope、phase、criteria_version、result、証拠、finding、次の処理、基準、期限。cancelはtarget_operation_idも返す |

subjectは[対象契約](subject.md)の定義参照を含む。S-CONTEXTは読み取り専用で、取消後の古いcheckedを進行許可として返さない。
resultはdaily-pass / require-review / audit-pass / blocked / stale / cancelled / pending-target / already-completed / rejected。
記録担当が返す採用応答にはapplied / already-applied / conflictもある。確定結果と現行bundleを要求IDで取得できるようにする。
同ID・同payloadの再送は台帳の確定状態を返す。同ID異payloadはrejected。時刻や受信順だけで版を推測しない。
不足項目は理由・解消条件付きblocked、版不一致はstale/conflict、既存の証拠は保持する。

## 取消

withdrawalは新operation_idに、`target_operation_id`（一つのplan/adoption）、`expected_subject_hash`、scopeを持つ。
同じ実験の他操作は取り消さない。全体終了なら未確定操作を個別に取り消す。

1. 記録担当が委任・対象hash・scopeを照合する。対象未着ならpending-targetと仮tombstoneを保存する。
2. 一致する対象が後着したらcancelledを確定。違えば取消をrejectedとして仮tombstoneを外す。未解決中は対象を反映しない。権限確認不能はblocked。対象が届くまで取消完了と表示しない。
3. 取消確定とcurrent切替は同じstate台帳で直列化する。取消先着なら旧要求はcancelled、遅延監査結果はstale。基準も進めない。
4. adoption反映が先ならalready-appliedとbundleを返す。巻戻しは新しいadoptionとして扱う。
5. planのchecked後も将来の着手を取り消せる。既に実行した内容は消さず、学習担当が次の作業境界で停止して結果を残す。
6. proposalと監査要求IDの対応から、監査へ新cancel IDと対象audit_request_id、期待hash、scopeを送る。未着は仮tombstone、完了前はcancelled、判定完了後はalready-completedと元結果。記録側の取消は元に戻さない。

取消と監査cancelの送信待ちは同時に永続化し再送する。監査側への到着を待たず記録側のtombstoneで遅延結果を拒否する。
確定済み取消の再送でも過去のcheckedへ戻さない。再試行には新しい操作IDを用いる。

## サイクル終了と周期要求

cycle_idは一回の実験を識別。reflected/rejected/cancelled、終了を決めたinconclusiveが終端。
paused、修正継続中のinconclusiveは終端ではない。終端後の追加実験には新cycle_idと元サイクル参照を付ける。

学習担当は関連する全plan/adoption/withdrawalの確定結果を確認し、終端と未送信cycle_closedを一つの論理更新で保存する。
通知には新operation_id、cycle_id、experiment/plan_revision、outcome、scope、全関連操作IDと確定結果、反映bundleまたはnull、closed_atが必要。
反映後の取消は反映済みの事実も残す。ack未受領なら同じ通知を再送する。

記録担当は関連操作を台帳で照合する。未確定ならpendingで保持し、確定後に再開する。
採用完了後の現行scopeから未監査差分を確認する。不採用・取消でも既存差分を確認する。
通知受領と、periodic要求の永続化または差分なしskip理由を同じstate更新へ入れてからackする。
同subject/scopeの未完了要求があれば対応付け、重複起動しない。保存後すぐ送信し、中断なら再開時に未送信を処理する。
通知ackは「周期処理を保存した」の意味で、監査完了とは区別する。

もう一つの起点は最初の未監査変更から7暦日後の次の作業開始。記録担当が観測時刻とプロジェクトのtimezoneで日付を比較する。
periodicにtrigger=cycle_closed/activity_dueと通知IDまたは期限を付ける。ユーザー指定周期があれば優先する。
早い方の起点で処理し、常駐スケジューラは要求しない。監査中に増えた差分にも期限と通知を保持する。
失敗時は影響scopeの新規採用・試作進行を保留し、currentを自動巻戻ししない。原因解消の候補作成・限定検証は委任内で続けられる。
