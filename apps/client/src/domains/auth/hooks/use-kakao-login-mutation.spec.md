# Hook Spec: `useKakaoLoginMutation`

## Metadata

- Jira: DCMCL-17, DCMCL-22, DCMCL-38
- App: `client`
- Domain: `auth`
- Status: Implemented

## Purpose

- 카카오 authorization code를 서버에 전달해 동치미 access token을 발급받습니다.

## API Contract

- browser endpoint: `/api/auth/kakao/login`
- upstream endpoint: `/v1/users/login/oauth2/kakao`
- method: `POST`
- browser payload: `{ code: string, state: string }`
- upstream payload: `{ code: string }`
- response: `{ success, code, message, redirectTo }` (token은 client에 노출하지 않음)
- credentials: `include`
- cookie: Route Handler가 `access_token`, `refreshToken`을 HttpOnly 쿠키로 전달
- retry: 비활성화. authorization code는 일회용이므로 자동 재시도하지 않습니다.
- error: 공통 HTTP client가 정규화한 `ApiError`를 그대로 노출합니다.
- callback page는 개별 error code를 직접 분기하지 않고 오류 범주에 따른 사용자 메시지만 표시합니다.
- callback page는 `redirectTo`를 공통 helper로 재검증하고 안전하지 않으면 `/markets`로 이동합니다.

## Cache Update

- invalidate: 없음
- setQueryData: 없음
- optimistic update: 없음

## Verification

- [x] API contract checked
- [x] credentials 포함 여부 확인
- [x] 자동 retry 비활성화 확인
