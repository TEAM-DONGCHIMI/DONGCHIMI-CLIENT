import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders, screen, userEvent } from '@/test';

import { OfflinePage } from './OfflinePage';

describe('OfflinePage', () => {
  it('explains the offline state and retries on demand', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    renderWithProviders(<OfflinePage onRetry={handleRetry} />);

    expect(screen.getByRole('heading', { name: '인터넷 연결을 확인해주세요' })).toBeVisible();
    expect(screen.getByText(/네트워크 연결 후 다시 시도하면/)).toBeVisible();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
