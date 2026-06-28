# Component Spec: `Grid`

## Purpose

`Grid`는 반복되는 grid columns, auto-fit, gap, item alignment class를 제한된 prop API로 제공하는 layout primitive입니다.

## Usage Location

- `packages/design-system/src/components/layout/grid/Grid.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] `columns`, `autoFit`, `gap`, `align`, `justify`, `inline`을 prop으로 표현합니다.
- [x] responsive object API 대신 `autoFit` preset과 `className` escape hatch를 제공합니다.
- [x] spacing은 layout preset CSS variable fallback을 사용합니다.

## UI Structure

```text
Grid
  Content
```

## Props

| prop      | type                                        | required | description                                |
| --------- | ------------------------------------------- | -------- | ------------------------------------------ |
| `align`   | `'start' \| 'center' \| 'end' \| 'stretch'` | false    | grid item cross-axis 정렬, 기본 `stretch`  |
| `autoFit` | `'sm' \| 'md' \| 'lg'`                      | false    | `repeat(auto-fit, minmax(...))` preset     |
| `columns` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 12`          | false    | 고정 column 수, 기본 `1`                   |
| `gap`     | layout gap preset                           | false    | children 간 간격                           |
| `inline`  | `boolean`                                   | false    | `inline-grid` 사용 여부                    |
| `justify` | `'start' \| 'center' \| 'end' \| 'stretch'` | false    | grid item inline-axis 정렬, 기본 `stretch` |
| Box props | `Omit<BoxProps, 'display'>`                 | false    | semantic wrapper와 native props            |

## States

- default: 1-column grid를 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `inline`이면 `inline-grid`, 아니면 `grid`로 렌더링합니다.
2. `autoFit`이 있으면 auto-fit preset이 `columns`보다 우선합니다.
3. `autoFit`이 없으면 `columns` class map을 사용합니다.
4. align, justify, gap class를 적용합니다.

## Styling

- layout: grid display, columns/auto-fit, align, justify
- spacing: `gap` preset
- responsive: `autoFit` preset 또는 호출부 className
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: spacing CSS variable fallback

## Accessibility

- semantic element: `Box`의 `as`로 선택합니다.
- accessible name: 역할이 필요한 element를 선택했다면 호출부 책임입니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Default
- [x] Auto fit
- [x] Justified items

## Public API

- [x] `Grid` value export
- [x] `GridProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
