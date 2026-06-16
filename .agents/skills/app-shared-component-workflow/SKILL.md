---
name: app-shared-component-workflow
description: apps/client, apps/design-system-web, 선택적 apps/admin 내부의 앱 전용 shared 컴포넌트를 생성, 스펙 작성, export, 검증할 때 사용합니다.
---

# 앱 shared 컴포넌트 작업 흐름

## 목적

한 앱 안에서 여러 페이지가 재사용하지만, 아직 `packages/design-system`으로 올릴 만큼 cross-app reuse가 확정되지 않은 컴포넌트를 일관되게 배치합니다.

## 입력 점검

### 필수 입력

- 대상 앱: `client`, `design-system-web`, 필요 시 `admin`
- 컴포넌트 이름: PascalCase
- 카테고리: `ui` 또는 `layout`
- 앱 내부 재사용 근거
- 최소 상태: default 외 필요한 disabled/loading/error/invalid 여부

### 있으면 좋은 입력

- Jira key와 완료 기준
- Figma URL, 이미지, 스크린샷, 또는 상세 디자인 설명
- 참고할 design-system 컴포넌트 또는 앱 내부 컴포넌트
- 접근성 요구: role, label, keyboard, focus-visible

## 경계 판단

| 위치 | 사용 기준 |
| --- | --- |
| `apps/{app}/src/pages/{domain}/{page}/components` | 한 페이지 또는 라우트에서만 쓰는 컴포넌트 |
| `apps/{app}/src/shared/components/{ui|layout}` | 한 앱 안에서 여러 페이지가 재사용하는 컴포넌트 |
| `packages/design-system` | 앱/도메인과 무관하고 여러 앱에서 재사용할 공통 primitive |

앱 shared 컴포넌트는 특정 앱의 제품 copy, route, API data에 직접 묶이지 않아야 합니다. 그런 책임이 필요하면 page-local 컴포넌트로 둡니다.

## 메인 작업 흐름

1. 컴포넌트가 앱 shared 영역에 속하는지 확인합니다.
2. package script가 존재하면 `gen:app-component` scaffold를 사용합니다.
3. 생성된 `ComponentName.spec.md`를 먼저 채워 purpose, usage, props, states, accessibility, styling constraints를 정리합니다.
4. 스펙에 맞춰 `ComponentName.tsx`를 구현합니다.
5. 앱 내부 export가 필요한 범위에만 연결됐는지 확인합니다.
6. text overflow, focus-visible, disabled, hover, responsive constraints를 확인합니다.

## 완료 기준

- route-local, app shared, design-system 경계 판단이 명확합니다.
- spec이 구현 전에 채워졌고 구현과 동기화되어 있습니다.
- public API는 `ComponentName`과 `ComponentNameProps`만 export합니다.
- 앱 도메인 API, route, logging, analytics를 컴포넌트 내부에 직접 넣지 않았습니다.
- 접근성, 상태, 긴 텍스트, 반응형 제약을 확인했습니다.

## 예외

- 한 페이지에서만 쓰는 컴포넌트는 앱 shared로 올리지 않습니다.
- 여러 앱에서 즉시 재사용할 공통 primitive는 `design-system-component-workflow`를 사용합니다.
