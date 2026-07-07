# Section Spec: `SignupPrompt`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `login`
- Path: `apps/market-owner/src/domains/auth/login/sections/signup-prompt/SignupPrompt.tsx`
- Jira: `DCMSM-23`
- Status: Implemented

## Purpose

- 로그인 화면의 카드 레이아웃 내부에 직접 렌더링되는 화면 구획으로, 회원이 아닌 방문자를 회원가입으로 유도하는 문구와 링크만 담당합니다.
- 로그인 폼 제출 로직과는 무관한 별개 구획이라 `LoginForm`과 분리되어 있습니다.

## Composition

- components: `react-router`의 `Link`
- data: `MARKET_OWNER_ROUTES.signup` 상수로 이동 경로를 고정합니다.
- states: default(안내 문구 + 링크)만 다룹니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner test -- SignupPrompt`
