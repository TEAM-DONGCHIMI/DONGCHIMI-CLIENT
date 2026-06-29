---
name: jira-design-implementation-workflow
description: Jira/Figma/사진 근거를 바탕으로 작업을 만들거나 시작할 때, Jira 작성, Jira 확인, 스펙 작성, 구현, 개선, 검증 순서를 강제하는 공통 프론트엔드 작업 게이트입니다.
---

# Jira 디자인 기반 구현 워크플로

## 목적

Jira, Figma, 사진, 스크린샷을 근거로 프론트엔드 작업을 작성하거나 시작할 때 사용하는 선행 워크플로입니다.

이 skill은 실제 구현을 담당하지 않습니다. 구현 전에 필요한 근거 확인과 순서 게이트를 고정하고, 이후 작업 유형에 맞는 기존 workflow로 넘깁니다.

## 적용 시점

다음 요청이 있으면 먼저 이 skill을 사용합니다.

- Figma, 사진, 스크린샷을 보고 Jira를 작성하거나 보강할 때
- 특정 Jira 이슈를 확인한 뒤 구현을 시작할 때
- Jira/Figma 기반으로 페이지, 컴포넌트, 디자인시스템 컴포넌트, 폼, API 작업을 진행할 때
- 사용자가 "지라 확인 후 작업", "피그마 보고 지라 작성", "사진 기준으로 컴포넌트 구현"처럼 근거 확인과 구현을 함께 요청할 때

단순 오탈자, 문구만 바꾸는 변경, 이미 확인된 작은 문서 수정에는 강제하지 않습니다.

## 강제 게이트

### 1. Jira 작성 요청이면 구현하지 않습니다.

먼저 다음 근거를 확인합니다.

- Figma URL 또는 캡처 이미지
- 사진/스크린샷이 있으면 실제 상태와 디자인 차이
- 컴포넌트 또는 화면 목적
- variant, 상태, 반응형, 접근성 요구
- 포함 범위와 제외 범위

Jira issue type, parent 참조, 하위 작업 분해, 본문 템플릿은 `docs/workflows/jira-issue-authoring.md`와 `templates/jira-issue-template.md`를 기준으로 결정합니다.

근거가 부족하고 repo나 Jira에서 확인할 수 없으면 Jira를 작성하기 전에 질문합니다.

### 2. Jira 작업 요청이면 구현 전에 Jira를 확인합니다.

구현 전에 다음을 짧게 정리합니다.

- Jira key, 제목, 상태, 담당자
- 목표와 완료 기준
- 디자인 링크, 사진, 첨부 자료
- 작업 범위와 제외 범위
- 스펙, story, 테스트, 검증 요구

Jira와 Figma/사진이 다르면 구현 전에 차이를 보고하고, 어떤 기준으로 진행할지 확인합니다.

변경 범위별 Jira key:

| 변경 범위 | Jira project key |
| --- | --- |
| root, docs, CI, repo workflow | `DCMFE-*` |
| client web | `DCMCL-*` |
| design-system web | `DCMDS-*` |
| design-system package | `DCMDS-*` |

디자인시스템 package와 design-system web은 같은 `DCMDS-*` project를 사용하고, 필요한 경우 Jira Component 또는 label로 surface를 구분합니다.

### 3. 작업 유형을 라우팅합니다.

Jira 확인 후 실제 구현 workflow를 선택합니다.

| 작업 유형 | 다음 skill | 절차 |
| --- | --- | --- |
| 디자인시스템 컴포넌트 | `design-system-component-workflow` | `recipes/add-design-system-component.md` |
| 페이지 또는 라우트 | `page-feature-workflow` | `recipes/add-page.md` |
| 앱 shared 컴포넌트 | `app-shared-component-workflow` | `recipes/add-app-shared-component.md` |
| 앱 로컬 컴포넌트 | `refactor-evaluator` 또는 가까운 컴포넌트 절차 | `recipes/add-component.md` |
| API 조회 또는 변경 요청 | `api-integration-workflow` | `recipes/add-api-query.md` |
| 폼, 검증, submit 흐름 | `form-flow-workflow` | `recipes/add-form.md` |
| Turbo generator 추가/수정 | `turbo-generator-workflow` | `docs/workflows/turbo-generators.md` |
| 검증 또는 PR 전 확인 | `frontend-quality-verification` | `docs/workflows/local-development.md` |

### 4. 스펙이 필요한 작업은 구현 전에 작성하거나 갱신합니다.

`docs/workflows/spec-writing.md` 기준으로 스펙 필요 여부를 확인합니다.

스펙이 필요한 경우:

- 새 페이지 또는 라우트
- 새 폼 또는 단계형 상태 흐름
- 새 API query 또는 mutation
- shared component 또는 디자인시스템 컴포넌트
- loading, empty, error, disabled 등 여러 UI 상태가 있는 컴포넌트
- public props, hook return shape, route params, API contract 변경

스펙에는 최소한 목적, 사용 위치, public API 또는 입력, 상태, 동작, 검증/에러, 스타일 제약, 접근성, 검증 방법을 적습니다.

### 5. 구현 후 개선 라운드를 거칩니다.

구현 직후 바로 마무리하지 않고 다음을 확인합니다.

- Jira 완료 기준과 구현 diff가 맞는가
- 스펙과 실제 props/state/behavior가 동기화됐는가
- story 또는 예시가 의미 있는 variant와 상태를 보여주는가
- disabled, loading, empty, error, invalid, selected 상태가 필요한 만큼 다뤄졌는가
- focus-visible, accessible name, keyboard interaction이 필요한 영역에서 빠지지 않았는가
- 긴 텍스트, overflow, 반응형 제약이 깨지지 않는가

### 6. 마무리에는 검증 결과와 남은 리스크를 포함합니다.

최종 요약에는 다음을 남깁니다.

- 생성하거나 확인한 Jira key
- 사용한 Figma/사진/스크린샷 근거
- 변경한 문서, 스펙, 절차, 코드 표면
- 실행한 검증 명령과 결과
- 실행하지 못한 검증과 남은 리스크

## 출력 형식

작업 착수 시:

```markdown
## Jira/Figma 작업 게이트

- Jira:
- 디자인 근거:
- 작업 유형:
- 필요한 스펙:
- 다음 워크플로:
- 확인 필요:
```

작업 완료 시:

```markdown
## 완료 요약

- Jira:
- 변경:
- 검증:
- 남은 리스크:
```
