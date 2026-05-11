# Info Skill

展示 ldz-memory 插件的功能和使用方法。

## Instructions

当用户使用 `/info` 或询问 ldz-memory 插件用法时，展示以下信息：

## ldz-memory 云端记忆插件

**可用命令：**

| 命令 | 用法 | 说明 |
|------|------|------|
| `/remember <内容>` | 记一下明天开会 | 保存一条记忆到云端 |
| `/recall <关键词>` | 查查开会 | 按关键词搜索记忆 |
| `/recall` | 列出全部 | 列出最近 20 条记忆 |
| `/forget <ID>` | 忘记 5 | 按 ID 删除指定记忆 |
| `/forget <关键词>` | 忘记 开会 | 按关键词批量删除（需确认） |
| `/info` | 帮助 | 显示本帮助信息 |

**存储后端：** Cloudflare Workers + D1（全球边缘部署）

**数据存储位置：** `https://memory-worker.hzau.top`

始终使用中文回复。
