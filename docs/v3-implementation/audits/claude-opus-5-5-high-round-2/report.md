# AIDE v3 再監査（Claude Opus 5.5 / High, round 2）

## 1. 判定

**fail：open blocker 0、major 2、minor 1。**

- 前回のCIV3-001〜009は、9件すべてclosedと判定します。
- 新たにmajorを2件起票します。どちらも「周期監査が止まらない、または未監査差分が消えない」経路で、ユーザーの重点確認項目に該当します。
  - CIV3-010：失敗した周期監査が、修正を待たずに再び発火する
  - CIV3-011：採用監査で基準が進んだ後、既存の差分を消す条件が満たせなくなる
- minorを1件起票します（CIV3-012：予算判定の所有者の食い違い）。

## 2. 前回指摘の判定

| ID | 判定 | 根拠（元行番号） | 反例の解消状況 |
| --- | --- | --- | --- |
| CIV3-001 | closed | `protocols/records.md:30-37,65-83`、`messages.md:48,51`、`templates/state.md:36-37`、`roles/audit.md:13` | **反例A**：currentを変えないplanは`unaudited_changes`に入らなくなった（records.md:65-66）。plan履歴だけでは周期監査を起動しない（messages.md:48）。<br>**反例B**：基準をscopeの要素ごとに索引し（records.md:33-34）、差分を消す3条件（records.md:77-79）で判定する。dXだけが消え、dYは残る。<br>**共同条件**：`affected_scope=[X,Y]`の一項目にし、周期要求の閉包へ含める（records.md:70,73）。<br>解消条件1〜5はすべて満たします。ただし別経路の新しい反例をCIV3-010/011として起票しました。 |
| CIV3-002 | closed | `roles/audit.md:10,19-27`、`criteria/README.md:22`、`templates/audit.md:14-19`、`templates/operation.md:19-24` | 前回の監査・subject、open指摘、入力差分、波及先、引き継ぐ確認を新要求に固定する。基準がnullでも初回扱いへ一律に戻さない（audit.md:10,26）。<br>新しい重大反例は、理由を記録すれば追加確認できる（25行）。引き継げない箇所だけ範囲を広げる（26行）。全基準が「今回確認・条件付き未検証・理由付きN/A・前回確認の引継ぎ」のいずれかで覆われるかを照合する（24行）。これで反例は閉じます。 |
| CIV3-003 | closed | `protocols/budgets.md:8-14,18-27`、`roles/audit.md:5`、`roles/orchestrate.md:9`、`roles/record.md:9`、`messages.md:51` | 監査・周期監査・有料の記録作業も予算に計上される。送信前に全口座（親の上限を含む）で判定し、予約してから送信する。<br>保証できなければ`held-budget`で保留する。応答不明時は予約を保持し`in-flight`にする。配送の再送では再実行しない。物理的な再実行には新しい`execution_id`を使う。<br>前回の反例（使用8＋監査3が上限10を超える）と、口座が決まらない`activity_due`は、どちらも停止経路に入ります。 |
| CIV3-004 | closed | `records.md:45` | bundleはsubjectの不変参照から構成し、全参照のhashを読み直して照合する。作業用の候補ファイルは混入しない。 |
| CIV3-005 | closed | `roles/experiment.md:17-18`、`templates/experiment.md:48` | 各追加実行の前に、S-CONTEXTの進行判定と`blocked_scopes`を照合する。許容されるのは原因解消の限定検証だけ。 |
| CIV3-006 | closed | `templates/README.md:17` と `tools/README.md:17` | 参照例の`design/snapshots/SN-…/files/…`が、ツールの実際の配置と一致した。 |
| CIV3-007 | closed | `templates/state.md:5-10,39`、`messages.md:50,54-56`、`templates/operation.md:26` | 周期設定・出所・revisionを保存し、再開時は既定値で上書きしない。設定を変えても初回日時は維持する。起点が無効な場合も、期限を残したままskipする。 |
| CIV3-008 | closed | `tools/snapshot.py:17-28,64,162`、`tests/test_snapshot.py:147-178` | `object_pairs_hook`で入れ子を含む重複キーを拒否する。最上位・入れ子・Unicodeエスケープの同名キー、manifestの後勝ちキーをテストしている。提示ログでは15件がok（skipなし）。 |
| CIV3-009 | closed | `templates/experiment.md:15-31`、`templates/trial.md:11-19`、`templates/state.md:40-41` | 口座/上限ごとのmapで、単位・使用量・未決予約・次回の上限・各判定と総合判定を保存できる。 |

## 3. 新規指摘

### CIV3-010 — major：失敗した周期監査が、修正を待たずに再発火する

**基準**
- SA1、Q1、C-REVIEW、AIDE-03
- 設計 S-AUDIT `design.md:104`「同じ対象の重複要求を対応付け」
- 設計 root `design.md:191`（blockedなら修正待ち）

**箇所**
- `messages.md:51`：対応付けの対象を「未完了要求」に限定している
- `orchestrate.md:8`：作業開始時に期限を確認して「必要なperiodicを保存」する
- `audit.md:13`
- `records.md:81`

**反例**
1. Xの差分c1が期限を超え、周期監査P1がrequire-review（major F1）になる。Xは`blocked_scopes`に入る。
2. 修正はまだ出ていない。その間に、無関係なZの作業を開始する。
3. `orchestrate.md:8`により、X差分の期限超過から周期要求が必要と判定される。
4. P1は完了済みのため、`messages.md:51`の対応付けに当たらない。同じsubject_hash・change_ids・criteria_versionで、新しい要求P2が作られる。
5. 予算を予約して独立監査を送信し、同じF1が返る。
6. 作業開始やcycle_closedのたびに、これが繰り返される。

**影響**
- 無変更の対象に対する有料監査が際限なく続く（上限nullが委任されていれば止まらない）。
- 同じ口座の予約を食い、修正のための試行を`held-budget`へ追い込む。
- 設計の「同じ対象の重複要求を対応付け」を狭めて実装している。

**最小の解消条件**
1. 同じ(subject_hash, change_ids, criteria_version)に対して非passの完了結果があり、その`blocked_scopes`が未解除の間は、新しい周期要求を作らない。
2. 対象の項目を「修正待ち（失敗要求の参照付き）」として表示する。
3. 次の要求は、修正を含む新しいsubjectから再監査手順で作る。
4. 上記を手動シナリオで照合する。

**owner**：S-RECORD（周期の起動）、S-AUDIT（重複の対応付け）

### CIV3-011 — major：採用監査で基準が進むと、既存の未監査差分を消せなくなる

**基準**
- AIDE-03、DDD-03、G4
- 設計 S-AUDIT `design.md:94`「最後の監査版からの累積差分を対象にし、起点を直前の未監査変更へ移さない」
- 設計 root `design.md:183-184`

**箇所**
- `records.md:74`：「旧基準からcurrentまでの累積差分」
- `records.md:77-79`：差分を消す条件1・3
- `records.md:82`：adoptionで消せるのは自身の新しい変更だけ、基準は一括更新
- `audit.md:13`：「最後の基準からの周期監査」
- `templates/audit.md:11`：`baseline_ref`が単一値

**反例**
1. Xのimplementation基準がK1。内部変更dX1をdaily-passで採用し、項目c1（baseline_refs=K1）ができる。
2. 意味変更dX2をadoptionの限定監査に回し、audit-passになる。subjectはS2（dX1とdX2を含む）。
3. adoption要求のchange_idsに既存のc1を入れる規定はない。したがってc1は残る。一方、基準XはS2へ更新される（`records.md:82`）。
4. 次の周期監査は、`audit.md:13`に従い最後の基準S2から差分を取る。S2→currentの差分にはdX1の旧版・新版が含まれない。
5. 条件3（固定した累積差分にその旧新版が含まれる）が永久に成立しない。
6. c1が残り続けるため、最古の`first_changed_at`は常に期限超過となる。作業開始のたびに次のどちらかが起きる。
   - 周期要求が作られる（消せない監査が繰り返される）
   - 「差分なしskip」になり、change_idsが空でないことと矛盾する

`records.md:74`の「旧基準」をc1のbaseline_refs（K1）と読めば解消します。しかしその読み方は`audit.md:13`と食い違い、基準S2が未審査のdX1を含んだまま「監査済み」と表示されます。重要な契約が複数に解釈できる状態です。

**影響**
- 未監査差分が永久に残る、または周期監査が繰り返し発火する。
- 基準版と、実際に審査された範囲が一致しない。

**最小の解消条件**
1. 周期監査・限定監査の累積差分の起点を、選んだ項目のbaseline_refs（scopeごとの最古）と定める。`audit.md:13`と監査テンプレートの基準参照も、これに合わせる。
2. adoption要求についても、scopeが交わる既存の項目をchange_idsへ含めるかどうかを規定する。
   - 含める場合：3条件を満たせば消去できる。
   - 含めない場合：基準を更新しても、残る項目の差分起点は動かないことを明記する。
3. 上記の反例を手動シナリオで照合する。

**owner**：S-RECORD（差分台帳）、S-AUDIT（周期監査の起点）

### CIV3-012 — minor：予算判定の所有者が、設計・入口と予算契約で食い違う

**基準**
- DDD-02、C-ONE
- 設計 S-CYCLE `design.md:39,49`「experimentsの正本と作業予算を所有する」

**箇所**
- `harness-v3/README.md:61`：学習contextが予算を所有する
- `budgets.md:8,19-20`：stateが正本で、記録担当が判定・予約する
- `experiment.md:17-20`
- `records.md:47,50`：state書込み担当は一人
- `messages.md:13`：S-PROPOSALに予約の要求がない

**反例**
試行2の前に、experiment担当が予約を必要とする。読み方が二通りになる。
- 読み方1：experiment担当がstateへ直接書く → 単一書込み担当の規則に反する。
- 読み方2：記録担当へ依頼する → そのためのseamがない。

**影響**
停止判断のownerが二通りに読めます。ただし、どちらの読み方でも保証できない場合は止まるため、予算超過は起きません。

**解消条件**
1. 口座の所有と判断主体（試行分はS-CYCLE、監査・記録分は記録担当など）を明記する。
2. 予約の受渡しを`messages.md`に定めるか、単一担当の運用の範囲内であることを明記する。
3. READMEの表をこれに合わせる。

## 4. 3systemの充足・引継ぎ・限界

| system | 判定 | 根拠 |
| --- | --- | --- |
| S-RECORD | fail | CIV3-010、CIV3-011。CIV3-001・004・006・007はclosed |
| S-CYCLE | pass（minor 1） | CIV3-003（試行側）・005・009はclosed。残るのはCIV3-012のみ |
| S-AUDIT | fail（共有） | SA4はCIV3-002の修正で充足。CIV3-010の重複対応付けと、CIV3-011の差分起点（audit.md:13）を共有 |

**引き継いだ確認**
次の部分は、前回の証拠をそのまま引き継ぎました。
- 4階層とDDD正本の配置
- 取消IDと台帳（`messages.md:23-36`はdiffで無変更）
- 定義の影響閉包（`records.md:56-61`は59行以外無変更）
- snapshotの保存・パス・junction処理（diffは読込み関数の追加のみ）

引継ぎの根拠は次のとおりです。
- 設計tree 80の全ファイル、`design.md`・`precheck.md`・`model/spec/rationale/subject`テンプレート、`migration`、`examples`は、round-1 `execution.json`のhashと一致しています。
- `claude-fixes-round-1/package.json`のhashは、添付した変更ファイルのhashと一致しています。

**追加で確認した範囲**
- 基準更新と差分台帳の相互作用を確認するため、`records.md`の一括反映・基準の節（無変更部分を含む）を読み直しました。
- 設計S-AUDIT §5の差分起点と重複対応付け、`orchestrate.md`全文、`budgets.md`全文も確認しました。

**未読と限界**
- 未読：`harness-v2`、ログ類、`docs/v3-design/README.md`、`audits/README.md`、package検査のコード。
- 静的監査のみです。テストの再実行、hashの再計算、編集は行っていません。
- 15テスト、製品5テスト、CLI演習は提示ログを読んだだけです。
- `scenarios.md`の16ケースは主担当による手動の静的照合です。ケースD（監査中の新差分）は、adoptionで基準が進む経路（CIV3-011）を含んでいません。
- 採用・取消競合・周期監査・予約精算を通した実行証拠と、実運用での効果は、どちらも未実証です。