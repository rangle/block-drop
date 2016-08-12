const specFiles = 'src/**/*.spec.ts';

module.exports = function wallabyConfig(wallaby) {
  return {
    files: [
      'src/**/*.ts',
      { pattern: specFiles, ignore: true },
    ],
    tests: [
      specFiles,
    ],
    testFramework: 'jasmine',
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({
        target: 'es5',
      }),
    },

    env: {
      type: 'node',
    },
  };
};
