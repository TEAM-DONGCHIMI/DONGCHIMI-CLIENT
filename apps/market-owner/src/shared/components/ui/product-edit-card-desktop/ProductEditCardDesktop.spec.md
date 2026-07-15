# Component Spec: `ProductEditCardDesktop`

## Metadata

- App: `market-owner`
- Category: `ui`
- Path: `apps/market-owner/src/shared/components/ui/product-edit-card-desktop/ProductEditCardDesktop.tsx`
- Jira: `DCMSM-12`
- Status: Implemented

## Purpose

`ProductEditCardDesktop`은 사장님 데스크탑웹 홈 화면에서 상품을 수정/삭제 가능한 카드 형태로 보여주는 app shared 컴포넌트입니다.
오늘의 특가 상품과 등록된 상품 목록에서 단일 상품 카드로 사용하며, API 요청, route 이동, 수정/삭제 mutation은 호출부가 담당합니다.

Figma APPJAM `Product Edit Card Desktop` node `793:6739`와 첨부 이미지를 기준으로 합니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.
- [x] default / selected / selectable 상태를 지원합니다.
- [x] 오늘의 특가 가격과 기간 할인 날짜는 boolean prop으로 제어합니다.
- [x] size 단위 기준은 font-size, padding, margin, width, height는 rem, border와 hairline은 px로 유지합니다.

## Props

- `productName`: 상품명입니다. 최대 2줄로 표시하고 넘치면 ellipsis 처리합니다.
- `categoryName`: 카테고리 chip 문구입니다. 기본값은 `정육`입니다.
- `viewCount`, `viewCountLabel`: 조회수 chip 문구입니다. `viewCount`가 없으면 `0 조회`를 표시하고, 1천/1만 단위는 축약 표기합니다.
- `originalPrice`: 정가 텍스트입니다. `todayDiscountPrice`가 `true`일 때만 표시합니다.
- `salePercent`: 할인율 텍스트입니다. `todayDiscountPrice`가 `true`일 때만 표시합니다.
- `salePrice`: 판매가 텍스트입니다.
- `priceUnit`: 가격 단위 문구입니다. 기본값은 `원`입니다.
- `salePercentUnit`: 할인율 단위 문구입니다. 기본값은 `%`입니다.
- `startDate`, `endDate`: 기간 할인 날짜 텍스트입니다. `endDate`가 없으면 날짜 row를 숨깁니다.
- `todayDiscountPrice`: 정가와 할인율 표시 여부입니다.
- `periodDiscountDate`: 시작 날짜와 `~` 표시 여부입니다.
- `selectionState`: `default` | `selectable` | `selected`입니다.
- `onEditClick`, `onDeleteClick`, `onSelectClick`: 버튼 클릭 callback입니다.
- `editLabel`, `deleteLabel`, `selectLabel`: 각 버튼의 accessible name에 쓰는 label입니다.

## States

- default: 흰색 카드에 카테고리, 조회수, 상품 정보, 수정/삭제 버튼을 표시합니다.
- selectable: dimmer overlay와 dashed checkbox placeholder를 표시합니다.
- selected: dimmer overlay와 checked checkbox를 표시합니다.
- no today discount: `todayDiscountPrice=false`이면 정가와 할인율을 숨기고 판매가만 표시합니다.
- no period discount date: `periodDiscountDate=false`이면 시작 날짜와 `~`를 숨기고 종료 날짜만 표시합니다.
- disabled: 지원하지 않습니다. 호출부가 카드 노출 또는 버튼 disabled 정책을 결정합니다.
- loading: 지원하지 않습니다. 호출부가 skeleton 또는 loading UI를 결정합니다.
- error: 지원하지 않습니다. 호출부가 error UI를 결정합니다.
- empty: 단일 상품 카드이므로 지원하지 않습니다. 목록 empty는 상위 list가 담당합니다.

## Behavior

1. 수정 버튼을 누르면 `onEditClick`을 호출합니다.
2. 삭제 버튼을 누르면 `onDeleteClick`을 호출합니다.
3. `selectionState`가 `selectable` 또는 `selected`이면 선택 버튼을 렌더링합니다.
4. 선택 버튼을 누르면 `onSelectClick`을 호출합니다.
5. route 이동, modal open, confirm dialog, mutation은 실행하지 않습니다.

## Styling

- root: 25.2rem fixed desktop card width, common 0 background, 1.2rem radius
- padding: top 1.2rem, horizontal 1.6rem, bottom 1.8rem
- category chip: primary light background, primary strong text, 10rem pill radius
- view chip: neutral 10 background, neutral 70 text, 0.4rem radius
- action buttons: 2.4rem square icon buttons
- product name: body-1-semibold, max 2 lines, ellipsis
- price: caption-1 original price with line-through, body-2-semibold sale row
- selected/selectable: semantic overlay dimmer over card, selection button above dimmer

## Accessibility

- root는 named `article`입니다.
- 수정/삭제 버튼은 상품명을 포함한 accessible name을 가집니다.
- 선택 버튼은 `aria-pressed`로 선택 상태를 노출합니다.
- 모든 interactive element는 native `button`과 focus-visible outline을 사용합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test:unit`
- [x] `pnpm --filter market-owner build`
- [x] `pnpm --filter market-owner build-storybook`
