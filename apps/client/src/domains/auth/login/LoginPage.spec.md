# Login Page Spec

## Metadata

- Jira: DCMCL-2
- Screen ID: 모바일 웹 사용자측 와이어프레임 로그인 화면
- Route: `/login`
- Owner: apps/client
- Status: Implemented

## Purpose

- 사용자측 모바일 웹의 로그인 진입 화면입니다.
- 소셜 로그인 연동 전 route shell과 진입 위치만 고정합니다.

## Source Of Truth

- Figma: 첨부 와이어프레임 이미지
- FRS / SRS: 없음
- Decision / Meeting note: DCMCL-2 본문
- Related Jira: DCMCL-2

## Scope

- `/login` route entry와 `LoginPage` domain page shell을 제공합니다.
- 로그인 후 첫 화면 후보인 `/markets`로 이동할 수 있는 placeholder link를 둡니다.

## Out Of Scope

- 카카오, 네이버, Apple 로그인 SDK 연동
- session 저장, refresh, redirect callback
- 실제 로그인 버튼 디자인 구현

## Layout And Sections

- 서비스 소개
- 로그인 진입 placeholder

## States

- loading: social login 연동 시 후속 처리
- empty: 없음
- error: social login 연동 시 후속 처리
- disabled: social login 연동 시 후속 처리
- selected / active: 없음

## Behavior

- navigation: 주변 마트 탐색 link는 `/markets`로 이동합니다.
- interaction: 실제 OAuth interaction은 후속 이슈에서 구현합니다.
- form / validation: 없음
- API: 없음

## Accessibility

- keyboard: link는 keyboard focus가 가능합니다.
- focus: 기본 focus style을 제거하지 않습니다.
- accessible name: 화면 제목은 `동치미 로그인`입니다.

## Responsive

- mobile: 모바일 웹 첫 화면 기준
- tablet: 후속 layout 기준 확정 필요
- desktop: 후속 layout 기준 확정 필요

## Verification

- [ ] `git diff --check`
- [ ] `pnpm --filter client lint`
- [ ] `pnpm --filter client typecheck`
- [ ] `pnpm --filter client build`
- [ ] browser route: `/login`

## Open Questions

- 로그인 완료 후 `/markets`로 바로 이동할지, 위치 권한 안내 route를 별도로 둘지 후속 결정이 필요합니다.
