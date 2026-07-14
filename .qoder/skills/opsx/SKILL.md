---
name: opsx
description: 驱动 OpenSpec 规格驱动开发工作流：探索需求、创建变更提案、按计划实施、归档合并。在用户需要进行任何变更开发时使用，包括新功能、重构、修复等。当用户提及 opsx、OpenSpec、变更流程、规格开发、提案时触发。
---

# OpenSpec 工作流 (opsx)

完整流程：`explore → propose → apply → archive`

## 前置检查

每次开始变更前，先阅读：

1. `openspec/specs/` — 当前系统规格
2. `openspec/changes/` — 正在进行的变更
3. `rules/` — 代码风格、测试规范、SCM 规则

---

## 阶段 1：探索 (explore)

**何时使用**：需求不明确、有多个可能方案、不确定影响范围时。

### 步骤

1. 询问用户真实意图："你真正想达成什么目标？"
2. 阅读 `openspec/specs/` 了解当前系统行为
3. 提出 2-3 个方案并说明取舍
4. 推荐最简单方案（遵循 YAGNI 原则）
5. 等用户确认方向后进入 propose 阶段

---

## 阶段 2：提案 (propose)

**何时使用**：目标已明确，需要正式记录变更。

### 步骤

1. 在 `openspec/changes/` 下创建变更目录（使用 kebab-case 命名）
2. 按顺序生成以下 artifacts：

**proposal.md**（为什么做、做什么）
- 基于 `openspec/changes/_template/proposal.md` 模板
- 包含：意图、范围、方案、成功标准

**specs/delta-spec.md**（规格变更）
- 基于 `openspec/changes/_template/specs/delta-spec.md` 模板
- 用 GIVEN/WHEN/THEN 描述新增/修改/删除的需求

**design.md**（怎么做）
- 基于 `openspec/changes/_template/design.md` 模板
- 包含：架构决策（ADR）、后端/前端/数据库设计、非功能性需求

**tasks.md**（实施清单）
- 基于 `openspec/changes/_template/tasks.md` 模板
- 按基础设施、后端、前端、测试、验证分组

### 模板位置

所有模板位于 `openspec/changes/_template/`

---

## 阶段 3：实施 (apply)

**何时使用**：tasks.md 已批准，开始写代码。

### 步骤

1. 读取 `tasks.md` 和 `design.md`
2. 按批次执行任务：

| 批次 | 内容 | 检查点 |
|------|------|--------|
| 1 | 基础设施与搭建 | 确认搭建正常 |
| 2 | 后端核心实现 | 运行 `mvn test` |
| 3 | 前端实现 | 运行 `pnpm test` |
| 4 | 集成与打磨 | 完整测试套件 |

3. 每个任务完成后：实现 → 测试 → 勾选任务
4. 每批完成后：总结进度，等用户确认再继续

### 提交规范

遵循 `rules/scm.md`，使用 Conventional Commits：`feat(scope): subject`

---

## 阶段 4：归档 (archive)

**何时使用**：所有任务完成，测试通过。

### 步骤

1. 确认 `tasks.md` 中所有任务已勾选
2. 运行完整测试套件（后端 + 前端）
3. 将 delta specs 合并到 `openspec/specs/` 对应文件
4. 将变更目录移动到 `openspec/changes/archive/`
5. 更新父仓库的子模块指针（如有子模块变更）

---

## 快速决策树

```
不确定要做什么？
└── 是 → 进入 explore
└── 否 → 目标明确？
    ├── 是 → 进入 propose
    └── 否 → 先 explore 理清需求

有已批准的 tasks.md？
├── 是 → 进入 apply
└── 否 → 先完成 propose

所有任务完成？
├── 是 → 进入 archive
└── 否 → 继续 apply
```

---

## 禁止行为

- 未经规格确认就直接写实现代码
- 跳过测试直接提交
- 修改 `openspec/specs/` 而不经过 change 流程
- 未阅读 `rules/` 就修改代码风格
