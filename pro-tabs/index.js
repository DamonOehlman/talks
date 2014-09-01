var h = require('hyperscript');
var fs = require('fs');
var s = require('shazam');

s({
  title: 'The Case for Tabs',

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
    s.slide([
      h('h2', 'using'),
      h('h1', 'DAT')
    ])
  ]
});
