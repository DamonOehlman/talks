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
    s.slide().h1('WebRTC').h1('Workshop'),
    s.slide().h2('These slides').url('http://damonoehlman.github.io/talks/nodeconf.is/workshop.html'),
    s.slide().h2('Interactive Guidebook').url('http://guidebook.rtc.io/'),
    s.slide().h2('RequireBin is your friend').url('http://requirebin.com/?gist=d3059864c2cf08e44b44'),
    s.slide().h2('Soup to Nuts Conferencing').url('https://github.com/rtc-io/rtcio-demo-quickconnect')
  ]
});
