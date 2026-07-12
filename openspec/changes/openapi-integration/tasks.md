## 1. 后端 — springdoc-openapi 依赖与配置

- [x] 1.1 在 `backend/pom.xml` 的 `<dependencies>` 中添加 `springdoc-openapi-starter-webmvc-ui:2.6.0` 依赖（原计划 2.8.6，因与 SB 3.3.5 不兼容降级）
- [x] 1.2 在 `backend/src/main/resources/application.yml` 中添加 springdoc 配置块：`springdoc.api-docs.path: /v3/api-docs`、`springdoc.swagger-ui.path: /swagger-ui.html`
- [x] 1.3 创建 `backend/src/main/java/com/mooc/app/config/OpenApiConfig.java`：`@Configuration` 类，声明 `@Bean OpenAPI`（title=`WanderChina API`、version=`1.0.0`、description、Bearer JWT Security Scheme）
- [x] 1.4 运行 `mvn -f backend/pom.xml compile` 验证编译通过

## 2. 后端 — TDD 验证 OpenAPI 端点

- [x] 2.1 创建 `backend/src/test/java/com/mooc/app/config/OpenApiConfigTest.java`（`@SpringBootTest + @AutoConfigureMockMvc`）：断言 `GET /v3/api-docs` 返回 200 + `openapi` 字段存在
- [x] 2.2 运行 `mvn -f backend/pom.xml test` 验证测试 GREEN（3/3 通过）
- [x] 2.3 追加测试用例：断言 schema 包含 `info.title = "WanderChina API"` 和 `components.securitySchemes.bearerAuth`
- [x] 2.4 运行 `mvn -f backend/pom.xml test` 验证全绿（17/17 通过）

## 3. 后端 — 手动验证 Swagger UI

- [x] 3.1 启动后端 `mvn -f backend/pom.xml spring-boot:run`
- [x] 3.2 浏览器或 curl 验证 `http://localhost:8080/v3/api-docs` 返回 JSON schema
- [x] 3.3 验证 `http://localhost:8080/swagger-ui.html` 可访问 Swagger UI（HTTP 200）
- [x] 3.4 停止后端服务

## 4. 前端 — openapi-typescript 依赖与脚本

- [x] 4.1 在 `frontend/` 目录执行 `npm install --save-dev openapi-typescript`
- [x] 4.2 在 `frontend/package.json` 的 `scripts` 中添加 `"generate:api": "openapi-typescript http://localhost:8080/v3/api-docs -o lib/api/schema.d.ts"`
- [x] 4.3 确认 `frontend/package.json` 的 devDependencies 包含 `openapi-typescript`

## 5. 前端 — 类型生成验证

- [x] 5.1 启动后端服务（`mvn -f backend/pom.xml spring-boot:run`）
- [x] 5.2 在 `frontend/` 目录执行 `npm run generate:api`，验证生成 `lib/api/schema.d.ts`
- [x] 5.3 检查 `schema.d.ts` 内容包含 `paths` 和 `components` 类型定义
- [x] 5.4 运行 `cd frontend && npx tsc --noEmit` 验证类型文件编译通过（schema.d.ts 无错误；.next/types 为已有问题）
- [x] 5.5 停止后端服务

## 6. 前端 — 测试

- [x] 6.1 运行 `cd frontend && npm test` 确认现有测试全绿（2/2 通过）
- [x] 6.2 运行 `cd frontend && npm run build` 确认构建通过

## 7. 验证清单（端到端）

- [x] 7.1 `mvn -f backend/pom.xml test` 全绿（17/17）
- [x] 7.2 `cd frontend && npm test` 全绿（2/2）
- [x] 7.3 `cd frontend && npm run build` 通过，无 TS/ESLint 错误
- [x] 7.4 `lib/api/schema.d.ts` 文件存在且包含有效类型定义
- [x] 7.5 子仓分别提交：backend `feat(openapi): integrate springdoc-openapi-starter-webmvc-ui 2.6.0`、frontend `feat(openapi): add openapi-typescript generation pipeline`
- [x] 7.6 更新 AGENTS.md 锁定栈版本验证表：springdoc-openapi 和 openapi-typescript 状态改为 ✅ 已安装
