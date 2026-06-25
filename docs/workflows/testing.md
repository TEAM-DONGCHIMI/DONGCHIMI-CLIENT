# Testing

DONGCHIMI-CLIENT는 Vitest, React Testing Library, jest-dom, user-event, MSW를 사용해 Unit Test와 통합 테스트를 실행합니다. 브라우저 전체 흐름을 검증하는 E2E Test는 이 문서의 범위가 아니며 Playwright 작업에서 별도로 관리합니다.

## Test Types

### Unit Test

함수, 상태 로직, hook, component처럼 하나의 책임을 가능한 한 독립적으로 검증합니다.

```text
*.test.ts
*.test.tsx
```

외부 API나 다른 시스템과의 연결보다 입력에 따른 결과와 사용자에게 보이는 동작을 검증합니다.

### Integration Test

HTTP client, API mock, Provider, component 등 둘 이상의 경계가 연결됐을 때의 동작을 검증합니다.

```text
*.integration.test.ts
*.integration.test.tsx
```

API 의존성은 실제 서버를 호출하지 않고 MSW로 제어합니다.

## File Location

실제 테스트는 대상 코드 가까이에 둡니다.

```text
src/shared/api/api-error.ts
src/shared/api/api-error.test.ts
src/shared/api/http-client.ts
src/shared/api/http-client.integration.test.ts
```

각 workspace의 `src/test`에는 실제 기능 테스트를 모으지 않고 공통 테스트 기반만 둡니다.

```text
src/test/
  setup.ts
  render.tsx 또는 render.ts
  index.ts
  server.ts와 handlers.ts  # MSW를 사용하는 app만 해당
```

이 저장소는 구현 설계 문서에 `*.spec.md`를 사용하므로 실행 가능한 테스트는 `*.test.ts(x)`로 구분합니다.

## Commands

저장소 root에서 실행합니다.

| Command                 | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `pnpm test`             | 모든 workspace의 Unit·통합 테스트 1회 실행 |
| `pnpm test:unit`        | Unit Test만 실행                           |
| `pnpm test:integration` | 통합 테스트만 실행                         |
| `pnpm test:watch`       | 파일 변경을 감지해 관련 테스트를 반복 실행 |
| `pnpm test:coverage`    | V8 coverage report 생성                    |

특정 workspace만 확인할 때는 filter를 사용합니다.

```bash
pnpm --filter client test
pnpm --filter market-owner test
pnpm --filter @dongchimi/design-system test
```

## Workspace Setup

| Workspace                | Environment | Shared Setup                        |
| ------------------------ | ----------- | ----------------------------------- |
| `apps/client`            | `jsdom`     | jest-dom, cleanup, QueryClient, MSW |
| `apps/market-owner`      | `jsdom`     | jest-dom, cleanup                   |
| `packages/design-system` | `jsdom`     | jest-dom, cleanup                   |

아직 테스트 대상이 없는 workspace도 root test pipeline에 참여할 수 있도록 `passWithNoTests`를 사용합니다. 이는 새 기능에 테스트가 필요 없다는 뜻이 아니며, 테스트 추가 여부는 변경된 동작과 Jira 완료 조건을 기준으로 판단합니다.

## React Testing Rules

- 구현 내부 state나 private 함수보다 사용자가 관찰하는 텍스트, role, 상태, interaction을 우선 검증합니다.
- DOM 요소는 가능하면 `getByRole`과 accessible name으로 찾습니다.
- 클릭과 입력은 직접 event를 호출하지 않고 `userEvent`를 사용합니다.
- Client component는 필요한 Provider를 포함하는 `renderWithProviders`로 렌더링합니다.
- 테스트마다 새로운 QueryClient를 사용해 cache가 다른 테스트에 공유되지 않게 합니다.
- private 함수를 테스트하기 위해 production export를 추가하지 않습니다.

## MSW Rules

Client 통합 테스트는 `src/test/server.ts`의 MSW server를 사용합니다.

테스트에 필요한 handler는 해당 테스트에서 등록합니다.

```ts
server.use(
  http.get('https://api.test/example', () => {
    return HttpResponse.json({ id: 1 });
  }),
);
```

- 등록하지 않은 요청은 `onUnhandledRequest: 'error'`로 실패시킵니다.
- 실제 서버 호출과 테스트 간 network dependency를 방지하기 위한 기준입니다.
- 테스트가 끝나면 임시 handler는 자동으로 초기화됩니다.
- 여러 테스트에서 같은 API contract를 반복해서 사용할 때만 공통 `handlers.ts` 승격을 고려합니다.

## When To Add Tests

아래 변경은 테스트 추가를 우선 검토합니다.

- 조건 분기, 변환, validation이 있는 함수 또는 상태 로직
- 사용자 interaction과 상태 변화가 있는 component 또는 hook
- 오류 처리와 재시도 정책
- HTTP client, API query/mutation, Provider가 연결되는 흐름
- 과거에 회귀가 발생한 동작

copy, 단순 style, 문서처럼 동작이 변하지 않는 변경은 테스트를 강제하지 않습니다. 테스트를 생략한 이유가 리뷰에서 명확하지 않다면 PR에 근거를 남깁니다.

## Coverage Policy

`pnpm test:coverage`로 report를 생성할 수 있지만 현재 coverage threshold는 강제하지 않습니다. 의미 없는 테스트로 수치를 채우지 않고 실제 기능과 회귀 위험을 기준으로 테스트를 추가합니다. threshold가 필요해지면 팀 합의와 별도 Jira 이슈로 도입합니다.

## CI

GitHub Actions는 pull request와 `main`·`develop` push에서 `pnpm test`를 실행합니다. 로컬 검증은 CI를 대체하지 않으며, PR의 Verification에는 실제 실행한 명령만 기록합니다.

## References

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [jest-dom](https://github.com/testing-library/jest-dom)
- [user-event](https://testing-library.com/docs/user-event/intro/)
- [MSW](https://mswjs.io/)
