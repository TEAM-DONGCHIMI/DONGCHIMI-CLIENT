# Component Spec: `MarketShareBottomSheet`

## Metadata

- App: `client`
- Domain: `market`
- Page: `market-products`
- Path: `apps/client/src/domains/market/market-products/components/market-share-bottom-sheet/MarketShareBottomSheet.tsx`
- Status: Implemented

## Purpose

`MarketShareBottomSheet`는 사용자 모바일 웹의 마트 전단 공유 액션을 제공하는 page-local domain component입니다.

디자인시스템의 `BottomSheet`는 modal dialog, focus, close, portal 같은 base primitive만 담당하고, 이 컴포넌트는 전단 공유 문구, 공유 링크, 링크 복사, 카카오톡 공유, PWA 설치 안내 액션을 조합합니다.

## Source Of Truth

- Share Figma: `APPJAM`, node `342:10904`
- Install guide Figma: `APPJAM`, node `4190:55134` / bottom sheet `4190:55194`
- Component name: `Mobile Share Bottom Sheet`, `마트 전단 바텀시트`
- Size reference: share `375 x 430`, install guide `375 x 397`
- Share API draft: `{ marketId, marketName, slug, qrCode }`

## Public API

- `MarketShareBottomSheet`와 `MarketShareBottomSheetProps`만 page-local index에서 export합니다.
- PWA prompt 상태와 설치 안내 view는 public prop으로 노출하지 않고 앱 공용 `usePwaInstall`과 컴포넌트 내부 상태로 조합합니다.

## Inputs

- props:
  - `marketName`: 설명 문구에 표시할 마트 이름입니다.
  - `shareUrl`: 노출하고 복사할 전단 공유 링크입니다.
  - `triggerLabel`: trigger button label입니다. 기본값은 `전단 공유하기`입니다.
  - `triggerClassName`: 호출부가 trigger 위치와 외형을 조정할 때 사용합니다.
  - `onCopyLink`: 링크 복사 액션을 호출부가 직접 처리해야 할 때 사용합니다.
  - `onShareKakao`: 카카오톡 공유 액션을 호출부가 직접 처리해야 할 때 사용합니다.
- external state:
  - bottom sheet open state와 share/install view 전환은 이 컴포넌트가 controlled state로 관리하고, modal/focus/portal 동작은 `BottomSheet` primitive에 위임합니다.
  - 링크 복사와 준비중 toast는 native dialog top-layer 위에 보이도록 bottom sheet dialog 내부의 local `ToastProvider`를 사용합니다.
  - app root의 `PwaInstallProvider`가 보관한 설치 prompt와 설치 상태를 `usePwaInstall`로 소비합니다.
  - 공유 API 연동 시 호출부는 `slug`로 공유 URL을 만듭니다.

## States

- default: trigger를 누르면 공유 bottom sheet를 엽니다.
- copied: 링크 복사 fallback이 성공하면 bottom-center completed toast를 표시합니다.
- pending: Kakao SDK 연동 전까지 카카오톡 공유를 누르면 bottom-center error toast로 `아직 준비중인 기능이에요.`를 표시합니다.
- installGuide: `앱으로 전단보기`를 누르면 같은 modal context 안에서 설치 안내 view로 전환합니다.
- installPrompt: prompt 지원 브라우저에서 `홈 화면에 추가하기`를 누르면 네이티브 설치 UI를 호출합니다.
- promptUnavailable: prompt 미지원 또는 이미 설치된 환경에서도 첨부 디자인의 설치 안내 view를 유지하며 별도 앱 내부 후속 안내를 표시하지 않습니다.
- empty: 지원하지 않습니다. `marketName`, `shareUrl`은 필수입니다.
- error: clipboard fallback 실패 시 bottom-center error toast를 표시합니다.

## Styling

- Figma 기준 `375 x 430` 모바일 시트 형태를 따르되, 실제 route에서는 bottom sheet가 viewport 하단을 채우도록 `width: 100%`를 사용합니다.
- handle은 `40 x 4`, 상단 radius는 약 `27px` 기준입니다.
- title은 `heading-3-semibold`, description/link는 `body-3`, action은 `body-2-semibold` 토큰을 사용합니다.
- 링크 복사, 카카오톡 공유, 앱으로 전단보기는 각각 아이콘과 라벨을 함께 표시합니다.
- 설치 안내 view는 Figma `263 x 177` illustration, 중앙 안내 문구, `263 x 44` primary action, secondary close action 순서를 유지합니다.
- 페이지가 스크롤된 상태에서 열어도 디자인시스템 `BottomSheet`의 scroll lock을 통해 sheet 하단과 기존 문서 위치를 유지합니다.
- 색상은 디자인시스템 `atomic`, `semantic` token을 사용합니다.
- 완료 toast icon은 기존 `IcCircleCheckFillSizeSmall`을 유지하고, 오류 toast는 디자인시스템 `Toast`의 기본 `IcCircleExclamation`을 사용합니다.

## Accessibility

- `BottomSheet.Title`과 `BottomSheet.Description`으로 dialog name/description을 연결합니다.
- 링크 박스의 복사 icon button에는 `aria-label="전단 링크 복사"`를 제공합니다.
- 액션 버튼은 실제 `button` element로 렌더링합니다.
- 시각적 제목이 없는 설치 안내 view도 visually-hidden `BottomSheet.Title`로 dialog name을 제공합니다.
- 설치 안내 문구와 CTA label은 첨부 디자인의 단일 상태로 유지합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client test`
- [x] `pnpm --filter client build`
- [x] `pnpm --filter client build-storybook`
- [x] Figma nodes `342:10904`, `4190:55134` spacing/typography reference checked
- [x] Playwright 375px exact sheet geometry and 320px overflow checked
- [x] Playwright WebKit 375px scrolled-page open/close에서 viewport bottom 고정과 scroll 위치 복원 확인
