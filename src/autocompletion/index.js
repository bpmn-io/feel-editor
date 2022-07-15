import { autocompletion } from '@codemirror/autocomplete';

import variables from './variables';

export default function(context) {
  return [
    autocompletion({
      override: [
        variables(context),
      ]
    })
  ];
}