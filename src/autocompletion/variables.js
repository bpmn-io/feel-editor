import { syntaxTree } from '@codemirror/language';

export default variables => context => {
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

  if (context.explicit && isInEmptyNode) {
    return {
      from: context.pos,
      options: options
    };
  }

  const result = {
    from: nodeBefore.from,
    options: options
  };

  // Only auto-complete variables
  if (nodeBefore.name !== 'VariableName') {
    return null;
  }

  return result;
};


// helpers ///////////////////////////////

function isNodeEmpty(node) {
  return node.from === node.to;
}