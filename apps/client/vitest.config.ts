import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const alias = {
  '@': path.resolve(dirname, './src'),
};

const commonTestConfig = {
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  // 포크 프로세스 하나에서 여러 테스트 파일을 실행하면 jsdom 환경이 계속 누적되며 힙 메모리가 쌓입니다.
  // 동시에 뜨는 포크 수를 제한해 CI에서 발생한 heap out of memory를 방지합니다.
  poolOptions: {
    forks: {
      maxForks: 2,
    },
  },
};

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    projects: [
      {
        plugins: [vanillaExtractPlugin()],
        resolve: {
          alias,
        },
        test: {
          ...commonTestConfig,
          exclude: ['src/**/*.integration.test.{ts,tsx}'],
          include: ['src/**/*.test.{ts,tsx}'],
          name: 'unit',
        },
      },
      {
        plugins: [vanillaExtractPlugin()],
        resolve: {
          alias,
        },
        test: {
          ...commonTestConfig,
          include: ['src/**/*.integration.test.{ts,tsx}'],
          name: 'integration',
        },
      },
    ],
  },
});
