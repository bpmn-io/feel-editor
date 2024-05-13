import { language } from '../../../src/language';
import { EditorState } from '@codemirror/state';
import variables from '../../../src/autocompletion/variables';
import { variablesFacet } from '../../../src/autocompletion/VariableFacet';


describe('autocompletion - variables', function() {

  it('should return variable suggestions in correct format', function() {

    // given
    const context = createContext('foo', [ {
      name: 'foobar',
      info: 'info',
      detail: 'detail'
    } ]);

    // when
    const autoCompletion = variables(context);

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
    const context = createContext('15 + foo', [ { name: 'foobar' } ]);

    // when
    const autoCompletion = variables(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(5);
    expect(autoCompletion.options).to.have.length(1);
  });


  it('should not suggest on path expressions', function() {

    // given
    const context = createContext('myObject.fo', [ { name: 'foobar' } ]);

    // when
    const autoCompletion = variables(context);

    // then
    expect(autoCompletion).not.to.exist;
  });


  it('should not suggest on empty expression', function() {

    // given
    const context = createContext('', [ { name: 'foobar' } ]);

    // when
    const autoCompletion = variables(context);

    // then
    expect(autoCompletion).not.to.exist;
  });


  it('should suggest on empty expression when explicitly requested', function() {

    // given
    const context = createContext('', [ { name: 'foobar' } ], true);

    // when
    const autoCompletion = variables(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(0);
  });


  it('should suggest on empty expression when explicitly requested', function() {

    // given
    const context = createContext('', [ { name: 'foobar' } ], true);

    // when
    const autoCompletion = variables(context);

    // then
    expect(autoCompletion).to.exist;
    expect(autoCompletion.from).to.eql(0);
  });


  it('should return function suggestions in correct format', function() {

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
    const autoCompletion = variables(context);

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


// helpers /////////////////////////////

function createContext(doc, variables = [], explicit = false) {
  const state = EditorState.create({
    doc,
    extensions: [
      variablesFacet.of(variables),
      language()
    ]
  });

  return {
    state,
    pos:  doc.length,
    explicit
  };
}