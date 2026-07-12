## Context

Wanderchina 前端（Next.js 16 + React 19 + TypeScript）已完成基础脚手架搭建，且大部分样式栈依赖已在 `package.json` 中就位：

- **Tailwind CSS 4**：`tailwindcss ^4` + `@tailwindcss/postcss ^4`，`globals.css` 已配置 `@import "tailwindcss"` + `@theme inline` + shadcn CSS 变量体系
- **shadcn/ui v4.13**：`components.json` 已初始化（`base-nova` / `neutral` / CSS Variables），`components/ui/button.tsx` 已安装
- **lucide-react**：`^1.24.0` 已安装
- **cn 工具函数**：`lib/utils.ts` 已导出 `cn()` (clsx + tailwind-merge)
- **品牌色**：`globals.css` 已定义 `--color-brand: #1d4ed8` 和 section 间距变量

**缺口**：`components/ui/` 仅含 `button.tsx`，缺少 `card` 和 `input` 组件（6 个首页区块单元均需使用）。集成验证测试尚未编写。

## Goals / Non-Goals

**Goals:**
- 补装 shadcn `card` 和 `input` 组件，使 6 个首页区块单元可直接 import 使用
- 编写集成验证测试，证明 Tailwind class 生效、shadcn 组件可渲染、lucide 图标可渲染
- 验证 `cn()` 工具的 tailwind-merge 冲突解决能力
- 确保治理文档（`AGENTS.md` / `openspec/project.md`）正确反映样式栈锁定状态

**Non-Goals:**
- 任何业务 UI 实现（由 6 个首页区块单元各自承担）
- 自定义品牌色 token 扩展（留给独立 `homepage-visual` change）
- 暗色模式 / 主题切换（`next-themes` 集成留给独立 change）
- shadcn 组件全量预装（仅装 button / card / input 三件，其它按需追加）
- CSS-in-JS 方案（styled-components / emotion 等明确不引入）
- `backend/` 任何修改

## Decisions

### Decision 1：shadcn 风格选用 `base-nova` + `neutral`

**选择**：`base-nova` 风格 + `neutral` 灰度色板（已在 `components.json` 中配置）

**理由**：
- `base-nova` 是 shadcn 最新风格，基于 Radix UI 原生原语，提供开箱即用的 a11y
- `neutral` 灰度与品牌色 `#1d4ed8`（blue-700）搭配，符合国际目的地营销站的克制调性
- 与 `styling-conventions.md` 规约一致

**替代方案**：`new-york` 风格 — 更紧凑但 a11y 细节略少，本项目明确选择 base-nova

### Decision 2：仅预装 button / card / input 三件

**选择**：`npx shadcn@latest add card input`（button 已安装）

**理由**：
- Hero 区需要 `Input`（搜索框占位）
- feature-nav / hot-posts / hot-spots 均需要 `Card`
- 其它组件（Sheet / Dialog / Tabs）由各区块单元按需 `npx shadcn add`，避免本变更范围膨胀

### Decision 3：Tailwind CSS 4 不配置 `tailwind.config.ts`

**选择**：依赖 shadcn 的 `@import "shadcn/tailwind.css"` + `@theme inline` 体系，不单独创建 `tailwind.config.ts`

**理由**：
- Tailwind CSS 4 已转向 CSS-first 配置，`@theme inline` 直接在 CSS 中定义 token
- shadcn v4 原生支持此模式，`components.json` 中 `tailwind.config` 为空字符串
- 项目已通过 `postcss.config.mjs` 配置 `@tailwindcss/postcss` 插件

### Decision 4：集成验证用单个测试文件覆盖三层栈

**选择**：在 `components/ui/__tests__/button.test.tsx` 中覆盖 Button 渲染 + variant + lucide 图标 + cn 工具

**理由**：
- 单一测试文件即可证明 Tailwind / shadcn / lucide / cn 四层端到端通
- 不为每个工具单独建测试文件（YAGNI）
- `button.tsx` 是 shadcn 的标杆组件，验证它即验证整条链路

## Risks / Trade-offs

- **[shadcn 组件版本漂移]** → 组件源码下载到 `components/ui/` 后由项目自行维护，不随 npm 更新自动升级。后续可用 `npx shadcn@latest diff` 检查差异
- **[Tailwind CSS 4 构建体积]** → Tailwind 4 自动 tree-shake 未使用的 utility，构建产物仅含实际引用 class。集成测试中验证构建无 warning
- **[card/input 组件与 button 版本不一致]** → button 已在项目中存在，card/input 为新安装。若 shadcn CLI 版本有差异，可能导致风格微偏。安装后人工对比确认视觉一致
- **[治理文档过时]** → 需同步更新 `AGENTS.md` 禁止动作清单和锁定栈表格，防止 spec drift
