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

## Page Publishing Evidence

- [ ] page/route 변경이면 Figma frame 또는 Screen ID, browser route, target viewport를 PR에 적음
- [ ] 사용한 design-system `ui`, `layout`, icon component를 적음
- [ ] 새 app-shared 또는 page-local component를 만들었다면 위치를 택한 이유를 적음
- [ ] design-system으로 승격하지 않은 UI가 있다면 제품 copy, route, API, 권한, 재사용 근거 부족 중 이유를 적음
- [ ] Figma와 다른 구현이 있으면 mismatch와 의도 또는 제약을 적음
- [ ] mobile/desktop layout, overflow, sticky/fixed 영역, focus-visible, active/current state 중 해당되는 증거를 남김

## Frontend Quality

- [ ] FE 구현 변경이면 `docs/code-quality/frontend-fundamentals.md` 기준 self-check를 수행함
- [ ] 비자명한 변경, shared/public API 변경, PR 전 품질 점검이면 `frontend-fundamentals-review` 적용 여부를 판단함
- [ ] 단순 copy, import 정리, formatting-only 변경이면 self-check 또는 review 생략 사유가 명확함

## PR Narrative

- [ ] Background에 기존 동작, 문제, 변경 필요성을 적음
- [ ] Tasks에 단순 파일 목록이 아니라 구현 흐름과 의도를 적음
- [ ] 구조 변경이 있으면 왜 분리/통합했는지 설명함
- [ ] Verification에는 실제 실행한 명령만 적음
- [ ] Evidence에는 screenshot, route, trace, network, CI, metric처럼 관찰한 근거만 적음
- [ ] 브라우저에서만 본 check, preview, review state는 로컬 검증 결과와 분리함
- [ ] 남은 리스크와 reviewer가 봐야 할 지점을 숨기지 않음

## PR State

PR을 열거나 리뷰할 때는 구현 diff와 별도로 현재 상태를 분류합니다.

- [ ] draft / ready / merged 여부를 확인함
- [ ] base branch, head branch, head commit이 의도한 Jira와 맞음
- [ ] merge conflict 또는 mergeability blocker가 있는지 확인함
- [ ] approval, change request, unresolved reviewer thread를 확인함
- [ ] CodeRabbit/Copilot/teammate comment 중 이미 커버된 finding을 새 코멘트로 반복하지 않음
- [ ] GitHub Actions, Vercel, Chromatic, Storybook preview 상태를 각각 구분함
- [ ] 로컬 checkout을 봤다면 현재 branch가 PR head와 같은지 확인함

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
pnpm test
pnpm build
```

성능 예산이나 production serve command를 변경한 경우:

```bash
pnpm perf
```

E2E 설정 또는 앱 bootstrap smoke 변경:

```bash
pnpm e2e:smoke
```

## PR Body

```markdown
## Related Issues

- Jira: [JIRAKEY](https://dongchimi.atlassian.net/browse/JIRAKEY)

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

- [ ] `git diff --check`

## Evidence

관찰한 근거만 작성합니다.

- UI / browser:
- API / data:
- Performance:
- Logs / CI:

## PR Point

Reviewer가 중점적으로 봐야 할 부분을 좁혀서 작성합니다.

## Screenshot

UI 변경이 없으면 없다고 명시하고, 있으면 screenshot 또는 preview URL을 첨부합니다.

## Risk / Follow-up

남은 리스크와 후속 작업을 문단형으로 작성합니다.
```

실제 실행하지 않은 명령은 체크하지 않습니다.
