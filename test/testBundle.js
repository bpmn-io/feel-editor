import('./globals.js');

// @ts-ignore-next-line
const allTests = import.meta.webpackContext('.', {
  recursive: true,
  regExp: /.spec\.js$/
});

allTests.keys().forEach(allTests);