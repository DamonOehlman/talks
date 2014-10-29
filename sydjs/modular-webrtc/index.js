var fs = require('fs');
var h = require('hyperscript');
var s = require('shazam');

s({
  title: 'Modular WebRTC',

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
    s.slide([
      h('h2', 'Modular'),
      h('h1', 'WebRTC')
    ]),

    require('djo-slides/webrtc/media-modules'),
    require('djo-slides/webrtc/rtcio-intro'),
//     require('djo-slides/webrtc/rtcio-media'),
    require('djo-slides/webrtc/rtcio-signalling'),
    require('djo-slides/webrtc/rtcio-connecting'),
    require('djo-slides/webrtc/rtcio-datachannels'),

//     require('djo-slides/webrtc/future'),
    require('djo-slides/thanks'),

    s.slide()
      .h2('slides:').url('http://damonoehlman.github.com/talks/sydjs/modular-webrtc/')
      .h2('github:').url('http://github.com/DamonOehlman')
      .h2('twitter:').url('http://twitter.com/DamonOehlman')
  ]
});
