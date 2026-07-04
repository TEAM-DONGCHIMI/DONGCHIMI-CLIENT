# Component Spec: `Navigation`

## Purpose

`Navigation`은 페이지 번호 이동 UI를 구성하는 디자인시스템 compound primitive입니다.
페이지 번호는 `NumButton`으로 렌더링하고, 이전/다음 버튼과 현재 페이지 접근성 상태만 책임집니다.
실제 페이지 범위 계산, API 요청, query string 동기화는 호출부가 담당합니다.

## Usage Location

- `packages/design-system/src/components/ui/navigation/Navigation.tsx`

## Category

- `ui`

## Requirements

- [x] 제품 도메인 데이터, route, API, logging, analytics에 의존하지 않습니다.
- [x] public props와 상태를 명확히 정의합니다.
- [x] 필요한 접근성 동작을 보장합니다.
- [x] token 또는 CSS variable을 우선 사용합니다.
- [x] Figma APPJAM node `410:9063`의 `Navigation` 컴포넌트 구조를 기준으로 합니다.
- [x] 번호 버튼은 `NumButton`을 조합하고 스타일을 중복 정의하지 않습니다.

## UI Structure

```text
Navigation
  nav
    previous button
    page list
      NumButton
    next button
```

## Props

### pages

- type: `readonly number[]`
- required: `true`
- description: 렌더링할 페이지 번호 배열입니다. 범위 계산, 축약, ellipsis 정책은 호출부가 결정합니다.

### currentPage

- type: `number`
- required: `true`
- description: 현재 선택된 페이지 번호입니다.

### onPageChange

- type: `(page: number) => void`
- required: `false`
- description: 번호, 이전, 다음 버튼을 선택했을 때 호출됩니다.

### previousDisabled / nextDisabled

- type: `boolean`
- required: `false`
- description: 이전/다음 버튼 disabled 상태를 호출부가 명시적으로 제어할 때 사용합니다. 생략하면 `pages`의 최소/최대값과 `currentPage`를 기준으로 계산합니다.

### previousLabel / nextLabel

- type: `string`
- required: `false`
- default: `이전 페이지` / `다음 페이지`
- description: 이전/다음 버튼의 accessible name입니다.

### getPageAriaLabel

- type: `(page: number, selected: boolean) => string`
- required: `false`
- description: 페이지 번호 버튼의 accessible name을 커스터마이즈합니다.

### previousIcon / nextIcon

- type: `ReactNode`
- required: `false`
- description: 이전/다음 아이콘을 교체할 때 사용합니다.

### native nav props

- type: `ComponentPropsWithoutRef<'nav'>`
- description: `children`, `onChange`를 제외한 native nav props를 전달합니다.

## States

- default: 전달된 `pages`를 순서대로 `NumButton`으로 렌더링합니다.
- selected/current: `currentPage`와 같은 번호에 `selected`와 `aria-current="page"`를 적용합니다.
- previous disabled: 첫 페이지이거나 `previousDisabled`가 `true`이면 이전 버튼을 비활성화합니다.
- next disabled: 마지막 페이지이거나 `nextDisabled`가 `true`이면 다음 버튼을 비활성화합니다.
- loading: 지원하지 않습니다. 호출부가 Navigation 노출 여부를 결정합니다.
- empty/error: 지원하지 않습니다. 호출부가 Navigation 노출 여부를 결정합니다.

## Behavior

1. 페이지 번호 버튼을 선택하면 `onPageChange(page)`를 호출합니다.
2. 이전 버튼을 선택하면 disabled가 아닐 때 `onPageChange(currentPage - 1)`를 호출합니다.
3. 다음 버튼을 선택하면 disabled가 아닐 때 `onPageChange(currentPage + 1)`를 호출합니다.
4. 실제 route 이동, query string 동기화, API 요청은 실행하지 않습니다.
5. ellipsis, windowing, total page 계산은 실행하지 않습니다.

## Styling

- layout: inline-flex nav, 내부 container min-height 3.2rem
- spacing: Figma 기준 wrapper gap 0.4rem, 페이지 목록 gap 1.6rem, 좌우 padding 1.6rem
- responsive: 페이지 목록은 부모 폭이 좁으면 가로 overflow를 허용합니다.
- hover/focus/disabled: 이전/다음 버튼은 focus-visible outline과 disabled opacity를 사용합니다. 페이지 버튼 focus/hover는 `NumButton`이 담당합니다.
- token usage: icon color와 focus outline은 `atomic`, `semantic` token을 사용합니다.

## Accessibility

- semantic element: `nav`
- accessible name: 기본값 `페이지 탐색`, 또는 `aria-label` / `aria-labelledby`
- keyboard interaction: native button keyboard interaction 사용
- focus-visible: 이전/다음 버튼과 `NumButton` 모두 focus-visible을 유지합니다.
- ARIA: 현재 페이지 버튼에 `aria-current="page"`를 전달합니다.

## Storybook

- [x] Default
- [x] FirstPage
- [x] LastPage
- [x] ManyPages
- [x] CustomLabels
- [ ] Loading when supported: 미지원
- [ ] Invalid/Error when supported: 미지원

## Public API

- [x] `Navigation` value export
- [x] `NavigationProps` type export
- [x] no private helper export

## Verification

- [x] `git diff --check`
- [x] `pnpm format:check`
- [x] `pnpm --filter @dongchimi/design-system build`
- [x] `pnpm --filter @dongchimi/design-system lint`
- [x] `pnpm --filter @dongchimi/design-system typecheck`
- [x] `pnpm --filter @dongchimi/design-system test:unit`
- [x] `pnpm --filter @dongchimi/design-system build-storybook`
