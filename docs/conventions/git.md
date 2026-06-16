# Git Convention

## Branch

```text
prefix/{scope}/{JIRAKEY}-work-summary
```

Examples:

```text
docs/root/DCMFE-1-agent-harness
feat/apps-client/DCMCL-2-client-home
feat/packages-design-system/DCMDS-3-button-component
chore/root/DCMFE-4-repo-setup
```

설정, 문서, CI, 패키지 변경은 `chore` 또는 `docs`를 우선 사용합니다.
`scope`는 변경된 workspace 또는 repo surface를 적습니다. 경로형 scope는 branch path와 충돌하지 않도록 `/` 대신 `-`로 연결합니다.

## Jira Key

앱별 Jira project key를 먼저 확인한 뒤 branch, commit, PR 제목에 같은 key를 사용합니다.

| 변경 범위 | Jira project key |
| --- | --- |
| root, docs, CI, repo workflow | `DCMFE-*` |
| `apps/client` 동치미 클라이언트 웹 | `DCMCL-*` |
| `apps/design-system-web` 디자인시스템 배포 웹 | `DCMDSW-*` |
| `packages/design-system` 디자인 시스템 | `DCMDS-*` |

여러 앱, `packages/*`, 루트 설정, 문서, generator, CI처럼 제품 루트 변경은 `DCMFE-*`를 우선 사용합니다.
새 이슈를 만들어야 하면 변경을 주도하는 제품 또는 팀의 Jira project에 생성합니다.

## Commit

```text
prefix(scope): {JIRAKEY} work summary

body
```

Examples:

```text
docs(docs): DCMFE-1 agent harness 문서 구조 추가
chore(root): DCMFE-2 기본 패키지 설정 추가
feat(apps/client): DCMCL-3 홈 화면 구현
feat(packages/design-system): DCMDS-4 Button 컴포넌트 구현
```

## Commit Splitting

커밋은 "최대 1~2개"가 아니라 독립적으로 리뷰, revert, 검증 가능한 작업 단위로 나눕니다.
커밋 전에는 `recipes/commit-plan.md` 또는 `.agents/skills/commit-planning-workflow/SKILL.md` 기준으로 실제 diff를 먼저 분류합니다.

아래 기준 중 하나라도 다르면 별도 커밋을 우선 고려합니다.

- Jira child issue 또는 완료 기준이 다름
- 변경 surface가 다름: page, component, hook, API, story/test, docs/spec, generator, config/CI/dependency
- review owner 또는 리뷰 관점이 다름
- 되돌렸을 때 남겨도 되는 변경과 같이 되돌려야 하는 변경이 다름
- 검증 명령 또는 브라우저 확인 범위가 다름
- 순수 refactor/rename/remove와 기능 동작 변경이 섞임

권장 분해 예시:

```text
docs(docs): DCMFE-1 agent harness 문서 인덱스 추가
docs(skills): DCMFE-1 agent workflow skills 추가
docs(recipes): DCMFE-1 구현 recipe 추가
chore(root): DCMFE-1 agent config와 PR template 추가
```

프론트엔드 구현 예시:

```text
docs(apps/client): DCMCL-3 홈 화면 spec 추가
feat(apps/client): DCMCL-3 홈 화면 shell 구현
feat(apps/client): DCMCL-3 홈 화면 interaction 추가
test(apps/client): DCMCL-3 홈 화면 story와 검증 추가
```

같은 파일을 여러 커밋에 나눠야 하면 기능별로 patch staging을 사용할 수 있습니다. 단, unrelated 변경을 숨기기 위해 지나치게 미세한 커밋을 만들지 않습니다.

## Scope

| Scope | Use when |
| --- | --- |
| `root` | 루트 설정, package manager, repo-wide config 변경 |
| `apps/client` | 동치미 클라이언트 앱 변경 |
| `apps/design-system-web` | 디자인시스템 배포 웹 변경 |
| `apps/admin` | 동치미 관리자 앱 변경, 앱이 생성된 뒤 사용 |
| `apps/mobile` | React Native WebView 앱 변경, 앱이 생성된 뒤 사용 |
| `packages/design-system` | 디자인시스템 패키지 변경 |
| `packages/shared` | 공통 유틸, 타입, 상수, API 보조 코드 변경 |
| `packages/tailwind-config` | Tailwind entry, token, font asset 변경 |
| `packages/eslint-config` | 공통 ESLint config 변경 |
| `packages/typescript-config` | 공통 TypeScript config 변경 |
| `docs` | `docs/*` 문서 변경 |
| `recipes` | `recipes/*` 작업 절차 변경 |
| `templates` | `templates/*` spec template 변경 |
| `github` | `.github/*` template, workflow, labeler 변경 |

여러 surface가 함께 바뀌는 경우 가장 중요한 변경 범위를 scope로 잡고, 나머지는 body에 적습니다. unrelated 변경이면 커밋을 나눕니다.

## Prefix

| Prefix | Description |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `refactor` | 코드 리팩토링 |
| `fix` | 버그 수정 |
| `test` | 테스트, story, fixture, 검증 코드 추가 및 변경 |
| `style` | 코드 동작 변경이 없는 formatting 변경 |
| `name` | 파일 또는 폴더명 수정 |
| `file` | 파일 또는 폴더 이동 |
| `remove` | 파일 삭제만 수행 |
| `comment` | 필요한 주석 추가 및 변경 |
| `docs` | 문서 수정 |
| `chore` | 패키지 매니저, 설정, 기타 작업 |

## PR

- PR 제목은 `PREFIX(scope): {JIRAKEY} work summary` 형식을 사용하되, 실제 제목에서는 prefix를 대괄호로 감쌉니다.
- `PREFIX`는 대문자로 적습니다.
- `scope`는 commit scope와 같은 값을 사용합니다.
- PR 본문은 `.github/pull_request_template.md`와 `docs/workflows/pull-request-writing.md`를 기준으로 작성합니다.
- 실제 실행한 검증만 `Verification`에 적습니다.

Example:

```text
[DOCS](docs): DCMFE-1 agent harness 문서 구조 추가
[FEAT](apps/client): DCMCL-3 홈 화면 구현
[FEAT](packages/design-system): DCMDS-4 Button 컴포넌트 구현
```
