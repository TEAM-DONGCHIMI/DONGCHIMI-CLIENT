# Pull Request Writing

PR 본문은 변경 파일 목록이 아니라 reviewer가 변경 의도, 근거, 검증 상태, 남은 리스크를 빠르게 판단하게 하는 문서입니다.

## Principles

- 근거 기반으로 씁니다. Jira, spec, Figma, screenshot, route, network, trace, metric, CI처럼 확인한 자료를 적습니다.
- 구현 의도를 설명합니다. 무엇을 바꿨는지보다 왜 그 구조를 택했는지와 어떤 불일치를 줄였는지를 적습니다.
- 실제 검증과 계획된 검증을 분리합니다. 실행하지 않은 명령은 체크하거나 성공처럼 쓰지 않습니다.
- reviewer가 봐야 할 위험 지점을 숨기지 않습니다.
- docs-only, UI-only, API-only, refactor-only PR은 그 범위를 명확히 적고 없는 증거를 만들지 않습니다.
- GitHub 화면에서 보이는 approval, check, deployment, preview 상태는 로컬 명령 실행 결과와 분리해 씁니다.

## Recommended Structure

템플릿의 `##` 섹션 구조는 유지합니다. 상세한 도입 이유, 선택 이유, 대안 비교가 필요하면 새 `## Why ...`
섹션을 만들지 말고 기존 섹션 안에 `### Vercel 배포 적용`, `### React 선정 이유`, `### Vanilla Extract 도입 근거`
처럼 하위 제목을 둡니다.

최종 PR 본문은 placeholder를 채운 목록이 아니라 하나의 글처럼 읽혀야 합니다. `Background`, `Tasks`,
`Implementation Notes`, `Risk / Follow-up`처럼 의도와 판단이 중요한 섹션은 글머리 기호를 그대로 나열하지
말고 문단형으로 작성합니다. Checkbox나 짧은 관찰 목록은 실제 검증 결과를 빠르게 확인해야 할 때만 사용합니다.

```markdown
## Related Issues

Jira는 [JIRAKEY](https://dongchimi.atlassian.net/browse/JIRAKEY)입니다. 연결된 child issue가 있다면
parent / child 관계를 함께 설명합니다.

## Background

기존 동작, 문제 / 변경 필요성, 근거를 문단형으로 작성합니다.

### 하위 제목 예시

도입 이유나 선택 이유가 길면 기존 섹션 안에서 `###` 하위 제목으로 나누어 설명합니다.

## Tasks

구현 흐름과 의도를 문단형으로 작성합니다.

## Implementation Notes

선택한 접근, 대안 또는 제외한 접근, 구조 변경 의도를 문단형으로 작성합니다.

## Verification

실제 실행한 검증만 작성합니다.

## Evidence

관찰한 근거만 작성합니다.

## PR Point

Reviewer가 중점적으로 봐야 할 부분을 좁혀서 작성합니다.

## Screenshot

UI 변경이 없으면 없다고 명시하고, 있으면 screenshot 또는 preview URL을 첨부합니다.

## Risk / Follow-up

남은 리스크와 후속 작업을 문단형으로 작성합니다.
```

## Related Issues

Jira 이슈는 key만 적지 않고 동치미 Jira 링크로 연결합니다.

```markdown
- Jira: [DCMFE-1](https://dongchimi.atlassian.net/browse/DCMFE-1)
```

여러 Jira 이슈가 연결되면 parent와 child를 구분합니다.

```markdown
- Jira Parent: [DCMFE-1](https://dongchimi.atlassian.net/browse/DCMFE-1)
- Jira Child: [DCMCL-3](https://dongchimi.atlassian.net/browse/DCMCL-3)
```

Jira key를 아직 확정하지 못했다면 PR을 만들기 전에 Jira issue를 먼저 확인합니다. 임시 텍스트로 `JIRAKEY`를 남긴 채 PR을 열지 않습니다.

## Writing Tasks

`Tasks`는 단순 변경 파일 목록으로 끝내지 않습니다. 아래 흐름을 문단형으로 씁니다.

1. 기존 구조 또는 동작을 설명합니다.
2. 그 구조에서 발생한 문제나 한계를 적습니다.
3. 이번 PR에서 선택한 접근을 설명합니다.
4. 구조를 분리하거나 합친 경우 이유를 적습니다.
5. 결과적으로 줄어든 리스크나 개선된 흐름을 적습니다.

좋은 문장 흐름:

```text
기존에는 클라이언트에서 로그인 상태를 확인한 뒤 query가 실행되는 구조라 첫 진입 시 서버에서 목록 데이터를 준비하기 어려웠습니다.
이번 작업에서는 첫 페이지 데이터를 서버에서 prefetch 하고, 클라이언트는 hydration 된 query cache를 재사용하도록 변경했습니다.
서버와 클라이언트가 같은 query key와 pagination 규칙을 사용하도록 query 관련 코드를 options/server/shared 단위로 분리했습니다.
이로써 초기 화면은 서버에서 준비한 데이터를 기반으로 렌더링되고, 클라이언트에서는 추가 요청 없이 같은 cache를 이어받을 수 있습니다.
```

피해야 할 문장:

```text
- 탐색 SSR 적용
- query 파일 분리
- build 성공
```

## Writing Background And Why

`Background`는 구현 결과보다 먼저 의도와 판단 근거를 설명하는 섹션입니다. 작업이 배포, 기술 도입, 라우팅,
상태 관리, 테스트 전략처럼 선택의 이유가 중요한 경우에는 이 섹션에 충분한 why를 적습니다.

좋은 흐름은 현재 기준이 없어서 생기는 문제, 그 문제가 이후 작업에 미치는 영향, 이번 PR에서 선택한 접근,
선택 근거, 제외한 대안 순서입니다. 예를 들어 Vercel 배포 PR이라면 "배포 URL이 없어서 CORS origin과 QA
공유 기준이 불명확했다"는 문제를 먼저 쓰고, "Next.js와 Vite 모두 Vercel 공식 지원 대상이고 GitHub PR
preview를 제공하기 때문에 초기 배포 채널로 선택했다"는 근거를 이어서 적습니다.

긴 이유 설명은 `## Why Vercel?`처럼 템플릿 밖의 최상위 섹션으로 분리하지 않습니다. 기존 `Background`
또는 `Implementation Notes` 안에 `### Vercel 배포 적용` 같은 하위 제목으로 넣습니다.

최종 본문은 목록이 아니라 리뷰어가 한 번에 읽을 수 있는 설명문이어야 합니다. PR template의 글머리 기호는
작성 프롬프트일 뿐이며, 제출 전에는 실제 문장으로 정리합니다.

## Implementation Notes

구조 변경이 있으면 "왜"를 적습니다.

- server/client 런타임 경계를 나눈 이유
- shared/base/options/server 같은 모듈 분리 기준
- broad invalidation 대신 cache patch를 택한 이유
- 중복을 허용하거나 공통화를 미룬 이유
- spec, fixture, story를 함께 갱신한 이유

구조 설명은 코드 블록을 짧게 사용해도 됩니다. 긴 구현 전체를 붙이지 말고 reviewer가 판단해야 할 interface나 경계만 보여줍니다.

## Evidence

관찰한 증거만 적습니다.

UI / browser:

- 확인한 route
- 주요 상태: loading, empty, error, disabled, selected, focus, responsive
- screenshot 또는 Storybook URL

API / data:

- 확인한 endpoint
- query key 또는 cache update 범위
- server/client 요청 경계
- network request 변화

Performance:

- 측정 환경: build mode, URL, tool, run count, throttling
- raw measurement table
- average/median summary
- 해석: 어떤 metric이 왜 변했는지

Logs / CI:

- 실제 실행한 명령
- CI run 또는 action URL
- 실패가 있으면 원인과 남은 처리

PR status:

- draft / ready / merged 여부
- base branch, head branch, head commit
- approval, change request, unresolved review thread
- merge conflict 또는 mergeability blocker
- Vercel, Chromatic, Storybook preview 상태

CodeRabbit, Copilot, teammate review thread에서 이미 제기된 finding은 PR 본문이나 후속 리뷰 코멘트에서 중복하지 않습니다.
브라우저에서 보인 Storybook wrapper 배경, preview connection loss, Node engine warning은 component defect와 분리해서 적습니다.

## Performance Section

성능 수치를 넣을 때는 raw value와 해석을 같이 둡니다.

필수:

- 측정 조건
- 측정 도구
- branch 또는 commit 비교 대상
- run count
- raw table
- summary table
- 해석과 tradeoff

TTFB처럼 일부 metric이 악화된 경우도 숨기지 않습니다. 예를 들어 SSR prefetch 때문에 TTFB가 늘었지만 LCP Load Delay가 줄었다면 그 원인을 같이 적습니다.

## PR Point

Reviewer가 중점적으로 봐야 할 지점을 좁혀 줍니다.

예시:

- server/client import boundary가 올바른지
- query key가 server prefetch와 client hook에서 동일한지
- cache patch 범위가 불필요한 화면까지 건드리지 않는지
- AccessToken을 browser에서 읽는 전제가 현재 인증 정책과 맞는지
- docs-only 변경이라 실제 앱 동작을 바꾸지 않았는지

## Verification Rules

- 실행한 명령만 checkbox에 체크합니다.
- 실행하지 못한 명령은 unchecked로 두거나 "미실행: 이유"를 적습니다.
- screenshot, trace, network log가 없으면 있다고 쓰지 않습니다.
- local production 측정과 dev server 확인을 구분합니다.
- package script가 아직 없으면 `pnpm build`를 성공한 것처럼 쓰지 않습니다.

검증 섹션도 기본은 사실을 문장으로 씁니다. 다만 팀이 checkbox 기반 확인을 원하거나 검증 명령이 많아 빠른
스캔이 필요한 경우에는 checklist를 사용할 수 있습니다. 어떤 형식이든 실제 실행하지 않은 명령을 성공한 것처럼
쓰지 않는 것이 우선입니다.

## Risk / Follow-up

아래 항목은 PR 본문에 명시합니다.

- 현재 구현이 기대는 정책 또는 전제
- 이후 정책 변경 시 다시 봐야 할 코드
- 의도적으로 제외한 범위
- 임시 fixture, mock, TODO
- 관찰하지 못한 runtime 또는 browser 상태

## Docs-only PR

docs-only PR은 아래처럼 명확히 적습니다.

- Background: 어떤 workflow 또는 기준이 불명확했는지
- Tasks: 어떤 문서, template, skill, recipe를 갱신했는지
- Evidence: `git diff --check`, 링크 검증, stale reference 검색
- PR Point: `AGENTS.md` 라우팅, skill frontmatter, recipe/docs 링크, verify skill 커버리지 중 reviewer가 봐야 할 지점
- Screenshot: UI 변경 없음
- Risk: 실제 app/package 구조가 아직 없어서 실행 검증하지 못한 범위
