# Component Spec: `Box`

## Purpose

`Box`는 디자인시스템 layout primitive의 가장 낮은 semantic wrapper입니다.
반복되는 `div`, `section`, `main` 같은 wrapper 선택과 최소 display 제어를 제품 의미 없이 제공합니다.

## Usage Location

- `packages/design-system/src/components/layout/box/Box.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] `as`, `display`, `className`, native div props만 public contract로 둡니다.
- [x] semantic element는 호출부가 `as`로 선택합니다.
- [x] private class map은 export하지 않습니다.

## UI Structure

```text
Box
  Content
```

## Props

| prop             | type                              | required | description                     |
| ---------------- | --------------------------------- | -------- | ------------------------------- |
| `as`             | `ElementType`                     | false    | 렌더링할 HTML element/component |
| `display`        | `'block' \| 'inlineBlock'`        | false    | 최소 display preset             |
| `className`      | `string`                          | false    | 호출부 className escape hatch   |
| native div props | `ComponentPropsWithoutRef<'div'>` | false    | 기본 HTML 속성                  |

## States

- default: semantic wrapper를 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `as`가 없으면 `div`로 렌더링합니다.
2. `display`가 있으면 해당 display class를 적용합니다.
3. `className`은 내부 display class 뒤에 합성합니다.

## Styling

- layout: optional display preset
- spacing: 직접 제공하지 않습니다.
- responsive: 호출부 className 또는 상위 layout primitive 책임입니다.
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: 없음

## Accessibility

- semantic element: 호출부가 `as`로 선택합니다.
- accessible name: 역할이 필요한 element를 선택했다면 호출부 책임입니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Default
- [x] Semantic element
- [x] Inline block

## Public API

- [x] `Box` value export
- [x] `BoxProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
