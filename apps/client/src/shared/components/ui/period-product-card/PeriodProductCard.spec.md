# Component Spec: `PeriodProductCard`

## Metadata

- App: `client`
- Category: `ui`
- Path: `apps/client/src/shared/components/ui/period-product-card/PeriodProductCard.tsx`
- Status: Draft
- Jira: `DCMCL-6`
- Figma: `APPJAM`, node `277:25283`

## Purpose

- `PeriodProductCard`는 사용자 사이트에서 기간 한정 상품을 작은 모바일 카드 형태로 보여주는 app shared UI입니다.
- 상품 이미지, 상품명, 가격만 표시하며 route, API, analytics, 상품 상세 이동 정책은 직접 소유하지 않습니다.
- 여러 client 화면에서 같은 표현으로 재사용할 수 있도록 최소 props만 공개합니다.

## Requirements

- [x] `apps/client/src/shared/components/ui` 하위 app shared component로 둡니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props는 상품 이미지, 상품명, 가격, 선택적 클릭 핸들러로 제한합니다.
- [x] 상품명은 최대 2줄까지 노출하고 초과하면 말줄임 처리합니다.
- [x] 이미지가 없으면 정해진 이미지 영역 안에 fallback surface를 표시합니다.
- [x] 클릭 가능한 카드로 사용하는 경우 native `button`과 focus-visible 상태를 제공합니다.

## Props

- `productName: string`: 표시할 상품명입니다. 2줄 초과 시 line-clamp 처리합니다.
- `priceText: string`: 표시할 가격 숫자 문자열입니다. 컴포넌트가 `원` 단위를 붙입니다.
- `imageSrc?: string`: 상품 이미지 URL입니다. 없거나 빈 문자열이면 fallback surface를 표시합니다.
- `imageAlt?: string`: 상품 이미지 대체 텍스트입니다. 없으면 `${productName} 상품 이미지`를 사용합니다.
- `onClick?: MouseEventHandler<HTMLButtonElement>`: 전달되면 root를 `button`으로 렌더링합니다.
- `className?: string`: 호출부의 배치 조정을 위해 root에 추가 class를 병합합니다.
- `id?: string`: root 식별자가 필요할 때 사용합니다.
- `aria-*`: 클릭 가능 상태의 accessible name 보강처럼 접근성 속성이 필요할 때만 전달합니다.
- `children`은 받지 않습니다. 내부 구조와 overflow 정책을 컴포넌트가 고정합니다.

## States

- default: 이미지, 상품명, 가격을 표시합니다.
- clickable: `onClick`이 있으면 native `button`으로 렌더링하고 접근 가능한 이름과 focus-visible outline을 제공합니다.
- no image: 이미지 영역 크기를 유지하며 neutral fallback surface를 표시합니다.
- long product name: 상품명은 최대 2줄까지만 표시합니다.
- long price: 가격은 한 줄을 유지하고 카드 폭을 넘으면 ellipsis 처리합니다.
- disabled / loading / error: 지원하지 않습니다. 상위 API UI 또는 섹션에서 처리합니다.

## Styling Constraints

- root width는 Figma 기준 `94px`에 맞춘 `9.4rem`입니다.
- image frame은 `9.4rem x 9.4rem`, radius `12px`, `object-fit: cover`를 사용합니다.
- product name은 `typography['caption-1-medium']`과 `atomic.neutral[70]`을 사용합니다.
- price는 `typography['body-3-semibold']`와 `atomic.neutral[90]`을 사용합니다.
- root는 부모 layout을 밀지 않도록 `minWidth: 0`과 고정된 카드 폭을 유지합니다.

## Accessibility

- 클릭 가능 상태는 native `button`으로 렌더링합니다.
- `aria-label`이 없으면 `${productName} 상품 선택`을 버튼의 accessible name으로 사용합니다.
- 이미지 alt가 없으면 `${productName} 상품 이미지`를 사용합니다.
- 클릭 불가 상태는 정적 `div`로 렌더링하며 keyboard/focus 동작을 제공하지 않습니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build-storybook`
