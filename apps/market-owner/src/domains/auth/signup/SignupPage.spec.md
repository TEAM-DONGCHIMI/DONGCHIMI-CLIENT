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

사장님웹 회원가입 화면의 초기 form UI와 이메일/비밀번호 입력 검증을 public auth layout 안에서 렌더링합니다.
이번 범위는 client-side validation까지이며 실제 회원가입 API, 서버 중복 확인, submit 동작은 후속 auth 작업에서 연결합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Public auth layout responsibility stays in `src/app/layouts/AuthLayout.tsx`.
- Page-local spacing and signup-specific presentation stay in `SignupPage.css.ts`.
- Email field touched state and change handler stay in `hooks/use-signup-email-field.ts`.
- Pure email validation rules and temporary duplicate email list stay in `utils/signup-email-validation.ts`.
- Password field touched state and change handler stay in `hooks/use-signup-password-field.ts`.
- Pure password validation rules stay in `utils/signup-password-validation.ts`.
- Form primitives use design-system `Flex`, `TextInput`, and `Button`.

## UI States

- default: logo slot, `회원가입` heading, helper description, email/password/password confirm fields, disabled submit CTA를 렌더링합니다.
- validation: 이메일 입력은 touched 이후 실시간으로 필수값, 공백, 한글, 허용 문자, 이메일 형식, 중복 여부를 검증합니다.
- validation: 비밀번호 입력은 touched 이후 실시간으로 필수값, 6-20자 길이, 공백, 한글 여부를 검증합니다.
- disabled: API와 full validation 전까지 `가입 완료` CTA는 disabled 상태입니다.
- loading: 이번 범위에서 다루지 않습니다.
- error: 이번 범위에서 서버 오류 상태는 다루지 않습니다.
- success: 이번 범위에서 다루지 않습니다.

## Data

- query: none
- mutation: none
- fixture: temporary duplicate email list in `signup-email-validation.ts`
- model: none

## Behavior

- `/signup`은 `AuthLayout` 아래에서 sidebar 없이 렌더링합니다.
- 이메일 입력은 영문, 숫자, `@`, `.`, `_`, `-`만 허용합니다.
- 이메일 입력은 공백과 한글을 허용하지 않습니다.
- 이메일 형식은 `local@domain.com` 또는 `local@domain.co.kr`만 유효합니다.
- 이메일 형식이 유효하면 현재 page-local 임시 중복 목록으로 중복 여부를 확인합니다.
- 비밀번호 입력은 6-20자만 유효합니다.
- 비밀번호 입력은 공백과 한글을 허용하지 않습니다.
- 비밀번호 확인 입력 필드는 이번 범위에서 일치 여부를 검증하지 않고 native input semantics와 browser autocomplete hint만 제공합니다.
- submit CTA는 비활성화되어 실제 submit을 발생시키지 않습니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `회원가입`을 제공합니다.
- field labels: `TextInput` visible label이 각 input의 accessible name입니다.
- validation messages: `TextInput` error message는 `aria-describedby`와 `aria-invalid`로 input에 연결됩니다.
- button: `가입 완료`는 native disabled button으로 노출합니다.
- decorative logo: 체크무늬 logo slot은 accessible name에서 제외합니다.
- focus: design-system input/button focus-visible style을 유지합니다.

## Verification

- [ ] `/signup` route renders `회원가입`
- [ ] `/signup` route does not render sidebar complementary landmark
- [ ] email, password, password confirm fields are labelled
- [ ] invalid email renders `올바른 이메일 형식이 아닙니다.`
- [ ] empty touched email renders `이메일을 입력해주세요.`
- [ ] duplicated email renders `이미 사용 중인 이메일입니다.`
- [ ] invalid password renders `6-20자로 입력해주세요.`
- [ ] empty touched password renders `비밀번호를 입력해주세요.`
- [ ] submit button renders as disabled `가입 완료`
