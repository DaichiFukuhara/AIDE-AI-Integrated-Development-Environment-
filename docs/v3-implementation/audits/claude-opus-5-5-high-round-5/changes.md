# CIV3-016〜018の修正と指摘ゼロの再確認

ユーザー指定の確定条件はopen blocker/major/minorすべて0。前回[round 4](../claude-opus-5-5-high-round-4/report.md)はCIV3-013〜015をclosedとしたが、minor 3件が追加されたため確定していない。

| 指摘 | 修正 |
| --- | --- |
| CIV3-016 | baseline-recoveryを修正adoptionにも適用。終点は提案bundle、initial起点で全体を監査。喪失項目と提案分を固定し、合格後はcurrent/操作確定/新基準/新旧差分解消/保留解除/通知対応を一括保存。既存のbase照合・取消・再送条件も適用 |
| CIV3-017 | 入口READMEで必要な周期判定の合格または理由付きskipを完了条件とし、修正待ち・予算待ち・実行中はサイクル全体が未完了と明記 |
| CIV3-018 | 通常adoption/periodicでも、受理と条件を満たす保留解除・通知更新を同じstate更新に含める。stateにactive/resolvedと後続結果参照を明記。別原因・対象外の保留は解除しない |

8ケースをverification/claude-fixes-round-4/scenarios.mdで手動照合。Pythonコード・テスト・製品例は無変更で、実行時のhashと照合して証拠を引き継ぐ。
差分はround 4に実際に渡した入力を保存したものと比較し、そのhashが前回execution.jsonと一致することを確認した。
