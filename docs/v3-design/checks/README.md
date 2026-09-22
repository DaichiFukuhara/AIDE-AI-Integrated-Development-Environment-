# 検査記録の読み方

このディレクトリはv2による設計検査の結果です。v3の製品テスト結果ではありません。

## 判定と対象

- `*-structural.md`: 構造項目の照合。D〜Gについては形式的な確認範囲を示し、意味判断はreviewへ渡す。authoring時点のhandoffはdeferred、公開直前確認はprecondition-passとして区別する。
- `*-semantic.md`: 主担当が起草後に行った意味レビュー。個別の確認理由と自己レビューであることを記録する。
- `*-publication.md`: 両検査と一致する意味版・参照版・全体版を確認して正本化した記録。
- [completion.md](completion.md): v2の設計完了条件との照合。
- [final-verification.md](final-verification.md): 保存後のファイル、参照、ハッシュの最終照合。
- [input-provenance.md](input-provenance.md): 参照したv2規約と既存資料のファイルハッシュ。
- [independent-audit/README.md](independent-audit/README.md): 正本化後に追加したCodex CLI / GPT-5.5による独立監査。対象のtree revision 18に対してpass。

役割ごとの処理は逐次実行した。今回の補助処理で並行書込みや故障注入の動作を試験したという意味ではない。

## immutable closureと意味ハッシュ

closureは、どの入力を検査したかを再構成するための固定記録である。ファイルの通常revision、status、検査結果の追記では意味ハッシュを変えない。

規約化は、JSONのキーを辞書順、空白区切りなし、UnicodeをエスケープせずUTF-8にしたバイト列のSHA-256とする。配列順は保存順を維持する。文字列内容はUnicode正規化しない。

ノード文書は次のオブジェクトへ規約化する。

1. YAML frontmatterから `id, kind, title, parent, depth, design_revision, parent_revision, children, depends_on, owned_seams, seam_refs, source_refs, unit_test_id, subgoal_integration_id, final_integration_id` の存在する項目をmetadataへ取り出す。
2. 本文の改行をLFに統一し、前後の空白を除く。rationaleでは `## 7. finding`、`## 8. 検査結果`、`## 10. 現在の作業状態` の見出しから次のレベル2見出し直前までを除外する。各節を除く際、直後のレベル2見出しの手前の改行は保持する。
3. `metadata` と `body` の2項目から意味ハッシュを算出する。

入力根拠はLFの本文全体を `text` に格納する。seam参加側の公開情報は `id` と `seam_refs` だけを固定し、兄弟の内部設計を引渡しへ取り込まない。

snapshotは `closures/inputs/SI-<完全なハッシュ>.md` 内のJSONオブジェクトとして保存する。既存snapshotは上書きせず、同じ内容は同じファイルを参照する。snapshotは検査対象の保存物で、更新する仕様の正本ではない。

manifestはYAMLをオブジェクトへ読み込み、`closure_id` と `manifest_digest` の2項目だけを除いて規約化する。IDの末尾12桁がmanifestのハッシュ先頭12桁と一致することを照合する。

## 照合の順序

1. manifestの完全ハッシュとIDを照合する。
2. files / sources / seam_participantsから参照したsnapshotを読み、各意味ハッシュとファイル名を照合する。
3. 現在の引渡しでは、現行文書を同じ方法で規約化し、snapshotとの一致を確認する。
4. tree-stateが指す3件について、全体版、対象systemの意味版、目標チェーン、契約両端、受入条件、3種類の将来検証ID、handoff passを照合する。
5. 文書対の版、親版、条件割当、正本owner、候補・未処理変更の有無を照合する。

初期のroot・subgoalのauthoring manifestでは、契約の両端はrootのowned_seamsとroot authoring closure内のstaged childの公開参照で記録される。approach以降のmanifestと、最終引渡しmanifestには `seam_participants` を直接含めた。契約の意味・版・参加側の公開参照は工程を通して変更していない。

過去のauthoring closureのtree版やstaged childは公開当時の状態である。現在の子の本文と一致させるために過去snapshotを更新してはならない。現在の意味が変わる場合はv2の変更手順で影響先を再検査する。

## 起草時に解消した曖昧さ

- plan確認とadoption反映を分け、試作仮説が現在仕様へ先に入ることを防いだ。
- plan確認に未実装部分のテスト成功を要求しないことを明示した。
- domain/contextの記録を4階層の追加階層と区別し、systemの主親の保存項目を一つにした。
- 反映前の取消と反映済み仕様の変更を区別した。
- 正式監査と日常の自己点検の独立性を明記した。

これらは各対象ノードの検査版を固定する前の起草で反映した。公開後の仕様を無検査で書き換えたものではない。
