# AI Agent 行为规范 — first-main

## 项目概述

**first-main** 是一个全栈 AI Coding 项目，采用 **Harness + OpenSpec + Superpowers** 三层架构理念开发。

## 技术栈

| 层次 | 技术 | 版本 |
|------|------|------|
| 后端 | Spring Boot | 3.3 |
| 语言 | Java | 17 |
| 前端框架 | React | 19 |
| 前端运行时 | Next.js | 16 |
| 前端语言 | TypeScript | 5.x |
| 数据库 | MySQL | 8 |
| 接口契约 | OpenAPI 3.1 / Springdoc-openapi | 2.x |
| 包管理器 | pnpm | latest |
| 构建工具 | Maven (后端) / Next.js 内置 (前端) | — |
| 测试框架 | JUnit 5 (后端) / Vitest + React Testing Library (前端) | — |

## 接口契约 (OpenAPI)

前后端通过 **OpenAPI 3.1** 规范进行接口契约管理：

- **后端**：使用 `springdoc-openapi-starter-webmvc-ui` 自动生成 OpenAPI 文档
  - Swagger UI 访问地址：`http://localhost:8080/swagger-ui.html`
  - OpenAPI JSON：`http://localhost:8080/v3/api-docs`
  - 所有 Controller 必须使用 `@Tag`、`@Operation`、`@Schema` 等注解描述 API
- **前端**：基于 OpenAPI spec 生成 TypeScript 类型和 API 客户端
  - 契约文件位置：`backend/src/main/resources/static/openapi.json`（导出）
  - 前端类型定义：`frontend/src/types/api.ts`（基于 OpenAPI 生成）
- **变更流程**：修改 API 时必须同步更新 OpenAPI 注解，确保契约一致性

## 核心原则

1. **TDD (测试驱动开发)**：先写测试，再写实现代码。RED → GREEN → REFACTOR。
2. **YAGNI (你不需要它)**：不要实现不需要的功能。
3. **DRY (不要重复自己)**：抽象共享逻辑，避免代码重复。
4. **规格先行**：在写任何代码之前，必须先通过 OpenSpec 流程达成共识。

## 工作流

```
/opsx:explore → /opsx:propose → /opsx:apply → /opsx:archive
```

1. **探索** (`/opsx:explore`)：不确定要做什么时，先用探索模式思考
2. **提案** (`/opsx:propose`)：明确要做什么后，创建变更提案
3. **实施** (`/opsx:apply`)：按照 tasks.md 中的清单逐步实现
4. **归档** (`/opsx:archive`)：完成后归档变更，合并 delta specs

## 代码修改前的必做检查

在修改任何代码之前，AI Agent 必须：

1. **检查 skills/**：查看是否有适用的 Superpowers 技能
2. **阅读 openspec/specs/**：了解当前系统规格
3. **查看 openspec/changes/**：了解正在进行的变更
4. **遵循 rules/**：遵守 `rules/` 目录下的所有规则

## 目录结构说明

```
first-main/
├── AGENTS.md           # 本文件：AI Agent 行为规范
├── .cursorrules        # Cursor AI 专用规则
├── rules/              # 自定义规则（代码风格、测试规范等）
├── openspec/           # OpenSpec 规格驱动开发
│   ├── config.yaml     # 项目配置
│   ├── specs/          # 系统规格真相源
│   └── changes/        # 变更提案
├── skills/             # Superpowers 可组合 AI 技能
├── backend/            # Spring Boot 后端 (Java 17)
└── frontend/           # React 19 + Next.js 16 前端
```

## 禁止行为

- 未经规格确认就直接写实现代码
- 跳过测试直接提交
- 修改 `openspec/specs/` 而不经过 change 流程
- 在没有阅读 `rules/` 的情况下修改代码风格
