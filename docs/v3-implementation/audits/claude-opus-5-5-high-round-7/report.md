# AIDE v3 独立再監査（Claude Opus 5.5 / High, round 7）

## 1. 判定

**pass／open blocker 0・major 0・minor 0**

**今回の指摘ゼロ条件を満たします。**

- 前回openだったCIV3-020はclosedです。
- 過去closedのCIV3-001〜019に回帰はありません。
- 新規指摘はありません。

## 2. 前回openの指摘

| ID | 判定 | 根拠（元行番号） |
| --- | --- | --- |
| CIV3-020 | closed | `messages.md:12,19,20`、diff 0008・0016・0017、scenarios AW〜AZ |

### CIV3-020：回復中scopeのblocked条件がadoption以外に掛かる

前回の最小修正4項目との対応は次のとおりです。

1. **blocked条件の対象を限定**
   - `messages.md:19`が「回復中scopeへの**adoption**提案で」に変わりました。
   - 同じ規則を述べる他の箇所もadoptionに限定されており、表現が揃いました（`messages.md:13,18`、`record.md:8`、`experiment.md:11`、`records.md:97-99`）。
2. **plan/withdrawal/cycle_closedの扱いを明記**
   - `messages.md:20`で、これらはnormal/nullの通常規則で扱い、adoption専用の欠落判定を適用しないと定めました。
   - planはplan phaseの基準で判定します。実装の保留は解除せず、許容された限定検証だけを進めます。
   - これは設計`design.md:191`（採用・試作進行の保留、原因解消の候補作成・限定検証は可）、`experiment.md:17-18`、`state.md:39`（許容される限定検証）と一致します。
3. **S-CONTEXTの返却値の用途を明示**：`messages.md:12`で、返すrecovery_ref/review_modeが「adoption向け」と明示されました。
4. **シナリオ**：AW（修正plan）、AX（後続adoption）、AY（取消）、AZ（終了通知）が追加されています。

前回の反例の解消状況は次のとおりです。

- **手順3〜4（planが恒久的にblockedになる）**：planにはadoption専用条件が適用されなくなったため、成立しません（AW）。
- planはbaseline-recoveryを名乗れません（`records.md:97`、`operation.md:51`）。今回の修正はこの制約と矛盾せず、planに満たせない条件を課す状態は解消しました。
- **手順5（withdrawal/cycle_closedの解釈の揺れ）**：明文化されました。
  - withdrawalのexpected_subject_hashは、回復subjectのhashをそのまま使います（`records.md:99`、AY）。
  - cycle_closedは、失敗要求への対応付けとackを通常どおり行います（`messages.md:56-57`、AZ）。

### 回帰の確認（CIV3-001〜019）

- **019**：S-CONTEXTはadoption向けに有効なrecovery_refを引き続き返します（`messages.md:12`）。欠落・不一致時のblockedと新IDでの再提出も不変です（`messages.md:19`）。反例(i)(ii)は再発しません。
- **016**：回復adoptionの受理・一括反映条件（`records.md:97-110`）は無変更です。
- **010**：再提出は新subject・新operation_idで行います。同ID再送は確定状態を返します（`messages.md:19,24`）。
- **その他**：今回変更されたのは`messages.md`だけです。
  - `records.md`、`record.md`、`experiment.md`、`operation.md`、`state.md`、`audit.md`（役割・テンプレート）、`subject.md`（契約・テンプレート）、`budgets.md`、READMEのhashは、round-6の入力と同一です。
  - 001〜009と011〜018は、依拠先を含めて不変です。

## 3. 新規指摘

**なし。** 前回の最大IDはCIV3-020です。今回、CIV3-021以降の起票はありません。

検討したうえで起票しなかった候補は次の2件です。

- **planが誤ってbaseline-recoveryまたはrecovery_refを付けて届く場合**
  - 回復要求はperiodic/adoptionに限られます（`operation.md:51`、`records.md:97`、`audit.md:10`）。
  - `messages.md:20`はplanをnormal/nullと定めています。
  - このため不適合なpayloadとして、一般規則の理由付きblocked（`messages.md:25`）で扱えます。誤った受理や基準更新の経路はありません。
  - 指摘にするには、欠けている契約や具体的な支障が必要ですが、見つかりませんでした。好みによる追加要求は起票しません。
- **修正planのplan監査で「重大な既知不具合」により止まるか**（`audit.md:9`）
  - 止めるのは「不一致や範囲外」の場合です。原因解消の候補は委任内で許容されています（`design.md:191`）。
  - 今回の変更前から同じ文言で、回帰ではありません。

## 4. 3systemの充足、確認範囲と限界

| system | 判定 | 残指摘 |
| --- | --- | --- |
| S-RECORD | pass | なし（受付規則の対象kindが確定） |
| S-CYCLE | pass | なし（修正サイクルのplan・adoption・取消・終了の経路が成立） |
| S-AUDIT | pass | なし（無変更。回復分類はperiodic/adoptionのまま） |

DDD-01〜05とAIDE-01〜03について、設計tree 80（root §5のAV3-001〜003・005、seam revision 3）とrequirements U1〜U8、A2の範囲に対する欠落・矛盾は見つかりませんでした。

**引き継いだ確認**
- 設計の正本20文書とrequirements（hashは前回と同一）。
- 無変更のharness-v3の各ファイル（criteria、migration、budgets、subject、各役割、全テンプレート、tools、tests、examples）。
- round-6の`package.json`に記載された`messages.md`のhash（dd6571da…）は、添付本文のhashと一致します。これは主担当の値の照合のみで、再計算はしていません。
- 実行系7ファイルのhashがround-1と同一であること。

**今回読み直した範囲**
- round-7のdiffとchanges.md。
- `messages.md`の全文。
- 波及先：`records.md:91-110`、`record.md:8,15`、`experiment.md:11,17-18`、`operation.md:51`、`state.md:39,43`、`audit.md:9-10`、`orchestrate.md:13-15`。
- 設計`design.md:74-103,186-197`。
- scenarios AW〜AZ。

**未読**
- harness-v2、ログ類、closure/handoffの本文、package検査のコード。
- round-4/5のscenarios本文（前回までの確認を引継ぎ）。

**静的監査の限界**
- テストの再実行、hashの再計算、ツールの使用は行っていません。
- Pythonの15テスト、製品例の5テスト、CLIの成功は、round-1の実行ログからの引継ぎです。
- AW〜AZは主担当の手動照合であり、台帳の全自動運転や実課金を検証したものではありません。
- 回復監査の実運用、効率改善、利用者の理解は未実証です。
- 今回のpassは設計・規約の整合性に対する判定です。