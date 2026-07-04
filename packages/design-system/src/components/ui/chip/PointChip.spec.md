# Component Spec: `PointChip`

## Purpose

`PointChip`은 이미지 배경 위에 할인율을 강조해 표시하는 디자인시스템 UI primitive입니다. 텍스트 중심의 [`Chip`](./Chip.spec.md), 상태 중심의 [`StatusChip`](./StatusChip.spec.md)과 달리 이미지 배지 위에 짧은 텍스트만 올립니다.

## Usage Location

- `packages/design-system/src/components/ui/chip/PointChip.tsx`

## Category

- `ui`

## Requirements

- 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- `color`/`variant`를 받지 않습니다 — 항상 동일한 이미지 배지 표현입니다.
- 기본 semantic은 비인터랙티브 `span`입니다.

## UI Structure

```text
PointChip
  Text
```

## Public API

```ts
interface PointChipProps extends ComponentPropsWithoutRef<'span'> {
  children: ReactNode;
  rounded?: boolean;
  size?: 'desktop' | 'mobile';
}
```

- `size`는 `desktop`/`mobile` 두 값만 받으며, 내부적으로 `pointDesktop`/`pointMobile` 크기로 변환됩니다.
- `PointChip` value export와 `PointChipProps` type export만 public으로 노출합니다.
- 내부 공유 렌더링은 `ChipBase`(비공개)가 담당하며 export하지 않습니다.

## States And Variants

- 배경 이미지(`assets/img-chips-point.svg`) 위에 할인율을 표시합니다.
- `size="desktop"`: 45px 정사각형.
- `size="mobile"`: 40px 정사각형.

## Usage Examples

| 용도             | Props            |
| ---------------- | ---------------- |
| 할인 칩(desktop) | `size="desktop"` |
| 할인 칩(mobile)  | `size="mobile"`  |

## Behavior

1. `PointChip`은 자체 클릭 동작을 갖지 않습니다.
2. 소비자가 넣는 `children`이 accessible text가 됩니다.

## Styling

- token 색상과 typography를 우선 사용합니다.
- desktop 45px, mobile 40px 정사각형 높이를 갖습니다.

## Accessibility

- semantic element: `span`
- accessible name: 텍스트 children
- keyboard interaction: 없음
- focus-visible: 없음

## Storybook

- `PointChips`

## Verification

- `git diff --check`
- `pnpm --filter @dongchimi/design-system typecheck`
- `pnpm --filter @dongchimi/design-system lint`
- `pnpm --filter @dongchimi/design-system build`
