import {
  configure as feelCore
} from '../../../src/core';

import { EditorState } from '@codemirror/state';
import { variableCompletion } from '../../../src/autocompletion/variable';


describe('autocompletion - variable', function() {

  describe('should complete', function() {

    it('variable', function() {

      // given
      const triggerCompletion = setup('foo', [ {
        name: 'foobar',
        info: 'info',
        detail: 'detail'
      } ]);

      // when
      const completion = triggerCompletion(context);

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(0);
      expect(completion.options).to.have.length(1);

      expect(completion.options[0]).to.eql({
        label: 'foobar',
        type: 'variable',
        info: 'info',
        detail: 'detail',
        boost: 5
      });
    });


    it('function', function() {

      // given
      const triggerCompletion = setup('foo', [ {
        type: 'function',
        name: 'foobar',
        info: 'info',
        detail: 'string',
        params: [
          {
            name: 'param1',
            type: 'string',
          },
          {
            name: 'param1'
          }
        ]
      } ]);

      // when
      const completion = triggerCompletion();

      // then
      expect(completion).to.exist;
      expect(completion.from).to.eql(0);
      expect(completion.options).to.have.length(1);

      const firstOption = completion.options[0];
      expect(firstOption.type).to.eql('function');
      expect(firstOption.info).to.eql('info');
      expect(firstOption.detail).to.eql('string');
      expect(typeof firstOption.apply).to.eql('function');
    });

  });


  it('should complete current', function() {

    // given
    const triggerCompletion = setup('15 + foo', [
      { name: 'foobar' },
      { name: 'other' }
    ]);

    // when
    const completion = triggerCompletion();

    // then
    expect(completion).to.exist;
    expect(completion.from).to.eql(5);
    expect(completion.options).to.have.length(1);
  });


  it('should not complete path expression', function() {

    // given
    const triggerCompletion = setup('myObject.fo', [ { name: 'foobar' } ]);

    // when
    const completion = triggerCompletion(context);

    // then
    expect(completion).not.to.exist;
  });


  it('should not complete empty expression', function() {

    // given
    const triggerCompletion = setup('', [ { name: 'foobar' } ]);

    // when
    const completion = triggerCompletion();

    // then
    expect(completion).not.to.exist;
  });


  it('should complete empty expression (explicitly requested)', function() {

    // given
    const triggerCompletion = setup('', [ { name: 'foobar' } ]);

    // when
    const completion = triggerCompletion({ explicit: true });

    // then
    expect(completion).to.exist;
    expect(completion.from).to.eql(0);
  });


  it('should complete partial expression', function() {

    // given
    const triggerCompletion = setup('abs(', [ { name: 'a' } ]);

    // when
    const completion = triggerCompletion({ explicit: true });

    // then
    expect(completion).to.exist;
    expect(completion.from).to.eql(4);
    expect(completion.options).to.have.length(1);
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

  const completion = variableCompletion({
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
    return completion({
      state,
      pos,
      explicit
    });
  };
}