# Component Spec: `MobileModal`

## Metadata

- App: `client`
- Category: `ui`
- Path: `apps/client/src/shared/components/ui/mobile-modal/MobileModal.tsx`
- Jira: `DCMCL-7`
- Figma: `APPJAM / modal_mobile`
- Status: Implemented

## Purpose

- 모바일 화면에서 사용자가 주요 액션을 실행하기 전에 한 번 더 확인하도록 돕는 app shared modal입니다.
- Figma의 대표 사용 예시는 마트 전화 연결 확인이지만, 컴포넌트 자체는 전화/마트 도메인 문구를 내부에서 조합하지 않습니다.
- 제목, 보조 문구, 설명 문구를 호출부에서 전달하고, 사용자가 취소 또는 주요 액션을 선택할 수 있게 합니다.
- 실제 `tel:` 이동, 로깅, 라우팅, API 호출은 컴포넌트 내부에 넣지 않고 호출부 콜백으로 분리합니다.

## Requirements

- [x] `apps/client` shared component로 여러 모바일 화면에서 재사용할 수 있습니다.
- [x] route, API, analytics, `tel:` 이동 side effect를 직접 가지지 않습니다.
- [x] public props와 접근성 요구를 명시합니다.
- [x] Figma `modal_mobile`의 정보 구조와 버튼 배치를 기준으로 구현합니다.
- [x] 이벤트 핸들러를 받는 interactive component이므로 `'use client'` boundary를 명시합니다.

## Props

- `open: boolean`
  - controlled modal open 상태입니다.
- `onOpenChange: (open: boolean) => void`
  - Dialog open 상태 변경 요청을 호출부에 전달합니다.
- `title: string`
  - modal title입니다.
  - 전화 확인 예시에서는 `망원 신선마트에 전화할까요?`처럼 호출부에서 완성된 문구를 전달합니다.
- `subText?: string`
  - title 아래에 표시할 보조 문구입니다.
  - 전화 확인 예시에서는 전화번호를 전달합니다.
  - generic modal로도 사용할 수 있도록 긴 보조 문구는 줄바꿈될 수 있습니다.
- `description: string`
  - dialog description이자 본문 설명 문구입니다.
  - 전화 확인 예시에서는 `현재 영업중· 21:00까지`처럼 영업 상태 문구를 전달합니다.
- `cancelLabel?: string`
  - 취소 버튼 라벨입니다. 기본값은 `취소`입니다.
- `confirmLabel?: string`
  - 주요 액션 버튼 라벨입니다. 기본값은 `확인`입니다.
- `isConfirmButtonDisabled?: boolean`
  - 주요 액션을 막아야 할 때 사용합니다. 기본값은 `false`입니다.
- `onCancel?: MouseEventHandler<HTMLButtonElement>`
  - 취소 버튼 클릭 시 호출합니다.
  - `event.preventDefault()`가 호출되지 않으면 기본 동작으로 `onOpenChange(false)`를 호출합니다.
- `onConfirm?: MouseEventHandler<HTMLButtonElement>`
  - 주요 액션 버튼 클릭 시 호출합니다.
  - 컴포넌트는 자동으로 `tel:` 이동하거나 modal을 닫지 않습니다.
- `className?: string`
  - Dialog content 최상위에 추가할 className입니다.

## States

- default:
  - `open=true`일 때 dialog content를 렌더링합니다.
  - 호출부가 전달한 `title`, `subText`, `description`을 순서대로 표시합니다.
  - footer는 취소 / 주요 액션 버튼을 2열로 배치합니다.
- closed:
  - `open=false`일 때 dialog content는 DOM에 렌더링되지 않습니다.
- disabled:
  - `isConfirmButtonDisabled=true`이면 주요 액션 버튼이 disabled 상태가 됩니다.
- loading:
  - 지원하지 않습니다. 호출부에서 필요하면 라벨 또는 disabled 상태로 표현합니다.
- error:
  - 지원하지 않습니다. 영업 상태나 전화 가능 여부는 호출부에서 계산해 props로 전달합니다.

## Design Constraints

- Dialog primitive를 사용해 overlay, focus trap, escape close, backdrop close 동작은 design-system 구현을 따릅니다.
- content width는 Figma `modal_mobile` node 기준 최대 `30.5rem`이며, 작은 viewport에서는 `calc(100vw - 3.2rem)`로 줄어듭니다.
- content는 흰색 배경, `1.2rem` radius, shadow 없는 형태를 사용합니다.
- 본문 padding은 `2rem`이고, 내부 content 영역은 `26.5rem` 폭으로 정렬합니다.
- title / subText / description 묶음은 `0.4rem` gap을 사용합니다.
- title은 `heading-2-semibold`, subText는 `caption-1-regular`, description은 `body-3-medium`을 사용합니다.
- title은 neutral 90, subText는 neutral 50, description은 neutral 80 색상을 사용합니다.
- 하단 버튼은 DS `Button size="mobile"`을 사용하되 modal footer 안에서 동일한 폭을 갖도록 `width: 100%`, `minWidth: 0`으로 제약합니다.
- footer는 내부 content와 같은 `26.5rem` 폭이며 버튼 간격은 `0.8rem`입니다.
- 버튼 높이는 `4.4rem`, radius는 `0.8rem`, 라벨은 `body-3-semibold`를 사용합니다.
- 취소 버튼은 Figma의 회색 채움 버튼처럼 neutral 30 배경과 흰색 텍스트를 사용합니다.
- 주요 액션 버튼은 DS primary solid 버튼을 사용합니다.

## Accessibility

- `Dialog.Title`을 사용해 dialog accessible name을 제공합니다.
- `Dialog.Description`에 `subText`와 설명 문구를 함께 연결해 dialog accessible description을 제공합니다.
- 주요 액션은 `confirmLabel`의 accessible name으로 제공합니다.
- 취소/주요 액션 버튼은 실제 `<button>`이며 키보드로 조작할 수 있습니다.
- 취소 버튼은 `event.preventDefault()`를 통해 기본 닫힘 동작을 막을 수 있습니다.

## Out Of Scope

- 실제 `window.location.href = "tel:..."` 처리
- 마트 상세 API 연동
- 영업 상태 계산
- 페이지나 route에 modal 연결
- analytics/logging side effect

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client test -- MobileModal`
- [ ] 필요 시 `pnpm --filter client lint`
- [ ] 필요 시 `pnpm --filter client typecheck`
