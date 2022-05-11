import { EditorState, EditorView } from '@codemirror/basic-setup';

export function FeelEditor({ container }) {
  return new EditorView({
    state: EditorState.create({}),
    parent: container
  });
}

