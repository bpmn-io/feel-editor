import { autocompletion } from '@codemirror/autocomplete';
import builtIns from './builtIns';

import variables from './variables';

export default function(context) {
  return [
    autocompletion({
      override: [
        variables(context),
        builtIns
      ]
    })
  ];
}