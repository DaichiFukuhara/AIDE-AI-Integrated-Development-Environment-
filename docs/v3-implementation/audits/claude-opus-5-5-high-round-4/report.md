# AIDE v3 独立再監査（Claude Opus 5.5 / High, round 4）

## 1. 判定

**pass（通常のハーネス条件）／open blocker 0・major 0・minor 3（CIV3-016〜018）**

**今回の指摘ゼロ条件は満たしません。** minorが3件残っています。

- CIV3-013、014、015はいずれも、前回示した解消条件と反例に対してclosedです。
- CIV3-015の修正後に、別の反例が残りました。起点喪失の回復監査がfailし、その修正を採用する経路が閉じたままになります。これはCIV3-016として新規に起票します。
- 過去closedのCIV3-001〜012に回帰はありません。

## 2. 前回openの指摘

| ID | 判定 | 根拠（元行番号） |
| --- | --- | --- |
| CIV3-013 | closed | `budgets.md:12-15`、`templates/state.md:41`、`intake.md:6`、`templates/experiment.md:16`、`messages.md:69` |
| CIV3-014 | closed | `record.md:18`、`orchestrate.md:14-15`、`messages.md:53,57`、`templates/state.md:36` |
| CIV3-015 | closed（残る経路はCIV3-016） | `records.md:92-107`、`subject.md:18,37`、`roles/audit.md:10`、`messages.md:58`、`templates/operation.md:5-6,51`、`templates/audit.md:7-8,48`、`templates/state.md:23,43` |

### CIV3-013：上限値の正本

- 正本はdefinition_refが指す不変計画・委任です。stateは写しだと明記されています（`budgets.md:12`、`state.md:41`）。
- 前回の反例（上限を10から6へ変更）は次のように処理されます。
  1. 学習役が旧/新の参照を記録役へ渡す。記録役は写しの更新と未送信予約の再判定を、一つのstate更新で保存する（13行）。
  2. 同期が済むまで、影響する口座の予約・送信を保留する。判定時と送信直前に、参照と写しの全項目を照合する（14行）。
  3. これで古いlimit=10を使う読み方はなくなります。
- `intake.md:6`も「学習役で固定し、記録役へ切り替えて保存」に揃っています。
- 下方変更で既存使用量が上限を超える場合の扱い（15行）は、既存の32行と矛盾しません。
- 設計のS-CYCLE「作業予算を所有」とも整合しています。

### CIV3-014：修正待ちの完了表示

- `record.md:18`に三つ目の結果（失敗要求への修正待ちの対応付け）が追加されました。
- `orchestrate.md:14`は「実験は終了、サイクル全体は未完了（周期判定待ち）」と表示し、待機理由・担当・解除条件を引き継ぎます。
- 前回の二通りの読み方は、役割規約の中では解消しています。
- 入口の`README.md`に残る食い違いはCIV3-017として別に起票します。

### CIV3-015：起点の喪失

前回の反例（K1が喪失、currentは健全）を追いました。

1. 同一hashの復元を先に試す（92行）。
2. 復元できなければloss recordを作る（93行）。
3. scopeを閉じ、旧基準を進行許可に使わない（94行）。
4. recovery_refを含む新subjectで、baseline=initialのperiodicを起動する（96行）。
5. 合格したら3条件を照合し、revalidated-after-lossとして一括で解消する（99-107行）。

- `messages.md:52`の重複抑止とは、subject_hashが異なるため衝突しません。58行でも例外として明示されています。
- 解消条件の3点（初回扱い、合格まで保持、喪失の根拠記録）はすべて満たしています。

### 回帰の確認（CIV3-001〜012）

- **010**：失敗対象の再起動抑止（`messages.md:52-55`）は維持されています。回復の例外（58行）はloss record・新subject・既知指摘の非解除（`records.md:103`）に限定されており、抜け道になりません。
- **011**：回復時に置き換えるのは条件3の旧新版比較だけで、change_idsとaffected_scopeの被覆は免除しません（`records.md:105`）。通常のadoption閉包（73-87行）は無変更です。
- **012・003**：予算判断の所有と一人の記録役による予約（`budgets.md:8-10`、`messages.md:66-71`）は不変です。回復のperiodicも通常の口座割当を通ります（`budgets.md:17`）。
- **001・002・004〜009**：関係するファイル・節は無変更で、依拠先も変わっていません。

## 3. 新規指摘

### CIV3-016 — minor：回復監査がfailすると、修正を採用する経路がない

- **基準**：G6、AIDE-03、DDD-03
- **箇所**：
  - `records.md:73,75,77`：正式なadoptionも既存項目の起点を要求し、起点が欠ければblocked
  - `records.md:94`：旧基準は使えない
  - `records.md:96,102`：回復はkind=periodicで、終点はcurrentのみ
  - `records.md:107`：失敗時は保留を維持
  - `roles/audit.md:15`：daily-passには監査済みの意味が必要
- **反例**：
  1. K1が復元不能になる。回復監査がcurrent B2を初回相当で読み、B2にmajor F2を見つける（前回の起点からの累積差分は未監査なので、起こり得ます）。
  2. F2を直したB3のadoptionは、c1をK1起点で含める必要があるため77行でblockedになる。
  3. daily-passもscopeに有効な基準がないため使えない。
  4. 回復はcurrent（B2のまま）しか対象にできないため、何度起動しても失敗する。
  5. 結果としてXは恒久的に修正待ちになる。
- **補足**：シナリオAH（`scenarios.md:16`）は「指摘の解消が必要」と書くだけで、修正の採用経路を示していません。
- **影響**：安全側に倒れる（誤った受理は起きない）。ただし設計AV3-002（root `design.md:191`）の「原因を解消し、合格済みと保留を区別して再開する」経路が、このscopeでは閉じます。深刻度は、同じ性質の問題を扱ったCIV3-015と揃えてminorとします。
- **最小の修正（どちらか一つ）**：
  - (a) baseline-recoveryをkind=adoptionでも許可する。終点は提案bundle、baseline_refsはinitial、提案subject全体を監査する。合格時はcurrent切替、喪失項目と新項目の解消、新基準を同じ一括反映で保存する。
  - (b) loss recordの確定時に、該当項目の起点を「initial（recovery_ref付き）」へ置き換えることを明示的に認める。以後の正式監査は、periodicかadoptionかを問わず初回相当で扱う。
  - どちらの場合も、上記反例をシナリオに追加する。

### CIV3-017 — minor：入口READMEのサイクル完了条件が修正待ちと矛盾する

- **基準**：AIDE-02
- **箇所**：
  - `README.md:93`：「必要な監査が確定し、未解決事項…が保存されていればサイクルを閉じます」
  - `orchestrate.md:14`、`messages.md:53,57`：修正待ちの間は「サイクル全体は未完了」
- **反例**：周期監査がrequire-reviewで確定し、blocked_scopesも保存された。READMEの文言どおりに読むと、「監査が確定」「未解決事項を保存」の両方を満たすためサイクルを閉じられる。orchestrateでは未完了になる。
- **影響**：入口だけを読んだ担当や利用者に、未解決の周期判定を完了と表示し得る。messages.md:53の禁止事項に反します。
- **最小の修正**：README.md:93を「必要な周期判定が合格、または理由付きskipで解消している」に変え、修正待ち・予算待ちは未完了だと一文で示す。

### CIV3-018 — minor：通常の修正後の受理で、保留解除と待機通知の更新が一括更新に含まれていない

- **基準**：DDD-03、G6
- **箇所**：
  - 一括で保存する項目の列挙（`records.md:46`手順4、`records.md:86`、`templates/state.md:49`）に、blocked_scopesの解除とreceived_notificationsの待機状態の更新がない。
  - 回復経路だけが同じ更新で保存すると定めている（`records.md:107`）。
  - `messages.md:57`・`orchestrate.md:15`は「受理時に更新」とだけ書き、同一更新かどうかが読めない。
- **反例**：
  1. 修正のadoption（c1とc2）がaudit-passで受理され、current・基準・差分を保存した。
  2. 保留解除と通知更新を書き込む前に中断する。
  3. 再開時、orchestrate.md:4-5は未解除のblocked_scopesを修正待ちとして扱うだけで、解除条件を再評価する規定がない。
  4. 結果として、修正済みのXが保留のまま残り、元サイクルも未完了のまま残る。
- **影響**：安全側だが、そのscopeの試作・採用が止まったままになる。
- **最小の修正**：
  1. 後続結果が解除条件を満たす受理では、blocked_scopesの解除根拠・後続要求と、received_notificationsの待機状態・後続結果参照を、同じstate更新に含めると規定する（records.md:86、state.md:49）。
  2. state.md:36に後続結果参照の項目を明示する。

## 4. 3systemの充足、確認範囲と限界

| system | 判定 | 残指摘 |
| --- | --- | --- |
| S-RECORD | pass（minor 2） | CIV3-016、018 |
| S-CYCLE | pass（minor 1） | CIV3-017（サイクル完了の表示）。CIV3-013は解消 |
| S-AUDIT | pass | 回復の分類（`audit.md:10`）とテンプレートの項目を確認。SA1〜SA5に欠落なし |

DDD-01〜05とAIDE-01〜03は、上記3件を除いて設計tree 80と矛盾しません。

**引き継いだ確認**
- 設計tree 80の正本20文書とrequirements（入力hashは前回と同一）。
- 無変更のファイル：`README`、`criteria`、`migration`、`design`/`experiment`/`precheck`の各役割、テンプレートのspec/model/rationale/experiment/trial、tools、tests、examples。
- round-3のpackage.jsonに記載されたhashが、添付ファイルのhashと一致すること（主担当の値を照合しただけで、再計算はしていません）。

**今回読み直した範囲**
- diff全体。
- 変更された12ファイルの全文。
- 波及先として、`records.md`の差分・一括反映の節、`messages.md`の周期要求の節、`README.md`の完了条件、`experiment.md`の予算の節。
- 設計のroot §5（AV3-001〜003、005）、S-AUDIT §5、S-CYCLE §5。
- `scenarios.md`の11ケース（Y〜AI）。規約と整合していましたが、CIV3-016とCIV3-018の経路は含まれていません。

**未読**
- `harness-v2`、ログ類、`docs/v3-design/README.md`、closure/handoffの本文、package検査のコード。

**静的監査の限界**
- テストの再実行とhashの再計算は行っていません。
- Pythonの15テスト、製品例の5テストとCLIの証拠は既存の実行ログで、今回の実行ではありません。
- 11ケースは主担当の手動照合で、台帳エンジンを実行した証拠ではありません。
- 実課金、予約・精算、回復監査の実運用、運用効果は未実証です。