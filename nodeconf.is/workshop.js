var fs = require('fs');
var h = require('hyperscript');
var s = require('shazam');

s({
  title: 'WebRTC Workshop',

  // override the default theme
  theme: require('bespoke-theme-tweakable')(),

  // use bullets and other bespoke addons
  plugins: [
//     require('bespoke-bullets')('li, .bullet')
  ],

  styles: [
    fs.readFileSync(__dirname + '/deck.css')
  ],

  // initialise the slides
  slides: [
    require('djo-slides/webrtc/intro')
  ]
});
