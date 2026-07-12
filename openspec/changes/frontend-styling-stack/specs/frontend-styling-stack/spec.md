## ADDED Requirements

### Requirement: Tailwind CSS Utility Classes SHALL be Applied to Rendered DOM

The frontend project SHALL integrate Tailwind CSS 4 such that utility class names declared in JSX are recognized by the build pipeline and applied as real CSS rules in the rendered DOM.

#### Scenario: Tailwind utility produces visible style

- **WHEN** a component uses `className="bg-red-500 p-4"` and the page is opened in a browser
- **THEN** the rendered element's computed `background-color` is `rgb(239, 68, 68)`
- **AND** its computed `padding` is `1rem`

#### Scenario: Build output excludes unused utilities

- **WHEN** the project is built via `npm run build`
- **THEN** the produced CSS bundle contains only utility classes referenced by source files under `app/**` and `components/**`
- **AND** no PostCSS / Tailwind warnings are emitted

---

### Requirement: shadcn/ui Components SHALL be Available Under `@/components/ui`

The frontend project SHALL have shadcn/ui initialized with `base-nova` style and `neutral` base color in CSS-variables mode. The `button`, `card`, and `input` components SHALL be installed into `components/ui/`.

#### Scenario: Default Button renders with shadcn token classes

- **WHEN** a test renders `<Button>x</Button>` imported from `@/components/ui/button`
- **THEN** the produced element is a `<button>`
- **AND** its `className` contains the tokens `inline-flex`, `items-center`, and `justify-center`

#### Scenario: Outline variant adds border token

- **WHEN** a test renders `<Button variant="outline">x</Button>`
- **THEN** the produced element's `className` contains `border`

#### Scenario: Card component renders

- **WHEN** a test renders `<Card><CardHeader><CardTitle>Test</CardTitle></CardHeader></Card>` imported from `@/components/ui/card`
- **THEN** the produced element is a `<div>` with card-related CSS classes
- **AND** the `CardTitle` renders text "Test"

#### Scenario: Input component renders

- **WHEN** a test renders `<Input type="text" placeholder="test" />` imported from `@/components/ui/input`
- **THEN** the produced element is an `<input>` with `type="text"` and `placeholder="test"`
- **AND** its `className` contains input-related CSS classes

#### Scenario: Exactly three shadcn component files present

- **WHEN** the directory `frontend/components/ui/` is listed
- **THEN** exactly three component files are present: `button.tsx`, `card.tsx`, `input.tsx`

---

### Requirement: lucide-react Icons SHALL Render as Accessible SVGs

The frontend project SHALL include `lucide-react` as a runtime dependency, and icons imported from it SHALL render as inline SVG elements that are hidden from assistive technologies by default.

#### Scenario: Icon renders as decorative SVG

- **WHEN** a test renders `<Sparkles className="h-4 w-4" data-testid="ic" />`
- **THEN** the produced element is an `<svg>` tag
- **AND** its `aria-hidden` attribute equals `"true"`
- **AND** its `className` contains `h-4` and `w-4`

---

### Requirement: The `cn` Utility SHALL Merge Tailwind Class Lists Without Conflicts

The frontend project SHALL expose a `cn(...inputs: ClassValue[]): string` helper from `@/lib/utils`, backed by `clsx` and `tailwind-merge`, that concatenates class strings while letting later utility classes override conflicting earlier ones.

#### Scenario: Concatenates non-conflicting classes

- **WHEN** code calls `cn('a', 'b')`
- **THEN** the return value is `'a b'`

#### Scenario: Later padding token overrides earlier conflicting token

- **WHEN** code calls `cn('p-2', 'p-4')`
- **THEN** the return value is `'p-4'`

---

### Requirement: Path Alias `@/*` SHALL Resolve to the Frontend Project Root

The frontend project SHALL maintain the Next.js scaffolded TypeScript path alias `@/*` such that imports of `@/components/ui/*`, `@/lib/utils`, and `@/components` resolve under both the test runner and the production build.

#### Scenario: Type checker accepts alias import

- **WHEN** a source file declares `import { Button } from '@/components/ui/button'`
- **THEN** `npm run build` completes without TypeScript errors

#### Scenario: Test runner accepts alias import

- **WHEN** a test file imports `cn` via `import { cn } from '@/lib/utils'`
- **THEN** the test runner resolves the module without configuration overrides

---

### Requirement: BFF Boundary SHALL Remain Intact

The frontend project SHALL NOT introduce any Route Handler or Server Action as part of this change, and the `lib/backend.ts` server-only guard SHALL remain in place.

#### Scenario: No Route Handlers exist under app/

- **WHEN** the command `find frontend/app -name 'route.ts' -o -name 'route.tsx'` is run
- **THEN** the command produces no output

#### Scenario: server-only guard preserved

- **WHEN** the first line of `frontend/lib/backend.ts` is read
- **THEN** the line content is exactly `import "server-only";`

---

### Requirement: Governance Documents SHALL Reflect Locked Styling Stack

The repository's governance documents SHALL reflect that Tailwind CSS 4, shadcn/ui (base-nova / neutral), and lucide-react are part of the locked technology stack, and that other CSS frameworks remain forbidden.

#### Scenario: AGENTS.md locks the styling stack

- **WHEN** the parent repository's `AGENTS.md` "锁定栈" table is read
- **THEN** it contains a row naming "Tailwind CSS 4", "shadcn/ui", and "lucide-react" as the style layer

#### Scenario: project.md tech-stack index lists the styling stack

- **WHEN** `openspec/project.md` "技术栈" section is read
- **THEN** it contains a line that names Tailwind CSS 4, shadcn/ui, and lucide-react

---

### Requirement: Existing Test Suite SHALL Remain Green

The introduction of the styling stack SHALL NOT break any pre-existing test in the frontend project.

#### Scenario: HelloMessage test still passes

- **WHEN** the command `npm test` is executed in `frontend/`
- **THEN** all existing tests report as passing
- **AND** the newly added integration test `components/ui/__tests__/button.test.tsx` reports as passing
