import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { language } from './language';
import { defaultKeymap } from '@codemirror/commands';
import linter from './lint';
import theme from './theme';

/**
 * Creates a FEEL editor in the supplied container
 *
 * @param {Object} config
 * @param {DOMNode} config.container
 * @param {Function} [config.onChange]
 * @param {Function} [config.onKeyDown]
 * @param {String} [config.value]
 *
 * @returns {Object} editor
 */
export default function FeelEditor({
  container,
  onChange = () => {},
  onKeyDown = () => {},
  value = '',
  readOnly = false
}) {

  const changeHandler = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString());
    }
  });

  const keyHandler = EditorView.domEventHandlers(
    {
      keydown: onKeyDown
    }
  );

  const extensions = [
    keymap.of([
      ...defaultKeymap,
    ]),
    changeHandler,
    keyHandler,
    language(),
    theme,
    linter
  ];

  if (readOnly) {
    extensions.push(EditorView.editable.of(false));
  }

  this._cmEditor = new EditorView({
    state: EditorState.create({
      doc: value,
      extensions: extensions
    }),
    parent: container
  });

  return this;
}

/**
 * Replaces the content of the Editor
 *
 * @param {String} value
 */
FeelEditor.prototype.setValue = function(value) {
  this._cmEditor.dispatch({
    changes: {
      from: 0,
      to: this._cmEditor.state.doc.length,
      insert: value,
    }
  });
};

/**
 * Sets the focus in the editor.
 */
FeelEditor.prototype.focus = function() {
  this._cmEditor.focus();
};

/**
 * Returns the current selection ranges. If no text is selected, a single
 * range with the start and end index at the cursor position will be returned.
 *
 * @returns {Object} selection
 * @returns {Array} selection.ranges
 */
FeelEditor.prototype.getSelection = function() {
  return this._cmEditor.state.selection;
};