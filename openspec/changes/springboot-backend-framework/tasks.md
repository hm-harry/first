## 1. 后端 Maven 项目骨架

- [ ] 1.1 创建 `backend/pom.xml`（parent: spring-boot-starter-parent:3.3.5，groupId: com.mooc，artifactId: app，JDK 17）
- [ ] 1.2 添加依赖：spring-boot-starter-web、spring-boot-starter-data-jpa、spring-boot-starter-validation、spring-boot-starter-test、h2（runtime）
- [ ] 1.3 创建 `src/main/resources/application.yml`（H2 内存库 + JPA create-drop + open-in-view: false + 端口 8080）
- [ ] 1.4 创建 `AppApplication.java`（`@SpringBootApplication` 启动类）
- [ ] 1.5 验证：`mvn -f backend/pom.xml clean compile` 编译通过

## 2. 后端 Hello 端点 + 切片测试（TDD）

- [ ] 2.1 先写失败测试：`HelloControllerTest`（`@WebMvcTest`，断言 GET /api/hello 返回 200 + "hello"）
- [ ] 2.2 确认测试 RED
- [ ] 2.3 实现 `HelloController`（`@RestController`，`@GetMapping("/api/hello")` 返回 "hello"）
- [ ] 2.4 确认测试 GREEN
- [ ] 2.5 验证：`mvn -f backend/pom.xml spring-boot:run` 可启动，curl GET /api/hello 返回 "hello"

## 3. 后端 BaseEntity 公共基类

- [ ] 3.1 先写失败测试：`BaseEntityTest`（验证 @PrePersist 设置 createdAt/updatedAt、@PreUpdate 刷新 updatedAt、markDeleted 行为）
- [ ] 3.2 确认测试 RED
- [ ] 3.3 实现 `entity/BaseEntity.java`（@MappedSuperclass，UUID id，Instant createdAt/updatedAt，boolean deleted，@PrePersist/@PreUpdate 回调）
- [ ] 3.4 创建测试用实体 `entity/TestEntity.java`（仅测试目录，继承 BaseEntity + @Entity）
- [ ] 3.5 确认测试 GREEN

## 4. 后端响应 DTO 体系

- [ ] 4.1 实现 `dto/response/BaseResponse.java`（abstract，@JsonProperty("request_id") requestId 字段，private final + 构造器）
- [ ] 4.2 实现 `dto/response/ErrorResponse.java`（extends BaseResponse，errorCode + message + details 字段，@JsonProperty snake_case）
- [ ] 4.3 写测试：`ErrorResponseTest`（JSON 序列化验证字段名为 snake_case，所有字段有值）

## 5. 后端异常处理体系

- [ ] 5.1 先写失败测试：`GlobalExceptionHandlerTest`（验证 AppException → 正确状态码 + ErrorResponse；MethodArgumentNotValidException → 422 + details；未知异常 → 500 + internal_error）
- [ ] 5.2 确认测试 RED
- [ ] 5.3 实现 `exception/AppException.java`（extends RuntimeException，持有 HttpStatus + errorCode + message）
- [ ] 5.4 实现 `exception/GlobalExceptionHandler.java`（@RestControllerAdvice，处理 AppException / MethodArgumentNotValidException / Exception）
- [ ] 5.5 确认测试 GREEN

## 6. 后端 RequestIdFilter 请求追踪

- [ ] 6.1 先写失败测试：`RequestIdFilterTest`（验证每个请求生成 UUID request_id；MDC 包含 request_id；请求结束后 MDC 清理）
- [ ] 6.2 确认测试 RED
- [ ] 6.3 实现 `filter/RequestIdFilter.java`（@Order(1)，生成 UUID → request attribute + MDC，finally 清理 MDC）
- [ ] 6.4 实现 `config/FilterConfig.java`（将 RequestIdFilter 注册为 @Bean FilterRegistrationBean）
- [ ] 6.5 确认测试 GREEN

## 7. 前端 Next.js 项目初始化

- [ ] 7.1 使用 `create-next-app` 在 `frontend/` 目录初始化（TypeScript + App Router + Tailwind + ESLint）
- [ ] 7.2 验证：`cd frontend && npm run dev` 启动成功，浏览器可访问 localhost:3000
- [ ] 7.3 验证：`npm run build` 构建成功

## 8. 前端样式体系 + shadcn/ui

- [ ] 8.1 初始化 shadcn/ui（`npx shadcn@latest init`，选择 base-nova / neutral 主题）
- [ ] 8.2 安装 lucide-react（`npm install lucide-react`）
- [ ] 8.3 安装 tailwindcss-animate + tw-animate-css（动画插件）
- [ ] 8.4 在 `app/globals.css` 中添加品牌色变量（`--color-brand: #1d4ed8`）和间距 token
- [ ] 8.5 验证：页面中使用 shadcn `<Button>` 组件可正确渲染

## 9. 前端字体配置

- [ ] 9.1 在 `app/layout.tsx` 中配置 Inter（`--font-sans`）和 Plus Jakarta Sans（`--font-heading`）字体
- [ ] 9.2 在 globals.css 中配置 `font-sans` / `font-heading` 映射
- [ ] 9.3 验证：页面标题使用 heading 字体，正文使用 sans 字体

## 10. 前端目录结构 + 基础设施

- [ ] 10.1 创建目录：`app/regions/`、`lib/api/`、`lib/stores/`
- [ ] 10.2 创建 `lib/utils.ts`（cn 工具函数，shadcn 可能已生成）
- [ ] 10.3 安装 zustand（`npm install zustand`）
- [ ] 10.4 安装 server-only（`npm install server-only`）

## 11. 前端 API 客户端 + BFF 层

- [ ] 11.1 实现 `lib/api/client.ts`（`ApiResponse<T>` 泛型 + `ApiError` 类型）
- [ ] 11.2 实现 `lib/backend.ts`（`import 'server-only'`，`fetchFromBackend(path)` 函数，读 `BACKEND_URL`）
- [ ] 11.3 创建 `.env.local`（`BACKEND_URL=http://localhost:8080`）

## 12. 前端 Hello 页面（前后端联通验证）

- [ ] 12.1 实现 `app/page.tsx`（Server Component，调用 `fetchFromBackend('/api/hello')` 渲染 "hello"）
- [ ] 12.2 实现后端不可用时的降级显示（"Backend unavailable" 提示，不白屏）
- [ ] 12.3 验证：同时启动前后端，浏览器访问 localhost:3000 看到 "hello"

## 13. 前端测试基础设施

- [ ] 13.1 安装测试依赖：vitest、@testing-library/react、happy-dom、@testing-library/jest-dom、@vitejs/plugin-react
- [ ] 13.2 创建 `vitest.config.ts`（environment: happy-dom，globals: true，resolve alias @/）
- [ ] 13.3 在 `package.json` 添加 `"test": "vitest"` script
- [ ] 13.4 写一个 smoke test（渲染 Hello 组件），确认 `npm test` 通过

## 14. 端到端全栈验证

- [ ] 14.1 启动后端，验证 `mvn -f backend/pom.xml test` 全部 GREEN
- [ ] 14.2 启动前端，验证 `npm test` 全部 GREEN
- [ ] 14.3 同时启动前后端，验证首页渲染后端返回的 "hello"
- [ ] 14.4 验证前端请求 404 路径时，后端返回 ErrorResponse 格式
