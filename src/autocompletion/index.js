import { snippets, keywordCompletions } from '@bpmn-io/lang-feel';
import { completeFromList } from '@codemirror/autocomplete';

import { pathExpressionCompletion } from './pathExpression';
import { variableCompletion } from './variable';

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
    completeFromList(snippets),
    ...keywordCompletions
  ];
}