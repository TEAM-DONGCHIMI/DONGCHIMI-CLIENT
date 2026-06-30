# Component Spec: `List`

## Purpose

`List`는 `ul`/`ol`/`li` semantic을 보존하면서 gap과 marker preset을 제공하는 layout primitive입니다.
interactive row, selected/disabled state, leading/trailing action 같은 rich row UI는 소유하지 않습니다.

## Usage Location

- `packages/design-system/src/components/layout/list/List.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] root는 `ul` 또는 `ol` semantic을 사용합니다.
- [x] item은 `li` semantic을 보존합니다.
- [x] `gap`, `marker`, `markerPosition`, native props를 제공합니다.
- [x] `List.Item` compound API로 item을 제공합니다.

## UI Structure

```text
List
  List.Item
  List.Item
```

## Props

### `List`

| prop             | type                            | required | description                      |
| ---------------- | ------------------------------- | -------- | -------------------------------- |
| `as`             | `'ul' \| 'ol'`                  | false    | root semantic element, 기본 `ul` |
| `gap`            | layout gap preset               | false    | list item 간격, 기본 `sm`        |
| `marker`         | `'none' \| 'disc' \| 'decimal'` | false    | marker style, 기본 `none`        |
| `markerPosition` | `'inside' \| 'outside'`         | false    | marker 위치, 기본 `outside`      |
| native props     | `ul`/`ol` native props          | false    | className, aria, children 등     |

### `List.Item`

| prop         | type              | required | description            |
| ------------ | ----------------- | -------- | ---------------------- |
| native props | `li` native props | false    | className, children 등 |

## States

- default: marker 없는 `ul`과 `li` item을 렌더링합니다.
- disabled/loading/invalid/error: 지원하지 않습니다. 상태 표현은 상위 UI component 책임입니다.

## Behavior

1. `as`가 없으면 `ul`로 렌더링합니다.
2. `gap` class를 root list에 적용합니다.
3. `marker`가 `none`이 아니면 marker와 marker position class를 적용합니다.
4. `List.Item`은 `li` element를 렌더링하고 native props를 전달합니다.

## Styling

- layout: native list flow
- spacing: `gap` preset
- responsive: 호출부 `className` escape hatch 사용
- hover/focus/disabled: 직접 제공하지 않습니다.
- token usage: spacing CSS variable fallback

## Accessibility

- semantic element: `ul`/`ol` + `li`
- accessible name: list에 이름이 필요하면 호출부가 `aria-label` 또는 `aria-labelledby`를 제공합니다.
- keyboard interaction: 없음
- focus-visible: 제거하지 않습니다.
- ARIA: native props로 전달합니다.

## Storybook

- [x] Default plain list
- [x] Ordered list with decimal marker
- [x] Long content wrapping

## Public API

- [x] `List` value export
- [x] `List.Item` compound value
- [x] `ListProps` type export
- [x] `ListItemProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
