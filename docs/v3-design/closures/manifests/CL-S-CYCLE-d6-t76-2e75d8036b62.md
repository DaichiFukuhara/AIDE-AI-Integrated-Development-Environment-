---
closure_id: CL-S-CYCLE-d6-t76-2e75d8036b62
manifest_digest: 2e75d8036b62c9841d01e50e5d0a9f7a6e72b321f7dbeec568b291b6022a37d2
closure_kind: system
based_on_tree_revision: 76
target:
  id: S-CYCLE
  design_revision: 6
  parent_design_revision: 7
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
  design_revision: 5
  semantic_digest: 4e8c9293c163f06e895b7c7212add63b0c716c9598b70e28af2d55d57e9158d2
  snapshot_path: closures/inputs/SI-4e8c9293c163f06e895b7c7212add63b0c716c9598b70e28af2d55d57e9158d2.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 5
  semantic_digest: a5c6f7f7d1c6f1157b5a2bb98efb2f804c91a78981a0fc46972ea962b9c9b298
  snapshot_path: closures/inputs/SI-a5c6f7f7d1c6f1157b5a2bb98efb2f804c91a78981a0fc46972ea962b9c9b298.md
- path: root/subgoals/sg-learn/design.md
  node_id: SG-LEARN
  design_revision: 7
  semantic_digest: 56dde9e45fdfac81970f934f478e57279dccb41a07ff8b3ad86bc2811d9cff18
  snapshot_path: closures/inputs/SI-56dde9e45fdfac81970f934f478e57279dccb41a07ff8b3ad86bc2811d9cff18.md
- path: root/subgoals/sg-learn/rationale.md
  node_id: SG-LEARN
  design_revision: 7
  semantic_digest: 3bc8b1bb5f1578bf5da72f11b950b2e81b5a44803a72a0a3c11549bf741f1857
  snapshot_path: closures/inputs/SI-3bc8b1bb5f1578bf5da72f11b950b2e81b5a44803a72a0a3c11549bf741f1857.md
- path: root/subgoals/sg-learn/approaches/a-learn/design.md
  node_id: A-LEARN
  design_revision: 7
  semantic_digest: 7c67db79b27360c21e5454e5a817e9493baf66932c6a58ddeda62466c5e69f73
  snapshot_path: closures/inputs/SI-7c67db79b27360c21e5454e5a817e9493baf66932c6a58ddeda62466c5e69f73.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 7
  semantic_digest: 8732646a5d1dec153c633d6e661975476b1cc5114b08bcc903a787e9d19b382c
  snapshot_path: closures/inputs/SI-8732646a5d1dec153c633d6e661975476b1cc5114b08bcc903a787e9d19b382c.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/design.md
  node_id: S-CYCLE
  design_revision: 6
  semantic_digest: 99e9d3251c9d67be05d948a9b025b30f603ff945e3b8e9312ccf53c71bddb222
  snapshot_path: closures/inputs/SI-99e9d3251c9d67be05d948a9b025b30f603ff945e3b8e9312ccf53c71bddb222.md
- path: root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/rationale.md
  node_id: S-CYCLE
  design_revision: 6
  semantic_digest: ab170ed529ed9f6543050150d1f162303bee2c1b294995b7726f72b4f9e66ffd
  snapshot_path: closures/inputs/SI-ab170ed529ed9f6543050150d1f162303bee2c1b294995b7726f72b4f9e66ffd.md
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
active_invalidations:
- INV-ASTRA3-S-CYCLE
- INV-ASTRA3-S-AUDIT
staged_children: []
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
