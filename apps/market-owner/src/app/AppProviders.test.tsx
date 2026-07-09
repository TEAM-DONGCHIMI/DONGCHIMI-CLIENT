import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@dongchimi/shared/toast';
import { overlay } from 'overlay-kit';
import { describe, expect, it } from 'vitest';

import { render, screen, userEvent } from '@/test';

import { AppProviders } from './AppProviders';

const QueryAwareOverlay = () => {
  const queryClient = useQueryClient();

  return <p>overlay query ready {String(Boolean(queryClient))}</p>;
};

const OverlayLauncher = () => {
  const openOverlay = () => {
    overlay.open(() => <QueryAwareOverlay />);
  };

  return (
    <button onClick={openOverlay} type='button'>
      오버레이 열기
    </button>
  );
};

const ToastAwareOverlay = () => {
  const toast = useToast();

  return (
    <button onClick={() => toast.completed('오버레이 토스트 준비')} type='button'>
      토스트 열기
    </button>
  );
};

const ToastOverlayLauncher = () => {
  const openOverlay = () => {
    overlay.open(() => <ToastAwareOverlay />);
  };

  return (
    <button onClick={openOverlay} type='button'>
      토스트 오버레이 열기
    </button>
  );
};

describe('AppProviders', () => {
  it('lets OverlayKit content read query context in market-owner app children', async () => {
    const user = userEvent.setup();

    render(
      <AppProviders>
        <OverlayLauncher />
      </AppProviders>,
    );

    await user.click(screen.getByRole('button', { name: '오버레이 열기' }));

    expect(await screen.findByText('overlay query ready true')).toBeInTheDocument();
  });

  it('lets OverlayKit content open shared toast in market-owner app children', async () => {
    const user = userEvent.setup();

    render(
      <AppProviders>
        <ToastOverlayLauncher />
      </AppProviders>,
    );

    await user.click(screen.getByRole('button', { name: '토스트 오버레이 열기' }));
    await user.click(await screen.findByRole('button', { name: '토스트 열기' }));

    expect(await screen.findByRole('status')).toHaveTextContent('오버레이 토스트 준비');
  });
});
