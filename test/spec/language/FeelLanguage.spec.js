import TestContainer from 'mocha-test-container-support';
import FeelEditor from '../../../src';

import userEvent from '@testing-library/user-event';

describe('feel language', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  describe('brackets', function() {

    const needsEscaping = [ '{', '[' ];

    [ '{}', '()', '[]', '""' ].forEach(([ opening, closing ]) => {

      it('should auto-close brackets', function(done) {

        // given
        const callback = function(newValue) {

          // expect
          expect(newValue).to.equal(opening + closing);
          done();
        };

        new FeelEditor({
          container,
          onChange: callback
        });

        // when
        // special braces need to be escaped in userEvent.type
        const toType = needsEscaping.includes(opening) ? opening + opening : opening;
        typeValue(container, toType);

      });


      it('should not close on external change', function() {

        // given
        const editor = new FeelEditor({
          container
        });

        // when
        editor.setValue(opening);

        // then
        expect(editor._cmEditor.state.doc.toString()).to.equal(opening);
      });

    });

  });


  describe('indentation', function() {

    it('should automatically indent list', function(done) {

      // given
      const callback = debounce(function(newValue) {

        // expect
        expect(newValue).to.equal('[\n  foo,\n  bar\n]');
        done();
      });

      new FeelEditor({
        container,
        onChange: callback
      });

      // when
      typeValue(container, '[[{enter}foo,{enter}bar');
    });


    it('should automatically indent context', function(done) {

      // given
      const callback = debounce(function(newValue) {

        // expect
        expect(newValue).to.equal('{\n  foo: "bar"\n}');
        done();
      });

      new FeelEditor({
        container,
        onChange: callback
      });

      // when
      typeValue(container, '{{{enter}foo: "bar"');
    });


    it('should indent for loop', function(done) {

      // given
      const callback = debounce(function(newValue) {

        // expect
        expect(newValue).to.equal('for\n  foo in bar\nreturn\n  baz');
        done();
      });

      new FeelEditor({
        container,
        onChange: callback
      });

      // when
      typeValue(container, 'for{enter}foo in bar{enter}return{enter}baz');
    });


    it('should indent function', function(done) {

      // given
      const callback = debounce(function(newValue) {

        // expect
        expect(newValue).to.equal('foo(\n   bar\n)');
        done();
      });

      new FeelEditor({
        container,
        onChange: callback
      });

      // when
      typeValue(container, 'foo({enter}bar');
    });
  });

});


// helpers /////////////////////////////

async function typeValue(editor, value) {
  const textbox = editor.querySelector('[role="textbox"]');

  userEvent.type(textbox, value);
}


function debounce(func, timeout = 25) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}