var fs = require('fs');
var WebSocketServer = require('ws').Server;
var server = require('http').createServer();
var wss = new WebSocketServer({ server: server });
var wsstream = require('websocket-stream');

wss.on('connection', function(socket) {
  fs.createReadStream(__dirname + '/../../data/pedestrians/data.csv')
    .pipe(wsstream(socket));
});

server.listen(3000);
