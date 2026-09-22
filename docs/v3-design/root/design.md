---
id: G-V3
kind: root_goal
title: 試して学び、意図と現在の状態を説明できる開発
parent: null
depth: 0
status: published
revision: 6
design_revision: 3
parent_revision: null
updated_at: '2026-09-22T00:46:43+09:00'
children:
- id: SG-MODEL
  relation: all_of
  group: null
  selected: true
  responsibility: G1・G2の所有。記録の現在性とG6の競合回復を担当する。実験の実行と監査の判定は担当しない。
  expected_outcome: 利用者と実装担当が、同じ保存情報から目的、現在の動作、制約、未確認事項を説明できる。
  acceptance:
  - G1
  - G2
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- id: SG-LEARN
  relation: all_of
  group: null
  selected: true
  responsibility: G3の所有。G6の失敗・取消・結果の古さへの対応を担う。設計正本への書込み判定は記録側へ依頼する。
  expected_outcome: 利用者が全体設計の完成を待たず動く結果を試し、方法の採用・変更・終了を判断できる。
  acceptance:
  - G3
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
- id: SG-ASSURE
  relation: all_of
  group: null
  selected: true
  responsibility: G4・G5の所有。G6の重大欠陥・監査失効への対処を担う。仕様の起草と実験の実行を所有しない。
  expected_outcome: 利用者が小変更で毎回止まらず、変更の意味と監査の保証範囲を説明できる。
  acceptance:
  - G4
  - G5
  constraints:
  - C-TRACE
  - C-ONE
  - C-SCOPE
  - C-EVIDENCE
  - C-SMALL
  - C-READ
  - C-REVIEW
  - C-PHASE
depends_on: []
owned_seams:
- id: S-CONTEXT
  owner: G-V3
  from: SG-MODEL
  to: SG-LEARN
  direction: 設計→実験
  revision: 1
  contract: 要求operation_idと対象goal/systemから、bundle_id、意味版集合、条件、契約、委任、現在のaudit_baselineと未監査差分、進行判定、反映の成否を返す。取得は読取り専用。採用結果は対応operation_idで照合する。
  failure: 対象欠落・旧版・競合では理由と再読先を返す。進行許可のない候補を実験に使わない。同じ要求の再送は重複反映しない。
- id: S-PROPOSAL
  owner: G-V3
  from: SG-LEARN
  to: SG-MODEL
  direction: 実験→設計
  revision: 1
  contract: operation_id、kind(plan/adoption/withdrawal)、experiment_id/plan_revision、base_bundle、対象ID、変更差分と意味hash、条件・契約の影響、委任参照、証拠参照を渡す。planは試作の候補、adoptionは現在仕様への採用候補。
  failure: 重複は同一内容なら既存結果を返す。異内容ID再利用は拒否。旧版・予算外・取消済みは反映せず理由を返す。証拠は失わない。
- id: S-AUDIT-INPUT
  owner: G-V3
  from: SG-MODEL
  to: SG-ASSURE
  direction: 設計→監査
  revision: 1
  contract: operation_id、kind(plan/adoption/periodic)、対象scope、候補意味hash、現在bundle、監査基準版、累積差分、委任、関連検証と実使用結果、観測時刻を渡す。初回はbaseline=null。
  failure: 不足項目は理由と解消条件を返す。候補撤回はcancel通知として同じ操作を終了する。対象hash変更は新要求とし古い判定を流用しない。
- id: S-AUDIT-RESULT
  owner: G-V3
  from: SG-ASSURE
  to: SG-MODEL
  direction: 監査→設計
  revision: 1
  contract: operation_id、target_hash、result(daily-pass/require-review/audit-pass/blocked/stale/cancelled)、適用基準と証拠、finding、影響scope、次の処理、監査基準版、期限を返す。audit-passだけが対象範囲の監査基準を進める。
  failure: hashが現候補と不一致ならstaleとして再判定。同じ結果の再送で基準を重複更新しない。重大指摘が残れば反映せず、影響外を止めない。
seam_refs: []
source_refs:
- sources/requirements.md
unit_test_id: null
subgoal_integration_id: null
final_integration_id: FIT-G-V3
---

# 試して学び、意図と現在の状態を説明できる開発

利用者が必要な最小実装を早く試し、結果から設計を更新し、何を作り何を未確認としているかを理解できる。

**なぜ必要か:** 小規模実装の学び、現在仕様の理解、更新の信頼は別々に確認できる成果で、三つが揃って目的を満たす。

**今回の判断:** 目標の4階層を骨格として保持する。ドメインは責任と言葉の境界として重ねる。実験・反映・定期監査を同じ保存情報から再開する。

## 1. 目的

利用者が必要な最小実装を早く試し、結果から設計を更新し、何を作り何を未確認としているかを理解できる。

## 2. 親から受け取った条件

根のため該当なし。入力の正本は sources/requirements.md。

## 3. 対象と望ましい状態

対象はAIと共同開発する利用者と実装・監査担当。手続きのための停止、理解できない説明、記録の食い違いを減らす。

利用者が必要な最小実装を早く試し、結果から設計を更新し、何を作り何を未確認としているかを理解できる。

## 4. 責任範囲

v3の設計・実験・反映・監査の契約を決める。今回の成果は実装可能な設計まで。

| 制約ID | 守る条件 |
| --- | --- |
| C-TRACE | 目標→小目標→アプローチ→システムの意味を残し、目的と担当を参照で追える。 |
| C-ONE | 仕様・契約の正本と書込み担当を一つにする。候補、現行、過去版、監査済みを混同しない。 |
| C-SCOPE | 既存の許可と委任を引き継ぐ。目的・予算・外部影響の範囲は暗黙に拡張しない。 |
| C-EVIDENCE | 設計上の判断、実装された事実、テスト結果、人の評価、監査結果を区別する。 |
| C-SMALL | 今回の実験に必要な枝だけを具体化する。全枝の完成を実験開始の条件にしない。 |
| C-READ | 意味と操作結果を先に説明する。用語には具体的意味を与え、短い理由を仕様に添える。 |
| C-REVIEW | 監査指摘は基準・具体的な支障・終了条件を持つ。minorと委任済み内部選択だけで停止しない。 |
| C-PHASE | 本ツリーはv2によるv3の設計成果。v3実行、製品実装、テスト成功を装わない。 |

## 5. 設計

目標の4階層を骨格として保持する。ドメインは責任と言葉の境界として重ねる。実験・反映・定期監査を同じ保存情報から再開する。

### v2を使う今回と、将来のv3を分ける
今回の設計ツリーの配置・状態遷移・公開判定はv2に従う。v3の周期監査を今回のv2検査の省略理由にしない。v3の実行規約は本設計を元に後続工程で作る。

### v3の正本と実行単位
設計の所有単位はsystem、モデルの意味が通じる単位はbounded context、試す単位はexperimentとする。一つのexperimentは複数systemを横断できる。これらを一対一に固定しない。
masterはroot_goalの正本で、全体方針、成功条件、目標・domain・contextの参照を持つ。詳細の全文を複製しない。現在の意味が変わった箇所だけを更新する。

### AIDE自身のドメインとモデル境界
今回の業務領域は「AIと共同で設計を育てること」。その中に、現在仕様と根拠を扱う記録context、仮説と観測を扱う学習context、保証範囲と指摘を扱う監査contextを置く。分割理由はそれぞれが所有する状態と判断の違いであり、実行ロールの数ではない。
記録contextの「採用」は現在仕様への反映、学習contextの「成功」は固定した評価条件の成立、監査contextの「合格」は対象版の適用基準を満たすことを意味する。成功や合格を採用・実行許可と同義にしない。
記録はSG-MODEL/S-RECORD、学習はSG-LEARN/S-CYCLE、監査はSG-ASSURE/S-AUDITが担う。境界を通るデータは根が所有する4本のseamで解釈を揃える。記録が現在仕様の提供者、学習が証拠と提案の提供者、監査が判定の提供者になる。配置や実行プロセスを3サービスに分割することは要求しない。

### 公開と許可
v2のpublishedは本設計を正本にしたという意味。v3における現在仕様への採用、監査合格、実験実行の委任、製品の外部公開は別の判断。許可はユーザーの既存指示と範囲を参照し、AIが自己拡張しない。

### 共通識別
v3の操作はoperation_id、対象ID、base_revision、意味のハッシュを持つ。同じoperation_id・同じ内容の再送は同じ結果を返す。内容を変えて同じIDを再利用したら拒否する。送信順や時刻だけで新旧を判断しない。
意味変更ではsemantic_revisionを、状態・結果追記だけでは通常revisionを進める。監査の対象は意味のハッシュで固定し、結果追記によって自己失効させない。
書込み担当は対象の通常revisionを直前照合し、競合時は候補を保存したまま再評価する。部分反映をcurrentと表示しない。

### 統合責任
G6は根が統合所有する。記録、実験、監査の各小目標へ回復条件を配り、SITの成立だけでG6達成を推測しない。FIT-G-V3で全体接続を将来確認する。

### 正常・失敗・取消の扱い

正常時は割当条件に沿って下位を具体化する。参照・版の矛盾は影響範囲へ返す。仮説の不成立は実験結果として残し、仕様の成功へ置換しない。取消した候補は現在仕様へ反映せず、既存の有効版を維持する。

## 6. 入出力と状態

| 区分 | 契約 |
| --- | --- |
| 入力 | 親条件、sources/requirements.md、祖先が所有する公開seam契約。 |
| 出力 | 子への条件割当と、上位条件への対応を持つ設計。 |
| 状態 | v3の設計候補・現在版・証拠・監査基準を区別する。今回のnode状態はv2が管理する。 |

## 7. seam と依存

完全なseam契約はfrontmatterのowned_seamsが正本。本文には複製しない。4本で要求・応答・失敗・取消を扱う。

## 8. 品質条件

保存した仕様と根拠から再開でき、版の食い違いと未確認事項を説明できる。

| 観点 | 要求または適用範囲 |
| --- | --- |
| 情報保護 | 外部送信は既存の許可範囲に従う。秘密の値を根拠文書へ転記しない。 |
| 性能・規模 | 初期は小規模なMarkdown運用。応答時間の保証値は今回設定せず、対象実験の予算を守る。 |
| 回復 | 候補の失敗で既存の有効版を消さず、操作IDと対象版から再開する。 |
| 互換性 | v2の正本を変更せず、必要な枝からv3へ移す。旧成果物をv3監査済みと自動認定しない。 |

## 9. 受入条件

| 条件ID | 観測できる成立状態 | owner |
| --- | --- | --- |
| G1 | 目標からシステムまでをたどれ、各仕様・契約の正本と現在版が一意に分かる。 | G-V3 |
| G2 | 利用者が冒頭の説明から何が起きるか、なぜ必要か、今回判断することを説明し訂正できる。 | G-V3 |
| G3 | 一つの実験に必要な枝で着手でき、実装・関連検証・実使用・採否・設計反映を通して次を選べる。 | G-V3 |
| G4 | 監査済み範囲の小変更は関連テストで進め、期限または境界変化に応じて差分監査へ進む。 | G-V3 |
| G5 | DDD由来の基準とAIDE運用上の基準を区別し、指摘を閉じる条件が一意に分かる。 | G-V3 |
| G6 | 再開時、古い根拠・競合・取消・監査不合格を識別し、影響外の作業まで一律停止しない。 | G-V3 |

## 10. 子への割り当て

| 子ID | 担当条件 | relation | 選択理由 |
| --- | --- | --- | --- |
| SG-MODEL | G1, G2 | all_of / selected | G1・G2の所有。記録の現在性とG6の競合回復を担当する。実験の実行と監査の判定は担当しない。 |
| SG-LEARN | G3 | all_of / selected | G3の所有。G6の失敗・取消・結果の古さへの対応を担う。設計正本への書込み判定は記録側へ依頼する。 |
| SG-ASSURE | G4, G5 | all_of / selected | G4・G5の所有。G6の重大欠陥・監査失効への対処を担う。仕様の起草と実験の実行を所有しない。 |

親に残す統合責任: G6。記録・実験・監査の要求応答と失敗回復の全体整合。

未割当の必須条件: なし。未説明の重複: なし。one_of/optional: 今回の採用枝には該当なし。有力な別方式はrationaleに残す。

## 11. 未解決事項

下位systemに具体化を委任する。ここで定めた目的・条件・公開契約は下位が暗黙に選び直さない。

効率改善と人間の理解は実運用で未検証。検証担当は後続のv3試行担当であり、設計合格を効果実証として扱わない。

## 12. 将来の検証対応

| ID種別 | 対応 |
| --- | --- |
| unit_test_id | 該当なし |
| subgoal_integration_id | 該当なし |
| final_integration_id | FIT-G-V3 |

条件ID: G1, G2, G3, G4, G5, G6。ここでは対応IDと受入条件だけを定義し、テストケース・コードは生成しない。

## 13. system 引渡し契約

該当なし。配下systemの閉包へこの設計を含める。
