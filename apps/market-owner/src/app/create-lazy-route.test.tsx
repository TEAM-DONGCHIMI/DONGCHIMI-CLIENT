import { act, type ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import { render, screen } from '@/test';

import { createLazyRoute } from './create-lazy-route';

const createDeferred = <ValueTypes,>() => {
  let resolve!: (value: ValueTypes) => void;
  const promise = new Promise<ValueTypes>((resolvePromise) => {
    resolve = resolvePromise;
  });

  return { promise, resolve };
};

describe('createLazyRoute', () => {
  it('does not render a route-level loading fallback while the page module loads', async () => {
    const routeModule = createDeferred<{ LazyPage: ComponentType }>();
    const { Component } = createLazyRoute(() => routeModule.promise, 'LazyPage');

    if (!Component) {
      throw new Error('Lazy route component was not created.');
    }

    render(<Component />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText('화면을 불러오는 중입니다.')).not.toBeInTheDocument();

    await act(async () => {
      routeModule.resolve({ LazyPage: () => <h1>지연 로드 화면</h1> });
    });

    expect(await screen.findByRole('heading', { name: '지연 로드 화면' })).toBeInTheDocument();
  });
});
