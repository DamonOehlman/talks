module.exports = function(db) {
  setInterval(function() {
    db.put('cpu:' + Date.now(), require('os').cpus());
  }, 500);
};
