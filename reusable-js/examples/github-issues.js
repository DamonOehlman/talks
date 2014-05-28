var fs = require('fs');
var request = require('request');
var through = require('through');
var JSONStream = require('JSONStream');
var csv = require('csv-write-stream');
var requestOpts = {
  method: 'GET',
  url: 'https://api.github.com/users/DamonOehlman/repos',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'reusable-js-stream-example'
  }
};

request(requestOpts)
  .pipe(JSONStream.parse('.*'))
  .pipe(through(function(data) {
    this.emit('data', {
      name: data.name,
      open_issues_count: data.open_issues_count
    });
  }))
  .pipe(csv({ headers: ['name', 'open_issues_count']}))
  .pipe(fs.createWriteStream(__dirname + '/issues.csv'));
