# Recipe: PR Prep

PR 생성 전 변경 범위와 검증 기록을 정리하는 절차입니다.

## Steps

1. 변경 파일 확인

```bash
git status --short
git diff --name-only
```

2. 커밋 계획 작성

`recipes/commit-plan.md` 기준으로 실제 diff를 기능/작업 단위로 분해합니다.
커밋 수를 임의로 1~2개로 제한하지 않습니다.

3. Jira key와 branch 확인

```bash
git branch --show-current
```

PR 본문의 Jira 링크는 아래 형식을 사용합니다.

```markdown
- Jira: [JIRAKEY](https://dongchimi.atlassian.net/browse/JIRAKEY)
```

4. 문서와 spec 확인

- Jira 완료 기준과 diff가 맞는지 확인합니다.
- 새 page/route/form/API/design-system 변경이면 spec이 있는지 확인합니다.
- workflow, template, skill 변경이면 `docs/index.md`와 `docs/agent/index.md` 링크를 확인합니다.

5. 검증 실행

문서-only 변경:

```bash
git diff --check
```

package script가 있는 코드 변경:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
```

6. PR 본문 작성

`docs/workflows/pr-checklist.md`의 PR Body 형식과 `docs/workflows/pull-request-writing.md`의 작성 기준을 사용합니다.

본문 작성 전에 아래 근거를 모읍니다.

- Jira key, Jira 링크, 제목, 완료 기준
- 기존 동작과 문제 원인
- 구현 선택지와 실제 선택한 접근
- 실행한 검증 명령
- browser route, screenshot, trace, network, CI, metric 등 관찰 가능한 증거
- 남은 리스크와 reviewer가 집중해서 봐야 할 지점

## Output

```markdown
## PR 준비 요약

- Jira: [JIRAKEY](https://dongchimi.atlassian.net/browse/JIRAKEY)
- Branch:
- 변경:
- Spec/Docs:
- 검증:
- 근거:
- 남은 리스크:
```
