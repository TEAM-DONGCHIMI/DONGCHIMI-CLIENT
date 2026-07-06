import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const ROOT_DIR = process.cwd();
const GENERATED_API_ROOT_DIR = path.join(
  ROOT_DIR,
  'packages',
  'shared',
  'src',
  'api',
  '__generated__',
);

const SWAGGER_TYPESCRIPT_API_CLI = path.join(
  ROOT_DIR,
  'node_modules',
  'swagger-typescript-api',
  'dist',
  'cli.mjs',
);

const loadEnvFile = (fileName) => {
  const filePath = path.join(ROOT_DIR, fileName);

  if (existsSync(filePath)) {
    process.loadEnvFile(filePath);
  }
};

loadEnvFile('.env');
loadEnvFile('.env.local');

const API_DEFINITIONS = [
  {
    envName: 'USER_SWAGGER_URL',
    outputDirName: 'user',
  },
  {
    envName: 'OWNER_SWAGGER_URL',
    outputDirName: 'owner',
  },
];

const generateApiContracts = ({ envName, outputDirName }) => {
  const swaggerUrl = process.env[envName];

  if (!swaggerUrl) {
    throw new Error(
      `${envName} is required. Add it to .env or pass it as an environment variable.`,
    );
  }

  const outputDir = path.join(GENERATED_API_ROOT_DIR, outputDirName);

  mkdirSync(outputDir, { recursive: true });

  const result = spawnSync(
    process.execPath,
    [
      SWAGGER_TYPESCRIPT_API_CLI,
      'generate',
      '--path',
      swaggerUrl,
      '--output',
      outputDir,
      '--name',
      'data-contracts.ts',
      '--no-client',
      '--modular',
      '--default-as-success',
      '--extract-request-body',
      '--extract-response-body',
    ],
    {
      cwd: ROOT_DIR,
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

API_DEFINITIONS.forEach(generateApiContracts);
