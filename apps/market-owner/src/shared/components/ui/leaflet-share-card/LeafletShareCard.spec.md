# Component Spec: `LeafletShareCard`

## Metadata

- App: `market-owner`
- Category: `ui`
- Figma: [APPJAM `Mobile Share Bottom Sheet` node 2403:118519](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=2403-118519&m=dev)
- Path: `apps/market-owner/src/shared/components/ui/leaflet-share-card/LeafletShareCard.tsx`
- Status: Implemented

## Purpose

- 전단 공유 링크를 표시하고, 링크 복사와 매장 고유 QR 코드 보기 액션을 제공하는 앱 shared 카드입니다.
- 홈 페이지뿐 아니라 전단/상품 관련 화면에서 같은 공유 카드가 필요할 수 있어 `market-owner` 앱 shared
  `ui` 컴포넌트로 둡니다.
- route, API, analytics, toast, clipboard 구현은 내부에 숨기지 않고 호출부가 handler로 주입합니다.

## Requirements

- [x] 앱 내부 shared component로 둘 근거가 있습니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.

## Props

- `shareUrl: string`
- `title?: string`
- `description?: string`
- `copyLabel?: string`
- `qrLabel?: string`
- `onCopyLink: () => void`
- `onOpenQrCode: () => void`
- native `section` props except `children`

## States

- default: title, description, share URL field, link copy action, QR action을 렌더링합니다.
- disabled: 이번 컴포넌트는 disabled 상태를 소유하지 않습니다. 호출부에서 handler 정책을 결정합니다.
- loading: none
- error: none

## Design Constraints

- root: white surface, radius `20px`
- header padding: `20px 20px 0`
- title-description gap: `4px`
- title: `body-1-semibold`, neutral 90
- description: `body-3-medium`, neutral 50
- description to link field gap: `18px`
- link field: neutral 10, radius `12px`, padding `14px 16px`
- link field text: `body-3-regular`, neutral 60
- link field to first action gap: `8px`
- action list: action icon-label gap `16px`, action vertical padding `8px`, action group gap `2px`
- action icon circle: `40px`, border neutral 40, icon `20px`
- action label: `body-2-semibold`, neutral 80

## Accessibility

- DOM은 `section`으로 렌더링하고 title을 `aria-labelledby`로 연결합니다.
- link field의 copy icon button은 `전단 공유 링크 복사` accessible name을 가집니다.
- action은 native `button`으로 렌더링합니다.
- action icons are decorative and use `aria-hidden="true"`.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test`
- [x] `pnpm --filter market-owner build`
