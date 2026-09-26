# AIDE v3の実装

[harness-v3](../../harness-v3/README.md)に、監査済み設計tree 80をMarkdownハーネスとして実装した。
この実装は実行規約、役割手順、テンプレート、入力固定ツール、実行例で構成する。Claude CLI / Opus 5.5 / Highのround 3限定再監査はpass（open blocker/major 0）。初回9件と追加3件の計12件がclosedとなった。新規のminor 3件は[残課題](audits/claude-opus-5-5-high-round-3/follow-up.md)として保持する。[監査の原文と実行記録](audits/README.md)を保存している。

未監査差分のscope/phase別管理、差分と波及先に限る再監査、監査・記録も含む予算予約を具体化した。bundleのhash照合、各追加実行前の進行判定、参照例、周期設定の保存、重複JSONキーの拒否、複数上限の記録も修正した。[手動照合](verification/claude-fixes-round-1/scenarios.md)を保存している。
さらに、失敗済み周期監査の修正待ち、adoption監査に既存差分を含める規則、差分起点の保持、予算の判断役と台帳書込み役を明記した。[追加8ケース](verification/claude-fixes-round-2/scenarios.md)を照合している。

## 設計との対応

| 設計条件 | 実装先 | 確認方法 |
| --- | --- | --- |
| G1・SR1 | 配置規則、spec/model/rationale、design/precheck | 4階層の主親、system正本、uses_systems、条件割当の規約照合 |
| G2・SR2 | specの説明順と具体例、AIDE-02 | 説明と詳細の照合。本人理解の実証は未実施 |
| SR3・SR5 | records/messages、record、state/operation | 一括切替、通常版照合、取消・二重反映・遅延結果の手順確認 |
| G3・SC1〜SC5 | experiment、計画/trial、実行例 | 同じ受入テストで不具合検出→修正→CLI操作、旧試行の固定 |
| G4・SA1・SA4 | audit分類、cycle_closed/activity_due、baseline/差分 | 計画・採用・周期、daily-passと正式監査を区別する経路照合 |
| G5・SA2〜SA3 | DDD-01〜05、AIDE-01〜03、指摘と終了条件 | 適用理由・反例・解除条件と独立性の確認 |
| G6・SR4・SA5 | subject、取消、モデル変更、orchestrate | 版集合・依拠先・影響scope・中断からの再開を照合 |
| AV3-001〜005 | records/subject/messagesと対応テンプレート | 実装/証拠/定義固定、終端、取消、両端入力、共有定義の伝播 |
| CIV3-001〜009 | records/budgets、audit/experiment、templates、snapshot | 差分消去、限定再監査、費用予約・停止、hash照合、設定の復元、入力拒否 |

初期実装の保証phaseはplan / implementationとした。操作kindのadoptionとperiodicは同じimplementation保証を扱う。
これにより周期監査後の実装基準を、次の採用の分類にも参照できる。planの保証は混同しない。

## 検証

- [補助ツール検証](verification/claude-fixes-round-1/snapshot-tests.json): 不変保存、パス・故障処理、junction等の既存12件に重複キー拒否と正常hashの確認を加え、15テストがpass（skipなし）。
- [実行例の結果](verification/claude-fixes-round-1/exercise.json): 意図的な件数計算の不具合を同じテストで検出し、修正版5テストとサンプルCLI操作が成功。旧試行の内容を保持。
- [Claude指摘の手動照合](verification/claude-fixes-round-1/scenarios.md): plan履歴・重なるscope・限定再監査・監査予算・追加実行停止・周期復元等の16ケース。Markdown手順の静的確認であり、自動運転の証拠ではない。
- [予算シナリオ](verification/budget-scenarios.md): 費用不明時の停止と、根拠ある上限で継続できる場合を手動照合。
- [初回監査の回答](audits/astra-round-1/report.md): 原文と固定入力を保持。重大指摘の停止条件を明記し、軽微2件にも障害注入とjunction検証を追加した。Python実行環境は3.13であり、3.10/3.11そのものを実行したとは主張しない。
- 最初の通常サンドボックスでの実行は、Windowsの一時ディレクトリへのアクセス拒否で開始できなかった。同じ検証を通常のローカル権限で実行し、個別の一時フォルダと保存結果だけを作成した。ネットワークは使わない。

snapshotツールは選択したファイルの内容固定と改変検出だけを行う。意味分類、台帳の更新、許可・監査判断、採用はMarkdown手順を実行する担当の責任である。
実行例はサンプルデータの自動演習であり、独立監査・全採用手順・実ユーザー評価を実施済みと扱わない。

## 設計・履歴の境界

[元の設計](../v3-design/README.md)の20文書と既存閉包・監査原文は変更しない。v2からの移行は必要な枝だけを参照付きで行う。
v3を使った継続的な開発で、最初の実物までの時間、監査停止回数、手戻り、記録不一致、本人理解を今後測る。
