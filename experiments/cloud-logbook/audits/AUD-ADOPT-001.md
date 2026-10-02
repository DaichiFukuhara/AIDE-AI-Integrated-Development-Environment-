---
{
  "audit_id": "AUD-ADOPT-001",
  "audit_request_id": "AR-ADOPT-001",
  "origin_operation_id": "OP-ADOPT-001",
  "target_operation_id": null,
  "kind": "adoption",
  "review_mode": "normal",
  "recovery_ref": null,
  "scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "phase": "implementation",
  "subject_hash": "e98d6292c725145dd0bb3c30da77ce42e6410b1551c2e37c8fbc3126202c2a7a",
  "subject_ref": "audits/subjects/ADOPT-001.json",
  "baseline_refs": {
    "CTX-LOG": "initial",
    "FIT-01": "initial",
    "SIT-01": "initial",
    "SYS-LOG": "initial"
  },
  "cumulative_diff_ref": {
    "from": "initial",
    "to": {
      "id": "IMPL-003",
      "snapshot_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2",
      "files": [
        {
          "id": "api/events.js",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/api/events.js",
          "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
        },
        {
          "id": "api/health.js",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/api/health.js",
          "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
        },
        {
          "id": "api/session.js",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/api/session.js",
          "sha256": "97a1731cfb5d647315cc2c6a33f638486180820275aad3c8d71f8126e87567e8"
        },
        {
          "id": "cli/logbook.py",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/cli/logbook.py",
          "sha256": "7e52fba9c73240dd0100d5ffb0796b72b93fb9cdb076c7beaa3fb8190f448682"
        },
        {
          "id": "dev/fixture-store.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/dev/fixture-store.mjs",
          "sha256": "c2673d0ce9867552bfa369b593e2679b9c09267be7a0bd0fd553e0e02280f0bd"
        },
        {
          "id": "lib/schema.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/schema.mjs",
          "sha256": "db18c8098ace4501d8f58d5008afd80f1f3687a228aa2c94c5f7e200bfd625f9"
        },
        {
          "id": "lib/service.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/service.mjs",
          "sha256": "6e550cd5136e02750ed45d8d761ed4a4479de0cd95208c26be01781eeee95851"
        },
        {
          "id": "lib/supabase.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/lib/supabase.mjs",
          "sha256": "d82ee069f287d063702e3524c369ed500b1d1b71026515403be6085994b78dc1"
        },
        {
          "id": "public/app.js",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/public/app.js",
          "sha256": "95d09ae920d049f8c45779d44ac7253a4e71bb33c08b0d112b1d282421dab1a9"
        },
        {
          "id": "public/index.html",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/public/index.html",
          "sha256": "7f523a5bc31620ff908e328c866874c9be5d371b178630a758498890ee56eb37"
        },
        {
          "id": "public/styles.css",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/public/styles.css",
          "sha256": "71f24000802dac2d9a419548190790cb38480ee20f94ab39def7fa423481641a"
        },
        {
          "id": "scripts/dev.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/scripts/dev.mjs",
          "sha256": "f728fed42994d6f034d40d34ca0ee819fee7abd7b8d43b9058cca45e2c0d1a87"
        },
        {
          "id": "scripts/writer-key.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/scripts/writer-key.mjs",
          "sha256": "d1a4bd044652e11bbb37c2e8e136eebf212be05361e84cb37d7320d30b4d2fc8"
        },
        {
          "id": "supabase/migrations/202610030001_logbook.sql",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/supabase/migrations/202610030001_logbook.sql",
          "sha256": "55c67bbbb1c80599c1049852d04b1298312d2f3cd3e48126e3f997621bd3bfaa"
        },
        {
          "id": "tests/integration.test.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/tests/integration.test.mjs",
          "sha256": "f15a603bd096889ec61c401a0c617948dd42da321d62d7eac20493263775dc02"
        },
        {
          "id": "tests/service.test.mjs",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/tests/service.test.mjs",
          "sha256": "95dba5725cb2e14a6bab71512c321fc0d386b521c17137d8e8ec46403dc72813"
        },
        {
          "id": "README.md",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/README.md",
          "sha256": "5816d7abedc45b79bfb5f677f7453e6e6fea4cf3cbf6fb9cc171194be5fe727a"
        },
        {
          "id": "agent-instructions.md",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/agent-instructions.md",
          "sha256": "17363ce8aa4bdfeda0bbed46320042065fe05e03576945128b54abc70c53f974"
        },
        {
          "id": "package.json",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/package.json",
          "sha256": "f1ace1b766ffdd7e85674db4a48a5c3269e75bd9243f2c1bd2b4b596fcd74a5c"
        },
        {
          "id": "vercel.json",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/vercel.json",
          "sha256": "aae1c40e107f781a55e1360e1fc4b277989b5871912d009ee25fefd9edd14daf"
        },
        {
          "id": ".env.example",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/.env.example",
          "sha256": "352910f4de835d3d62697760de4b0cf7b87368c8251bd3c99e13891587f9073f"
        },
        {
          "id": ".gitignore",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/.gitignore",
          "sha256": "8eddc449ef8e80bcb420c47db10931c282b08111728c0560cfd3a297ff4bf75b"
        },
        {
          "id": ".gitattributes",
          "immutable_ref": "design/snapshots/SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2/files/.gitattributes",
          "sha256": "bd9663d71ffce4f030fba3bf7285472e2fab87ce8f71d180d20c14060d0c42a1"
        }
      ]
    },
    "change_ids": [
      "CHANGE-001"
    ]
  },
  "change_ids": [
    "CHANGE-001"
  ],
  "previous_audit_ref": null,
  "previous_subject_ref": null,
  "open_finding_ids": [],
  "review_delta_ref": null,
  "impact_scope": [
    "CTX-LOG",
    "FIT-01",
    "SIT-01",
    "SYS-LOG"
  ],
  "reused_checks": [],
  "budget_account_refs": [
    "LOCAL-01"
  ],
  "execution_id": "EXEC-AUDIT-ADOPT-001",
  "budget_check_ref": "design/state.md#EXEC-AUDIT-ADOPT-001",
  "policy_ref": null,
  "criteria_version": 1,
  "reviewer": "/root/harness_auditor (independent agent; drafter and implementer /root)",
  "independence": "independent",
  "self_check_delegation_ref": null,
  "observed_at": "2026-10-02T18:46:42Z",
  "result": "require-review",
  "finding_ids": [
    "F-CLOUD-ADOPT-001"
  ],
  "open_major_count": 1,
  "open_blocker_count": 0,
  "unverified": [
    "実Supabase/Postgres/Auth/RLS/RPCとVercel HTTPS配備は未確認。独立SQL読取確認とstub試験を本番成功へ読み替えない。",
    "4実環境からの送信、クラウドキュー持続性、本人評価、長期運用、他ブラウザは未確認。",
    "native download完了は未確認。固定証拠は生成JSON/MarkdownとJSONコピーまで。",
    "採用確定/current反映/cycle_closed/周期判定は未実施。"
  ],
  "next_due": null
}
---

# クラウド版の採用監査：一時Auth障害の分類を修正する

## 固定対象・予算・独立性

対象はCLOUD-LOGBOOKのAR-ADOPT-001、ADOPT-001、IMPL-003。phase=implementation、criteria version 1、scope=CTX-LOG/FIT-01/SIT-01/SYS-LOG、累積差分initial→IMPL-003（CHANGE-001）を確認した。旧ローカル実験の監査合格を流用していない。

hash-jsonでsubject hash e98d6292c725145dd0bb3c30da77ce42e6410b1551c2e37c8fbc3126202c2a7aが一致。仕様・定義・計画・委任・予算・実装・試行・証拠51参照の実測SHA-256は不一致0件。次の4snapshotをverifyした。

- SN-93aa04c2045e9a8d9427752b0e72563365d6a8911c6c54fa472c697ebd2b76c4（計画）
- SN-4a0165ebc7c4484743bb628cf217aadd7bcbdc91d52cdddfd511bd1db042aae2（IMPL-003）
- SN-cb14a06d37657fd2fa3481066d1901b35ce532bce117fc5e888d5daa6c45bc62（第3試行証拠）
- SN-3712c60a62aeeb08724006eb993f0412021059827cda44bab206d95394932b79（提案・履歴）

state revision 25で取消/blockedなし、要求・対象版・予約EXEC-AUDIT-ADOPT-001を照合。LOCAL-01の定義/委任は固定計画と一致し、監査累計1＋本予約1≦6、trial累計3≦6、record累計2＋未決1≦80、追加外部購入0≦0。既存セッションのトークン費用はunknown。

起草/実装担当/rootとは別の/root/harness_auditorが実施した。製品・state・既存結果は未編集。Windowsのsnapshot ACL制約に対し読取権限を使用。固定コード/証拠の監査に加え、今回の予約内で固定supabase/serviceモジュールにメモリ内偽transportを渡す非破壊確認を1コマンド実施した。外部通信・本番資格・ファイル書込・新規trial起動はない。この確認は下記指摘の監査証拠であり、製品の試行合格に加算しない。

## 基準と根拠

参照ファイルは上記snapshotの固定版。

| criterion | 今回確認した範囲 | 判定 |
| --- | --- | --- |
| DDD-01 | schemaの4source、phase/kind/outcome、UTC正規化、owner+IDの同内容/409、追記訂正が定義に対応。失敗は失敗として記録。 | 一般意味は確認済み。一時Auth障害の結果分類はF-CLOUD-ADOPT-001で未達 |
| DDD-02 | serviceでwriter資格からowner/scopeを決定、閲覧はcookieとuser検証。DB秘密鍵は挿入だけ、読取はviewer JWT。CLIとUIは正式採用状態を更新しない。 | 確認済み |
| DDD-03 | DB unique/transaction RPC、CLIの先行fsync/temp replace/lock/ACK後削除、同内容再送を確認。障害時UIの旧表示保持がAuth 500/429で破られる。 | major指摘の解消が必要 |
| DDD-04 | 単一contextのseam N/Aは維持。内部CLI/API/Auth/DB/UIに対応する権限・再送・エラーを確認。Auth→service→UIのエラー変換に具体的不一致。 | context間N/A、内部境界F-CLOUD-ADOPT-001未達 |
| DDD-05 | UT/SITの自動8件、FIT12項目とIMPL-003が対応。実CLI/HTTPとfixture storeを明確に区別。Authの非401一時障害の回帰が不足。 | 指摘範囲以外は確認済み |
| AIDE-01 | 4階層、固定計画、委任/予算、ローカル試験採用と本番/4環境/本人の未確認条件を確認。 | 範囲は妥当。majorがあるため採用は保留 |
| AIDE-02 | 実CLIログ4件、事後記録明示、理由/根拠/次操作、fixture表示、未確認の本番/本人表示を確認。デスクトップ・mobile画像も閲覧。 | 確認済み |
| AIDE-03 | 51参照hash、4snapshot、trialごとの実装/証拠、失敗2試行の保存、currentとログ結果の分離を確認。 | 確認済み。修正後は新subjectとtrialが必要 |

## SQL・認証・送信の独立確認

SQLはowner/event_idのunique、sequence identity、所有者select RLS、テーブルのanon/authenticated/service_roleへのrevokeと必要なselect/insertの再grantを持つ。logbook_recordはsecurity invoker/search_path=''、insert on conflict do nothing後に既存eventとjsonb比較しinserted/duplicate/conflictを返す。実行権をPUBLIC/anon/authenticatedから外しservice_roleだけに付与。logbook_listはsecurity invoker、auth.uid()のowner制約とRLS、sequence<beforeの降順、上限51を持ちauthenticatedだけに実行権を付与している。検索条件はSQL引数で渡され、文字列の動的SQL組立はない。

この静的確認で定義との対応と権限配置を確認したが、実Postgresでのmigration・競合・RLSの成功は未確認。fixtureStoreの同時再送成功はDBエンジンの独立性/競合を証明しない。固定計画のDEPLOY-01が実DB・不正資格・競合・HTTPSの確認を本番利用の必須条件としているため、未接続そのものは今回のmajor指摘にしていない。

writer認証はsha256のconstant-time比較とproject/source/任意run制限、viewer認証はSupabase user検証とrefresh、HttpOnly/SameSite/本番Secure cookie、変更要求のorigin確認を持つ。writerでGETできないことと別viewerのowner分離は固定テストで確認済み。UIはlogout時にepochを進めて旧読取応答の再表示を防ぎ、行・詳細・exportを消す。ただし一時Auth障害をinvalid sessionと誤分類する問題は下記の通り。

CLIはイベントを保存してから送信し、flushは保存したbyteを送る。ACKがinserted/duplicateかつ200/201のときのみ削除。redirectを追わず401/通信不可で保持、lock競合時は停止。トークンは環境変数から取得し、エラーの本文・秘密値を出力しない。writer-keyは無視対象.localへトークン/hashを保存し本文をstdoutへ出さない。custom queueの管理やクラウド終了時のキュー持続性はユーザー側の配置条件であり、4環境実証の未確認事項として残されている。

## 固定試験と失敗履歴

TRIAL-003-automated.jsonはnode --testの終了コード0、8件passを保持。テスト本文から形式/日付/入力上限、writer scope、10並行同内容再送、409時元内容保持、viewer owner分離、ページ50+5、検索、refresh/logout、実CLIのoffline保存/401保持/通信断保持/再送/redirect拒否と秘密非出力を確認した。storeは明示的なメモリstubであり、本番との境界は記録されている。

ブラウザ12項目は実ログ、詳細、検索/絞込、JSON/Markdown生成、JSONのキーボードコピー、390px/1280px、通信不可時旧表示、オンライン/オフラインlogout消去、空表示を確認する。画像と実ログ4件の固定書出し内容も整合する。生成物は取得済み分だけと明示。native downloadの完了通知は未確認だが、書出した内容を画面から取得する実証があり、これを本番ファイル保存の成功へ読み替えていない。

TRIAL-001はspawn EPERMを保存した上で同じ固定版を権限付き再実行、自動8件成功後にoptionタグ欠落を実ブラウザで発見してneeds-fix。TRIAL-002は絞込修正後もdownload内容を確認できずneeds-fix。TRIAL-003でプレビュー/コピーを追加して検証。旧失敗を消した形跡はない。

## 指摘

### F-CLOUD-ADOPT-001 — Authの一時障害を401に変換し、前回ログとセッションを消してしまう

- criterion: DDD-01、DDD-03、DDD-04、DDD-05。対象受入: DEF-LOG-01の「エラー時に前回表示を維持」「空・未接続・失敗を区別」、FIT-01の通信失敗時旧表示。
- 対象版/場所: ADOPT-001 / IMPL-003、lib/supabase.mjs 5行のpath.startsWith('/auth/')、lib/service.mjsのviewer catch、public/app.jsのload catch(e.status===401)。
- severity: major
- owner: SYS-LOG実装担当 /root
- status: open
- 具体的反例: 正常に閲覧していたセッションでGET /api/eventsを行った時、/auth/v1/userとrefresh endpointが一時的な500または429を返す。callが/auth/の非2xxを一律authentication_failed/401へ変換するため、viewerがcookieを削除し、UIは認証切れとしてclear()する。DBのログ自体は削除されないが、要求した「旧表示を保持して未更新と示す」が実行されず再ログインを要求する。
- 独立観測: 固定supabase.mjsのtransportをネットワーク不要の偽Responseに置換し、固定createServiceへ渡した。GET /api/eventsにはfixtureのaccess/refresh cookieを設定。upstream500→HTTP401(authentication_failed)、Max-Age=0 cookie2件。upstream429→同じ401と削除2件。対照のtransport通信例外→HTTP503(storage_unavailable)、cookie削除0件。UIが401でclearする経路は固定コード読取で確認した。実ブラウザの再試験はこの監査では行っていない。
- 影響: ローカルで再現可能な境界変換不具合であり、DEPLOY-01未接続による単なる未検証事項ではない。保存したネットワーク断のFITだけでは、HTTP応答を返すAuth障害を覆っていない。
- 解消条件: Auth上流の一時的障害（5xx、429等）と実際のinvalid credentials/sessionを区別し、一時障害を503等の再試行可能な失敗として返してcookieと前回表示を保持する。実認証無効時の401/clearは維持する。user/refresh両経路で500/429、通信例外、invalid sessionを確認し、cookie非削除・UI旧ログ保持・復旧後の取得・本当の認証失効時消去の回帰証拠を新しい固定実装版へ保存する。
- 今回追加する理由: 初回implementation監査で具体的なadapter変換を確認して初めて確定した反例。planの再審査や未実装を理由とする指摘ではない。

## 次の処理と未確認範囲

open major 1件、blocker 0件。record担当は本結果を要求に対応付け、監査費用1実行を精算し、採用/current反映を保留する。修正後は前回結果/subject、F-CLOUD-ADOPT-001、固定差分、影響範囲、再利用チェックを付けた新要求を予約する。詳読対象はAuthの応答分類とsession/UIの利用先・追加証拠。変更のないSQL、queue、UI layout等はhashと依拠先を照合して確認を引き継げる。

修正が合格しても実DB/Vercel配備、4実環境、クラウドキュー持続性、本人評価、native download完了は未確認として残す。採用確定・cycle_closed等は合格受理後のrecord処理であり、本結果は実施しない。
