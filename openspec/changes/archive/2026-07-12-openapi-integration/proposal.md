## Why

AGENTS.md 锁定栈要求使用 **OpenAPI / springdoc-openapi** 作为接口契约层，但当前后端 `pom.xml` 未安装 `springdoc-openapi`，前端也未安装 `openapi-typescript`。这意味着：
- 后端无法自动生成 OpenAPI 3.1 schema（`/v3/api-docs`）
- 没有 Swagger UI 可供人工浏览和测试 API
- 前端无法从 schema 自动生成 TypeScript 类型（`lib/api/schema.d.ts`）
- 跨语言类型对齐完全依赖手工维护，容易漂移

补齐这一环是后续所有 API 模块（auth、posts、spots 等）共享类型契约的基础设施前提。

## What Changes

- **后端新增依赖**：`pom.xml` 添加 `springdoc-openapi-starter-webmvc-ui`（v2.x，兼容 Spring Boot 3.3）
- **后端 OpenAPI 配置**：在 `application.yml` 中配置 springdoc 路径、API 元数据（title / version / description）
- **后端 Security Scheme**：声明 Bearer JWT 认证方式（`OpenAPIConfig` 配置类），为后续认证模块预留
- **后端 Swagger UI**：自动暴露在 `/swagger-ui.html`，开发阶段可直接浏览
- **前端新增依赖**：`package.json` 添加 `openapi-typescript` 到 devDependencies
- **前端类型生成脚本**：`npm run generate:api` 从 `http://localhost:8080/v3/api-docs` 生成 `lib/api/schema.d.ts`
- **安全配置**：放通 `/v3/api-docs/**` 和 `/swagger-ui/**` 路径，不需要认证即可访问文档

## Capabilities

### New Capabilities

- `openapi-integration`: 后端 springdoc-openapi 集成 + Swagger UI 暴露 + OpenAPI 配置类 + 前端 openapi-typescript 类型生成管线

### Modified Capabilities

- `openapi-contract`: 现有 spec 中定义的 5 个 Requirement（Schema 自动生成、Swagger UI、Response DTO 强类型化、Security Scheme、前端类型生成）从"未实现"变为"已实现"。本 change 不修改 spec 内容，仅落地实现。

## Impact

- **后端 `pom.xml`**：新增 `springdoc-openapi-starter-webmvc-ui` 依赖（~2 MB）
- **后端 `application.yml`**：新增 `springdoc.*` 配置块
- **后端新增文件**：`config/OpenApiConfig.java`（Security Scheme + API 元数据声明）
- **前端 `package.json`**：新增 `openapi-typescript` devDependency + `generate:api` script
- **前端新增文件**：`lib/api/schema.d.ts`（生成的类型文件，首次生成后提交到 git）
- **无破坏性变更**：不影响现有 HelloController / GlobalExceptionHandler 行为
- **后续模块受益**：所有后续 API 模块的 Controller 自动纳入 OpenAPI schema，无需额外配置
