import { language } from '../../../src/language';
import { EditorState } from '@codemirror/state';
import pathExpressions from '../../../src/autocompletion/pathExpressions';
import { variablesFacet } from '../../../src/autocompletion/VariableFacet';


describe('autocompletion - pathExpressions', function() {

  describe('paths', function() {

    it('should suggest on empty path', function() {

      // given
      const context = createContext('foo.', [ {
        name: 'foo',
        schema: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = pathExpressions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(4);
      expect(autoCompletion.options).to.have.length(1);
      expect(autoCompletion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });
    });


    it('should suggest while typing', function() {

      // given
      const context = createContext('foo.ba', [ {
        name: 'foo',
        schema: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = pathExpressions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(4);
      expect(autoCompletion.options).to.have.length(1);
      expect(autoCompletion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });

    });

  });


  describe('lists', function() {

    it('should suggest on empty path', function() {

      // given
      const context = createContext('foo[0].', [ {
        name: 'foo',
        isList: true,
        schema: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = pathExpressions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(7);
      expect(autoCompletion.options).to.have.length(1);

      expect(autoCompletion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });
    });


    it('should suggest while typing', function() {

      // given
      const context = createContext('foo[0].ba', [ {
        name: 'foo',
        isList: true,
        schema: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = pathExpressions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(7);
      expect(autoCompletion.options).to.have.length(1);
      expect(autoCompletion.options[0]).to.eql({
        label: 'bar',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });

    });

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