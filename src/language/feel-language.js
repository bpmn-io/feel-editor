import { parser } from 'lezer-feel';
import { continuedIndent, delimitedIndent, indentNodeProp, LRLanguage } from '@codemirror/language';
import { styleTags, tags as t } from '@lezer/highlight';

const highlightTags = styleTags({
  'Identifier': t.variableName,
  'FunctionInvocation/VariableName/Identifier': t.function(t.variableName),
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