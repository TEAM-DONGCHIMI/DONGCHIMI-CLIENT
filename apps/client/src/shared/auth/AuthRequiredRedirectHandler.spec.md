# Auth Required Redirect Handler Spec

## Metadata

- Jira: DCMCL-38
- Component: `AuthRequiredRedirectHandler`
- Owner: `apps/client/src/shared/auth`
- Status: Implemented

## Purpose

- 보호 API의 최종 `401`을 감지한 현재 화면에서 로그인 필요 Toast를 즉시 표시합니다.
- root provider를 유지하는 client-side replace로 로그인 화면에 자연스럽게 전환합니다.
- React handler가 없거나 soft navigation이 완료되지 않는 예외 상황에는 hard replace로 복구합니다.

## Boundary

- 이 컴포넌트는 route와 인증 copy를 아는 app-level orchestration이므로 범용 `shared/components`나 design system으로 승격하지 않습니다.
- HTTP client는 Toast와 Next Router를 직접 import하지 않고 cancelable browser event만 발생시킵니다.
- root `AppProviders`가 ToastProvider 내부에 handler를 한 번 조립합니다.
- app component generator는 범용 UI scaffold용이므로 이 auth orchestration에는 사용하지 않습니다.

## Composition

```text
AppProviders
  ToastProvider
    AuthRequiredRedirectHandler
    OverlayProvider
      route content
```

## Behavior

- `dongchimi:auth-required-redirect` event를 수신하면 event를 처리했다고 표시합니다.
- stable ID `auth-required`로 `서비스 이용을 위해 로그인이 필요해요.` error Toast를 먼저 표시합니다.
- event의 hard fallback URL에서 `reason`만 제거하고 `returnTo`를 유지한 `/login?returnTo=...`로 `router.replace`합니다.
- pathname이 `/login`으로 바뀌면 대기 중인 최종 `401` 요청을 해제합니다.
- soft navigation 중에는 root ToastProvider가 유지되므로 로그인 화면에서도 같은 Toast가 끊기지 않습니다.
- 같은 redirect 요청은 browser client에서 한 번으로 dedupe합니다.
- 여러 browser API instance가 동시에 event를 보내면 한 번만 이동하고 모든 pending 요청을 `/login` 도착 시 함께 해제합니다.
- 이미 `/login`에 도착한 뒤 늦게 들어온 최종 `401` event는 새 Toast나 이동 없이 즉시 해제합니다.

## Fallback

- handler가 mount되지 않았으면 event가 취소되지 않고 즉시 hard `location.replace`를 수행합니다.
- handler가 event를 처리했지만 bounded timeout 안에 `/login`에 도착하지 못하면 같은 URL로 hard replace합니다.
- hard fallback URL의 `reason=auth-required`는 로그인 화면의 `LoginRequiredToast`가 소비합니다.

## Accessibility And UX

- Toast는 design-system error Toast의 `role="alert"` semantics를 사용합니다.
- Toast 표시를 navigation보다 먼저 수행합니다.
- soft navigation URL에서는 `reason`을 제거해 로그인 화면에서 Toast를 다시 dispatch하지 않습니다.
- replace navigation으로 보호 화면과 로그인 화면의 뒤로가기 반복을 방지합니다.

## Verification

- [x] 즉시 Toast와 soft `router.replace` unit test
- [x] 로그인 pathname 도착 시 pending request 완료 unit test
- [x] handler 미설치 hard fallback unit test
- [x] soft navigation timeout hard fallback unit test
- [x] StrictMode listener/Toast 중복 방지 확인
- [x] `git diff --check`
- [x] lint
- [x] typecheck
- [x] client test
- [x] client build
- [x] browser: 최종 `401` → 즉시 Toast → client-side `/login` 전환
