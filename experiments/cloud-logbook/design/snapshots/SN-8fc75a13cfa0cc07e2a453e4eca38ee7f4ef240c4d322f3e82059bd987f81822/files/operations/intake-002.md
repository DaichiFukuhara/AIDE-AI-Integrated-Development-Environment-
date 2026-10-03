---
{"id":"INTAKE-002","revision":1,"semantic_revision":1,"experiment_id":"E-002","cycle_id":"C-002","state":"ready-for-plan-review","source":"利用者の2026-10-03の依頼・決定","baseline_bundle":"BUNDLE-001","baseline_implementation":"IMPL-005","reported_commit":"4fb3e3b (利用者申告、git操作での確認なし)"}
---

# Claude Code の作業の動きを、秘密を送らずに追えるか

利用者は NEXT-03 の自動記録を選び、最初の対象を Claude Code（source=claude-local）と決めた。手動の節目記録を残し、hook が観測した作業メタデータを同じログブックで確認できる状態を目指す。内部思考・作業内容の全文や、取得できていないサブエージェント操作を推測で記録しない。

今回の出力は intake、候補設計、E-002 の固定計画・評価、予算・委任、plan precheck、AR-PLAN-002 の作成と予約まで。監査者は Claude Opus 5.5 の外部独立監査。監査を起動・送信せず、製品コード・hook スクリプト・設定ファイルを作る前に止まる。

本番配備、Codex の自動記録、他の source、NEXT-01/02/04/05 は対象外。NEXT-04 は今回不可欠ではないと判断した。自動収集の成立と手動更新による画面確認を先に検証でき、ライブ監視の更新頻度・ページ統合・障害表示を追加すると別の評価が必要になるため。リアルタイム表示は今回保証しない。NEXT-01 の F-CLOUD-ADOPT-002 は open minor のまま引き継ぐ。

不確実な点は実機の hook イベント対応、入力キーと一意識別子、async/timeout の設定仕様、成否・時間を取得できる範囲。利用者提供の参考情報は仮説としてのみ扱い、外部ネットワークで調べない。FIT で実入力のキー・型・有無を観測し、危険な値や transcript 本文を保存しない。

既存の4階層 G-LOG → SG-TRACE → AP-FILE → SYS-LOG と CTX-LOG を使用する。定義と責任の候補は OP-PLAN-002 配下に置き、current_bundle=BUNDLE-001 と C-001 の完了記録を保持する。未採用の意味変更の影響を全利用先へ閉じ、旧版の合格を E-002 に流用しない。

許可はリポジトリ内の可逆な計画作成に限定。C:\Users\daich\claude-works 配下だけを読み書きし、TMP/TEMP/TMPDIR は experiments/cloud-logbook/.local/tmp、PYTHONUTF8=1、UTF-8 を使用する。外部ネットワーク、本番資格、課金、git 操作、グローバル設定・パッケージ・レジストリ・ACL 変更は禁止。既存 snapshot・監査結果・試行記録は変更しない。

要利用者確認は E-002-plan.md の UC-01〜03 に固定する。判断を得るために計画を具体化して監査予約まで進めるが、実装・設定の有効化・実機試行の許可とは扱わない。
