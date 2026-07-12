## ADDED Requirements

### Requirement: Next.js 项目初始化
系统 SHALL 使用 Next.js 16（App Router）+ React 19 + TypeScript 5，通过 `create-next-app` 初始化在 `frontend/` 目录。

#### Scenario: 开发服务器可启动
- **WHEN** 在 `frontend/` 目录执行 `npm run dev`
- **THEN** 开发服务器在 3000 端口启动，浏览器可访问首页

#### Scenario: TypeScript 编译通过
- **WHEN** 执行 `npm run build`
- **THEN** 构建成功，无 TypeScript 类型错误

### Requirement: Tailwind CSS 4 样式体系
系统 SHALL 配置 Tailwind CSS 4（`@import 'tailwindcss'`），全局 CSS 包含品牌色变量（`--color-brand: #1d4ed8`）和间距 token。

#### Scenario: Tailwind 类名生效
- **WHEN** 页面元素使用 `text-blue-700` 类
- **THEN** 文字颜色正确应用为 blue-700

#### Scenario: CSS 变量可用
- **WHEN** CSS 中使用 `var(--color-brand)`
- **THEN** 解析为 `#1d4ed8`

### Requirement: shadcn/ui 组件库
系统 SHALL 初始化 shadcn/ui（base-nova / neutral 主题），`components/ui/` 目录包含基础组件。

#### Scenario: shadcn/ui 组件可导入
- **WHEN** 代码中 `import { Button } from '@/components/ui/button'`
- **THEN** 组件正确渲染，样式符合 neutral 主题

### Requirement: lucide-react 图标库
系统 SHALL 安装 `lucide-react` 作为唯一图标来源。

#### Scenario: 图标组件可导入
- **WHEN** 代码中 `import { ArrowLeft } from 'lucide-react'`
- **THEN** 图标正确渲染

### Requirement: 字体配置
系统 SHALL 通过 `next/font/google` 加载 Inter（正文，`--font-sans`）和 Plus Jakarta Sans（标题，`--font-heading`），在根 layout 中注入 CSS 变量。

#### Scenario: 正文字体生效
- **WHEN** 元素使用 `font-sans` 类
- **THEN** 文字渲染为 Inter 字体

#### Scenario: 标题字体生效
- **WHEN** 元素使用 `font-heading` 类
- **THEN** 文字渲染为 Plus Jakarta Sans 字体

### Requirement: 目录结构
系统 SHALL 提供以下目录结构：`app/`（路由）、`app/regions/`（首页 Region 组件）、`components/ui/`（shadcn 组件）、`lib/api/`（API 客户端）、`lib/stores/`（Zustand stores）、`lib/backend.ts`（BFF 层）、`lib/utils.ts`（工具函数）。

#### Scenario: 各目录存在且可导入
- **WHEN** 在 `lib/api/` 或 `lib/stores/` 中添加文件
- **THEN** TypeScript 编译通过，IDE 可正确解析 `@/lib/` 路径别名

### Requirement: API 客户端
系统 SHALL 在 `lib/api/client.ts` 中提供 `ApiResponse<T>` 泛型类型（`{ status: 'success', data: T } | { status: 'error', error: ApiError }`）和 `ApiError` 类型（`request_id` + `error_code` + `message` + `details?`）。

#### Scenario: ApiResponse 类型可用
- **WHEN** 定义 `async function fetchUser(): Promise<ApiResponse<User>>` 返回 success 结果
- **THEN** TypeScript 编译通过，调用方可通过 `result.status === 'success'` 类型收窄

### Requirement: BFF 层
系统 SHALL 在 `lib/backend.ts` 中提供 `fetchFromBackend(path)` 函数，首行 `import 'server-only'`，从 `BACKEND_URL` 环境变量读取后端地址。

#### Scenario: Server Component 可通过 BFF 调后端
- **WHEN** Server Component 中调用 `fetchFromBackend('/api/hello')` 且 `BACKEND_URL=http://localhost:8080`
- **THEN** 返回后端响应内容

#### Scenario: 后端不可用时优雅降级
- **WHEN** `BACKEND_URL` 指向不可达地址
- **THEN** 函数返回错误结果，不抛出未捕获异常

### Requirement: Zustand 状态管理
系统 SHALL 安装 `zustand` 依赖，`lib/stores/` 目录可放置 `create<T>()` 模式的状态 store。

#### Scenario: Zustand store 可创建和使用
- **WHEN** 创建 `create<{ count: number }>()` store 并在 Client Component 中使用
- **THEN** 状态读写正确，组件响应式更新

### Requirement: 测试基础设施
系统 SHALL 配置 Vitest + @testing-library/react + happy-dom，`vitest.config.ts` 设置 `environment: 'happy-dom'` + `globals: true`。

#### Scenario: 测试可运行
- **WHEN** 执行 `npm test`
- **THEN** Vitest 执行 `*.test.tsx` 文件并输出结果

#### Scenario: React Testing Library 可用
- **WHEN** 测试文件中 `import { render, screen } from '@testing-library/react'`
- **THEN** 可渲染组件并查询 DOM

### Requirement: Hello 页面（前后端联通验证）
系统 SHALL 在 `app/page.tsx` 中实现 Hello 页面，通过 BFF 层 fetch 后端 `GET /api/hello` 并渲染返回内容。

#### Scenario: 页面显示后端数据
- **WHEN** 后端运行且前端访问首页
- **THEN** 页面渲染后端返回的 "hello" 文本

#### Scenario: 后端不可用时显示降级内容
- **WHEN** 后端未运行，前端访问首页
- **THEN** 页面渲染降级提示（如 "Backend unavailable"），不白屏

### Requirement: 环境变量配置
系统 SHALL 支持 `.env.local` 文件，`BACKEND_URL` 变量指向后端地址，默认 `http://localhost:8080`。

#### Scenario: 环境变量生效
- **WHEN** `.env.local` 中设置 `BACKEND_URL=http://localhost:8080`
- **THEN** `lib/backend.ts` 中 `process.env.BACKEND_URL` 读取到正确值
