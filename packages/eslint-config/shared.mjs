import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const sourceFiles = ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}'];
const typescriptFiles = ['**/*.{ts,tsx,mts,cts}'];
const reactFiles = ['**/*.{jsx,tsx}'];
const reactSettings = {
  react: {
    version: 'detect',
  },
};

const withReactFiles = (config) => {
  return {
    ...config,
    files: reactFiles,
    settings: {
      ...config.settings,
      react: {
        ...(config.settings?.react ?? {}),
        version: 'detect',
      },
    },
  };
};

export const formattingConfig = eslintConfigPrettier;

export const baseConfig = [
  {
    name: '@dongchimi/eslint-config/ignores',
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/.cache/**',
      '**/coverage/**',
      '**/dist/**',
      '**/dist-ssr/**',
      '**/storybook-static/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    name: '@dongchimi/eslint-config/language-options',
    files: sourceFiles,
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    name: '@dongchimi/eslint-config/base-conventions',
    files: sourceFiles,
    rules: {
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-template': 'error',
      'template-curly-spacing': ['error', 'never'],
      'object-shorthand': ['error', 'always'],
      eqeqeq: ['error', 'smart'],
    },
  },
  {
    name: '@dongchimi/eslint-config/typescript-conventions',
    files: typescriptFiles,
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          custom: {
            regex: '(Props|Types)$',
            match: true,
          },
        },
      ],
    },
  },
];

export const reactRecommendedConfig = [
  withReactFiles(react.configs.flat.recommended),
  withReactFiles(react.configs.flat['jsx-runtime']),
  reactHooks.configs.flat.recommended,
  {
    ...jsxA11y.flatConfigs.recommended,
    files: reactFiles,
  },
];

export const reactConventions = [
  {
    name: '@dongchimi/eslint-config/react-conventions',
    files: reactFiles,
    settings: reactSettings,
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-useless-fragment': [
        'warn',
        {
          allowExpressions: true,
        },
      ],
    },
  },
];

export const reactConfig = [...reactRecommendedConfig, ...reactConventions];
