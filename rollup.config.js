import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import pkg from './package.json';


const nonbundledDependencies = Object.keys({ ...pkg.dependencies });

module.exports = {
  input: pkg.source,
  output: {
    file: pkg.exports['.'],
    format: 'esm'
  },
  plugins: [
    commonjs(),
    json()
  ],
  external: nonbundledDependencies
};
