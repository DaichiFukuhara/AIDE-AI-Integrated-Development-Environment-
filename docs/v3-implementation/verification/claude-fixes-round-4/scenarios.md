# CIV3-016〜018の手動照合

主担当によるMarkdown手順の静的照合。Pythonの実行テストや台帳エンジンの自動運転ではない。

| ケース | 操作 | 規約上の結果 | 照合 |
| --- | --- | --- | --- |
| AJ / 016 | K1喪失、current B2の回復periodicがF2でfail。F2を直したB3を提案 | 限定検証の後、c1と修正c2、前回監査とopen指摘を含むadoption baseline-recoveryを作る。initialからB3全体を監査でき、失われたK1を通常差分経路で要求しない | pass |
| AK / 016 | AJが合格し、base_bundle=B2と通常版・取消状態も一致 | B3の不変参照を照合し、current切替、操作確定、c1/c2解消、新基準、該当保留解除、元通知への後続結果を同じstate更新で保存する。過去の不明な履歴は保証しない | pass |
| AL / 016 | B3監査中にcurrentがB4へ変更、または取消が先着 | 通常の一括反映条件を満たさずstale/cancelled。current切替や保留解除をしない。新subjectの再評価または取消確定へ進む | pass |
| AM / 016 | B3反映後に遅延した取消/再送が届く | stateの確定結果が優先。取消はalready-applied、同要求再送は同結果を返す。current・費用・基準を二重更新しない | pass |
| AN / 017 | 監査require-reviewと未解決指摘が保存済み | READMEとorchestrateともにサイクル全体は未完了。監査失敗の確定を完了条件にしない | pass |
| AO / 018 | 通常の修正adoptionが合格。stateの原子的切替前に中断 | current・基準・差分・保留・通知はすべて旧stateのまま。未採用として再開する | pass |
| AP / 018 | 同じ処理で切替直後、個別表示への転記前に中断 | stateには新current、解消差分、resolved保留、後続結果付き通知が一組で存在。表示をstateから復元し、修正済みscopeをactiveのままにしない | pass |
| AQ / 018 | XのF1は解消したが、別原因F3と対象外Yが残る | 保証されたF1だけresolved。同scopeのF3や対象外Yはactiveのまま。計画合格だけでも実装保留を解除しない | pass |

Python・テスト・演習は引き続き同一hash。既存15テスト/製品5テスト・CLI成功の証拠を引き継ぐ。実運用の効果と実課金の検証は含まない。
