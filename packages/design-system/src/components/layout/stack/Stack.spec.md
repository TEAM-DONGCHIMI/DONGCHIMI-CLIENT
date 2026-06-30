# Component Spec: `Stack`

## Purpose

`Stack`은 일정한 간격으로 children을 세로 또는 가로로 쌓는 layout primitive입니다.
기본 방향은 vertical이며 반복되는 column + gap 패턴을 줄입니다.

## Usage Location

- `packages/design-system/src/components/layout/stack/Stack.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] 내부 구현은 `Flex`를 조합합니다.
- [x] vertical/horizontal direction만 public contract로 둡니다.
- [x] spacing은 layout preset CSS variable fallback을 사용합니다.

## UI Structure

```text
Stack
  Content
```

## Props

| prop        | type                                         | required | description                     |
| ----------- | -------------------------------------------- | -------- | ------------------------------- |
| `align`     | Flex align preset                            | false    | cross-axis 정렬                 |
| `direction` | `'horizontal' \| 'vertical'`                 | false    | 흐름 방향, 기본 `vertical`      |
| `gap`       | layout gap preset                            | false    | children 간 간격, 기본 `md`     |
| `justify`   | Flex justify preset                          | false    | main-axis 정렬                  |
| `wrap`      | `boolean`                                    | false    | horizontal wrapping             |
| Flex props  | `Omit<FlexProps, direction/gap/inline/wrap>` | false    | semantic wrapper와 native props |

## States

- default: vertical stack을 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `direction='vertical'`이면 `Flex direction='column'`으로 렌더링합니다.
2. `direction='horizontal'`이면 `Flex direction='row'`로 렌더링합니다.
3. `wrap`은 `Flex`의 wrap preset으로 변환합니다.

## Styling

- layout: `Flex` 조합
- spacing: `gap` preset
- responsive: 호출부 className 또는 상위 composition 책임입니다.
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: spacing CSS variable fallback

## Accessibility

- semantic element: `Flex`/`Box`의 `as`로 선택합니다.
- accessible name: 역할이 필요한 element를 선택했다면 호출부 책임입니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Default
- [x] Horizontal
- [x] Wrapped

## Public API

- [x] `Stack` value export
- [x] `StackProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
