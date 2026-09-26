# CIV3-019の手動照合

Markdown受渡しの静的照合。実行済みの台帳エンジンとは扱わない。

| ケース | 入力・操作 | 規約上の結果 | 照合 |
| --- | --- | --- | --- |
| AR | B2の回復監査失敗後、学習役がB3を提案する | 直前のS-CONTEXTからloss record R、baseline-recovery、c1、F2/失敗要求を取得。operationとsubjectへRを含めてHを固定。記録役はHのまま監査へ渡す | pass |
| AS | 学習役が古い既定値recovery_ref=nullのH1で提出 | 記録役はR・mode・scope/change_ids・再提出条件を示してblocked。H2へ暗黙に差替えない。学習役が新subject/H2・新operation_idで再提出 | pass |
| AT | H2の提案監査中に取消が届く | 提案・監査要求・取消のexpected_subject_hashはすべてH2。記録側と監査側で異なるhashを使わず、通常の取消先着/反映先着の規則を適用する | pass |
| AU | 対象scopeの閉包が広がり、有効なloss recordがまだない | S-CONTEXTは準備待ちと理由を返す。記録役が別更新で対象全体のloss recordを固定後、学習役が再照会して提案する。読取りでstateを更新しない | pass |
| AV | 提案後に対象版や有効な回復参照が変わる | 受付時に不一致を検出して必要な参照付きblocked/stale。元payloadを保ち、新IDで再提出する。同ID再送は既存の確定結果を返す | pass |

Pythonコード・テスト・演習は同一hashの実行証拠を引き継ぐ。実課金・実運用の効果は未実証。
