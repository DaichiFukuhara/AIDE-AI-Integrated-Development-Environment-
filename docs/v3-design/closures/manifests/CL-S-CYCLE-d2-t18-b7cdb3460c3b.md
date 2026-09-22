---
closure_id: CL-S-CYCLE-d2-t18-b7cdb3460c3b
manifest_digest: b7cdb3460c3b89152cff6ca751bdb584a651a136f5e34a4e01efb2b8b20ade9f
closure_kind: system
based_on_tree_revision: 18
target:
  id: S-CYCLE
  design_revision: 2
  parent_design_revision: 3
goal_chain:
  root_goal: G-V3
  subgoal: SG-LEARN
  approach: A-LEARN
  system: S-CYCLE
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
- parent: SG-LEARN
  child: A-LEARN
  relation: all_of
  group: null
  acceptance:
  - L1
  - L2
  - L3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- parent: A-LEARN
  child: S-CYCLE
  relation: all_of
  group: null
  acceptance:
  - AL1
  - AL2
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
  design_revision: 3
  semantic_digest: 5c5f61e66389d5b7c02cf4b09a478548899953c5bba09593810ddfd7df1e6f77
  snapshot_path: closures/inputs/SI-5c5f61e66389d5b7c02cf4b09a478548899953c5bba09593810ddfd7df1e6f77.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 3
  semantic_digest: dc8af2edb42702664905cf5dc8ed776347484fd18dbdce11b62a7de7667db08f
  snapshot_path: closures/inputs/SI-dc8af2edb42702664905cf5dc8ed776347484fd18dbdce11b62a7de7667db08f.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/design.md
  node_id: S-CYCLE
  design_revision: 2
  semantic_digest: 9f9c6b450e440f93ae51febbf149663685d1717937b3f61560c686836532af84
  snapshot_path: closures/inputs/SI-9f9c6b450e440f93ae51febbf149663685d1717937b3f61560c686836532af84.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/rationale.md
  node_id: S-CYCLE
  design_revision: 2
  semantic_digest: 1838e1f12e13f5e2b902104c1d3651d7b1440d11af4d469533b2f38db8506b6e
  snapshot_path: closures/inputs/SI-1838e1f12e13f5e2b902104c1d3651d7b1440d11af4d469533b2f38db8506b6e.md
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
- SC1
- SC2
- SC3
- SC4
- SC5
future_verification:
  unit_test_id: UT-S-CYCLE
  subgoal_integration_id: SIT-SG-LEARN
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
