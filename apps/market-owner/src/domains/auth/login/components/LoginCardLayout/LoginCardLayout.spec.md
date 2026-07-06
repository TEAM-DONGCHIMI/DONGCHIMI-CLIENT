# Component Spec: `LoginCardLayout`

## Metadata

- App: `market-owner`
- Category: domain-local component
- Path: `apps/market-owner/src/domains/auth/login/components/LoginCardLayout/LoginCardLayout.tsx`
- Jira: `DCMSM-23`
- Figma: [APPJAM Background+Border+Shadow node 1608:108630](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=1608-108630)
- Status: Implemented

## Purpose

- 로그인 화면의 카드 외곽 레이아웃만 재사용하기 위한 shell component입니다.
- Figma `Background+Border+Shadow` frame의 size, padding, gap, radius, background, shadow를 코드로 옮깁니다.
- 내부 로그인 폼, 텍스트, 버튼 등 실제 화면 요소는 이 컴포넌트가 소유하지 않고 `children`으로만 받습니다.

## Public API

- `children`: 카드 내부에 배치할 호출부 소유 콘텐츠입니다.
- `className`: 호출부에서 추가 스타일을 합성할 때 사용합니다.
- Native `section` props: `aria-label`, `aria-labelledby`, `id`, `data-*` 등 section attribute를 전달할 수 있습니다.

## Styling Constraints

- Max width: `785px`
- Narrow viewport width: viewport width minus responsive outer breathing room, capped at `32px`
- Max min-height: `603px`
- Narrow viewport min-height: viewport height minus responsive outer breathing room, capped at `32px`
- Padding: responsive `20px` to `40px`
- Gap: responsive `20px` to `30px`
- Border radius: `14.7px`
- Background: white
- Shadow: `0 0 30px rgb(23 23 23 / 5%)`
- Figma desktop size를 상한으로 유지하고, 좁은 viewport에서는 화면 여백을 남기며 축소합니다.

## Accessibility

- Wrapper는 semantic `section`을 사용합니다.
- 카드가 독립 landmark 역할을 해야 하는 화면에서는 호출부가 `aria-label` 또는 `aria-labelledby`를 전달합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter market-owner lint`
- [ ] `pnpm --filter market-owner typecheck`
- [ ] `pnpm --filter market-owner test -- LoginCardLayout`
