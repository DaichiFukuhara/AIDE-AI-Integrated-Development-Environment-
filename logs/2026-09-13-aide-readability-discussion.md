# Work log: AIDEの必要性と設計書の読みやすさ改善に関する検討記録

- Log keeper: Luna
- Started: 2026-09-13（開始時刻の厳密な記録なし、Asia/Tokyo）
- Updated: 2026-09-13T20:24:00+09:00
- Status: in-progress
- Workspace: `C:\Users\daich\claude-works\AIDE-AI-Integrated-Development-Environment-`

## Objective

ここまでのAIDE評価、AIの言葉遣いにより設計書が読まれない・理解されない問題、章ごとの新構成案についてログに残し、その変更をコミット、push、PR化する。

## Timeline

### 2026-09-13T00:01:00+09:00 — discovery

AIDEが解こうとする「AIの暗黙判断を減らし、設計判断を追跡可能にする」問題には必要性があると評価した。

- Evidence/rationale: 承認済み仕様と下書き、選択理由、制約、変更影響を保存情報として区別できる点は、継続開発や複数の人・AIによる開発で有用。
- Evidence/rationale: 小規模なスクリプトや短い試作では、全工程の導入負担が価値を上回る可能性がある。
- Evidence/rationale: 現時点の評価はリポジトリ内の思想・実装・設計・過去の失敗記録に基づき、実案件の比較実験は未実施。
- Artifacts: `docs/design-philosophy.md`, `README.md`, `design-v2/master.md`

### 2026-09-13T00:02:00+09:00 — discovery

利用者が設計書を読まない問題には、AIの言葉遣いが理解しにくく、読んでも判断可能な理解に至れないという原因があるとユーザーが指摘した。

- Evidence/rationale: 単に利用者の関与不足として扱わず、AIDEが理解可能な説明を提供できているかを問う必要がある。
- Evidence/rationale: 専門用語、抽象表現、主体の不明確さにより、「何が起きるか」「自分が何を判断するか」が見えにくくなる。
- Evidence/rationale: 人間が理解して判断できる表現は、AIDEの目的である制作者の理解と責任に直結する。
- Artifacts: `docs/design-philosophy.md`, `harness-v2/node-template.md`

### 2026-09-13T00:03:00+09:00 — decision

改善方針として、各章を利用者が理解と判断を進めやすい共通順序へ再構成する案を採用候補とした。

- Evidence/rationale: 基本順序は「この章で決めること」「なぜ必要なのか」「どのように動くか」「守ること・できないこと」「決定済み・未決」「詳しい仕様と確認方法」。
- Evidence/rationale: 前半だけで意味と影響を理解でき、必要な読者が後半で正確な技術仕様を確認できる構成を狙う。
- Evidence/rationale: 判断に必要な短い理由は仕様の近くに置き、詳細な比較・経緯は `rationale.md` に保持する。
- Evidence/rationale: 構成だけでなく執筆規則も変更し、抽象語で終えず、主体、操作、結果、制約、例外、具体例を明記する必要がある。
- Evidence/rationale: まず既存の一章で試作し、理解、訂正可能性、仕様欠落の有無を比較してからテンプレートとレビュー基準へ反映する。
- Artifacts: `harness-v2/node-template.md`, `harness-v2/rationale-template.md`, `harness-v2/roles/author.md`

### 2026-09-13T20:21:52+09:00 — plan

新しい検討ログだけを独立したコミットにし、既存の未コミット変更は含めず、push後にPRの有無を確認して作成する。

- Evidence/rationale: 現在のブランチは `codex/aide-v2-design-harness-v2` で `origin` の同名ブランチを追跡している。
- Evidence/rationale: `harness/`、`v2/`、別の既存ログに今回作業前から未コミット変更があるため、対象ログのみを明示的にstageする。
- Evidence/rationale: GitHub API確認はサンドボックス内のネットワーク制限により失敗した。ログ完成後、許可された権限付き実行で再試行する。
- Artifacts: `git status --short --branch`, `gh pr status`, `logs/2026-09-13-aide-readability-discussion.md`

### 2026-09-13T20:22:00+09:00 — scope-change

ログの開始時刻は厳密には取得していなかったため、開始メタデータを「2026-09-13（開始時刻の厳密な記録なし、Asia/Tokyo）」へ訂正した。

- Evidence/rationale: 起動プロンプト内の `00:00:00` は仮置きであり、観測済みの開始時刻ではない。
- Artifacts: `logs/2026-09-13-aide-readability-discussion.md`

### 2026-09-13T20:24:00+09:00 — discovery

現行v2テンプレートは正確さを重視する一方、利用者が最初に読む文書としては情報量と読み順に改善余地がある。

- Evidence/rationale: `design.md` は13節あり、「親から受け取った条件」「責任範囲」「seamと依存」などが早い段階から現れる。
- Evidence/rationale: 判断理由が `rationale.md` に分離されているため、利用者が仕様の意味を理解する際に文書間を往復する場合がある。
- Evidence/rationale: 過去のObserve失敗分析では、レビューが内部インターフェース詳細を求め続け、25往復後も不合格になった事例が記録されている。
- Evidence/rationale: 読みやすさの改善では、仕様精度を失わず、人間向け説明を先に提示する必要がある。
- Artifacts: `harness-v2/node-template.md`, `harness-v2/rationale-template.md`, `design/reports/ObserveSystem-observe-failure-analysis.md`

## Decisions

- 各章を、意味と影響を先に理解し、後半で正確な仕様を確認できる共通順序へ再構成する案を採用候補とした。

## Changes

- None recorded

## Validation

- Not run

## Open items

- 既存の一章へ新構成を試験適用し、理解、訂正可能性、仕様欠落の有無を比較する。
- ログ変更をコミットし、pushしてPRを作成する。

## Outcome

Finalization pending.
