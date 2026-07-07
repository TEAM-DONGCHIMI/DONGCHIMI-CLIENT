# Section Spec: `LoginForm`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `login`
- Path: `apps/market-owner/src/domains/auth/login/sections/login-form/LoginForm.tsx`
- Jira: `DCMSM-23`
- Status: Implemented

## Purpose

- 로그인 화면에서 `LoginCardLayout` 내부에 직접 렌더링되는 화면 구획으로, 로그인 폼 자체(이메일/비밀번호 입력, 로그인 상태 유지, 제출 버튼)만 담당합니다.
- 회원가입 유도는 인증 액션과 무관한 별개 구획인 `SignupPrompt`로 분리되어 있습니다.

## Composition

- components: 디자인 시스템 `TextInput`, `Button`, `IcCheckboxSizeSmall`, `IcCheckboxActionSizeSmall`
- hook: `login/hooks/use-login-form.ts`가 이메일 입력 상태, 수정 여부, error 표시 props를 관리합니다.
- utils: `login/utils/email-validation.ts`가 이메일 허용 문자와 형식 검증 규칙을 제공합니다.
- data: 없음. auth API 연동은 후속 이슈 범위입니다.
- states: default(초기 빈 폼), email editing, email validation error를 다룹니다. loading/server error는 이번 범위에서 다루지 않습니다.

## Email Validation

- 이메일 필드는 필수 입력 항목입니다.
- 사용자가 이메일 필드를 수정하기 전에는 초기 빈 값 오류를 노출하지 않습니다.
- 사용자가 이메일 값을 수정하면 입력값을 실시간으로 검증합니다.
- 입력 가능한 문자는 영문, 숫자, `@`, `.`, `_`, `-`입니다. 한글과 그 밖의 문자는 입력값에 반영하지 않습니다.
- 빈 값이면 `이메일을 입력해주세요.` 오류를 표시합니다.
- `example@email.com`, `example@email.co.kr`처럼 `@`와 점으로 구분된 도메인을 포함하지 않으면 `올바른 이메일 형식이 아닙니다.` 오류를 표시합니다.
- 오류 상태는 디자인 시스템 `TextInput`의 `status='error'`와 `errorMessage`로 표시합니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm.cmd --filter market-owner test -- src/domains/auth/login/sections/login-form/LoginForm.test.tsx src/domains/auth/login/utils/email-validation.test.ts`
- [x] `pnpm.cmd --filter market-owner typecheck`
