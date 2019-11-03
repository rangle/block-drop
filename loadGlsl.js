const readFileSync = require('fs').readFileSync;
module.exports = {
  process(src, filename, config, options) {
    const str = readFileSync(filename, { encoding: 'utf8' })
      .split('\n')
      .map(s => "'" + s + "'")
      .join(' +\n');

    return 'module.exports = ' + str + ';';
  },
};
