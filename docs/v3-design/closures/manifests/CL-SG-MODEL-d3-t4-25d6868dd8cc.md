---
closure_id: CL-SG-MODEL-d3-t4-25d6868dd8cc
manifest_digest: 25d6868dd8cc20a3252f952ae777ef7f54348ccd4c5bce8129aa781235ffafce
closure_kind: authoring
based_on_tree_revision: 4
target:
  id: SG-MODEL
  design_revision: 3
  parent_design_revision: 3
goal_chain:
  root_goal: G-V3
  subgoal: SG-MODEL
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
  design_revision: 1
  semantic_digest: 45d7a19053e9ed62f3949269bd1965698ea264248253356c56b3abf36627d0c8
  snapshot_path: closures/inputs/SI-45d7a19053e9ed62f3949269bd1965698ea264248253356c56b3abf36627d0c8.md
- path: root/subgoals/sg-model/approaches/a-model/rationale.md
  node_id: A-MODEL
  design_revision: 1
  semantic_digest: c52f10067500a1e3142756876ac58356b91212df712eee373da8778039d07748
  snapshot_path: closures/inputs/SI-c52f10067500a1e3142756876ac58356b91212df712eee373da8778039d07748.md
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
- M1
- M2
- M3
future_verification:
  unit_test_id: null
  subgoal_integration_id: SIT-SG-MODEL
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations: []
staged_children:
- parent_id: SG-MODEL
  candidate_ref: SG-MODEL-decomposition-1
  child_ids:
  - A-MODEL
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
