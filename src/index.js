import { closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import { setDiagnosticsEffect } from '@codemirror/lint';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder as placeholderExt, tooltips } from '@codemirror/view';

import autocompletion from './autocompletion';
import { variablesFacet } from './autocompletion/VariableFacet';
import { language } from './language';
import linter from './lint';
import theme from './theme';

/**
 * @typedef {object} Variable
 * @property {string} name name or key of the variable
 * @property {string} [info] short information about the variable, e.g. type
 * @property {string} [detail] longer description of the variable content
 * @property {boolean} [isList] whether the variable is a list
 * @property {Array<Variable>} [schema] array of child variables if the variable is a context or list
 * @property {'function'|'variable'} [type] type of the variable
 * @property {Array<{name: string, type: string}>} [params] function parameters
 */

const autocompletionConf = new Compartment();
const placeholderConf = new Compartment();


/**
 * Creates a FEEL editor in the supplied container
 *
 * @param {Object} config
 * @param {DOMNode} config.container
 * @param {Extension[]} [config.extensions]
 * @param {'expression' | 'unaryTests'} [config.dialect='expression']
 * @param {DOMNode|String} [config.tooltipContainer]
 * @param {Function} [config.onChange]
 * @param {Function} [config.onKeyDown]
 * @param {Function} [config.onLint]
 * @param {Boolean} [config.readOnly]
 * @param {String} [config.value]
 * @param {Variable[]} [config.variables]
 *
 * @returns {Object} editor
 */
export default function FeelEditor({
  extensions: editorExtensions = [],
  dialect = 'expression',
  container,
  contentAttributes = {},
  tooltipContainer,
  onChange = () => {},
  onKeyDown = () => {},
  onLint = () => {},
  placeholder = '',
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

  if (typeof tooltipContainer === 'string') {
    tooltipContainer = document.querySelector(tooltipContainer);
  }

  const tooltipLayout = tooltipContainer ? tooltips({
    tooltipSpace: function() {
      return tooltipContainer.getBoundingClientRect();
    }
  }) : [];

  const extensions = [
    autocompletionConf.of(variablesFacet.of(variables)),
    autocompletion(),
    bracketMatching(),
    changeHandler,
    closeBrackets(),
    EditorView.contentAttributes.of(contentAttributes),
    indentOnInput(),
    keyHandler,
    keymap.of([
      ...defaultKeymap,
    ]),
    language({
      dialect
    }),
    linter,
    lintHandler,
    placeholderConf.of(placeholderExt(placeholder)),
    tooltipLayout,
    theme,
    ...editorExtensions
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

/**
 * Set variables to be used for autocompletion.
 * @param {Variable[]} variables
 * @returns {void}
 */
FeelEditor.prototype.setVariables = function(variables) {
  this._cmEditor.dispatch({
    effects: autocompletionConf.reconfigure(variablesFacet.of(variables))
  });
};

/**
 * Update placeholder text.
 * @param {string} placeholder
 * @returns {void}
 */
FeelEditor.prototype.setPlaceholder = function(placeholder) {
  this._cmEditor.dispatch({
    effects: placeholderConf.reconfigure(placeholderExt(placeholder))
  });
};
