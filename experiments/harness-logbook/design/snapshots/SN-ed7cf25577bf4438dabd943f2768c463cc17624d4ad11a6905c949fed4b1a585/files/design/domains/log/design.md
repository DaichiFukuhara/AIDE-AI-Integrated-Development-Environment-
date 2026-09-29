---
{
  "id": "DEF-LOG-01",
  "revision": 1,
  "semantic_revision": 1,
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
    "E-001"
  ]
}
---

# 記録を読むための共通の意味

この製品のdomainは作業記録、contextはログの記録と閲覧。SYS-LOGがイベント保存と表示の整合を所有する。ハーネスの学習・記録・監査contextは開発手順であり、この製品の別サービスとはしない。製品内のcontext間seamはないためcontract_refs=[]はN/A。CLI・HTTP・UIは同context内の境界として以下を全てSYS-LOGが所有する。

イベント = {id, time, actor, phase, kind, title, body, reason, evidence:[project-relative path], next, outcome}。phaseはintake/design/plan/implementation/verification/audit/adoption/closure。kindはaction/decision/check/issue。outcomeはrecorded/pass/fail/unverified。時刻はUTCオフセット付きISO8601。表示はローカル時刻と日付。理由は説明用の短い根拠であり内部思考全文を記録しない。

記録者がIDを指定。同IDの再送は、time未指定なら保存済みtimeを使い、それ以外の全意味入力を比べる。完全同一ならunchanged、異なるならconflict。編集/削除/解決の上書きは提供せず、訂正や解決は新IDで元IDを本文から参照する。意味入力や証拠の改変を検出する監査snapshotとは別の観測記録であり、ログだけで監査を保証しない。

CLIは入力と既存ファイル全体を検証してから、同じフォルダの一時ファイルをatomic replaceする。排他ロックがある場合は拒否。クラッシュで残ったロックを勝手に解除しない。中断時は旧版または完全な新版が残る。正本はdata/events.json、最大5000イベント・1イベントの本文4000文字・全体5MB。

evidenceは既存のプロジェクト相対ファイル。絶対パス、..、URL、リンク/リパースポイント経由の逸脱、存在しない参照は拒否。保存時の正当性だけを保証し、後の根拠ファイル更新と不変監査証拠を混同しない。

HTTPはlocalhostへbindする読取専用。GET /api/events はversionとevents、GET /api/context はdesign/state.mdの公開要約（plan状態、trial状態、監査結果、current_bundle、cycle状態、人評価、next）を返す。部分的な取得失敗時は新旧を混ぜず直前の完全な組を残し更新不能を表示する。入力の形式が不正ならエラー、UIは「記録なし」と同一扱いにしない。HTMLはtextContentで表示し、証拠リンクは相対パスを検査して構成する。

実行ログのpass ≠ 独立監査pass ≠ 採用 ≠ 人評価。表示は正本に記録されたラベルを読み取る。stateの更新をUIやログ追記から行わない。取消は新規ログで事実を残すだけで、ハーネスの取消台帳はrecord担当が別途更新する。
