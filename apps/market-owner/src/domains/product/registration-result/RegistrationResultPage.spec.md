# React Page Spec: `RegistrationResultPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `registration-result`
- Route: `/products/registration-result`
- Path: `apps/market-owner/src/domains/product/registration-result/RegistrationResultPage.tsx`
- Jira: DCMSM-15, DCMSM-20, DCMSM-30, DCMSM-47, DCMSM-80, DCMSM-99
- Figma:
  - APPJAM section node 1553:115460
  - APPJAM main frame node 1553:115461
  - APPJAM empty/success frame node 3799:103173
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
- The no-sidebar header renders the shared `Img_pavicon.svg` brand asset at 92×32 instead of a placeholder.
- Design-system `ListCell` is reused for product rows because it already owns checkbox, media slot, inline field, category trigger, and status chip composition.
- The sticky page header owns an opaque page-background fill and bottom divider so scrolled table content cannot visually overlap breadcrumb content.

## UI States

- needsEdit: 기본 진입 segment는 `수정 필요`이며, 수정 필요 수량과 하단 경고 chip을 표시하고 `등록 완료` 버튼을 비활성화합니다.
- completed: `등록 완료` segment 선택 시 등록 완료 상품 sample rows를 표시합니다.
- total: `총 상품` segment 선택 시 fixture sample rows를 전체 상태로 표시합니다.
- selected: 현재 페이지 상품을 선택하면 `선택된 상품` 수량이 증가하고 `선택삭제`가 활성화됩니다.
- draft: 상품명, 판매가격, 홍보문구, 할인 기간, 카테고리 수정값은 page-local draft 상태에 반영합니다.
- invalid: 상품명, 판매가격, 홍보문구, 할인 기간의 검증 실패 사유를 각 input 아래에 표시합니다.
- dirty: 저장되지 않은 row revision이 있으면 `등록 완료`를 비활성화하고 마지막 변경 이후 debounce 저장을 예약합니다.
- saving/refreshing: draft PUT과 이어지는 전체 draft GET이 끝날 때까지 중복 저장과 `등록 완료`를 막습니다.
- empty: 선택한 segment, 검색 또는 카테고리 필터 결과가 비어 있으면 table body에 높이 98px의 빈 row 4개를 표시합니다. 로딩/조회 실패는 기존 feedback message를 유지합니다.
- success: 서버 `needsEditCount`가 0이면 하단에 success `StatusChip`과 `모든 상품의 확인이 완료되었어요` 문구를 표시합니다.
- error: 마지막 임시 저장 실패 toast는 결과 확인 화면의 `top-center` viewport에 표시하고 화면 이동을 막습니다.

## Data

- query: `GET /v1/owners/markets/{marketId}/products/draft`
  - params: `search`, repeated `categories`, `page`, `size`
  - query key includes `marketId`, normalized `search`, `categories`, `page`, `size`
  - 이 페이지의 authoritative query는 `search`와 `categories` 없이 전체 draft를 조회합니다.
- mutation: `PUT /v1/owners/markets/{marketId}/products/draft`
  - body: `preparedProducts[]`
  - success 후 같은 전체 draft query를 명시적으로 refetch하여 최신 row status, `failReason`, summary count를 받습니다.
- fixture: `registrationResultFixture` for tests and isolated section stories only
- model: page-local `RegistrationResultProduct` mapped from prepared draft API rows

## Behavior

- Breadcrumb copy는 `행사 할인 상품 등록 / 상품 결과 등록 확인`입니다.
- Header logo는 app-shared `Img_pavicon.svg`를 92×32 크기로 표시합니다.
- Page heading은 Figma 기준 `상품 결과 등록 확인`입니다.
- 안내 문구는 `AI가 상품 정보를 분석했습니다. 등록 전 내용을 확인해주세요. (*) 표시는 필수 입력 사항입니다.`입니다.
- 상태 segment는 `총 상품`, `등록 완료`, `수정 필요` 고정 label과 필터가 없는 전체 draft GET의 `totalCount`, `successCount`, `failCount`를 표시합니다.
- 어느 segment에서든 현재 table view가 비어 있으면 Figma node `3799:103173`처럼 98px 높이의 내용 없는 cell 4개를 유지해 table 높이가 줄어들지 않도록 합니다. 빈 row는 장식 요소로 접근성 트리에서 제외합니다.
- 서버 `failCount`가 0이면 하단 경고 chip을 숨기는 대신 design-system `StatusChip status="success"`와 `IcCircleCheckFillSizeSmall`을 사용해 `모든 상품의 확인이 완료되었어요`를 표시합니다.
- 검색어와 카테고리 필터는 section의 table view에만 적용합니다. 필터 변경 시 상단 segment count는 유지하고 pagination footer의 전체 개수와 표시 범위만 `filteredProducts` 기준으로 갱신합니다.
- draft 목록 조회는 서버 `size <= 100` 제한을 지키기 위해 `size=100`으로 필요한 모든 페이지를 조회한 뒤 section 내부에서 10개씩 페이지네이션합니다.
- 현재 페이지 checkbox 선택 후 `선택삭제`를 누르면 선택한 fixture row를 제거하고 선택 상태를 초기화합니다.
- 헤더 checkbox는 현재 페이지 전체가 선택된 경우에만 checked 시각 상태를 표시합니다. 일부 row만 선택된 경우 접근성 상태는 `aria-checked="mixed"`로 유지하되, 화면에는 디자인에 없는 mixed dash 대신 기본 unchecked 형태를 표시합니다.
- inline field와 이미지 수정값은 result row draft 상태로 유지하며, 검색과 카테고리 필터는 draft 값을 기준으로 반영합니다.
- 로컬 validation 통과만으로 `needsEdit` row를 `completed`로 승격하지 않습니다. 로컬 validation 실패는 서버 완료 row를 임시로 `needsEdit`로 표시하고 등록 진행을 막을 수 있으며, 최종 완료 상태는 PUT 후 전체 draft GET의 `draftStatus`로 확정합니다.
- 서버에서 받은 수정 필요 사유는 `failReason` 원문을 상태 영역에 그대로 표시하고 프론트에서 별도 사유 문구로 치환하지 않습니다. row가 한 번이라도 수정되면 touched field뿐 아니라 현재 row 전체 값을 검증해 남아 있는 field error를 표시합니다.
- draft 변경 또는 선택 삭제가 생기면 마지막 변경 후 1초가 지난 시점에 최신 전체 row payload를 한 번 임시 저장하는 trailing debounce를 사용합니다. 연속 입력 중에는 timer를 재시작하고 직전 성공 payload와 동일하면 중복 PUT을 생략합니다.
- draft PUT은 single-flight로 실행합니다. 저장 중 새 revision이 생기면 기존 요청을 중첩하지 않고, 해당 입력의 debounce가 만료된 뒤 최신 payload를 후속 저장합니다.
- 저장 시작 시 row별 revision을 snapshot합니다. PUT과 전체 GET이 끝난 뒤 snapshot과 현재 revision이 같은 row만 local draft/image preview를 정리하고, 저장 중 다시 수정된 row는 dirty overlay를 유지합니다.
- `이전`을 누르는 즉시 route 이탈 상태로 전환해 예약된 debounce callback이 추가 PUT 요청을 보내지 않도록 하고, unmount cleanup에서 timeout을 제거합니다.
- `등록 완료` 클릭 시 변경 여부나 직전 자동 저장 payload와의 중복 여부와 관계없이 현재 전체 row payload를 임시 저장 API로 한 번 더 전송합니다.
- 마지막 임시 저장과 전체 draft GET이 성공하고 최신 `failCount`가 0일 때만 `/leaflets/share`로 이동합니다. 실패하면 local draft를 유지한 채 결과 확인 페이지에 머물며 오류 toast를 표시합니다.
- 카테고리 값은 화면에 노출되는 그룹 옵션으로 정규화하여 `김치/반찬` 같은 source category를 직접 노출하지 않습니다.
- 카테고리 드롭다운은 OverlayKit으로 열고 닫으며, 선택한 category를 해당 상품 draft에 반영합니다.
- 카테고리 드롭다운은 열린 트리거의 위치를 스크롤과 viewport resize 중에도 다시 계산해 해당 셀에 붙여두며, 트리거가 viewport 밖으로 이동하거나 DOM에서 제거되면 닫습니다.
- 할인 기간 입력은 숫자 입력을 `YYYY-MM-DD ~ YYYY-MM-DD` 형식으로 자동 포맷팅합니다.
- 상품명은 필수이며 앞뒤 공백을 blur 시 제거하고, 공백을 포함해 15자를 초과하면 오류를 표시합니다.
- 판매가격은 필수이며 입력 중 숫자가 아닌 문자를 제거합니다. 최대 9,999,999원까지 허용하며 초과값은 오류로 표시합니다. 가격 오류 문구는 인접 필드와 겹치지 않는 한 줄로 표시합니다.
- 홍보문구는 선택 입력이며 앞뒤 공백을 blur 시 제거하고, 공백을 포함해 30자를 초과하면 오류를 표시합니다. 공백만 입력한 값은 빈 값으로 저장합니다.
- 할인 기간은 필수이며 시작일과 종료일 모두 실제 `YYYY-MM-DD` 날짜여야 합니다. 종료일은 시작일과 같거나 이후여야 하고 최대 1년까지 허용합니다.
- 입력값 검증은 draft 변경 즉시 다시 실행하되 초기 분석 결과에는 프론트 오류를 노출하지 않습니다. row가 처음 변경된 뒤에는 해당 row 전체 필드의 남은 오류를 표시합니다. 오류 input은 `aria-invalid`와 오류 메시지 `aria-describedby`를 제공합니다.
- table header와 product row는 1376px 기준의 동일한 고정 컬럼 폭을 사용합니다. 검색 영역 바로 아래 table header의 우상단에는 12px radius를 적용하며, 좁은 viewport에서는 컬럼을 축소하지 않고 table 전체를 가로 스크롤합니다.
- 상품 이미지 업로드는 JPG/JPEG/PNG만 허용하고 현재 row preview 상태로 반영합니다. 선택 삭제 시 관련 preview URL을 정리합니다.
- 변경 이미지는 Presigned `uploadUrl`로 S3 PUT한 뒤 응답의 `objectKey`를 임시 저장 API의 `thumbnailUrl`에 전달합니다. 화면 미리보기는 로컬 preview URL을 유지합니다.
- 기존 분석 결과 이미지가 있는 row는 이미지 자체를 `이미지 변경` 버튼으로 노출해 다시 업로드할 수 있습니다.
- 이미지가 없는 row는 `이미지 추가` action을 표시하고, 이미지가 등록되면 즉시 썸네일을 표시합니다.
- 서버 `failCount`, 저장되지 않은 row revision, 로컬 validation error, PUT/GET 진행 상태 중 하나라도 남아 있으면 하단 `등록 완료` 버튼을 disabled로 둡니다.
- `이전`은 분석 완료 시 전달받은 파일명/URL route state를 유지한 채 `/products/event-discount/new`의 `등록한 파일을 확인해주세요` 화면으로 이동합니다. direct entry로 route state가 없으면 등록 방식 첫 화면으로 이동합니다.
- `등록 완료`는 마지막 임시 저장 성공 후 `/leaflets/share`의 `오늘의 전단 최종 확인` 페이지로 이동합니다.
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
- [x] no-sidebar upload header renders the shared 92×32 brand logo
- [x] result section renders status segments, editable product rows, pagination footer, and bottom actions
- [x] selecting a row enables `선택삭제`
- [x] partial row selection keeps the header checkbox visually unchecked while exposing `aria-checked="mixed"`
- [x] deleting or filtering visible rows does not mutate the server summary count
- [x] category defaults render as available group options
- [x] discount period digit input formats as `YYYY-MM-DD ~ YYYY-MM-DD`
- [x] existing product image can be replaced from the uploaded image button
- [x] category dropdown remains anchored to its trigger while scrolling and closes when the trigger leaves the viewport
- [x] needs-edit rows disable `등록 완료`
- [x] `이전` routes to `/products/event-discount/new` and restores the visible uploaded file confirmation step
- [x] table header and product fields keep fixed column widths while the viewport resizes
- [x] table header keeps a 12px top-right radius below the search area
- [x] invalid product fields render the specified message and accessible error association after their first change
- [x] price required error remains on one line
- [x] product name and promotion text trim surrounding whitespace on blur
- [x] price input removes non-numeric characters
- [x] price input allows 9,999,999 won and rejects larger values
- [x] discount period rejects invalid dates, an end date before the start date, and a period longer than one year
- [x] prepared draft query maps API rows to result table rows
- [x] prepared draft query fetches all pages with `size=100`
- [x] search/category filters leave server summary counts unchanged and update only table/footer counts
- [x] locally valid needs-edit rows stay needs-edit until PUT followed by GET returns `SUCCESS`
- [x] prepared draft `failReason` is displayed without frontend reason conversion while editing
- [x] editing any field or image exposes every remaining row validation error
- [x] an input burst resets the trailing debounce and saves the latest payload once
- [x] draft PUT requests never overlap and edits made during a request remain dirty for a follow-up save
- [x] PUT success is followed by an unfiltered GET that refreshes row status, `failReason`, and summary counts
- [x] only unchanged row revisions are acknowledged after PUT/GET; newer local edits remain overlaid
- [x] dirty, saving, refreshing, local error, and server fail states disable final registration
- [x] final registration always saves the full current payload and routes to `/leaflets/share` only after the refreshed `failCount` is zero
- [x] final registration stays on the result page when the last draft save fails
- [x] previous route exit prevents later scheduled auto-save calls
- [x] final save failure toast uses the result page `top-center` viewport

## Open Questions

- 동치미 Jira MCP 권한 문제로 DCMSM-20 issue 본문/상태는 직접 확인하지 못했습니다. PR에는 Figma와 로컬 spec 기준으로 기록합니다.
- 화면 설계서 nodes는 MCP metadata 요청이 504로 실패했습니다. APPJAM main frame과 기존 flow spec을 기준으로 구현했고, 세부 텍스트는 추후 Figma 접근이 안정적일 때 재확인합니다.
- draft 조회 API에 `draftStatus` 필터가 없어 상태 segment는 클라이언트에서 유지합니다. 서버 페이지네이션과 상태 segment를 완전히 결합하려면 status query param이 추가로 필요합니다.
- 2026-07-16 Owner Swagger에는 준비 상품 draft 폐기 endpoint가 없고 `GET/PUT /products/draft`만 있습니다. 활성 분석 취소 `POST /products/import/{jobId}/cancel`을 완료된 draft 취소에 재사용하지 않으며, 서버 폐기 동작이 필요하면 API 계약을 먼저 추가합니다.
