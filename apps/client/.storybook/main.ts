import type { StorybookConfig } from '@storybook/react-vite';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const storybookDir = dirname(fileURLToPath(import.meta.url));
const nextImageMockPath = resolve(storybookDir, './next-image.mock.tsx');
const nodeEnv = process.env.NODE_ENV ?? 'development';
const processEnvDefine = {
  'process.env': '{}',
  'process.env.NODE_ENV': JSON.stringify(nodeEnv),
};

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [getAbsolutePath('@storybook/addon-a11y'), getAbsolutePath('@storybook/addon-docs')],
  framework: getAbsolutePath('@storybook/react-vite'),
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), vanillaExtractPlugin()];
    config.define = {
      ...config.define,
      ...processEnvDefine,
    };
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: [...(config.optimizeDeps?.exclude ?? []), 'next/image'],
    };
    const currentAlias = config.resolve?.alias;
    config.resolve = {
      ...config.resolve,
      alias: Array.isArray(currentAlias)
        ? [...currentAlias, { find: 'next/image', replacement: nextImageMockPath }]
        : { ...(currentAlias ?? {}), 'next/image': nextImageMockPath },
    };

    return config;
  },
};

export default config;
