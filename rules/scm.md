# 源码管理规则 — first-main (AIWorkSpace)

## 分支策略

- **所有仓库（父仓库 + 子模块）统一使用 `myproject` 分支进行开发和提交**
- 禁止直接在 `main` / `master` 分支上提交代码
- 新建功能分支时，必须从 `myproject` 分支拉取

## Git Submodule 管理

- 子模块添加时必须指定 `--branch myproject`，确保追踪正确的分支
- 更新子模块时使用 `git submodule update --remote` 拉取 `myproject` 分支最新提交
- 克隆项目后必须执行 `git submodule update --init --recursive` 初始化子模块

## 提交规范

- 使用 Conventional Commits 格式：`type(scope): subject`
- type 可选值：`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- 提交前必须确保所有测试通过
- 禁止在提交中包含敏感信息（密码、密钥、Token 等）

## 父子仓库提交顺序

1. 先在子模块（`backend/` 或 `frontend/`）内完成 commit 和 push
2. 再在父仓库提交子模块指针的变更（`git add backend` / `git add frontend`）
3. 确保父仓库和子模块的 `myproject` 分支保持同步
