## ADDED Requirements

### Requirement: Maven 项目初始化
系统 SHALL 使用 Maven 单模块项目结构，parent 为 `spring-boot-starter-parent:3.3.5`，groupId 为 `com.mooc`，artifactId 为 `app`，Java 版本锁定 JDK 17。

#### Scenario: Maven 构建成功
- **WHEN** 在 `backend/` 目录执行 `mvn clean compile`
- **THEN** 编译通过，无错误，无警告（WARNING 可接受）

#### Scenario: Spring Boot 服务可启动
- **WHEN** 执行 `mvn -f backend/pom.xml spring-boot:run`
- **THEN** 服务在 8080 端口启动，日志输出 `Started AppApplication`

### Requirement: 分层包结构
系统 SHALL 在 `com.mooc.app` 包下提供 `controller`、`service`、`repository`、`entity`、`dto.response`、`exception`、`filter`、`config` 分层目录。

#### Scenario: 各层目录存在且可编译
- **WHEN** 在任意层添加一个空类（如 `controller/UserController`）
- **THEN** `mvn compile` 通过，IDE 可正确解析跨层 import

### Requirement: BaseEntity 公共基类
系统 SHALL 提供 `@MappedSuperclass` 标注的 `BaseEntity` 抽象类，包含 UUID 主键（`@GeneratedValue(strategy = GenerationType.UUID)`）、`createdAt`（`Instant`，`updatable = false`）、`updatedAt`（`Instant`）、`deleted`（`boolean`，默认 `false`）字段，以及 `@PrePersist` / `@PreUpdate` 生命周期回调。

#### Scenario: 子类实体自动获得公共字段
- **WHEN** 创建一个继承 BaseEntity 的实体类并 persist
- **THEN** id 自动生成 UUID，createdAt 和 updatedAt 自动设置为当前时间，deleted 默认 false

#### Scenario: updatedAt 在更新时自动刷新
- **WHEN** 对一个已持久化的实体执行 update 操作
- **THEN** updatedAt 自动更新为当前时间，createdAt 不变

#### Scenario: 逻辑删除通过 markDeleted 方法
- **WHEN** 调用实体的 `markDeleted()` 方法
- **THEN** deleted 字段变为 true，且无法通过 setter 直接修改

### Requirement: 统一异常处理
系统 SHALL 提供 `AppException`（继承 `RuntimeException`），持有 `HttpStatus`、`errorCode`（snake_case）、`message` 三个字段。系统 SHALL 提供 `GlobalExceptionHandler`（`@RestControllerAdvice`），统一将异常转换为 `ErrorResponse`。

#### Scenario: 业务异常返回正确错误码
- **WHEN** Controller 抛出 `new AppException(HttpStatus.NOT_FOUND, "not_found", "User not found")`
- **THEN** HTTP 响应状态码为 404，body 包含 `{"request_id": "...", "error_code": "not_found", "message": "User not found"}`

#### Scenario: 参数校验异常自动转换
- **WHEN** Controller 方法的 `@Valid` 参数校验失败
- **THEN** HTTP 响应状态码为 422，body 包含 `error_code: "validation_error"` 和 `details` 字段级错误

#### Scenario: 未知异常兜底
- **WHEN** Controller 抛出非 AppException 的 RuntimeException
- **THEN** HTTP 响应状态码为 500，body 包含 `error_code: "internal_error"`

### Requirement: 请求追踪 RequestIdFilter
系统 SHALL 提供 `RequestIdFilter`（`jakarta.servlet.Filter`），为每个 HTTP 请求生成唯一 UUID 作为 request_id，写入 request attribute 和 SLF4J MDC。

#### Scenario: 每个请求获得唯一 request_id
- **WHEN** 发送一个 HTTP 请求到任意端点
- **THEN** request attribute `request_id` 包含一个有效 UUID，响应日志 MDC 包含 `request_id`

#### Scenario: request_id 在响应清理后释放
- **WHEN** 请求处理完成（无论成功或失败）
- **THEN** MDC 中的 `request_id` 被移除，不存在泄漏

### Requirement: 响应 DTO 体系
系统 SHALL 提供 `BaseResponse` 抽象类（含 `request_id` 字段，`@JsonProperty("request_id")`）和 `ErrorResponse` 子类（含 `error_code`、`message`、可选 `details`）。所有字段 immutable（`private final`）。

#### Scenario: ErrorResponse 序列化格式正确
- **WHEN** 构造一个 ErrorResponse 并序列化为 JSON
- **THEN** JSON 包含 `request_id`、`error_code`、`message` 字段，字段名均为 snake_case

### Requirement: H2 内存数据库配置
系统 SHALL 配置 H2 内存数据库（`jdbc:h2:mem:wanderchina;DB_CLOSE_DELAY=-1`），JPA DDL 策略为 `create-drop`，`open-in-view` 为 false。

#### Scenario: 应用启动时 H2 可用
- **WHEN** Spring Boot 启动完成
- **THEN** JPA EntityManagerFactory 初始化成功，H2 console 可通过 `/h2-console` 访问

#### Scenario: 应用重启时数据库重建
- **WHEN** 应用重启
- **THEN** 所有表被重新创建（create-drop 策略），之前的数据不保留

### Requirement: Hello 验证端点
系统 SHALL 提供 `GET /api/hello` 端点，返回纯文本 `"hello"`，HTTP 状态码 200。

#### Scenario: Hello 端点正常响应
- **WHEN** 发送 `GET /api/hello` 请求
- **THEN** 响应状态码 200，响应体为 `"hello"`

#### Scenario: Hello 端点有切片测试覆盖
- **WHEN** 运行 `@WebMvcTest(HelloController.class)` 测试
- **THEN** 测试通过，验证 GET /api/hello 返回 "hello"
