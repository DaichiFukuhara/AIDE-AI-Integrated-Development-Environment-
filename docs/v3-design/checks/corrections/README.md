# AV3-004 訂正検査

旧3subgoalの検査入力が不完全だったことを明記し、root authoring時の保存済み参加側入力を固定した新しい検査単位を作った。旧manifest・公開・pass記録は上書きしない。今回の合成入力から両端の版と役割は確認できるが、当時の監査者が実際に読んだことは証明できない。

- [CORR-CL-SG-ASSURE-d3-t8-36f75939e7a4-67cdd94537a5](CORR-CL-SG-ASSURE-d3-t8-36f75939e7a4-67cdd94537a5.md)
- [CORR-CL-SG-LEARN-d3-t6-0710d62352da-4ad8e2167f2b](CORR-CL-SG-LEARN-d3-t6-0710d62352da-4ad8e2167f2b.md)
- [CORR-CL-SG-MODEL-d3-t4-25d6868dd8cc-45f8ce6e70e0](CORR-CL-SG-MODEL-d3-t4-25d6868dd8cc-45f8ce6e70e0.md)

unit_digestはcorrection_idとunit_digest自身を除いたfrontmatterの規約化SHA-256。参照元manifestはIDと完全hash、参加側情報はsnapshotと完全hashで固定した。
