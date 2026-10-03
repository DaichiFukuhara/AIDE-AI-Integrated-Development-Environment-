---
{"id":"E002-PLAN-HANDOFF","revision":1,"experiment_id":"E-002","cycle_id":"C-002","phase":"plan","subject_hash":"d9835c76e2a240afe310b0c80e2e7387c312477d082b192d23b043ab09fd2308","state":"reserved-not-dispatched","audit_result":null}
---

# 計画監査の要求で停止

E-002 の intake・候補設計・計画・予算・委任を固定し、plan precheck は structural-pass。AR-PLAN-002 は予約済み、未送信、未実施。監査は Claude Opus 5.5 の外部独立監査が担当する。起草者による意味監査・監査判定・製品実装・hook/設定作成・試行は行っていない。

要求は [AR-PLAN-002](../audits/AR-PLAN-002-request.json)、固定入力はそこに記載した subject_ref と snapshot。可変の作業文書を監査入力へ混ぜない。precheck は構造・版確認だけであり計画の意味合格ではない。criteria_version=2 の新しい候補として確認し、旧版の合格を流用しない。

current_bundle=BUNDLE-001、実装IMPL-005、C-001完了は維持。state の cycle_status/cycle_history.C-001 は閉じたサイクルの記録、active_cycle_status はC-002の監査待ちを表す。C-002 の未採用候補だけが pending_changes にある。正式な監査基準・採用済み未監査差分・既存minor・保留/未確認を変更していない。

## 計画の要点

- SessionStart/end と識別できるツール完了を個別記録。UserPromptSubmit、PreToolUse、Stop、SubagentStop は件数・照合・summary用。PostToolUseFailure は実機対応を確認できた場合の候補。実機の入力キー・async・一意識別は未確認。
- prompt/ファイル内容/出力/transcript/秘密値は収集しない。許可メタデータだけを構築し、相対path・引数なし固定コマンド分類・マスク・切詰めを適用する。
- 14フィールドとSQLを維持し、actor/title/body規約でautoを識別。CLIはenqueue-only/短いworker送信、UIは表示分類の変更案。旧データ・手動CLIを維持する。
- hook前景はHTTPなし、0終了・p95≤200ms/各≤1秒を実機検証。送信失敗は既存 .logbook-queue に保持し同id/time/contentでflush。ローカル保存不能の欠落を成功にしない。
- runはproject/session hash、最大200件/セッション、workerは20件/回、1秒HTTP/5秒総処理。保存内容を固定して重複防止。実入力の一意性がない場合の集計縮退は利用者確認対象。
- UTは変換/マスク/識別/上限/旧CLI、SITは実loopback API/キュー/資格/故障/回帰、FITは実Claude hook発火/非阻害と実ブラウザ表示を必須にする。本番と4実環境は未確認。
- NEXT-04は手動更新で今回の検証が可能なため除外。NEXT-01/02/04/05とF-CLOUD-ADOPT-002は元の次候補・open記録に残す。

## 要利用者確認

1. UC-01: 実験専用project設定の場所・実験cwd・固定project/path境界。
2. UC-02: 粒度・件数上限・引数の省略・識別不能時の集計縮退・state保持方針。
3. UC-03: 監査合格後の実装依頼、実Claudeの無害なセッション/FIT、既存利用枠と残試行1ラウンドでの着手。

確認事項は具体案を固定した計画の未決条件であり、今回の計画保存を止める追加許可要求ではない。監査合格のみで実装を開始しない。

## 予算と確認結果

LOCAL-01の総上限を増やさず、LOCAL-E002へ試行1・監査2・記録6・追加購入0円を配分。計画記録EXEC-RECORD-006の1バッチを両口座へ精算、EXEC-AUDIT-PLAN-002の監査1だけを両口座へ予約。親は試行5/6、監査使用3＋予約1/6、記録6/80。子は試行0/1、監査使用0＋予約1/2、記録1/6。追加試行/再監査は全口座照合なしに行わない。モデル利用費unknown、監査者が実行開始前に利用枠を確認する。

初回snapshot固定はWindowsのパス長制限で失敗したため、未固定の候補だけを短いファイル名へ整理して固定し直した。製品試行ではなく計画記録の処理。レジストリ・ACL・既存snapshotを変更していない。

既存314ファイルのhash不変、request/subject/precheck同一性、参照する10snapshotのmanifest/hash、親子予算、不変current、監査未送信/未実施、UTF-8・連続 `?`/置換文字なしを確認。詳細は [記録整合性の確認](E-002-plan-verification.json)。外部ネットワーク、資格利用、課金、git操作はなし。

## 作成・変更ファイル一覧

すべて experiments/cloud-logbook 配下。設計の作業正本は変更せず候補だけ作成した。

| 区分 | ファイル |
| --- | --- |
| intake/委任 | operations/intake-002.md、operations/delegation-002.md |
| 計画/状態/予算 | experiments/E-002-plan.md、experiments/E-002.md、experiments/budget-definition-002.md |
| 設計候補 | design/candidates/OP-PLAN-002/G-LOG.md、G-LOG-r.md、SG-TRACE.md、SG-TRACE-r.md、AP-FILE.md、AP-FILE-r.md、SYS-LOG.md、SYS-LOG-r.md、DEF-LOG-01.md、DEF-LOG-01-r.md、change.json |
| 操作 | operations/OP-PLAN-002.md、operations/OP-PLAN-002-payload.json |
| 監査入力/要求 | audits/subjects/PLAN-002.json、audits/AR-PLAN-002-request.json |
| precheck | evidence/precheck-plan-002.json、evidence/precheck-plan-002.md |
| 検証/引継ぎ | evidence/E-002-plan-verification.json、evidence/E-002-plan-handoff.md |
| 更新 | design/state.md（revision42→45、C-002候補・操作・予算・監査outboxを追記） |
| 一時的な記録補助 | .local/tmp/plan-002-before.json、.local/tmp/prepare-plan-002.py（製品/hookスクリプトではない） |

新しい不変snapshotは次の4組。各組のmanifest.jsonとfiles以下に、対象文書のUTF-8コピーを新規保存した。個々の保存ファイルの一覧は検証JSONのcreated_filesと各manifestにある。既存snapshotは編集していない。

- design/snapshots/SN-8fc75a13cfa0cc07e2a453e4eca38ee7f4ef240c4d322f3e82059bd987f81822（設計・計画・委任・予算・差分）
- design/snapshots/SN-115d95e4eae365644ee92c14d5aa9ca379adfbec14655c5fd47d7ccc9a767237（新subject・操作・precheck）
- design/snapshots/SN-156f567a982e8062ea128ebee3febff4987104f4bf178754865ab7dff0ac52f5（比較用の旧PLAN-001を元と同じhashで新規保存）
- design/snapshots/SN-e6d1dcd05a40faa69f0170fae400abdcd673b426a0f3d1c8a509f067a6f94593（要求AR-PLAN-002・E-002状態）
