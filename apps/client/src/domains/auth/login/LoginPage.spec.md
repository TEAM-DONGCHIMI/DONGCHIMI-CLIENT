# Login Page Spec

## Metadata

- Jira: DCMCL-12
- Screen ID: `모웹_로그인`
- Figma frame: [APPJAM node 2662:156337](https://www.figma.com/design/xIDbjqPKzG4bQL5Gaoqfvb/APPJAM?node-id=2662-156337&m=dev)
- Route: `/login`
- Owner: `apps/client`
- Status: Implemented

## Purpose

- 모바일 웹 사용자가 카카오 로그인을 시작할 수 있는 온보딩 화면을 제공합니다.
- 이번 작업은 로그인 화면 UI만 구현하며 실제 OAuth 연동은 포함하지 않습니다.

## Source Of Truth

- 전체 화면: Figma `모웹_로그인` node `2662:156337`
- 하단 로그인 Container: Figma node `2662:156339`
- 카카오 버튼: Figma node `2662:156341`
- Related Jira: DCMCL-12

## Scope

- 앱 viewport 상단에 `375 / 433` 비율의 온보딩 이미지 영역을 제공합니다.
- 카카오 로그인 버튼과 약관 안내 문구를 제공합니다.
- 카카오 버튼 배경은 디자인시스템의 `semantic.status.kakaoYellow` token을 사용합니다.
- 모바일 viewport와 safe area에 대응합니다.

## Out Of Scope

- Figma의 iOS 상태바 및 모바일 브라우저 툴바 구현
- 카카오 OAuth 및 로그인 API 연동
- 로그인 성공, 실패, loading 상태
- 로그인 이후 redirect
- 이용약관 및 개인정보처리방침 페이지 구현

## Layout And Sections

```text
LoginPage
  Onboarding image
  Login section
    KakaoLoginButton (page-local)
    Terms notice
```

## Layout Measurements

- Figma device frame: `375px × 812px`
- app viewport: `375px × 666px`
- onboarding image: `375px × 433px`
- login container: app viewport 전체 높이, 좌우 `20px`, 하단 `60px`, 하단 정렬
- Kakao button: `335px × 50px`, radius `12px`
- Kakao icon: `20px`
- icon-label gap: `4px`
- terms margin-top: `18px`

## States

- default: 카카오 로그인 버튼을 활성 상태로 표시합니다.
- focus-visible: 공통 `Button`과 동일한 primary focus outline을 표시합니다.
- disabled: 공통 `Button`과 동일한 neutral 배경, 흰색 텍스트, disabled cursor를 적용합니다.
- hover: 공통 `Button`과 동일하게 별도 시각 상태를 정의하지 않습니다.
- loading / error / success: 이번 UI 작업에서는 지원하지 않습니다.

## Behavior

- 버튼은 native `button`이며 type은 `button`입니다.
- 실제 클릭 동작과 OAuth side effect는 후속 로그인 연동 작업에서 추가합니다.

## Accessibility

- 화면 제목은 시각적으로 숨긴 `h1`으로 제공합니다.
- 카카오 로고는 장식 요소로 접근성 트리에서 제외합니다.
- 버튼 텍스트가 accessible name을 제공합니다.
- 키보드 `focus-visible` 상태를 제공합니다.

## Responsive

- 온보딩 이미지는 viewport 상단에서 `375 / 433` 비율을 유지합니다.
- 로그인 영역은 전체 viewport 높이를 차지하고 콘텐츠를 하단 정렬합니다.
- 로그인 영역은 좌우 `2rem`, 하단 `6rem`을 기준으로 safe area를 반영합니다.

## Verification

- [ ] `git diff --check`
- [ ] `pnpm format:check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/login`

## Open Questions

- 온보딩 이미지 최종 PNG 교체 시점과 asset 경로
- 카카오 OAuth 연동 시 disabled/loading 정책
