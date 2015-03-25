var fs = require('fs');
var h = require('hyperscript');
var s = require('shazam');

s({
  title: 'Browser Testing',

  // override the default theme
  theme: require('bespoke-theme-tweakable')(),

  // use bullets and other bespoke addons
  plugins: [
//     require('bespoke-bullets')('li, .bullet')
  ],

  apikeys: {
    flickr: '1afeba19b3dfd2a8a3671deb8a6fa165',
  },

  styles: [
    fs.readFileSync(__dirname + '/deck.css')
  ],

  // initialise the slides
  slides: [
    require('./deck/intro')
  ]
});
