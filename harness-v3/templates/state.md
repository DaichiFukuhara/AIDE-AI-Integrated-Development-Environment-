---
project_id: <id>
revision: 1
timezone: Asia/Tokyo
periodic_policy:
  revision: 1
  cycle_closed_enabled: true
  after_days: 7
  timezone: Asia/Tokyo
  source_ref: <existing-user-instruction-or-default-rule-ref>
writer: <single-record-owner>
current_bundle: null
audit_baselines: []
unaudited_changes: []
operations: {}
tombstones: {}
outbox: []
received_notifications: {}
pending_changes: []
blocked_scopes: []
budget_accounts: {}
execution_reservations: {}
observed_at: <ISO-8601>
---

# 現在の状態

<採用済みの動作、候補、未確認、今回判断することを短く説明する>

## 台帳の項目

- operations[ID]: payload_hash、kind、subject_hash、scope、state、result、bundle、audit_request_id/origin_operation_id。
- tombstones[対象ID]: 取消要求ID、期待hash、scope、provisional/confirmed。確定取消を再送で解除しない。
- outbox: message_id、kind、payloadの不変参照、target、pending/held-budget/in-flight/acknowledged、対応する要求ID、account_refs、execution_id、保留理由・再開条件。再送でIDを変えない。
- received_notifications[ID]: payload_hash、cycle_id、periodic_request_idまたはskip_reason、ack状態。修正待ちなら失敗要求ID、未解除理由、待機状態を持つ。新規要求を作らない対応付けも保存する。
- audit_baselines: scope_id、phase、criteria_versionを検索キーとし、保証元のscope/subject_hash/subject_ref、定義・依拠先/共同条件の参照、audit_request_id、result_ref、accepted_atを保存する。集合合格は全要素へ索引を作る。
- unaudited_changes: change_id、affected_scope、phase=implementation、baseline_refs、first_changed_at、operation_id、旧新版・定義差分、共同条件と分割不能理由（該当時）、理由・証拠。currentを変えないplanは含めない。
- blocked_scopes: scope、原因、修正担当、解除条件、許容される限定検証、失敗audit_request_id、subject_hash/phase/criteria_version/change_ids、解除根拠と後続要求。修正待ちの同対象は周期起動し直さない。
- periodic_policy: revision、cycle_closed_enabled、after_days、timezone、source_ref。期限はこの設定と残差分の最古日時から計算する。timezoneとprojectのtimezoneは一致させる。
- budget_accounts[account_id]: owner、delegation_ref、scope/activity条件、parent_account_refs、limits。limits[limit_id]にunit、limit、対象activity、cumulative_used、cumulative_upper_bound、bound_evidence_refを持つ。上限なしは委任根拠付きnull。
- execution_reservations[execution_id]: operation/audit_request ID、activity、scope、account_refs、各account/limit_idの予約上限と根拠、判定時刻、reserved/in-flight/settled/held、実績/不明量、証拠、精算記録。未決予約は使用量とは別に合算する。

## 次の作業

<担当、対象ID、基準版、終了条件。未送信・未処理を隠さない>

current切替・操作確定・基準・差分・送信待ちはこの一組の原子的更新で保存する。
