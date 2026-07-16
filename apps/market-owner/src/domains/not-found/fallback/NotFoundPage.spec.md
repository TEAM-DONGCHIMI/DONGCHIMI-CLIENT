# Market Owner Not Found Page Spec

## Metadata

- Jira: DCMSM-103
- Screen ID: APPJAM 18. 404
- Route: `*`
- Owner: FE
- Status: Implemented

## Purpose

존재하지 않는 사장님 웹 URL에 접근한 사용자가 현재 상태를 즉시 이해하고 메인 화면으로 돌아갈 수 있는 독립 fallback 화면을 제공합니다.

## Source Of Truth

- Figma: APPJAM
- Figma frame / Screen ID: node `4155:53405`, `18. 404`
- Target viewport: desktop 1440×900
- FRS / SRS: 없음
- Decision / Meeting note: 없음
- Related Jira: DCMSM-15

## Scope

- 404 일러스트, 안내 제목, 메인 이동 CTA를 Figma 기준으로 렌더링합니다.
- 알 수 없는 모든 route를 wildcard route로 연결합니다.
- CTA는 기존 사장님 홈 route로 이동합니다.
- SVG 원본과 SVGR 생성 React 컴포넌트를 app-shared image asset으로 관리합니다.

## Out Of Scope

- 서버 HTTP 404 status와 Vercel rewrite 정책
- API resource-not-found 상태
- client 웹의 not-found 화면
- 새로운 디자인시스템 컴포넌트

## Layout And Sections

- page: neutral 5 배경, 최소 viewport 높이, 중앙 정렬
- illustration: 262×262
- title: `heading-3-semibold`, neutral 80, 20px/28px
- action: 디자인시스템 `Button`의 `assistive` / `small` preset, 192×44
- desktop 1440×900에서는 전체 content group을 viewport 중앙에서 32px 아래로 배치합니다.

## Routing And Access

- route path: `*`
- route params: 없음
- search params: 없음
- layout shell: auth/sidebar layout 밖의 독립 fallback
- access rule: 인증 여부와 무관하게 접근 가능
- after action navigation: `MARKET_OWNER_ROUTES.home`

## Design System And Component Boundary

- design-system `ui` components: `Button`
- design-system `layout` components: 없음
- design-system icons: 없음
- app-shared components: SVGR generated `Svg404Img`
- page-local components: `NotFoundPage`
- not promoted to design-system: 사장님 웹 전용 404 composition과 illustration

## States

- loading: 없음
- empty: 없음
- error: 등록되지 않은 route에서 본 화면을 표시
- disabled: 없음
- selected / active: 없음

## Behavior

- navigation: `메인으로 가기`를 누르면 사장님 홈으로 이동합니다.
- interaction: native button keyboard activation을 사용합니다.
- form / validation: 없음
- API: 없음

## Accessibility

- keyboard: CTA는 디자인시스템 Button의 native button semantics를 사용합니다.
- focus: 디자인시스템 Button의 focus-visible outline을 유지합니다.
- accessible name: visible `h1`과 `메인으로 가기` button label을 제공합니다.
- illustration: 장식 이미지이므로 accessibility tree에서 제외합니다.

## Responsive

- viewport evidence: Figma 1440×900
- mobile: 별도 시안은 없으며 viewport padding과 page scroll로 content clipping을 방지합니다.
- tablet: 별도 시안은 없으며 동일한 중앙 정렬을 유지합니다.
- desktop: Figma 좌표와 동일한 content 크기 및 32px vertical offset을 적용합니다.
- reduced height: 600px 이하에서는 vertical offset을 제거합니다.

## Publishing Evidence

- Figma mismatch: 없음
- browser route: 임의의 미등록 경로
- screenshot / preview: 구현 후 browser verification
- visual notes: neutral 5 배경, 262px illustration, 28px/30px vertical gaps

## Verification

- [x] `git diff --check`
- [x] Frontend Fundamentals self-check
- [x] Logic composition self-check
- [x] `pnpm --filter market-owner generate:svg-components`
- [x] 변경 파일 Prettier check
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [x] `pnpm --filter market-owner test`
- [x] `pnpm --filter market-owner build`
- [x] browser route and viewport: unknown path at 1440×900 and 480×600
- [x] browser action: CTA routes to home and existing auth guard takes over

## Open Questions

- 없음
