var pull = require('pull-stream');
var pl = require('pull-level');
var sse = require('pull-sse');

module.exports = function(db) {
  return function(req, res) {
    pull(
      pl.live(db, { tail: true }),
      pull.map(function(item) {
        return item.value;
      }),
      pull.filter(function(item) {
        return true;
      }),
      sse(res)
    );
  };
};
