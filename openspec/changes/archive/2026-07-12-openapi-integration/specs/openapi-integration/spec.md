## ADDED Requirements

### Requirement: springdoc-openapi 依赖集成

后端 `pom.xml` SHALL 声明 `springdoc-openapi-starter-webmvc-ui` 依赖（2.x 系列，兼容 Spring Boot 3.3）。应用启动后 SHALL 自动暴露 OpenAPI 3.1 schema 和 Swagger UI，无需额外配置。

#### Scenario: 访问 OpenAPI JSON schema

- **WHEN** 客户端发送 `GET /v3/api-docs`
- **THEN** 返回 HTTP 200
- **AND** Content-Type 为 `application/json`
- **AND** 响应体包含 `openapi` 字段（值为 `3.1.x`）
- **AND** 响应体 `paths` 对象包含当前所有 Controller 端点

#### Scenario: 访问 Swagger UI

- **WHEN** 用户在浏览器访问 `http://localhost:8080/swagger-ui.html`
- **THEN** 返回 HTTP 200（或 302 重定向到 `/swagger-ui/index.html` 后 200）
- **AND** 页面展示当前所有 Controller 的端点列表

---

### Requirement: OpenAPI 元数据配置

后端 SHALL 通过 `OpenApiConfig` 配置类声明 API 元数据（title、description、version），使用 `@Bean OpenAPI` 方式注册。

#### Scenario: Schema 包含 API 元数据

- **WHEN** 客户端发送 `GET /v3/api-docs`
- **THEN** 响应体 `info.title` 为 `WanderChina API`
- **AND** 响应体 `info.description` 非空
- **AND** 响应体 `info.version` 为 `1.0.0`

---

### Requirement: Bearer JWT Security Scheme 声明

`OpenApiConfig` SHALL 声明 HTTP Bearer (JWT) 认证方案。后续需要认证的 Controller 可通过 `@SecurityRequirement` 注解引用。

#### Scenario: Schema 包含 Security Scheme

- **WHEN** 客户端发送 `GET /v3/api-docs`
- **THEN** 响应体 `components.securitySchemes` 包含 `bearerAuth` 定义
- **AND** `bearerAuth.type` 为 `http`
- **AND** `bearerAuth.scheme` 为 `bearer`
- **AND** `bearerAuth.bearerFormat` 为 `JWT`

---

### Requirement: springdoc 路径配置

`application.yml` SHALL 配置 springdoc 的 api-docs 和 swagger-ui 路径，确保文档端点可被正确访问。

#### Scenario: api-docs 路径可配置

- **WHEN** `application.yml` 中设置 `springdoc.api-docs.path: /v3/api-docs`
- **THEN** `GET /v3/api-docs` 返回 schema（非 404）

#### Scenario: swagger-ui 路径可配置

- **WHEN** `application.yml` 中设置 `springdoc.swagger-ui.path: /swagger-ui.html`
- **THEN** `GET /swagger-ui.html` 返回 Swagger UI 页面

---

### Requirement: 前端 openapi-typescript 类型生成

前端 `package.json` SHALL 在 devDependencies 中声明 `openapi-typescript`，并提供 `generate:api` npm script，从后端 OpenAPI schema 生成 TypeScript 类型文件 `lib/api/schema.d.ts`。

#### Scenario: 执行类型生成命令

- **GIVEN** 后端运行中（`http://localhost:8080/v3/api-docs` 可达）
- **WHEN** 开发者在 `frontend/` 目录执行 `npm run generate:api`
- **THEN** 生成文件 `lib/api/schema.d.ts`
- **AND** 文件包含 `paths` 类型（描述所有 API 路径的请求/响应类型）
- **AND** 文件包含 `components` 类型（描述所有 schema 定义）

#### Scenario: 后端未启动时生成失败

- **GIVEN** 后端未运行（`http://localhost:8080` 不可达）
- **WHEN** 开发者执行 `npm run generate:api`
- **THEN** 命令以非零退出码失败
- **AND** 输出包含连接错误提示信息

#### Scenario: 生成的类型文件可被 TypeScript 编译

- **GIVEN** `lib/api/schema.d.ts` 已生成
- **WHEN** 运行 `npx tsc --noEmit`
- **THEN** 编译通过，无类型错误
