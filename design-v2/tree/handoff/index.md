---
id: handoff
parent: root
depth: 1
children: []
status: draft
seams: []
uses_seams: [s1.closure, s6.halt]
---

# handoff（課題: 実装するとき、設計に無いことが勝手に決まる）

## 親からの振り分け

<!-- 親（root）が split-4 の承認時に転記した。子は書き換えない。
     間違っていると判断したら、自分で直さず boundary_request で root へ返す -->

- 責任: 設計を使って実装する局面で、設計に無いことが勝手に決まらないようにする
- 詳細化の対象: 根の 6（決めないこと・任せること）の裏側。委ねた範囲を超えた決定の扱い
- 継承する制約: 不変条件1〜4と `boundary_requests` の例外。ツール固有機能に依存しない
  （Codex / Claude の双方で回る）。根の「親に残すもの」1〜12。
  実装役（implement）は現時点で対象外であること
- 割り当てられた受け入れ条件: 監査
- uses_seams: `s1.closure`（authoring から: 実装へ渡す設計の閉包）、
  `s6.halt`（change から: 停止の命令。`halt_ack` を返す）
- 提供する seam: `s3.gap`（authoring へ）、`s4.boundary`（change へ）
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
