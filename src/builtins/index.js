import { domify } from 'min-dom';
import { camundaBuiltins } from '@camunda/feel-builtins';

export const domifiedBuiltins = camundaBuiltins.map(builtin => ({
  ...builtin,
  info: () => domify(builtin.info),
}));