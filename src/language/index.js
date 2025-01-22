import { feel } from 'lang-feel';

/**
 * @typedef { 'expression' | 'unaryTests' } Dialect
 */

/**
 * @typedef { 'camunda' | undefined } ParserDialect
 */

/**
 * @param { {
 *   dialect?: Dialect,
 *   parserDialect?: ParserDialect,
 *   context?: Record<string, any>,
 *   completions?: import('@codemirror/autocomplete').CompletionSource[]
 * } } options
 *
 * @return { import('@codemirror/language').LanguageSupport }
 */
export function language(options) {
  return feel(options);
}

/**
 * @param { import('../core').Variable[] } variables
 *
 * @return {Record<string, any>}
 */
export function createContext(variables) {
  return variables.slice().reverse().reduce((context, builtin) => {
    context[builtin.name] = () => {};

    return context;
  }, {});
}