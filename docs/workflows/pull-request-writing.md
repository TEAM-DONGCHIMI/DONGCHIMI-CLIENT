# Pull Request Writing

PR 본문은 변경 파일 목록이 아니라 reviewer가 변경 의도, 근거, 검증 상태, 남은 리스크를 빠르게 판단하게 하는 문서입니다.

## Principles

- 근거 기반으로 씁니다. Jira, spec, Figma, screenshot, route, network, trace, metric, CI처럼 확인한 자료를 적습니다.
- 구현 의도를 설명합니다. 무엇을 바꿨는지보다 왜 그 구조를 택했는지와 어떤 불일치를 줄였는지를 적습니다.
- 실제 검증과 계획된 검증을 분리합니다. 실행하지 않은 명령은 체크하거나 성공처럼 쓰지 않습니다.
- reviewer가 봐야 할 위험 지점을 숨기지 않습니다.
- docs-only, UI-only, API-only, refactor-only PR은 그 범위를 명확히 적고 없는 증거를 만들지 않습니다.

## Recommended Structure

```markdown
## Related Issues

- Jira: [JIRAKEY](https://dongchimi.atlassian.net/browse/JIRAKEY)
- GitHub issue:

## Background

- 기존 동작:
- 문제 / 변경 필요성:
- 근거:

## Tasks

- 구현 흐름과 의도를 문단 또는 bullet로 설명

## Implementation Notes

- 선택한 접근:
- 대안 또는 제외한 접근:
- 구조 변경 의도:

## Verification

- [ ] 실제 실행한 명령

## Evidence

- UI / browser:
- API / data:
- Performance:
- Logs / CI:

## PR Point

- Reviewer가 중점적으로 봐야 할 부분:

## Screenshot

- UI 변경 없음 / TODO

## Risk / Follow-up

- 남은 리스크:
- 후속 작업:
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

`Tasks`는 단순 변경 파일 목록으로 끝내지 않습니다. 아래 흐름으로 씁니다.

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
- package script가 아직 없으면 `npm run build`를 성공한 것처럼 쓰지 않습니다.

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
- Screenshot: UI 변경 없음
- Risk: 실제 app/package 구조가 아직 없어서 실행 검증하지 못한 범위
