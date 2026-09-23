---
event_id: EV-ASTRA-20260922-02-PUBLICATION
processing: complete
tree_revision: 49
source: node-publication
target_nodes:
- G-V3
- SG-MODEL
- A-MODEL
- S-RECORD
- SG-LEARN
- A-LEARN
- S-CYCLE
- SG-ASSURE
- A-ASSURE
- S-AUDIT
before:
- id: G-V3
  design_revision: 3
- id: SG-MODEL
  design_revision: 3
- id: A-MODEL
  design_revision: 3
- id: S-RECORD
  design_revision: 2
- id: SG-LEARN
  design_revision: 3
- id: A-LEARN
  design_revision: 3
- id: S-CYCLE
  design_revision: 2
- id: SG-ASSURE
  design_revision: 3
- id: A-ASSURE
  design_revision: 3
- id: S-AUDIT
  design_revision: 2
changed_seams:
- S-CONTEXT
- S-PROPOSAL
- S-AUDIT-INPUT
- S-AUDIT-RESULT
changed_conditions:
- G4
- G6
- Q1
- SR3
- SR4
- SR5
- SC4
- SA1
- SA2
- SA5
proposed_change: 10ノードの再公開差分の追加影響確認
reason: 元イベントで全継承先を再設計済みか検査
---

# 公開差分の伝播

親版・契約版2・条件割当を全子孫へ照合済み。元イベントの10ノード以外の利用側なし。追加のstale集合は空、旧閉包は履歴として失効を維持。
