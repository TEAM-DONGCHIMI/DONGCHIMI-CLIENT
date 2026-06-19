# Jira Issue Authoring

Jira 이슈를 만들거나 보강할 때 사용하는 기준입니다.

이 문서는 Jira issue type, parent 참조, 하위 작업 분해, 본문 템플릿, ready 기준을 고정합니다. 템플릿은 `templates/jira-issue-template.md`를 사용합니다.

## Scope

이 기준은 DONGCHIMI-CLIENT에서 프론트엔드 작업을 Jira로 만들거나 시작할 때 적용합니다.

| 변경 범위                     | Jira project key                           |
| ----------------------------- | ------------------------------------------ |
| root, docs, CI, repo workflow | `DCMFE-*`                                  |
| client web                    | `DCMCL-*`                                  |
| design-system web             | `DCMDSW-*`                                 |
| design-system package         | `DCMDS-*`                                  |
| admin web                     | `DCMFE-*` 기본, 별도 project가 생기면 갱신 |
| mobile WebView                | `DCMFE-*` 기본, 별도 project가 생기면 갱신 |

Jira/Figma/사진 기반 구현은 항상 이 문서로 이슈 구조를 정리한 뒤, `jira-design-implementation-workflow`로 착수 순서를 확인합니다.

## Source Of Truth

Jira 이슈 본문은 아래 근거를 대체하지 않고 참조합니다.

- SRS / FRS / 화면명세 / handoff: 지정된 기획 문서 또는 Confluence
- 디자인 원본: Figma URL, frame name, Screen ID
- 제품 결정: 회의록, 결정 로그, Jira comment
- 구현 기준: `AGENTS.md`, `docs/index.md`, `docs/workflows/spec-writing.md`, 가까운 recipe/spec

근거가 없으면 추측으로 이슈를 만들지 않습니다. 누락된 근거를 `TBD` 또는 `확인 필요`에 남기고, 구현 범위에 영향을 주면 질문합니다.

## Issue Type

### Epic

FRS 또는 handoff 단위를 대표할 때 사용합니다.

- 하나의 Epic은 원칙적으로 FRS 1개 이하를 담습니다.
- Epic 본문은 handoff 역할을 하며 SRS, FRS, Screen ID, 결정, DoD, 외부 의존을 모읍니다.
- 여러 페이지/플로우를 묶는 제품 단위이면 Epic을 먼저 확인하거나 생성합니다.

### Parent Task

FE 구현 묶음을 관리할 때 사용합니다.

Parent Task는 다음 경우에 적합합니다.

- 하나의 페이지, 메뉴, 플로우, 화면 그룹을 여러 child lane으로 나눌 때
- 공통 Figma 링크, Screen ID 목록, FRS/결정, 공통 제외 범위를 child가 공유할 때
- UI fixture lane과 API integration lane을 같은 상위 목표 아래 분리할 때

Parent Task 자체는 구현을 직접 크게 수행하기보다, child issue들이 참조할 기준과 진행 순서를 고정합니다.

### Story / Task

독립적으로 구현하고 PR로 닫을 수 있는 단위입니다.

- 단일 화면, 단일 route, 단일 app component, 단일 API hook, 단일 form flow
- 라우팅 셸, generator, workflow 문서처럼 parent/sub-task 구조가 불필요한 기반 작업
- 하나의 화면이라도 독립성이 충분하고 후속 child가 필요 없으면 단독 Task로 둡니다.

### Sub-task

Parent Task 아래의 PR-sized 구현 lane입니다.

Sub-task가 적합한 경우:

- Screen ID 1개 또는 밀접한 Screen ID 묶음 구현
- 같은 화면 안의 독립 영역, 상호작용, 모달, 패널
- fixture-only UI lane과 real API integration lane 분리
- header/actions, input, dialog처럼 큰 화면의 행동 단위 분리

Sub-task로 만들지 말아야 하는 경우:

- 단순 내부 작업 순서라서 별도 상태 추적이나 PR이 필요 없는 항목
- parent와 다른 제품, 앱, 패키지, owner를 갖는 항목
- 여러 parent에 걸치는 cross-cutting 변경
- 자체 FRS/DoD를 가져야 하는 큰 기능

## Split Rules

### Start From Screen ID

화면 구현은 Screen ID 기준으로 먼저 나눕니다.

- 작은 화면: Screen ID 1개 = child 1개
- 같은 패널/모달/반복 UI: 여러 Screen ID를 child 1개로 묶을 수 있음
- 큰 화면: UI 영역, 상태, interaction, API 연동으로 분리

### Split When

아래 조건 중 하나라도 있으면 별도 이슈를 검토합니다.

- 서로 다른 route 또는 page를 건드립니다.
- 서로 다른 앱 또는 package를 건드립니다.
- 디자인시스템/public component를 새로 만들거나 public API를 바꿉니다.
- API contract, query/mutation, cache invalidation이 UI와 독립적으로 검증되어야 합니다.
- backend/OpenAPI가 미확정이라 fixture UI와 real API 연동이 분리되어야 합니다.
- loading, empty, error, disabled, selected, invalid 같은 상태가 큰 하위 흐름을 이룹니다.
- 접근성, keyboard interaction, focus, dialog behavior가 독립 검증 대상입니다.
- 한 PR에서 리뷰하기 어려울 만큼 파일/상태/검증 범위가 커집니다.
- 다른 담당자가 병렬로 진행할 수 있습니다.

### Keep Together When

아래 경우는 한 이슈 안에 둡니다.

- route-local component 분리처럼 같은 화면 구현을 설명하기 위한 내부 구조입니다.
- copy, spacing, color, icon swap 같은 작은 조정입니다.
- 한 사용자 행동을 완성하려면 여러 작은 컴포넌트가 반드시 함께 변경되어야 합니다.
- 별도 PR로 나누면 fixture, state, spec, 검증이 중복됩니다.
- parent 본문 checklist로 충분히 추적 가능한 작업 순서입니다.

## Parent Reference

모든 child issue는 Jira parent 필드를 설정합니다. 본문에도 parent key를 한 번 더 적어, 검색과 복사 과정에서 관계가 끊기지 않게 합니다.

Child 본문에는 최소한 아래를 적습니다.

- Parent: `DCMFE-###`, `DCMCL-###`, `DCMDS-###`, `DCMDSW-###`
- Screen ID 또는 route
- 직접 관련된 FRS ID / 결정 / Figma frame
- 완료 기준과 검증

Cross-issue 관계는 parent로 숨기지 말고 Jira link로 명시합니다.

- API 또는 backend 선행: `is blocked by`
- 후속 구현: `blocks`
- 같은 결정 또는 화면명세를 공유: `relates to`
- 중복: `duplicates`

## Title Format

프론트엔드 작업 제목은 항상 `[FE]`로 시작합니다. 뒤에는 채널, 모듈, 산출물이 보여야 합니다.

```text
[FE][{module}] {page-or-feature} 구현 묶음
[FE][{module}] {Screen ID} {specific output} 구현
[FE][API][{module}] {feature} API 연동
[FE][DS] {component} 디자인시스템 컴포넌트 구현
[FE][Docs][workflow] {policy} 기준 정리
```

Examples:

```text
[FE][홈] DCM-HOME-001 홈 화면 구현
[FE][예약] DCM-RESERVE-001 예약 요청 화면 구현
[FE][API][예약] 예약 요청 mutation 연동
[FE][Docs][workflow] Agent harness 문서 구조 정리
```

## Labels And Components

Jira Component 필드가 사용 가능하면 `frontend` 또는 담당 surface를 설정합니다.

기본 labels:

- `FE`
- 작업 성격 label 1개: `FEAT`, `FIX`, `REFACTOR`, `DOCS`, `STYLE`, `TEST`, `CHORE` 중 하나

필요할 때만 보조 label을 추가합니다.

| Label      | Use when                                                                        |
| ---------- | ------------------------------------------------------------------------------- |
| `API`      | endpoint, query, mutation, cache invalidation, API error mapping이 포함됩니다.  |
| `DS`       | 디자인시스템 package 또는 public design-system component가 포함됩니다.          |
| `FORM`     | 입력 검증, submit, mutation, form state가 핵심입니다.                           |
| `A11Y`     | keyboard, focus, aria, semantic markup 검증이 핵심입니다.                       |
| `PERF`     | rendering cost, bundle, layout shift, virtualization, memoization이 핵심입니다. |
| `WORKFLOW` | docs, recipes, agent skill, PR/Jira 기준 같은 작업 절차를 바꿉니다.             |
| `ROUTE`    | router, top-level route, app shell, navigation 구조를 바꿉니다.                 |
| `FIXTURE`  | real API 없이 fixture 또는 mock data 기반 UI를 구현합니다.                      |

## Implementation Workflow

Jira 이슈가 작성된 뒤 작업은 아래 순서를 따릅니다.

1. 요구사항 분석과 설계 -> Jira 이슈 작성 -> Jira 이슈 티켓 발급
2. Jira 진행중 상태 변경 -> turbo gen으로 파일 생성 -> Jira 이슈 내용 기반 page, components, hooks 등 spec 문서 작성
3. 실제 컴포넌트, 페이지, 기능 등 구현 시작
4. 구현 내용 확인 및 검토
5. 추가 작업
   - 컴포넌트: story 추가 및 동작 검증
   - hook: 필요하면 단위 테스트 및 동작 검증
   - page: 로컬 route 확인 및 검증
6. 구조 개선
7. 커밋 + 푸시 및 PR 작성
8. Jira 이슈 리뷰중 상태 변경 -> 코드 리뷰
9. 머지 및 Jira 이슈 진행상황 완료 변경

Jira 작성만 요청받은 경우에는 이슈 작성 또는 보강에서 멈춥니다.

## Ready Checklist

이슈 생성 직후 아래 기준을 만족해야 구현 착수가 가능합니다.

- [ ] 앱별 Jira key가 맞습니다.
- [ ] parent 또는 단독 Task 선택 이유가 설명됩니다.
- [ ] child는 parent 필드와 본문 parent key를 모두 가집니다.
- [ ] FRS, Screen ID, Figma, 결정 중 사용한 근거가 링크되어 있습니다.
- [ ] `FE`와 작업 성격 label이 설정되어 있습니다.
- [ ] scope와 out of scope가 분리되어 있습니다.
- [ ] fixture-only, API integration, design-system 변경이 섞이지 않았습니다.
- [ ] 완료 기준이 구현 산출물과 검증 명령을 포함합니다.
- [ ] Open question이 구현 판단을 막으면 `TBD`가 아니라 blocker로 표시됩니다.

## Implementation Handoff

구현 착수 시에는 다음 순서로 확인합니다.

1. Jira issue 본문과 parent/child 관계를 확인합니다.
2. Figma, Screen ID, planning 문서가 Jira와 충돌하는지 확인합니다.
3. `docs/workflows/spec-writing.md` 기준으로 spec 필요 여부를 결정합니다.
4. 작업 유형별 recipe 또는 skill로 라우팅합니다.
5. 변경 후 Jira 완료 기준과 실제 diff가 맞는지 확인합니다.

Jira 작성만 요청받은 경우에는 코드 구현을 시작하지 않습니다.
