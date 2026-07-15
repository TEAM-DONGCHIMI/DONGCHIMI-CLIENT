import { setWasmUrl } from '@lottiefiles/dotlottie-react';
import { describe, expect, it, vi } from 'vitest';

import { configureDotLottieWasm } from './dotlottie';

vi.mock('@lottiefiles/dotlottie-react', () => ({
  setWasmUrl: vi.fn(),
}));

vi.mock('@lottiefiles/dotlottie-web/dotlottie-player.wasm?url', () => ({
  default: '/assets/dotlottie-player.test.wasm',
}));

describe('configureDotLottieWasm', () => {
  it('uses the bundled dotLottie WASM asset URL', () => {
    configureDotLottieWasm();

    expect(setWasmUrl).toHaveBeenCalledWith('/assets/dotlottie-player.test.wasm');
  });
});
