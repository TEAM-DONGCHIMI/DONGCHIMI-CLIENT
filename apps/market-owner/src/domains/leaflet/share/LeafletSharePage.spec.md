# React Page Spec: `LeafletSharePage`

## Metadata

- App: `market-owner`
- Domain: `leaflet`
- Page: `share`
- Route: `/leaflets/share`
- Path: `apps/market-owner/src/domains/leaflet/share/LeafletSharePage.tsx`
- Jira: DCMSM-29, DCMSM-67, DCMSM-71, DCMSM-77, DCMSM-83, DCMSM-86, DCMSM-99
- Status: Implemented

## Purpose

`/leaflets/share` route에서 발행 전 전단 미리보기를 조회해 최종 확인 UI를 제공하고, 임시 상품을 최종 저장한 뒤 전단을 발행해 공유 링크와 QR 다운로드 흐름을 제공한다.

기간 할인 전단 미리보기는 `GET /v1/owners/markets/{marketId}/flyers/preview/periodic` 응답을 사용한다. 이 응답에는 아직 발행되지 않은 임시저장 상품 중 `SUCCESS` 상태의 prepared product가 포함된다.

## Ownership

- React Router route object는 기존 `MARKET_OWNER_ROUTES.leafletShare`와 `LeafletSharePage` import를 유지합니다.
- Sidebar/protected layout 책임은 `src/app/layouts/SidebarLayout.tsx`와 `src/app/routes/ProtectedRoute.tsx`에 둡니다.
- 화면 전용 section, component, fixture는 `src/domains/leaflet/share` 아래 page-local로 둡니다.
- 홈에서도 동일한 UI와 다운로드 동작을 사용하므로 QR 모달과 이미지 유틸은 `src/shared`에서 재사용합니다.
- 모바일 프레임과 공유 화면 전용 카드는 page-local로 유지합니다.

## UI States

- confirm loading: 전단 미리보기 query가 pending이면 로딩 안내를 표시한다.
- confirm error: 전단 미리보기 query가 실패하면 재시도 버튼을 표시한다.
- confirm success: 전단 요약 카드와 모바일 전단 미리보기를 API 응답 기반으로 표시한다.
- share: 발행 성공 후 공유 URL, 링크 복사, QR 보기 UI를 표시한다.
- share flow loading: 상품 최종 저장 시작부터 전단 발행 완료까지 공유 버튼을 disabled 처리한다.
- product confirmation error: 서버 오류 메시지를 우선 표시하고 전단 발행을 호출하지 않은 채 confirm UI를 유지한다.
- publish error: 서버 오류 메시지를 우선 표시하고 confirm UI를 유지한다. 상품 최종 저장까지 성공한 같은 화면의 재시도는 발행 단계부터 시작한다.
- QR loading: QR mutation pending 동안 QR 보기 버튼을 disabled 처리한다.
- QR modal: QR 발급 성공 후 반환 이미지를 모달에서 확인하고 다운로드할 수 있다.
- QR error: QR 발급 실패 시 서버 메시지를 우선 표시하고 share UI를 유지한다.

## Data

- query: `GET /v1/owners/markets/{marketId}/flyers/preview/periodic`
- mutation: `POST /v1/owners/markets/{marketId}/products`
- mutation: `POST /v1/owners/markets/{marketId}/flyers/qr`
- mutation: `POST /v1/owners/markets/{marketId}/flyers`
- model: `createLeafletPreviewViewModel`이 API 응답을 summary와 phone preview 표시 모델로 변환한다.

## Behavior

- header breadcrumb는 `행사 할인 상품 등록 / 오늘의 전단 최종 확인`을 표시하고 상품 검색 영역은 렌더링하지 않는다.
- confirm view는 auth store의 현재 `marketId`로 기간 할인 전단 미리보기를 조회한다.
- confirm/share view header는 상품 검색창을 렌더링하지 않습니다.
- query key는 `marketId`를 포함한다.
- 조회 성공 시 `daily.totalCount`는 오늘의 특가 요약 개수로, `preparedProducts.length`는 행사 할인 상품 요약 개수로 사용한다.
- 모바일 미리보기는 market 정보, 영업시간, top3, daily products, prepared products를 API 응답에서 렌더링한다.
- `전단 공유하기`는 현재 `marketId`로 상품 최종 저장 mutation을 먼저 호출하고, 성공한 경우에만 전단 발행 mutation을 호출한다.
- 상품 최종 저장 또는 전단 발행 중에는 중복 요청을 막기 위해 하나의 pending 상태로 공유 액션을 잠근다.
- 상품 최종 저장 실패 시 서버 오류 메시지를 우선 표시하고 전단 발행 mutation을 호출하지 않는다.
- 상품 최종 저장 성공 후 전단 발행만 실패하면 같은 화면에서 재시도할 때 상품 저장을 중복 호출하지 않고 발행 mutation만 다시 호출한다.
- 상품 최종 저장 이후 페이지를 새로고침한 경우의 중복 호출 안전성은 서버의 멱등성 계약을 따른다.
- 발행 성공 시 응답 `slug`를 `VITE_PUBLIC_CLIENT_BASE_URL/markets/{slug}` 형태로 조합하고 share UI로 전환한다. `VITE_PUBLIC_CLIENT_BASE_URL`이 비어 있는 로컬 환경에서는 현재 `window.location.origin`을 사용해 API 호출 자체가 막히지 않게 한다.
- 발행 실패 시 서버 오류 메시지를 우선 표시하고 confirm UI를 유지합니다.
- `marketId`가 없으면 요청하지 않고 재로그인 안내 toast를 표시합니다.
- QR 이미지와 상품 개수는 fixture 값을 사용합니다.
- 링크 필드의 `전단 공유 링크 복사` IconButton과 `링크 복사` 액션은 현재 공유 링크를 clipboard에 기록하고 성공한 경우에만 toast UI를 표시합니다.
- clipboard 미지원 또는 복사 실패 시 `링크를 복사하지 못했습니다. 다시 시도해주세요.` error toast를 표시합니다.
- 로그인 응답에서 auth store에 저장된 현재 `marketId`를 QR 요청에 사용합니다.
- QR 응답이 순수 Base64이면 PNG data URL로 정규화하고, image data URL이면 그대로 사용합니다.
- QR 다운로드 버튼은 실제 QR 이미지를 `market-leaflet-qr.png`로 다운로드합니다.
- QR modal UI와 이미지 정규화·다운로드 유틸은 홈과 동일한 app-shared 구현을 사용합니다.
- `홈으로 돌아가기`는 `MARKET_OWNER_ROUTES.home`으로 이동합니다.
- `전단 수정하기`는 `MARKET_OWNER_ROUTES.registrationResult`의 파일 등록 상품 수정 확인 화면으로 이동합니다.

## Accessibility

- page root는 현재 화면 상태에 맞는 visible `h1`을 제공합니다.
- QR 모달은 `role="dialog"`와 `aria-modal="true"`를 사용합니다.
- 버튼은 native `button` 또는 design-system `Button`을 사용해 keyboard focus를 유지합니다.
- 링크 필드의 복사 액션은 design-system `IconButton`을 사용하고 `전단 공유 링크 복사` accessible name을 제공합니다.
- `/leaflets/share`는 기존 정책대로 sidebar active item을 갖지 않습니다.

## Verification

- [ ] `/leaflets/share` route renders `오늘의 전단 최종 확인`
- [ ] route header does not render product search
- [ ] clicking `전단 수정하기` navigates to `/products/registration-result`
- [ ] clicking `전단 공유하기` confirms product drafts and then publishes the leaflet with the current marketId
- [ ] failed product confirmation does not publish and keeps the confirmation view
- [ ] pending product confirmation or publish disables the action and renders `전단 발행 중`
- [ ] retry after publish failure skips the already successful product confirmation in the same page session
- [ ] successful publish renders `오늘의 전단 공유` and the slug-based URL
- [ ] failed publish renders an error toast and keeps the confirmation view
- [ ] clicking `링크 복사` renders copied toast UI
- [ ] clicking `전단 공유 링크 복사` renders copied toast UI
- [ ] clipboard write failure renders copy error toast UI
- [ ] clicking `홈으로 돌아가기` navigates to the home route
- [ ] clicking `매장 고유 QR코드 보기` issues a QR code for the authenticated market
- [ ] pending QR issue disables the action
- [ ] successful QR issue renders the returned image in the modal
- [ ] failed QR issue renders an error toast and keeps the share view
- [ ] clicking `매장 고유 QR코드 다운로드` downloads `market-leaflet-qr.png`
- [ ] route renders sidebar complementary landmark
- [ ] sidebar does not render an active leaflet share item
