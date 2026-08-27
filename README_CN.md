# Paws 插件仓库

[English](README.md)

这是 [Paws](https://github.com/wangjs-jacky/happy) 的第一方插件 Monorepo。插件清单、配置安全策略和可复用业务逻辑存放在这里；Paws 主仓负责插件 Registry、加密安装记录、插件市场以及与 App、数据库、Socket 和文件存储连接的 Adapter。

## 当前插件

| 插件 | ID | 功能 |
|---|---|---|
| 狗头军师 | `relationship-advisor` | 使用用户配置的 OpenAI 兼容提供商分析对话 |
| 生成图片画廊 | `generated-images-gallery` | 从 Paws 会话中收集并展示生成图片 |

## 信任模型

Paws 当前使用固定 commit 的 Git 依赖在构建时集成本仓库。用户点击安装时，只会启用已经过审核并包含在当前 Paws 构建中的代码，不会在运行时下载或执行任意远程 JavaScript。

## 开发

```bash
pnpm install
pnpm check
```

插件 ID 发布后不可更改。插件版本遵循 SemVer 意图，Paws 主机当前使用精确版本门禁。所有 secret 必须在服务端校验，公开状态只能返回不可逆提示。

## 版本发布

版本包通过 GitHub Releases 发布，同时提供插件目录、机器可读发布元数据、SHA-256 和构建来源证明。完整流程见 [RELEASING_CN.md](RELEASING_CN.md)。

完整生命周期和安全约定见 Paws 的[插件开发规范](https://github.com/wangjs-jacky/happy/blob/main/docs/plugin-development.md)。

## 许可证

MIT
