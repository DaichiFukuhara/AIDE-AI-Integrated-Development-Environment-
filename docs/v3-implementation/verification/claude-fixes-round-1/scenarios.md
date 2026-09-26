# Claude初回指摘の修正に対する手動照合

主担当が修正後のMarkdown規約・テンプレートを反例に当てはめた静的な手動確認。実際の台帳エンジンを実行した記録ではない。
判定欄は規約上その処理が一意に決まるかを示す。独立監査の判定は別に保存する。

| ケース / 指摘 | 入力状態と操作 | 規約から追った結果 | 照合 |
| --- | --- | --- | --- |
| A / CIV3-001 | planが意味不変の表記修正でdaily-pass。currentはB1のまま。7日経過、cycle_closed | recordsの未監査差分はcurrentへの採用に限る。plan操作履歴だけでunaudited_changesは空。差分なしskip。繰返し周期監査を起動しない | pass |
| B / CIV3-001 | [X,Y]で実装監査済み。独立な内部変更dXとdYをdaily-passで採用。periodic [X]がdXを保証 | 基準をX/Y別に検索できる。dXだけを解消しdYと初回日時を残す。次のY監査でXの独立な変更を再審査しない | pass |
| C / CIV3-001 | 同じ状態だが変更dXYは共同不変条件を持つ一項目。起点[X] | affected_scope=[X,Y]まで要求を拡大。仮に部分[X]の結果だけ届いても全要素被覆条件を満たさずdXYを消せない | pass |
| D / CIV3-001 | periodicの固定change_ids=[dX1]、監査中に同scopeのdX2が採用 | current版集合が合わなければ受理しない。別scopeの追加なら受理できてもchange_ids外の項目は消さない。期限は残差分の最古日時を使う | pass |
| E / CIV3-001 | XとYに別の監査基準があり、共有seamの版が違う | baselineが全IDに存在するだけでは保証を合成できない。共有参照・共同条件の証拠を照合し、互換でなければ限定監査へ渡す | pass |
| F / CIV3-002 | 初回監査fail。基準null。指摘はXのみ、Yと依拠先のhash・証拠は同一 | previous_audit/subject、open指摘、差分、impactを新要求に固定。Xと波及先を確認し、Yはreused_checksで引継ぎ。基準nullを理由に全体初回へ戻さない | pass |
| G / CIV3-002 | Y本文は不変だが、Yが使う共有定義をX修正時に変更 | 依拠先hashと影響scopeの条件を満たさずYの前回確認を引き継げない。必要なYの確認を追加し、無変更の無関係なZまでは広げない | pass |
| H / CIV3-003 | 実験金額上限10、使用8、adoption監査上限3 | 8+0+3>10。外部CLIを送信せずoutbox held-budget。未監査scopeと再開条件を保存 | pass |
| I / CIV3-003 | 複数実験をまたぐactivity_due、監査費用を覆う口座が未特定 | 終了した実験へ暗黙に計上せずheld-budget。既存委任が覆う口座を特定できれば新承認なしで再判定。不足する委任だけを利用者へ戻す | pass |
| J / CIV3-003 | 上限10、使用4、監査予約4、別の試行上限3 | 4+4+3>10で停止。監査を別担当へ委任しても共通口座の予約を残し、二重使用しない | pass |
| K / CIV3-003 | 監査送信後にタイムアウト。同IDを再送、費用未確定 | 予約を0へ戻さずin-flight。保存結果・実行状態を照会し、再送だけで二重起動しない。物理的再実行は旧費用を保持して新予約が必要 | pass |
| L / CIV3-004 | 判定後に作業用候補だけを変更 | bundleはsubject不変参照から構成するため作業変更は混入しない。不変参照側が改変/欠落ならhash照合で反映を停止 | pass |
| M / CIV3-005 | 中断なしで追加試行へ進む直前、別サイクルの周期監査がscopeをblockedにする | 追加実行前のS-CONTEXT照合で通常試作を止める。台帳に明示された原因解消の限定検証だけを予算内で許容 | pass |
| N / CIV3-006 | 模板のimmutable_refからsnapshotを開く | design/snapshots/SN-…/files/design/…はsnapshotツールの配置と一致。プロジェクト相対なので省略された基底を推測しない | pass |
| O / CIV3-007 | ユーザーが周期14日・cycle_closed無効を指定後に中断、未監査差分あり | stateの設定・出所・revisionを復元し7日へ戻さない。終了通知はtrigger-disabledの理由と残差分/期限を保存してack。14日後の次回作業でactivity_due | pass |
| P / CIV3-009 | 金額は残りあり、時間上限はunknownで保守的上限もなし | limits mapの金額はpassでも時間は保証不能。総合判定で実行を止め、各値・根拠・再開条件を保存 | pass |

CIV3-008はPythonの実行テストで確認する。重複キー（最上位、入れ子、Unicodeエスケープの同名）で終了コード1かつhashを出さないこと、異なるオブジェクトに同名キーがある正常JSONは従来のhashになること、manifestの後勝ちキーも拒否することを検証する。

実ユーザー運用、実課金の停止、Claudeの起動からstate台帳への自動連携はこの手動照合では実証していない。
