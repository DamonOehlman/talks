var h = require('hyperscript');
var s = require('shazam');
var snap = require('../lib/snapito');

module.exports = [
  s.h1('Examples'),
  s.site('nationalmap.nicta.com.au', { png: 'national-map' }),
  snap('github.com/morganherlocker/voxel-openstreetmap')
];
