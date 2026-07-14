# React Page Spec: `SignupPage`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `signup`
- Route: `/signup`
- Path: `apps/market-owner/src/domains/auth/signup/SignupPage.tsx`
- Jira: DCMSM-15, DCMSM-53
- Status: Implemented
- Figma: APPJAM node `1608:108592`

## Purpose

사장님웹 회원가입 화면은 이메일, 비밀번호, 비밀번호 확인 입력 검증을 public auth layout 안에서 렌더링하고, 유효한 submit 이후 사장님 회원가입 API를 호출합니다.
회원가입 성공 시 마트 정보 등록 페이지로 이동하며, 서버 validation 실패나 중복 이메일 실패는 form-level toast로 노출합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Public auth layout responsibility stays in `src/app/layouts/AuthLayout.tsx`.
- Page-local spacing and signup-specific presentation stay in `SignupPage.css.ts`.
- Signup form state, field handlers, and submit error state stay in `hooks/use-signup-form.ts`.
- Signup submit API state stays in `domains/auth/hooks/use-signup-mutation.ts`.
- Signup API helper and response schema stay in `domains/auth/api/auth-api.ts` and `domains/auth/model/auth-schema.ts`.
- `TextInput` error/status prop derivation is shared with `login` via `domains/auth/hooks/get-text-input-status-props.ts`.
- Email-required/format and password-required copy is shared with `login` via `domains/auth/constants/auth-messages.ts`.
- Zod validation schema, resolver, and default values stay in `schemas/signup-schema.ts`.
- Email error messages and format/allowed-character patterns stay in `utils/email-validation.ts`; password error messages and length bounds stay in `utils/password-validation.ts`; shared whitespace/Korean-character patterns stay in `utils/text-pattern.ts`.
- Form primitives use design-system `Flex`, `TextInput`, `Toast`, and `Button`.

## UI States

- default: logo slot, `회원가입` heading, helper description, email/password/password confirm fields, disabled submit CTA를 렌더링합니다.
- validation: 이메일 입력은 touched 이후 실시간으로 필수값, 공백, 한글, 허용 문자, 이메일 형식을 검증합니다. 중복 이메일 여부는 submit 이후 서버 `DUPLICATE_EMAIL` 응답으로 처리합니다.
- validation: 비밀번호 입력은 touched 이후 실시간으로 필수값, 6~20자 길이, 공백, 한글 여부를 검증합니다.
- validation: 비밀번호가 여러 조건을 동시에 만족하지 않으면 길이, 공백, 한글 순서로 하나의 에러 메시지만 표시합니다.
- validation: 비밀번호 확인 입력은 touched 이후 실시간으로 필수값과 비밀번호 일치 여부를 검증합니다.
- success: 비밀번호 확인 입력이 비밀번호와 일치하면 우측 체크 아이콘을 표시합니다.
- disabled: full validation 전이거나 회원가입 mutation이 pending 상태이면 `가입 완료` CTA가 disabled 상태입니다.
- loading: 회원가입 mutation이 pending 상태이면 submit CTA를 disabled 처리해 중복 submit을 방지합니다.
- error: field validation error는 각 `TextInput` 아래에 표시하고, 네트워크 또는 회원가입 실패 같은 submit error는 field group 아래 toast로 표시합니다.
- success: 유효한 form submit 이후 회원가입 API가 성공하면 `/markets/information-registration`으로 이동합니다.

## Data

- query: none
- mutation: owner signup API
- fixture: none
- model: owner signup request/response types and schema in `domains/auth/api` and `domains/auth/model`

## Behavior

- `/signup`은 `AuthLayout` 아래에서 sidebar 없이 렌더링합니다.
- 이메일 입력은 영문, 숫자, `@`, `.`, `_`, `-`만 허용합니다.
- 이메일 입력은 공백과 한글을 허용하지 않습니다.
- 이메일 형식은 `local@domain.com` 또는 `local@domain.co.kr`만 유효합니다.
- 이메일 형식이 유효하면 중복 여부는 submit 이후 서버 `DUPLICATE_EMAIL` 응답으로 확인합니다.
- 비밀번호 입력은 6~20자만 유효합니다.
- 비밀번호 입력은 공백과 한글을 허용하지 않습니다.
- 비밀번호 확인 입력은 비밀번호와 동일한 값을 입력해야 유효합니다.
- 비밀번호 확인 입력값이 유효하면 입력창 우측에 `IcCircleCheckFill` trailing icon을 표시합니다.
- submit CTA는 전체 입력값이 유효할 때 활성화됩니다.
- submit CTA는 회원가입 mutation이 pending 상태일 때 다시 disabled 됩니다.
- 유효한 form submit 이후 회원가입 API가 성공하면 마트 정보 등록 페이지로 이동합니다.
- 서버 validation 실패, 서버 중복 이메일 실패, 네트워크 오류는 field error가 아닌 form-level toast로 표시합니다.

## Accessibility

- heading order: page root는 visible `h1`로 `회원가입`을 제공합니다.
- field labels: `TextInput` visible label은 각 input의 accessible name입니다.
- validation messages: `TextInput` error message는 `aria-describedby`와 `aria-invalid`로 input에 연결합니다.
- button: `가입 완료`는 full validation 전 또는 pending 중 native disabled button으로 노출합니다.
- submit error toast: error toast는 alert live region으로 노출합니다.
- decorative logo: 체크무늬 logo slot은 accessible name에서 제외합니다.
- focus: design-system input/button focus-visible style을 유지합니다.

## Verification

- [ ] `/signup` route renders `회원가입`
- [ ] `/signup` route does not render sidebar complementary landmark
- [ ] email, password, password confirm fields are labelled
- [ ] invalid email renders `올바른 이메일 형식이 아닙니다.`
- [ ] empty touched email renders `이메일을 입력해주세요.`
- [ ] duplicate email submit failure renders the server error message as a form-level toast
- [ ] invalid password length renders `6~20자로 입력해주세요.`
- [ ] password with whitespace renders `공백은 사용할 수 없습니다.`
- [ ] password with Korean characters renders `한글은 사용할 수 없습니다.`
- [ ] empty touched password renders `비밀번호를 입력해주세요.`
- [ ] password confirmation mismatch renders `비밀번호가 일치하지 않습니다.`
- [ ] empty touched password confirmation renders `비밀번호를 다시 입력해주세요.`
- [ ] valid password confirmation renders a right-side check icon
- [ ] submit button renders as disabled before valid input
- [ ] submit button is enabled when email, password, and password confirmation are valid
- [ ] submit button is disabled while signup mutation is pending
- [ ] valid signup submit redirects to `/markets/information-registration`
- [ ] submit failure renders as an error toast instead of a field error
