---
invalidation_id: INV-ASTRA-S-RECORD
source_event: EV-ASTRA-20260922-01
based_on_tree_revision: 18
stale_nodes:
- id: S-RECORD
  design_revision: 2
invalid_closures:
- CL-S-RECORD-d2-t18-6e01a5cbdfd8
- CL-S-CYCLE-d2-t18-b7cdb3460c3b
- CL-S-AUDIT-d2-t18-c95c7c0db2f3
next_action: stale → draft。親公開後に再設計・再検査。
status: resolved
replacement_design_revision: 4
replacement_authoring_closure: CL-S-RECORD-d4-t41-f26915a13939
---

# 意味版を指定した失効

この失効は列挙した旧意味版と、それを参照する閉包を覆う。再設計した新意味版の入力は別閉包で検査する。旧版は再有効化しない。


新意味版の公開で再設計作業を解消。旧閉包の失効は維持する。
