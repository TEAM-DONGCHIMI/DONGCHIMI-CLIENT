# Product Detail Page Spec

## Metadata

- Jira: DCMCL-10
- Related Jira: DCMCL-13
- Screen ID: APPJAM `1972:129194` `상품 상세_[오늘의 특가 상품]`, APPJAM `1972:129231` `상품 상세_[행사 할인 상품]`
- Route: `/markets/[marketId]/products/[productId]`
- Owner: apps/client
- Status: Implemented, API integrated by DCMCL-13

## Purpose

- 특정 마트의 전단 상품 상세 정보를 모바일 웹 화면에서 사용자 상품 상세 조회 API로 확인합니다.
- 오늘의 특가 상품과 행사 할인 상품은 같은 route shell을 공유하고, 상품 유형별 header title, chip, 가격 정보, 행사 기간 노출만 분기합니다.

## Source Of Truth

- Figma: APPJAM `1972:129194`, `1972:129231`
- Figma: 화면 설계서 `743:32731` 오늘의 특가상품, `751:32751` 행사 할인 상품
- Target viewport: 375x812 mobile web frame, 390/414/430px wider mobile widths
- FRS / SRS: 없음
- Decision / Meeting note: 없음
- API doc: Swagger Product 상품 조회 API `GET /v1/users/markets/{marketId}/products/{productId}`
- Related Jira: DCMCL-10, DCMCL-8, DCMCL-13

## Scope

- 기존 `/markets/[marketId]/products/[productId]` route entry는 Server Component로 유지합니다.
- `ProductDetailPage`는 TanStack Query hook으로 상품 상세 API를 호출하고, loading/error/empty/success 상태를 렌더링합니다.
- `ProductDetailPage`는 Client Component로 API 상태를 소유하고, route entry는 Server Component shell로 유지합니다.
- 디자인시스템 `Chip`은 client component인 `ProductDetailPage` 내부에서 사용합니다.
- package public export surface는 상품 상세 구현에서 새로 확장하지 않습니다.
- API 응답의 `thumbnailUrl`이 있으면 상품 이미지를 렌더링하고, 없으면 기본 카테고리 이미지 제작 전까지 fallback surface를 노출합니다.
- API 응답의 `promotionalPhrase`가 없으면 comment card를 노출하지 않습니다.
- API 응답의 `data`가 `null`이면 상품 정보 없음 상태를 노출합니다.

## Out Of Scope

- 실제 상품 이미지 asset 제작
- iOS status bar, Safari browser bottom toolbar, home indicator 구현
- 구매, 전화, 공유 action 구현
- 새 디자인시스템 public component 또는 token contract 추가
- 상품 목록 API 조회
- market slug를 product API의 integer marketId로 resolve하는 선행 흐름

## Layout And Sections

- mobile header: 뒤로가기 button과 상품 유형 title을 표시합니다.
- product image: viewport width 기준 정사각형 fallback surface를 표시합니다.
- product summary: 마트명, 행사 chip, 상품명, 가격 정보를 표시합니다.
- today special price: 할인율, 판매가, 원가 취소선 가격을 표시합니다.
- event discount price: 행사 chip, 기간 chip, 판매가를 표시합니다.
- mart comment card: 점장 한마디가 있을 때만 표시합니다.

## Routing And Access

- route path: `/markets/[marketId]/products/[productId]`
- route params: `marketId`, `productId`
- search params: 없음
- layout shell: root `client-app-shell`, page-local mobile header
- access rule: 공개 모바일 웹 fixture 화면
- after action navigation: back button은 history back을 우선하고, history가 없으면 `/markets/[marketId]`로 이동합니다.

## Design System And Component Boundary

- design-system `ui` components: `Chip`
- design-system `layout` components: 없음
- design-system icons: `IcChevronLeft`
- app-shared components: `MobileHeader`
- page-local components: `ProductDetailHeader`, `ProductDetailBackButton`, `ProductDetailPromotionChips`
- not promoted to design-system: 상품 이미지 fallback, 상품 가격 블록, 점장 한마디 card는 상품 상세 제품 copy와 fixture shape에 묶여 있어 page-local에 둡니다.

## States

- loading: 상품 상세 정보를 불러오는 중 상태 message를 노출합니다.
- empty: `data: null`이면 상품 정보 없음 상태를 노출합니다. 상품 이미지 없음은 fallback surface로 대체하고, 점장 한마디 없음은 card를 숨깁니다.
- error: API 실패 또는 설정 누락은 error state message와 retry 버튼을 노출합니다.
- disabled: action 연동 시 후속 처리
- selected / active: 없음

## Behavior

- navigation: 뒤로가기 button은 `router.back()`을 우선하고 fallback으로 `/markets/[marketId]`로 이동합니다.
- interaction: 상세 action은 후속 이슈에서 구현합니다.
- form / validation: 없음
- API: `useProductDetailQuery({ marketId, productId })`로 상품 상세 API를 호출합니다.
- query key: `['market', 'products', 'detail', { marketId, productId }]`
- query options: `productDetailQueryOptions(params)`가 `queryKey`와 `queryFn` 계약을 소유하고, hook은 `enabled` 같은 사용 정책을 얹습니다.
- retry: QueryClient 기본 정책을 따르되 auth/validation/response validation error는 retry하지 않습니다.

## Accessibility

- keyboard: 뒤로가기 button은 keyboard focus와 Enter/Space activation이 가능합니다.
- focus: 기본 focus style을 제거하지 않습니다.
- accessible name: 뒤로가기 button은 `상품 목록으로 돌아가기` accessible name을 갖습니다.
- heading: header title은 화면 제목이며, 상품명은 content section heading입니다.

## Responsive

- mobile: 375px frame 기준으로 product image는 정사각형, content gutter는 20px입니다.
- wider mobile: 390/414/430px widths에서 shell을 채우고 horizontal overflow가 없어야 합니다.
- tablet: root shell max width 안에서 중앙 정렬됩니다.
- desktop: root shell shadow 기준은 DCMCL-8 global style을 따릅니다.

## Publishing Evidence

- Figma mismatch: iOS status bar, Safari browser bottom toolbar, home indicator는 실제 web route에서 구현하지 않습니다.
- browser route: `/markets/mangwon/products/samgyeopsal-500g`, `/markets/mangwon/products/event-discount-samgyeopsal-500g`
- screenshot / preview: PR evidence에서 viewport별 browser route 확인을 남깁니다.
- visual notes: APPJAM annotation의 이미지 fallback, 점장 한마디 미노출 조건을 반영합니다.

## Verification

- [x] `git diff --check`
- [x] Frontend Fundamentals self-check
- [x] `pnpm format:check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
- [x] `pnpm --filter client test:unit`
- [x] `pnpm e2e:smoke`
- [ ] browser route: `/markets/[marketId]/products/[productId]` at 375px, 390px, 414px, 430px

## Open Questions

- route의 `marketId`, `productId`가 현재 slug-like placeholder에서 Swagger 기준 integer id로 언제 전환되는지 확인이 필요합니다.
- `dealType`은 현재 `DAILY`만 오늘의 특가로 매핑하고 그 외 값은 행사 할인 상품 UI로 매핑합니다. 최종 enum이 확정되면 schema를 좁힙니다.
- 최종 상품 이미지 fallback asset 또는 카테고리별 fallback 정책
