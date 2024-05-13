import { syntaxTree } from '@codemirror/language';
import { snippetCompletion } from '@codemirror/autocomplete';
import { isNodeEmpty, isPathExpression } from './autocompletionUtil';
import { variablesFacet } from './VariableFacet';

/**
 * @type {import('@codemirror/autocomplete').CompletionSource}
 */
export default context => {

  const variables = context.state.facet(variablesFacet)[0];

  const options = variables.map(v => createVariableSuggestion(v));

  // In most cases, use what is typed before the cursor
  let nodeBefore = syntaxTree(context.state).resolve(context.pos, -1);

  // For the special case of empty nodes, we need to check the current node
  // as well. The previous node could be part of another token, e.g.
  // when typing functions "abs(".
  let nextNode = nodeBefore.nextSibling;
  const isInEmptyNode =
        isNodeEmpty(nodeBefore) ||
        nextNode && nextNode.from === context.pos && isNodeEmpty(nextNode);

  if (isInEmptyNode) {
    return context.explicit ? {
      from: context.pos,
      options: options
    } : null;
  }

  const result = {
    from: nodeBefore.from,
    options: options
  };

  // Only auto-complete variables
  if ((nodeBefore.parent && nodeBefore.parent.name !== 'VariableName') || isPathExpression(nodeBefore)) {
    return null;
  }

  return result;
};

/**
 * @param {import('..').Variable} variable
 * @returns {import('@codemirror/autocomplete').Completion}
 */
function createVariableSuggestion(variable) {
  if (variable.type === 'function') {
    return createFunctionVariable(variable);
  }

  return {
    label: variable.name,
    type: 'variable',
    info: variable.info,
    detail: variable.detail
  };
}

/**
 * @param {import('..').Variable} variable
 * @returns {import('@codemirror/autocomplete').Completion}
 */
function createFunctionVariable(variable) {
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
    detail
  });
}
