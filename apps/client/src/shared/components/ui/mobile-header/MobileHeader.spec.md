# Component Spec: `MobileHeader`

## Metadata

- App: `client`
- Category: `ui`
- Path: `apps/client/src/shared/components/ui/mobile-header/MobileHeader.tsx`
- Status: Ready

## Purpose

- APPJAM `mobile_header` 디자인을 기준으로 `apps/client` 모바일 화면 상단에서 재사용하는 헤더입니다.
- 일반 페이지는 뒤로가기 액션과 페이지별 제목을 조합하고, 홈은 로고 영역만 조합합니다.
- `할인 품목`은 디자인 예시 문구이며 컴포넌트 내부에서 고정하지 않습니다.

## Requirements

- [x] 앱 내부 여러 페이지와 홈에서 공유하는 layout component로 둡니다.
- [x] route, API, analytics side effect를 직접 가지지 않습니다.
- [x] compound API는 `BackButton`, `Title`, `Logo`로 제한합니다.
- [x] 제목형과 로고형 모두 흰색 48px 모바일 헤더 높이를 유지합니다.
- [x] 긴 제목은 한 줄 말줄임 처리하고 중앙 정렬을 유지합니다.

## Props

- `MobileHeader`: native `header` props, `children`, `className`
- `MobileHeader.BackButton`: design-system `IconButton` 기반, `icon`과 화면 맥락별 `aria-label`은 호출부에서 필수로 주입합니다. 헤더 전용 뒤로가기 형태를 유지하기 위해 `color`, `variant`, `size`, `rounded`는 호출부에 열지 않습니다.
- `MobileHeader.Title`: native heading props, `children`, `as` optional (`h1` default)
- `MobileHeader.Logo`: native `div` props, `children`, `className`

## States

- default: 제목형 또는 로고형 조합을 렌더링합니다.
- disabled: `BackButton`의 native disabled 상태를 지원합니다.
- loading: 없음. 데이터 로딩은 호출 페이지 책임입니다.
- error: 없음. 에러 표시와 route fallback은 호출 페이지 책임입니다.

## Accessibility

- 헤더 root는 `header` landmark입니다.
- `BackButton`은 icon-only control이므로 accessible name을 항상 제공합니다.
- `Title`은 기본 `h1`이지만 페이지 heading 구조에 따라 호출부가 `as`로 낮출 수 있습니다.
- `Logo`의 대체 텍스트나 label은 전달되는 이미지 또는 호출부 마크업 책임입니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
