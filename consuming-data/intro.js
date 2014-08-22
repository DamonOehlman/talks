var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.blank(),
  s.h1('Liberating Data', {
    //       jpg: 'batman-extreme',
    jpg: 'thor-vs-superman',
    contain: true
  }),

  [
    h('h2', 'Two Phased Approach'),
    h('ol',
      h('li', 'Freeing the data from it\'s proprietary "prison".'),
      h('li', 'Creating human accessible ways of digesting that information.')
     )
  ],

  s.h1('??', { jpg: 'great-beyond', fontSize: '6em' }),

  s.slide([
    h('h2', 'Freeing Data'),
    h('ul',
      h('li', 'Releasing data that can be open, as open data.'),
      h('li', 'Putting that data in formats people can use.')
    )
  ]),

  s.slide('', { jpg: 'art-in-progress' })
];
