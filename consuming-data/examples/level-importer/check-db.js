var db = require('leveldown')('/tmp/parking-events');

db.open(function(err) {
  var iter;
  var count = 0;

  if (err) {
    return console.error('could not open db');
  }

  iter = db.iterator();
  iter.next(function process(err, key, val) {
    if (err || (! key)) {
      return console.log('done: ' + count);
    }

    count += 1;
    iter.next(process);
  });
});
