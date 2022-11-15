import { closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { setDiagnosticsEffect } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';

import autocompletion from './autocompletion';
import { language } from './language';
import linter from './lint';
import theme from './theme';


/**
 * Creates a FEEL editor in the supplied container
 *
 * @param {Object} config
 * @param {DOMNode} config.container
 * @param {Function} [config.onChange]
 * @param {Function} [config.onKeyDown]
 * @param {Function} [config.onLint]
 * @param {Boolean} [config.readOnly]
 * @param {String} [config.value]
 * @param {Array} [config.variables]
 *
 * @returns {Object} editor
 */
export default function FeelEditor({
  container,
  onChange = () => {},
  onKeyDown = () => {},
  onLint = () => {},
  readOnly = false,
  value = '',
  variables = []
}) {

  const changeHandler = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      onChange(update.state.doc.toString());
    }
  });

  const lintHandler = EditorView.updateListener.of((update) => {
    const diagnosticEffects = update.transactions
      .flatMap(t => t.effects)
      .filter(effect => effect.is(setDiagnosticsEffect));

    if (!diagnosticEffects.length) {
      return;
    }

    const messages = diagnosticEffects.flatMap(effect => effect.value);

    onLint(messages);
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
    autocompletion(variables),
    theme,
    linter,
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    lintHandler
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
FeelEditor.prototype.focus = function(position) {
  const cmEditor = this._cmEditor;

  // the Codemirror `focus` method always calls `focus` with `preventScroll`,
  // so we have to focus + scroll manually
  cmEditor.contentDOM.focus();
  cmEditor.focus();

  if (typeof position === 'number') {
    const end = cmEditor.state.doc.length;
    cmEditor.dispatch({ selection: { anchor: position <= end ? position : end } });
  }
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