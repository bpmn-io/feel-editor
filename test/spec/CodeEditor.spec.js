import FeelEditor from '../../src';
import TestContainer from 'mocha-test-container-support';
import { EditorSelection } from '@codemirror/state';
import { diagnosticCount, forceLinting } from '@codemirror/lint';


const singleStart = window.__env__ && window.__env__.SINGLE_START;

describe('CodeEditor', function() {

  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });


  (singleStart ? it.only : it)('should render', async function() {

    // when
    const initalValue = `for
  fruit in [ "apple", "bananas" ], vegetable in vegetables
return
  { ingredients: [ fruit, vegetable ] }`;

    const editor = new FeelEditor({
      container,
      value: initalValue
    });

    // then
    expect(editor).to.exist;

  });


  it('should use supplied document', async function() {

    // when
    const initialValue = 'Hello World!';
    const editor = new FeelEditor({
      container,
      value: initialValue
    });

    // then
    expect(editor).to.exist;
    expect(editor._cmEditor.state.doc.toString()).to.equal('Hello World!');
  });


  describe('getter', function() {

    it('should return selection state', function() {

      // given
      const initialValue = '[variable1, variable2]';
      const editor = new FeelEditor({
        container,
        value: initialValue
      });

      // editor._cmEditor.focus();
      editor._cmEditor.dispatch({
        selection: EditorSelection.single(0, 5)
      });

      // when

      const selection = editor.getSelection();

      // then
      expect(selection).to.exist;
      expect(selection.ranges).to.have.length(1);
      expect(selection.ranges[0].from).to.equal(0);
      expect(selection.ranges[0].to).to.equal(5);

    });

  });


  describe('setter', function() {

    it('should accept external change', async function() {

      // given
      const initialValue = 'Hello World!';
      const editor = new FeelEditor({
        container,
        value: initialValue
      });

      // when
      editor.setValue('Changed');

      // then
      expect(editor._cmEditor.state.doc.toString()).to.equal('Changed');
    });


    it('should focus', async function() {

      // given
      const editor = new FeelEditor({
        container
      });

      // assume
      expect(editor._cmEditor.hasFocus).to.be.false;

      // when
      editor.focus();

      // then
      expect(editor._cmEditor.hasFocus).to.be.true;
    });

  });


  describe('callbacks', function() {

    it('should call onChange', async function() {

      // given
      const onChange = sinon.spy();
      const editor = new FeelEditor({
        container,
        onChange
      });

      // when
      editor._cmEditor.dispatch({
        changes: {
          from: 0,
          to: 0,
          insert: 'a',
        }
      });

      // then
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.have.been.calledWith('a');
    });


    it('should call onKeyDown', async function() {

      // given
      const onKeyDown = sinon.spy();
      const editor = new FeelEditor({
        container,
        onKeyDown
      });

      // when
      const event = new KeyboardEvent('keydown');
      editor._cmEditor.contentDOM.dispatchEvent(event);

      // then
      expect(onKeyDown).to.have.been.calledOnce;
      expect(onKeyDown).to.have.been.calledWith(event);
    });

  });


  describe('lint', function() {

    it('should highlight unexpected operations', function(done) {
      const initalValue = '= 15';

      const editor = new FeelEditor({
        container,
        value: initalValue
      });

      const cm = editor._cmEditor;

      // when
      forceLinting(cm);


      // then
      // update done async
      setTimeout(() => {
        expect(diagnosticCount(cm.state)).to.eql(1);
        done();
      }, 0);

    });


    it('should highlight missing operations', function(done) {
      const initalValue = '15 == 15';

      const editor = new FeelEditor({
        container,
        value: initalValue
      });

      const cm = editor._cmEditor;

      // when
      forceLinting(cm);

      // then
      // update done async
      setTimeout(() => {
        expect(diagnosticCount(cm.state)).to.eql(1);
        done();
      }, 0);

    });

  });

});