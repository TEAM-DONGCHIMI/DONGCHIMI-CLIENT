# Hook Spec: `useDebouncedValue`

## Metadata

- Jira: DCMSM-27
- Hook: `useDebouncedValue`
- Owner: `apps/market-owner/src/shared/hooks`
- Status: Implemented

## Purpose

입력값이 빠르게 변경될 때 마지막 변경 후 지정한 시간 동안 추가 변경이 없을 때만 값을 반영합니다.
검색 API 연동 시 입력 이벤트마다 네트워크 요청이 발생하지 않도록 호출부/API hook에서 사용할 수
있는 app-shared hook입니다.

## Source Of Truth

- Related page/component: `HomeSearchPanel`, `ProductSearchPanel`
- Related Jira: DCMSM-27
- Reference: MDN Debounce glossary

## Inputs

- `value`: debounce 대상 값입니다.
- `delayMs`: debounce 지연 시간입니다. 기본값은 `300`입니다.

## Returns

- `debouncedValue`: 마지막 입력 후 `delayMs`가 지난 뒤 갱신되는 값입니다.

## Behavior

- initial state: 첫 render에서는 전달받은 `value`를 그대로 반환합니다.
- update: `value` 또는 `delayMs`가 바뀌면 기존 timer를 정리하고 새 timer를 등록합니다.
- cleanup: unmount 또는 dependency 변경 시 pending timer를 정리합니다.

## API Contract

- endpoint: none
- method: none
- request: none
- response: none
- query key: none
- invalidation: none
- error mapping: none

## Constraints

- cache: none
- concurrency: 마지막 입력만 반영합니다.
- cancellation: `window.clearTimeout`으로 pending update를 취소합니다.
- accessibility impact: none

## Verification

- [x] `git diff --check`
- [x] Frontend Fundamentals self-check
- [x] state transitions covered
- [ ] API contract checked: API 미연동 범위라 해당 없음

## Open Questions

- API 연동 시 화면별 검색 UX에 맞춰 `delayMs` 기본값을 그대로 쓸지, 호출부에서 조정할지 결정합니다.
