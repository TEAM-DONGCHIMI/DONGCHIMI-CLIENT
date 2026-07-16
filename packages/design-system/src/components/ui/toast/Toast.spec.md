# Component Spec: `Toast`

## Metadata

- Jira: DCMDS-4
- Component: Toast
- Owner: packages/design-system
- Status: Implemented

## Purpose

`Toast`는 사용자 행동 결과를 짧은 피드백 메시지로 보여주는 디자인시스템 UI 컴포넌트입니다.
이번 범위에서는 앱 전역 호출 시스템이 아니라 Figma 기준의 시각 구조, 상태, 접근성 기본값만 제공합니다.

## Usage Location

- `packages/design-system/src/components/ui/toast/Toast.tsx`

## Source Of Truth

- Figma: APPJAM Toast `419:6992`
- Variants: `Status=Completed`, `Status=Error`
- Related Jira: DCMDS-4
- Error icon QA reference: `Circle Exclamation.svg` (24 x 24)

## Category

- `ui`

## Scope

- `completed`, `error` 상태를 지원합니다.
- message 영역은 한 줄 말줄임으로 처리합니다.
- leading icon은 Figma Toast 기준 상태별 기본 아이콘을 렌더링하고, slot으로 교체할 수 있습니다.
- 상태별 기본 `role`과 `aria-live`를 제공합니다.
- Storybook에서 기본 상태, 에러 상태, 긴 문구, icon 없는 케이스를 확인합니다.

## Out Of Scope

- `ToastProvider`, `useToast`, queue, portal, viewport 구현
- auto dismiss, promise toast, swipe dismiss 같은 런타임 동작
- `react-hot-toast`, Sonner, Radix Toast 같은 기능형 Toast 라이브러리 의존성 추가
- client 또는 market-owner 앱 전역 연결

## UI Structure

```text
Toast
  IconSlot?
  Message
```

## Props API

- component: `Toast`
- exported types: `ToastProps`
- props:
  - `status?: 'completed' | 'error'`
  - `icon?: ReactNode`
  - `children: ReactNode`
  - native `div` props except `children` and `color`
- caller responsibility:
  - 앱 런타임에서 언제 Toast를 띄우고 제거할지 결정합니다.
  - 상태별 기본 아이콘이 아닌 다른 아이콘이 필요한 경우 `icon` slot에 전달합니다.
  - icon 없이 렌더링해야 하는 경우 `icon={null}`을 전달합니다.
- non-owned behavior:
  - queue, provider, hook, animation, timeout, portal은 담당하지 않습니다.

## Variants

- `completed`: 완료/성공성 피드백
- `error`: 오류성 피드백

## States

- default: `status='completed'`
- error: `status='error'`
- disabled: 지원하지 않습니다.
- loading: 지원하지 않습니다.
- invalid: 지원하지 않습니다.

## Behavior

1. `children`을 message 영역에 렌더링합니다.
2. `icon`이 `undefined`면 Figma 기준 상태별 기본 아이콘을 장식용 slot으로 렌더링합니다.
   - `completed`: `Icon/Normal/Circle Check`의 `Name=circleCheckFill, Fill=True, color=primary, size=default`에 대응하는 `IcCircleCheckFill`
   - `error`: `Icon/Normal/Circle Exclamation` 24 x 24에 대응하는 `IcCircleExclamation`; 오류 배경 위에서 흰색으로 노출합니다.
3. `icon`에 ReactNode가 전달되면 해당 icon을 장식용 slot으로 렌더링합니다.
4. `icon={null}`이면 icon slot을 렌더링하지 않습니다.
5. `status`가 `completed`면 기본 `role='status'`, `aria-live='polite'`를 사용합니다.
6. `status`가 `error`면 기본 `role='alert'`, `aria-live='assertive'`를 사용합니다.
7. 호출부가 `role` 또는 `aria-live`를 명시하면 해당 값을 우선합니다.

## Styling

- layout: inline-flex, center aligned
- size: Figma 기준 최소 `18.4rem x 4.8rem`, 최대 폭 `33.4rem`
- spacing: 좌우 `1.8rem`, 상하 `1.2rem`, icon/message 간격 `0.4rem`
- radius: `0.8rem`
- responsive: viewport보다 넓어지지 않게 `max-width`를 `min(33.4rem, calc(100vw - 3.2rem))`로 제한합니다.
- overflow: message는 한 줄 말줄임 처리합니다.
- color: completed `atomic.neutral[90]`, error `semantic.status.negativeLight`, text `atomic.common[0]`
- icon: `2.4rem` slot 안에 완료 상태는 기존 circle check, 오류 상태는 흰색 circle exclamation 아이콘을 렌더링합니다.
- typography: `typography['body-3-regular']`

## Accessibility

- semantic element: `div`
- accessible name: message text
- keyboard interaction: 없음
- focus-visible: interactive component가 아니므로 없음
- ARIA: 상태별 기본 `role`과 `aria-live`를 제공합니다.

## Storybook

- [x] Completed
- [x] Error
- [x] WithoutIcon
- [x] LongMessage
- [x] StatusMatrix

## Export Checklist

- [x] `Toast` value export
- [x] `ToastProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
