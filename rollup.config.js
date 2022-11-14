const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

const pkg = require('./package.json');
const nonbundledDependencies = Object.keys({ ...pkg.dependencies });

module.exports = {
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
