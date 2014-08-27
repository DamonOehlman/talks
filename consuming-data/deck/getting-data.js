var h = require('hyperscript');
var s = require('shazam');
var snap = require('../lib/snapito');

module.exports = [
  s.h1('Getting Data'),
  s.md(require('./getting-data.md')),

  snap('data.melbourne.vic.gov.au'),
  snap('www.data.vic.gov.au'),
  snap('data.gov.au'),
  snap('vicroadsopendata.vicroadsmaps.opendata.arcgis.com'),

  s.md(require('./platform-integration.md'))
];
