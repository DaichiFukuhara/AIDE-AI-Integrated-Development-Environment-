---
closure_id: CL-SG-MODEL-d5-t23-dca8e5ace808
manifest_digest: dca8e5ace808434ea94abdb76ab9e8ce517938f55028c1efc1c85b2e0ec557c1
closure_kind: authoring
based_on_tree_revision: 23
target:
  id: SG-MODEL
  design_revision: 5
  parent_design_revision: 4
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
  design_revision: 4
  semantic_digest: 02dac707bde155ddd3fc7b7a294b2649dd6cef118dd94bf7ff5f4bf4278608cd
  snapshot_path: closures/inputs/SI-02dac707bde155ddd3fc7b7a294b2649dd6cef118dd94bf7ff5f4bf4278608cd.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 4
  semantic_digest: b6f84bf78c81aace60249aede5a969dc4e359159bb836993cc200c352dd3f92c
  snapshot_path: closures/inputs/SI-b6f84bf78c81aace60249aede5a969dc4e359159bb836993cc200c352dd3f92c.md
- path: root/subgoals/sg-model/design.md
  node_id: SG-MODEL
  design_revision: 5
  semantic_digest: 6902bcb5f2c4bffb85f8811edbb7a19e5ad96807566dd22488b8e7ce5d0febf3
  snapshot_path: closures/inputs/SI-6902bcb5f2c4bffb85f8811edbb7a19e5ad96807566dd22488b8e7ce5d0febf3.md
- path: root/subgoals/sg-model/rationale.md
  node_id: SG-MODEL
  design_revision: 5
  semantic_digest: 54fcd157afc7fabe1b435b015b9fef2b70f8d68a28209a17814d66167ea31fa2
  snapshot_path: closures/inputs/SI-54fcd157afc7fabe1b435b015b9fef2b70f8d68a28209a17814d66167ea31fa2.md
- path: root/subgoals/sg-model/approaches/a-model/design.md
  node_id: A-MODEL
  design_revision: 4
  semantic_digest: 4c93e23c8c9a918615b0961dfbaaa806ec64eea8c490efd167ad33affd4e9087
  snapshot_path: closures/inputs/SI-4c93e23c8c9a918615b0961dfbaaa806ec64eea8c490efd167ad33affd4e9087.md
- path: root/subgoals/sg-model/approaches/a-model/rationale.md
  node_id: A-MODEL
  design_revision: 4
  semantic_digest: 1466928b6716f1ec969584ae03cb68910896ca802e4476e7ac5ada8a80b86319
  snapshot_path: closures/inputs/SI-1466928b6716f1ec969584ae03cb68910896ca802e4476e7ac5ada8a80b86319.md
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
active_invalidations:
- INV-ASTRA-SG-MODEL
- INV-ASTRA-A-MODEL
- INV-ASTRA-S-RECORD
- INV-ASTRA-SG-LEARN
- INV-ASTRA-A-LEARN
- INV-ASTRA-S-CYCLE
- INV-ASTRA-SG-ASSURE
- INV-ASTRA-A-ASSURE
- INV-ASTRA-S-AUDIT
staged_children:
- parent_id: SG-MODEL
  candidate_ref: SG-MODEL-decomposition-2
  child_ids:
  - A-MODEL
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
