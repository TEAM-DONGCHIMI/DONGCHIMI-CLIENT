# Recipe: Repo Orientation

새 작업을 시작할 때 저장소의 현재 상태를 빠르게 확인하는 절차입니다.

## Steps

1. 루트 문서 확인

```bash
sed -n '1,220p' AGENTS.md
sed -n '1,220p' README.md
sed -n '1,220p' docs/index.md
```

2. 파일 구조 확인

```bash
rg --files
find . -maxdepth 3 -type d | sort
```

3. package manager 확인

```bash
rg --files -g 'package.json' -g 'package-lock.json' -g 'pnpm-lock.yaml' -g 'yarn.lock'
```

4. 작업 유형별 source of truth 확인

- Jira/Figma 기반: `docs/workflows/jira-issue-authoring.md`, `.agents/skills/jira-design-implementation-workflow/SKILL.md`
- spec 필요 여부: `docs/workflows/spec-writing.md`
- 검증: `docs/workflows/local-development.md`, `.agents/skills/frontend-quality-verification/SKILL.md`

## Output

```markdown
## Repo Orientation

- 현재 branch:
- package manager:
- app/package 구조:
- 관련 docs:
- 필요한 Jira/spec:
- 검증 후보:
```
