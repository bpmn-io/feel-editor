import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

export const baseTheme = EditorView.theme({
  '& .cm-content': {
    padding: '0px',
  },
  '& .cm-line': {
    padding: '0px',
  },
  '&.cm-editor.cm-focused': {
    outline: 'none',
  }
});

export const highlightTheme = EditorView.baseTheme({
  '& .variableName': {
    color: '#10f'
  },
  '& .number': {
    color: '#164'
  },
  '& .string': {
    color: '#a11'
  },
  '& .function': {
    color: '#aa3731',
    fontWeight: 'bold'
  },
  '& .atom': {
    color: '#708'
  }
});


export const syntaxClasses = syntaxHighlighting(
  HighlightStyle.define([
    { tag: t.variableName, class: 'variableName' },
    { tag: t.name, class: 'variableName' },
    { tag: t.number, class: 'number' },
    { tag: t.string, class: 'string' },
    { tag: t.function(t.variableName), class: 'function' },
    { tag: t.atom, class: 'atom' },
  ])
);