# Component Spec: `Sidebar`

## Purpose

`Sidebar`는 사장님 사이트(`market-owner`)에서 주요 메뉴, 사용자 프로필, 메뉴 섹션, 하단 도움말 CTA를 한 패널 안에 배치하는 사이드 내비게이션 컴포넌트입니다.
디자인시스템의 `Box`/`Flex` 등 layout primitive와 달리 activeItemId, onItemSelect, href 유무에 따른 link/button 렌더링, aria-current, disabled item 처리 등 navigation 도메인 책임을 가지므로 `market-owner` 앱의 shared component로 소유합니다.
디자인시스템에서는 `Button`, `atomic`/`semantic`/`typography` 토큰, `cn`, `recipe` 등 범용 primitive만 가져와 사용하고, 제품별 copy, route, API 데이터, analytics, business action은 호출부가 주입합니다.

## Usage Location

- `apps/market-owner/src/shared/components/ui/sidebar/Sidebar.tsx`
- `apps/market-owner/src/shared/components/ui/sidebar/Sidebar.parts.tsx`
- `apps/market-owner/src/shared/components/ui/sidebar/SidebarLink.tsx`

## Category

- `market-owner shared/ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] brand, profile, section, footer item, help card 영역을 조합할 수 있습니다.
- [x] `sections`, `footerItems` 기반 config API로 메뉴 데이터를 주입합니다.
- [x] `Sidebar.Root`/`Section`/`Item` 등 내부 parts는 public API로 노출하지 않습니다.
- [x] active/click 로직은 내부 hook으로 분리하고, link/button markup은 내부 `SidebarLink`를 재사용합니다.
- [x] native anchor/button keyboard behavior와 focus-visible 스타일을 보존합니다.
- [x] private helper와 내부 component는 public export하지 않습니다.

## UI Structure

```text
Sidebar
  Brand?
  Divider?
  Profile?
  Nav
    Section[]
      SectionTitle?
      Item[]
  Footer?
    Item[]
    HelpCard?
```

## Props

| prop               | type                             | required | description                            |
| ------------------ | -------------------------------- | -------- | -------------------------------------- |
| `sections`         | `SidebarSection[]`               | true     | 주요 내비게이션 section 목록입니다.    |
| `activeItemId`     | `string`                         | false    | active 상태로 표시할 item id입니다.    |
| `brand`            | `ReactNode`                      | false    | 브랜드 영역 slot입니다.                |
| `profile`          | `SidebarProfile`                 | false    | 사용자 프로필 영역 데이터입니다.       |
| `footerItems`      | `SidebarItem[]`                  | false    | footer item 목록입니다.                |
| `helpCard`         | `ReactNode`                      | false    | 하단 도움말 CTA slot입니다.            |
| `onItemSelect`     | `(item: SidebarItem) => void`    | false    | enabled item 선택 callback입니다.      |
| native aside props | `ComponentPropsWithRef<'aside'>` | false    | native aside props와 ref를 전달합니다. |

## States

- default: item을 neutral text와 transparent background로 표시합니다.
- active: selected affordance와 `aria-current="page"`를 적용합니다.
- disabled: click/select를 막고 disabled affordance를 적용합니다.
- loading: 지원하지 않습니다. 필요한 경우 호출부가 skeleton이나 pending UI를 주입합니다.
- invalid/error: navigation shell에서 별도 상태로 지원하지 않습니다.

## Behavior

1. `href`가 있고 disabled가 아닌 item은 anchor로 렌더링합니다.
2. `href`가 없거나 disabled인 item은 native button으로 렌더링합니다.
3. modified anchor click은 브라우저 기본 동작을 보존하고 `onItemSelect`를 호출하지 않습니다.
4. disabled item은 `onItemSelect`를 호출하지 않습니다.
5. icon은 장식 요소로 보고 `aria-hidden="true"` wrapper 안에 렌더링합니다.

## Styling

- layout: 290px side panel, vertical flex layout, footer 하단 배치를 사용합니다.
- overflow: 호출부가 sidebar panel 높이를 제한하면 sidebar panel이 내부 스크롤을 소유해 footer/help 영역이 잘리지 않고 접근 가능해야 합니다.
- spacing: panel padding, 48px item height, 12px item radius를 사용합니다.
- text: Pretendard-first font stack과 label/profile text ellipsis를 적용합니다.
- states: hover, active, disabled, focus-visible 상태를 정의합니다.
- token usage: `atomic`, `semantic` color token을 우선 사용합니다.

## Accessibility

- semantic element: `aside` 안에 `nav`를 중첩합니다.
- accessible name: nav에 전달된 `aria-label`을 사용하고 없으면 `사이드바`를 fallback으로 사용합니다.
- keyboard interaction: native anchor/button keyboard behavior를 사용합니다.
- focus-visible: primary token 기반 visible outline을 유지합니다.
- ARIA: active item은 `aria-current="page"`를 사용하고, 장식 icon slot은 `aria-hidden` 처리합니다.

## Storybook

- [x] 기본 composition
- [x] link item composition
- [x] disabled item

## Public API

- [x] `Sidebar` value export
- [x] `SidebarProps` type export
- [x] `SidebarItem` type export
- [x] `SidebarSection` type export
- [x] `SidebarProfile` type export
- [x] `Sidebar.Root`, `Sidebar.Section`, `Sidebar.Item` 등 내부 parts는 public export하지 않습니다.
- [x] `SidebarLink`, `useSidebarItem`, `useSidebarContext`, `SidebarContext`는 public export하지 않습니다.

## Verification

- [x] `git -c safe.directory=C:/DONGCHIMI-CLIENT diff --check`
- [x] `pnpm exec prettier --check apps/market-owner/src/shared/components/index.ts apps/market-owner/src/shared/components/ui/sidebar`
- [x] `pnpm --filter market-owner exec vitest run src/shared/components/ui/sidebar/Sidebar.test.tsx --project unit`
- [x] `pnpm --filter market-owner lint`
- [x] `pnpm --filter market-owner typecheck`
- [ ] `pnpm --filter market-owner build` - `apps/market-owner/dist` 쓰기 권한 EPERM으로 Vite public asset copy 단계가 제한됩니다.
- [ ] `pnpm --filter market-owner build-storybook`
