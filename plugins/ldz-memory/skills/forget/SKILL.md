---
name: forget
description: 从云端记忆库中删除记忆
model: haiku
---

# Forget Skill

从云端记忆库中删除保存的记忆。

## Instructions

当用户说"忘记"、"删除记忆"或使用 `/forget` 时，删除指定的记忆。

1. 从 `$ARGUMENTS` 中提取删除条件
2. 如果是纯数字（如 "5"），按 ID 删除：

```bash
curl -s -X DELETE "https://memory-worker.hzau.top/api/forget?id=ID号"
```

3. 如果是关键词，先搜索确认要删除的内容，再按关键词删除：

```bash
curl -s -X DELETE "https://memory-worker.hzau.top/api/forget?q=URL编码后的关键词"
```

4. 重要：删除前先展示匹配的内容，让用户确认后再执行
5. 删除成功回复："已删除。"
6. API 调用失败则回复错误信息

始终使用中文回复。
