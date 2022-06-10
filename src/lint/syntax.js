import { syntaxTree } from '@codemirror/language';
import { linter } from '@codemirror/lint';

export const FeelLinter = function(editorView) {
  const messages = [];
  const tree = syntaxTree(editorView.state);

  tree.iterate({
    enter: node => {
      if (node.type.isError) {

        const error = node.toString();

        /* The error has the pattern [⚠ || ⚠(NodeType)]. The regex extracts the node type from inside the brackets */
        const match = /\((.*?)\)/.exec(error);
        const nodeType = match && match[1];

        let message;

        if (nodeType) {
          message = 'unexpected ' + nodeType;
        } else {
          message = 'expression expected';
        }

        messages.push(
          {
            from: node.from,
            to: node.to,
            severity: 'error',
            message: message,
            source: 'syntaxError'
          }
        );
      }
    }
  });

  return messages;
};

export default linter(FeelLinter);