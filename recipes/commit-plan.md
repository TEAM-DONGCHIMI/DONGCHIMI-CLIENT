# Recipe: Commit Plan

커밋 요청을 받았거나 PR을 준비하기 전에 실제 diff를 기능/작업 단위로 분해하는 절차입니다.

## Goal

- 커밋 수를 임의로 1~2개로 줄이지 않습니다.
- 독립적으로 리뷰, revert, 검증 가능한 단위를 커밋 단위로 삼습니다.
- unrelated 변경, 설정 변경, 문서 변경, 테스트 변경이 기능 구현과 섞이지 않게 합니다.

## Steps

1. 변경 파일 확인

```bash
git status --short
git diff --name-only
git diff --stat
```

2. Jira key와 branch 확인

```bash
git branch --show-current
```

3. 변경을 분류합니다.

- scaffold 또는 generator 산출물
- spec, docs, template
- page 또는 route
- component 또는 design-system component
- hook, state, API helper, query/mutation
- story, fixture, unit test, browser verification helper
- refactor, rename, remove
- root config, dependency, CI, PR template, agent config

4. 별도 커밋 기준을 적용합니다.

아래 중 하나라도 다르면 별도 커밋을 우선 고려합니다.

- Jira child issue 또는 완료 기준이 다름
- 변경 surface가 다름
- reviewer가 확인할 관점이 다름
- revert 단위가 다름
- 검증 방식이 다름
- 순수 refactor와 기능 변경이 섞임
- config/CI/dependency 변경이 기능 변경과 섞임

5. commit plan을 작성합니다.

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

6. 커밋별로 stage합니다.

- 가능하면 `git add -- path/to/file`처럼 명시적 path를 사용합니다.
- 같은 파일의 일부 hunk만 다른 커밋에 들어가야 하면 patch staging을 사용합니다.
- `.env*`, local runtime data, unrelated 사용자 변경은 stage하지 않습니다.

7. 각 커밋 전 staged diff를 확인합니다.

```bash
git diff --cached --name-only
git diff --cached --check
```

8. 커밋합니다.

커밋 메시지는 `docs/conventions/git.md`의 형식을 따릅니다.

## Split Examples

문서와 agent harness:

```text
docs(docs): DCMFE-1 agent harness 문서 인덱스 추가
docs(skills): DCMFE-1 agent workflow skills 추가
docs(recipes): DCMFE-1 구현 recipe 추가
chore(root): DCMFE-1 agent config와 PR template 추가
```

페이지 기능:

```text
docs(apps/client): DCMCL-3 홈 화면 spec 추가
feat(apps/client): DCMCL-3 홈 화면 shell 구현
feat(apps/client): DCMCL-3 홈 화면 interaction 추가
test(apps/client): DCMCL-3 홈 화면 story와 검증 추가
```

API 연동:

```text
docs(apps/client): DCMCL-4 로그인 API spec 추가
feat(packages/shared): DCMCL-4 auth API helper 추가
feat(apps/client): DCMCL-4 로그인 mutation 연결
test(apps/client): DCMCL-4 로그인 에러 상태 검증 추가
```

## Avoid

- 변경 surface가 여러 개인데 한 커밋으로 뭉치기
- 단순히 "구현"과 "문서" 두 커밋으로만 나누기
- review/revert 의미가 없는 지나치게 작은 커밋 만들기
- unrelated 사용자 변경을 함께 stage하기
