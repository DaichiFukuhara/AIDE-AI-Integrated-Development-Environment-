# 監査対象subject

subjectは「何を保証する判定か」を固定した入力集合。[テンプレート](../templates/subject.md)を使う。
仕様の意味hashだけでは、実装や証拠、用語定義の差替えを検出できない。

## 必須入力

| 項目 | 内容 |
| --- | --- |
| scope / phase | 対象条件・system/contextの集合、planまたはimplementation |
| spec_refs | rootから対象までの4階層の設計・根拠、条件割当・主親版 |
| contract_refs | seam ownerの完全な契約と、両端のowner/版/役割参照。利用dependencyの公開契約 |
| model_definition_refs | 用語・責任・ルール・不変条件・変換の定義と再帰的な依拠先 |
| plan_ref / plan_revision / evaluation_ref | 実験計画と固定した評価条件の版 |
| implementation_ref | 採用対象の不変コミットまたはファイルhash集合。planの未実装はnull可 |
| trial_refs / evidence_refs | 実装版に結び付く不変試行・関連テスト・実使用・人の評価・限界 |
| delegation_ref / unverified | 既存の許可・委任の根拠と、確認できていない範囲の扱い |
| recovery_ref | 通常はnull。差分起点が復元不能なときの不変loss record。喪失参照・復元試行・影響範囲・現在版・失われた保証を含む |

各refは`id, semantic_revision, immutable_ref`を持つ。実装・証拠等に意味版がなければ不変IDと内容hashを使う。
定義refには`domain_id, context_id, canonical_owner, dependencies`も必要。domain全体の定義はcontext_id=null。
scope外の定義でも意味の解釈に使うなら含める。同じIDの矛盾版、参照欠落、owner不明はblocked。
循環する定義参照は既訪問を再展開せず、集合を固定する。定義不要の場合だけ空集合と非該当理由を認める。

計画時は試行・証拠を空にできる。未実装テストの成功は不要。adoptionは対象実装と検証結果を要求し、未実施の実使用等は条件に照らして許容理由を記録する。
必要な受入条件が未確認なら合格にしない。確率的出力は計画の評価分布・許容誤差・反復数・データ・乱数等と対応する証拠を固定する。

## 同一性

subject本体をJSONへ規約化する。キー辞書順、配列は保存順、UnicodeをエスケープしないUTF-8、区切り空白なし。
入力JSONは入れ子を含め重複キーを拒否する。scopeだけは[記録契約](records.md)の集合規則で先に正規化し、他の配列順は変更しない。
SHA-256をsubject_hashとする。hash自身、監査結果、通常revision、操作状態は本体へ含めない。
文字列の内容は勝手に正規化しない。同じ入力順を保持する。

結果は`audit_request_id, subject_hash, scope, phase, criteria_version`の完全一致する要求だけに有効。
対象定義・仕様・実装・証拠・評価・scopeが変われば新subject・新要求を作る。
起点喪失からの回復もrecovery_refを含む新subjectへ固定し、以前と同じ対象として失敗結果を繰り返し受理しない。
古い結果は比較根拠として参照できるが、新対象の合格へ流用しない。変更分類はその新要求で行う。
意味不変の内部変更なら関連確認後にdaily-passを得られる。adoptionでcurrentを変えた場合はimplementationの未監査差分として残す。currentを変えないplanは確認履歴にだけ残す。

固定物を用いた監査中に、元の作業ファイルを結果入力へ混ぜない。採用時にも不変入力と最新の参照前提を照合する。
[補助ツール](../tools/README.md)のsnapshot IDはファイル集合の固定であり、subject_hashや意味監査の合格と同義ではない。
