# ノード設計書テンプレート

このテンプレートから各ノードの `design.md` を作る。`design.md` は現在の候補または公開済み
仕様を表し、選択理由は同じディレクトリの `rationale.md` に置く。

使わない節は削除せず `該当なし` とする。未決事項を空欄で隠さない。

```yaml
---
id: <tree-unique-stable-id>
kind: root_goal | subgoal | approach | system
title: <短い表示名>
parent: <parent-id-or-null>
depth: 0 | 1 | 2 | 3
status: draft | review-ready | validated | published | blocked | stale | superseded
revision: <integer>
design_revision: <integer>
parent_revision: <parent-design-revision-or-null>
updated_at: <ISO-8601>
children:
  - id: <child-id>
    relation: all_of | one_of | optional
    group: <group-id-or-null>
    selected: true | false
    responsibility: <one-sentence-responsibility>
    expected_outcome: <observable-result>
    acceptance: [<acceptance-id>]
    constraints: [<constraint-id>]
depends_on:
  - id: <node-id>
    design_revision: <design-revision>
owned_seams:
  - id: <seam-id>
    owner: <このnode-id>
    from: <node-id>
    to: <node-id>
    direction: <direction>
    contract: <meaning-and-guarantee>
    failure: <failure-behavior>
    revision: <integer>
seam_refs:
  - id: <seam-id>
    owner: <owner-node-id>
    revision: <integer>
    role: producer | consumer
source_refs:
  - <stable-path-or-url>
---
```

## 1. 目的

このノードが成立させる観測可能な状態を1〜3文で書く。

- `root_goal`: 最上位で実現したい状態
- `subgoal`: 独立して達成を確認できる価値または課題
- `approach`: 小目標を成立させる解決原理
- `system`: 解決法を実現する所有可能なシステム境界

## 2. 親から受け取った条件

`root_goal` は `該当なし` とする。

- **親 revision**: `<parent-id>@<design-revision>`
- **割り当てられた責務**: <この子が所有する成果>
- **詳細化する判断**: <親のどの判断を具体化するか>
- **継承する制約**:
  - `<constraint-id>`: <内容>
- **割り当てられた受入条件**:
  - `<acceptance-id>`: <内容>
- **親に残る統合責任**: <この子だけでは保証しない条件>
- **非責務**: <対象外と、その所有者>

## 3. 対象と望ましい状態

### 対象者・利用者

- <誰が影響を受けるか>

### 現在の問題または機会

<観測できる現状。解決案と区別する。>

### 成立後の状態

<このノードが成立したとき観測できる結果。>

## 4. 責任範囲

| 対象 | このノードが所有すること | 所有しないこと・所有者 |
| --- | --- | --- |
| <対象> | <責務> | <非責務と所有者> |

### 不変条件

- `<constraint-id>`: <下位判断でも守る条件>

## 5. 設計

### 採用する構造・方針

<現在の候補または公開済み設計を、過去案と比較せず現在形で書く。>

### 成立の仕組み

<入力から結果までの流れと、各責任の関係を説明する。>

### 正常時

1. <起点>
2. <主要な処理または状態変化>
3. <観測可能な結果>

### 例外・失敗時

| 条件 | 期待する扱い | 観測可能な結果 |
| --- | --- | --- |
| <条件> | <拒否、回復、再試行、保留など> | <外から見える結果> |

### 境界条件

- <空、重複、遅延、順序逆転、部分失敗など>

## 6. 入出力と状態

抽象ノードでは概念上の受け渡し、`system` では実装可能な外部契約を書く。

### 入力

| 名前 | 提供者 | 必須条件 | 意味 |
| --- | --- | --- | --- |
| <input> | <node/system/user> | <validation> | <semantic> |

### 出力

| 名前 | 利用者 | 保証 | 意味 |
| --- | --- | --- | --- |
| <output> | <node/system/user> | <guarantee> | <semantic> |

### 状態・データ

| 名前 | 所有者 | ライフサイクル | 制約 |
| --- | --- | --- | --- |
| <state> | <owner> | <create/update/delete> | <consistency/privacy/etc.> |

## 7. seam と依存

### このノードが所有する seam 正本

| seam ID | from → to | 方向 | 契約 | 失敗時 | revision |
| --- | --- | --- | --- | --- | --- |
| `<seam-id>` | `<from-id> → <to-id>` | <方向> | <形式、意味、保証> | <扱い> | <revision> |

完全な契約は owner node の `design.md` に1件だけ置く。このノードが owner でなければ
`該当なし` とする。

### このノードが参加する seam 参照

| seam ID | owner | role | revision |
| --- | --- | --- | ---: |
| `<seam-id>` | `<owner-id>` | producer / consumer | <revision> |

参照側へ契約本文を複製しない。owner の正本を closure で解決する。

### dependency

- `<dependency-id>`: <依存する理由、利用する公開契約、必要 revision>

## 8. 品質条件

| 観点 | 要求・上限・方針 | 根拠参照 |
| --- | --- | --- |
| セキュリティ | <内容または該当なしの理由> | <rationale/source> |
| プライバシー | <内容または該当なしの理由> | <rationale/source> |
| 性能・規模 | <内容または該当なしの理由> | <rationale/source> |
| 可用性・回復 | <内容または該当なしの理由> | <rationale/source> |
| 運用・観測性 | <内容または該当なしの理由> | <rationale/source> |
| 互換性・移行 | <内容または該当なしの理由> | <rationale/source> |

## 9. 受入条件

方法ではなく、満たしたかを観測できる結果を書く。本ハーネスではテストへ変換しない。

- `<acceptance-id>`
  - Given: <前提>
  - When: <操作または事象>
  - Then: <観測可能な結果>
  - owner: `<node-id>`

## 10. 子への割り当て

`system` は `該当なし。このノードが設計ツリーの葉。` とする。

### 分解軸

<責務、状態、制約、変更理由など、独立して設計する境界を説明する。>

### 子

| 子ID | kind | relation | group | selected | 責務 | 期待結果 | 条件・制約ID |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<child-id>` | `<next-kind>` | `all_of/one_of/optional` | `<group-or-null>` | `true/false` | <責務> | <観測可能な結果> | `<acceptance-id>` / `<constraint-id>` |

### 完全性

- **子へ割り当てた責務**: <一覧>
- **親に残す統合責任**: <一覧>
- **意図的な対象外**: <一覧と理由>
- **説明されていない重複**: なし / <調整方法>
- **未割当の必須条件**: なし / <解消先>
- **one_of の選択規則**: 該当なし / <group、基準、選択結果>

`one_of` では `group` を必須とする。`all_of` と `optional` は、複数の条件集合を
区別する必要がある場合だけ group を付けてよい。

`review-ready` に進む前に、selected child の2文書を staged stub として materialize し、
この表と frontmatter の children にはその子だけを残す。未選択候補は `rationale.md` に残す。
staged child は親が published になるまで起草を開始しない。

## 11. 未解決事項

`published` では、設計を不確定にする重大事項を残さない。下位または将来フェーズへ委任する
事項は、所有者、選択範囲、守る条件を固定する。

| ID | 事項 | 影響 | 解消方法・委任範囲 | status |
| --- | --- | --- | --- | --- |
| `<open-id>` | <内容> | <影響> | <owner、解除条件または選択制約> | open / constrained / resolved |

## 12. 将来の検証対応

ここではIDと所有元だけを定義し、テスト内容やコードを作らない。

- **unit_test_id**: `UT-<system-id>` / `system` 以外は該当なし
- **subgoal_integration_id**: `SIT-<subgoal-id>` / `subgoal` が所有し、子孫は参照
- **final_integration_id**: `FIT-<root-goal-id>` / `root_goal` が所有し、子孫は参照
- **このノードが供給する条件ID**: <一覧>
- **上位統合で確認する条件ID**: <一覧>

## 13. system 引渡し契約

`system` 以外は `該当なし` とする。

- **system ID / design revision**: `<id>@<design-revision>`
- **目標チェーン**: `<root_goal> → <subgoal> → <approach> → <system>`
- **責務 / 非責務**: <要約>
- **公開する契約**: <入力、出力、状態、エラー>
- **利用する契約**: <dependency と seam>
- **維持する品質条件**: <一覧>
- **受入条件**: <ID一覧>
- **将来検証ID**: <unit / subgoal integration / final integration>
- **未解決事項**: なし / <制約化済みの委任事項>
- **主入力**: この system の設計閉包
