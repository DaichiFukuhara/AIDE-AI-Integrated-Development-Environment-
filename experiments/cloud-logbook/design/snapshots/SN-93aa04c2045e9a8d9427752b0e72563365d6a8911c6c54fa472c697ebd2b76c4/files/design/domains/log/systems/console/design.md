---
{
  "id": "SYS-LOG",
  "kind": "system",
  "revision": 1,
  "semantic_revision": 1,
  "status": "ready",
  "primary_parent": "AP-FILE",
  "parent_semantic_revision": 1,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "source_refs": [
    "DELEGATION-01"
  ],
  "children": [],
  "uses_systems": [],
  "model_definition_refs": [
    "DEF-LOG-01"
  ],
  "owned_seams": [],
  "seam_refs": [],
  "dependencies": [],
  "unit_test_id": "UT-01",
  "subgoal_integration_id": null,
  "final_integration_id": null
}
---

# 認証・検証・冪等挿入・読取・再送・HTML表示を整合させる

# 共通ログの定義と責任
domainは作業記録、contextはCTX-LOGのみ。SYS-LOGが送信・受信・保存・閲覧の整合を所有する。VercelとSupabaseは配備境界であり異なる意味のcontextではない。内部のCLI/API/DB/Auth/UI境界をSYS-LOGが所有し製品context間seamは理由付きN/A。
イベント={id,time,source,project,run,actor,phase,kind,title,body,reason,evidence:[],next,outcome}。sourceはcodex-local/claude-local/codex-cloud/claude-cloud。phaseはintake/design/plan/implementation/verification/audit/adoption/closure、kindはaction/decision/check/issue、outcomeはrecorded/pass/fail/unverified。時刻はoffset付きISO8601でUTC正規化。id/project/runは制限付き識別子。説明は短い判断理由で内部思考全文を要求しない。根拠はHTTPS URLまたはプロジェクト相対パス。パスは表示するだけでクラウドからローカルの根拠ファイルを読めるとは主張しない。
ログ成功は監査や採用の保証ではない。本製品は観測だけを保存し正式状態の書込みはしない。訂正・解決は新IDで追記。所有者+イベントIDの意味入力が同一なら再送成功・増加なし、異内容なら409。複数送信の競合はDBの一意制約と1transactionのRPCで防ぐ。received sequenceはDB側で採番し、ブラウザの継続ページ取得はこの安定した順序に基づく。
書込APIは環境変数の送信者設定に持つsha256トークンhashを照合し、owner UUIDと許可project/source/run（指定時）へ限定。閲覧者cookieとは別資格。送信者は読取APIやDB秘密鍵を持たない。DBのRLSは所有者の読取だけを許しanonの読取・Authユーザーの書込は拒否。挿入RPCはservice_roleのみ。API秘密鍵はサーバー環境変数だけに置く。閲覧ログインはSupabase Authを検証し、HttpOnly/SameSite cookieで管理。ローカル動作時のみloopback HTTPを許容し、本番cookieはSecure。ログイン等のブラウザ変更要求は同一originを検査。
CLIは常にローカルのイベントファイルへ先に保存し、HTTPSへ送信。送信に成功するまで未送信を保持。同じID/time/contentを再送し、409/401などを成功や破棄へ置換しない。トークンをログ・キュー・コマンド出力へ記録しない。ローカルキューは1ファイル/イベント＋排他ロック。通信失敗・途中終了で送信が重複してもDBで冪等化。ユーザーが指定したendpointを使い、不正URL・HTTP非loopback・redirectへの資格流出を拒否。
画面はログイン・プロジェクト/実行環境/作業の絞込・検索・詳細・ページ継続取得・取得済みJSON/Markdown書出し。エラー時に前回表示を維持し古い表示であることを明示。空・未接続・失敗を区別する。HTMLはtextContent等で挿入、URLを検査。初期デモは実ログと明確に区別し本番へ勝手に送らない。


受入: UT-01をexperiments/E-001-plan.mdの固定条件で確認する。親条件を子へ割り当て、systemの個別確認と親の結合確認を区別する。本人評価は未確認。
