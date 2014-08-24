var express = require('express');
var fs = require('fs');
var ogr2ogr = require('ogr2ogr');
var app = express();

app.get('/parks.json', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });

  ogr2ogr(__dirname +  '/../../data/qld-parks/data.zip')
    .stream()
    .pipe(res);
});

app.listen(3000);
