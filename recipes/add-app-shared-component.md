# 절차: 앱 shared 컴포넌트 추가

앱 내부에서 여러 페이지가 재사용하는 컴포넌트를 `apps/{app}/src/shared/components`에 추가할 때 사용합니다.

## 흐름

1. 컴포넌트 위치를 결정합니다.
   - page-only: `apps/{app}/src/pages/{domain}/{page}/components`
   - app shared: `apps/{app}/src/shared/components/{ui|layout}`
   - cross-app primitive: `packages/design-system`
2. 대상 앱을 선택합니다.
   - `client`
   - `design-system-web`
   - `admin`, 앱이 생성된 뒤
3. 카테고리를 선택합니다.
   - `ui`: 앱 내부 UI 컴포넌트
   - `layout`: 앱 내부 layout 컴포넌트
4. generator가 있으면 scaffold를 생성합니다.
5. 생성된 `ComponentName.spec.md`를 구현 전에 채웁니다.
6. 스펙에 맞춰 가장 작은 public API를 구현합니다.
7. 앱 내부 export와 public prop type을 확인합니다.
8. 상태, 접근성, 긴 텍스트, 반응형 제약을 확인합니다.
9. 검증을 실행합니다.

## Generator 사용법

루트 script 후보:

```json
"gen:app-component": "turbo gen app-component"
```

인자 기반 실행:

```bash
pnpm gen:app-component -- --args client UserProfileCard ui user-profile-card
```

인자 순서:

1. `app`: `client`, `design-system-web`, `admin`
2. `componentName`: PascalCase component name
3. `category`: `ui` or `layout`
4. `componentFolder`: kebab-case folder name

## 생성 구조

```text
apps/{app}/src/shared/components/{category}/{component-folder}/
  ComponentName.tsx
  ComponentName.spec.md
  index.ts
```

## 완료 체크리스트

- [ ] route-local, app shared, design-system 경계를 확인했습니다.
- [ ] generator로 scaffold를 생성했거나, generator 미구현 사유를 남겼습니다.
- [ ] spec을 구현 전에 작성했습니다.
- [ ] public API가 `ComponentName`, `ComponentNameProps`로 제한됩니다.
- [ ] 접근성, 상태, overflow, 반응형 제약을 확인했습니다.
