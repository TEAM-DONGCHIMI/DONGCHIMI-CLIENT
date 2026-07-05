# Component Spec: `Tooltip`

## Purpose

`Tooltip`은 특정 요소 옆에 짧은 보조 설명을 띄우는 말풍선 표현 컴포넌트입니다.
디자인시스템 안에서는 말풍선 외형(배경, radius, padding, blur)과 방향 화살표(`space`),
텍스트 slot만 책임집니다.
열림/닫힘, hover/focus 트리거, 대상 요소 기준 위치 계산은 호출부가 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/tooltip/Tooltip.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node `703:8182`(space=top) / `703:8165`(space=bottom)를 기준으로 합니다.

## UI Structure

```text
Tooltip (div, role="tooltip")
  arrow (space=top일 때 버블 위)
  bubble
    label (children)
  arrow (space=bottom일 때 버블 아래)
```

## Props

### children

- type: `string`
- required: `true`
- description: 말풍선 안에 렌더링되는 텍스트입니다. 순수 텍스트 slot이라 `string`으로 좁혀 두며,
  강조/링크/아이콘 요구가 생기면 그때 `ReactNode`로 넓힙니다(좁은→넓은 확장은 비파괴적).

### space

- type: `'top' | 'bottom'`
- required: `false`
- default: `'top'`
- description: 화살표 위치입니다. `top`은 버블 위(대상이 위에 있을 때), `bottom`은 버블 아래에 화살표를 둡니다.

### native div props

- type: `ComponentPropsWithRef<'div'>`
- description: `className`, `ref`를 포함한 native div props를 전달합니다. `ref`는 루트 `div`로
  전달되며, 기본 `role="tooltip"`은 native props로 오버라이드할 수 있습니다.

## States

- default: `space` 방향의 화살표와 함께 텍스트 말풍선을 표시합니다.
- disabled / loading / invalid/error: 지원하지 않습니다 (표현 전용 컴포넌트).

## Behavior

1. `space`에 따라 화살표를 버블 위 또는 아래에 배치합니다.
2. 긴 텍스트는 `max-width 256px` 내에서 `word-break`로 줄바꿈합니다.
3. 열림/닫힘, 트리거 연결, 위치 계산은 호출부 책임입니다.

## Styling

- layout: `flex` column, `align-items: stretch`, 화살표는 가로 중앙 정렬.
- surface: 배경 `atomic.neutral[70]`, radius `8px`, `overflow: clip`, `backdrop-filter: blur(32px)`.
- spacing: 버블 padding `0.8rem 1.2rem`(8px 12px), `min-width 164px`.
- text: `typography['caption-1-medium']`, 색상 `atomic.common[0]`(white), `word-break: break-word`, `max-width 256px`.
- arrow: `20×8`, 버블과 동일 색(`atomic.neutral[70]`), `space=bottom`은 `rotate(180deg)`.
- token usage: 색상은 `atomic`, 텍스트는 `typography` token을 사용합니다. (신규 token 추가 없음)

## Accessibility

- semantic element: `div` 컨테이너.
- role: 기본 `role="tooltip"`을 부여하되 호출부가 오버라이드할 수 있습니다.
- accessible name: 텍스트 children이 접근 가능한 이름을 제공합니다.
- keyboard interaction: 자체 상호작용 없음 (트리거는 호출부).
- focus-visible: 자체 포커스 없음.

## Public API

- [x] `Tooltip` value export
- [x] `TooltipProps` type export
- [x] no private helper export

### Usage

```tsx
// 화살표 위 (대상 아래에 표시)
<Tooltip space="top">메시지에 마침표를 찍어요.</Tooltip>

// 화살표 아래 (대상 위에 표시)
<Tooltip space="bottom">메시지에 마침표를 찍어요.</Tooltip>
```

## Storybook

- [x] Default (space top)
- [x] SpaceBottom
- [x] LongText (256px overflow 줄바꿈)
- [ ] Disabled / Loading / Invalid: 미지원

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
