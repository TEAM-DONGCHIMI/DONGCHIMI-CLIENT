# Component Spec: `HomeQuickButton`

## Metadata

- App: `market-owner`
- Domain: `home`
- Page: `overview`
- Figma: [APPJAM `button_home quick` node 2403:69244](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=2403-69244&m=dev)
- Path: `apps/market-owner/src/domains/home/overview/components/home-quick-button/HomeQuickButton.tsx`
- Status: Implemented

## Purpose

- Figma `button_home quick` node `2403:69244`를 홈 hero 영역에서 반복 사용할 수 있는 page-local
  button component로 제공합니다.
- 홈 quick button의 title, description, 오른쪽 visual slot, native button behavior를 한 곳에서
  관리합니다.

## Inputs

- props:
  - `label: string`
  - `description: string`
  - `visual?: ReactNode`
  - native `button` props except `children`
- external state: none

## States

- default: 312x74 기준의 흰색 surface, label, description, 오른쪽 mint visual slot을 렌더링합니다.
- hover: Figma `Status=hover` variant 기준으로 dimmer overlay를 노출합니다.
- focus-visible: primary focus outline을 노출합니다.
- loading: none
- empty: `label`과 `description`은 필수이므로 별도 empty 상태를 제공하지 않습니다.
- error: none

## Design Constraints

- height: `74px`
- target width: parent에서 `312px` 기준으로 사용합니다.
- border radius: `12px`
- padding: `14px 22px`
- text gap: `2px`
- visual slot: `46px`, radius `8px`
- label: `body-2-semibold`, neutral 90
- description: `caption-1-medium`, neutral 70
- sibling gap in hero list: `8px`

## Accessibility

- DOM은 native `button`으로 렌더링합니다.
- accessible name은 button text content인 `label`과 `description`으로 구성됩니다.
- visual slot은 장식 요소로 보고 `aria-hidden="true"`를 적용합니다.

## Verification

- [x] `git diff --check`
- [x] state coverage checked
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test`
- [x] `pnpm --filter market-owner build`
