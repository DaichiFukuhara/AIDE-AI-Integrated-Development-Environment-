---
event_id: EV-ASTRA-20260922-04-PUBLICATION
processing: complete
tree_revision: 80
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
  design_revision: 4
- id: SG-MODEL
  design_revision: 5
- id: A-MODEL
  design_revision: 5
- id: S-RECORD
  design_revision: 4
- id: SG-LEARN
  design_revision: 5
- id: A-LEARN
  design_revision: 5
- id: S-CYCLE
  design_revision: 4
- id: SG-ASSURE
  design_revision: 5
- id: A-ASSURE
  design_revision: 5
- id: S-AUDIT
  design_revision: 4
changed_seams:
- S-CONTEXT
- S-PROPOSAL
- S-AUDIT-INPUT
- S-AUDIT-RESULT
changed_conditions:
- G4
- G6
- SR4
- SC2
- SA2
- SA5
proposed_change: 10ノードの再公開差分の追加影響確認
reason: 元イベントで全継承先を再設計済みか検査
---

# 公開差分の伝播

親版・契約版3・条件割当を全子孫へ照合済み。元イベントの10ノード以外の利用側なし。追加のstale集合は空、旧閉包は履歴として失効を維持。
