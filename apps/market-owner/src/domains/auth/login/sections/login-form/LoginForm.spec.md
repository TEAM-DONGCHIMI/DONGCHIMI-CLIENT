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
- data: 없음. auth API 연동은 후속 이슈 범위입니다.
- states: default(초기 빈 폼)만 다룹니다. loading/error는 이번 범위에서 다루지 않습니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner test -- LoginForm`
