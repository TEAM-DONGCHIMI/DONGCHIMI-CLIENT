# Section Spec: `SignupPrompt`

## Metadata

- App: `market-owner`
- Domain: `auth`
- Page: `login`
- Path: `apps/market-owner/src/domains/auth/login/sections/signup-prompt/SignupPrompt.tsx`
- Jira: `DCMSM-23`
- Figma: `APPJAM` node `1608:108630`
- Status: Implemented

## Purpose

- 로그인 카드 하단에서 회원이 아닌 방문자를 회원가입으로 유도하는 안내 문구를 제공합니다.
- 회원이 아닌 방문자가 `/signup`으로 이동할 수 있는 회원가입 링크를 제공합니다.
- 로그인 폼 제출 로직과는 무관한 별개 구획이라 `LoginForm`과 분리되어 있습니다.

## Composition

- components: `react-router`의 `Link`
- data: `MARKET_OWNER_ROUTES.signup` 상수로 이동 경로를 고정합니다.
- states: default(prompt + signup link)만 다룹니다.

## Verification

- [x] `git diff --check`
- [x] `pnpm --filter market-owner test -- SignupPrompt`
