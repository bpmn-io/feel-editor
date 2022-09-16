const glob = require('glob');
const { marked } = require('marked');
const fs = require('node:fs/promises');

// paths relative to CWD
const MARKDOWN_SRC = './camunda-platform-docs/versioned_docs/version-8.0/components/modeler/feel/builtin-functions/*.md';
const JSON_DEST = './src/autocompletion/builtins.json';

glob(MARKDOWN_SRC, function(err, files) {

  const descriptorsByFile = files.map(fileName => (
    fs.readFile(fileName, 'utf-8').then(content => {
      const rawDescriptors = content.split('## ');

      // remove header
      rawDescriptors.shift();

      return rawDescriptors.flatMap(string => {
        const name = string.split('\n')[0];
        const description = marked.parse(string.split('\n').slice(1).join('\n'));

        // e.g. "and() / all()"
        if (name.includes('/')) {
          const names = name.split(' / ');
          return names.map(_name => ({ name: _name, description }));
        }

        return { name, description };
      });
    })
  ));

  Promise.all(descriptorsByFile).then(values => {
    const allDescriptors = values.flat();

    fs.writeFile(JSON_DEST, JSON.stringify(allDescriptors, null, 2));
  });
});