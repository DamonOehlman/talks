var csv = require('csv-parser');
var dropkick = require('dropkick');
var quickconnect = require('rtc-quickconnect');
var fileReader = require('filestream/read');
var fileReceiver = require('filestream/write');
var createDataStream = require('rtc-dcstream');
var channels = [];
var peers = [];

function prepStream(dc, id) {
  createDataStream(dc).pipe(csv())
    .on('data', function(item) {
      console.log(item.Year);
    })
    .on('end', function() {
      console.log('done');
    });
}

quickconnect('//switchboard.rtc.io/', { room: 'p2pcsv-test' })
  .createDataChannel('files')
  .on('channel:opened:files', function(id, dc) {
    channels.push(dc);
    peers.push(id);

    prepStream(dc, id);
  })
  .on('peer:leave', function(id) {
    var peerIdx = peers.indexOf(id);
    if (peerIdx >= 0) {
      peers.splice(peerIdx, 1);
      channels.splice(peerIdx, 1);
    }
  })

dropkick(document.body).on('file', function(file) {
  channels.map(createDataStream).forEach(function(stream) {
    fileReader(file).pipe(stream);
  });
});

// give the document some size so we can drag and drop stuff
document.body.style.width = '100vw';
document.body.style.height = '100vw';
