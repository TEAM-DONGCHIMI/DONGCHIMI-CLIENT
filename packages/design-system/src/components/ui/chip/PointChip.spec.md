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
- 배경 SVG는 `?url` asset import로 소비합니다.
- `apps/client` 개발 번들은 SVG를 data URL로 인라인하고, production 번들은 외부 이미지 asset으로 방출합니다.
- Storybook과 Vite 기반 소비 앱은 렌더링 가능한 asset URL 또는 data URL로 해석해야 합니다.
- 모든 번들 결과의 CSS는 JavaScript 모듈 래퍼나 존재하지 않는 경로가 아닌 렌더링 가능한 SVG를 가리켜야 합니다.

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
- `pnpm --filter @dongchimi/design-system build-storybook`
- `pnpm --filter client dev`
- `pnpm --filter client build`
- `pnpm --filter market-owner build`
- client 개발 CSS의 PointChip `background-image`가 `data:image/svg+xml`로 시작하고 정적 media 404가 없는지 확인
- client 생성 CSS의 PointChip `background-image` 대상이 `<svg`로 시작하는 실제 SVG인지 확인
