import {
  configure as feelCore
} from '../../../src/core';

import { EditorState } from '@codemirror/state';
import { variableCompletion } from '../../../src/autocompletion/variable';
import { domifiedBuiltins } from '../../../src/builtins';


describe('autocompletion - built-ins', function() {

  it('should complete in correct format', function() {

    // given
    const triggerCompletion = setup('get', [
      {
        name: 'name',
        type: 'variable',
        info: 'info'
      }
    ]);

    // when
    const completion = triggerCompletion();

    // then
    expect(completion).to.exist;
    expect(completion.options).to.have.length(1);

    expect(completion.options[0]).to.include({
      label: 'name',
      type: 'variable',
      info: 'info'
    });
  });


  it('should complete parameterless builtin <now>', function() {

    // given
    const triggerCompletion = setup('now');

    // when
    const completion = triggerCompletion({ pos: 3, explicit: true });

    // then
    expect(completion).to.exist;

    const nowSuggestion = completion.options.find(option => option.label.startsWith('now'));
    expect(nowSuggestion).to.exist;
    expect(nowSuggestion).to.include({
      label: 'now()'
    });
  });


  it('should render info', function() {

    // given
    const triggerCompletion = setup('Foo');
    const completion = triggerCompletion();

    // assume
    expect(completion.options).to.exist;

    // when
    const infoHtml = completion.options.map(option => option.info());

    // then
    infoHtml.forEach(info => {
      expect(info).to.exist;

      // contains parameter list
      expect(info.textContent.toLowerCase()).to.have.include('function signature');

      // contains example
      expect(info.querySelector('pre')).to.exist;

    });

  });


  it('should complete with space (<get or else>)', function() {

    const triggerCompletion = setup('get', [
      {
        name: 'get or else',
        type: 'function',
        params: [
          { name: 'value' },
          { name: 'default' }
        ]
      }
    ]);

    // when
    const completion = triggerCompletion();

    // then
    expect(completion).to.exist;
  });


  it('should not complete for empty context', function() {

    // given
    const triggerCompletion = setup('');

    // when
    const completion = triggerCompletion();

    // then
    expect(completion).to.not.exist;
  });


  it('should complete when explicitly requested', function() {

    // given
    const triggerCompletion = setup('');

    // when
    const completion = triggerCompletion({ explicit: true });

    // then
    expect(completion).to.exist;
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
 * @param {import('../../../src/core').Variable[]} builtins
 *
 * @return { CompleteFn }
 */
function setup(doc, builtins = domifiedBuiltins) {

  const completion = variableCompletion({
    builtins
  });

  const state = EditorState.create({
    doc,
    extensions: [
      feelCore({
        builtins,
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