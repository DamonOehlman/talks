var fs = require('fs');
var s = require('shazam');

s('Prototyping apps with Hoodie', [
  s.md(fs.readFileSync(__dirname + '/datasets.md', 'utf8'))
]);
