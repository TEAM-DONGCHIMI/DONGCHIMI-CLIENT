# Component Spec: `IconButton`

## Purpose

`IconButton`은 텍스트 없이 아이콘만으로 동작을 표현하는 버튼 primitive입니다.
디자인시스템 안에서는 외형, native button 동작, disabled 상태, 접근 가능한 이름 계약만 책임집니다.
제품별 동작, 라우팅, 로깅, copy 선택은 호출부가 주입합니다.

## Usage Location

- `packages/design-system/src/components/ui/icon-button/IconButton.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 아이콘 전용 버튼이므로 `aria-label` 또는 `aria-labelledby` 중 하나를 필수로 받습니다.
- [x] Figma에서 확인된 `solid`, `outlined`, `ghost` 케이스를 지원합니다.
- [x] 현재 `develop`에는 컬러 token이 없어 Figma 근거값을 component-local style에만 캡슐화합니다.

## UI Structure

```text
IconButton
  button
    IconSlot
```

## Props

### icon

- type: `ReactNode`
- required: `true`
- description: 버튼 안에 표시할 아이콘입니다. 아이콘은 장식 요소로 감싸져 accessible name에는 포함하지 않습니다.

### aria-label / aria-labelledby

- type: `string`
- required: `true` 중 하나
- description: 텍스트가 없는 버튼의 접근 가능한 이름입니다.

### variant

- type: `RecipeVariantProps<typeof iconButton>['variant']`
- default: `'solid'`
- description: 채움, 외곽선, 또는 배경/테두리 없는 버튼 표현입니다.

### color

- type: `RecipeVariantProps<typeof iconButton>['color']`
- default: `'primary'`
- description: Figma에서 확인된 primary, assistive, negative 색상 표현입니다.

### size

- type: `RecipeVariantProps<typeof iconButton>['size']`
- default: `'large'`
- description: 현재 Figma 기준 40px 버튼만 지원합니다. `solid`, `outlined`는 20px 아이콘 슬롯, `ghost`는 24px 아이콘 슬롯을 사용합니다.

### native button props

- type: `ComponentPropsWithoutRef<'button'>`
- description: `children`, `color`, accessible name props를 제외한 native button props를 전달합니다.

## States

- default: `variant`, `color`, `size`에 맞는 아이콘 버튼을 렌더링합니다.
- disabled: native `disabled`를 사용하며 pointer interaction을 막고 opacity를 낮춥니다.
- loading: 지원하지 않습니다.
- invalid/error: 별도 상태 prop은 지원하지 않고 `color='negative'`로 위험 동작을 표현합니다.

## Behavior

1. 기본 `type`은 `button`입니다.
2. 호출부가 전달한 `onClick`, `onFocus`, `disabled` 등 native button 동작을 그대로 사용합니다.
3. 아이콘은 `aria-hidden='true'` 슬롯 안에 렌더링하고, accessible name은 `aria-label` 또는 `aria-labelledby`로 제공합니다.

## Styling

- layout: inline-flex 버튼입니다.
- radius: Figma `rounded=false` 케이스 기준 12px입니다.
- size: large 기준 width 40px, height 40px입니다.
- icon: `solid`, `outlined`는 20px, `ghost`는 24px 슬롯입니다.
- variants: `solid`, `outlined`, `ghost`
- colors: `primary`, `assistive`, `negative`
- color/variant matrix: `primary`, `assistive`, `negative`와 `solid`, `outlined`, `ghost` 조합을 렌더링할 수 있습니다.
- ghost: 배경과 테두리를 렌더링하지 않습니다.
- focus/disabled: `focus-visible` outline, disabled opacity를 제공합니다.
- token usage: DCMFE-35 token merge 전까지 Figma 색상값을 `IconButton.css.ts`에만 둡니다.

## Accessibility

- semantic element: `button`
- accessible name: `aria-label` 또는 `aria-labelledby` 필수
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: outline 유지
- ARIA: 아이콘 슬롯은 `aria-hidden='true'`

## Storybook

- [x] Primary solid
- [x] Assistive outlined
- [x] Negative outlined
- [x] Assistive ghost
- [x] `aria-labelledby` accessible name example
- [x] Disabled
- [x] Full variant/color matrix

## Public API

- [x] `IconButton` value export
- [x] `IconButtonProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
