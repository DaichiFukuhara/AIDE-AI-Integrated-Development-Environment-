---
id: authoring.closure
parent: authoring
depth: 2
children: []
status: draft
seams: []
uses_seams: [a1.decision-form]
---

# authoring.closure（解決法: 閉包の構成と版の同一性）

<!--
深さ2で決めること: 親の決定の詳細化と、それに伴う機能。
親の決定を**詳細化する**のであって、選び直さない。
別案にしたいなら boundary_request で親へ返す。
-->

## 親からの振り分け

<!-- 親（authoring）が split-a1 の承認時に転記した。子は書き換えない。
     間違っていると判断したら、自分で直さず boundary_request で authoring へ返す -->

- 責任: 決定を束ねて外へ渡す単位（閉包）の構成・版の同一性・`s1.closure` / `s2.change-event` の payload 導出を決める
- 詳細化の対象: 著述モデルの5点目（同じ正本から payload を導出）。根が `authoring` へ委譲した
  承認証跡の**ハッシュ計算方法**（対象範囲・正規化・アルゴリズム・テストベクトル）。
  `s2` が5事象（`起票` / `差し替え` / `却下` / `撤回` / `承認`）を区別して出せること
- 継承する制約: 根の不変条件1〜4と `boundary_requests` の例外、根の「親に残すもの」1〜15、
  ツール固有機能に依存しないこと（Codex / Claude の双方で回る）、予算（深さ3・子数5）。
  authoring の「親に残すもの」1〜10。とくに 6（封筒は根が固定済みで動かせない）、
  8（版参照形式は根が固定済み。ハッシュで置換するには boundary_request が要る）、
  9（却下された要求を同じ内容で再送しない）
- 割り当てられた受け入れ条件: 把握 / 再現（記録の側）/ payload 適合 / ハッシュ
- uses_seams: `a1.decision-form`（`node` から: 決定1件と未決1件の表現）
- 提供する seam: `a2.form-gap`（`node` へ: 形式で足りないものの要求）。および親を経由して外へ出る
  `s1.closure` / `s2.change-event` の payload
- 親から降りる入力: なし。外部 seam の受信は `node` が担う
- parent_decision_ref: `authoring@2026-08-31-decision-1`
  （祖先: `root@2026-08-29-decision-2` ＋ `root@2026-08-31-decision-3`
  ＋ `root@2026-08-31-decision-4` ＋ `root@2026-08-31-split-2`）

## 1. これは何を決めるものか

## 2. なぜ要るのか

## 3. 誰が使い、誰が影響を受けるか

## 4. 終わったとどうやって分かるか（受け入れ条件）

- [ ]

## 5. 変えてはいけない前提

<!-- 祖先から降ってきた制約と seam。継承したものは出所を書く -->

## 6. 決めないこと・任せること

<!-- 実装時に決めてよいもの。ここが空だと実装者が止まり続ける -->

## 7. 分からないこと・仮置きしていること

## 分割提案

## boundary_requests

## seam_inbox

## 承認証跡
