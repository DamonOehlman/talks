var s = require('shazam');

s({
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

    s.h1('Step 1: Importing Data'),
    s.md(require('./importing-data.md')),
    s.md(require('./parsing-data.md'))
  ]
});
