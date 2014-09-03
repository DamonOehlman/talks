var h = require('hyperscript');
var fs = require('fs');
var s = require('shazam');

s({
	title: 'The Case for Tabs',

	// override the default theme
	theme: require('bespoke-theme-tweakable')(),
	plugins: [],

	styles: [
		fs.readFileSync(__dirname + '/css/slides.css')
	],

	// initialise the slides
	slides: [
		s.slide([
			h('h2', 'pro'),
			h('h1', 'TABS')
		]),
		s.slide('', { jpg: 'fork' }),
		s.slide(h('pre', '\\t'), { classes: [ 'embiggen' ] }),
		s.slide('', { jpg: 'keyboard' }),

		s.html('&#x27f6;', { classes: [ 'embiggen' ] }),
		s.slide([
			h('h2', 'You already know'),
			h('h1', 'TABS are SUPERIOR'),
			h('a', { href: 'http://programmers.stackexchange.com/questions/57/tabs-versus-spaces-what-is-the-proper-indentation-character-for-everything-in-e' }, 'Discussion')
		]),

		s.slide([
			h('h2', 'So, why can\'t we have'),
			h('h1', 'NICE THINGS?!')
		]),
		s.slide('', { jpg: 'birdman' }),

		s.slide([
			h('h2', 'We are indenting like it\'s'),
			h('h1', '1912')
		]),

		s.slide('', { jpg: 'pitt' }),
		s.md(require('./slides/motoring.md')),

		s.slide([
			h('h1', 'SPACES'),
			h('h2', 'are a recreational form of'),
			h('h1', 'indentation')
		]),

		s.slide([
			h('h1', 'indent'),
			h('h2', '(like a boss)'),
			h('h1', 'TABS')
		])
	]
});
