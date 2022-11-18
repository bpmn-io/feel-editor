import { syntaxTree } from '@codemirror/language';
import { isNodeEmpty, isPathExpression } from './autocompletionUtil';
import { variablesFacet } from './VariableFacet';

/**
 * @type {import('@codemirror/autocomplete').CompletionSource}
 */
export default context => {

  const variables = context.state.facet(variablesFacet)[0];

  const options = variables.map(v => ({
    label: v.name,
    type: 'variable',
    info: v.info,
    detail: v.detail
  }));

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
