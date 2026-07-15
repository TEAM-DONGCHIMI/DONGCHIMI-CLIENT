# Component Spec: `Flex`

## Purpose

`Flex`는 반복되는 flex direction, alignment, justify, gap, wrap 조합을 제한된 prop API로 제공하는 layout primitive입니다.

## Usage Location

- `packages/design-system/src/components/layout/flex/Flex.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] `direction`, `align`, `justify`, `gap`, `wrap`, `inline`을 prop으로 표현합니다.
- [x] 내부 구현은 `Box`를 조합합니다.
- [x] spacing은 layout preset CSS variable fallback을 사용합니다.

## UI Structure

```text
Flex
  Content
```

## Props

| prop        | type                                                                | required | description                     |
| ----------- | ------------------------------------------------------------------- | -------- | ------------------------------- |
| `align`     | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'`           | false    | cross-axis 정렬, 기본 `stretch` |
| `direction` | `'row' \| 'column' \| 'row-reverse' \| 'column-reverse'`            | false    | flex 방향, 기본 `row`           |
| `gap`       | `'none' \| '2xs' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'`  | false    | children 간 간격                |
| `inline`    | `boolean`                                                           | false    | `inline-flex` 사용 여부         |
| `justify`   | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | false    | main-axis 정렬, 기본 `start`    |
| `wrap`      | `'nowrap' \| 'wrap' \| 'wrap-reverse'`                              | false    | wrapping, 기본 `nowrap`         |
| Box props   | `Omit<BoxProps, 'display'>`                                         | false    | semantic wrapper와 native props |

## States

- default: `display: flex`로 children을 배치합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `inline`이면 `inline-flex`, 아니면 `flex`로 렌더링합니다.
2. direction, align, justify, wrap class를 항상 적용합니다.
3. `gap`이 있으면 preset gap class를 적용합니다.
4. `className`은 내부 layout class 뒤에 합성합니다.

## Styling

- layout: flex display, direction, align, justify, wrap
- spacing: `gap` preset
- responsive: 호출부 className 또는 상위 composition 책임입니다.
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
- [x] Column
- [x] Space between
- [x] Wrapped

## Public API

- [x] `Flex` value export
- [x] `FlexProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
