# AIDE 実験ノート — ハーネスを使ってログ画面を作る

`harness-v3/README.md` に従って開発する実使用実験。前回の `../log-console/` は保存し、ここで新たに計画・独立監査・実装・検証・採否の記録を残します。

## 起動と記録

このディレクトリで以下を実行します。依存パッケージのインストールは不要です。

```sh
python -B src/server.py --port 4183
```

<http://127.0.0.1:4183> で開きます。HTML/CSS/JSの画面を標準PythonのローカルHTTPで配信します。単体ファイルのダブルクリックではAPIへ接続できません。

AIは同じディレクトリからCLIで記録します（PowerShellでも1行のまま実行できます）。

```sh
python -B src/logbook.py --id WORK-001 --actor Codex --phase implementation --kind action --title "実装を変更" --body "実際に行った操作と結果" --reason "短い判断理由" --evidence src/app.js --next "関連テストを実行する"
```

工程: `intake/design/plan/implementation/verification/audit/adoption/closure`。種類: `action/decision/check/issue`。結果: `recorded/pass/fail/unverified`（`--outcome`）。`--evidence`は繰り返し指定可、既存のプロジェクト相対ファイル限定。記録時刻は自動付与。事後記録は本文で事後記録と原本を明記します。

`data/events.json` がイベントの正本。同ID・同内容は再送しても増えず、異内容は拒否します。訂正は新IDで追記してください。`design/state.md` の監査/採用状態はハーネスの記録担当だけが更新し、CLIや画面は変更しません。

## 画面

- 本作業の実ログを5秒間隔で取得。検索、工程・種類の絞り込み、時刻順、理由・根拠・次の操作の詳細表示。
- 計画、実装の検証、独立監査、採用、サイクル、人評価を台帳から表示。イベントの成功を監査や採用へ昇格させません。
- 保存済み全ログのJSON/Markdownダウンロード、表示中ログのJSONコピー。コピーが使えない場合は選択可能なテキストを表示。
- 根拠は画面内のダイアログでプレーンテキスト表示。参照の存在は記録時に確認し、後にファイルが消えた場合も過去イベントは残します。監査時の不変版はsnapshotとsubjectが所有します。
- 更新失敗時は前回取得した組を残して、更新できないことを明示。

## 検証

```sh
python -B -m unittest discover -s tests -v
node --test tests/view.test.mjs
```

テストは一時プロジェクトでCLI・HTTPを起動し、再送/競合/破損/ロック/置換失敗/参照逸脱/書出し/状態の分離を確認します。Nodeは表示用の検索・並び替え・入力形式・参照URLを確認します。実ブラウザでの結果は `evidence/`、試行は `experiments/trials/` に保存します。

## ハーネスの記録をたどる

- `design/master.md`：今回の目的。subgoal → approach → systemの4階層と対になるrationaleを持つ。
- `experiments/E-001-plan.md`：固定した評価条件、範囲、予算、停止条件。
- `audits/subjects/`：意味入力・実装・試行・根拠を固定したsubject。
- `design/snapshots/`：既存ハーネスの補助ツールで保存・検証した不変入力。
- `audits/`：起草者と別担当が作成した監査結果。
- `design/state.md`：current、予約・実績、操作、保証基準、周期判定の正本。
- `operations/`：計画・採用・終端の要求と確定結果。

`tools/` は本実験を手動で運用するための記録補助で、自動監査エンジンではありません。`bootstrap.py` は初期化済みのプロジェクトへ再実行できません。

## 限界

ローカルの単一書込担当、最大5MB/5000イベント。書込ロックが残ったら、他の記録者が動いていないことを確認してから復旧が必要です。公開サーバー、認証、複数AIの自律的な同時反映、課金API、モデルの推論実行、正式判定の自動化は対象外。

本人の使いやすさ・業務での再開の成否・長期運用・全ブラウザ互換は未確認です。AIによる操作確認と本人評価を区別します。Windowsのsandboxではハーネスのsnapshot作成/読取に追加権限が必要になりました。元のハーネスは変更していません。
