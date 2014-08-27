var s = require('shazam');
var key = 'spu-7568b6-ttwi-xrr0ddcvljg2dxn8';

module.exports = function(url) {
  return s.site(url, {
    png: 'http://api.snapito.io/v2/webshot/' + key + '?url=' + escape(url) + '&size=lc&screen=desktop_m'
  });
};
