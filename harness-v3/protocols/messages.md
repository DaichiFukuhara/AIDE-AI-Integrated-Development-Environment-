# context間の受渡し

一つのローカル担当が順次実行しても同じ契約を使う。通信サーバーは不要。
要求は[operation](../templates/operation.md)、判定は[audit](../templates/audit.md)、確定順は[state](../templates/state.md)へ保存する。

## 4本のseam

このハーネスの所有者はG-V3。設計のseam revision 3を実現する。利用者の製品のseamとは区別する。

| seam | 提供 → 利用 | 必須の受渡し |
| --- | --- | --- |
| S-CONTEXT | 記録 → 学習 | 要求ID、対象goal/system。応答はbundle、版集合、委任、subject、phase/scope別baseline、未監査差分、進行判定、対応する確定結果。回復中scopeにはadoption向けの有効なrecovery_ref（loss record）・要求すべきreview_mode、対象change_idsと元の失敗監査/open指摘も含む |
| S-PROPOSAL | 学習 → 記録 | operation_id、kind=plan/adoption/withdrawal/cycle_closed、experiment/plan_revision/cycle_id、scope、委任。計画・採用はbase_bundle、対象ID、差分、subject/hash、条件・契約影響。回復adoptionはS-CONTEXTで得たreview_mode/recovery_refをoperationとsubjectへ含める |
| S-AUDIT-INPUT | 記録 → 監査 | operation_id=audit_request_id、origin_operation_id、kind=plan/adoption/periodic/cancel、scope、subject/hash、criteria_version、baseline、累積差分/change_ids、委任、観測時刻、予算口座・実行予約。再監査は前回監査/subject・open指摘・修正差分・波及scope・引継ぎ確認 |
| S-AUDIT-RESULT | 監査 → 記録 | 応答先ID、origin_operation_id、subject_hash、scope、phase、criteria_version、result、証拠、finding、次の処理、基準、期限。cancelはtarget_operation_idも返す |

subjectは[対象契約](subject.md)の定義参照を含む。S-CONTEXTは読み取り専用で、取消後の古いcheckedを進行許可として返さない。
学習役は回復adoptionを作る直前にS-CONTEXTを照会し、返されたrecovery_refとreview_modeを使ってsubject/hashを固定する。記録役はこれを照合し、参照を黙って追加・差替えしない。
回復中scopeへのadoption提案でrecovery_ref/review_modeが欠落・不一致なら、記録役は必要な参照・対象scope/change_ids・再提出条件を示してblockedを返す。学習役は再照会して新subject・新operation_idで提出し直す。元のpayloadは変えない。
plan/withdrawal/cycle_closedはreview_mode=normal・recovery_ref=nullのまま通常規則で扱い、このadoption専用の欠落判定を適用しない。planはplan phaseの基準で判定し、implementationの回復状態は進行判定・保留として返す。計画合格で実装の保留を解除せず、許容された原因解消の候補作成・限定検証だけを進める。
scopeの閉包に必要なloss recordが未準備ならS-CONTEXTは準備待ちと理由を返す。記録役が別の更新で対象全体を覆うloss recordを固定してから再照会する。参照を推測したり、S-CONTEXTの読取りでstateを書き換えたりしない。
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
採用完了後の現行scopeからimplementationの未監査差分を確認し、[記録契約](records.md)の規則で要求scopeを閉じる。不採用・取消でも既存差分を確認する。plan履歴だけなら周期対象にしない。
通知受領と、periodic要求の永続化または差分なしskip理由を同じstate更新へ入れてからackする。
ユーザー指定でcycle_closed_enabled=falseなら、差分を残してtrigger-disabledのskip理由と次の期限を保存してackする。期限到来済みならactivity_dueを同時に処理し、設定によって期限を消さない。
同subject/scopeと同じchange_idsの未完了要求があれば対応付け、重複起動しない。保存後は[予算契約](budgets.md)を確認し、予約できれば送信する。保証不能ならheld-budgetの送信待ちを残し、中断なら再開時に再判定する。
完了済みも、subject_hash・scope・phase・criteria_version・正規化したchange_idsの組で検索する。同じ組の非pass結果があり、そのblocked_scopesが未解除なら新しい周期要求・費用予約を作らず、修正待ちとして失敗要求と指摘を参照する。
作業開始・別サイクル終了は修正待ちを解除しない。通知は失敗要求への対応付けと待機理由を保存してackし、差分・期限・保留を残す。未解決の周期判定を完了扱いにしない。
修正ができたら新subject・新要求を前回監査参照付きで再監査する。対象外の変更だけで同じ失敗対象を新規起動しない。対象版が不変のまま予算・通信だけを回復した場合は、元の保留要求の実行状態を確認して再開する（新規の周期要求を量産しない）。
解消済み非passの履歴も消さず、解除根拠と後続要求を結ぶ。内容不変の再実行の例外は通信・実行基盤の一時障害の回復に限る。回復証拠と理由を同じ要求へ記録し、[予算契約](budgets.md)で新しい物理実行だけを予約する。設計上のmajorが残る対象をこの例外で再起動しない。
通知ackは「周期処理を保存した」の意味で、監査完了とは区別する。
修正待ち・予算待ち・実行中は「実験は終了、サイクル全体は未完了」とする。後続結果の受理・基準/差分更新・条件を満たした保留解除・元通知との対応更新を同じstate更新に入れ、orchestrateが完了を再判定する。
起点喪失の回復だけは[回復契約](records.md)に従い、loss recordを含む新subjectで初回相当のperiodicまたは修正版のadoptionを起動できる。S-AUDIT-INPUT/RESULTはreview_mode=baseline-recovery、recovery_ref、change_idsも一致させる。喪失記録だけで既知の指摘や保留を解除しない。

もう一つの起点は最初の未監査変更から既定7暦日後の次の作業開始。記録担当が観測時刻とstateのperiodic_policy.timezoneで日付を比較する。
periodicにtrigger=cycle_closed/activity_dueと通知IDまたは期限、適用したpolicy_refを付ける。state.periodic_policyにcycle_closed_enabled、after_days、timezone、revision、source_refを保存し、既存のユーザー指定周期があればそれを優先する。
再開では保存した設定を読み、既定値で上書きしない。設定変更時は未監査差分の初回日時を維持して期限を再計算し、旧設定も履歴へ残す。
早い方の起点で処理し、常駐スケジューラは要求しない。監査中に増えた差分にも期限と通知を保持する。
失敗時は影響scopeの新規採用・試作進行を保留し、currentを自動巻戻ししない。原因解消の候補作成・限定検証は委任内で続けられる。

## 初期実装の予算処理

このMarkdown版では一人のローカル実行担当が、学習/記録の役割を順次切り替えて[予算契約](budgets.md)の判断・予約・精算を行う。予算予約は別プロセスからstateへ書き込む新しい通信seamではない。
試行の開始判断は学習役、監査送信・記録作業の開始判断は記録役が担う。どちらも一人の記録役だけがstateへ予約を書き、役割ごとの判断根拠をexecution_idに残す。
外部の実装作業者・独立監査者は予約済みexecution_idと上限内の一実行だけを受け持ち、追加実行やstate更新を独自に始めない。結果・使用量をローカル担当へ戻し、記録役が精算する。
学習と記録を別プロセスへ分離して自律予約する拡張はこの初期実装の対象外。必要なら受渡し契約を別途設計・監査してから行う。
