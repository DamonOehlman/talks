var fs = require('fs');
// var deck = require('decker')();
var s = require('shazam');

s('Prototyping apps with Hoodie', [
  s.md(fs.readFileSync(__dirname + '/README.md', 'utf8'))
]);

// deck.css(fs.readFileSync(__dirname + '/node_modules/decker/themes/basic.css'));
// deck.css(fs.readFileSync(__dirname + '/node_modules/decker/themes/code/default.css'));
// deck.add(fs.readFileSync('./README.md'));
// document.body.appendChild(deck.render());
