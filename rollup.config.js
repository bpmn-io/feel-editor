import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import pkg from './package.json';
const nonbundledDependencies = Object.keys({ ...pkg.dependencies });

export default {
  input: 'src/index.js',
  output: [ {
    file: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'esm'
  } ],
  plugins: [
    commonjs(),
    json()
  ],
  external: nonbundledDependencies
};
