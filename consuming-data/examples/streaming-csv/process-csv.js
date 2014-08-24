var fs = require('fs');
var csv = require('csv-parser');

fs.createReadStream(__dirname + '/../../data/pedestrians/data.csv')
  .pipe(csv())
  .on('data', function(item) {
    console.log(item.Year);
  })
  .on('end', function() {
    console.log('done');
  });
