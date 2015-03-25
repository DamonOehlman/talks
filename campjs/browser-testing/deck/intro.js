var h = require('hyperscript');
var s = require('shaz');
var fs = require('fs');

module.exports = [
  s().h1('Browser Testing'),
  h('pre', 'http://10.45.2.249:8090/', { style: 'font-size: 3em' }),
  s().h2('What are the').h1('Options?'),
  s().h2('Understanding').h2('Trade Offs'),
//   s().h2('What is').h1('WebRTC?'),
//   s().flickr(6833767622),
//   s().h2('what can').h1('I build').h2('with WebRTC?'),
//   s().h1('Many Things').flickr(1383780166),
//   s().h2('From Video + Audio Apps'),
//   s().png(fs.readFileSync(__dirname + '/../images/hangouts.png')).contain(),
//   s().h2('To Super Cool Data Related Apps'),
//   s().png(fs.readFileSync(__dirname + '/../images/webtorrent.png')).contain()
];
