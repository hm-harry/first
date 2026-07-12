## Context

`backend/` 和 `frontend/` 目录当前均为空。项目已归档了 `springboot-skeleton`（2026-05-28）和 `migrate-frontend-to-nextjs`（2026-05-30）等 change，但从未落地代码。

项目已有完整的编码规约体系：
- `backend-conventions.md`：分层架构、Controller/Service/Repository 职责、异常处理、响应 DTO
- `database-conventions.md`：BaseEntity 基类、UUID 主键、Instant 时间、H2 开发库
- `frontend-conventions.md`：目录结构、Region-Slot 模式、组件原则、状态管理、API 封装层
- `api-conventions.md`：URL 结构、成功/错误响应格式、分页、snake_case 序列化
- `styling-conventions.md`：Tailwind 4 + shadcn/ui、字体体系、色彩 token、响应式设计

本设计在这些约定基础上，定义前后端框架的具体实现方案。

## Goals / Non-Goals

**Goals:**

- 后端：可立即启动的 Spring Boot 服务（`mvn spring-boot:run` → localhost:8080）
- 后端：完整的分层架构骨架，后续业务模块可直接在各层添加代码
- 后端：统一的异常处理 + 请求追踪 + 响应格式 + BaseEntity + H2 数据库
- 前端：可立即启动的 Next.js 开发服务器（`npm run dev` → localhost:3000）
- 前端：完整的样式体系（Tailwind 4 + shadcn/ui + 字体 + CSS 变量）
- 前端：API 客户端 + BFF 层 + 状态管理 + 测试基础设施
- 前后端联通：前端 Hello 页面 fetch 后端 `/api/hello` 并渲染

**Non-Goals:**

- 不实现任何业务模块（auth / posts / homepage 等由各自 change 负责）
- 不引入 Lombok、MapStruct 等后端额外工具
- 不搭建多模块 Maven 结构（YAGNI）
- 不配置 Docker / CI / 生产部署
- 不引入 Flyway / Liquibase 数据库迁移
- 不实现前端 Region-Slot 首页组件（由 homepage change 负责）
- 不实现路由守卫 middleware（由 auth change 负责）

## 后端设计决策

### D1: Spring Boot 版本锁定 3.3.5

| 选项 | 选择 | 理由 |
|------|------|------|
| 3.3.x（LTS 维护线） | **选** | 项目 `project.md` 已锁定；生态最稳，与 JDK 17 兼容 |
| 3.4.x（新特性线） | 不选 | Virtual Threads 等新特性当前无需，增加不确定性 |

通过 `spring-boot-starter-parent:3.3.5` 管理 BOM，不在子依赖上手动 pin 版本。

### D2: Maven 单模块 + 包级分层

```
backend/
├── pom.xml
└── src/
    ├── main/java/com/mooc/app/
    │   ├── AppApplication.java
    │   ├── config/              ← Spring 配置类
    │   ├── controller/          ← HTTP 层
    │   ├── service/             ← 业务逻辑
    │   ├── repository/          ← 数据访问（JPA interface）
    │   ├── entity/              ← JPA 实体（BaseEntity 在此）
    │   ├── dto/
    │   │   └── response/        ← BaseResponse, ErrorResponse
    │   ├── exception/           ← AppException, GlobalExceptionHandler
    │   └── filter/              ← RequestIdFilter
    ├── main/resources/
    │   └── application.yml
    └── test/java/com/mooc/app/
        └── controller/
            └── HelloControllerTest.java
```

### D3: 后端依赖选型

| 依赖 | 用途 | 说明 |
|------|------|------|
| `spring-boot-starter-web` | HTTP 服务 + Jackson | 内嵌 Tomcat |
| `spring-boot-starter-data-jpa` | JPA + Hibernate | BaseEntity 需要 |
| `spring-boot-starter-validation` | Jakarta Validation | Request DTO 校验 |
| `spring-boot-starter-test` | JUnit 5 + Mockito + AssertJ | 测试框架 |
| `com.h2database:h2` | 开发内存库 | runtime scope |

### D4: BaseEntity 实现方案

按 `database-conventions.md` 规范：`@MappedSuperclass`，UUID 主键 + Instant 时间 + deleted 布尔 + @PrePersist/@PreUpdate 生命周期回调。

### D5: 异常处理体系

`AppException(HttpStatus, errorCode, message)` → `GlobalExceptionHandler(@RestControllerAdvice)` → `ErrorResponse`。

### D6: 响应 DTO 体系

`BaseResponse`(abstract, request_id) → `ErrorResponse`(error_code, message, details)。所有字段 immutable。

### D7: RequestIdFilter

`@Order(1)` Filter，生成 UUID → request attribute + MDC，finally 清理。

### D8: application.yml 配置

H2 内存库（`jdbc:h2:mem:wanderchina;DB_CLOSE_DELAY=-1`），JPA `create-drop`，`open-in-view: false`，端口 8080。

## 前端设计决策

### D9: Next.js 16 项目初始化

使用 `create-next-app` 脚手架（`--typescript --app --tailwind --eslint --src-dir=false --import-alias=@/*`），锁定版本：

| 依赖 | 版本 | 说明 |
|------|------|------|
| next | 16.x | App Router |
| react | 19.x | 最新稳定 |
| typescript | 5.x | 强类型 |

项目直接初始化在 `frontend/` 目录。

### D10: 样式体系

```
Tailwind CSS 4（@import 'tailwindcss'）
    + shadcn/ui（npx shadcn@latest init → base-nova / neutral）
    + lucide-react（图标统一来源）
    + tailwindcss-animate + tw-animate-css（动画插件）
```

CSS 变量注入（`:root` / `.dark`），不自定义色值，依赖 Design Tokens。

### D11: 字体配置

```typescript
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' })
```

h1–h6 自动应用 heading 字体（通过 CSS 变量）。

### D12: 前端目录结构

```
frontend/
├── app/
│   ├── layout.tsx            ← 根布局（字体 + 全局样式）
│   ├── page.tsx              ← Hello 页面（验证前后端联通）
│   └── globals.css           ← Tailwind 入口 + CSS 变量
├── components/
│   └── ui/                   ← shadcn/ui 组件（不手动修改）
├── lib/
│   ├── api/
│   │   ├── client.ts         ← ApiResponse<T> + ApiError 类型
│   │   └── schema.d.ts       ← openapi-typescript 生成（后续）
│   ├── stores/               ← Zustand stores
│   ├── backend.ts            ← import 'server-only' BFF 层
│   └── utils.ts              ← cn() 等纯工具函数
├── public/                   ← 静态资源
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
└── package.json
```

### D13: API 客户端

```typescript
// lib/api/client.ts
export type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: ApiError }

export type ApiError = {
  request_id: string
  error_code: string
  message: string
  details?: Record<string, string>
}
```

每个 API 函数处理 network error / server error 兜底。仅 `"use client"` 文件中直接调用。

### D14: BFF 层

```typescript
// lib/backend.ts
import 'server-only'

export async function fetchFromBackend(path: string) {
  const res = await fetch(`${process.env.BACKEND_URL}${path}`)
  // ...
}
```

Server Component 通过 `fetchFromBackend` 调后端，无 CORS 问题。Client Component 用 `lib/api/client.ts`。

### D15: 状态管理

Zustand `create<T>()` 模式，一个领域一个 store 文件。本框架阶段仅引入依赖，不创建具体 store。

### D16: 测试基础设施

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
  },
})
```

依赖：vitest + @testing-library/react + happy-dom + @testing-library/jest-dom。

### D17: 前后端联通验证

```
浏览器 ──GET /──────▶ Next.js :3000 (Server Component)
                         │
                         │  fetchFromBackend('/api/hello')
                         ▼
                    Spring Boot :8080 ──▶ HelloController
                                              │
                                              ▼
                                        "hello" (text/plain)
浏览器 ◀────────────── 渲染 hello ◀─────
```

## 系统架构总览

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (3000)                       │
│  Next.js 16 + React 19 + TypeScript                     │
│  ┌──────────┐  ┌───────────┐  ┌────────────────────┐   │
│  │  Server  │  │  Client   │  │   lib/             │   │
│  │Component │  │ Component │  │  api/client.ts     │   │
│  │ (SSR)    │  │ (browser) │  │  backend.ts (BFF)  │   │
│  │          │  │           │  │  stores/ (Zustand)  │   │
│  └────┬─────┘  └─────┬─────┘  └────────┬───────────┘   │
│       │               │                 │                │
└───────┼───────────────┼─────────────────┼────────────────┘
        │               │                 │
        ▼               ▼                 ▼
  fetchFromBackend   fetch(api/...)    HTTP
        │               │                 │
        └───────────────┴─────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────────┐
│                   Backend (8080)                           │
│  Spring Boot 3.3.5 + JDK 17                               │
│  ┌────────────┐  ┌──────────┐  ┌────────────┐            │
│  │ Controller │→ │ Service  │→ │ Repository │            │
│  └─────┬──────┘  └──────────┘  └─────┬──────┘            │
│        │                              │                    │
│  ┌─────┴──────┐  ┌──────────────┐   ┌┴──────────┐        │
│  │  Filter    │  │  Exception   │   │  Entity   │        │
│  │(RequestId) │  │  Handler     │   │(BaseEntity)│       │
│  └────────────┘  └──────────────┘   └───────────┘        │
│                                        │                   │
│                                  ┌─────┴─────┐            │
│                                  │  H2 DB    │            │
│                                  └───────────┘            │
└───────────────────────────────────────────────────────────┘
```

## Risks / Trade-offs

- **Spring Boot 3.3.5 小版本安全补丁延迟** → 后续单独 change 升级
- **H2 与 PostgreSQL 行为差异** → 当前只用基础 JPA 特性
- **open-in-view=false 导致 LazyInit 异常** → Service 层用 JOIN FETCH 或 DTO projection
- **Next.js 16 兼容性** → create-next-app 官方脚手架保证基线兼容
- **shadcn/ui 版本锁定** → init 时锁定版本，避免自动升级
- **Tailwind 4 配置变化** → Tailwind 4 使用 CSS-first 配置，不再依赖 tailwind.config.ts 主题扩展
## Context

`backend/` 目录当前为空。项目已归档了 `springboot-skeleton` change（2026-05-28），设计了极简骨架（pom.xml + AppApplication + HelloController），但从未落地代码。

项目已有完整的编码规约体系：
- `backend-conventions.md`：分层架构、Controller/Service/Repository 职责、异常处理、响应 DTO
- `database-conventions.md`：BaseEntity 基类、UUID 主键、Instant 时间、H2 开发库
- `api-conventions.md`：URL 结构、成功/错误响应格式、分页、snake_case 序列化

本设计在这些约定基础上，定义后端框架的具体实现方案。

## Goals / Non-Goals

**Goals:**

- 可立即启动的 Spring Boot 服务（`mvn spring-boot:run` → localhost:8080）
- 完整的分层架构骨架，后续业务模块可直接在各层添加代码
- 统一的异常处理 + 请求追踪 + 响应格式，符合 `api-conventions.md`
- BaseEntity 公共基类，符合 `database-conventions.md`
- H2 内存数据库可用，JPA 配置就绪
- 切片测试可跑通（`@WebMvcTest`）

**Non-Goals:**

- 不实现任何业务模块（auth / posts / cities 等由各自 change 负责）
- 不引入 Lombok、MapStruct、QueryDSL 等额外工具
- 不搭建多模块 Maven 结构（YAGNI）
- 不配置 Docker / CI / 生产部署
- 不引入 Flyway / Liquibase 数据库迁移（当前用 `create-drop`）

## Decisions

### D1: Spring Boot 版本锁定 3.3.5

| 选项 | 选择 | 理由 |
|------|------|------|
| 3.3.x（LTS 维护线） | **选** | 项目 `project.md` 已锁定；生态最稳，与 JDK 17 兼容 |
| 3.4.x（新特性线） | 不选 | Virtual Threads 等新特性当前无需，增加不确定性 |

通过 `spring-boot-starter-parent:3.3.5` 管理 BOM，不在子依赖上手动 pin 版本。

### D2: Maven 单模块 + 包级分层

```
backend/
├── pom.xml
└── src/
    ├── main/java/com/mooc/app/
    │   ├── AppApplication.java
    │   ├── config/              ← Spring 配置类
    │   ├── controller/          ← HTTP 层
    │   ├── service/             ← 业务逻辑
    │   ├── repository/          ← 数据访问（JPA interface）
    │   ├── entity/              ← JPA 实体（BaseEntity 在此）
    │   ├── dto/
    │   │   └── response/        ← BaseResponse, ErrorResponse
    │   ├── exception/           ← AppException, GlobalExceptionHandler
    │   └── filter/              ← RequestIdFilter
    ├── main/resources/
    │   └── application.yml
    └── test/java/com/mooc/app/
        └── controller/
            └── HelloControllerTest.java
```

不分多模块 Maven project。理由：YAGNI——当前没有业务边界需要物理隔离。

### D3: 依赖选型

| 依赖 | 用途 | 说明 |
|------|------|------|
| `spring-boot-starter-web` | HTTP 服务 + Jackson | 内嵌 Tomcat |
| `spring-boot-starter-data-jpa` | JPA + Hibernate | BaseEntity 需要 |
| `spring-boot-starter-validation` | Jakarta Validation | Request DTO 校验 |
| `spring-boot-starter-test` | JUnit 5 + Mockito + AssertJ | 测试框架 |
| `com.h2database:h2` | 开发内存库 | runtime scope |

### D4: BaseEntity 实现方案

按 `database-conventions.md` 规范：

```
@MappedSuperclass
public abstract class BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean deleted = false;

    // @PrePersist → set createdAt + updatedAt
    // @PreUpdate  → set updatedAt
    // getId()/setId(): public
    // isDeleted()/markDeleted(): 不暴露 setDeleted
}
```

### D5: 异常处理体系

```
AppException (extends RuntimeException)
├── HttpStatus status
├── String errorCode     // snake_case，如 "not_found"
└── String message

GlobalExceptionHandler (@RestControllerAdvice)
├── handleAppException(AppException) → ErrorResponse
├── handleValidation(MethodArgumentNotValidException) → ErrorResponse + details
├── handleMissingParam(MissingServletRequestParameterException) → ErrorResponse
└── handleUnknown(Exception) → 500 ErrorResponse
```

Controller 层只 throw AppException，不手动构造 response。

### D6: 响应 DTO 体系

```java
public abstract class BaseResponse {
    @JsonProperty("request_id")
    private final String requestId;
    // constructor takes requestId
}

public class ErrorResponse extends BaseResponse {
    @JsonProperty("error_code")
    private final String errorCode;
    private final String message;
    private final Map<String, String> details;  // nullable
}
```

所有字段 `private final` + 构造器赋值（immutable）。

### D7: RequestIdFilter

```
@Order(1)
public class RequestIdFilter implements Filter {
    // 从 request attribute "request_id" 取，没有则生成 UUID
    // 写入 request.setAttribute("request_id", uuid)
    // 写入 MDC.put("request_id", uuid)
    // finally { MDC.remove("request_id") }
}
```

### D8: application.yml 配置

```yaml
spring:
  application:
    name: wanderchina-backend
  datasource:
    url: jdbc:h2:mem:wanderchina;DB_CLOSE_DELAY=-1
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: false
    open-in-view: false
  h2:
    console:
      enabled: true
server:
  port: 8080
```

### D9: HelloController 验证端点

```
@RestController
public class HelloController {
    @GetMapping("/api/hello")
    public String hello() { return "hello"; }
}
```

最小端点，用于验证服务可启动 + 请求可到达。

## Risks / Trade-offs

- **Spring Boot 3.3.5 小版本安全补丁延迟** → 缓解：后续单独 change 升级版本，不影响架构
- **H2 与 PostgreSQL 行为差异**（如 JSON 列、序列） → 缓解：当前只用基础 JPA 特性，不涉及方言特有功能
- **open-in-view=false 导致 LazyInit 异常** → 缓解：Service 层用 `JOIN FETCH` 或 DTO projection，不依赖 OSIV
- **Filter 顺序冲突** → 缓解：RequestIdFilter 用 `@Order(1)` 确保最先执行，后续 Filter 显式声明更大 order
