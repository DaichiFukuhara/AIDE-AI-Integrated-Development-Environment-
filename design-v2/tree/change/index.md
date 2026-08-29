---
id: change
parent: root
depth: 1
children: []
status: draft
seams: []
uses_seams: [s2.change-event, s4.boundary]
---

# change（課題: 変わったとき、何が無効になり、何が欠けたままかが分からない）

## 親からの振り分け

<!-- 親（root）が split-4 の承認時に転記した。子は書き換えない。
     間違っていると判断したら、自分で直さず boundary_request で root へ返す -->

- 責任: 決定が変わったとき、何が無効になり、書き直しが要るかを分かるようにする
- 詳細化の対象: 根の受け入れ条件「整合」のうち鮮度の側（古い決定が残っていないこと）
- 継承する制約: 不変条件1〜4と `boundary_requests` の例外。ツール固有機能に依存しない
  （Codex / Claude の双方で回る）。根の「親に残すもの」1〜12
- 割り当てられた受け入れ条件: 整合（鮮度の側）
- uses_seams: `s2.change-event`（authoring から: 変更の単位と、変更が起きたという通知。
  対象 ID・旧版・新版）、`s4.boundary`（handoff から: 既存の境界を動かしたいという要求）
- 提供する seam: `s5.invalidation`（authoring へ）、`s6.halt`（handoff へ）
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
