# 4環境共通の記録手順

利用者がこのログブックへの記録を依頼した作業で使用する。作業開始、重要な判断、変更完了、検証結果、失敗・未解決、終了の節目でCLIを実行する。取得できていないサブエージェント操作や内部思考を推測で記録しない。

`LOGBOOK_URL` と環境専用 `LOGBOOK_TOKEN` はシークレットとして設定済みであること。トークンを出力・Git保存・チャット貼付しない。CLIパスはこのファイルの隣の `cli/logbook.py`。クラウドのcheckoutでもPythonがあることを確認する。

```text
python experiments/cloud-logbook/cli/logbook.py record --project PROJECT --run RUN --source SOURCE --actor ACTOR --title TITLE --body BODY --reason REASON --next NEXT --phase PHASE --kind KIND --outcome OUTCOME
python experiments/cloud-logbook/cli/logbook.py flush
python experiments/cloud-logbook/cli/logbook.py status
```

SOURCEは実際の実行環境に合わせて codex-local / claude-local / codex-cloud / claude-cloud を選ぶ。各送信資格のproject/source/run制限に従う。

通信不可ならキューに残った事実と未送信件数を利用者へ伝える。クラウドの環境終了前にflushし、失敗時はキューを保存できる範囲で永続化する。保存不能なら未送信であり、クラウドへ保存済みとしない。実行環境ごとの外部通信権限・資格は個別に検証する。イベントoutcome=passはその観測に対する結果で、ハーネスの正式な採用・監査状態の更新を代替しない。
