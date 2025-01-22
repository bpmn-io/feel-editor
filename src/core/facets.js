import { Facet } from '@codemirror/state';

/**
 * @typedef { import('../language').Dialect } Dialect
 * @typedef { import('../language').ParserDialect } ParserDialect
 * @typedef { import('..').Variable } Variable
 */

/**
 * @type {Facet<Variable[]>}
 */
export const builtinsFacet = Facet.define();

/**
 * @type {Facet<Variable[]>}
 */
export const variablesFacet = Facet.define();

/**
 * @type {Facet<Dialect>}
 */
export const dialectFacet = Facet.define();

/**
 * @type {Facet<ParserDialect>}
 */
export const parserDialectFacet = Facet.define();

