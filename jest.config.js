'use strict';

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/*.d.ts',
    '!**/interfaces.ts',
    '!**/handler.ts',
  ],
  coverageDirectory: 'coverage/',
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/'],
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
