---
name: verify-design-system-icons
description: packages/design-system 아이콘 소스, 생성 산출물, public export, SVG 입력 정책을 검증할 때 사용합니다.
---

# 디자인시스템 아이콘 검증

## 목적

디자인시스템 아이콘 작업에서 반복된 누락을 막습니다.

- 원본 SVG naming rule이 `ic-name.svg`인지 확인합니다.
- 생성된 React component와 public export가 원본과 맞는지 확인합니다.
- SVG 입력 검증 정책이 유지되는지 확인합니다.
- 로컬 build/typecheck가 실제로 통과했는지 확인합니다.

## 입력 점검

먼저 변경 파일을 확인합니다.

```bash
git diff --name-only HEAD -- packages/design-system/src/icons packages/design-system/scripts packages/design-system/package.json docs/architecture/design-system-icons.md recipes/add-icon.md
git status --short -- packages/design-system/src/icons packages/design-system/scripts
```

아이콘 관련 파일이 없고 icon pipeline도 아직 없으면 `SKIP`으로 보고합니다.

## 읽기 전략

1. `docs/architecture/design-system-icons.md`를 먼저 읽습니다.
2. `recipes/add-icon.md`가 있으면 아이콘 추가 절차를 확인합니다.
3. `packages/design-system/package.json`에서 icon 관련 script와 `./icons` export를 확인합니다.
4. `packages/design-system/src/icons/index.ts`와 생성 파일을 비교합니다.
5. `packages/design-system/scripts/*icon*.mjs`가 있으면 naming, validation, generation 책임을 확인합니다.

## Workflow

### Step 1: 적용 대상 확인

```bash
test -d packages/design-system/src/icons || echo "SKIP: icons directory does not exist"
test -d packages/design-system/src/icons/svg || echo "SKIP: SVG source directory does not exist"
```

### Step 2: SVG source naming 확인

`packages/design-system/src/icons/svg`가 있으면 실행합니다.

```bash
find packages/design-system/src/icons/svg -name '*.svg' -print | awk '
  /\/ic-[a-z0-9]+(-[a-z0-9]+)*\.svg$/ { next }
  { print "invalid icon filename: " $0; bad=1 }
  END { exit bad }
'
```

PASS: 모든 SVG가 `ic-name.svg` 형식입니다.

### Step 3: 위험 SVG 입력 검사

```bash
rg -n "<script|<foreignObject|<iframe|<object|<embed|\\son[a-zA-Z]+\\s*=|javascript:|href=\"https?://|xlink:href=\"https?://" packages/design-system/src/icons/svg
```

PASS: 출력이 없습니다.

### Step 4: 생성/빌드 검증

아이콘 생성 script가 있으면 실제 생성 명령을 실행합니다.

```bash
pnpm --filter @dongchimi/design-system icons:generate
pnpm --filter @dongchimi/design-system build
```

아이콘 생성 script가 아직 없으면 `SKIP`으로 보고하고, design-system build만 실행합니다.

```bash
pnpm --filter @dongchimi/design-system build
```

### Step 5: export 확인

- `packages/design-system/package.json`에 `./icons` export가 있는지 확인합니다.
- 새 generated component가 `packages/design-system/src/icons/index.ts`에서 export되는지 확인합니다.
- 원본 SVG 삭제/이름 변경이 generated output과 index export에 반영됐는지 확인합니다.

## 완료 기준

- 아이콘 pipeline이 없는 baseline에서는 이유와 함께 `SKIP`입니다.
- 아이콘 pipeline이 있으면 naming, SVG safety, generation, build, export 확인이 완료됩니다.
- Figma 기반 아이콘이면 원본 asset 이름/크기/의미를 최종 보고에 남깁니다.

## 예외

- 아직 `src/icons/svg`와 generation script가 없는 develop baseline은 실패가 아니라 `SKIP`입니다.
- generated 파일은 generator가 관리하면 수동 편집 대상으로 보지 않습니다.
- 앱 전용 아이콘은 `packages/design-system` 검증 대상이 아닙니다.
