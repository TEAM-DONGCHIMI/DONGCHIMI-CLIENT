# PR Checklist

PR을 만들기 전에 아래 항목을 확인합니다. PR 본문은 `.github/pull_request_template.md`와 `docs/workflows/pull-request-writing.md`를 기준으로 작성합니다.

## Scope

- [ ] 브랜치 이름이 `prefix/{scope}/{JIRAKEY}-work-summary` 형식임
- [ ] 커밋 메시지가 `prefix(scope): {JIRAKEY} work summary` 형식임
- [ ] Jira issue key가 branch, commit, PR 제목에 반영됨
- [ ] PR 본문 `Related Issues`의 Jira key가 `https://dongchimi.atlassian.net/browse/{JIRAKEY}` 링크로 연결됨
- [ ] scope가 하나의 Jira-sized behavior로 제한됨
- [ ] unrelated 변경이 섞이지 않음
- [ ] 커밋 전 `docs/conventions/git.md`의 Commit Splitting 기준으로 commit plan을 작성함
- [ ] UI, API, story/test, docs/spec, generator, CI/config 변경이 섞이면 별도 커밋으로 나눴거나 합친 이유가 있음

## Commit Plan

PR 전에는 실제 diff 기준으로 커밋 단위를 점검합니다. 큰 작업에서 커밋이 1~2개로만 끝나면 `recipes/commit-plan.md`를 다시 적용합니다.

권장 출력:

```markdown
## Commit Plan

- Commit 1: `prefix(scope): JIRAKEY summary`
  - files:
  - reason:
  - verification:
- Commit 2: `prefix(scope): JIRAKEY summary`
  - files:
  - reason:
  - verification:
```

## Docs And Specs

- [ ] 새 page/route/form/API/design-system 변경이면 spec 작성 또는 갱신
- [ ] workflow, template, skill 변경이면 `docs/index.md` 또는 `docs/agent/index.md` 링크 확인
- [ ] Jira 완료 기준과 구현 diff가 일치함

## PR Narrative

- [ ] Background에 기존 동작, 문제, 변경 필요성을 적음
- [ ] 도입 이유, 선택 이유, 대안 비교가 필요한 경우 기존 템플릿 섹션 안에 `###` 하위 제목으로 작성함
- [ ] 최종 PR 본문에서 placeholder bullet을 그대로 두지 않고 문단형으로 정리함
- [ ] Tasks에 단순 파일 목록이 아니라 구현 흐름과 의도를 적음
- [ ] 구조 변경이 있으면 왜 분리/통합했는지 설명함
- [ ] Verification에는 실제 실행한 명령만 적음
- [ ] Evidence에는 screenshot, route, trace, network, CI, metric처럼 관찰한 근거만 적음
- [ ] 남은 리스크와 reviewer가 봐야 할 지점을 숨기지 않음

## Verification

문서-only 변경:

```bash
git diff --check
```

프론트엔드 코드 변경 후 package script가 있을 때:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

## PR Body

```markdown
## Related Issues

Jira는 [JIRAKEY](https://dongchimi.atlassian.net/browse/JIRAKEY)입니다.

## Background

기존 동작, 문제 / 변경 필요성, 근거를 문단형으로 작성합니다.

### 하위 제목 예시

도입 이유나 선택 이유가 길면 기존 섹션 안에서 하위 제목으로 나누어 설명합니다.

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

실제 실행하지 않은 명령은 체크하지 않습니다.
