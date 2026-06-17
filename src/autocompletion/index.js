import { keywordCompletions } from '@bpmn-io/lang-feel';
import { pathExpressionCompletion } from './pathExpression.js';
import { variableCompletion } from './variable.js';
import { snippetCompletions } from './snippets.js';

/**
 * @typedef { import('../core').Variable } Variable
 * @typedef { import('@codemirror/autocomplete').CompletionSource } CompletionSource
 */

/**
 * @param { {
 *   variables?: Variable[],
 *   builtins?: Variable[]
 * } } options
 *
 * @return { CompletionSource[] }
 */
export function completions({ variables = [], builtins = [] }) {

  return [
    pathExpressionCompletion({ variables }),
    variableCompletion({ variables, builtins }),
    snippetCompletions(),
    ...keywordCompletions
  ];
}