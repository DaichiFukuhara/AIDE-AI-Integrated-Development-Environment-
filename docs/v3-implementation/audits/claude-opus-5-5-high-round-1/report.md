# AIDE v3 実装 独立静的監査（Claude Opus 5.5 / High, round 1）

## 1. 判定

**fail：blocker 0、major 3、minor 6。** 過去のAIV3-001〜003はすべてclosedと判断しました。

Markdownハーネスという実装形態はA2に適合しています。CLI、UI、自動採用エンジンがないことは欠陥として扱っていません。open majorは3件あり、いずれも同じ領域の手順不足です。

- 未監査差分の単位
- 修正後の再監査範囲
- 監査費用の予算

この3件が、ユーザーの重点項目である「累積差分を漏らさない」「監査が無限に増えない」「予算停止」に直接かかわります。

## 2. 指摘

### CIV3-001 — major：未監査差分と基準のscope/phase単位、および消去規則が不定

**基準**
- AIDE-03、DDD-03、G4、SA1
- 設計 `docs/v3-design/root/design.md:184,190`

**該当箇所**
- `harness-v3/protocols/records.md:26-28,56-59`
- `templates/state.md:28-29`
- `protocols/subject.md:10,36`
- `protocols/messages.md:48-53`
- `roles/audit.md:9,11`

**反例A：plan phaseの差分が消えず、周期監査が再起動し続ける**
1. 意味不変の仕様表記修正を含むplanがdaily-passになる。
2. `subject.md:36`により未監査差分として残り、`state.md:29`でphase=planとして記録される。
3. 一方、periodicはimplementation phaseだけである（`records.md:27`）。periodicのaudit-passは「保証した差分だけを消す」ため（`records.md:58`）、plan phaseの項目は消えない。
4. 最初の変更から7日を過ぎると、作業開始のたびにactivity_dueが発火し（`messages.md:53`）、cycle_closedでもskipできない。
5. 結果として、現在の版が変わらないまま周期監査が繰り返し起動する。

**反例B：重なるscope集合で、差分の消去が二通りに読める**
1. 基準K1がscope `[X,Y]` で合格している。
2. E2（scope `[X,Y]`）がdaily-passでXとYを変更し、差分u1が記録される。
3. E3（scope `[X]`）が終了し、periodic `[X]` がaudit-passになる。
4. このときu1を消すかどうかの規則がない。
   - 消す場合：Yの変更が累積差分から漏れる。
   - 消さない場合：`[X,Y]` の次回監査で、監査済みのXを再監査する。
5. 同様に、E3の分類時に「`[X]` に基準があるか」も、完全一致と包含のどちらで判定するか読めない。

**影響**
周期監査が、差分を漏らすか、無限に再起動するかのどちらかになり得ます。重要な契約を複数に解釈できる状態です。

**最小の解消条件**
1. scopeの同一性と基準の検索規則を定める。例：system/context単位で保持し、集合subjectを参照する。
2. 差分項目の消去は、受理したsubjectが項目の全要素とphaseを覆う場合に限る。
3. plan phaseのdaily-passを未監査差分に入れるかどうかを明記する。current（採用済みの版）を変えないplanは除外する、あるいは終端で消去する、などの方針を決める。
4. 周期監査を起動する差分をimplementation phaseに限定する。
5. 上記2つの反例を手動シナリオで照合する。

**owner**：S-RECORD規約担当（分類はS-AUDITと共有）

### CIV3-002 — major：修正後の再監査を「修正差分と波及先」に限定する手順がない

**基準**
- SA4、C-REVIEW、U2
- 設計 S-AUDIT `design.md:91,140`

**該当箇所**
- `roles/audit.md:9,15,24-28,32`
- `criteria/README.md:21`
- `templates/audit.md:11-12`

**反例**
1. 初回のplan監査でmajorが1件出て、require-reviewになる。
2. 修正により新しいsubject・新しい要求になるが、基準はnullのままである。
3. そのため `audit.md:9` により、再び初回監査として全scopeが対象になる。
4. さらに `criteria/README.md:21` が、毎回の横断確認を求めている。
5. 結果として、修正のたびに全体監査が行われる。

「新しい重大な反例には理由を示す」（`audit.md:28`）という規定は、再開の理由付けを求めるだけです。再監査の対象範囲は限定していません。

**影響**
修正の往復ごとに全体監査となり、停止回数と費用が際限なく増え得ます。SA4を実現する手順がない状態です。

**最小の解消条件**
1. 再監査要求に、前回の監査参照とopenのfinding_idsを持たせる。
2. 監査範囲を「前回のsubjectと新しいsubjectの差分＋参照上の波及先」と定義する。
3. 前回確認済みで変更のない部分は、理由付きの新しい重大反例がある場合を除いて再審査しない。
4. `templates/audit.md` に上記のための項目を追加する。

**owner**：S-AUDIT規約担当

### CIV3-003 — major：監査作業の費用が予算確認の対象外

**基準**
- C-SCOPE、SC4、AIDE-01
- 設計 S-AUDIT `design.md:129`「対象実験の予算を守る」
- 設計 S-CYCLE `design.md:110`

**該当箇所**
- `roles/experiment.md:17-22`：予算確認の対象は試行の実行だけ
- `roles/orchestrate.md:9`：必要な監査を先に処理する（予算確認なし）
- `protocols/messages.md:50`：periodic要求は保存後すぐ送信する
- `roles/audit.md`：予算の記述がない

**反例**
1. 金額上限10の実験で、試行の実測累計が8になる。
2. adoptionには初回implementationの独立監査が必要で、その監査は有料CLIセッションで約3かかる。
3. この送信・実行を止める規則がどこにもなく、上限を超える。
4. activity_dueによるperiodicは、特定の実験に属さないため、適用される予算そのものが存在しない。

**影響**
委任された予算を暗黙に超過し得ます。AIV3-001と同種の違反ですが、対象が別の経路です。

**最小の解消条件**
1. 監査・記録作業の費用を、実験予算に含めるか、別の監査予算として委任するかを明記する。
2. 独立監査の送信前に、試行と同じ保証判定を行う。
3. 保証できない場合は、要求をoutbox（送信待ち）に保留する。そのscopeを未監査のまま表示し、利用者に判断材料を返す。

**owner**：S-CYCLE（予算の定義）、S-AUDIT／orchestrate（送信前の確認）

### minor（6件）

| ID | 基準 | 箇所 | 反例・影響 | 解消条件 |
| --- | --- | --- | --- | --- |
| CIV3-004 | AIDE-03, SR4 | `records.md:34-36`。設計S-RECORD `design.md:91` の「内容ハッシュを確認」が手順から脱落 | 監査後に候補ファイルを修正しても、手順3で作業ファイルからbundleを作れてしまう。currentが監査済みsubjectと異なるのに、基準は監査済みと記録される。`subject.md:38` の一般規定が抑止にはなる | bundleをsubjectの不変参照から構成するか、各ファイルhashの一致を必須手順にする |
| CIV3-005 | G6, DDD-03 | `experiment.md:17` は対象版・委任・残予算のみ確認。設計 `root/design.md:191`、`messages.md:56` | 他サイクルのperiodicでscopeがblockedになっても、中断していない修正試行が続く。採用はrecordで止まるが、試作進行の保留に反する | 追加実行前の確認に、S-CONTEXTの進行判定（blocked_scopes）を加える |
| CIV3-006 | AIDE-03 | `templates/README.md:17` と `tools/README.md:16` | 参照例 `SN-<hash>/design/...` は実際の保存先 `SN-<hash>/files/design/...` と一致せず、解決規則が二通りになる | 参照形式を統一する |
| CIV3-007 | SA1, A4 | `messages.md:54`、設計S-AUDIT `design.md:149`。`templates/state.md` に項目がない | ユーザー指定の周期や7日の変更値を保存する場所がなく、再開時に既定値へ戻り得る | stateに周期設定と出所参照を追加する |
| CIV3-008 | AIDE-03 | `tools/snapshot.py:148-151` | subject JSONにキーが重複すると後勝ちでhashされる。表示上の先頭値と、hashされた意味が異なり得る | 重複キーを拒否し（`object_pairs_hook` など）、テストを追加する |
| CIV3-009 | SC4 | `templates/experiment.md:16-23` と `experiment.md:19` | 複数の上限それぞれの判定を保存するよう規定しているが、テンプレートの項目は単一値 | 上限ごとのmapにする |

## 3. system充足と過去指摘

| system | 判定 | 根拠 |
| --- | --- | --- |
| S-RECORD | fail | CIV3-001（差分・基準の単位）。ほかにCIV3-004、006、007 |
| S-CYCLE | fail（共有） | CIV3-003の予算定義。ほかにCIV3-005、009。計画・試行固定・終端通知・取消は充足 |
| S-AUDIT | fail | CIV3-002（SA4）、CIV3-003。CIV3-001の分類も共有 |

以下の項目では、手順上の具体的反例は見つかりませんでした。

- 4階層とDDD正本の両立
- 全枝の完成を待たない着手
- 取消・再送・中断・競合
- 終了通知のackの意味
- subjectの依拠先固定
- 定義変更の影響閉包と一括反映
- 独立性

**phaseの割当（plan / implementation）について**：保証を誤って流用する反例はなく、設計との意味不一致とは判定しません。ただし、plan phaseの未監査差分を周期監査で消せない点はこの分割から生じており、CIV3-001に含めました。

**過去指摘**
- **AIV3-001（closed）**：`experiment.md:15-27` で試行前の確認と、unknownを0として扱わないことが具体化されています。監査費用の問題は別経路であり、CIV3-003として新規に扱いました。
- **AIV3-002（closed）**：`test_snapshot.py:76-99` で、staging書込み失敗とrename失敗を個別に注入し、旧snapshotの維持を検証しています。
- **AIV3-003（closed）**：`snapshot.py:39` でlstatのreparse属性を検査しており、`is_junction` に依存していません。

snapshotツールのパス逸脱・リンク拒否・公開前検証・既存snapshotを上書きしない処理は、静的に見て正しいと判断します。reparse属性の一律拒否は、OneDriveなどのcloud fileも拒否し得ますが、安全側に倒れる動作のため指摘にはしていません。

## 4. 読んだ範囲と限界

**読んだもの**：提示された全ファイル。
- tree 80の閉包・入力snapshot・10ノード・requirements
- `harness-v3` 全体（README、protocols、roles、templates、criteria、migration、tools、tests、examples）
- 実装・検証記録、Astra round 1／2

**未読**
- `harness-v2`、ログ類、`docs/v3-design/README.md`
- `checks/`、`audits/README.md`
- package検査のコード

**検証の限界**
- 静的監査のみです。テストの再実行とhashの再計算は行っていません。
- 「snapshot 12件pass」「製品5件pass」は提示ログを読んだだけで、自分で実行した結果ではありません。
- 予算シナリオは主担当による手動照合の記録であり、自動化された検証ではありません。
- 実行証拠が示されていないもの：採用・取消競合・周期監査を通した運用。
- 実証されていないもの：実ユーザー運用での効果（時間、停止回数、理解）。