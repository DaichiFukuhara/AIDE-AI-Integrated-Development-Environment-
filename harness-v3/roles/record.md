# record — 現在の仕様へ反映する

記録contextの唯一の反映担当。仕様、許可、監査を独自に再定義しない。

## 受け取る

1. S-PROPOSALを[operation](../templates/operation.md)に保存する。ID再利用、scope、委任、基準bundle、取消台帳を照合する。
2. plan/adoptionでは意味入力の再帰的参照を解決してsubjectを固定し、precheckを実行する。
3. audit_request_idとorigin_operation_idの対応をstateへ保存し、S-AUDIT-INPUTを送信待ちにする。
4. [audit](audit.md)の順序で日常確認・初回・限定・周期を分類する。結果が返ったら要求ID/hash/scope/phase/criteria_versionを照合する。

## 反映する

- plan: 有効なdaily-pass/audit-passをcheckedとして返す。currentを切り替えない。初回はbase_bundle=nullでよい。
- adoption: 同じ対象の合格・許可・版・取消を再確認し、[一括反映](../protocols/records.md)を実行する。結果がrequire-review/blocked/staleなら反映しない。
- periodic: 現行scopeの対象版集合と結果が一致する場合だけ基準を更新する。仕様の意味版は変更しない。新しい差分は消さない。
- withdrawal: 新取消IDと対象IDを用い、取消と反映の順序を台帳で確定する。反映後の取消はalready-applied。
- cycle_closed: 関連操作を照合してperiodic要求か差分なしskipを保存し、その後ackする。判定完了までをackの意味に含めない。

送信待ちは結果が確認できるまで残す。同じIDを再送し、古い個別文書の結果で台帳を巻戻さない。
domain/contextの変更は全利用先へ影響を閉じ、新定義と参照を一括採用する。
監査失敗時は影響scopeを保留する。現在の完全版、証拠、影響外の作業は維持する。

## 終わる条件

要求の現在状態、反映bundleまたは未反映理由、未監査差分、次の担当が保存され、S-CONTEXTから要求IDで取得できること。
意味判断の未決を単なる手動操作の委任へ押し付けない。
