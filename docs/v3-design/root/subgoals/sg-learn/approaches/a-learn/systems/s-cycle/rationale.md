---
id: S-CYCLE
kind: system
title: 実験計画・実行結果・採否を管理する学習機構
parent: A-LEARN
depth: 3
status: published
revision: 6
design_revision: 2
parent_revision: 3
updated_at: '2026-09-22T00:50:22+09:00'
children: []
depends_on: []
owned_seams: []
seam_refs: []
source_refs:
- sources/requirements.md
unit_test_id: UT-S-CYCLE
subgoal_integration_id: SIT-SG-LEARN
final_integration_id: FIT-G-V3
document: rationale
base_revision: 5
validation:
  structural:
    result: pass
    closure_id: CL-S-CYCLE-d2-t16-128b1fcffa2c
    checked_design_revision: 2
    checked_parent_design_revision: 3
    criteria:
    - A-01
    - A-02
    - A-03
    - B-01
    - B-02
    - B-03
    - C-01
    - C-02
    - C-03
    - C-04
    - D-01
    - D-02
    - D-03
    - D-04
    - E-01
    - E-02
    - E-03
    - F-01
    - F-02
    - F-03
    - G
    finding_ids: []
  semantic:
    result: pass
    closure_id: CL-S-CYCLE-d2-t16-128b1fcffa2c
    checked_design_revision: 2
    checked_parent_design_revision: 3
    criteria:
    - A-01
    - A-02
    - A-03
    - B-01
    - B-02
    - B-03
    - C-01
    - C-02
    - C-03
    - C-04
    - D-01
    - D-02
    - D-03
    - D-04
    - E-01
    - E-02
    - E-03
    - F-01
    - F-02
    - F-03
    - G
    finding_ids: []
next_action:
  role: orchestrate
  target: S-CYCLE
  done_when: 配下と引渡しの完了判定
---

# 実験計画・実行結果・採否を管理する学習機構 — 根拠

## 1. 入力根拠

入力はsources/requirements.md。ユーザー要求U1〜U8、既存v2の契約、可読性・運用ログを区別して参照する。古い複製版の問題を現行v2で実証済みの欠陥とみなさない。

## 2. 現在の判断

| decision ID | 設計の対象 | 理由 | 条件 |
| --- | --- | --- | --- |
| D-S-CYCLE | design.md §4〜7 | srcだけでは今回の実験範囲と意図が読み取れず、設計だけでは結果の妥当性が分からない。両者をexperimentで接続する。 | SC1, SC2, SC3, SC4, SC5 |

## 3. 代替案

実験ごとに別の完成設計ツリーを作る案は記録負担が大きい。既存specを参照する一つの実験記録にする。

選択済み: planを固定して実装担当へ渡し、結果を版付きで記録する。結果と受入条件を比較して採用案または終了理由を返す。

再検討条件: 初回試行で文書更新負担が減らない、境界を跨ぐ修正が常態化する、意図や未確認事項を説明できない場合。

## 4. 仮定

入力のA1〜A5を継承する。初期はMarkdownと逐次反映で成立するという仮定で、外れたら並行実行・索引方式・監査周期を所有者の判断として改訂する。効率改善は推論であり計測結果ではない。

## 5. 分解候補

該当なし。systemは葉。

## 6. リスクと未解決事項

| ID | 内容 | owner | 扱い |
| --- | --- | --- | --- |
| R-S-CYCLE | 効率と理解の改善は未検証。規約を増やして逆に重くなる可能性。 | S-CYCLE | constrained: 後続試行で中断回数、最初の実物までの時間、手戻りと理解を評価する。 |
| O-S-CYCLE | 実行ツール、初期試行の具体的製品、環境ごとの予算。 | 将来の実装・試行担当 | constrained: §11の委任範囲。設計の公開契約を暗黙に変更しない。 |

## 7. finding

現在の版の構造・意味検査で記録する。結果はこの節とfrontmatterのworkflow情報に置き、意味snapshotへ含めない。

## 8. 検査結果

構造検査と意味検査は `CL-S-CYCLE-d2-t16-128b1fcffa2c` に対してpass。詳細: `checks/CL-S-CYCLE-d2-t16-128b1fcffa2c-structural.md` と `checks/CL-S-CYCLE-d2-t16-128b1fcffa2c-semantic.md`（設計ツリールート基準）。独立監査ではなく主担当の自己レビュー。

## 9. 変更影響

条件・責任・契約の変更はv2のchange eventにし、祖先統合、契約両端、条件継承先へ波及させる。意味のない表記変更で新しい意味版を発行しない。

今回の意味版は新規設計。v2の既存ノードや実行規約を書き換えない。

## 10. 現在の作業状態

frontmatterのstatus、revision、validation、next_actionを参照する。公開前はpending、公開後は設計完了として扱う。

## 11. 将来検証の根拠

| 対応 | 理由 |
| --- | --- |
| UT | 葉の単独責任を確認する予約ID。system以外はなし。 |
| SIT | 小目標の条件が配下systemで成立することを確認する予約ID。 |
| FIT | G1〜G6と契約の接続を全体として確認する予約ID。 |

## 12. system closure の根拠

祖先の目的・公開契約と対象systemの2文書だけで境界、状態、失敗、委任、受入条件が分かる。兄弟の内部設計を補わず引き渡せる。
