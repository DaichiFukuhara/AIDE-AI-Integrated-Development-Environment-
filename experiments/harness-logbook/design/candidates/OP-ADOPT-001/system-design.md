---
{
  "id": "SYS-LOG",
  "kind": "system",
  "revision": 2,
  "semantic_revision": 1,
  "status": "ready",
  "primary_parent": "AP-FILE",
  "parent_semantic_revision": 1,
  "domain_id": "D-LOG",
  "context_id": "CTX-LOG",
  "source_refs": [
    "DELEGATION-01"
  ],
  "children": [],
  "uses_systems": [],
  "model_definition_refs": [
    "DEF-LOG-01"
  ],
  "owned_seams": [],
  "seam_refs": [],
  "dependencies": [],
  "unit_test_id": "UT-01",
  "subgoal_integration_id": null,
  "final_integration_id": null
}
---

# 記録ファイルとログ画面を接続する

## 意味と理由
記録contextの一つのsystemとしてCLI、保存、読取、画面を実装する。役割や配信プロセスでcontextを増やさない。

## 操作と結果
正常例: AIが実行結果をID付きで保存すると画面のタイムラインに現れ、既存の証拠ファイルを開ける。
例外: 同ID・同内容の再送は既存記録を返す。同ID・異内容、壊れた保存物、範囲外/存在しない証拠は拒否し、既存ログを維持する。通信失敗時は前回データと「更新できない」を併記し、空や成功へ置換しない。

## 守ること・できないこと
ハーネスのstateだけがcurrent/監査/サイクル状態の正本。イベントは観測記録で、イベントの成功や監査風の文言から採用状態を変更しない。UIはログ・stateとも読取専用。単一ローカル書込担当を前提とする。多人同時編集、認証、公開、AI推論や正式監査の自動実行は対象外。

## 決定済みと未決
検索、工程絞り込み、詳細（理由・根拠・次の操作）、再読、JSON/Markdownのコピーを実装する。色・余白・ファイル名など内部選択は実装担当へ委任。長期運用/ブラウザ互換/本人の使いやすさ評価は未確認。

## 親条件と子への割当
UT-01: 入力検証・再送同一性・中断時の保存・不正参照拒否・表示エスケープを検証する。
子なし。UT-01を所有し、SIT-01とFIT-01へ入出力の証拠を渡す。

## 受入条件と検証
| 条件 | 成立状態 | 確認 |
| --- | --- | --- |
| UT-01 | 入力検証・再送同一性・中断時の保存・不正参照拒否・表示エスケープを検証する。 | experiments/E-001-plan.md の固定条件 |

利用者の理解: 未確認。今回の自動確認とAIによる実使用を、本人評価へ読み替えない。

## 試行で確認した内部構成
CLIと読取HTTPをPython標準ライブラリで実装し、HTML/CSS/JSが実ログと台帳を読み取る。根拠は画面内にテキスト表示する。受入条件・owner・定義の意味は変更していない。採用の権威はstate.current_bundleであり、この作業表示パスではない。
