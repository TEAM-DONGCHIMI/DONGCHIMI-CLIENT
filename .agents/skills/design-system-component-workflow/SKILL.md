---
name: design-system-component-workflow
description: packages/design-system 공통 컴포넌트를 Figma/이미지/상태 요구사항 기반으로 생성, 구현, story/spec/export 검증할 때 사용합니다.
---

# 디자인시스템 컴포넌트 작업 흐름

## 목적

`packages/design-system`에 제품 비의존 공통 UI 컴포넌트를 추가하거나 변경할 때 사용합니다.

동치미에서 `packages/design-system`이 아직 생성되지 않았다면 이 skill은 구현 대신 Jira/spec에서 컴포넌트 책임, public API, 상태, Storybook 필요성을 확정하는 데 사용합니다.

## 입력 점검

### 필수 입력

- 컴포넌트 이름: PascalCase
- 카테고리: `ui` 또는 `layout`
- 핵심 용도와 public API 기대값
- 최소 상태: default 외 필요한 disabled/loading/error/invalid 여부

### 있으면 좋은 입력

- Figma URL, 이미지, 스크린샷, 또는 상세 디자인 설명
- variants와 size 체계
- 접근성 요구: role, label, keyboard, focus-visible
- 참고할 기존 컴포넌트

## 읽기 전략

- 항상 읽기:
  - `recipes/add-design-system-component.md`
  - `docs/code-quality/frontend-fundamentals.md`
  - 필요 시 `docs/code-quality/frontend-readability.md`, `docs/code-quality/frontend-predictability.md`, `docs/code-quality/frontend-cohesion.md`, `docs/code-quality/frontend-coupling.md`
  - 필요 시 `docs/code-quality/frontend-logic-composition.md`
- 조건부 읽기:
  - `docs/architecture/design-system.md`
  - `docs/architecture/design-system-components.md`
  - `docs/architecture/design-system-component-plan.md`
  - `docs/workflows/spec-writing.md`

## 메인 작업 흐름

1. 컴포넌트가 design system에 속하는지 확인합니다.
2. Figma 또는 실제 reuse 근거를 확인합니다.
3. package script가 존재하면 `gen:ds-component` scaffold를 사용합니다.
4. `ComponentName.spec.md`를 먼저 채워 behavior, props, states, accessibility, styling constraints를 정리합니다.
5. public API, 구현 파일, export, Storybook을 동기화합니다.
6. Storybook에는 의미 있는 states와 variants를 포함합니다.
7. text overflow, focus-visible, disabled, hover, responsive constraints를 확인합니다.
8. Frontend Fundamentals 허브, 개별 기준 문서, 필요 시 logic composition 기준으로 public API 예측 가능성, DOM semantics, ARIA/ref 책임, 조건 분기 복잡도, 응집도/결합도를 self-check합니다.

## 완료 기준

- 제품 도메인, route, API, logging, analytics에 의존하지 않습니다.
- public component와 public prop type만 export합니다.
- 지원 상태와 지원하지 않는 상태가 spec에 명시되어 있습니다.
- Storybook 또는 시각 검증 표면이 meaningful state를 보여줍니다.
- Frontend Fundamentals 기준 self-check를 수행했고, public component 변경이면 `frontend-fundamentals-review`를 추가로 적용했습니다.
- package script가 없으면 실행하지 못한 검증과 이유를 기록합니다.

## 예외

- product copy, route data, logging, analytics, API behavior는 design-system component에 넣지 않습니다.
- 실제 reuse나 shared Figma component 근거 없이 app-local UI를 `packages/design-system`으로 승격하지 않습니다.
