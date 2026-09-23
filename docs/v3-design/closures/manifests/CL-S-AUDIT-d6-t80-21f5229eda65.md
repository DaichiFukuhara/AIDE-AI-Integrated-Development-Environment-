---
closure_id: CL-S-AUDIT-d6-t80-21f5229eda65
manifest_digest: 21f5229eda65e81572e3c8a561b3e09e7fd710d2f1c9e4a6bede280ba4b292cd
closure_kind: system
based_on_tree_revision: 80
target:
  id: S-AUDIT
  design_revision: 6
  parent_design_revision: 7
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
  design_revision: 7
  semantic_digest: 55f5d10fef18e1c5272eb94760049da07f2d6ef52b75ac145bd901f6ece94323
  snapshot_path: closures/inputs/SI-55f5d10fef18e1c5272eb94760049da07f2d6ef52b75ac145bd901f6ece94323.md
- path: root/subgoals/sg-assure/approaches/a-assure/rationale.md
  node_id: A-ASSURE
  design_revision: 7
  semantic_digest: 3fbc0cea436f60dfa8b3f2a73b0c835f2eb771a40a3ab52497081803074c6e1b
  snapshot_path: closures/inputs/SI-3fbc0cea436f60dfa8b3f2a73b0c835f2eb771a40a3ab52497081803074c6e1b.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/design.md
  node_id: S-AUDIT
  design_revision: 6
  semantic_digest: 10f1541ecb647f30ca836bb9ce63db9af5d1a5fc306374ad324f02e53b5a0730
  snapshot_path: closures/inputs/SI-10f1541ecb647f30ca836bb9ce63db9af5d1a5fc306374ad324f02e53b5a0730.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/rationale.md
  node_id: S-AUDIT
  design_revision: 6
  semantic_digest: ccdee0732a2ed08e27770e028ebda0158b7314b495775921bfa99e6480301fb5
  snapshot_path: closures/inputs/SI-ccdee0732a2ed08e27770e028ebda0158b7314b495775921bfa99e6480301fb5.md
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
