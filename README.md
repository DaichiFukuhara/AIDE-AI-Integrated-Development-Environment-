# AIDE — 並列設計オーケストレーション

AIDE は、大規模な設計書を複数レーン（考慮項目）に分割し、人間×AI の対話を**並列**に進めるためのツールセットです。2つのコマンドで構成：

- **mdtalk** — 1つのレーン（Markdown ファイル）内で人間と AI が対話的に設計を育てるツール
- **aide** — 複数レーンの進捗を観察・アクセプト・統合するオーケストレーション CLI

詳細は下記セクション「## mdtalk」「## aide」を参照。

人間がエディタでファイルを書いて保存すると、常駐する `mdtalk` がそれを検知し、
新しく書かれた部分を Claude（ヘッドレス `claude -p`）に読ませ、質問・コメント・
展開・別視点・整理の注釈ブロックを該当箇所の直下に **挿入のみ** で書き込みます。
人間の書いた文章は構造的に一切変更されません。チャット UI は使いません。

完成した設計書は、そのまま spec-driven-build などの実装パイプラインの入力になります。

## 必要環境

- Node.js >= 20（外部依存ゼロ）
- [`claude` CLI](https://www.npmjs.com/package/@anthropic-ai/claude-code)（`npm install -g @anthropic-ai/claude-code`）
- `codex` CLI（任意）— `aide observe` の観察者の既定。無い場合は
  `AIDE_OBSERVER_CMD` で別コマンドに差し替え可能

## インストール

```sh
git clone <this repo>
cd <this repo>
npm link      # `mdtalk` と `aide` コマンドが PATH に入ります
```

`npm link` を使わず、直接実行することもできます:

```sh
node mdtalk.js <file.md>  # mdtalk
node aide.js init         # aide
```

## mdtalk — ファイル内対話

### 使い方

```
mdtalk <file.md> [options]

options:
  --model <name>          dialogue（注釈）のモデル。既定: sonnet（例: haiku, opus）
  --model-minutes <name>  minutes（議事録）のモデル。既定: haiku
  --model-summary <name>  summary（章まとめ）のモデル。既定: opus
  --no-minutes            議事録の自動生成を無効化
  --once                  監視せず1回だけ処理して終了（テスト・CI用）
  --interval <ms>         デバウンス時間。既定: 1500
  --max-notes <n>         1回の処理で挿入する注釈ブロックの上限。既定: 3
  --quiet                 ログを警告以上のみに
  --init                  ファイルが空/未存在なら設計書スケルトンを提案させて終了
```

- `<file.md>` が存在しない場合は空で作成して監視を開始します。
- `Ctrl+C` で状態を保存して正常終了します。

### mdtalk の基本フロー

```sh
mdtalk design.md          # 監視開始（別ターミナルでエディタから design.md を編集）
```

段落を書いて保存すると、デバウンス後に Claude が呼ばれ、その段落の直下に
注釈 blockquote が挿入されます:

```markdown
> ❓ **AI**: この機能の対象ユーザーは誰ですか？（2026-07-08 14:32）
```

マーカーの意味:

| マーカー | type | 意味 |
| --- | --- | --- |
| ❓ | question | 質問（曖昧点の具体化） |
| 💬 | comment | コメント（暗黙の前提の言語化） |
| ➕ | expand | 展開（たたき台の提案） |
| 🔀 | counter | 別視点（抜けている観点） |
| 🧭 | structure | 整理（並べ替えの提案） |

### 人間から AI への合図

- 行頭 `@ai:` で始まる行は AI への直接指示です（例: `@ai: この節を整理して`）。
  次回処理時に最優先で解釈され、処理後にその行は `<!-- done: この節を整理して -->`
  に書き換えられます（これが唯一の例外的な人間行の変更です）。
- `@ai(<モデル名>): 指示`（例: `@ai(opus): 反論だけほしい`）で、その1回の
  dialogue 呼び出しだけモデルを差し替えられます。
- AI の質問に答えるときは、質問 blockquote の直下に普通に書けば OK です。
  特別な記法は不要で、AI は前回スナップショットとの差分で回答を認識します。

### マルチモデル役割分担（dialogue / minutes / summary）

役割ごとに別モデルへ分担できます。対話（注釈）は sonnet、議事録は haiku、
章まとめは opus、のようにコストと品質を使い分けます。

| 役割 | 既定モデル | 動き | 出力先 |
| --- | --- | --- | --- |
| dialogue | sonnet | 既存の注釈ループ | 対象 MD（挿入のみ） |
| minutes | haiku | 挿入/`@ai` 消費のあったサイクル後に議事録を追記 | `<base>.minutes.md` |
| summary | opus | `@ai(summary):` 指示で章を清書 | `<base>.summary.md` |

`<base>` は対象ファイルの拡張子を除いた名前です（`design.md` →
`design.minutes.md` / `design.summary.md`、同ディレクトリ）。対象 MD 本体への
書き込みは従来どおり挿入のみで、minutes / summary は別ファイルに書きます。

#### 議事録（minutes）

dialogue のサイクルで注釈を挿入した、または `@ai:` を消費したとき、その直後に
minutes モデルを1回呼び、`<base>.minutes.md` の末尾へ `## <日時>` 見出し付きで
議事エントリを追記します（追記のみ）。`--no-minutes` で無効化できます。
minutes の失敗は警告ログのみで、dialogue サイクルの成否には影響しません。

#### 章まとめ（summary）

`@ai(summary): この章をまとめて` を書くと、その行が属する章（直前の `##` 見出しから
次の `##` 見出しの手前まで）を summary モデルが清書し、`<base>.summary.md` に
書き出します。同じ章見出しのセクションが既にあれば置換、なければ追記します
（章単位で冪等）。対象 MD には指示行の `<!-- done -->` 変換に加え、章末尾に
まとめ先を示す参照 blockquote（🧭）が挿入されます。失敗時は指示を消費せず、
次サイクルで再試行します。

#### 役割別モデルの指定

優先順は **ファイル内指定 > CLI オプション > 既定値** です。CLI では
`--model` / `--model-minutes` / `--model-summary` で指定します。ファイル内では
プロトコルヘッダ（先頭の HTML コメント）に次の1行を置きます:

```
mdtalk-models: dialogue=sonnet minutes=haiku summary=opus
```

一部の役割だけ書いてもよく、人間がこの行を書き換えて保存すれば次サイクルから
反映されます（動的切り替え）。この行はヘッダ新規挿入時にテンプレートとして
自動で含まれます。

#### 空ファイルから始める

```sh
mdtalk newdesign.md --init --once
```

8 節（目的 / 対象ファイル / インターフェース / 振る舞い / 受け入れ条件 /
エッジケース / テスト方針 / スコープ外）の設計書スケルトンが提案・挿入されます。

### mdtalk の状態ファイル

対象 MD と同じディレクトリの `.mdtalk/<ファイル名>.state.json` に、
スナップショット・処理済みハッシュ・注釈済み段落フィンガープリント・PID ロックを
保存します。二重起動は PID ロックで拒否されます。

## aide — レーン分割・並列設計オーケストレーション

mdtalk を1レーン分の部品として、複数の考慮項目を**並列に**設計するための
CLI です（設計書: `docs/design/aide-orchestration.md`）。

- **マスター設計書** (`design/master.md`) — アクセプト済みの内容だけが載る「正」
- **レーン** (`design/lanes/*.md`) — 項目ごとの対話ファイル。mdtalk で監視する
- **観察者**（既定: Codex） — ボタン式。矛盾＋分割可能性をチェックし、
  合格がアクセプトの前提条件
- **プール** (`design/pool.md`) — アクセプト済み・未統合のステージング
- **マスターAI**（既定: claude opus） — 別セッションのバッチでプールを清書し
  master へ統合。矛盾エントリは理由付きで差し戻す

```sh
aide init                        # design/ を初期化
aide lane auth                   # レーン作成 → mdtalk design/lanes/auth.md で対話
aide observe design/lanes/auth.md    # 観察（矛盾＋分割可能性）→ reports/ にレポート
aide accept design/lanes/auth.md --section 認証フロー  # 合格を前提にプールへ（--section で特定の見出しのみ、--force で観察チェックをスキップ）
aide integrate                   # マスターAIが清書して master.md に統合
aide status                      # 全体状況
```

- アクセプトは最新レポートが pass で、観察後にレーンが編集されていないことが
  条件です（`--force` で強行可）。マージボタンを持つのは常に人間です。
- 統合済み/差し戻しエントリは `design/pool-archive.md` に監査証跡として残ります。
- バックエンドは環境変数で差し替え可能:
  `AIDE_OBSERVER_CMD`（既定 `codex exec -`）/
  `AIDE_MASTER_CMD`（既定 `claude -p --model opus --output-format json`）

## テスト

```sh
node --test
```

ネットワークや実 `claude` / `codex` は不要です。`MDTALK_CLAUDE_CMD` /
`AIDE_OBSERVER_CMD` / `AIDE_MASTER_CMD` でモックコマンドに差し替えてテストします。

## スコープ外（v0）

複数ファイル/ディレクトリ監視、エディタ拡張、git 連携、注釈へのスレッド返信、
i18n、Windows ネイティブ対応（WSL は対象）。
