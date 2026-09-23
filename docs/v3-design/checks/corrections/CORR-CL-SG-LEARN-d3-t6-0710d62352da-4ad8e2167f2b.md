---
correction_id: CORR-CL-SG-LEARN-d3-t6-0710d62352da-4ad8e2167f2b
unit_digest: 4ad8e2167f2b0f1e07fbbb19df3e09b34d18330e1802aebbc2df257b010cc0a2
kind: retrospective-correction
source_finding: AV3-004
original_closure_id: CL-SG-LEARN-d3-t6-0710d62352da
original_manifest_digest: 0710d62352daec59eabda26f43632d5a5300a3596be10bc25731680d46761c07
original_publication_path: checks/CL-SG-LEARN-d3-t6-0710d62352da-publication.md
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
- path: root/subgoals/sg-learn/design.md
  node_id: SG-LEARN
  design_revision: 3
  semantic_digest: 8f941c9de750bbb7a95ec138aefdab5cb82fffec16a20b0a486262ec20da1c9d
  snapshot_path: closures/inputs/SI-8f941c9de750bbb7a95ec138aefdab5cb82fffec16a20b0a486262ec20da1c9d.md
- path: root/subgoals/sg-learn/rationale.md
  node_id: SG-LEARN
  design_revision: 3
  semantic_digest: e768e0cb505d1c3f430c80a2b017e5dacf7844dd76a8910b5e060b380a69c475
  snapshot_path: closures/inputs/SI-e768e0cb505d1c3f430c80a2b017e5dacf7844dd76a8910b5e060b380a69c475.md
- path: root/subgoals/sg-learn/approaches/a-learn/design.md
  node_id: A-LEARN
  design_revision: 1
  semantic_digest: 6f864fe094dcd1510b6a966b5b8a6cefefc14463bc973cfdddcd79a7ffe5cfbd
  snapshot_path: closures/inputs/SI-6f864fe094dcd1510b6a966b5b8a6cefefc14463bc973cfdddcd79a7ffe5cfbd.md
- path: root/subgoals/sg-learn/approaches/a-learn/rationale.md
  node_id: A-LEARN
  design_revision: 1
  semantic_digest: e51299cadb2660c4acbbd251e449c4c5d2e7b635bda3f80d4d8122eb676f9611
  snapshot_path: closures/inputs/SI-e51299cadb2660c4acbbd251e449c4c5d2e7b635bda3f80d4d8122eb676f9611.md
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
