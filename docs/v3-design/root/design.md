---
id: G-V3
kind: root_goal
title: 試して学び、意図と現在の状態を説明できる開発
parent: null
depth: 0
status: published
revision: 18
design_revision: 5
parent_revision: null
updated_at: '2026-09-22T22:33:47+09:00'
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
  revision: 3
  contract: 要求operation_idと対象goal/systemに対しbundle_id、spec意味版と契約版集合、委任、subjectとscope/phase別audit_baseline、未監査差分、進行判定を返す。proposal/withdrawal/cycle_closedの結果は要求IDで照合し、対象ID・現在の確定状態・反映bundleまたはperiodic要求ID/skip理由を返す。取得は読取り専用。
    subjectとbundleは§5のmodel_definition_refsによりdomain/contextの意味と依拠先を不変版で含む。定義変更の影響scope・新要求・旧結果・一括反映も同節に従う。
  failure: 対象欠落・競合・取消待ちでは理由と再読先を返す。旧checkedを取消後の進行許可へ流用しない。
- id: S-PROPOSAL
  owner: G-V3
  from: SG-LEARN
  to: SG-MODEL
  direction: 実験→設計
  revision: 3
  contract: operation_id、kind(plan/adoption/withdrawal/cycle_closed)、experiment_id/plan_revision、cycle_id、scopeを渡す。plan/adoptionはbase_bundle、対象ID、仕様差分、subject/subject_hash、条件・契約影響、委任参照を持つ。withdrawalはtarget_operation_id、expected_subject_hash、scopeを持つ。cycle_closedはoutcome、全関連操作IDと確定結果、反映bundle、closed_atを持つ。詳細な版集合・終了・取消の意味は本design
    §5の共通契約を適用する。 subjectとbundleは§5のmodel_definition_refsによりdomain/contextの意味と依拠先を不変版で含む。定義変更の影響scope・新要求・旧結果・一括反映も同節に従う。
  failure: 同内容ID再送は保存済み状態を返し、異内容ID再利用は拒否する。旧版・予算外・取消済みは反映しない。未着取消はpending-target、反映後取消はalready-applied。終了通知は周期要求保存または差分なし記録後にack。
- id: S-AUDIT-INPUT
  owner: G-V3
  from: SG-MODEL
  to: SG-ASSURE
  direction: 設計→監査
  revision: 3
  contract: 新しいaudit_request_idをoperation_idとし、origin_operation_id、kind(plan/adoption/periodic/cancel)、scope、subject/subject_hash、criteria_version、基準版、累積差分、委任、観測時刻を渡す。periodicはtrigger(cycle_closed/activity_due)、対応する通知IDまたは期限を持つ。cancelは新operation_id、target_operation_id（監査要求ID）、expected_subject_hash、scopeを持つ。初回baselineはnull。§5の共通契約を適用する。
    subjectとbundleは§5のmodel_definition_refsによりdomain/contextの意味と依拠先を不変版で含む。定義変更の影響scope・新要求・旧結果・一括反映も同節に従う。
  failure: 版集合の欠落・可変refはblocked。対象変更は新要求。同ID異内容は拒否。取消未着はpending-target、完了後はalready-completed、未完了はcancelled。通知と要求の再送は同じ対応を保つ。
- id: S-AUDIT-RESULT
  owner: G-V3
  from: SG-ASSURE
  to: SG-MODEL
  direction: 監査→設計
  revision: 3
  contract: operation_id（応答先監査要求ID）、origin_operation_id、subject_hash（target_hashと同義）、scope、phase、criteria_version、result(daily-pass/require-review/audit-pass/blocked/stale/cancelled/pending-target/already-completed/rejected)、証拠、finding、次の処理、基準版、期限を返す。cancel応答はtarget_operation_idも返す。audit-passの受理条件と基準更新範囲は§5に従う。
    subjectとbundleは§5のmodel_definition_refsによりdomain/contextの意味と依拠先を不変版で含む。定義変更の影響scope・新要求・旧結果・一括反映も同節に従う。
  failure: 記録側は監査要求・対象subject・scope・phase・基準を照合し、不一致や取消済みはstale。再送で基準を重複更新しない。重大指摘は影響範囲を保留し、現在版の自動巻戻しや影響外停止をしない。
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
意味変更ではsemantic_revisionを、状態・結果追記だけでは通常revisionを進める。監査の対象は以下のsubjectで固定し、結果追記によって自己失効させない。
書込み担当は対象の通常revisionを直前照合し、競合時は候補を保存したまま再評価する。部分反映をcurrentと表示しない。

### 統合責任
G6は根が統合所有する。記録、実験、監査の各小目標へ回復条件を配り、SITの成立だけでG6達成を推測しない。FIT-G-V3で全体接続を将来確認する。

### 正常・失敗・取消の扱い

正常時は割当条件に沿って下位を具体化する。参照・版の矛盾は影響範囲へ返す。仮説の不成立は実験結果として残し、仕様の成功へ置換しない。取消した候補は現在仕様へ反映せず、既存の有効版を維持する。

### 監査対象を固定する共通契約（AV3-001）
監査対象subjectはscope、phase、spec意味版と契約版の集合、model_definition_refs、plan_revisionと評価条件版、implementation_ref、trial_refs、evidence_refsを一組として固定する。各refは不変コミット・内容hash・不変snapshot等で内容を一意に復元できる参照とする。編集可能なファイル名やlatestだけの参照は拒否する。subject_hashはこの版集合全体の識別値であり、仕様だけの意味hashとは別物である。以下で監査対象のtarget_hashと呼ぶ値は常にsubject_hashを指す。
planでは未実装のimplementation_refをnull、未取得の試行・証拠を空として未検証範囲を明記できる。adoptionでは採用実装版とその検証・実使用の結果または理由付き未検証の扱いを固定する。periodicは現行の採用済み版集合を固定する。監査結果自体と状態追記はsubjectに入れず、結果追記による自己失効を防ぐ。
結果はaudit_request_id、subject_hash、scope、phase、criteria_versionに結び付く。完全一致する対象にだけ適用できる。domain/contextの意味定義・実装・証拠・評価条件・対象範囲のいずれかが変われば新しいsubjectと新しい要求IDで分類する。古い結果は履歴と比較根拠として残すが、新対象を合格扱いにしない。仕様の意味不変な実装修正も、関連確認を経てdaily-passで採用し得るが、未監査差分に実装・証拠の版変更を加える。
audit_baselineはscope/phaseごとの監査済みsubjectを指す。daily-passは基準を進めない。audit-passも記録側が一致を確認し受理した範囲だけを進める。plan合格はplanの基準にだけ有効で、実装保証へ昇格させない。adoption結果はcurrentの一括反映と同時に受理し、periodic結果は現在の対象版集合が一致する場合だけ受理する。対象外の差分や監査中に生じた新差分は残す。

### サイクル終了と周期確認の共通契約（AV3-002）
cycle_idは一回の実験サイクルを識別する。S-CYCLEがreflected、rejected、cancelled、または終了を決めたinconclusiveを終端として記録する。pausedと修正継続中のinconclusiveは終端ではない。終端を再開して書き換えず、追加実験には新しいcycle_idと元サイクルへの参照を付ける。
学習側は全plan/adoption要求の確定結果を確認してから、終端状態とcycle_closed通知の未送信記録を同じ論理更新で保存する。通知は独自operation_id、cycle_id、experiment_id/plan_revision、outcome、対象scope、関連する全操作IDと確定結果、反映済みbundle（無ければnull）、closed_atを持つ。取消なら対象取消の確定を先に待ち、取消前に反映済みならその反映結果を通知にも残す。再開時は未確認通知を同じIDで再送する。
S-RECORDが通知の受信・周期確認の起動を所有する。関連操作の確定と反映結果を自分の記録で照合し、未確定ならpendingとして保持し確定後に再開する。採用時はcurrent反映後、不採用・取消時も受信時の現行scopeにある未監査差分を確認する。終了通知の受領と、periodic要求の永続化または差分なしのskip理由を同じ論理更新で保存してからackを返す。再送では新たな要求を増やさない。既存の同じsubject/scopeの要求があれば対応付ける。
周期要求は保存直後に監査へ渡し、中断時は次の再開で未送信要求を処理する。単に次回の任意作業まで保留しない。もう一つの起点は、最初の未監査変更から7暦日後の次の作業開始であり、S-RECORDが開始時に観測時刻を確認して同じ経路を起動する。実験終了と期限の早い方を採用する。監査中の新差分に対しても期限と終了通知を保持し、旧対象の結果だけで解消済みとしない。自動常駐処理は要求しない。
periodicがblockedならcurrentを自動巻戻しせず影響scopeを修正待ちとして表示し、そのscopeの新しい採用・試作進行を保留する。原因解消の候補作成・限定した修正検証は既存の委任内で可能とし、無関係な枝は継続する。合格済み対象と保留範囲を区別して再開する。

### 取消と反映の順序の共通契約（AV3-003）
withdrawalのoperation_idは取消要求自身の新しいIDとし、target_operation_idで一つのplanまたはadoption要求を指定する。expected_subject_hashとscopeを付け、対象との一致と委任を照合する。同じexperimentの他操作を暗黙に取り消さない。同じID・同じ内容の再送は重複処理せず保存済みの現在の確定結果を返す。異内容でのID再利用は拒否する。
S-RECORDは対象が未着の場合pending-targetとして取消要求を保存し、指定ID・期待hash・scopeの仮tombstoneを置く。一致する対象が後着したら取消を確定し、違えば取消をrejectedにして仮tombstoneを外す。仮状態では対象の反映を行わない。取消要求の権限・範囲が検証できなければblockedとし反映を許可しない。対象が届かない間は取消完了と表示しない。
記録側はcurrent切替と取消確定を同じ操作台帳で直列化する。取消が先ならcancelledのtombstoneを確定し、旧要求の再送はcancelled、遅延監査結果はstaleとして反映も基準更新もしない。adoptionのcurrent切替が先ならalready-appliedとbundleを返し、巻戻しは新しいadoptionにする。planのchecked後も将来の着手をcancelledにできるが、既に行われた実行を消したり未実行と記録したりしない。S-CYCLEは次の作業境界で停止し結果を保存する。
対象proposalとaudit_request_idの対応はS-RECORDが保存する。監査へ渡すcancelも新しいoperation_idを持ち、target_operation_idには対応する一つのaudit_request_idを指定し、同じexpected_subject_hash/scopeを渡す。S-AUDITは未着なら仮tombstone、到着後なら取消記録を保持する。先に判定完了していればalready-completedと元結果を返して履歴を残すが、記録側の取消は撤回されない。監査cancel通知の到着を待たず記録側のtombstoneで遅延結果を拒否する。取消通知も永続化して再送し、二重通知で状態を戻さない。

### domain/context正本の固定と変更（AV3-005）
subjectのmodel_definition_refsは、対象spec・契約・評価条件が意味の解釈に用いるdomain/context定義を固定する必須集合である。各要素はdomain_id、context_id（domain全体の定義ならnull）、canonical_owner、semantic_revision、immutable_ref、依拠する他定義への版付き参照を持つ。用語の意味、責任、ルールと不変条件、context間の意味の変換を含む。単なる所属IDや編集可能な文書パスだけでは不足で、内容を不変に復元できることを要求する。domain/context文書を第5階層へ追加するものではない。
S-RECORDが対象specから依拠する定義とその参照先を再帰的に集め、重複は同一ID・同一版へ統一する。循環参照は既訪問を再展開せず、未解決参照・同一IDの矛盾する版・正本owner不明はblockedにする。依拠する定義がない場合だけ、空集合と非該当の理由を保存する。監査者と採用担当はこの集合から用語・責任を読み、subject外のlatestで補わない。scope外に所在する共有定義でも、解釈に使うものは読み取り入力として含める。
domain/contextの意味変更も変更提案として扱い、正本を直接書き換えない。S-RECORDが版付き参照と利用索引から、変更定義を直接・間接に利用するspec、契約、計画、候補、current bundleと監査基準の影響scopeを閉包計算する。利用先の判断に必要な参照が欠ければ対象を特定できるまでその変更をblockedにし、影響外と推測しない。
用語・責任・ルールが変わると、system本文が同じでもmodel_definition_refsを更新した新subject・新要求を作り、影響境界の即時限定監査へ渡す。旧判定は旧定義版の保証履歴として保持するが、新版の許可には使わない。未監査差分に定義の旧新版と影響scopeを含め、daily-passや表記変更として基準を進めない。意味不変の表記だけなら根拠付きで通常revisionを更新でき、不変の意味入力は変えない。
影響scopeにあるcurrent bundleは旧定義版を参照したまま有効な過去の組として保持し、変更候補と混同しない。変更を採用する際は定義の正本版参照と全影響利用先のbundle参照を同じ論理更新で切り替える。一部だけが新版を読む状態をcurrentにせず、必要な限定監査・委任・版一致が揃うまで候補として保つ。新しい定義版を採用済みなら、旧定義へ依存する進行中候補・監査結果はstaleとして再構成する。意図的に異なる意味を共存させる場合は別のcontextまたは定義IDと変換契約を明示した別提案が必要で、単なる旧結果流用にはしない。
S-CYCLEは計画・試行が依拠したmodel_definition_refsを不変の計画／証拠へ保存し、提案のsubjectと一致させる。計画中に定義が変われば計画版を改め、旧定義で得た結果はその限界付きの履歴とし、新定義の成功と読み替えない。S-AUDITは完全な参照集合・影響scope・旧新版の差分を照合し、DDD-01〜04とAIDE-03の根拠に使う。保存形式と索引生成方式は実装へ委任するが、意味入力の包含と波及は省略できない。

## 6. 入出力と状態

| 区分 | 契約 |
| --- | --- |
| 入力 | 親条件、sources/requirements.md、祖先が所有する公開seam契約。 |
| 出力 | 子への条件割当と、上位条件への対応を持つ設計。 |
| 状態 | v3の設計候補・現在版・証拠・監査基準を区別する。今回のnode状態はv2が管理する。 |

## 7. seam と依存

seamの項目と方向の正本はfrontmatterのowned_seams、共通の意味・順序の正本は§5。両者で一つの契約を構成する。4本で要求・応答・失敗・取消を扱う。

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
