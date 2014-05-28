var fs = require('fs');
var request = require('request');
var requestOpts = {
  method: 'GET',
  url: 'https://api.github.com/users/DamonOehlman/repos',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'reusable-js-stream-example'
  }
};

request(requestOpts)
  .pipe(fs.createWriteStream(__dirname + '/repos.json'));
