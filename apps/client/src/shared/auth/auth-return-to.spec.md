# Authentication Return Path Spec

## Metadata

- Jira: DCMCL-38
- Owner: `apps/client/src/shared/auth/auth-return-to.ts`
- Status: Implemented

## Purpose

- 보호 경로의 최종 `401`에서 로그인 화면으로 이동할 때 현재 내부 경로를 안전하게 보존합니다.
- 카카오 OAuth 왕복 후 같은 검증 규칙으로 원래 마트 경로에 복귀합니다.

## Inputs And Returns

- input: nullable/unknown URL string
- allowed output: `/markets` 또는 `/markets/` 하위 pathname과 search params
- fallback: `/markets`
- hash: 로그인 복귀에 필요하지 않으므로 보존하지 않습니다.

## Validation

- `/`로 시작하는 내부 상대 경로만 허용합니다.
- protocol-relative URL, absolute URL, 역슬래시, 제어문자, 과도하게 긴 값은 거부합니다.
- 고정 dummy origin으로 URL을 정규화한 뒤 origin과 pathname allowlist를 다시 확인합니다.
- `/markets-evil`, dot-segment로 `/markets` 밖으로 벗어나는 값, `/login`, `/oauth/callback`, `/api`는 거부합니다.
- 서버 authorize/login과 클라이언트 redirect/callback은 같은 helper를 사용합니다.

## Login Redirect

- query: `reason=auth-required`, `returnTo=<validated path>`
- 기본 navigation: cancelable app event를 root handler가 처리하고 Toast를 즉시 표시한 뒤 `reason`만 제거한 `/login?returnTo=...`로 `router.replace`합니다.
- soft navigation은 root ToastProvider를 유지해 안내가 route 전환 중 끊기지 않으며 전체 문서 reload를 만들지 않습니다.
- handler가 없거나 soft navigation이 bounded timeout 안에 끝나지 않으면 `reason`이 포함된 URL로 `window.location.replace`합니다.
- 로그인 route 도착 또는 bounded hard navigation 대기 전에는 최종 `401` 요청을 pending으로 유지해 기존 화면의 조회 실패/재시도 UI가 렌더되지 않게 합니다.
- 로그인 route 도착 뒤 늦게 완료된 보호 화면 요청은 새 redirect를 시작하지 않아 기존 `returnTo`를 덮어쓰지 않습니다.
- 현재 `pathname + search`만 수집하고 origin이나 hash는 포함하지 않습니다.

## OAuth Storage

- OAuth `state`와 분리된 `kakao_oauth_return_to` HttpOnly cookie를 사용합니다.
- cookie는 `Path=/api/auth/kakao`, `SameSite=Lax`, 10분 TTL, production `Secure` 정책을 사용합니다.
- login BFF의 모든 성공/실패 terminal path에서 state와 returnTo cookie를 함께 삭제합니다.

## Verification

- [x] 허용/거부/fallback table unit test
- [x] 로그인 href encoding unit test
- [x] immediate Toast/soft navigation/hard fallback unit test
- [x] authorize/login Route Handler integration test
- [x] callback page safe redirect/fallback test
- [x] `git diff --check`
