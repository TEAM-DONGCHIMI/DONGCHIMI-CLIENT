# Component Spec: `GridItem`

## Purpose

`GridItem`은 `Grid` 내부 child의 column/row placement만 담당하는 layout primitive입니다.
Grid container API와 충돌하지 않도록 item-level placement prop만 제공합니다.

## Usage Location

- `packages/design-system/src/components/layout/grid-item/GridItem.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] `Grid` container와 조합 가능한 item placement API를 제공합니다.
- [x] 1차 범위는 `colSpan`, `rowSpan`, `colStart`로 제한합니다.
- [x] row wrapper 또는 rich row UI를 만들지 않습니다.
- [x] DOM semantic은 `Box`의 `as`와 native props로 호출부가 선택합니다.

## UI Structure

```text
GridItem
  Content
```

## Props

| prop       | type                                                          | required | description                        |
| ---------- | ------------------------------------------------------------- | -------- | ---------------------------------- |
| `colSpan`  | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 12 \| 'full'`                  | false    | `grid-column` span 또는 full width |
| `rowSpan`  | `1 \| 2 \| 3 \| 4 \| 5 \| 6`                                  | false    | `grid-row` span                    |
| `colStart` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12` | false    | `grid-column-start` 위치           |
| Box props  | `Omit<BoxProps, 'display'>`                                   | false    | semantic wrapper와 native props    |

## States

- default: placement prop이 없으면 child wrapper만 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `colSpan`이 있으면 column span class를 적용합니다.
2. `rowSpan`이 있으면 row span class를 적용합니다.
3. `colStart`가 있으면 column start class를 적용합니다.
4. native props와 `className`을 root element에 전달합니다.

## Styling

- layout: grid item placement
- spacing: 직접 제공하지 않습니다. 간격은 `Grid` gap 책임입니다.
- responsive: 호출부 `className` escape hatch 사용
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: 없음

## Accessibility

- semantic element: 기본 `div`, `as`로 변경 가능
- accessible name: 역할이 필요한 element를 선택했다면 호출부 책임입니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Column span
- [x] Full width
- [x] Column start

## Public API

- [x] `GridItem` value export
- [x] `GridItemProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
