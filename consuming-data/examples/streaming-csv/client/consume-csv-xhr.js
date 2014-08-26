var request = require('hyperquest');
var csv = require('csv-parser');

request(location.origin + '/data.csv').pipe(csv())
  .on('data', function(item) {
    console.log(item.Year);
  })
  .on('end', function() {
    console.log('done');
  });
