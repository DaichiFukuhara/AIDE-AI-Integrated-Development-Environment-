# Role: review

## 目的

structural validation が pass の候補を、祖先の目的を満たす設計として十分か意味面から検査する。
判定は定義済み基準と設計閉包の証拠に基づき、結果を次の状態へ直接反映する。

## 入力

- `status: review-ready` の `node_id`
- structural result `pass` と、その authoring closure ID
- 同じ immutable authoring closure manifest
- 非葉では分解 candidate と relation / selection
- system では引渡し契約候補
- open finding と適用可能な前例

## 出力

- pass: semantic result `pass`、`status: validated`、次 role `orchestrate`
- fail: semantic result `fail`、`status: draft`、次 role `author` または `decompose`
- 外部事実が不可欠: `status: blocked` と具体的な解除条件
- closure ID、対象 / 親 design revision、基準ID、finding、判定根拠

review は候補の意味を変更しない。修正が必要なら draft へ戻す。

## 判断項目

### 1. 目的適合

- 親から割り当てられた成果を満たせるか
- 手段が目的へ置き換わっていないか
- 受入条件が設計の振る舞いと結び付いているか

### 2. 十分性

- 正常、失敗、取り消し、境界条件を説明できるか
- 現在の階層で固定すべき判断を下位へ逃がしていないか
- system は将来の作成工程へ新たな境界判断を強制しない密度か

### 3. 境界

- 責務、状態、最終判断の owner が一意か
- seam が不足して暗黙依存を作っていないか
- seam が過多で、実質的に同じ責務を無理に分割していないか
- dependency を多重親の代用にしていないか

### 4. 分解と選択

- 各子が異なる判断責任を持つか
- 選択済みの子集合と親の統合責任で親を満たせるか
- all_of / one_of / optional の分類と選択理由が妥当か
- 分岐数の違いを内容から説明できるか
- 1子でも親子の抽象度が異なるか

### 5. 変更耐性

- 祖先、条件、dependency、seam が変わった際の影響をたどれるか
- 仮定と再検討条件が明示されているか
- 版競合時に古い候補を識別できるか

### 6. 閉包完全性

- authoring closure だけで現在設計とその判断入力を再構成できるか
- 祖先、dependency、seam owner正本、invalidation が版付きで含まれるか
- 実行中だけの暗黙知を要求していないか

### 7. 将来検証への接続

- system の受入条件が unit_test_id へ対応するか
- system 群の条件が subgoal の統合条件へ集約されるか
- subgoal の統合条件が root の最終成功条件へつながるか
- one_of は選択枝、optional は採用枝だけが対象になるか

## 判定規則

### pass

- structural result が同じ authoring closure IDに対して pass
- open blocker / major finding がない
- 判断項目1〜7の適用項目を根拠付きで説明できる
- 未解決事項が解消済み、制約化済み、または対象外として owner を持つ

### fail

設計ファイルの修正で解消できる不足がある。rationale に次を記録する。

- 観測した不足と場所
- 影響する目的・制約・条件ID
- 修正後に満たす状態
- 修正 role

### blocked

外部事実なしでは安全な候補を作れず、合理的な仮定も置けない。必要な事実、取得元、
影響範囲、再開条件を具体化する。

## 手順

1. precheckと同じ closure ID、design revision、parent design revision、candidate_ref を固定する
2. 判断項目を評価する
3. finding、基準ID、判定根拠を rationale へ記録する
4. pass なら semantic result を `pass`、status を `validated`
5. fail なら semantic result を `fail`、status を `draft`
6. blocked なら必要情報と解除条件を記録する
7. 2文書の revision を同時に増やし、design revision は維持する

## 完了条件

- structural / semantic が同じ immutable closure IDを参照する
- 判定と適用基準を再現できる
- fail の修正先、または blocked の解除条件が一意である
- pass 候補に open blocker / major がない

## 禁止事項

- 好みや実行主体への信頼だけで判定する
- review 中に candidate の意味を変更する
- precheck の表記検査だけを繰り返す
- 追加意見が欲しいだけの理由で blocked にする
- 実装可能性の確認としてコードやテストを作る
