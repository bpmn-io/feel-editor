import { language } from '../../../src/language';
import { EditorState } from '@codemirror/state';
import { completions } from '../../../src/autocompletion/pathExpressions';
import { variablesFacet } from '../../../src/autocompletion/VariableFacet';


describe('autocompletion - pathExpressions', function() {

  describe('context', function() {

    it('should suggest on empty path', function() {

      // given
      const context = createContext('foo.', [ {
        name: 'foo',
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = completions(context);

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
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = completions(context);

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


    describe('list optional', function() {

      it('should suggest on empty path', function() {

        // given
        const context = createContext('foo.', [ {
          name: 'foo',
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const autoCompletion = completions(context);

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
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const autoCompletion = completions(context);

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

  });


  describe('list', function() {

    it('should suggest on empty path', function() {

      // given
      const context = createContext('foo[0].', [ {
        name: 'foo',
        isList: true,
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = completions(context);

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
        entries: [
          {
            name: 'bar',
            info: 'info',
            detail: 'detail'
          }
        ]
      } ]);

      // when
      const autoCompletion = completions(context);

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


    it('should suggest when list is part of path', function() {

      // given
      const context = createContext('foo.bar[0].ba', [ {
        name: 'foo',
        entries: [
          {
            name: 'bar',
            isList: true,
            entries: [
              {
                name: 'baz',
                info: 'info',
                detail: 'detail'
              }
            ]
          }
        ]
      } ]);

      // when
      const autoCompletion = completions(context);

      // then
      expect(autoCompletion).to.exist;
      expect(autoCompletion.from).to.eql(11);
      expect(autoCompletion.options).to.have.length(1);
      expect(autoCompletion.options[0]).to.eql({
        label: 'baz',
        type: 'variable',
        info: 'info',
        detail: 'detail'
      });

    });


    describe('list optional', function() {

      it('should suggest on empty path', function() {

        // given
        const context = createContext('foo[0].', [ {
          name: 'foo',
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const autoCompletion = completions(context);

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
          isList: 'optional',
          entries: [
            {
              name: 'bar',
              info: 'info',
              detail: 'detail'
            }
          ]
        } ]);

        // when
        const autoCompletion = completions(context);

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


      it('should suggest when list is part of path', function() {

        // given
        const context = createContext('foo.bar[0].ba', [ {
          name: 'foo',
          entries: [
            {
              name: 'bar',
              isList: 'optional',
              entries: [
                {
                  name: 'baz',
                  info: 'info',
                  detail: 'detail'
                }
              ]
            }
          ]
        } ]);

        // when
        const autoCompletion = completions(context);

        // then
        expect(autoCompletion).to.exist;
        expect(autoCompletion.from).to.eql(11);
        expect(autoCompletion.options).to.have.length(1);
        expect(autoCompletion.options[0]).to.eql({
          label: 'baz',
          type: 'variable',
          info: 'info',
          detail: 'detail'
        });

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