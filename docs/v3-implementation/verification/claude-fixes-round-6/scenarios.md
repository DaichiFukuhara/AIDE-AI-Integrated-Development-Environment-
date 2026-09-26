# CIV3-020の手動照合

S-PROPOSALのkind別に静的照合した。実行済みのワークフローとは扱わない。

| ケース | 状態と要求 | 規約上の結果 | 照合 |
| --- | --- | --- | --- |
| AW | 回復中Xへ修正計画planをnormal/nullで提出 | adoption専用の欠落判定は適用しない。plan phaseの必要な確認を行い、合格ならchecked。implementationの保留は残り、許可された限定検証だけを開始できる | pass |
| AX | AWの修正が終わり、adoptionを提出 | S-CONTEXTからadoption向けのbaseline-recovery/Rを取得し、同じRをoperation/subjectに含める。欠落なら必要な参照付きblocked、新IDで再提出 | pass |
| AY | 回復中scopeの元操作へwithdrawalをnormal/nullで提出 | adoption専用条件では止めない。委任・target ID・expected subject hashを照合し、通常の取消規則で処理。対象が回復subjectでもexpected hashを差し替えない | pass |
| AZ | 回復中scopeのcycle_closedをnormal/nullで通知 | 通常の関連操作照合・失敗要求対応付け・ackへ進む。recovery_ref欠落で通知を止めず、元サイクルは周期判定が未解決のため未完了のまま | pass |

コード・テスト・製品演習は同一hashの成功記録を引き継ぐ。実運用効果は未実証。
