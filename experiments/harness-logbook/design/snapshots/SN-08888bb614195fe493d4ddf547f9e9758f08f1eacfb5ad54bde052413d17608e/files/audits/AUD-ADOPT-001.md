---
{
  "audit_id": "AUD-ADOPT-001",
  "audit_request_id": "AR-ADOPT-001",
  "origin_operation_id": "OP-ADOPT-001",
  "target_operation_id": null,
  "kind": "adoption",
  "review_mode": "normal",
  "recovery_ref": null,
  "scope": ["CTX-LOG", "FIT-01", "SIT-01", "SYS-LOG"],
  "phase": "implementation",
  "subject_hash": "c2d13158576611b8628edae06a075415d905c7d2e13b8a91f5e6fa074193f6ae",
  "subject_ref": "audits/subjects/ADOPT-001.json",
  "baseline_refs": {"CTX-LOG": "initial", "FIT-01": "initial", "SIT-01": "initial", "SYS-LOG": "initial"},
  "cumulative_diff_ref": {"from": "initial", "to": "design/snapshots/SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508", "change_ids": ["CHANGE-001"]},
  "change_ids": ["CHANGE-001"],
  "previous_audit_ref": null,
  "previous_subject_ref": null,
  "open_finding_ids": [],
  "review_delta_ref": null,
  "impact_scope": ["CTX-LOG", "FIT-01", "SIT-01", "SYS-LOG"],
  "reused_checks": [],
  "budget_account_refs": ["LOCAL-01"],
  "execution_id": "EXEC-AUDIT-ADOPT-001",
  "budget_check_ref": "design/state.md#EXEC-AUDIT-ADOPT-001",
  "policy_ref": null,
  "criteria_version": 1,
  "reviewer": "/root/harness_auditor (independent agent; drafter and implementer is /root)",
  "independence": "independent",
  "self_check_delegation_ref": null,
  "observed_at": "2026-09-29T06:43:01Z",
  "result": "require-review",
  "finding_ids": ["F-ADOPT-001"],
  "open_major_count": 1,
  "open_blocker_count": 0,
  "unverified": [
    "本監査は固定コード・証拠の読取監査。試験の独立再実行はしていない。",
    "HUMAN-01、本人理解、長期運用、全ブラウザ互換は未確認。",
    "採用確定、current切替、cycle_closedのackと周期判定は後置処理であり未確認。"
  ],
  "next_due": null
}
---

# 採用監査：保存済み破損ログの扱いに修正が必要

## 読んだ対象と限界

AR-ADOPT-001、固定subject ADOPT-001、IMPL-002とその不変参照のみを実装評価に使用した。implementation段階の基準はinitialからIMPL-002までの全体であり、TRIAL-001→002の修正差分だけへ範囲を短縮していない。plan監査合格をimplementation合格へ流用していない。起草・実装・記録担当 /root とは別エージェント /root/harness_auditor が実施した。

hash-jsonでsubject_hash c2d13158576611b8628edae06a075415d905c7d2e13b8a91f5e6fa074193f6aeの一致を確認。subject直下の仕様・定義・計画・委任・予算・実装・trial・evidence全34参照のSHA-256一致を確認した。次の4snapshotをsnapshot.py verifyで確認した。

- PLAN: SN-ed7cf25577bf4438dabd943f2768c463cc17624d4ad11a6905c949fed4b1a585
- IMPL-002: SN-a10ed5b19b8cb592953ed36ffbd6194f968b5da9c179af681753ca131062e508
- TRIAL-002証拠: SN-245c0ca4c3326b13e61ed829a4ff53c2ca411d2fac2a1fa2f7039308ae10ba8c
- 採用提案・試行記録: SN-2550ac754f285c0a1abab66dcbe177d22c5e55ef9feff63dad50cd0be32ed7a0

Windows権限制約に対応する読取専用の追加権限を使用した。製品やstateを編集していない。試験の再実行、新しいtrial、追加監査は行っていない。

開始時state revision 19、終了前照合revision 21で要求ID・対象hash・scope・phase・criteria version・取消なしを照合した。EXEC-AUDIT-ADOPT-001はreserved、outboxはin-flight。LOCAL-01の定義・委任参照は固定計画と同じ。監査累計1＋本予約1≦6、追加外部購入0≦0で実施できることを確認した。既存セッションのトークン費用はunknown。記録役による並行の台帳処理は対象コード変更として扱っていない。監査1実行の精算はrecord担当へ返す。

## 基準と根拠

表の参照名は上記snapshot内の同名ファイルを指す。

| criterion | 今回確認した固定証拠・実装 | 判定 |
| --- | --- | --- |
| DDD-01 | DEF-LOG-01のphase/kind/outcomeがlogbook.pyとview.mjsに一致。イベントpassと独立監査・採用・人評価をapp.jsで分離。ID再送/競合の意味がUTに対応。 | 確認済み。 |
| DDD-02 | CLIだけがeventsを追記し、HTTP/UIは読取のみ。server.read_contextとapp.renderがstateの表示要約/current_bundleを読み、イベントから採用を導かない。HTTPのPOST拒否とstate不変の試験を確認。 | 確認済み。 |
| DDD-03 | 排他ロック・atomic replace・重複ID・破損JSON・置換失敗のUT結果を確認。ただし既存eventのevidence構文検査をread_eventsが省略し、破損保存物でも追記可能。 | F-ADOPT-001により未達。保存整合性の受入条件に反する。 |
| DDD-04 | 製品のcontext間seamは単一CTX-LOGのため理由付きN/A。内部CLI→JSON→HTTP→UIは実CLI/HTTP試験、全取得後のvalidatePair、通信失敗/復旧観測で確認。 | context間はN/A、内部境界は確認済み。ただし既存不正参照の処理はF-ADOPT-001の影響範囲。 |
| DDD-05 | 自動13件＋JS4件、ブラウザ12項目がIMPL-002に対応。既存破損evidenceについては新規入力拒否テストのみで保存物の再読/追記を覆っていない。 | F-ADOPT-001解消後に不足ケースと関連回帰の証拠が必要。 |
| AIDE-01 | 4階層、plan_revision=1、DELEGATION-01、BUDGET-01、必須UT/SIT/FITと除外HUMAN-01を確認。plan checked後の実装と2trial、独立監査という記録が対応。 | 範囲・委任・予算は確認済み。必須保存条件にmajorがあるため採用は保留。 |
| AIDE-02 | 実ログ7件に主体/操作/結果/理由/次の操作/根拠があり、準備記録は事後記録と明記。ブラウザ試験とスクリーンショットは6件時点で、後のREAL-007追加と矛盾しない。本人評価は画面とtrialとも未確認。 | 確認済み。AI実使用を本人評価へ読み替えていない。 |
| AIDE-03 | 34参照hash、4snapshot、trialのIMPL-002参照を照合。TRIAL-001のneeds-fixを保存しTRIAL-002のpassと分離。implementation baselineはinitial、CHANGE-001を累積対象として固定。 | 版対応は確認済み。修正時は新実装subject/試行/差分/再監査要求が必要。 |

### UT/SIT/FITの証拠の評価

TRIAL-002-automated.jsonはPython13件、Node4件、構文確認の実行コマンド・開始終了時刻・終了コード0・標準出力/エラーを保持する。test_logbook.pyの実CLI→HTTP→JSON/Markdown、POST拒否、state対応のassertを読み、SIT-01の根拠として確認した。保存処理のロック、ID再送、競合、置換失敗、破損JSON、不正な新規参照を扱うUTは成功しているが、後述の反例は対象外だった。

TRIAL-002-browser.jsonの12項目は検索・工程・詳細・画面内根拠・時刻順・保持・コピーまたは明示代替・desktop/mobile幅・操作名・通信失敗時旧組保持・復旧を記録している。固定スクリーンショットも閲覧し、6実記録と計画のみ合格/未採用/本人未確認の区別を確認した。390pxでの操作/横はみ出しは保存済みブラウザ観測に依拠し、独立再実行はしていない。FIT-01の通常操作と通信失敗の範囲は証拠が揃っている。

TRIAL-001は17件成功でも根拠遷移などが不足しneeds-fix、TRIAL-002は画面内根拠表示と操作名補足でpassという履歴であり、旧失敗を消していない。HUMAN-01は固定計画が技術的試験採用の必須条件から外しているため未確認自体を重大指摘にしていない。

## 指摘

### F-ADOPT-001 — 保存済み参照の構文破損を受理し、追記で保存物を書き換える

- criterion: DDD-03、DDD-05（内部境界への波及: DDD-04）
- 対象版: ADOPT-001 / IMPL-002、src/logbook.py 82–84、99、119–140行。依拠する定義はDEF-LOG-01、必須条件はE-001のUT-01。
- severity: major
- owner: SYS-LOG実装担当 /root
- status: open
- 観測/具体的反例: 正常イベントを含むdata/events.jsonの既存event.evidenceが、保存後の破損・手編集等で `["../outside"]` に変わったケース。他の項目とJSON構文は有効とする。read_eventsはnormalize_event(..., check_evidence=False)を呼び、evidenceが文字列配列で重複なしという検査しか通さない。パス構文検査はsafe_file内にあるため省略される。続いて別IDでevidence=[]の正常イベントを追記すると既存保存物を正常と扱い、os.replaceへ進む。これは読取コードの経路追跡による反例であり、本監査で再実行した観測ではない。
- 影響: 「CLIは入力と既存ファイル全体を検証」「壊れた保存物を上書きしない」という固定条件を破る。API/exportは不正参照を含む保存物を正常として返す一方、UIのevidenceURLは../を拒否して更新失敗になるため、記録者には追記成功でも画面には新しい記録が出ない。範囲外ファイルがHTTPで読めるという指摘ではない（その経路はsafe_fileが拒否する）。
- 解消条件: 参照の構文検証を存在/リンク検査から分離し、保存済みeventの再読でも絶対パス、..、URL、空要素、バックスラッシュ等の不正構文を拒否する。参照先が後から消えた正常な相対パスの歴史イベントは引き続き読めるようにする。既存JSON内の不正参照を用いた再読/追記拒否、保存物のbyte不変、HTTPのエラー応答、正常履歴の後日根拠欠落を区別する回帰証拠を新しい固定実装版に保存する。
- 追加理由: 初回implementation監査でのみ確定できるコード経路。計画監査時は実装未存在だったため、既存計画指摘を再開したものではない。

## 次の処理

record担当は本結果をAR-ADOPT-001に対応付け、監査費用を1実行分精算し、current_bundleを切り替えず修正待ちとする。修正後はprevious_audit_ref=本結果、previous_subject_ref=ADOPT-001、open_finding_ids=[F-ADOPT-001]、固定review_delta_refとimpact_scope/reused_checksを持つ新要求を予約して送る。全体subjectを保持し、詳読範囲は保存検証とその利用先、追加証拠へ絞れる。変更のないUI/定義/版対応の確認は入力hashと依拠先同一を照合して再利用できる。

採用確定・current反映・cycle_closed/周期判定は合格結果受理後の後置処理であり、現時点の完了とはしない。修正後にも本人評価は未確認の表示を維持する。
