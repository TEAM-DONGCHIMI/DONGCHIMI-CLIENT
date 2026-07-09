# Market Owner App Providers Spec

## Metadata

- Jira: DCMSM-16
- Route: 사장님 웹 app shell
- Owner: FE
- Status: Implemented

## Purpose

사장님 데스크탑 웹에서 overlay 기반 UI와 TanStack Query 기반 API 상태를 앱 전역에서 사용할 수 있게 provider wiring을 고정합니다.
사장님 웹은 상품 등록, 수정, 확인, 취소 같은 흐름에서 modal/dialog UI를 자주 사용하므로, 각 페이지가 `useState`로 modal open 상태와 결과 전달을 반복 관리하지 않도록 OverlayKit을 앱 shell에 도입합니다.
OverlayKit은 modal을 필요한 시점에 선언적으로 열고 닫는 API를 제공하므로, 페이지 컴포넌트는 modal mounting 상태보다 사용자 액션과 결과 처리에 집중할 수 있습니다.
토스트는 사용자 액션이나 mutation 결과를 짧게 피드백하는 전역 UI이므로, 사장님 웹 app shell에 shared toast runtime을 연결합니다.

## Scope

- `OverlayProvider`는 `apps/market-owner` app shell에만 적용합니다.
- `QueryProvider`는 기존 사장님 앱 query baseline을 유지합니다.
- `ToastProvider`는 `@dongchimi/shared/toast`를 사용하고, 디자인시스템 `Toast`의 UI-only 책임은 유지합니다.
- 이번 변경은 `apps/client` provider wiring으로 확장하지 않습니다.

## Provider Order

`AppProviders`는 `QueryProvider` 안에 `ToastProvider`, 그 안에 `OverlayProvider`를 둡니다.
OverlayKit은 provider의 children 뒤에 overlay 컴포넌트를 렌더하므로, Query provider와 Toast provider가 바깥에 있어야 overlay content도 TanStack Query context와 toast context를 사용할 수 있습니다.
사장님 웹 전역 toast 기본 placement는 `top-right`로 유지합니다.
사이드바가 있는 화면처럼 본문 영역 기준 중앙 toast가 필요한 경우에는 해당 layout 안에서 더 가까운
`ToastProvider`를 추가해 위치 정책만 override합니다.

Overlay content에서 React Router hook이 필요하면 route/layout 안쪽으로 provider 위치를 다시 검토하거나, routing 동작을 callback으로 주입합니다.

## Usage

`AppProviders`가 앱 root를 감싸므로 page나 component마다 `OverlayProvider`를 다시 추가하지 않습니다.
일반 modal은 `overlay.open`으로 열고, modal 내부 close 동작에서 `close`를 호출합니다.
animation exit 이후 DOM에서 제거해야 하는 component는 `onExit` 또는 대응 callback에 `unmount`를 연결합니다.
토스트는 `useToast`를 사용자 이벤트, mutation callback, 명시적 effect에서 호출합니다. 렌더 중에는 toast를 호출하지 않습니다.

```tsx
import { overlay } from 'overlay-kit';

export const ProductDeleteButton = () => {
  const openDeleteModal = () => {
    overlay.open(({ isOpen, close, unmount }) => (
      <ProductDeleteModal open={isOpen} onClose={close} onExit={unmount} />
    ));
  };

  return (
    <button onClick={openDeleteModal} type='button'>
      삭제
    </button>
  );
};
```

confirm처럼 modal 결과가 필요한 흐름은 `overlay.openAsync`를 사용합니다.
호출부는 promise 결과만 다루고, modal open state는 OverlayKit controller에 맡깁니다.

```tsx
import { overlay } from 'overlay-kit';

export const ProductSubmitButton = () => {
  const submitProduct = async () => {
    const confirmed = await overlay.openAsync<boolean>(({ isOpen, close, unmount }) => (
      <ProductSubmitConfirmModal
        open={isOpen}
        onCancel={() => close(false)}
        onConfirm={() => close(true)}
        onExit={unmount}
      />
    ));

    if (!confirmed) {
      return;
    }

    // submit mutation
  };

  return (
    <button onClick={submitProduct} type='button'>
      등록
    </button>
  );
};
```

## Verification

- [ ] `corepack pnpm --filter market-owner lint`
- [ ] `corepack pnpm --filter market-owner typecheck`
- [ ] `corepack pnpm --filter market-owner test`
- [ ] `corepack pnpm --filter market-owner build`
