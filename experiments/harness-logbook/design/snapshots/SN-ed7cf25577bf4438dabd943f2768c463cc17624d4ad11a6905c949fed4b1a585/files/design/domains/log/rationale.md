---
{
  "id": "DEF-LOG-01",
  "revision": 1,
  "semantic_revision": 1,
  "primary_parent": null,
  "parent_semantic_revision": null
}
---

# 定義の根拠
一つの観測記録を複数の保証に読み替えないため、ログの結果とハーネスの採用状態を分ける。永続化はAIが実際に書けるファイルで行い、取消・訂正も追記として残す。snapshotはハーネスが保証対象を固定する手段であり、一般ログの保存とは責任が異なる。
