var pull = require('pull-stream');
var flickr = require('../')({ api_key: 'ca43d47b18b91ff639c9628f9cf828cd' });
var sse = require('pull-sse');
var http = require('http');

http.createServer(function(req, res) {
  pull(
    flickr.search('water buffalo', { is_commons: true }),
    sse(res)
  );
}).listen(3010);
