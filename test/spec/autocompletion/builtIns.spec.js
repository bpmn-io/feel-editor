import { language } from '../../../src/language';
import { EditorState } from '@codemirror/state';
import builtIns from '../../../src/autocompletion/builtIns';

describe('autocompletion - builtIns', function() {

  it('should return variable suggestions in correct format', function() {

    // given
    const context = createContext('Foo');

    // when
    const autoCompletion = builtIns(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.options).to.have.length(84);

    const firstOption = autoCompletion.options[0];

    expect(typeof firstOption.label).to.eql('string');
    expect(typeof firstOption.type).to.eql('string');
    expect(typeof firstOption.info).to.eql('function');
    expect(typeof firstOption.apply).to.eql('function');
  });


  it('should render info', function() {

    // given
    const context = createContext('Foo');
    const autoCompletion = builtIns(context);

    // assume
    expect(autoCompletion.options).to.exist;

    // when
    const infoHtml = autoCompletion.options.map(option => option.info());

    // then
    infoHtml.forEach(info => {
      expect(info).to.exist;

      // contains parameter list
      expect(info.textContent.toLowerCase()).to.have.include('parameters');

      // contains example
      expect(info.querySelector('pre')).to.exist;

    });
  });


  it('should not return suggestions for empty context', function() {

    // given
    const context = createContext('');

    // when
    const autoCompletion = builtIns(context);

    // then
    expect(autoCompletion).to.not.exist;
  });


  it('should return suggestions when explicitly requested', function() {

    // given
    const context = createContext('', true);

    // when
    const autoCompletion = builtIns(context);

    // then
    expect(autoCompletion).to.exist;
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