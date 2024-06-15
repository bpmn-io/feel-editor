import {
  configure as feelCore
} from '../../../src/core';

import { EditorState } from '@codemirror/state';
import { variableCompletion } from '../../../src/autocompletion/variable';

import {
  camunda as camundaBuiltins
} from '../../../src/builtins';


describe('autocompletion - built-ins', function() {

  it('should complete in correct format', function() {

    // given
    const triggerCompletion = setup('get');

    // when
    const autoCompletion = triggerCompletion();

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.options).to.have.length(4);

    const firstOption = autoCompletion.options[0];

    expect(typeof firstOption.label).to.eql('string');
    expect(typeof firstOption.type).to.eql('string');
    expect(typeof firstOption.info).to.eql('function');
    expect(typeof firstOption.apply).to.eql('function');

    expect(autoCompletion.options.map(o => o.label)).to.eql([
      'get or else(value, default)',
      'get value(context, key)',
      'get value(context, keys)',
      'get entries(context)'
    ]);
  });


  it('should render info', function() {

    // given
    const triggerCompletion = setup('Foo');
    const autoCompletion = triggerCompletion();

    // assume
    expect(autoCompletion.options).to.exist;

    // when
    const infoHtml = autoCompletion.options.map(option => option.info());

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
function setup(doc, builtins = camundaBuiltins) {

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