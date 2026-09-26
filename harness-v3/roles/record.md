# record — 現在の仕様へ反映する

記録contextの唯一の反映担当。仕様、許可、監査を独自に再定義しない。

## 受け取る

1. S-PROPOSALを[operation](../templates/operation.md)に保存する。ID再利用、scope、委任、基準bundle、取消台帳を照合する。
2. plan/adoptionでは提案の意味入力を再帰的に照合し、同じsubject/hashでprecheckを実行する。回復adoptionのreview_mode/recovery_refもS-CONTEXTの有効な参照と照合する。不足・不一致は必要な参照と再提出条件付きblockedとし、提案subjectを黙って変更しない。
3. audit_request_idとorigin_operation_idの対応をstateへ保存し、S-AUDIT-INPUTを送信待ちにする。正式監査の送信前に[予算](../protocols/budgets.md)を予約する。修正後の要求は前回監査・subject・差分・波及先・引継ぎ確認も固定する。
4. [audit](audit.md)の順序で日常確認・初回・限定・周期を分類する。結果が返ったら要求ID/hash/scope/phase/criteria_versionを照合する。

## 反映する

- plan: 有効なdaily-pass/audit-passをcheckedとして返す。audit-passはplan基準へ記録するがcurrentとimplementationの未監査差分は変えない。初回はbase_bundle=nullでよい。
- adoption: 同じ対象の合格・許可・版・取消を再確認し、[一括反映](../protocols/records.md)を実行する。baseline-recoveryの修正提案は同契約の全体再検証条件も照合する。結果がrequire-review/blocked/staleなら反映しない。
- periodic: 現行scopeの対象版集合と結果が一致する場合だけ基準を更新する。[差分消去の3条件](../protocols/records.md)を満たすchange_idsだけを解消し、対象外・新しい差分は残す。起点喪失の回復は同契約の例外条件と専用の解消理由を確認する。仕様の意味版は変更しない。
- withdrawal: 新取消IDと対象IDを用い、取消と反映の順序を台帳で確定する。反映後の取消はalready-applied。
- cycle_closed: 関連操作と保存済み周期設定を照合し、periodic要求、理由付きskip、または失敗要求への修正待ちの対応付けを保存してからackする。起点無効のskipでは未監査差分と期限を保持する。修正待ちでは失敗要求・指摘・解除条件を残し、サイクル全体は未完了と表示する。判定完了までをackの意味に含めない。

送信待ちは結果が確認できるまで残す。同じIDを再送し、古い個別文書の結果で台帳を巻戻さない。
domain/contextの変更は全利用先へ影響を閉じ、新定義と参照を一括採用する。
監査失敗時は影響scopeを保留する。現在の完全版、証拠、影響外の作業は維持する。
後続の合格結果が解除条件を満たす場合、基準/差分等の受理と保留解除・元通知の待機状態/後続結果参照を同じstate更新で保存する。解除だけを別の後処理へ残さない。

## 終わる条件

要求の現在状態、反映bundleまたは未反映理由、未監査差分、次の担当が保存され、S-CONTEXTから要求IDで取得できること。
意味判断の未決を単なる手動操作の委任へ押し付けない。
