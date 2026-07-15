# React Page Spec: `MarketInformationManagementPage`

## Metadata

- App: `market-owner`
- Domain: `market`
- Page: `information-management`
- Path: `apps/market-owner/src/domains/market/information-management/MarketInformationManagementPage.tsx`
- Status: Implemented for DCMSM-72 UI and DCMSM-79 detail query

## Purpose

- SNB의 `마트 정보 관리`에서 진입해 기존 등록 form을 수정 화면으로 재사용합니다.
- 등록된 마트 정보는 점주 마켓 상세 조회 API로 채우며 수정 API는 후속 이슈로 분리합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- Framework route entry or React Router route object, if needed, imports this page from `src/app`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Route: `/markets/information-management`
- Access/layout: protected no-sidebar layout. 진입 전 SNB는 관리 route를 가리킵니다.
- Shared boundary: 등록/관리 화면이 함께 변경되는 form composition은 `information-registration`의 page surface를 `mode`로 재사용합니다. 제품 전용 form이므로 design-system으로 승격하지 않습니다.
- Overlay boundary: 이탈 확인 dialog는 `components/open-market-information-leave-dialog.tsx`의 OverlayKit `openAsync<boolean>` helper가 mount/open 상태와 결과 전달을 소유합니다.

## UI States

- loading: 로그인 session의 `marketId`로 상세 정보를 불러오는 동안 상태 안내를 표시합니다.
- initial: 조회한 마트명, 주소, 영업 시간, 연락처, 썸네일을 form 기본값으로 표시합니다.
- query error: 403/404 code별 안내 또는 일반 오류 안내와 다시 불러오기 action을 표시합니다.
- invalid: 기존 등록 schema를 사용하며 필수값이 유효하지 않으면 수정 완료 버튼을 비활성화합니다.
- dirty: 취소 또는 다른 route 이동 시 `저장하지 않고 나가시겠어요?` dialog를 표시합니다.
- leave result: OverlayKit 확인 결과가 `true`이면 이동하고, `false`이면 현재 form과 route를 유지합니다.
- success: 수정 완료 시 fixture submit 후 `정보가 변경되었습니다.` toast를 표시하고 현재 값을 pristine 기준으로 재설정합니다.

## Data

- query: `useOwnerMarketDetailQuery({ marketId })`
- mutation: 없음
- endpoint: `GET /v1/owners/markets/{marketId}`
- model: 기존 `marketInformationRegistrationSchema`, request mapper와 상세 응답 form mapper 재사용
- API 응답에 없는 `detailAddress`는 빈 값으로 초기화합니다.

## Accessibility

- heading order: `마트 정보 관리` 단일 h1
- keyboard: 모든 field, 취소/수정 완료 action, dialog action을 native control로 조작합니다.
- focus: design-system Dialog의 focus trap, Escape/backdrop close, focus restoration을 사용합니다.

## Verification

### Market Update API

- `PUT /v1/owners/markets/{marketId}`로 현재 폼 값을 전송합니다.
- 요청 중에는 수정 버튼을 비활성화하고 `수정 중...`을 표시합니다.
- 성공하면 상세 query를 무효화하고 dirty 상태를 초기화한 뒤 서버 message Toast를 표시합니다.
- `INVALID_INPUT`, `MARKET_ACCESS_DENIED`, `MARKET_NOT_FOUND`, `MARKET_ALREADY_EXISTS`는 서버 message를 표시합니다.

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] query/API/mapper unit tests
- [ ] route smoke check, if a route entry exists
