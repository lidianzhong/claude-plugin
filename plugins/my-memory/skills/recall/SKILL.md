---
name: recall
description: 从云端记忆库中搜索和检索记忆
model: haiku
effort: low
---

# Recall Skill

从云端记忆库中搜索和检索已保存的记忆。

## Instructions

当用户说"帮我查查"或使用 `/recall` 时，搜索相关记忆。

1. 从 `$ARGUMENTS` 中理解用户意图，提取搜索关键词
2. **查询扩展**：将关键词扩展为 3-5 个不同表达方式的搜索词，包括：
   - 原始关键词
   - 同义词或近义词（如"前端"→"frontend""UI""网页"）
   - 相关技术/工具名（如"数据库"→"MySQL""PostgreSQL""D1"）
   - 中英文对照（如"部署"→"deploy""CI/CD"）
3. 用每个搜索词分别查询：

```bash
curl -s -G "https://memory-worker.hzau.top/api/recall" --data-urlencode "q=搜索词"
```

4. 合并所有结果，按 id 去重
5. 无关键词则列出最近记忆：

```bash
curl -s "https://memory-worker.hzau.top/api/recall"
```

6. 格式化展示结果，每条记忆显示时间和内容
7. 无结果则回复："没有找到相关的记忆"
8. API 调用失败则回复错误信息

始终使用中文回复。
