---
closure_id: CL-SG-LEARN-d7-t57-a2b0bb2db666
manifest_digest: a2b0bb2db666b9c00203f7e65f713acfd01d4e8adf969136365cc54887a0b2b8
closure_kind: authoring
based_on_tree_revision: 57
target:
  id: SG-LEARN
  design_revision: 7
  parent_design_revision: 5
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
  design_revision: 6
  semantic_digest: ffc15568635820f87e35e4e71b7ef9a1ba833bda9e41eb08e7f71d68ef108fee
  snapshot_path: closures/inputs/SI-ffc15568635820f87e35e4e71b7ef9a1ba833bda9e41eb08e7f71d68ef108fee.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 6
  semantic_digest: bdc0ebcdbc541643826405156988147a71c4268e02f4398940b290896027e2cd
  snapshot_path: closures/inputs/SI-bdc0ebcdbc541643826405156988147a71c4268e02f4398940b290896027e2cd.md
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
- INV-ASTRA3-A-MODEL
- INV-ASTRA3-S-RECORD
- INV-ASTRA3-SG-LEARN
- INV-ASTRA3-A-LEARN
- INV-ASTRA3-S-CYCLE
- INV-ASTRA3-SG-ASSURE
- INV-ASTRA3-A-ASSURE
- INV-ASTRA3-S-AUDIT
staged_children:
- parent_id: SG-LEARN
  candidate_ref: SG-LEARN-decomposition-3
  child_ids:
  - A-LEARN
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
