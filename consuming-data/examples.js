var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.h1('examples'),
  s.slide('', { png: 'national-map', contain: true }),
  s.slide('', { png: 'osm-world', contain: true })
];
