# AIDE v3 独立再監査（Claude Opus 5.5 / High, round 6）

## 1. 判定

**pass（通常のハーネス条件）／open blocker 0・major 0・minor 1（CIV3-020）**

**今回の指摘ゼロ条件は満たしません。** minorが1件残っています。

- CIV3-019は、前回の反例(i)(ii)と4項目の解消条件に対してclosedです。
- CIV3-019の修正文言（`messages.md:19`）が回復adoptionより広い「提案」全般に掛かるため、新しい反例が1件見つかりました。これをCIV3-020として起票します。
- 過去closedのCIV3-001〜018に回帰はありません。

## 2. 前回openの指摘

| ID | 判定 | 根拠（元行番号） |
| --- | --- | --- |
| CIV3-019 | closed | `messages.md:12,13,18-20`、`records.md:99`、`experiment.md:11`、`record.md:8`、scenarios AR〜AV |

### CIV3-019：回復adoptionの提案者がrecovery_refを得る経路

前回の最小修正4項目との対応は次のとおりです。

1. **取得元**：S-CONTEXTの応答に、有効なrecovery_ref、要求すべきreview_mode、対象change_ids、失敗監査/open指摘が加わりました（`messages.md:12`）。root seamの「subject・進行判定」（設計`design.md:74`）の範囲内です。未準備時の「準備待ちと理由」は、同seamのfailure「理由と再読先を返す」（`design.md:76`）に収まります。
2. **提案側**：学習役はadoptionの直前に照会し、同じ参照をoperationとsubjectに入れてhashを固定します（`experiment.md:11`、`messages.md:13,18`）。
3. **受付側**：欠落・不一致は必要な参照・scope/change_ids・再提出条件を付けてblockedとし、subjectを黙って差し替えません（`messages.md:19`、`record.md:8`、`records.md:99`）。
4. **シナリオ**：AR〜AVが追加されています。

反例の解消状況は次のとおりです。

- **(i) 取得元がなく停止する**：S-CONTEXTが参照を返すため成立しません（AR）。null提案はblockedになりますが、再照会・新IDで再提出する経路があります（AS）。
- **(ii) H1/H2の食い違い**：提案、監査要求、取消のexpected_subject_hashはすべて学習役が固定した同じhashです（`records.md:99`、AT）。設計`design.md:197`（同じexpected_subject_hash）と`design.md:205`（S-CYCLEの提案subject一致）を満たします。
- blockedは受付手順2（`record.md:8`）で返り、手順3の予算予約・監査送信より前です。そのため、監査が走り続ける費用消費も起きません。

### 回帰の確認（CIV3-001〜018）

- **016**：回復adoptionの受理・一括反映条件（`records.md:97-98,102-110`）は無変更です。今回、提案側から到達できるようになりました。
- **010**：再提出は新subject・新operation_idで行い、元payloadは変えません（`messages.md:19`）。同ID再送は確定状態を返します（`messages.md:23`）。major残りの同対象を再実行する例外（`messages.md:58`）も不変です。
- **record.md:8の変更**：「解決してsubjectを固定」から「照合」に変わりました。S-RECORDが再帰収集する責任（`design.md:201`）は照合の中で果たされます。S-CYCLEがsubjectを揃える責任（`design.md:205`）とも一致します。学習役はS-CONTEXTから版集合とsubjectを得られます（`messages.md:12`）。欠落はblockedになります（`subject.md:22`）。回帰ではありません。
- **S-CONTEXTの読取り専用**：`messages.md:20`で、読取り時にstateを書かないことが明記されました。準備待ちは永続化されません。ただし再照会のたびに同じ理由が再導出されるため、停止には至りません（AU）。
- **011〜015、017、018**：該当節は無変更で、依拠先も同一です。
- **001〜009**：無変更です。

## 3. 新規指摘

### CIV3-020 — minor：回復中scopeでのblocked条件が、adoption以外の提案にも掛かる

- **基準**：DDD-04、AIDE-02、G6
- **箇所**：
  - `messages.md:19`：「回復中scopeへの**提案**でrecovery_ref/review_modeが欠落・不一致ならblocked」。S-PROPOSALの「提案」にはplan/adoption/withdrawal/cycle_closedが含まれます（`messages.md:13`）。
  - 一方、同じ規則を述べる他の箇所はadoptionに限定しています：`messages.md:13,18`、`record.md:8`、`experiment.md:11`、`records.md:97-99`。
  - 回復要求になれるのはperiodic/adoption・phase=implementationだけです（`records.md:97`、`templates/operation.md:51`）。planはbaseline-recoveryを名乗れません。
- **反例**：
  1. AJ後、scope Xは回復中（recovery_records[R]がfailed、blocked_scopesがactive）です。
  2. 修正は新サイクルで行います（`orchestrate.md:15`）。experimentの手順1-2に従い、まずplanを提案します（review_mode=normal、recovery_ref=null、scope=[X]）。
  3. S-CONTEXTはscope Xについて「要求すべきreview_mode=baseline-recovery」を返します（`messages.md:12`）。`messages.md:19`を字義どおり読むと、planは不一致でblockedになります。
  4. 再提出でbaseline-recoveryを付けても、planは回復要求になれないため条件を満たせません（`operation.md:51`）。修正計画は恒久的にblockedとなり、CIV3-016/019で開いた修正経路の入口が閉じます。
  5. 「新subject」を持たないwithdrawal/cycle_closedは対象外と推論できます。しかしplanについては、他文書と照合しない限り解釈が分かれます。
- **影響**：誤った採用・基準更新は起きず、安全側です。ただし実装者の読み方によって、回復中scopeでの修正計画が進まなくなります。scenarios AR〜AVはadoptionしか扱わず、この分岐を検出していません。
- **深刻度の理由**：他の4箇所がadoptionに限定しているため、多数の文脈からは正しく読めます。影響も回復中の一経路に限られるので、CIV3-019と同じ基準でminorとします。「重要契約を複数解釈できる」（`audit.md:39`）とみなせばmajorにもなり得ます。この比較のうえでの判断で、分類を下げたものではありません。
- **最小の修正**：
  1. `messages.md:19`を「回復中scopeへの**adoption**提案で」に限定する。
  2. 同じ箇所に「plan/withdrawal/cycle_closedはreview_mode=normal・recovery_ref=nullのまま通常規則で扱う（planはplan phaseの基準で判定し、implementationの回復状態は進行判定・保留として返す）」と一文を加える。
  3. S-CONTEXTの「要求すべきreview_mode」がadoption向けであることを`messages.md:12`で明示する。
  4. 「回復中scopeへの修正計画plan」のシナリオを追加する。

## 4. 3systemの充足、確認範囲と限界

| system | 判定 | 残指摘 |
| --- | --- | --- |
| S-RECORD | pass（minor 1） | CIV3-020（受付規則の対象kind）。019は解消 |
| S-CYCLE | pass（minor 1） | CIV3-020（修正サイクルのplan提出）。019は解消 |
| S-AUDIT | pass | 無変更。回復分類（`audit.md:10`）、cancelのhash一致（AT）を確認 |

DDD-01〜05とAIDE-01〜03は、CIV3-020を除いて設計tree 80と矛盾しません。

**引き継いだ確認**
- 設計tree 80の正本20文書とrequirements（hashは前回と同一）。
- 無変更のファイル：README、criteria、migration、budgets、subject、audit/design/precheck/intake/orchestrateの各役割、全テンプレート、tools、tests、examples。
- round-5のpackage.jsonに記載されたhashと添付ファイルのhashの一致（主担当の値の照合のみで、再計算はしていません）。
- 実行系7ファイルのhashがround-1の実行時と同一であること。

**今回読み直した範囲**
- round-6のdiff全体と、変更4ファイルの全文（messages、records、experiment、record）。
- 波及先：`records.md`の一括反映・差分・回復の節、`operation.md:51-52`、`subject.md`、`orchestrate.md:13-15`、`experiment.md:17-18`。
- 設計root §5（AV3-001〜003、005）とseam契約（74〜103行）、S-CYCLE §5、S-RECORD §5。
- scenarios AR〜AV。

**未読**
- harness-v2、ログ類、`docs/v3-design/README.md`、closure/handoffの本文、package検査のコード。
- round-4のscenarios本文（今回は添付なし。前回の確認を引継ぎ）。

**静的監査の限界**
- テストの再実行、hashの再計算、ツールの使用は行っていません。
- Pythonの15テスト、製品例の5テスト、CLIの成功は、round-1の実行ログからの引継ぎです。
- AR〜AVは主担当の手動照合であり、台帳エンジンを実行した証拠ではありません。
- 実課金、回復監査の実運用、運用効果は未実証です。