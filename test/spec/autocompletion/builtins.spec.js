import {
  language,
  createContext as createLanguageContext
} from '../../../src/language';
import { EditorState } from '@codemirror/state';
import { completions } from '../../../src/autocompletion/builtins';


describe('autocompletion - builtins', function() {

  it('should return variable suggestions in correct format', function() {

    // given
    const context = createContext('Foo');

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.options).to.have.length(120);

    const firstOption = autoCompletion.options[0];

    expect(typeof firstOption.label).to.eql('string');
    expect(typeof firstOption.type).to.eql('string');
    expect(typeof firstOption.info).to.eql('function');
    expect(typeof firstOption.apply).to.eql('function');
  });


  it('should render info', function() {

    // given
    const context = createContext('Foo');
    const autoCompletion = completions(context);

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


  it('should not return suggestions for empty context', function() {

    // given
    const context = createContext('');

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).to.not.exist;
  });


  it('should return suggestions when explicitly requested', function() {

    // given
    const context = createContext('', true);

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).to.exist;
  });

});


// helpers /////////////////////////////

function createContext(doc, builtins = [], explicit = false, pos = doc.length) {
  const state = EditorState.create({
    doc,
    extensions: [
      builtinsFacet.of(builtins),
      language({
        context: createLanguageContext(builtins)
      })
    ]
  });

  return {
    state,
    pos,
    explicit
  };
}