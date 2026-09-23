---
audit_id: <id>
audit_request_id: <request-id>
origin_operation_id: <proposal-or-trigger-id>
target_operation_id: null
kind: <plan|adoption|periodic|cancel>
scope: []
phase: <plan|implementation>
subject_hash: <hash>
subject_ref: <immutable-ref>
baseline_ref: null
cumulative_diff_ref: <immutable-ref-or-initial>
criteria_version: 1
reviewer: <identity-session-model>
independence: <independent|self-check>
self_check_delegation_ref: null
observed_at: <ISO-8601>
result: <daily-pass|require-review|audit-pass|blocked|stale|cancelled|pending-target|already-completed|rejected>
finding_ids: []
unverified: []
next_due: null
---

# <今回の判定と保証する範囲>

## 読んだ対象と限界

<固定入力、読めなかったもの、自己点検か独立監査か、実行方法>

## 基準と根拠

| criterion | 適用と証拠 | 判定・理由付きN/A |
| --- | --- | --- |
| <DDD-01〜05 / AIDE-01〜03> | <不変の対象・結果参照> | <結果> |

## 指摘

<id、criterion、対象版・場所、観測/反例、影響、severity、解消条件、owner、open/closed>

## 次の処理

<受理担当、保留scope、必要な修正。監査結果自体はcurrentを切り替えない>
