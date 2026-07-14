# 代码风格规则 — first-main

## Java 代码风格

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 全小写 | `com.firstmain.user` |
| 类名 | PascalCase | `UserService`, `OrderController` |
| 方法名 | camelCase | `getUserById`, `createOrder` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| 变量 | camelCase | `userName`, `orderList` |
| 接口 | PascalCase (不加 I 前缀) | `UserRepository`, `OrderService` |
| 枚举 | PascalCase | `OrderStatus`, `UserRole` |

### 代码组织

```java
// 类的内部顺序
public class ExampleClass {
    // 1. 静态常量
    // 2. 实例变量
    // 3. 构造方法
    // 4. 公共方法
    // 5. 受保护方法
    // 6. 私有方法
    // 7. 内部类/枚举
}
```

### 格式要求

- 缩进：4 空格
- 行宽限制：120 字符
- 方法长度限制：不超过 50 行
- 类长度限制：不超过 500 行
- 大括号：同行开括号 (K&R 风格)

### Spring Boot 分层规范

```
com.firstmain/
├── config/          # 配置类 (含 OpenAPI 配置)
├── controller/      # REST 控制器 (必须含 @Tag, @Operation 注解)
├── service/         # 业务逻辑
│   └── impl/        # 服务实现
├── repository/      # 数据访问层
├── entity/          # JPA 实体
├── dto/             # 数据传输对象 (必须含 @Schema 注解)
│   ├── request/     # 请求 DTO
│   └── response/    # 响应 DTO
├── mapper/          # 对象映射 (Entity ↔ DTO)
├── exception/       # 自定义异常
└── util/            # 工具类
```

### OpenAPI 注解规范

```java
@Tag(name = "User", description = "用户管理 API")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Operation(summary = "获取用户列表", description = "支持分页查询")
    @ApiResponse(responseCode = "200", description = "查询成功")
    @GetMapping
    public PageResponse<UserResponse> listUsers(...) { }
}
```

- 每个 Controller 必须加 `@Tag` 注解
- 每个 API 方法必须加 `@Operation` 注解
- DTO 字段必须加 `@Schema(description = "...", example = "...")` 注解
- 使用 `@ApiResponse` 描述各种响应场景

## TypeScript / React / Next.js 代码风格

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 接口/类型 | PascalCase | `User`, `OrderResponse` |
| React 组件 | PascalCase | `UserCard`, `OrderList` |
| 变量/函数 | camelCase | `getUsers`, `orderCount` |
| Hooks | camelCase (以 use 开头) | `useAuth`, `useUserList` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 枚举 | PascalCase | `StatusCode` |
| 文件 (组件) | PascalCase | `UserCard.tsx` |
| 文件 (工具) | camelCase | `formatDate.ts` |
| 文件 (页面) | kebab-case 目录 | `app/user-list/page.tsx` |

### 格式要求

- 缩进：2 空格
- 行宽限制：100 字符
- 使用分号结尾
- 使用单引号字符串
- 对象/数组使用尾逗号

### React / Next.js 规范

- 默认使用 Server Components (RSC)，仅在需要交互时添加 `'use client'`
- 组件使用函数式组件 + Hooks，禁止 class 组件
- 使用 Next.js App Router (`src/app/` 目录)
- 路由参数使用 Next.js 内置的 `params` / `searchParams`
- 数据获取优先使用 Server Components 的 async/await
- 状态管理优先使用 URL 状态和 Server State，避免过度使用 Client State

### 导入顺序

```typescript
// 1. React / Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. 第三方库
import { z } from 'zod';

// 3. 项目内部模块 (绝对路径)
import { UserService } from '@/services/UserService';
import type { User } from '@/types/api';

// 4. 相对路径模块
import { formatDate } from './utils';

// 5. 样式文件
import './styles.css';
```

## 通用原则

- 一个文件只做一件事
- 函数参数不超过 4 个，超过时使用对象参数
- 避免嵌套超过 3 层
- 复杂逻辑必须添加注释说明 "为什么"
- 魔法数字必须提取为命名常量
