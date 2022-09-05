import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import { snippets } from 'lang-feel';
import builtins from './builtins';

import pathExpressions from './pathExpressions';
import variables from './variables';

export default function(context) {
  return [
    autocompletion({
      override: [
        variables(context),
        builtins,
        completeFromList(snippets),
        pathExpressions(context)
      ]
    })
  ];
}