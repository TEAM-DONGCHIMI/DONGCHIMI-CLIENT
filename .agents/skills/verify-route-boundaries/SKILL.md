---
name: verify-route-boundaries
description: app, domains, shared, packages 책임 경계와 import 방향을 검증할 때 사용합니다.
---

# Route Boundary 검증

## 목적

Next App Router, Vite app shell, domain screen, shared infrastructure, package boundary가 섞이는 것을 막습니다.

## 입력 점검

```bash
git diff --name-only HEAD -- apps docs/architecture/app-structure.md docs/architecture/market-owner-app.md turbo/generators
```

app 구조나 generator 변경이 없으면 `SKIP`할 수 있습니다.

## 읽기 전략

1. `docs/architecture/app-structure.md`를 먼저 읽습니다.
2. market-owner 변경이면 `docs/architecture/market-owner-app.md`를 같이 읽습니다.
3. generator 변경이면 `docs/workflows/turbo-generators.md`와 template output 경로를 확인합니다.
4. 실제 route entry와 domain page 위치를 비교합니다.

## Workflow

### Step 1: 구조 diff 확인

```bash
git diff --name-only HEAD -- apps turbo/generators docs/architecture
```

### Step 2: 금지 import 방향 검사

다음 방향은 원칙적으로 금지합니다.

```text
domains -> app
shared -> domains
packages/* -> apps/*
packages/design-system -> domains
```

보조 명령:

```bash
rg -n "from ['\\\"].*(/app|src/app)" apps/*/src/domains || true
rg -n "from ['\\\"].*(/domains|src/domains)" apps/*/src/shared || true
rg -n "from ['\\\"].*(apps/|src/app|src/domains|src/shared)" packages || true
```

출력이 있으면 실제 alias/상대경로를 확인하고, 금지 방향이면 수정합니다.

### Step 3: route entry와 domain screen 책임 확인

- Next `src/app`에는 route segment, layout, loading, error, not-found, metadata, route handler, provider 조립만 둡니다.
- 화면 조립과 domain API/query/model은 `src/domains` 또는 app-local 확정 구조에 둡니다.
- market-owner는 route/domain 구조가 생긴 경우 `src/app` route composition과 `src/domains/{domain}/{page}` 책임을 분리합니다.

### Step 4: route constant와 fallback 확인

- route path는 app 내부 shared constant 후보로 둡니다.
- fallback route는 app shell에서 연결하고, page 구현은 domain fallback screen으로 분리합니다.

### Step 5: 검증

변경 app에 맞는 targeted 검증을 실행합니다.

```bash
pnpm --filter client typecheck
pnpm --filter market-owner typecheck
pnpm build
```

실행하지 않은 app 검증은 이유를 남깁니다.

## 완료 기준

- route entry와 domain screen 책임이 문서 기준과 맞습니다.
- 금지 import 방향이 없거나 예외 사유가 명시됩니다.
- generator template을 바꿨다면 sample generation/cleanup 계획이 있습니다.

## 예외

- 초기 scaffold처럼 domain 구조가 아직 없는 app은 app-local 구조를 허용합니다.
- type-only import도 package boundary를 깨면 검토 대상입니다.
- 단순 문서 변경이면 명령 실행 대신 문서 검증으로 충분할 수 있습니다.
