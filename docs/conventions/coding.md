# Coding Convention

## File And Folder

| Target         | Convention   | Example                                        |
| -------------- | ------------ | ---------------------------------------------- |
| Folder         | `kebab-case` | `user-profile/`                                |
| Component file | `PascalCase` | `UserCard.tsx`                                 |
| Hook/API/Utils | `kebab-case` | `use-auth.ts`, `auth-api.ts`, `format-date.ts` |
| TanStack Query | `kebab-case` | `use-user-query.ts`, `use-user-mutation.ts`    |

## Component

- 컴포넌트는 arrow function으로 선언합니다.
- 일반 컴포넌트는 named export를 사용합니다.
- 자식 요소가 없으면 self-closing 형태를 사용합니다.
- 의미 없는 wrapper `div`는 피하고 필요한 경우 Fragment 또는 semantic tag를 사용합니다.

```tsx
export const UserCard = () => {
  return <article />;
};
```

## Variable And Function

- `var`는 사용하지 않습니다.
- 재할당이 필요 없으면 `const`를 사용합니다.
- Boolean 값은 `is` prefix 사용을 권장합니다.
- 문자열 조합은 template literal을 사용합니다.
- 이벤트 핸들러는 동작의 형태를 잘 나타낼 수 있는 이름을 사용합니다.
- 유틸 함수와 커스텀 훅은 arrow function으로 작성합니다.

## Type

- 타입 이름은 `PascalCase`를 사용합니다.
- Props 타입은 `Props` suffix를 사용합니다.
- 일반 `type` 이름은 `Types` suffix를 사용합니다.
- API 응답처럼 확장 가능한 객체 계약은 `interface` 사용을 우선 검토합니다.

## Accessibility

- 버튼 역할은 `button` 요소를 사용합니다.
- 텍스트가 없는 버튼에는 `aria-label`을 제공합니다.
- 입력 요소는 `label`과 연결합니다.
- heading level은 논리적인 순서를 유지합니다.
- `outline: none`으로 focus indicator를 제거하지 않습니다.
- 마우스 없이 키보드로 주요 기능을 사용할 수 있어야 합니다.
