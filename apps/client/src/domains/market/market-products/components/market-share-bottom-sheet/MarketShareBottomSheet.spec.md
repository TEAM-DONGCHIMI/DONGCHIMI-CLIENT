# Component Spec: `MarketShareBottomSheet`

## Metadata

- App: `client`
- Domain: `market`
- Page: `market-products`
- Path: `apps/client/src/domains/market/market-products/components/market-share-bottom-sheet/MarketShareBottomSheet.tsx`
- Status: Implemented

## Purpose

`MarketShareBottomSheet`는 사용자 모바일 웹의 마트 전단 공유 액션을 제공하는 page-local domain component입니다.

디자인시스템의 `BottomSheet`는 modal dialog, focus, close, portal 같은 base primitive만 담당하고, 이 컴포넌트는 전단 공유 문구, 공유 링크, 링크 복사, 카카오톡 공유, QR 보기 액션을 조합합니다.

## Source Of Truth

- Figma: `APPJAM`, node `342:10904`
- Component name: `Mobile Share Bottom Sheet`
- Size reference: `375 x 430`
- Share API draft: `{ marketId, marketName, slug, qrCode }`

## Inputs

- props:
  - `marketName`: 설명 문구에 표시할 마트 이름입니다.
  - `shareUrl`: 노출하고 복사할 전단 공유 링크입니다.
  - `triggerLabel`: trigger button label입니다. 기본값은 `전단 공유하기`입니다.
  - `triggerClassName`: 호출부가 trigger 위치와 외형을 조정할 때 사용합니다.
  - `onCopyLink`: 링크 복사 액션을 호출부가 직접 처리해야 할 때 사용합니다.
  - `onShareKakao`: 카카오톡 공유 액션을 호출부가 직접 처리해야 할 때 사용합니다.
  - `onOpenQrCode`: QR 코드 보기 액션을 호출부가 직접 처리해야 할 때 사용합니다. 전달되지 않으면 QR 버튼은 비활성화됩니다.
- external state:
  - bottom sheet open state는 `BottomSheet` primitive가 관리합니다.
  - 링크 복사와 준비중 toast는 native dialog top-layer 위에 보이도록 bottom sheet dialog 내부의 local `ToastProvider`를 사용합니다.
  - 공유 API 연동 시 호출부는 `slug`로 공유 URL을 만들고, `qrCode`는 QR 보기 UI가 확정된 뒤 `onOpenQrCode` 또는 별도 QR view props로 연결합니다.

## States

- default: trigger를 누르면 공유 bottom sheet를 엽니다.
- copied: 링크 복사 fallback이 성공하면 bottom-center completed toast를 표시합니다.
- pending: Kakao SDK 연동 전까지 카카오톡 공유를 누르면 bottom-center error toast로 `아직 준비중인 기능이에요.`를 표시합니다.
- disabled: QR 보기 UI/handler가 없으면 QR 버튼은 비활성화하되 아이콘과 라벨은 유지합니다.
- loading: 지원하지 않습니다. 공유 API 연결 시 호출부에서 액션 상태를 분리합니다.
- empty: 지원하지 않습니다. `marketName`, `shareUrl`은 필수입니다.
- error: clipboard fallback 실패 시 bottom-center error toast를 표시합니다.

## Styling

- Figma 기준 `375 x 430` 모바일 시트 형태를 따르되, 실제 route에서는 bottom sheet가 viewport 하단을 채우도록 `width: 100%`를 사용합니다.
- handle은 `40 x 4`, 상단 radius는 약 `27px` 기준입니다.
- title은 `heading-3-semibold`, description/link는 `body-3`, action은 `body-2-semibold` 토큰을 사용합니다.
- 링크 복사, 카카오톡 공유, QR 코드 보기는 각각 아이콘과 라벨을 함께 표시합니다.
- 색상은 디자인시스템 `atomic`, `semantic` token을 사용합니다.
- toast icon은 디자인시스템 `IcCircleCheckFillSizeSmall`, `IcCircleExclamationFillColor0`를 사용합니다.

## Accessibility

- `BottomSheet.Title`과 `BottomSheet.Description`으로 dialog name/description을 연결합니다.
- 링크 박스의 복사 icon button에는 `aria-label="전단 링크 복사"`를 제공합니다.
- 액션 버튼은 실제 `button` element로 렌더링합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] `pnpm --filter client build-storybook`
- [ ] Figma node `342:10904` spacing/typography reference checked
