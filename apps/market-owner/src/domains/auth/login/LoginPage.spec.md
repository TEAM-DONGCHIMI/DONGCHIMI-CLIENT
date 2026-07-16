# React Page Spec: `LoginPage`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `login`
- Route: `/login`
- Path: `apps/market-owner/src/domains/auth/login/LoginPage.tsx`
- Jira: DCMSM-15, DCMSM-23, DCMSM-99
- Status: Implemented

## Purpose

점주 로그인 화면을 public auth layout에서 sidebar 없이 렌더링하고, Figma `APPJAM`
node `1608:108630`의 카드 내부 구조를 제공합니다. 실제 로그인 API와 인증 상태 저장은 후속
auth 작업에서 연결합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- `TextInput` error/status prop derivation is shared with `signup` via `domains/auth/hooks/get-text-input-status-props.ts`.
- Email-required/format and password-required copy is shared with `signup` via `domains/auth/constants/auth-messages.ts`.
- Public auth layout responsibility stays in `src/app/layouts/AuthLayout.tsx`.
- Login card shell is composed directly in `LoginPage` with the design-system layout primitive.
- Login card content is composed directly in this page from two independent screen sections: `sections/login-form` (`LoginForm`) and `sections/signup-prompt` (`SignupPrompt`), laid out with the page-local `contentClassName` in `LoginPage.css.ts`.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty: 이번 범위에서 다루지 않습니다.
- error: 이번 범위에서 다루지 않습니다.
- success: `/login` route가 `마트 관리자 로그인` heading, 이메일/비밀번호 입력창, 로그인 버튼,
  회원가입 링크를 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- 로그인 상단 브랜드 이미지는 기존 app-shared `Img_pavicon.svg`를 재사용하고 92×32로 표시합니다.
- 이메일과 비밀번호 입력창은 디자인 시스템 `TextInput`을 사용합니다.
- 로그인 버튼은 디자인 시스템 `Button`을 사용하며, API 연동 전까지 disabled 상태로 둡니다.
- 로그인 상태 유지 선택지는 native checkbox와 디자인 시스템 체크박스 아이콘을 함께 사용합니다.
- 회원가입 링크는 `/signup`으로 이동합니다.
- auth API, token 저장, redirect-after-login은 후속 이슈 범위입니다.

## Accessibility

- heading order: card 내부 visible `h1`으로 `마트 관리자 로그인`을 제공합니다.
- keyboard: 입력창, checkbox, 회원가입 링크는 native keyboard navigation을 사용합니다.
- focus: checkbox와 회원가입 링크는 focus-visible outline을 유지합니다.

## Verification

- [ ] `/login` route renders `마트 관리자 로그인`
- [ ] login renders the app-shared brand logo at 92×32
- [ ] `/login` route does not render sidebar complementary landmark
- [ ] signup link routes to `/signup`
