---
invalidation_id: INV-ASTRA3-S-CYCLE
source_event: EV-ASTRA-20260922-03
based_on_tree_revision: 49
stale_nodes:
- id: S-CYCLE
  design_revision: 4
invalid_closures:
- CL-S-RECORD-d4-t49-c65a3a86187d
- CL-S-CYCLE-d4-t49-9d46a3ae144b
- CL-S-AUDIT-d4-t49-9fc049759e19
next_action: stale → draft。親公開後に再設計・再検査。
status: resolved
replacement_design_revision: 6
replacement_authoring_closure: CL-S-CYCLE-d6-t75-ccbe66730615
---

# 意味版を指定した失効

この失効は列挙した旧意味版と、それを参照する閉包を覆う。再設計した新意味版の入力は別閉包で検査する。旧版は再有効化しない。


新意味版の公開で再設計作業を解消。旧閉包の失効は維持する。
