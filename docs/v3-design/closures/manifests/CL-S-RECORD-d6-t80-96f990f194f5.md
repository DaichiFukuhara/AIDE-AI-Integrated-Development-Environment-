---
closure_id: CL-S-RECORD-d6-t80-96f990f194f5
manifest_digest: 96f990f194f55ea3b2296d143c8e4696a9179925e97b3b994e5ee3745fce9402
closure_kind: system
based_on_tree_revision: 80
target:
  id: S-RECORD
  design_revision: 6
  parent_design_revision: 7
goal_chain:
  root_goal: G-V3
  subgoal: SG-MODEL
  approach: A-MODEL
  system: S-RECORD
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
- parent: SG-MODEL
  child: A-MODEL
  relation: all_of
  group: null
  acceptance:
  - M1
  - M2
  - M3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- parent: A-MODEL
  child: S-RECORD
  relation: all_of
  group: null
  acceptance:
  - AM1
  - AM2
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
- path: root/subgoals/sg-model/design.md
  node_id: SG-MODEL
  design_revision: 7
  semantic_digest: 35f9f76ef30568e96e6af42935080f5779d2679a6da3b8cf5c66d16935a53a56
  snapshot_path: closures/inputs/SI-35f9f76ef30568e96e6af42935080f5779d2679a6da3b8cf5c66d16935a53a56.md
- path: root/subgoals/sg-model/rationale.md
  node_id: SG-MODEL
  design_revision: 7
  semantic_digest: 4fe99ce3b245a91da184388f95936935dd81d296dc34f3fccf0bdbee8da9047f
  snapshot_path: closures/inputs/SI-4fe99ce3b245a91da184388f95936935dd81d296dc34f3fccf0bdbee8da9047f.md
- path: root/subgoals/sg-model/approaches/a-model/design.md
  node_id: A-MODEL
  design_revision: 7
  semantic_digest: 32b79069d7d58cbcc63a064610421638917ce829182d7656f64c6c942c1bf8fd
  snapshot_path: closures/inputs/SI-32b79069d7d58cbcc63a064610421638917ce829182d7656f64c6c942c1bf8fd.md
- path: root/subgoals/sg-model/approaches/a-model/rationale.md
  node_id: A-MODEL
  design_revision: 7
  semantic_digest: 8b1a7fcf1eaa021127327eddaf17629762bc8b1356f27165036c8f736b057701
  snapshot_path: closures/inputs/SI-8b1a7fcf1eaa021127327eddaf17629762bc8b1356f27165036c8f736b057701.md
- path: root/subgoals/sg-model/approaches/a-model/systems/s-record/design.md
  node_id: S-RECORD
  design_revision: 6
  semantic_digest: 91adc318259107bf695b376bcb280d7c539b01c58240baf0e3ce2a8f07be1a31
  snapshot_path: closures/inputs/SI-91adc318259107bf695b376bcb280d7c539b01c58240baf0e3ce2a8f07be1a31.md
- path: root/subgoals/sg-model/approaches/a-model/systems/s-record/rationale.md
  node_id: S-RECORD
  design_revision: 6
  semantic_digest: 5ba580c42ab24578c6fba9db61a58aa211e79e752db1758e65616711141bec64
  snapshot_path: closures/inputs/SI-5ba580c42ab24578c6fba9db61a58aa211e79e752db1758e65616711141bec64.md
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
- SR1
- SR2
- SR3
- SR4
- SR5
future_verification:
  unit_test_id: UT-S-RECORD
  subgoal_integration_id: SIT-SG-MODEL
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
