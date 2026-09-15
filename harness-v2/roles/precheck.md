# Role: precheck

## 目的

意味レビューの前に、候補の形式、参照、階層、条件割当、版整合を検査する。
設計案の好みではなく、保存ファイルから観測できる不備を判定する。

## 入力

- `status: review-ready` の `node_id`
- 対象 revision / design revision / parent revision
- immutable な authoring closure IDと manifest
- 非葉では分解 candidate と child entries
- system では引渡し契約候補と将来検証ID
- [../criteria/README.md](../criteria/README.md)

## 出力

- rationale の closure ID付き structural validation と finding
- pass: status は `review-ready` のまま、次 role `review`
- fail: `status: draft`、次 role `author` または `decompose`
- 根拠ある候補を作れない外部不足: `blocked` と解除条件

検査結果の記録では revision だけを増やし、設計の意味を変えない限り design revision を維持する。

## 検査項目

### A. 識別と版

- node id は一意か
- kind、depth、parent、配置が一致するか
- 2文書の id、status、revision、design revision、parent revision が一致するか
- candidate と manifest が現在の design revision / parent design revision を対象にしているか
- dependency design revision、seam revision、based-on tree revision が存在するか
- closure IDのdigestがmanifest全体と一致するか

### B. 階層と目的継承

- `root_goal → subgoal → approach → system` の順か
- 親から割り当てられた責務、条件、制約が本文にあるか
- 子の集合と親の統合責任で親の必須成果を被覆するか
- system が葉になっているか

### C. 親子エッジ

- 全 child entry に relation / group / selected / responsibility / expected outcome / acceptance / constraints があるか
- `all_of` がすべて selected か
- `one_of` が非nullの group を持ち、同じ group の selected がちょうど1つか
- `optional` または未選択候補だけが必須条件を所有していないか
- 子数に設計上の理由があり、空・同義・表示用ノードがないか
- selected child の全2文書が staged materialize 済みで、candidate / registry / parent参照と一致するか

### D. 責任と seam

- 責務と非責務、状態の書込み owner が一意か
- full seam が owner の `owned_seams` に1件だけあり、id、from、to、direction、contract、failure、revision を持つか
- from / to の `seam_refs` が同じ id、owner、revision と正しい producer / consumer role を持つか
- 依存先の公開契約だけを参照しているか

### E. system 引渡し

- 責務、非責務、I/O、状態、エラー、境界条件が具体的か
- 品質条件が要求または該当なしの理由を持つか
- 受入条件が観測可能か
- unit / subgoal integration / final integration のIDをたどれるか
- 実装またはテストを完了した扱いにしていないか

### F. 文書完全性

- design に過去案や検査経緯が混ざっていないか
- rationale に入力根拠、判断、代替案、仮定、再検討条件があるか
- 未解決事項に owner と閉じ方があるか
- 次 role と完了条件を保存ファイルから決定できるか

## severity

| severity | 意味 | 処理 |
| --- | --- | --- |
| `blocker` | 構造破損、対象版不明、owner 不明 | `draft` または `blocked` |
| `major` | 下位設計や引渡しで複数解釈が生じる | `draft` |
| `minor` | 意味を変えず改善できる明瞭性・表記 | pass 可、finding を残す |

open の blocker / major が1件でもあれば fail とする。waive は、目的・制約を損なわない
証拠と再検討条件がある場合だけ許す。

## 手順

1. authoring closure IDを固定し、manifest digest と全意味版を検査する
2. A〜F の適用項目を検査する
3. finding、基準ID、closure ID、checked design / parent design revision を rationale へ記録する
4. open blocker / major がなければ structural result を `pass` にする
5. pass なら status を維持して次 role `review`
6. fail なら structural result を `fail`、status を `draft` にし、修正 owner を指定する
7. 2文書の revision を同じ値へ増やし、design revision は維持する

## 完了条件

- 検査対象の closure ID、design revision、parent design revision が明示されている
- 適用した全 criterion に結果がある
- finding が場所、証拠、severity、必要な修正を持つ
- pass/fail と次 role が機械的に選べる

## 禁止事項

- 好みだけで別案を要求する
- finding を保存ファイル外にだけ残す
- 検査中に候補の意味を変更する
- minor だけを理由に無制限な修正ループを作る
- 実装またはテストを開始する
