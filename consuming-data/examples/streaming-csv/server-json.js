var express = require('express');
var fs = require('fs');
var csv = require('csv-parser');
var app = express();

app.get('/data.json', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  fs.createReadStream(__dirname +  '/../../data/pedestrians/data.csv')
    .pipe(csv())
    .pipe(res);
});

app.listen(3000);
