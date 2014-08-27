var h = require('hyperscript');
var s = require('shazam');
var snap = require('./lib/snapito');

module.exports = [
  s.slide([
    h('h2', 'displaying the'),
    h('h1', 'DATA')
  ]),

  snap('d3js.org', { png: 'd3' }),
  snap('leafletjs.com', { png: 'leaflet' }),
  snap('cesiumjs.org', { png: 'cesium' }),
  snap('vizicities.com', { png: 'vizicities' }),
  snap('github.com/Raynos/mercury', { png: 'mercury' })
];
