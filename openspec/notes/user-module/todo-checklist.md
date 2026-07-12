# Todo 待办清单（Todo Checklist）PRD

> 路径：`openspec/notes/user-module/todo-checklist.md`
> 模块归属：用户模块（user-module）
> 实现位置：后端 `com.mooc.app` 包新增 todo 分层；前端 `app/todos/` 路由组

## 1. 模块边界

### 1.1 In Scope

- **待办项 CRUD**：已登录用户创建、查看、编辑、删除自己的待办项
- **状态切换**：标记完成 / 标记未完成（toggle）
- **待办列表**：分页查询当前用户的全部待办项，支持按状态、优先级、分类筛选
- **排序**：支持按创建时间、截止时间、优先级排序
- **分类管理**：用户自定义分类（如"旅行计划"、"工作"），每个待办可归属一个分类或无分类
- **优先级**：四级（none / low / medium / high）
- **截止时间**：可选，支持设置到期日
- **批量操作**：批量标记完成、批量删除

### 1.2 Out of Scope

- **协作与共享**：不支持多人共享待办、指派他人、评论、@提及
- **子任务**：不支持嵌套待办 / 子任务树
- **周期性待办**：不支持重复 / 周期性待办项
- **提醒与通知**：不发送到时提醒、站内通知、邮件通知
- **附件**：不支持上传文件或图片
- **标签系统**：仅用分类（category）做组织，不做自由标签
- **搜索**：不做全文搜索（列表已满足日常规模）
- **离线 / 同步**：不支持离线编辑和冲突合并
- **拖拽排序**：不做自定义顺序拖拽排列

---

## 2. 核心场景

### Scenario 1：创建待办项（正常路径）

- **GIVEN** 用户已登录，持有有效 JWT
- **WHEN** 用户提交 `POST /api/todos`，请求体包含 `title`（必填）、`description`（可选）、`priority`（可选，默认 `"none"`）、`categoryId`（可选）、`dueDate`（可选）
- **THEN** 系统创建待办项并持久化
- **AND** 返回 HTTP `201`，响应体包含 `requestId`、`id`（UUID）、`title`、`status: "active"`、`priority`、`createdAt`、`updatedAt`
- **AND** 若传了 `categoryId`，验证该分类属于当前用户，不属于则返回 `404`

### Scenario 2：创建待办项 — 标题为空（异常路径）

- **WHEN** 用户提交 `POST /api/todos`，`title` 为空或仅包含空白字符
- **THEN** 返回 HTTP `422`，`errorCode: "validation_error"`
- **AND** `details` 包含 `title: "Title must not be blank"`

### Scenario 3：创建待办项 — 标题超长（异常路径）

- **WHEN** 用户提交 `POST /api/todos`，`title` 长度 > 200 字符
- **THEN** 返回 HTTP `422`，`errorCode: "validation_error"`
- **AND** `details` 包含 `title: "Title must be at most 200 characters"`

### Scenario 4：创建待办项 — 无效优先级值（异常路径）

- **WHEN** 用户提交 `POST /api/todos`，`priority` 值为 `"urgent"`（不在枚举范围内）
- **THEN** 返回 HTTP `422`，`errorCode: "validation_error"`

### Scenario 5：创建待办项 — 分类不属于当前用户（异常路径）

- **GIVEN** 用户 A 已登录
- **WHEN** 用户 A 提交 `POST /api/todos`，`categoryId` 指向用户 B 的分类
- **THEN** 返回 HTTP `404`，`errorCode: "category_not_found"`

### Scenario 6：创建待办项 — 未登录（异常路径）

- **WHEN** 未携带 JWT 提交 `POST /api/todos`
- **THEN** 返回 HTTP `401`，`errorCode: "unauthorized"`

### Scenario 7：查看待办列表（正常路径）

- **GIVEN** 用户已登录，拥有 25 条待办项（20 条 active、5 条 completed）
- **WHEN** 用户提交 `GET /api/todos?page=1&size=20`
- **THEN** 返回 HTTP `200`，`items` 包含 20 条待办项
- **AND** 响应体包含 `requestId`、`items`、`total: 25`、`page: 1`、`size: 20`
- **AND** 默认按 `createdAt DESC` 排序

### Scenario 8：查看待办列表 — 按状态筛选

- **WHEN** 用户提交 `GET /api/todos?status=completed`
- **THEN** `items` 仅包含 `status = "completed"` 的待办项

### Scenario 9：查看待办列表 — 按优先级筛选

- **WHEN** 用户提交 `GET /api/todos?priority=high`
- **THEN** `items` 仅包含 `priority = "high"` 的待办项

### Scenario 10：查看待办列表 — 按分类筛选

- **WHEN** 用户提交 `GET /api/todos?categoryId={uuid}`
- **THEN** `items` 仅包含该分类下的待办项

### Scenario 11：查看待办列表 — 按截止时间排序

- **WHEN** 用户提交 `GET /api/todos?sort=dueDate`
- **THEN** `items` 按 `dueDate ASC` 排序，无截止时间的排最后

### Scenario 12：查看待办列表 — 无效排序字段（异常路径）

- **WHEN** 用户提交 `GET /api/todos?sort=unknown`
- **THEN** 返回 HTTP `400`，`errorCode: "validation_error"`

### Scenario 13：更新待办项（正常路径）

- **GIVEN** 用户有一条 `id = X` 的待办项
- **WHEN** 用户提交 `PATCH /api/todos/X`，请求体包含 `title: "新标题"`
- **THEN** 返回 HTTP `200`，待办项 `title` 已更新
- **AND** `updatedAt` 被刷新

### Scenario 14：更新待办项 — 不存在的 ID（异常路径）

- **WHEN** 用户提交 `PATCH /api/todos/{不存在的UUID}`
- **THEN** 返回 HTTP `404`，`errorCode: "todo_not_found"`

### Scenario 15：更新待办项 — 操作他人待办（异常路径）

- **GIVEN** 用户 A 已登录，待办 `id = X` 属于用户 B
- **WHEN** 用户 A 提交 `PATCH /api/todos/X`
- **THEN** 返回 HTTP `404`，`errorCode: "todo_not_found"`（不暴露他人资源存在）

### Scenario 16：标记完成 / 取消完成（正常路径）

- **GIVEN** 用户有一条 `status = "active"` 的待办项 `id = X`
- **WHEN** 用户提交 `POST /api/todos/X/toggle`
- **THEN** 返回 HTTP `200`，`status` 变为 `"completed"`，`completedAt` 被设置
- **AND** 再次提交 `POST /api/todos/X/toggle`，`status` 回到 `"active"`，`completedAt` 清空为 `null`

### Scenario 17：删除待办项（正常路径）

- **GIVEN** 用户有一条待办项 `id = X`
- **WHEN** 用户提交 `DELETE /api/todos/X`
- **THEN** 返回 HTTP `204`，待办项被逻辑删除（`deleted = true`）
- **AND** 后续列表查询不包含该项

### Scenario 18：删除待办项 — 不存在或无权访问（异常路径）

- **WHEN** 用户提交 `DELETE /api/todos/{不存在的UUID}`
- **THEN** 返回 HTTP `404`，`errorCode: "todo_not_found"`

### Scenario 19：批量标记完成（正常路径）

- **GIVEN** 用户有 3 条 active 待办项 `ids = [A, B, C]`
- **WHEN** 用户提交 `POST /api/todos/batch-complete`，请求体 `{ ids: [A, B, C] }`
- **THEN** 返回 HTTP `200`，3 条待办项 `status` 均变为 `"completed"`
- **AND** `completedAt` 均被设置

### Scenario 20：批量标记完成 — 包含非本人待办（异常路径）

- **GIVEN** `ids` 中包含一条属于用户 B 的待办
- **WHEN** 用户 A 提交 `POST /api/todos/batch-complete`
- **THEN** 返回 HTTP `404`，`errorCode: "todo_not_found"`
- **AND** 所有项均未被修改（事务回滚）

### Scenario 21：批量删除（正常路径）

- **GIVEN** 用户有 3 条待办项 `ids = [A, B, C]`
- **WHEN** 用户提交 `POST /api/todos/batch-delete`，请求体 `{ ids: [A, B, C] }`
- **THEN** 返回 HTTP `204`，3 条待办项被逻辑删除

### Scenario 22：批量操作 — ids 为空（异常路径）

- **WHEN** 用户提交 `POST /api/todos/batch-complete`，请求体 `{ ids: [] }`
- **THEN** 返回 HTTP `422`，`errorCode: "validation_error"`

### Scenario 23：批量操作 — ids 超过上限（异常路径）

- **WHEN** 用户提交 `POST /api/todos/batch-complete`，`ids` 长度 > 100
- **THEN** 返回 HTTP `422`，`errorCode: "validation_error"`

### Scenario 24：创建分类（正常路径）

- **GIVEN** 用户已登录
- **WHEN** 用户提交 `POST /api/todo-categories`，请求体 `{ name: "旅行计划" }`
- **THEN** 返回 HTTP `201`，响应包含 `requestId`、`id`、`name`、`createdAt`

### Scenario 25：创建分类 — 名称重复（异常路径）

- **GIVEN** 用户已有一个名为"工作"的分类
- **WHEN** 用户再次提交 `POST /api/todo-categories`，`name: "工作"`
- **THEN** 返回 HTTP `409`，`errorCode: "category_name_exists"`

### Scenario 26：创建分类 — 名称为空（异常路径）

- **WHEN** 用户提交 `POST /api/todo-categories`，`name` 为空
- **THEN** 返回 HTTP `422`，`errorCode: "validation_error"`

### Scenario 27：查看分类列表（正常路径）

- **GIVEN** 用户有 3 个分类
- **WHEN** 用户提交 `GET /api/todo-categories`
- **THEN** 返回 HTTP `200`，`items` 包含 3 个分类
- **AND** 每个分类包含 `id`、`name`、`todoCount`（该分类下未删除待办数量）

### Scenario 28：删除分类（正常路径）

- **GIVEN** 用户有一个分类 `id = Y`，下面有 5 条待办
- **WHEN** 用户提交 `DELETE /api/todo-categories/Y`
- **THEN** 返回 HTTP `204`，分类被删除
- **AND** 该分类下的待办项 `categoryId` 被置为 `null`（待办不随分类删除）

### Scenario 29：删除分类 — 分类不存在（异常路径）

- **WHEN** 用户提交 `DELETE /api/todo-categories/{不存在的UUID}`
- **THEN** 返回 HTTP `404`，`errorCode: "category_not_found"`

### Scenario 30：网络 / 服务器异常（异常路径）

- **GIVEN** 后端服务不可用或超时
- **WHEN** 前端发起任何 Todo API 请求
- **THEN** 前端 `ApiResponse.error` 返回 `errorCode: "server_error"` 或 `"network_error"`
- **AND** 页面展示错误状态（Error State）+ 重试按钮

---

## 3. 数据结构

> **字段命名约定**：本模块前后端统一使用 **camelCase**（特例覆盖项目默认 snake_case 约定）。

### 3.1 TodoEntity（后端 JPA 实体）

继承 `BaseEntity`（`id: UUID`、`createdAt: Instant`、`updatedAt: Instant`、`deleted: boolean`）。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `title` | `VARCHAR(200)` | NOT NULL | 待办标题 |
| `description` | `TEXT` | NULLABLE | 详细描述，纯文本 |
| `status` | `VARCHAR(20)` | NOT NULL, default `"active"` | 枚举：`active` / `completed` |
| `priority` | `VARCHAR(10)` | NOT NULL, default `"none"` | 枚举：`none` / `low` / `medium` / `high` |
| `dueDate` | `DATE` | NULLABLE | 截止日期（仅日期，无时分秒） |
| `completedAt` | `TIMESTAMP` | NULLABLE | 完成时间（取消完成时置 null） |
| `categoryId` | `UUID` (FK) | NULLABLE | 所属分类，可为空 |
| `userId` | `UUID` (FK) | NOT NULL | 所属用户 |

索引：
- `(userId, status, deleted)` — 列表查询主路径
- `(userId, categoryId, deleted)` — 按分类筛选

### 3.2 TodoCategoryEntity（后端 JPA 实体）

继承 `BaseEntity`。

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| `name` | `VARCHAR(50)` | NOT NULL | 分类名称 |
| `userId` | `UUID` (FK) | NOT NULL | 所属用户 |

约束：
- `UNIQUE(userId, name, deleted=false)` — 同一用户不允许重名分类

### 3.3 请求 DTO

#### CreateTodoRequest（Java record）

```java
public record CreateTodoRequest(
    @NotBlank @Size(max = 200) String title,
    @Size(max = 2000) String description,
    String priority,       // "none" | "low" | "medium" | "high"，默认 "none"
    UUID categoryId,
    LocalDate dueDate
) {}
```

#### UpdateTodoRequest（Java record）

```java
public record UpdateTodoRequest(
    @Size(max = 200) String title,
    @Size(max = 2000) String description,
    String priority,
    UUID categoryId,
    LocalDate dueDate
) {}
```

> 所有字段均可选（仅传需要更新的字段），null 表示不修改。`categoryId` 传空字符串 `""` 表示清除分类。

#### BatchTodoRequest（Java record）

```java
public record BatchTodoRequest(
    @NotEmpty @Size(max = 100) List<UUID> ids
) {}
```

#### CreateCategoryRequest（Java record）

```java
public record CreateCategoryRequest(
    @NotBlank @Size(max = 50) String name
) {}
```

#### UpdateCategoryRequest（Java record）

```java
public record UpdateCategoryRequest(
    @NotBlank @Size(max = 50) String name
) {}
```

### 3.4 响应 DTO

所有响应继承 `BaseResponse`（自带 `requestId`），字段使用 camelCase。

#### TodoResponse

```java
public class TodoResponse extends BaseResponse {
    private final UUID id;
    private final String title;
    private final String description;   // nullable
    private final String status;        // "active" | "completed"
    private final String priority;      // "none" | "low" | "medium" | "high"
    private final LocalDate dueDate;    // nullable
    private final Instant completedAt;  // nullable
    private final UUID categoryId;      // nullable
    private final Instant createdAt;
    private final Instant updatedAt;
}
```

#### TodoListResponse（分页列表）

```java
public class TodoListResponse extends BaseResponse {
    private final List<TodoResponse> items;
    private final long total;
    private final int page;
    private final int size;
}
```

#### TodoCategoryResponse

```java
public class TodoCategoryResponse extends BaseResponse {
    private final UUID id;
    private final String name;
    private final long todoCount;   // 该分类下 active + 未删除的待办数量
    private final Instant createdAt;
}
```

#### TodoCategoryListResponse

```java
public class TodoCategoryListResponse extends BaseResponse {
    private final List<TodoCategoryResponse> items;
}
```

### 3.5 API 端点汇总

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| `POST` | `/api/todos` | JWT | 创建待办项 |
| `GET` | `/api/todos` | JWT | 待办列表（分页 + 筛选） |
| `GET` | `/api/todos/{id}` | JWT | 查看单条待办详情 |
| `PATCH` | `/api/todos/{id}` | JWT | 更新待办项 |
| `DELETE` | `/api/todos/{id}` | JWT | 删除待办项（逻辑删除） |
| `POST` | `/api/todos/{id}/toggle` | JWT | 切换完成 / 未完成状态 |
| `POST` | `/api/todos/batch-complete` | JWT | 批量标记完成 |
| `POST` | `/api/todos/batch-delete` | JWT | 批量删除 |
| `POST` | `/api/todo-categories` | JWT | 创建分类 |
| `GET` | `/api/todo-categories` | JWT | 分类列表（含 todoCount） |
| `PATCH` | `/api/todo-categories/{id}` | JWT | 更新分类名称 |
| `DELETE` | `/api/todo-categories/{id}` | JWT | 删除分类 |

#### 列表查询参数（`GET /api/todos`）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `page` | int | `1` | 页码，从 1 开始 |
| `size` | int | `20` | 每页条数，最大 `100` |
| `status` | string | — | 筛选状态：`active` / `completed`，不传则返回全部 |
| `priority` | string | — | 筛选优先级：`none` / `low` / `medium` / `high` |
| `categoryId` | UUID | — | 筛选分类，不传则返回全部分类 |
| `sort` | string | `"createdAt"` | 排序字段：`createdAt` / `dueDate` / `priority` |
| `order` | string | `"desc"` | 排序方向：`asc` / `desc` |

### 3.6 前端 TypeScript 类型

```typescript
// lib/api/todos.ts

export type TodoPriority = "none" | "low" | "medium" | "high";
export type TodoStatus = "active" | "completed";

export interface Todo {
  id: string;               // UUID
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string | null;   // ISO date "2026-07-15"
  completedAt: string | null; // ISO-8601 timestamp
  categoryId: string | null; // UUID
  createdAt: string;        // ISO-8601
  updatedAt: string;        // ISO-8601
}

export interface TodoCategory {
  id: string;
  name: string;
  todoCount: number;
  createdAt: string;
}

export interface CreateTodoPayload {
  title: string;
  description?: string;
  priority?: TodoPriority;
  categoryId?: string;
  dueDate?: string;         // ISO date
}

export interface UpdateTodoPayload {
  title?: string;
  description?: string;
  priority?: TodoPriority;
  categoryId?: string | null; // null = 清除分类
  dueDate?: string | null;
}

export interface BatchTodoPayload {
  ids: string[];
}

export interface TodoListParams {
  page?: number;
  size?: number;
  status?: TodoStatus;
  priority?: TodoPriority;
  categoryId?: string;
  sort?: "createdAt" | "dueDate" | "priority";
  order?: "asc" | "desc";
}
```

---

## 4. 验收标准（Acceptance Checklist）

> 实施完成后逐项勾选，全部命中方可申请 code review。

### 4.1 后端 — 待办项 CRUD

- [ ] `POST /api/todos` 创建待办项，返回 201 + `TodoResponse`
- [ ] `GET /api/todos` 分页列表，支持 `status` / `priority` / `categoryId` / `sort` / `order` 参数
- [ ] `GET /api/todos/{id}` 返回单条待办详情
- [ ] `PATCH /api/todos/{id}` 部分更新待办项，仅修改传入的字段
- [ ] `DELETE /api/todos/{id}` 逻辑删除，返回 204
- [ ] `POST /api/todos/{id}/toggle` 切换 `active` ↔ `completed`，同步更新 `completedAt`
- [ ] `POST /api/todos/batch-complete` 批量标记完成，事务保证原子性
- [ ] `POST /api/todos/batch-delete` 批量逻辑删除

### 4.2 后端 — 分类管理

- [ ] `POST /api/todo-categories` 创建分类，返回 201
- [ ] `GET /api/todo-categories` 返回分类列表 + `todoCount`
- [ ] `PATCH /api/todo-categories/{id}` 更新分类名称
- [ ] `DELETE /api/todo-categories/{id}` 删除分类，关联待办的 `categoryId` 置 null

### 4.3 后端 — 异常路径覆盖

- [ ] 未登录请求返回 401 `unauthorized`
- [ ] 操作他人待办返回 404 `todo_not_found`（不暴露资源存在）
- [ ] 操作不存在的待办返回 404 `todo_not_found`
- [ ] 创建待办 `title` 为空返回 422 `validation_error`
- [ ] 创建待办 `title` 超 200 字符返回 422 `validation_error`
- [ ] 无效 `priority` 值返回 422 `validation_error`
- [ ] 无效 `sort` 值返回 400 `validation_error`
- [ ] `categoryId` 指向他人分类返回 404 `category_not_found`
- [ ] 分类名重复返回 409 `category_name_exists`
- [ ] 批量操作 `ids` 为空返回 422 `validation_error`
- [ ] 批量操作 `ids` 超 100 返回 422 `validation_error`
- [ ] 批量操作包含非本人待办，整体回滚返回 404 `todo_not_found`

### 4.4 后端 — 测试（TDD）

- [ ] `TodoControllerTest`（`@WebMvcTest`）覆盖所有端点的正常 + 异常路径
- [ ] `TodoServiceTest` 覆盖业务逻辑（toggle 状态变更、批量操作原子性、权限校验）
- [ ] `TodoRepositoryTest` 覆盖筛选 + 排序查询（`@DataJpaTest`）
- [ ] `mvn -f backend/pom.xml test` 全绿

### 4.5 前端 — 页面与交互

- [ ] `/todos` 路由：待办列表页（分页 + 筛选 + 排序）
- [ ] 创建待办表单：`title` 必填校验 + `description` / `priority` / `categoryId` / `dueDate` 可选
- [ ] 待办项卡片：展示标题、状态图标、优先级标识、截止时间、分类名
- [ ] Toggle 完成：点击复选框即时切换状态，乐观更新 UI
- [ ] 编辑待办：内联编辑或跳转编辑表单
- [ ] 删除待办：确认对话框 → 调用 API → 列表移除
- [ ] 批量操作：多选模式 + 批量完成 / 批量删除按钮
- [ ] 分类管理：创建 / 重命名 / 删除分类，分类侧边栏筛选

### 4.6 前端 — 四态覆盖

- [ ] Loading 态：`Skeleton` 骨架屏
- [ ] Content 态：正常列表渲染
- [ ] Empty 态：居中图标 + "No todos yet" + "Create your first todo" CTA 按钮
- [ ] Error 态：错误描述 + "Retry" 按钮

### 4.7 前端 — 测试

- [ ] API 客户端测试：`todos.test.ts` 覆盖 CRUD + 批量 + 错误处理
- [ ] 列表页测试：分页 / 筛选 / 空状态 / 错误状态
- [ ] 表单测试：校验 / 提交 / 错误提示
- [ ] `npm test` 全绿

### 4.8 端到端

- [ ] `mvn -f backend/pom.xml test` 全绿
- [ ] `cd frontend && npm run build` 通过，无 TS/ESLint 错误
- [ ] `cd frontend && npm test` 全绿
- [ ] 字段命名前后端统一 camelCase，无 snake_case 混入
- [ ] 所有 API 响应包含 `requestId`
- [ ] 未登录访问 `/todos` 路由被 middleware 重定向到登录页

### 4.9 边界守护

- [ ] `frontend/app/` 下未新增 `route.ts` / `route.tsx`（薄 BFF 边界）
- [ ] `frontend/lib/backend.ts` 首行仍为 `import "server-only";`
- [ ] 无协作功能代码（无分享、无指派、无评论）
- [ ] 无子任务 / 嵌套待办相关数据结构

---

## 5. 与其它模块的依赖关系

| 关系 | 模块 | 说明 |
|------|------|------|
| **依赖** | `auth-backend-api` | JWT 认证，从 token 中提取 userId |
| **依赖** | `BaseEntity` | 实体基类（id、createdAt、updatedAt、deleted） |
| **依赖** | `GlobalExceptionHandler` | 统一异常响应格式 |
| **依赖** | `BaseResponse` | 统一响应基类（requestId） |
| **正交** | `posts` / `spots` / `cities` / `direct-messages` / `notifications` | 互不影响 |
