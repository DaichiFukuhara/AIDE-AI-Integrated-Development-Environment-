# CIV3-019の修正

前回[round 5](../claude-opus-5-5-high-round-5/report.md)でCIV3-016〜018はclosed。残るminor 1件を修正し、open blocker/major/minorすべて0を再確認する。

- S-CONTEXTの応答に有効なrecovery_ref、review_mode、change_ids、失敗監査/open指摘を追加。
- 学習役はadoption直前に照会し、同じrecovery_refをoperationとsubjectへ含めてhashを固定。
- 記録役は提案と監査のsubject/hashを一致させる。欠落・不一致なら必要な参照と再提出条件を示してblockedを返し、対象を黙って書き換えない。
- loss recordが未準備なら読取りは準備待ちを返し、記録役が別更新で用意してから再照会する。

5ケースで、正常な取得、null提案のやり直し、取消のhash一致、scope拡大時の準備待ち、参照変更後の再提出を静的照合した。
既存のコード・テストは無変更。差分と入力hashは前回監査時点の保存物と照合している。
