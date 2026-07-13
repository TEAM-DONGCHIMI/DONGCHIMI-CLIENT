# Hook Spec: `useKakaoLoginMutation`

## Metadata

- Jira: DCMCL-17
- App: `client`
- Domain: `auth`
- Status: Implemented

## Purpose

- 카카오 authorization code를 서버에 전달해 동치미 access token을 발급받습니다.

## API Contract

- endpoint: `/v1/users/login/oauth2/kakao`
- method: `POST`
- payload: `{ code: string }`
- response: `{ success, code, message, data: { accessToken } }`
- credentials: `include`
- retry: 비활성화. authorization code는 일회용이므로 자동 재시도하지 않습니다.
- error: 공통 `ApiError`로 정규화하고 callback page에서 서버 code를 매핑합니다.

## Cache Update

- invalidate: 없음
- setQueryData: 없음
- optimistic update: 없음

## Verification

- [ ] API contract checked
- [ ] credentials 포함 여부 확인
- [ ] 자동 retry 비활성화 확인
