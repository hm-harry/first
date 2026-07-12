## Why

`backend/` 和 `frontend/` 目录当前均为空，项目所有 spec（auth、posts、cities、spots、homepage 等 37 个 capability）均无法落地。需要搭建完整可用的前后端开发框架作为所有业务模块的基础底座：
- **后端**：Spring Boot + Maven 项目骨架、分层架构、统一异常处理、请求追踪、数据库配置、API 响应规范
- **前端**：Next.js 16 + React 19 + TypeScript + Tailwind 4 + shadcn/ui 项目骨架、目录结构、样式体系、API 客户端、测试基础设施

## What Changes

### 后端

- 初始化 Maven 单模块项目（`backend/pom.xml`），锁定 Spring Boot 3.3.5 + JDK 17
- 创建 `AppApplication` 启动类（`com.mooc.app` 包）
- 搭建分层架构骨架：`controller/` → `service/` → `repository/` → `entity/` → `dto/` → `exception/` → `filter/` → `config/`
- 实现 `BaseEntity` 公共基类（UUID 主键 + createdAt/updatedAt + 逻辑删除）
- 实现 `GlobalExceptionHandler` + 自定义异常基类 `AppException`
- 实现 `RequestIdFilter`（每请求生成 UUID，写入 MDC + request attribute）
- 实现 `BaseResponse` / `ErrorResponse` 响应 DTO 体系
- 配置 H2 内存数据库 + JPA（`create-drop` DDL 策略）
- 实现 `GET /api/hello` 端点作为健康验证
- 编写切片测试（`@WebMvcTest`）覆盖 Controller 层

### 前端

- 使用 `create-next-app` 初始化 Next.js 16 项目（App Router + TypeScript）
- 配置 Tailwind CSS 4 + shadcn/ui（base-nova / neutral 主题）+ lucide-react 图标库
- 加载 Inter + Plus Jakarta Sans 字体（`next/font/google`）
- 搭建目录结构：`app/regions/`、`components/ui/`、`lib/api/`、`lib/stores/`、`lib/utils.ts`
- 实现 `ApiResponse<T>` 泛型 API 客户端 + `ApiError` 错误类型
- 配置 Zustand 状态管理基础（`create<T>()` 模式）
- 配置 Vitest + React Testing Library + happy-dom 测试环境
- 实现 Hello 页面，fetch 后端 `GET /api/hello` 验证前后端联通
- 实现 `lib/backend.ts`（`import 'server-only'`）薄 BFF 层

## Capabilities

### New Capabilities

- `springboot-backend-framework`: Spring Boot 后端开发框架底座，包含 Maven 构建、分层架构、公共基础设施（BaseEntity、异常处理、请求追踪、响应 DTO、数据库配置）
- `nextjs-frontend-framework`: Next.js 前端开发框架底座，包含项目初始化、样式体系（Tailwind 4 + shadcn/ui）、字体配置、目录结构、API 客户端、测试环境、BFF 层

### Modified Capabilities

<!-- 无——这是纯基础设施变更，不修改已有 spec 的需求级行为 -->

## Impact

- **代码**：`backend/` 和 `frontend/` 目录下所有文件从零创建，不影响父仓
- **后端依赖**：spring-boot-starter-web、spring-boot-starter-data-jpa、spring-boot-starter-validation、spring-boot-starter-test、h2
- **前端依赖**：next@16、react@19、typescript@5、tailwindcss@4、@radix-ui/*、lucide-react、zustand、vitest、@testing-library/react、happy-dom
- **API**：后端暴露 `GET /api/hello`；前端通过 BFF 层 fetch 并渲染
- **开发体验**：
  - 后端：`mvn -f backend/pom.xml spring-boot:run`（localhost:8080）
  - 前端：`cd frontend && npm run dev`（localhost:3000）
  - 测试：后端 `mvn test` / 前端 `npm test`
