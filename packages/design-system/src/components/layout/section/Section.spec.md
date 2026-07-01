# Component Spec: `Section`

## Purpose

`Section`은 page 또는 content section의 semantic wrapper와 vertical spacing preset을 제공하는 layout primitive입니다.
제품 도메인 의미, route, heading 구조 자체는 소유하지 않고 section element와 spacing class만 제공합니다.

## Usage Location

- `packages/design-system/src/components/layout/section/Section.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] 기본 semantic element는 `section`입니다.
- [x] `as`, `spacing`, `className`, native props를 제공합니다.
- [x] spacing은 layout preset CSS variable fallback을 사용합니다.
- [x] Container와 조합 가능하도록 width/max-width 책임을 갖지 않습니다.

## UI Structure

```text
Section
  Content
```

## Props

| prop      | type                             | required | description                               |
| --------- | -------------------------------- | -------- | ----------------------------------------- |
| `as`      | `ElementType`                    | false    | 렌더링할 semantic element, 기본 `section` |
| `spacing` | `'none' \| 'sm' \| 'md' \| 'lg'` | false    | vertical padding preset, 기본 `md`        |
| Box props | `Omit<BoxProps, 'display'>`      | false    | className, children, aria/native props    |

## States

- default: `section` element와 `md` spacing을 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `as`가 없으면 `section`으로 렌더링합니다.
2. `spacing` preset에 따라 `padding-block` class를 적용합니다.
3. native props와 `className`을 root element에 전달합니다.

## Styling

- layout: block semantic wrapper
- spacing: `none`, `sm`, `md`, `lg` vertical padding preset
- responsive: 호출부 `className` escape hatch 사용
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: spacing CSS variable fallback

## Accessibility

- semantic element: 기본 `section`, `as`로 변경 가능
- accessible name: `section`을 landmark로 노출해야 하면 호출부가 `aria-label` 또는 `aria-labelledby`를 제공합니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Default
- [x] Compact spacing
- [x] No spacing
- [x] `as='article'`

## Public API

- [x] `Section` value export
- [x] `SectionProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
