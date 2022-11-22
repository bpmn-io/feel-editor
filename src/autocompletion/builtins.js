import { snippetCompletion } from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { domify } from 'min-dom';

import { isNodeEmpty, isPathExpression } from './autocompletionUtil';
import tags from './builtins.json';

const options = tags.map(tag => snippetCompletion(
  tag.name.replace('()', '(#{1})'),
  {
    label: tag.name,
    type: 'function',
    info: () => {
      const html = domify(`<div class="description">${tag.description}<div>`);
      return html;
    },
    boost: -1
  }
));

export default context => {

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

  // Don't auto-complete on path expressions/context keys/...
  if ((nodeBefore.parent && nodeBefore.parent.name !== 'VariableName') || isPathExpression(nodeBefore)) {
    return null;
  }

  return {
    from: nodeBefore.from,
    options: options
  };
};
