import {
  configure as feelCore
} from '../../../src/core';

import { EditorState } from '@codemirror/state';
import { pathExpressionCompletion } from '../../../src/autocompletion/pathExpression';

import { expect } from 'chai';


describe('autocompletion - pathExpression', function() {

  describe('context', function() {

    it('should complete on empty path', function() {

      // given
      const triggerCompletion = setup('foo.', [ {
        name: 'foo',
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const completion = triggerCompletion();

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(4);
      expect(completion.options).to.have.length(1);
      expect(completion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });
    });


    it('should complete while typing', function() {

      // given
      const triggerCompletion = setup('foo.ba', [ {
        name: 'foo',
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const completion = triggerCompletion();

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(4);
      expect(completion.options).to.have.length(1);
      expect(completion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });
    });


    describe('list optional', function() {

      it('should complete on empty path', function() {

        // given
        const triggerCompletion = setup('foo.', [ {
          name: 'foo',
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const completion = triggerCompletion();

        // then
        expect(completion).to.exist;
        expect(completion.from).to.eql(4);
        expect(completion.options).to.have.length(1);
        expect(completion.options[0]).to.eql({
          label: 'bar',
          type: 'variable',
          info: 'info',
          detail: 'detail'
        });
      });


      it('should complete while typing', function() {

        // given
        const triggerCompletion = setup('foo.ba', [ {
          name: 'foo',
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const completion = triggerCompletion();

        // then
        expect(completion).to.exist;
        expect(completion.from).to.eql(4);
        expect(completion.options).to.have.length(1);
        expect(completion.options[0]).to.eql({
          label: 'bar',
          type: 'variable',
          info: 'info',
          detail: 'detail'
        });

      });

    });

  });


  describe('list', function() {

    it('should complete on empty path', function() {

      // given
      const triggerCompletion = setup('foo[0].', [ {
        name: 'foo',
        isList: true,
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const completion = triggerCompletion();

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(7);
      expect(completion.options).to.have.length(1);

      expect(completion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });
    });


    it('should complete while typing', function() {

      // given
      const triggerCompletion = setup('foo[0].ba', [ {
        name: 'foo',
        isList: true,
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const completion = triggerCompletion();

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(7);
      expect(completion.options).to.have.length(1);
      expect(completion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });

    });


    it('should complete when list is part of path', function() {

      // given
      const triggerCompletion = setup('foo.bar[0].ba', [ {
        name: 'foo',
        entries: [
          {
            name: 'bar',
            isList: true,
            entries: [
              {
                name: 'baz',
                info: 'info',
                detail: 'detail'
              }
            ]
          }
        ]
      } ]);

      // when
      const completion = triggerCompletion();

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(11);
      expect(completion.options).to.have.length(1);
      expect(completion.options[0]).to.eql({
        label: 'baz',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });

    });


    describe('list optional', function() {

      it('should complete on empty path', function() {

        // given
        const triggerCompletion = setup('foo[0].', [ {
          name: 'foo',
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const completion = triggerCompletion();

        // then
        expect(completion).to.exist;
        expect(completion.from).to.eql(7);
        expect(completion.options).to.have.length(1);

        expect(completion.options[0]).to.eql({
          label: 'bar',
          type: 'variable',
          info: 'info',
          detail: 'detail'
        });
      });


      it('should complete while typing', function() {

        // given
        const triggerCompletion = setup('foo[0].ba', [ {
          name: 'foo',
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const completion = triggerCompletion();

        // then
        expect(completion).to.exist;
        expect(completion.from).to.eql(7);
        expect(completion.options).to.have.length(1);
        expect(completion.options[0]).to.eql({
          label: 'bar',
          type: 'variable',
          info: 'info',
          detail: 'detail'
        });

      });


      it('should complete when list is part of path', function() {

        // given
        const triggerCompletion = setup('foo.bar[0].ba', [ {
          name: 'foo',
          entries: [
            {
              name: 'bar',
              isList: 'optional',
              entries: [
                {
                  name: 'baz',
                  info: 'info',
                  detail: 'detail'
                }
              ]
            }
          ]
        } ]);

        // when
        const completion = triggerCompletion();

        // then
        expect(completion).to.exist;
        expect(completion.from).to.eql(11);
        expect(completion.options).to.have.length(1);
        expect(completion.options[0]).to.eql({
          label: 'baz',
          type: 'variable',
          info: 'info',
          detail: 'detail'
        });

      });

    });

  });

});


// helpers /////////////////////////////

/**
 * @typedef { import('@codemirror/autocomplete').CompletionResult | null } CompletionResult
 *
 * @typedef { (options?: { pos?: number, explicit?: boolean }) => CompletionResult } CompleteFn
 */

/**
 * @param {string} doc
 * @param {import('../../../src/core').Variable[]} variables
 *
 * @return { CompleteFn }
 */
function setup(doc, variables = []) {

  const completion = pathExpressionCompletion({
    variables
  });

  const state = EditorState.create({
    doc,
    extensions: [
      feelCore({
        variables,
        completions: [
          completion
        ]
      })
    ]
  });

  return ({ pos = doc.length, explicit = false } = { }) => {
    return /** @type {import('@codemirror/autocomplete').CompletionResult} */ (completion(/** @type {import('@codemirror/autocomplete').CompletionContext} */ ({
      state,
      pos,
      explicit,
      tokenBefore: null,
      matchBefore: null,
      aborted: false,
      addEventListener: () => {}
    })));
  };
}