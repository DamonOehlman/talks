var express = require('express');
var filed = require('filed');
var app = express();
var server = require('http').createServer(app);

app.get('/data.csv', function(req, res) {
  filed(__dirname +  '/../../data/pedestrians/data.csv').pipe(res);
});

server.listen(3000);
