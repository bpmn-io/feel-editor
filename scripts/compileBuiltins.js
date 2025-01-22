const { glob } = require('glob');
const { marked } = require('marked');
const { readFile, writeFile } = require('node:fs/promises');

// paths relative to CWD
const MARKDOWN_SRC = './camunda-platform-docs/docs/components/modeler/feel/builtin-functions/*.md';
const JSON_DEST = './src/builtins/camunda.json';

glob(MARKDOWN_SRC).then(files => {

  const descriptorsByFile = files.sort().map(fileName => (
    readFile(fileName, 'utf-8').then(content => {
      const rawDescriptors = content.split('## ');

      // remove header
      rawDescriptors.shift();

      return rawDescriptors.flatMap(string => {
        const name = string.split('\n')[0];
        let description = marked.parse(string.split('\n').slice(1).join('\n'));

        description = description.replace('<MarkerCamundaExtension></MarkerCamundaExtension>', '<em>Camunda Extension</em>');

        // e.g. "and() / all()"
        if (name.includes('/')) {
          const names = name.split(' / ');
          return names.map(_name => ({ name: _name, description }));
        }

        return { name, description };
      });
    })
  ));

  return Promise.all(descriptorsByFile).then(values => {
    const allDescriptors = values.flat();

    return writeFile(JSON_DEST, JSON.stringify(allDescriptors, null, 2));
  });
}).catch(err => {
  console.error('Failed to compile built-ins', err);

  process.exit(1);
});