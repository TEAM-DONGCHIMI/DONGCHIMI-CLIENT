# React Page Spec: `RegistrationResultPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `registration-result`
- Route: `/products/registration-result`
- Path: `apps/market-owner/src/domains/product/registration-result/RegistrationResultPage.tsx`
- Jira: DCMSM-15, DCMSM-20
- Figma:
  - APPJAM section node 1553:115460
  - APPJAM main frame node 1553:115461
  - 화면 설계서 node 493:104923
  - 화면 설계서 node 544:92393
  - 화면 설계서 node 544:92399
  - 화면 설계서 node 544:92405
- Status: Implemented

## Purpose

상품 분석 완료 후 등록 전 상품 결과를 확인하고, 수정 필요 상품을 찾거나 선택 삭제할 수 있는 데스크탑 결과 확인 UI를 제공합니다.
DCMSM-15에서 만든 protected no-sidebar route shell 위에 DCMSM-20 결과 확인 본문을 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- No-sidebar protected layout responsibility stays in `src/app/layouts/NoSidebarLayout.tsx`.
- Page-local result UI lives in `sections/RegistrationResultSection.tsx` because filter/delete state, fixture shape, and registration completion behavior are tied to this flow.
- Page-local fixture lives in `fixtures/registration-result.fixture.ts` until the analysis result API and temporary-save polling contract are available.
- App-shared `DesktopHeader`, `DesktopUploadHeader`, and `PaginationFooter` are reused because they are already shared desktop upload/result surfaces.
- Design-system `ListCell` is reused for product rows because it already owns checkbox, media slot, inline field, category trigger, and status chip composition.

## UI States

- needsEdit: 기본 진입 segment는 `수정 필요`이며, 수정 필요 수량과 하단 경고 chip을 표시하고 `등록 완료` 버튼을 비활성화합니다.
- completed: `등록 완료` segment 선택 시 등록 완료 상품 sample rows를 표시합니다.
- total: `총 상품` segment 선택 시 fixture sample rows를 전체 상태로 표시합니다.
- selected: 현재 페이지 상품을 선택하면 `선택된 상품` 수량이 증가하고 `선택삭제`가 활성화됩니다.
- empty: 검색 또는 삭제 결과 표시할 상품이 없으면 table body에 empty message를 표시합니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다. 서버 분석 결과 오류는 API contract 확정 후 별도 상태로 연결합니다.

## Data

- query: none
- mutation: none
- fixture: `registrationResultFixture`
- model: page-local `RegistrationResultProduct`

## Behavior

- Breadcrumb copy는 `행사 할인 상품 등록 / 상품 결과 등록 확인`입니다.
- Page heading은 Figma 기준 `상품 결과 등록 확인`입니다.
- 안내 문구는 `AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (*) 표시는 필수 입력 사항입니다.`입니다.
- 상태 segment는 `총 상품`, `등록 완료`, `수정 필요` 고정 label과 호출부 count를 표시합니다.
- 검색은 현재 fixture rows에서 상품명, 카테고리, 홍보문구를 기준으로 필터링합니다.
- 현재 페이지 checkbox 선택 후 `선택삭제`를 누르면 선택한 fixture row를 제거하고 선택 상태를 초기화합니다.
- 수정 필요 상품이 1개 이상이면 하단 `확인이 필요한 상품이 있어요` chip을 표시하고 `등록 완료` 버튼을 disabled로 둡니다.
- `이전`은 `/products/event-discount/new` route로 이동합니다.
- `등록 완료` 클릭 후 최종 결과 페이지 이동은 후속 flow 이슈에서 연결합니다.
- 분석 결과 API, 임시 저장 polling, inline field persistence, category dropdown, image upload picker는 이번 이슈 범위가 아닙니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `상품 결과 등록 확인`을 제공합니다.
- breadcrumb: 현재 위치 nav와 현재 페이지 `aria-current="page"`를 제공합니다.
- segment navigation: 활성 segment에는 `aria-current="page"`를 적용합니다.
- selection: header checkbox와 row checkbox는 `role="checkbox"`와 `aria-checked`를 제공합니다.
- search: shared `SearchBar`의 `role="search"`와 searchbox label을 사용합니다.
- actions: `이전`, `등록 완료`, `선택삭제`는 native button keyboard interaction을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.

## Verification

- [x] `/products/registration-result` route renders `상품 결과 등록 확인`
- [x] route does not render sidebar complementary landmark
- [x] route renders no-sidebar upload header breadcrumb
- [x] result section renders status segments, editable product rows, pagination footer, and bottom actions
- [x] selecting a row enables `선택삭제`
- [x] deleting a selected row updates the needs-edit notice count
- [x] needs-edit rows disable `등록 완료`
- [x] `이전` routes to `/products/event-discount/new`

## Open Questions

- 동치미 Jira MCP 권한 문제로 DCMSM-20 issue 본문/상태는 직접 확인하지 못했습니다. PR에는 Figma와 로컬 spec 기준으로 기록합니다.
- 화면 설계서 nodes는 MCP metadata 요청이 504로 실패했습니다. APPJAM main frame과 기존 flow spec을 기준으로 구현했고, 세부 텍스트는 추후 Figma 접근이 안정적일 때 재확인합니다.
