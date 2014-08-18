var fs = require('fs');
var s = require('shazam');

s('Liberating Data', [
  s.md(fs.readFileSync(__dirname + '/prep/datasets.md', 'utf8'))
]);
