// NOTE: once shazam is properly structured, this should be a module
// in it's own right

var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.slide([], { png: 'browserify', contain: true })
];
