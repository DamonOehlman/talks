var fs = require('fs');
var path = require('path');
var csv = require('csv-parser');
var es = require('event-stream');
var db = require('levelup')('./db');

fs.createReadStream(path.resolve(__dirname, '../../data/melbdata/parking-events/events.csv'))
  .pipe(csv())
  .pipe(es.map(function(data, next) {
    console.log(data);

    next(null, data);
  }))
  .pipe(db.createWriteStream());
