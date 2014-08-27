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
    require('./deck/intro'),
    require('./deck/formats'),
    require('./deck/code-samples-intro'),

    // cover a couple of different formats
    s.md(require('./deck/processing-csv.md')),
    s.md(require('./deck/processing-shapefile.md')),
    snap('ogre.adc4gis.com'),

    // cover approaches for getting and how to integrate with
    // various online repositories
    require('./deck/getting-data'),

    snap('dat-data.com'),
    s.md(require('./deck/dat.md')),

    s.slide([
      h('h2', 'using'),
      h('h1', 'DAT')
    ]),
    s.md(require('./deck/dat-usage.md')),

    snap('code.google.com/p/leveldb'),
    s.md(require('./deck/leveldb.md')),

    require('./deck/displaying-the-data'),
    require('./deck/examples'),
    s.md(require('./deck/improving-flow.md')),

    s.md(require('./deck/p2p.md')),
    s.md(require('./deck/thanks.md'))
  ]
});
