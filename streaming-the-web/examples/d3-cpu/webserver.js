module.exports = function(db) {
  var server = require('http').createServer();
  var app = require('firetruck')(server);

  // hook up the cpu route
  app('/cpu', require('./routes/cpu')(db));

  // listen on port 3000
  server.listen(3000);
};
