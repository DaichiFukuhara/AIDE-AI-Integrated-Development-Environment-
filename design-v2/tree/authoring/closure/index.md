---
id: authoring.closure
kind: meta_approach
parent: authoring
depth: 2
children: []
status: published
revision: authoring.closure@2026-09-03-v2
uses_seams: [a2.node-snapshot]
provides_seams: [a1.context-closure, s1.design-closure]
---

# authoring.closure — 版付き設計閉包を構成する

## 1. 責任

対象ノードを起草・検査・引き渡すために必要な設計入力を、過不足なく版付きで集める。
閉包は新しい仕様を決めない。起草中は更新可能な working closure を使い、precheck の直前に
immutable な authoring closure を固定する。system closure は published な設計だけから作る。

## 2. 閉包の種類

| 種類 | 対象 | 用途 |
| --- | --- | --- |
| `working closure` | 任意の未完成・再設計ノード | author / decompose の入力。意味変更時に更新可能 |
| `authoring closure` | `review-ready` の候補 | precheck、review、publish の同一性を固定 |
| `system closure` | published な system | 将来の作成工程への引渡し |

## 3. 閉包の内容

1. 対象ノードの `design.md` と `rationale.md`
2. 根から親までの各 `design.md` と `rationale.md`
3. 親から対象へ割り当てられた条件、制約、`relation`
4. 対象が利用・提供する seam の owner 正本と参加ノードの参照
5. `depends_on` に列挙されたノードの published 契約
6. 対象に届いた design gap、invalidation、未解決事項
7. 各設計の design revision、seam revision、意味 digest
8. 非葉 authoring closure では、選択済み child の staged stub と `candidate_ref`

兄弟の内部設計は原則含めない。兄弟との接続に必要な情報は、共通の親が所有する seam または
統合条件として含める。追加情報が必要なら、その情報の所有元と版を明示して閉包へ加える。

通常の `revision` は workflow metadata の更新でも変わるため、閉包の意味同一性には使わない。
各書込み操作の上書き防止には、別途その時点の `base_revision` を使う。

## 4. `system closure` の追加内容

- system の責務・非責務・境界
- 外部 I/O、データ契約、エラー契約
- 依存と seam の方向、版、owner
- 品質条件と受入条件
- 実装側へ委任された判断
- root、subgoal、approach、system の goal chain
- `UT-<system-id>`、祖先の `SIT-<subgoal-id>`、`FIT-<root-id>`
- unresolved が `なし`、または非重大として制約化された根拠

## 5. immutable manifest

manifest は `design-tree/closures/manifests/<closure-id>.md` に保存し、作成後は変更しない。

```yaml
closure_id: CL-<target-id>-d<target-design-revision>-t<tree-revision>-<digest-prefix>
manifest_digest: <canonical-manifest-digest>
closure_kind: authoring | system
based_on_tree_revision: <tree-revision>
target:
  id: <node-id>
  design_revision: <node-design-revision>
  parent_design_revision: <parent-design-revision-or-null>
files:
  - path: <relative-path>
    node_id: <node-id>
    design_revision: <node-design-revision>
    semantic_digest: <digest-of-design-revision-governed-content>
staged_children:
  - id: <child-id>
    candidate_ref: <candidate-ref>
    design_revision: <child-design-revision>
    semantic_digest: <digest>
edges:
  - parent: <node-id>
    child: <node-id>
    relation: all_of | one_of | optional
    group: <group-id-or-null>
    acceptance: [<condition-id>]
    constraints: [<constraint-id>]
dependencies:
  - id: <node-id>
    design_revision: <design-revision>
seams:
  - id: <seam-id>
    owner: <owner-node-id>
    revision: <seam-revision>
    canonical_path: <owner-design-path>
source_refs: [<stable-path-or-url-and-version>]
active_invalidations: []
goal_chain:
  root_goal: <node-id>
  subgoal: <node-id-or-null>
  approach: <node-id-or-null>
  system: <node-id-or-null>
acceptance_ids: [<condition-id>]
future_verification:
  unit_test_id: <UT-id-or-null>
  subgoal_integration_id: <SIT-id-or-null>
  final_integration_id: <FIT-id>
```

`manifest_digest` は、`closure_id` と `manifest_digest` 自身を除いた manifest をキー順と
配列順を規約化して計算する。`closure_id` は対象 design revision、基準 tree revision、digest の
短縮値を含むため、dependency や seam だけが変わった閉包も別IDになる。

`semantic_digest` は design revision が支配する内容だけを対象にする。status、通常 revision、
updated_at、next action、finding、validation result などの workflow metadata は除外する。
それらの更新は immutable manifest を変えない。

## 6. validation と handoff の記録

precheck / review の結果は manifest を変更せず、対象の `rationale.md` に同じ `closure_id` を付けて
記録する。両結果が同じ closure IDを指す場合だけ validated 候補として扱う。

system closure の handoff 結果も manifest へ追記しない。
`design-tree/closures/handoffs/<closure-id>.md` に closure ID、result、検査した system design
revision、tree revision、finding を保存する。`tree-state.md` は current system closure と対応する
handoff record を参照する。

## 7. 構成アルゴリズム

1. tree revision と対象 design revision を読み取る
2. `parent` を根までたどり、循環・欠落・depth 不整合を検査する
3. 対象と祖先の design / rationale を対で追加する
4. 非葉では selected child の staged stub が存在し、candidate と一致することを確認して加える
5. 条件割当を edge として加え、dependency は published 契約だけを加える
6. seam ref から owner の full record を1件だけ解決し、両端と版を検査する
7. source、invalidation、goal chain、受入条件、将来検証IDの適用項目を加える
8. 意味入力を規約順に並べ、semantic digest と manifest digest、closure IDを計算する
9. tree revision と全 design / seam revision を再読し、一致する場合だけ manifest を保存する

途中で意味版が変わった場合は混在した閉包を出力せず、最新状態から再構成する。precheck / review
後の publish でも手順9と同じ集合を比較する。通常 revision のみ変わった場合は、書込み対象の
最新 revision を楽観ロックに使い、閉包そのものは再作成しない。

## 8. 欠落の扱い

| 欠落 | 出力 |
| --- | --- |
| ノード本文または根拠がない | 対象 node/design revision 付き `design-gap` |
| selected child の staged stub がない | 親を `draft` に戻し、decompose の materialize を再実行 |
| 親条件の割当先がない | 親を対象とする `design-gap` |
| seam owner、full record、相手参照がない | 境界所有者への `boundary-request` |
| design / seam / tree revision が一致しない | 閉包を破棄し、最新状態から再構成 |
| 重大な未解決事項がある | system closure を出力せず、対象を `blocked` |

## 9. 完了条件

- closure IDから同じ意味入力集合を再構成できる
- design と rationale が必ず同じ design revision の対として含まれる
- workflow metadata の追記が検査対象の意味版を偽って失効させない
- 根から対象までの条件継承を追跡できる
- 必要な dependency と owner 正本の seam を含み、無関係な内部設計を混入しない
- 非葉の全 selected child 参照が staged materialize 済みである
- system closure だけで将来の作成工程が責務と受入条件を理解できる
- 版競合、循環、欠落、重大未解決事項を正常な閉包として扱わない
