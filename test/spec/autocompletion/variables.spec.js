import {
  language,
  createContext as createLanguageContext
} from '../../../src/language';
import { EditorState } from '@codemirror/state';
import { completions } from '../../../src/autocompletion/variables';
import { variablesFacet } from '../../../src/facets';


describe('autocompletion - variables', function() {

  describe('should complete', function() {

    it('variable', function() {

      // given
      const context = createContext('foo', [ {
        name: 'foobar',
        info: 'info',
        detail: 'detail'
      } ]);

      // when
      const autoCompletion = completions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(0);
      expect(autoCompletion.options).to.have.length(1);

      expect(autoCompletion.options[0]).to.eql({
        label: 'foobar',
        type: 'variable',
        info: 'info',
        detail: 'detail',
        boost: 5
      });
    });


    it('function', function() {

      // given
      const context = createContext('foo', [ {
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
      const autoCompletion = completions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(0);
      expect(autoCompletion.options).to.have.length(1);

      const firstOption = autoCompletion.options[0];
      expect(firstOption.type).to.eql('function');
      expect(firstOption.info).to.eql('info');
      expect(firstOption.detail).to.eql('string');
      expect(typeof firstOption.apply).to.eql('function');
    });

  });


  it('should complete current', function() {

    // given
    const context = createContext('15 + foo', [
      { name: 'foobar' },
      { name: 'other' }
    ]);

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(5);
    expect(autoCompletion.options).to.have.length(1);
  });


  it('should not complete path expression', function() {

    // given
    const context = createContext('myObject.fo', [ { name: 'foobar' } ]);

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).not.to.exist;
  });


  it('should not complete empty expression', function() {

    // given
    const context = createContext('', [ { name: 'foobar' } ]);

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).not.to.exist;
  });


  it('should complete empty expression (explicitly requested)', function() {

    // given
    const context = createContext('', [ { name: 'foobar' } ], true);

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(0);
  });


  it('should complete partial expression', function() {

    // given
    const context = createContext('abs(', [ { name: 'a' } ], true);

    // when
    const autoCompletion = completions(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(4);
    expect(autoCompletion.options).to.have.length(1);
  });

});


// helpers /////////////////////////////

function createContext(doc, variables = [], explicit = false, pos = doc.length) {
  const state = EditorState.create({
    doc,
    extensions: [
      variablesFacet.of(variables),
      language({
        context: createLanguageContext(variables)
      })
    ]
  });

  return {
    state,
    pos,
    explicit
  };
}