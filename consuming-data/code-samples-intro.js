var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.slide([
    h('h2', 'time for'),
    h('h1', 'CODE')
  ]),
  s.slide('', { png: 'nodejs-1024x768' }),
  s.slide('', { svg: 'browserify' })
];
