// required for Jest TypeScript
module.exports = {
  plugins: [
    [
      'babel-plugin-inline-import',
      {
        extensions: ['.glsl'],
      },
    ],
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
