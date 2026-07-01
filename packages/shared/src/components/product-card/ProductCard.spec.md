# Component Spec: `ProductCard`

## Metadata

- Jira: `DCMFE-46`
- Component: `ProductCard`
- Owner: `packages/shared`
- Status: Implemented

## Purpose

`ProductCard`는 사용자 웹과 사장님 웹에서 공통으로 사용할 상품 목록 카드입니다.
상품 도메인 presentational UI를 담당하되, app route, API, query, logging, analytics,
mutation 책임은 갖지 않습니다.

## Source Of Truth

- Figma: `APPJAM` 홈 상품 카드, node `230:1177`
- Variants:
  - `home_productcard`: `platform=desktop, Load more=none`, `platform=mobile, Load more=down`, `platform=mobile, Load more=up`
  - `home_productlist`: `Category=Today`, `Category=Period`
- Related decision: design-system primitive가 아니라 `packages/shared` 도메인 presentational component로 둡니다.

## Scope

- `packages/shared` React UI package public component로 제공합니다.
- `ProductCard` public component와 `ProductCardProps`, `ProductCardItemTypes` public type을 export합니다.
- `ProductItem` 구현은 `ProductCard` 내부 전용으로 둡니다.
- `initialVisibleCount`로 desktop `4`, mobile `2` 같은 초기 노출 개수를 호출부에서 제어합니다.
- `today` item은 상품 이미지, 상품명, 판매가, 정가, 할인 badge를 표시합니다.
- `period` item은 순위, 상품 이미지, 상품명, 가격을 표시합니다.
- `actionSlot`이 없고 숨겨진 item이 있으면 내부 더보기/접기 버튼을 제공합니다.
- shared Storybook에서 desktop, mobile, period ranking, empty, actionSlot 사용 예시를 제공합니다.

## Out Of Scope

- `apps/client` 페이지 적용
- `apps/market-owner` 페이지 적용
- 상품 API, query key, cache invalidation
- 상품 상세, 전단, 외부 링크 등 route/navigation 연결
- analytics, logging, 권한 또는 앱 역할 분기
- 상품 수정, 삭제, 장바구니 등 mutation 동작

## UI Structure

```text
ProductCard(section)
  Header
    Title
    Total count
  List(ul)
    ProductItem(li)
      button
        Image or placeholder
        Product name
        Price
        Original price or rank
        Discount badge
  Footer
    actionSlot or expand/collapse button
```

## Public API

- component: `ProductCard`
- exported types: `ProductCardProps`, `ProductCardItemTypes`
- props:
  - `title`: header title
  - `totalCount`: optional count. Undefined이면 `items.length`를 사용합니다.
  - `items`: normalized presentational item list
  - `initialVisibleCount`: 초기 노출 개수. app 역할을 나타내는 `isOwner` 대신 호출부가 숫자를 주입합니다.
  - `itemVariant`: `today` 또는 `period`
  - `surface`: `elevated` 또는 `flat`
  - `actionSlot`: route/link 같은 app action을 호출부에서 주입하는 slot
  - `onProductClick`: 상품 클릭 callback. route 이동 자체는 호출부 책임입니다.
  - `showMoreLabel`, `collapseLabel`, `emptyMessage`: 표시 문구
- caller responsibility:
  - desktop이면 `initialVisibleCount={4}`, mobile이면 `initialVisibleCount={2}`처럼 정책을 주입합니다.
  - route 이동이 필요하면 `actionSlot` 또는 `onProductClick` callback으로 연결합니다.
  - 상품 이미지 alt가 기본 상품명 이미지 설명과 달라야 하면 `imageAlt`를 제공합니다.
- non-owned behavior:
  - app role branching
  - API fetching
  - route navigation
  - analytics/logging
  - mutation side effect

## Variants

- `itemVariant='today'`: 정가/할인가/할인 badge 중심 목록
- `itemVariant='period'`: ranking + 가격 중심 목록
- `surface='elevated'`: desktop card에 가까운 white surface, radius 20, shadow
- `surface='flat'`: mobile card에 가까운 neutral surface, radius 12

## States

- loading: 지원하지 않습니다. 상위 API UI 책임입니다.
- empty: 상품이 없으면 `emptyMessage`를 표시하고 더보기/접기 버튼은 숨깁니다.
- error: 지원하지 않습니다. 상위 API UI 책임입니다.
- selected / active: 지원하지 않습니다.
- invalid: 지원하지 않습니다.

## Accessibility

- keyboard:
  - 각 상품은 native `button`으로 렌더링되어 keyboard activation을 지원합니다.
  - 더보기/접기는 native `button`과 `aria-expanded`, `aria-controls`를 사용합니다.
- focus:
  - 상품 button과 더보기/접기 button은 `focus-visible` outline을 제공합니다.
- aria / semantic:
  - root는 `section`입니다.
  - 제목 `h2`를 root와 list의 accessible name으로 사용합니다.
  - 목록은 `List`/`List.Item`을 통해 `ul`/`li` semantic을 유지합니다.

## Styling Constraints

- size:
  - root width는 부모 container를 `100%`로 따릅니다.
  - Storybook 예시는 Figma 기준 폭을 최대값으로만 사용하고 viewport가 더 좁으면 함께 줄어듭니다.
  - product image `5.6rem`
- spacing:
  - card/header/list/footer spacing은 Figma 값을 rem으로 변환합니다.
- color/token:
  - design-system token을 우선 사용합니다.
  - typography는 design-system `typography` token을 사용합니다.
  - discount badge background는 `product-card/assets/img-chip-point.webp`를 사용합니다.
- responsive:
  - responsive object API는 제공하지 않습니다. 호출부가 width container와 `initialVisibleCount`를 결정합니다.
  - ProductCard 자체는 고정 width 또는 max-width를 갖지 않습니다.
- overflow:
  - 상품명은 1줄 ellipsis입니다.
  - 가격 row는 줄바꿈 없이 표시하고 긴 정가는 ellipsis 처리합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/shared lint`
- [x] `pnpm --filter @dongchimi/shared typecheck`
- [x] `pnpm --filter @dongchimi/shared test`
- [x] `pnpm --filter @dongchimi/shared build`
- [x] `pnpm --filter @dongchimi/shared build-storybook`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm lint`
- [x] `pnpm typecheck`
- [x] `pnpm test`
- [x] `pnpm build`

## Open Questions

- 실제 API contract가 확정되면 `ProductCardItemTypes`와 mapping layer를 별도 이슈에서 점검합니다.
