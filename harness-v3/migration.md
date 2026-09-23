# v2からの移行

v2は設計を引き渡すハーネス、v3は必要な枝を試して採否と設計反映まで扱う。
v2のpublishedや設計監査passを、実装・運用の保証へ自動変換しない。

1. 元のv2ツリーと閉包を読み取り専用で残し、source_refに元ID・意味版・閉包IDを指定する。
2. 今回試すsystemと祖先だけを選ぶ。rootはmaster、subgoal/approachはgoals、systemの正本はdomainsへ配置する。
3. parentをprimary_parentへ対応付ける。systemの主親は一つにし、追加利用はuses_systemsへ分離する。
4. domain/contextの用語・責任・ルールと契約owner・両端を確認する。旧ノードの数から機械的に境界を決めない。
5. v3のrevision/semantic_revisionを初期化し、元版をsource_refに保持する。current_bundleと監査基準は未採用/nullから始める。
6. 最初のplanで今回必要な範囲を監査し、実装・関連テスト・実使用を行う。既存結果は対象版と保証範囲を確認できるときだけ証拠として参照する。

全プロジェクトの一括移行は不要。対象外の旧枝は所在と未移行であることを示す。
既存の公開・許可・予算を拡張しない。原本の移動・削除を移行の条件にしない。
