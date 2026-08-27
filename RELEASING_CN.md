# 发布 Paws 插件版本

[English](RELEASING.md)

## 版本契约

- `package.json.version` 是整个仓库包和 GitHub Release 的版本。
- 每个插件 Manifest 有独立的 SemVer 版本；只有该插件的安装行为或配置契约发生变化时才升级。
- Release tag 必须严格等于 `v<package.json.version>`。
- 已发布 tag 永远不能移动或复用。
- Paws 使用完整 commit SHA；插件仓库发布新版本不会自动更新 Paws。

## 发布产物

每个 GitHub Release 包含：

- `paws-plugins-<version>.tgz`：供 Paws 构建时使用的插件包；
- `catalog.json`：声明式插件目录；
- `release.json`：包版本、源码 commit、产物摘要和各插件版本；
- `SHA256SUMS`：插件包、目录和发布元数据的 SHA-256。

GitHub Actions 还会为插件包生成构建来源证明。

## 发布步骤

1. 更新受影响插件的 Manifest version 和 `CHANGELOG.md`。
2. 每次仓库发布都升级 `package.json.version`。
3. 运行 `pnpm release:artifacts`，核对 `release/SHA256SUMS`。
4. 提交并推送 `main`，等待 CI 通过。
5. 创建并推送 annotated tag：

   ```bash
   git tag -a vX.Y.Z -m "Paws Plugins vX.Y.Z"
   git push origin vX.Y.Z
   ```

6. 等待 `Release` workflow，并核验 GitHub Release 的每个产物和摘要。
7. 在 Paws 中把两处 `@paws/plugins` 依赖和 `pnpm-lock.yaml` 更新到该 Release 的完整 commit SHA，通过跨包检查后再合入。

当前流程有意不发布 npm。若以后增加 npm 分发，需要单独决定命名空间、token、来源证明和撤销机制。
