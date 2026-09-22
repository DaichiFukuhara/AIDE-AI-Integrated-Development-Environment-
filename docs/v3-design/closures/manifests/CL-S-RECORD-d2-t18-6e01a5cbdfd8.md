---
closure_id: CL-S-RECORD-d2-t18-6e01a5cbdfd8
manifest_digest: 6e01a5cbdfd89ecdf4c9ea2621e0f9991f1f477acd709d8f2f8d54b013ec0625
closure_kind: system
based_on_tree_revision: 18
target:
  id: S-RECORD
  design_revision: 2
  parent_design_revision: 3
goal_chain:
  root_goal: G-V3
  subgoal: SG-MODEL
  approach: A-MODEL
  system: S-RECORD
edges:
- parent: G-V3
  child: SG-MODEL
  relation: all_of
  group: null
  acceptance:
  - G1
  - G2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- parent: SG-MODEL
  child: A-MODEL
  relation: all_of
  group: null
  acceptance:
  - M1
  - M2
  - M3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- parent: A-MODEL
  child: S-RECORD
  relation: all_of
  group: null
  acceptance:
  - AM1
  - AM2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
files:
- path: root/design.md
  node_id: G-V3
  design_revision: 3
  semantic_digest: 8965df0a0a828a4ab3de9cfe53e1320df96bd970f7f030704873e586cb089e15
  snapshot_path: closures/inputs/SI-8965df0a0a828a4ab3de9cfe53e1320df96bd970f7f030704873e586cb089e15.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 3
  semantic_digest: beac8b62e15dee389d4945dd4a2b7ce715a9aa7849a623f54a141063d3eadc20
  snapshot_path: closures/inputs/SI-beac8b62e15dee389d4945dd4a2b7ce715a9aa7849a623f54a141063d3eadc20.md
- path: root/subgoals/sg-model/design.md
  node_id: SG-MODEL
  design_revision: 3
  semantic_digest: 5a6852f67d39372aaeeac5622982c256c9ba6ed40dd6e971d221564d324fa0f5
  snapshot_path: closures/inputs/SI-5a6852f67d39372aaeeac5622982c256c9ba6ed40dd6e971d221564d324fa0f5.md
- path: root/subgoals/sg-model/rationale.md
  node_id: SG-MODEL
  design_revision: 3
  semantic_digest: 1368ac924bc61bb529ee52dfdb15a050f609351faf496375323e14ac71446865
  snapshot_path: closures/inputs/SI-1368ac924bc61bb529ee52dfdb15a050f609351faf496375323e14ac71446865.md
- path: root/subgoals/sg-model/approaches/a-model/design.md
  node_id: A-MODEL
  design_revision: 3
  semantic_digest: 074e6f4f29bccb3c35fd705ee42a3158b7b119663483e41ecbcb44b215a85354
  snapshot_path: closures/inputs/SI-074e6f4f29bccb3c35fd705ee42a3158b7b119663483e41ecbcb44b215a85354.md
- path: root/subgoals/sg-model/approaches/a-model/rationale.md
  node_id: A-MODEL
  design_revision: 3
  semantic_digest: 0d0a954341c9d43bef02cb2b97929bf9fe14dd9eff32bb279660e85e010c9c83
  snapshot_path: closures/inputs/SI-0d0a954341c9d43bef02cb2b97929bf9fe14dd9eff32bb279660e85e010c9c83.md
- path: root/subgoals/sg-model/approaches/a-model/systems/s-record/design.md
  node_id: S-RECORD
  design_revision: 2
  semantic_digest: aee19d19253281b662a274c2ab27f4503dd6a035f8e87d172413e53d8df40cca
  snapshot_path: closures/inputs/SI-aee19d19253281b662a274c2ab27f4503dd6a035f8e87d172413e53d8df40cca.md
- path: root/subgoals/sg-model/approaches/a-model/systems/s-record/rationale.md
  node_id: S-RECORD
  design_revision: 2
  semantic_digest: 0ddea60f973b7070c7943a4fda890f514e25c03808043ca4fca21411c207c3c9
  snapshot_path: closures/inputs/SI-0ddea60f973b7070c7943a4fda890f514e25c03808043ca4fca21411c207c3c9.md
dependencies: []
seams:
- id: S-CONTEXT
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
- id: S-PROPOSAL
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
- id: S-AUDIT-INPUT
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
- id: S-AUDIT-RESULT
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
acceptance_ids:
- SR1
- SR2
- SR3
- SR4
- SR5
future_verification:
  unit_test_id: UT-S-RECORD
  subgoal_integration_id: SIT-SG-MODEL
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations: []
staged_children: []
seam_participants:
- node_id: SG-ASSURE
  canonical_path: root/subgoals/sg-assure/design.md
  semantic_digest: 23272ef84f1717229ef95d93dd9c6ae36436a44be9e912c12ee549299d3a07a3
  snapshot_path: closures/inputs/SI-23272ef84f1717229ef95d93dd9c6ae36436a44be9e912c12ee549299d3a07a3.md
- node_id: SG-LEARN
  canonical_path: root/subgoals/sg-learn/design.md
  semantic_digest: c9972bbfe6141c31704c7b8d4f11c7c480cd80bac9a482b31771a62b6c6f273d
  snapshot_path: closures/inputs/SI-c9972bbfe6141c31704c7b8d4f11c7c480cd80bac9a482b31771a62b6c6f273d.md
- node_id: SG-MODEL
  canonical_path: root/subgoals/sg-model/design.md
  semantic_digest: 95f331c96c749a5666c8ebd38ce0fa43826d7eb0fa77d759de9f816edae56ea6
  snapshot_path: closures/inputs/SI-95f331c96c749a5666c8ebd38ce0fa43826d7eb0fa77d759de9f816edae56ea6.md
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
