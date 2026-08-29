---
id: authoring
parent: root
depth: 1
children: []
status: draft
seams: []
uses_seams: [s3.gap, s5.invalidation]
---

# authoring（課題: 設計を決める局面で、決定が管理できない）

## 親からの振り分け

<!-- 親（root）が split-4 の承認時に転記した。子は書き換えない。
     間違っていると判断したら、自分で直さず boundary_request で root へ返す -->

- 責任: 設計を決める局面で、決めたことが残り、通して読め、持ち主が決まる状態にする。
  決めるべきで決まっていないものが見えるようにする
- 詳細化の対象: 根の 2（説明できない・責任を持てない）と、不変条件1（状態はツリーが持つ）。
  根の 7 が `authoring` へ委ねた「承認証跡のハッシュ計算方法」
- 継承する制約: 不変条件1〜4と `boundary_requests` の例外。ツール固有機能に依存しない
  （Codex / Claude の双方で回る）。根の「親に残すもの」1〜12
- 割り当てられた受け入れ条件: 把握 / 所在 / 再現（記録の側）/ 整合（欠落の側）
- uses_seams: `s3.gap`（handoff から: 決まっていないことの要求と、実装時に決めた事実の記録要求）、
  `s5.invalidation`（change から: 失効の通知と、書くべきだが無いものの要求）
- 提供する seam: `s1.closure`（handoff へ）、`s2.change-event`（change へ）
- parent_decision_ref: `root@2026-08-29-decision-2`

## 1. これは何を決めるものか

<!-- 深さ1: 課題の範囲と、それに対する解決法 -->

## 2. なぜ要るのか

## 3. 誰が使い、誰が影響を受けるか

## 4. 終わったとどうやって分かるか（受け入れ条件）

- [ ]

## 5. 変えてはいけない前提

## 6. 決めないこと・任せること

## 7. 分からないこと・仮置きしていること

## 分割提案

## boundary_requests

## seam_inbox

## 承認証跡
