# Component Spec: `Container`

## Purpose

`Container`는 페이지 또는 섹션 내부 content의 최대 폭과 좌우 gutter를 관리하는 layout primitive입니다.

## Usage Location

- `packages/design-system/src/components/layout/container/Container.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] `size`, `gutter`, `centered`를 prop으로 표현합니다.
- [x] width/gutter preset은 class map으로만 제공합니다.
- [x] spacing은 layout preset CSS variable fallback을 사용합니다.

## UI Structure

```text
Container
  Content
```

## Props

| prop       | type                                     | required | description                        |
| ---------- | ---------------------------------------- | -------- | ---------------------------------- |
| `centered` | `boolean`                                | false    | `margin-inline: auto`, 기본 `true` |
| `gutter`   | `'none' \| 'sm' \| 'md' \| 'lg'`         | false    | 좌우 padding preset, 기본 `md`     |
| `size`     | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | false    | 최대 폭 preset, 기본 `lg`          |
| Box props  | `Omit<BoxProps, 'display'>`              | false    | semantic wrapper와 native props    |

## States

- default: centered max-width container를 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. 항상 `width: 100%`를 적용합니다.
2. `centered=true`이면 inline axis 중앙 정렬을 적용합니다.
3. `size`와 `gutter` preset class를 적용합니다.

## Styling

- layout: width 100%, max-width preset, optional center align
- spacing: gutter preset
- responsive: `md`/`lg` gutter preset은 breakpoint padding을 포함합니다.
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
- [x] Narrow
- [x] No gutter

## Public API

- [x] `Container` value export
- [x] `ContainerProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
