# CIV3-020の適用範囲の修正

前回[round 6](../claude-opus-5-5-high-round-6/report.md)でCIV3-019はclosed。残るminor 1件に対してmessages.mdだけを修正した。

- S-CONTEXTが返すrecovery_ref/review_modeはadoption向けと明記。
- 欠落・不一致時のblocked条件を「回復中scopeへのadoption提案」に限定。
- plan/withdrawal/cycle_closedはnormal/nullの通常規則で扱う。planはplan phaseで確認し、実装の保留を解除せず限定検証のみ許容。

4ケースで、回復中の修正plan、後続adoption、取消、終了通知の各分岐を照合した。
確定条件は引き続きopen blocker/major/minorすべて0。コード・テストは変更していない。
