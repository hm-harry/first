## Why

首页 6 个 Region Slot 组件（hero / feature-nav / city-grid / hot-posts / hot-spots / ai-launcher）需要使用 Tailwind CSS 实用类、shadcn/ui 组件（Card / Button / Input / Sheet / Dialog）和 lucide-react 图标来构建响应式、无障碍的 UI。当前前端工程已部分引入样式栈依赖（Tailwind CSS 4、shadcn 4.13、lucide-react），但缺少部分预装组件（card / input）和完整的集成验证。本变更确保样式栈完整可用，作为所有首页区块单元的共享前置依赖。

## What Changes

- **补装 shadcn/ui 组件**：在已有 `button.tsx` 基础上，追加安装 `card` 和 `input` 组件到 `components/ui/`
- **验证 `cn` 工具函数**：确保 `lib/utils.ts` 导出的 `cn()` 函数（clsx + tailwind-merge）可正常工作
- **验证 Tailwind CSS 4 集成**：确保 `globals.css` 中的 `@import "tailwindcss"` + `@theme inline` + CSS 变量体系完整
- **验证 lucide-react 图标**：确保图标组件可导入、渲染为 `aria-hidden` SVG
- **集成 TDD 验证**：编写 `button.test.tsx` 验证三层栈（Tailwind class / shadcn 组件 / lucide 图标）端到端可用
- **治理文档同步**：确保 `AGENTS.md` 和 `openspec/project.md` 正确反映样式栈锁定状态

## Capabilities

### New Capabilities

- `frontend-styling-stack`: Tailwind CSS 4 + shadcn/ui (base-nova / neutral) + lucide-react 样式栈的完整引入与集成验证，作为 6 个首页区块单元的共享前置依赖

### Modified Capabilities

（无需修改已有 capability 的 REQUIREMENTS）

## Impact

- **前端依赖**：`components/ui/` 新增 `card.tsx`、`input.tsx`（shadcn CLI 生成，不手动修改）
- **配置文件**：`components.json`、`postcss.config.mjs`、`globals.css` 已就位，本变更仅验证不修改
- **测试**：新增 `components/ui/__tests__/button.test.tsx` 集成验证
- **治理文档**：`AGENTS.md` 禁止动作清单和锁定栈表格、`openspec/project.md` 技术栈段
- **后端**：零影响（本变更纯前端工具链）
- **解锁**：本变更 archive 后，6 个首页区块单元（hero / feature-nav / city-grid / hot-posts / hot-spots / ai-launcher）可并行启动
