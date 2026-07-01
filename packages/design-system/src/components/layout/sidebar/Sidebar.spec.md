# Component Spec: `Sidebar`

## Purpose

`Sidebar`는 사장님 사이트에서 주요 메뉴, 유저 프로필, 기능 section, 하단 도움말 CTA를 한 패널 안에 배치하는 사이드 내비게이션 컴포넌트입니다.
디자인시스템에서는 패널 구조, active/disabled item 상태, keyboard-safe item 렌더링, 시각적 제약만 책임집니다.
제품별 copy, route 선택, API 데이터, analytics, business action은 호출부가 주입합니다.

## Usage Location

- `packages/design-system/src/components/layout/sidebar/Sidebar.tsx`
- `packages/design-system/src/components/layout/sidebar/SidebarLink.tsx`
- `packages/design-system/src/components/layout/sidebar/Sidebar.parts.tsx`

## Category

- `layout`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] 기본/active 사이드 내비게이션 item 상태를 지원합니다.
- [x] 그룹형 내비게이션 section과 footer item을 지원합니다.
- [x] brand, profile, icon, help card CTA content를 slot으로 주입할 수 있습니다.
- [x] 가능한 경우 design-system token을 사용하고, Sidebar 전용 치수는 component-local 값으로 캡슐화합니다.
- [x] native anchor/button keyboard behavior와 focus-visible 스타일을 보존합니다.
- [x] config-driven default export와 함께 compound component API(`Sidebar.Root`/`Item`/`Section` 등)를 제공합니다.
- [x] active/click 로직은 headless hook(`useSidebarItem`)으로 분리하고 markup과 결합하지 않습니다.

## Architecture

`Sidebar`는 **Compound Component + Headless Hook + config-driven item data** 조합으로 구성합니다.

- **Reusable link primitive**: 사이드바 링크 item은 내부 `SidebarLink.tsx`로 구현합니다.
  default와 active 상태는 `active` prop으로 표현합니다.
  `Sidebar.Item`은 이 primitive를 사용해 nav section과 footer item이 같은 anchor/button markup, 상태, icon/label 접근성 정책을 공유하도록 합니다.
- **Compound Component**: `Sidebar.Root`는 `<aside>` shell과 React Context(`activeItemId`, `onItemSelect`)를 소유합니다.
  `Sidebar.Brand`, `Sidebar.Divider`, `Sidebar.Profile`, `Sidebar.Nav`, `Sidebar.Section`, `Sidebar.Item`, `Sidebar.Footer`, `Sidebar.HelpCard`는 default export에 붙는 조합 가능한 하위 파트입니다.
  호출부가 기본 config 구조를 벗어나야 할 때 `Composed` story처럼 직접 조립할 수 있습니다.
  하위 파트 구현은 `Sidebar.parts.tsx`에 두고, `Sidebar.tsx`는 config-driven wrapper와 public `Object.assign` API를 유지합니다.
- **Headless Hook**: `useSidebarItem`은 단일 item에 대한 `isActive` 계산과 click handler(modified click / disabled guard)를 제공합니다.
  rendering opinion은 갖지 않으며, `Sidebar.Item`만 이 hook을 호출한 뒤 markup을 `SidebarLink`에 위임합니다.
  hook과 context는 `index.ts`에서 export하지 않고 내부 구현으로 유지합니다.
- **Config-driven item data**: 기본 `Sidebar` export는 `sections`, `footerItems`, `brand`, `profile`, `helpCard` 같은 데이터/slot props를 받고 내부에서 compound part를 조립합니다.
  메뉴 추가/삭제나 section 변경 시 디자인시스템 내부 구현을 수정하지 않고 호출부 데이터만 변경할 수 있습니다.

## UI Structure

```text
Sidebar (config-driven wrapper)
  Sidebar.Root
    Sidebar.Brand?
    Sidebar.Divider?
    Sidebar.Profile?
    Sidebar.Nav
      Sidebar.Section[]
        SectionTitle?
        Sidebar.Item[]
    Sidebar.Footer?
      Sidebar.Item[]
      Sidebar.HelpCard?
```

## Props

### `Sidebar`

| prop               | type                                | required | description                                                                              |
| ------------------ | ----------------------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `sections`         | `SidebarSection[]`                  | true     | 주요 내비게이션 그룹입니다. 각 section은 title과 item 목록을 가질 수 있습니다.           |
| `activeItemId`     | `string`                            | false    | 일치하는 item을 active 상태로 표시하고 `aria-current='page'`를 적용합니다.               |
| `brand`            | `ReactNode`                         | false    | 로고 또는 브랜드 콘텐츠를 표시하는 header slot입니다.                                    |
| `profile`          | `SidebarProfile`                    | false    | `name`, `description`, `avatar`를 포함하는 선택적 사용자/계정 요약 정보입니다.           |
| `footerItems`      | `SidebarItem[]`                     | false    | help card 위에 렌더링되는 footer 내비게이션 item입니다.                                  |
| `helpCard`         | `ReactNode`                         | false    | 도움말 CTA처럼 낮은 우선순위의 footer 콘텐츠입니다. copy와 action은 호출부가 소유합니다. |
| `onItemSelect`     | `(item: SidebarItem) => void`       | false    | enabled item의 unmodified primary click에서 호출됩니다.                                  |
| native aside props | `ComponentPropsWithoutRef<'aside'>` | false    | `children`과 `onSelect`를 제외한 native aside props를 전달합니다.                        |

### `SidebarSection`

| prop    | type            | required | description        |
| ------- | --------------- | -------- | ------------------ |
| `id`    | `string`        | false    | section key        |
| `title` | `ReactNode`     | false    | section title slot |
| `items` | `SidebarItem[]` | true     | section item 목록  |

### `SidebarItem`

| prop       | type        | required | description                                                     |
| ---------- | ----------- | -------- | --------------------------------------------------------------- |
| `id`       | `string`    | true     | active 비교와 React key에 사용하는 item id                      |
| `label`    | `ReactNode` | true     | item의 accessible name 기반 label                               |
| `icon`     | `ReactNode` | false    | 장식 icon slot. `aria-hidden='true'` wrapper 안에 렌더링합니다. |
| `href`     | `string`    | false    | 있으면 enabled item을 anchor로 렌더링합니다.                    |
| `disabled` | `boolean`   | false    | true이면 click/select를 막고 disabled affordance를 적용합니다.  |

### `SidebarProfile`

| prop          | type        | required | description           |
| ------------- | ----------- | -------- | --------------------- |
| `name`        | `ReactNode` | true     | 사용자 또는 계정 이름 |
| `description` | `ReactNode` | false    | 이메일 등 보조 설명   |
| `avatar`      | `ReactNode` | false    | avatar slot           |

## States

- default: item은 neutral text와 transparent background로 렌더링합니다.
- active: primary highlight와 `aria-current='page'`를 적용합니다.
- disabled: button item은 disabled 처리하고 시각적으로 dimmed 상태를 적용하며 `onItemSelect` 호출을 막습니다.
- loading: 지원하지 않습니다. loading content는 호출부가 처리합니다.
- invalid/error: navigation shell에서 별도 상태로 지원하지 않습니다.

## Behavior

1. `href`가 있고 disabled가 아닌 item은 anchor로 렌더링합니다.
2. `href`가 없거나 disabled인 item은 native button으로 렌더링합니다.
3. modified anchor click은 브라우저의 새 탭/새 창 동작을 보존하기 위해 `onItemSelect`를 호출하지 않습니다.
4. disabled item은 `onItemSelect`를 호출하지 않습니다.
5. icon은 장식 요소로 보고 `aria-hidden='true'` wrapper 안에 렌더링합니다.

## Styling

- layout: 290px 고정 폭 side panel, vertical flex layout, footer는 하단에 배치합니다.
- spacing: panel padding, 48px item height, 12px item radius를 사용합니다.
- text: Pretendard-first font stack과 긴 label/profile text ellipsis를 적용합니다.
- states: hover, active, disabled, focus-visible 상태를 정의합니다.
- token usage: `atomic`, `semantic` color token을 사용합니다.

## Accessibility

- semantic element: `aside` 안에 `nav`를 중첩합니다.
- accessible name: nav는 전달된 `aria-label`을 사용하고 없으면 `Sidebar`를 fallback으로 사용합니다.
- keyboard interaction: native anchor/button keyboard behavior를 사용합니다.
- focus-visible: primary token 기반 visible outline을 유지합니다.
- ARIA: active item은 `aria-current='page'`를 사용하고, 장식 icon slot은 `aria-hidden` 처리합니다.

## Storybook

- [x] 기본 composition
- [x] link item composition
- [x] disabled item
- [x] 수동 compound composition(`Composed`, `Sidebar.Root`/`Nav`/`Section` 직접 사용)

## Public API

- [x] `Sidebar` value export(config-driven wrapper, `Root`/`Brand`/`Divider`/`Profile`/`Nav`/`Section`/`Item`/`Footer`/`HelpCard` 포함)
- [x] `SidebarProps` type export
- [x] `SidebarItem` type export
- [x] `SidebarSection` type export
- [x] `SidebarProfile` type export
- [x] private helper는 export하지 않습니다. `SidebarLink`, `useSidebarItem`, `useSidebarContext`, `SidebarContext`는 내부 구현으로 유지합니다.

## Verification

- [x] `git -c safe.directory=C:/DONGCHIMI-CLIENT diff --check`
- [x] `pnpm exec prettier --check <changed Sidebar/export files>`
- [x] `pnpm --filter @dongchimi/design-system exec vitest run src/components/layout/sidebar/Sidebar.test.tsx --project unit`
- [x] `pnpm exec tsc --noEmit --jsx react-jsx --module ESNext --moduleResolution Bundler --target ES2022 --strict --skipLibCheck <Sidebar files>`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [ ] `pnpm --filter @dongchimi/design-system typecheck` - `node_modules/.tmp/tsconfig.tsbuildinfo` EPERM으로 전체 package typecheck 실행이 제한됩니다.
- [ ] `pnpm --filter @dongchimi/design-system build` - 동일한 tsbuildinfo EPERM 제약으로 전체 package build 실행이 제한됩니다.
- [ ] `pnpm --filter @dongchimi/design-system build-storybook`
