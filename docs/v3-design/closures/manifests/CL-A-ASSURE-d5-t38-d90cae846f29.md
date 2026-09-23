---
closure_id: CL-A-ASSURE-d5-t38-d90cae846f29
manifest_digest: d90cae846f298c9ca60a1009f335fc81f3d423444d6b3c96f736277ea37af010
closure_kind: authoring
based_on_tree_revision: 38
target:
  id: A-ASSURE
  design_revision: 5
  parent_design_revision: 5
goal_chain:
  root_goal: G-V3
  subgoal: SG-ASSURE
  approach: A-ASSURE
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
- parent: SG-ASSURE
  child: A-ASSURE
  relation: all_of
  group: null
  acceptance:
  - Q1
  - Q2
  - Q3
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
- path: root/subgoals/sg-assure/design.md
  node_id: SG-ASSURE
  design_revision: 5
  semantic_digest: 65f0c9f20af7b546d5853c2e69144475d597b58733519dbc0c310c73f71c343f
  snapshot_path: closures/inputs/SI-65f0c9f20af7b546d5853c2e69144475d597b58733519dbc0c310c73f71c343f.md
- path: root/subgoals/sg-assure/rationale.md
  node_id: SG-ASSURE
  design_revision: 5
  semantic_digest: 53d52fc7158e44c2f7df4f6ba9c68391f88d5030a660ef0bcdfb9e3d7c144ed2
  snapshot_path: closures/inputs/SI-53d52fc7158e44c2f7df4f6ba9c68391f88d5030a660ef0bcdfb9e3d7c144ed2.md
- path: root/subgoals/sg-assure/approaches/a-assure/design.md
  node_id: A-ASSURE
  design_revision: 5
  semantic_digest: 9addcb28218d3d4c244d0f3da0fa8c471ee7a937537e72884bb78769a37875fa
  snapshot_path: closures/inputs/SI-9addcb28218d3d4c244d0f3da0fa8c471ee7a937537e72884bb78769a37875fa.md
- path: root/subgoals/sg-assure/approaches/a-assure/rationale.md
  node_id: A-ASSURE
  design_revision: 5
  semantic_digest: 26adf79ec41667c96f4ac931f0d1b815e2c382692890f080a442ec8884d97554
  snapshot_path: closures/inputs/SI-26adf79ec41667c96f4ac931f0d1b815e2c382692890f080a442ec8884d97554.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/design.md
  node_id: S-AUDIT
  design_revision: 3
  semantic_digest: 12d76a11670d50ead29a3d1dc0adce7246d2b3dbe6a8ddb2cc3bd723d1e64699
  snapshot_path: closures/inputs/SI-12d76a11670d50ead29a3d1dc0adce7246d2b3dbe6a8ddb2cc3bd723d1e64699.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/rationale.md
  node_id: S-AUDIT
  design_revision: 3
  semantic_digest: 6451a2bb6992073c7a1d087c3b955b1d5d96db4f9056d1e0ab03fe9b7124feda
  snapshot_path: closures/inputs/SI-6451a2bb6992073c7a1d087c3b955b1d5d96db4f9056d1e0ab03fe9b7124feda.md
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
- AQ1
- AQ2
future_verification:
  unit_test_id: null
  subgoal_integration_id: SIT-SG-ASSURE
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations:
- INV-ASTRA-S-RECORD
- INV-ASTRA-S-CYCLE
- INV-ASTRA-A-ASSURE
- INV-ASTRA-S-AUDIT
staged_children:
- parent_id: A-ASSURE
  candidate_ref: A-ASSURE-decomposition-2
  child_ids:
  - S-AUDIT
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
