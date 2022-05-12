import { Annotation, EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { language } from './language';
import themes from './theme';

/**
 *
 * @param {Object} config
 * @param {DOMNode} config.container
 * @param {Function} config.onChange
 * @param {String} config.value
 * @returns
 */
export function FeelEditor({
  container,
  onChange = () => {},
  onKeyDown = () => {},
  value = '',
  focus = false
}) {

  const changeHandler = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      if (isUpdateExternal(update)) {
        return;
      }

      onChange(update.state.doc.toString());
    }
  });

  const keyHandler = EditorView.domEventHandlers(
    {
      keydown: onKeyDown,
    }
  );

  this.editor = new EditorView({
    state: EditorState.create({
      doc: value,
      extensions: [
        changeHandler,
        keyHandler,
        language(),
        themes
      ]
    }),
    parent: container
  });

  if (focus) {
    this.editor.focus();
  }

  // replace content with new value
  this.setValue = (value) => {
    const annotation = new Annotation('externalChange', true);

    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: value,
      },
      annotations: [ annotation ]
    });
  };


  this.getSelection = () => {
    return this.editor.state.selection;
  };

  return this;
}

const isUpdateExternal = (update) => {
  return update.transactions.some(t => {
    return t.annotations.some(a => a.type === 'externalChange' && a.value === true);
  });
};