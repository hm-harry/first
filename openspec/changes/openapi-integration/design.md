## Context

当前后端（Spring Boot 3.3.5 + Java 17）已具备 HelloController + GlobalExceptionHandler 的基础 Web 层，但缺少 OpenAPI 基础设施：
- `pom.xml` 无 `springdoc-openapi` 依赖
- 无 `/v3/api-docs` 端点、无 Swagger UI
- 前端无 `openapi-typescript`，无自动类型生成管线

已有 spec `openspec/specs/openapi-contract/spec.md` 定义了 5 个 Requirement（Schema 自动生成、Swagger UI、Response DTO 强类型化、Security Scheme、前端类型生成），本 change 落地实现这些 Requirement。

## Goals / Non-Goals

**Goals:**

- 后端引入 springdoc-openapi，自动暴露 `/v3/api-docs` JSON schema 和 `/swagger-ui.html`
- 后端声明 OpenAPI 元数据（title / version / description）和 Bearer JWT Security Scheme
- 前端引入 openapi-typescript，提供 `npm run generate:api` 脚本从 schema 生成 `lib/api/schema.d.ts`
- 确保 Swagger UI 和 api-docs 路径不被认证拦截（当前无 Spring Security，但预留路径放通配置）

**Non-Goals:**

- 不引入 Spring Security（当前无认证框架，Security Scheme 仅作为 schema 声明）
- 不修改现有 Controller / Response DTO 代码（HelloController 不需要改动即可被 springdoc 自动扫描）
- 不实现 API 版本管理（`/api/v1/`）
- 不生成客户端 SDK（仅生成 TypeScript 类型定义）
- 不做 CI 集成（类型生成脚本仅供本地开发使用）

## Decisions

### D1：springdoc-openapi 版本 = 2.x（非 3.x）

**选择**：`springdoc-openapi-starter-webmvc-ui:2.8.x`

**理由**：
- springdoc-openapi 3.x 要求 Spring Boot 3.4+，当前项目锁定 3.3.5
- 2.x 系列完全兼容 Spring Boot 3.3，生成 OpenAPI 3.1 规范
- 2.8.x 是 2.x 系列最新稳定版

**替代方案**：
- 3.x → 不兼容 Spring Boot 3.3.5
- springfox → 已停止维护，不支持 Spring Boot 3

### D2：OpenAPI 配置通过 `@Configuration` 类实现（非纯 yaml）

**选择**：创建 `config/OpenApiConfig.java`，用 `@Bean OpenAPI` 声明元数据和 Security Scheme

**理由**：
- Security Scheme（Bearer JWT）无法仅通过 yaml 完整声明
- Java Config 提供更好的类型安全和 IDE 支持
- yaml 仅配置 springdoc 路径行为（`springdoc.api-docs.path` 等），Java Config 负责 schema 内容

**替代方案**：
- 纯 yaml 配置 → 无法声明 Security Scheme
- 纯注解 `@OpenAPIDefinition` → 分散在启动类上，不够清晰

### D3：前端类型生成使用 `openapi-typescript` CLI（非手写脚本）

**选择**：`npx openapi-typescript http://localhost:8080/v3/api-docs -o lib/api/schema.d.ts`

**理由**：
- `openapi-typescript` 是社区标准工具（npm 周下载量 1M+）
- 单条命令，无需额外脚本封装
- 生成的 `.d.ts` 文件可直接被 TypeScript 消费

**替代方案**：
- openapi-generator → 生成完整客户端代码，过重（我们只需要类型）
- swagger-typescript-api → 功能重叠，社区活跃度低

### D4：生成的 `schema.d.ts` 提交到 git（非 `.gitignore`）

**选择**：生成文件纳入版本控制

**理由**：
- 保证 CI/CD 和团队成员无需先启动后端即可编译前端
- 类型文件作为"契约快照"，变更时可 code review
- 与 `openspec/specs/openapi-contract/spec.md` 的 Scenario 一致："生成的类型文件 SHALL 提交到 git"

## Risks / Trade-offs

- **[Risk] 后端未启动时 `generate:api` 失败** → Mitigation：在 npm script 中添加错误提示；文档说明需先启动后端
- **[Risk] springdoc 2.x 与未来升级 Spring Boot 3.4+ 时不兼容** → Mitigation：届时升级到 springdoc 3.x（API 基本兼容，改动量小）
- **[Trade-off] 不引入 Spring Security 意味着 Security Scheme 仅为声明性** → 可接受：schema 消费者（前端/第三方）能看到认证要求，实际校验由后续 `auth-backend-api` change 实现
- **[Trade-off] 生成的类型文件可能因后端 schema 变化而频繁变动** → 可接受：每次 API 变更时重新生成并 commit，review 时一目了然
