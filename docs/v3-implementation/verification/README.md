# 実装検証の範囲

- 最新の補助ツール: [15テストpass・skipなし](claude-fixes-round-1/snapshot-tests.json)。重複JSONキーの拒否・正常hash維持を追加。実行環境はWindows / Python 3.13。
- 製品演習: [実行結果](claude-fixes-round-1/exercise.json)。意図的な不具合を検出後、同じ5テストとサンプルCLI操作がpass。旧試行は固定したまま。
- [Claude指摘の手動シナリオ](claude-fixes-round-1/scenarios.md): 差分消去・限定再監査・監査予算等の16ケースを規約へ照合。
- [追加指摘の手動シナリオ](claude-fixes-round-2/scenarios.md): 失敗済み監査の再起動防止、基準更新後の差分起点、予算の担当分担を8ケースで照合。
- [予算の手動シナリオ](budget-scenarios.md): 不明額のある反復で、停止と継続の条件を照合。
- [最新パッケージ照合](claude-fixes-round-2/package.json): 67個の相対リンクと9テンプレートfrontmatterを確認。コード・テスト・演習7ファイルは15件/5件成功時と同一hashであり、規約だけの追加修正ではテストを再実行していない。
- 前回の63リンクと実行時の実装hashは[claude-fixes-round-1](claude-fixes-round-1/package.json)に保存。
- 以前の12テストと51リンクの記録はround-2に履歴として残す。
- 初回の9テストと演習記録はこのディレクトリ直下に履歴として残す。

障害注入は補助ツールの保存に対するもの。Markdown手順による採用、取消競合、独立監査、周期監査をすべて自動運転して検証したという意味ではない。
Python 3.10/3.11上の実行は未実施。junction検出ではそれらにないPath.is_junctionを呼べない状態でも実junctionを拒否することを確認した。
実ユーザーによる運用効果・理解の検証は未実施。
