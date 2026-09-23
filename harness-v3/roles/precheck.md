# precheck — 対象の構造と版を確認する

入力は候補と固定するsubject、出力は同一subject_hashに対する構造結果と具体的な不足。
これは意味監査ではない。意味が変わる修正をしたら新subjectでやり直す。

- specのIDは一意。設計と根拠の対のID・revision・semantic_revision・親参照が一致する。
- 今回のsystemから主親をたどり、root_goal/subgoal/approach/systemの順を復元できる。循環や親の複数所有がない。
- 条件の割当、親の統合責任、選択groupを説明できる。今回不要な枝の不足だけでは落とさない。
- system正本が一つ。uses_systemsとモデル定義・公開dependencyに参照切れがない。
- seam正本ownerが一つで、両端の版・役割が一致する。片側の説明だけを監査入力にしない。
- [subject](../protocols/subject.md)の必須入力と不変参照、実装・試行・証拠・定義の版対応が揃う。
- 実験計画に対象外、予算、評価条件、許可、実装場所、関連検証、終了条件がある。
- systemのUT、subgoalのSIT、rootのFITが条件に対応する。plan時は将来確認、adoption時は今回必要な結果を照合する。
- [snapshot検証](../tools/README.md)を使う場合、manifestと保存ファイルのhashを確認する。ツールの成功を条件の十分性と混同しない。

構造failは場所・条件・修正方法を保存してdesignへ返す。曖昧な「全体を改善」だけを指摘にしない。
