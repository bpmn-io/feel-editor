import { syntaxTree } from '@codemirror/language';
import { isPathExpression } from './util';

/**
 * @typedef { import('../core').Variable } Variable
 * @typedef { import('@codemirror/autocomplete').CompletionSource } CompletionSource
 */

/**
 * @param { {
 *   variables?: Variable[],
 * } } options
 *
 * @return { CompletionSource }
 */
export function pathExpressionCompletion({ variables }) {

  return (context) => {

    const nodeBefore = syntaxTree(context.state).resolve(context.pos, -1);

    if (!isPathExpression(nodeBefore)) {
      return null;
    }

    const expression = findPathExpression(nodeBefore);

    // if the cursor is directly after the `.`, variable starts at the cursor position
    const from = nodeBefore === expression ? context.pos : nodeBefore.from;

    const path = getPath(expression, context);

    let options = variables;
    for (var i = 0; i < path.length - 1; i++) {
      var childVar = options.find(val => val.name === path[i].name);

      if (!childVar) {
        return null;
      }

      // only suggest if variable type matches
      if (
        childVar.isList !== 'optional' &&
        !!childVar.isList !== path[i].isList
      ) {
        return null;
      }

      options = childVar.entries;
    }

    if (!options) return null;

    const completionOptions = options.map(option => (
      {
        label: option.name,
        type: 'variable',
        info: option.info,
        detail: option.detail
      }));

    const result = {
      from: from,
      options: completionOptions
    };

    return result;
  };
}


function findPathExpression(node) {
  while (node) {
    if (node.name === 'PathExpression') {
      return node;
    }
    node = node.parent;
  }
}

// parses the path expression into a list of variable names with type information
// e.g. foo[0].bar => [ { name: 'foo', isList: true }, { name: 'bar', isList: false } ]
function getPath(node, context) {
  let path = [];

  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (child.name === 'PathExpression') {
      path.push(...getPath(child, context));
    } else if (child.name === 'FilterExpression') {
      path.push(...getFilter(child, context));
    }
    else {
      path.push({
        name: getNodeContent(child, context),
        isList: false
      });
    }
  }
  return path;
}

function getFilter(node, context) {
  const list = node.firstChild;

  if (list.name === 'PathExpression') {
    const path = getPath(list, context);
    const last = path[path.length - 1];
    last.isList = true;

    return path;
  }

  return [ {
    name: getNodeContent(list, context),
    isList: true
  } ];
}

function getNodeContent(node, context) {
  return context.state.sliceDoc(node.from, node.to);
}