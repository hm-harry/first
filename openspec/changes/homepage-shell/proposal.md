## Why

首页需要一个结构骨架来定义 6 个内容区块（Region Slot）的挂载契约。当前前端 `app/` 目录缺少 `page.tsx`，`app/regions/` 为空目录。本变更建立首页的骨架级结构：6 个空 Slot 组件 + `page.tsx` 编排 + `layout.tsx` 挂载全局组件，作为后续 6 个区块内容单元（hero / feature-nav / city-grid / hot-posts / hot-spots / ai-launcher）的共享前置底座。

## What Changes

- **创建 6 个 Region Slot 组件**：`HeroSlot` / `FeatureNavSlot` / `CityGridSlot` / `HotPostsSlot` / `HotSpotsSlot` / `AiLauncherSlot`，每个渲染带 `data-region` 属性的空容器
- **创建 `app/page.tsx`**：Server Component，按文档顺序渲染 5 个页内 region + ai-launcher（共 6 个），不依赖后端
- **创建 `app/HelloMessage.tsx` + `app/HelloMessage.test.tsx`**：Client Component，保留 BFF SSR 链路验证能力
- **修改 `app/layout.tsx`**：挂载 `<SiteHeader />` 占位 + `<AuthProvider>` 包装
- **创建空壳 `SiteHeader` + `AuthProvider`**：最小骨架组件，满足 spec R2 契约
- **修复 `globals.css` 主色**：`--primary` 从 neutral 灰改为靛青 `oklch(0.488 0.243 264.376)`
- **添加 section 间距规则**：`section[data-region]` 的 `padding-block` 响应式 64/96px
- **零新 npm 依赖**：所有 Slot 使用原生 HTML 元素，不引入额外库

## Capabilities

### New Capabilities

- `homepage-shell`: 首页骨架契约——6 个 Region Slot 容器、page.tsx 编排、layout.tsx 全局组件挂载、BFF 边界守护、页面级视觉契约

### Modified Capabilities

（无需修改已有 capability 的 REQUIREMENTS）

## Impact

- **前端新增文件**：`app/page.tsx`、`app/HelloMessage.tsx`、`app/HelloMessage.test.tsx`、`app/regions/*Slot.tsx`（6 个）、`app/page.test.tsx`、`app/SiteHeader.tsx`、`app/AuthProvider.tsx`
- **前端修改文件**：`app/layout.tsx`（挂载 SiteHeader + AuthProvider）、`app/globals.css`（修正 --primary 色值 + section 间距规则）
- **后端**：零影响（submodule 指针不变）
- **npm 依赖**：无新增
- **解锁**：本变更 archive 后，6 个首页区块单元可并行启动
