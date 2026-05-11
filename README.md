# claude-marketplace

## 安装

将 marketplace 添加到 Claude Code：

```bash
/plugin marketplace add lidianzhong/claude-marketplace
```

安装后执行 `/reload-plugins` 生效。

## 插件

### my-memory — 共享记忆插件

<video src="static/video1.mp4" controls width="600"></video>

| 命令 | 用法 | 说明 |
|------|------|------|
| `/remember <内容>` | `记一下我的银行卡号` | 保存记忆 |
| `/recall <关键词>` | `查查我的卡号` | 模糊搜索记忆 |
| `/recall` | `列出` | 列出最近 20 条 |
| `/forget <ID>` | `忘记 5` | 按 ID 删除 |
| `/forget <关键词>` | `忘记 开会` | 批量删除记忆 |
| `/info` | `帮助` | 插件说明书 |

