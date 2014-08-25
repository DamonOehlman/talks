const WRITE_BUFFER_SIZE = 1 * 1024 * 1024;
const DATAFILE = __dirname + '/../../data/parking-events/events.csv';

var fs = require('fs');
var lexinum = require('lexinum');
var moment = require('moment');
var csv = require('csv-parser');

var pull = require('pull-stream');
var batch = require('pull-level-batch');
var toPullStream = require('stream-to-pull-stream');

var db = require('leveldown')('/tmp/parking-events', {
  writeBufferSize: WRITE_BUFFER_SIZE
});

var reportProgress = process.stdout.write.bind(process.stdout, '.');

function prepObject(data) {
  var arrive = moment(data['Arrival Time'], 'DD/MM/YYYY HH:mm:ss a');
  var deviceId = parseInt(data['Device ID'], 10);
  var key = arrive.valueOf() + ':' + lexinum(deviceId);
  var value = JSON.stringify(data);

  return {
    type: 'put',
    key: key,
    value: JSON.stringify(data)
  };
}

db.open(function(err) {
  if (err) {
    return console.error('could not open db');
  }

  pull(
    toPullStream.source(
      fs.createReadStream(DATAFILE)
      .pipe(csv())
    ),
    pull.map(prepObject),
    batch(WRITE_BUFFER_SIZE),
    pull.asyncMap(db.batch.bind(db)),
    pull.drain(reportProgress, function() {
      console.log('done');
    })
  );
});
