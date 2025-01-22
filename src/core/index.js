import { completions as feelCompletions } from '../autocompletion';

import { createContext, language } from '../language';

import {
  variablesFacet,
  builtinsFacet,
  parserDialectFacet,
  dialectFacet
} from './facets';


/**
 * @typedef {object} Variable
 * @property {string} name name or key of the variable
 * @property {string} [info] short information about the variable, e.g. type
 * @property {string} [detail] longer description of the variable content
 * @property {boolean} [isList] whether the variable is a list
 * @property {Array<Variable>} [schema] array of child variables if the variable is a context or list
 * @property {'function'|'variable'} [type] type of the variable
 * @property {Array<{name: string, type: string}>} [params] function parameters
 */

/**
 * @typedef { {
 *   dialect?: import('../language').Dialect,
 *   parserDialect?: import('../language').ParserDialect,
 *   variables?: Variable[],
 *   builtins?: Variable[]
 * } } CoreConfig
 *
 * @typedef { import('@codemirror/autocomplete').CompletionSource } CompletionSource
 * @typedef { import('@codemirror/state').Extension } Extension
 */

/**
 * @param { CoreConfig & { completions?: CompletionSource[] } } config
 *
 * @return { Extension  }
 */
export function configure({
  dialect = 'expression',
  parserDialect,
  variables = [],
  builtins = [],
  completions = feelCompletions({ builtins, variables })
}) {

  const context = createContext([ ...variables, ...builtins ]);

  return [
    dialectFacet.of(dialect),
    builtinsFacet.of(builtins),
    variablesFacet.of(variables),
    parserDialectFacet.of(parserDialect),
    language({
      dialect,
      parserDialect,
      context,
      completions
    })
  ];
}

/**
 * @param {import('@codemirror/state').EditorState } state
 *
 * @return { CoreConfig }
 */
export function get(state) {

  const builtins = state.facet(builtinsFacet)[0];
  const variables = state.facet(variablesFacet)[0];
  const dialect = state.facet(dialectFacet)[0];
  const parserDialect = state.facet(parserDialectFacet)[0];

  return {
    builtins,
    variables,
    dialect,
    parserDialect
  };
}