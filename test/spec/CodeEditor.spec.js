import { FeelEditor } from '../../src';

const singleStart = window.__env__ && window.__env__.SINGLE_START;

describe('CodeEditor', function() {

  const container = document.body;

  (singleStart ? it.only : it)('should render', async function() {

    // when
    const editor = new FeelEditor({
      container
    });

    // then
    expect(editor).to.exist;

  });

});