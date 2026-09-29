---
{
  "experiment_id": "E-001",
  "revision": 1,
  "plan_revision": 1,
  "cycle_id": "C-001",
  "previous_cycle_ref": null,
  "state": "planned",
  "goal_refs": [
    "G-LOG",
    "SG-TRACE"
  ],
  "system_refs": [
    "SYS-LOG"
  ],
  "domain_context_refs": [
    "D-LOG",
    "CTX-LOG"
  ],
  "model_definition_refs": [
    "DEF-LOG-01"
  ],
  "baseline_bundle": null,
  "delegation_ref": "operations/delegation.md",
  "budget_account_refs": [
    "LOCAL-01"
  ],
  "budget": "experiments/budget-definition.md"
}
---

# 実際のハーネス記録から作業を追えるか

## 仮説と最小出力
実際の計画・実装・検証・監査で得た観測をAIがCLIで追記し、画面がファイルから読むことで、架空デモを眺める場合より作業の再開に必要な情報が残る。最小出力はHTML/CSS/JS画面、標準Pythonの記録CLI/読取サーバー、実記録、検証結果、採否とハーネス使用所感。

## 範囲と上限
src と tests を新規作成する。旧試作は変更しない。3つ以上の本作業の実イベントで実使用を確認する。過去の出来事を記録する場合は「事後記録」と原本参照を明示し、イベント記録時刻と出来事の時刻を混同しない。架空の成功を初期値に入れない。役割はrootが順に担当し、初回計画と採用監査のみ別の監査者が担当する。

予算はBUDGET-01の数値枠。各trial/audit/record前にstateの最新revision・定義ref・未決予約・blocked_scopesを照合し予約する。固定実装でのUT/SIT/FIT一組を1trial、コード変更後の実行は新trial。合格または枠到達時に停止。条件・境界変更は計画版を上げて再監査。

## 固定した評価条件
| ID | 条件と確認手段 | 必須性 |
| --- | --- | --- |
| UT-01 | CLIで追記後に再読できる。同ID同内容は増えず、異内容と不正/範囲外/欠落証拠は拒否。壊れた保存物を上書きしない。ロック競合・atomic replaceの失敗時も旧データ保持。自動テストで確認 | 必須 |
| SIT-01 | 実CLI→実HTTP→取得JSONの対応、JSON/Markdownの書き出し内容、POST拒否、contextがstateと一致。自動テストで確認 | 必須 |
| FIT-01 | 本作業の3件以上の実ログを画面で読み、検索・工程絞り込み・詳細・根拠表示・再読保持を操作。ネットワーク失敗を更新失敗と表示する。390px/デスクトップで横はみ出しなし。ブラウザ実使用で確認 | 必須 |
| HARNESS-01 | checked以前に製品実装をしない。subjectのhashとsnapshotを検証し、独立監査を別担当に依頼。current反映/終端/周期判定まで台帳で追える | 必須 |
| HUMAN-01 | 本人にとって使いやすいか、実際の業務再開に十分か | 今回は未確認を明示し次の実験へ。技術的な試験採用を妨げないが製品全体完成とはしない |

確率的AI精度の計測ではなく、決定的な保存/閲覧とハーネス運用の1事例。速度改善や一般的な品質改善を主張しない。旧試作との比較は「手順記録なし」と「実記録と版対応あり」という有無の比較に限定する。

## 採否と反映
必須条件に証拠が揃い、独立adoption監査のopen major/blocker=0なら本実験の試験採用を提案。実際の反映はrecordが固定subjectと最新stateを照合して行う。計画合格は実装採用を意味しない。

## 中断・終了・再開
完了時はplan/adoption確定結果とcycle_closedを保存し、implementation未監査差分がなければ理由付き周期skip、あれば監査へ。未確認本人評価と次の作業を残す。予算待ちや監査修正待ちは完了と記載しない。
