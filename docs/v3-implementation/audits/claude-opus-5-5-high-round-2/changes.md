# Opus 5.5 / High 再監査への変更説明

前回: [Claude初回の原文](../claude-opus-5-5-high-round-1/report.md)。修正元はコミット9878e10のharness-v3。
前回の固定入力・回答は保持し、今回の対象を新しいpromptとhash集合へ固定する。

| 指摘 | 修正先と確認 |
| --- | --- |
| CIV3-001 | records/state/subject/messages/record/audit。基準をscope要素/phase/criteria別に索引。currentを変えないplanを未監査差分から除外。独立変更は別change_id、共同条件は分割不能なaffected_scopeを保持。周期scopeの閉包、要求change_ids・全scope被覆・版一致の3条件で消去 |
| CIV3-002 | audit/criteriaとaudit/operationテンプレート。前回監査・subject、open指摘、修正差分、波及scope、引継ぎ確認を固定。前回確認済みで影響外の証拠を引き継ぎ、基準nullでも初回全体へ戻さない |
| CIV3-003 | 新設budgets、messages/intake/record/audit/orchestrate/experiment、state等。監査・有料記録費用の所属、親上限を含む全口座判定、送信前予約、held-budget、応答不明の予約保持、再送と物理再実行の区別 |
| CIV3-004 | recordsの反映手順。subjectの不変参照からbundleを作り、全参照hashを反映前に照合 |
| CIV3-005 | experimentの各追加実行前にS-CONTEXT・blocked_scopesを照合。原因解消の限定検証だけを明示条件内で許容 |
| CIV3-006 | templates/READMEのimmutable_refをプロジェクト相対のdesign/snapshots/SN-…/files/…へ修正 |
| CIV3-007 | stateにperiodic_policyと出所、各要求にpolicy_ref。再開で保存設定を復元し、設定変更でも初回差分日時を維持 |
| CIV3-008 | snapshotのJSON入力とmanifestをobject_pairs_hookで重複キー拒否。最上位/入れ子/Unicode同名のCLI拒否、正常hash維持、manifestの後勝ち拒否を実行確認 |
| CIV3-009 | experiment/trial/stateをaccount/limit_id別mapへ具体化。単位、使用量、上限根拠、未決予約、次の上限、各判定と総合判定を保存 |

最新検証はverification/claude-fixes-round-1。snapshot 15テスト（skipなし）、製品5テストと演習CLIが成功。63リンクと9テンプレートfrontmatterも確認。
16ケースの手動シナリオはMarkdown規約の静的照合であり、全ワークフローを実行したとは扱わない。

## 再監査の範囲

openのCIV3-001〜009の解消条件、添付implementation.diffと新規budgets、波及先の役割・受渡し・テンプレート・テストを確認する。
4階層/DDDの配置、取消IDと台帳、定義の影響閉包、snapshotの保存・パス処理等の無変更部分は、同一入力と依拠先を確認した上で前回の証拠を引き継げる。
変更がそれらへ波及する場合や新しい重大反例がある場合は、理由と箇所を示して必要な範囲を追加確認する。
改修担当による説明を合格根拠とせず、今回の本文・差分と過去の指摘を照合すること。
