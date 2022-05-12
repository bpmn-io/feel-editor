import { LanguageSupport } from '@codemirror/language';
import { FeelLanguage } from './feel-language';

export function language() {
  return new LanguageSupport(FeelLanguage, [ ]);
}
