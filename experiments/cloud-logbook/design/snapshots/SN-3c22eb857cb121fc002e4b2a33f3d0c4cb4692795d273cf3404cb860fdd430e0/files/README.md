# Cloud Logbook

HTML/CSS/JavaScriptの閲覧画面、Vercel API、Supabase Postgres/Auth、Python標準ライブラリだけの送信CLI。ログは節目で明示的に記録します。全ツール操作やサブエージェントの全文を自動収集する仕組みではありません。

```
Codex / Claude（ローカル・クラウド）
  → CLIのローカルキュー → HTTPS POST /api/events
  → Vercel（送信者のトークン・範囲を検査）→ Supabase
ブラウザ → Vercelのログイン・読取API → Supabaseの所有者RLS
```

現時点の本番プロジェクト・公開URL・4実環境送信は未確認。ローカルの4source値によるテストは、4環境そのものの検証ではありません。正式なハーネスの採用状態は `design/state.md`、画面は観測イベントを扱います。

## ローカルで確認

Node 22、Python 3.10以降。依存パッケージはありません。このディレクトリで:

```powershell
npm run demo
```

http://127.0.0.1:4193 を開く。検証用アカウント `reader@example.test` / `local-fixture-only`。これは明示的なメモリ保存の境界stubです。再起動でログは消えます。SupabaseのRPC・RLSが実DBで動くという証拠にはなりません。Vercel側にこのモードはありません。

別ターミナルから実際に送信:

```powershell
$env:LOGBOOK_URL = 'http://127.0.0.1:4193'
$env:LOGBOOK_TOKEN = 'local-fixture-writer-token-0001'
python cli/logbook.py record --project aide --run trial-001 --source codex-local --actor Codex --title '接続を確認' --body 'CLIからローカルAPIへ送信した' --reason '保存と表示がつながるか確認する' --next '画面を更新する' --phase verification --kind check --outcome recorded
python cli/logbook.py status
npm test
```

## 共通ログ形式

`id,time,source,project,run,actor,phase,kind,title,body,reason,evidence[],next,outcome`。`source` は `codex-local / claude-local / codex-cloud / claude-cloud`。`phase` は intake/design/plan/implementation/verification/audit/adoption/closure、`kind` は action/decision/check/issue、`outcome` は recorded/pass/fail/unverified。

`id` と時刻はCLIが生成します。説明と短い理由・根拠・次の作業を記録し、内部思考全文は要求しません。根拠はHTTPS URLか相対パス。クラウド画面に表示した相対パスからローカルファイルを開けるとは限りません。同一所有者・ID・内容の再送は1件のまま、異なる内容なら409で保持します。訂正は新IDで追記します。

## 通信失敗と再送

CLIは送る前に `.logbook-queue` へ1イベント1ファイルで保存します。失敗したら終了コード2で未送信を残し、`flush` がID・時刻・内容を変えず再送します。記録を再作成するコマンドで再送しないでください。`--offline` は保存だけ、`--queue PATH` はキューの場所の変更。URLとqueueはサブコマンドの前に指定します。

```powershell
python cli/logbook.py record --project aide --run job-001 --source codex-cloud --actor Codex --title '変更完了' --offline
python cli/logbook.py flush
```

排他中は終了コード3。中断後に `.lock` が残った場合、送信プロセスがいないことを確認してそのファイルだけ除去します。キューは秘密トークンを含みませんが作業内容を含むためGitへ追加しません。クラウドの作業環境が破棄されるとローカルキューも失われ得ます。終了前のflushと未送信確認、必要に応じたキューの永続化が必要です。ローカルCLIはCORSの制約を受けません。クラウドからの通信は各製品の外部通信設定・許可ホストに依存します。

## 本番の準備と配備

1. SupabaseでFreeプランのプロジェクトを作成。課金条件が変わっていたら確認してから進める。DBパスワードをチャットやGitに記載しない。
2. SQL Editorで `supabase/migrations/202610030001_logbook.sql` を実行。このSQLは初回用で再実行前提ではありません。RLS、anonの拒否、authenticatedの所有者読取のみ、service_roleだけの挿入RPCを実DBで確認する。
3. Authで閲覧者を登録し、本人が管理するメール・パスワードを設定。アプリに公開サインアップ機能はありません。Authの新規登録を無効にし、ユーザーUUIDを確認。
4. 送信用ランダムトークンをローカルで生成。各環境に別のトークンを割り当てることを推奨。`node scripts/writer-key.mjs` はトークンとhashをローカルの無視対象ファイルへ書きます。トークン本文は出力しません。
5. VercelプロジェクトのRoot Directoryを `experiments/cloud-logbook`、FrameworkをOther、Output Directoryを `public` に設定。Node 22。静的HTMLと `api/*.js` のFunctionsを配備する。
6. Vercelのサーバー環境変数に `.env.example` のキーを設定。`SUPABASE_ANON_KEY` はSupabaseの従来のanon JWTキー、`SUPABASE_SERVICE_ROLE_KEY` はservice_roleの秘密キー。これらを公開JavaScriptへ埋め込まない。`APP_ORIGIN` は公開URLのorigin（末尾 `/` なし）。`LOGBOOK_WRITERS` はトークンhash・owner UUID・project・sources・任意のrunを持つJSON配列。Previewは別originと資格を設定する。VercelのDeployment ProtectionがAPIを遮断する場合、認証付きの本番APIを使用する構成に調整し、送信CLIの到達性を実確認する。
7. ローカル/クラウド各送信環境のシークレット設定に `LOGBOOK_URL=https://公開ホスト` と専用 `LOGBOOK_TOKEN` を設定。同じリポジトリ内のCLIを呼び出す。秘密値をチャット、コマンド履歴、ログへ書かない。
8. 配備後に正しい/不正な送信資格、閲覧者分離、再送・異内容409・並行保存を実確認。4環境それぞれからHTTPSへ送信した証拠が揃ってから、4環境で動作したと扱う。

ローカルから本番DBを使う場合は `.env`（Git無視）に設定し、`APP_ORIGIN=http://127.0.0.1:4193` として `npm run dev`。HTTPの閲覧cookieが許可されるのはloopback設定だけです。本番はHTTPS・Secure/HttpOnly/SameSite cookie、no-store応答です。

CLIはリダイレクトを追いません。送信トークンは書込のみ、閲覧はSupabaseログインのみ。一覧はサーバー採番のsequenceでページ取得します。JSON/Markdown書出しは画面で取得済みのログだけです。更新が失敗すると前回表示を維持し、未更新と表示します。ログアウトで表示を消去します。

## ハーネスの検証

計画を固定し独立監査に合格してから実装。試行前に実装snapshotと予約を保存し、UT/SIT/FITの実観測を固定。ローカル技術的試験の採否と、本番配備・4実環境・本人評価の未確認を区別します。配備できる条件が整うまでは本番成功を記録しません。
