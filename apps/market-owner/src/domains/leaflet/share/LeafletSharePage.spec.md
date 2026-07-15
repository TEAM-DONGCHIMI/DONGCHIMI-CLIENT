# React Page Spec: `LeafletSharePage`

## Metadata

- App: `market-owner`
- Domain: `leaflet`
- Page: `share`
- Route: `/leaflets/share`
- Path: `apps/market-owner/src/domains/leaflet/share/LeafletSharePage.tsx`
- Jira: DCMSM-29, DCMSM-67, DCMSM-71
- Status: Implemented

## Purpose

기존 `/leaflets/share` route에서 오늘의 전단 최종 확인과 공유 UI를 제공하고, 실제 QR 발급 API 응답을 모달에서 확인·다운로드합니다.
공유 링크와 상품 정보는 fixture를 유지하며 QR 발급만 실제 API에 연결합니다.

## Ownership

- React Router route object는 기존 `MARKET_OWNER_ROUTES.leafletShare`와 `LeafletSharePage` import를 유지합니다.
- Sidebar/protected layout 책임은 `src/app/layouts/SidebarLayout.tsx`와 `src/app/routes/ProtectedRoute.tsx`에 둡니다.
- 화면 전용 section, component, fixture는 `src/domains/leaflet/share` 아래 page-local로 둡니다.
- 홈에서도 동일한 UI와 다운로드 동작을 사용하므로 QR 모달과 이미지 유틸은 `src/shared`에서 재사용합니다.
- 모바일 프레임과 공유 화면 전용 카드는 page-local로 유지합니다.

## UI States

- confirm: 오늘의 전단 최종 확인 화면을 렌더링합니다.
- share: 오늘의 전단 공유 화면을 렌더링합니다.
- copied toast: `링크 복사` 클릭 후 링크 복사 성공 toast UI를 표시합니다.
- copy error toast: clipboard 미지원 또는 복사 실패 시 재시도 안내 toast UI를 표시합니다.
- QR loading: QR mutation pending 동안 QR 보기 버튼을 disabled하고 `QR코드 발급 중`을 표시합니다.
- QR modal: QR 발급 성공 후 실제 이미지를 포함한 dim overlay와 QR 다운로드 모달 UI를 표시합니다.
- QR error toast: QR 발급 실패 시 서버 메시지를 우선 표시하고 공유 화면을 유지합니다.
- download error toast: QR 다운로드 처리 실패 시 `QR 이미지 다운로드를 실패했습니다.` toast UI를 표시합니다.
- QR modal: `매장 고유 QR코드 보기` 클릭 후 dim overlay와 QR 다운로드 모달 UI를 표시합니다.
- download error toast: QR 다운로드 버튼 클릭 후 `QR 이미지 다운로드를 실패했습니다.` toast UI를 표시합니다.
- loading: 전단 발행 mutation이 pending인 동안 `전단 공유하기` 버튼을 `전단 발행 중` 문구와 native disabled 상태로 표시합니다.
- empty: fixture 기반 화면이라 다루지 않습니다.

## Data

- query: none
- mutation: `POST /v1/owners/markets/{marketId}/flyers/qr` / `POST /v1/owners/markets/{marketId}/flyers`
- model: none

## Behavior

- `전단 공유하기`는 auth store의 현재 `marketId`로 전단 발행 mutation을 호출합니다.
- 발행 성공 시 응답 `slug`를 `VITE_PUBLIC_CLIENT_BASE_URL/markets/{slug}` 형태로 조합하고 share UI 상태로 전환합니다.
- 발행 실패 시 서버 오류 메시지를 우선 표시하고 confirm UI를 유지합니다.
- `marketId`가 없으면 요청하지 않고 재로그인 안내 toast를 표시합니다.
- QR 이미지와 상품 개수는 fixture 값을 사용합니다.
- `링크 복사`는 fixture 공유 링크를 clipboard에 기록하고 성공한 경우에만 toast UI를 표시합니다.
- clipboard 미지원 또는 복사 실패 시 `링크를 복사하지 못했습니다. 다시 시도해주세요.` error toast를 표시합니다.
- 로그인 응답에서 auth store에 저장된 현재 `marketId`를 QR 요청에 사용합니다.
- QR 응답이 순수 Base64이면 PNG data URL로 정규화하고, image data URL이면 그대로 사용합니다.
- QR 다운로드 버튼은 실제 QR 이미지를 `market-leaflet-qr.png`로 다운로드합니다.
- QR modal UI와 이미지 정규화·다운로드 유틸은 홈과 동일한 app-shared 구현을 사용합니다.
- `홈으로 돌아가기`는 `MARKET_OWNER_ROUTES.home`으로 이동합니다.
- `전단 수정하기`는 이번 UI-only 범위에서 실제 라우팅을 수행하지 않습니다.

## Accessibility

- page root는 현재 화면 상태에 맞는 visible `h1`을 제공합니다.
- QR 모달은 `role="dialog"`와 `aria-modal="true"`를 사용합니다.
- 버튼은 native `button` 또는 design-system `Button`을 사용해 keyboard focus를 유지합니다.
- `/leaflets/share`는 기존 정책대로 sidebar active item을 갖지 않습니다.

## Verification

- [ ] `/leaflets/share` route renders `오늘의 전단 최종 확인`
- [ ] clicking `전단 공유하기` publishes the leaflet with the current marketId
- [ ] pending publish disables the action and renders `전단 발행 중`
- [ ] successful publish renders `오늘의 전단 공유` and the slug-based URL
- [ ] failed publish renders an error toast and keeps the confirmation view
- [ ] clicking `링크 복사` renders copied toast UI
- [ ] clipboard write failure renders copy error toast UI
- [ ] clicking `홈으로 돌아가기` navigates to the home route
- [ ] clicking `매장 고유 QR코드 보기` issues a QR code for the authenticated market
- [ ] pending QR issue disables the action
- [ ] successful QR issue renders the returned image in the modal
- [ ] failed QR issue renders an error toast and keeps the share view
- [ ] clicking `매장 고유 QR코드 다운로드` downloads `market-leaflet-qr.png`
- [ ] route renders sidebar complementary landmark
- [ ] sidebar does not render an active leaflet share item
