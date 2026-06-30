# Component Spec: `Inline`

## Purpose

`Inline`은 버튼 그룹, chip 목록, meta 정보처럼 가로로 나열되고 필요하면 줄바꿈되는 children 배치를 위한 layout primitive입니다.

## Usage Location

- `packages/design-system/src/components/layout/inline/Inline.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] 내부 구현은 `Flex`를 조합합니다.
- [x] gap, align, justify, wrap만 public contract로 둡니다.
- [x] spacing은 layout preset CSS variable fallback을 사용합니다.

## UI Structure

```text
Inline
  Content
```

## Props

| prop       | type                                         | required | description                     |
| ---------- | -------------------------------------------- | -------- | ------------------------------- |
| `align`    | Flex align                                   | false    | cross-axis 정렬, 기본 `center`  |
| `gap`      | layout gap                                   | false    | children 간 간격, 기본 `sm`     |
| `justify`  | Flex justify                                 | false    | main-axis 정렬                  |
| `wrap`     | `boolean`                                    | false    | 줄바꿈 여부, 기본 `true`        |
| Flex props | `Omit<FlexProps, direction/gap/inline/wrap>` | false    | semantic wrapper와 native props |

## States

- default: wrapping 가능한 row layout을 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. 항상 `Flex direction='row'`로 렌더링합니다.
2. `wrap=true`이면 wrapping을 허용합니다.
3. `gap`, `align`, `justify`는 `Flex` preset으로 전달합니다.

## Styling

- layout: `Flex direction='row'`
- spacing: `gap` preset
- responsive: wrapping으로 긴 row를 완화합니다.
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
- [x] No wrap
- [x] Justified

## Public API

- [x] `Inline` value export
- [x] `InlineProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
