var request = require('hyperquest');
var csv = require('csv-parser');
var req = request('http://localhost:3000/data.csv', {
  withCredentials: false
});

req.pipe(csv())
  .on('data', function(item) {
    console.log(item.Year);
  })
  .on('end', function() {
    console.log('done');
  });
