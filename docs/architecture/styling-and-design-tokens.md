# Styling And Design Tokens

동치미 styling system은 실제 앱과 디자인시스템 package가 생긴 뒤 확정합니다.

## Candidate Direction

- Tailwind를 사용한다면 `packages/tailwind-config`에서 entry CSS와 token을 관리합니다.
- Tailwind를 사용하지 않는다면 이 문서는 실제 styling system 기준으로 갱신합니다.
- font asset과 color token은 외부 CDN보다 repo-local 또는 package-local 관리 여부를 먼저 결정합니다.

## Package Structure Candidate

```text
packages/tailwind-config/src/
  assets/fonts/
  entry/
  tokens/base.css
  tokens/colors/
  tokens/typography/
```

## Token Rules

- 사용 가능한 token이나 CSS variable이 있으면 hard-coded value보다 우선합니다.
- 외부 CDN font는 기본으로 추가하지 않습니다.
- styling dependency를 추가하기 전에 app 전용인지 package 공통인지 구분합니다.
- 디자인시스템 컴포넌트의 책임 경계는 [Design System](./design-system.md)을 따릅니다.
