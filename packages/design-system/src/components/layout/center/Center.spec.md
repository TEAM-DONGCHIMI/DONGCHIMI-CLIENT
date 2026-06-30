# Component Spec: `Center`

## Purpose

`Center`는 children을 수평/수직 중앙에 배치하는 layout primitive입니다.
empty, fallback, isolated preview처럼 제품 의미 없는 중앙 정렬 surface에 사용합니다.

## Usage Location

- `packages/design-system/src/components/layout/center/Center.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] `inline`, `minHeight`만 Center-specific public contract로 둡니다.
- [x] 내부 구현은 `Box`와 grid display class를 조합합니다.
- [x] 상태 표현은 호출부 책임입니다.

## UI Structure

```text
Center
  Content
```

## Props

| prop        | type                        | required | description                     |
| ----------- | --------------------------- | -------- | ------------------------------- |
| `inline`    | `boolean`                   | false    | `inline-grid` 사용 여부         |
| `minHeight` | `'full' \| 'screen'`        | false    | 최소 높이 preset                |
| Box props   | `Omit<BoxProps, 'display'>` | false    | semantic wrapper와 native props |

## States

- default: children을 중앙 정렬합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `inline`이면 `inline-grid`, 아니면 `grid`로 렌더링합니다.
2. `place-items: center`를 적용합니다.
3. `minHeight`가 있으면 preset 최소 높이를 적용합니다.

## Styling

- layout: grid display, `place-items: center`
- spacing: 직접 제공하지 않습니다.
- responsive: 호출부 className 또는 상위 composition 책임입니다.
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: 없음

## Accessibility

- semantic element: `Box`의 `as`로 선택합니다.
- accessible name: 역할이 필요한 element를 선택했다면 호출부 책임입니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Default
- [x] Screen height
- [x] Inline

## Public API

- [x] `Center` value export
- [x] `CenterProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
