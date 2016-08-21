const loaders = require('./webpack/webpack.shared.config').loaders;
const plugins = require('./webpack/webpack.shared.config').plugins;

/** testing hack, ensure webpack config has split or chunk plugin first */
plugins.shift();

module.exports = (config) => {
  config.set({
    frameworks: [
      'jasmine',
    ],

    plugins: [
      'karma-jasmine',
      'karma-sourcemap-writer',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-chrome-launcher',
    ],

    files: [
      './src/spec.entry.ts',
      {
        pattern: '**/*.map',
        served: true,
        included: false,
        watched: true,
      },
    ],

    preprocessors: {
      './src/spec.entry.ts': [
        'webpack',
        'sourcemap',
      ],
      './src/**/!(spec.entry).ts': [
        'sourcemap',
        'coverage',
      ],
    },

    webpack: {
      plugins,
      entry: './src/spec.entry.ts',
      devtool: 'inline-source-map',
      verbose: false,
      resolve: {
        extensions: ['', '.webpack.js', '.web.js',
          '.ts', '.js', '.tsx', '.jsx'],
      },
      module: {
        loaders: combinedLoaders(),
        postLoaders: [ loaders.istanbulInstrumenter ],
      },
      stats: { colors: true, reasons: true },
      debug: false,
    },

    webpackServer: {
      noInfo: true, // prevent console spamming when running in Karma!
    },

    reporters: ['spec', 'coverage'],

    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: './coverage/lcov' },
        { type: 'html', dir: './coverage/html' },
        { type: 'json', dir: './coverage/json' },
      ],
      dir: './coverage/',
    },

    port: 9999,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'], // Alternatively: 'PhantomJS'
    captureTimeout: 6000,
  });
};

function combinedLoaders() {
  return Object.keys(loaders).reduce(function reduce(aggregate, k) {
    switch (k) {
    case 'istanbulInstrumenter':
    case 'tslint':
      return aggregate;
    case 'ts':
    case 'tsTest':
      return aggregate.concat([ // force inline source maps
        Object.assign(loaders[k],
          { query: { babelOptions: { sourceMaps: 'both' } } })]);
    default:
      return aggregate.concat([loaders[k]]);
    } },
  []);
}
