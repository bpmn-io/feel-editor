import { Facet } from '@codemirror/state';

/**
 * @typedef { 'expression' | 'unaryTests' } Dialect
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
 * @type {Facet<dialect>}
 */
export const dialectFacet = Facet.define();