# AIDE v3 限定再監査（Claude Opus 5.5 / High, round 3）

## 1. 判定

**pass：open blocker 0、major 0、minor 3（CIV3-013〜015）。**

- CIV3-010、011、012はすべてclosedです。
- CIV3-001〜009に回帰はありません。
- 新規指摘はminorのみで、どれも安全側（停止・保留）に倒れる経路です。予算超過や未監査差分の消失に至る具体的反例は見つかりませんでした。

## 2. 今回の対象指摘

| ID | 判定 | 根拠（元行番号） |
| --- | --- | --- |
| CIV3-010 | closed | `messages.md:51-56`、`orchestrate.md:8`、`audit.md:13`、`templates/state.md:35,38`、`budgets.md:23` |
| CIV3-011 | closed | `records.md:73-78,79-87`、`audit.md:13,17`、`templates/operation.md:19,49`、`templates/audit.md:11`、`templates/state.md:37` |
| CIV3-012 | closed | `budgets.md:8-10,21`、`messages.md:64-69`、`README.md:60-61`（残る不整合はCIV3-013として別に起票） |

### CIV3-010：失敗した周期監査の再起動

前回の反例を、修正後の規約に当てはめて追いました。

1. P1がF1でrequire-reviewになり、Xが保留される。
2. 無関係なZの作業を開始する。`orchestrate.md:8` で完了済みの非passと未解除の `blocked_scopes` を照合するため、P2も費用予約も作られない（`messages.md:52`）。
3. cycle_closedが届いても、失敗要求への対応付けと待機理由を保存してackするだけで、差分・期限・保留は残る（`messages.md:53`）。
4. 修正が入れば、新しいsubjectと前回監査参照による再監査へ進む（`messages.md:54`）。
5. 同一内容での再実行は、通信・実行基盤の障害回復に限られる。majorが残る対象はこの例外で再起動できない（`messages.md:55`）。

S-AUDIT側でも重複を対応付けるため（`audit.md:13`）、防御が二重になっています。設計の「同じ対象の重複要求を対応付け」（S-AUDIT `design.md:104`）とも合います。

検索キーが完全一致である点（`messages.md:52`）の扱いも確認しました。定義や委任の変更で対象外のsubject差分が生じた場合は、`messages.md:54` の「対象外の変更だけで同じ失敗対象を新規起動しない」と `state.md:38` の保留単位の抑止で覆われます。

### CIV3-011：採用監査で基準が進んだ後の既存差分

前回の反例：c1（基準K1）をdaily-passで採用済み、そこへdX2を正式なadoptionで提案する。

1. adoptionでも交わる既存項目を必ず選ぶ（`records.md:73`）。c1と新項目c2（事前にIDを割当て、74行）を要求に固定する。
2. 起点は `baseline_refs[X]=K1`（75行）、終点は提案bundle（76行）。
3. 差分消去の3条件はすべて成立し、c1とc2を基準更新と同じstate更新で解消する（86行）。
4. c1を要求から漏らした結果は、基準を進めずに受理を拒否する（87行）。
5. 基準が進んでも、残項目の起点は付け替えない（77行）。

前回の二つの読み方（差分が永久に残る／基準S2に未審査のdX1が入る）は、どちらも閉じています。設計の「最後の監査版からの累積差分を対象にし、起点を直前へ移さない」（S-AUDIT `design.md:94`）とも一致します。

「対象外差分は残す」（root `design.md:184`）とも矛盾しません。閉包の外にある項目は従来どおり残ります（`records.md:85`）。

### CIV3-012：予算判定の所有者

所有を三つに分けています（`budgets.md:8-9`）。

- 予算の定義・配分と試行を始める判断：学習context
- 監査の送信判断：記録context
- 使用・予約の台帳：state

予約は、一人の担当が役割を切り替えて記録役として書き込みます（`budgets.md:10,21`、`messages.md:66-67`）。外部の作業者・独立監査者は、予約済みの一実行だけを受け持ちます（`messages.md:68`）。前回の二通りの読み方（学習側がstateへ直接書く／書くためのseamがない）は解消しています。

**設計との意味不一致の有無**：意味上の不一致はないと判断します。

- 試行を始める判断は、学習（S-CYCLE）に残っています。
- 台帳を単一の書込み担当が持つことは、保存形式の委任（root `design.md:205`、S-RECORD §11）とA3の範囲内です。
- 設計はプロセス分割を要求していません（root `design.md:163`）。
- 記録側が予算外の提案を反映しない規定も、設計のS-PROPOSAL failureに既にあります。

## 3. CIV3-001〜009の回帰確認

変更された `records`・`messages`・`budgets`・`audit` の各節との相互作用だけを確認し、回帰はありませんでした。

| ID | 確認内容 |
| --- | --- |
| 001 | plan履歴だけのskip（`records.md:78`）とscope別の索引（30-37行）は維持。adoptionの閉包も、独立したdX/dYを別項目のまま扱う |
| 002 | 修正のadoptionで前回がP1の場合、`review_delta` はS1→S2の修正分だけ。累積差分は保証範囲として保持し、詳細に読み直す範囲とは区別されている（`audit.md:23-24`） |
| 003 | 修正待ちの間は費用予約を作らない（`messages.md:52`）。送信前の予算確認は所有者の判断と記録役の再照合で二重化（`budgets.md:21`） |
| 004〜009 | 対象ファイルは無変更。round 1とround 2のpackage hashが一致しており、依拠先の変更もない |

## 4. 新規指摘

### CIV3-013 — minor：上限値の正本が学習の計画とstateに二重に置かれている

- **基準**：C-ONE、DDD-02
- **箇所**：`budgets.md:9`（定義は学習側の不変計画で固定）と `budgets.md:11`、`templates/state.md:40`（stateの口座にもlimitを持つ）
- **関連**：無変更の `roles/intake.md:6`（学習ロールのintakeが「stateに口座を保存する」）
- **反例**：利用者が上限を10から6へ下げ、学習側が新しいplan_revisionで固定する。stateの口座のlimitを更新する担当と時点が定められていない。このため、記録役が監査送信の判断に古いlimit=10を使う読み方が成立する。
- **影響**：`budgets.md:28`（下方変更時は新しい委任で再判定）に従えば止まるため、規則どおりに進めれば超過しない。ただし、どちらの値を正本とするかが二通りに読める。
- **最小の解消条件**：
  1. stateのlimitを、委任・計画から導いた写しと明記する。
  2. 判定時は元の参照と照合することを要求する。
  3. `intake.md:6` の書込みを「記録役へ切り替えて保存」に合わせる。

### CIV3-014 — minor：修正待ちへの対応付けが記録・完了条件の手順に反映されていない

- **基準**：AIDE-02、DDD-04
- **箇所**：`roles/record.md:18`（cycle_closedの結果を「periodic要求か理由付きskip」の二択で記述）、`roles/orchestrate.md:13`（サイクル完了条件）
- **反例**：Xが修正待ちの間にXを含むサイクルが終わる。`messages.md:53` では三つ目の結果「失敗要求への対応付け」になり、未解決の周期判定は完了扱いにしない。一方 `record.md:18` はこの結果を持たない。`orchestrate.md:13` の「必要な周期判定」に、この状態で完了扱いできるかも読めない。
- **影響**：受渡し契約（messages）が正本なので、誤った受理は起きない。役割の手順だけを読む担当が、サイクルを閉じてよいか判断を誤る可能性がある。
- **最小の解消条件**：
  1. `record.md:18` に三つ目の結果を追加する。
  2. サイクル完了時に修正待ちをどう表示するかを明記する（例：「完了、周期判定は修正待ち」または「未完了」）。

### CIV3-015 — minor：差分起点が復元不能に失われた場合の解除経路がない

- **基準**：G6、AIDE-03
- **箇所**：`records.md:77`（起点の保存物が欠けたらblocked）、`messages.md:52`（未解除の間は起動しない）
- **反例**：K1のsnapshotが削除や履歴の書換えで失われる。
  - c1を含む周期監査はblockedになる。
  - Xの正式なadoptionも、c1をK1起点で含める必要があるため同様にblockedになる。
  - 復元できない場合の解除条件が定められていないため、Xは恒久的に修正待ちになる。
- **影響**：安全側には倒れる（空差分で基準を進めることはない）。ただし、そのscopeの正式採用が永久に止まり得る。
- **最小の解消条件**：
  1. 復元不能と記録した場合は、そのscopeを初回扱いとする（`baseline_refs=initial`、現行subject全体を監査）。
  2. 合格するまで項目を保持する。
  3. 喪失の根拠を記録する。

## 5. 3systemの充足

| system | 判定 | 根拠 |
| --- | --- | --- |
| S-RECORD | pass（minor 2） | CIV3-011は解消。CIV3-014、015が残る |
| S-CYCLE | pass（minor 1） | CIV3-012は解消。CIV3-013が残る |
| S-AUDIT | pass | 修正待ちの対応付け（`audit.md:13`）と起点の明示（`audit.md:17`）を確認。SA1とSA4を充足 |

## 6. 範囲と限界

**引き継いだ確認**
- 設計tree 80の全文。
- 無変更ファイル：`subject`、`experiment`、`intake`、`record`、`precheck`、`design`、`criteria`、templatesのspec/model/rationale/subject/experiment/trial、tools、tests、examples。
- 無変更と判断した根拠：`claude-fixes-round-1` と `round-2` のpackage hashが一致し、`implementation.diff` の変更9ファイルと対応している。
- 15テスト・製品5テスト・CLI演習の実行証拠。

**今回読み直した範囲**
- diff全体。
- 変更9ファイルの全文。
- 波及先として `record.md`、`experiment.md`、`intake.md`、`subject.md` の該当節。
- 設計S-AUDIT §5、root §5のAV3-001〜002、S-CYCLEの責任範囲、A3。
- `scenarios.md` の8ケース（Q〜X）。規約と整合していました。ただしCIV3-015の喪失ケースは含まれていません。

**未読**
- `harness-v2`、ログ類、`docs/v3-design/README.md`、`audits/README.md`、package検査のコード。

**静的確認の限界**
- テストの再実行とhashの再計算は行っていません。hashは主担当の計算値を照合しただけです。
- 8ケースは主担当による手動照合で、台帳エンジンを実行した証拠ではありません。
- 予約・精算、周期監査の全経路の実運用、および運用効果は未実証です。