import { LanguageSupport } from '@codemirror/language';
import { feelLanguage } from 'lang-feel';

export function language() {
  return new LanguageSupport(feelLanguage, [ ]);
}
