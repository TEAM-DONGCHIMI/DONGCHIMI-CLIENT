# React Page Spec: `TodaySpecialRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `today-special-registration`
- Route: `/products/today-special/new`
- Path: `apps/market-owner/src/domains/product/today-special-registration/today-special-registration-page.tsx`
- Jira: DCMSM-21, DCMSM-54, DCMSM-56, DCMSM-82
- Related API: DCMSM-50, DCMSM-58
- Status: UI, Presigned image upload, product registration, registered product update/delete implemented with auth store market ID

## Purpose

오늘의 특가 상품 등록 page가 protected sidebar layout 안에서 상품 등록 form UI를 제공합니다.
Figma `APPJAM` node `1553:80268`, `1553:80269`, `1553:80560`, `1553:80571`, dropdown node `1553:80444`
및 화면설계서의 입력/노출 규칙을 기준으로 구현합니다.

선택 이미지는 등록 완료 시 Presigned URL 발급 후 S3 임시 저장소에 업로드합니다.
업로드 결과를 상품 등록 payload에 연결하고, 로그인 auth store의 `marketId`를 사용합니다.
Client-side field validation error는 필드 아래 메시지로 표시합니다.

## Ownership

- Route object는 `src/app/router.tsx`가 소유하고, 이 page는 route-independent 화면 composition만 담당합니다.
- Sidebar/protected layout은 `src/app/layouts/SidebarLayout.tsx`, `src/app/routes/ProtectedRoute.tsx` 책임입니다.
- Page-local UI는 `sections/*`와 `components/*`에 둡니다.
- Page-local form type, sanitizer, validation helper, image validation alias는 `model/*`에 둡니다.
- Category options는 `fixtures/*`에 둡니다.
- 이 작업에서는 sidebar layout 파일을 수정하지 않습니다.

## Structure

- `today-special-registration-page.tsx`
  - 페이지 shell, section 조합, 등록 action별 성공 후속 동작을 담당합니다.
- `hooks/use-today-special-form.ts`
  - 등록된 상품 snapshot과 현재 입력 상품의 RHF form, validation, submit/isSubmitting, 상품 이동 상태를 소유합니다.
- `hooks/use-today-special-image-upload.ts`
  - 현재 상품 이미지 1개의 TanStack Query Presigned URL mutation과 S3 PUT만 조합합니다.
  - 이미지가 없으면 `null`, 이미지가 있으면 후속 등록 payload용 `objectKey`를 반환합니다.
- `hooks/use-today-special-product-registration.ts`
  - 이미지 업로드, 등록 payload 변환, 상품 등록 mutation, 실패 toast를 조합합니다.
  - 이미지가 있으면 `VITE_PUBLIC_S3_BASE_URL`과 `objectKey`를 결합한 절대 URL을 `thumbnailUrl`로 사용하며, base URL이 없으면 상대경로를 등록하지 않습니다.
  - 페이지가 버튼별 성공 후속 동작을 결정할 수 있도록 성공 여부를 반환합니다.
- `hooks/useCurrentProductField.ts`
  - 현재 상품의 text/date/price field change, blur, formatting, error message 계산을 담당합니다.
- `hooks/useCategoryDropdown.tsx`
  - product domain 공용 `useProductOverlayDisclosure`로 open/close, 외부 click, Escape 동작을 관리합니다.
  - 등록 화면에 필요한 dropdown max height와 form category touched 처리만 담당합니다.
- `sections/registration-title-section.tsx`
  - 등록 화면 title과 등록된 상품/현재 입력 상품 사이를 이동하는 화살표, 현재 순번을 렌더링합니다.
- `sections/product-info-section.tsx`
  - 상품 이미지, 상품명, 상품 구분 dropdown, 상품 한줄 홍보글을 렌더링합니다.
- `sections/product-price-section.tsx`
  - 오늘의 특가, 판매가 input을 렌더링합니다.
- `sections/product-period-section.tsx`
  - 행사 시작일 field를 배치합니다.
- `../components/date-field/DateField.tsx`
  - visible `YYYY-MM-DD` field와 투명 native `type=date` input overlay를 결합합니다.
  - native date icon/text는 숨기고, `showPicker()`로 date picker를 엽니다.
- `model/product-form.types.ts`
  - schema inference 기반 form value와 text field 타입을 정의합니다.
- `model/product-form.schema.ts`
  - `zod` schema로 submit 가능 여부와 field error message를 검증합니다.
- `model/product-form.utils.ts`
  - 빈 form 생성, 입력값 정제, 가격 포맷, image file 검증 alias를 담당합니다.
- `shared/utils/form-error.utils.ts`
  - touched/submitted 기준으로 visible error message를 계산합니다.
- `shared/hooks/useImagePreview.ts`
  - image object URL 생성, 교체, unmount cleanup을 담당합니다.

## UI States

- empty image: dashed upload box와 `상품 이미지를 추가하세요` copy를 표시합니다.
- selected image: object URL preview 위에 `status-dimmer-hover` overlay와 camera icon을 표시합니다.
- category empty: trigger에 `카테고리` placeholder를 표시합니다.
- category open: dropdown을 trigger 하단에 표시하고 현재 선택된 item을 selected 상태로 표시합니다.
- category overlay: trigger 바로 아래에 dropdown을 표시하고, 외부 click 또는 Escape로 닫습니다.
- category scroll: dropdown 높이는 열릴 때와 viewport resize 때만 계산하고, 흰색 surface를 유지하며 목록 끝의 bounce와 배경 페이지로의 스크롤 전달을 막습니다.
- category outside scroll: dropdown 내부 목록 스크롤은 높이 계산에서 제외하고, 주변 페이지가 스크롤되면 현재 trigger 위치를 기준으로 높이를 다시 계산합니다.
- next product ready: `상품 계속 등록` 성공 후 새 빈 상품을 마지막에 추가하고 해당 상품으로 이동합니다.
- cancel next product: 마지막 미등록 상품에서는 `-` 버튼을 표시하고, 클릭하면 서버 요청 없이 해당 입력을 취소한 뒤 직전 등록 상품으로 이동합니다.
- registered product history: 이전 상품으로 이동하면 `(현재 순번/전체 상품 수)`와 이동 화살표를 표시하고, 저장된 snapshot을 수정 가능한 form 초기값으로 사용합니다.
- registered product update: `수정 완료`를 누르면 저장된 `productId`로 PUT하고 성공한 경우에만 snapshot을 갱신합니다.
- registered image unchanged: 새 파일을 선택하지 않으면 snapshot의 기존 `thumbnailUrl`을 유지하고 이미지 업로드를 생략합니다.
- registered image changed: 새 파일을 선택한 경우에만 Presigned upload 후 새 URL로 PUT하고 snapshot의 이미지 URL을 교체합니다.
- update pending/error: 수정 중 중복 action을 막고, 실패하면 현재 입력값과 기존 snapshot 식별자를 유지한 채 오류 toast를 표시합니다.
- registered product deletion: 등록된 이전 상품의 `-` 버튼은 `정말 삭제하시겠어요?` 확인 modal을 열고, 성공한 경우에만 snapshot을 제거합니다.
- delete pending: 확인 modal의 취소/삭제 버튼을 비활성화하고 중복 DELETE를 막습니다.
- delete error: 등록 snapshot과 순번을 유지하고 오류 toast를 표시하며 modal을 유지합니다.
- continue registration: 입력 유효성과 무관하게 `상품 계속 등록`을 활성화하고, 클릭 시 현재 form을 검증합니다.
- disabled submit: 필수값이 비어 있거나 form completion 조건을 만족하지 않으면 `등록 완료`만 disabled 처리합니다.
- submit pending: action button을 disabled 처리하고 submit button copy를 `등록 중`으로 변경합니다.
- submit success: 선택 이미지를 임시 저장소에 업로드하고 상품 등록 API가 성공하면 오늘의 특가 상품 수정 route로 이동합니다.
- field error: blur 또는 submit validation 이후 필드 아래에 icon과 error message를 표시합니다.
- registration error: 일반 실패는 `상품을 등록하지 못했습니다. 다시 시도해주세요.`, 네트워크 실패는 `인터넷 연결을 확인한 후 다시 시도해주세요.` toast를 `IcCircleExclamation` 아이콘과 함께 표시하고 현재 페이지에 머뭅니다.
- market missing: auth store에 `marketId`가 없으면 마트 정보 등록 route로 이동합니다.

## Form Rules

- 이미지
  - 선택 등록입니다.
  - 등록하지 않으면 Presigned 요청을 생략하고 후속 submit에서 `/images/product-replace.svg` 기본 이미지를 사용합니다.
  - `.jpg`, `.jpeg`, `.png`만 선택할 수 있게 file accept를 제한합니다.
  - 실제 검사 기준은 MIME type `image/jpeg`, `image/png`입니다.
  - 10MB를 초과하거나 지원하지 않는 형식이면 선택을 무시합니다.
  - 1장만 등록합니다.
- 상품명
  - 필수 입력입니다.
  - 입력 중에는 최대 길이만 제한하고, blur 또는 submit payload 생성 시점에 앞뒤 공백을 제거합니다.
  - 공백만 입력할 수 없습니다.
  - 공백 포함 최대 15자까지만 저장합니다.
- 상품 구분
  - 필수 선택입니다.
  - 기본 상태에서는 `카테고리` placeholder를 표시합니다.
  - 선택 즉시 dropdown을 닫고 선택값을 trigger에 표시합니다.
- 상품 한줄 홍보글
  - 선택 입력입니다.
  - label은 `상품 한줄 홍보글 (선택)`으로 표시하고 `(선택)`은 `atomic.neutral.50` 색상을 사용합니다.
  - 입력 중에는 최대 길이만 제한하고, blur 또는 submit payload 생성 시점에 앞뒤 공백을 제거합니다.
  - 공백만 입력한 경우 빈 값으로 처리합니다.
  - 공백 포함 최대 25자까지만 저장합니다.
- 오늘의 특가
  - 필수 입력입니다.
  - 숫자만 저장하고 천 단위 comma를 표시합니다.
  - 1원 이상이어야 submit 가능 상태가 됩니다.
  - 우측 `원` unit은 `InlineField` unit으로 표시합니다.
- 판매가
  - 필수 입력입니다.
  - 숫자만 저장하고 천 단위 comma를 표시합니다.
  - 1원 이상이고 오늘의 특가 이상이어야 submit 가능 상태가 됩니다.
  - 우측 `원` unit은 `InlineField` unit으로 표시합니다.
- 행사 기간
  - 시작일은 오늘 날짜가 기본값입니다.
  - 오늘의 특가 등록 화면에서는 시작일을 읽기 전용으로 표시하고 date picker를 열지 않습니다.
  - 공용 `DateField`의 다른 사용처에는 이 읽기 전용 조건을 적용하지 않습니다.
  - visible text는 `YYYY-MM-DD` 형식입니다.

## Field Error Messages

- 상품명
  - 미입력 또는 공백만 입력한 경우: `상품명을 입력해주세요.`
  - 최대 글자 수를 초과한 경우: `상품명은 공백 포함 15자 이하로 입력해주세요.`
- 상품 구분
  - 미선택한 경우: `카테고리를 선택해주세요.`
- 상품 한줄 홍보글
  - 최대 글자 수를 초과한 경우: `홍보문구는 공백 포함 25자 이하로 입력해주세요.`
- 오늘의 특가
  - 미입력한 경우: `오늘의 특가를 입력해주세요.`
  - 숫자가 아닌 문자를 입력한 경우: `숫자만 입력할 수 있습니다.`
  - 0원 이하인 경우: `1원 이상 입력해주세요.`
- 판매가
  - 미입력한 경우: `판매가를 입력해주세요.`
  - 숫자가 아닌 문자를 입력한 경우: `숫자만 입력할 수 있습니다.`
  - 0원 이하인 경우: `1원 이상 입력해주세요.`
  - 오늘의 특가보다 낮은 경우: `판매가는 오늘의 특가 이상으로 입력해주세요.`
- 행사 시작일
  - 미선택한 경우: `행사 시작일을 선택해주세요.`
  - 오늘보다 이전 날짜인 경우: `오늘 이후 날짜를 선택해주세요.`

## Behavior

- `상품 계속 등록`
  - 입력 유효성과 무관하게 항상 활성화하고, 등록 요청 중에만 중복 등록 방지를 위해 일시적으로 비활성화합니다.
  - 클릭하면 현재 form을 검증하고, 유효하지 않으면 field error를 표시하며 등록 요청을 보내지 않습니다.
  - 유효하면 현재 상품 1개만 등록 submit 흐름에 전달합니다.
  - 성공 전에는 입력값을 초기화하거나 다음 상품 form을 만들지 않습니다.
  - 성공하면 등록된 상품 snapshot을 유지한 채 새 빈 상품을 추가하고 touched/submitted, validation 상태를 초기화합니다.
  - 등록 성공 응답의 `data.productId`를 해당 snapshot에 저장합니다.
  - 상품이 2개 이상이면 제목 옆에 현재 순번과 전체 개수, 이전/다음 이동 화살표를 표시합니다.
  - 이미 등록된 이전 상품은 입력값을 수정할 수 있고, `수정 완료`를 누르면 저장된 `productId`로 PUT합니다.
  - 수정 성공 후 form snapshot의 입력값과 `thumbnailUrl`을 갱신하고 상품 목록·상세 cache를 invalidate합니다.
  - 기존 이미지를 변경하지 않으면 Presigned 요청과 storage PUT 없이 기존 URL을 유지합니다.
  - 새 이미지를 선택하면 업로드 결과 URL로 수정하고 snapshot의 `imageFile`은 비웁니다.
  - 수정 실패 시 편집 중인 입력값을 유지하고 오류 toast를 표시합니다.
  - 등록 상품에서 `상품 계속 등록`을 누르면 수정 요청 없이 기존 미등록 draft로 이동하거나 새 draft를 엽니다.
  - 마지막 미등록 상품의 `-` 버튼은 등록 취소만 수행하며, 등록 완료된 상품을 삭제하지 않습니다.
  - 이전 등록 상품의 `-` 버튼은 삭제 확인 modal을 열고, 확인 시 저장된 `productId`로 DELETE를 호출합니다.
  - 삭제 성공 후 해당 snapshot을 제거하고 순번/current index를 다시 계산하며, 작성 중인 미등록 draft 값은 유지합니다.
  - 삭제 실패 시 snapshot, 순번, 현재 입력을 유지하고 오류를 안내합니다.
  - 미등록 상품을 취소한 뒤 등록 상품에서 `상품 계속 등록`을 누르면 POST 없이 새 빈 상품을 다시 엽니다.
  - route를 이동하지 않고 같은 화면에서 다음 상품 입력을 시작합니다.
  - 실패하면 현재 입력값을 유지하고 오류를 안내합니다.
  - submit 중에는 두 등록 action을 비활성화해 중복 등록을 막습니다.
- `등록 완료`
  - 기본 form submit을 막습니다.
  - 현재 상품이 submit 가능 조건을 만족할 때만 활성화합니다.
  - 이미지가 있으면 `presigned URL 발급 -> storage PUT` 순서로 처리합니다.
  - 이미지가 없으면 Presigned 요청을 생략하고 payload mapper에서 `/images/product-replace.svg`를 기본 `thumbnailUrl`로 사용합니다.
  - 이미지가 있으면 storage PUT 완료 후 S3 base URL과 `objectKey`를 결합한 절대 URL을 `thumbnailUrl`로 사용합니다.
  - 업로드 결과와 form 값을 상품 등록 payload로 변환해 auth store의 `marketId`로 등록 API를 호출합니다.
  - 업로드 중에는 중복 submit을 막습니다.
  - 등록 실패 시 오류 toast를 표시하고 이동하지 않습니다.
  - 상품 등록 API가 성공하면 오늘의 특가 상품 수정 route로 이동합니다.

## Accessibility

- Page title은 visible `h1`과 `aria-labelledby='today-special-registration-title'`로 form section에 연결합니다.
- 각 input은 visible label 또는 `aria-label`을 제공합니다.
- Image upload는 hidden file input과 label click으로 native file picker를 엽니다.
- DateField는 visible placeholder/value와 `aria-label`이 있는 native date input을 함께 둡니다.
- Dropdown trigger는 `aria-expanded`를 사용합니다.
- Focus-visible 스타일을 제거하지 않습니다.

## Design / Component Notes

- Design system components: `Button`, `InlineField`, `Dropdown`, generated icon components.
- Product domain components: `DateField`, `ProductImageUploadField`
- Product domain shared UI: `ProductCategoryDropdown`.
- 상품 등록과 수정 modal은 동일한 `ProductCategoryTrigger` typography, 크기, padding, chevron을 사용합니다.
- Page-local hooks: `useTodaySpecialForm`, `useCurrentProductField`, `useCategoryDropdown`.
- Page-local sections: title, product info, price, period.
- App shared form util: touched/submitted 기준으로 visible error message를 계산합니다.
- App shared image preview hook: object URL lifecycle을 관리합니다.
- OverlayKit: category dropdown open/close controller로 사용합니다.
- `DateField`는 native date input의 브라우저 기본 icon/text를 노출하지 않기 위해 visible field와 transparent native input overlay를 사용합니다.
- 오늘의 특가 등록 시작일은 오늘 날짜를 기본값과 `min`으로 사용해 이전 날짜 선택을 막습니다.
- 상품명 또는 상품 구분 error message가 표시되면 error message 아래와 `상품 한줄 홍보글 (선택)` label 사이 간격은 `0.9rem`입니다.
- 카테고리 목록은 product domain 공용 `ProductCategoryDropdown`의 기본 테두리와 item layout을 유지합니다.
- Layout은 desktop Figma frame 기준으로 구성하고, viewport 높이가 작아 스크롤되는 경우 마지막 action button과 화면 하단 사이에 `7.2rem` 여백을 유지합니다.

## Non-Goals / Follow-Ups

- Server validation error 표시
- 상품 등록 API server validation field error mapping
- Date picker custom component 공통화

## Verification

- [ ] `/products/today-special/new` route renders `오늘의 특가 상품을 등록하세요`
- [ ] route renders inside protected sidebar layout
- [ ] sidebar `오늘의 특가 상품 등록` link has `aria-current="page"`
- [ ] image empty state renders dashed upload box
- [ ] image upload preview renders uploaded image, `status-dimmer-hover` overlay, and camera icon
- [ ] image input accepts `.jpg`, `.jpeg`, `.png`
- [ ] unsupported image file type or file over 10MB is ignored
- [ ] category trigger shows `카테고리` placeholder before selection
- [ ] category dropdown can select a category and closes after selection
- [ ] selected category item is highlighted in dropdown
- [ ] category dropdown closes on outside click and Escape
- [ ] product name trims edge spaces and limits input to 15 characters
- [ ] product description trims edge spaces, remains optional, and limits input to 25 characters
- [ ] invalid fields render icon and error messages below each field after validation
- [ ] price fields accept digits only and display comma-formatted values with `원` unit
- [ ] submit stays disabled when sale price is lower than today special price
- [ ] DateField displays today as the initial start date without browser date icon text
- [x] 오늘의 특가 등록 DateField는 읽기 전용이며 클릭 또는 키보드 입력으로 picker를 열지 않는다
- [x] `상품 계속 등록`은 입력 유효성과 무관하게 활성화되고 클릭 시 field validation을 실행한다
- [x] `상품 계속 등록`은 현재 상품 submit 성공 후 동일 route에서 새 빈 상품으로 이동한다
- [x] 등록 상품이 2개 이상이면 현재 순번과 이전/다음 이동 화살표를 표시한다
- [x] 이미 등록된 이전 상품은 등록 POST를 반복하지 않고 수정 가능한 상태로 표시한다
- [x] `상품 계속 등록` 실패 시 현재 입력값을 유지한다
- [x] 등록 요청 중 두 action이 disabled되어 중복 등록을 막는다
- [x] valid `등록 완료` submit은 이미지 업로드와 상품 등록 API 성공 후 오늘의 특가 상품 수정 화면으로 이동한다
- [x] 두 등록 action은 auth store의 실제 `marketId`로 상품 등록 API를 호출한다
- [x] 이미지가 있는 상품은 Presigned URL 발급 후 API가 요구한 header로 S3 PUT한다
- [x] 이미지가 없는 상품은 업로드 요청을 보내지 않는다
- [x] 이미지 업로드 중 등록 action이 disabled되고 `등록 중`을 표시한다
- [x] 등록 실패와 네트워크 실패에 맞는 오류 toast를 표시하고 현재 route에 머문다
- [x] 등록 성공 응답의 `productId`를 이전 등록 상품 snapshot에 저장한다
- [x] 등록 상품 수정은 해당 `productId`와 auth store의 실제 `marketId`로 PUT한다
- [x] 기존 이미지가 바뀌지 않으면 업로드를 생략하고 기존 URL을 유지한다
- [x] 새 이미지 선택 시 업로드 결과 URL로 수정하고 snapshot을 갱신한다
- [x] 수정 성공 후 상품 목록·상세 cache를 invalidate한다
- [x] 수정 실패 시 입력값과 snapshot을 유지하고 오류 toast를 표시한다
- [x] 미등록 상품의 `-`는 로컬 draft 취소만 수행한다
- [x] 등록 상품의 `-`는 확인 modal을 열고 해당 `productId`로 DELETE한다
- [x] 삭제 중 modal action을 비활성화해 중복 요청을 막는다
- [x] 삭제 성공 후 순번/current index를 갱신하고 미등록 draft 값을 보존한다
- [x] 삭제 실패 시 등록 snapshot과 modal을 유지하고 오류 toast를 표시한다
