# React Page Spec: `RegistrationResultPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `registration-result`
- Route: `/products/registration-result`
- Path: `apps/market-owner/src/domains/product/registration-result/RegistrationResultPage.tsx`
- Jira: DCMSM-15, DCMSM-20, DCMSM-30, DCMSM-47, DCMSM-80
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
- Page-local fixture lives in `fixtures/registration-result.fixture.ts` for component tests only. The routed page reads real prepared draft data through the product draft API.
- API response mapping lives in `model/registration-result-product.ts` so the API field names and UI row field names stay isolated.
- App-shared `DesktopHeader`, `DesktopUploadHeader`, and `PaginationFooter` are reused because they are already shared desktop upload/result surfaces.
- Design-system `ListCell` is reused for product rows because it already owns checkbox, media slot, inline field, category trigger, and status chip composition.
- The sticky page header owns an opaque page-background fill and bottom divider so scrolled table content cannot visually overlap breadcrumb content.

## UI States

- needsEdit: 기본 진입 segment는 `수정 필요`이며, 수정 필요 수량과 하단 경고 chip을 표시하고 `등록 완료` 버튼을 비활성화합니다.
- completed: `등록 완료` segment 선택 시 등록 완료 상품 sample rows를 표시합니다.
- total: `총 상품` segment 선택 시 fixture sample rows를 전체 상태로 표시합니다.
- selected: 현재 페이지 상품을 선택하면 `선택된 상품` 수량이 증가하고 `선택삭제`가 활성화됩니다.
- draft: 상품명, 판매가격, 홍보문구, 할인 기간, 카테고리 수정값은 page-local draft 상태에 반영합니다.
- invalid: 상품명, 판매가격, 홍보문구, 할인 기간의 검증 실패 사유를 각 input 아래에 표시합니다.
- empty: 검색 또는 삭제 결과 표시할 상품이 없으면 table body에 empty message를 표시합니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다. 서버 분석 결과 오류는 API contract 확정 후 별도 상태로 연결합니다.

## Data

- query: `GET /v1/owners/markets/{marketId}/products/draft`
  - params: `search`, repeated `categories`, `page`, `size`
  - query key includes `marketId`, normalized `search`, `categories`, `page`, `size`
- mutation: `PUT /v1/owners/markets/{marketId}/products/draft`
  - body: `preparedProducts[]`
  - success invalidates the prepared draft query root
- fixture: `registrationResultFixture` for tests and isolated section stories only
- model: page-local `RegistrationResultProduct` mapped from prepared draft API rows

## Behavior

- Breadcrumb copy는 `행사 할인 상품 등록 / 상품 결과 등록 확인`입니다.
- Page heading은 Figma 기준 `상품 결과 등록 확인`입니다.
- 안내 문구는 `AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (*) 표시는 필수 입력 사항입니다.`입니다.
- 상태 segment는 `총 상품`, `등록 완료`, `수정 필요` 고정 label과 현재 row 상태에서 계산한 count를 표시합니다.
- 검색어와 카테고리 필터는 draft 목록 조회 API query param으로 전달합니다. section 내부 검색/필터는 현재 렌더링된 rows에도 동일하게 적용해 draft 입력값 기준 표시를 유지합니다.
- draft 목록 조회는 서버 `size <= 100` 제한을 지키기 위해 `size=100`으로 필요한 모든 페이지를 조회한 뒤 section 내부에서 10개씩 페이지네이션합니다.
- 현재 페이지 checkbox 선택 후 `선택삭제`를 누르면 선택한 fixture row를 제거하고 선택 상태를 초기화합니다.
- inline field와 이미지 수정값은 result row draft 상태로 유지하며, 검색과 카테고리 필터는 draft 값을 기준으로 반영합니다.
- 이미지, 상품명, 판매가격, 카테고리, 할인 기간이 모두 유효하면 해당 row 상태를 즉시 `등록 완료`로 계산하고 segment count를 갱신합니다.
- 서버에서 받은 수정 필요 사유는 `failReason` 원문을 상태 영역에 그대로 표시하고 프론트에서 별도 사유 문구를 생성하거나 치환하지 않습니다. 프론트 검증 문구는 각 입력 필드에만 표시하며, row의 모든 필드가 유효해지면 상태 사유를 숨깁니다.
- draft 변경 또는 선택 삭제가 생기면 첫 변경부터 유지되는 5초 주기로 최신 row payload를 임시 저장합니다. 연속 입력으로 주기를 다시 시작하지 않으며, 직전 성공 payload와 동일하면 중복 저장하지 않습니다.
- `등록 완료` 클릭 시 다음 동작을 실행하기 전에 현재 row payload를 한 번 더 임시 저장합니다.
- 카테고리 값은 화면에 노출되는 그룹 옵션으로 정규화하여 `김치/반찬` 같은 source category를 직접 노출하지 않습니다.
- 카테고리 드롭다운은 OverlayKit으로 열고 닫으며, 선택한 category를 해당 상품 draft에 반영합니다.
- 카테고리 드롭다운은 열린 트리거의 위치를 스크롤과 viewport resize 중에도 다시 계산해 해당 셀에 붙여두며, 트리거가 viewport 밖으로 이동하거나 DOM에서 제거되면 닫습니다.
- 할인 기간 입력은 숫자 입력을 `YYYY-MM-DD ~ YYYY-MM-DD` 형식으로 자동 포맷팅합니다.
- 상품명은 필수이며 앞뒤 공백을 blur 시 제거하고, 공백을 포함해 15자를 초과하면 오류를 표시합니다.
- 판매가격은 필수이며 입력 중 숫자가 아닌 문자를 제거합니다. 최대 9,999,999원까지 허용하며 초과값은 오류로 표시합니다. 가격 오류 문구는 인접 필드와 겹치지 않는 한 줄로 표시합니다.
- 홍보문구는 선택 입력이며 앞뒤 공백을 blur 시 제거하고, 공백을 포함해 30자를 초과하면 오류를 표시합니다. 공백만 입력한 값은 빈 값으로 저장합니다.
- 할인 기간은 필수이며 시작일과 종료일 모두 실제 `YYYY-MM-DD` 날짜여야 합니다. 종료일은 시작일과 같거나 이후여야 하고 최대 1년까지 허용합니다.
- 입력값 검증은 draft 변경 즉시 다시 실행하되, 초기 분석 결과에는 오류를 노출하지 않고 사용자가 처음 변경한 필드의 오류만 표시합니다. 오류 input은 `aria-invalid`와 오류 메시지 `aria-describedby`를 제공합니다.
- table header와 product row는 1376px 기준의 동일한 고정 컬럼 폭을 사용합니다. 좁은 viewport에서는 컬럼을 축소하지 않고 table 전체를 가로 스크롤합니다.
- 상품 이미지 업로드는 JPG/JPEG/PNG만 허용하고 현재 row preview 상태로 반영합니다. 선택 삭제 시 관련 preview URL을 정리합니다.
- 기존 분석 결과 이미지가 있는 row는 이미지 자체를 `이미지 변경` 버튼으로 노출해 다시 업로드할 수 있습니다.
- 이미지가 없는 row는 `이미지 추가` action을 표시하고, 이미지가 등록되면 즉시 썸네일을 표시합니다.
- 수정 필요 상품이 1개 이상이면 하단 `확인이 필요한 상품이 있어요` chip을 표시하고 `등록 완료` 버튼을 disabled로 둡니다.
- `이전`은 `/products/event-discount/new` route로 이동합니다.
- `등록 완료` 클릭 후 최종 결과 페이지 이동은 후속 flow 이슈에서 연결합니다.
- 최종 상품 등록/발행 API는 후속 API contract 확정 후 연결합니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `상품 결과 등록 확인`을 제공합니다.
- breadcrumb: 현재 위치 nav와 현재 페이지 `aria-current="page"`를 제공합니다.
- segment navigation: 활성 segment에는 `aria-current="page"`를 적용합니다.
- selection: header checkbox와 row checkbox는 `role="checkbox"`와 `aria-checked`를 제공합니다.
- validation: 각 invalid input은 `aria-invalid="true"`를 제공하고, 오류 문구를 `aria-describedby`로 연결합니다.
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
- [x] category defaults render as available group options
- [x] discount period digit input formats as `YYYY-MM-DD ~ YYYY-MM-DD`
- [x] existing product image can be replaced from the uploaded image button
- [x] category dropdown remains anchored to its trigger while scrolling and closes when the trigger leaves the viewport
- [x] needs-edit rows disable `등록 완료`
- [x] `이전` routes to `/products/event-discount/new`
- [x] table header and product fields keep fixed column widths while the viewport resizes
- [x] invalid product fields render the specified message and accessible error association after their first change
- [x] price required error remains on one line
- [x] product name and promotion text trim surrounding whitespace on blur
- [x] price input removes non-numeric characters
- [x] price input allows 9,999,999 won and rejects larger values
- [x] discount period rejects invalid dates, an end date before the start date, and a period longer than one year
- [x] prepared draft query maps API rows to result table rows
- [x] prepared draft query fetches all pages with `size=100`
- [x] search/category query params are forwarded to the page query state
- [x] required field completion updates row status and segment counts immediately
- [x] prepared draft `failReason` is displayed without frontend reason conversion while editing
- [x] edited rows are saved before final registration action
- [x] edited rows auto-save the latest payload on the configured interval without timer reset

## Open Questions

- 동치미 Jira MCP 권한 문제로 DCMSM-20 issue 본문/상태는 직접 확인하지 못했습니다. PR에는 Figma와 로컬 spec 기준으로 기록합니다.
- 화면 설계서 nodes는 MCP metadata 요청이 504로 실패했습니다. APPJAM main frame과 기존 flow spec을 기준으로 구현했고, 세부 텍스트는 추후 Figma 접근이 안정적일 때 재확인합니다.
- draft 조회 API에 `draftStatus` 필터가 없어 상태 segment는 클라이언트에서 유지합니다. 서버 페이지네이션과 상태 segment를 완전히 결합하려면 status query param이 추가로 필요합니다.
