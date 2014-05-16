var pull = require('pull-stream');
var sse = require('pull-sse/client');

pull(
  sse('/cpu'),
  pull.log()
);
