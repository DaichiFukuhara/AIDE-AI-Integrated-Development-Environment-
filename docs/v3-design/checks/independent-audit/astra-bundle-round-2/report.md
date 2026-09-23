**判定: fail — open major 1件、blocker 0件。旧AV3-001〜004はclosed。**

旧4件の修正は解消条件を満たしています。現行の文書対、tree 49の3閉包、handoffの識別対応にも破れは見つかりませんでした。ただし、将来v3で正本となるdomain/contextの意味を、監査対象へ版付きで固定する契約に不足があります。

**監査対象と限界**

添付本文から次を読み、直接照合しました。

- v2の品質基準、reviewを含む全ロール、README、両テンプレート、前例、書店例。
- G-V3、3subgoal、3approach、3systemの全20文書。
- tree-state、31 manifest、添付された全semantic snapshot、11 handoff、構造・意味・公開記録。
- 変更イベント2件、影響記録2件、失効記録10件、訂正検査3件と関連説明。
- 前回Astra報告の4指摘、要求要約、3件のログ。
- 正常、初回開始、失敗、取消、再送、再開、競合、周期監査の経路。

未添付の `docs/harness-v2-design.md`、`docs/harness-v3-draft.md`、DDD原典、独立監査の案内・実行記録、ログが参照する原会話や13kgame資料は読んでいません。これらは添付要約の範囲で扱いました。

ツール・別エージェント・編集・実装・テスト生成は使用していません。**SHA-256は提示値であり、再計算していません。** 以下は本文・識別子・参照・版の読取り照合であり、バイト同一性や公開時の実際の書込み操作を証明するものではありません。

以下の略称は `docs/v3-design/` 基準です。

| 略称 | ファイル |
| --- | --- |
| G | `root/design.md` |
| RECORD | `root/subgoals/sg-model/approaches/a-model/systems/s-record/design.md` |
| CYCLE | `root/subgoals/sg-learn/approaches/a-learn/systems/s-cycle/design.md` |
| AUDIT | `root/subgoals/sg-assure/approaches/a-assure/systems/s-audit/design.md` |

**AV3-005 — domain/context正本の意味を監査対象へ固定する規則が不足**

- **severity / status:** major / open
- **v2基準ID:** D-01、D-03、E-01。意味レビュー2・5。
- **場所:** RECORD L80–85、L105–106／G L178–181／AUDIT L68–69、L94、L103。
- **証拠:** RECORDはdomain文書を「共通言語と責任の正本」とし、同時に `spec` を4階層の文書に限定しています。一方、Gのsubjectはscope、phase、spec意味版・契約版、計画・評価条件版、実装・試行・証拠を固定しますが、domain/contextの用語・責任定義の版を含める規則がありません。それらを契約版集合へ必ず含める規則、または変更時に影響するspecの意味版へ必ず反映する規則もありません。
- **具体的な複数解釈:** system仕様がcontextで定義された「有効な対象」を参照している場合です。domain文書だけでその定義を変更し、system本文・契約レコード・実装・証拠を維持すると、列挙されたsubject項目は同じままになり得ます。一方の担当はdomain定義をsubject外の現行文書から読み、別の担当は契約集合に含めて固定できます。前者では、監査時と採用時で用語の意味が変わっても、subject一致だけでは検出できません。
- **影響:** AUDITが要求する用語・責任変更の限定監査と、Gが要求する監査対象の完全一致が接続しません。SR4、SA2・SA5、G4・G6の保証が不足します。これは保存技術の選択ではなく、共有する監査対象の意味の不足です。
- **解消条件:** 監査対象が依拠するdomain/contextの用語・責任・ルール定義を、不変な版または内容参照としてsubjectから解決できること。変更時の影響scope、新subject・新要求、旧判定と未監査差分の扱いを固定してください。直接収録する方式でも、意味を固定した公開契約へ展開する方式でも構いません。
- **修正owner:** G-V3の共有契約。S-RECORDが対象構成、S-CYCLEが提案入力、S-AUDITが照合を具体化。

**旧4件の再判定**

| ID | 状態 | 解消を確認した根拠 |
| --- | --- | --- |
| AV3-001 | **closed** | G L178–181で仕様・実装・試行・証拠の不変版集合を定義。CYCLE L89で追記と訂正を別の不変参照にし、RECORD L106、AUDIT L103で一致を照合する。実装Aの判定を実装Bへ流用する旧反例は解消。 |
| AV3-002 | **closed** | G L184–188で終端、中断、通知owner、起動owner、保存とack、再送、期限起動を定義。CYCLE L90、RECORD L107、AUDIT L104が同じ経路を実現する。採用後・不採用・取消の終了も扱う。 |
| AV3-003 | **closed** | G L191–194で取消自身のID、対象operation、期待hash、未着対象、取消先着・反映先着、遅延結果を定義。RECORD L108、CYCLE L91、AUDIT L105が整合する。 |
| AV3-004 | **closed** | 3件の `checks/corrections/CORR-*.md` L2–90が旧閉包・旧公開記録・root閉包・追加参加側入力を固定。L97–99が合成入力による今回の確認と、当時の検査実施を証明できない限界を区別している。 |

AV3-005は、AV3-001で問題だった実装・証拠参照の修正を否定するものではありません。別の正本であるdomain/contextの定義への適用漏れです。

**現行構造・閉包・公開履歴の照合**

10ノードの両文書で、id、status、通常revision、design revision、parent revisionが一致します。

| 対象 | 通常revision | design revision | parent revision |
| --- | ---: | ---: | ---: |
| G-V3 | 12 | 4 | null |
| 3subgoal | 13 | 5 | 4 |
| 3approach | 13 | 5 | 5 |
| 3system | 13 | 4 | 5 |

親・depth・配置は4階層と一致し、3systemは葉です。9エッジはselectedなall_ofで、条件割当と根に残るG6を追えます。各枝の成果・方式・外部動作には異なる判断責任があり、一子の構成を欠陥とはしません。

4本のseamはG-V3をownerとするrevision 2の正本に集約され、3subgoalのproducer/consumer参照と一致します。systemは祖先契約の実現責任を継承しており、system自身の空の `seam_refs` を参加側欠落とは判定しません。

tree-state L2–20は通常revision 59、tree revision 49で、次の3件をcurrentとして指しています。

| system | current closure | 照合結果 |
| --- | --- | --- |
| S-RECORD | `CL-S-RECORD-d4-t49-c65a3a86187d` | d4／親d5／tree 49／handoff一致 |
| S-CYCLE | `CL-S-CYCLE-d4-t49-9d46a3ae144b` | 同上 |
| S-AUDIT | `CL-S-AUDIT-d4-t49-9fc049759e19` | 同上 |

各閉包には祖先・対象の8文書、4契約、3参加側snapshot、要求要約、受入条件、UT/SIT/FITがあります。現行本文とsnapshotの意味上の食い違いは見つかりませんでした。dependencies、active invalidations、staged childrenは空です。**handoffのpass表示は今回の意味判定の根拠にはしていません。**

変更処理では、元イベントがtree 18を基準に全10ノードへ波及し、旧current閉包3件を失効対象にしています。失効記録は旧意味版を指定し、新版公開による作業解消と旧版の再有効化を区別しています。根の変更が全枝へ及ぶため、影響なしの近傍が空であることにも説明がつきます。

再公開のstructural・semantic・publicationは同じauthoring closureを参照し、対象・親意味版が一致します。公開のtree遷移は `20→21、23→24、…、47→48`。失効解消後のtree 49で引渡しを再構成する記録と整合します。公開差分イベントの追加影響集合が空であることも、改訂された祖先版と契約版2を全枝が参照する現在の構成と整合します。

訂正検査は旧manifestを完全だったと再認定していません。参加側のrevision 1・owner・役割は固定snapshotから照合でき、旧公開記録との関係も明示されています。旧ファイルが実際に変更されていないというバイト単位の主張は、今回独立には検証していません。

**経路と委任の判断**

- 初回は `base_bundle=null` のplanから開始でき、未実装部分のテスト成功を要求しません。planはcurrentを切り替えず、adoptionで反映します。
- 実験失敗、比較不能、証拠版不一致、保留を区別し、成功・監査合格・採用・実行許可を混同していません。
- 取消とcurrent切替の順序は記録側が所有し、再送・遅延結果・反映済み応答を区別します。
- 中断時は完全なcurrentと保存済み操作から再開し、競合時は最新bundleで再評価します。
- 周期監査の起動と未送信要求の再開経路が明示されています。重大問題による保留は影響scopeに限定され、原因解消の候補作成・限定検証を許しています。
- DDDの適用理由、理由付きN/A、実装前後の確認範囲とAIDE固有の運用規則が区別されています。言語・ライブラリ・索引・保存手段の委任自体は重大指摘にしていません。

**意味レビュー7観点**

| 観点 | 今回の判断 |
| --- | --- |
| 1. 目的適合 | 方針と責任分割は適合。G4・G6の保証にAV3-005が残る。 |
| 2. 十分性 | **fail**。domain/context正本を監査対象へ固定する境界判断が残る。 |
| 3. 境界 | ownerと4契約の両端は整合。監査入力の範囲はAV3-005により**fail**。 |
| 4. 分解と選択 | **pass**。4階層、3枝、一子の判断責任、条件被覆を説明できる。 |
| 5. 変更耐性 | **fail**。実装・証拠・取消の修正は成立するが、domain/context単独変更の対象固定が不足。 |
| 6. 閉包完全性 | **pass**。現行3閉包の収録と訂正検査は整合。旧閉包の不足を遡及的に消していない。 |
| 7. 将来検証への接続 | **pass**。UT/SIT/FITと条件を追跡できる。条件を実現する設計の十分性にはAV3-005が残る。 |

**3systemごとの判断**

| system | 判定 | 理由 |
| --- | --- | --- |
| S-RECORD | **fail** | domain/context正本と監査subjectの版対応が不足。 |
| S-CYCLE | **fail** | 共通契約に従う提案へ、依拠するdomain/context定義をどう固定するかが未確定。 |
| S-AUDIT | **fail** | 用語・責任変更を確認する対象の同一性を、共有subjectだけでは保証できない。 |

これは将来の受入条件を実現できる**設計の十分性**の判定です。実行規約・製品実装・テスト・効率改善・利用者理解の実証が未実施であること自体は欠陥にしていません。