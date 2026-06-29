# Root Entry Route Spec

## Metadata

- Jira: DCMCL-2
- Screen ID: 모바일 웹 사용자측 와이어프레임
- Route: `/`
- Owner: apps/client
- Status: Implemented

## Purpose

- 앱 첫 진입 경로를 사용자측 route gate로 둡니다.
- 인증/session 정책이 붙기 전까지 `/`는 `/login`으로 이동합니다.

## Source Of Truth

- Figma: 첨부 와이어프레임 이미지
- FRS / SRS: 없음
- Decision / Meeting note: DCMCL-2 본문
- Related Jira: DCMCL-2

## Scope

- `/` route entry에서 `/login`으로 redirect합니다.
- 추후 auth/session이 생기면 로그인 상태에 따라 `/login` 또는 `/markets`로 분기합니다.

## Out Of Scope

- session 조회
- social login 상태 판별
- splash 또는 onboarding UI

## Layout And Sections

- 별도 UI를 렌더링하지 않습니다.

## States

- loading: 없음
- empty: 없음
- error: 없음
- disabled: 없음
- selected / active: 없음

## Behavior

- navigation: `/` 진입 시 `/login`으로 redirect
- interaction: 없음
- form / validation: 없음
- API: 없음

## Accessibility

- keyboard: 별도 UI 없음
- focus: 별도 UI 없음
- accessible name: 별도 UI 없음

## Responsive

- mobile: redirect only
- tablet: redirect only
- desktop: redirect only

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/`

## Open Questions

- auth/session이 붙으면 root 분기 기준을 로그인 token, refresh 가능 여부, onboarding 완료 여부 중 무엇으로 둘지 결정합니다.
