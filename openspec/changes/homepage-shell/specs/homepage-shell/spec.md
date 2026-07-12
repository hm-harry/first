## ADDED Requirements

### Requirement: 首页 Page 必须渲染 6 个 region Slot 按文档顺序

`app/page.tsx` SHALL render exactly 6 region slots in document order: `hero`, `feature-nav`, `city-grid`, `hot-posts`, `hot-spots`, `ai-launcher`.

#### Scenario: 6 个 region 按文档顺序存在

- **GIVEN** `app/page.tsx` 已按 homepage-shell apply 创建
- **WHEN** RTL 渲染 `<Page />` 后取 `container.querySelectorAll('[data-region]')`
- **THEN** NodeList 长度等于 `6`
- **AND** 各节点 `data-region` 值依次为 `['hero','feature-nav','city-grid','hot-posts','hot-spots','ai-launcher']`

#### Scenario: AiLauncherSlot 作为最后 region 渲染

- **WHEN** RTL 渲染 `<Page />` 后查 `container.querySelector('[data-region="ai-launcher"]')`
- **THEN** 返回非 null
- **AND** DOM 顺序上 `[data-region="ai-launcher"]` 节点出现在 `[data-region="hot-spots"]` 之后

---

### Requirement: Layout 必须挂载 SiteHeader 与 AuthProvider

`app/layout.tsx` SHALL mount `<SiteHeader />` and `<AuthProvider>` wrapping `{children}` inside `<body>`. The layout SHALL NOT mount AiLauncherSlot (rendered in page.tsx per visual-v2).

#### Scenario: layout 渲染 SiteHeader

- **GIVEN** layout 已按 homepage-shell apply 修改
- **WHEN** 测试渲染 layout
- **THEN** `container.querySelector('[data-testid="site-header"]')` 非 null
- **AND** SiteHeader 在 DOM 顺序上出现在 `{children}` 之前

#### Scenario: AuthProvider 包装 children

- **WHEN** 测试渲染 layout
- **THEN** `{children}` 被 `<AuthProvider>` 包裹
- **AND** children 内容正常渲染

---

### Requirement: HelloMessage 与 lib/backend 链路必须保留

`app/HelloMessage.tsx`, `app/HelloMessage.test.tsx`, and `lib/backend.ts` SHALL remain present after homepage-shell apply. `app/page.tsx` MUST NOT import `HelloMessage` or `fetchFromBackend`.

#### Scenario: HelloMessage 测试通过

- **WHEN** `cd frontend && npm test`
- **THEN** `HelloMessage.test.tsx` 仍 GREEN
- **AND** 测试输出含 `HelloMessage > renders hello message from backend` 用例通过

#### Scenario: lib/backend 边界守护未失效

- **WHEN** 读取 `frontend/lib/backend.ts` 首行
- **THEN** 输出 `import "server-only";`

#### Scenario: page.tsx 不 import HelloMessage 链路

- **WHEN** 检查 `frontend/app/page.tsx` 内容
- **THEN** 不含 `HelloMessage` 或 `fetchFromBackend` 引用

---

### Requirement: 首页必须不依赖后端运行

`app/page.tsx` SHALL NOT make any backend HTTP call. The home route MUST return HTTP 200 with full markup even when the Spring Boot backend (port 8080) is unreachable.

#### Scenario: 后端未启动时首页仍可访问

- **GIVEN** Spring Boot 后端未启动（8080 不通）
- **WHEN** `curl -i http://localhost:<port>/`
- **THEN** 响应状态码为 `200`
- **AND** HTML 含 6 个 `data-region` 元素

---

### Requirement: BFF 边界守护必须保持

The `frontend/app/` directory SHALL NOT contain any `route.ts` or `route.tsx` file. No new npm dependencies SHALL be introduced.

#### Scenario: 无 Route Handler 文件

- **WHEN** `find frontend/app -name 'route.ts' -o -name 'route.tsx'`
- **THEN** 输出为空

#### Scenario: 未引入新 npm 依赖

- **WHEN** 比对 apply 前后的 `frontend/package.json` 的 `dependencies` 与 `devDependencies`
- **THEN** 两份列表完全一致

---

### Requirement: regions 目录必须恰好包含 6 个 Slot 文件

`frontend/app/regions/` SHALL contain exactly 6 `.tsx` files: `HeroSlot.tsx`, `FeatureNavSlot.tsx`, `CityGridSlot.tsx`, `HotPostsSlot.tsx`, `HotSpotsSlot.tsx`, `AiLauncherSlot.tsx`. Each file MUST default-export a React component returning the corresponding empty container with `data-region` attribute.

#### Scenario: 文件清单完整且仅有 6 个

- **WHEN** 列出 `frontend/app/regions/*.tsx` 文件
- **THEN** 数量恰好为 `6`
- **AND** 文件名严格匹配上述清单

#### Scenario: 每个 Slot 渲染带 data-region 的空容器

- **GIVEN** 任一 Slot 文件（如 `HeroSlot`）
- **WHEN** RTL 渲染之
- **THEN** 输出唯一根元素，含 `data-region` 属性 + `aria-label`
- **AND** 无任何子节点文本内容

#### Scenario: 每个 Slot 默认导出可调用的 React 组件

- **GIVEN** 任一 Slot 文件
- **WHEN** import 其 default export 并 RTL render 之
- **THEN** 渲染成功，无报错

---

### Requirement: 页面级视觉契约

All region slots SHALL conform to a shared page-level visual contract defined in `app/globals.css`. This includes: font stack (Inter for body, Plus Jakarta Sans for headings), primary color (indigo), and section spacing (96px desktop / 64px mobile).

#### Scenario: 字体 stack 正确

- **WHEN** 检视 `app/layout.tsx` 和 `app/globals.css`
- **THEN** `next/font/google` 引入 Inter 和 Plus Jakarta Sans
- **AND** `@theme inline` CSS 变量定义 `--font-sans` 和 `--font-heading`
- **AND** `body` 使用 `--font-sans`

#### Scenario: 主色为靛青

- **WHEN** 检视 `app/globals.css`
- **THEN** `:root` CSS 变量定义 `--color-brand: #1d4ed8`
- **AND** shadcn `--primary` token 映射为 `oklch(0.488 0.243 264.376)`（靛青色相）

#### Scenario: section 间距正确

- **WHEN** 检视 `app/globals.css`
- **THEN** `section[data-region]` 的 `padding-block` 在 mobile（< 1024px）为 64px，desktop（≥ 1024px）为 96px

---

### Requirement: 治理文档必须随 archive 同步更新

When this change is archived, `openspec/specs/http-server/spec.md` SHALL be updated. The http-server spec already contains a NOTE (line 28) referencing homepage-shell. No further update is required if that NOTE remains accurate.

#### Scenario: http-server spec 保持自洽

- **WHEN** archive 完成后查 `openspec/specs/http-server/spec.md`
- **THEN** spec 中 NOTE 正确描述 HelloMessage 链路由 `HelloMessage.test.tsx` 单测覆盖
- **AND** 不再要求首页 UI 含 `<h1>hello`
