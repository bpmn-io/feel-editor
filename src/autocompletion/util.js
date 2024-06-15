// helpers ///////////////////////////////

function _isEmpty(node) {
  return node && node.from === node.to;
}

/**
 * @param {any} node
 * @param {number} pos
 *
 * @return {boolean}
 */
export function isEmpty(node, pos) {

  // For the special case of empty nodes, we need to check the current node
  // as well. The previous node could be part of another token, e.g.
  // when typing functions "abs(".
  const nextNode = node.nextSibling;

  return _isEmpty(node) || (
    nextNode && nextNode.from === pos && _isEmpty(nextNode)
  );
}

export function isVariableName(node) {
  return node && node.parent && node.parent.name === 'VariableName';
}

export function isPathExpression(node) {
  if (!node) {
    return false;
  }

  if (node.name === 'PathExpression') {
    return true;
  }

  return isPathExpression(node.parent);
}
