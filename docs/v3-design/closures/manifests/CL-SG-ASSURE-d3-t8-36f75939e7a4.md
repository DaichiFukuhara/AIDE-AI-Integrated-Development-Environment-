---
closure_id: CL-SG-ASSURE-d3-t8-36f75939e7a4
manifest_digest: 36f75939e7a491891967da2af4a357892094a8e866baf2568a9168d6b5fe184a
closure_kind: authoring
based_on_tree_revision: 8
target:
  id: SG-ASSURE
  design_revision: 3
  parent_design_revision: 3
goal_chain:
  root_goal: G-V3
  subgoal: SG-ASSURE
edges:
- parent: G-V3
  child: SG-ASSURE
  relation: all_of
  group: null
  acceptance:
  - G4
  - G5
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
- path: root/subgoals/sg-assure/design.md
  node_id: SG-ASSURE
  design_revision: 3
  semantic_digest: 2e7080e8d5c5eb3f9755bd4a8ca4532324b87d407f2a16ad2503c4d60d2fa618
  snapshot_path: closures/inputs/SI-2e7080e8d5c5eb3f9755bd4a8ca4532324b87d407f2a16ad2503c4d60d2fa618.md
- path: root/subgoals/sg-assure/rationale.md
  node_id: SG-ASSURE
  design_revision: 3
  semantic_digest: da276749252459a7d5cf9d7a03f59d4182380fc2438c9c9d0fccbb2432ceb375
  snapshot_path: closures/inputs/SI-da276749252459a7d5cf9d7a03f59d4182380fc2438c9c9d0fccbb2432ceb375.md
- path: root/subgoals/sg-assure/approaches/a-assure/design.md
  node_id: A-ASSURE
  design_revision: 1
  semantic_digest: 47d416067df5d50c721729090ac1a177a4c913bb2138ebd59e34761498019c4d
  snapshot_path: closures/inputs/SI-47d416067df5d50c721729090ac1a177a4c913bb2138ebd59e34761498019c4d.md
- path: root/subgoals/sg-assure/approaches/a-assure/rationale.md
  node_id: A-ASSURE
  design_revision: 1
  semantic_digest: 7228a0a6f5e8d05e458c8cedfee89900eba671c86b4cf73fcf81d9018db830e7
  snapshot_path: closures/inputs/SI-7228a0a6f5e8d05e458c8cedfee89900eba671c86b4cf73fcf81d9018db830e7.md
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
- Q1
- Q2
- Q3
future_verification:
  unit_test_id: null
  subgoal_integration_id: SIT-SG-ASSURE
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations: []
staged_children:
- parent_id: SG-ASSURE
  candidate_ref: SG-ASSURE-decomposition-1
  child_ids:
  - A-ASSURE
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
