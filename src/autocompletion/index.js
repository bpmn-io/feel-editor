import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import { snippets, keywordCompletions } from 'lang-feel';
import { completions as builtinCompletions } from './builtins';
import { completions as pathExpressionCompletions } from './pathExpressions';

import { completions as variableCompletions } from './variables';

export default function() {
  return [
    autocompletion({
      override: [
        variableCompletions,
        builtinCompletions,
        completeFromList(snippets.map(s => ({ ...s, boost: -1 }))),
        pathExpressionCompletions,
        ...keywordCompletions
      ]
    })
  ];
}