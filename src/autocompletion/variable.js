import { syntaxTree } from '@codemirror/language';
import { snippetCompletion } from '@codemirror/autocomplete';
import { isEmpty, isPathExpression, isVariableName } from './util';

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
 * @return { CompletionSource }
 */
export function variableCompletion({ variables = [], builtins = [] }) {

  const options = getVariableSuggestions(variables, builtins);

  if (!options.length) {
    return (context) => null;
  }

  return (context) => {

    const {
      pos,
      state
    } = context;

    // in most cases, use what is typed before the cursor
    const nodeBefore = syntaxTree(state).resolve(pos, -1);

    if (isEmpty(nodeBefore, pos)) {
      return context.explicit ? {
        from: pos,
        options
      } : null;
    }

    // only auto-complete variables
    if (!isVariableName(nodeBefore) || isPathExpression(nodeBefore)) {
      return null;
    }

    const start = context.state.sliceDoc(nodeBefore.from, pos);

    return {
      from: nodeBefore.from,
      options: options.map(option => {

        return {
          ...option,
          boost: getBoost(option, start)
        };
      }).filter(option => option.boost > -10)
    };
  };
}

function getBoost(option, match) {

  const {
    label,
    boost
  } = option;

  if (!label.includes(match)) {
    return -100;
  }

  if (label.startsWith(match)) {
    return 5;
  }

  return boost;
}

/**
 * @param { Variable[] } variables
 * @param { Variable[] } builtins
 *
 * @returns {import('@codemirror/autocomplete').Completion[]}
 */
function getVariableSuggestions(variables, builtins) {
  return [].concat(
    variables.map(v => createVariableSuggestion(v, 2)),
    builtins.map(b => createVariableSuggestion(b, 1))
  );
}

/**
 * @param {import('..').Variable} variable
 * @param {number} boost

 * @returns {import('@codemirror/autocomplete').Completion}
 */
function createVariableSuggestion(variable, boost) {
  if (variable.type === 'function') {
    return createFunctionVariable(variable, boost);
  }

  return {
    label: variable.name,
    type: 'variable',
    info: variable.info,
    detail: variable.detail,
    boost
  };
}

/**
 * @param {import('..').Variable} variable
 * @param {number} boost
 *
 * @returns {import('@codemirror/autocomplete').Completion}
 */
function createFunctionVariable(variable, boost) {
  const {
    name,
    info,
    detail,
    params = []
  } = variable;

  const paramsWithNames = params.map(({ name, type }, index) => ({
    name: name || `param ${index + 1}`,
    type
  }));

  const template = `${name}(${paramsWithNames.map(p => '${' + p.name + '}').join(', ')})`;

  const paramsSignature = paramsWithNames.map(({ name, type }) => (
    type ? `${name}: ${type}` : name
  )).join(', ');
  const label = `${name}(${paramsSignature})`;

  return snippetCompletion(template, {
    label,
    type: 'function',
    info,
    detail,
    boost
  });
}
