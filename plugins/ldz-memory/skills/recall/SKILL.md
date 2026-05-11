---
name: recall
description: 从云端记忆库中搜索和检索记忆
model: haiku
---

# Recall Skill

从云端记忆库中搜索和检索已保存的记忆。

## Instructions

当用户说"帮我查查"或使用 `/recall` 时，搜索相关记忆。

1. 从 `$ARGUMENTS` 中提取搜索关键词
2. 有关键词则搜索（中文关键词需 URL 编码）：

```bash
curl -s "https://memory-worker.hzau.top/api/recall?q=URL编码后的关键词"
```

3. 无关键词则列出最近记忆：

```bash
curl -s "https://memory-worker.hzau.top/api/recall"
```

4. 格式化展示结果，每条记忆显示时间和内容
5. 无结果则回复："没有找到相关的记忆"
6. API 调用失败则回复错误信息

始终使用中文回复。
