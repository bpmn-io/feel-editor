import { cmFeelLinter } from '@bpmn-io/feel-lint';
import { linter } from '@codemirror/lint';

/**
 * Build the FEEL lint extension. Passing `engines` enables version-compatibility
 * linting of built-in functions (in addition to the always-on syntax linting).
 *
 * `engines` is passed through as-is (e.g. `{ camunda: '8.6' }`); the editor is
 * agnostic to which engines are checked.
 *
 * @param { {
 *   builtins?: import('../core').Variable[],
 *   engines?: Record<string, string>,
 * } } [config]
 *
 * @return {import('@codemirror/state').Extension}
 */
export default function lintExtension({
  builtins = [],
  engines
} = {}) {
  return linter(cmFeelLinter({
    builtins,
    engines
  }));
}