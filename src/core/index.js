import { isCompatible } from '@bpmn-io/semver-compat';

import { completions as feelCompletions } from '../autocompletion/index.js';

import { createContext, language } from '../language/index.js';

import lintExtension from '../lint/index.js';

import {
  variablesFacet,
  builtinsFacet,
  parserDialectFacet,
  dialectFacet,
  enginesFacet
} from './facets.js';


/**
 * @typedef {object} Variable
 * @property {string} name name or key of the variable
 * @property {string | (() => HTMLElement)} [info] short information about the variable, e.g. type
 * @property {string} [detail] longer description of the variable content
 * @property {boolean|'optional'} [isList] whether the variable is a list
 * @property {Array<Variable>} [entries] array of child variables if the variable is a context or list
 * @property {'function'|'variable'} [type] type of the variable
 * @property {Array<{name: string, type?: string}>} [params] function parameters
 * @property {Record<string, string>} [engines] engine version requirements, e.g. `{ camunda: '>=8.9' }`
 */

/**
 * @typedef { {
 *   dialect?: import('../language').Dialect,
 *   parserDialect?: import('../language').ParserDialect,
 *   variables?: Variable[],
 *   builtins?: Variable[],
 *   engines?: Record<string, string>
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
  engines,
  completions
}) {

  // parse + lint against ALL built-ins so incompatible calls still parse and
  // get flagged; only suggest the ones available in the target engine(s)
  const context = createContext([ ...variables, ...builtins ]);

  const completionSources = completions ?? feelCompletions({
    builtins: availableBuiltins(builtins, engines),
    variables
  });

  return [
    dialectFacet.of(dialect),
    builtinsFacet.of(builtins),
    variablesFacet.of(variables),
    parserDialectFacet.of(parserDialect),
    enginesFacet.of(engines),
    language({
      dialect,
      parserDialect,
      context,
      completions: completionSources
    }),
    lintExtension({
      builtins,
      engines
    })
  ];
}

/**
 * Built-ins available in the target engine(s); when no engines are configured,
 * all built-ins are available.
 *
 * @param {Variable[]} builtins
 * @param {Record<string, string>} [engines]
 *
 * @return {Variable[]}
 */
function availableBuiltins(builtins, engines) {
  if (!engines || !Object.keys(engines).length) {
    return builtins;
  }

  return builtins.filter(builtin => !builtin.engines || isCompatible(builtin.engines, engines));
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
  const engines = state.facet(enginesFacet)[0];

  return {
    builtins,
    variables,
    dialect,
    parserDialect,
    engines
  };
}