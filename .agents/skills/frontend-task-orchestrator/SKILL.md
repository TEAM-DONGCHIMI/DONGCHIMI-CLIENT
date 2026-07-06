---
name: frontend-task-orchestrator
description: 프론트엔드 작업을 유형별 작업 흐름으로 라우팅하고, 필요한 입력/문서/검증 범위를 결정할 때 사용합니다.
---

# 프론트엔드 작업 오케스트레이터

## 목적

프론트엔드 작업을 시작하기 전에 작업 유형, 필요한 입력, 사용할 문서, 검증 범위를 결정합니다.

Jira, Figma, 사진, 스크린샷을 근거로 작업을 만들거나 시작하는 요청은 먼저 `jira-design-implementation-workflow`로 요구사항과 순서 게이트를 확인한 뒤 이 skill로 작업 유형을 세분화합니다.

## 입력 점검

### 필수 입력

- 작업 목표와 성공 기준
- 작업 유형: 공통 컴포넌트, 페이지/라우트, API 연동, 폼, 리팩터링, 검증
- 대상 workspace 또는 변경 예상 위치

### 있으면 좋은 입력

- Jira/기능명세/디자인 링크
- API 문서 또는 Swagger/OpenAPI 링크
- 기대 산출물: 코드, spec, 문서, 테스트, PR 준비

필수 입력이 없고 repo 탐색으로도 확인할 수 없으면 구현 전에 질문합니다.

## 읽기 전략

- 항상 읽기: 없음
- 조건부 읽기:
  - 선택한 작업 흐름 skill의 `SKILL.md`
  - 선택한 작업 흐름에 연결된 recipe
  - `docs/workflows/spec-writing.md`: 새 spec 작성 또는 갱신이 필요할 때
  - `docs/code-quality/frontend-fundamentals.md`: 페이지, 컴포넌트, hook, API, form 등 프론트엔드 구현 품질 self-check가 필요할 때
  - `docs/architecture/repo-structure.md`: app/package 위치가 불명확할 때

문서는 많이 읽기보다 먼저 `rg`, `find`, 가까운 기존 코드로 현재 패턴을 확인합니다.

## 작업 흐름 선택

| 작업 유형 | 사용할 skill | 기준 문서 |
| --- | --- | --- |
| Jira/Figma/사진 기반 작업 생성 또는 착수 | `jira-design-implementation-workflow` | `recipes/jira-design-to-implementation.md` |
| 앱 shared 컴포넌트 | `app-shared-component-workflow` | `recipes/add-app-shared-component.md` |
| 공통 컴포넌트 | `design-system-component-workflow` | `recipes/add-design-system-component.md` |
| 페이지/라우트 | `page-feature-workflow` | `recipes/add-page.md` |
| API query/mutation | `api-integration-workflow` | `recipes/add-api-query.md` |
| 폼/검증/submit | `form-flow-workflow` | `recipes/add-form.md` |
| Turbo generator 추가/수정 | `turbo-generator-workflow` | `docs/workflows/turbo-generators.md` |
| 리팩터링 판단 | `refactor-evaluator` | `recipes/refactor-component.md` |
| 성능 이슈 | `performance-diagnosis` | `docs/code-quality/index.md` |
| 구현 후 검증 | `frontend-quality-verification` | `docs/workflows/local-development.md` |
| 코드 품질 리뷰 | `frontend-fundamentals-review` | `docs/code-quality/frontend-fundamentals.md` |
| 커밋 분해 또는 PR 준비 | `commit-planning-workflow` | `recipes/commit-plan.md` |

여러 유형이 섞인 작업은 핵심 구현 작업 흐름을 먼저 선택하고, 마지막 검증은 `frontend-quality-verification`으로 마무리합니다.
페이지, 컴포넌트, hook, API, form 구현은 각 작업 흐름 안에서 `docs/code-quality/frontend-fundamentals.md`를 self-check 기준으로 포함합니다. 비자명한 변경, shared/public API 변경, PR 전 점검은 `frontend-fundamentals-review`를 별도 리뷰 단계로 추가합니다.

## 출력 형식

```markdown
## Frontend Work Plan

- 작업 유형:
- 대상 workspace:
- 부족한 입력:
- 사용할 작업 흐름 skill:
- 사용할 문서:
- 필요한 spec:
- 품질 self-check:
- 검증:
```

## 예외

- 단순 copy, import 정리, 한 줄 문서 변경은 이 skill을 강제하지 않습니다.
- 작은 변경에는 별도 계획을 길게 만들지 않습니다.
