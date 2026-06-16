---
name: page-feature-workflow
description: 동치미 앱의 페이지 또는 라우트를 Jira, Figma, spec, generator 기준으로 구현하고 검증할 때 사용합니다.
---

# 페이지 기능 작업 흐름

## 목적

`apps/client`, `apps/design-system-web`, 선택적 `apps/admin`에서 페이지, 라우트, route-local component를 구현할 때 사용합니다.

앱 구조가 아직 실제 코드로 확정되지 않았다면 구현을 강제하지 않고, Jira issue와 spec에 route, page ownership, scaffold 기대 구조를 먼저 고정합니다.

## 입력 점검

### 필수 입력

- 대상 앱: `client`, `design-system-web`, 필요 시 `admin`
- 기능 목표와 성공 기준
- route path 또는 기준이 되는 기존 페이지
- 새 route인지 기존 page 변경인지

### 있으면 좋은 입력

- Jira/기능명세/요구사항 문서
- Figma URL, 이미지, 스크린샷, 또는 상세 화면 설명
- API 필요 여부와 관련 endpoint 문서
- 권한, layout, navigation, mobile/desktop 조건
- loading, empty, error, disabled, success 상태
- URL params, search params, 진입 경로, 완료 후 이동 규칙

route 위치, 권한, 완료 후 이동, 화면 구조가 불명확하고 repo 탐색으로도 확인할 수 없으면 구현 전에 질문합니다.

## 읽기 전략

- 항상 읽기:
  - `recipes/add-page.md`
- 조건부 읽기:
  - `docs/architecture/app-structure.md`: route/layout 위치가 애매할 때
  - `docs/workflows/turbo-generators.md`: 새 page scaffold 또는 generator 출력 경로를 확인할 때
  - `docs/workflows/spec-writing.md`: 새 page spec 작성 또는 갱신이 필요할 때
  - `recipes/add-component.md`: route-local component를 새로 분리할 때
  - `recipes/add-api-query.md`: query/mutation이 새로 생기거나 cache/error 정책이 필요한 때
  - `templates/page.spec.md`: page spec 항목을 맞춰야 할 때
  - 가까운 page/route/component: 항상 문서보다 먼저 확인

## 메인 작업 흐름

1. Jira issue 본문과 상태를 확인하고, 필요하면 진행중으로 전환합니다.
2. route ownership, app workspace, domain, page folder를 확정합니다.
3. 새 page면 package script가 존재할 때 `gen:domain-page` scaffold를 사용합니다.
4. 새 page, route 변경, 의미 있는 UI state, API interaction이 있으면 `page.spec.md`를 작성 또는 갱신합니다.
5. route constants, router registration, redirect, layout/navigation 영향을 확인합니다.
6. page는 composition first로 만들고, 복잡한 상태/계산/서버 연동만 page-local 또는 domain hook으로 분리합니다.
7. UI 상태, 접근성, 긴 텍스트, 반응형 제약을 확인합니다.
8. 검증 후 PR 준비 단계로 넘깁니다.

## 페이지 구현 기준

- 새 page 파일은 `apps/{app}/src/pages/{domain}/{page}/{PageName}.tsx`를 기본 후보로 둡니다.
- 페이지 내부 전용 컴포넌트는 `components`, 화면 구획은 `sections`, page 전용 보조 함수는 `utils`에 둡니다.
- 도메인 API helper, query/mutation hook, query key는 `pages/{domain}/api`, `pages/{domain}/hooks`, `pages/{domain}/query-keys.ts`에 둡니다.
- 여러 페이지에서 실제로 재사용될 때만 앱 `shared`로 올리고, 여러 앱 재사용이 확인될 때만 `packages/*`를 검토합니다.
- 앱/package 구조가 실제로 없으면 spec에 “예정 위치”로 기록하고 코드 파일을 만들지 않습니다.

## 완료 기준

- 페이지 동작이 Jira와 spec의 완료 기준과 맞습니다.
- route params와 search params가 명시적으로 처리됩니다.
- loading, empty, error, disabled, success 상태가 고려되어 있습니다.
- route-local component는 실제 reuse 전까지 local에 남아 있습니다.
- page spec, route constant, router registration, navigation 영향이 동기화되어 있습니다.
- 대상 app 검증이 통과하거나, package script 미존재 등 잔여 리스크가 보고됩니다.

## 예외

- copy-only 또는 작은 style 변경은 page spec 갱신이 필요 없을 수 있습니다.
- 단일 페이지를 위해 route-level abstraction을 만들지 않습니다.
- 재사용 가능성만으로 `packages/*`로 이동하지 않습니다.
