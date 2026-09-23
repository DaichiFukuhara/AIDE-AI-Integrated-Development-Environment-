---
closure_id: CL-A-LEARN-d5-t35-79fa252445ec
manifest_digest: 79fa252445ec8839ad070c92ce7432c8bf00d8ced8e42a5ac815302a1634d9c6
closure_kind: authoring
based_on_tree_revision: 35
target:
  id: A-LEARN
  design_revision: 5
  parent_design_revision: 5
goal_chain:
  root_goal: G-V3
  subgoal: SG-LEARN
  approach: A-LEARN
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
  design_revision: 3
  semantic_digest: 69a4c8cf7b1fd17f9580f3c906076fa4941b353a27c0f819db26ae8614a41ac6
  snapshot_path: closures/inputs/SI-69a4c8cf7b1fd17f9580f3c906076fa4941b353a27c0f819db26ae8614a41ac6.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/rationale.md
  node_id: S-CYCLE
  design_revision: 3
  semantic_digest: 832b850dc4f05c512825d05c2d2c4411bd77ba2b26930c9c6f2989b32584b833
  snapshot_path: closures/inputs/SI-832b850dc4f05c512825d05c2d2c4411bd77ba2b26930c9c6f2989b32584b833.md
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
- AL1
- AL2
future_verification:
  unit_test_id: null
  subgoal_integration_id: SIT-SG-LEARN
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations:
- INV-ASTRA-S-RECORD
- INV-ASTRA-A-LEARN
- INV-ASTRA-S-CYCLE
- INV-ASTRA-A-ASSURE
- INV-ASTRA-S-AUDIT
staged_children:
- parent_id: A-LEARN
  candidate_ref: A-LEARN-decomposition-2
  child_ids:
  - S-CYCLE
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
