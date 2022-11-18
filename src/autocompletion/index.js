import { autocompletion, completeFromList } from '@codemirror/autocomplete';
import { snippets } from 'lang-feel';
import builtins from './builtins';

import variables from './variables';

export default function() {
  return [
    autocompletion({
      override: [
        variables,
        builtins,
        completeFromList(snippets)
      ]
    })
  ];
}