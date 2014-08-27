var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.slide([
    h('h2', 'displaying the'),
    h('h1', 'DATA')
  ]),

  s.site('d3js.org', { png: 'd3' }),
  s.site('leafletjs.com', { png: 'leaflet' }),
  s.site('cesiumjs.org', { png: 'cesium' }),
  s.site('vizicities.com', { png: 'vizicities' }),
  s.site('github.com/Raynos/mercury', { png: 'mercury' })
];
