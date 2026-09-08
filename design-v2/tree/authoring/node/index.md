---
id: authoring.node
kind: meta_approach
parent: authoring
depth: 2
children: []
status: published
revision: authoring.node@2026-09-03-v2
uses_seams: [a1.context-closure]
provides_seams: [a2.node-snapshot]
---

# authoring.node — 設計ノードのファイル契約

## 1. 責任

生成ノードの識別、配置、2文書、状態、親子エッジ、dependency、seam、将来検証IDを定義する。
`status: published` の design だけが現在有効な規範であり、それ以外は検査中または失効状態である。

## 2. 配置

```text
design-tree/
├─ tree-state.md
└─ root/
   ├─ design.md
   ├─ rationale.md
   └─ subgoals/<subgoal-id>/
      ├─ design.md
      ├─ rationale.md
      └─ approaches/<approach-id>/
         ├─ design.md
         ├─ rationale.md
         └─ systems/<system-id>/
            ├─ design.md
            └─ rationale.md
```

ディレクトリ包含、`parent`、`depth` は同じ4階層を表す。node id はツリー内で一意かつ安定とする。

## 3. `design.md` frontmatter

```yaml
---
id: <unique-node-id>
kind: root_goal | subgoal | approach | system
title: <short-title>
parent: <parent-id-or-null>
depth: 0 | 1 | 2 | 3
status: draft | review-ready | validated | published | blocked | stale | superseded
revision: <integer>
design_revision: <integer>
parent_revision: <parent-design-revision-or-null>
children:
  - id: <child-id>
    relation: all_of | one_of | optional
    group: <group-id-or-null>
    selected: true | false
    responsibility: <one-sentence-responsibility>
    expected_outcome: <observable-result>
    acceptance: [<condition-id>]
    constraints: [<constraint-id>]
depends_on:
  - id: <node-id>
    design_revision: <design-revision>
owned_seams:
  - id: <seam-id>
    owner: <node-id>
    from: <node-id>
    to: <node-id>
    direction: <direction>
    contract: <meaning-and-guarantee>
    failure: <failure-behavior>
    revision: <integer>
seam_refs:
  - id: <seam-id>
    owner: <owner-node-id>
    revision: <integer>
    role: producer | consumer
source_refs: [<stable-path-or-url>]
---
```

`review-ready` 以降の design の `children` は materialize 済みの `selected: true` だけを参照する。
未選択 one_of / optional は rationale の候補・代替案に残す。
`one_of` は非nullの group を必須とし、同じ group で1つだけを selected にする。

seam の full record は `owner` と同じ node の `owned_seams` に1件だけ置く。from / to の
参加 node は `seam_refs` で同じ id、owner、revision と自身の role を参照する。参加 node に
契約本文を複製せず、closure は owner の full record を解決する。

## 4. `design.md` 本文

全種類で次を持つ。

1. `目的`
2. `親から受け取った条件`
3. `対象と望ましい状態`
4. `責任範囲`
5. `設計`
6. `入出力と状態`
7. `seam と依存`
8. `品質条件`
9. `受入条件`
10. `子への割り当て`
11. `未解決事項`
12. `将来の検証対応`
13. `system 引渡し契約`

使わない節は `該当なし` とする。仕様は現在形で書き、判断理由や検査経緯を混在させない。

## 5. `rationale.md` frontmatter

```yaml
---
id: <design.mdと同じnode-id>
document: rationale
status: <design.mdと同じstatus>
revision: <design.mdと同じinteger>
design_revision: <design.mdと同じinteger>
parent_revision: <design.mdと同じparent-design-revision>
base_revision: <operation-start-revision>
validation:
  structural:
    result: pending | pass | fail
    closure_id: <authoring-closure-id-or-null>
    checked_design_revision: <integer-or-null>
    checked_parent_design_revision: <integer-or-null>
  semantic:
    result: pending | pass | fail
    closure_id: <authoring-closure-id-or-null>
    checked_design_revision: <integer-or-null>
    checked_parent_design_revision: <integer-or-null>
next_action:
  role: intake | author | decompose | precheck | review | orchestrate
  target: <node-id>
  done_when: <observable-condition>
---
```

本文は入力根拠、現在の判断、代替案、仮定、分解候補、リスク、finding、検査結果、
変更影響、現在の作業状態、将来検証の根拠、system closure の根拠を持つ。

## 6. 種類ごとの必須内容

### `root_goal`

- 対象者と最終的に実現する状態
- スコープ、最終成功条件、不変条件
- 必須小目標と根に残す最終統合条件
- `FIT-<root-id>`

### `subgoal`

- 独立して確認できる価値
- root のどの条件を担当するか
- 解決法の評価基準、小目標の統合条件
- `SIT-<subgoal-id>`

### `approach`

- 解決原理、選択理由、トレードオフ
- 必要な system 責務の集合
- 代替関係がある場合の選択規則
- 自身では必須テストIDを所有しない

### `system`

- 単一の所有可能な責務と非責務
- 外部 I/O、状態、データ、エラー、境界条件
- dependency、seam、品質条件
- 実装時に選択できる範囲
- 単独で作成開始できる受入条件
- `UT-<system-id>` と祖先由来の SIT / FIT

## 7. revision と検査

- `revision`: 2文書の状態・検査結果を含む論理更新ごとに増やす
- `design_revision`: 設計、根拠、分解候補の意味変更で増やす
- `parent_revision`: 候補が前提とした親の design revision
- `base_revision`: 操作開始時に読んだ対象 revision

precheck / review は同じ immutable authoring closure IDを固定して判定する。closure は対象と親の
design revision、dependency design revision、seam revision、tree revision、意味 digest を含む。
結果記録と status 更新で revision が増えても、closure の意味入力が同じなら検査は有効である。
意味入力が変わったら design revision または参照版を進め、両検査を pending、status を draft に戻す。
`base_revision` は各書込みの比較にだけ使い、検査同一性には使わない。

## 8. 状態遷移

1. 新規または意味変更中は `draft`
2. system の起草、または非葉の分解候補が完成したら `review-ready`
3. structural / semantic の両方が pass なら `validated`
4. 同じ closure IDへの両検査が pass し、その全版と tree revision に競合がなければ `published`
5. 上位または横断契約の変更で再検査が必要なら `stale`
6. 安全な候補に不可欠な外部事実がなければ `blocked`
7. 過去に published だった node が後継構造へ置き換わった場合だけ `superseded`。旧nodeが
   `stale` なら、後継公開と同時に `stale → superseded` とする

## 9. 完了条件

- 2文書の id、status、revision、design revision、parent revision が一致する
- kind、depth、parent、配置が4階層規則と一致する
- edge が relation、group、selected、責務、期待結果、条件、制約を持つ
- dependency と seam の公開契約・版を列挙できる
- design だけで仕様、rationale だけで選択理由と検査根拠を追える
- system closure から UT / SIT / FIT と上位条件をたどれる
