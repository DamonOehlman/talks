var websocket = require('websocket-stream');
var wss = websocket('ws://localhost:3000');
var csv = require('csv-parser');

wss.pipe(csv())
  .on('data', function(item) {
    console.log(item.Year);
  })
  .on('end', function() {
    console.log('done');
  });
