# Component Spec: `MarketCard`

## Metadata

- App: `client`
- Category: `ui`
- Path: `apps/client/src/shared/components/ui/market-card/MarketCard.tsx`
- Status: Implemented

## Purpose

- 모바일 화면에서 상품 이미지, 상품명, 가격, 할인 chip을 썸네일 카드 형태로 보여줍니다.
- `MartSummaryCard`와 마트 상세/목록 영역에서 상품을 빠르게 훑어볼 때 재사용할 수 있도록 앱 shared UI로 둡니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.
- [x] `small`, `medium` size variant를 제공합니다.
- [x] 이미지는 사용부에서 `imageSrc`로 주입합니다.
- [x] 할인 chip은 공통 컴포넌트가 준비되기 전까지 CSS로 임시 구현하고 코드 TODO를 남깁니다.

## Props

- `productName: string`: 카드 하단에 표시할 상품명입니다.
- `price: string`: 카드 하단에 표시할 가격 텍스트입니다.
- `hasSaleChip?: boolean`: `true`이면 우상단 할인 chip을 표시합니다. 기본값은 `false`입니다.
- `imageAlt: string`: 상품 이미지 대체 텍스트입니다.
- `imageSrc: string`: 상품 이미지 경로입니다.
- `size?: RecipeVariantProps<typeof marketCard>['size']`: 카드 크기입니다. 기본값은 `medium`입니다.
- `saleChipLabel?: string`: 할인 chip 안에 표시할 텍스트입니다. 기본값은 `10%`입니다.
- `className`과 `article` native props는 레이아웃 조정 범위에서만 사용합니다.

## States

- default: 이미지, 상품명, 가격을 표시합니다.
- sale chip: `hasSaleChip`이 `true`이면 우상단에 임시 CSS chip을 표시합니다.
- disabled: 이 컴포넌트 자체는 액션을 갖지 않으므로 별도 disabled 상태를 제공하지 않습니다.
- loading: 상위 카드 또는 화면에서 skeleton으로 처리합니다.
- error: 상위 데이터 영역에서 처리합니다.
- overflow: 긴 상품명과 가격은 한 줄 ellipsis로 줄입니다.

## Accessibility

- 상품 이미지를 설명할 수 있도록 `imageAlt`를 필수로 받습니다.
- 카드 자체는 route 이동, API, analytics side effect를 갖지 않습니다.
- 상위에서 클릭 가능한 상품 링크로 사용할 경우 상위 컴포넌트가 interactive wrapper와 accessible name을 책임집니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
