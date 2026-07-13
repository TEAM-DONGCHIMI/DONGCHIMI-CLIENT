# Component Spec: `RequiredMark`

## Purpose

`RequiredMark`는 필수 입력 필드 라벨 옆의 빨간색 `*`와 hover 안내 툴팁을 공통으로 제공합니다.
필수 여부와 native validation은 입력 컴포넌트가 소유하고, 이 컴포넌트는 필수 표시와 시각적 안내만 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/required-mark/RequiredMark.tsx`
- `TextInput required`의 visible label
- `AddableField required`의 visible label

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] 기존 `Tooltip`을 조합해 필수 입력 안내를 제공합니다.
- [x] 디자인 시스템 token으로 별표 색상과 typography를 표현합니다.
- [x] 입력 컴포넌트의 native `required` 동작을 변경하지 않습니다.

## UI Structure

```text
RequiredMark (span)
  mark "*" (aria-hidden)
  Tooltip (space=bottom)
```

## Props

### native span props

- type: `ComponentPropsWithRef<'span'>`에서 `children` 제외
- description: `className`, `ref`, `data-*`, `aria-*` 등 native span props를 root에 전달합니다.

`children`과 tooltip message는 public API로 열지 않습니다. 필수 표시와 안내 문구를 디자인 시스템에서 일관되게 유지합니다.

## States

- default: 빨간색 `*`만 표시합니다.
- hover: mark 기준 4px 위에 `* 표시는 필수로 입력해야 해요.` 툴팁을 한 줄로 표시합니다.
- disabled / loading / invalid/error: 별도 상태를 지원하지 않습니다.

## Behavior

1. pointer가 root에 진입하면 툴팁을 표시합니다.
2. pointer가 root를 벗어나면 툴팁을 숨깁니다.
3. 툴팁은 pointer event를 받지 않아 label/input 상호작용을 방해하지 않습니다.

## Styling

- mark: `typography['body-2-regular']`, `semantic.status.negative`
- layout: inline-flex, shrink 방지, mark 기준 relative positioning
- tooltip: mark 중심 정렬, `bottom: calc(100% + 4px)`, 한 줄 표시
- hover transition: opacity `120ms ease`

## Accessibility

- semantic element: 상호작용을 요구하지 않는 `span`
- mark: `aria-hidden="true"`; input의 native `required`가 필수 상태를 전달합니다.
- tooltip: 기존 `Tooltip`의 `role="tooltip"`을 사용합니다.
- keyboard interaction / focus-visible: 별도 keyboard interaction이나 focus target을 추가하지 않습니다.

## Storybook

- [x] Default
- [x] Hover
- [ ] Disabled / Loading / Invalid: 미지원

## Public API

- [x] `RequiredMark` value export
- [x] `RequiredMarkProps` type export
- [x] no private helper export

### Usage

```tsx
<RequiredMark />
```

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck`
- [ ] `pnpm --filter @dongchimi/design-system test`
- [ ] `pnpm --filter @dongchimi/design-system build`
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
