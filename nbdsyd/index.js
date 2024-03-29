var deck = require('decker')();
var defaultCss = require('defaultcss');
var fs = require('fs');

defaultCss('theme', fs.readFileSync('./node_modules/decker/themes/basic.css', 'utf8'));
defaultCss('highlighting', fs.readFileSync('./node_modules/decker/themes/code/docco.css', 'utf8'));
deck.add(fs.readFileSync('./README.md', 'utf8'));

document.body.appendChild(deck.render());
