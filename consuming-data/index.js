var fs = require('fs');
var s = require('shazam');

s('Liberating Data', [
  s.h1('Step 1: Importing Data'),
  s.md(require('./importing-data.md')),
  s.md(require('./parsing-data.md'))
]);
