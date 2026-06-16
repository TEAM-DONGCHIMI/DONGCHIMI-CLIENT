# Jira Issue Template

이 문서는 DONGCHIMI-CLIENT 작업을 Jira 이슈로 쪼갤 때 사용하는 기본 템플릿입니다.
Parent Task는 여러 child issue를 묶는 계획/분해 단위로 사용하고, Child / 단독 Task는 실제 구현 가능한 단일 작업 단위로 사용합니다.

상세 기준은 `docs/workflows/jira-issue-authoring.md`를 따릅니다.

## 제목

```text
[FE][{module}] {Screen ID 또는 feature} 구현
```

예시:

```text
[FE][홈] DCM-HOME-001 홈 화면 구현
[FE][예약] DCM-RESERVE-001 예약 요청 화면 구현
[FE][API][예약] 예약 요청 mutation 연동
```

## Labels

기본 labels:

```text
FE, FEAT
```

추가 labels:

```text
API
DS
DOCS, WORKFLOW
```

- API 연동 작업이면 `API`를 추가합니다.
- 디자인시스템 작업이면 `DS`를 추가합니다.
- 문서 또는 작업 흐름 정리라면 `DOCS, WORKFLOW`를 추가합니다.

## Jira Key 기준

앱별 Jira project key를 먼저 확인한 뒤 branch, commit, PR 제목에 같은 key를 사용합니다.

| 변경 범위 | Jira project key |
| --- | --- |
| root 및 디자인 시스템 제외한 packages | `DCMFE-*` |
| `apps/client` 동치미 클라이언트 웹 | `DCMCL-*` |
| `apps/design-system-web` 디자인시스템 배포 웹 사이트 | `DCMDSW-*` |
| `packages/design-system` 디자인 시스템 | `DCMDS-*` |

여러 앱, `packages/*`, 루트 설정, 문서, generator, CI처럼 제품 루트 변경은 `DCMFE-*`를 우선 사용합니다.
새 이슈를 만들어야 하면 변경을 주도하는 제품 또는 팀의 Jira project에 생성합니다.

## Parent Task

```markdown
## 개요

- 목적:
- 채널 / 앱:
- 모듈:
- Parent type: Epic / Parent Task

## 근거

- FRS:
- SRS:
- 결정:
- Figma:
- Screen ID:
- 관련 문서:

## 공통 전제

- 구현 위치:
- 사용 컴포넌트 / 디자인시스템:
- 데이터 / fixture:
- API 선행 조건:

## 생성할 하위 작업

- [ ] `{JIRAKEY}` `{Screen ID}` `{산출물}`
- [ ] `{JIRAKEY}` `{Screen ID}` `{산출물}`
- [ ] `{JIRAKEY}` API 연동 또는 후속 작업

## 권장 진행 순서

1. UI shell / fixture
2. 주요 interaction
3. API integration
4. polish / verification

## 제외 범위

- TODO

## 완료 기준

- [ ] 모든 child issue 완료
- [ ] 관련 spec/docs 갱신
- [ ] 주요 route와 상태 검증
- [ ] PR 또는 release note에서 남은 리스크 기록

## TBD / 확인 필요

- TODO
```

## Child / 단독 Task

단독 Task면 `상위 참조`의 `Parent`만 비워두거나 제거합니다.

```markdown
## 목표

- TODO

## 상위 참조

- Parent:
- FRS / 결정:
- Figma:
- Screen ID:
- Route:

## 범위

- TODO

## 제외 범위

- TODO

## 상태 / 동작

- loading:
- empty:
- error:
- disabled:
- selected / active:
- keyboard / focus:

## 구현 위치

- app / package:
- page / component / hook:
- spec:

## 완료 기준

- [ ] UI 또는 동작이 Screen ID와 맞음
- [ ] 필요한 spec/docs 갱신
- [ ] fixture 또는 API 상태가 검증 가능함
- [ ] 접근성과 반응형 제약 확인
- [ ] unrelated 변경 없음

## 검증

- [ ] `npm run format:check`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] browser route:

## 확인 필요

- TODO
```

폼 이슈는 입력 검증, submit, mutation, disabled/loading/success/error 상태를 추가합니다.
API 이슈는 endpoint, request/response shape, query key, mutation side effect, invalidation, error mapping을 추가합니다.
