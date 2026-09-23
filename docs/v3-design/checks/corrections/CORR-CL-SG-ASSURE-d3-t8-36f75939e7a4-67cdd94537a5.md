---
correction_id: CORR-CL-SG-ASSURE-d3-t8-36f75939e7a4-67cdd94537a5
unit_digest: 67cdd94537a527b90ea67cea7654caf414042e6c9a01326f855cbbf13ac96bf4
kind: retrospective-correction
source_finding: AV3-004
original_closure_id: CL-SG-ASSURE-d3-t8-36f75939e7a4
original_manifest_digest: 36f75939e7a491891967da2af4a357892094a8e866baf2568a9168d6b5fe184a
original_publication_path: checks/CL-SG-ASSURE-d3-t8-36f75939e7a4-publication.md
root_authoring_closure_id: CL-G-V3-d3-t2-84ada73f2f64
root_manifest_digest: 84ada73f2f645bec526687152a08388f168887780ed43434f1f62e3a47c90c98
seam_participants:
- node_id: SG-MODEL
  semantic_digest: 95f331c96c749a5666c8ebd38ce0fa43826d7eb0fa77d759de9f816edae56ea6
  snapshot_path: closures/inputs/SI-95f331c96c749a5666c8ebd38ce0fa43826d7eb0fa77d759de9f816edae56ea6.md
  derived_from:
    path: root/subgoals/sg-model/design.md
    node_id: SG-MODEL
    design_revision: 1
    semantic_digest: 15ea7073aba45d99ce7bdb52c9e8c51ef4bc0a6ae3a850e56bb3697f725a111e
    snapshot_path: closures/inputs/SI-15ea7073aba45d99ce7bdb52c9e8c51ef4bc0a6ae3a850e56bb3697f725a111e.md
- node_id: SG-LEARN
  semantic_digest: c9972bbfe6141c31704c7b8d4f11c7c480cd80bac9a482b31771a62b6c6f273d
  snapshot_path: closures/inputs/SI-c9972bbfe6141c31704c7b8d4f11c7c480cd80bac9a482b31771a62b6c6f273d.md
  derived_from:
    path: root/subgoals/sg-learn/design.md
    node_id: SG-LEARN
    design_revision: 1
    semantic_digest: 9329b098d0a27ecaf35915293b445f310a9d84fd41786d5682c01c1847a36fe2
    snapshot_path: closures/inputs/SI-9329b098d0a27ecaf35915293b445f310a9d84fd41786d5682c01c1847a36fe2.md
- node_id: SG-ASSURE
  semantic_digest: 23272ef84f1717229ef95d93dd9c6ae36436a44be9e912c12ee549299d3a07a3
  snapshot_path: closures/inputs/SI-23272ef84f1717229ef95d93dd9c6ae36436a44be9e912c12ee549299d3a07a3.md
  derived_from:
    path: root/subgoals/sg-assure/design.md
    node_id: SG-ASSURE
    design_revision: 1
    semantic_digest: 1788417ff75137bc0b684eeaa5921bb3046a96c231038e10806c45fa905c4a1a
    snapshot_path: closures/inputs/SI-1788417ff75137bc0b684eeaa5921bb3046a96c231038e10806c45fa905c4a1a.md
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
  design_revision: 1
  semantic_digest: 47d416067df5d50c721729090ac1a177a4c913bb2138ebd59e34761498019c4d
  snapshot_path: closures/inputs/SI-47d416067df5d50c721729090ac1a177a4c913bb2138ebd59e34761498019c4d.md
- path: root/subgoals/sg-assure/approaches/a-assure/rationale.md
  node_id: A-ASSURE
  design_revision: 1
  semantic_digest: 7228a0a6f5e8d05e458c8cedfee89900eba671c86b4cf73fcf81d9018db830e7
  snapshot_path: closures/inputs/SI-7228a0a6f5e8d05e458c8cedfee89900eba671c86b4cf73fcf81d9018db830e7.md
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
sources:
- path: sources/requirements.md
  semantic_digest: e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8
  snapshot_path: closures/inputs/SI-e0cb261c6d94faf15f113363cee173fe21c265ee71971fc05394e3b3e78af3c8.md
---

# 過去の公開入力に対する訂正検査

検査日: 2026-09-22T20:54:59+09:00

結果: 今回固定した合成入力で4契約のowner・revision 1・producer/consumer参照は一致する。元の公開記録との関係はoriginal_publication_path、元の閉包と不足入力の出所は上記の固定ID/hashを参照。

限界: 元の3subgoal閉包は参加側入力を含まず不完全だった。別のroot authoring閉包で保存された当時のstubと当該subgoalの保存入力を今回組み合わせて再検査した。当時の監査者が実際に両端を読んだことや、各公開時刻の未保存の通常状態を証明するものではない。旧manifest・旧pass記録を完全だったと再認定しない。現行版の公開・引渡しは別の新規閉包で再検査する。
