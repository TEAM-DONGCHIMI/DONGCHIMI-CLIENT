# Recipe: Add Design System Component

Use this when adding a public component to `packages/design-system`.

Detailed rules:

- `docs/architecture/design-system.md`
- `docs/architecture/design-system-components.md`
- `docs/architecture/design-system-component-plan.md`
- `docs/workflows/spec-writing.md`

## Flow

1. component가 design system에 속하는지 확인합니다.
   - product-agnostic
   - no app route, API data, product copy, logging, or analytics dependency
   - shared Figma component, foundational primitive, or real cross-app reuse
2. shared Figma component work라면 `docs/architecture/design-system-component-plan.md`에서 classification과 implementation order를 확인합니다.
3. component group을 선택합니다.
   - `ui`: product-agnostic UI primitives
   - `layout`: product-agnostic layout primitives
4. generator가 준비되면 `npm run gen:ds-component`로 scaffold를 만듭니다.
5. 생성된 `ComponentName.spec.md`를 먼저 채웁니다.
6. 가장 작은 stable public API를 구현합니다.
7. `ComponentName.stories.tsx`에 meaningful states와 variants를 추가합니다.
8. explicit exports와 public prop types를 검토합니다.
9. Storybook 또는 시각 검증을 실행합니다.
10. 검증을 실행합니다.

## Generator Usage

```bash
npm run gen:ds-component -- --args Button ui button
```

Argument order:

1. `componentName`: PascalCase component name
2. `category`: `ui` or `layout`
3. `componentFolder`: kebab-case folder name

## Generated Structure

```text
packages/design-system/src/components/{category}/{component-folder}/
  ComponentName.tsx
  ComponentName.spec.md
  ComponentName.stories.tsx
  index.ts
```

## Public API Check

Use explicit exports only:

```ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

Do not export private constants, style helpers, implementation hooks, internal utility functions, or internal state types.

## Storybook

Each public component story should cover the meaningful subset of:

- `Default`
- `Disabled`
- `Loading`
- `Invalid` or `Error`
- size and variant differences
- layout constraints such as width, wrapping, overflow, and responsive behavior

## Verification

```bash
git diff --check
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run build-storybook:design-system
```

package script가 없으면 실행하지 못한 이유를 기록합니다.
