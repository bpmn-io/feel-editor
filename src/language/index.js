import { feel } from 'lang-feel';

/**
 * @param {'expression' | 'unaryTests'} dialect
 *
 * @return {LanguageSupport}
 */
export function language(dialect) {
  return feel(dialect);
}
