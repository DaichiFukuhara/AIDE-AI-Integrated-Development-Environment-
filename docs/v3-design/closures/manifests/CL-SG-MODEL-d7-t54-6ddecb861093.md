---
closure_id: CL-SG-MODEL-d7-t54-6ddecb861093
manifest_digest: 6ddecb861093b5fff5aba19b421475d2251eb7f39a4a2f9ae7db944362552270
closure_kind: authoring
based_on_tree_revision: 54
target:
  id: SG-MODEL
  design_revision: 7
  parent_design_revision: 5
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
  design_revision: 6
  semantic_digest: a6f06aef2a5c06181543578d2a9ac02589515c5cb49d26857a4bcf5bfea2910c
  snapshot_path: closures/inputs/SI-a6f06aef2a5c06181543578d2a9ac02589515c5cb49d26857a4bcf5bfea2910c.md
- path: root/subgoals/sg-model/approaches/a-model/rationale.md
  node_id: A-MODEL
  design_revision: 6
  semantic_digest: fd2898335e8af95138a21105d21a2356f1e2a405906771627f9a5ae362eb9a01
  snapshot_path: closures/inputs/SI-fd2898335e8af95138a21105d21a2356f1e2a405906771627f9a5ae362eb9a01.md
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
- INV-ASTRA3-SG-MODEL
- INV-ASTRA3-A-MODEL
- INV-ASTRA3-S-RECORD
- INV-ASTRA3-SG-LEARN
- INV-ASTRA3-A-LEARN
- INV-ASTRA3-S-CYCLE
- INV-ASTRA3-SG-ASSURE
- INV-ASTRA3-A-ASSURE
- INV-ASTRA3-S-AUDIT
staged_children:
- parent_id: SG-MODEL
  candidate_ref: SG-MODEL-decomposition-3
  child_ids:
  - A-MODEL
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
