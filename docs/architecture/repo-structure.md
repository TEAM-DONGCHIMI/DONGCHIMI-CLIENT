# Repo Structure

이 문서는 DONGCHIMI-CLIENT의 현재 저장소 구조와 앞으로 구조를 확정할 때의 원칙을 기록합니다.

## Current Shape

현재 저장소는 pnpm workspace와 Turborepo를 기준으로 app/package를 관리합니다.

```text
AGENTS.md
README.md
.agents/skills/
.github/
.serena/project.yml
apps/
  client/
  market-owner/
docs/
packages/
  design-system/
  eslint-config/
  shared/
  typescript-config/
recipes/
templates/
package.json
pnpm-workspace.yaml
turbo.json
```

## Workspace Areas

아래 영역은 Jira 템플릿과 현재 workspace 경계를 맞추기 위한 매핑입니다. 실제 app/package 책임은 디렉터리, package manifest, 관련 architecture 문서가 함께 생긴 뒤 확정합니다.

| Area                  | Jira key       | Notes                                          |
| --------------------- | -------------- | ---------------------------------------------- |
| root / repo workflow  | `DCMFE-*`      | 문서, CI, 설정, 전체 구조                      |
| client web            | `DCMCL-*`      | 동치미 클라이언트 웹                           |
| market owner web      | `DCMSM-*`      | 마트 사장님 사이트 웹                          |
| design system package | `DCMDS-*`      | 공용 디자인 시스템                             |
| design system web     | `DCMDS-*`      | 디자인시스템 문서/배포 웹, DCMDS에서 함께 관리 |
| admin web             | `DCMFE-*` 기본 | 제품 요구사항 확정 뒤 별도 key가 생기면 갱신   |
| mobile WebView        | `DCMFE-*` 기본 | WebView shell 필요 시 추가                     |

## Workspace Layout

```text
apps/
  client/
  market-owner/
  design-system-web/
  admin?
  mobile?

packages/
  design-system/
  shared/
  tailwind-config?
  eslint-config/
  typescript-config/
```

## Structure Rules

- 실제 app/package가 생기면 `docs/index.md`, `AGENTS.md`, `docs/conventions/git.md`, `docs/workflows/local-development.md`를 함께 갱신합니다.
- app-specific 코드는 owning app 안에 먼저 둡니다.
- 실제 재사용이 확인된 뒤 shared package나 design system으로 승격합니다.
- 문서만으로 `apps/*` 또는 `packages/*` 구조를 확정하지 않습니다.
- route, API, design-system, CI가 섞인 작업은 Jira issue와 PR을 분리합니다.

## Update Checklist

- [ ] 새 app/package 경로가 문서 인덱스에 추가됨
- [ ] Jira key 매핑이 실제 project key와 맞음
- [ ] local development script가 `docs/workflows/local-development.md`에 추가됨
- [ ] PR 검증 기준이 `docs/workflows/pr-checklist.md`에 추가됨
