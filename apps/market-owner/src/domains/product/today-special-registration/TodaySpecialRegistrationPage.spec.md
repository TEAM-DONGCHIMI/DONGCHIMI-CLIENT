# React Page Spec: `TodaySpecialRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `today-special-registration`
- Route: `/products/today-special/new`
- Path: `apps/market-owner/src/domains/product/today-special-registration/TodaySpecialRegistrationPage.tsx`
- Jira: DCMSM-21
- Status: UI implemented, API integration pending

## Purpose

오늘의 특가 상품 등록 page가 protected sidebar layout 안에서 상품 등록 form UI를 제공합니다.
Figma `APPJAM` node `1553:80268`, `1553:80269`, `1553:80560`, `1553:80571`, dropdown node `1553:80444`
및 화면설계서의 입력/노출 규칙을 기준으로 구현합니다.

실제 등록 API, presigned image upload API, server validation error 표시는 후속 API 연동 범위입니다.
Client-side field validation error는 필드 아래 메시지로 표시합니다.

## Ownership

- Route object는 `src/app/router.tsx`가 소유하고, 이 page는 route-independent 화면 composition만 담당합니다.
- Sidebar/protected layout은 `src/app/layouts/SidebarLayout.tsx`, `src/app/routes/ProtectedRoute.tsx` 책임입니다.
- Page-local UI는 `sections/*`와 `components/*`에 둡니다.
- Page-local form type, sanitizer, validation helper, image validation alias는 `model/*`에 둡니다.
- Category options는 `fixtures/*`에 둡니다.
- 이 작업에서는 sidebar layout 파일을 수정하지 않습니다.

## Structure

- `TodaySpecialRegistrationPage.tsx`
  - 페이지 shell, section 조합, submit 성공 후 route 이동을 담당합니다.
- `hooks/useTodaySpecialForm.ts`
  - RHF form 생성, field array, 현재 상품 index, submit disabled 상태를 소유합니다.
- `hooks/useCurrentProductField.ts`
  - 현재 상품의 text/date/price field change, blur, formatting, error message 계산을 담당합니다.
- `hooks/useCategoryDropdown.tsx`
  - category dropdown open/close 상태를 OverlayKit overlay id로 관리합니다.
  - trigger 위치를 기준으로 dropdown max height를 계산하고, 외부 click과 Escape close 동작을 담당합니다.
- `hooks/useProductDraftNavigation.ts`
  - 상품 draft 추가, 삭제, 이전, 다음 이동을 담당합니다.
- `sections/RegistrationTitleSection.tsx`
  - title, `(현재/전체)` count, 이전/다음/삭제 icon button을 렌더링합니다.
- `sections/ProductInfoSection.tsx`
  - 상품 이미지, 상품명, 상품 구분 dropdown, 상품 한줄 홍보문구를 렌더링합니다.
- `sections/ProductPriceSection.tsx`
  - 오늘의 특가, 판매가 input을 렌더링합니다.
- `sections/ProductPeriodSection.tsx`
  - 행사 시작일 field를 배치합니다.
- `../components/date-field/DateField.tsx`
  - visible `YYYY-MM-DD` field와 투명 native `type=date` input overlay를 결합합니다.
  - native date icon/text는 숨기고, `showPicker()`로 date picker를 엽니다.
- `components/CategoryDropdownOverlay.tsx`
  - trigger wrapper 안에서 실제 `Dropdown`, `Dropdown.Item` UI를 렌더링합니다.
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
- multi product: 상품이 2개 이상이면 title에 `(현재/전체)`, 이전/다음 button, 삭제 button을 표시합니다.
- disabled submit: 필수값이 비어 있거나 form completion 조건을 만족하지 않으면 `등록 완료`를 disabled 처리합니다.
- field error: blur 또는 submit validation 이후 필드 아래에 icon과 error message를 표시합니다.
- server error: API 연결 시 추가합니다.
- loading: 이번 범위에서 다루지 않습니다.

## Form Rules

- 이미지
  - 선택 등록입니다.
  - 등록하지 않으면 후속 submit에서 기본 이미지를 사용합니다.
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
- 상품 한줄 홍보문구
  - 선택 입력입니다.
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
  - 시작일은 date picker로 선택합니다.
  - 시작일은 오늘 날짜가 기본값입니다.
  - 시작일은 필수 입력이며, 오늘보다 이전 날짜는 선택할 수 없습니다.
  - visible text는 `YYYY-MM-DD` 형식입니다.

## Field Error Messages

- 상품명
  - 미입력 또는 공백만 입력한 경우: `상품명을 입력해주세요.`
  - 최대 글자 수를 초과한 경우: `상품명은 공백 포함 15자 이하로 입력해주세요.`
- 상품 구분
  - 미선택한 경우: `카테고리를 선택해주세요.`
- 상품 한줄 홍보문구
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
  - 항상 활성화합니다.
  - 새 빈 상품 draft를 추가하고 해당 draft로 이동합니다.
  - 동일 화면에서 다음 상품을 이어서 입력합니다.
- 이전/다음 icon button
  - 상품 draft가 2개 이상일 때만 표시합니다.
  - 첫 상품에서는 이전 button을 disabled 처리합니다.
  - 마지막 상품에서는 다음 button을 disabled 처리합니다.
  - 양쪽 chevron은 같은 left chevron SVG를 사용하고, 다음 icon만 180도 회전해 크기/두께 차이를 없앱니다.
- 삭제 icon button
  - 상품 draft가 2개 이상일 때만 표시합니다.
  - 현재 draft를 제거하고, 제거한 draft의 preview URL을 정리합니다.
- `등록 완료`
  - 기본 form submit을 막습니다.
  - 모든 draft가 submit 가능 조건을 만족할 때만 활성화합니다.
  - API 연결 전까지는 TODO hook point를 남기고 유효한 submit 시 home route로 이동합니다.
  - 후속 API 연결 시 `presigned URL 발급 -> storage PUT -> 상품 payload submit -> 성공 시 home 이동` 순서로 교체합니다.

## Accessibility

- Page title은 visible `h1`과 `aria-labelledby='today-special-registration-title'`로 form section에 연결합니다.
- 각 input은 visible label 또는 `aria-label`을 제공합니다.
- Image upload는 hidden file input과 label click으로 native file picker를 엽니다.
- DateField는 visible placeholder/value와 `aria-label`이 있는 native date input을 함께 둡니다.
- Dropdown trigger는 `aria-expanded`를 사용합니다.
- Product navigation group은 `aria-label='등록 상품 전환'`을 제공합니다.
- Focus-visible 스타일을 제거하지 않습니다.

## Design / Component Notes

- Design system components: `Button`, `IconButton`, `InlineField`, `Dropdown`, generated icon components.
- Product domain components: `DateField`, `ProductImageUploadField`
- Page-local components: `CategoryDropdownOverlay`.
- Page-local hooks: `useTodaySpecialForm`, `useCurrentProductField`, `useCategoryDropdown`, `useProductDraftNavigation`.
- Page-local sections: title, product info, price, period.
- App shared form util: touched/submitted 기준으로 visible error message를 계산합니다.
- App shared image preview hook: object URL lifecycle을 관리합니다.
- OverlayKit: category dropdown open/close controller로 사용합니다.
- Title count는 title text 바로 뒤에 표시하고, count와 chevron group 사이 간격은 `0.8rem`입니다.
- `DateField`는 native date input의 브라우저 기본 icon/text를 노출하지 않기 위해 visible field와 transparent native input overlay를 사용합니다.
- 오늘의 특가 등록 시작일은 오늘 날짜를 기본값과 `min`으로 사용해 이전 날짜 선택을 막습니다.
- 상품명 error message가 표시되면 error message 아래와 `상품 한줄 홍보문구` label 사이 간격은 `0.9rem`입니다.
- Layout은 desktop Figma frame 기준으로 sidebar layout 내부 no-scroll form 화면을 목표로 합니다.

## Non-Goals / Follow-Ups

- Server validation error 표시
- Loading/submitting state
- 실제 presigned image upload
- 실제 상품 등록 mutation
- 등록 실패/네트워크 실패 toast 또는 field error
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
- [ ] DateField prevents selecting a date before today
- [ ] clicking DateField opens native date picker
- [ ] pressing Enter or Space on DateField opens native date picker
- [ ] `상품 계속 등록` stays enabled and opens a fresh product draft
- [ ] title count and previous/next/delete controls render when there are multiple drafts
- [ ] valid `등록 완료` submit navigates to home before API integration is wired
