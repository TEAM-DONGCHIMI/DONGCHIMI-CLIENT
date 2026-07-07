# Client Global Style Spec

## Metadata

- Jira: DCMCL-8
- Screen ID: APPJAM `1972:128425` `모웹`
- Route: app-wide
- Owner: apps/client
- Status: Implemented

## Purpose

- 사용자 모바일 웹의 앱 전역 스타일 기준을 고정합니다.
- 디자인시스템 `reset.css`와 `fonts.css`가 제공하는 reset/font 책임과 앱 전용 runtime style 책임을 분리합니다.

## Source Of Truth

- Figma: APPJAM `모웹` section `1972:128425`
- Jira: DCMCL-8
- Related docs: `docs/architecture/client-app.md`, `docs/architecture/styling-and-design-tokens.md`

## Scope

- `apps/client/src/app/layout.tsx`는 디자인시스템 reset, font, app global style을 순서대로 import합니다.
- `apps/client/src/app/globals.css`는 사용자 모바일 웹 앱 전용 기본값만 소유합니다.
- 전역 배경, 모바일 앱 shell, 기본 글자색, 앱 로컬 CSS variable, safe-area variable, viewport height, horizontal overflow 기준을 정의합니다.

## Out Of Scope

- 개별 page, card, header, modal, bottom sheet의 세부 스타일 구현
- 디자인시스템 public token 또는 theme contract 신규 정의
- route별 body scroll lock 강제
- API, auth, data state 구현

## Layout And Sections

- target viewport: Figma 기준 375px mobile web frame
- background: top-level mobile frames use white surface
- app shell: mobile viewport에서는 기기 폭을 채우고, desktop viewport에서는 mobile max width 안에서 중앙 정렬합니다.
- app shell shadow: 430px 이상 viewport에서 mobile shell과 page background가 구분되도록 shell shadow를 적용합니다.
- content gutter: repeated content sections use 20px horizontal gutter
- safe area: app global style exposes safe-area variables, but page or shell layout decides where to apply padding
- scroll: long home/leaflet/product list screens remain vertically scrollable unless a route shell explicitly owns fixed behavior

## States

- loading: 없음
- empty: 없음
- error: 없음
- disabled: 없음
- selected / active: 없음

## Behavior

- global style must not block vertical page scroll by default.
- global style must use the 375px Figma frame as a reference, not as a hard cap for larger mobile devices.
- global style must constrain the app surface to a mobile max width only on wide browser viewports.
- global style must show a shell shadow from the 430px viewport breakpoint.
- global style must prevent unintended horizontal page overflow at the root.
- route-level fixed or no-scroll behavior must be implemented in the route/page shell that owns it.

## Accessibility

- keyboard: global style must not remove browser or component `focus-visible` feedback.
- focus: design-system or app component focus styles remain component-owned.
- text: default foreground uses the Figma neutral foreground family.

## Responsive

- mobile: 375x812 is the primary verification viewport.
- wider mobile: 390px, 414px, 430px class devices fill their viewport up to the mobile max width.
- smaller mobile: no root-level min-width forces horizontal scroll.
- tablet / desktop: body uses a neutral page background and centers the mobile app shell.

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter client lint`
- [x] `pnpm --filter client typecheck`
- [x] `pnpm --filter client build`
- [x] browser route: `/login` at 375px, 430px, 2048px viewport widths

## Open Questions

- Figma `Fixed No scroll` note should be mapped to the exact route or shell before adding any body scroll lock.
- `--client-content-gutter` can be promoted only if repeated page/layout implementation proves it is app-wide rather than page-local.
