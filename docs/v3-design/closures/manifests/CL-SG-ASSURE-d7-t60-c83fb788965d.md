---
closure_id: CL-SG-ASSURE-d7-t60-c83fb788965d
manifest_digest: c83fb788965d77aca9a11a5fb720844f5ce078cd414997625c644eeb63866082
closure_kind: authoring
based_on_tree_revision: 60
target:
  id: SG-ASSURE
  design_revision: 7
  parent_design_revision: 5
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
  design_revision: 5
  semantic_digest: 4e8c9293c163f06e895b7c7212add63b0c716c9598b70e28af2d55d57e9158d2
  snapshot_path: closures/inputs/SI-4e8c9293c163f06e895b7c7212add63b0c716c9598b70e28af2d55d57e9158d2.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 5
  semantic_digest: a5c6f7f7d1c6f1157b5a2bb98efb2f804c91a78981a0fc46972ea962b9c9b298
  snapshot_path: closures/inputs/SI-a5c6f7f7d1c6f1157b5a2bb98efb2f804c91a78981a0fc46972ea962b9c9b298.md
- path: root/subgoals/sg-assure/design.md
  node_id: SG-ASSURE
  design_revision: 7
  semantic_digest: 1586eccd17f3f231176a0fe8ec1ad2dac2604b6fe723ddfa720b99a336c8624b
  snapshot_path: closures/inputs/SI-1586eccd17f3f231176a0fe8ec1ad2dac2604b6fe723ddfa720b99a336c8624b.md
- path: root/subgoals/sg-assure/rationale.md
  node_id: SG-ASSURE
  design_revision: 7
  semantic_digest: 7a9963efc39cf19b2361de1be29288d6569ae72799ad4a388aebe24c29893a96
  snapshot_path: closures/inputs/SI-7a9963efc39cf19b2361de1be29288d6569ae72799ad4a388aebe24c29893a96.md
- path: root/subgoals/sg-assure/approaches/a-assure/design.md
  node_id: A-ASSURE
  design_revision: 6
  semantic_digest: ff9dc2e6613d5b285e2593d5d9c3eb1ff75c21b3e316755c5bfa8a8107ba8364
  snapshot_path: closures/inputs/SI-ff9dc2e6613d5b285e2593d5d9c3eb1ff75c21b3e316755c5bfa8a8107ba8364.md
- path: root/subgoals/sg-assure/approaches/a-assure/rationale.md
  node_id: A-ASSURE
  design_revision: 6
  semantic_digest: 6fa20de09b9fa53f7766c95e6a5cdb24dd3d4d7beb5d1bf76122c58dd2573271
  snapshot_path: closures/inputs/SI-6fa20de09b9fa53f7766c95e6a5cdb24dd3d4d7beb5d1bf76122c58dd2573271.md
dependencies: []
seams:
- id: S-CONTEXT
  owner: G-V3
  revision: 3
  canonical_path: root/design.md
- id: S-PROPOSAL
  owner: G-V3
  revision: 3
  canonical_path: root/design.md
- id: S-AUDIT-INPUT
  owner: G-V3
  revision: 3
  canonical_path: root/design.md
- id: S-AUDIT-RESULT
  owner: G-V3
  revision: 3
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
active_invalidations:
- INV-ASTRA3-A-MODEL
- INV-ASTRA3-S-RECORD
- INV-ASTRA3-A-LEARN
- INV-ASTRA3-S-CYCLE
- INV-ASTRA3-SG-ASSURE
- INV-ASTRA3-A-ASSURE
- INV-ASTRA3-S-AUDIT
staged_children:
- parent_id: SG-ASSURE
  candidate_ref: SG-ASSURE-decomposition-3
  child_ids:
  - A-ASSURE
seam_participants:
- node_id: SG-ASSURE
  canonical_path: root/subgoals/sg-assure/design.md
  semantic_digest: 708853f0abb52f545a656c5e1229561976969fdae9edb7a1610157060b3c9a00
  snapshot_path: closures/inputs/SI-708853f0abb52f545a656c5e1229561976969fdae9edb7a1610157060b3c9a00.md
- node_id: SG-LEARN
  canonical_path: root/subgoals/sg-learn/design.md
  semantic_digest: 9c729a9a0db817901427a5fdd1407ba96631d1d01900610ef0f41ceba0dcd736
  snapshot_path: closures/inputs/SI-9c729a9a0db817901427a5fdd1407ba96631d1d01900610ef0f41ceba0dcd736.md
- node_id: SG-MODEL
  canonical_path: root/subgoals/sg-model/design.md
  semantic_digest: 5715e086385bff5a72bc999daac37a7a6101d03ba811ef9d95f8c64104af07d2
  snapshot_path: closures/inputs/SI-5715e086385bff5a72bc999daac37a7a6101d03ba811ef9d95f8c64104af07d2.md
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
