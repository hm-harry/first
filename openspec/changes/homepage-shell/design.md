## Context

Wanderchina 首页需要一个骨架结构来定义 6 个 Region Slot 的挂载契约。当前状态：

- `app/page.tsx` **不存在**——首页没有入口页面
- `app/regions/` 目录已创建但**为空**
- `app/layout.tsx` 已有 Inter + Plus Jakarta Sans 字体配置，无 SiteHeader / AuthProvider
- `app/HelloMessage.tsx` 不存在——BFF SSR 链路缺少前端验证组件
- `lib/backend.ts` 存在，首行 `import "server-only"` 守护完好
- `globals.css` 已有 Tailwind 4 + shadcn CSS 变量体系，但 `--primary` 为 neutral 灰（非靛青）
- `components/ui/button.tsx` 已安装（frontend-styling-stack 产物）

本 spec 已在 `openspec/specs/homepage-shell/spec.md` 中完整定义 8 条 Requirement。

## Goals / Non-Goals

**Goals:**
- 建立 6 个 Region Slot 的结构契约（data-region 属性 + 空容器 + 文档顺序）
- 创建 `page.tsx` 作为 Server Component，渲染全部 6 个 region
- 创建 `HelloMessage.tsx` + 测试，保留 BFF SSR 链路验证
- 修改 `layout.tsx` 挂载 SiteHeader 占位 + AuthProvider 包装
- 修正 `globals.css` 的 `--primary` 为靛青色相 + 添加 section 间距规则
- 编写 `page.test.tsx` 守护 region 顺序契约

**Non-Goals:**
- 任何 region 内部内容（文案、图片、数据、交互）
- 真实 SiteHeader 导航 / AuthProvider 鉴权逻辑（骨架级占位）
- 搜索功能、Banner 轮播、CTA 按钮
- 后端任何修改
- 新 npm 依赖引入

## Decisions

### Decision 1：6 个 region 全部在 `page.tsx` 中渲染

**选择**：`page.tsx` 渲染 6 个 region（含 ai-launcher），`layout.tsx` 不挂载 AiLauncherSlot

**理由**：homepage-visual-v2 的演进已将 ai-launcher 从 layout 移至 page.tsx，spec R1 + R2 明确了此架构。layout 只负责 SiteHeader + AuthProvider + children。

**替代方案**：ai-launcher 挂在 layout（原 notes 描述的方式）——已被 visual-v2 推翻，不再考虑。

### Decision 2：HelloMessage 从零创建

**选择**：创建 `HelloMessage.tsx`（Client Component）+ `HelloMessage.test.tsx`

**理由**：spec R3 明确要求 "HelloMessage.tsx shall remain present"，且 http-server spec 的 SSR 链路场景依赖 `HelloMessage.test.tsx` 验证 BFF 链路。虽然当前不存在，但作为 BFF 契约的活体守护必须创建。

**组件设计**：
```tsx
// HelloMessage.tsx — 最小 Client Component
'use client';
export default function HelloMessage({ message }: { message: string }) {
  return <h1>{message}</h1>;
}
```

### Decision 3：SiteHeader + AuthProvider 为最小骨架

**选择**：创建空壳组件，仅满足 spec R2 的结构契约

**理由**：SiteHeader 导航和 AuthProvider 鉴权属于独立 capability（`site-header` / `auth-frontend`），本变更仅创建占位以满足 layout 结构要求。

**组件设计**：
```tsx
// SiteHeader.tsx — 空壳
export default function SiteHeader() {
  return <header data-testid="site-header" />;
}

// AuthProvider.tsx — 透传 children
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

### Decision 4：Slot 组件使用原生 HTML，不用 shadcn

**选择**：Slot 骨架用 `<section>` / `<div>` 原生元素，不 import shadcn 组件

**理由**：spec R5 要求 "未引入新 npm 依赖"。骨架阶段 Slot 内部无内容，无需 Card/Button 等组件。各区块单元（hero / feature-nav 等）在后续变更中按需引入 shadcn 组件。

### Decision 5：`--primary` 色值修正纳入本变更

**选择**：在 `globals.css` 中将 `--primary` 从 `oklch(0.205 0 0)` 改为 `oklch(0.488 0.243 264.376)`

**理由**：spec R8b 明确要求靛青色相。此修改影响所有使用 `bg-primary` / `text-primary-foreground` 的 shadcn 组件（如 Button 默认 variant）。若不在 shell 中修正，后续 6 个区块单元都会基于错误的色值开发。

## Risks / Trade-offs

- **[HelloMessage 创建后无人维护]** → 作为 BFF 链路守护存在，后续 homepage-hero 接入真实 SSR 数据后可评估是否保留
- **[SiteHeader / AuthProvider 空壳堆积]** → 后续独立 capability 会替换实现，空壳在 archive 时不影响功能
- **[--primary 色值变更影响现有 Button]** → 当前仅 `components/ui/button.tsx` 使用 primary，视觉变化可接受（从灰变靛蓝）
- **[section 间距规则与后续 Slot 样式冲突]** → `section[data-region]` 的 padding-block 是全局默认值，各 Slot 可通过 className 覆盖
