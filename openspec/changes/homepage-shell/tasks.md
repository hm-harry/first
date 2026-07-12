## 1. HelloMessage + BFF 链路（前置）

- [ ] 1.1 创建 `frontend/app/HelloMessage.tsx`：Client Component，接收 `{ message: string }` props，渲染 `<h1>{message}</h1>`
- [ ] 1.2 创建 `frontend/app/HelloMessage.test.tsx`：Vitest + RTL，断言 `render(<HelloMessage message="hello" />)` 后 h1 文本为 `hello`
- [ ] 1.3 运行 `npm test` 确认 HelloMessage 测试 GREEN

## 2. SiteHeader + AuthProvider 骨架

- [ ] 2.1 创建 `frontend/app/SiteHeader.tsx`：Server Component，渲染 `<header data-testid="site-header" />`
- [ ] 2.2 创建 `frontend/app/AuthProvider.tsx`：Server Component，接收 `{ children }` props，渲染 `<>{children}</>`
- [ ] 2.3 修改 `frontend/app/layout.tsx`：在 `<body>` 内挂载 `<SiteHeader />` + 用 `<AuthProvider>` 包裹 `{children}`

## 3. Region Slot 组件（6 个）

- [ ] 3.1 创建 `frontend/app/regions/HeroSlot.tsx`：`<section data-region="hero" aria-label="hero placeholder" />`
- [ ] 3.2 创建 `frontend/app/regions/FeatureNavSlot.tsx`：`<section data-region="feature-nav" aria-label="feature-nav placeholder" />`
- [ ] 3.3 创建 `frontend/app/regions/CityGridSlot.tsx`：`<section data-region="city-grid" aria-label="city-grid placeholder" />`
- [ ] 3.4 创建 `frontend/app/regions/HotPostsSlot.tsx`：`<section data-region="hot-posts" aria-label="hot-posts placeholder" />`
- [ ] 3.5 创建 `frontend/app/regions/HotSpotsSlot.tsx`：`<section data-region="hot-spots" aria-label="hot-spots placeholder" />`
- [ ] 3.6 创建 `frontend/app/regions/AiLauncherSlot.tsx`：`<div data-region="ai-launcher" aria-label="ai-launcher placeholder" />`

## 4. page.tsx 编排

- [ ] 4.1 创建 `frontend/app/page.tsx`：Server Component，import 6 个 Slot，按文档顺序渲染（hero → feature-nav → city-grid → hot-posts → hot-spots → ai-launcher）
- [ ] 4.2 创建 `frontend/app/page.test.tsx`：
  - 断言 `querySelectorAll('[data-region]')` 长度等于 6
  - 断言 data-region 值依次为 `['hero','feature-nav','city-grid','hot-posts','hot-spots','ai-launcher']`
  - 断言 page.tsx 不含 `HelloMessage` 或 `fetchFromBackend` 引用
- [ ] 4.3 运行 `npm test` 确认全部 GREEN

## 5. globals.css 视觉契约

- [ ] 5.1 修正 `:root` 中 `--primary` 从 `oklch(0.205 0 0)` 改为 `oklch(0.488 0.243 264.376)`
- [ ] 5.2 修正 `.dark` 中 `--primary` 为对应暗色靛青值 `oklch(0.922 0.094 264.376)`
- [ ] 5.3 添加 `section[data-region]` 间距规则：mobile `padding-block: 64px`，desktop（`@media (min-width: 1024px)`）`padding-block: 96px`

## 6. 边界守护验证

- [ ] 6.1 验证 `frontend/app/` 下无 `route.ts` / `route.tsx` 文件
- [ ] 6.2 验证 `frontend/lib/backend.ts` 首行仍为 `import "server-only";`
- [ ] 6.3 验证 `frontend/package.json` 依赖列表未变化
- [ ] 6.4 验证 `backend/` submodule 指针未变
- [ ] 6.5 运行 `npm run build` 确认构建通过
- [ ] 6.6 运行 `npm test` 确认全部测试 GREEN
