var h = require('hyperscript');
var s = require('shazam');

var FORMATS = [
  [ 'XLSX', 1513 ],
//   [ 'XLS', 731 ],
  [ 'SHP', 474 ],
  [ 'WMS', 406 ],
  [ 'CSV', 146 ],
//   [ 'API' , 32 ],
  [ 'KML', 23 ],
  [ 'ZIP', 9 ],
  [ 'XML', 8 ],
//   [ 'ASP', 9 ],
//   [ 'ASHX', 2 ],
//   [ 'HTML', 2 ],
//   [ 'SPS', 1 ],
//   [ 'JSP', 1 ],
//   [ 'HTM', 1 ],
  [ 'DOCX', 2 ]
//   [ 'DOC', 1 ]
//   [ 'ASPX', 1 ]
].map(function(data) {
  return s.slide([
    h('h1', data[0])
//     h('h2', data[1])
  ]);
});

module.exports = [
  s.h1('Let\'s talk formats', { jpg: 'betamax' }),
].concat(FORMATS).concat([
  s.slide([
    h('h2', 'Learn More'),
    h('ul',
      h('li', 'dataprotocols.org'),
      h('li', 'dat-data.com')
    )
  ])
]);
