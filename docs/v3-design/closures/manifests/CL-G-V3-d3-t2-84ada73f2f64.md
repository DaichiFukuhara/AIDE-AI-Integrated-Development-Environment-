---
closure_id: CL-G-V3-d3-t2-84ada73f2f64
manifest_digest: 84ada73f2f645bec526687152a08388f168887780ed43434f1f62e3a47c90c98
closure_kind: authoring
based_on_tree_revision: 2
target:
  id: G-V3
  design_revision: 3
  parent_design_revision: null
goal_chain:
  root_goal: G-V3
edges: []
files:
- path: root/design.md
  node_id: G-V3
  design_revision: 3
  semantic_digest: 8965df0a0a828a4ab3de9cfe53e1320df96bd970f7f030704873e586cb089e15
  snapshot_path: closures/inputs/SI-8965df0a0a828a4ab3de9cfe53e1320df96bd970f7f030704873e586cb089e15.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 3
  semantic_digest: beac8b62e15dee389d4945dd4a2b7ce715a9aa7849a623f54a141063d3eadc20
  snapshot_path: closures/inputs/SI-beac8b62e15dee389d4945dd4a2b7ce715a9aa7849a623f54a141063d3eadc20.md
- path: root/subgoals/sg-model/design.md
  node_id: SG-MODEL
  design_revision: 1
  semantic_digest: 15ea7073aba45d99ce7bdb52c9e8c51ef4bc0a6ae3a850e56bb3697f725a111e
  snapshot_path: closures/inputs/SI-15ea7073aba45d99ce7bdb52c9e8c51ef4bc0a6ae3a850e56bb3697f725a111e.md
- path: root/subgoals/sg-model/rationale.md
  node_id: SG-MODEL
  design_revision: 1
  semantic_digest: 6976e748c6ad243d38cdf066ff3238f60a1e4618d11f3f6a2203346a9e281016
  snapshot_path: closures/inputs/SI-6976e748c6ad243d38cdf066ff3238f60a1e4618d11f3f6a2203346a9e281016.md
- path: root/subgoals/sg-learn/design.md
  node_id: SG-LEARN
  design_revision: 1
  semantic_digest: 9329b098d0a27ecaf35915293b445f310a9d84fd41786d5682c01c1847a36fe2
  snapshot_path: closures/inputs/SI-9329b098d0a27ecaf35915293b445f310a9d84fd41786d5682c01c1847a36fe2.md
- path: root/subgoals/sg-learn/rationale.md
  node_id: SG-LEARN
  design_revision: 1
  semantic_digest: 446538237a89ff6a98932c6ee861569f6863be06e06a68deb27ee0c3941b485c
  snapshot_path: closures/inputs/SI-446538237a89ff6a98932c6ee861569f6863be06e06a68deb27ee0c3941b485c.md
- path: root/subgoals/sg-assure/design.md
  node_id: SG-ASSURE
  design_revision: 1
  semantic_digest: 1788417ff75137bc0b684eeaa5921bb3046a96c231038e10806c45fa905c4a1a
  snapshot_path: closures/inputs/SI-1788417ff75137bc0b684eeaa5921bb3046a96c231038e10806c45fa905c4a1a.md
- path: root/subgoals/sg-assure/rationale.md
  node_id: SG-ASSURE
  design_revision: 1
  semantic_digest: 13d6646375623e51792fc1c32dc83b7f321c96047f01c90fc49eaf73ebce57c7
  snapshot_path: closures/inputs/SI-13d6646375623e51792fc1c32dc83b7f321c96047f01c90fc49eaf73ebce57c7.md
dependencies: []
seams:
- id: S-CONTEXT
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
- id: S-PROPOSAL
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
- id: S-AUDIT-INPUT
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
- id: S-AUDIT-RESULT
  owner: G-V3
  revision: 1
  canonical_path: root/design.md
acceptance_ids:
- G1
- G2
- G3
- G4
- G5
- G6
future_verification:
  unit_test_id: null
  subgoal_integration_id: null
  final_integration_id: FIT-G-V3
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
active_invalidations: []
staged_children:
- parent_id: G-V3
  candidate_ref: G-V3-decomposition-1
  child_ids:
  - SG-MODEL
  - SG-LEARN
  - SG-ASSURE
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
