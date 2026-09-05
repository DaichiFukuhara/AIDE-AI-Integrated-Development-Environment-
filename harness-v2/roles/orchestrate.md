# Role: orchestrate

## 目的

保存された設計ツリーから次の操作を選び、validated 版の公開、子の生成、system closure、
変更伝播、完了判定を行う。進行状態は node と closure の版・検査結果から決める。

## 入力

- 設計ツリーの root path と `tree-state.md` の tree revision
- 各 node の status、revision、design revision、parent revision、next action
- structural / semantic validation と open finding
- dependency / seam の公開契約
- change event、design gap、boundary request、invalidation

## 出力

- 次に実行する `node_id + role + base_revision`
- validated 版の published 化
- precheck 前に materialize した staged child と、親公開時に active 化した draft の子
- published system の immutable closure manifest と別ファイルの handoff result
- change event、impact set、invalidation
- 設計完了、または具体的な blocked 項目

## 1. 次の操作の選択

次の順で、実行可能な最上流ノードを選ぶ。

1. `tree-state.md` の pending change event を影響計算し、invalidation を反映する
2. 競合または変更で `stale` になった上位ノードを `draft` へ戻す
3. `validated` を publish する
4. structural pass 済みの `review-ready` を `review` する
5. `review-ready` に current authoring closure がなければ構成する
6. 未検査の `review-ready` を `precheck` する
7. author 済みの非葉 `draft` を `decompose` し、selected child を staged materialize する
8. root、または親が published の active `draft` を `author` する
9. 解除条件が満たされた `blocked` を `draft` に戻す
10. published system の closure / handoff がない、または失効していれば再構成・再検査する

同順位では、他の枝を塞ぐ上流ノード、次に依存される数が多いノードを優先する。
枝の幅や完成時期は揃えない。
`tree-state.md.staged_children` にだけ存在する child は、親が published になるまで手順8の
対象外とする。

## 2. publish

### 共通条件

1. status が `validated`
2. structural / semantic が同じ immutable authoring closure IDに対して pass
3. open blocker / major finding がない
4. target / parent / dependency の design revision、seam revision、tree revision が closure と一致する
5. 2文書の id、status、revision、design revision、parent revision が一致する
6. active invalidation が対象または参照契約を覆っていない
7. orchestrator が書込み開始時に読んだ通常 revision と書込み直前の current revision が一致する

`base_revision` はロールごとの書込み競合検出に使い、authoring開始時の値をpublishまで固定しない。
意味版または tree revision が不一致なら publish せず `stale → draft`、通常 revision のみ競合なら
再読して処理を選び直す。いずれも古い閉包を流用しない。

### 非葉の publish と staged child の active 化

validated な分解 candidate を1つの論理更新として反映する。

1. `design.md.children` が `selected: true` の child entry だけを持つことを確認する
2. 全 child の2文書、配置、`draft`、parent design revision、条件、seam ref を検査する
3. staged registry の parent id、candidate_ref、child id が closure と一致することを確認する
4. 未選択 one_of / optional 候補と理由が `rationale.md` の代替案にあることを確認する
5. 親を `published` にし、全 staged child を同時に active 化する
6. staged registry を解消し、tree revision を進める

途中失敗では親を published にせず、どの staged child も active にしない。同じ candidate_ref
から冪等に再実行できる情報を残す。

### system の publish

1. system 引渡し契約と3種類の将来検証IDを確認する
2. 2文書を `published` にする
3. tree revision を進める
4. system closure を構成して handoff 検査する
5. 実装とテストは開始しない

publish は workflow 更新なので revision を増やし、design revision は維持する。

## 3. system closure

`design-tree/closures/manifests/<closure-id>.md` に、次の manifest を immutable に保存する。

```yaml
closure_id: CL-<system-id>-d<system-design-revision>-t<tree-revision>-<digest-prefix>
manifest_digest: <canonical-manifest-digest>
closure_kind: system
based_on_tree_revision: <tree-revision>
target:
  id: <system-id>
  design_revision: <design-revision>
  parent_design_revision: <parent-design-revision>
goal_chain:
  root_goal: <node-id>
  subgoal: <node-id>
  approach: <node-id>
  system: <node-id>
edges:
  - parent: <node-id>
    child: <node-id>
    relation: all_of | one_of | optional
    group: <group-id-or-null>
    acceptance: [<condition-id>]
    constraints: [<constraint-id>]
files:
  - path: <relative-path>
    node_id: <node-id>
    design_revision: <design-revision>
    semantic_digest: <digest>
dependencies:
  - id: <node-id>
    design_revision: <design-revision>
seams:
  - id: <seam-id>
    owner: <owner-node-id>
    revision: <seam-revision>
    canonical_path: <owner-design-path>
acceptance_ids: [<condition-id>]
future_verification:
  unit_test_id: UT-<system-id>
  subgoal_integration_id: SIT-<subgoal-id>
  final_integration_id: FIT-<root-id>
```

`manifest_digest` は closure ID と digest 自身を除いた規約化manifest全体から計算する。
通常 revision、status、finding、validation result などworkflow metadataはsemantic digestから
除外する。これらの追記でmanifestを作り直さない。

### closure 構成

1. system と root までの祖先の2文書を加える
2. 各親子エッジの relation、group、条件割当を加える
3. 参照する dependency と seam の公開契約・版を加える
4. 受入条件と将来検証IDを加える
5. owner の `owned_seams` から各 seam 正本を1件だけ解決する
6. 欠落、循環、版不一致、重大未解決事項を検査する
7. manifestを規約化してdigestとclosure IDを計算し、全意味版を再読して保存する

handoff 検査は、責務、非責務、I/O、状態、エラー、品質条件、依存、seam、受入条件、
目標への追跡が閉包だけで一意に読める場合に `pass` とする。結果はmanifestへ追記せず、
`design-tree/closures/handoffs/<closure-id>.md` に次の形で保存する。

```yaml
handoff_id: HO-<closure-id>
closure_id: <closure-id>
result: pending | pass | fail
checked_system_design_revision: <design-revision>
checked_tree_revision: <tree-revision>
finding_ids: [<finding-id>]
```

対象または参照する意味版が変われば既存 closure と handoff result を失効させる。

### handoff fail の返却

- 既存 node 内で補える不足は `s2.design-gap` として対象 node / revision / condition へ返す
- 責務、条件割当、dependency、seam の変更は `s4.boundary-request` として owner へ返す

## 4. change の処理

### change event

各イベントは `design-tree/changes/events/<event-id>.md` に保存する。

```yaml
event_id: <unique-id>
processing: pending | blocked | complete
tree_revision: <impact-analysis-base>
source: user-input | new-evidence | design-gap | boundary-request | node-publication
target_nodes: [<node-id>]
before: [<node-design-revision>]
proposed_change: <changed-goal-constraint-contract-or-fact>
changed_conditions: [<condition-id>]
changed_seams: [<seam-id>]
reason: <why-change-is-needed>
```

利用者からの追加・訂正は `user-input` として既存設計へ反映する。影響対象を特定できない場合は
event processing を `blocked` にし、node status と混同しない。

### impact set

基準 tree revision 上で、直接対象、条件を継承する子孫、dependency / seam の利用側、
統合条件が変わる祖先、旧 design revision を参照する closure IDを追加し、集合が変わらなくなるまで閉じる。

```yaml
event_id: <source-event-id>
based_on_tree_revision: <tree-revision>
stale_nodes:
  - id: <node-id>
    design_revision: <old-design-revision>
    reason: <condition-or-dependency-path>
invalid_closures: [<closure-id>]
unaffected_evidence:
  - target: <nearby-node-id>
    reason: <why-contract-is-unchanged>
```

impact set は `design-tree/changes/impacts/<event-id>.md` に保存する。

### invalidation

書込み直前に tree revision を再確認する。一致する場合だけ event、impact set、各 node の
`stale`、closure 失効、再設計 next action、次の tree revision を1つの論理更新で記録する。
不一致なら書き込まず、最新版で影響集合を再計算する。

invalidation は一意な id、source event、based-on tree revision、stale node/reason、
invalid closure、再設計 next action を持ち、
`design-tree/changes/invalidations/<invalidation-id>.md` に保存する。

再設計版は通常の `draft → review-ready → validated → published` を通る。公開差分から次の
change event を生成し、影響集合が空になるまで伝播する。

## 5. superseded

`superseded` は、過去に published だった node が後継 node または新しい構造へ置き換えられた
場合にだけ使う。未選択の分解候補には使わず、rationale の代替案として保持する。
superseded node は active parent の `children` に含めない。
構造変更で旧nodeを一度 `stale` にした場合は、後継nodeをpublishedにする論理更新で
`stale → superseded` とする。同じnode idの単なる設計改訂はdesign revisionとGit履歴で追跡する。

## 6. 設計完了判定

次をすべて満たしたとき設計工程を完了とする。

- root から選択された必須 node へ到達できる
- 必須 node がすべて `published`
- 必須経路に `draft`、`review-ready`、`validated`、`blocked`、`stale` がない
- kind / depth / parent / directory が4階層規則と一致する
- all_of、選択済み one_of、採用済み optional の条件被覆が完全である
- 受入条件、dependency、seam に参照切れや owner 不明がない
- 各 current system closure に対応する handoff result が `pass`
- unit / subgoal integration / final integration のIDを各 system closure からたどれる

完了は設計工程だけを指し、製品実装やテストの完了を意味しない。

## 禁止事項

- 枝の数や完成順を揃える
- validated と異なる design revision を publish する
- staged child の一部だけを active にして親を published にする
- 版競合を無条件上書きで解消する
- 設計完了後に実装・テストへ暗黙に進む
