---
closure_id: CL-S-CYCLE-d4-t49-9d46a3ae144b
manifest_digest: 9d46a3ae144b1e8d0d135b3d03d1c92783b34371c6240ecbf50fbacc0872ba0d
closure_kind: system
based_on_tree_revision: 49
target:
  id: S-CYCLE
  design_revision: 4
  parent_design_revision: 5
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
  design_revision: 4
  semantic_digest: 02dac707bde155ddd3fc7b7a294b2649dd6cef118dd94bf7ff5f4bf4278608cd
  snapshot_path: closures/inputs/SI-02dac707bde155ddd3fc7b7a294b2649dd6cef118dd94bf7ff5f4bf4278608cd.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 4
  semantic_digest: b6f84bf78c81aace60249aede5a969dc4e359159bb836993cc200c352dd3f92c
  snapshot_path: closures/inputs/SI-b6f84bf78c81aace60249aede5a969dc4e359159bb836993cc200c352dd3f92c.md
- path: root/subgoals/sg-learn/design.md
  node_id: SG-LEARN
  design_revision: 5
  semantic_digest: a4cc50e710716cb0d103c486658d9878fdc15e643348e8ea9ebcf43efdf99e2e
  snapshot_path: closures/inputs/SI-a4cc50e710716cb0d103c486658d9878fdc15e643348e8ea9ebcf43efdf99e2e.md
- path: root/subgoals/sg-learn/rationale.md
  node_id: SG-LEARN
  design_revision: 5
  semantic_digest: ae4041fe12f7f36df1fd7a38612c4a79de569eab5d8e040baac097ee8c757a18
  snapshot_path: closures/inputs/SI-ae4041fe12f7f36df1fd7a38612c4a79de569eab5d8e040baac097ee8c757a18.md
- path: root/subgoals/sg-learn/approaches/a-learn/design.md
  node_id: A-LEARN
  design_revision: 5
  semantic_digest: cc9b58628bcd49086646f9957243a0ef465cb8eb3a186a4c68fd3e9b8740db8e
  snapshot_path: closures/inputs/SI-cc9b58628bcd49086646f9957243a0ef465cb8eb3a186a4c68fd3e9b8740db8e.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 5
  semantic_digest: b992eadfbdd4994b143cdbd3e77389b71824356a692af3f1e4dcdb7a2a63a9c9
  snapshot_path: closures/inputs/SI-b992eadfbdd4994b143cdbd3e77389b71824356a692af3f1e4dcdb7a2a63a9c9.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/design.md
  node_id: S-CYCLE
  design_revision: 4
  semantic_digest: 85cc84b97d79a1c6f3031af77866ed46b98715cea1b7d4a63a89dd71a3a75afb
  snapshot_path: closures/inputs/SI-85cc84b97d79a1c6f3031af77866ed46b98715cea1b7d4a63a89dd71a3a75afb.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/rationale.md
  node_id: S-CYCLE
  design_revision: 4
  semantic_digest: 7a14d20be98a6fb874866021d32d5230bb327c921444703c353e2ada3df110db
  snapshot_path: closures/inputs/SI-7a14d20be98a6fb874866021d32d5230bb327c921444703c353e2ada3df110db.md
dependencies: []
seams:
- id: S-CONTEXT
  owner: G-V3
  revision: 2
  canonical_path: root/design.md
- id: S-PROPOSAL
  owner: G-V3
  revision: 2
  canonical_path: root/design.md
- id: S-AUDIT-INPUT
  owner: G-V3
  revision: 2
  canonical_path: root/design.md
- id: S-AUDIT-RESULT
  owner: G-V3
  revision: 2
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
  semantic_digest: 6ab799a77d85fcc2e0df321c26d173a5bf34319d4b8765747622289d4d001410
  snapshot_path: closures/inputs/SI-6ab799a77d85fcc2e0df321c26d173a5bf34319d4b8765747622289d4d001410.md
- node_id: SG-LEARN
  canonical_path: root/subgoals/sg-learn/design.md
  semantic_digest: 2dde9040f50a76c16083619f191d527f35ad38f3c21fb2bb83f4b473b00f25a7
  snapshot_path: closures/inputs/SI-2dde9040f50a76c16083619f191d527f35ad38f3c21fb2bb83f4b473b00f25a7.md
- node_id: SG-MODEL
  canonical_path: root/subgoals/sg-model/design.md
  semantic_digest: ed192ee595f19670e06a2bdee05ff6e8d14433fb2575418e06814d35cec034ac
  snapshot_path: closures/inputs/SI-ed192ee595f19670e06a2bdee05ff6e8d14433fb2575418e06814d35cec034ac.md
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
