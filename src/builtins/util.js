import { domify } from 'min-dom';

/**
 * @param { import('..').Builtin[] } builtins
 *
 * @returns {import('..').Variable[] } variable
 */
export function parseBuiltins(builtins) {
  return builtins.map(parseBuiltin);
}

/**
 * @param { import('..').Builtin } builtin
 *
 * @returns { import('..').Variable } variable
 */
export function parseBuiltin(builtin) {

  const {
    name,
    description
  } = builtin;

  const match = name.match(/^([\w\s]+)\((.*)\)$/);
  const functionName = match[1];
  const functionArguments = match[2];

  // parameterless function matches as empty string
  const params = functionArguments ? functionArguments.split(', ').map(name => ({ name })) : [];

  return {
    name: functionName,
    type: 'function',
    params,
    info: () => {
      return domify(`<div class="description">${description}<div>`);
    },
    boost: 0
  };
}