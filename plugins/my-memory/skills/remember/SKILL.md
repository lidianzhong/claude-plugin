---
name: remember
description: 保存内容到云端记忆库
model: haiku
effort: low
---

# Remember Skill

将用户的内容保存到云端记忆库。

## Instructions

当用户说"记一下"或使用 `/remember` 时，提取要保存的内容并调用 API。

1. 从 `$ARGUMENTS` 中提取要记忆的内容
2. 将 JSON 写入临时文件（避免中文编码问题），再用 curl 发送：

```bash
echo -n '{"content": "提取的记忆内容"}' > /tmp/memory.json
curl -s -X POST https://memory-worker.hzau.top/api/remember \
  -H "Content-Type: application/json; charset=utf-8" \
  -d @/tmp/memory.json
```

3. 成功则回复："已记住：xxx"
4. 失败则回复错误信息

始终使用中文回复。
