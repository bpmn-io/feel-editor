import { parser } from 'lezer-feel';
import { continuedIndent, delimitedIndent, indentNodeProp, LRLanguage } from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

const highlightTags = styleTags({
  VariableName: t.variableName,
  NumericLiteral: t.number,
  QualifiedName: t.name,
  Name: t.name,
  BooleanLiteral: t.bool,
  StringLiteral: t.string,
  LineComment: t.lineComment,
  BlockComment: t.blockComment,
  '( )': t.paren,
  BuiltInFunctionName: t.function(t.variableName),
  BuiltInType: t.function(t.variableName),
  ListType: t.function(t.variableName),
  ContextType: t.function(t.variableName),
  FunctionType: t.function(t.variableName),
  DateAndTime: t.function(t.variableName),
  'DateTimeConstructor!': t.function(t.variableName),
  'for in return null': t.atom,
  List: t.list,
  Interval: t.list
});

const parserWithMetadata = parser.configure({
  props: [
    highlightTags,
    indentNodeProp.add({
      'Context': delimitedIndent({
        closing: '}'
      }),
      'List FilterExpression': delimitedIndent({
        closing: ']'
      }),
      'FunctionInvocation ParenthesizedExpression': delimitedIndent({
        closing: ')'
      }),
      'ForExpression QuantifiedExpression IfExpression': continuedIndent({
        except: /^\s*(then|else|return|satisfies)\b/
      })
    })
  ]
});

export const FeelLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    indentOnInput: /^\s*(\)|\}|\]|then|else|return|satisfies)$/
  }
});