# AIDE v3 独立再監査（Claude Opus 5.5 / High, round 5）

## 1. 判定

**pass（通常のハーネス条件）／open blocker 0・major 0・minor 1（CIV3-019）**

**今回の指摘ゼロ条件は満たしません。** minorが1件残っています。

- CIV3-016、017、018は、前回の解消条件と反例に対してすべてclosedです。
- CIV3-016の修正（回復adoption）の波及先で、新しい反例が1件見つかりました。修正提案を作る学習役が、必須のrecovery_refを得る経路が規定されていません。これをCIV3-019として起票します。
- 過去closedのCIV3-001〜015に回帰はありません。

## 2. 前回openの指摘

| ID | 判定 | 根拠（元行番号） |
| --- | --- | --- |
| CIV3-016 | closed（波及はCIV3-019） | `records.md:97-99,104,107,109`、`messages.md:58`、`roles/audit.md:10`、`roles/record.md:15`、`templates/operation.md:51`、`templates/audit.md:48`、scenarios AJ〜AM |
| CIV3-017 | closed | `README.md:93-94`、`orchestrate.md:13-14`、`messages.md:53,57` |
| CIV3-018 | closed | `records.md:46,87`、`templates/state.md:36,39,49`、`record.md:23`、`orchestrate.md:15`、`messages.md:57`、scenarios AO〜AQ |

### CIV3-016：回復監査failの後に修正を採用する経路

前回の反例を追いました（K1喪失 → B2の回復periodicがF2でfail → F2を直したB3）。

1. 回復要求はkind=adoptionでもよくなりました。終点は提案bundle、baseline_refsはinitialです（97行）。
2. 修正提案には、喪失項目c1・新項目c2・元の失敗監査・open指摘を含めます（98行）。
3. 「起点欠落を理由に通常の累積差分経路へ戻さない」と明記されています（98行）。前回問題にした77行のblockedには落ちません。
4. 受理条件2（104行）は、adoption用にbase_bundle・通常版・取消状態の再確認を加えています。
5. 一括保存の内容（109行）は、current切替、操作確定、新基準、c1/c2の解消、保留解除、通知です。失敗時は旧currentを維持します。
6. 取消先着・再送は通常規則を適用します（109行、scenarios AL/AM）。

解消条件（回復とadoptionの併用、一括反映、既存の取消・再送条件の維持）は満たしています。

### CIV3-017：入口READMEのサイクル完了条件

- `README.md:93`は完了条件を「必要な周期判定が合格または理由付きskip」に変えました。
- 94行は、修正待ち・予算待ち・実行中を未完了とし、失敗の確定だけでは完了にしないと明記しています。
- この文言はorchestrate:13-14、messages:53と一致します。前回の反例（require-review確定で閉じられる）は成立しなくなりました。

### CIV3-018：保留解除と待機通知の一括更新

- 一括反映の手順4（`records.md:46`）とstateの原子更新の定義（`state.md:49`）に、保留解除根拠・後続要求と、通知の待機状態・後続結果参照が加わりました。
- 通常のadoption/periodicへの適用は87行で明記されています。
- blocked_scopesにactive/resolvedが加わりました（`state.md:39`）。
- 前回の反例（切替後、解除前に中断）は、一組の原子更新になったため成立しません（AO/AP）。
- 解除の範囲も限定されています。計画合格だけでは解除せず、別原因・対象外は残します（87行、AQ）。
- 抑止側の読み手（`experiment.md:17-18`、`messages.md:52`、`orchestrate.md:4`）は「未解除」で判定します。state.md:39の「activeだけを抑止」と矛盾しません。

### 回帰の確認（CIV3-001〜015）

- **010**：回復の例外がadoptionへ広がりました。ただし新subject（修正bundle）が必要で、同じrecovery_id/subjectの重複起動は禁止です（97行）。「内容不変の再実行にmajor残りの対象を使わない」（messages:55）も維持されています。同じ失敗対象を再起動する抜け道にはなりません。
- **011**：条件3の置換は回復時だけです。phase・change_ids・affected_scope全体の被覆は免除しません（107行）。
- **012・013**：回復adoptionの監査費用は、実験予算の既定割当（budgets:16）を通ります。予約の書き手は一人のままです。
- **014・015**：完了表示と回復periodicの意味は不変です。records.md:109の文は「adoptionなら」が修飾する範囲が読みにくくなっています。ただしperiodicの一括保存は101行、87行、state.md:49で担保されるため、指摘にはしません。
- **001〜009**：該当する節と依拠先は無変更です。

## 3. 新規指摘

### CIV3-019 — minor：回復adoptionの提案者が、必須のrecovery_refを得る経路がない

- **基準**：DDD-04、AIDE-03、G6
- **箇所**：
  - `templates/operation.md:51`：kind=adoptionの回復にもreview_mode・recovery_refを必須とし、subjectにも含める。operationテンプレートは提案と監査要求で共用です（`templates/README.md:13`）。
  - `records.md:97-98`：記録役がrecovery_ref入りのsubjectを固定し、「修正提案」をbaseline-recoveryへ渡す。
  - `experiment.md:7`：adoption提案は学習役が作る。
  - `messages.md:12-13`：S-CONTEXTの応答にもS-PROPOSALの必須項目にも、recovery_ref・review_modeがない。
  - 設計root `design.md:83,197,205`：提案はsubject/subject_hashを持つ。監査cancelには同じexpected_subject_hashを渡す。S-CYCLEは提案subjectを計画・証拠と一致させる。
- **反例**：
  1. AJの後、学習役はS-CONTEXTからblocked X、失敗要求、F2を得てB3を作る。recovery_refは得られないため、テンプレート既定のnullでadoption A1（subject_hash H1）を提出する。
  2. 記録役はrecovery_ref入りのsubject H2（≠H1）を作る必要がある。ここから読み方が分かれる。
     - (i) 必須項目の欠落としてA1を拒否する。学習役には規定上の取得元がなく、修正を採用できない。
     - (ii) 記録役がH2で監査する。提案payloadのH1と判定対象のH2が異なるため、`records.md:44`「判定が同じ対象を指す」を満たさずstaleになる。H2を正とみなすと、学習役の取消（expected H1）は記録側では通る。一方、監査cancelは「同じexpected_subject_hash」なのでH2の監査要求と一致せず拒否される。その結果、監査が走り続けて予約費用を消費する。S-CYCLEが保存した提案subjectも、採用したsubjectと一致しない。
- **影響**：誤った採用・基準更新は起きず、安全側です。ただし実装者の読み方によって、停止・恒久stale・取消の不整合に分かれます。CIV3-016で開けた経路が、実装次第で再び閉じます。
- **深刻度の理由**：影響は回復例外の中の一経路に限られ、どの読み方でも保証を破りません。CIV3-015/016と同じ「到達性の欠落」なのでminorとします。ただし「重要契約を複数解釈できる」（`audit.md:39`）とみなせばmajorにもなり得ます。分類を下げたのではなく、この比較のうえでの判断です。
- **最小の修正**：
  1. S-CONTEXTの進行判定/subject応答に、scopeで有効なrecovery_ref（loss record）と、要求すべきreview_modeを含める（`messages.md:12`）。root seamの既存項目「subject・進行判定」の範囲内で足ります。
  2. 学習役はadoptionのsubjectとoperationにrecovery_refを含めて提案する（`messages.md:13`、`experiment.md:7`）。
  3. 記録役は、回復中scopeへのadoptionでrecovery_refが欠落・不一致なら、必要な参照を示してblockedを返す。subjectを黙って書き換えない（`records.md:98`）。
  4. この反例をシナリオに追加する。

## 4. 3systemの充足、確認範囲と限界

| system | 判定 | 残指摘 |
| --- | --- | --- |
| S-RECORD | pass（minor 1） | CIV3-019（回復adoptionの受付）。016/018は解消 |
| S-CYCLE | pass（minor 1） | CIV3-019（提案subjectの構成）。017は解消 |
| S-AUDIT | pass | 回復の分類（`audit.md:10`）、テンプレート48行を確認。SA1〜SA5に欠落なし |

DDD-01〜05とAIDE-01〜03は、CIV3-019を除いて設計tree 80と矛盾しません。

**引き継いだ確認**
- 設計tree 80の正本20文書とrequirements（hashは前回と同一）。
- 無変更のファイル：criteria、migration、design/experiment/precheck/intakeの各役割、budgets、subject、テンプレート（spec/model/rationale/experiment/trial/subject）、tools、tests、examples。
- round-4のpackage.jsonに記載されたhashが、添付ファイルのhashと一致すること（主担当の値を照合しただけで、再計算はしていません）。

**今回読み直した範囲**
- diff全体。
- 変更された9ファイルの全文。
- 波及先として、`records.md`の一括反映・差分・回復の節、`messages.md`の周期・取消の節、`experiment.md`の提案と予算、S-CONTEXT/S-PROPOSALの項目。
- 設計root §5（AV3-001〜003、005）とseam契約、S-CYCLE §5、S-RECORD §5。
- round-4のscenarios 8ケース（AJ〜AQ）。規約と整合していましたが、提案者がrecovery_refを得る経路は扱っていません。

**未読**
- harness-v2、ログ類、`docs/v3-design/README.md`、closure/handoffの本文、package検査のコード。

**静的監査の限界**
- テストの再実行、hashの再計算、ツールの使用は行っていません。
- Pythonの15テスト、製品例の5テスト、CLIの成功は既存の実行ログ（round-1）の引継ぎです。
- 8ケースは主担当の手動照合で、台帳エンジンを実行した証拠ではありません。
- 実課金、回復監査の実運用、運用効果は未実証です。