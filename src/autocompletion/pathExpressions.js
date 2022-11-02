import { syntaxTree } from '@codemirror/language';

export default variables => context => {

  // const options = variables.map(v => ({
  //   label: v.name,
  //   type: 'variable',
  //   info: v.info,
  //   detail: v.detail
  // }));

  let nodeBefore = syntaxTree(context.state).resolve(context.pos, -1);
  let pathExpression = nodeBefore;

  let from = context.pos;

  if (pathExpression?.name !== 'PathExpression') {
    pathExpression = nodeBefore.parent;
    from = nodeBefore.from;

  }

  if (pathExpression?.name !== 'PathExpression') {
    return;
  }

  // parse current variable path
  function getPath(node) {
    let path = [];
    console.log(node, node.firstChild, node.toTree());

    for (let child = node.firstChild; child; child = child.nextSibling) {
      if (child.name === 'PathExpression') {
        path.push(...getPath(child));
      } else {
        path.push(context.state.sliceDoc(child.from, child.to));
      }
    }
    return path;
  }

  const varPath = getPath(pathExpression);

  // crawl the variable tree
  let options = variables;
  for (var i = 0; i < varPath.length - 1; i++) {
    console.log(options, varPath[i]);
    options = options?.find(val => val.name === varPath[i])?.values;
    console.log(options);

  }
  console.log(options);

  if (!options) return;

  options = options.map(v => ({
    label: v.name,
    type: 'variable',
    info: v.info,
    detail: v.detail,
    boost: 10
  }));

  console.log(options, from, context.state.sliceDoc(from, from + 1));

  const result = {
    from: from,
    options: options
  };

  console.log(result);

  return result;
};
