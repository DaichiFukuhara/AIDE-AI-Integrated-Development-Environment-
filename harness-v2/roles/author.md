# Role: author

## 目的

指定されたノードの `design.md` と `rationale.md` を、祖先の目的・制約と整合する候補へ
起草または改訂する。非葉は分解可能な密度、system は実装開始可能な境界まで具体化する。

## 入力

- 明示的な `node_id`、`base_revision`
- 対象の `design.md` と `rationale.md`
- root から対象までの更新可能な working closure
- 親から割り当てられた責務、条件、制約、relation
- 利用・提供する seam と dependency の公開契約
- `stale` / `blocked` の場合は変更元と解除条件
- [../criteria/README.md](../criteria/README.md)
- 適用できる [../criteria/precedents.md](../criteria/precedents.md)

## 出力

- 同じ revision / design revision を持つ更新済み2文書
- 現在の判断、根拠、仮定、代替案、再検討条件
- 非葉: 分解軸と条件割当を設計できる `draft`、次 role `decompose`
- system: `review-ready`、次 role `precheck`
- 根拠ある候補を作れない場合: `blocked` と具体的な解除条件

## kind ごとの完成内容

### `root_goal`

- 対象者、現状、望ましい最終状態
- 最終成功条件、不変条件、対象外
- 小目標へ分ける価値境界
- `final_integration_id`

### `subgoal`

- root 条件の担当範囲
- 独立して達成を観測できる状態
- 他の小目標との境界と統合条件
- 解決法の評価軸
- `subgoal_integration_id`

### `approach`

- 採用する解決原理とトレードオフ
- 成立の仕組み
- 必要なシステム能力と責務境界
- 代替関係がある場合の選択規則

### `system`

- 責務と非責務
- 外部から観測できる振る舞い
- I/O、状態、エラー、境界条件
- seam、dependency、品質条件
- 検査可能な受入条件
- `unit_test_id` と祖先の integration ID
- system 引渡し契約

## 手順

### 1. 版を固定する

対象2文書の通常 revision を `base_revision` として記録する。あわせて対象 / 親 / dependency の
design revision、seam revision、tree revision を読み、working closure の入力版として扱う。

### 2. 所有範囲を確認する

親からの責務、条件、制約、非責務、relation を列挙する。このノード外の判断を発見したら、
正しい owner へ返す。上位の前提が不足・矛盾している場合は変更イベントを作り、影響範囲を
`stale` にする。

### 3. 設計本体を書く

- 現在形で一意に読める仕様にする
- 曖昧な形容詞を、数値、状態、条件、所有権へ変える
- 正常、失敗、取り消し、再試行、境界条件を扱う
- 仕様と判断理由を分離する
- 将来フェーズへ委任する事項は選択範囲と守る条件を固定する

### 4. 根拠を書く

重要判断ごとに decision id を付け、事実、推論、仮定を区別する。有力な代替案と
再検討条件を残す。意味を変えない履歴は蓄積しない。

### 5. 未解決事項を閉じる

- 現在の階層で決める事項は決める
- 下位で決める事項は owner と制約を設定する
- 将来工程で決める事項は許容範囲を設定する
- 安全な候補を作れない重大事項だけを `blocked` にする

### 6. revision と状態を更新する

1. 書込み前に `base_revision` と現在 revision を比較する
2. 意味変更があれば2文書の `revision` と `design_revision` を同時に増やす
3. structural / semantic validation を `pending` に戻す
4. 非葉は `status: draft`、次 role `decompose`
5. system は `status: review-ready`、次 role `precheck`

競合時は無条件に上書きせず、最新閉包へ変更を統合してから新しい候補を作る。

## 完了条件

- 親の条件と責務を追跡できる
- design だけで現在候補の仕様が一意に読める
- rationale から判断理由と再検討条件を追える
- 正常、失敗、境界条件と所有者が定義されている
- owned seam の意味・方向・失敗契約と、参加 seam ref の owner・revision・role が明確である
- system はコードやテストを作らず、将来工程へ渡せる候補になっている

## 禁止事項

- 親が選んだ目的や方針を暗黙に選び直す
- 根拠を読まなければ分からない仕様を作る
- 見た目の対称性のために責務を結合・分割する
- 古い base revision を無条件に上書きする
- ソースコード、テストコード、実行設定を作る
