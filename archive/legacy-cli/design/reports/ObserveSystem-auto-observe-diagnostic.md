# ObserveSystem 未Observe原因レポート

> **訂正（2026-08-03 16:55）**: このレポートは当初、「会話回数による自動Observe」を期待していると誤解して作成したものです。実際の意図は、設計内容を進めて明示的にObserveし、通らない原因を確認することでした。実Observe後の正しい分析は `ObserveSystem-observe-failure-analysis.md` を参照してください。

- 実施日: 2026-08-03
- 対象: `design/lanes/ObserveSystem.md`
- 判定: 50発言以上の対話後も未Observe

## 結論

Observeされなかった直接原因は、現在のAIDEに「会話回数を契機にObserveを自動実行する仕組み」がないためです。Observeは `aide observe <lane.md>` またはVS CodeのObserve操作から明示的に起動する設計です。`mdtalk` の対話処理と `aide observe` は接続されていません。

## 実施結果

- 新規に25往復の対話を成立させ、私側25発言とAI側25応答の合計50発言以上を確認した。
- 最終ファイルにはAI注釈ブロックが31件ある（開始前の既存注釈を含む）。
- `aide status design --json` の `ObserveSystem.report` は最後まで `null` だった。
- `design/reports/` に `ObserveSystem-<連番>.md` は生成されなかった。既存の `test-1.md` は別レーンのレポートである。
- 自動発火の有無を検証するため、明示的な `aide observe design/lanes/ObserveSystem.md` は実行していない。

## コード上の根拠

1. `aide.js` の観察処理は `cmdObserve` として実装され、CLIディスパッチの `case 'observe'` からだけ呼ばれる。
2. `mdtalk.js` の対話サイクルは `processAnnotations` を呼ぶが、`cmdObserve`、`aide.js`、`aide observe` を呼ぶ経路がない。子プロセス起動も対話バックエンドのClaude用である。
3. VS Code拡張は `aide.observeLane` コマンドとObserve CodeLensを提供するが、会話回数による自動実行はない。
4. AIDEのstatusスキーマにも、レーンごとの会話回数、Observe閾値、自動Observe待機状態を保持するフィールドがない。

## 発火しない理由の内訳

### 1. 会話数を数えていない

`mdtalk` はスナップショット、処理済みハッシュ、注釈済み段落などを状態管理するが、「成立した対話往復数」をObserve判定用に永続化していません。そのため50回という閾値を評価できません。

### 2. 自動Observeのトリガーがない

対話完了後に `aide observe` をキューへ積む処理、`@observe` ディレクティブを消費する処理、一定回数到達イベントのいずれも実装されていません。

### 3. 対話と観察が意図的に分離されている

現在の設計は、レーンAIとの対話を `mdtalk`、外部観察を `aide observe`、承認を人間操作として分離しています。会話を重ねても、明示操作なしに観察者へ本文が渡らないのは現行仕様どおりです。

### 4. 一時的なClaude応答エラーは主因ではない

途中でOpusの応答がスキーマ違反となったサイクルがあったものの、失敗回は成立数に含めずSonnet指定で再試行し、最終的に25往復を成立させました。したがって、バックエンドエラーではなく発火経路の欠如が未Observeの原因です。

## 対話で固まったObserveSystem改善案

- ヘッダの `observe-level: light|strict` でレーン単位に指定する。
- 未指定は `strict` とし、既存挙動を維持する。
- `light` は分割可能性だけをスキップし、矛盾検出、レーンハッシュ検証、stale検査は残す。
- 実行時の `--quick` は導入せず、ファイル宣言を唯一の指定元にする。
- レポートへ `observeLevel` と `separability.checked` を保存し、status、accept、VS Code表示へ反映する。
- 未知値、空値、重複宣言はエラーにし、検出値、許可値、行番号を表示する。
- 旧レポートに `observeLevel` がなければ `strict` と解釈する。

## 実装前の未解決点

1. `resolveObserveLevel` の返り値を文字列にするか、`{ level, source }` にするか。
2. `light` 時の `separability.ok` を省略するか `null` にするか。
3. `--force` がstale検査を迂回できる現行仕様を維持するか。
4. 同じ値の `observe-level` 重複もエラーにするか。

## 自動Observeを必要とする場合の最小追加案

1. レーン状態に成功対話往復数と最終自動Observe対象ハッシュを保存する。
2. `processAnnotations` 成功後にカウンターを増やす。
3. 閾値到達時、未消費ディレクティブがなく、同一ハッシュを未観察の場合だけObserveをキューへ積む。
4. 実行中、成功、失敗、staleをstatusとVS Codeに表示する。
5. 自動実行は外部AI送信を伴うため、プロジェクト設定で明示的に有効化する。

以上により、50発言以上でObserveされなかった事象は、障害ではなく「自動発火機構と会話数管理が未実装」という仕様上の結果と判断します。
