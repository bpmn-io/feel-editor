import { autocompletion } from '@codemirror/autocomplete';
import builtins from './builtins';

import variables from './variables';

export default function(context) {
  return [
    autocompletion({
      override: [
        variables(context),
        builtins
      ]
    })
  ];
}