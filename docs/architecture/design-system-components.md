# Design System Components

이 문서는 `packages/design-system` public component를 추가하거나 변경할 때 따르는 세부 기준입니다.

## Structure

새 component scaffold는 `pnpm gen:ds-component`를 사용합니다.

```text
packages/design-system/src/components/{ui|layout}/{component-folder}/
  ComponentName.tsx
  ComponentName.spec.md
  ComponentName.stories.tsx
  index.ts
```

Naming convention:

- folder: `kebab-case`
- component file: `PascalCase.tsx`
- spec file: `PascalCase.spec.md`
- story file: `PascalCase.stories.tsx`

명시적 export만 사용하고 `export *`는 피합니다.

## Component Groups

### `components/ui`

제품 의미를 모르는 UI primitive를 둡니다.

Examples:

- `Button`
- `TextField`
- `Checkbox`
- `Chip`
- `Dialog`
- `Tabs`

### `components/layout`

제품 의미를 모르는 배치 primitive를 둡니다.

Examples:

- `Box`
- `Flex`
- `Stack`
- `Grid`
- `Inline`
- `Center`
- `Container`

동치미 홈 섹션, 예약 카드, 관리자 대시보드 레이아웃처럼 제품 맥락이 있는 컴포넌트는 앱 내부에 둡니다.

## Promotion Criteria

앱 로컬 컴포넌트를 디자인시스템으로 승격할 수 있는 경우:

- 두 개 이상의 앱에서 동일한 API와 동작으로 재사용합니다.
- Figma design-system component와 직접 대응됩니다.
- 컴포넌트가 제품 copy, route, API, logging에 의존하지 않습니다.
- 접근성, 상태, interaction contract를 패키지 차원에서 보장할 필요가 있습니다.

승격하지 않는 경우:

- 한 앱의 한 페이지에서만 사용합니다.
- 겉모양은 비슷하지만 제품별 후속 동작이 다릅니다.
- copy, route, API response shape, analytics event가 제품마다 다를 가능성이 큽니다.
- shared로 올리면 호출부 영향 범위를 빠르게 열거하기 어렵습니다.

## Public API

- `export *`를 사용하지 않습니다.
- public component와 public prop type만 export합니다.
- public component의 `ComponentNameProps`는 기본적으로 export합니다.
- internal helper, style helper, private constant는 export하지 않습니다.
- React 19 기준 새 컴포넌트는 `forwardRef`로 감싸지 않고, 필요한 경우 `ComponentPropsWithRef` 기반 `ref` prop을 직접 열어둡니다.

Preferred:

```ts
export { Button } from './button';
export type { ButtonProps } from './button';
```

## Spec

디자인시스템 public component는 spec을 필수로 둡니다.

- spec 위치는 component 가까이에 둡니다.
- template은 `templates/component.spec.md`를 사용합니다.
- spec에는 purpose, usage, public API, props, states, behavior, styling, accessibility, verification을 포함합니다.
- public props나 interaction이 바뀌면 spec도 함께 갱신합니다.

## Storybook

새 공통 컴포넌트는 `ComponentName.stories.tsx`를 실제 검증 가능한 story로 채웁니다.

- `Default`는 반드시 둡니다.
- public API가 지원하는 경우 `Disabled`, `Loading`, `Invalid` 또는 `Error`를 둡니다.
- size, variant, tone 조합은 matrix로 확인할 수 있게 합니다.
- 긴 텍스트, wrapping, overflow, width constraint가 의미 있으면 별도 story를 둡니다.
- story 안에 app route, API data, product copy, logging, analytics를 넣지 않습니다.

## Styling And Tokens

- 사용 가능한 token이나 CSS variable이 있으면 hard-coded value보다 우선합니다.
- Tailwind 또는 styling system은 실제 package가 정해진 뒤 이 문서를 갱신합니다.
- component-local `*.css.ts` style은 구현 파일에서 `import * as S from './ComponentName.css'` 형태로 가져옵니다.
- JSX에서는 `S.rootClassName`, `S.triggerClassName`처럼 style namespace를 통해 참조합니다.
- 새 컴포넌트와 수정 중인 컴포넌트는 named style import를 추가하지 않고 `S` namespace 방식으로 정리합니다.

Preferred:

```tsx
import * as S from './Button.css';

<button className={cn(S.buttonClassName, className)} />;
```

Avoid:

```tsx
import { buttonClassName } from './Button.css';

<button className={cn(buttonClassName, className)} />;
```

## Accessibility

- button 역할은 `button` 요소를 사용합니다.
- 텍스트가 없는 interactive element는 accessible name을 가집니다.
- focus-visible을 제거하지 않습니다.
- keyboard interaction이 있는 컴포넌트는 spec과 story에 확인 방법을 남깁니다.

## Verification

```bash
pnpm --filter @dongchimi/design-system lint
pnpm --filter @dongchimi/design-system typecheck
pnpm --filter @dongchimi/design-system test
pnpm --filter @dongchimi/design-system build
pnpm --filter @dongchimi/design-system build-storybook
git diff --check
```
