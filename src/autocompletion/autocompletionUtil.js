// helpers ///////////////////////////////

export function isNodeEmpty(node) {
  return node.from === node.to;
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