// Global type definitions for FEEL Editor

import { Extension as CodeMirrorExtension } from "@codemirror/state";

declare global {
  type DOMNode = HTMLElement;
  type Extension = CodeMirrorExtension;
}

export {};
