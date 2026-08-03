# 共有知識ルーム
<!-- aide:knowledge generated
このファイルは AIDE が自動生成する読み取り専用の共有コンテキストです。
直接編集しても次回同期で上書きされます。元の master / pool / lane / report を更新してください。
-->

> レーンAIはこの内容を参照します。確定事項はマスター、統合待ちはプール、未確定の詳細は各レーンを正とします。

## 人間が明示した共有コンテキスト（.aide-context.md）

（追加の共有コンテキストなし）

## プロジェクト概要（README.md）

# AIDE

AIDEは、設計書を複数のMarkdownレーンに分け、人間とAIで並列に検討するためのツールです。

- `mdtalk`: Markdownの変更を検知し、Claudeが質問や提案を追記
- `aide`: レーンの作成、レビュー、承認、マスター設計への統合を管理
- `vscode-aide`: 一連の操作をVS Codeのサイドバーから実行

## 必要環境

- Node.js 20以上
- [Claude Code CLI](https://www.npmjs.com/package/@anthropic-ai/claude-code)
- Codex CLI（`aide observe`を使う場合）

## セットアップ

```sh
git clone <repository-url>
cd AIDE-AI-Integrated-Development-Environment-
npm link
```

`npm link`を使わない場合は、`node mdtalk.js` / `node aide.js`で直接実行できます。

## 基本フロー

```sh
aide init
aide lane auth
mdtalk design/lanes/auth.md

# 設計が固まったら別ターミナルで実行
aide observe design/lanes/auth.md
aide accept design/lanes/auth.md
aide integrate
```

成果物は次の場所に保存されます。

| パス | 内容 |
| --- | --- |
| `design/master.md` | 統合済みのマスター設計 |
| `design/lanes/*.md` | テーマ別の設計レーン |
| `design/reports/` | AIレビュー結果 |
| `design/pool.md` | 承認済み・未統合の内容 |
| `design/pool-archive.md` | 統合・差し戻しの履歴 |

## mdtalk

```sh
mdtalk <file.md> [options]
```

主なオプション:

- `--once`: 1回だけ処理して終了
- `--init`: 空のファイルに設計書のひな型を生成
- `--model <name>`: 対話モデルを指定
- `--model-minutes <name>`: 議事録モデルを指定
- `--model-summary <name>`: 章まとめモデルを指定
- `--no-minutes`: 議事録の自動生成を無効化

行頭に`@ai: 指示`を書くと、その指示を優先して処理します。`@ai(summary): 指示`では章のまとめを別ファイルへ生成します。

## aide

| コマンド | 内容 |
| --- | --- |
| `aide init [root]` | 設計ディレクトリを初期化 |
| `aide lane <topic> [root]` | レーンを作成 |
| `aide observe <lane.md>` | 矛盾や分割可能性をレビュー |
| `aide accept <lane.md>` | レビュー済み内容をプールへ追加 |
| `aide integrate [root]` | プールをマスター設計へ統合 |
| `aide knowledge [root]` | 共有知識ファイルを再生成 |
| `aide status [root] [--json]` | 現在の状態を表示 |

### Observeレベル

`mdtalk protocol`ヘッダの`observe-level`で、レーンごとの観察基準を選べます。

```md
<!-- mdtalk protocol
observe-level: light
-->
```

- `light`: マスターや他レーンとの矛盾だけを合否判定します。内部関数名、配置、既存コードへの接続方法など、安全に実装時判断できる詳細は未確定でもpassできます。
- `strict`: 矛盾に加え、レーン単独で実装できる粒度まで依存関係とインターフェースを確認します。
- 宣言がない既存レーンは`strict`として扱います。不正値、空値、重複宣言はObserve前にエラーになります。

矛盾検出、観察時のレーンハッシュ、観察後のstale検査はどちらのレベルでも有効です。使用したレベルは観察レポート、pool、`status --json`、VS Codeに記録・表示されます。

`AIDE_OBSERVER_CMD`と`AIDE_MASTER_CMD`でAIバックエンドを変更できます。Windowsではnpm shimを起動するため、既定で`codex.cmd` / `claude.cmd`を使用します。

詳しい設計は[mdtalk設計](docs/mdtalk-design.md)と[AIDEオーケストレーション設計](docs/design/aide-orchestration.md)を参照してください。

## VS Code拡張

```powershell
cd vscode-aide
npm install
npm run package
code --install-extension aide-buttons-0.2.0.vsix
```

操作方法は[VS Code拡張のREADME](vscode-aide/README.md)を参照してください。

## テスト

```sh
npm test
```

## License

[MIT](LICENSE)

## 確定済みの共通知識（master.md）

# マスター設計書
<!-- aide:master
このファイルは AIDE の「正」。アクセプト済みの内容だけが載る。
更新は `aide integrate`（マスターAI）経由。人間の直接編集も可
（次回統合時にマスターAIが整合を確認する）。
-->

## 目的 / 背景

（プロダクトの目的をここに書く）

## アーキテクチャ原則

## 機能・コンポーネント（アクセプト済み）

## 未決事項

## 変更履歴

## 人間が承認済み・統合待ちの知識（pool.md）

<!-- aide:pool
アクセプト済み・未統合の項目（ステージング）。`aide integrate` が消化する。
エントリの手編集はしない。
-->

## レーン索引

### ObserveSystem.md
- ## Observeシステムの改善案
- ### 最終決定

## 最新の観察結果

### ObserveSystem.md — pass
元レポート: reports/ObserveSystem-3.md

<!-- aide:report
lane: lanes/ObserveSystem.md
laneHash: 992b8a96f72a3145a85e70013d198f65677ece24c695bcdd3887187a92354505
verdict: pass
observeLevel: light
observeLevelSource: declared
date: 2026-08-03 17:49
-->

# 観察レポート: lanes/ObserveSystem.md (#3)

- verdict: **pass**
- 観察レベル: **light** (declared)
- 分割可能性: スキップ — observe-level: light のためスキップ（実装時に決められる詳細は合否対象外）
- 矛盾: なし

## 検査結果

マスター設計書には本件と衝突する確定済みの仕様がなく、比較対象となる他レーンもありません。対象レーン内の用語・インターフェース・前提にも、合否を覆す明確な矛盾は認められませんでした。

分割可能性は `observe-level: light` のため評価対象外です。
