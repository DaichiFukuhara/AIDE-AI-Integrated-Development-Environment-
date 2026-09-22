---
closure_id: CL-S-AUDIT-d2-t18-c95c7c0db2f3
manifest_digest: c95c7c0db2f3f693b2b55907b877b31196b63ecace9ec9e9056f7500ff57d1ec
closure_kind: system
based_on_tree_revision: 18
target:
  id: S-AUDIT
  design_revision: 2
  parent_design_revision: 3
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
  design_revision: 3
  semantic_digest: 8965df0a0a828a4ab3de9cfe53e1320df96bd970f7f030704873e586cb089e15
  snapshot_path: closures/inputs/SI-8965df0a0a828a4ab3de9cfe53e1320df96bd970f7f030704873e586cb089e15.md
- path: root/rationale.md
  node_id: G-V3
  design_revision: 3
  semantic_digest: beac8b62e15dee389d4945dd4a2b7ce715a9aa7849a623f54a141063d3eadc20
  snapshot_path: closures/inputs/SI-beac8b62e15dee389d4945dd4a2b7ce715a9aa7849a623f54a141063d3eadc20.md
- path: root/subgoals/sg-assure/design.md
  node_id: SG-ASSURE
  design_revision: 3
  semantic_digest: 2e7080e8d5c5eb3f9755bd4a8ca4532324b87d407f2a16ad2503c4d60d2fa618
  snapshot_path: closures/inputs/SI-2e7080e8d5c5eb3f9755bd4a8ca4532324b87d407f2a16ad2503c4d60d2fa618.md
- path: root/subgoals/sg-assure/rationale.md
  node_id: SG-ASSURE
  design_revision: 3
  semantic_digest: da276749252459a7d5cf9d7a03f59d4182380fc2438c9c9d0fccbb2432ceb375
  snapshot_path: closures/inputs/SI-da276749252459a7d5cf9d7a03f59d4182380fc2438c9c9d0fccbb2432ceb375.md
- path: root/subgoals/sg-assure/approaches/a-assure/design.md
  node_id: A-ASSURE
  design_revision: 3
  semantic_digest: f63ea61b47e248ad7083c773d033eadd031c296611c63ad820841cafcc8d4614
  snapshot_path: closures/inputs/SI-f63ea61b47e248ad7083c773d033eadd031c296611c63ad820841cafcc8d4614.md
- path: root/subgoals/sg-assure/approaches/a-assure/rationale.md
  node_id: A-ASSURE
  design_revision: 3
  semantic_digest: 23a4b52ecb2b33b9cf8d64af82ff52ef4057c6b501ee927b53e7acbdb7276256
  snapshot_path: closures/inputs/SI-23a4b52ecb2b33b9cf8d64af82ff52ef4057c6b501ee927b53e7acbdb7276256.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/design.md
  node_id: S-AUDIT
  design_revision: 2
  semantic_digest: 56cb6fbcc9e7466c1912dda8d7ef1a40c1a3f943c85d6b1c980415d7942b46b6
  snapshot_path: closures/inputs/SI-56cb6fbcc9e7466c1912dda8d7ef1a40c1a3f943c85d6b1c980415d7942b46b6.md
- path: root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/rationale.md
  node_id: S-AUDIT
  design_revision: 2
  semantic_digest: b79b9afe8a0ab186ed285aaf43338fe3fe40034e4069f12d49453ffd00a44014
  snapshot_path: closures/inputs/SI-b79b9afe8a0ab186ed285aaf43338fe3fe40034e4069f12d49453ffd00a44014.md
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
  semantic_digest: 23272ef84f1717229ef95d93dd9c6ae36436a44be9e912c12ee549299d3a07a3
  snapshot_path: closures/inputs/SI-23272ef84f1717229ef95d93dd9c6ae36436a44be9e912c12ee549299d3a07a3.md
- node_id: SG-LEARN
  canonical_path: root/subgoals/sg-learn/design.md
  semantic_digest: c9972bbfe6141c31704c7b8d4f11c7c480cd80bac9a482b31771a62b6c6f273d
  snapshot_path: closures/inputs/SI-c9972bbfe6141c31704c7b8d4f11c7c480cd80bac9a482b31771a62b6c6f273d.md
- node_id: SG-MODEL
  canonical_path: root/subgoals/sg-model/design.md
  semantic_digest: 95f331c96c749a5666c8ebd38ce0fa43826d7eb0fa77d759de9f816edae56ea6
  snapshot_path: closures/inputs/SI-95f331c96c749a5666c8ebd38ce0fa43826d7eb0fa77d759de9f816edae56ea6.md
---

# 固定した設計入力

意味snapshotはfilesとsourcesから参照する。正規化はREADMEの記載に従う。結果は別記録に保存する。
