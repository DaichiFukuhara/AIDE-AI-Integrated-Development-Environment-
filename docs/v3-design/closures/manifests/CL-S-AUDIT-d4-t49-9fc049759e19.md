---
closure_id: CL-S-AUDIT-d4-t49-9fc049759e19
manifest_digest: 9fc049759e196b918af6c67779808e33ee81a0a8f64144253c235fb2841913a3
closure_kind: system
based_on_tree_revision: 49
target:
  id: S-AUDIT
  design_revision: 4
  parent_design_revision: 5
goal_chain:
  root_goal: G-V3
  subgoal: SG-ASSURE
  approach: A-ASSURE
  system: S-AUDIT
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
- parent: A-ASSURE
  child: S-AUDIT
  relation: all_of
  group: null
  acceptance:
  - AQ1
  - AQ2
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
  design_revision: 4
  semantic_digest: 45b5d0e158f03d26e47bb7bbc1640185453c5989e9c373ba3303020e74d40bd5
  snapshot_path: closures/inputs/SI-45b5d0e158f03d26e47bb7bbc1640185453c5989e9c373ba3303020e74d40bd5.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/rationale.md
  node_id: S-AUDIT
  design_revision: 4
  semantic_digest: 62deb641d31b6d9c863f11472fa8823a1ea6f8a005a0693b33966d6e6a6ea40f
  snapshot_path: closures/inputs/SI-62deb641d31b6d9c863f11472fa8823a1ea6f8a005a0693b33966d6e6a6ea40f.md
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
- SA1
- SA2
- SA3
- SA4
- SA5
future_verification:
  unit_test_id: UT-S-AUDIT
  subgoal_integration_id: SIT-SG-ASSURE
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
