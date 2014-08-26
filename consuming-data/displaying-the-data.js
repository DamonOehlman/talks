var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.slide([
    h('h2', 'displaying the'),
    h('h1', 'DATA')
  ]),

  s.slide('', { png: 'd3' }),
  s.slide('', { png: 'leaflet' }),
  s.slide('', { png: 'cesium' }),
  s.slide('', { png: 'vizicities' }),
  s.slide('', { png: 'mercury' })
];
