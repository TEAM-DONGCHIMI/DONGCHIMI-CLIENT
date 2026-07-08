# React Page Spec: `SignupPage`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `signup`
- Route: `/signup`
- Path: `apps/market-owner/src/domains/auth/signup/SignupPage.tsx`
- Jira: DCMSM-15
- Status: Implemented
- Figma: APPJAM node `1608:108592`

## Purpose

사장님웹 회원가입 화면의 초기 form UI를 public auth layout 안에서 렌더링합니다.
이번 범위는 Figma 기준 empty/default UI이며 실제 회원가입 API, 검증, submit 동작은 후속 auth 작업에서 연결합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Public auth layout responsibility stays in `src/app/layouts/AuthLayout.tsx`.
- Page-local spacing and signup-specific presentation stay in `SignupPage.css.ts`.
- Form primitives use design-system `Flex`, `TextInput`, and `Button`.

## UI States

- default: logo slot, `회원가입` heading, helper description, email/password/password confirm fields, disabled submit CTA를 렌더링합니다.
- disabled: API와 validation 전까지 `가입 완료` CTA는 disabled 상태입니다.
- loading: 이번 범위에서 다루지 않습니다.
- error: 이번 범위에서 다루지 않습니다.
- success: 이번 범위에서 다루지 않습니다.

## Data

- query: none
- mutation: none
- fixture: none
- model: none

## Behavior

- `/signup`은 `AuthLayout` 아래에서 sidebar 없이 렌더링합니다.
- 입력 필드는 native input semantics와 browser autocomplete hint를 제공합니다.
- submit CTA는 비활성화되어 실제 submit을 발생시키지 않습니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `회원가입`을 제공합니다.
- field labels: `TextInput` visible label이 각 input의 accessible name입니다.
- button: `가입 완료`는 native disabled button으로 노출합니다.
- decorative logo: favicon image is decorative and hidden from accessible names.
- focus: design-system input/button focus-visible style을 유지합니다.

## Verification

- [ ] `/signup` route renders `회원가입`
- [ ] `/signup` route does not render sidebar complementary landmark
- [ ] email, password, password confirm fields are labelled
- [ ] submit button renders as disabled `가입 완료`
