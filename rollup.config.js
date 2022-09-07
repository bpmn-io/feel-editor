import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

import pkg from './package.json';

export default {
  input: 'src/index.js',
  output: [ {
    file: pkg.main,
    format: 'cjs'
  },
  {
    file: pkg.module,
    format: 'esm'
  },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    json()
  ]
};
