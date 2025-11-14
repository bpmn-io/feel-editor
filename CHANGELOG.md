# Changelog

All notable changes to [@bpmn-io/feel-editor](https://github.com/bpmn-io/feel-editor) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 1.12.1

* `FIX`: update jsDoc to reflect actual implementation ([#74](https://github.com/bpmn-io/feel-editor/pull/74))

## 1.12.0

* `FEAT`: support multiline strings in `camunda` dialect ([@bpmn-io/lezer-feel#2](https://github.com/bpmn-io/lezer-feel/pull/2))
* `FIX`: recognize unclosed string literal as syntax error ([nikku/lezer-feel#52](https://github.com/nikku/lezer-feel/pull/52))
* `DEPS`: update to `@bpmn-io/lang-feel@2.4.0`, switch to fork of `lang-feel`
* `DEPS`: update to `@bpmn-io/feel-lint@2.1.0`

## 1.11.0

* `FEAT`: update camunda built-ins (added `fromAi`) ([@camunda/feel-builtins#1](https://github.com/camunda/feel-builtins/pull/1))
* `CHORE`: camunda built-ins are now provided by the dependency `@camunda/feel-builtins` ([#71](https://github.com/bpmn-io/feel-editor/pull/71))
* `DEPS`: add `@camunda/feel-builtins@0.2.0` ([#71](https://github.com/bpmn-io/feel-editor/pull/71))

## 1.10.1

* `FIX`: correct completion of lang-feel snippets ([#70](https://github.com/bpmn-io/feel-editor/pull/70))

## 1.10.0

* `FEAT`: update `camunda` built-ins ([#65](https://github.com/bpmn-io/feel-editor/pull/65))
* `FEAT`: support configuration of `parserDialect` ([#68](https://github.com/bpmn-io/feel-editor/pull/68), [nikku/lezer-feel#37](https://github.com/nikku/lezer-feel/pull/37))
* `FEAT`: support backtick identifies in `camunda` mode ([#68](https://github.com/bpmn-io/feel-editor/pull/68))
* `DEPS`: update to `@bpmn-io/feel-lint@1.4.0`
* `DEPS`: update to `lang-feel@2.3.0`
* `DEPS`: update to `lezer-feel@1.7.0`
* `DEPS`: update `codemirror*`
* `DEPS`: update to `lezer*`

## 1.9.1

* `FIX`: correct completion of parameterless built-ins ([#63](https://github.com/bpmn-io/feel-editor/pull/63))

## 1.9.0

* `FEAT`: offer Camunda 8.6 built-ins for completion ([#62](https://github.com/bpmn-io/feel-editor/pull/62))

## 1.8.0

* `FEAT`: make editor use full container height ([#61](https://github.com/bpmn-io/feel-editor/pull/61))

## 1.7.0

* `FEAT`: lint first item access ([feel-lint#25](https://github.com/bpmn-io/feel-lint/issues/25))

## 1.6.1

* `FIX`: ensure editor can be used without `unsafe-eval` ([#59](https://github.com/bpmn-io/feel-editor/pull/59))

## 1.6.0

* `FEAT`: allow to provide custom built-ins ([`293d1ae`](https://github.com/bpmn-io/feel-editor/commit/293d1aeb1da931d3b1f6d063966850d0b42b2d0d))
* `FEAT`: allow to configure `dialect` ([`c0aaf53`](https://github.com/bpmn-io/feel-editor/commit/c0aaf5351c7ab444a28372680556fffbd1de6415))
* `FEAT`: attach `aria-language` to editor
* `FIX`: recognize built-ins and global variables with spaces
* `FIX`: do not complete snippets in `PathExpression`
* `FIX`: correct completion inside positional arguments
* `CHORE`: update built-ins ([`8bc2194`](https://github.com/bpmn-io/feel-editor/commit/8bc21948f3f9ecfb24753b432678966e78f67f76))
* `DEPS`: update `@codemirror/*`
* `DEPS`: update to `lezer-feel@1.2.9`
* `DEPS`: update to `lang-feel@2.1.1`

## 1.5.0

* `FEAT`: support placeholder configuration ([#52](https://github.com/bpmn-io/feel-editor/pull/52))

## 1.4.0

* `FEAT`: allow to provide functions with snippet autocompletion as variables ([#50](https://github.com/bpmn-io/feel-editor/issues/50))

## 1.3.0

* `FEAT`: allow to pass content attributes

## 1.2.0

* `FEAT`: make error messages contextual
* `DEPS`: update to `feel-lint@1.2.0`
* `DEPS`: update `codemirror` dependencies

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
