# AIDE v3 — 小さく試し、設計へ戻す

目標を説明し、必要な部分を作って試し、結果に合わせて設計を育てるMarkdownハーネスです。
AIはこの規約を読み、プロジェクト内の保存記録から次の作業を選びます。

## はじめる

AIへ次のように依頼します。

```text
harness-v3/README.md に従って開発してください。
目標: <誰が何をできるようにするか>
プロジェクト: <保存先>
今回試すこと: <最初の未確認事項。未定なら候補を選ぶ>
制約・既存の許可: <予算、触れる範囲、外部公開等の条件>
```

1. [intake](roles/intake.md)で目標と許可を整理する。
2. [design](roles/design.md)で今回必要な4階層とモデル境界を作る。
3. [record](roles/record.md)から計画の確認を依頼する。初回は必要な境界だけを[audit](roles/audit.md)へ渡す。
4. [experiment](roles/experiment.md)で実装・関連テスト・実使用を行い、修正または採否を決める。
5. 採用案をrecordへ戻す。終了通知から周期確認を起動し、[orchestrate](roles/orchestrate.md)が次を選ぶ。

着手に必要なのは今回の枝です。他の枝の完成、未実装部分のテスト成功を待ちません。
一つの実験は複数systemをまたげます。実験、system、contextを一対一に固定しません。

## 正本の置き場所

```text
<project>/
  design/
    master.md + rationale.md                  # root_goal
    goals/<goal>/design.md + rationale.md      # subgoal
      approaches/<approach>/design.md + rationale.md
    domains/<domain>/design.md + rationale.md  # 言語・責任の定義
      systems/<system>/design.md + rationale.md
    state.md                                  # current参照、操作台帳、送信待ち
    candidates/<operation-id>/...              # 未採用の差分と準備した一組
    snapshots/<snapshot-id>/...                # 書き換えない過去入力
  experiments/<experiment-id>.md
  experiments/trials/<trial-id>.md
  audits/<audit-id>.md
  operations/<operation-id>.md
  src/
  tests/
```

論理構造は **root_goal → subgoal → approach → system**。systemの`primary_parent`は一つのapproachです。
別approachからの`uses_systems`は役割・担当条件付きの参照で、正本を複製しません。
domainは業務のまとまり、contextは言葉とモデルの意味が一貫する境界です。第5階層でもサービス数の指定でもありません。

`master.md`は目的・全体方針・条件・参照を持ちます。詳細の全文や毎回の試行ログは転記しません。
設計の対は[spec](templates/spec.md)と[rationale](templates/rationale.md)、定義の対は[model](templates/model.md)とrationaleを使います。
保存形式、版、currentの意味は[記録契約](protocols/records.md)が正本です。

## 誰が更新するか

| context | 所有する判断・状態 | 実行ロール |
| --- | --- | --- |
| 記録 | 現在仕様、候補、参照、採用、取消と反映の確定順 | design / precheck / record |
| 学習 | 計画、試行、観測、採否の提案、予算、サイクル終端 | intake / experiment |
| 監査 | 確認範囲、監査判定、指摘 | audit |

ロールは手順の担当名で、設計ツリーの子や別プロセスの必須指定ではありません。
通常は一人の反映担当が逐次書き込みます。並行作業者は別候補を返します。
独立監査だけは原則として起草者とは別の担当へ渡します。

## 守ること

- 仕様・実装・試行・証拠・domain/context定義の版を[subject](protocols/subject.md)へ固定する。
- 計画の許可、実験の成功、監査合格、現在仕様への採用、外部公開を区別する。
- 既存の許可と委任を引き継ぐ。可逆な内部選択は担当が決め、目的・予算・外部影響を暗黙に拡大しない。
- 監査済みの意味を保つ小変更は関連確認で進める。意味・境界変更は即時限定監査、未監査差分は終了時または期限に周期監査する。
- 失敗・比較不能・未実行・人の評価未確認を成功へ置換しない。
- 同じ操作の再送で二重反映しない。取消と遅延結果は[受渡し契約](protocols/messages.md)に従う。
- 説明は目的、短い理由、操作と結果、制約、決定済みと未決、詳細の順に書く。専門語の初出を説明する。

## 実行と検査

これはAIが手順を実行するハーネスです。常駐サービスや自動採用エンジンは含みません。
[snapshot補助ツール](tools/README.md)は入力保存とハッシュ照合だけを自動化します。意味監査、許可判断、台帳の更新は担当が行います。

```sh
python -m unittest discover -s harness-v3/tests -v
python harness-v3/examples/task-summary/run.py
```

[実行例](examples/task-summary/README.md)は製品コードの小さな修正と実行結果を再現する演習です。例中の監査役の状態遷移は演習用で、独立監査済みという証拠に使いません。

## 完了と引継ぎ

今回の範囲の採否・反映結果・終端通知・必要な監査が確定し、未解決事項と次の操作が保存されていればサイクルを閉じます。
プロジェクト全体の完了には、選択した必須条件、関連するUT/SIT/FIT、必要な実使用・人の評価、現在版の監査要件の充足が必要です。
全体未完成でも一つの実験を完了できます。

[移行手順](migration.md) / [品質基準](criteria/README.md) / [テンプレート一覧](templates/README.md) / [設計との対応](../docs/v3-implementation/README.md)
