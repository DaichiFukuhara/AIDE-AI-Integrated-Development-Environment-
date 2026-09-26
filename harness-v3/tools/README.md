# 監査入力の保存を補助する

`snapshot.py`はPython 3.10以上の標準ライブラリだけで動く。対象ファイルを読み、内容hash付きの不変bundleへ保存する。
自動監査・分類・取消・採用エンジンではない。意味入力の選択、subjectの構成、許可と台帳の処理はハーネスの担当が行う。

```sh
python harness-v3/tools/snapshot.py freeze <project> design/master.md design/rationale.md
python harness-v3/tools/snapshot.py verify <project>/design/snapshots/SN-<hash>
python harness-v3/tools/snapshot.py hash-json <subject-body.json>
```

freezeは指定ファイルをproject相対パスで受け取る。今回必要な設計の対、親条件、契約の両端、定義と依拠先、計画、実装・証拠を明示的に列挙する。
最初の例は操作方法の例で、rootの2文書だけでsystem監査が十分という意味ではない。
subjectテンプレートのJSON本体をhash-jsonへ渡し、返るhashをsubject_hashとして記録する。結果や状態は本体に混ぜない。
hash-jsonとmanifest読込みは、入れ子を含む重複JSONキーを拒否する。後に書かれた値で暗黙に上書きしない。subjectのscope集合の正規化は入力を作る担当が行う。

保存先は`design/snapshots/SN-<SHA-256>/`、中身は`manifest.json`と`files/<元の相対パス>`。
snapshot IDはformat_versionと、名前順のファイル一覧（path/sha256/size）を規約化したhash。ファイルのバイト列を変換しない。
同一入力の再保存は同じ場所を検証して返す。既存snapshotを上書きしない。入力の変更は新snapshotになる。
ファイルの欠落・改変、manifestの不一致、パスの逸脱、リンク経由の入力を拒否する。
Windowsではlstatのreparse point属性を確認し、Python 3.10/3.11にないis_junctionには依存しない。

保存中は指定元ファイルへの並行書込みを停止する。一つのsnapshot内の全入力が同じ論理版であることは担当が開始前と保存後に照合する。
このツールは各ファイルの固定・検出を行うが、編集者とのロックや意味版判定を代行しない。
通常の状態追記で既存subjectを再保存する必要はない。固定した意味入力を維持し、状態・結果を別記録へ置く。
