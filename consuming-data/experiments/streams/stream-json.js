var fs = require('fs');
var path = require('path');
var JSONStream = require('JSONStream');
var es = require('event-stream');

// initialise the target file location
var targetFile = path.resolve(__dirname, '../../data/melbdata/building-footprints/buildings.json');

describe('streaming', function() {
  it('- baseline memory usage', function() {
  });

  it('- requires less memory during a streaming operation', function(done) {
    fs.createReadStream(targetFile)
      .pipe(JSONStream.parse('features.*'))
      .pipe(es.map(function(data, next) {
        setTimeout(next, 0);
      }))
      .on('end', done);
  });
});

