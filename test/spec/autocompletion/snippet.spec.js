import {
  configure as feelCore
} from '../../../src/core/index.js';

import { EditorState } from '@codemirror/state';
import { CompletionContext } from '@codemirror/autocomplete';
import { snippetCompletions } from '../../../src/autocompletion/snippets.js';

import { expect } from 'chai';


describe('autocompletion - snippets', function() {

  it('should complete empty', async function() {

    // given
    const triggerCompletion = setup('');

    // when
    const completion = await triggerCompletion({ explicit: true });

    // then
    expect(completion).to.exist;
    expect(completion.from).to.eql(0);
    expect(completion.options).to.have.length(9);
    expect(completion.options[0]).to.include({
      label: 'function',
      type: 'keyword',
      detail: 'definition'
    });
  });


  it('should complete arithmetic expression', async function() {

    // given
    const triggerCompletion = setup('a + ');

    // when
    const completion = await triggerCompletion({ pos: 3, explicit: true });

    // then
    expect(completion).to.exist;
    expect(completion.from).to.eql(3);
    expect(completion.options).to.have.length(9);
    expect(completion.options[0]).to.include({
      label: 'function',
      type: 'keyword',
      detail: 'definition'
    });
  });


  it('should complete partial', async function() {

    // given
    const triggerCompletion = setup('n');

    // when
    const completion = await triggerCompletion({ pos: 1 });

    // then
    expect(completion).to.exist;
    expect(completion.from).to.eql(0);
    expect(completion.options).to.have.length(9);
    expect(completion.options[0]).to.include({
      label: 'function',
      type: 'keyword',
      detail: 'definition'
    });
  });


  it('should not complete in path expression path name', async function() {

    // given
    const triggerCompletion = setup('myObject.nu');

    // when
    const completion = await triggerCompletion();

    // then
    expect(completion).not.to.exist;
  });


  describe('should not complete in path expression after dot', function() {

    it('active', async function() {

      // given
      const triggerCompletion = setup('myObject.foo.');

      // when
      const completion = await triggerCompletion();

      // then
      expect(completion).not.to.exist;
    });


    it('explicit', async function() {

      // given
      const triggerCompletion = setup('myObject.foo.');

      // when
      const completion = await triggerCompletion({ explicit: true });

      // then
      expect(completion).not.to.exist;
    });

  });

});


// helpers /////////////////////////////

/**
 * @typedef { import('@codemirror/autocomplete').CompletionResult } CompletionResult
 *
 * @typedef { (options?: { pos?: number, explicit?: boolean }) => CompletionResult | null | Promise<CompletionResult | null> } CompleteFn
 */

/**
 * @param {string} doc
 *
 * @return { CompleteFn }
 */
function setup(doc) {

  const completion = snippetCompletions();

  const state = EditorState.create({
    doc,
    extensions: [
      feelCore({
        completions: [
          completion
        ]
      })
    ]
  });

  return ({ pos = doc.length, explicit = false } = { }) => {
    return completion(new CompletionContext(state, pos, explicit));
  };
}
