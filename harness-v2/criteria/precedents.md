# 現在有効な設計前例

複数ノードで繰り返し使う判断だけを置く。案件固有の生ログや失効した運用規則は置かない。

## 記載形式

```md
### <precedent-id>: <名前>

- status: active
- applies_when: <適用条件>
- decision: <繰り返す判断>
- rationale: <品質基準との対応>
- do_not_apply_when: <例外>
- reconsider_when: <見直し条件>
```

## Active precedents

### `P-001`: 枝幅を揃えない

- status: active
- applies_when: 非葉を次の kind へ分解する。
- decision: 子数は親ごとに最小十分な集合として決め、隣の枝と揃えない。
- rationale: 対称性は責務の凝集性や独立性を示さず、空・重複・過大な node を生むため。
- do_not_apply_when: 外部上限がある場合。上限内でも内容から数を決める。
- reconsider_when: tree 以外の設計モデルへ変更したとき。

### `P-002`: 意味の階層は1子でも保持する

- status: active
- applies_when: 次の層に必要な子が1つだけである。
- decision: 親子で抽象度と判断責任が異なるなら1子でも層を作る。
- rationale: 4階層は表示用ではなく、異なる問いを所有するため。
- do_not_apply_when: 子が親の言い換えだけになる場合。親の粒度を修正する。
- reconsider_when: kind の意味または階層数を変更したとき。

### `P-003`: 設計本体と根拠を同じ版にする

- status: active
- applies_when: node を作成、更新、検査、引き渡す。
- decision: `design.md` と `rationale.md` を同じ revision / design revision で維持する。
- rationale: 仕様だけでは判断条件を再評価できず、根拠だけでは現在仕様を一意に読めないため。
- do_not_apply_when: なし。
- reconsider_when: 同等以上の正式な二文書トランザクション形式を導入したとき。

### `P-004`: 保存版を継続点にする

- status: active
- applies_when: 作業を開始、再開、並行化する。
- decision: `node_id + base_revision + design_revision + next action` を書込み操作の継続点にし、検査はclosure IDで継続する。
- rationale: 一時的な実行状態に依存せず、競合と次処理を保存ファイルから判断できるため。
- do_not_apply_when: 同時更新を検出した場合。最新版へ統合して新候補を作る。
- reconsider_when: tree 外に正式なトランザクションストアを導入したとき。

### `P-005`: 検査合格版を自動公開する

- status: active
- applies_when: structural / semantic が同じ immutable authoring closure IDに対して pass した。
- decision: status を validated とし、closure内の全意味版とtree revisionに競合がなければorchestratorがpublishedにする。
- rationale: 進行可否を設計品質と版整合から一意に決められるため。
- do_not_apply_when: 対象、親、dependency、seam、tree の意味版が検査後に変わった場合。
- reconsider_when: 公開状態モデル自体を変更したとき。

### `P-006`: review は候補を変更しない

- status: active
- applies_when: review-ready 候補を意味面から検査する。
- decision: review は pass / fail / blocked と根拠を返し、意味変更は author / decompose へ戻す。
- rationale: 検査対象と検査中の修正を混ぜると、validated な版を特定できなくなるため。
- do_not_apply_when: 意味を変えない修正。ただし revision を更新し必要な検査を再実行する。
- reconsider_when: 原子的な修正・再検査を保証する仕組みを導入したとき。

### `P-007`: seam は失敗経路まで定義する

- status: active
- applies_when: node 間で情報、状態、制御を渡す。
- decision: full contractはownerだけに置き、両端はid、owner、revision、roleで参照する。正本は方向、意味、保証と拒否・再試行・取り消し・失効を定義する。
- rationale: 正常経路だけでは障害時に責任と状態が分裂するため。
- do_not_apply_when: 読み取り専用で失敗が呼出元だけに閉じると説明できる場合。
- reconsider_when: seam の通信・整合性モデルが変わったとき。

### `P-008`: system を設計ツリーの葉にする

- status: active
- applies_when: approach を実装可能な責務へ分解する。
- decision: system は将来の作成ハーネスへの引渡し単位とし、このツリーでは子を作らない。
- rationale: 現在の設計範囲と将来の実装・検証範囲を分離するため。
- do_not_apply_when: system が大きすぎる場合。system の下へ伸ばさず approach の分解を直す。
- reconsider_when: 実装側の木をこの設計ツリーへ統合すると決めたとき。

### `P-009`: 検証可能性だけを現在設計する

- status: active
- applies_when: 受入条件と system closure を書く。
- decision: 観測可能な条件と unit / subgoal integration / final integration のIDを定義し、テストは作らない。
- rationale: 将来の検証へ変換可能にしつつ、現在範囲を設計完成へ限定するため。
- do_not_apply_when: なし。
- reconsider_when: 実装・テストフェーズの開始が明示されたとき。

### `P-010`: 変更は意味に沿って伝播する

- status: active
- applies_when: published な目的、条件、dependency、seam を変更する。
- decision: 条件継承、依存、seam、祖先統合条件をたどり、影響 node と closure を stale にする。
- rationale: 全ツリーの無条件失効と影響見落としの両方を避けるため。
- do_not_apply_when: 影響を説明できない場合。安全側の部分木を stale にする。
- reconsider_when: フィールド単位の依存追跡を導入したとき。

### `P-011`: 検査前に selected child を staged materialize する

- status: active
- applies_when: 非葉の分解candidateをreview-readyにする。
- decision: selected childの2文書をstaged stubとして先に作り、`design.md.children`にはその実在childだけを残す。親公開時に全件をactive化する。
- rationale: precheckとreviewが参照実在性を検査でき、親が存在しない子を参照する瞬間を作らないため。
- do_not_apply_when: child stubを含むpublication bundleを同等の原子性で検査・保存できる場合。
- reconsider_when: candidateとactive treeを別の正式ストアへ分離したとき。

### `P-012`: closure manifest と結果を分離する

- status: active
- applies_when: authoring validationまたはsystem handoffを記録する。
- decision: manifestは意味入力のdigestでimmutableにし、validationとhandoff結果はclosure IDを参照する別記録にする。
- rationale: 結果追記による通常revision更新で、検査対象の意味集合やclosure identityを循環させないため。
- do_not_apply_when: immutable manifestと結果を型として分離できる同等の格納方式がある場合。
- reconsider_when: closure全体をcontent-addressed storeへ移行したとき。
