const coverage = process.env.COVERAGE;

// configures browsers to run test against
// any of [ 'ChromeHeadless', 'Chrome', 'Firefox', 'IE', 'PhantomJS' ]
const browsers = (process.env.TEST_BROWSERS || 'ChromeHeadless').split(',');

const singleStart = process.env.SINGLE_START;

const suite = coverage ? 'test/coverageBundle.js' : 'test/testBundle.js';

module.exports = async function(karma) {

  // use puppeteer provided Chrome for testing
  process.env.CHROME_BIN = await require('puppeteer').executablePath();

  const config = {

    frameworks: [
      'mocha',
      'webpack'
    ],

    files: [
      suite
    ],

    preprocessors: {
      [suite]: [ 'webpack', 'env' ]
    },

    reporters: [ 'progress' ].concat(coverage ? 'coverage' : []),

    coverageReporter: {
      reporters: [
        { type: 'lcov', subdir: '.' }
      ]
    },

    browsers: browsers,

    autoWatch: false,
    singleRun: true,

    webpack: {
      mode: 'development',
      resolve: {
        modules: [
          'node_modules',
          __dirname
        ]
      },
      module: {
        rules: [
          {
            test: /test\/globals\.js$/,
            sideEffects: true
          },
          {
            test: /\.css$/i,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
          {
            test: /\.json$/,
            type: 'json'
          }
        ].concat(coverage ?
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                plugins: [
                  [ 'istanbul', {
                    include: [
                      'src/**'
                    ]
                  } ]
                ],
              }
            },
            enforce: 'post',
            include: /src\.*/,
            exclude: /node_modules/
          } : []
        )
      },
      devtool: 'eval-source-map'
    }
  };

  if (singleStart) {
    config.browsers = [].concat(config.browsers, 'Debug');
    config.envPreprocessor = [].concat(config.envPreprocessor || [], 'SINGLE_START');
  }

  karma.set(config);
};
