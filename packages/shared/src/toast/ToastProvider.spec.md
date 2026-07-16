# Hook Spec: Toast Runtime

## Metadata

- Jira: DCMFE-56, DCMSM-99
- Hook: `useToast`
- Provider: `ToastProvider`
- Owner: packages/shared
- Status: Draft

## Purpose

`ToastProvider`와 `useToast`는 앱 런타임에서 디자인시스템 `Toast`를 전역 피드백으로 띄우기 위한 공통 기능입니다.
디자인시스템 `Toast`는 UI와 접근성 기본값만 담당하고, shared toast runtime은 queue, portal, dismiss, auto dismiss를 담당합니다.

## Source Of Truth

- Related Jira: DCMFE-56
- Related component: `packages/design-system/src/components/ui/toast`
- Scope adjustment: `apps/client` provider wiring은 이번 구현에서 제외하고, `apps/market-owner` wiring만 우선 적용합니다.

## Inputs

- `ToastProvider`
  - `children: ReactNode`
  - `placement?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'`
  - `offset?: string | { x?: string; y?: string }`
  - `defaultDurationMs?: number | null`
  - `maxVisibleCount?: number`
  - `portalContainer?: Element | DocumentFragment | null`
- `useToast`
  - `show({ message, status, icon, durationMs, id })`
  - `completed(message, options)`
  - `error(message, options)`
  - `dismiss(id)`
  - `clear()`

## Returns

- `show`, `completed`, `error`는 생성된 toast id를 반환합니다.
- `dismiss`는 특정 toast를 제거합니다.
- `clear`는 현재 toast queue를 모두 제거합니다.

## Behavior

- initial state: toast queue는 비어 있습니다.
- success: `completed`는 `status='completed'`로 DS `Toast`를 렌더링합니다.
- error: `error`는 `status='error'`로 DS `Toast`를 렌더링합니다.
- queue: 여러 toast가 호출되면 `maxVisibleCount`만큼 viewport에 노출합니다.
- state limit: `maxVisibleCount`를 초과한 오래된 toast는 state에서도 제거해 숨겨진 toast가 누적되지 않게 합니다.
- auto dismiss: `durationMs`가 number이면 해당 시간이 지난 뒤 제거합니다.
- persistent: `durationMs`가 `null`이면 자동 제거하지 않습니다.
- manual dismiss: 반환된 id를 `dismiss(id)`에 전달하면 위로 이동하며 fade-out 된 뒤 제거합니다.
- viewport offset: 문자열 offset은 x/y 안전 여백을 동일하게 적용합니다.
- top layer: `document.body` portal viewport는 Popover API가 있으면 manual popover로 browser top layer에 진입해 native dialog backdrop보다 위에 표시됩니다. custom portal container는 호출부의 local stacking context를 유지합니다.
- center correction: 객체 offset의 `x`는 `top-center`/`bottom-center` placement에서 중앙 기준 보정값으로도
  사용합니다. 특정 overlay surface처럼 viewport 중앙에서 의도적으로 이동해야 하는 경우에만 object offset을
  사용합니다.
- side effects: toast 호출은 사용자 이벤트, mutation callback, 명시적 effect 같은 렌더 외부 시점에서만 수행합니다.

## API Contract

- endpoint: 없음
- method: 없음
- request: 없음
- response: 없음
- query key: 없음
- invalidation: 없음
- error mapping: 도메인별 API 에러 메시지 정책은 호출부가 결정합니다.

## Constraints

- cache: 없음
- concurrency: 같은 id로 다시 show하면 기존 toast를 교체합니다.
- cancellation: provider unmount 또는 toast dismiss 시 timer를 정리합니다.
- accessibility impact: DS `Toast`의 `role`과 `aria-live` 기본값을 유지합니다.
- viewport accessibility: viewport는 `role='region'`과 `aria-label`로 영역 이름을 제공합니다.
- fallback: Popover API를 사용할 수 없거나 top layer 진입이 거부되면 기존 fixed body portal과 z-index 정책을 유지합니다.
- app wiring: `apps/market-owner`와 `apps/client`는 각 app provider에서 placement 정책을 지정합니다.

## Verification

- [ ] `git diff --check`
- [ ] Frontend Fundamentals self-check
- [ ] state transitions covered
- [ ] `pnpm --filter @dongchimi/shared lint`
- [ ] `pnpm --filter @dongchimi/shared typecheck`
- [ ] `pnpm --filter @dongchimi/shared test:unit`
- [ ] `pnpm --filter market-owner typecheck`
- [ ] `pnpm --filter market-owner test:unit`

## Open Questions

- 모바일 웹 provider wiring과 기본 placement는 후속 작업에서 확정합니다.
