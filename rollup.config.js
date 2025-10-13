import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const banner = `
/*!
 * Hello World Capacitor Plugin
 * Copyright (c) 2024 Clayton Darlington
 * Licensed under MIT
 */
`;

export default {
  input: 'dist/esm/index.js',
  output: [
    {
      file: 'dist/plugin.js',
      format: 'iife',
      name: 'capacitorHelloWorld',
      globals: {
        '@capacitor/core': 'capacitorExports',
      },
      sourcemap: true,
      inlineDynamicImports: true,
      banner,
    },
    {
      file: 'dist/plugin.cjs.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
      banner,
    },
  ],
  external: ['@capacitor/core'],
  plugins: [
    resolve({
      browser: true,
    }),
    sourcemaps(),
  ],
};