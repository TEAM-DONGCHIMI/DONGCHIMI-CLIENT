---
name: verify-agent-docs
description: agent harness, docs, recipes, templates, PR template 변경 후 markdown 링크, skill 인덱스, 오래된 참조를 검증할 때 사용합니다.
---

# Agent Docs Verification

## Purpose

agent harness와 문서 구조 변경 후 기본적인 문서 품질을 검증합니다.

## Related Files

| File or Pattern                    | Purpose                                           |
| ---------------------------------- | ------------------------------------------------- |
| `AGENTS.md`                        | agent entrypoint                                  |
| `apps/**/AGENTS.md`                | app-local agent instruction                       |
| `packages/**/AGENTS.md`            | package-local agent instruction                   |
| `README.md`                        | repo entrypoint                                   |
| `docs/**/*.md`                     | architecture, workflow, convention, decision docs |
| `recipes/**/*.md`                  | 반복 작업 절차                                    |
| `templates/**/*.md`                | spec와 Jira 템플릿                                |
| `.agents/skills/**/SKILL.md`       | repo-local Codex skills                           |
| `.agents/skills/**/agents/openai.yaml` | skill UI 호출 메타데이터                       |
| `.github/pull_request_template.md` | PR template                                       |

## Workflow

### Step 1: diff whitespace 검사

```bash
git diff --check
```

PASS: 출력이 없습니다.

### Step 2: repo-local skill 목록 확인

```bash
find . -path '*/AGENTS.md' -not -path './node_modules/*' -print | sort
find .agents/skills -maxdepth 3 -name SKILL.md -print | sort
find .agents/skills -path '*/agents/openai.yaml' -print | sort
```

PASS: 하위 `AGENTS.md`가 의도한 workspace에만 있고, 새 skill이 `.agents/skills/<name>/SKILL.md`에 있으며, 의도하지 않은 중첩 skill 경로가 없습니다. `agents/openai.yaml`은 해당 skill 디렉터리 아래에만 있습니다.

### Step 3: markdown 링크 검사

````bash
node -e 'const fs=require("fs");const path=require("path");const root=process.cwd();const files=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if([".git","node_modules","dist","build"].includes(e.name)) continue;const p=path.join(d,e.name);if(e.isDirectory()) walk(p);else if(e.name.endsWith(".md")) files.push(p)}}function stripCode(s){return s.replace(/```[\s\S]*?```/g,"").replace(/`[^`\n]*`/g,"")}walk(root);let bad=[];for(const f of files){const s=stripCode(fs.readFileSync(f,"utf8"));const re=/\[[^\]]+\]\(([^)]+)\)/g;let m;while((m=re.exec(s))){const raw=m[1].trim();if(!raw||raw.startsWith("http")||raw.startsWith("#")||raw.startsWith("mailto:")) continue;const target=raw.replace(/^<|>$/g,"").split("#")[0];if(!target) continue;const abs=path.resolve(path.dirname(f),target);if(!fs.existsSync(abs)){bad.push(path.relative(root,f)+" -> "+raw)}}}if(bad.length){console.log(bad.join("\n"));process.exit(1)}console.log("checked "+files.length+" markdown files")'
````

PASS: broken relative link가 없습니다.

### Step 4: skill registry 검사

```bash
node -e 'const fs=require("fs");const path=require("path");const root=process.cwd();const skills=fs.readdirSync(".agents/skills",{withFileTypes:true}).filter((e)=>e.isDirectory()).map((e)=>e.name).sort();const docs=["docs/index.md","docs/agent/index.md","docs/agent/indexing.md"];let bad=[];for(const skill of skills){const skillPath=`.agents/skills/${skill}/SKILL.md`;if(!fs.existsSync(skillPath)) bad.push(`${skill}: missing SKILL.md`);const source=fs.existsSync(skillPath)?fs.readFileSync(skillPath,"utf8"):"";if(!/^---[\s\S]*?^name:\s*/m.test(source)||!/^---[\s\S]*?^description:\s*/m.test(source)) bad.push(`${skill}: missing frontmatter name/description`);for(const doc of docs){if(fs.existsSync(doc)&&!fs.readFileSync(doc,"utf8").includes(`.agents/skills/${skill}/SKILL.md`)&&!fs.readFileSync(doc,"utf8").includes(`${skill}/SKILL.md`)) bad.push(`${doc}: missing ${skill}`)}}if(bad.length){console.log(bad.join("\n"));process.exit(1)}console.log(`checked ${skills.length} skills`)'
```

PASS: 모든 skill에 frontmatter가 있고 `docs/index.md`, `docs/agent/index.md`, `docs/agent/indexing.md`에서 누락되지 않습니다.

### Step 5: workspace inventory 검사

```bash
find apps packages -maxdepth 2 -name AGENTS.md -print | sort
find apps -maxdepth 1 -mindepth 1 -type d -print | sort
find packages -maxdepth 1 -mindepth 1 -type d -print | sort
```

PASS: `AGENTS.md`, `docs/agent/index.md`, `docs/agent/indexing.md`의 현재 app/package 목록과 실제 workspace가 충돌하지 않습니다. 예정 app/package는 예정이라고 표시되어 있어야 합니다.

### Step 6: 오래된 참조 검사

```bash
rg -n "docs/code-quality\\.md|Test Checklist|What is this PR\\?|Spec / Docs|22\\.19\\.0|Node 22|DCMDSW|package script가 생긴 뒤|app/package 구조가 생긴 뒤" AGENTS.md README.md docs recipes templates apps packages .agents .github --glob '!**/verify-agent-docs/SKILL.md' --glob '!**/node_modules/**' --glob '!**/dist/**' --glob '!**/storybook-static/**' --glob '!**/.next/**'
```

PASS: 의도적으로 남긴 compatibility 문서 외 stale reference가 없습니다.

### Step 7: format 검사

```bash
pnpm format:check
```

PASS: markdown, yaml, json formatting이 Prettier 기준과 맞습니다.

### Step 8: agent index 갱신 확인

새 skill, workflow, recipe, template을 추가했다면 아래 문서에 필요한 링크가 있는지 확인합니다.

- `docs/index.md`
- `docs/agent/index.md`
- `docs/agent/indexing.md`
- `AGENTS.md`

## Output Format

```markdown
## Agent Docs Verification

| Check              | Status | Notes           |
| ------------------ | ------ | --------------- |
| `git diff --check` | PASS   | -               |
| skill list         | PASS   | -               |
| markdown links     | PASS   | checked N files |
| skill registry     | PASS   | checked N skills |
| stale refs         | PASS   | -               |
| `pnpm format:check` | PASS  | -               |
```

## Exceptions

- `docs/code-quality.md` 자체는 compatibility entrypoint로 허용합니다.
- URL 링크는 live network 검증 대상이 아닙니다.
- code fence와 inline code 안의 예시 경로는 markdown link 검사 대상에서 제외합니다.
