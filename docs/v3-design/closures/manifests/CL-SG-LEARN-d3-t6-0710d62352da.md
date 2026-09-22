---
closure_id: CL-SG-LEARN-d3-t6-0710d62352da
manifest_digest: 0710d62352daec59eabda26f43632d5a5300a3596be10bc25731680d46761c07
closure_kind: authoring
based_on_tree_revision: 6
target:
  id: SG-LEARN
  design_revision: 3
  parent_design_revision: 3
goal_chain:
  root_goal: G-V3
  subgoal: SG-LEARN
edges:
- parent: G-V3
  child: SG-LEARN
  relation: all_of
  group: null
  acceptance:
  - G3
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
- path: root/subgoals/sg-learn/design.md
  node_id: SG-LEARN
  design_revision: 3
  semantic_digest: 8f941c9de750bbb7a95ec138aefdab5cb82fffec16a20b0a486262ec20da1c9d
  snapshot_path: closures/inputs/SI-8f941c9de750bbb7a95ec138aefdab5cb82fffec16a20b0a486262ec20da1c9d.md
- path: root/subgoals/sg-learn/rationale.md
  node_id: SG-LEARN
  design_revision: 3
  semantic_digest: e768e0cb505d1c3f430c80a2b017e5dacf7844dd76a8910b5e060b380a69c475
  snapshot_path: closures/inputs/SI-e768e0cb505d1c3f430c80a2b017e5dacf7844dd76a8910b5e060b380a69c475.md
- path: root/subgoals/sg-learn/approaches/a-learn/design.md
  node_id: A-LEARN
  design_revision: 1
  semantic_digest: 6f864fe094dcd1510b6a966b5b8a6cefefc14463bc973cfdddcd79a7ffe5cfbd
  snapshot_path: closures/inputs/SI-6f864fe094dcd1510b6a966b5b8a6cefefc14463bc973cfdddcd79a7ffe5cfbd.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 1
  semantic_digest: e51299cadb2660c4acbbd251e449c4c5d2e7b635bda3f80d4d8122eb676f9611
  snapshot_path: closures/inputs/SI-e51299cadb2660c4acbbd251e449c4c5d2e7b635bda3f80d4d8122eb676f9611.md
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
- L1
- L2
- L3
future_verification:
  unit_test_id: null
  subgoal_integration_id: SIT-SG-LEARN
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations: []
staged_children:
- parent_id: SG-LEARN
  candidate_ref: SG-LEARN-decomposition-1
  child_ids:
  - A-LEARN
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
