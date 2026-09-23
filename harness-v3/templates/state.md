---
project_id: <id>
revision: 1
timezone: Asia/Tokyo
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
observed_at: <ISO-8601>
---

# 現在の状態

<採用済みの動作、候補、未確認、今回判断することを短く説明する>

## 台帳の項目

- operations[ID]: payload_hash、kind、subject_hash、scope、state、result、bundle、audit_request_id/origin_operation_id。
- tombstones[対象ID]: 取消要求ID、期待hash、scope、provisional/confirmed。確定取消を再送で解除しない。
- outbox: message_id、kind、payloadの不変参照、target、pending/acknowledged、対応する要求ID。再送でIDを変えない。
- received_notifications[ID]: payload_hash、cycle_id、periodic_request_idまたはskip_reason、ack状態。
- audit_baselines: scope、phase、subject_hash、subject_ref、audit_request_id、result_ref、criteria_version、accepted_at。
- unaudited_changes: scope、phase、baseline_ref、first_changed_at、operation_id、旧新版・定義差分、理由・証拠。
- blocked_scopes: scope、原因、修正担当、解除条件、許容される限定検証。

## 次の作業

<担当、対象ID、基準版、終了条件。未送信・未処理を隠さない>

current切替・操作確定・基準・差分・送信待ちはこの一組の原子的更新で保存する。
