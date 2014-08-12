var request = require('request');

request.get('http://www.data.vic.gov.au/data/api/3/action/package_list', { json: true }, function(err, res, body) {
  console.log(body.result.join('\n'));
});
