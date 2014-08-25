const BASEURL = 'http://data.melbourne.vic.gov.au';
const RESOURCE = BASEURL + '/resource/b2ak-trbp.csv';

var csv = require('csv-parser');
var request = require('hyperquest');
var req = request.get(RESOURCE + '?year=2013&$limit=10000', {
  withCredentials: false
});

req.pipe(csv())
  .on('data', function(item) {
    console.log(item.Year);
  })
  .on('end', function() {
    console.log('done');
  })
