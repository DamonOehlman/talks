var fs = require('fs');
var path = require('path');
var ogr2ogr = require('ogr2ogr');
var datadir = path.resolve(__dirname, '../../data/qld-parks');

ogr2ogr(path.join(datadir, 'data.zip'))
  .stream()
  .pipe(fs.createWriteStream(path.join(datadir, 'data.json')));
