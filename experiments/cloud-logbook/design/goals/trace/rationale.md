---
{
  "id": "SG-TRACE",
  "revision": 1,
  "semantic_revision": 1,
  "primary_parent": "G-LOG",
  "parent_semantic_revision": 1
}
---

# 選択理由
前回のローカルHTMLは見やすいとの利用者意向を受け、HTMLの表示を継承する。クラウド実行とローカル端末のファイルは共有されないためHTTPSへ送信する。再デプロイごとにログを埋め込む案は作業中更新に弱い。常時接続より節目のHTTP送信＋再送キューで初期運用を小さくする。Vercel API＋Supabase DBを利用者が選んだ。未確認の4環境到達性・本番設定は実測後にのみ成功とする。
