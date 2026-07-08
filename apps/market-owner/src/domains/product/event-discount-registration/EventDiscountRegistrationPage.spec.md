# React Page Spec: `EventDiscountRegistrationPage`

## Metadata

- App: `market-owner`
- Domain: `product`
- Page: `event-discount-registration`
- Route: `/products/event-discount/new`
- Path: `apps/market-owner/src/domains/product/event-discount-registration/EventDiscountRegistrationPage.tsx`
- Jira: DCMSM-18
- Figma:
  - APPJAM page node 1553:114355
  - APPJAM Section node 1553:114358
  - 화면 설계서 node 493:102280
- Status: Implemented

## Purpose

행사 할인 상품 등록 flow에서 업로드가 완료된 등록 파일을 분석하기 전에 파일명과 AI 분석 항목을 확인하는 화면을 제공합니다.
사장님 데스크탑 protected sidebar layout 안에서 렌더링하며, 등록 파일 분석 진행 화면은 DCMSM-19, 분석 결과 확인/임시 저장 화면은 DCMSM-20에서 이어서 구현합니다.

## Ownership

- Route-independent page composition lives in this domain page.
- React Router route object imports this page from `src/app/router.tsx`.
- Page-local components, sections, hooks, fixtures, and utils stay under this page folder.
- Sidebar/protected layout responsibility stays in `src/app/layouts/SidebarLayout.tsx` and `src/app/routes/ProtectedRoute.tsx`.
- `FileAnalysisConfirmSection` is page-local because the copy, file fixture, and next-step behavior are tied to this registration flow.
- `FileAnalysisConfirmSection` renders the Figma `Section` card as the root `section` element instead of adding a separate layout wrapper.
- App-shared `DesktopHeader` is reused for the breadcrumb header.
- Design-system `Flex` is reused for internal layout and `Button` is reused for actions.
- Analysis item chips are page-local static labels until repeated reuse is confirmed in DCMSM-19/20.

## Layout

- Page root owns background and vertical flow only. It does not apply global inline padding.
- `DesktopHeader` owns its Figma header spacing, including 64px height and 40px inline padding.
- `FileAnalysisConfirmSection` is rendered directly under the page root and keeps its card width,
  internal padding, and vertical centering responsibility.

## UI States

- loading: 이번 범위에서 다루지 않습니다.
- empty/disabled: 분석 가능한 파일명이 없으면 `분석할 파일이 없습니다.`를 표시하고 `분석 시작` 버튼을 비활성화합니다.
- error: 알 수 없는 route는 router fallback에서 처리합니다.
- success: `/products/event-discount/new` route가 `등록한 파일을 확인해주세요` heading, 업로드 파일명, AI 분석 항목, `취소`/`분석 시작` 액션을 렌더링합니다.

## Data

- query: none
- mutation: none
- fixture: page-local `fileAnalysisConfirmFixture`
- model: none

## Behavior

- Breadcrumb copy는 `행사 할인 상품 등록 / 등록 파일 분석`입니다.
- 업로드 완료 파일명은 `상품목록_202607.xlsx` fixture로 표시합니다.
- AI 분석 항목은 `상품명 등록`, `판매가격 등록`, `상품 이미지 연결`, `카테고리 분류`를 읽기 전용으로 표시합니다.
- `취소`는 이전 업로드/등록 단계로 돌아가는 callback entry point입니다. 실제 이전 화면 연결은 등록 페이지 조합 작업에서 처리합니다.
- `분석 시작`은 DCMSM-19 분석 진행 화면으로 넘어가는 callback entry point입니다.
- 행사 할인 상품 등록 form, 업로드 API, SSE 분석 진행, 분석 결과 확인/임시 저장, 최종 등록 완료 결과 UI는 이번 이슈 범위가 아닙니다.

## Accessibility

- heading order: page root는 visible `h1`으로 `등록한 파일을 확인해주세요`를 제공합니다.
- keyboard: `취소`와 `분석 시작`은 native button keyboard interaction을 사용합니다.
- focus: focus-visible 스타일을 제거하지 않습니다.
- current state: sidebar item은 현재 route에 `aria-current="page"`를 적용합니다.
- breadcrumb: 현재 위치 nav와 현재 페이지 `aria-current="page"`를 제공합니다.
- analysis items: `AI 분석 항목` label과 list semantics를 제공합니다.

## Verification

- [x] `/products/event-discount/new` route renders `등록한 파일을 확인해주세요`
- [x] route renders uploaded file name and four AI analysis items
- [x] route renders sidebar complementary landmark
- [x] sidebar `행사 할인 상품 등록` link has `aria-current="page"`
- [x] `분석 시작` is disabled when there is no analyzable file name
