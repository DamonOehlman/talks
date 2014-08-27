var fs = require('fs');
var h = require('hyperscript');
var s = require('shazam');
var snap = require('./lib/snapito');

s({
  title: 'Liberating Data',

  // override the default theme
  theme: require('bespoke-theme-tweakable')(),

  // use bullets and other bespoke addons
  plugins: [
//     require('bespoke-bullets')('li, .bullet')
  ],

  styles: [
    fs.readFileSync(__dirname + '/css/slides.css')
  ],

  // initialise the slides
  slides: [
    require('./intro'),
    require('./formats'),
    require('./code-samples-intro'),

    // cover a couple of different formats
    s.md(require('./processing-csv.md')),
    s.md(require('./processing-shapefile.md')),

    // cover approaches for getting and how to integrate with
    // various online repositories
    require('./getting-data'),

    snap('dat-data.com'),
    s.md(require('./dat.md')),

    s.slide([
      h('h2', 'using'),
      h('h1', 'DAT')
    ]),
    s.md(require('./dat-usage.md')),

    s.md(require('./leveldb.md')),

    require('./displaying-the-data'),
    require('./examples'),
    s.md(require('./improving-flow.md')),

    s.md(require('./p2p.md')),
    s.md(require('./thanks.md'))
  ]
});
