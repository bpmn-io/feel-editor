# Changelog

All notable changes to [@bpmn-io/feel-editor](https://github.com/bpmn-io/feel-editor) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 1.1.0

* `FEAT`: add contextual keyword completion
* `FIX`: correct parsing of nested lists
* `FIX`: correct parsing of incomplete `QuantifiedExpression`
* `FIX`: only allow legal `Name` start characters
* `DEPS`: update to `feel-lint@1.1.0`
* `DEPS`: update to `lang-feel@2.0.0`
* `DEPS`: update to `lezer-feel@1.2.4`
* `DEPS`: update `codemirror` dependencies

## 1.0.1

* `FIX`: fix keyboard navigation for builtin functions ([#46](https://github.com/bpmn-io/feel-editor/pull/46))

## 1.0.0

* `FEAT`: update list of builtin functions ([#45](https://github.com/bpmn-io/feel-editor/pull/45))

## 0.9.1

* `DEPS`: update to `feel-lint@1.0.0`

## 0.9.0

* `FEAT`: allow extensions to be passed to the editor ([#41](https://github.com/bpmn-io/feel-editor/issues/41))

## 0.8.1

* `FIX`: correctly flag dev dependencies

## 0.8.0

* `DEPS`: update to `lang-feel@1.0.0`
* `DEPS`: update to `feel-lint@0.2.0`

### Breaking Changes

* We now support single expressions per input only, not a list of expressions. This more closely aligns with the DMN FEEL spec.

## 0.7.1

* `FIX`: keep line breaks and hide overflow in info box ([#37](https://github.com/bpmn-io/feel-editor/issues/37))

## 0.7.0

* `FEAT`: support nested variables ([#34](https://github.com/bpmn-io/feel-editor/pull/34))
* `DEPS`: use `@bpmn-io/feel-lint` for syntax validation ([#35](https://github.com/bpmn-io/feel-editor/pull/35))

## 0.6.0

* `FEAT`: allow to set variables dynamically ([#33](https://github.com/bpmn-io/feel-editor/pull/33))
* `FEAT`: allow to configure tooltip container ([#32](https://github.com/bpmn-io/feel-editor/pull/32))
* `DEPS`: update dependencies (lang-feel, codemirror)

## 0.5.0

* `FEAT`: scroll into view when focused ([#30](https://github.com/bpmn-io/feel-editor/pull/30))
* `CHORE`: update documentation for built-in functions ([#27](https://github.com/bpmn-io/feel-editor/pull/27))

## 0.4.1

_Re-release of 0.4.1 with external dependencies removed from bundle._

## 0.4.0

* `FEAT`: support automatic indentation ([#13](https://github.com/bpmn-io/feel-editor/issues/13))
* `FEAT`: suggest built-in functions ([#11](https://github.com/bpmn-io/feel-editor/issues/11))
* `FEAT`: suggest built-in snippets ([#14](https://github.com/bpmn-io/feel-editor/issues/14))
* `DEPS`: update to lezer-feel@0.13.1 ([9333aa8](https://github.com/bpmn-io/feel-editor/commit/9333aa8ba8cf24363e4f2743836ca57b3eba6812))

## 0.3.0

* `FEAT`: add onLint callback ([#10](https://github.com/bpmn-io/feel-editor/pull/10))
* `FEAT`: set caret position in `editor.focus` ([#15](https://github.com/bpmn-io/feel-editor/pull/15))

## 0.2.0

* `FEAT`: add variable suggestion ([#9](https://github.com/bpmn-io/feel-editor/pull/9))

## 0.1.0

* `FEAT`: initial release, create a FEEL editor with Code highlighting ([#4](https://github.com/bpmn-io/feel-editor/pull/4))
* `FEAT`: highlight syntax errors ([#7](https://github.com/bpmn-io/feel-editor/pull/7))
