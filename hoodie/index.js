var fs = require('fs');
var deck = require('decker')();

deck.css(fs.readFileSync(__dirname + '/node_modules/decker/themes/basic.css'));
deck.css(fs.readFileSync(__dirname + '/node_modules/decker/themes/code/default.css'));
deck.add(fs.readFileSync('./README.md'));
document.body.appendChild(deck.render());