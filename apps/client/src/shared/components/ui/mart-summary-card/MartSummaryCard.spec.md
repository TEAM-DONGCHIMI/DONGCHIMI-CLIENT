# Component Spec: `MartSummaryCard`

## Metadata

- App: `client`
- Category: `ui`
- Path: `apps/client/src/shared/components/ui/mart-summary-card/MartSummaryCard.tsx`
- Status: Implemented

## Purpose

- 마트 요약 정보와 대표 상품을 한 카드 안에서 보여줍니다.
- 홈, 주변 마트, 마트 상세 진입 전 영역에서 재사용할 수 있도록 앱 shared UI로 둡니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.
- [x] 프로필 이미지는 사용부에서 `profileImageSrc`로 주입합니다.
- [x] 진단보기 액션은 디자인시스템 `Button`을 사용합니다.
- [x] 할인 개수 chip은 디자인시스템 `Chip`을 사용합니다.
- [x] 상품은 `MarketCard`를 조합하며 사용부가 넘긴 목록을 가로 스크롤로 노출합니다.
- [x] `timeText`, 구분점, `areaName` 사이 간격은 `0.2rem`, 위치 정보 그룹과 할인 chip 사이는 `0.6rem`으로 분리합니다.
- [x] 디자인시스템 `Button`의 mobile size를 사용하되 카드 안에서는 `7.1rem x 3.8rem`으로 오버라이드합니다.

## Props

- `martName: string`: 마트 이름입니다.
- `timeText: string`: 소요 시간 텍스트입니다.
- `areaName: string`: 지역명입니다.
- `discountCount: number`: 할인 chip에 표시할 할인 개수입니다.
- `profileImageSrc: string`: 마트 프로필 이미지 경로입니다.
- `profileImageAlt: string`: 마트 프로필 이미지 대체 텍스트입니다.
- `products: MartSummaryProductTypes[]`: 카드에 표시할 상품 목록입니다. 최대 6개 노출과 오늘의 특가 상품 우선 배치는 사용부 데이터에서 맞춥니다.
- `actionLabel?: string`: 액션 버튼 문구입니다. 기본값은 `전단보기`입니다.
- `onActionClick?: () => void`: 액션 버튼 클릭 핸들러입니다.
- `className`과 `article` native props는 레이아웃 조정 범위에서만 사용합니다.

## States

- default: 마트 프로필, 마트명, 시간/지역, `Chip`으로 만든 할인 개수 chip, 액션 버튼, 상품 목록을 표시합니다.
- empty products: 상품 목록이 비어 있으면 상품 영역이 비어 보입니다. empty 안내는 상위 영역에서 결정합니다.
- disabled: 액션 버튼 비활성 상태는 필요해지면 상위에서 button contract 확장 후 처리합니다.
- loading: 상위 카드 또는 화면에서 skeleton으로 처리합니다.
- error: 상위 데이터 영역에서 처리합니다.
- overflow: 긴 마트명은 한 줄 ellipsis로 줄이고 상품 목록은 가로 스크롤합니다.

## Storybook

- `Default`: 사용부가 6개 상품 mock을 넘기는 기본 상태를 보여줍니다.
- `LongText`: 긴 마트명과 긴 상품명/가격 overflow를 확인합니다.
- `NoProducts`: 상품 목록이 비어 있을 때 컴포넌트가 별도 empty copy를 만들지 않는다는 점을 확인합니다.
- `CustomActionLabel`: 액션 버튼 문구와 클릭 핸들러가 props로 주입되는 상태를 확인합니다.

Storybook의 상품 mock과 페이지 preview용 mock은 컴포넌트 검증 목적으로만 사용하며, 실제 서비스 데이터나 GitHub 반영 범위로 보지 않습니다.

## Accessibility

- 마트 프로필 이미지를 설명할 수 있도록 `profileImageAlt`를 필수로 받습니다.
- 상품 목록은 `role='list'`, 각 `MarketCard`는 `role='listitem'`으로 표시합니다.
- 액션 버튼의 accessible name은 `actionLabel` 텍스트를 그대로 사용합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check -- apps/client/src/shared/components/ui/mart-summary-card`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] Storybook mock과 페이지 preview mock으로 `MartSummaryCard`의 기본/긴 텍스트/빈 상품 상태를 확인했습니다. page/fixture 변경은 검증용이며 GitHub 반영 범위에서 제외합니다.
