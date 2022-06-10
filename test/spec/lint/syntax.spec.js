import FeelEditor from '../../../src';
import TestContainer from 'mocha-test-container-support';
import { FeelLinter } from '../../../src/lint/syntax';

describe('lint - Syntax', function() {
  let container;

  beforeEach(function() {
    container = TestContainer.get(this);
  });

  it('should return syntax error', function() {

    // given
    const editor = new FeelEditor({
      container,
      value: '= 12'
    });

    const cm = editor._cmEditor;

    // when
    const results = FeelLinter(cm);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].source).to.eql('syntaxError');
    expect(results[0].message).to.eql('unexpected CompareOp');

  });


  it('should return 0-width syntax error', function() {

    // given
    const editor = new FeelEditor({
      container,
      value: '12 == 12'
    });

    const cm = editor._cmEditor;

    // when
    const results = FeelLinter(cm);

    // then
    expect(results).to.have.length(1);
    expect(results[0].severity).to.eql('error');
    expect(results[0].source).to.eql('syntaxError');
    expect(results[0].message).to.eql('expression expected');

  });

});