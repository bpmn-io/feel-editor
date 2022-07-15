import { language } from '../../../src/language';
import { EditorState } from '@codemirror/state';
import variables from '../../../src/autocompletion/variables';

describe('autocompletion - variables', function() {

  it('should return variable suggestions in correct format', function() {

    // given
    const completionSource = variables([ {
      name: 'foobar',
      info: 'info',
      detail: 'detail'
    } ]);

    const context = createContext('foo');

    // when
    const autoCompletion = completionSource(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(0);
    expect(autoCompletion.options).to.have.length(1);
    expect(autoCompletion.options[0]).to.eql({
      label: 'foobar',
      type: 'variable',
      info: 'info',
      detail: 'detail'
    });
  });


  it('should suggest for current variable', function() {

    // given
    const completionSource = variables([ { name: 'foobar' } ]);
    const context = createContext('15 + foo');

    // when
    const autoCompletion = completionSource(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(5);
    expect(autoCompletion.options).to.have.length(1);
  });


  it('should not suggest on path expressions', function() {

    // given
    const completionSource = variables([ { name: 'foobar' } ]);
    const context = createContext('myObject.fo', 11);

    // when
    const autoCompletion = completionSource(context);

    // then
    expect(autoCompletion).not.to.exist;
  });


  it('should not suggest on empty expression', function() {

    // given
    const completionSource = variables([ { name: 'foobar' } ]);
    const context = createContext('');

    // when
    const autoCompletion = completionSource(context);

    // then
    expect(autoCompletion).not.to.exist;
  });


  it('should suggest on empty expression when explicitly requested', function() {

    // given
    const completionSource = variables([ { name: 'foobar' } ]);
    const context = createContext('', true);

    // when
    const autoCompletion = completionSource(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(0);
  });


  it('should suggest on empty expression when explicitly requested', function() {

    // given
    const completionSource = variables([ { name: 'foobar' } ]);
    const context = createContext('', true);

    // when
    const autoCompletion = completionSource(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(0);
  });

});


// helpers /////////////////////////////

function createContext(doc, explicit = false) {
  const state = EditorState.create({
    doc,
    extensions: [ language() ]
  });

  return {
    state,
    pos:  doc.length,
    explicit
  };
}