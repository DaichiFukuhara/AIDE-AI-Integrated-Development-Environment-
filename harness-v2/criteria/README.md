# 設計品質基準

このファイルは `precheck`、`review`、`orchestrate` が共通に使う判定基準を定義する。
設計ツリーに保存された証拠と版から、同じ候補に対して再現可能な判定を行う。

## 1. 判定単位

```text
immutable authoring closure ID
+ node_id + design_revision + parent design_revision
+ design.md + rationale.md の semantic digest
+ root から対象までの祖先
+ 参照する dependency design revision / seam owner 正本と revision
+ based-on tree revision + active invalidation
+ 非葉の場合は decomposition candidate と staged child stub
```

設計の意味または参照版が変わったら、以前の検査結果を流用しない。status や finding だけの
workflow 更新では revision を進め、design revision は維持する。

## 2. Gate A — 文書、状態、版

### `A-01` 2文書の対

- 各 node に `design.md` と `rationale.md` がある
- id、status、revision、design revision、parent revision が一致する
- design は仕様、rationale は入力根拠と判断理由を持つ

違反: `blocker`

### `A-02` 状態遷移

- status は `draft | review-ready | validated | published | blocked | stale | superseded` のいずれか
- structural / semantic pass 前に `validated` になっていない
- `published` は同じ design revision の `validated` からだけ遷移する
- `superseded` は過去に published だった node にだけ使い、構造置換では `stale → superseded` を許す
- handoff は node status ではなく closure に対応する別結果レコードで表す

違反: `blocker`

### `A-03` 現在性

- draft design は現在の候補、published design は現在有効な規範として読める
- rationale は候補を支える現行根拠、仮定、代替案、検査結果を持つ
- 実行中だけの情報や失効した生ログを仕様・根拠の代わりにしていない
- next role と完了条件を保存ファイルから決定できる

違反: `major`

## 3. Gate B — 階層、配置、追跡

### `B-01` kind と配置

```text
root_goal → subgoal → approach → system
```

- root は1つ、木の親は各 node につき1つ
- depth、parent、ディレクトリ包含が一致する
- system は葉
- 横断関係は dependency / seam で表す

違反: `blocker`

### `B-02` 目的継承

- 子の責務が親の成果へ寄与する
- 親から割り当てられた責務、条件、制約、非責務を追える
- 子が親の目的または採用方針を暗黙に選び直していない

違反: `major`

### `B-03` 条件の所有

- 全条件に安定IDと主 owner がある
- 複数子にまたがる統合条件は親が保持する
- 必須条件は選択済みの子または親の統合責任に割り当てられる
- 未割当と説明されていない重複がない

違反: `major`

## 4. Gate C — 親子エッジと分解

### `C-01` edge schema

全 child entry が次を持つ。

- id、relation、group、selected
- responsibility、expected outcome
- acceptance、constraints

違反: `blocker`

### `C-02` relation

- `all_of` はすべて selected
- `one_of` は非nullの group を持ち、同じ group で selected がちょうど1つ
- `optional` は採用有無が明示される
- optional / 未選択 one_of だけに親の必須条件を割り当てていない
- `review-ready` 以降の design の children は staged materialize 済みの selected child だけを参照する
- staged registry、candidate_ref、childの2文書とparent revisionが一致する
- 未選択候補は rationale の candidate / alternatives に残る

違反: `blocker`

### `C-03` 最小十分な子集合

- 選択済み子の集合と親の統合責任で親を満たす
- 空、同義、単なる表示用、過大なまとめ node がない
- 子数を親ごとに内容から決めている
- 1子の場合も親子で抽象度と判断内容が異なる

違反: `major`

### `C-04` 独立性

- 子は祖先閉包と明示された契約から固有設計を開始できる
- 兄弟の内部判断を入力として要求しない
- 変更理由、所有状態、制約、失敗責任のいずれかで凝集している

違反: `major`

## 5. Gate D — 設計内容

### `D-01` 判定可能性

- 目標と受入条件が観測可能な状態で書かれている
- 曖昧な形容詞だけで合否を表していない
- 正常、失敗、取り消し、境界条件を区別できる

違反: `major`

### `D-02` 所有権

- 責務と非責務が区別されている
- データ、状態、最終判断の owner が一意
- 共有書込みは競合解決者と順序を持つ

違反: `blocker`

### `D-03` seam と dependency

- full seam は owner の `owned_seams` に1件だけあり、id、from、to、direction、contract、failure、revision を持つ
- from / to node は `seam_refs` で同じ id、owner、revision、producer / consumer role を参照する
- 正常だけでなく失敗、再試行、取り消し、失効を扱う
- dependency は参照する公開契約と revision を持つ

違反: `major`

### `D-04` 根拠

- 重要判断が rationale の decision id と対応する
- 事実、推論、仮定を区別する
- 有力な代替案、不採用理由、再検討条件がある
- 根拠が変わった際の影響範囲を特定できる

違反: `major`

## 6. Gate E — system と将来検証

### `E-01` 実装可能な境界

system design に次がある。

- 責務と非責務
- 外部から観測できる振る舞い
- I/O、状態、エラー、境界条件
- dependency、seam、品質条件
- 観測可能な受入条件
- 実装時に選択できる範囲

違反: `major`

### `E-02` 将来検証ID

- root が `FIT-<root-id>` を所有する
- subgoal が `SIT-<subgoal-id>` を所有する
- system が `UT-<system-id>` を所有する
- approach 自身に必須テストIDを割り当てない
- system closure が祖先由来の3 IDを参照する
- one_of / optional は選択済み枝だけを将来検証集合へ含める

違反: `major`

### `E-03` closure handoff

- closure id、manifest digest、based-on tree revision、目標チェーン、構成ファイルのdesign revisionとsemantic digestがある
- dependency design revision、seam owner / revision、受入条件、将来検証IDがある
- closure IDが対象design revision、tree revision、manifest digestを含み、manifestがimmutableである
- 別のhandoff resultはclosure ID、対象system design revision、tree revisionを持つ
- closure だけで責務と存在理由を再構成できる

違反: `blocker`

## 7. Gate F — 検査、公開、変更

### `F-01` validation identity

- structural / semantic が同じ closure ID、checked design revision、checked parent design revision を持つ
- 意味変更後は両結果が pending に戻る
- open blocker / major がある候補を validated にしない

違反: `blocker`

### `F-02` publish identity

- publish 対象は検査済み closure IDのtarget design revisionと一致する
- parent / dependency design revision、seam revision、tree revisionがmanifestと一致する
- active invalidation が対象または参照契約を覆っていない
- 各書込みで読み取った通常 revision と書込み直前の current revision が一致する
- 非葉の selected child は検査前に全件staged materializeされ、親公開と全child active化が論理的に一括される

違反: `blocker`

### `F-03` change impact

- change event が event id と基準 tree revision を持つ
- 直接対象、条件継承、dependency、seam、祖先統合条件を走査する
- stale node と invalid closure に理由がある
- 影響なしとする近傍にも根拠がある
- 競合時は書き込まず最新版で再計算する

違反: `major`

## 8. Gate G — フェーズ境界

- 現在の成果物は設計2文書、closure、検査・変更記録だけ
- 製品コード、テストケース、テストコード、fixture、ビルド、デプロイを生成していない
- 将来工程へは契約と対応IDだけを渡す

違反: `major`

## 9. severity と判定

| severity | 意味 |
| --- | --- |
| `blocker` | 構造、版、owner が壊れ、安全な候補を特定できない |
| `major` | 下位設計または引渡しで複数解釈が生じる |
| `minor` | 意味を変えず改善できる明瞭性・表記の問題 |

### precheck pass

- Gate A〜C と F の構造項目をすべて検査
- 対象に応じ D〜G の機械的項目も検査
- open blocker / major が0
- structural result、closure ID、checked design / parent design revision を記録

### review pass

- 同じ immutable closure IDの precheck が pass
- Gate D〜G の意味を根拠付きで説明できる
- open blocker / major が0
- semantic result を pass、status を `validated`

### publish

- validated と current design revision が同じ closure IDで一致
- parent、dependency、seam、tree revision、書込み時の通常 revision に競合がない
- 非葉では全 selected child がstaged済みで、親公開時に全件をactive化
- status を `published` にし tree revision を進める

### 設計工程完了

- 選択された必須部分木の全 node が published
- 必須経路に未完成、blocked、stale がない
- 全 current system closure に対応する handoff result が pass
- 条件、relation、dependency、seam、将来検証IDを根まで追跡できる

## 10. 前例の使い方

[precedents.md](precedents.md) は繰り返し判断の補助である。active な前例だけを使い、
明示された目的・制約と本基準を優先する。条件が異なる前例を機械的に適用しない。
