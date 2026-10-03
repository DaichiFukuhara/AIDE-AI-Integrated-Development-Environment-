---
{
  "experiment_id":"E-002","revision":1,"semantic_revision":1,"plan_revision":1,"cycle_id":"C-002",
  "previous_cycle_ref":"experiments/E-001.md","state":"planned",
  "goal_refs":["G-LOG","SG-TRACE"],"system_refs":["SYS-LOG"],
  "domain_context_refs":["D-LOG","CTX-LOG"],"model_definition_refs":["DEF-LOG-01"],
  "baseline_bundle":"BUNDLE-001","baseline_implementation":"IMPL-005",
  "delegation_ref":"operations/delegation-002.md","budget_account_refs":["LOCAL-01","LOCAL-E002"],
  "budget":"experiments/budget-definition-002.md","evaluation_ref":"EVAL-002",
  "implementation_ref":null,"trial_refs":[],"required_user_confirmations":["UC-01","UC-02","UC-03"]
}
---

# Claude Code の自動記録を安全に継続できるか

仮説は、手動の節目記録を残し、Claude Code hook の必要最小限のメタデータだけをローカル耐久キューに保存し、非同期送信すれば、作業を止めずに動きを追えること。source=claude-local のローカル技術的試験を対象とする。hook は観測器で、製品ログの pass/fail は正式監査・採用状態を変更しない。

今回作るのは計画だけ。AR-PLAN-002 の固定と予約で停止し、監査は実行しない。plan の独立合格、UC-01〜03 の確認、実装依頼後にだけ次段階へ進める。以下は監査対象の具体案で、動作確認済みの仕様ではない。

## 対象イベントと粒度

標準入力の JSON、session_id / hook_event_name / cwd / transcript_path / tool_name / tool_input / tool_response などは利用者提供の参考情報。実機で確認する前提であり、キーや async 設定を確定事実として扱わない。SessionEnd や失敗通知が提供されるか、tool_use_id 等が一意かも FIT で観測する。

| hook 候補 | 記録の粒度と許可する入力 | 送信イベントと結果 |
| --- | --- | --- |
| SessionStart | セッション単位。session_id は run を決めるためにのみ使う | start 1件。再開時は同じ run とし追加 start を作らない。phase=implementation、kind=action、outcome=recorded |
| UserPromptSubmit | 本文は読まず、イベント名だけを観測 | 個別送信せず、観測 callback 数を集計。実際のプロンプト数・内容を断言しない |
| PreToolUse | tool_name、実機で確認した tool_use_id と限定入力。開始時間をローカルに保持 | 個別送信せず、完了との照合と未完了件数の集計用 |
| PostToolUse | ツール呼出し単位。上と同じ識別子・許可メタデータ、実機で確認した boolean/数値の成否だけ | 完了1件。成功を意味する hook だと実機確認できた場合のみ pass、明示失敗のみ fail、判別不能は unverified。出力文字列を読んで成否を推測しない |
| PostToolUseFailure（条件付き候補） | 実機で提供と安全な error code/識別子を確認できた場合だけ登録案へ追加 | 失敗完了1件。error message/stack は送らない。未提供なら失敗は unverified の未完了集計。成否の網羅性を保証しない |
| Stop | assistant 本文・last_assistant_message を取り込まない | 終了観測 callback 数と未完了数を集計。会話ターンや全作業の成功とは扱わない |
| SubagentStop | 終了の観測だけ。subagent の prompt/出力/未観測の個別ツールを収集しない | callback 数を集計。一意IDが実機で安全に得られる場合だけ重複排除 |
| SessionEnd | 理由は固定 allowlist（normal/clear/logout/unknown）へ分類 | end 1件と不変な summary 1件を保存。異常終了等で発火しなければ未終了と扱う |

PostToolUse の一意識別子が取れない場合は、同内容の別呼出しを混同しないため個別完了イベントを送らず、ツール別の callback 集計へ縮退する。この縮退を FIT で記録し、利用者に受入可否を確認する。完全な呼出し単位記録が必要なら新 plan_revision に戻す。停止・再開を跨ぐ全 callback の厳密な exactly-once は保証せず、保存済みイベントの再送冪等性と区別する。

## 送らない情報と変換規則

prompt 全文・断片、ファイル内容、Edit/Write の old_string/new_string/content、コマンド出力全文・抜粋、tool_response の文字列、transcript 内容/パス、cwd の絶対パス、会話履歴、内部思考、秘密値（トークン・キー・パスワード・.env の値）は保存も送信もしない。未知キーは捨てる。raw JSON をキュー・一時ファイル・stdout/stderr・例外へ出さない。標準入力の上限は256 KiB、超過・壊れたJSON・未知イベントは内容を捨て、安全なエラー分類と件数だけを残す。

変換は「許可キーから構築 → 値の検査とマスク → 長さ制限 → 最終サイズ検査」の順。マスクを raw 入力の送信可否判断に使わない。ツール名は既知の allowlist、MCP/未知ツールは other に分類して入力を収集しない。既知の Read/Edit/Write/Glob/Grep 等から対象の path 系キーのみ抽出し、pattern/query/content は捨てる。

パスは実験の許可プロジェクト根を境界に正規化し、相対パスだけを送る。外部・絶対・親移動・UNC・URL・link/reparse による逸脱は [outside-project] または [path-omitted]。対象ファイルを開いたりリンクを辿って外部を読まない。.env*、秘密鍵、credentials/token/secret/password を含む path component は [sensitive-path]。path は最大160 Unicode文字・最大3件、超過は省略数だけを記録する。cwd は境界照合だけで送らず、transcript_path は参照・読取しない。

コマンドの要約は自由文の切り出しでなく、実行名の固定分類（python/node/npm/test/other 等）と operation 分類（test/build/run/other）。引数・環境変数代入・URL・stdin・here-doc・複合コマンドは捨て、解析が曖昧なら other。コマンドから対象パスを抽出しない。たとえば `python test.py --token ...` は `python / run` だけを送る。

残る許可文字列には、(1) token/key/password/secret/authorization/cookie 等の名前に付随する値、(2) Bearer 値・JWT形（3個のbase64url部分）・PEM片・既知キー接頭辞 sk-/sk-ant-/ghp_/github_pat_/AKIA、(3) 32文字以上の英数と `_+/=-` からなる連続列、(4)制御文字を検出し、値全体を [redacted] に置換する。プロジェクト名・actor は固定の安全な識別子で、session_id と tool_use_id は識別用に hash 化し、生値を送らない。マスク対象を検査するため秘密の環境変数を列挙しない。任意の秘密を完全に検出できるとは保証せず、自由文を入力しないことを主防御とする。

自動イベントの title は固定文言＋固定分類で最大120文字、body は version=1 の許可メタデータを JSON 化した最大2000文字・UTF-8最大8 KiB、イベント全体はUTF-8最大12 KiB。reason/next は固定短文、evidence=[]。duration_ms は照合できたローカル単調時計差だけを0〜3,600,000の整数で記録し、時計不整合・欠落・再起動時は null。切り詰めはマスク後に Unicode文字境界で行い、長さと省略件数だけを記録する。

## 既存スキーマと互換性

新フィールド・SQL migration は追加せず、現在の14フィールドを保つ案を採る。自動記録は actor=`claude-code-hook/v1`、title=`[auto:v1] ...`、body のオブジェクトに `capture=claude-hook-v1` と `event` を持つ。許可キーは event/tool/path/command/result/duration_ms/counts/truncated と固定識別・数値のみ。手動記録は従来の actor/title/body をそのまま使い、auto の予約 actor を手動記録で使わない。旧データは「従来の節目記録」として無変更で読める。source だけでは自動・手動を判別しない。

この規約は観測上の分類で、署名・信頼度の証明ではない。同じ送信資格を持つ人は auto 規約を模倣できる。偽装防止が必要なら別の認証/スキーマ計画が必要。

| 層 | 次段階での影響 |
| --- | --- |
| SQL/RPC/RLS | 既存 event jsonb・owner/event_id 一意制約・同内容duplicate/異内容409・検索列を維持。migration と本番SQL適用はなし |
| validateEvent/API | 既存14フィールドの汎用検証を維持。自動変換器で厳しい allowlist と小さい上限を課す。既存の size/資格/source/project/run 制限を回帰確認。auto の専用フィールドを追加しない |
| CLI | validate/enqueue/flush を再利用し、将来 enqueue-only、保存済みJSONの再送、非同期workerの短い送信timeout/件数上限を追加する案。手動 record/flush/status と旧キューの互換性を維持 |
| UI | 予約 actor/title で自動記録と手動記録を表示上区別する小変更。既存の詳細・絞込・書出しで読み取れる。NEXT-02の検索変更、NEXT-04の自動取得は含めない |

正常例は Read の完了を、相対 path・成功/不明・実測時間だけで保存し、手動判断ログと並べること。例外は .env 読取や資格を含むコマンドで、内容・引数を一切記録せず [sensitive-path] または固定分類だけにすること。

## 失敗時と非同期送信

hook の前景処理は bounded な入力変換とローカル保存だけで、HTTP・flush・モデル呼出しを行わない。async の正式サポートと設定方法を実機で確認して利用する。非対応なら、project 内の launcher が変換済みイベントを保存して隠しbackground workerを起動する方式を実機検証する。raw入力やトークンをコマンド引数で渡さない。いずれも確認できなければ設定を有効化せず保留する。

前景の目標は p95 ≤200 ms、全観測で ≤1,000 ms（実測20回以上、fixtureとしての基準）。通常・parse失敗・送信失敗・queue障害・worker起動失敗・例外で hook の終了コード0、stdout は空、stderr は内容/資格なし。host 側のtimeoutや強制終了は wrapper の終了コード0を保証できないため、1秒上限で Claude が次の無害な作業へ進めることを FIT の必須条件にする。実機で hook が作業を阻害するなら不採用/保留。

既存 CLI の通常 flush は1リクエスト15秒で全キューを同期処理し、record も送信まで実行するため、そのまま前景hookから呼ばない。将来の enqueue-only は同じ1イベント/JSONの .logbook-queue 形式に先に保存し、time/id/content を確定する。ファイル単位の短い排他と原子的置換を共有CLI/producerで揃え、既存の送信 .lock が全producerを長く止めないようにする。排他待ちは最大50 ms、timeout・ローカル書込み不能では保存成功とせず、本文なしの欠落件数/理由だけを診断に残す。disk-full では診断の永続化も保証しない。

worker は送信だけを単独実行し、1回最大20件・総処理5秒・1HTTP timeout 1秒、redirect/proxy 経由の資格流出を防ぐ。loopback fixture では proxy を無効にする。起動は20件たまる/最初の未送信から5秒/Stop/SessionEndを目安に1 workerへまとめ、常駐サービスを新設しない。起動機会がなければ手動flushまでキューに残る。まとめ送信は既存APIに1件ずつ最大20件を送ることを意味し、新しいbatch APIは作らない。

通信断・接続拒否・timeout・429/5xx・不正ack・401/403/409・worker停止はキューを削除しない。200/201 の inserted/duplicate の正当ackだけで削除する。資格エラーは自動再起動の嵐を抑え、backoff を1/2/4/8/16/30秒（上限30秒・最大6回、以後手動flush）とし、ログ・キューに資格を残さない。送信済みか不明なクラッシュは同じイベントを再送する。結果や time を再生成しない。

queue のローカル保存不能とネットワーク送信不能を区別する。前者の完全な無損失は保証できない。後者は保存済みイベントを .logbook-queue に残して後で既存 CLI flush で送る。自動が上限に達しても手動記録を阻害しない。

## 量、run、id、保持

run=`claude-`＋SHA-256(project識別子＋区切り＋session_id)の先頭32桁、source=claude-local、project は確認した固定識別子。session_id 欠落時は日時やcwdで推測せずイベントを捨て、理由だけを診断する。再開は同じ run、新session_idは別run。既存送信資格に run 固定制限がある場合は複数セッションと両立する資格を環境変数で用意するまで送信保留。

ツールイベントIDは `auto-`＋SHA-256(project/source/run/hook名/実機確認した一意tool_use_id)の64桁。start/end はrunごとに固定ID、summary/overflow はrun＋固定ラベルからIDを作る。最初の採用時に time と sanitized 内容を保存し、callback重複でも既存の内容を再利用する。Pre→Postの時刻・id/成否照合はローカルstateに保持する。PostとFailureの二重終端は異常として診断し、既存イベントを改変しない。

1セッションの自動送信上限は200件（start/end/summary/overflow各1、個別tool完了最大196）。上限以降はmetadataだけを集計して、終了時のsummaryに omitted 件数を含める。overflowは最初の到達時に固定1件を保存し、後から内容を変更しない。summaryは終了または明示的なローカル回復closeで1回だけsealし、SessionEnd欠落時は未終了状態。集計はcallback観測であり完全な実作業数ではない。

自動producerの未送信保護枠は1,000件か10 MiBの早い方。既存手動イベントは枠計算に含めないが、queue全体の空きは別途確認する。上限時は新しい自動記録を省略し欠落件数を表示、古いイベントや手動記録を消さない。手動節目とのリンクは同じrunを明示指定した場合に限る。

セッション識別・確定内容の再利用用stateは .local/claude-hook-state に秘密なしで保持し、自動削除しない。少なくとも未送信イベント/再開中セッションがある間は保持する。state消去後のcallback再配送の厳密重複排除は未保証とし、保管/削除方針は UC-02 で確認する。

## 設定場所と将来の変更候補

推奨は experiments/cloud-logbook/.claude/settings.json の実験専用project設定。Claude Code をこの実験のcwdで利用者が起動し、実機がこのプロジェクト根を尊重するか確認する。repo root の .claude/settings.json へ影響を広げず、既存のproject hooksも事前に確認して破壊的に上書きしない。設定ファイルは今回作らない。

将来の製品変更候補は cli/logbook.py、hooks/claude_logbook.py（変換・enqueue用候補）、public/app.js（表示分類）、tests の関連検証、実験内 .claude/settings.json、README/agent-instructions の使用手順、fixtureのみ。名前は計画上の候補で存在を要求しない。SQL、汎用API認証、他sourceの自動記録、global設定、常駐配備は対象外。

LOGBOOK_URL/LOGBOOK_TOKEN/LOGBOOK_QUEUE と固定 project を環境変数で渡す。URLは今回の検証ではloopbackのみ、トークンは使い捨てfixture専用値で、本番資格を使用しない。キューは experiments/cloud-logbook/.logbook-queue、state/tmpは実験内 .local 配下に固定し、resolved path とlinksを検査して許可根外を読まない/書かない。新hook設定の async/matcher/timeout 書式・scopeの継承はFITで実機確認するまで確定しない。

## 固定検証 EVAL-002

UTはsystem単体、SITはキューから閲覧までの結合、FITは利用者が実セッションと画面で追えるかを確認する。新実装に対応する1ラウンドで実行し、未実装の今は全項目未実行。合格表現を先行させない。

| ID / 階層 | 将来の必須確認と証拠 |
| --- | --- |
| UT-AUTO-01 / SYS-LOG | synthetic入力JSON→許可フィールドだけのイベント変換。全候補hook、欠落/未知キー/巨大入力/invalid JSON/Unicode/制御文字/外部path/.env/秘密っぽいpath/JWT/キー/複合コマンド/未完了/不明結果。canary がqueue・送信・stdout/stderrにないこと。pathやtranscriptを実読取しないこと。mask→切詰めの順と上限 |
| UT-AUTO-02 / SYS-LOG | 同じid/time/contentの再配送・flush、別tool_use_idの同内容別操作、restart/replay、200件枠・overflow固定・summary seal、1,000件/10 MiB、排他競合・disk/権限失敗・例外で0終了。未送信内容の不変性と旧CLI形式の互換 |
| SIT-AUTO-01 / SG-TRACE | 実producer/共有CLI→実loopback API→fixture adapter→認証読取。自動と手動共存、run/source資格、同内容duplicate増加なし・異内容409保持。故障/遅いサーバー/不正ack/redirect/proxy/401/403/429/5xxでqueue保持、復旧flush、1worker/20件/5秒上限。実Supabase/RLS保証とは区別 |
| SIT-REG-01 / SG-TRACE | IMPL-005 の既存回帰（送信・認証回復・旧表示・既存手動CLI・ページ継続・export）。SQLは無変更のhash確認と現行境界の再確認で、本番DB適用なし |
| FIT-AUTO-01 / G-LOG | 利用者が許可した実 Claude Code セッションで各候補hookを実発火。safe fixtureの開始/無害prompt/Read・Edit・無害コマンド/意図したツール失敗/Stop/SubagentStop/終了を観測。hook stdinのキー・型・識別子有無だけを安全に記録し、生値・prompt・transcript・出力を保存しない。実変換→fixture到達まで相関を示す。未発火・非対応は未確認であり合格にしない |
| FIT-AUTO-02 / G-LOG | 同実セッションでHTTP停止/timeout/queue lock/保存障害/worker起動失敗を誘発し、Claudeが次の無害な作業へ進むことを実確認。前景20回以上の時間・終了コード・欠落数を記録しp95≤200ms/各≤1秒。async/host timeout後の続行と再開後flushを確認 |
| FIT-UI-02 / G-LOG | 実ブラウザdesktop/390pxでログイン→手動更新→同じrunのauto/手動分類・詳細・成否不明/省略件数・相対path/安全な要約・JSON/Markdown出力を確認。通信断の旧表示と未更新表示、認証切れ消去を回帰確認。DOM stubだけで実ブラウザ合格としない |
| HUMAN-AUTO-02 / G-LOG | 利用者が量・読みやすさ・安全な省略・手動更新での確認を評価。本人評価未確認なら明示してローカル技術的試験の限定採用のみを提案 |

FIT-AUTO-01/02 は synthetic hook JSON や Codex の代理送信で代替しない。利用者の無害なセッションが確保できなければ paused。PostToolUseFailure が実機にないときだけ未発火を理由付き非該当とし、失敗結果網羅性の未保証を残す。SubagentStop等の他の必須観測ができない場合、無断で成功条件から外さず新計画へ戻す。

証拠は固定実装版・plan_revision・環境・コマンド・終了コード・安全な観測・費用・限界を新trialへ記録し、canaryを含む原入力は保存せず期待非出力の判定のみを保存する。スクリーンショットはfixture記録だけで取得し、資格や他の会話を含めない。本番配備、4実環境、他ブラウザ・長期運用・native download・クラウドqueue持続性は今回も未確認。

## 採否・予算・終了条件

今回の終了は precheck structural-pass と AR-PLAN-002 の予約済み・未送信保存。実装、試行、監査合格、採用、サイクル完了を表示しない。C-001の完了とは別に C-002 を計画監査待ちで保持する。currentは BUNDLE-001/IMPL-005。

将来の限定採用は同一実装版のUT/SIT/FIT必須確認と独立adoption監査のmajor/blocker 0が必要。実機hookの仕様や粒度が候補と異なる、前景遅延が基準を超える、秘密を出す、内容不変再送が成立しない場合は合格にしない。1試行枠を使った後の修正試行は予算待ちpausedとし、成功基準を弱めない。採用のbundle切替はrecordのみ。終端とcycle_closed通知、ack/周期判定は将来の採否後に保存する。

予算は LOCAL-01 の残枠内に LOCAL-E002（試行1・監査2・記録6・追加購入0円）を配分する。今回は記録1とplan監査1だけ。モデル利用費はunknown。新規課金を始めず、監査者が開始前に既存利用枠を確認する。S-CONTEXTと全口座上限は各実行前に再照合する。

## 要利用者確認

| ID | 具体案と確認する事項 | 確認までの扱い |
| --- | --- | --- |
| UC-01 | 実験専用 experiments/cloud-logbook/.claude/settings.json を使い、このcwdだけで有効化する案。project識別子と相対pathの基準もここに限定してよいか | 設定を作らず有効化しない。既存repo全体/globalへ拡張しない |
| UC-02 | 完了tool最大196/セッション200件、prompt/Stop/subagentはsummary、引数なしの固定コマンド分類、相対path、stateは自動削除なしという粒度・量・保持を許容するか。識別子がないtoolは集計へ縮退してよいか | 計画案として監査する。確認前に収集しない |
| UC-03 | 計画監査合格後の実装依頼と、無害な実 Claude Code セッション/FIT実行・既存利用枠の確保。現行総予算の残試行1ラウンドで進め、不足時は再計画としてよいか | 今回は実機を起動しない。外部通信・課金・本番資格を使わない。費用/実機が確保できなければ保留 |

NEXT-01/02/04/05 は次計画の候補として元の記録に残す。NEXT-04 は今回の自動収集・手動更新確認に不可欠ではなく、追加を提案しない。ライブ一覧が必要という評価になった場合は、監査/利用者確認を伴う次の計画へ分ける。
