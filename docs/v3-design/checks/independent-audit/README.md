# v3設計の独立監査

**最新判定: fail。GPT-6 Astraがopen major 4件、blocker 0件を指摘した。**

2026-09-22、ユーザーの指示により、起草した主担当とは別のCodex CLIプロセスで監査した。前回のノード検査は自己レビューのみだったため、この記録で独立監査を追加する。過去の自己レビューを独立監査だったことにはしない。

## 最新のAstra監査

- 実行: Codex CLI 0.155.1 / `gpt-6-astra`、reasoning effort `high`。新規セッション、read-only。モデルの代替なし。
- 対象: tree revision 18。v2規範、10ノード全20文書、全15manifest・snapshot・handoff・検査記録・要求・関連ログを含む134ファイルの全文。
- 入力方法: CLIのシェル読取りがポリシーで拒否されたため、主担当が読み出した全文を元の行番号とSHA-256付きでstdinへ渡した。読み取り権限を拡張する回避は行っていない。
- [Astraの監査回答原文](astra-bundle-round-1/report.md)
- [依頼と入力全文](astra-bundle-round-1/prompt.md)
- [実行記録](astra-bundle-round-1/execution.json)・[入力と出力の照合](astra-bundle-round-1/verification.md)
- 過去の独立監査回答は入力に含めず、READMEのpass表示を根拠にしないよう指定した。

| 指摘ID | 重大度 | 内容 | 状態 |
| --- | --- | --- | --- |
| AV3-001 | major | 監査が保証する仕様・実装・証拠の版集合と、不変な参照の契約が不足 | open |
| AV3-002 | major | 実験サイクル終了から周期監査を起動するownerと受渡しが未定義 | open |
| AV3-003 | major | 取消要求自身のoperation IDと、取消対象operationの関連が未定義 | open |
| AV3-004 | major | 過去3subgoalのauthoring閉包に、seam参加側入力またはその固定参照が不足 | open |

監査後に [変更イベント](../../changes/events/EV-ASTRA-20260922-01.md) を登録した。設計の意味版はまだ修正していない。過去のmanifest、snapshot、公開記録、監査回答は上書きしていない。現在の3system閉包に参加側情報があることと、過去の閉包の不足は区別する。

Astraはハッシュを再計算していない。134ファイルの監査中の不変性と保存物のハッシュは主担当が別途照合した。添付していない原資料は、監査回答に記載された要約範囲での評価に留まる。

## 過去のGPT-5.5監査

- 実行: Codex CLI 0.146.0 / GPT-5.5。新規の一時セッション、`read-only` サンドボックス。
- 対象: `tree_revision: 18` のv3設計。10ノードの設計・根拠20文書、現行v2基準、現在の3system closure/handoffなど。
- [監査依頼](codex-round-1-retry/prompt.md)
- [監査回答の原文](codex-round-1-retry/report.md)
- [実行情報・開始時の入力ハッシュ](codex-round-1-retry/execution.json)
- [監査前後の入力照合](verification.md)
- 実際のCLIイベントは同ディレクトリの `stdout.jsonl`、診断出力は `stderr.txt` に保存した。

GPT-5.5は意味レビューの7観点と3systemをpassとした。その時点では修正不要と扱ったが、後続のAstra監査で重大指摘が見つかったため、現在の受入判定はfailである。起草者はどちらの監査回答も編集していない。

監査者はハッシュの規約化再計算を行っていない。この点を監査者の検証実績へ含めない。主担当による入力の不変性と保存物のハッシュ照合は別記録に示す。実装、製品テスト、実運用での効果は依然として未検証。

## 起動時の失敗を含む実行履歴

| 試行 | 結果 |
| --- | --- |
| `round-1` | Claude Code 2.1.150。制限環境で進捗出力がなく、主担当がこのプロセスだけを終了。監査結果なし。 |
| `round-1-retry` | Claudeを逐次出力で再起動。OAuthトークン失効の401で終了。監査結果なし。 |
| `codex-round-1` | Codex CLIの既定モデルgpt-6-astraが新しいCLIを要求し、400で終了。監査結果なし。 |
| `codex-round-1-retry` | 利用可能なGPT-5.5を指定して監査完了。CLI終了コード0、判定pass。 |
| `astra-round-1` | CLI 0.155.1 / Astraは起動したが、読取りコマンドがポリシーで拒否されblocked。設計は未評価。 |
| `astra-bundle-round-1` | 同CLI / Astraへ134ファイルの全文を入力して監査完了。終了コード0、判定fail、major 4件。 |

起動失敗・読取り不能の実行を設計合格の根拠に含めない。既存のCLI、認証、ユーザーのモデル設定は変更していない。Astra対応のため公式CLI 0.155.1を作業専用の一時ディレクトリへ導入し、呼出し単位でモデルを指定した。

これは正本化後の対象版に対する独立監査であり、過去のv2 authoring closureにある自己レビュー記録の置換ではない。以後の意味変更に対する合格を先取りするものでもない。
