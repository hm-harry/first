## 1. shadcn 组件补装

- [ ] 1.1 在 `frontend/` 目录执行 `npx shadcn@latest add card input`，安装 Card 和 Input 组件到 `components/ui/`
- [ ] 1.2 验证 `components/ui/` 目录恰好包含 3 个文件：`button.tsx`、`card.tsx`、`input.tsx`
- [ ] 1.3 验证 `npm run build` 通过，无 TypeScript 错误

## 2. 集成验证测试（TDD）

- [ ] 2.1 创建 `frontend/components/ui/__tests__/button.test.tsx`，编写以下测试用例（先写 RED）：
  - Button 默认渲染含 `inline-flex` class
  - Button outline variant 含 `border` class
  - Card 组件渲染 CardTitle 文本
  - Input 组件渲染 type 和 placeholder
  - lucide `<Sparkles>` 渲染为 `<svg>` 且 `aria-hidden="true"`
  - `cn('a', 'b')` 返回 `'a b'`
  - `cn('p-2', 'p-4')` 返回 `'p-4'`
- [ ] 2.2 运行 `npm test` 确认测试 GREEN（组件已安装，测试应通过）
- [ ] 2.3 运行 `npm run build` 确认构建通过，无 PostCSS / Tailwind warning

## 3. 边界守护验证

- [ ] 3.1 验证 `frontend/app/` 下无 `route.ts` / `route.tsx` 文件
- [ ] 3.2 验证 `frontend/lib/backend.ts` 首行仍为 `import "server-only";`
- [ ] 3.3 验证 `backend/` submodule 指针未变（`git diff --stat backend` 为空）

## 4. 治理文档同步

- [ ] 4.1 检查 `AGENTS.md` 锁定栈表格是否已包含样式栈行（Tailwind CSS 4 + shadcn/ui + lucide-react），若缺失则补充
- [ ] 4.2 检查 `openspec/project.md` 技术栈段是否已包含样式栈描述，若缺失则补充
- [ ] 4.3 检查 `AGENTS.md` 禁止动作清单：禁止引入 Tailwind + shadcn/ui + lucide-react 之外的 CSS 方案

## 5. 提交与归档准备

- [ ] 5.1 在子仓 `frontend/` 提交：`feat(styling): add card/input shadcn components with integration tests`
- [ ] 5.2 在父仓提交治理文档变更（如有）：`docs(governance): sync styling-stack in agents/project docs`
- [ ] 5.3 运行 `npm test` 全绿 + `npm run build` 通过，确认主分支测试始终绿灯
