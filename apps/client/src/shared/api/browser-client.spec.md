# Browser API Authentication Retry Spec

## Metadata

- Jira: DCMCL-17, DCMCL-22, DCMCL-38, DCMCL-41
- Owner: `apps/client/src/shared/api/browser-client.ts`
- Status: Implemented

## Purpose

- 브라우저 BFF 요청이 `401`을 반환하면 token refresh Route Handler를 호출합니다.
- refresh 성공 후 실패한 원 요청을 한 번만 재시도합니다.
- refresh가 `401`로 실패하거나 재시도 후 최종 `401`일 때만 로그인 이동을 요청합니다.
- 브라우저 JavaScript는 access token과 refresh token을 직접 읽거나 저장하지 않습니다.

## Behavior

- `401`이 아닌 응답은 refresh하지 않습니다.
- 최초 `401` 응답에만 `POST /api/auth/token/refresh`를 호출합니다.
- refresh 성공 시 원 요청을 한 번 재시도합니다.
- body가 있는 POST/PUT 요청도 소비된 `Request`를 직접 복제하지 않고 Ky가 안전하게 재시도합니다.
- 재시도 응답이 다시 `401`이면 추가 refresh 없이 최종 인증 실패 callback을 호출합니다.
- 로그인과 refresh를 포함한 `/api/auth/*` 요청은 `401`이어도 refresh하지 않습니다.
- 동시에 여러 요청이 `401`을 반환하면 진행 중인 refresh 요청 하나를 공유합니다.
- 같은 origin의 여러 탭과 PWA 컨텍스트에서 발생한 refresh 요청은 Web Locks로 직렬화해 회전 token 경쟁을 방지합니다.
- Web Locks를 지원하지 않는 환경에서는 현재 JavaScript 실행 컨텍스트의 Promise 공유만 적용합니다.
- refresh가 `401`로 실패하면 최초 `401`을 유지하고 원 요청을 재시도하지 않은 채 최종 인증 실패 callback을 호출합니다.
- refresh가 network 또는 `5xx`로 실패하면 원 요청을 재시도하거나 로그인 이동 callback을 호출하지 않고 최초 `401`을 반환합니다.
- 같은 browser API instance의 동시 최종 `401`은 로그인 이동 callback을 한 번만 호출합니다.
- 진행 중인 redirect Promise는 같은 browser API instance의 최종 `401` 요청이 공유합니다.
- 로그인 route 도착 또는 fallback 종료로 redirect Promise가 settle되면 초기화해 이후 별개의 최종 `401`을 처리합니다.
- 로그인 route 도착 뒤 이전 보호 화면에서 늦게 완료된 최종 `401`은 새 redirect를 시작하지 않습니다.
- `403`, `404`, network/`5xx`는 refresh 또는 로그인 이동 callback을 호출하지 않습니다.

## Authentication Redirect Boundary

- HTTP client는 최종 `401` 감지와 callback 호출만 담당합니다.
- 기본 callback은 현재 `pathname + search`를 안전한 `returnTo`로 정규화한 cancelable app event를 발생시킵니다.
- root handler는 Toast를 즉시 표시하고 `/login?returnTo=...`로 client-side replace합니다.
- handler가 없으면 `/login?reason=auth-required&returnTo=...`로 즉시 hard replace하고, soft navigation이 timeout되면 같은 hard fallback을 사용합니다.
- 로그인 route 도착 또는 bounded hard navigation 대기가 끝날 때까지 최종 `401` 요청을 pending으로 유지해 기존 화면의 조회 실패/재시도 UI를 노출하지 않습니다.
- `returnTo`는 `/markets` 또는 `/markets/` 하위 내부 상대 경로만 허용합니다.
- 로그인 화면, OAuth callback, API 경로, 외부 URL은 `returnTo`로 허용하지 않습니다.
- auth API 자체의 `401`은 자동 로그인 이동에서 제외해 로그인 루프를 방지합니다.

## Retry Policy

- Ky의 일반 network/status retry는 비활성화합니다.
- 인증 refresh가 성공한 경우에만 Ky의 강제 retry를 최대 한 번 사용합니다.

## Verification

- [x] browser API integration test
- [x] immediate Toast + soft navigation handler test
- [x] hard fallback and redirect Promise reset test
- [x] lint
- [x] typecheck
- [x] build
