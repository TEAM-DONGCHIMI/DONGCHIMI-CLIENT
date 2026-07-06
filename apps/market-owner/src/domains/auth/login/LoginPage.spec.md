# React Page Spec: `LoginPage`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `login`
- Route: `/login`
- Path: `apps/market-owner/src/domains/auth/login/LoginPage.tsx`
- Jira: DCMSM-15
- Status: Implemented

## Purpose

사장님웹 로그인 화면이 public auth layout에서 sidebar 없이 진입되는지 확인합니다. 실제 로그인 form과 인증 API는 후속 auth 작업에서 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Public auth layout responsibility stays in `src/app/layouts/AuthLayout.tsx`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 이번 범위에서 다루지 않습니다.
- success: `/login` route가 `로그인` heading을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- 회원가입 link는 `/signup`으로 이동합니다.
- auth API, token 저장, redirect-after-login은 후속 이슈 범위입니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `로그인`을 제공합니다.
- keyboard: 회원가입 link는 native keyboard navigation을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.

## Verification

- [ ] `/login` route renders `로그인`
- [ ] `/login` route does not render sidebar complementary landmark
- [ ] signup link routes to `/signup`
