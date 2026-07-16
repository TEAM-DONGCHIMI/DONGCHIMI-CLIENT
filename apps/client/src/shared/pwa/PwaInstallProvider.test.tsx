import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PwaInstallProvider, usePwaInstall } from './PwaInstallProvider';

const InstallConsumer = () => {
  const { availability, requestInstall } = usePwaInstall();
  const [result, setResult] = useState('none');

  return (
    <>
      <span aria-label='install availability'>{availability}</span>
      <span aria-label='install result'>{result}</span>
      <button
        onClick={() => {
          void requestInstall().then(setResult);
        }}
        type='button'
      >
        install
      </button>
    </>
  );
};

const createInstallPromptEvent = (outcome: 'accepted' | 'dismissed') => {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  const prompt = vi.fn().mockResolvedValue(undefined);

  Object.assign(event, {
    prompt,
    userChoice: Promise.resolve({ outcome, platform: 'web' }),
  });

  return { event, prompt };
};

describe('PwaInstallProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns manual when the browser has not provided an install prompt', async () => {
    const user = userEvent.setup();

    render(
      <PwaInstallProvider>
        <InstallConsumer />
      </PwaInstallProvider>,
    );

    expect(screen.getByLabelText('install availability')).toHaveTextContent('manual');

    await user.click(screen.getByRole('button', { name: 'install' }));

    expect(screen.getByLabelText('install result')).toHaveTextContent('manual');
  });

  it.each(['accepted', 'dismissed'] as const)(
    'opens the deferred prompt and returns %s',
    async (outcome) => {
      const user = userEvent.setup();
      const { event, prompt } = createInstallPromptEvent(outcome);

      render(
        <PwaInstallProvider>
          <InstallConsumer />
        </PwaInstallProvider>,
      );

      act(() => {
        window.dispatchEvent(event);
      });

      expect(event.defaultPrevented).toBe(true);
      expect(screen.getByLabelText('install availability')).toHaveTextContent('prompt');

      await user.click(screen.getByRole('button', { name: 'install' }));

      expect(prompt).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText('install result')).toHaveTextContent(outcome);
    },
  );

  it('marks the app as installed after appinstalled', () => {
    render(
      <PwaInstallProvider>
        <InstallConsumer />
      </PwaInstallProvider>,
    );

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(screen.getByLabelText('install availability')).toHaveTextContent('installed');
  });
});
