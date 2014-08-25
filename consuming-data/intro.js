var h = require('hyperscript');
var s = require('shazam');

module.exports = [
  s.slide([
    h('h1', 'Liberating Data'),
//     h('h2', 'Why should we care?')
  ], { jpg: 'thor-vs-superman', contain: true }),

  s.h2('This is NOT a talk about Big Data'),

  [
    h('h2', 'Two Phased Approach'),
    h('ol',
      h('li', 'Freeing the data from it\'s proprietary "prison".'),
      h('li', 'Creating human accessible ways of digesting that information.')
     )
  ],

  s.h1('', { jpg: 'great-beyond', fontSize: '5em' }),

  s.md([
    '## Freeing Data',
    '- Releasing data that can be open, as open data.',
    '- Putting that data in tools people can use.',
    '- which _generally_ means making something that works in a browser'
  ].join('\n')),

  s.slide('', { jpg: 'art-in-progress' })
];
