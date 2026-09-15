# Role: decompose

## 目的

起草済みの非葉ノードを、次の kind の最小十分な子集合へ分解する。親の条件を漏れなく保持し、
枝ごとに必要な数だけ、独立した判断境界を作る。

## 入力

- `status: draft` の非葉 `node_id` と `base_revision`
- 対象ノードの設計閉包
- 親の責務、受入条件、不変条件、分解軸
- 既存の子、dependency、seam（改訂時）
- 共通基準と適用可能な前例

`system` は葉なので対象にしない。

## 出力

- `design.md` の「子への割り当て」候補
- `rationale.md` の版付き `candidate_ref`
- relation / group / selected を持つ child entry
- 親に残す統合責任と seam
- 選択済み child の staged `design.md` / `rationale.md` stub
- `status: review-ready`、次 role `precheck`

precheck は親の child 参照が実在することも検査するため、選択済み child は検査前に staged
materialize する。親が published になるまでは `tree-state.md.staged_children` に置き、
orchestrator はその child を authoring 対象に選ばない。

## kind の対応

| 親 | 子 |
| --- | --- |
| `root_goal` | `subgoal` |
| `subgoal` | `approach` |
| `approach` | `system` |

階層を飛ばしたり、異なる kind を混ぜたりしない。

## 分解の判断軸

- 独立して達成を確認できる成果
- 解決原理またはトレードオフ
- 所有するデータ・状態
- 変更理由と変更頻度
- セキュリティ、可用性、規制などの制約
- 外部主体または外部サービスとの境界
- 失敗時の責任と回復方法

機能名の列挙や図の見栄えだけを分解理由にしない。

## relation の決め方

### `all_of`

子が共同で親の必須条件を成立させる。すべて `selected: true` にする。

### `one_of`

同じ目的を異なる方法で満たす代替集合。同じ `group` を付け、評価基準で1つだけを
`selected: true` にする。候補、比較、選択理由は rationale に残す。

### `optional`

親の必須成功条件を担わない拡張。採用有無を `selected` で示し、未採用でも親を
未完成にしない。

## 手順

### 1. 親の成果を列挙する

親の責務、受入条件、制約、正常・例外経路を安定IDで一覧化する。

### 2. 凝集する責務をまとめる

同じ理由で変わり、同じ状態・制約・失敗責任を持つ責務を候補単位へまとめる。

### 3. 独立性を確認する

各候補について、祖先閉包と明示 seam だけで固有設計を進められるか、兄弟の内部判断を
要求しないか、責務が複数の変更理由を抱えていないかを確認する。

### 4. relation と選択を決める

候補を `all_of | one_of | optional` に分類し、group、selected、expected outcome を記録する。
`one_of` は比較基準に照らしてこの段階で採用枝を決める。

### 5. seam を定義する

seam ごとに owner、from、to、direction、contract、failure、revision を定義する。
正常経路だけでなく、拒否、再試行、取り消し、失効、順序逆転を検討する。
完全な契約は owner の `owned_seams` にだけ置き、from / to child の stub には
id、owner、revision、producer / consumer role の `seam_refs` だけを転記する。

### 6. 条件を割り当てる

- 必須条件を選択済みの子または親の統合責任へ割り当てる
- 複数子にまたがる条件は親が保持し、子には部分条件を渡す
- optional または未選択 one_of だけに必須条件を割り当てない
- 重複責務が必要なら最終 owner と同期方法を決める

### 7. 候補を記録する

[../rationale-template.md](../rationale-template.md) の分解候補 schema を使う。`design.md` の
child entries と、rationale の candidate 内容を一致させる。

### 8. 選択済み child を staged materialize する

1. `selected: true` の child ごとに正しい階層へディレクトリと2文書を作る
2. 親から割り当てる責務、条件、制約、relation、group、parent design revision を転記する
3. child は `status: draft`、初期 design revision とする
4. `tree-state.md.staged_children` に parent id、candidate_ref、全 child id を記録する
5. 親の children、全stub、staged registry を1つの論理更新として保存し tree revision を進める

既存 candidate の冪等再実行では同じIDを再利用する。candidate の意味が変わった場合は、まだ
active でないstubだけを新候補へ整合させる。採用を外した案の比較理由は rationale に残す。
published 済み child の置換はこの手順で直接行わず、change event を経由する。

### 9. 状態を更新する

- 意味変更として2文書の revision / design revision を同時に増やす
- validation を `pending` に戻す
- `status: review-ready`、次 role `precheck`

## 完了条件

- 子 kind と depth が正しい
- 子数が内容から説明でき、隣の枝の数に依存しない
- 各 child entry に relation、group、selected、責務、期待結果、条件がある
- 同じ one_of group で選択済みがちょうど1つである
- 親の必須責務・条件に漏れがない
- 親に残す統合責任と seam が明示されている
- 各選択済み子が独立して設計を開始できる
- candidate が現在の parent design revision に固定されている
- selected child の2文書がすべて実在し、staged registry と candidate_ref が一致する
- child stub の parent revision、条件、seam ref が親の候補と一致する

## 禁止事項

- 子数を先に決めて内容を当てはめる
- すべての枝を同じ幅に見せる
- 親条件を全子へ丸ごと複製する
- optional または未選択候補へ必須条件を逃がす
- staged child を親の publish 前に authoring 対象へ選ぶ
- published child を change event なしで置換する
