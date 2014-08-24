var s = require('shazam');

s({
  title: 'Liberating Data',

  // override the default theme
  theme: require('bespoke-theme-tweakable')(),

  // use bullets and other bespoke addons
  plugins: [
    require('bespoke-bullets')('li, .bullet')
  ],

  // initialise the slides
  slides: [
    require('./intro'),
    require('./formats'),

    s.md(require('./processing-csv.md')),
    s.md(require('./processing-shapefile.md')),
    s.md(require('./understanding-cors.md')),


    s.md(require('./platform-integration.md')),

    require('./tools'),

    s.h1('Step 1: Importing Data'),
    s.md(require('./parsing-data.md'))
  ]
});
