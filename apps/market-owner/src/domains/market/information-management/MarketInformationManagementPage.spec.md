# React Page Spec: `MarketInformationManagementPage`

## Metadata

- App: `market-owner`
- Domain: `market`
- Page: `information-management`
- Path: `apps/market-owner/src/domains/market/information-management/MarketInformationManagementPage.tsx`
- Status: Implemented for DCMSM-72 fixture UI

## Purpose

- SNB의 `마트 정보 관리`에서 진입해 기존 등록 form을 수정 화면으로 재사용합니다.
- 등록된 마트 정보는 fixture로 채우며 조회/수정 API는 후속 이슈로 분리합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- Framework route entry or React Router route object, if needed, imports this page from `src/app`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Route: `/markets/information-management`
- Access/layout: protected no-sidebar layout. 진입 전 SNB는 관리 route를 가리킵니다.
- Shared boundary: 등록/관리 화면이 함께 변경되는 form composition은 `information-registration`의 page surface를 `mode`로 재사용합니다. 제품 전용 form이므로 design-system으로 승격하지 않습니다.
- Overlay boundary: 이탈 확인 dialog는 `components/open-market-information-leave-dialog.tsx`의 OverlayKit `openAsync<boolean>` helper가 mount/open 상태와 결과 전달을 소유합니다.

## UI States

- initial: fixture의 마트명, 주소, 영업 시간, 연락처를 form 기본값으로 표시합니다.
- invalid: 기존 등록 schema를 사용하며 필수값이 유효하지 않으면 수정 완료 버튼을 비활성화합니다.
- dirty: 취소 또는 다른 route 이동 시 `저장하지 않고 나가시겠어요?` dialog를 표시합니다.
- leave result: OverlayKit 확인 결과가 `true`이면 이동하고, `false`이면 현재 form과 route를 유지합니다.
- success: 수정 완료 시 fixture submit 후 `정보가 변경되었습니다.` toast를 표시하고 현재 값을 pristine 기준으로 재설정합니다.
- loading/error: API 연동 전이므로 포함하지 않습니다.

## Data

- query: 없음
- mutation: 없음
- fixture: `fixtures/market-information-management.fixture.ts`의 등록 마트 정보
- model: 기존 `marketInformationRegistrationSchema`와 request mapper 재사용

## Accessibility

- heading order: `마트 정보 관리` 단일 h1
- keyboard: 모든 field, 취소/수정 완료 action, dialog action을 native control로 조작합니다.
- focus: design-system Dialog의 focus trap, Escape/backdrop close, focus restoration을 사용합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] route smoke check, if a route entry exists
