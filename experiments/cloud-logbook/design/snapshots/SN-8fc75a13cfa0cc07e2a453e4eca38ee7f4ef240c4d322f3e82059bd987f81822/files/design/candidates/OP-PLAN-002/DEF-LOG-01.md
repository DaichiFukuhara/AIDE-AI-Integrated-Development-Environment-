---
{
  "id": "DEF-LOG-01",
  "revision": 2,
  "semantic_revision": 2,
  "primary_parent": null,
  "parent_semantic_revision": null,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "canonical_owner": "SYS-LOG",
  "dependencies": [],
  "consumers": [
    "G-LOG",
    "SG-TRACE",
    "AP-FILE",
    "SYS-LOG",
    "E-002"
  ],
  "candidate_operation_id": "OP-PLAN-002",
  "adopted": false
}
---

# 自動観測を区別する共通ログ定義の候補

domain=D-LOG、context=CTX-LOG、正本owner=SYS-LOG。Claude Codeは未信頼入力の外部sourceで、別の製品contextや監査者ではない。CLI/API/DB/Auth/UI/hook/workerの内部変換と責任はSYS-LOGが所有する。製品context間seamは非該当であり、外部hook境界の入力/失敗/再送/登録解除はsystem候補とE-002-plan.mdに完全に固定する。

イベントの14フィールド、source/phase/kind/outcomeの既存enum、offset付きtimeのUTC化、制限識別子、evidenceの安全性を維持する。source=claude-localに自動と手動の両方があり、autoは予約actor=claude-code-hook/v1、title=[auto:v1]、body.capture=claude-hook-v1という規約で区別する。これは自己申告可能な分類で真正性の証明ではない。新SQL・新フィールドはなし。旧イベントの内容を変更しない。

観測はhookが実際に渡したsafe metadataだけ。prompt/本文/ファイル内容/出力/秘密値/絶対path/transcriptは読取・保存・送信の対象にしない。正常例はRead完了のrelative path/成否不明/時間、例外は.env対象のsensitive-path分類と不明結果。詳細なallowlist・マスク順・長さ・数量・callback非一意時の限界はE-002-plan.mdに固定し、その意味を別consumerが再定義しない。

1runはprojectとsession_idのhash。保存済みイベントはid/time/contentを固定し同内容再送、owner/idが同一で異内容なら409。回復時も再生成しない。CLIは先に同じ.logbook-queue形式へ保存し、HTTPはbackgroundのみ。送信不能は保持、ローカル保存不能は欠落であり成功としない。初出時刻・native identity由来のsafe hash・確定内容の再利用stateはexperiment内.localに保持する。

認証・owner分離・資格のproject/source/run制限・redirect拒否・本番HTTPS/loopback制約を維持する。トークンは環境変数だけ。hook前景0終了/時間上限、worker上限、量と保持、実機確認条件は固定計画の規則。正式監査・採用状態を書かない。

画面の自動/手動分類だけを追加候補とする。一覧は手動更新。NEXT-01/02/04/05、Codex自動記録、本番、他source、4実環境は今回の対象外。既存minor/未確認を解消済みにしない。
