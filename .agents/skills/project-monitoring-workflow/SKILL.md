---
name: project-monitoring-workflow
description: Jira, GitHub PR/check, Notion board 상태 변화 중 agent가 알려야 할 변경과 무시할 noise를 분류할 때 사용합니다.
---

# Project Monitoring Workflow

## 목적

프로젝트 상태 모니터링에서 알림 가치가 있는 변화와 noise를 구분합니다.

이 skill은 자동 모니터링 봇 구현이 아니라, 어떤 상태 변화를 수집하고 어떻게 보고할지 정하는 workflow입니다.

## 입력 점검

- 모니터링 대상: Jira project/board, GitHub repo/PR, Notion board, Vercel/GitHub checks
- 보고 목적: blocker 탐지, 작업 진행 요약, 리뷰 필요 알림, 배포 상태 확인
- 보고 주기 또는 trigger
- 제외할 noise

## 읽기 전략

1. Jira 이슈 상태와 branch/PR 상태를 먼저 연결합니다.
2. GitHub PR은 check status, review state, unresolved comments, target branch를 확인합니다.
3. Notion board는 assignment/status/week 같은 planning context로만 사용하고, code landed 증거로 쓰지 않습니다.
4. 배포나 CI는 실제 provider status와 PR check를 구분합니다.

## 메인 작업 흐름

### Step 1: 이벤트 분류

알릴 가치가 높은 이벤트:

- Jira가 진행 중인데 branch/PR이 오래 멈춤
- PR check 실패 또는 workflow permission blocker 발생
- 리뷰 요청, change request, unresolved critical comment 발생
- 배포 preview/production 상태가 실패 또는 target branch와 충돌
- Jira scope와 PR diff가 다른 app/package를 건드림

보통 noise로 처리할 이벤트:

- 단순 push without check failure
- Notion board 위치 변경만 있고 code/PR/Jira 변화가 없음
- 브라우저 visible status만 있고 실제 대상 URL이나 PR key가 불명확함

### Step 2: evidence 수준 표시

보고에는 근거 수준을 붙입니다.

```text
local: 터미널/파일/테스트로 확인
browser-visible: GitHub/Jira/Notion 화면에서 확인
connector: API/connector 응답으로 확인
memory: 이전 기록 기반, stale 가능
```

### Step 3: 보고 형식

```markdown
## Monitoring Update

- 기준 시각:
- 대상:
- 중요한 변화:
- Blocker:
- Action needed:
- Evidence:
```

### Step 4: 후속 액션

- 새 작업이 필요하면 Jira 이슈 작성 workflow로 넘깁니다.
- 하네스 규칙이 빠졌으면 `manage-skills`로 넘깁니다.
- PR 수정이 필요하면 실제 branch/checkout을 확인한 뒤 구현 workflow로 넘깁니다.

## 완료 기준

- 알림이 action과 연결됩니다.
- browser-only planning context를 local repo progress로 과장하지 않습니다.
- blocker는 정확한 error string, project, PR, workflow file을 포함합니다.

## 예외

- 자동 주기 실행, thread wakeup, 외부 알림 발송 구현은 별도 작업입니다.
- 개인 일정, 사적인 회의 내용, 민감한 계정 정보는 durable monitoring summary에 넣지 않습니다.
- Notion/Figma/Jira planning 상태는 code completion 증거가 아닙니다.
