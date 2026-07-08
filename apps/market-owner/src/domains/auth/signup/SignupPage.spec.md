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

사장님웹 회원가입 화면의 초기 form UI와 이메일, 비밀번호, 비밀번호 확인 입력 검증을 public auth layout 안에서 렌더링합니다.
이번 범위는 client-side validation과 유효 submit 이후 로그인 페이지 이동까지이며 실제 회원가입 API, 서버 중복 확인은 후속 auth 작업에서 연결합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Public auth layout responsibility stays in `src/app/layouts/AuthLayout.tsx`.
- Page-local spacing and signup-specific presentation stay in `SignupPage.css.ts`.
- Signup form state, field handlers, submit error state, and `TextInput` status props stay in `hooks/use-signup-form.ts`.
- Zod validation schema, resolver, default values, API request/response types, and temporary duplicate email list stay in `schemas/signup-schema.ts`.
- Form primitives use design-system `Flex`, `TextInput`, and `Button`.

## UI States

- default: logo slot, `회원가입` heading, helper description, email/password/password confirm fields, disabled submit CTA를 렌더링합니다.
- validation: 이메일 입력은 touched 이후 실시간으로 필수값, 공백, 한글, 허용 문자, 이메일 형식, 중복 여부를 검증합니다.
- validation: 비밀번호 입력은 touched 이후 실시간으로 필수값, 6-20자 길이, 공백, 한글 여부를 검증합니다.
- validation: 비밀번호 확인 입력은 touched 이후 실시간으로 필수값과 비밀번호 일치 여부를 검증합니다.
- success: 비밀번호 확인 입력이 비밀번호와 일치하면 우측 체크 아이콘을 표시합니다.
- disabled: full validation 전까지 `가입 완료` CTA는 disabled 상태입니다.
- loading: 이번 범위에서 다루지 않습니다.
- error: field validation error는 각 `TextInput` 아래에 표시하고, 네트워크 또는 가입 실패 같은 submit error는 field group 아래 toast로 표시합니다.
- success: 유효한 form submit 이후 `/login`으로 이동합니다.

## Data

- query: none
- mutation: none
- fixture: temporary duplicate email list in `signup-schema.ts`
- model: signup owner register request/response types in `signup-schema.ts`

## Behavior

- `/signup`은 `AuthLayout` 아래에서 sidebar 없이 렌더링합니다.
- 이메일 입력은 영문, 숫자, `@`, `.`, `_`, `-`만 허용합니다.
- 이메일 입력은 공백과 한글을 허용하지 않습니다.
- 이메일 형식은 `local@domain.com` 또는 `local@domain.co.kr`만 유효합니다.
- 이메일 형식이 유효하면 현재 page-local 임시 중복 목록으로 중복 여부를 확인합니다.
- 비밀번호 입력은 6-20자만 유효합니다.
- 비밀번호 입력은 공백과 한글을 허용하지 않습니다.
- 비밀번호 확인 입력은 비밀번호와 동일한 값을 입력해야 유효합니다.
- 비밀번호 확인 입력값이 유효하면 입력창 우측에 `IcCircleCheckFill` trailing icon을 표시합니다.
- submit CTA는 전체 입력값이 유효할 때 활성화됩니다.
- 유효한 form submit 이후 로그인 페이지로 이동합니다.
- 네트워크 오류 또는 가입 실패 오류는 field error message가 아니라 form-level toast로 표시합니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `회원가입`을 제공합니다.
- field labels: `TextInput` visible label이 각 input의 accessible name입니다.
- validation messages: `TextInput` error message는 `aria-describedby`와 `aria-invalid`로 input에 연결됩니다.
- button: `가입 완료`는 full validation 전까지 native disabled button으로 노출합니다.
- submit error toast: error toast는 alert live region으로 노출합니다.
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
- [ ] password confirmation mismatch renders `비밀번호가 일치하지 않습니다.`
- [ ] empty touched password confirmation renders `비밀번호를 다시 입력해주세요.`
- [ ] valid password confirmation renders a right-side check icon
- [ ] submit button renders as disabled before valid input
- [ ] submit button is enabled when email, password, and password confirmation are valid
- [ ] valid signup submit redirects to `/login`
- [ ] submit failure renders as an error toast instead of a field error
