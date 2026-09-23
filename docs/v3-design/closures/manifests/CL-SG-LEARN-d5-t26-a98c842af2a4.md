---
closure_id: CL-SG-LEARN-d5-t26-a98c842af2a4
manifest_digest: a98c842af2a42b3af1c99ce7f0c0a23bb5c103b1bdba83c3c55747794ef17f7f
closure_kind: authoring
based_on_tree_revision: 26
target:
  id: SG-LEARN
  design_revision: 5
  parent_design_revision: 4
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
  design_revision: 4
  semantic_digest: 1b060eb91aaa23b0511dabd23c7a69491c378c44d48d3de81c5bff3b264bfc62
  snapshot_path: closures/inputs/SI-1b060eb91aaa23b0511dabd23c7a69491c378c44d48d3de81c5bff3b264bfc62.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 4
  semantic_digest: 38c073777200e159167e149cf203d15f3be61474e18f53a7a6023d79861d68e4
  snapshot_path: closures/inputs/SI-38c073777200e159167e149cf203d15f3be61474e18f53a7a6023d79861d68e4.md
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
active_invalidations:
- INV-ASTRA-A-MODEL
- INV-ASTRA-S-RECORD
- INV-ASTRA-SG-LEARN
- INV-ASTRA-A-LEARN
- INV-ASTRA-S-CYCLE
- INV-ASTRA-SG-ASSURE
- INV-ASTRA-A-ASSURE
- INV-ASTRA-S-AUDIT
staged_children:
- parent_id: SG-LEARN
  candidate_ref: SG-LEARN-decomposition-2
  child_ids:
  - A-LEARN
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
