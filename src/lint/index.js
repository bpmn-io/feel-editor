import { cmFeelLinter } from '@bpmn-io/feel-lint';
import { linter } from '@codemirror/lint';

export default [ linter(cmFeelLinter()) ];