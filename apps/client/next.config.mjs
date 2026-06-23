import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig = {
  transpilePackages: ['@dongchimi/design-system'],
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
};

export default withVanillaExtract(nextConfig);
