;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":4}],2:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],3:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\u001b[' + styles[style][0] + 'm' + str +
             '\u001b[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return Array.isArray(ar) ||
         (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}


function isRegExp(re) {
  typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]';
}


function isDate(d) {
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Date]';
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":1}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
var fs = require('fs');
// var deck = require('decker')();
var s = require('shazam');

s('Prototyping apps with Hoodie', [
  s.md("# Prototyping Applications with Hoodie\n\n---\n\n## What is Hoodie?\n\n[Hoodie](http://hood.ie) is an JS application development approach which has a focus on making applications with offline synchronization **just work**.\n\n---\n\n## Why Use (or even look at) Hoodie?\n\n1. Because they are focused on solving hard problems (data sync) straight up, rather than giving you flashy things to distract you.\n\n2. Leverages CouchDB for stuff it's really good at.\n\n3. There's some really smart, experienced people working on it.\n\n---\n\n## Hoodie Core Concepts\n\n- User Accounts and Authentication\n- Generic Document Store\n- Tasks\n- Bus-like eventing (not as good as [eve](https://github.com/adobe-webplatform/eve), but good)\n\n---\n\n## Getting your Hoodie on\n\n```js\nvar hoodie = new Hoodie();\n```\n\nThis transparently creates a connection to the hoodie api running on the local machine in the background.  As you would expect, you can override the default endpoint.\n\n---\n\n## Authentication\n\n```js\nhoodie.account.signIn('me@test.com', 'supersecretpass');\n```\n\nFunctions like the `signIn` function above return a promise.  While not my personal preference, it does make for a very clean looking API.\n\n```js\nhoodie.account.signIn('me@test.com', 'secret').then(function() {\n\tconsole.log(hoodie.account.username);\n});\n```\n\n---\n\n## Generic Document Store\n\nThis is very nicely done, and makes excellent use of Couch as a document store.\n\n```js\nhoodie.store.add('customer', { name: 'Bob' });\n```\n\nData is added to a _user specific database_ in the couch backend if online.  Heck, you can even use \"futon\" (CouchDB's admin interface) to look at your data:\n\nhttp://127.0.0.1:6001/_api/_utils\n\n---\n\n## Example: Capture Geo Tracks\n\nSo tracking a geo track could be as simple as:\n\n```js\nnavigator.geolocation.watchPosition(function(pos) {\n\thoodie.store.add('pos', pos.coords);\n});\n```\n\nWhich is pretty awesome.  Here's what the data looks like in couch:\n\n```json\n{\n   \"_id\": \"pos/3322231\",\n   \"_rev\": \"1-121022121\",\n   \"speed\": null,\n   \"heading\": null,\n   \"altitudeAccuracy\": null,\n   \"accuracy\": 18000,\n   \"altitude\": null,\n   \"longitude\": 151.20699,\n   \"latitude\": -33.867487,\n   \"createdBy\": \"2122222\",\n   \"updatedAt\": \"2013-10-23T03:31:07.059Z\",\n   \"createdAt\": \"2013-10-23T03:31:07.059Z\",\n   \"type\": \"pos\"\n}\n```\n\n---\n\n## Hoodie Eventing\n\nHoodie uses a pubsub eventing model which allows for wonderful decoupling at the UI layer.\n\nHandling account sign-in:\n\n```js\nhoodie.account.on('signin', function() {\n});\n```\n\nOr when a new position is added:\n\n```js\nhoodie.store.on('add:pos', function(pos) {\n\t// I could do nifty geofencing stuff here :)\n});\n```\n\n---\n\n## Offline + Data Synchronization\n\nAll data is stored in `localStorage` (check your web inspector) and when online automatically synchronized with server.  If you want to know when synchronization is happening, then you can use events.\n\nYou could monitor your movements on a desktop display\n\n```js\nhoodie.remote.on('add:pos', function (pos) {\n\t// update your current position on your map\n});\n```\n---\n\n## Pros / Cons\n\n- **PRO**: Tackling offline sync head on is great.\n- **PRO**: Getting started fleshing out your app is really simple.\n- **CON?**: Built on jQuery (at the moment)\n- **CON?**: Feels a bit frameworky for my tastes.\n- Be aware that storage implementation is pretty closely tied to [CouchDB](http://couchdb.apache.org) at the moment.  I **love** Couch so I don't consider this a problem, but you should be aware...\n\n---\n\n## Closing Thoughts\n\nThey have a dog wearing a hoodie - you should at least take a look.\n\nIt's great to see someone make a serious go of unlocking the potential of CouchDB + single page apps.")
]);

// deck.css(fs.readFileSync(__dirname + '/node_modules/decker/themes/basic.css'));
// deck.css(fs.readFileSync(__dirname + '/node_modules/decker/themes/code/default.css'));
// deck.add(fs.readFileSync('./README.md'));
// document.body.appendChild(deck.render());

},{"fs":2,"shazam":8}],6:[function(require,module,exports){
var crel = require('crel');

module.exports = function(html) {
  var el = crel('div', { class: 'slide' });

  // set the inner html
  el.innerHTML = html;
  return el;
};
},{"crel":10}],7:[function(require,module,exports){
var crel = require('crel');

module.exports = function(url) {
  var el = crel('div');

  // create an image to trigger loading
  var img = crel('img', {
    src: url
  });

  img.addEventListener('load', function() {
    console.log('loaded: ' + url);
  });

  // set the image as the background image for the element
  el.style.backgroundImage = 'url(\'' + url + '\')';

  return el;
};
},{"crel":10}],8:[function(require,module,exports){
var __dirname="/node_modules/shazam";/* jshint node: true */
/* global document: false */
'use strict';

var fs = require('fs');
// var bedazzle = require('bedazzle');
var crel = require('crel');
var insertCss = require('insert-css');
var transform = require('feature/css')('transform');
var flatten = require('whisk/flatten');
var keydown = require('dd/next')('keydown', document);
var pull = require('pull-stream');
var render = require('./render');
var current;
var slide;

// transform functions
var activate = push(0);
var pushRight = push('100%');
var pushLeft = push('-100%');
var wooble = "alert('hello');";

// create a key directions hash
var keyDirections = {
  37: 'back',
  38: 'back',
  39: 'next',
  40: 'next'
};

insertCss("html, body {\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n\n.slide {\n  position: absolute;\n  padding: 5%;\n  width: 90%;\n  height: 90%;\n  transition: all ease-in-out 0.5s;\n  background-size: cover;\n}\n\n.slide {\n  font-family: Helvetica, Arial, sans-serif;\n  font-size: 1.4em;\n  line-height: 1.6em;\n}\n\n.slide h1 {\n  font-size: 1.6em;\n  margin: 0;\n  text-shadow: 0 1px 2px #e8e8e8;\n}\n\n.slide h1:last-child {\n  text-align: center;\n  height: 100%;\n  padding-top: 40%;\n}\n\n.slide h2, .slide h3, .slide  h4 {\n  margin-top: 0px;\n  text-shadow: 0 1px 2px #e8e8e8;\n}\n\n.slide pre {\n  line-height: 1.4em;\n}\n");
insertCss("/*\n\nOriginal style from softwaremaniacs.org (c) Ivan Sagalaev <Maniac@SoftwareManiacs.Org>\n\n*/\n\npre code {\n  display: block; padding: 0.5em;\n  background: #F0F0F0;\n}\n\npre code,\npre .subst,\npre .tag .title,\npre .lisp .title,\npre .clojure .built_in,\npre .nginx .title {\n  color: black;\n}\n\npre .string,\npre .title,\npre .constant,\npre .parent,\npre .tag .value,\npre .rules .value,\npre .rules .value .number,\npre .preprocessor,\npre .haml .symbol,\npre .ruby .symbol,\npre .ruby .symbol .string,\npre .aggregate,\npre .template_tag,\npre .django .variable,\npre .smalltalk .class,\npre .addition,\npre .flow,\npre .stream,\npre .bash .variable,\npre .apache .tag,\npre .apache .cbracket,\npre .tex .command,\npre .tex .special,\npre .erlang_repl .function_or_atom,\npre .asciidoc .header,\npre .markdown .header,\npre .coffeescript .attribute {\n  color: #800;\n}\n\npre .comment,\npre .annotation,\npre .template_comment,\npre .diff .header,\npre .chunk,\npre .asciidoc .blockquote,\npre .markdown .blockquote {\n  color: #888;\n}\n\npre .number,\npre .date,\npre .regexp,\npre .literal,\npre .hexcolor,\npre .smalltalk .symbol,\npre .smalltalk .char,\npre .go .constant,\npre .change,\npre .lasso .variable,\npre .asciidoc .bullet,\npre .markdown .bullet,\npre .asciidoc .link_url,\npre .markdown .link_url {\n  color: #080;\n}\n\npre .label,\npre .javadoc,\npre .ruby .string,\npre .decorator,\npre .filter .argument,\npre .localvars,\npre .array,\npre .attr_selector,\npre .important,\npre .pseudo,\npre .pi,\npre .haml .bullet,\npre .doctype,\npre .deletion,\npre .envvar,\npre .shebang,\npre .apache .sqbracket,\npre .nginx .built_in,\npre .tex .formula,\npre .erlang_repl .reserved,\npre .prompt,\npre .asciidoc .link_label,\npre .markdown .link_label,\npre .vhdl .attribute,\npre .clojure .attribute,\npre .asciidoc .attribute,\npre .lasso .attribute,\npre .coffeescript .property {\n  color: #88F\n}\n\npre .keyword,\npre .id,\npre .title,\npre .built_in,\npre .aggregate,\npre .css .tag,\npre .javadoctag,\npre .phpdoc,\npre .yardoctag,\npre .smalltalk .class,\npre .winutils,\npre .bash .variable,\npre .apache .tag,\npre .go .typename,\npre .tex .command,\npre .asciidoc .strong,\npre .markdown .strong,\npre .request,\npre .status {\n  font-weight: bold;\n}\n\npre .asciidoc .emphasis,\npre .markdown .emphasis {\n  font-style: italic;\n}\n\npre .nginx .built_in {\n  font-weight: normal;\n}\n\npre .coffeescript .javascript,\npre .javascript .xml,\npre .lasso .markup,\npre .tex .formula,\npre .xml .javascript,\npre .xml .vbscript,\npre .xml .css,\npre .xml .cdata {\n  opacity: 0.5;\n}");

/**
  # shazam

  Shazam is a simple code driven presentation system.

  ## Example Usage

  <<< examples/welcome.js
**/

var shazam = module.exports = function(title, opts, deck) {
  var slides = [];
  var slideIdx = 0;

  var keyActions = {
    37: previousSlide,
    38: previousSlide,
    39: nextSlide,
    40: nextSlide
  };

  function nextSlide() {
    if (slideIdx < slides.length - 1) {
      slideIdx += 1;

      pushLeft(slides[slideIdx - 1]);
      activate(slides[slideIdx]);
    }
  }

  function previousSlide() {
    if (slideIdx > 0) {
      slideIdx -= 1;

      pushRight(slides[slideIdx + 1]);
      activate(slides[slideIdx]);
    }
  }

  // if we don't have transforms spit the dummy
  if (! transform) {
    throw new Error('need css transforms');
  }

  // check for no opts
  if (Array.isArray(opts)) {
    deck = opts;
    opts = {};
  }

  // initialise the basepath
  opts.basepath = opts.basepath || '';

  console.log(__dirname);

  // create the slides
  slides = deck.reduce(flatten)

    // create the slides based in input
    .map(render(opts))
    // push right
    .map(pushRight)
    // append to the body
    .map(append);

  // set out title based on the title provided
  document.title = title;

  // handle keys
  pull(
    pull.Source(keydown),
    pull.map(function(evt) {
      return evt.keyCode;
    }),
    pull.filter(function(key) {
      return keyActions[key];
    }),
    pull.drain(function(key) {
      keyActions[key]();
    })
  );

  // display the initial slide
  if (slides.length > 0) {
    activate(slides[slideIdx]);
  }
};

/* simple inline plugins */

shazam.img = require('./img');
shazam.markdown = shazam.md = require('./markdown');
shazam.html = require('./html');

/* internal functions */

function push(position) {
  return function(slide) {
    transform(slide.el, 'translateX(' + position + ') translateZ(0)');
    return slide;
  };
}

function append(slide) {
  // add to the document
  document.body.appendChild(slide.el);

  // return the slide
  return slide;
}
},{"./html":6,"./img":7,"./markdown":9,"./render":77,"crel":10,"dd/next":11,"feature/css":12,"fs":2,"insert-css":68,"pull-stream":70,"whisk/flatten":76}],9:[function(require,module,exports){
var marked = require('marked');
var html = require('./html');
var hljs = require('highlight.js');
var hljsLangMappings = {
  js: 'javascript'
};

var reSlideBreak = /\n\r?\-{2,}/m;
var reLeadingAndTrailingSpaces = /^\s*(.*)\s*$/m;

/* initialise marked */

marked.setOptions({
  highlight: function(code, lang) {
    lang = hljsLangMappings[lang] || lang;

    // if this is a known hljs language then highlight
    if (hljs.LANGUAGES[lang]) {
      return hljs.highlight(lang, code).value;
    }
    else {
      return code;
    }
  }
});

var markdown = module.exports = function(md) {
  // if we have multiple slides, split and map
  if (reSlideBreak.test(md)) {
    return md.split(reSlideBreak).map(markdown);
  }

  return html(marked(md.replace(reLeadingAndTrailingSpaces, '$1')));
}
},{"./html":6,"highlight.js":37,"marked":69}],10:[function(require,module,exports){
//Copyright (C) 2012 Kory Nunn

//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*

    This code is not formatted for readability, but rather run-speed and to assist compilers.

    However, the code's intention should be transparent.

    *** IE SUPPORT ***

    If you require this library to work in IE7, add the following after declaring crel.

    var testDiv = document.createElement('div'),
        testLabel = document.createElement('label');

    testDiv.setAttribute('class', 'a');
    testDiv['className'] !== 'a' ? crel.attrMap['class'] = 'className':undefined;
    testDiv.setAttribute('name','a');
    testDiv['name'] !== 'a' ? crel.attrMap['name'] = function(element, value){
        element.id = value;
    }:undefined;


    testLabel.setAttribute('for', 'a');
    testLabel['htmlFor'] !== 'a' ? crel.attrMap['for'] = 'htmlFor':undefined;



*/

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
    }
}(this, function () {
    // based on http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
    var isNode = typeof Node === 'object'
        ? function (object) { return object instanceof Node; }
        : function (object) {
            return object
                && typeof object === 'object'
                && typeof object.nodeType === 'number'
                && typeof object.nodeName === 'string';
        };
    var isArray = function(a){ return a instanceof Array; };
    var appendChild = function(element, child) {
      if(!isNode(child)){
          child = document.createTextNode(child);
      }
      element.appendChild(child);
    };


    function crel(){
        var document = window.document,
            args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            element = args[0],
            child,
            settings = args[1],
            childIndex = 2,
            argumentsLength = args.length,
            attributeMap = crel.attrMap;

        element = isNode(element) ? element : document.createElement(element);
        // shortcut
        if(argumentsLength === 1){
            return element;
        }

        if(typeof settings !== 'object' || isNode(settings) || isArray(settings)) {
            --childIndex;
            settings = null;
        }

        // shortcut if there is only one child that is a string
        if((argumentsLength - childIndex) === 1 && typeof args[childIndex] === 'string' && element.textContent !== undefined){
            element.textContent = args[childIndex];
        }else{
            for(; childIndex < argumentsLength; ++childIndex){
                child = args[childIndex];

                if(child == null){
                    continue;
                }

                if (isArray(child)) {
                  for (var i=0; i < child.length; ++i) {
                    appendChild(element, child[i]);
                  }
                } else {
                  appendChild(element, child);
                }
            }
        }

        for(var key in settings){
            if(!attributeMap[key]){
                element.setAttribute(key, settings[key]);
            }else{
                var attr = crel.attrMap[key];
                if(typeof attr === 'function'){
                    attr(element, settings[key]);
                }else{
                    element.setAttribute(attr, settings[key]);
                }
            }
        }

        return element;
    }

    // Used for mapping one kind of attribute to the supported version of that in bad browsers.
    // String referenced so that compilers maintain the property name.
    crel['attrMap'] = {};

    // String referenced so that compilers maintain the property name.
    crel["isNode"] = isNode;

    return crel;
}));

},{}],11:[function(require,module,exports){
/* jshint node: true */
'use strict';

/**
  ### next

  ```
  f(name, el) => fn
  ```

  The `next` function is used to pull event data from `el` for the event
  named `name`.  This can be useful when combined with a
  [pull-stream](https://github.com/dominictarr/pull-stream) to capture
  a stream of events from a DOM elements.

  <<< examples/next.js
**/
module.exports = function(name, el) {
  var buffer = [];
  var queued = [];

  function handleEvent(evt) {
    queued.length ? queued.shift()(null, evt) : buffer[buffer.length] = evt;
  }

  // add the event listener to the object
  el.addEventListener(name, handleEvent);

  return function(end, cb) {
    // handle the non pull-stream case of a single argument
    if (typeof end == 'function') {
      cb = end;
      end = false;
    }

    // if we are ending the stream, then remove the listener
    if (end) {
      el.removeEventListener(name, handleEvent);
      return cb ? cb(end) : null;
    }

    if (buffer.length > 0) {
      return cb(null, buffer.shift());
    }

    // otherwise, save the cb
    queued[queued.length] = cb;
  };
};

},{}],12:[function(require,module,exports){
/* jshint node: true */
/* global window: false */
/* global document: false */
'use strict';

// list prefixes and case transforms
// (reverse order as a decrementing for loop is used)
var prefixes = [
  'ms',
  'ms', // intentional: 2nd entry for ms as we will also try Pascal case for MS
  'O',
  'Moz',
  'Webkit',
  ''
];

var caseTransforms = [
  toCamelCase,
  null,
  null,
  toCamelCase,
  null,
  toCamelCase
];

var props = {};
var style;

/**
## css(prop)

Test for the prescence of the specified CSS property (in all it's 
possible browser prefixed variants)
**/
module.exports = function(prop) {
  var ii;
  var propName;
  var pascalCaseName;

  style = style || document.body.style;

  // if we already have a value for the target property, return
  if (props[prop] || style[prop]) {
    return props[prop];
  }

  // convert a dash delimited propertyname (e.g. box-shadow) into 
  // pascal cased name (e.g. BoxShadow)
  pascalCaseName = prop.split('-').reduce(function(memo, val) {
    return memo + val.charAt(0).toUpperCase() + val.slice(1);
  }, '');

  // check for the property
  for (ii = prefixes.length; ii--; ) {
    propName = prefixes[ii] + (caseTransforms[ii] ?
                  caseTransforms[ii](pascalCaseName) :
                  pascalCaseName);

    if (typeof style[propName] != 'undefined') {
      props[prop] = createGetterSetter(propName);
      break;
    }
  }
  
  return props[prop];
};

/* internal helper functions */

function createGetterSetter(propName) {
  return function(element, value) {
    // if we have a value update 
    if (typeof value != 'undefined') {
      element.style[propName] = value;
    }

    return window.getComputedStyle(element)[propName];
  };
}

function toCamelCase(input) {
  return input.charAt(0).toLowerCase() + input.slice(1);
}
},{}],13:[function(require,module,exports){
module.exports = function(hljs){
  var IDENT_RE_RU = '[a-zA-Zа-яА-Я][a-zA-Z0-9_а-яА-Я]*';
  var OneS_KEYWORDS = 'возврат дата для если и или иначе иначеесли исключение конецесли ' +
    'конецпопытки конецпроцедуры конецфункции конеццикла константа не перейти перем ' +
    'перечисление по пока попытка прервать продолжить процедура строка тогда фс функция цикл ' +
    'число экспорт';
  var OneS_BUILT_IN = 'ansitooem oemtoansi ввестивидсубконто ввестидату ввестизначение ' +
    'ввестиперечисление ввестипериод ввестиплансчетов ввестистроку ввестичисло вопрос ' +
    'восстановитьзначение врег выбранныйплансчетов вызватьисключение датагод датамесяц ' +
    'датачисло добавитьмесяц завершитьработусистемы заголовоксистемы записьжурналарегистрации ' +
    'запуститьприложение зафиксироватьтранзакцию значениевстроку значениевстрокувнутр ' +
    'значениевфайл значениеизстроки значениеизстрокивнутр значениеизфайла имякомпьютера ' +
    'имяпользователя каталогвременныхфайлов каталогиб каталогпользователя каталогпрограммы ' +
    'кодсимв командасистемы конгода конецпериодаби конецрассчитанногопериодаби ' +
    'конецстандартногоинтервала конквартала конмесяца коннедели лев лог лог10 макс ' +
    'максимальноеколичествосубконто мин монопольныйрежим названиеинтерфейса названиенабораправ ' +
    'назначитьвид назначитьсчет найти найтипомеченныенаудаление найтиссылки началопериодаби ' +
    'началостандартногоинтервала начатьтранзакцию начгода начквартала начмесяца начнедели ' +
    'номерднягода номерднянедели номернеделигода нрег обработкаожидания окр описаниеошибки ' +
    'основнойжурналрасчетов основнойплансчетов основнойязык открытьформу открытьформумодально ' +
    'отменитьтранзакцию очиститьокносообщений периодстр полноеимяпользователя получитьвремята ' +
    'получитьдатута получитьдокументта получитьзначенияотбора получитьпозициюта ' +
    'получитьпустоезначение получитьта прав праводоступа предупреждение префиксавтонумерации ' +
    'пустаястрока пустоезначение рабочаядаттьпустоезначение рабочаядата разделительстраниц ' +
    'разделительстрок разм разобратьпозициюдокумента рассчитатьрегистрына ' +
    'рассчитатьрегистрыпо сигнал симв символтабуляции создатьобъект сокрл сокрлп сокрп ' +
    'сообщить состояние сохранитьзначение сред статусвозврата стрдлина стрзаменить ' +
    'стрколичествострок стрполучитьстроку  стрчисловхождений сформироватьпозициюдокумента ' +
    'счетпокоду текущаядата текущеевремя типзначения типзначениястр удалитьобъекты ' +
    'установитьтана установитьтапо фиксшаблон формат цел шаблон';
  var DQUOTE =  {className: 'dquote',  begin: '""'};
  var STR_START = {
      className: 'string',
      begin: '"', end: '"|$',
      contains: [DQUOTE],
      relevance: 0
    };
  var STR_CONT = {
    className: 'string',
    begin: '\\|', end: '"|$',
    contains: [DQUOTE]
  };

  return {
    case_insensitive: true,
    lexems: IDENT_RE_RU,
    keywords: {keyword: OneS_KEYWORDS, built_in: OneS_BUILT_IN},
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.NUMBER_MODE,
      STR_START, STR_CONT,
      {
        className: 'function',
        begin: '(процедура|функция)', end: '$',
        lexems: IDENT_RE_RU,
        keywords: 'процедура функция',
        contains: [
          {className: 'title', begin: IDENT_RE_RU},
          {
            className: 'tail',
            endsWithParent: true,
            contains: [
              {
                className: 'params',
                begin: '\\(', end: '\\)',
                lexems: IDENT_RE_RU,
                keywords: 'знач',
                contains: [STR_START, STR_CONT]
              },
              {
                className: 'export',
                begin: 'экспорт', endsWithParent: true,
                lexems: IDENT_RE_RU,
                keywords: 'экспорт',
                contains: [hljs.C_LINE_COMMENT_MODE]
              }
            ]
          },
          hljs.C_LINE_COMMENT_MODE
        ]
      },
      {className: 'preprocessor', begin: '#', end: '$'},
      {className: 'date', begin: '\'\\d{2}\\.\\d{2}\\.(\\d{2}|\\d{4})\''}
    ]
  };
};
},{}],14:[function(require,module,exports){
module.exports = function(hljs) {
  var IDENT_RE = '[a-zA-Z_$][a-zA-Z0-9_$]*';
  var IDENT_FUNC_RETURN_TYPE_RE = '([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)';

  var AS3_REST_ARG_MODE = {
    className: 'rest_arg',
    begin: '[.]{3}', end: IDENT_RE,
    relevance: 10
  };
  var TITLE_MODE = {className: 'title', begin: IDENT_RE};

  return {
    keywords: {
      keyword: 'as break case catch class const continue default delete do dynamic each ' +
        'else extends final finally for function get if implements import in include ' +
        'instanceof interface internal is namespace native new override package private ' +
        'protected public return set static super switch this throw try typeof use var void ' +
        'while with',
      literal: 'true false null undefined'
    },
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'package',
        beginWithKeyword: true, end: '{',
        keywords: 'package',
        contains: [TITLE_MODE]
      },
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class interface',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends implements'
          },
          TITLE_MODE
        ]
      },
      {
        className: 'preprocessor',
        beginWithKeyword: true, end: ';',
        keywords: 'import include'
      },
      {
        className: 'function',
        beginWithKeyword: true, end: '[{;]',
        keywords: 'function',
        illegal: '\\S',
        contains: [
          TITLE_MODE,
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              hljs.APOS_STRING_MODE,
              hljs.QUOTE_STRING_MODE,
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE,
              AS3_REST_ARG_MODE
            ]
          },
          {
            className: 'type',
            begin: ':',
            end: IDENT_FUNC_RETURN_TYPE_RE,
            relevance: 10
          }
        ]
      }
    ]
  };
};
},{}],15:[function(require,module,exports){
module.exports = function(hljs) {
  var NUMBER = {className: 'number', begin: '[\\$%]\\d+'};
  return {
    case_insensitive: true,
    keywords: {
      keyword: 'acceptfilter acceptmutex acceptpathinfo accessfilename action addalt ' +
        'addaltbyencoding addaltbytype addcharset adddefaultcharset adddescription ' +
        'addencoding addhandler addicon addiconbyencoding addiconbytype addinputfilter ' +
        'addlanguage addmoduleinfo addoutputfilter addoutputfilterbytype addtype alias ' +
        'aliasmatch allow allowconnect allowencodedslashes allowoverride anonymous ' +
        'anonymous_logemail anonymous_mustgiveemail anonymous_nouserid anonymous_verifyemail ' +
        'authbasicauthoritative authbasicprovider authdbduserpwquery authdbduserrealmquery ' +
        'authdbmgroupfile authdbmtype authdbmuserfile authdefaultauthoritative ' +
        'authdigestalgorithm authdigestdomain authdigestnccheck authdigestnonceformat ' +
        'authdigestnoncelifetime authdigestprovider authdigestqop authdigestshmemsize ' +
        'authgroupfile authldapbinddn authldapbindpassword authldapcharsetconfig ' +
        'authldapcomparednonserver authldapdereferencealiases authldapgroupattribute ' +
        'authldapgroupattributeisdn authldapremoteuserattribute authldapremoteuserisdn ' +
        'authldapurl authname authnprovideralias authtype authuserfile authzdbmauthoritative ' +
        'authzdbmtype authzdefaultauthoritative authzgroupfileauthoritative ' +
        'authzldapauthoritative authzownerauthoritative authzuserauthoritative ' +
        'balancermember browsermatch browsermatchnocase bufferedlogs cachedefaultexpire ' +
        'cachedirlength cachedirlevels cachedisable cacheenable cachefile ' +
        'cacheignorecachecontrol cacheignoreheaders cacheignorenolastmod ' +
        'cacheignorequerystring cachelastmodifiedfactor cachemaxexpire cachemaxfilesize ' +
        'cacheminfilesize cachenegotiateddocs cacheroot cachestorenostore cachestoreprivate ' +
        'cgimapextension charsetdefault charsetoptions charsetsourceenc checkcaseonly ' +
        'checkspelling chrootdir contentdigest cookiedomain cookieexpires cookielog ' +
        'cookiename cookiestyle cookietracking coredumpdirectory customlog dav ' +
        'davdepthinfinity davgenericlockdb davlockdb davmintimeout dbdexptime dbdkeep ' +
        'dbdmax dbdmin dbdparams dbdpersist dbdpreparesql dbdriver defaulticon ' +
        'defaultlanguage defaulttype deflatebuffersize deflatecompressionlevel ' +
        'deflatefilternote deflatememlevel deflatewindowsize deny directoryindex ' +
        'directorymatch directoryslash documentroot dumpioinput dumpiologlevel dumpiooutput ' +
        'enableexceptionhook enablemmap enablesendfile errordocument errorlog example ' +
        'expiresactive expiresbytype expiresdefault extendedstatus extfilterdefine ' +
        'extfilteroptions fileetag filterchain filterdeclare filterprotocol filterprovider ' +
        'filtertrace forcelanguagepriority forcetype forensiclog gracefulshutdowntimeout ' +
        'group header headername hostnamelookups identitycheck identitychecktimeout ' +
        'imapbase imapdefault imapmenu include indexheadinsert indexignore indexoptions ' +
        'indexorderdefault indexstylesheet isapiappendlogtoerrors isapiappendlogtoquery ' +
        'isapicachefile isapifakeasync isapilognotsupported isapireadaheadbuffer keepalive ' +
        'keepalivetimeout languagepriority ldapcacheentries ldapcachettl ' +
        'ldapconnectiontimeout ldapopcacheentries ldapopcachettl ldapsharedcachefile ' +
        'ldapsharedcachesize ldaptrustedclientcert ldaptrustedglobalcert ldaptrustedmode ' +
        'ldapverifyservercert limitinternalrecursion limitrequestbody limitrequestfields ' +
        'limitrequestfieldsize limitrequestline limitxmlrequestbody listen listenbacklog ' +
        'loadfile loadmodule lockfile logformat loglevel maxclients maxkeepaliverequests ' +
        'maxmemfree maxrequestsperchild maxrequestsperthread maxspareservers maxsparethreads ' +
        'maxthreads mcachemaxobjectcount mcachemaxobjectsize mcachemaxstreamingbuffer ' +
        'mcacheminobjectsize mcacheremovalalgorithm mcachesize metadir metafiles metasuffix ' +
        'mimemagicfile minspareservers minsparethreads mmapfile mod_gzip_on ' +
        'mod_gzip_add_header_count mod_gzip_keep_workfiles mod_gzip_dechunk ' +
        'mod_gzip_min_http mod_gzip_minimum_file_size mod_gzip_maximum_file_size ' +
        'mod_gzip_maximum_inmem_size mod_gzip_temp_dir mod_gzip_item_include ' +
        'mod_gzip_item_exclude mod_gzip_command_version mod_gzip_can_negotiate ' +
        'mod_gzip_handle_methods mod_gzip_static_suffix mod_gzip_send_vary ' +
        'mod_gzip_update_static modmimeusepathinfo multiviewsmatch namevirtualhost noproxy ' +
        'nwssltrustedcerts nwsslupgradeable options order passenv pidfile protocolecho ' +
        'proxybadheader proxyblock proxydomain proxyerroroverride proxyftpdircharset ' +
        'proxyiobuffersize proxymaxforwards proxypass proxypassinterpolateenv ' +
        'proxypassmatch proxypassreverse proxypassreversecookiedomain ' +
        'proxypassreversecookiepath proxypreservehost proxyreceivebuffersize proxyremote ' +
        'proxyremotematch proxyrequests proxyset proxystatus proxytimeout proxyvia ' +
        'readmename receivebuffersize redirect redirectmatch redirectpermanent ' +
        'redirecttemp removecharset removeencoding removehandler removeinputfilter ' +
        'removelanguage removeoutputfilter removetype requestheader require rewritebase ' +
        'rewritecond rewriteengine rewritelock rewritelog rewriteloglevel rewritemap ' +
        'rewriteoptions rewriterule rlimitcpu rlimitmem rlimitnproc satisfy scoreboardfile ' +
        'script scriptalias scriptaliasmatch scriptinterpretersource scriptlog ' +
        'scriptlogbuffer scriptloglength scriptsock securelisten seerequesttail ' +
        'sendbuffersize serveradmin serveralias serverlimit servername serverpath ' +
        'serverroot serversignature servertokens setenv setenvif setenvifnocase sethandler ' +
        'setinputfilter setoutputfilter ssienableaccess ssiendtag ssierrormsg ssistarttag ' +
        'ssitimeformat ssiundefinedecho sslcacertificatefile sslcacertificatepath ' +
        'sslcadnrequestfile sslcadnrequestpath sslcarevocationfile sslcarevocationpath ' +
        'sslcertificatechainfile sslcertificatefile sslcertificatekeyfile sslciphersuite ' +
        'sslcryptodevice sslengine sslhonorciperorder sslmutex ssloptions ' +
        'sslpassphrasedialog sslprotocol sslproxycacertificatefile ' +
        'sslproxycacertificatepath sslproxycarevocationfile sslproxycarevocationpath ' +
        'sslproxyciphersuite sslproxyengine sslproxymachinecertificatefile ' +
        'sslproxymachinecertificatepath sslproxyprotocol sslproxyverify ' +
        'sslproxyverifydepth sslrandomseed sslrequire sslrequiressl sslsessioncache ' +
        'sslsessioncachetimeout sslusername sslverifyclient sslverifydepth startservers ' +
        'startthreads substitute suexecusergroup threadlimit threadsperchild ' +
        'threadstacksize timeout traceenable transferlog typesconfig unsetenv ' +
        'usecanonicalname usecanonicalphysicalport user userdir virtualdocumentroot ' +
        'virtualdocumentrootip virtualscriptalias virtualscriptaliasip ' +
        'win32disableacceptex xbithack',
      literal: 'on off'
    },
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        className: 'sqbracket',
        begin: '\\s\\[', end: '\\]$'
      },
      {
        className: 'cbracket',
        begin: '[\\$%]\\{', end: '\\}',
        contains: ['self', NUMBER]
      },
      NUMBER,
      {className: 'tag', begin: '</?', end: '>'},
      hljs.QUOTE_STRING_MODE
    ]
  };
};
},{}],16:[function(require,module,exports){
module.exports = function(hljs) {
  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: ''});
  var TITLE = {
    className: 'title', begin: hljs.UNDERSCORE_IDENT_RE
  };
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    contains: ['self', hljs.C_NUMBER_MODE, STRING]
  };
  var COMMENTS = [
    {
      className: 'comment',
      begin: '--', end: '$',
    },
    {
      className: 'comment',
      begin: '\\(\\*', end: '\\*\\)',
      contains: ['self', {begin: '--', end: '$'}] //allow nesting
    },
    hljs.HASH_COMMENT_MODE
  ];

  return {
    keywords: {
      keyword:
        'about above after against and around as at back before beginning ' +
        'behind below beneath beside between but by considering ' +
        'contain contains continue copy div does eighth else end equal ' +
        'equals error every exit fifth first for fourth from front ' +
        'get given global if ignoring in into is it its last local me ' +
        'middle mod my ninth not of on onto or over prop property put ref ' +
        'reference repeat returning script second set seventh since ' +
        'sixth some tell tenth that the then third through thru ' +
        'timeout times to transaction try until where while whose with ' +
        'without',
      constant:
        'AppleScript false linefeed return pi quote result space tab true',
      type:
        'alias application boolean class constant date file integer list ' +
        'number real record string text',
      command:
        'activate beep count delay launch log offset read round ' +
        'run say summarize write',
      property:
        'character characters contents day frontmost id item length ' +
        'month name paragraph paragraphs rest reverse running time version ' +
        'weekday word words year'
    },
    contains: [
      STRING,
      hljs.C_NUMBER_MODE,
      {
        className: 'type',
        begin: '\\bPOSIX file\\b'
      },
      {
        className: 'command',
        begin:
          '\\b(clipboard info|the clipboard|info for|list (disks|folder)|' +
          'mount volume|path to|(close|open for) access|(get|set) eof|' +
          'current date|do shell script|get volume settings|random number|' +
          'set volume|system attribute|system info|time to GMT|' +
          '(load|run|store) script|scripting components|' +
          'ASCII (character|number)|localized string|' +
          'choose (application|color|file|file name|' +
          'folder|from list|remote application|URL)|' +
          'display (alert|dialog))\\b|^\\s*return\\b'
      },
      {
        className: 'constant',
        begin:
          '\\b(text item delimiters|current application|missing value)\\b'
      },
      {
        className: 'keyword',
        begin:
          '\\b(apart from|aside from|instead of|out of|greater than|' +
          "isn't|(doesn't|does not) (equal|come before|come after|contain)|" +
          '(greater|less) than( or equal)?|(starts?|ends|begins?) with|' +
          'contained by|comes (before|after)|a (ref|reference))\\b'
      },
      {
        className: 'property',
        begin:
          '\\b(POSIX path|(date|time) string|quoted form)\\b'
      },
      {
        className: 'function_start',
        beginWithKeyword: true,
        keywords: 'on',
        illegal: '[${=;\\n]',
        contains: [TITLE, PARAMS]
      }
    ].concat(COMMENTS)
  };
};
},{}],17:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        /* mnemonic */
        'adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs ' +
        'brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr ' +
        'clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor ' +
        'fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul ' +
        'muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs ' +
        'sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub ' +
        'subi swap tst wdr',
      built_in:
        /* general purpose registers */
        'r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 ' +
        'r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl ' +
        /* IO Registers (ATMega128) */
        'ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h ' +
        'tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c ' +
        'ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg ' +
        'ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk ' +
        'tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al ' +
        'ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr ' +
        'porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 ' +
        'ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf'
    },
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {className: 'comment', begin: ';',  end: '$'},
      hljs.C_NUMBER_MODE, // 0x..., decimal, float
      hljs.BINARY_NUMBER_MODE, // 0b...
      {
        className: 'number',
        begin: '\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)' // $..., 0o...
      },
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'', end: '[^\\\\]\'',
        illegal: '[^\\\\][^\']'
      },
      {className: 'label',  begin: '^[A-Za-z0-9_.$]+:'},
      {className: 'preprocessor', begin: '#', end: '$'},
      {  // директивы «.include» «.macro» и т.д.
        className: 'preprocessor',
        begin: '\\.[a-zA-Z]+'
      },
      {  // подстановка в «.macro»
        className: 'localvars',
        begin: '@[0-9]+'
      }
    ]
  };
};
},{}],18:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords: 'false int abstract private char interface boolean static null if for true ' +
      'while long throw finally protected extends final implements return void enum else ' +
      'break new catch byte super class case short default double public try this switch ' +
      'continue reverse firstfast firstonly forupdate nofetch sum avg minof maxof count ' +
      'order group by asc desc index hint like dispaly edit client server ttsbegin ' +
      'ttscommit str real date container anytype common div mod',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      },
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        illegal: ':',
        keywords: 'class interface',
        contains: [
          {
            className: 'inheritance',
            beginWithKeyword: true,
            keywords: 'extends implements',
            relevance: 10
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          }
        ]
      }
    ]
  };
};
},{}],19:[function(require,module,exports){
module.exports = function(hljs) {
  var BASH_LITERAL = 'true false';
  var BASH_KEYWORD = 'if then else elif fi for break continue while in do done echo exit return set declare';
  var VAR1 = {
    className: 'variable', begin: '\\$[a-zA-Z0-9_#]+'
  };
  var VAR2 = {
    className: 'variable', begin: '\\${([^}]|\\\\})+}'
  };
  var QUOTE_STRING = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [hljs.BACKSLASH_ESCAPE, VAR1, VAR2],
    relevance: 0
  };
  var APOS_STRING = {
    className: 'string',
    begin: '\'', end: '\'',
    contains: [{begin: '\'\''}],
    relevance: 0
  };
  var TEST_CONDITION = {
    className: 'test_condition',
    begin: '', end: '',
    contains: [QUOTE_STRING, APOS_STRING, VAR1, VAR2],
    keywords: {
      literal: BASH_LITERAL
    },
    relevance: 0
  };

  return {
    keywords: {
      keyword: BASH_KEYWORD,
      literal: BASH_LITERAL
    },
    contains: [
      {
        className: 'shebang',
        begin: '(#!\\/bin\\/bash)|(#!\\/bin\\/sh)',
        relevance: 10
      },
      VAR1,
      VAR2,
      hljs.HASH_COMMENT_MODE,
      QUOTE_STRING,
      APOS_STRING,
      hljs.inherit(TEST_CONDITION, {begin: '\\[ ', end: ' \\]', relevance: 0}),
      hljs.inherit(TEST_CONDITION, {begin: '\\[\\[ ', end: ' \\]\\]'})
    ]
  };
};
},{}],20:[function(require,module,exports){
module.exports = function(hljs){
  return {
    contains: [
      {
        className: 'comment',
        begin: '[^\\[\\]\\.,\\+\\-<> \r\n]',
        excludeEnd: true,
        end: '[\\[\\]\\.,\\+\\-<> \r\n]',
        relevance: 0
      },
      {
        className: 'title',
        begin: '[\\[\\]]',
        relevance: 0
      },
      {
        className: 'string',
        begin: '[\\.,]'
      },
      {
        className: 'literal',
        begin: '[\\+\\-]'
      }
    ]
  };
};
},{}],21:[function(require,module,exports){
module.exports = function(hljs) {
  var keywords = {
    built_in:
      // Clojure keywords
      'def cond apply if-not if-let if not not= = &lt; < > &lt;= <= >= == + / * - rem '+
      'quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? '+
      'set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? '+
      'class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? '+
      'string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . '+
      'inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last '+
      'drop-while while intern condp case reduced cycle split-at split-with repeat replicate '+
      'iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext '+
      'nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends '+
      'add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler '+
      'set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter '+
      'monitor-exit defmacro defn defn- macroexpand macroexpand-1 for doseq dosync dotimes and or '+
      'when when-not when-let comp juxt partial sequence memoize constantly complement identity assert '+
      'peek pop doto proxy defstruct first rest cons defprotocol cast coll deftype defrecord last butlast '+
      'sigs reify second ffirst fnext nfirst nnext defmulti defmethod meta with-meta ns in-ns create-ns import '+
      'intern refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! '+
      'assoc! dissoc! pop! disj! import use class type num float double short byte boolean bigint biginteger '+
      'bigdec print-method print-dup throw-if throw printf format load compile get-in update-in pr pr-on newline '+
      'flush read slurp read-line subvec with-open memfn time ns assert re-find re-groups rand-int rand mod locking '+
      'assert-valid-fdecl alias namespace resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! '+
      'reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! '+
      'new next conj set! memfn to-array future future-call into-array aset gen-class reduce merge map filter find empty '+
      'hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list '+
      'disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer '+
      'chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate '+
      'unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta '+
      'lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize'
   };

  var CLJ_IDENT_RE = '[a-zA-Z_0-9\\!\\.\\?\\-\\+\\*\\/\\<\\=\\>\\&\\#\\$\';]+';
  var SIMPLE_NUMBER_RE = '[\\s:\\(\\{]+\\d+(\\.\\d+)?';

  var NUMBER = {
    className: 'number', begin: SIMPLE_NUMBER_RE,
    relevance: 0
  };
  var STRING = {
    className: 'string',
    begin: '"', end: '"',
    contains: [hljs.BACKSLASH_ESCAPE],
    relevance: 0
  };
  var COMMENT = {
    className: 'comment',
    begin: ';', end: '$',
    relevance: 0
  };
  var COLLECTION = {
    className: 'collection',
    begin: '[\\[\\{]', end: '[\\]\\}]'
  };
  var HINT = {
    className: 'comment',
    begin: '\\^' + CLJ_IDENT_RE
  };
  var HINT_COL = {
    className: 'comment',
    begin: '\\^\\{', end: '\\}'
  };
  var KEY = {
    className: 'attribute',
    begin: '[:]' + CLJ_IDENT_RE
  };
  var LIST = {
    className: 'list',
    begin: '\\(', end: '\\)',
    relevance: 0
  };
  var BODY = {
    endsWithParent: true, excludeEnd: true,
    keywords: {literal: 'true false nil'},
    relevance: 0
  };
  var TITLE = {
    keywords: keywords,
    lexems: CLJ_IDENT_RE,
    className: 'title', begin: CLJ_IDENT_RE,
    starts: BODY
  };

  LIST.contains = [{className: 'comment', begin: 'comment'}, TITLE];
  BODY.contains = [LIST, STRING, HINT, HINT_COL, COMMENT, KEY, COLLECTION, NUMBER];
  COLLECTION.contains = [LIST, STRING, HINT, COMMENT, KEY, COLLECTION, NUMBER];

  return {
    illegal: '\\S',
    contains: [
      COMMENT,
      LIST
    ]
  }
};
},{}],22:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: 'add_custom_command add_custom_target add_definitions add_dependencies ' +
      'add_executable add_library add_subdirectory add_test aux_source_directory ' +
      'break build_command cmake_minimum_required cmake_policy configure_file ' +
      'create_test_sourcelist define_property else elseif enable_language enable_testing ' +
      'endforeach endfunction endif endmacro endwhile execute_process export find_file ' +
      'find_library find_package find_path find_program fltk_wrap_ui foreach function ' +
      'get_cmake_property get_directory_property get_filename_component get_property ' +
      'get_source_file_property get_target_property get_test_property if include ' +
      'include_directories include_external_msproject include_regular_expression install ' +
      'link_directories load_cache load_command macro mark_as_advanced message option ' +
      'output_required_files project qt_wrap_cpp qt_wrap_ui remove_definitions return ' +
      'separate_arguments set set_directory_properties set_property ' +
      'set_source_files_properties set_target_properties set_tests_properties site_name ' +
      'source_group string target_link_libraries try_compile try_run unset variable_watch ' +
      'while build_name exec_program export_library_dependencies install_files ' +
      'install_programs install_targets link_libraries make_directory remove subdir_depends ' +
      'subdirs use_mangled_mesa utility_source variable_requires write_file',
    contains: [
      {
        className: 'envvar',
        begin: '\\${', end: '}'
      },
      hljs.HASH_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.NUMBER_MODE
    ]
  };
};
},{}],23:[function(require,module,exports){
module.exports = function(hljs) {
  var KEYWORDS = {
    keyword:
      // JS keywords
      'in if for while finally new do return else break catch instanceof throw try this ' +
      'switch continue typeof delete debugger super ' +
      // Coffee keywords
      'then unless until loop of by when and or is isnt not',
    literal:
      // JS literals
      'true false null undefined ' +
      // Coffee literals
      'yes no on off ',
    reserved: 'case default function var void with const let enum export import native ' +
      '__hasProp __extends __slice __bind __indexOf'
  };
  var JS_IDENT_RE = '[A-Za-z$_][0-9A-Za-z$_]*';
  var TITLE = {className: 'title', begin: JS_IDENT_RE};
  var SUBST = {
    className: 'subst',
    begin: '#\\{', end: '}',
    keywords: KEYWORDS,
    contains: [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE]
  };

  return {
    keywords: KEYWORDS,
    contains: [
      // Numbers
      hljs.BINARY_NUMBER_MODE,
      hljs.C_NUMBER_MODE,
      // Strings
      hljs.APOS_STRING_MODE,
      {
        className: 'string',
        begin: '"""', end: '"""',
        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
      },
      {
        className: 'string',
        begin: '"', end: '"',
        contains: [hljs.BACKSLASH_ESCAPE, SUBST],
        relevance: 0
      },
      // Comments
      {
        className: 'comment',
        begin: '###', end: '###'
      },
      hljs.HASH_COMMENT_MODE,
      {
        className: 'regexp',
        begin: '///', end: '///',
        contains: [hljs.HASH_COMMENT_MODE]
      },
      {
        className: 'regexp', begin: '//[gim]*'
      },
      {
        className: 'regexp',
        begin: '/\\S(\\\\.|[^\\n])*/[gim]*' // \S is required to parse x / 2 / 3 as two divisions
      },
      {
        begin: '`', end: '`',
        excludeBegin: true, excludeEnd: true,
        subLanguage: 'javascript'
      },
      {
        className: 'function',
        begin: JS_IDENT_RE + '\\s*=\\s*(\\(.+\\))?\\s*[-=]>',
        returnBegin: true,
        contains: [
          TITLE,
          {
            className: 'params',
            begin: '\\(', end: '\\)'
          }
        ]
      },
      {
        className: 'class',
        beginWithKeyword: true, keywords: 'class',
        end: '$',
        illegal: ':',
        contains: [
          {
            beginWithKeyword: true, keywords: 'extends',
            endsWithParent: true,
            illegal: ':',
            contains: [TITLE]
          },
          TITLE
        ]
      },
      {
        className: 'property',
        begin: '@' + JS_IDENT_RE
      }
    ]
  };
};
},{}],24:[function(require,module,exports){
module.exports = function(hljs) {
  var CPP_KEYWORDS = {
    keyword: 'false int float while private char catch export virtual operator sizeof ' +
      'dynamic_cast|10 typedef const_cast|10 const struct for static_cast|10 union namespace ' +
      'unsigned long throw volatile static protected bool template mutable if public friend ' +
      'do return goto auto void enum else break new extern using true class asm case typeid ' +
      'short reinterpret_cast|10 default double register explicit signed typename try this ' +
      'switch continue wchar_t inline delete alignof char16_t char32_t constexpr decltype ' +
      'noexcept nullptr static_assert thread_local restrict _Bool complex',
    built_in: 'std string cin cout cerr clog stringstream istringstream ostringstream ' +
      'auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set ' +
      'unordered_map unordered_multiset unordered_multimap array shared_ptr'
  };
  return {
    keywords: CPP_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'\\\\?.', end: '\'',
        illegal: '.'
      },
      {
        className: 'number',
        begin: '\\b(\\d+(\\.\\d*)?|\\.\\d+)(u|U|l|L|ul|UL|f|F)'
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      },
      {
        className: 'stl_container',
        begin: '\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<', end: '>',
        keywords: CPP_KEYWORDS,
        relevance: 10,
        contains: ['self']
      }
    ]
  };
};
},{}],25:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      // Normal keywords.
      'abstract as base bool break byte case catch char checked class const continue decimal ' +
      'default delegate do double else enum event explicit extern false finally fixed float ' +
      'for foreach goto if implicit in int interface internal is lock long namespace new null ' +
      'object operator out override params private protected public readonly ref return sbyte ' +
      'sealed short sizeof stackalloc static string struct switch this throw true try typeof ' +
      'uint ulong unchecked unsafe ushort using virtual volatile void while ' +
      // Contextual keywords.
      'ascending descending from get group into join let orderby partial select set value var '+
      'where yield',
    contains: [
      {
        className: 'comment',
        begin: '///', end: '$', returnBegin: true,
        contains: [
          {
            className: 'xmlDocTag',
            begin: '///|<!--|-->'
          },
          {
            className: 'xmlDocTag',
            begin: '</?', end: '>'
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$',
        keywords: 'if else elif endif define undef warning error line region endregion pragma checksum'
      },
      {
        className: 'string',
        begin: '@"', end: '"',
        contains: [{begin: '""'}]
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],26:[function(require,module,exports){
module.exports = function(hljs) {
  var FUNCTION = {
    className: 'function',
    begin: hljs.IDENT_RE + '\\(', end: '\\)',
    contains: [hljs.NUMBER_MODE, hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE]
  };
  return {
    case_insensitive: true,
    illegal: '[=/|\']',
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'id', begin: '\\#[A-Za-z0-9_-]+'
      },
      {
        className: 'class', begin: '\\.[A-Za-z0-9_-]+',
        relevance: 0
      },
      {
        className: 'attr_selector',
        begin: '\\[', end: '\\]',
        illegal: '$'
      },
      {
        className: 'pseudo',
        begin: ':(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\"\\\']+'
      },
      {
        className: 'at_rule',
        begin: '@(font-face|page)',
        lexems: '[a-z-]+',
        keywords: 'font-face page'
      },
      {
        className: 'at_rule',
        begin: '@', end: '[{;]', // at_rule eating first "{" is a good thing
                                 // because it doesn’t let it to be parsed as
                                 // a rule set but instead drops parser into
                                 // the default mode which is how it should be.
        excludeEnd: true,
        keywords: 'import page media charset',
        contains: [
          FUNCTION,
          hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE,
          hljs.NUMBER_MODE
        ]
      },
      {
        className: 'tag', begin: hljs.IDENT_RE,
        relevance: 0
      },
      {
        className: 'rules',
        begin: '{', end: '}',
        illegal: '[^\\s]',
        relevance: 0,
        contains: [
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: 'rule',
            begin: '[^\\s]', returnBegin: true, end: ';', endsWithParent: true,
            contains: [
              {
                className: 'attribute',
                begin: '[A-Z\\_\\.\\-]+', end: ':',
                excludeEnd: true,
                illegal: '[^\\s]',
                starts: {
                  className: 'value',
                  endsWithParent: true, excludeEnd: true,
                  contains: [
                    FUNCTION,
                    hljs.NUMBER_MODE,
                    hljs.QUOTE_STRING_MODE,
                    hljs.APOS_STRING_MODE,
                    hljs.C_BLOCK_COMMENT_MODE,
                    {
                      className: 'hexcolor', begin: '\\#[0-9A-F]+'
                    },
                    {
                      className: 'important', begin: '!important'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  };
};
},{}],27:[function(require,module,exports){
module.exports = /**
 * Known issues:
 *
 * - invalid hex string literals will be recognized as a double quoted strings
 *   but 'x' at the beginning of string will not be matched
 *
 * - delimited string literals are not checked for matching end delimiter
 *   (not possible to do with js regexp)
 *
 * - content of token string is colored as a string (i.e. no keyword coloring inside a token string)
 *   also, content of token string is not validated to contain only valid D tokens
 *
 * - special token sequence rule is not strictly following D grammar (anything following #line
 *   up to the end of line is matched as special token sequence)
 */

function(hljs) {

	/**
	 * Language keywords
	 *
	 * @type {Object}
	 */
	var D_KEYWORDS = {
		keyword:
			'abstract alias align asm assert auto body break byte case cast catch class ' +
			'const continue debug default delete deprecated do else enum export extern final ' +
			'finally for foreach foreach_reverse|10 goto if immutable import in inout int ' +
			'interface invariant is lazy macro mixin module new nothrow out override package ' +
			'pragma private protected public pure ref return scope shared static struct ' +
			'super switch synchronized template this throw try typedef typeid typeof union ' +
			'unittest version void volatile while with __FILE__ __LINE__ __gshared|10 ' +
			'__thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__',
		built_in:
			'bool cdouble cent cfloat char creal dchar delegate double dstring float function ' +
			'idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar ' +
			'wstring',
		literal:
			'false null true'
	};

	/**
	 * Number literal regexps
	 *
	 * @type {String}
	 */
	var decimal_integer_re = '(0|[1-9][\\d_]*)',
		decimal_integer_nosus_re = '(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)',
		binary_integer_re = '0[bB][01_]+',
		hexadecimal_digits_re = '([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)',
		hexadecimal_integer_re = '0[xX]' + hexadecimal_digits_re,

		decimal_exponent_re = '([eE][+-]?' + decimal_integer_nosus_re + ')',
		decimal_float_re = '(' + decimal_integer_nosus_re + '(\\.\\d*|' + decimal_exponent_re + ')|' +
								'\\d+\\.' + decimal_integer_nosus_re + decimal_integer_nosus_re + '|' +
								'\\.' + decimal_integer_re + decimal_exponent_re + '?' +
							')',
		hexadecimal_float_re = '(0[xX](' +
									hexadecimal_digits_re + '\\.' + hexadecimal_digits_re + '|'+
									'\\.?' + hexadecimal_digits_re +
							   ')[pP][+-]?' + decimal_integer_nosus_re + ')',

		integer_re = '(' +
			decimal_integer_re + '|' +
			binary_integer_re  + '|' +
		 	hexadecimal_integer_re   +
		')',

		float_re = '(' +
			hexadecimal_float_re + '|' +
			decimal_float_re  +
		')';

	/**
	 * Escape sequence supported in D string and character literals
	 *
	 * @type {String}
	 */
	var escape_sequence_re = '\\\\(' +
							'[\'"\\?\\\\abfnrtv]|' +	// common escapes
							'u[\\dA-Fa-f]{4}|' + 		// four hex digit unicode codepoint
							'[0-7]{1,3}|' + 			// one to three octal digit ascii char code
							'x[\\dA-Fa-f]{2}|' +		// two hex digit ascii char code
							'U[\\dA-Fa-f]{8}' +			// eight hex digit unicode codepoint
						  ')|' +
						  '&[a-zA-Z\\d]{2,};';			// named character entity


	/**
	 * D integer number literals
	 *
	 * @type {Object}
	 */
	var D_INTEGER_MODE = {
		className: 'number',
    	begin: '\\b' + integer_re + '(L|u|U|Lu|LU|uL|UL)?',
    	relevance: 0
	};

	/**
	 * [D_FLOAT_MODE description]
	 * @type {Object}
	 */
	var D_FLOAT_MODE = {
		className: 'number',
		begin: '\\b(' +
				float_re + '([fF]|L|i|[fF]i|Li)?|' +
				integer_re + '(i|[fF]i|Li)' +
			')',
		relevance: 0
	};

	/**
	 * D character literal
	 *
	 * @type {Object}
	 */
	var D_CHARACTER_MODE = {
		className: 'string',
		begin: '\'(' + escape_sequence_re + '|.)', end: '\'',
		illegal: '.'
	};

	/**
	 * D string escape sequence
	 *
	 * @type {Object}
	 */
	var D_ESCAPE_SEQUENCE = {
		begin: escape_sequence_re,
		relevance: 0
	}

	/**
	 * D double quoted string literal
	 *
	 * @type {Object}
	 */
	var D_STRING_MODE = {
		className: 'string',
		begin: '"',
		contains: [D_ESCAPE_SEQUENCE],
		end: '"[cwd]?',
		relevance: 0
	};

	/**
	 * D wysiwyg and delimited string literals
	 *
	 * @type {Object}
	 */
	var D_WYSIWYG_DELIMITED_STRING_MODE = {
		className: 'string',
		begin: '[rq]"',
		end: '"[cwd]?',
		relevance: 5
	};

	/**
	 * D alternate wysiwyg string literal
	 *
	 * @type {Object}
	 */
	var D_ALTERNATE_WYSIWYG_STRING_MODE = {
		className: 'string',
		begin: '`',
		end: '`[cwd]?'
	};

	/**
	 * D hexadecimal string literal
	 *
	 * @type {Object}
	 */
	var D_HEX_STRING_MODE = {
		className: 'string',
		begin: 'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',
		relevance: 10
	};

	/**
	 * D delimited string literal
	 *
	 * @type {Object}
	 */
	var D_TOKEN_STRING_MODE = {
		className: 'string',
		begin: 'q"\\{',
		end: '\\}"'
	};

	/**
	 * Hashbang support
	 *
	 * @type {Object}
	 */
	var D_HASHBANG_MODE = {
		className: 'shebang',
		begin: '^#!',
		end: '$',
		relevance: 5
	};

	/**
	 * D special token sequence
	 *
	 * @type {Object}
	 */
	var D_SPECIAL_TOKEN_SEQUENCE_MODE = {
		className: 'preprocessor',
		begin: '#(line)',
		end: '$',
		relevance: 5
	};

	/**
	 * D attributes
	 *
	 * @type {Object}
	 */
	var D_ATTRIBUTE_MODE = {
		className: 'keyword',
		begin: '@[a-zA-Z_][a-zA-Z_\\d]*'
	};

	/**
	 * D nesting comment
	 *
	 * @type {Object}
	 */
	var D_NESTING_COMMENT_MODE = {
		className: 'comment',
		begin: '\\/\\+',
		contains: ['self'],
		end: '\\+\\/',
		relevance: 10
	}

	return {
		lexems: hljs.UNDERSCORE_IDENT_RE,
		keywords: D_KEYWORDS,
		contains: [
			hljs.C_LINE_COMMENT_MODE,
  			hljs.C_BLOCK_COMMENT_MODE,
  			D_NESTING_COMMENT_MODE,
  			D_HEX_STRING_MODE,
  			D_STRING_MODE,
  			D_WYSIWYG_DELIMITED_STRING_MODE,
  			D_ALTERNATE_WYSIWYG_STRING_MODE,
  			D_TOKEN_STRING_MODE,
  			D_FLOAT_MODE,
  			D_INTEGER_MODE,
  			D_CHARACTER_MODE,
  			D_HASHBANG_MODE,
  			D_SPECIAL_TOKEN_SEQUENCE_MODE,
  			D_ATTRIBUTE_MODE
		]
	};
};
},{}],28:[function(require,module,exports){
module.exports = function(hljs) {
  var DELPHI_KEYWORDS = 'and safecall cdecl then string exports library not pascal set ' +
    'virtual file in array label packed end. index while const raise for to implementation ' +
    'with except overload destructor downto finally program exit unit inherited override if ' +
    'type until function do begin repeat goto nil far initialization object else var uses ' +
    'external resourcestring interface end finalization class asm mod case on shr shl of ' +
    'register xorwrite threadvar try record near stored constructor stdcall inline div out or ' +
    'procedure';
  var DELPHI_CLASS_KEYWORDS = 'safecall stdcall pascal stored const implementation ' +
    'finalization except to finally program inherited override then exports string read not ' +
    'mod shr try div shl set library message packed index for near overload label downto exit ' +
    'public goto interface asm on of constructor or private array unit raise destructor var ' +
    'type until function else external with case default record while protected property ' +
    'procedure published and cdecl do threadvar file in if end virtual write far out begin ' +
    'repeat nil initialization object uses resourcestring class register xorwrite inline static';
  var CURLY_COMMENT =  {
    className: 'comment',
    begin: '{', end: '}',
    relevance: 0
  };
  var PAREN_COMMENT = {
    className: 'comment',
    begin: '\\(\\*', end: '\\*\\)',
    relevance: 10
  };
  var STRING = {
    className: 'string',
    begin: '\'', end: '\'',
    contains: [{begin: '\'\''}],
    relevance: 0
  };
  var CHAR_STRING = {
    className: 'string', begin: '(#\\d+)+'
  };
  var FUNCTION = {
    className: 'function',
    beginWithKeyword: true, end: '[:;]',
    keywords: 'function constructor|10 destructor|10 procedure|10',
    contains: [
      {
        className: 'title', begin: hljs.IDENT_RE
      },
      {
        className: 'params',
        begin: '\\(', end: '\\)',
        keywords: DELPHI_KEYWORDS,
        contains: [STRING, CHAR_STRING]
      },
      CURLY_COMMENT, PAREN_COMMENT
    ]
  };
  return {
    case_insensitive: true,
    keywords: DELPHI_KEYWORDS,
    illegal: '("|\\$[G-Zg-z]|\\/\\*|</)',
    contains: [
      CURLY_COMMENT, PAREN_COMMENT, hljs.C_LINE_COMMENT_MODE,
      STRING, CHAR_STRING,
      hljs.NUMBER_MODE,
      FUNCTION,
      {
        className: 'class',
        begin: '=\\bclass\\b', end: 'end;',
        keywords: DELPHI_CLASS_KEYWORDS,
        contains: [
          STRING, CHAR_STRING,
          CURLY_COMMENT, PAREN_COMMENT, hljs.C_LINE_COMMENT_MODE,
          FUNCTION
        ]
      }
    ]
  };
};
},{}],29:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      {
        className: 'chunk',
        begin: '^\\@\\@ +\\-\\d+,\\d+ +\\+\\d+,\\d+ +\\@\\@$',
        relevance: 10
      },
      {
        className: 'chunk',
        begin: '^\\*\\*\\* +\\d+,\\d+ +\\*\\*\\*\\*$',
        relevance: 10
      },
      {
        className: 'chunk',
        begin: '^\\-\\-\\- +\\d+,\\d+ +\\-\\-\\-\\-$',
        relevance: 10
      },
      {
        className: 'header',
        begin: 'Index: ', end: '$'
      },
      {
        className: 'header',
        begin: '=====', end: '=====$'
      },
      {
        className: 'header',
        begin: '^\\-\\-\\-', end: '$'
      },
      {
        className: 'header',
        begin: '^\\*{3} ', end: '$'
      },
      {
        className: 'header',
        begin: '^\\+\\+\\+', end: '$'
      },
      {
        className: 'header',
        begin: '\\*{5}', end: '\\*{5}$'
      },
      {
        className: 'addition',
        begin: '^\\+', end: '$'
      },
      {
        className: 'deletion',
        begin: '^\\-', end: '$'
      },
      {
        className: 'change',
        begin: '^\\!', end: '$'
      }
    ]
  };
};
},{}],30:[function(require,module,exports){
module.exports = function(hljs) {

  function allowsDjangoSyntax(mode, parent) {
    return (
      parent == undefined || // default mode
      (!mode.className && parent.className == 'tag') || // tag_internal
      mode.className == 'value' // value
    );
  }

  function copy(mode, parent) {
    var result = {};
    for (var key in mode) {
      if (key != 'contains') {
        result[key] = mode[key];
      }
      var contains = [];
      for (var i = 0; mode.contains && i < mode.contains.length; i++) {
        contains.push(copy(mode.contains[i], mode));
      }
      if (allowsDjangoSyntax(mode, parent)) {
        contains = DJANGO_CONTAINS.concat(contains);
      }
      if (contains.length) {
        result.contains = contains;
      }
    }
    return result;
  }

  var FILTER = {
    className: 'filter',
    begin: '\\|[A-Za-z]+\\:?', excludeEnd: true,
    keywords:
      'truncatewords removetags linebreaksbr yesno get_digit timesince random striptags ' +
      'filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands ' +
      'title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode ' +
      'timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort ' +
      'dictsortreversed default_if_none pluralize lower join center default ' +
      'truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first ' +
      'escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize ' +
      'localtime utc timezone',
    contains: [
      {className: 'argument', begin: '"', end: '"'}
    ]
  };

  var DJANGO_CONTAINS = [
    {
      className: 'template_comment',
      begin: '{%\\s*comment\\s*%}', end: '{%\\s*endcomment\\s*%}'
    },
    {
      className: 'template_comment',
      begin: '{#', end: '#}'
    },
    {
      className: 'template_tag',
      begin: '{%', end: '%}',
      keywords:
        'comment endcomment load templatetag ifchanged endifchanged if endif firstof for ' +
        'endfor in ifnotequal endifnotequal widthratio extends include spaceless ' +
        'endspaceless regroup by as ifequal endifequal ssi now with cycle url filter ' +
        'endfilter debug block endblock else autoescape endautoescape csrf_token empty elif ' +
        'endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix ' +
        'plural get_current_language language get_available_languages ' +
        'get_current_language_bidi get_language_info get_language_info_list localize ' +
        'endlocalize localtime endlocaltime timezone endtimezone get_current_timezone',
      contains: [FILTER]
    },
    {
      className: 'variable',
      begin: '{{', end: '}}',
      contains: [FILTER]
    }
  ];

  var result = copy(hljs.LANGUAGES.xml);
  result.case_insensitive = true;
  return result;
};
},{}],31:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      flow: 'if else goto for in do call exit not exist errorlevel defined equ neq lss leq gtr geq',
      keyword: 'shift cd dir echo setlocal endlocal set pause copy',
      stream: 'prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux',
      winutils: 'ping net ipconfig taskkill xcopy ren del'
    },
    contains: [
      {
        className: 'envvar', begin: '%%[^ ]'
      },
      {
        className: 'envvar', begin: '%[^ ]+?%'
      },
      {
        className: 'envvar', begin: '![^ ]+?!'
      },
      {
        className: 'number', begin: '\\b\\d+',
        relevance: 0
      },
      {
        className: 'comment',
        begin: '@?rem', end: '$'
      }
    ]
  };
};
},{}],32:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      special_functions:
        'spawn spawn_link self',
      reserved:
        'after and andalso|10 band begin bnot bor bsl bsr bxor case catch cond div end fun if ' +
        'let not of or orelse|10 query receive rem try when xor'
    },
    contains: [
      {
        className: 'prompt', begin: '^[0-9]+> ',
        relevance: 10
      },
      {
        className: 'comment',
        begin: '%', end: '$'
      },
      {
        className: 'number',
        begin: '\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)',
        relevance: 0
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'constant', begin: '\\?(::)?([A-Z]\\w*(::)?)+'
      },
      {
        className: 'arrow', begin: '->'
      },
      {
        className: 'ok', begin: 'ok'
      },
      {
        className: 'exclamation_mark', begin: '!'
      },
      {
        className: 'function_or_atom',
        begin: '(\\b[a-z\'][a-zA-Z0-9_\']*:[a-z\'][a-zA-Z0-9_\']*)|(\\b[a-z\'][a-zA-Z0-9_\']*)',
        relevance: 0
      },
      {
        className: 'variable',
        begin: '[A-Z][a-zA-Z0-9_\']*',
        relevance: 0
      }
    ]
  };
};
},{}],33:[function(require,module,exports){
module.exports = function(hljs) {
  var BASIC_ATOM_RE = '[a-z\'][a-zA-Z0-9_\']*';
  var FUNCTION_NAME_RE = '(' + BASIC_ATOM_RE + ':' + BASIC_ATOM_RE + '|' + BASIC_ATOM_RE + ')';
  var ERLANG_RESERVED = {
    keyword:
      'after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun let ' +
      'not of orelse|10 query receive rem try when xor',
    literal:
      'false true'
  };

  var COMMENT = {
    className: 'comment',
    begin: '%', end: '$',
    relevance: 0
  };
  var NUMBER = {
    className: 'number',
    begin: '\\b(\\d+#[a-fA-F0-9]+|\\d+(\\.\\d+)?([eE][-+]?\\d+)?)',
    relevance: 0
  };
  var NAMED_FUN = {
    begin: 'fun\\s+' + BASIC_ATOM_RE + '/\\d+'
  };
  var FUNCTION_CALL = {
    begin: FUNCTION_NAME_RE + '\\(', end: '\\)',
    returnBegin: true,
    relevance: 0,
    contains: [
      {
        className: 'function_name', begin: FUNCTION_NAME_RE,
        relevance: 0
      },
      {
        begin: '\\(', end: '\\)', endsWithParent: true,
        returnEnd: true,
        relevance: 0
        // "contains" defined later
      }
    ]
  };
  var TUPLE = {
    className: 'tuple',
    begin: '{', end: '}',
    relevance: 0
    // "contains" defined later
  };
  var VAR1 = {
    className: 'variable',
    begin: '\\b_([A-Z][A-Za-z0-9_]*)?',
    relevance: 0
  };
  var VAR2 = {
    className: 'variable',
    begin: '[A-Z][a-zA-Z0-9_]*',
    relevance: 0
  };
  var RECORD_ACCESS = {
    begin: '#', end: '}',
    illegal: '.',
    relevance: 0,
    returnBegin: true,
    contains: [
      {
        className: 'record_name',
        begin: '#' + hljs.UNDERSCORE_IDENT_RE,
        relevance: 0
      },
      {
        begin: '{', endsWithParent: true,
        relevance: 0
        // "contains" defined later
      }
    ]
  };

  var BLOCK_STATEMENTS = {
    keywords: ERLANG_RESERVED,
    begin: '(fun|receive|if|try|case)', end: 'end'
  };
  BLOCK_STATEMENTS.contains = [
    COMMENT,
    NAMED_FUN,
    hljs.inherit(hljs.APOS_STRING_MODE, {className: ''}),
    BLOCK_STATEMENTS,
    FUNCTION_CALL,
    hljs.QUOTE_STRING_MODE,
    NUMBER,
    TUPLE,
    VAR1, VAR2,
    RECORD_ACCESS
  ];

  var BASIC_MODES = [
    COMMENT,
    NAMED_FUN,
    BLOCK_STATEMENTS,
    FUNCTION_CALL,
    hljs.QUOTE_STRING_MODE,
    NUMBER,
    TUPLE,
    VAR1, VAR2,
    RECORD_ACCESS
  ];
  FUNCTION_CALL.contains[1].contains = BASIC_MODES;
  TUPLE.contains = BASIC_MODES;
  RECORD_ACCESS.contains[1].contains = BASIC_MODES;

  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    contains: BASIC_MODES
  };
  return {
    keywords: ERLANG_RESERVED,
    illegal: '(</|\\*=|\\+=|-=|/=|/\\*|\\*/|\\(\\*|\\*\\))',
    contains: [
      {
        className: 'function',
        begin: '^' + BASIC_ATOM_RE + '\\s*\\(', end: '->',
        returnBegin: true,
        illegal: '\\(|#|//|/\\*|\\\\|:',
        contains: [
          PARAMS,
          {
            className: 'title', begin: BASIC_ATOM_RE
          }
        ],
        starts: {
          end: ';|\\.',
          keywords: ERLANG_RESERVED,
          contains: BASIC_MODES
        }
      },
      COMMENT,
      {
        className: 'pp',
        begin: '^-', end: '\\.',
        relevance: 0,
        excludeEnd: true,
        returnBegin: true,
        lexems: '-' + hljs.IDENT_RE,
        keywords:
          '-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn ' +
          '-import -include -include_lib -compile -define -else -endif -file -behaviour ' +
          '-behavior',
        contains: [PARAMS]
      },
      NUMBER,
      hljs.QUOTE_STRING_MODE,
      RECORD_ACCESS,
      VAR1, VAR2,
      TUPLE
    ]
  };
};
},{}],34:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        'atomic_uint attribute bool break bvec2 bvec3 bvec4 case centroid coherent const continue default ' +
        'discard dmat2 dmat2x2 dmat2x3 dmat2x4 dmat3 dmat3x2 dmat3x3 dmat3x4 dmat4 dmat4x2 dmat4x3 ' +
        'dmat4x4 do double dvec2 dvec3 dvec4 else flat float for highp if iimage1D iimage1DArray ' +
        'iimage2D iimage2DArray iimage2DMS iimage2DMSArray iimage2DRect iimage3D iimageBuffer iimageCube ' +
        'iimageCubeArray image1D image1DArray image2D image2DArray image2DMS image2DMSArray image2DRect ' +
        'image3D imageBuffer imageCube imageCubeArray in inout int invariant isampler1D isampler1DArray ' +
        'isampler2D isampler2DArray isampler2DMS isampler2DMSArray isampler2DRect isampler3D isamplerBuffer ' +
        'isamplerCube isamplerCubeArray ivec2 ivec3 ivec4 layout lowp mat2 mat2x2 mat2x3 mat2x4 mat3 mat3x2 ' +
        'mat3x3 mat3x4 mat4 mat4x2 mat4x3 mat4x4 mediump noperspective out patch precision readonly restrict ' +
        'return sample sampler1D sampler1DArray sampler1DArrayShadow sampler1DShadow sampler2D sampler2DArray ' +
        'sampler2DArrayShadow sampler2DMS sampler2DMSArray sampler2DRect sampler2DRectShadow sampler2DShadow ' +
        'sampler3D samplerBuffer samplerCube samplerCubeArray samplerCubeArrayShadow samplerCubeShadow smooth ' +
        'struct subroutine switch uimage1D uimage1DArray uimage2D uimage2DArray uimage2DMS uimage2DMSArray ' +
        'uimage2DRect uimage3D uimageBuffer uimageCube uimageCubeArray uint uniform usampler1D usampler1DArray ' +
        'usampler2D usampler2DArray usampler2DMS usampler2DMSArray usampler2DRect usampler3D usamplerBuffer ' +
        'usamplerCube usamplerCubeArray uvec2 uvec3 uvec4 varying vec2 vec3 vec4 void volatile while writeonly',
      built_in:
        'gl_BackColor gl_BackLightModelProduct gl_BackLightProduct gl_BackMaterial ' +
        'gl_BackSecondaryColor gl_ClipDistance gl_ClipPlane gl_ClipVertex gl_Color ' +
        'gl_DepthRange gl_EyePlaneQ gl_EyePlaneR gl_EyePlaneS gl_EyePlaneT gl_Fog gl_FogCoord ' +
        'gl_FogFragCoord gl_FragColor gl_FragCoord gl_FragData gl_FragDepth gl_FrontColor ' +
        'gl_FrontFacing gl_FrontLightModelProduct gl_FrontLightProduct gl_FrontMaterial ' +
        'gl_FrontSecondaryColor gl_InstanceID gl_InvocationID gl_Layer gl_LightModel ' +
        'gl_LightSource gl_MaxAtomicCounterBindings gl_MaxAtomicCounterBufferSize ' +
        'gl_MaxClipDistances gl_MaxClipPlanes gl_MaxCombinedAtomicCounterBuffers ' +
        'gl_MaxCombinedAtomicCounters gl_MaxCombinedImageUniforms gl_MaxCombinedImageUnitsAndFragmentOutputs ' +
        'gl_MaxCombinedTextureImageUnits gl_MaxDrawBuffers gl_MaxFragmentAtomicCounterBuffers ' +
        'gl_MaxFragmentAtomicCounters gl_MaxFragmentImageUniforms gl_MaxFragmentInputComponents ' +
        'gl_MaxFragmentUniformComponents gl_MaxFragmentUniformVectors gl_MaxGeometryAtomicCounterBuffers ' +
        'gl_MaxGeometryAtomicCounters gl_MaxGeometryImageUniforms gl_MaxGeometryInputComponents ' +
        'gl_MaxGeometryOutputComponents gl_MaxGeometryOutputVertices gl_MaxGeometryTextureImageUnits ' +
        'gl_MaxGeometryTotalOutputComponents gl_MaxGeometryUniformComponents gl_MaxGeometryVaryingComponents ' +
        'gl_MaxImageSamples gl_MaxImageUnits gl_MaxLights gl_MaxPatchVertices gl_MaxProgramTexelOffset ' +
        'gl_MaxTessControlAtomicCounterBuffers gl_MaxTessControlAtomicCounters gl_MaxTessControlImageUniforms ' +
        'gl_MaxTessControlInputComponents gl_MaxTessControlOutputComponents gl_MaxTessControlTextureImageUnits ' +
        'gl_MaxTessControlTotalOutputComponents gl_MaxTessControlUniformComponents ' +
        'gl_MaxTessEvaluationAtomicCounterBuffers gl_MaxTessEvaluationAtomicCounters ' +
        'gl_MaxTessEvaluationImageUniforms gl_MaxTessEvaluationInputComponents gl_MaxTessEvaluationOutputComponents ' +
        'gl_MaxTessEvaluationTextureImageUnits gl_MaxTessEvaluationUniformComponents ' +
        'gl_MaxTessGenLevel gl_MaxTessPatchComponents gl_MaxTextureCoords gl_MaxTextureImageUnits ' +
        'gl_MaxTextureUnits gl_MaxVaryingComponents gl_MaxVaryingFloats gl_MaxVaryingVectors ' +
        'gl_MaxVertexAtomicCounterBuffers gl_MaxVertexAtomicCounters gl_MaxVertexAttribs ' +
        'gl_MaxVertexImageUniforms gl_MaxVertexOutputComponents gl_MaxVertexTextureImageUnits ' +
        'gl_MaxVertexUniformComponents gl_MaxVertexUniformVectors gl_MaxViewports gl_MinProgramTexelOffset'+
        'gl_ModelViewMatrix gl_ModelViewMatrixInverse gl_ModelViewMatrixInverseTranspose ' +
        'gl_ModelViewMatrixTranspose gl_ModelViewProjectionMatrix gl_ModelViewProjectionMatrixInverse ' +
        'gl_ModelViewProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixTranspose ' +
        'gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 ' +
        'gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_Normal gl_NormalMatrix ' +
        'gl_NormalScale gl_ObjectPlaneQ gl_ObjectPlaneR gl_ObjectPlaneS gl_ObjectPlaneT gl_PatchVerticesIn ' +
        'gl_PerVertex gl_Point gl_PointCoord gl_PointSize gl_Position gl_PrimitiveID gl_PrimitiveIDIn ' +
        'gl_ProjectionMatrix gl_ProjectionMatrixInverse gl_ProjectionMatrixInverseTranspose ' +
        'gl_ProjectionMatrixTranspose gl_SampleID gl_SampleMask gl_SampleMaskIn gl_SamplePosition ' +
        'gl_SecondaryColor gl_TessCoord gl_TessLevelInner gl_TessLevelOuter gl_TexCoord gl_TextureEnvColor ' +
        'gl_TextureMatrixInverseTranspose gl_TextureMatrixTranspose gl_Vertex gl_VertexID ' +
        'gl_ViewportIndex gl_in gl_out EmitStreamVertex EmitVertex EndPrimitive EndStreamPrimitive ' +
        'abs acos acosh all any asin asinh atan atanh atomicCounter atomicCounterDecrement ' +
        'atomicCounterIncrement barrier bitCount bitfieldExtract bitfieldInsert bitfieldReverse ' +
        'ceil clamp cos cosh cross dFdx dFdy degrees determinant distance dot equal exp exp2 faceforward ' +
        'findLSB findMSB floatBitsToInt floatBitsToUint floor fma fract frexp ftransform fwidth greaterThan ' +
        'greaterThanEqual imageAtomicAdd imageAtomicAnd imageAtomicCompSwap imageAtomicExchange ' +
        'imageAtomicMax imageAtomicMin imageAtomicOr imageAtomicXor imageLoad imageStore imulExtended ' +
        'intBitsToFloat interpolateAtCentroid interpolateAtOffset interpolateAtSample inverse inversesqrt ' +
        'isinf isnan ldexp length lessThan lessThanEqual log log2 matrixCompMult max memoryBarrier ' +
        'min mix mod modf noise1 noise2 noise3 noise4 normalize not notEqual outerProduct packDouble2x32 ' +
        'packHalf2x16 packSnorm2x16 packSnorm4x8 packUnorm2x16 packUnorm4x8 pow radians reflect refract ' +
        'round roundEven shadow1D shadow1DLod shadow1DProj shadow1DProjLod shadow2D shadow2DLod shadow2DProj ' +
        'shadow2DProjLod sign sin sinh smoothstep sqrt step tan tanh texelFetch texelFetchOffset texture ' +
        'texture1D texture1DLod texture1DProj texture1DProjLod texture2D texture2DLod texture2DProj ' +
        'texture2DProjLod texture3D texture3DLod texture3DProj texture3DProjLod textureCube textureCubeLod ' +
        'textureGather textureGatherOffset textureGatherOffsets textureGrad textureGradOffset textureLod ' +
        'textureLodOffset textureOffset textureProj textureProjGrad textureProjGradOffset textureProjLod ' +
        'textureProjLodOffset textureProjOffset textureQueryLod textureSize transpose trunc uaddCarry ' +
        'uintBitsToFloat umulExtended unpackDouble2x32 unpackHalf2x16 unpackSnorm2x16 unpackSnorm4x8 ' +
        'unpackUnorm2x16 unpackUnorm4x8 usubBorrow gl_TextureMatrix gl_TextureMatrixInverse',
      literal: 'true false'
    },
    illegal: '"',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      }
    ]
  };
};
},{}],35:[function(require,module,exports){
module.exports = function(hljs) {
  var GO_KEYWORDS = {
    keyword:
      'break default func interface select case map struct chan else goto package switch ' +
      'const fallthrough if range type continue for import return var go defer',
    constant:
       'true false iota nil',
    typename:
      'bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 ' +
      'uint16 uint32 uint64 int uint uintptr rune',
    built_in:
      'append cap close complex copy imag len make new panic print println real recover delete'
  };
  return {
    keywords: GO_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'', end: '[^\\\\]\'',
        relevance: 0
      },
      {
        className: 'string',
        begin: '`', end: '`'
      },
      {
        className: 'number',
        begin: '[^a-zA-Z_0-9](\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?',
        relevance: 0
      },
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],36:[function(require,module,exports){
module.exports = function(hljs) {
  var TYPE = {
    className: 'type',
    begin: '\\b[A-Z][\\w\']*',
    relevance: 0
  };
  var CONTAINER = {
    className: 'container',
    begin: '\\(', end: '\\)',
    contains: [
      {className: 'type', begin: '\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'},
      {className: 'title', begin: '[_a-z][\\w\']*'}
    ]
  };
  var CONTAINER2 = {
    className: 'container',
    begin: '{', end: '}',
    contains: CONTAINER.contains
  }

  return {
    keywords:
      'let in if then else case of where do module import hiding qualified type data ' +
      'newtype deriving class instance not as foreign ccall safe unsafe',
    contains: [
      {
        className: 'comment',
        begin: '--', end: '$'
      },
      {
        className: 'preprocessor',
        begin: '{-#', end: '#-}'
      },
      {
        className: 'comment',
        contains: ['self'],
        begin: '{-', end: '-}'
      },
      {
        className: 'string',
        begin: '\\s+\'', end: '\'',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
      },
      hljs.QUOTE_STRING_MODE,
      {
        className: 'import',
        begin: '\\bimport', end: '$',
        keywords: 'import qualified as hiding',
        contains: [CONTAINER],
        illegal: '\\W\\.|;'
      },
      {
        className: 'module',
        begin: '\\bmodule', end: 'where',
        keywords: 'module where',
        contains: [CONTAINER],
        illegal: '\\W\\.|;'
      },
      {
        className: 'class',
        begin: '\\b(class|instance)', end: 'where',
        keywords: 'class where instance',
        contains: [TYPE]
      },
      {
        className: 'typedef',
        begin: '\\b(data|(new)?type)', end: '$',
        keywords: 'data type newtype deriving',
        contains: [TYPE, CONTAINER, CONTAINER2]
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'shebang',
        begin: '#!\\/usr\\/bin\\/env\ runhaskell', end: '$'
      },
      TYPE,
      {
        className: 'title', begin: '^[_a-z][\\w\']*'
      }
    ]
  };
};
},{}],37:[function(require,module,exports){
var hljs = new function() {

  /* Utility functions */

  function escape(value) {
    return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;');
  }

  function findCode(pre) {
    for (var node = pre.firstChild; node; node = node.nextSibling) {
      if (node.nodeName == 'CODE')
        return node;
      if (!(node.nodeType == 3 && node.nodeValue.match(/\s+/)))
        break;
    }
  }

  function blockText(block, ignoreNewLines) {
    return Array.prototype.map.call(block.childNodes, function(node) {
      if (node.nodeType == 3) {
        return ignoreNewLines ? node.nodeValue.replace(/\n/g, '') : node.nodeValue;
      }
      if (node.nodeName == 'BR') {
        return '\n';
      }
      return blockText(node, ignoreNewLines);
    }).join('');
  }

  function blockLanguage(block) {
    var classes = (block.className + ' ' + block.parentNode.className).split(/\s+/);
    classes = classes.map(function(c) {return c.replace(/^language-/, '')});
    for (var i = 0; i < classes.length; i++) {
      if (languages[classes[i]] || classes[i] == 'no-highlight') {
        return classes[i];
      }
    }
  }

  /* Stream merging */

  function nodeStream(node) {
    var result = [];
    (function _nodeStream(node, offset) {
      for (var child = node.firstChild; child; child = child.nextSibling) {
        if (child.nodeType == 3)
          offset += child.nodeValue.length;
        else if (child.nodeName == 'BR')
          offset += 1;
        else if (child.nodeType == 1) {
          result.push({
            event: 'start',
            offset: offset,
            node: child
          });
          offset = _nodeStream(child, offset);
          result.push({
            event: 'stop',
            offset: offset,
            node: child
          });
        }
      }
      return offset;
    })(node, 0);
    return result;
  }

  function mergeStreams(stream1, stream2, value) {
    var processed = 0;
    var result = '';
    var nodeStack = [];

    function selectStream() {
      if (stream1.length && stream2.length) {
        if (stream1[0].offset != stream2[0].offset)
          return (stream1[0].offset < stream2[0].offset) ? stream1 : stream2;
        else {
          /*
          To avoid starting the stream just before it should stop the order is
          ensured that stream1 always starts first and closes last:

          if (event1 == 'start' && event2 == 'start')
            return stream1;
          if (event1 == 'start' && event2 == 'stop')
            return stream2;
          if (event1 == 'stop' && event2 == 'start')
            return stream1;
          if (event1 == 'stop' && event2 == 'stop')
            return stream2;

          ... which is collapsed to:
          */
          return stream2[0].event == 'start' ? stream1 : stream2;
        }
      } else {
        return stream1.length ? stream1 : stream2;
      }
    }

    function open(node) {
      function attr_str(a) {return ' ' + a.nodeName + '="' + escape(a.value) + '"'};
      return '<' + node.nodeName + Array.prototype.map.call(node.attributes, attr_str).join('') + '>';
    }

    while (stream1.length || stream2.length) {
      var current = selectStream().splice(0, 1)[0];
      result += escape(value.substr(processed, current.offset - processed));
      processed = current.offset;
      if ( current.event == 'start') {
        result += open(current.node);
        nodeStack.push(current.node);
      } else if (current.event == 'stop') {
        var node, i = nodeStack.length;
        do {
          i--;
          node = nodeStack[i];
          result += ('</' + node.nodeName.toLowerCase() + '>');
        } while (node != current.node);
        nodeStack.splice(i, 1);
        while (i < nodeStack.length) {
          result += open(nodeStack[i]);
          i++;
        }
      }
    }
    return result + escape(value.substr(processed));
  }

  /* Initialization */

  function compileLanguage(language) {

    function langRe(value, global) {
      return RegExp(
        value,
        'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '')
      );
    }

    function compileMode(mode, parent) {
      if (mode.compiled)
        return;
      mode.compiled = true;

      var keywords = []; // used later with beginWithKeyword but filled as a side-effect of keywords compilation
      if (mode.keywords) {
        var compiled_keywords = {};

        function flatten(className, str) {
          str.split(' ').forEach(function(kw) {
            var pair = kw.split('|');
            compiled_keywords[pair[0]] = [className, pair[1] ? Number(pair[1]) : 1];
            keywords.push(pair[0]);
          });
        }

        mode.lexemsRe = langRe(mode.lexems || hljs.IDENT_RE, true);
        if (typeof mode.keywords == 'string') { // string
          flatten('keyword', mode.keywords)
        } else {
          for (var className in mode.keywords) {
            if (!mode.keywords.hasOwnProperty(className))
              continue;
            flatten(className, mode.keywords[className]);
          }
        }
        mode.keywords = compiled_keywords;
      }
      if (parent) {
        if (mode.beginWithKeyword) {
          mode.begin = '\\b(' + keywords.join('|') + ')\\s';
        }
        mode.beginRe = langRe(mode.begin ? mode.begin : '\\B|\\b');
        if (!mode.end && !mode.endsWithParent)
          mode.end = '\\B|\\b';
        if (mode.end)
          mode.endRe = langRe(mode.end);
        mode.terminator_end = mode.end || '';
        if (mode.endsWithParent && parent.terminator_end)
          mode.terminator_end += (mode.end ? '|' : '') + parent.terminator_end;
      }
      if (mode.illegal)
        mode.illegalRe = langRe(mode.illegal);
      if (mode.relevance === undefined)
        mode.relevance = 1;
      if (!mode.contains) {
        mode.contains = [];
      }
      for (var i = 0; i < mode.contains.length; i++) {
        if (mode.contains[i] == 'self') {
          mode.contains[i] = mode;
        }
        compileMode(mode.contains[i], mode);
      }
      if (mode.starts) {
        compileMode(mode.starts, parent);
      }

      var terminators = [];
      for (var i = 0; i < mode.contains.length; i++) {
        terminators.push(mode.contains[i].begin);
      }
      if (mode.terminator_end) {
        terminators.push(mode.terminator_end);
      }
      if (mode.illegal) {
        terminators.push(mode.illegal);
      }
      mode.terminators = terminators.length ? langRe(terminators.join('|'), true) : {exec: function(s) {return null;}};
    }

    compileMode(language);
  }

  /*
  Core highlighting function. Accepts a language name and a string with the
  code to highlight. Returns an object with the following properties:

  - relevance (int)
  - keyword_count (int)
  - value (an HTML string with highlighting markup)

  */
  function highlight(language_name, value) {

    function subMode(lexem, mode) {
      for (var i = 0; i < mode.contains.length; i++) {
        var match = mode.contains[i].beginRe.exec(lexem);
        if (match && match.index == 0) {
          return mode.contains[i];
        }
      }
    }

    function endOfMode(mode, lexem) {
      if (mode.end && mode.endRe.test(lexem)) {
        return mode;
      }
      if (mode.endsWithParent) {
        return endOfMode(mode.parent, lexem);
      }
    }

    function isIllegal(lexem, mode) {
      return mode.illegal && mode.illegalRe.test(lexem);
    }

    function keywordMatch(mode, match) {
      var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
      return mode.keywords.hasOwnProperty(match_str) && mode.keywords[match_str];
    }

    function processKeywords() {
      var buffer = escape(mode_buffer);
      if (!top.keywords)
        return buffer;
      var result = '';
      var last_index = 0;
      top.lexemsRe.lastIndex = 0;
      var match = top.lexemsRe.exec(buffer);
      while (match) {
        result += buffer.substr(last_index, match.index - last_index);
        var keyword_match = keywordMatch(top, match);
        if (keyword_match) {
          keyword_count += keyword_match[1];
          result += '<span class="'+ keyword_match[0] +'">' + match[0] + '</span>';
        } else {
          result += match[0];
        }
        last_index = top.lexemsRe.lastIndex;
        match = top.lexemsRe.exec(buffer);
      }
      return result + buffer.substr(last_index);
    }

    function processSubLanguage() {
      if (top.subLanguage && !languages[top.subLanguage]) {
        return escape(mode_buffer);
      }
      var result = top.subLanguage ? highlight(top.subLanguage, mode_buffer) : highlightAuto(mode_buffer);
      // Counting embedded language score towards the host language may be disabled
      // with zeroing the containing mode relevance. Usecase in point is Markdown that
      // allows XML everywhere and makes every XML snippet to have a much larger Markdown
      // score.
      if (top.relevance > 0) {
        keyword_count += result.keyword_count;
        relevance += result.relevance;
      }
      return '<span class="' + result.language  + '">' + result.value + '</span>';
    }

    function processBuffer() {
      return top.subLanguage !== undefined ? processSubLanguage() : processKeywords();
    }

    function startNewMode(mode, lexem) {
      var markup = mode.className? '<span class="' + mode.className + '">': '';
      if (mode.returnBegin) {
        result += markup;
        mode_buffer = '';
      } else if (mode.excludeBegin) {
        result += escape(lexem) + markup;
        mode_buffer = '';
      } else {
        result += markup;
        mode_buffer = lexem;
      }
      top = Object.create(mode, {parent: {value: top}});
      relevance += mode.relevance;
    }

    function processLexem(buffer, lexem) {
      mode_buffer += buffer;
      if (lexem === undefined) {
        result += processBuffer();
        return 0;
      }

      var new_mode = subMode(lexem, top);
      if (new_mode) {
        result += processBuffer();
        startNewMode(new_mode, lexem);
        return new_mode.returnBegin ? 0 : lexem.length;
      }

      var end_mode = endOfMode(top, lexem);
      if (end_mode) {
        if (!(end_mode.returnEnd || end_mode.excludeEnd)) {
          mode_buffer += lexem;
        }
        result += processBuffer();
        do {
          if (top.className) {
            result += '</span>';
          }
          top = top.parent;
        } while (top != end_mode.parent);
        if (end_mode.excludeEnd) {
          result += escape(lexem);
        }
        mode_buffer = '';
        if (end_mode.starts) {
          startNewMode(end_mode.starts, '');
        }
        return end_mode.returnEnd ? 0 : lexem.length;
      }

      if (isIllegal(lexem, top))
        throw 'Illegal';

      /*
      Parser should not reach this point as all types of lexems should be caught
      earlier, but if it does due to some bug make sure it advances at least one
      character forward to prevent infinite looping.
      */
      mode_buffer += lexem;
      return lexem.length || 1;
    }

    var language = languages[language_name];
    compileLanguage(language);
    var top = language;
    var mode_buffer = '';
    var relevance = 0;
    var keyword_count = 0;
    var result = '';
    try {
      var match, count, index = 0;
      while (true) {
        top.terminators.lastIndex = index;
        match = top.terminators.exec(value);
        if (!match)
          break;
        count = processLexem(value.substr(index, match.index - index), match[0]);
        index = match.index + count;
      }
      processLexem(value.substr(index))
      return {
        relevance: relevance,
        keyword_count: keyword_count,
        value: result,
        language: language_name
      };
    } catch (e) {
      if (e == 'Illegal') {
        return {
          relevance: 0,
          keyword_count: 0,
          value: escape(value)
        };
      } else {
        throw e;
      }
    }
  }

  /*
  Highlighting with language detection. Accepts a string with the code to
  highlight. Returns an object with the following properties:

  - language (detected language)
  - relevance (int)
  - keyword_count (int)
  - value (an HTML string with highlighting markup)
  - second_best (object with the same structure for second-best heuristically
    detected language, may be absent)

  */
  function highlightAuto(text) {
    var result = {
      keyword_count: 0,
      relevance: 0,
      value: escape(text)
    };
    var second_best = result;
    for (var key in languages) {
      if (!languages.hasOwnProperty(key))
        continue;
      var current = highlight(key, text);
      current.language = key;
      if (current.keyword_count + current.relevance > second_best.keyword_count + second_best.relevance) {
        second_best = current;
      }
      if (current.keyword_count + current.relevance > result.keyword_count + result.relevance) {
        second_best = result;
        result = current;
      }
    }
    if (second_best.language) {
      result.second_best = second_best;
    }
    return result;
  }

  /*
  Post-processing of the highlighted markup:

  - replace TABs with something more useful
  - replace real line-breaks with '<br>' for non-pre containers

  */
  function fixMarkup(value, tabReplace, useBR) {
    if (tabReplace) {
      value = value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1, offset, s) {
        return p1.replace(/\t/g, tabReplace);
      });
    }
    if (useBR) {
      value = value.replace(/\n/g, '<br>');
    }
    return value;
  }

  /*
  Applies highlighting to a DOM node containing code. Accepts a DOM node and
  two optional parameters for fixMarkup.
  */
  function highlightBlock(block, tabReplace, useBR) {
    var text = blockText(block, useBR);
    var language = blockLanguage(block);
    if (language == 'no-highlight')
        return;
    var result = language ? highlight(language, text) : highlightAuto(text);
    language = result.language;
    var original = nodeStream(block);
    if (original.length) {
      var pre = document.createElement('pre');
      pre.innerHTML = result.value;
      result.value = mergeStreams(original, nodeStream(pre), text);
    }
    result.value = fixMarkup(result.value, tabReplace, useBR);

    var class_name = block.className;
    if (!class_name.match('(\\s|^)(language-)?' + language + '(\\s|$)')) {
      class_name = class_name ? (class_name + ' ' + language) : language;
    }
    block.innerHTML = result.value;
    block.className = class_name;
    block.result = {
      language: language,
      kw: result.keyword_count,
      re: result.relevance
    };
    if (result.second_best) {
      block.second_best = {
        language: result.second_best.language,
        kw: result.second_best.keyword_count,
        re: result.second_best.relevance
      };
    }
  }

  /*
  Applies highlighting to all <pre><code>..</code></pre> blocks on a page.
  */
  function initHighlighting() {
    if (initHighlighting.called)
      return;
    initHighlighting.called = true;
    Array.prototype.map.call(document.getElementsByTagName('pre'), findCode).
      filter(Boolean).
      forEach(function(code){highlightBlock(code, hljs.tabReplace)});
  }

  /*
  Attaches highlighting to the page load event.
  */
  function initHighlightingOnLoad() {
    window.addEventListener('DOMContentLoaded', initHighlighting, false);
    window.addEventListener('load', initHighlighting, false);
  }

  var languages = {}; // a shortcut to avoid writing "this." everywhere

  /* Interface definition */

  this.LANGUAGES = languages;
  this.highlight = highlight;
  this.highlightAuto = highlightAuto;
  this.fixMarkup = fixMarkup;
  this.highlightBlock = highlightBlock;
  this.initHighlighting = initHighlighting;
  this.initHighlightingOnLoad = initHighlightingOnLoad;

  // Common regexps
  this.IDENT_RE = '[a-zA-Z][a-zA-Z0-9_]*';
  this.UNDERSCORE_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*';
  this.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
  this.C_NUMBER_RE = '(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)'; // 0x..., 0..., decimal, float
  this.BINARY_NUMBER_RE = '\\b(0b[01]+)'; // 0b...
  this.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';

  // Common modes
  this.BACKSLASH_ESCAPE = {
    begin: '\\\\[\\s\\S]', relevance: 0
  };
  this.APOS_STRING_MODE = {
    className: 'string',
    begin: '\'', end: '\'',
    illegal: '\\n',
    contains: [this.BACKSLASH_ESCAPE],
    relevance: 0
  };
  this.QUOTE_STRING_MODE = {
    className: 'string',
    begin: '"', end: '"',
    illegal: '\\n',
    contains: [this.BACKSLASH_ESCAPE],
    relevance: 0
  };
  this.C_LINE_COMMENT_MODE = {
    className: 'comment',
    begin: '//', end: '$'
  };
  this.C_BLOCK_COMMENT_MODE = {
    className: 'comment',
    begin: '/\\*', end: '\\*/'
  };
  this.HASH_COMMENT_MODE = {
    className: 'comment',
    begin: '#', end: '$'
  };
  this.NUMBER_MODE = {
    className: 'number',
    begin: this.NUMBER_RE,
    relevance: 0
  };
  this.C_NUMBER_MODE = {
    className: 'number',
    begin: this.C_NUMBER_RE,
    relevance: 0
  };
  this.BINARY_NUMBER_MODE = {
    className: 'number',
    begin: this.BINARY_NUMBER_RE,
    relevance: 0
  };

  // Utility functions
  this.inherit = function(parent, obj) {
    var result = {}
    for (var key in parent)
      result[key] = parent[key];
    if (obj)
      for (var key in obj)
        result[key] = obj[key];
    return result;
  }
}();
hljs.LANGUAGES['bash'] = require('./bash.js')(hljs);
hljs.LANGUAGES['erlang'] = require('./erlang.js')(hljs);
hljs.LANGUAGES['cs'] = require('./cs.js')(hljs);
hljs.LANGUAGES['brainfuck'] = require('./brainfuck.js')(hljs);
hljs.LANGUAGES['ruby'] = require('./ruby.js')(hljs);
hljs.LANGUAGES['rust'] = require('./rust.js')(hljs);
hljs.LANGUAGES['rib'] = require('./rib.js')(hljs);
hljs.LANGUAGES['diff'] = require('./diff.js')(hljs);
hljs.LANGUAGES['javascript'] = require('./javascript.js')(hljs);
hljs.LANGUAGES['glsl'] = require('./glsl.js')(hljs);
hljs.LANGUAGES['rsl'] = require('./rsl.js')(hljs);
hljs.LANGUAGES['lua'] = require('./lua.js')(hljs);
hljs.LANGUAGES['xml'] = require('./xml.js')(hljs);
hljs.LANGUAGES['markdown'] = require('./markdown.js')(hljs);
hljs.LANGUAGES['css'] = require('./css.js')(hljs);
hljs.LANGUAGES['lisp'] = require('./lisp.js')(hljs);
hljs.LANGUAGES['profile'] = require('./profile.js')(hljs);
hljs.LANGUAGES['http'] = require('./http.js')(hljs);
hljs.LANGUAGES['java'] = require('./java.js')(hljs);
hljs.LANGUAGES['php'] = require('./php.js')(hljs);
hljs.LANGUAGES['haskell'] = require('./haskell.js')(hljs);
hljs.LANGUAGES['1c'] = require('./1c.js')(hljs);
hljs.LANGUAGES['python'] = require('./python.js')(hljs);
hljs.LANGUAGES['smalltalk'] = require('./smalltalk.js')(hljs);
hljs.LANGUAGES['tex'] = require('./tex.js')(hljs);
hljs.LANGUAGES['actionscript'] = require('./actionscript.js')(hljs);
hljs.LANGUAGES['sql'] = require('./sql.js')(hljs);
hljs.LANGUAGES['vala'] = require('./vala.js')(hljs);
hljs.LANGUAGES['ini'] = require('./ini.js')(hljs);
hljs.LANGUAGES['d'] = require('./d.js')(hljs);
hljs.LANGUAGES['axapta'] = require('./axapta.js')(hljs);
hljs.LANGUAGES['perl'] = require('./perl.js')(hljs);
hljs.LANGUAGES['scala'] = require('./scala.js')(hljs);
hljs.LANGUAGES['cmake'] = require('./cmake.js')(hljs);
hljs.LANGUAGES['objectivec'] = require('./objectivec.js')(hljs);
hljs.LANGUAGES['avrasm'] = require('./avrasm.js')(hljs);
hljs.LANGUAGES['vhdl'] = require('./vhdl.js')(hljs);
hljs.LANGUAGES['coffeescript'] = require('./coffeescript.js')(hljs);
hljs.LANGUAGES['nginx'] = require('./nginx.js')(hljs);
hljs.LANGUAGES['erlang-repl'] = require('./erlang-repl.js')(hljs);
hljs.LANGUAGES['r'] = require('./r.js')(hljs);
hljs.LANGUAGES['json'] = require('./json.js')(hljs);
hljs.LANGUAGES['django'] = require('./django.js')(hljs);
hljs.LANGUAGES['delphi'] = require('./delphi.js')(hljs);
hljs.LANGUAGES['vbscript'] = require('./vbscript.js')(hljs);
hljs.LANGUAGES['mel'] = require('./mel.js')(hljs);
hljs.LANGUAGES['dos'] = require('./dos.js')(hljs);
hljs.LANGUAGES['apache'] = require('./apache.js')(hljs);
hljs.LANGUAGES['applescript'] = require('./applescript.js')(hljs);
hljs.LANGUAGES['cpp'] = require('./cpp.js')(hljs);
hljs.LANGUAGES['matlab'] = require('./matlab.js')(hljs);
hljs.LANGUAGES['parser3'] = require('./parser3.js')(hljs);
hljs.LANGUAGES['clojure'] = require('./clojure.js')(hljs);
hljs.LANGUAGES['go'] = require('./go.js')(hljs);
module.exports = hljs;
},{"./1c.js":13,"./actionscript.js":14,"./apache.js":15,"./applescript.js":16,"./avrasm.js":17,"./axapta.js":18,"./bash.js":19,"./brainfuck.js":20,"./clojure.js":21,"./cmake.js":22,"./coffeescript.js":23,"./cpp.js":24,"./cs.js":25,"./css.js":26,"./d.js":27,"./delphi.js":28,"./diff.js":29,"./django.js":30,"./dos.js":31,"./erlang-repl.js":32,"./erlang.js":33,"./glsl.js":34,"./go.js":35,"./haskell.js":36,"./http.js":38,"./ini.js":39,"./java.js":40,"./javascript.js":41,"./json.js":42,"./lisp.js":43,"./lua.js":44,"./markdown.js":45,"./matlab.js":46,"./mel.js":47,"./nginx.js":48,"./objectivec.js":49,"./parser3.js":50,"./perl.js":51,"./php.js":52,"./profile.js":53,"./python.js":54,"./r.js":55,"./rib.js":56,"./rsl.js":57,"./ruby.js":58,"./rust.js":59,"./scala.js":60,"./smalltalk.js":61,"./sql.js":62,"./tex.js":63,"./vala.js":64,"./vbscript.js":65,"./vhdl.js":66,"./xml.js":67}],38:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    illegal: '\\S',
    contains: [
      {
        className: 'status',
        begin: '^HTTP/[0-9\\.]+', end: '$',
        contains: [{className: 'number', begin: '\\b\\d{3}\\b'}]
      },
      {
        className: 'request',
        begin: '^[A-Z]+ (.*?) HTTP/[0-9\\.]+$', returnBegin: true, end: '$',
        contains: [
          {
            className: 'string',
            begin: ' ', end: ' ',
            excludeBegin: true, excludeEnd: true
          }
        ]
      },
      {
        className: 'attribute',
        begin: '^\\w', end: ': ', excludeEnd: true,
        illegal: '\\n|\\s|=',
        starts: {className: 'string', end: '$'}
      },
      {
        begin: '\\n\\n',
        starts: {subLanguage: '', endsWithParent: true}
      }
    ]
  };
};
},{}],39:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    illegal: '[^\\s]',
    contains: [
      {
        className: 'comment',
        begin: ';', end: '$'
      },
      {
        className: 'title',
        begin: '^\\[', end: '\\]'
      },
      {
        className: 'setting',
        begin: '^[a-z0-9\\[\\]_-]+[ \\t]*=[ \\t]*', end: '$',
        contains: [
          {
            className: 'value',
            endsWithParent: true,
            keywords: 'on off true false yes no',
            contains: [hljs.QUOTE_STRING_MODE, hljs.NUMBER_MODE]
          }
        ]
      }
    ]
  };
};
},{}],40:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      'false synchronized int abstract float private char boolean static null if const ' +
      'for true while long throw strictfp finally protected import native final return void ' +
      'enum else break transient new catch instanceof byte super volatile case assert short ' +
      'package default double public try this switch continue throws',
    contains: [
      {
        className: 'javadoc',
        begin: '/\\*\\*', end: '\\*/',
        contains: [{
          className: 'javadoctag', begin: '@[A-Za-z]+'
        }],
        relevance: 10
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class interface',
        illegal: ':',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends implements',
            relevance: 10
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          }
        ]
      },
      hljs.C_NUMBER_MODE,
      {
        className: 'annotation', begin: '@[A-Za-z]+'
      }
    ]
  };
};
},{}],41:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        'in if for while finally var new function do return void else break catch ' +
        'instanceof with throw case default try this switch continue typeof delete ' +
        'let yield const',
      literal:
        'true false null undefined NaN Infinity'
    },
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      { // "value" container
        begin: '(' + hljs.RE_STARTERS_RE + '|\\b(case|return|throw)\\b)\\s*',
        keywords: 'return throw case',
        contains: [
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          {
            className: 'regexp',
            begin: '/', end: '/[gim]*',
            illegal: '\\n',
            contains: [{begin: '\\\\/'}]
          },
          { // E4X
            begin: '<', end: '>;',
            subLanguage: 'xml'
          }
        ],
        relevance: 0
      },
      {
        className: 'function',
        beginWithKeyword: true, end: '{',
        keywords: 'function',
        contains: [
          {
            className: 'title', begin: '[A-Za-z$_][0-9A-Za-z$_]*'
          },
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              hljs.C_LINE_COMMENT_MODE,
              hljs.C_BLOCK_COMMENT_MODE
            ],
            illegal: '["\'\\(]'
          }
        ],
        illegal: '\\[|%'
      }
    ]
  };
};
},{}],42:[function(require,module,exports){
module.exports = function(hljs) {
  var LITERALS = {literal: 'true false null'};
  var TYPES = [
    hljs.QUOTE_STRING_MODE,
    hljs.C_NUMBER_MODE
  ];
  var VALUE_CONTAINER = {
    className: 'value',
    end: ',', endsWithParent: true, excludeEnd: true,
    contains: TYPES,
    keywords: LITERALS
  };
  var OBJECT = {
    begin: '{', end: '}',
    contains: [
      {
        className: 'attribute',
        begin: '\\s*"', end: '"\\s*:\\s*', excludeBegin: true, excludeEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE],
        illegal: '\\n',
        starts: VALUE_CONTAINER
      }
    ],
    illegal: '\\S'
  };
  var ARRAY = {
    begin: '\\[', end: '\\]',
    contains: [hljs.inherit(VALUE_CONTAINER, {className: null})], // inherit is also a workaround for a bug that makes shared modes with endsWithParent compile only the ending of one of the parents
    illegal: '\\S'
  };
  TYPES.splice(TYPES.length, 0, OBJECT, ARRAY);
  return {
    contains: TYPES,
    keywords: LITERALS,
    illegal: '\\S'
  };
};
},{}],43:[function(require,module,exports){
module.exports = function(hljs) {
  var LISP_IDENT_RE = '[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#]*';
  var LISP_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s)(\\+|\\-)?\\d+)?';
  var LITERAL = {
    className: 'literal',
    begin: '\\b(t{1}|nil)\\b'
  };
  var NUMBERS = [
    {
      className: 'number', begin: LISP_SIMPLE_NUMBER_RE
    },
    {
      className: 'number', begin: '#b[0-1]+(/[0-1]+)?'
    },
    {
      className: 'number', begin: '#o[0-7]+(/[0-7]+)?'
    },
    {
      className: 'number', begin: '#x[0-9a-f]+(/[0-9a-f]+)?'
    },
    {
      className: 'number', begin: '#c\\(' + LISP_SIMPLE_NUMBER_RE + ' +' + LISP_SIMPLE_NUMBER_RE, end: '\\)'
    }
  ]
  var STRING = {
    className: 'string',
    begin: '"', end: '"',
    contains: [hljs.BACKSLASH_ESCAPE],
    relevance: 0
  };
  var COMMENT = {
    className: 'comment',
    begin: ';', end: '$'
  };
  var VARIABLE = {
    className: 'variable',
    begin: '\\*', end: '\\*'
  };
  var KEYWORD = {
    className: 'keyword',
    begin: '[:&]' + LISP_IDENT_RE
  };
  var QUOTED_LIST = {
    begin: '\\(', end: '\\)',
    contains: ['self', LITERAL, STRING].concat(NUMBERS)
  };
  var QUOTED1 = {
    className: 'quoted',
    begin: '[\'`]\\(', end: '\\)',
    contains: NUMBERS.concat([STRING, VARIABLE, KEYWORD, QUOTED_LIST])
  };
  var QUOTED2 = {
    className: 'quoted',
    begin: '\\(quote ', end: '\\)',
    keywords: {title: 'quote'},
    contains: NUMBERS.concat([STRING, VARIABLE, KEYWORD, QUOTED_LIST])
  };
  var LIST = {
    className: 'list',
    begin: '\\(', end: '\\)'
  };
  var BODY = {
    className: 'body',
    endsWithParent: true, excludeEnd: true
  };
  LIST.contains = [{className: 'title', begin: LISP_IDENT_RE}, BODY];
  BODY.contains = [QUOTED1, QUOTED2, LIST, LITERAL].concat(NUMBERS).concat([STRING, COMMENT, VARIABLE, KEYWORD]);

  return {
    illegal: '[^\\s]',
    contains: NUMBERS.concat([
      LITERAL,
      STRING,
      COMMENT,
      QUOTED1, QUOTED2,
      LIST
    ])
  };
};
},{}],44:[function(require,module,exports){
module.exports = function(hljs) {
  var OPENING_LONG_BRACKET = '\\[=*\\[';
  var CLOSING_LONG_BRACKET = '\\]=*\\]';
  var LONG_BRACKETS = {
    begin: OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
    contains: ['self']
  };
  var COMMENTS = [
    {
      className: 'comment',
      begin: '--(?!' + OPENING_LONG_BRACKET + ')', end: '$'
    },
    {
      className: 'comment',
      begin: '--' + OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
      contains: [LONG_BRACKETS],
      relevance: 10
    }
  ]
  return {
    lexems: hljs.UNDERSCORE_IDENT_RE,
    keywords: {
      keyword:
        'and break do else elseif end false for if in local nil not or repeat return then ' +
        'true until while',
      built_in:
        '_G _VERSION assert collectgarbage dofile error getfenv getmetatable ipairs load ' +
        'loadfile loadstring module next pairs pcall print rawequal rawget rawset require ' +
        'select setfenv setmetatable tonumber tostring type unpack xpcall coroutine debug ' +
        'io math os package string table'
    },
    contains: COMMENTS.concat([
      {
        className: 'function',
        beginWithKeyword: true, end: '\\)',
        keywords: 'function',
        contains: [
          {
            className: 'title',
            begin: '([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*'
          },
          {
            className: 'params',
            begin: '\\(', endsWithParent: true,
            contains: COMMENTS
          }
        ].concat(COMMENTS)
      },
      hljs.C_NUMBER_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: OPENING_LONG_BRACKET, end: CLOSING_LONG_BRACKET,
        contains: [LONG_BRACKETS],
        relevance: 10
      }
    ])
  };
};
},{}],45:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      // highlight headers
      {
        className: 'header',
        begin: '^#{1,3}', end: '$'
      },
      {
        className: 'header',
        begin: '^.+?\\n[=-]{2,}$'
      },
      // inline html
      {
        begin: '<', end: '>',
        subLanguage: 'xml',
        relevance: 0
      },
      // lists (indicators only)
      {
        className: 'bullet',
        begin: '^([*+-]|(\\d+\\.))\\s+'
      },
      // strong segments
      {
        className: 'strong',
        begin: '[*_]{2}.+?[*_]{2}'
      },
      // emphasis segments
      {
        className: 'emphasis',
        begin: '\\*.+?\\*'
      },
      {
        className: 'emphasis',
        begin: '_.+?_',
        relevance: 0
      },
      // blockquotes
      {
        className: 'blockquote',
        begin: '^>\\s+', end: '$'
      },
      // code snippets
      {
        className: 'code',
        begin: '`.+?`'
      },
      {
        className: 'code',
        begin: '^    ', end: '$',
        relevance: 0
      },
      // horizontal rules
      {
        className: 'horizontal_rule',
        begin: '^-{3,}', end: '$'
      },
      // using links - title and link
      {
        begin: '\\[.+?\\]\\(.+?\\)',
        returnBegin: true,
        contains: [
          {
            className: 'link_label',
            begin: '\\[.+\\]'
          },
          {
            className: 'link_url',
            begin: '\\(', end: '\\)',
            excludeBegin: true, excludeEnd: true
          }
        ]
      }
    ]
  };
};
},{}],46:[function(require,module,exports){
module.exports = function(hljs) {

  var COMMON_CONTAINS = [
    hljs.C_NUMBER_MODE,
    {
      className: 'string',
      begin: '\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}],
      relevance: 0
    }
  ];

  return {
    keywords: {
      keyword:
        'break case catch classdef continue else elseif end enumerated events for function ' +
        'global if methods otherwise parfor persistent properties return spmd switch try while',
      built_in:
        'sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan ' +
        'atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot ' +
        'cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog ' +
        'realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal ' +
        'cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli ' +
        'besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma ' +
        'gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms ' +
        'nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones ' +
        'eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length ' +
        'ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril ' +
        'triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute ' +
        'shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i inf nan ' +
        'isnan isinf isfinite j why compan gallery hadamard hankel hilb invhilb magic pascal ' +
        'rosser toeplitz vander wilkinson'
    },
    illegal: '(//|"|#|/\\*|\\s+/\\w+)',
    contains: [
      {
        className: 'function',
        beginWithKeyword: true, end: '$',
        keywords: 'function',
        contains: [
          {
              className: 'title',
              begin: hljs.UNDERSCORE_IDENT_RE
          },
          {
              className: 'params',
              begin: '\\(', end: '\\)'
          },
          {
              className: 'params',
              begin: '\\[', end: '\\]'
          }
        ]
      },
      {
        className: 'transposed_variable',
        begin: '[a-zA-Z_][a-zA-Z_0-9]*(\'+[\\.\']*|[\\.\']+)', end: ''
      },
      {
        className: 'matrix',
        begin: '\\[', end: '\\]\'*[\\.\']*',
        contains: COMMON_CONTAINS
      },
      {
        className: 'cell',
        begin: '\\{', end: '\\}\'*[\\.\']*',
        contains: COMMON_CONTAINS
      },
      {
        className: 'comment',
        begin: '\\%', end: '$'
      }
    ].concat(COMMON_CONTAINS)
  };
};
},{}],47:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      'int float string vector matrix if else switch case default while do for in break ' +
      'continue global proc return about abs addAttr addAttributeEditorNodeHelp addDynamic ' +
      'addNewShelfTab addPP addPanelCategory addPrefixToName advanceToNextDrivenKey ' +
      'affectedNet affects aimConstraint air alias aliasAttr align alignCtx alignCurve ' +
      'alignSurface allViewFit ambientLight angle angleBetween animCone animCurveEditor ' +
      'animDisplay animView annotate appendStringArray applicationName applyAttrPreset ' +
      'applyTake arcLenDimContext arcLengthDimension arclen arrayMapper art3dPaintCtx ' +
      'artAttrCtx artAttrPaintVertexCtx artAttrSkinPaintCtx artAttrTool artBuildPaintMenu ' +
      'artFluidAttrCtx artPuttyCtx artSelectCtx artSetPaintCtx artUserPaintCtx assignCommand ' +
      'assignInputDevice assignViewportFactories attachCurve attachDeviceAttr attachSurface ' +
      'attrColorSliderGrp attrCompatibility attrControlGrp attrEnumOptionMenu ' +
      'attrEnumOptionMenuGrp attrFieldGrp attrFieldSliderGrp attrNavigationControlGrp ' +
      'attrPresetEditWin attributeExists attributeInfo attributeMenu attributeQuery ' +
      'autoKeyframe autoPlace bakeClip bakeFluidShading bakePartialHistory bakeResults ' +
      'bakeSimulation basename basenameEx batchRender bessel bevel bevelPlus binMembership ' +
      'bindSkin blend2 blendShape blendShapeEditor blendShapePanel blendTwoAttr blindDataType ' +
      'boneLattice boundary boxDollyCtx boxZoomCtx bufferCurve buildBookmarkMenu ' +
      'buildKeyframeMenu button buttonManip CBG cacheFile cacheFileCombine cacheFileMerge ' +
      'cacheFileTrack camera cameraView canCreateManip canvas capitalizeString catch ' +
      'catchQuiet ceil changeSubdivComponentDisplayLevel changeSubdivRegion channelBox ' +
      'character characterMap characterOutlineEditor characterize chdir checkBox checkBoxGrp ' +
      'checkDefaultRenderGlobals choice circle circularFillet clamp clear clearCache clip ' +
      'clipEditor clipEditorCurrentTimeCtx clipSchedule clipSchedulerOutliner clipTrimBefore ' +
      'closeCurve closeSurface cluster cmdFileOutput cmdScrollFieldExecuter ' +
      'cmdScrollFieldReporter cmdShell coarsenSubdivSelectionList collision color ' +
      'colorAtPoint colorEditor colorIndex colorIndexSliderGrp colorSliderButtonGrp ' +
      'colorSliderGrp columnLayout commandEcho commandLine commandPort compactHairSystem ' +
      'componentEditor compositingInterop computePolysetVolume condition cone confirmDialog ' +
      'connectAttr connectControl connectDynamic connectJoint connectionInfo constrain ' +
      'constrainValue constructionHistory container containsMultibyte contextInfo control ' +
      'convertFromOldLayers convertIffToPsd convertLightmap convertSolidTx convertTessellation ' +
      'convertUnit copyArray copyFlexor copyKey copySkinWeights cos cpButton cpCache ' +
      'cpClothSet cpCollision cpConstraint cpConvClothToMesh cpForces cpGetSolverAttr cpPanel ' +
      'cpProperty cpRigidCollisionFilter cpSeam cpSetEdit cpSetSolverAttr cpSolver ' +
      'cpSolverTypes cpTool cpUpdateClothUVs createDisplayLayer createDrawCtx createEditor ' +
      'createLayeredPsdFile createMotionField createNewShelf createNode createRenderLayer ' +
      'createSubdivRegion cross crossProduct ctxAbort ctxCompletion ctxEditMode ctxTraverse ' +
      'currentCtx currentTime currentTimeCtx currentUnit currentUnit curve curveAddPtCtx ' +
      'curveCVCtx curveEPCtx curveEditorCtx curveIntersect curveMoveEPCtx curveOnSurface ' +
      'curveSketchCtx cutKey cycleCheck cylinder dagPose date defaultLightListCheckBox ' +
      'defaultNavigation defineDataServer defineVirtualDevice deformer deg_to_rad delete ' +
      'deleteAttr deleteShadingGroupsAndMaterials deleteShelfTab deleteUI deleteUnusedBrushes ' +
      'delrandstr detachCurve detachDeviceAttr detachSurface deviceEditor devicePanel dgInfo ' +
      'dgdirty dgeval dgtimer dimWhen directKeyCtx directionalLight dirmap dirname disable ' +
      'disconnectAttr disconnectJoint diskCache displacementToPoly displayAffected ' +
      'displayColor displayCull displayLevelOfDetail displayPref displayRGBColor ' +
      'displaySmoothness displayStats displayString displaySurface distanceDimContext ' +
      'distanceDimension doBlur dolly dollyCtx dopeSheetEditor dot dotProduct ' +
      'doubleProfileBirailSurface drag dragAttrContext draggerContext dropoffLocator ' +
      'duplicate duplicateCurve duplicateSurface dynCache dynControl dynExport dynExpression ' +
      'dynGlobals dynPaintEditor dynParticleCtx dynPref dynRelEdPanel dynRelEditor ' +
      'dynamicLoad editAttrLimits editDisplayLayerGlobals editDisplayLayerMembers ' +
      'editRenderLayerAdjustment editRenderLayerGlobals editRenderLayerMembers editor ' +
      'editorTemplate effector emit emitter enableDevice encodeString endString endsWith env ' +
      'equivalent equivalentTol erf error eval eval evalDeferred evalEcho event ' +
      'exactWorldBoundingBox exclusiveLightCheckBox exec executeForEachObject exists exp ' +
      'expression expressionEditorListen extendCurve extendSurface extrude fcheck fclose feof ' +
      'fflush fgetline fgetword file fileBrowserDialog fileDialog fileExtension fileInfo ' +
      'filetest filletCurve filter filterCurve filterExpand filterStudioImport ' +
      'findAllIntersections findAnimCurves findKeyframe findMenuItem findRelatedSkinCluster ' +
      'finder firstParentOf fitBspline flexor floatEq floatField floatFieldGrp floatScrollBar ' +
      'floatSlider floatSlider2 floatSliderButtonGrp floatSliderGrp floor flow fluidCacheInfo ' +
      'fluidEmitter fluidVoxelInfo flushUndo fmod fontDialog fopen formLayout format fprint ' +
      'frameLayout fread freeFormFillet frewind fromNativePath fwrite gamma gauss ' +
      'geometryConstraint getApplicationVersionAsFloat getAttr getClassification ' +
      'getDefaultBrush getFileList getFluidAttr getInputDeviceRange getMayaPanelTypes ' +
      'getModifiers getPanel getParticleAttr getPluginResource getenv getpid glRender ' +
      'glRenderEditor globalStitch gmatch goal gotoBindPose grabColor gradientControl ' +
      'gradientControlNoAttr graphDollyCtx graphSelectContext graphTrackCtx gravity grid ' +
      'gridLayout group groupObjectsByName HfAddAttractorToAS HfAssignAS HfBuildEqualMap ' +
      'HfBuildFurFiles HfBuildFurImages HfCancelAFR HfConnectASToHF HfCreateAttractor ' +
      'HfDeleteAS HfEditAS HfPerformCreateAS HfRemoveAttractorFromAS HfSelectAttached ' +
      'HfSelectAttractors HfUnAssignAS hardenPointCurve hardware hardwareRenderPanel ' +
      'headsUpDisplay headsUpMessage help helpLine hermite hide hilite hitTest hotBox hotkey ' +
      'hotkeyCheck hsv_to_rgb hudButton hudSlider hudSliderButton hwReflectionMap hwRender ' +
      'hwRenderLoad hyperGraph hyperPanel hyperShade hypot iconTextButton iconTextCheckBox ' +
      'iconTextRadioButton iconTextRadioCollection iconTextScrollList iconTextStaticLabel ' +
      'ikHandle ikHandleCtx ikHandleDisplayScale ikSolver ikSplineHandleCtx ikSystem ' +
      'ikSystemInfo ikfkDisplayMethod illustratorCurves image imfPlugins inheritTransform ' +
      'insertJoint insertJointCtx insertKeyCtx insertKnotCurve insertKnotSurface instance ' +
      'instanceable instancer intField intFieldGrp intScrollBar intSlider intSliderGrp ' +
      'interToUI internalVar intersect iprEngine isAnimCurve isConnected isDirty isParentOf ' +
      'isSameObject isTrue isValidObjectName isValidString isValidUiName isolateSelect ' +
      'itemFilter itemFilterAttr itemFilterRender itemFilterType joint jointCluster jointCtx ' +
      'jointDisplayScale jointLattice keyTangent keyframe keyframeOutliner ' +
      'keyframeRegionCurrentTimeCtx keyframeRegionDirectKeyCtx keyframeRegionDollyCtx ' +
      'keyframeRegionInsertKeyCtx keyframeRegionMoveKeyCtx keyframeRegionScaleKeyCtx ' +
      'keyframeRegionSelectKeyCtx keyframeRegionSetKeyCtx keyframeRegionTrackCtx ' +
      'keyframeStats lassoContext lattice latticeDeformKeyCtx launch launchImageEditor ' +
      'layerButton layeredShaderPort layeredTexturePort layout layoutDialog lightList ' +
      'lightListEditor lightListPanel lightlink lineIntersection linearPrecision linstep ' +
      'listAnimatable listAttr listCameras listConnections listDeviceAttachments listHistory ' +
      'listInputDeviceAxes listInputDeviceButtons listInputDevices listMenuAnnotation ' +
      'listNodeTypes listPanelCategories listRelatives listSets listTransforms ' +
      'listUnselected listerEditor loadFluid loadNewShelf loadPlugin ' +
      'loadPluginLanguageResources loadPrefObjects localizedPanelLabel lockNode loft log ' +
      'longNameOf lookThru ls lsThroughFilter lsType lsUI Mayatomr mag makeIdentity makeLive ' +
      'makePaintable makeRoll makeSingleSurface makeTubeOn makebot manipMoveContext ' +
      'manipMoveLimitsCtx manipOptions manipRotateContext manipRotateLimitsCtx ' +
      'manipScaleContext manipScaleLimitsCtx marker match max memory menu menuBarLayout ' +
      'menuEditor menuItem menuItemToShelf menuSet menuSetPref messageLine min minimizeApp ' +
      'mirrorJoint modelCurrentTimeCtx modelEditor modelPanel mouse movIn movOut move ' +
      'moveIKtoFK moveKeyCtx moveVertexAlongDirection multiProfileBirailSurface mute ' +
      'nParticle nameCommand nameField namespace namespaceInfo newPanelItems newton nodeCast ' +
      'nodeIconButton nodeOutliner nodePreset nodeType noise nonLinear normalConstraint ' +
      'normalize nurbsBoolean nurbsCopyUVSet nurbsCube nurbsEditUV nurbsPlane nurbsSelect ' +
      'nurbsSquare nurbsToPoly nurbsToPolygonsPref nurbsToSubdiv nurbsToSubdivPref ' +
      'nurbsUVSet nurbsViewDirectionVector objExists objectCenter objectLayer objectType ' +
      'objectTypeUI obsoleteProc oceanNurbsPreviewPlane offsetCurve offsetCurveOnSurface ' +
      'offsetSurface openGLExtension openMayaPref optionMenu optionMenuGrp optionVar orbit ' +
      'orbitCtx orientConstraint outlinerEditor outlinerPanel overrideModifier ' +
      'paintEffectsDisplay pairBlend palettePort paneLayout panel panelConfiguration ' +
      'panelHistory paramDimContext paramDimension paramLocator parent parentConstraint ' +
      'particle particleExists particleInstancer particleRenderInfo partition pasteKey ' +
      'pathAnimation pause pclose percent performanceOptions pfxstrokes pickWalk picture ' +
      'pixelMove planarSrf plane play playbackOptions playblast plugAttr plugNode pluginInfo ' +
      'pluginResourceUtil pointConstraint pointCurveConstraint pointLight pointMatrixMult ' +
      'pointOnCurve pointOnSurface pointPosition poleVectorConstraint polyAppend ' +
      'polyAppendFacetCtx polyAppendVertex polyAutoProjection polyAverageNormal ' +
      'polyAverageVertex polyBevel polyBlendColor polyBlindData polyBoolOp polyBridgeEdge ' +
      'polyCacheMonitor polyCheck polyChipOff polyClipboard polyCloseBorder polyCollapseEdge ' +
      'polyCollapseFacet polyColorBlindData polyColorDel polyColorPerVertex polyColorSet ' +
      'polyCompare polyCone polyCopyUV polyCrease polyCreaseCtx polyCreateFacet ' +
      'polyCreateFacetCtx polyCube polyCut polyCutCtx polyCylinder polyCylindricalProjection ' +
      'polyDelEdge polyDelFacet polyDelVertex polyDuplicateAndConnect polyDuplicateEdge ' +
      'polyEditUV polyEditUVShell polyEvaluate polyExtrudeEdge polyExtrudeFacet ' +
      'polyExtrudeVertex polyFlipEdge polyFlipUV polyForceUV polyGeoSampler polyHelix ' +
      'polyInfo polyInstallAction polyLayoutUV polyListComponentConversion polyMapCut ' +
      'polyMapDel polyMapSew polyMapSewMove polyMergeEdge polyMergeEdgeCtx polyMergeFacet ' +
      'polyMergeFacetCtx polyMergeUV polyMergeVertex polyMirrorFace polyMoveEdge ' +
      'polyMoveFacet polyMoveFacetUV polyMoveUV polyMoveVertex polyNormal polyNormalPerVertex ' +
      'polyNormalizeUV polyOptUvs polyOptions polyOutput polyPipe polyPlanarProjection ' +
      'polyPlane polyPlatonicSolid polyPoke polyPrimitive polyPrism polyProjection ' +
      'polyPyramid polyQuad polyQueryBlindData polyReduce polySelect polySelectConstraint ' +
      'polySelectConstraintMonitor polySelectCtx polySelectEditCtx polySeparate ' +
      'polySetToFaceNormal polySewEdge polyShortestPathCtx polySmooth polySoftEdge ' +
      'polySphere polySphericalProjection polySplit polySplitCtx polySplitEdge polySplitRing ' +
      'polySplitVertex polyStraightenUVBorder polySubdivideEdge polySubdivideFacet ' +
      'polyToSubdiv polyTorus polyTransfer polyTriangulate polyUVSet polyUnite polyWedgeFace ' +
      'popen popupMenu pose pow preloadRefEd print progressBar progressWindow projFileViewer ' +
      'projectCurve projectTangent projectionContext projectionManip promptDialog propModCtx ' +
      'propMove psdChannelOutliner psdEditTextureFile psdExport psdTextureFile putenv pwd ' +
      'python querySubdiv quit rad_to_deg radial radioButton radioButtonGrp radioCollection ' +
      'radioMenuItemCollection rampColorPort rand randomizeFollicles randstate rangeControl ' +
      'readTake rebuildCurve rebuildSurface recordAttr recordDevice redo reference ' +
      'referenceEdit referenceQuery refineSubdivSelectionList refresh refreshAE ' +
      'registerPluginResource rehash reloadImage removeJoint removeMultiInstance ' +
      'removePanelCategory rename renameAttr renameSelectionList renameUI render ' +
      'renderGlobalsNode renderInfo renderLayerButton renderLayerParent ' +
      'renderLayerPostProcess renderLayerUnparent renderManip renderPartition ' +
      'renderQualityNode renderSettings renderThumbnailUpdate renderWindowEditor ' +
      'renderWindowSelectContext renderer reorder reorderDeformers requires reroot ' +
      'resampleFluid resetAE resetPfxToPolyCamera resetTool resolutionNode retarget ' +
      'reverseCurve reverseSurface revolve rgb_to_hsv rigidBody rigidSolver roll rollCtx ' +
      'rootOf rot rotate rotationInterpolation roundConstantRadius rowColumnLayout rowLayout ' +
      'runTimeCommand runup sampleImage saveAllShelves saveAttrPreset saveFluid saveImage ' +
      'saveInitialState saveMenu savePrefObjects savePrefs saveShelf saveToolSettings scale ' +
      'scaleBrushBrightness scaleComponents scaleConstraint scaleKey scaleKeyCtx sceneEditor ' +
      'sceneUIReplacement scmh scriptCtx scriptEditorInfo scriptJob scriptNode scriptTable ' +
      'scriptToShelf scriptedPanel scriptedPanelType scrollField scrollLayout sculpt ' +
      'searchPathArray seed selLoadSettings select selectContext selectCurveCV selectKey ' +
      'selectKeyCtx selectKeyframeRegionCtx selectMode selectPref selectPriority selectType ' +
      'selectedNodes selectionConnection separator setAttr setAttrEnumResource ' +
      'setAttrMapping setAttrNiceNameResource setConstraintRestPosition ' +
      'setDefaultShadingGroup setDrivenKeyframe setDynamic setEditCtx setEditor setFluidAttr ' +
      'setFocus setInfinity setInputDeviceMapping setKeyCtx setKeyPath setKeyframe ' +
      'setKeyframeBlendshapeTargetWts setMenuMode setNodeNiceNameResource setNodeTypeFlag ' +
      'setParent setParticleAttr setPfxToPolyCamera setPluginResource setProject ' +
      'setStampDensity setStartupMessage setState setToolTo setUITemplate setXformManip sets ' +
      'shadingConnection shadingGeometryRelCtx shadingLightRelCtx shadingNetworkCompare ' +
      'shadingNode shapeCompare shelfButton shelfLayout shelfTabLayout shellField ' +
      'shortNameOf showHelp showHidden showManipCtx showSelectionInTitle ' +
      'showShadingGroupAttrEditor showWindow sign simplify sin singleProfileBirailSurface ' +
      'size sizeBytes skinCluster skinPercent smoothCurve smoothTangentSurface smoothstep ' +
      'snap2to2 snapKey snapMode snapTogetherCtx snapshot soft softMod softModCtx sort sound ' +
      'soundControl source spaceLocator sphere sphrand spotLight spotLightPreviewPort ' +
      'spreadSheetEditor spring sqrt squareSurface srtContext stackTrace startString ' +
      'startsWith stitchAndExplodeShell stitchSurface stitchSurfacePoints strcmp ' +
      'stringArrayCatenate stringArrayContains stringArrayCount stringArrayInsertAtIndex ' +
      'stringArrayIntersector stringArrayRemove stringArrayRemoveAtIndex ' +
      'stringArrayRemoveDuplicates stringArrayRemoveExact stringArrayToString ' +
      'stringToStringArray strip stripPrefixFromName stroke subdAutoProjection ' +
      'subdCleanTopology subdCollapse subdDuplicateAndConnect subdEditUV ' +
      'subdListComponentConversion subdMapCut subdMapSewMove subdMatchTopology subdMirror ' +
      'subdToBlind subdToPoly subdTransferUVsToCache subdiv subdivCrease ' +
      'subdivDisplaySmoothness substitute substituteAllString substituteGeometry substring ' +
      'surface surfaceSampler surfaceShaderList swatchDisplayPort switchTable symbolButton ' +
      'symbolCheckBox sysFile system tabLayout tan tangentConstraint texLatticeDeformContext ' +
      'texManipContext texMoveContext texMoveUVShellContext texRotateContext texScaleContext ' +
      'texSelectContext texSelectShortestPathCtx texSmudgeUVContext texWinToolCtx text ' +
      'textCurves textField textFieldButtonGrp textFieldGrp textManip textScrollList ' +
      'textToShelf textureDisplacePlane textureHairColor texturePlacementContext ' +
      'textureWindow threadCount threePointArcCtx timeControl timePort timerX toNativePath ' +
      'toggle toggleAxis toggleWindowVisibility tokenize tokenizeList tolerance tolower ' +
      'toolButton toolCollection toolDropped toolHasOptions toolPropertyWindow torus toupper ' +
      'trace track trackCtx transferAttributes transformCompare transformLimits translator ' +
      'trim trunc truncateFluidCache truncateHairCache tumble tumbleCtx turbulence ' +
      'twoPointArcCtx uiRes uiTemplate unassignInputDevice undo undoInfo ungroup uniform unit ' +
      'unloadPlugin untangleUV untitledFileName untrim upAxis updateAE userCtx uvLink ' +
      'uvSnapshot validateShelfName vectorize view2dToolCtx viewCamera viewClipPlane ' +
      'viewFit viewHeadOn viewLookAt viewManip viewPlace viewSet visor volumeAxis vortex ' +
      'waitCursor warning webBrowser webBrowserPrefs whatIs window windowPref wire ' +
      'wireContext workspace wrinkle wrinkleContext writeTake xbmLangPathList xform',
    illegal: '</',
    contains: [
      hljs.C_NUMBER_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '`', end: '`',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'variable',
        begin: '\\$\\d',
        relevance: 5
      },
      {
        className: 'variable',
        begin: '[\\$\\%\\@\\*](\\^\\w\\b|#\\w+|[^\\s\\w{]|{\\w+}|\\w+)'
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE
    ]
  };
};
},{}],48:[function(require,module,exports){
module.exports = function(hljs) {
  var VARS = [
    {
      className: 'variable', begin: '\\$\\d+'
    },
    {
      className: 'variable', begin: '\\${', end: '}'
    },
    {
      className: 'variable', begin: '[\\$\\@]' + hljs.UNDERSCORE_IDENT_RE
    }
  ];
  var DEFAULT = {
    endsWithParent: true,
    lexems: '[a-z/_]+',
    keywords: {
      built_in:
        'on off yes no true false none blocked debug info notice warn error crit ' +
        'select break last permanent redirect kqueue rtsig epoll poll /dev/poll'
    },
    relevance: 0,
    illegal: '=>',
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        className: 'string',
        begin: '"', end: '"',
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS),
        relevance: 0
      },
      {
        className: 'string',
        begin: "'", end: "'",
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS),
        relevance: 0
      },
      {
        className: 'url',
        begin: '([a-z]+):/', end: '\\s', endsWithParent: true, excludeEnd: true
      },
      {
        className: 'regexp',
        begin: "\\s\\^", end: "\\s|{|;", returnEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // regexp locations (~, ~*)
      {
        className: 'regexp',
        begin: "~\\*?\\s+", end: "\\s|{|;", returnEnd: true,
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // *.example.com
      {
        className: 'regexp',
        begin: "\\*(\\.[a-z\\-]+)+",
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // sub.example.*
      {
        className: 'regexp',
        begin: "([a-z\\-]+\\.)+\\*",
        contains: [hljs.BACKSLASH_ESCAPE].concat(VARS)
      },
      // IP
      {
        className: 'number',
        begin: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b'
      },
      // units
      {
        className: 'number',
        begin: '\\b\\d+[kKmMgGdshdwy]*\\b',
        relevance: 0
      }
    ].concat(VARS)
  };

  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        begin: hljs.UNDERSCORE_IDENT_RE + '\\s', end: ';|{', returnBegin: true,
        contains: [
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE,
            starts: DEFAULT
          }
        ]
      }
    ],
    illegal: '[^\\s\\}]'
  };
};
},{}],49:[function(require,module,exports){
module.exports = function(hljs) {
  var OBJC_KEYWORDS = {
    keyword:
      'int float while private char catch export sizeof typedef const struct for union ' +
      'unsigned long volatile static protected bool mutable if public do return goto void ' +
      'enum else break extern class asm case short default double throw register explicit ' +
      'signed typename try this switch continue wchar_t inline readonly assign property ' +
      'protocol self synchronized end synthesize id optional required implementation ' +
      'nonatomic interface super unichar finally dynamic IBOutlet IBAction selector strong ' +
      'weak readonly',
    literal:
    	'false true FALSE TRUE nil YES NO NULL',
    built_in:
      'NSString NSDictionary CGRect CGPoint UIButton UILabel UITextView UIWebView MKMapView ' +
      'UISegmentedControl NSObject UITableViewDelegate UITableViewDataSource NSThread ' +
      'UIActivityIndicator UITabbar UIToolBar UIBarButtonItem UIImageView NSAutoreleasePool ' +
      'UITableView BOOL NSInteger CGFloat NSException NSLog NSMutableString NSMutableArray ' +
      'NSMutableDictionary NSURL NSIndexPath CGSize UITableViewCell UIView UIViewController ' +
      'UINavigationBar UINavigationController UITabBarController UIPopoverController ' +
      'UIPopoverControllerDelegate UIImage NSNumber UISearchBar NSFetchedResultsController ' +
      'NSFetchedResultsChangeType UIScrollView UIScrollViewDelegate UIEdgeInsets UIColor ' +
      'UIFont UIApplication NSNotFound NSNotificationCenter NSNotification ' +
      'UILocalNotification NSBundle NSFileManager NSTimeInterval NSDate NSCalendar ' +
      'NSUserDefaults UIWindow NSRange NSArray NSError NSURLRequest NSURLConnection class ' +
      'UIInterfaceOrientation MPMoviePlayerController dispatch_once_t ' +
      'dispatch_queue_t dispatch_sync dispatch_async dispatch_once'
  };
  return {
    keywords: OBJC_KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'string',
        begin: '\'',
        end: '[^\\\\]\'',
        illegal: '[^\\\\][^\']'
      },

      {
        className: 'preprocessor',
        begin: '#import',
        end: '$',
        contains: [
        {
          className: 'title',
          begin: '\"',
          end: '\"'
        },
        {
          className: 'title',
          begin: '<',
          end: '>'
        }
        ]
      },
      {
        className: 'preprocessor',
        begin: '#',
        end: '$'
      },
      {
        className: 'class',
        beginWithKeyword: true,
        end: '({|$)',
        keywords: 'interface class protocol implementation',
        contains: [{
          className: 'id',
          begin: hljs.UNDERSCORE_IDENT_RE
        }
        ]
      },
      {
        className: 'variable',
        begin: '\\.'+hljs.UNDERSCORE_IDENT_RE
      }
    ]
  };
};
},{}],50:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    subLanguage: 'xml',
    contains: [
      {
        className: 'comment',
        begin: '^#', end: '$'
      },
      {
        className: 'comment',
        begin: '\\^rem{', end: '}',
        relevance: 10,
        contains: [
          {
            begin: '{', end: '}',
            contains: ['self']
          }
        ]
      },
      {
        className: 'preprocessor',
        begin: '^@(?:BASE|USE|CLASS|OPTIONS)$',
        relevance: 10
      },
      {
        className: 'title',
        begin: '@[\\w\\-]+\\[[\\w^;\\-]*\\](?:\\[[\\w^;\\-]*\\])?(?:.*)$'
      },
      {
        className: 'variable',
        begin: '\\$\\{?[\\w\\-\\.\\:]+\\}?'
      },
      {
        className: 'keyword',
        begin: '\\^[\\w\\-\\.\\:]+'
      },
      {
        className: 'number',
        begin: '\\^#[0-9a-fA-F]+'
      },
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],51:[function(require,module,exports){
module.exports = function(hljs) {
  var PERL_KEYWORDS = 'getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ' +
    'ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime ' +
    'readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq' +
    'fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent ' +
    'shutdown dump chomp connect getsockname die socketpair close flock exists index shmget' +
    'sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr ' +
    'unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 ' +
    'getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline ' +
    'endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand ' +
    'mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink ' +
    'getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr ' +
    'untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link ' +
    'getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller ' +
    'lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and ' +
    'sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 ' +
    'chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach ' +
    'tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir' +
    'ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe ' +
    'atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when';
  var SUBST = {
    className: 'subst',
    begin: '[$@]\\{', end: '\\}',
    keywords: PERL_KEYWORDS,
    relevance: 10
  };
  var VAR1 = {
    className: 'variable',
    begin: '\\$\\d'
  };
  var VAR2 = {
    className: 'variable',
    begin: '[\\$\\%\\@\\*](\\^\\w\\b|#\\w+(\\:\\:\\w+)*|[^\\s\\w{]|{\\w+}|\\w+(\\:\\:\\w*)*)'
  };
  var STRING_CONTAINS = [hljs.BACKSLASH_ESCAPE, SUBST, VAR1, VAR2];
  var METHOD = {
    begin: '->',
    contains: [
      {begin: hljs.IDENT_RE},
      {begin: '{', end: '}'}
    ]
  };
  var COMMENT = {
    className: 'comment',
    begin: '^(__END__|__DATA__)', end: '\\n$',
    relevance: 5
  }
  var PERL_DEFAULT_CONTAINS = [
    VAR1, VAR2,
    hljs.HASH_COMMENT_MODE,
    COMMENT,
    {
      className: 'comment',
      begin: '^\\=\\w', end: '\\=cut', endsWithParent: true
    },
    METHOD,
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\(', end: '\\)',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\[', end: '\\]',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\{', end: '\\}',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\|', end: '\\|',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'q[qwxr]?\\s*\\<', end: '\\>',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: 'qw\\s+q', end: 'q',
      contains: STRING_CONTAINS,
      relevance: 5
    },
    {
      className: 'string',
      begin: '\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE],
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '"',
      contains: STRING_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '`', end: '`',
      contains: [hljs.BACKSLASH_ESCAPE]
    },
    {
      className: 'string',
      begin: '{\\w+}',
      relevance: 0
    },
    {
      className: 'string',
      begin: '\-?\\w+\\s*\\=\\>',
      relevance: 0
    },
    {
      className: 'number',
      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
      relevance: 0
    },
    { // regexp container
      begin: '(' + hljs.RE_STARTERS_RE + '|\\b(split|return|print|reverse|grep)\\b)\\s*',
      keywords: 'split return print reverse grep',
      relevance: 0,
      contains: [
        hljs.HASH_COMMENT_MODE,
        COMMENT,
        {
          className: 'regexp',
          begin: '(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*',
          relevance: 10
        },
        {
          className: 'regexp',
          begin: '(m|qr)?/', end: '/[a-z]*',
          contains: [hljs.BACKSLASH_ESCAPE],
          relevance: 0 // allows empty "//" which is a common comment delimiter in other languages
        }
      ]
    },
    {
      className: 'sub',
      beginWithKeyword: true, end: '(\\s*\\(.*?\\))?[;{]',
      keywords: 'sub',
      relevance: 5
    },
    {
      className: 'operator',
      begin: '-\\w\\b',
      relevance: 0
    }
  ];
  SUBST.contains = PERL_DEFAULT_CONTAINS;
  METHOD.contains[1].contains = PERL_DEFAULT_CONTAINS;

  return {
    keywords: PERL_KEYWORDS,
    contains: PERL_DEFAULT_CONTAINS
  };
};
},{}],52:[function(require,module,exports){
module.exports = function(hljs) {
  var VARIABLE = {
    className: 'variable', begin: '\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*'
  };
  var STRINGS = [
    hljs.inherit(hljs.APOS_STRING_MODE, {illegal: null}),
    hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
    {
      className: 'string',
      begin: 'b"', end: '"',
      contains: [hljs.BACKSLASH_ESCAPE]
    },
    {
      className: 'string',
      begin: 'b\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ];
  var NUMBERS = [hljs.BINARY_NUMBER_MODE, hljs.C_NUMBER_MODE];
  var TITLE = {
    className: 'title', begin: hljs.UNDERSCORE_IDENT_RE
  };
  return {
    case_insensitive: true,
    keywords:
      'and include_once list abstract global private echo interface as static endswitch ' +
      'array null if endwhile or const for endforeach self var while isset public ' +
      'protected exit foreach throw elseif include __FILE__ empty require_once do xor ' +
      'return implements parent clone use __CLASS__ __LINE__ else break print eval new ' +
      'catch __METHOD__ case exception php_user_filter default die require __FUNCTION__ ' +
      'enddeclare final try this switch continue endfor endif declare unset true false ' +
      'namespace trait goto instanceof insteadof __DIR__ __NAMESPACE__ __halt_compiler',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.HASH_COMMENT_MODE,
      {
        className: 'comment',
        begin: '/\\*', end: '\\*/',
        contains: [{
            className: 'phpdoc',
            begin: '\\s@[A-Za-z]+'
        }]
      },
      {
          className: 'comment',
          excludeBegin: true,
          begin: '__halt_compiler.+?;', endsWithParent: true
      },
      {
        className: 'string',
        begin: '<<<[\'"]?\\w+[\'"]?$', end: '^\\w+;',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'preprocessor',
        begin: '<\\?php',
        relevance: 10
      },
      {
        className: 'preprocessor',
        begin: '\\?>'
      },
      VARIABLE,
      {
        className: 'function',
        beginWithKeyword: true, end: '{',
        keywords: 'function',
        illegal: '\\$|\\[|%',
        contains: [
          TITLE,
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              'self',
              VARIABLE,
              hljs.C_BLOCK_COMMENT_MODE
            ].concat(STRINGS).concat(NUMBERS)
          }
        ]
      },
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class',
        illegal: '[:\\(\\$]',
        contains: [
          {
            beginWithKeyword: true, endsWithParent: true,
            keywords: 'extends',
            contains: [TITLE]
          },
          TITLE
        ]
      },
      {
        begin: '=>' // No markup, just a relevance booster
      }
    ].concat(STRINGS).concat(NUMBERS)
  };
};
},{}],53:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    contains: [
      hljs.C_NUMBER_MODE,
      {
        className: 'builtin',
        begin: '{', end: '}$',
        excludeBegin: true, excludeEnd: true,
        contains: [hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE],
        relevance: 0
      },
      {
        className: 'filename',
        begin: '[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}', end: ':',
        excludeEnd: true
      },
      {
        className: 'header',
        begin: '(ncalls|tottime|cumtime)', end: '$',
        keywords: 'ncalls tottime|10 cumtime|10 filename',
        relevance: 10
      },
      {
        className: 'summary',
        begin: 'function calls', end: '$',
        contains: [hljs.C_NUMBER_MODE],
        relevance: 10
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      {
        className: 'function',
        begin: '\\(', end: '\\)$',
        contains: [{
          className: 'title',
          begin: hljs.UNDERSCORE_IDENT_RE,
          relevance: 0
        }],
        relevance: 0
      }
    ]
  };
};
},{}],54:[function(require,module,exports){
module.exports = function(hljs) {
  var PROMPT = {
    className: 'prompt',  begin: '^(>>>|\\.\\.\\.) '
  }
  var STRINGS = [
    {
      className: 'string',
      begin: '(u|b)?r?\'\'\'', end: '\'\'\'',
      contains: [PROMPT],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(u|b)?r?"""', end: '"""',
      contains: [PROMPT],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(u|r|ur)\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(u|r|ur)"', end: '"',
      contains: [hljs.BACKSLASH_ESCAPE],
      relevance: 10
    },
    {
      className: 'string',
      begin: '(b|br)\'', end: '\'',
      contains: [hljs.BACKSLASH_ESCAPE]
    },
    {
      className: 'string',
      begin: '(b|br)"', end: '"',
      contains: [hljs.BACKSLASH_ESCAPE]
    }
  ].concat([
    hljs.APOS_STRING_MODE,
    hljs.QUOTE_STRING_MODE
  ]);
  var TITLE = {
    className: 'title', begin: hljs.UNDERSCORE_IDENT_RE
  };
  var PARAMS = {
    className: 'params',
    begin: '\\(', end: '\\)',
    contains: ['self', hljs.C_NUMBER_MODE, PROMPT].concat(STRINGS)
  };
  var FUNC_CLASS_PROTO = {
    beginWithKeyword: true, end: ':',
    illegal: '[${=;\\n]',
    contains: [TITLE, PARAMS],
    relevance: 10
  };

  return {
    keywords: {
      keyword:
        'and elif is global as in if from raise for except finally print import pass return ' +
        'exec else break not with class assert yield try while continue del or def lambda ' +
        'nonlocal|10',
      built_in:
        'None True False Ellipsis NotImplemented'
    },
    illegal: '(</|->|\\?)',
    contains: STRINGS.concat([
      PROMPT,
      hljs.HASH_COMMENT_MODE,
      hljs.inherit(FUNC_CLASS_PROTO, {className: 'function', keywords: 'def'}),
      hljs.inherit(FUNC_CLASS_PROTO, {className: 'class', keywords: 'class'}),
      hljs.C_NUMBER_MODE,
      {
        className: 'decorator',
        begin: '@', end: '$'
      },
      {
        begin: '\\b(print|exec)\\(' // don’t highlight keywords-turned-functions in Python 3
      }
    ])
  };
};
},{}],55:[function(require,module,exports){
module.exports = function(hljs) {
  var IDENT_RE = '([a-zA-Z]|\\.[a-zA-Z.])[a-zA-Z0-9._]*';

  return {
    contains: [
      hljs.HASH_COMMENT_MODE,
      {
        begin: IDENT_RE,
        lexems: IDENT_RE,
        keywords: {
          keyword:
            'function if in break next repeat else for return switch while try tryCatch|10 ' +
            'stop warning require library attach detach source setMethod setGeneric ' +
            'setGroupGeneric setClass ...|10',
          literal:
            'NULL NA TRUE FALSE T F Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 ' +
            'NA_complex_|10'
        },
        relevance: 0
      },
      {
        // hex value
        className: 'number',
        begin: "0[xX][0-9a-fA-F]+[Li]?\\b",
        relevance: 0
      },
      {
        // explicit integer
        className: 'number',
        begin: "\\d+(?:[eE][+\\-]?\\d*)?L\\b",
        relevance: 0
      },
      {
        // number with trailing decimal
        className: 'number',
        begin: "\\d+\\.(?!\\d)(?:i\\b)?",
        relevance: 0
      },
      {
        // number
        className: 'number',
        begin: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b",
        relevance: 0
      },
      {
        // number with leading decimal
        className: 'number',
        begin: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b",
        relevance: 0
      },

      {
        // escaped identifier
        begin: '`',
        end: '`',
        relevance: 0
      },

      {
        className: 'string',
        begin: '"',
        end: '"',
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
      },
      {
        className: 'string',
        begin: "'",
        end: "'",
        contains: [hljs.BACKSLASH_ESCAPE],
        relevance: 0
      }
    ]
  };
};
},{}],56:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords:
      'ArchiveRecord AreaLightSource Atmosphere Attribute AttributeBegin AttributeEnd Basis ' +
      'Begin Blobby Bound Clipping ClippingPlane Color ColorSamples ConcatTransform Cone ' +
      'CoordinateSystem CoordSysTransform CropWindow Curves Cylinder DepthOfField Detail ' +
      'DetailRange Disk Displacement Display End ErrorHandler Exposure Exterior Format ' +
      'FrameAspectRatio FrameBegin FrameEnd GeneralPolygon GeometricApproximation Geometry ' +
      'Hider Hyperboloid Identity Illuminate Imager Interior LightSource ' +
      'MakeCubeFaceEnvironment MakeLatLongEnvironment MakeShadow MakeTexture Matte ' +
      'MotionBegin MotionEnd NuPatch ObjectBegin ObjectEnd ObjectInstance Opacity Option ' +
      'Orientation Paraboloid Patch PatchMesh Perspective PixelFilter PixelSamples ' +
      'PixelVariance Points PointsGeneralPolygons PointsPolygons Polygon Procedural Projection ' +
      'Quantize ReadArchive RelativeDetail ReverseOrientation Rotate Scale ScreenWindow ' +
      'ShadingInterpolation ShadingRate Shutter Sides Skew SolidBegin SolidEnd Sphere ' +
      'SubdivisionMesh Surface TextureCoordinates Torus Transform TransformBegin TransformEnd ' +
      'TransformPoints Translate TrimCurve WorldBegin WorldEnd',
    illegal: '</',
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE
    ]
  };
};
},{}],57:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        'float color point normal vector matrix while for if do return else break extern continue',
      built_in:
        'abs acos ambient area asin atan atmosphere attribute calculatenormal ceil cellnoise ' +
        'clamp comp concat cos degrees depth Deriv diffuse distance Du Dv environment exp ' +
        'faceforward filterstep floor format fresnel incident length lightsource log match ' +
        'max min mod noise normalize ntransform opposite option phong pnoise pow printf ' +
        'ptlined radians random reflect refract renderinfo round setcomp setxcomp setycomp ' +
        'setzcomp shadow sign sin smoothstep specular specularbrdf spline sqrt step tan ' +
        'texture textureinfo trace transform vtransform xcomp ycomp zcomp'
    },
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '#', end: '$'
      },
      {
        className: 'shader',
        beginWithKeyword: true, end: '\\(',
        keywords: 'surface displacement light volume imager'
      },
      {
        className: 'shading',
        beginWithKeyword: true, end: '\\(',
        keywords: 'illuminate illuminance gather'
      }
    ]
  };
};
},{}],58:[function(require,module,exports){
module.exports = function(hljs) {
  var RUBY_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*(\\!|\\?)?';
  var RUBY_METHOD_RE = '[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?';
  var RUBY_KEYWORDS = {
    keyword:
      'and false then defined module in return redo if BEGIN retry end for true self when ' +
      'next until do begin unless END rescue nil else break undef not super class case ' +
      'require yield alias while ensure elsif or include'
  };
  var YARDOCTAG = {
    className: 'yardoctag',
    begin: '@[A-Za-z]+'
  };
  var COMMENTS = [
    {
      className: 'comment',
      begin: '#', end: '$',
      contains: [YARDOCTAG]
    },
    {
      className: 'comment',
      begin: '^\\=begin', end: '^\\=end',
      contains: [YARDOCTAG],
      relevance: 10
    },
    {
      className: 'comment',
      begin: '^__END__', end: '\\n$'
    }
  ];
  var SUBST = {
    className: 'subst',
    begin: '#\\{', end: '}',
    lexems: RUBY_IDENT_RE,
    keywords: RUBY_KEYWORDS
  };
  var STR_CONTAINS = [hljs.BACKSLASH_ESCAPE, SUBST];
  var STRINGS = [
    {
      className: 'string',
      begin: '\'', end: '\'',
      contains: STR_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '"', end: '"',
      contains: STR_CONTAINS,
      relevance: 0
    },
    {
      className: 'string',
      begin: '%[qw]?\\(', end: '\\)',
      contains: STR_CONTAINS
    },
    {
      className: 'string',
      begin: '%[qw]?\\[', end: '\\]',
      contains: STR_CONTAINS
    },
    {
      className: 'string',
      begin: '%[qw]?{', end: '}',
      contains: STR_CONTAINS
    },
    {
      className: 'string',
      begin: '%[qw]?<', end: '>',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?/', end: '/',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?%', end: '%',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?-', end: '-',
      contains: STR_CONTAINS,
      relevance: 10
    },
    {
      className: 'string',
      begin: '%[qw]?\\|', end: '\\|',
      contains: STR_CONTAINS,
      relevance: 10
    }
  ];
  var FUNCTION = {
    className: 'function',
    beginWithKeyword: true, end: ' |$|;',
    keywords: 'def',
    contains: [
      {
        className: 'title',
        begin: RUBY_METHOD_RE,
        lexems: RUBY_IDENT_RE,
        keywords: RUBY_KEYWORDS
      },
      {
        className: 'params',
        begin: '\\(', end: '\\)',
        lexems: RUBY_IDENT_RE,
        keywords: RUBY_KEYWORDS
      }
    ].concat(COMMENTS)
  };

  var RUBY_DEFAULT_CONTAINS = COMMENTS.concat(STRINGS.concat([
    {
      className: 'class',
      beginWithKeyword: true, end: '$|;',
      keywords: 'class module',
      contains: [
        {
          className: 'title',
          begin: '[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?',
          relevance: 0
        },
        {
          className: 'inheritance',
          begin: '<\\s*',
          contains: [{
            className: 'parent',
            begin: '(' + hljs.IDENT_RE + '::)?' + hljs.IDENT_RE
          }]
        }
      ].concat(COMMENTS)
    },
    FUNCTION,
    {
      className: 'constant',
      begin: '(::)?(\\b[A-Z]\\w*(::)?)+',
      relevance: 0
    },
    {
      className: 'symbol',
      begin: ':',
      contains: STRINGS.concat([{begin: RUBY_METHOD_RE}]),
      relevance: 0
    },
    {
      className: 'symbol',
      begin: RUBY_IDENT_RE + ':',
      relevance: 0
    },
    {
      className: 'number',
      begin: '(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b',
      relevance: 0
    },
    {
      className: 'number',
      begin: '\\?\\w'
    },
    {
      className: 'variable',
      begin: '(\\$\\W)|((\\$|\\@\\@?)(\\w+))'
    },
    { // regexp container
      begin: '(' + hljs.RE_STARTERS_RE + ')\\s*',
      contains: COMMENTS.concat([
        {
          className: 'regexp',
          begin: '/', end: '/[a-z]*',
          illegal: '\\n',
          contains: [hljs.BACKSLASH_ESCAPE, SUBST]
        }
      ]),
      relevance: 0
    }
  ]));
  SUBST.contains = RUBY_DEFAULT_CONTAINS;
  FUNCTION.contains[1].contains = RUBY_DEFAULT_CONTAINS;

  return {
    lexems: RUBY_IDENT_RE,
    keywords: RUBY_KEYWORDS,
    contains: RUBY_DEFAULT_CONTAINS
  };
};
},{}],59:[function(require,module,exports){
module.exports = function(hljs) {
  var TITLE = {
    className: 'title',
    begin: hljs.UNDERSCORE_IDENT_RE
  };
  var NUMBER = {
    className: 'number',
    begin: '\\b(0[xb][A-Za-z0-9_]+|[0-9_]+(\\.[0-9_]+)?([uif](8|16|32|64)?)?)',
    relevance: 0
  };
  var KEYWORDS =
    'alt any as assert be bind block bool break char check claim const cont dir do else enum ' +
    'export f32 f64 fail false float fn for i16 i32 i64 i8 if iface impl import in int let ' +
    'log mod mutable native note of prove pure resource ret self str syntax true type u16 u32 ' +
    'u64 u8 uint unchecked unsafe use vec while';
  return {
    keywords: KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null}),
      hljs.APOS_STRING_MODE,
      NUMBER,
      {
        className: 'function',
        beginWithKeyword: true, end: '(\\(|<)',
        keywords: 'fn',
        contains: [TITLE]
      },
      {
        className: 'preprocessor',
        begin: '#\\[', end: '\\]'
      },
      {
        beginWithKeyword: true, end: '(=|<)',
        keywords: 'type',
        contains: [TITLE],
        illegal: '\\S'
      },
      {
        beginWithKeyword: true, end: '({|<)',
        keywords: 'iface enum',
        contains: [TITLE],
        illegal: '\\S'
      }
    ]
  };
};
},{}],60:[function(require,module,exports){
module.exports = function(hljs) {
  var ANNOTATION = {
    className: 'annotation', begin: '@[A-Za-z]+'
  };
  var STRING = {
    className: 'string',
    begin: 'u?r?"""', end: '"""',
    relevance: 10
  };
  return {
    keywords:
      'type yield lazy override def with val var false true sealed abstract private trait ' +
      'object null if for while throw finally protected extends import final return else ' +
      'break new catch super class case package default try this match continue throws',
    contains: [
      {
        className: 'javadoc',
        begin: '/\\*\\*', end: '\\*/',
        contains: [{
          className: 'javadoctag',
          begin: '@[A-Za-z]+'
        }],
        relevance: 10
      },
      hljs.C_LINE_COMMENT_MODE, hljs.C_BLOCK_COMMENT_MODE,
      hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, STRING,
      {
        className: 'class',
        begin: '((case )?class |object |trait )', end: '({|$)', // beginWithKeyword won't work because a single "case" shouldn't start this mode
        illegal: ':',
        keywords: 'case class trait object',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends with',
            relevance: 10
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          },
          {
            className: 'params',
            begin: '\\(', end: '\\)',
            contains: [
              hljs.APOS_STRING_MODE, hljs.QUOTE_STRING_MODE, STRING,
              ANNOTATION
            ]
          }
        ]
      },
      hljs.C_NUMBER_MODE,
      ANNOTATION
    ]
  };
};
},{}],61:[function(require,module,exports){
module.exports = function(hljs) {
  var VAR_IDENT_RE = '[a-z][a-zA-Z0-9_]*';
  var CHAR = {
    className: 'char',
    begin: '\\$.{1}'
  };
  var SYMBOL = {
    className: 'symbol',
    begin: '#' + hljs.UNDERSCORE_IDENT_RE
  };
  return {
    keywords: 'self super nil true false thisContext', // only 6
    contains: [
      {
        className: 'comment',
        begin: '"', end: '"',
        relevance: 0
      },
      hljs.APOS_STRING_MODE,
      {
        className: 'class',
        begin: '\\b[A-Z][A-Za-z0-9_]*',
        relevance: 0
      },
      {
        className: 'method',
        begin: VAR_IDENT_RE + ':'
      },
      hljs.C_NUMBER_MODE,
      SYMBOL,
      CHAR,
      {
        className: 'localvars',
        begin: '\\|\\s*((' + VAR_IDENT_RE + ')\\s*)+\\|'
      },
      {
        className: 'array',
        begin: '\\#\\(', end: '\\)',
        contains: [
          hljs.APOS_STRING_MODE,
          CHAR,
          hljs.C_NUMBER_MODE,
          SYMBOL
        ]
      }
    ]
  };
};
},{}],62:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    contains: [
      {
        className: 'operator',
        begin: '(begin|start|commit|rollback|savepoint|lock|alter|create|drop|rename|call|delete|do|handler|insert|load|replace|select|truncate|update|set|show|pragma|grant)\\b(?!:)', // negative look-ahead here is specifically to prevent stomping on SmallTalk
        end: ';', endsWithParent: true,
        keywords: {
          keyword: 'all partial global month current_timestamp using go revoke smallint ' +
            'indicator end-exec disconnect zone with character assertion to add current_user ' +
            'usage input local alter match collate real then rollback get read timestamp ' +
            'session_user not integer bit unique day minute desc insert execute like ilike|2 ' +
            'level decimal drop continue isolation found where constraints domain right ' +
            'national some module transaction relative second connect escape close system_user ' +
            'for deferred section cast current sqlstate allocate intersect deallocate numeric ' +
            'public preserve full goto initially asc no key output collation group by union ' +
            'session both last language constraint column of space foreign deferrable prior ' +
            'connection unknown action commit view or first into float year primary cascaded ' +
            'except restrict set references names table outer open select size are rows from ' +
            'prepare distinct leading create only next inner authorization schema ' +
            'corresponding option declare precision immediate else timezone_minute external ' +
            'varying translation true case exception join hour default double scroll value ' +
            'cursor descriptor values dec fetch procedure delete and false int is describe ' +
            'char as at in varchar null trailing any absolute current_time end grant ' +
            'privileges when cross check write current_date pad begin temporary exec time ' +
            'update catalog user sql date on identity timezone_hour natural whenever interval ' +
            'work order cascade diagnostics nchar having left call do handler load replace ' +
            'truncate start lock show pragma exists number',
          aggregate: 'count sum min max avg'
        },
        contains: [
          {
            className: 'string',
            begin: '\'', end: '\'',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '\'\''}],
            relevance: 0
          },
          {
            className: 'string',
            begin: '"', end: '"',
            contains: [hljs.BACKSLASH_ESCAPE, {begin: '""'}],
            relevance: 0
          },
          {
            className: 'string',
            begin: '`', end: '`',
            contains: [hljs.BACKSLASH_ESCAPE]
          },
          hljs.C_NUMBER_MODE
        ]
      },
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'comment',
        begin: '--', end: '$'
      }
    ]
  };
};
},{}],63:[function(require,module,exports){
module.exports = function(hljs) {
  var COMMAND1 = {
    className: 'command',
    begin: '\\\\[a-zA-Zа-яА-я]+[\\*]?'
  };
  var COMMAND2 = {
    className: 'command',
    begin: '\\\\[^a-zA-Zа-яА-я0-9]'
  };
  var SPECIAL = {
    className: 'special',
    begin: '[{}\\[\\]\\&#~]',
    relevance: 0
  };

  return {
    contains: [
      { // parameter
        begin: '\\\\[a-zA-Zа-яА-я]+[\\*]? *= *-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?',
        returnBegin: true,
        contains: [
          COMMAND1, COMMAND2,
          {
            className: 'number',
            begin: ' *=', end: '-?\\d*\\.?\\d+(pt|pc|mm|cm|in|dd|cc|ex|em)?',
            excludeBegin: true
          }
        ],
        relevance: 10
      },
      COMMAND1, COMMAND2,
      SPECIAL,
      {
        className: 'formula',
        begin: '\\$\\$', end: '\\$\\$',
        contains: [COMMAND1, COMMAND2, SPECIAL],
        relevance: 0
      },
      {
        className: 'formula',
        begin: '\\$', end: '\\$',
        contains: [COMMAND1, COMMAND2, SPECIAL],
        relevance: 0
      },
      {
        className: 'comment',
        begin: '%', end: '$',
        relevance: 0
      }
    ]
  };
};
},{}],64:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    keywords: {
      keyword:
        // Value types
        'char uchar unichar int uint long ulong short ushort int8 int16 int32 int64 uint8 ' +
        'uint16 uint32 uint64 float double bool struct enum string void ' +
        // Reference types
        'weak unowned owned ' +
        // Modifiers
        'async signal static abstract interface override ' +
        // Control Structures
        'while do for foreach else switch case break default return try catch ' +
        // Visibility
        'public private protected internal ' +
        // Other
        'using new this get set const stdout stdin stderr var',
      built_in:
        'DBus GLib CCode Gee Object',
      literal:
        'false true null'
    },
    contains: [
      {
        className: 'class',
        beginWithKeyword: true, end: '{',
        keywords: 'class interface delegate namespace',
        contains: [
          {
            beginWithKeyword: true,
            keywords: 'extends implements'
          },
          {
            className: 'title',
            begin: hljs.UNDERSCORE_IDENT_RE
          }
        ]
      },
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'string',
        begin: '"""', end: '"""',
        relevance: 5
      },
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'preprocessor',
        begin: '^#', end: '$',
        relevance: 2
      },
      {
        className: 'constant',
        begin: ' [A-Z_]+ ',
        relevance: 0
      }
    ]
  };
};
},{}],65:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        'call class const dim do loop erase execute executeglobal exit for each next function ' +
        'if then else on error option explicit new private property let get public randomize ' +
        'redim rem select case set stop sub while wend with end to elseif is or xor and not ' +
        'class_initialize class_terminate default preserve in me byval byref step resume goto',
      built_in:
        'lcase month vartype instrrev ubound setlocale getobject rgb getref string ' +
        'weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency ' +
        'conversions csng timevalue second year space abs clng timeserial fixs len asc ' +
        'isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate ' +
        'instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex ' +
        'chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim ' +
        'strcomp int createobject loadpicture tan formatnumber mid scriptenginebuildversion ' +
        'scriptengine split scriptengineminorversion cint sin datepart ltrim sqr ' +
        'scriptenginemajorversion time derived eval date formatpercent exp inputbox left ascw ' +
        'chrw regexp server response request cstr err',
      literal:
        'true false null nothing empty'
    },
    illegal: '//',
    contains: [
      hljs.inherit(hljs.QUOTE_STRING_MODE, {contains: [{begin: '""'}]}),
      {
        className: 'comment',
        begin: '\'', end: '$'
      },
      hljs.C_NUMBER_MODE
    ]
  };
};
},{}],66:[function(require,module,exports){
module.exports = function(hljs) {
  return {
    case_insensitive: true,
    keywords: {
      keyword:
        'abs access after alias all and architecture array assert attribute begin block ' +
        'body buffer bus case component configuration constant context cover disconnect ' +
        'downto default else elsif end entity exit fairness file for force function generate ' +
        'generic group guarded if impure in inertial inout is label library linkage literal ' +
        'loop map mod nand new next nor not null of on open or others out package port ' +
        'postponed procedure process property protected pure range record register reject ' +
        'release rem report restrict restrict_guarantee return rol ror select sequence ' +
        'severity shared signal sla sll sra srl strong subtype then to transport type ' +
        'unaffected units until use variable vmode vprop vunit wait when while with xnor xor',
      typename:
        'boolean bit character severity_level integer time delay_length natural positive ' +
        'string bit_vector file_open_kind file_open_status std_ulogic std_ulogic_vector ' +
        'std_logic std_logic_vector unsigned signed boolean_vector integer_vector ' +
        'real_vector time_vector'
    },
    illegal: '{',
    contains: [
      hljs.C_BLOCK_COMMENT_MODE,        // VHDL-2008 block commenting.
      {
        className: 'comment',
        begin: '--', end: '$'
      },
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'literal',
        begin: '\'(U|X|0|1|Z|W|L|H|-)\'',
        contains: [hljs.BACKSLASH_ESCAPE]
      },
      {
        className: 'attribute',
        begin: '\'[A-Za-z](_?[A-Za-z0-9])*',
        contains: [hljs.BACKSLASH_ESCAPE]
      }
    ]
  }; // return
};
},{}],67:[function(require,module,exports){
module.exports = function(hljs) {
  var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
  var TAG_INTERNALS = {
    endsWithParent: true,
    contains: [
      {
        className: 'attribute',
        begin: XML_IDENT_RE,
        relevance: 0
      },
      {
        begin: '="', returnBegin: true, end: '"',
        contains: [{
            className: 'value',
            begin: '"', endsWithParent: true
        }]
      },
      {
        begin: '=\'', returnBegin: true, end: '\'',
        contains: [{
          className: 'value',
          begin: '\'', endsWithParent: true
        }]
      },
      {
        begin: '=',
        contains: [{
          className: 'value',
          begin: '[^\\s/>]+'
        }]
      }
    ]
  };
  return {
    case_insensitive: true,
    contains: [
      {
        className: 'pi',
        begin: '<\\?', end: '\\?>',
        relevance: 10
      },
      {
        className: 'doctype',
        begin: '<!DOCTYPE', end: '>',
        relevance: 10,
        contains: [{begin: '\\[', end: '\\]'}]
      },
      {
        className: 'comment',
        begin: '<!--', end: '-->',
        relevance: 10
      },
      {
        className: 'cdata',
        begin: '<\\!\\[CDATA\\[', end: '\\]\\]>',
        relevance: 10
      },
      {
        className: 'tag',
        /*
        The lookahead pattern (?=...) ensures that 'begin' only matches
        '<style' as a single word, followed by a whitespace or an
        ending braket. The '$' is needed for the lexem to be recognized
        by hljs.subMode() that tests lexems outside the stream.
        */
        begin: '<style(?=\\s|>|$)', end: '>',
        keywords: {title: 'style'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</style>', returnEnd: true,
          subLanguage: 'css'
        }
      },
      {
        className: 'tag',
        // See the comment in the <style tag about the lookahead pattern
        begin: '<script(?=\\s|>|$)', end: '>',
        keywords: {title: 'script'},
        contains: [TAG_INTERNALS],
        starts: {
          end: '</script>', returnEnd: true,
          subLanguage: 'javascript'
        }
      },
      {
        begin: '<%', end: '%>',
        subLanguage: 'vbscript'
      },
      {
        className: 'tag',
        begin: '</?', end: '/?>',
        contains: [
          {
            className: 'title', begin: '[^ />]+'
          },
          TAG_INTERNALS
        ]
      }
    ]
  };
};
},{}],68:[function(require,module,exports){
var inserted = [];

module.exports = function (css) {
    if (inserted.indexOf(css) >= 0) return;
    inserted.push(css);
    
    var elem = document.createElement('style');
    var text = document.createTextNode(css);
    elem.appendChild(text);
    
    if (document.head.childNodes.length) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
    }
    else {
        document.head.appendChild(elem);
    }
};

},{}],69:[function(require,module,exports){
var global=self;/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i+1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item[item.length-1] === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1][cap[1].length-1] === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1][6] === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0][0];
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<strong>'
        + this.output(cap[2] || cap[1])
        + '</strong>';
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<em>'
        + this.output(cap[2] || cap[1])
        + '</em>';
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<code>'
        + escape(cap[2], true)
        + '</code>';
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<br>';
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<del>'
        + this.output(cap[1])
        + '</del>';
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  if (cap[0][0] !== '!') {
    return '<a href="'
      + escape(link.href)
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>'
      + this.output(cap[1])
      + '</a>';
  } else {
    return '<img src="'
      + escape(link.href)
      + '" alt="'
      + escape(cap[1])
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>';
  }
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    .replace(/--/g, '\u2014')
    .replace(/'([^']*)'/g, '\u2018$1\u2019')
    .replace(/"([^"]*)"/g, '\u201C$1\u201D')
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length-1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'heading': {
      return '<h'
        + this.token.depth
        + '>'
        + this.inline.output(this.token.text)
        + '</h'
        + this.token.depth
        + '>\n';
    }
    case 'code': {
      if (this.options.highlight) {
        var code = this.options.highlight(this.token.text, this.token.lang);
        if (code != null && code !== this.token.text) {
          this.token.escaped = true;
          this.token.text = code;
        }
      }

      if (!this.token.escaped) {
        this.token.text = escape(this.token.text, true);
      }

      return '<pre><code'
        + (this.token.lang
        ? ' class="'
        + this.options.langPrefix
        + this.token.lang
        + '"'
        : '')
        + '>'
        + this.token.text
        + '</code></pre>\n';
    }
    case 'table': {
      var body = ''
        , heading
        , i
        , row
        , cell
        , j;

      // header
      body += '<thead>\n<tr>\n';
      for (i = 0; i < this.token.header.length; i++) {
        heading = this.inline.output(this.token.header[i]);
        body += this.token.align[i]
          ? '<th align="' + this.token.align[i] + '">' + heading + '</th>\n'
          : '<th>' + heading + '</th>\n';
      }
      body += '</tr>\n</thead>\n';

      // body
      body += '<tbody>\n'
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        body += '<tr>\n';
        for (j = 0; j < row.length; j++) {
          cell = this.inline.output(row[j]);
          body += this.token.align[j]
            ? '<td align="' + this.token.align[j] + '">' + cell + '</td>\n'
            : '<td>' + cell + '</td>\n';
        }
        body += '</tr>\n';
      }
      body += '</tbody>\n';

      return '<table>\n'
        + body
        + '</table>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = this.token.ordered ? 'ol' : 'ul'
        , body = '';

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return '<'
        + type
        + '>\n'
        + body
        + '</'
        + type
        + '>\n';
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'html': {
      return !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
    }
    case 'paragraph': {
      return '<p>'
        + this.inline.output(this.token.text)
        + '</p>\n';
    }
    case 'text': {
      return '<p>'
        + this.parseText()
        + '</p>\n';
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    if (opt) opt = merge({}, marked.defaults, opt);

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(hi) {
      var out, err;

      if (hi !== true) {
        delete opt.highlight;
      }

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done(true);
    }

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

},{}],70:[function(require,module,exports){
var sources  = require('./sources')
var sinks    = require('./sinks')
var throughs = require('./throughs')
var u        = require('pull-core')

function isThrough (fun) {
  return fun.type === "Through" || fun.length === 1
}

var exports = module.exports = function pull () {
  var args = [].slice.call(arguments)

  if(isThrough(args[0]))
    return function (read) {
      args.unshift(read)
      return pull.apply(null, args)
    }

  var read = args.shift()
  while(args.length)
    read = args.shift() (read)
  return read
}

for(var k in sources)
  exports[k] = u.Source(sources[k])

for(var k in throughs)
  exports[k] = u.Through(throughs[k])

for(var k in sinks)
  exports[k] = u.Sink(sinks[k])

var maybe = require('./maybe')(exports)

for(var k in maybe)
  exports[k] = maybe[k]

exports.Duplex  = 
exports.Through = exports.pipeable       = u.Through
exports.Source  = exports.pipeableSource = u.Source
exports.Sink    = exports.pipeableSink   = u.Sink



},{"./maybe":71,"./sinks":73,"./sources":74,"./throughs":75,"pull-core":72}],71:[function(require,module,exports){
var u = require('pull-core')
var prop = u.prop
var id   = u.id
var maybeSink = u.maybeSink

module.exports = function (pull) {

  var exports = {}
  var drain = pull.drain

  var find = 
  exports.find = function (test, cb) {
    return maybeSink(function (cb) {
      var ended = false
      if(!cb)
        cb = test, test = id
      else
        test = prop(test) || id

      return drain(function (data) {
        if(test(data)) {
          ended = true
          cb(null, data)
        return false
        }
      }, function (err) {
        if(ended) return //already called back
        cb(err === true ? null : err, null)
      })

    }, cb)
  }

  var reduce = exports.reduce = 
  function (reduce, acc, cb) {
    
    return maybeSink(function (cb) {
      return drain(function (data) {
        acc = reduce(acc, data)
      }, function (err) {
        cb(err, acc)
      })

    }, cb)
  }

  var collect = exports.collect = exports.writeArray =
  function (cb) {
    return reduce(function (arr, item) {
      arr.push(item)
      return arr
    }, [], cb)
  }

  var concat = exports.concat =
  function (cb) {
    return reduce(function (a, b) {
      return a + b
    }, '', cb)
  }

  return exports
}

},{"pull-core":72}],72:[function(require,module,exports){
exports.id = 
function (item) {
  return item
}

exports.prop = 
function (map) {  
  if('string' == typeof map) {
    var key = map
    return function (data) { return data[key] }
  }
  return map
}

exports.tester = function (test) {
  if(!test) return exports.id
  if('object' === typeof test
    && 'function' === typeof test.test)
      return test.test.bind(test)
  return exports.prop(test) || exports.id
}

exports.addPipe = addPipe

function addPipe(read) {
  if('function' !== typeof read)
    return read

  read.pipe = read.pipe || function (reader) {
    if('function' != typeof reader)
      throw new Error('must pipe to reader')
    return addPipe(reader(read))
  }
  read.type = 'Source'
  return read
}

var Source =
exports.Source =
function Source (createRead) {
  function s() {
    var args = [].slice.call(arguments)
    return addPipe(createRead.apply(null, args))
  }
  s.type = 'Source'
  return s
}


var Through =
exports.Through = 
function (createRead) {
  return function () {
    var args = [].slice.call(arguments)
    var piped = []
    function reader (read) {
      args.unshift(read)
      read = createRead.apply(null, args)
      while(piped.length)
        read = piped.shift()(read)
      return read
      //pipeing to from this reader should compose...
    }
    reader.pipe = function (read) {
      piped.push(read) 
      if(read.type === 'Source')
        throw new Error('cannot pipe ' + reader.type + ' to Source')
      reader.type = read.type === 'Sink' ? 'Sink' : 'Through'
      return reader
    }
    reader.type = 'Through'
    return reader
  }
}

var Sink =
exports.Sink = 
function Sink(createReader) {
  return function () {
    var args = [].slice.call(arguments)
    if(!createReader)
      throw new Error('must be createReader function')
    function s (read) {
      args.unshift(read)
      return createReader.apply(null, args)
    }
    s.type = 'Sink'
    return s
  }
}


exports.maybeSink = 
exports.maybeDrain = 
function (createSink, cb) {
  if(!cb)
    return Through(function (read) {
      var ended
      return function (close, cb) {
        if(close) return read(close, cb)
        if(ended) return cb(ended)

        createSink(function (err, data) {
          ended = err || true
          if(!err) cb(null, data)
          else     cb(ended)
        }) (read)
      }
    })()

  return Sink(function (read) {
    return createSink(cb) (read)
  })()
}


},{}],73:[function(require,module,exports){
var drain = exports.drain = function (read, op, done) {

  ;(function next() {
    var loop = true, cbed = false
    while(loop) {
      cbed = false
      read(null, function (end, data) {
        cbed = true
        if(end) {
          loop = false
          done && done(end === true ? null : end)
        }
        else if(op && false === op(data)) {
          loop = false
          read(true, done || function () {})
        }
        else if(!loop){
          next()
        }
      })
      if(!cbed) {
        loop = false
        return
      }
    }
  })()
}

var onEnd = exports.onEnd = function (read, done) {
  return drain(read, null, done)
}

var log = exports.log = function (read, done) {
  return drain(read, function (data) {
    console.log(data)
  }, done)
}


},{}],74:[function(require,module,exports){

var keys = exports.keys =
function (object) {
  return values(Object.keys(object))
}

var once = exports.once =
function (value) {
  return function (abort, cb) {
    if(abort) return cb(abort)
    if(value != null) {
      var _value = value; value = null
      cb(null, _value)
    } else
      cb(true)
  }
}

var values = exports.values = exports.readArray =
function (array) {
  if(!Array.isArray(array))
    array = Object.keys(array).map(function (k) {
      return array[k]
    })
  var i = 0
  return function (end, cb) {
    if(end)
      return cb && cb(end)  
    cb(i >= array.length || null, array[i++])
  }
}


var count = exports.count = 
function (max) {
  var i = 0; max = max || Infinity
  return function (end, cb) {
    if(end) return cb && cb(end)
    if(i > max)
      return cb(true)
    cb(null, i++)
  }
}

var infinite = exports.infinite = 
function (generate) {
  generate = generate || Math.random
  return function (end, cb) {
    if(end) return cb && cb(end)
    return cb(null, generate())
  }
}

var defer = exports.defer = function () {
  var _read, cbs = [], _end

  var read = function (end, cb) {
    if(!_read) {
      _end = end
      cbs.push(cb)
    } 
    else _read(end, cb)
  }
  read.resolve = function (read) {
    if(_read) throw new Error('already resolved')
    _read = read
    if(!_read) throw new Error('no read cannot resolve!' + _read)
    while(cbs.length)
      _read(_end, cbs.shift())
  }
  read.abort = function(err) {
    read.resolve(function (_, cb) {
      cb(err || true)
    })
  }
  return read
}

var empty = exports.empty = function () {
  return function (abort, cb) {
    cb(true)
  }
}

var depthFirst = exports.depthFirst =
function (start, createStream) {
  var reads = []

  reads.unshift(once(start))

  return function next (end, cb) {
    if(!reads.length)
      return cb(true)
    reads[0](end, function (end, data) {
      if(end) {
        //if this stream has ended, go to the next queue
        reads.shift()
        return next(null, cb)
      }
      reads.unshift(createStream(data))
      cb(end, data)
    })
  }
}
//width first is just like depth first,
//but push each new stream onto the end of the queue
var widthFirst = exports.widthFirst = 
function (start, createStream) {
  var reads = []

  reads.push(once(start))

  return function next (end, cb) {
    if(!reads.length)
      return cb(true)
    reads[0](end, function (end, data) {
      if(end) {
        reads.shift()
        return next(null, cb)
      }
      reads.push(createStream(data))
      cb(end, data)
    })
  }
}

//this came out different to the first (strm)
//attempt at leafFirst, but it's still a valid
//topological sort.
var leafFirst = exports.leafFirst = 
function (start, createStream) {
  var reads = []
  var output = []
  reads.push(once(start))
  
  return function next (end, cb) {
    reads[0](end, function (end, data) {
      if(end) {
        reads.shift()
        if(!output.length)
          return cb(true)
        return cb(null, output.shift())
      }
      reads.unshift(createStream(data))
      output.unshift(data)
      next(null, cb)
    })
  }
}


},{}],75:[function(require,module,exports){
var process=require("__browserify_process");var u      = require('pull-core')
var sources = require('./sources')
var sinks = require('./sinks')

var prop   = u.prop
var id     = u.id
var tester = u.tester

var map = exports.map = 
function (read, map) {
  map = prop(map) || id
  return function (end, cb) {
    read(end, function (end, data) {
      var data = !end ? map(data) : null
      cb(end, data)
    })
  }
}

var asyncMap = exports.asyncMap =
function (read, map) {
  if(!map) return read
  return function (end, cb) {
    if(end) return read(end, cb) //abort
    read(null, function (end, data) {
      if(end) return cb(end, data)
      map(data, cb)
    })
  }
}

var paraMap = exports.paraMap =
function (read, map, width) {
  if(!map) return read
  var ended = false, queue = [], _cb

  function drain () {
    if(!_cb) return
    var cb = _cb
    _cb = null
    if(queue.length)
      return cb(null, queue.shift())
    else if(ended && !n)
      return cb(ended)
    _cb = cb
  }

  function pull () {
    read(null, function (end, data) {
      if(end) {
        ended = end
        return drain()
      }
      n++
      map(data, function (err, data) {
        n--

        queue.push(data)
        drain()
      })

      if(n < width && !ended)
        pull()
    })
  }

  var n = 0
  return function (end, cb) {
    if(end) return read(end, cb) //abort
    //continue to read while there are less than 3 maps in flight
    _cb = cb
    if(queue.length || ended)
      pull(), drain()
    else pull()
  }
  return highWaterMark(asyncMap(read, map), width)
}

var filter = exports.filter =
function (read, test) {
  //regexp
  test = tester(test)
  return function next (end, cb) {
    read(end, function (end, data) {
      if(!end && !test(data))
        return next(end, cb)
      cb(end, data)
    })
  }
}

var filterNot = exports.filterNot =
function (read, test) {
  test = tester(test)
  return filter(read, function (e) {
    return !test(e)
  })
}

var through = exports.through = 
function (read, op, onEnd) {
  var a = false
  function once (abort) {
    if(a || !onEnd) return
    a = true
    onEnd(abort === true ? null : abort)
  }

  return function (end, cb) {
    if(end) once(end)
    return read(end, function (end, data) {
      if(!end) op && op(data)
      else once(end)
      cb(end, data)
    })
  }
}

var take = exports.take =
function (read, test) {
  var ended = false
  if('number' === typeof test) {
    var n = test; test = function () {
      return n --
    }
  }

  return function (end, cb) {
    if(ended) return cb(ended)
    if(ended = end) return read(ended, cb)

    read(null, function (end, data) {
      if(ended = ended || end) return cb(ended)
      if(!test(data)) {
        ended = true
        read(true, function (end, data) {
          cb(ended, data)
        })
      }
      else
        cb(null, data)
    })
  }
}

var unique = exports.unique = function (read, field, invert) {
  field = prop(field) || id
  var seen = {}
  return filter(read, function (data) {
    var key = field(data)
    if(seen[key]) return !!invert //false, by default
    else seen[key] = true
    return !invert //true by default
  })
}

var nonUnique = exports.nonUnique = function (read, field) {
  return unique(read, field, true)
}

var group = exports.group =
function (read, size) {
  var ended; size = size || 5
  var queue = []

  return function (end, cb) {
    //this means that the upstream is sending an error.
    if(end) return read(ended = end, cb)
    //this means that we read an end before.
    if(ended) return cb(ended)

    read(null, function next(end, data) {
      if(ended = ended || end) {
        if(!queue.length)
          return cb(ended)

        var _queue = queue; queue = []
        return cb(null, _queue)
      }
      queue.push(data)
      if(queue.length < size)
        return read(null, next)

      var _queue = queue; queue = []
      cb(null, _queue)
    })
  }
}

var flatten = exports.flatten = function (read) {
  var _read
  return function (abort, cb) {
    if(_read) nextChunk()
    else      nextStream()

    function nextChunk () {
      _read(null, function (end, data) {
        if(end) nextStream()
        else    cb(null, data)
      })
    }
    function nextStream () {
      read(null, function (end, stream) {
        if(end)
          return cb(end)
        if(Array.isArray(stream))
          stream = sources.values(stream)
        else if('function' != typeof stream)
          throw new Error('expected stream of streams')
        
        _read = stream
        nextChunk()
      })
    }
  }
}

var prepend =
exports.prepend =
function (read, head) {

  return function (abort, cb) {
    if(head !== null) {
      if(abort)
        return read(abort, cb)
      var _head = head
      head = null
      cb(null, _head)
    } else {
      read(abort, cb)
    }
  }

}

//var drainIf = exports.drainIf = function (op, done) {
//  sinks.drain(
//}

var _reduce = exports._reduce = function (read, reduce, initial) {
  return function (close, cb) {
    if(close) return read(close, cb)
    if(ended) return cb(ended)

    sinks.drain(function (item) {
      initial = reduce(initial, item)
    }, function (err, data) {
      ended = err || true
      if(!err) cb(null, initial)
      else     cb(ended)
    })
    (read)
  }
}

var nextTick = process.nextTick

var highWaterMark = exports.highWaterMark = 
function (read, highWaterMark) {
  var buffer = [], waiting = [], ended, reading = false
  highWaterMark = highWaterMark || 10

  function readAhead () {
    while(waiting.length && (buffer.length || ended))
      waiting.shift()(ended, ended ? null : buffer.shift())
  }

  function next () {
    if(ended || reading || buffer.length >= highWaterMark)
      return
    reading = true
    return read(ended, function (end, data) {
      reading = false
      ended = ended || end
      if(data != null) buffer.push(data)
      
      next(); readAhead()
    })
  }

  nextTick(next)

  return function (end, cb) {
    ended = ended || end
    waiting.push(cb)

    next(); readAhead()
  }
}




},{"./sinks":73,"./sources":74,"__browserify_process":4,"pull-core":72}],76:[function(require,module,exports){
/**
  ## flatten

  Flatten an array using `[].reduce`

  <<< examples/flatten.js
  
**/

module.exports = function(a, b) {
  // if a is not already an array, make it one
  a = Array.isArray(a) ? a : [a];

  // concat b with a
  return a.concat(b);
};
},{}],77:[function(require,module,exports){
var crel = require('crel');
var Slide = require('./slide');

module.exports = function(opts) {
  return function(content) {
    var slide;

    // handle things that are already a HTMLElement
    if (content instanceof HTMLElement) {
      slide = new Slide(content);
    }

    // handle content rendering
    if (typeof content == 'string' || (content instanceof String)) {
      slide = new Slide(crel('div', content));
    }

    // create a new slide (if required)
    slide = slide || new Slide();

    // if we have a function, then call the function with the slide as "this"
    if (typeof content == 'function') {
      content.call(slide);
    }
    // if we have an object, then iterate through the keys and call
    // relevant slide functions
    else if (typeof content == 'object') {
      Object.keys(content).forEach(function(key) {
        if (typeof slide[key] == 'function') {
          slide[key](content[key]);
        }
      });
    }

    return slide;
  };
};
},{"./slide":78,"crel":10}],78:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var crel = require('crel');

function Slide(el) {
  if (! (this instanceof Slide)) {
    return new Slide(el);
  }

  // assign or create the element
  this.el = el || crel('div');

  // prepare the element
  this._prep(this.el);
}

util.inherits(Slide, EventEmitter);

module.exports = Slide;
var proto = Slide.prototype;

proto.title = function(value) {
  this.el.appendChild(this.title = crel('h1', value));
};

proto.code = function(value) {
  console.log(value);
};

/* internal methods */

proto._prep = function(el) {
  // add the slide class
  el.classList.add('slide');
};
},{"crel":10,"events":1,"util":3}]},{},[5])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kb2VobG1hbi8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjE4L2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2V2ZW50cy5qcyIsIi9ob21lL2RvZWhsbWFuLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMTgvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvaG9tZS9kb2VobG1hbi8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjE4L2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL3V0aWwuanMiLCIvaG9tZS9kb2VobG1hbi8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjE4L2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvaW5kZXguanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9odG1sLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vaW1nLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vaW5kZXguanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9tYXJrZG93bi5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9jcmVsL2NyZWwuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvZGQvbmV4dC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9mZWF0dXJlL2Nzcy5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvMWMuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2FjdGlvbnNjcmlwdC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYXBhY2hlLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9hcHBsZXNjcmlwdC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYXZyYXNtLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9heGFwdGEuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2Jhc2guanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2JyYWluZnVjay5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY2xvanVyZS5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY21ha2UuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2NvZmZlZXNjcmlwdC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY3BwLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jcy5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY3NzLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kZWxwaGkuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2RpZmYuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2RqYW5nby5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZG9zLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcmxhbmctcmVwbC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXJsYW5nLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9nbHNsLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9nby5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaGFza2VsbC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaGlnaGxpZ2h0LmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9odHRwLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9pbmkuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2phdmEuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2phdmFzY3JpcHQuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2pzb24uanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2xpc3AuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2x1YS5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbWFya2Rvd24uanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL21hdGxhYi5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbWVsLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9uZ2lueC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvb2JqZWN0aXZlYy5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcGFyc2VyMy5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcGVybC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcGhwLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9wcm9maWxlLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9weXRob24uanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3IuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3JpYi5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcnNsLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9ydWJ5LmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9ydXN0LmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zY2FsYS5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc21hbGx0YWxrLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zcWwuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3RleC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvdmFsYS5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvdmJzY3JpcHQuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3ZoZGwuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3htbC5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9pbnNlcnQtY3NzL2luZGV4LmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL21hcmtlZC9saWIvbWFya2VkLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL3B1bGwtc3RyZWFtL2luZGV4LmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL3B1bGwtc3RyZWFtL21heWJlLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL3B1bGwtc3RyZWFtL25vZGVfbW9kdWxlcy9wdWxsLWNvcmUvaW5kZXguanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvcHVsbC1zdHJlYW0vc2lua3MuanMiLCIvaG9tZS9kb2VobG1hbi9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvcHVsbC1zdHJlYW0vc291cmNlcy5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9wdWxsLXN0cmVhbS90aHJvdWdocy5qcyIsIi9ob21lL2RvZWhsbWFuL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy93aGlzay9mbGF0dGVuLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vcmVuZGVyLmpzIiwiL2hvbWUvZG9laGxtYW4vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vc2xpZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpO2lmICghcHJvY2Vzcy5FdmVudEVtaXR0ZXIpIHByb2Nlc3MuRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge307XG5cbnZhciBFdmVudEVtaXR0ZXIgPSBleHBvcnRzLkV2ZW50RW1pdHRlciA9IHByb2Nlc3MuRXZlbnRFbWl0dGVyO1xudmFyIGlzQXJyYXkgPSB0eXBlb2YgQXJyYXkuaXNBcnJheSA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gQXJyYXkuaXNBcnJheVxuICAgIDogZnVuY3Rpb24gKHhzKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nXG4gICAgfVxuO1xuZnVuY3Rpb24gaW5kZXhPZiAoeHMsIHgpIHtcbiAgICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB4cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cbi8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuLy8gaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG4vL1xuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuICB0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzID0gbjtcbn07XG5cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNBcnJheSh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSlcbiAgICB7XG4gICAgICBpZiAoYXJndW1lbnRzWzFdIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgYXJndW1lbnRzWzFdOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5jYXVnaHQsIHVuc3BlY2lmaWVkICdlcnJvcicgZXZlbnQuXCIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGhpcy5fZXZlbnRzKSByZXR1cm4gZmFsc2U7XG4gIHZhciBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBpZiAoIWhhbmRsZXIpIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vLyBFdmVudEVtaXR0ZXIgaXMgZGVmaW5lZCBpbiBzcmMvbm9kZV9ldmVudHMuY2Ncbi8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIGxpc3RlbmVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdhZGRMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT0gXCJuZXdMaXN0ZW5lcnNcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJzXCIuXG4gIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgICB2YXIgbTtcbiAgICAgIGlmICh0aGlzLl9ldmVudHMubWF4TGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbSA9IHRoaXMuX2V2ZW50cy5tYXhMaXN0ZW5lcnM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtID0gZGVmYXVsdE1heExpc3RlbmVycztcbiAgICAgIH1cblxuICAgICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNlbGYub24odHlwZSwgZnVuY3Rpb24gZygpIHtcbiAgICBzZWxmLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH0pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgbGlzdGVuZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG4gIH1cblxuICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkgcmV0dXJuIHRoaXM7XG5cbiAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzQXJyYXkobGlzdCkpIHtcbiAgICB2YXIgaSA9IGluZGV4T2YobGlzdCwgbGlzdGVuZXIpO1xuICAgIGlmIChpIDwgMCkgcmV0dXJuIHRoaXM7XG4gICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID09IDApXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9IGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSA9PT0gbGlzdGVuZXIpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBudWxsO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAoIXRoaXMuX2V2ZW50cykgdGhpcy5fZXZlbnRzID0ge307XG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcbiAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAodHlwZW9mIGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG4iLCIvLyBub3RoaW5nIHRvIHNlZSBoZXJlLi4uIG5vIGZpbGUgbWV0aG9kcyBmb3IgdGhlIGJyb3dzZXJcbiIsInZhciBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmV4cG9ydHMuaXNEYXRlID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJ307XG5leHBvcnRzLmlzUmVnRXhwID0gZnVuY3Rpb24ob2JqKXtyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IFJlZ0V4cF0nfTtcblxuXG5leHBvcnRzLnByaW50ID0gZnVuY3Rpb24gKCkge307XG5leHBvcnRzLnB1dHMgPSBmdW5jdGlvbiAoKSB7fTtcbmV4cG9ydHMuZGVidWcgPSBmdW5jdGlvbigpIHt9O1xuXG5leHBvcnRzLmluc3BlY3QgPSBmdW5jdGlvbihvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMpIHtcbiAgdmFyIHNlZW4gPSBbXTtcblxuICB2YXIgc3R5bGl6ZSA9IGZ1bmN0aW9uKHN0ciwgc3R5bGVUeXBlKSB7XG4gICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG4gICAgdmFyIHN0eWxlcyA9XG4gICAgICAgIHsgJ2JvbGQnIDogWzEsIDIyXSxcbiAgICAgICAgICAnaXRhbGljJyA6IFszLCAyM10sXG4gICAgICAgICAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAgICAgICAgICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICAgICAgICAgJ3doaXRlJyA6IFszNywgMzldLFxuICAgICAgICAgICdncmV5JyA6IFs5MCwgMzldLFxuICAgICAgICAgICdibGFjaycgOiBbMzAsIDM5XSxcbiAgICAgICAgICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgICAgICAgICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgICAgICAgICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICAgICAgICAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICAgICAgICAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgICAgICAgICAneWVsbG93JyA6IFszMywgMzldIH07XG5cbiAgICB2YXIgc3R5bGUgPVxuICAgICAgICB7ICdzcGVjaWFsJzogJ2N5YW4nLFxuICAgICAgICAgICdudW1iZXInOiAnYmx1ZScsXG4gICAgICAgICAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgICAgICAgICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAgICAgICAgICdudWxsJzogJ2JvbGQnLFxuICAgICAgICAgICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAgICAgICAgICdkYXRlJzogJ21hZ2VudGEnLFxuICAgICAgICAgIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICAgICAgICAgJ3JlZ2V4cCc6ICdyZWQnIH1bc3R5bGVUeXBlXTtcblxuICAgIGlmIChzdHlsZSkge1xuICAgICAgcmV0dXJuICdcXHUwMDFiWycgKyBzdHlsZXNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgICAnXFx1MDAxYlsnICsgc3R5bGVzW3N0eWxlXVsxXSArICdtJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gIH07XG4gIGlmICghIGNvbG9ycykge1xuICAgIHN0eWxpemUgPSBmdW5jdGlvbihzdHIsIHN0eWxlVHlwZSkgeyByZXR1cm4gc3RyOyB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0KHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gICAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5pbnNwZWN0ID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgICB2YWx1ZSAhPT0gZXhwb3J0cyAmJlxuICAgICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzKTtcbiAgICB9XG5cbiAgICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuXG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgICAgICByZXR1cm4gc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcblxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuXG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgICB9XG4gICAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xuICAgIH1cblxuICAgIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgICB2YXIgdmlzaWJsZV9rZXlzID0gT2JqZWN0X2tleXModmFsdWUpO1xuICAgIHZhciBrZXlzID0gc2hvd0hpZGRlbiA/IE9iamVjdF9nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKSA6IHZpc2libGVfa2V5cztcblxuICAgIC8vIEZ1bmN0aW9ucyB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYga2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERhdGVzIHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWRcbiAgICBpZiAoaXNEYXRlKHZhbHVlKSAmJiBrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHN0eWxpemUodmFsdWUudG9VVENTdHJpbmcoKSwgJ2RhdGUnKTtcbiAgICB9XG5cbiAgICB2YXIgYmFzZSwgdHlwZSwgYnJhY2VzO1xuICAgIC8vIERldGVybWluZSB0aGUgb2JqZWN0IHR5cGVcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHR5cGUgPSAnQXJyYXknO1xuICAgICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdHlwZSA9ICdPYmplY3QnO1xuICAgICAgYnJhY2VzID0gWyd7JywgJ30nXTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgYmFzZSA9IChpc1JlZ0V4cCh2YWx1ZSkpID8gJyAnICsgdmFsdWUgOiAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYXNlID0gJyc7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIGJhc2UgPSAnICcgKyB2YWx1ZS50b1VUQ1N0cmluZygpO1xuICAgIH1cblxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gICAgfVxuXG4gICAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJycgKyB2YWx1ZSwgJ3JlZ2V4cCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzZWVuLnB1c2godmFsdWUpO1xuXG4gICAgdmFyIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIG5hbWUsIHN0cjtcbiAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKSB7XG4gICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cEdldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICBpZiAodmFsdWUuX19sb29rdXBTZXR0ZXJfXyhrZXkpKSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHIgPSBzdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh2YWx1ZS5fX2xvb2t1cFNldHRlcl9fKGtleSkpIHtcbiAgICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2aXNpYmxlX2tleXMuaW5kZXhPZihrZXkpIDwgMCkge1xuICAgICAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICAgICAgfVxuICAgICAgaWYgKCFzdHIpIHtcbiAgICAgICAgaWYgKHNlZW4uaW5kZXhPZih2YWx1ZVtrZXldKSA8IDApIHtcbiAgICAgICAgICBpZiAocmVjdXJzZVRpbWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICBzdHIgPSBmb3JtYXQodmFsdWVba2V5XSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0ciA9IGZvcm1hdCh2YWx1ZVtrZXldLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9IHN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICh0eXBlID09PSAnQXJyYXknICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9XG4gICAgICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgICAgIG5hbWUgPSBzdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgICAgICBuYW1lID0gc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xuICAgIH0pO1xuXG4gICAgc2Vlbi5wb3AoKTtcblxuICAgIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gICAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgICBudW1MaW5lc0VzdCsrO1xuICAgICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgICAgcmV0dXJuIHByZXYgKyBjdXIubGVuZ3RoICsgMTtcbiAgICB9LCAwKTtcblxuICAgIGlmIChsZW5ndGggPiA1MCkge1xuICAgICAgb3V0cHV0ID0gYnJhY2VzWzBdICtcbiAgICAgICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgYnJhY2VzWzFdO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dCA9IGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9XG4gIHJldHVybiBmb3JtYXQob2JqLCAodHlwZW9mIGRlcHRoID09PSAndW5kZWZpbmVkJyA/IDIgOiBkZXB0aCkpO1xufTtcblxuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKSB8fFxuICAgICAgICAgKHR5cGVvZiBhciA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFyKSA9PT0gJ1tvYmplY3QgQXJyYXldJyk7XG59XG5cblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgdHlwZW9mIHJlID09PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cblxuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gdHlwZW9mIGQgPT09ICdvYmplY3QnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbiAobXNnKSB7fTtcblxuZXhwb3J0cy5wdW1wID0gbnVsbDtcblxudmFyIE9iamVjdF9rZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSByZXMucHVzaChrZXkpO1xuICAgIHJldHVybiByZXM7XG59O1xuXG52YXIgT2JqZWN0X2dldE93blByb3BlcnR5TmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgcmVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn07XG5cbnZhciBPYmplY3RfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAocHJvdG90eXBlLCBwcm9wZXJ0aWVzKSB7XG4gICAgLy8gZnJvbSBlczUtc2hpbVxuICAgIHZhciBvYmplY3Q7XG4gICAgaWYgKHByb3RvdHlwZSA9PT0gbnVsbCkge1xuICAgICAgICBvYmplY3QgPSB7ICdfX3Byb3RvX18nIDogbnVsbCB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgICAgICd0eXBlb2YgcHJvdG90eXBlWycgKyAodHlwZW9mIHByb3RvdHlwZSkgKyAnXSAhPSBcXCdvYmplY3RcXCcnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBUeXBlID0gZnVuY3Rpb24gKCkge307XG4gICAgICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgICAgICBvYmplY3QgPSBuZXcgVHlwZSgpO1xuICAgICAgICBvYmplY3QuX19wcm90b19fID0gcHJvdG90eXBlO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgcHJvcGVydGllcyk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24oY3Rvciwgc3VwZXJDdG9yKSB7XG4gIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yO1xuICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdF9jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xufTtcblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKHR5cGVvZiBmICE9PSAnc3RyaW5nJykge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChleHBvcnRzLmluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOiByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvcih2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pe1xuICAgIGlmICh4ID09PSBudWxsIHx8IHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBleHBvcnRzLmluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuLy8gdmFyIGRlY2sgPSByZXF1aXJlKCdkZWNrZXInKSgpO1xudmFyIHMgPSByZXF1aXJlKCdzaGF6YW0nKTtcblxucygnUHJvdG90eXBpbmcgYXBwcyB3aXRoIEhvb2RpZScsIFtcbiAgcy5tZChcIiMgUHJvdG90eXBpbmcgQXBwbGljYXRpb25zIHdpdGggSG9vZGllXFxuXFxuLS0tXFxuXFxuIyMgV2hhdCBpcyBIb29kaWU/XFxuXFxuW0hvb2RpZV0oaHR0cDovL2hvb2QuaWUpIGlzIGFuIEpTIGFwcGxpY2F0aW9uIGRldmVsb3BtZW50IGFwcHJvYWNoIHdoaWNoIGhhcyBhIGZvY3VzIG9uIG1ha2luZyBhcHBsaWNhdGlvbnMgd2l0aCBvZmZsaW5lIHN5bmNocm9uaXphdGlvbiAqKmp1c3Qgd29yayoqLlxcblxcbi0tLVxcblxcbiMjIFdoeSBVc2UgKG9yIGV2ZW4gbG9vayBhdCkgSG9vZGllP1xcblxcbjEuIEJlY2F1c2UgdGhleSBhcmUgZm9jdXNlZCBvbiBzb2x2aW5nIGhhcmQgcHJvYmxlbXMgKGRhdGEgc3luYykgc3RyYWlnaHQgdXAsIHJhdGhlciB0aGFuIGdpdmluZyB5b3UgZmxhc2h5IHRoaW5ncyB0byBkaXN0cmFjdCB5b3UuXFxuXFxuMi4gTGV2ZXJhZ2VzIENvdWNoREIgZm9yIHN0dWZmIGl0J3MgcmVhbGx5IGdvb2QgYXQuXFxuXFxuMy4gVGhlcmUncyBzb21lIHJlYWxseSBzbWFydCwgZXhwZXJpZW5jZWQgcGVvcGxlIHdvcmtpbmcgb24gaXQuXFxuXFxuLS0tXFxuXFxuIyMgSG9vZGllIENvcmUgQ29uY2VwdHNcXG5cXG4tIFVzZXIgQWNjb3VudHMgYW5kIEF1dGhlbnRpY2F0aW9uXFxuLSBHZW5lcmljIERvY3VtZW50IFN0b3JlXFxuLSBUYXNrc1xcbi0gQnVzLWxpa2UgZXZlbnRpbmcgKG5vdCBhcyBnb29kIGFzIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpLCBidXQgZ29vZClcXG5cXG4tLS1cXG5cXG4jIyBHZXR0aW5nIHlvdXIgSG9vZGllIG9uXFxuXFxuYGBganNcXG52YXIgaG9vZGllID0gbmV3IEhvb2RpZSgpO1xcbmBgYFxcblxcblRoaXMgdHJhbnNwYXJlbnRseSBjcmVhdGVzIGEgY29ubmVjdGlvbiB0byB0aGUgaG9vZGllIGFwaSBydW5uaW5nIG9uIHRoZSBsb2NhbCBtYWNoaW5lIGluIHRoZSBiYWNrZ3JvdW5kLiAgQXMgeW91IHdvdWxkIGV4cGVjdCwgeW91IGNhbiBvdmVycmlkZSB0aGUgZGVmYXVsdCBlbmRwb2ludC5cXG5cXG4tLS1cXG5cXG4jIyBBdXRoZW50aWNhdGlvblxcblxcbmBgYGpzXFxuaG9vZGllLmFjY291bnQuc2lnbkluKCdtZUB0ZXN0LmNvbScsICdzdXBlcnNlY3JldHBhc3MnKTtcXG5gYGBcXG5cXG5GdW5jdGlvbnMgbGlrZSB0aGUgYHNpZ25JbmAgZnVuY3Rpb24gYWJvdmUgcmV0dXJuIGEgcHJvbWlzZS4gIFdoaWxlIG5vdCBteSBwZXJzb25hbCBwcmVmZXJlbmNlLCBpdCBkb2VzIG1ha2UgZm9yIGEgdmVyeSBjbGVhbiBsb29raW5nIEFQSS5cXG5cXG5gYGBqc1xcbmhvb2RpZS5hY2NvdW50LnNpZ25JbignbWVAdGVzdC5jb20nLCAnc2VjcmV0JykudGhlbihmdW5jdGlvbigpIHtcXG5cXHRjb25zb2xlLmxvZyhob29kaWUuYWNjb3VudC51c2VybmFtZSk7XFxufSk7XFxuYGBgXFxuXFxuLS0tXFxuXFxuIyMgR2VuZXJpYyBEb2N1bWVudCBTdG9yZVxcblxcblRoaXMgaXMgdmVyeSBuaWNlbHkgZG9uZSwgYW5kIG1ha2VzIGV4Y2VsbGVudCB1c2Ugb2YgQ291Y2ggYXMgYSBkb2N1bWVudCBzdG9yZS5cXG5cXG5gYGBqc1xcbmhvb2RpZS5zdG9yZS5hZGQoJ2N1c3RvbWVyJywgeyBuYW1lOiAnQm9iJyB9KTtcXG5gYGBcXG5cXG5EYXRhIGlzIGFkZGVkIHRvIGEgX3VzZXIgc3BlY2lmaWMgZGF0YWJhc2VfIGluIHRoZSBjb3VjaCBiYWNrZW5kIGlmIG9ubGluZS4gIEhlY2ssIHlvdSBjYW4gZXZlbiB1c2UgXFxcImZ1dG9uXFxcIiAoQ291Y2hEQidzIGFkbWluIGludGVyZmFjZSkgdG8gbG9vayBhdCB5b3VyIGRhdGE6XFxuXFxuaHR0cDovLzEyNy4wLjAuMTo2MDAxL19hcGkvX3V0aWxzXFxuXFxuLS0tXFxuXFxuIyMgRXhhbXBsZTogQ2FwdHVyZSBHZW8gVHJhY2tzXFxuXFxuU28gdHJhY2tpbmcgYSBnZW8gdHJhY2sgY291bGQgYmUgYXMgc2ltcGxlIGFzOlxcblxcbmBgYGpzXFxubmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24oZnVuY3Rpb24ocG9zKSB7XFxuXFx0aG9vZGllLnN0b3JlLmFkZCgncG9zJywgcG9zLmNvb3Jkcyk7XFxufSk7XFxuYGBgXFxuXFxuV2hpY2ggaXMgcHJldHR5IGF3ZXNvbWUuICBIZXJlJ3Mgd2hhdCB0aGUgZGF0YSBsb29rcyBsaWtlIGluIGNvdWNoOlxcblxcbmBgYGpzb25cXG57XFxuICAgXFxcIl9pZFxcXCI6IFxcXCJwb3MvMzMyMjIzMVxcXCIsXFxuICAgXFxcIl9yZXZcXFwiOiBcXFwiMS0xMjEwMjIxMjFcXFwiLFxcbiAgIFxcXCJzcGVlZFxcXCI6IG51bGwsXFxuICAgXFxcImhlYWRpbmdcXFwiOiBudWxsLFxcbiAgIFxcXCJhbHRpdHVkZUFjY3VyYWN5XFxcIjogbnVsbCxcXG4gICBcXFwiYWNjdXJhY3lcXFwiOiAxODAwMCxcXG4gICBcXFwiYWx0aXR1ZGVcXFwiOiBudWxsLFxcbiAgIFxcXCJsb25naXR1ZGVcXFwiOiAxNTEuMjA2OTksXFxuICAgXFxcImxhdGl0dWRlXFxcIjogLTMzLjg2NzQ4NyxcXG4gICBcXFwiY3JlYXRlZEJ5XFxcIjogXFxcIjIxMjIyMjJcXFwiLFxcbiAgIFxcXCJ1cGRhdGVkQXRcXFwiOiBcXFwiMjAxMy0xMC0yM1QwMzozMTowNy4wNTlaXFxcIixcXG4gICBcXFwiY3JlYXRlZEF0XFxcIjogXFxcIjIwMTMtMTAtMjNUMDM6MzE6MDcuMDU5WlxcXCIsXFxuICAgXFxcInR5cGVcXFwiOiBcXFwicG9zXFxcIlxcbn1cXG5gYGBcXG5cXG4tLS1cXG5cXG4jIyBIb29kaWUgRXZlbnRpbmdcXG5cXG5Ib29kaWUgdXNlcyBhIHB1YnN1YiBldmVudGluZyBtb2RlbCB3aGljaCBhbGxvd3MgZm9yIHdvbmRlcmZ1bCBkZWNvdXBsaW5nIGF0IHRoZSBVSSBsYXllci5cXG5cXG5IYW5kbGluZyBhY2NvdW50IHNpZ24taW46XFxuXFxuYGBganNcXG5ob29kaWUuYWNjb3VudC5vbignc2lnbmluJywgZnVuY3Rpb24oKSB7XFxufSk7XFxuYGBgXFxuXFxuT3Igd2hlbiBhIG5ldyBwb3NpdGlvbiBpcyBhZGRlZDpcXG5cXG5gYGBqc1xcbmhvb2RpZS5zdG9yZS5vbignYWRkOnBvcycsIGZ1bmN0aW9uKHBvcykge1xcblxcdC8vIEkgY291bGQgZG8gbmlmdHkgZ2VvZmVuY2luZyBzdHVmZiBoZXJlIDopXFxufSk7XFxuYGBgXFxuXFxuLS0tXFxuXFxuIyMgT2ZmbGluZSArIERhdGEgU3luY2hyb25pemF0aW9uXFxuXFxuQWxsIGRhdGEgaXMgc3RvcmVkIGluIGBsb2NhbFN0b3JhZ2VgIChjaGVjayB5b3VyIHdlYiBpbnNwZWN0b3IpIGFuZCB3aGVuIG9ubGluZSBhdXRvbWF0aWNhbGx5IHN5bmNocm9uaXplZCB3aXRoIHNlcnZlci4gIElmIHlvdSB3YW50IHRvIGtub3cgd2hlbiBzeW5jaHJvbml6YXRpb24gaXMgaGFwcGVuaW5nLCB0aGVuIHlvdSBjYW4gdXNlIGV2ZW50cy5cXG5cXG5Zb3UgY291bGQgbW9uaXRvciB5b3VyIG1vdmVtZW50cyBvbiBhIGRlc2t0b3AgZGlzcGxheVxcblxcbmBgYGpzXFxuaG9vZGllLnJlbW90ZS5vbignYWRkOnBvcycsIGZ1bmN0aW9uIChwb3MpIHtcXG5cXHQvLyB1cGRhdGUgeW91ciBjdXJyZW50IHBvc2l0aW9uIG9uIHlvdXIgbWFwXFxufSk7XFxuYGBgXFxuLS0tXFxuXFxuIyMgUHJvcyAvIENvbnNcXG5cXG4tICoqUFJPKio6IFRhY2tsaW5nIG9mZmxpbmUgc3luYyBoZWFkIG9uIGlzIGdyZWF0Llxcbi0gKipQUk8qKjogR2V0dGluZyBzdGFydGVkIGZsZXNoaW5nIG91dCB5b3VyIGFwcCBpcyByZWFsbHkgc2ltcGxlLlxcbi0gKipDT04/Kio6IEJ1aWx0IG9uIGpRdWVyeSAoYXQgdGhlIG1vbWVudClcXG4tICoqQ09OPyoqOiBGZWVscyBhIGJpdCBmcmFtZXdvcmt5IGZvciBteSB0YXN0ZXMuXFxuLSBCZSBhd2FyZSB0aGF0IHN0b3JhZ2UgaW1wbGVtZW50YXRpb24gaXMgcHJldHR5IGNsb3NlbHkgdGllZCB0byBbQ291Y2hEQl0oaHR0cDovL2NvdWNoZGIuYXBhY2hlLm9yZykgYXQgdGhlIG1vbWVudC4gIEkgKipsb3ZlKiogQ291Y2ggc28gSSBkb24ndCBjb25zaWRlciB0aGlzIGEgcHJvYmxlbSwgYnV0IHlvdSBzaG91bGQgYmUgYXdhcmUuLi5cXG5cXG4tLS1cXG5cXG4jIyBDbG9zaW5nIFRob3VnaHRzXFxuXFxuVGhleSBoYXZlIGEgZG9nIHdlYXJpbmcgYSBob29kaWUgLSB5b3Ugc2hvdWxkIGF0IGxlYXN0IHRha2UgYSBsb29rLlxcblxcbkl0J3MgZ3JlYXQgdG8gc2VlIHNvbWVvbmUgbWFrZSBhIHNlcmlvdXMgZ28gb2YgdW5sb2NraW5nIHRoZSBwb3RlbnRpYWwgb2YgQ291Y2hEQiArIHNpbmdsZSBwYWdlIGFwcHMuXCIpXG5dKTtcblxuLy8gZGVjay5jc3MoZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvbm9kZV9tb2R1bGVzL2RlY2tlci90aGVtZXMvYmFzaWMuY3NzJykpO1xuLy8gZGVjay5jc3MoZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvbm9kZV9tb2R1bGVzL2RlY2tlci90aGVtZXMvY29kZS9kZWZhdWx0LmNzcycpKTtcbi8vIGRlY2suYWRkKGZzLnJlYWRGaWxlU3luYygnLi9SRUFETUUubWQnKSk7XG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRlY2sucmVuZGVyKCkpO1xuIiwidmFyIGNyZWwgPSByZXF1aXJlKCdjcmVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaHRtbCkge1xuICB2YXIgZWwgPSBjcmVsKCdkaXYnLCB7IGNsYXNzOiAnc2xpZGUnIH0pO1xuXG4gIC8vIHNldCB0aGUgaW5uZXIgaHRtbFxuICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICByZXR1cm4gZWw7XG59OyIsInZhciBjcmVsID0gcmVxdWlyZSgnY3JlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCkge1xuICB2YXIgZWwgPSBjcmVsKCdkaXYnKTtcblxuICAvLyBjcmVhdGUgYW4gaW1hZ2UgdG8gdHJpZ2dlciBsb2FkaW5nXG4gIHZhciBpbWcgPSBjcmVsKCdpbWcnLCB7XG4gICAgc3JjOiB1cmxcbiAgfSk7XG5cbiAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnbG9hZGVkOiAnICsgdXJsKTtcbiAgfSk7XG5cbiAgLy8gc2V0IHRoZSBpbWFnZSBhcyB0aGUgYmFja2dyb3VuZCBpbWFnZSBmb3IgdGhlIGVsZW1lbnRcbiAgZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcXCcnICsgdXJsICsgJ1xcJyknO1xuXG4gIHJldHVybiBlbDtcbn07IiwidmFyIF9fZGlybmFtZT1cIi9ub2RlX21vZHVsZXMvc2hhemFtXCI7LyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGdsb2JhbCBkb2N1bWVudDogZmFsc2UgKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbi8vIHZhciBiZWRhenpsZSA9IHJlcXVpcmUoJ2JlZGF6emxlJyk7XG52YXIgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcbnZhciBpbnNlcnRDc3MgPSByZXF1aXJlKCdpbnNlcnQtY3NzJyk7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZSgnZmVhdHVyZS9jc3MnKSgndHJhbnNmb3JtJyk7XG52YXIgZmxhdHRlbiA9IHJlcXVpcmUoJ3doaXNrL2ZsYXR0ZW4nKTtcbnZhciBrZXlkb3duID0gcmVxdWlyZSgnZGQvbmV4dCcpKCdrZXlkb3duJywgZG9jdW1lbnQpO1xudmFyIHB1bGwgPSByZXF1aXJlKCdwdWxsLXN0cmVhbScpO1xudmFyIHJlbmRlciA9IHJlcXVpcmUoJy4vcmVuZGVyJyk7XG52YXIgY3VycmVudDtcbnZhciBzbGlkZTtcblxuLy8gdHJhbnNmb3JtIGZ1bmN0aW9uc1xudmFyIGFjdGl2YXRlID0gcHVzaCgwKTtcbnZhciBwdXNoUmlnaHQgPSBwdXNoKCcxMDAlJyk7XG52YXIgcHVzaExlZnQgPSBwdXNoKCctMTAwJScpO1xudmFyIHdvb2JsZSA9IFwiYWxlcnQoJ2hlbGxvJyk7XCI7XG5cbi8vIGNyZWF0ZSBhIGtleSBkaXJlY3Rpb25zIGhhc2hcbnZhciBrZXlEaXJlY3Rpb25zID0ge1xuICAzNzogJ2JhY2snLFxuICAzODogJ2JhY2snLFxuICAzOTogJ25leHQnLFxuICA0MDogJ25leHQnXG59O1xuXG5pbnNlcnRDc3MoXCJodG1sLCBib2R5IHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4uc2xpZGUge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgcGFkZGluZzogNSU7XFxuICB3aWR0aDogOTAlO1xcbiAgaGVpZ2h0OiA5MCU7XFxuICB0cmFuc2l0aW9uOiBhbGwgZWFzZS1pbi1vdXQgMC41cztcXG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XFxufVxcblxcbi5zbGlkZSB7XFxuICBmb250LWZhbWlseTogSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjtcXG4gIGZvbnQtc2l6ZTogMS40ZW07XFxuICBsaW5lLWhlaWdodDogMS42ZW07XFxufVxcblxcbi5zbGlkZSBoMSB7XFxuICBmb250LXNpemU6IDEuNmVtO1xcbiAgbWFyZ2luOiAwO1xcbiAgdGV4dC1zaGFkb3c6IDAgMXB4IDJweCAjZThlOGU4O1xcbn1cXG5cXG4uc2xpZGUgaDE6bGFzdC1jaGlsZCB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBwYWRkaW5nLXRvcDogNDAlO1xcbn1cXG5cXG4uc2xpZGUgaDIsIC5zbGlkZSBoMywgLnNsaWRlICBoNCB7XFxuICBtYXJnaW4tdG9wOiAwcHg7XFxuICB0ZXh0LXNoYWRvdzogMCAxcHggMnB4ICNlOGU4ZTg7XFxufVxcblxcbi5zbGlkZSBwcmUge1xcbiAgbGluZS1oZWlnaHQ6IDEuNGVtO1xcbn1cXG5cIik7XG5pbnNlcnRDc3MoXCIvKlxcblxcbk9yaWdpbmFsIHN0eWxlIGZyb20gc29mdHdhcmVtYW5pYWNzLm9yZyAoYykgSXZhbiBTYWdhbGFldiA8TWFuaWFjQFNvZnR3YXJlTWFuaWFjcy5Pcmc+XFxuXFxuKi9cXG5cXG5wcmUgY29kZSB7XFxuICBkaXNwbGF5OiBibG9jazsgcGFkZGluZzogMC41ZW07XFxuICBiYWNrZ3JvdW5kOiAjRjBGMEYwO1xcbn1cXG5cXG5wcmUgY29kZSxcXG5wcmUgLnN1YnN0LFxcbnByZSAudGFnIC50aXRsZSxcXG5wcmUgLmxpc3AgLnRpdGxlLFxcbnByZSAuY2xvanVyZSAuYnVpbHRfaW4sXFxucHJlIC5uZ2lueCAudGl0bGUge1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG5wcmUgLnN0cmluZyxcXG5wcmUgLnRpdGxlLFxcbnByZSAuY29uc3RhbnQsXFxucHJlIC5wYXJlbnQsXFxucHJlIC50YWcgLnZhbHVlLFxcbnByZSAucnVsZXMgLnZhbHVlLFxcbnByZSAucnVsZXMgLnZhbHVlIC5udW1iZXIsXFxucHJlIC5wcmVwcm9jZXNzb3IsXFxucHJlIC5oYW1sIC5zeW1ib2wsXFxucHJlIC5ydWJ5IC5zeW1ib2wsXFxucHJlIC5ydWJ5IC5zeW1ib2wgLnN0cmluZyxcXG5wcmUgLmFnZ3JlZ2F0ZSxcXG5wcmUgLnRlbXBsYXRlX3RhZyxcXG5wcmUgLmRqYW5nbyAudmFyaWFibGUsXFxucHJlIC5zbWFsbHRhbGsgLmNsYXNzLFxcbnByZSAuYWRkaXRpb24sXFxucHJlIC5mbG93LFxcbnByZSAuc3RyZWFtLFxcbnByZSAuYmFzaCAudmFyaWFibGUsXFxucHJlIC5hcGFjaGUgLnRhZyxcXG5wcmUgLmFwYWNoZSAuY2JyYWNrZXQsXFxucHJlIC50ZXggLmNvbW1hbmQsXFxucHJlIC50ZXggLnNwZWNpYWwsXFxucHJlIC5lcmxhbmdfcmVwbCAuZnVuY3Rpb25fb3JfYXRvbSxcXG5wcmUgLmFzY2lpZG9jIC5oZWFkZXIsXFxucHJlIC5tYXJrZG93biAuaGVhZGVyLFxcbnByZSAuY29mZmVlc2NyaXB0IC5hdHRyaWJ1dGUge1xcbiAgY29sb3I6ICM4MDA7XFxufVxcblxcbnByZSAuY29tbWVudCxcXG5wcmUgLmFubm90YXRpb24sXFxucHJlIC50ZW1wbGF0ZV9jb21tZW50LFxcbnByZSAuZGlmZiAuaGVhZGVyLFxcbnByZSAuY2h1bmssXFxucHJlIC5hc2NpaWRvYyAuYmxvY2txdW90ZSxcXG5wcmUgLm1hcmtkb3duIC5ibG9ja3F1b3RlIHtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5wcmUgLm51bWJlcixcXG5wcmUgLmRhdGUsXFxucHJlIC5yZWdleHAsXFxucHJlIC5saXRlcmFsLFxcbnByZSAuaGV4Y29sb3IsXFxucHJlIC5zbWFsbHRhbGsgLnN5bWJvbCxcXG5wcmUgLnNtYWxsdGFsayAuY2hhcixcXG5wcmUgLmdvIC5jb25zdGFudCxcXG5wcmUgLmNoYW5nZSxcXG5wcmUgLmxhc3NvIC52YXJpYWJsZSxcXG5wcmUgLmFzY2lpZG9jIC5idWxsZXQsXFxucHJlIC5tYXJrZG93biAuYnVsbGV0LFxcbnByZSAuYXNjaWlkb2MgLmxpbmtfdXJsLFxcbnByZSAubWFya2Rvd24gLmxpbmtfdXJsIHtcXG4gIGNvbG9yOiAjMDgwO1xcbn1cXG5cXG5wcmUgLmxhYmVsLFxcbnByZSAuamF2YWRvYyxcXG5wcmUgLnJ1YnkgLnN0cmluZyxcXG5wcmUgLmRlY29yYXRvcixcXG5wcmUgLmZpbHRlciAuYXJndW1lbnQsXFxucHJlIC5sb2NhbHZhcnMsXFxucHJlIC5hcnJheSxcXG5wcmUgLmF0dHJfc2VsZWN0b3IsXFxucHJlIC5pbXBvcnRhbnQsXFxucHJlIC5wc2V1ZG8sXFxucHJlIC5waSxcXG5wcmUgLmhhbWwgLmJ1bGxldCxcXG5wcmUgLmRvY3R5cGUsXFxucHJlIC5kZWxldGlvbixcXG5wcmUgLmVudnZhcixcXG5wcmUgLnNoZWJhbmcsXFxucHJlIC5hcGFjaGUgLnNxYnJhY2tldCxcXG5wcmUgLm5naW54IC5idWlsdF9pbixcXG5wcmUgLnRleCAuZm9ybXVsYSxcXG5wcmUgLmVybGFuZ19yZXBsIC5yZXNlcnZlZCxcXG5wcmUgLnByb21wdCxcXG5wcmUgLmFzY2lpZG9jIC5saW5rX2xhYmVsLFxcbnByZSAubWFya2Rvd24gLmxpbmtfbGFiZWwsXFxucHJlIC52aGRsIC5hdHRyaWJ1dGUsXFxucHJlIC5jbG9qdXJlIC5hdHRyaWJ1dGUsXFxucHJlIC5hc2NpaWRvYyAuYXR0cmlidXRlLFxcbnByZSAubGFzc28gLmF0dHJpYnV0ZSxcXG5wcmUgLmNvZmZlZXNjcmlwdCAucHJvcGVydHkge1xcbiAgY29sb3I6ICM4OEZcXG59XFxuXFxucHJlIC5rZXl3b3JkLFxcbnByZSAuaWQsXFxucHJlIC50aXRsZSxcXG5wcmUgLmJ1aWx0X2luLFxcbnByZSAuYWdncmVnYXRlLFxcbnByZSAuY3NzIC50YWcsXFxucHJlIC5qYXZhZG9jdGFnLFxcbnByZSAucGhwZG9jLFxcbnByZSAueWFyZG9jdGFnLFxcbnByZSAuc21hbGx0YWxrIC5jbGFzcyxcXG5wcmUgLndpbnV0aWxzLFxcbnByZSAuYmFzaCAudmFyaWFibGUsXFxucHJlIC5hcGFjaGUgLnRhZyxcXG5wcmUgLmdvIC50eXBlbmFtZSxcXG5wcmUgLnRleCAuY29tbWFuZCxcXG5wcmUgLmFzY2lpZG9jIC5zdHJvbmcsXFxucHJlIC5tYXJrZG93biAuc3Ryb25nLFxcbnByZSAucmVxdWVzdCxcXG5wcmUgLnN0YXR1cyB7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxucHJlIC5hc2NpaWRvYyAuZW1waGFzaXMsXFxucHJlIC5tYXJrZG93biAuZW1waGFzaXMge1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbn1cXG5cXG5wcmUgLm5naW54IC5idWlsdF9pbiB7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbn1cXG5cXG5wcmUgLmNvZmZlZXNjcmlwdCAuamF2YXNjcmlwdCxcXG5wcmUgLmphdmFzY3JpcHQgLnhtbCxcXG5wcmUgLmxhc3NvIC5tYXJrdXAsXFxucHJlIC50ZXggLmZvcm11bGEsXFxucHJlIC54bWwgLmphdmFzY3JpcHQsXFxucHJlIC54bWwgLnZic2NyaXB0LFxcbnByZSAueG1sIC5jc3MsXFxucHJlIC54bWwgLmNkYXRhIHtcXG4gIG9wYWNpdHk6IDAuNTtcXG59XCIpO1xuXG4vKipcbiAgIyBzaGF6YW1cblxuICBTaGF6YW0gaXMgYSBzaW1wbGUgY29kZSBkcml2ZW4gcHJlc2VudGF0aW9uIHN5c3RlbS5cblxuICAjIyBFeGFtcGxlIFVzYWdlXG5cbiAgPDw8IGV4YW1wbGVzL3dlbGNvbWUuanNcbioqL1xuXG52YXIgc2hhemFtID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0aXRsZSwgb3B0cywgZGVjaykge1xuICB2YXIgc2xpZGVzID0gW107XG4gIHZhciBzbGlkZUlkeCA9IDA7XG5cbiAgdmFyIGtleUFjdGlvbnMgPSB7XG4gICAgMzc6IHByZXZpb3VzU2xpZGUsXG4gICAgMzg6IHByZXZpb3VzU2xpZGUsXG4gICAgMzk6IG5leHRTbGlkZSxcbiAgICA0MDogbmV4dFNsaWRlXG4gIH07XG5cbiAgZnVuY3Rpb24gbmV4dFNsaWRlKCkge1xuICAgIGlmIChzbGlkZUlkeCA8IHNsaWRlcy5sZW5ndGggLSAxKSB7XG4gICAgICBzbGlkZUlkeCArPSAxO1xuXG4gICAgICBwdXNoTGVmdChzbGlkZXNbc2xpZGVJZHggLSAxXSk7XG4gICAgICBhY3RpdmF0ZShzbGlkZXNbc2xpZGVJZHhdKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcmV2aW91c1NsaWRlKCkge1xuICAgIGlmIChzbGlkZUlkeCA+IDApIHtcbiAgICAgIHNsaWRlSWR4IC09IDE7XG5cbiAgICAgIHB1c2hSaWdodChzbGlkZXNbc2xpZGVJZHggKyAxXSk7XG4gICAgICBhY3RpdmF0ZShzbGlkZXNbc2xpZGVJZHhdKTtcbiAgICB9XG4gIH1cblxuICAvLyBpZiB3ZSBkb24ndCBoYXZlIHRyYW5zZm9ybXMgc3BpdCB0aGUgZHVtbXlcbiAgaWYgKCEgdHJhbnNmb3JtKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCduZWVkIGNzcyB0cmFuc2Zvcm1zJyk7XG4gIH1cblxuICAvLyBjaGVjayBmb3Igbm8gb3B0c1xuICBpZiAoQXJyYXkuaXNBcnJheShvcHRzKSkge1xuICAgIGRlY2sgPSBvcHRzO1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIC8vIGluaXRpYWxpc2UgdGhlIGJhc2VwYXRoXG4gIG9wdHMuYmFzZXBhdGggPSBvcHRzLmJhc2VwYXRoIHx8ICcnO1xuXG4gIGNvbnNvbGUubG9nKF9fZGlybmFtZSk7XG5cbiAgLy8gY3JlYXRlIHRoZSBzbGlkZXNcbiAgc2xpZGVzID0gZGVjay5yZWR1Y2UoZmxhdHRlbilcblxuICAgIC8vIGNyZWF0ZSB0aGUgc2xpZGVzIGJhc2VkIGluIGlucHV0XG4gICAgLm1hcChyZW5kZXIob3B0cykpXG4gICAgLy8gcHVzaCByaWdodFxuICAgIC5tYXAocHVzaFJpZ2h0KVxuICAgIC8vIGFwcGVuZCB0byB0aGUgYm9keVxuICAgIC5tYXAoYXBwZW5kKTtcblxuICAvLyBzZXQgb3V0IHRpdGxlIGJhc2VkIG9uIHRoZSB0aXRsZSBwcm92aWRlZFxuICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuXG4gIC8vIGhhbmRsZSBrZXlzXG4gIHB1bGwoXG4gICAgcHVsbC5Tb3VyY2Uoa2V5ZG93biksXG4gICAgcHVsbC5tYXAoZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gZXZ0LmtleUNvZGU7XG4gICAgfSksXG4gICAgcHVsbC5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4ga2V5QWN0aW9uc1trZXldO1xuICAgIH0pLFxuICAgIHB1bGwuZHJhaW4oZnVuY3Rpb24oa2V5KSB7XG4gICAgICBrZXlBY3Rpb25zW2tleV0oKTtcbiAgICB9KVxuICApO1xuXG4gIC8vIGRpc3BsYXkgdGhlIGluaXRpYWwgc2xpZGVcbiAgaWYgKHNsaWRlcy5sZW5ndGggPiAwKSB7XG4gICAgYWN0aXZhdGUoc2xpZGVzW3NsaWRlSWR4XSk7XG4gIH1cbn07XG5cbi8qIHNpbXBsZSBpbmxpbmUgcGx1Z2lucyAqL1xuXG5zaGF6YW0uaW1nID0gcmVxdWlyZSgnLi9pbWcnKTtcbnNoYXphbS5tYXJrZG93biA9IHNoYXphbS5tZCA9IHJlcXVpcmUoJy4vbWFya2Rvd24nKTtcbnNoYXphbS5odG1sID0gcmVxdWlyZSgnLi9odG1sJyk7XG5cbi8qIGludGVybmFsIGZ1bmN0aW9ucyAqL1xuXG5mdW5jdGlvbiBwdXNoKHBvc2l0aW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbihzbGlkZSkge1xuICAgIHRyYW5zZm9ybShzbGlkZS5lbCwgJ3RyYW5zbGF0ZVgoJyArIHBvc2l0aW9uICsgJykgdHJhbnNsYXRlWigwKScpO1xuICAgIHJldHVybiBzbGlkZTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXBwZW5kKHNsaWRlKSB7XG4gIC8vIGFkZCB0byB0aGUgZG9jdW1lbnRcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzbGlkZS5lbCk7XG5cbiAgLy8gcmV0dXJuIHRoZSBzbGlkZVxuICByZXR1cm4gc2xpZGU7XG59IiwidmFyIG1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL2h0bWwnKTtcbnZhciBobGpzID0gcmVxdWlyZSgnaGlnaGxpZ2h0LmpzJyk7XG52YXIgaGxqc0xhbmdNYXBwaW5ncyA9IHtcbiAganM6ICdqYXZhc2NyaXB0J1xufTtcblxudmFyIHJlU2xpZGVCcmVhayA9IC9cXG5cXHI/XFwtezIsfS9tO1xudmFyIHJlTGVhZGluZ0FuZFRyYWlsaW5nU3BhY2VzID0gL15cXHMqKC4qKVxccyokL207XG5cbi8qIGluaXRpYWxpc2UgbWFya2VkICovXG5cbm1hcmtlZC5zZXRPcHRpb25zKHtcbiAgaGlnaGxpZ2h0OiBmdW5jdGlvbihjb2RlLCBsYW5nKSB7XG4gICAgbGFuZyA9IGhsanNMYW5nTWFwcGluZ3NbbGFuZ10gfHwgbGFuZztcblxuICAgIC8vIGlmIHRoaXMgaXMgYSBrbm93biBobGpzIGxhbmd1YWdlIHRoZW4gaGlnaGxpZ2h0XG4gICAgaWYgKGhsanMuTEFOR1VBR0VTW2xhbmddKSB7XG4gICAgICByZXR1cm4gaGxqcy5oaWdobGlnaHQobGFuZywgY29kZSkudmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcmV0dXJuIGNvZGU7XG4gICAgfVxuICB9XG59KTtcblxudmFyIG1hcmtkb3duID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtZCkge1xuICAvLyBpZiB3ZSBoYXZlIG11bHRpcGxlIHNsaWRlcywgc3BsaXQgYW5kIG1hcFxuICBpZiAocmVTbGlkZUJyZWFrLnRlc3QobWQpKSB7XG4gICAgcmV0dXJuIG1kLnNwbGl0KHJlU2xpZGVCcmVhaykubWFwKG1hcmtkb3duKTtcbiAgfVxuXG4gIHJldHVybiBodG1sKG1hcmtlZChtZC5yZXBsYWNlKHJlTGVhZGluZ0FuZFRyYWlsaW5nU3BhY2VzLCAnJDEnKSkpO1xufSIsIi8vQ29weXJpZ2h0IChDKSAyMDEyIEtvcnkgTnVublxyXG5cclxuLy9QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuLy9UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbi8vVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcblxyXG4vKlxyXG5cclxuICAgIFRoaXMgY29kZSBpcyBub3QgZm9ybWF0dGVkIGZvciByZWFkYWJpbGl0eSwgYnV0IHJhdGhlciBydW4tc3BlZWQgYW5kIHRvIGFzc2lzdCBjb21waWxlcnMuXHJcblxyXG4gICAgSG93ZXZlciwgdGhlIGNvZGUncyBpbnRlbnRpb24gc2hvdWxkIGJlIHRyYW5zcGFyZW50LlxyXG5cclxuICAgICoqKiBJRSBTVVBQT1JUICoqKlxyXG5cclxuICAgIElmIHlvdSByZXF1aXJlIHRoaXMgbGlicmFyeSB0byB3b3JrIGluIElFNywgYWRkIHRoZSBmb2xsb3dpbmcgYWZ0ZXIgZGVjbGFyaW5nIGNyZWwuXHJcblxyXG4gICAgdmFyIHRlc3REaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICB0ZXN0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG5cclxuICAgIHRlc3REaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhJyk7XHJcbiAgICB0ZXN0RGl2WydjbGFzc05hbWUnXSAhPT0gJ2EnID8gY3JlbC5hdHRyTWFwWydjbGFzcyddID0gJ2NsYXNzTmFtZSc6dW5kZWZpbmVkO1xyXG4gICAgdGVzdERpdi5zZXRBdHRyaWJ1dGUoJ25hbWUnLCdhJyk7XHJcbiAgICB0ZXN0RGl2WyduYW1lJ10gIT09ICdhJyA/IGNyZWwuYXR0ck1hcFsnbmFtZSddID0gZnVuY3Rpb24oZWxlbWVudCwgdmFsdWUpe1xyXG4gICAgICAgIGVsZW1lbnQuaWQgPSB2YWx1ZTtcclxuICAgIH06dW5kZWZpbmVkO1xyXG5cclxuXHJcbiAgICB0ZXN0TGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCAnYScpO1xyXG4gICAgdGVzdExhYmVsWydodG1sRm9yJ10gIT09ICdhJyA/IGNyZWwuYXR0ck1hcFsnZm9yJ10gPSAnaHRtbEZvcic6dW5kZWZpbmVkO1xyXG5cclxuXHJcblxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm9vdC5jcmVsID0gZmFjdG9yeSgpO1xyXG4gICAgfVxyXG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzg0Mjg2L2phdmFzY3JpcHQtaXNkb20taG93LWRvLXlvdS1jaGVjay1pZi1hLWphdmFzY3JpcHQtb2JqZWN0LWlzLWEtZG9tLW9iamVjdFxyXG4gICAgdmFyIGlzTm9kZSA9IHR5cGVvZiBOb2RlID09PSAnb2JqZWN0J1xyXG4gICAgICAgID8gZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgTm9kZTsgfVxyXG4gICAgICAgIDogZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgICAgICAgICAgICAgJiYgdHlwZW9mIG9iamVjdC5ub2RlVHlwZSA9PT0gJ251bWJlcidcclxuICAgICAgICAgICAgICAgICYmIHR5cGVvZiBvYmplY3Qubm9kZU5hbWUgPT09ICdzdHJpbmcnO1xyXG4gICAgICAgIH07XHJcbiAgICB2YXIgaXNBcnJheSA9IGZ1bmN0aW9uKGEpeyByZXR1cm4gYSBpbnN0YW5jZW9mIEFycmF5OyB9O1xyXG4gICAgdmFyIGFwcGVuZENoaWxkID0gZnVuY3Rpb24oZWxlbWVudCwgY2hpbGQpIHtcclxuICAgICAgaWYoIWlzTm9kZShjaGlsZCkpe1xyXG4gICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGlsZCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjcmVsKCl7XHJcbiAgICAgICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxyXG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzLCAvL05vdGU6IGFzc2lnbmVkIHRvIGEgdmFyaWFibGUgdG8gYXNzaXN0IGNvbXBpbGVycy4gU2F2ZXMgYWJvdXQgNDAgYnl0ZXMgaW4gY2xvc3VyZSBjb21waWxlci4gSGFzIG5lZ2xpZ2FibGUgZWZmZWN0IG9uIHBlcmZvcm1hbmNlLlxyXG4gICAgICAgICAgICBlbGVtZW50ID0gYXJnc1swXSxcclxuICAgICAgICAgICAgY2hpbGQsXHJcbiAgICAgICAgICAgIHNldHRpbmdzID0gYXJnc1sxXSxcclxuICAgICAgICAgICAgY2hpbGRJbmRleCA9IDIsXHJcbiAgICAgICAgICAgIGFyZ3VtZW50c0xlbmd0aCA9IGFyZ3MubGVuZ3RoLFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVNYXAgPSBjcmVsLmF0dHJNYXA7XHJcblxyXG4gICAgICAgIGVsZW1lbnQgPSBpc05vZGUoZWxlbWVudCkgPyBlbGVtZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICAvLyBzaG9ydGN1dFxyXG4gICAgICAgIGlmKGFyZ3VtZW50c0xlbmd0aCA9PT0gMSl7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHNldHRpbmdzICE9PSAnb2JqZWN0JyB8fCBpc05vZGUoc2V0dGluZ3MpIHx8IGlzQXJyYXkoc2V0dGluZ3MpKSB7XHJcbiAgICAgICAgICAgIC0tY2hpbGRJbmRleDtcclxuICAgICAgICAgICAgc2V0dGluZ3MgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2hvcnRjdXQgaWYgdGhlcmUgaXMgb25seSBvbmUgY2hpbGQgdGhhdCBpcyBhIHN0cmluZ1xyXG4gICAgICAgIGlmKChhcmd1bWVudHNMZW5ndGggLSBjaGlsZEluZGV4KSA9PT0gMSAmJiB0eXBlb2YgYXJnc1tjaGlsZEluZGV4XSA9PT0gJ3N0cmluZycgJiYgZWxlbWVudC50ZXh0Q29udGVudCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGFyZ3NbY2hpbGRJbmRleF07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGZvcig7IGNoaWxkSW5kZXggPCBhcmd1bWVudHNMZW5ndGg7ICsrY2hpbGRJbmRleCl7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGFyZ3NbY2hpbGRJbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoY2hpbGQgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkoY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaSA8IGNoaWxkLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXBwZW5kQ2hpbGQoZWxlbWVudCwgY2hpbGRbaV0pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBhcHBlbmRDaGlsZChlbGVtZW50LCBjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIHNldHRpbmdzKXtcclxuICAgICAgICAgICAgaWYoIWF0dHJpYnV0ZU1hcFtrZXldKXtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgc2V0dGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0dHIgPSBjcmVsLmF0dHJNYXBba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBhdHRyID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICAgICAgICAgICAgICBhdHRyKGVsZW1lbnQsIHNldHRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0ciwgc2V0dGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVzZWQgZm9yIG1hcHBpbmcgb25lIGtpbmQgb2YgYXR0cmlidXRlIHRvIHRoZSBzdXBwb3J0ZWQgdmVyc2lvbiBvZiB0aGF0IGluIGJhZCBicm93c2Vycy5cclxuICAgIC8vIFN0cmluZyByZWZlcmVuY2VkIHNvIHRoYXQgY29tcGlsZXJzIG1haW50YWluIHRoZSBwcm9wZXJ0eSBuYW1lLlxyXG4gICAgY3JlbFsnYXR0ck1hcCddID0ge307XHJcblxyXG4gICAgLy8gU3RyaW5nIHJlZmVyZW5jZWQgc28gdGhhdCBjb21waWxlcnMgbWFpbnRhaW4gdGhlIHByb3BlcnR5IG5hbWUuXHJcbiAgICBjcmVsW1wiaXNOb2RlXCJdID0gaXNOb2RlO1xyXG5cclxuICAgIHJldHVybiBjcmVsO1xyXG59KSk7XHJcbiIsIi8qIGpzaGludCBub2RlOiB0cnVlICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICAjIyMgbmV4dFxuXG4gIGBgYFxuICBmKG5hbWUsIGVsKSA9PiBmblxuICBgYGBcblxuICBUaGUgYG5leHRgIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcHVsbCBldmVudCBkYXRhIGZyb20gYGVsYCBmb3IgdGhlIGV2ZW50XG4gIG5hbWVkIGBuYW1lYC4gIFRoaXMgY2FuIGJlIHVzZWZ1bCB3aGVuIGNvbWJpbmVkIHdpdGggYVxuICBbcHVsbC1zdHJlYW1dKGh0dHBzOi8vZ2l0aHViLmNvbS9kb21pbmljdGFyci9wdWxsLXN0cmVhbSkgdG8gY2FwdHVyZVxuICBhIHN0cmVhbSBvZiBldmVudHMgZnJvbSBhIERPTSBlbGVtZW50cy5cblxuICA8PDwgZXhhbXBsZXMvbmV4dC5qc1xuKiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUsIGVsKSB7XG4gIHZhciBidWZmZXIgPSBbXTtcbiAgdmFyIHF1ZXVlZCA9IFtdO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUV2ZW50KGV2dCkge1xuICAgIHF1ZXVlZC5sZW5ndGggPyBxdWV1ZWQuc2hpZnQoKShudWxsLCBldnQpIDogYnVmZmVyW2J1ZmZlci5sZW5ndGhdID0gZXZ0O1xuICB9XG5cbiAgLy8gYWRkIHRoZSBldmVudCBsaXN0ZW5lciB0byB0aGUgb2JqZWN0XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlRXZlbnQpO1xuXG4gIHJldHVybiBmdW5jdGlvbihlbmQsIGNiKSB7XG4gICAgLy8gaGFuZGxlIHRoZSBub24gcHVsbC1zdHJlYW0gY2FzZSBvZiBhIHNpbmdsZSBhcmd1bWVudFxuICAgIGlmICh0eXBlb2YgZW5kID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNiID0gZW5kO1xuICAgICAgZW5kID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaWYgd2UgYXJlIGVuZGluZyB0aGUgc3RyZWFtLCB0aGVuIHJlbW92ZSB0aGUgbGlzdGVuZXJcbiAgICBpZiAoZW5kKSB7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGhhbmRsZUV2ZW50KTtcbiAgICAgIHJldHVybiBjYiA/IGNiKGVuZCkgOiBudWxsO1xuICAgIH1cblxuICAgIGlmIChidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGNiKG51bGwsIGJ1ZmZlci5zaGlmdCgpKTtcbiAgICB9XG5cbiAgICAvLyBvdGhlcndpc2UsIHNhdmUgdGhlIGNiXG4gICAgcXVldWVkW3F1ZXVlZC5sZW5ndGhdID0gY2I7XG4gIH07XG59O1xuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGdsb2JhbCB3aW5kb3c6IGZhbHNlICovXG4vKiBnbG9iYWwgZG9jdW1lbnQ6IGZhbHNlICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIGxpc3QgcHJlZml4ZXMgYW5kIGNhc2UgdHJhbnNmb3Jtc1xuLy8gKHJldmVyc2Ugb3JkZXIgYXMgYSBkZWNyZW1lbnRpbmcgZm9yIGxvb3AgaXMgdXNlZClcbnZhciBwcmVmaXhlcyA9IFtcbiAgJ21zJyxcbiAgJ21zJywgLy8gaW50ZW50aW9uYWw6IDJuZCBlbnRyeSBmb3IgbXMgYXMgd2Ugd2lsbCBhbHNvIHRyeSBQYXNjYWwgY2FzZSBmb3IgTVNcbiAgJ08nLFxuICAnTW96JyxcbiAgJ1dlYmtpdCcsXG4gICcnXG5dO1xuXG52YXIgY2FzZVRyYW5zZm9ybXMgPSBbXG4gIHRvQ2FtZWxDYXNlLFxuICBudWxsLFxuICBudWxsLFxuICB0b0NhbWVsQ2FzZSxcbiAgbnVsbCxcbiAgdG9DYW1lbENhc2Vcbl07XG5cbnZhciBwcm9wcyA9IHt9O1xudmFyIHN0eWxlO1xuXG4vKipcbiMjIGNzcyhwcm9wKVxuXG5UZXN0IGZvciB0aGUgcHJlc2NlbmNlIG9mIHRoZSBzcGVjaWZpZWQgQ1NTIHByb3BlcnR5IChpbiBhbGwgaXQncyBcbnBvc3NpYmxlIGJyb3dzZXIgcHJlZml4ZWQgdmFyaWFudHMpXG4qKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocHJvcCkge1xuICB2YXIgaWk7XG4gIHZhciBwcm9wTmFtZTtcbiAgdmFyIHBhc2NhbENhc2VOYW1lO1xuXG4gIHN0eWxlID0gc3R5bGUgfHwgZG9jdW1lbnQuYm9keS5zdHlsZTtcblxuICAvLyBpZiB3ZSBhbHJlYWR5IGhhdmUgYSB2YWx1ZSBmb3IgdGhlIHRhcmdldCBwcm9wZXJ0eSwgcmV0dXJuXG4gIGlmIChwcm9wc1twcm9wXSB8fCBzdHlsZVtwcm9wXSkge1xuICAgIHJldHVybiBwcm9wc1twcm9wXTtcbiAgfVxuXG4gIC8vIGNvbnZlcnQgYSBkYXNoIGRlbGltaXRlZCBwcm9wZXJ0eW5hbWUgKGUuZy4gYm94LXNoYWRvdykgaW50byBcbiAgLy8gcGFzY2FsIGNhc2VkIG5hbWUgKGUuZy4gQm94U2hhZG93KVxuICBwYXNjYWxDYXNlTmFtZSA9IHByb3Auc3BsaXQoJy0nKS5yZWR1Y2UoZnVuY3Rpb24obWVtbywgdmFsKSB7XG4gICAgcmV0dXJuIG1lbW8gKyB2YWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB2YWwuc2xpY2UoMSk7XG4gIH0sICcnKTtcblxuICAvLyBjaGVjayBmb3IgdGhlIHByb3BlcnR5XG4gIGZvciAoaWkgPSBwcmVmaXhlcy5sZW5ndGg7IGlpLS07ICkge1xuICAgIHByb3BOYW1lID0gcHJlZml4ZXNbaWldICsgKGNhc2VUcmFuc2Zvcm1zW2lpXSA/XG4gICAgICAgICAgICAgICAgICBjYXNlVHJhbnNmb3Jtc1tpaV0ocGFzY2FsQ2FzZU5hbWUpIDpcbiAgICAgICAgICAgICAgICAgIHBhc2NhbENhc2VOYW1lKTtcblxuICAgIGlmICh0eXBlb2Ygc3R5bGVbcHJvcE5hbWVdICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICBwcm9wc1twcm9wXSA9IGNyZWF0ZUdldHRlclNldHRlcihwcm9wTmFtZSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgXG4gIHJldHVybiBwcm9wc1twcm9wXTtcbn07XG5cbi8qIGludGVybmFsIGhlbHBlciBmdW5jdGlvbnMgKi9cblxuZnVuY3Rpb24gY3JlYXRlR2V0dGVyU2V0dGVyKHByb3BOYW1lKSB7XG4gIHJldHVybiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSkge1xuICAgIC8vIGlmIHdlIGhhdmUgYSB2YWx1ZSB1cGRhdGUgXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgZWxlbWVudC5zdHlsZVtwcm9wTmFtZV0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudClbcHJvcE5hbWVdO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0b0NhbWVsQ2FzZShpbnB1dCkge1xuICByZXR1cm4gaW5wdXQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBpbnB1dC5zbGljZSgxKTtcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpe1xuICB2YXIgSURFTlRfUkVfUlUgPSAnW2EtekEtWtCwLdGP0JAt0K9dW2EtekEtWjAtOV/QsC3Rj9CQLdCvXSonO1xuICB2YXIgT25lU19LRVlXT1JEUyA9ICfQstC+0LfQstGA0LDRgiDQtNCw0YLQsCDQtNC70Y8g0LXRgdC70Lgg0Lgg0LjQu9C4INC40L3QsNGH0LUg0LjQvdCw0YfQtdC10YHQu9C4INC40YHQutC70Y7Rh9C10L3QuNC1INC60L7QvdC10YbQtdGB0LvQuCAnICtcbiAgICAn0LrQvtC90LXRhtC/0L7Qv9GL0YLQutC4INC60L7QvdC10YbQv9GA0L7RhtC10LTRg9GA0Ysg0LrQvtC90LXRhtGE0YPQvdC60YbQuNC4INC60L7QvdC10YbRhtC40LrQu9CwINC60L7QvdGB0YLQsNC90YLQsCDQvdC1INC/0LXRgNC10LnRgtC4INC/0LXRgNC10LwgJyArXG4gICAgJ9C/0LXRgNC10YfQuNGB0LvQtdC90LjQtSDQv9C+INC/0L7QutCwINC/0L7Qv9GL0YLQutCwINC/0YDQtdGA0LLQsNGC0Ywg0L/RgNC+0LTQvtC70LbQuNGC0Ywg0L/RgNC+0YbQtdC00YPRgNCwINGB0YLRgNC+0LrQsCDRgtC+0LPQtNCwINGE0YEg0YTRg9C90LrRhtC40Y8g0YbQuNC60LsgJyArXG4gICAgJ9GH0LjRgdC70L4g0Y3QutGB0L/QvtGA0YInO1xuICB2YXIgT25lU19CVUlMVF9JTiA9ICdhbnNpdG9vZW0gb2VtdG9hbnNpINCy0LLQtdGB0YLQuNCy0LjQtNGB0YPQsdC60L7QvdGC0L4g0LLQstC10YHRgtC40LTQsNGC0YMg0LLQstC10YHRgtC40LfQvdCw0YfQtdC90LjQtSAnICtcbiAgICAn0LLQstC10YHRgtC40L/QtdGA0LXRh9C40YHQu9C10L3QuNC1INCy0LLQtdGB0YLQuNC/0LXRgNC40L7QtCDQstCy0LXRgdGC0LjQv9C70LDQvdGB0YfQtdGC0L7QsiDQstCy0LXRgdGC0LjRgdGC0YDQvtC60YMg0LLQstC10YHRgtC40YfQuNGB0LvQviDQstC+0L/RgNC+0YEgJyArXG4gICAgJ9Cy0L7RgdGB0YLQsNC90L7QstC40YLRjNC30L3QsNGH0LXQvdC40LUg0LLRgNC10LMg0LLRi9Cx0YDQsNC90L3Ri9C50L/Qu9Cw0L3RgdGH0LXRgtC+0LIg0LLRi9C30LLQsNGC0YzQuNGB0LrQu9GO0YfQtdC90LjQtSDQtNCw0YLQsNCz0L7QtCDQtNCw0YLQsNC80LXRgdGP0YYgJyArXG4gICAgJ9C00LDRgtCw0YfQuNGB0LvQviDQtNC+0LHQsNCy0LjRgtGM0LzQtdGB0Y/RhiDQt9Cw0LLQtdGA0YjQuNGC0YzRgNCw0LHQvtGC0YPRgdC40YHRgtC10LzRiyDQt9Cw0LPQvtC70L7QstC+0LrRgdC40YHRgtC10LzRiyDQt9Cw0L/QuNGB0YzQttGD0YDQvdCw0LvQsNGA0LXQs9C40YHRgtGA0LDRhtC40LggJyArXG4gICAgJ9C30LDQv9GD0YHRgtC40YLRjNC/0YDQuNC70L7QttC10L3QuNC1INC30LDRhNC40LrRgdC40YDQvtCy0LDRgtGM0YLRgNCw0L3Qt9Cw0LrRhtC40Y4g0LfQvdCw0YfQtdC90LjQtdCy0YHRgtGA0L7QutGDINC30L3QsNGH0LXQvdC40LXQstGB0YLRgNC+0LrRg9Cy0L3Rg9GC0YAgJyArXG4gICAgJ9C30L3QsNGH0LXQvdC40LXQstGE0LDQudC7INC30L3QsNGH0LXQvdC40LXQuNC30YHRgtGA0L7QutC4INC30L3QsNGH0LXQvdC40LXQuNC30YHRgtGA0L7QutC40LLQvdGD0YLRgCDQt9C90LDRh9C10L3QuNC10LjQt9GE0LDQudC70LAg0LjQvNGP0LrQvtC80L/RjNGO0YLQtdGA0LAgJyArXG4gICAgJ9C40LzRj9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQutCw0YLQsNC70L7Qs9Cy0YDQtdC80LXQvdC90YvRhdGE0LDQudC70L7QsiDQutCw0YLQsNC70L7Qs9C40LEg0LrQsNGC0LDQu9C+0LPQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0LrQsNGC0LDQu9C+0LPQv9GA0L7Qs9GA0LDQvNC80YsgJyArXG4gICAgJ9C60L7QtNGB0LjQvNCyINC60L7QvNCw0L3QtNCw0YHQuNGB0YLQtdC80Ysg0LrQvtC90LPQvtC00LAg0LrQvtC90LXRhtC/0LXRgNC40L7QtNCw0LHQuCDQutC+0L3QtdGG0YDQsNGB0YHRh9C40YLQsNC90L3QvtCz0L7Qv9C10YDQuNC+0LTQsNCx0LggJyArXG4gICAgJ9C60L7QvdC10YbRgdGC0LDQvdC00LDRgNGC0L3QvtCz0L7QuNC90YLQtdGA0LLQsNC70LAg0LrQvtC90LrQstCw0YDRgtCw0LvQsCDQutC+0L3QvNC10YHRj9GG0LAg0LrQvtC90L3QtdC00LXQu9C4INC70LXQsiDQu9C+0LMg0LvQvtCzMTAg0LzQsNC60YEgJyArXG4gICAgJ9C80LDQutGB0LjQvNCw0LvRjNC90L7QtdC60L7Qu9C40YfQtdGB0YLQstC+0YHRg9Cx0LrQvtC90YLQviDQvNC40L0g0LzQvtC90L7Qv9C+0LvRjNC90YvQudGA0LXQttC40Lwg0L3QsNC30LLQsNC90LjQtdC40L3RgtC10YDRhNC10LnRgdCwINC90LDQt9Cy0LDQvdC40LXQvdCw0LHQvtGA0LDQv9GA0LDQsiAnICtcbiAgICAn0L3QsNC30L3QsNGH0LjRgtGM0LLQuNC0INC90LDQt9C90LDRh9C40YLRjNGB0YfQtdGCINC90LDQudGC0Lgg0L3QsNC50YLQuNC/0L7QvNC10YfQtdC90L3Ri9C10L3QsNGD0LTQsNC70LXQvdC40LUg0L3QsNC50YLQuNGB0YHRi9C70LrQuCDQvdCw0YfQsNC70L7Qv9C10YDQuNC+0LTQsNCx0LggJyArXG4gICAgJ9C90LDRh9Cw0LvQvtGB0YLQsNC90LTQsNGA0YLQvdC+0LPQvtC40L3RgtC10YDQstCw0LvQsCDQvdCw0YfQsNGC0YzRgtGA0LDQvdC30LDQutGG0LjRjiDQvdCw0YfQs9C+0LTQsCDQvdCw0YfQutCy0LDRgNGC0LDQu9CwINC90LDRh9C80LXRgdGP0YbQsCDQvdCw0YfQvdC10LTQtdC70LggJyArXG4gICAgJ9C90L7QvNC10YDQtNC90Y/Qs9C+0LTQsCDQvdC+0LzQtdGA0LTQvdGP0L3QtdC00LXQu9C4INC90L7QvNC10YDQvdC10LTQtdC70LjQs9C+0LTQsCDQvdGA0LXQsyDQvtCx0YDQsNCx0L7RgtC60LDQvtC20LjQtNCw0L3QuNGPINC+0LrRgCDQvtC/0LjRgdCw0L3QuNC10L7RiNC40LHQutC4ICcgK1xuICAgICfQvtGB0L3QvtCy0L3QvtC50LbRg9GA0L3QsNC70YDQsNGB0YfQtdGC0L7QsiDQvtGB0L3QvtCy0L3QvtC50L/Qu9Cw0L3RgdGH0LXRgtC+0LIg0L7RgdC90L7QstC90L7QudGP0LfRi9C6INC+0YLQutGA0YvRgtGM0YTQvtGA0LzRgyDQvtGC0LrRgNGL0YLRjNGE0L7RgNC80YPQvNC+0LTQsNC70YzQvdC+ICcgK1xuICAgICfQvtGC0LzQtdC90LjRgtGM0YLRgNCw0L3Qt9Cw0LrRhtC40Y4g0L7Rh9C40YHRgtC40YLRjNC+0LrQvdC+0YHQvtC+0LHRidC10L3QuNC5INC/0LXRgNC40L7QtNGB0YLRgCDQv9C+0LvQvdC+0LXQuNC80Y/Qv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0L/QvtC70YPRh9C40YLRjNCy0YDQtdC80Y/RgtCwICcgK1xuICAgICfQv9C+0LvRg9GH0LjRgtGM0LTQsNGC0YPRgtCwINC/0L7Qu9GD0YfQuNGC0YzQtNC+0LrRg9C80LXQvdGC0YLQsCDQv9C+0LvRg9GH0LjRgtGM0LfQvdCw0YfQtdC90LjRj9C+0YLQsdC+0YDQsCDQv9C+0LvRg9GH0LjRgtGM0L/QvtC30LjRhtC40Y7RgtCwICcgK1xuICAgICfQv9C+0LvRg9GH0LjRgtGM0L/Rg9GB0YLQvtC10LfQvdCw0YfQtdC90LjQtSDQv9C+0LvRg9GH0LjRgtGM0YLQsCDQv9GA0LDQsiDQv9GA0LDQstC+0LTQvtGB0YLRg9C/0LAg0L/RgNC10LTRg9C/0YDQtdC20LTQtdC90LjQtSDQv9GA0LXRhNC40LrRgdCw0LLRgtC+0L3Rg9C80LXRgNCw0YbQuNC4ICcgK1xuICAgICfQv9GD0YHRgtCw0Y/RgdGC0YDQvtC60LAg0L/Rg9GB0YLQvtC10LfQvdCw0YfQtdC90LjQtSDRgNCw0LHQvtGH0LDRj9C00LDRgtGC0YzQv9GD0YHRgtC+0LXQt9C90LDRh9C10L3QuNC1INGA0LDQsdC+0YfQsNGP0LTQsNGC0LAg0YDQsNC30LTQtdC70LjRgtC10LvRjNGB0YLRgNCw0L3QuNGGICcgK1xuICAgICfRgNCw0LfQtNC10LvQuNGC0LXQu9GM0YHRgtGA0L7QuiDRgNCw0LfQvCDRgNCw0LfQvtCx0YDQsNGC0YzQv9C+0LfQuNGG0LjRjtC00L7QutGD0LzQtdC90YLQsCDRgNCw0YHRgdGH0LjRgtCw0YLRjNGA0LXQs9C40YHRgtGA0YvQvdCwICcgK1xuICAgICfRgNCw0YHRgdGH0LjRgtCw0YLRjNGA0LXQs9C40YHRgtGA0YvQv9C+INGB0LjQs9C90LDQuyDRgdC40LzQsiDRgdC40LzQstC+0LvRgtCw0LHRg9C70Y/RhtC40Lgg0YHQvtC30LTQsNGC0YzQvtCx0YrQtdC60YIg0YHQvtC60YDQuyDRgdC+0LrRgNC70L8g0YHQvtC60YDQvyAnICtcbiAgICAn0YHQvtC+0LHRidC40YLRjCDRgdC+0YHRgtC+0Y/QvdC40LUg0YHQvtGF0YDQsNC90LjRgtGM0LfQvdCw0YfQtdC90LjQtSDRgdGA0LXQtCDRgdGC0LDRgtGD0YHQstC+0LfQstGA0LDRgtCwINGB0YLRgNC00LvQuNC90LAg0YHRgtGA0LfQsNC80LXQvdC40YLRjCAnICtcbiAgICAn0YHRgtGA0LrQvtC70LjRh9C10YHRgtCy0L7RgdGC0YDQvtC6INGB0YLRgNC/0L7Qu9GD0YfQuNGC0YzRgdGC0YDQvtC60YMgINGB0YLRgNGH0LjRgdC70L7QstGF0L7QttC00LXQvdC40Lkg0YHRhNC+0YDQvNC40YDQvtCy0LDRgtGM0L/QvtC30LjRhtC40Y7QtNC+0LrRg9C80LXQvdGC0LAgJyArXG4gICAgJ9GB0YfQtdGC0L/QvtC60L7QtNGDINGC0LXQutGD0YnQsNGP0LTQsNGC0LAg0YLQtdC60YPRidC10LXQstGA0LXQvNGPINGC0LjQv9C30L3QsNGH0LXQvdC40Y8g0YLQuNC/0LfQvdCw0YfQtdC90LjRj9GB0YLRgCDRg9C00LDQu9C40YLRjNC+0LHRitC10LrRgtGLICcgK1xuICAgICfRg9GB0YLQsNC90L7QstC40YLRjNGC0LDQvdCwINGD0YHRgtCw0L3QvtCy0LjRgtGM0YLQsNC/0L4g0YTQuNC60YHRiNCw0LHQu9C+0L0g0YTQvtGA0LzQsNGCINGG0LXQuyDRiNCw0LHQu9C+0L0nO1xuICB2YXIgRFFVT1RFID0gIHtjbGFzc05hbWU6ICdkcXVvdGUnLCAgYmVnaW46ICdcIlwiJ307XG4gIHZhciBTVFJfU1RBUlQgPSB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wifCQnLFxuICAgICAgY29udGFpbnM6IFtEUVVPVEVdLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfTtcbiAgdmFyIFNUUl9DT05UID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXFxcfCcsIGVuZDogJ1wifCQnLFxuICAgIGNvbnRhaW5zOiBbRFFVT1RFXVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBsZXhlbXM6IElERU5UX1JFX1JVLFxuICAgIGtleXdvcmRzOiB7a2V5d29yZDogT25lU19LRVlXT1JEUywgYnVpbHRfaW46IE9uZVNfQlVJTFRfSU59LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgU1RSX1NUQVJULCBTVFJfQ09OVCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogJyjQv9GA0L7RhtC10LTRg9GA0LB80YTRg9C90LrRhtC40Y8pJywgZW5kOiAnJCcsXG4gICAgICAgIGxleGVtczogSURFTlRfUkVfUlUsXG4gICAgICAgIGtleXdvcmRzOiAn0L/RgNC+0YbQtdC00YPRgNCwINGE0YPQvdC60YbQuNGPJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogSURFTlRfUkVfUlV9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RhaWwnLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgICAgIGxleGVtczogSURFTlRfUkVfUlUsXG4gICAgICAgICAgICAgICAga2V5d29yZHM6ICfQt9C90LDRhycsXG4gICAgICAgICAgICAgICAgY29udGFpbnM6IFtTVFJfU1RBUlQsIFNUUl9DT05UXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnZXhwb3J0JyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ9GN0LrRgdC/0L7RgNGCJywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbGV4ZW1zOiBJREVOVF9SRV9SVSxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogJ9GN0LrRgdC/0L7RgNGCJyxcbiAgICAgICAgICAgICAgICBjb250YWluczogW2hsanMuQ19MSU5FX0NPTU1FTlRfTU9ERV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7Y2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJywgYmVnaW46ICcjJywgZW5kOiAnJCd9LFxuICAgICAge2NsYXNzTmFtZTogJ2RhdGUnLCBiZWdpbjogJ1xcJ1xcXFxkezJ9XFxcXC5cXFxcZHsyfVxcXFwuKFxcXFxkezJ9fFxcXFxkezR9KVxcJyd9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIElERU5UX1JFID0gJ1thLXpBLVpfJF1bYS16QS1aMC05XyRdKic7XG4gIHZhciBJREVOVF9GVU5DX1JFVFVSTl9UWVBFX1JFID0gJyhbKl18W2EtekEtWl8kXVthLXpBLVowLTlfJF0qKSc7XG5cbiAgdmFyIEFTM19SRVNUX0FSR19NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3Jlc3RfYXJnJyxcbiAgICBiZWdpbjogJ1suXXszfScsIGVuZDogSURFTlRfUkUsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuICB2YXIgVElUTEVfTU9ERSA9IHtjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBJREVOVF9SRX07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogJ2FzIGJyZWFrIGNhc2UgY2F0Y2ggY2xhc3MgY29uc3QgY29udGludWUgZGVmYXVsdCBkZWxldGUgZG8gZHluYW1pYyBlYWNoICcgK1xuICAgICAgICAnZWxzZSBleHRlbmRzIGZpbmFsIGZpbmFsbHkgZm9yIGZ1bmN0aW9uIGdldCBpZiBpbXBsZW1lbnRzIGltcG9ydCBpbiBpbmNsdWRlICcgK1xuICAgICAgICAnaW5zdGFuY2VvZiBpbnRlcmZhY2UgaW50ZXJuYWwgaXMgbmFtZXNwYWNlIG5hdGl2ZSBuZXcgb3ZlcnJpZGUgcGFja2FnZSBwcml2YXRlICcgK1xuICAgICAgICAncHJvdGVjdGVkIHB1YmxpYyByZXR1cm4gc2V0IHN0YXRpYyBzdXBlciBzd2l0Y2ggdGhpcyB0aHJvdyB0cnkgdHlwZW9mIHVzZSB2YXIgdm9pZCAnICtcbiAgICAgICAgJ3doaWxlIHdpdGgnLFxuICAgICAgbGl0ZXJhbDogJ3RydWUgZmFsc2UgbnVsbCB1bmRlZmluZWQnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhY2thZ2UnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdwYWNrYWdlJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRV9NT0RFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcyBpbnRlcmZhY2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cydcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRJVExFX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnOycsXG4gICAgICAgIGtleXdvcmRzOiAnaW1wb3J0IGluY2x1ZGUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ1t7O10nLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxTJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBUSVRMRV9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgIEFTM19SRVNUX0FSR19NT0RFXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnOicsXG4gICAgICAgICAgICBlbmQ6IElERU5UX0ZVTkNfUkVUVVJOX1RZUEVfUkUsXG4gICAgICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIE5VTUJFUiA9IHtjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJ1tcXFxcJCVdXFxcXGQrJ307XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogJ2FjY2VwdGZpbHRlciBhY2NlcHRtdXRleCBhY2NlcHRwYXRoaW5mbyBhY2Nlc3NmaWxlbmFtZSBhY3Rpb24gYWRkYWx0ICcgK1xuICAgICAgICAnYWRkYWx0YnllbmNvZGluZyBhZGRhbHRieXR5cGUgYWRkY2hhcnNldCBhZGRkZWZhdWx0Y2hhcnNldCBhZGRkZXNjcmlwdGlvbiAnICtcbiAgICAgICAgJ2FkZGVuY29kaW5nIGFkZGhhbmRsZXIgYWRkaWNvbiBhZGRpY29uYnllbmNvZGluZyBhZGRpY29uYnl0eXBlIGFkZGlucHV0ZmlsdGVyICcgK1xuICAgICAgICAnYWRkbGFuZ3VhZ2UgYWRkbW9kdWxlaW5mbyBhZGRvdXRwdXRmaWx0ZXIgYWRkb3V0cHV0ZmlsdGVyYnl0eXBlIGFkZHR5cGUgYWxpYXMgJyArXG4gICAgICAgICdhbGlhc21hdGNoIGFsbG93IGFsbG93Y29ubmVjdCBhbGxvd2VuY29kZWRzbGFzaGVzIGFsbG93b3ZlcnJpZGUgYW5vbnltb3VzICcgK1xuICAgICAgICAnYW5vbnltb3VzX2xvZ2VtYWlsIGFub255bW91c19tdXN0Z2l2ZWVtYWlsIGFub255bW91c19ub3VzZXJpZCBhbm9ueW1vdXNfdmVyaWZ5ZW1haWwgJyArXG4gICAgICAgICdhdXRoYmFzaWNhdXRob3JpdGF0aXZlIGF1dGhiYXNpY3Byb3ZpZGVyIGF1dGhkYmR1c2VycHdxdWVyeSBhdXRoZGJkdXNlcnJlYWxtcXVlcnkgJyArXG4gICAgICAgICdhdXRoZGJtZ3JvdXBmaWxlIGF1dGhkYm10eXBlIGF1dGhkYm11c2VyZmlsZSBhdXRoZGVmYXVsdGF1dGhvcml0YXRpdmUgJyArXG4gICAgICAgICdhdXRoZGlnZXN0YWxnb3JpdGhtIGF1dGhkaWdlc3Rkb21haW4gYXV0aGRpZ2VzdG5jY2hlY2sgYXV0aGRpZ2VzdG5vbmNlZm9ybWF0ICcgK1xuICAgICAgICAnYXV0aGRpZ2VzdG5vbmNlbGlmZXRpbWUgYXV0aGRpZ2VzdHByb3ZpZGVyIGF1dGhkaWdlc3Rxb3AgYXV0aGRpZ2VzdHNobWVtc2l6ZSAnICtcbiAgICAgICAgJ2F1dGhncm91cGZpbGUgYXV0aGxkYXBiaW5kZG4gYXV0aGxkYXBiaW5kcGFzc3dvcmQgYXV0aGxkYXBjaGFyc2V0Y29uZmlnICcgK1xuICAgICAgICAnYXV0aGxkYXBjb21wYXJlZG5vbnNlcnZlciBhdXRobGRhcGRlcmVmZXJlbmNlYWxpYXNlcyBhdXRobGRhcGdyb3VwYXR0cmlidXRlICcgK1xuICAgICAgICAnYXV0aGxkYXBncm91cGF0dHJpYnV0ZWlzZG4gYXV0aGxkYXByZW1vdGV1c2VyYXR0cmlidXRlIGF1dGhsZGFwcmVtb3RldXNlcmlzZG4gJyArXG4gICAgICAgICdhdXRobGRhcHVybCBhdXRobmFtZSBhdXRobnByb3ZpZGVyYWxpYXMgYXV0aHR5cGUgYXV0aHVzZXJmaWxlIGF1dGh6ZGJtYXV0aG9yaXRhdGl2ZSAnICtcbiAgICAgICAgJ2F1dGh6ZGJtdHlwZSBhdXRoemRlZmF1bHRhdXRob3JpdGF0aXZlIGF1dGh6Z3JvdXBmaWxlYXV0aG9yaXRhdGl2ZSAnICtcbiAgICAgICAgJ2F1dGh6bGRhcGF1dGhvcml0YXRpdmUgYXV0aHpvd25lcmF1dGhvcml0YXRpdmUgYXV0aHp1c2VyYXV0aG9yaXRhdGl2ZSAnICtcbiAgICAgICAgJ2JhbGFuY2VybWVtYmVyIGJyb3dzZXJtYXRjaCBicm93c2VybWF0Y2hub2Nhc2UgYnVmZmVyZWRsb2dzIGNhY2hlZGVmYXVsdGV4cGlyZSAnICtcbiAgICAgICAgJ2NhY2hlZGlybGVuZ3RoIGNhY2hlZGlybGV2ZWxzIGNhY2hlZGlzYWJsZSBjYWNoZWVuYWJsZSBjYWNoZWZpbGUgJyArXG4gICAgICAgICdjYWNoZWlnbm9yZWNhY2hlY29udHJvbCBjYWNoZWlnbm9yZWhlYWRlcnMgY2FjaGVpZ25vcmVub2xhc3Rtb2QgJyArXG4gICAgICAgICdjYWNoZWlnbm9yZXF1ZXJ5c3RyaW5nIGNhY2hlbGFzdG1vZGlmaWVkZmFjdG9yIGNhY2hlbWF4ZXhwaXJlIGNhY2hlbWF4ZmlsZXNpemUgJyArXG4gICAgICAgICdjYWNoZW1pbmZpbGVzaXplIGNhY2hlbmVnb3RpYXRlZGRvY3MgY2FjaGVyb290IGNhY2hlc3RvcmVub3N0b3JlIGNhY2hlc3RvcmVwcml2YXRlICcgK1xuICAgICAgICAnY2dpbWFwZXh0ZW5zaW9uIGNoYXJzZXRkZWZhdWx0IGNoYXJzZXRvcHRpb25zIGNoYXJzZXRzb3VyY2VlbmMgY2hlY2tjYXNlb25seSAnICtcbiAgICAgICAgJ2NoZWNrc3BlbGxpbmcgY2hyb290ZGlyIGNvbnRlbnRkaWdlc3QgY29va2llZG9tYWluIGNvb2tpZWV4cGlyZXMgY29va2llbG9nICcgK1xuICAgICAgICAnY29va2llbmFtZSBjb29raWVzdHlsZSBjb29raWV0cmFja2luZyBjb3JlZHVtcGRpcmVjdG9yeSBjdXN0b21sb2cgZGF2ICcgK1xuICAgICAgICAnZGF2ZGVwdGhpbmZpbml0eSBkYXZnZW5lcmljbG9ja2RiIGRhdmxvY2tkYiBkYXZtaW50aW1lb3V0IGRiZGV4cHRpbWUgZGJka2VlcCAnICtcbiAgICAgICAgJ2RiZG1heCBkYmRtaW4gZGJkcGFyYW1zIGRiZHBlcnNpc3QgZGJkcHJlcGFyZXNxbCBkYmRyaXZlciBkZWZhdWx0aWNvbiAnICtcbiAgICAgICAgJ2RlZmF1bHRsYW5ndWFnZSBkZWZhdWx0dHlwZSBkZWZsYXRlYnVmZmVyc2l6ZSBkZWZsYXRlY29tcHJlc3Npb25sZXZlbCAnICtcbiAgICAgICAgJ2RlZmxhdGVmaWx0ZXJub3RlIGRlZmxhdGVtZW1sZXZlbCBkZWZsYXRld2luZG93c2l6ZSBkZW55IGRpcmVjdG9yeWluZGV4ICcgK1xuICAgICAgICAnZGlyZWN0b3J5bWF0Y2ggZGlyZWN0b3J5c2xhc2ggZG9jdW1lbnRyb290IGR1bXBpb2lucHV0IGR1bXBpb2xvZ2xldmVsIGR1bXBpb291dHB1dCAnICtcbiAgICAgICAgJ2VuYWJsZWV4Y2VwdGlvbmhvb2sgZW5hYmxlbW1hcCBlbmFibGVzZW5kZmlsZSBlcnJvcmRvY3VtZW50IGVycm9ybG9nIGV4YW1wbGUgJyArXG4gICAgICAgICdleHBpcmVzYWN0aXZlIGV4cGlyZXNieXR5cGUgZXhwaXJlc2RlZmF1bHQgZXh0ZW5kZWRzdGF0dXMgZXh0ZmlsdGVyZGVmaW5lICcgK1xuICAgICAgICAnZXh0ZmlsdGVyb3B0aW9ucyBmaWxlZXRhZyBmaWx0ZXJjaGFpbiBmaWx0ZXJkZWNsYXJlIGZpbHRlcnByb3RvY29sIGZpbHRlcnByb3ZpZGVyICcgK1xuICAgICAgICAnZmlsdGVydHJhY2UgZm9yY2VsYW5ndWFnZXByaW9yaXR5IGZvcmNldHlwZSBmb3JlbnNpY2xvZyBncmFjZWZ1bHNodXRkb3dudGltZW91dCAnICtcbiAgICAgICAgJ2dyb3VwIGhlYWRlciBoZWFkZXJuYW1lIGhvc3RuYW1lbG9va3VwcyBpZGVudGl0eWNoZWNrIGlkZW50aXR5Y2hlY2t0aW1lb3V0ICcgK1xuICAgICAgICAnaW1hcGJhc2UgaW1hcGRlZmF1bHQgaW1hcG1lbnUgaW5jbHVkZSBpbmRleGhlYWRpbnNlcnQgaW5kZXhpZ25vcmUgaW5kZXhvcHRpb25zICcgK1xuICAgICAgICAnaW5kZXhvcmRlcmRlZmF1bHQgaW5kZXhzdHlsZXNoZWV0IGlzYXBpYXBwZW5kbG9ndG9lcnJvcnMgaXNhcGlhcHBlbmRsb2d0b3F1ZXJ5ICcgK1xuICAgICAgICAnaXNhcGljYWNoZWZpbGUgaXNhcGlmYWtlYXN5bmMgaXNhcGlsb2dub3RzdXBwb3J0ZWQgaXNhcGlyZWFkYWhlYWRidWZmZXIga2VlcGFsaXZlICcgK1xuICAgICAgICAna2VlcGFsaXZldGltZW91dCBsYW5ndWFnZXByaW9yaXR5IGxkYXBjYWNoZWVudHJpZXMgbGRhcGNhY2hldHRsICcgK1xuICAgICAgICAnbGRhcGNvbm5lY3Rpb250aW1lb3V0IGxkYXBvcGNhY2hlZW50cmllcyBsZGFwb3BjYWNoZXR0bCBsZGFwc2hhcmVkY2FjaGVmaWxlICcgK1xuICAgICAgICAnbGRhcHNoYXJlZGNhY2hlc2l6ZSBsZGFwdHJ1c3RlZGNsaWVudGNlcnQgbGRhcHRydXN0ZWRnbG9iYWxjZXJ0IGxkYXB0cnVzdGVkbW9kZSAnICtcbiAgICAgICAgJ2xkYXB2ZXJpZnlzZXJ2ZXJjZXJ0IGxpbWl0aW50ZXJuYWxyZWN1cnNpb24gbGltaXRyZXF1ZXN0Ym9keSBsaW1pdHJlcXVlc3RmaWVsZHMgJyArXG4gICAgICAgICdsaW1pdHJlcXVlc3RmaWVsZHNpemUgbGltaXRyZXF1ZXN0bGluZSBsaW1pdHhtbHJlcXVlc3Rib2R5IGxpc3RlbiBsaXN0ZW5iYWNrbG9nICcgK1xuICAgICAgICAnbG9hZGZpbGUgbG9hZG1vZHVsZSBsb2NrZmlsZSBsb2dmb3JtYXQgbG9nbGV2ZWwgbWF4Y2xpZW50cyBtYXhrZWVwYWxpdmVyZXF1ZXN0cyAnICtcbiAgICAgICAgJ21heG1lbWZyZWUgbWF4cmVxdWVzdHNwZXJjaGlsZCBtYXhyZXF1ZXN0c3BlcnRocmVhZCBtYXhzcGFyZXNlcnZlcnMgbWF4c3BhcmV0aHJlYWRzICcgK1xuICAgICAgICAnbWF4dGhyZWFkcyBtY2FjaGVtYXhvYmplY3Rjb3VudCBtY2FjaGVtYXhvYmplY3RzaXplIG1jYWNoZW1heHN0cmVhbWluZ2J1ZmZlciAnICtcbiAgICAgICAgJ21jYWNoZW1pbm9iamVjdHNpemUgbWNhY2hlcmVtb3ZhbGFsZ29yaXRobSBtY2FjaGVzaXplIG1ldGFkaXIgbWV0YWZpbGVzIG1ldGFzdWZmaXggJyArXG4gICAgICAgICdtaW1lbWFnaWNmaWxlIG1pbnNwYXJlc2VydmVycyBtaW5zcGFyZXRocmVhZHMgbW1hcGZpbGUgbW9kX2d6aXBfb24gJyArXG4gICAgICAgICdtb2RfZ3ppcF9hZGRfaGVhZGVyX2NvdW50IG1vZF9nemlwX2tlZXBfd29ya2ZpbGVzIG1vZF9nemlwX2RlY2h1bmsgJyArXG4gICAgICAgICdtb2RfZ3ppcF9taW5faHR0cCBtb2RfZ3ppcF9taW5pbXVtX2ZpbGVfc2l6ZSBtb2RfZ3ppcF9tYXhpbXVtX2ZpbGVfc2l6ZSAnICtcbiAgICAgICAgJ21vZF9nemlwX21heGltdW1faW5tZW1fc2l6ZSBtb2RfZ3ppcF90ZW1wX2RpciBtb2RfZ3ppcF9pdGVtX2luY2x1ZGUgJyArXG4gICAgICAgICdtb2RfZ3ppcF9pdGVtX2V4Y2x1ZGUgbW9kX2d6aXBfY29tbWFuZF92ZXJzaW9uIG1vZF9nemlwX2Nhbl9uZWdvdGlhdGUgJyArXG4gICAgICAgICdtb2RfZ3ppcF9oYW5kbGVfbWV0aG9kcyBtb2RfZ3ppcF9zdGF0aWNfc3VmZml4IG1vZF9nemlwX3NlbmRfdmFyeSAnICtcbiAgICAgICAgJ21vZF9nemlwX3VwZGF0ZV9zdGF0aWMgbW9kbWltZXVzZXBhdGhpbmZvIG11bHRpdmlld3NtYXRjaCBuYW1ldmlydHVhbGhvc3Qgbm9wcm94eSAnICtcbiAgICAgICAgJ253c3NsdHJ1c3RlZGNlcnRzIG53c3NsdXBncmFkZWFibGUgb3B0aW9ucyBvcmRlciBwYXNzZW52IHBpZGZpbGUgcHJvdG9jb2xlY2hvICcgK1xuICAgICAgICAncHJveHliYWRoZWFkZXIgcHJveHlibG9jayBwcm94eWRvbWFpbiBwcm94eWVycm9yb3ZlcnJpZGUgcHJveHlmdHBkaXJjaGFyc2V0ICcgK1xuICAgICAgICAncHJveHlpb2J1ZmZlcnNpemUgcHJveHltYXhmb3J3YXJkcyBwcm94eXBhc3MgcHJveHlwYXNzaW50ZXJwb2xhdGVlbnYgJyArXG4gICAgICAgICdwcm94eXBhc3NtYXRjaCBwcm94eXBhc3NyZXZlcnNlIHByb3h5cGFzc3JldmVyc2Vjb29raWVkb21haW4gJyArXG4gICAgICAgICdwcm94eXBhc3NyZXZlcnNlY29va2llcGF0aCBwcm94eXByZXNlcnZlaG9zdCBwcm94eXJlY2VpdmVidWZmZXJzaXplIHByb3h5cmVtb3RlICcgK1xuICAgICAgICAncHJveHlyZW1vdGVtYXRjaCBwcm94eXJlcXVlc3RzIHByb3h5c2V0IHByb3h5c3RhdHVzIHByb3h5dGltZW91dCBwcm94eXZpYSAnICtcbiAgICAgICAgJ3JlYWRtZW5hbWUgcmVjZWl2ZWJ1ZmZlcnNpemUgcmVkaXJlY3QgcmVkaXJlY3RtYXRjaCByZWRpcmVjdHBlcm1hbmVudCAnICtcbiAgICAgICAgJ3JlZGlyZWN0dGVtcCByZW1vdmVjaGFyc2V0IHJlbW92ZWVuY29kaW5nIHJlbW92ZWhhbmRsZXIgcmVtb3ZlaW5wdXRmaWx0ZXIgJyArXG4gICAgICAgICdyZW1vdmVsYW5ndWFnZSByZW1vdmVvdXRwdXRmaWx0ZXIgcmVtb3ZldHlwZSByZXF1ZXN0aGVhZGVyIHJlcXVpcmUgcmV3cml0ZWJhc2UgJyArXG4gICAgICAgICdyZXdyaXRlY29uZCByZXdyaXRlZW5naW5lIHJld3JpdGVsb2NrIHJld3JpdGVsb2cgcmV3cml0ZWxvZ2xldmVsIHJld3JpdGVtYXAgJyArXG4gICAgICAgICdyZXdyaXRlb3B0aW9ucyByZXdyaXRlcnVsZSBybGltaXRjcHUgcmxpbWl0bWVtIHJsaW1pdG5wcm9jIHNhdGlzZnkgc2NvcmVib2FyZGZpbGUgJyArXG4gICAgICAgICdzY3JpcHQgc2NyaXB0YWxpYXMgc2NyaXB0YWxpYXNtYXRjaCBzY3JpcHRpbnRlcnByZXRlcnNvdXJjZSBzY3JpcHRsb2cgJyArXG4gICAgICAgICdzY3JpcHRsb2didWZmZXIgc2NyaXB0bG9nbGVuZ3RoIHNjcmlwdHNvY2sgc2VjdXJlbGlzdGVuIHNlZXJlcXVlc3R0YWlsICcgK1xuICAgICAgICAnc2VuZGJ1ZmZlcnNpemUgc2VydmVyYWRtaW4gc2VydmVyYWxpYXMgc2VydmVybGltaXQgc2VydmVybmFtZSBzZXJ2ZXJwYXRoICcgK1xuICAgICAgICAnc2VydmVycm9vdCBzZXJ2ZXJzaWduYXR1cmUgc2VydmVydG9rZW5zIHNldGVudiBzZXRlbnZpZiBzZXRlbnZpZm5vY2FzZSBzZXRoYW5kbGVyICcgK1xuICAgICAgICAnc2V0aW5wdXRmaWx0ZXIgc2V0b3V0cHV0ZmlsdGVyIHNzaWVuYWJsZWFjY2VzcyBzc2llbmR0YWcgc3NpZXJyb3Jtc2cgc3Npc3RhcnR0YWcgJyArXG4gICAgICAgICdzc2l0aW1lZm9ybWF0IHNzaXVuZGVmaW5lZGVjaG8gc3NsY2FjZXJ0aWZpY2F0ZWZpbGUgc3NsY2FjZXJ0aWZpY2F0ZXBhdGggJyArXG4gICAgICAgICdzc2xjYWRucmVxdWVzdGZpbGUgc3NsY2FkbnJlcXVlc3RwYXRoIHNzbGNhcmV2b2NhdGlvbmZpbGUgc3NsY2FyZXZvY2F0aW9ucGF0aCAnICtcbiAgICAgICAgJ3NzbGNlcnRpZmljYXRlY2hhaW5maWxlIHNzbGNlcnRpZmljYXRlZmlsZSBzc2xjZXJ0aWZpY2F0ZWtleWZpbGUgc3NsY2lwaGVyc3VpdGUgJyArXG4gICAgICAgICdzc2xjcnlwdG9kZXZpY2Ugc3NsZW5naW5lIHNzbGhvbm9yY2lwZXJvcmRlciBzc2xtdXRleCBzc2xvcHRpb25zICcgK1xuICAgICAgICAnc3NscGFzc3BocmFzZWRpYWxvZyBzc2xwcm90b2NvbCBzc2xwcm94eWNhY2VydGlmaWNhdGVmaWxlICcgK1xuICAgICAgICAnc3NscHJveHljYWNlcnRpZmljYXRlcGF0aCBzc2xwcm94eWNhcmV2b2NhdGlvbmZpbGUgc3NscHJveHljYXJldm9jYXRpb25wYXRoICcgK1xuICAgICAgICAnc3NscHJveHljaXBoZXJzdWl0ZSBzc2xwcm94eWVuZ2luZSBzc2xwcm94eW1hY2hpbmVjZXJ0aWZpY2F0ZWZpbGUgJyArXG4gICAgICAgICdzc2xwcm94eW1hY2hpbmVjZXJ0aWZpY2F0ZXBhdGggc3NscHJveHlwcm90b2NvbCBzc2xwcm94eXZlcmlmeSAnICtcbiAgICAgICAgJ3NzbHByb3h5dmVyaWZ5ZGVwdGggc3NscmFuZG9tc2VlZCBzc2xyZXF1aXJlIHNzbHJlcXVpcmVzc2wgc3Nsc2Vzc2lvbmNhY2hlICcgK1xuICAgICAgICAnc3Nsc2Vzc2lvbmNhY2hldGltZW91dCBzc2x1c2VybmFtZSBzc2x2ZXJpZnljbGllbnQgc3NsdmVyaWZ5ZGVwdGggc3RhcnRzZXJ2ZXJzICcgK1xuICAgICAgICAnc3RhcnR0aHJlYWRzIHN1YnN0aXR1dGUgc3VleGVjdXNlcmdyb3VwIHRocmVhZGxpbWl0IHRocmVhZHNwZXJjaGlsZCAnICtcbiAgICAgICAgJ3RocmVhZHN0YWNrc2l6ZSB0aW1lb3V0IHRyYWNlZW5hYmxlIHRyYW5zZmVybG9nIHR5cGVzY29uZmlnIHVuc2V0ZW52ICcgK1xuICAgICAgICAndXNlY2Fub25pY2FsbmFtZSB1c2VjYW5vbmljYWxwaHlzaWNhbHBvcnQgdXNlciB1c2VyZGlyIHZpcnR1YWxkb2N1bWVudHJvb3QgJyArXG4gICAgICAgICd2aXJ0dWFsZG9jdW1lbnRyb290aXAgdmlydHVhbHNjcmlwdGFsaWFzIHZpcnR1YWxzY3JpcHRhbGlhc2lwICcgK1xuICAgICAgICAnd2luMzJkaXNhYmxlYWNjZXB0ZXggeGJpdGhhY2snLFxuICAgICAgbGl0ZXJhbDogJ29uIG9mZidcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzcWJyYWNrZXQnLFxuICAgICAgICBiZWdpbjogJ1xcXFxzXFxcXFsnLCBlbmQ6ICdcXFxcXSQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjYnJhY2tldCcsXG4gICAgICAgIGJlZ2luOiAnW1xcXFwkJV1cXFxceycsIGVuZDogJ1xcXFx9JyxcbiAgICAgICAgY29udGFpbnM6IFsnc2VsZicsIE5VTUJFUl1cbiAgICAgIH0sXG4gICAgICBOVU1CRVIsXG4gICAgICB7Y2xhc3NOYW1lOiAndGFnJywgYmVnaW46ICc8Lz8nLCBlbmQ6ICc+J30sXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFNUUklORyA9IGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7aWxsZWdhbDogJyd9KTtcbiAgdmFyIFRJVExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICB9O1xuICB2YXIgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogWydzZWxmJywgaGxqcy5DX05VTUJFUl9NT0RFLCBTVFJJTkddXG4gIH07XG4gIHZhciBDT01NRU5UUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnLS0nLCBlbmQ6ICckJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICdcXFxcKFxcXFwqJywgZW5kOiAnXFxcXCpcXFxcKScsXG4gICAgICBjb250YWluczogWydzZWxmJywge2JlZ2luOiAnLS0nLCBlbmQ6ICckJ31dIC8vYWxsb3cgbmVzdGluZ1xuICAgIH0sXG4gICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERVxuICBdO1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhYm91dCBhYm92ZSBhZnRlciBhZ2FpbnN0IGFuZCBhcm91bmQgYXMgYXQgYmFjayBiZWZvcmUgYmVnaW5uaW5nICcgK1xuICAgICAgICAnYmVoaW5kIGJlbG93IGJlbmVhdGggYmVzaWRlIGJldHdlZW4gYnV0IGJ5IGNvbnNpZGVyaW5nICcgK1xuICAgICAgICAnY29udGFpbiBjb250YWlucyBjb250aW51ZSBjb3B5IGRpdiBkb2VzIGVpZ2h0aCBlbHNlIGVuZCBlcXVhbCAnICtcbiAgICAgICAgJ2VxdWFscyBlcnJvciBldmVyeSBleGl0IGZpZnRoIGZpcnN0IGZvciBmb3VydGggZnJvbSBmcm9udCAnICtcbiAgICAgICAgJ2dldCBnaXZlbiBnbG9iYWwgaWYgaWdub3JpbmcgaW4gaW50byBpcyBpdCBpdHMgbGFzdCBsb2NhbCBtZSAnICtcbiAgICAgICAgJ21pZGRsZSBtb2QgbXkgbmludGggbm90IG9mIG9uIG9udG8gb3Igb3ZlciBwcm9wIHByb3BlcnR5IHB1dCByZWYgJyArXG4gICAgICAgICdyZWZlcmVuY2UgcmVwZWF0IHJldHVybmluZyBzY3JpcHQgc2Vjb25kIHNldCBzZXZlbnRoIHNpbmNlICcgK1xuICAgICAgICAnc2l4dGggc29tZSB0ZWxsIHRlbnRoIHRoYXQgdGhlIHRoZW4gdGhpcmQgdGhyb3VnaCB0aHJ1ICcgK1xuICAgICAgICAndGltZW91dCB0aW1lcyB0byB0cmFuc2FjdGlvbiB0cnkgdW50aWwgd2hlcmUgd2hpbGUgd2hvc2Ugd2l0aCAnICtcbiAgICAgICAgJ3dpdGhvdXQnLFxuICAgICAgY29uc3RhbnQ6XG4gICAgICAgICdBcHBsZVNjcmlwdCBmYWxzZSBsaW5lZmVlZCByZXR1cm4gcGkgcXVvdGUgcmVzdWx0IHNwYWNlIHRhYiB0cnVlJyxcbiAgICAgIHR5cGU6XG4gICAgICAgICdhbGlhcyBhcHBsaWNhdGlvbiBib29sZWFuIGNsYXNzIGNvbnN0YW50IGRhdGUgZmlsZSBpbnRlZ2VyIGxpc3QgJyArXG4gICAgICAgICdudW1iZXIgcmVhbCByZWNvcmQgc3RyaW5nIHRleHQnLFxuICAgICAgY29tbWFuZDpcbiAgICAgICAgJ2FjdGl2YXRlIGJlZXAgY291bnQgZGVsYXkgbGF1bmNoIGxvZyBvZmZzZXQgcmVhZCByb3VuZCAnICtcbiAgICAgICAgJ3J1biBzYXkgc3VtbWFyaXplIHdyaXRlJyxcbiAgICAgIHByb3BlcnR5OlxuICAgICAgICAnY2hhcmFjdGVyIGNoYXJhY3RlcnMgY29udGVudHMgZGF5IGZyb250bW9zdCBpZCBpdGVtIGxlbmd0aCAnICtcbiAgICAgICAgJ21vbnRoIG5hbWUgcGFyYWdyYXBoIHBhcmFncmFwaHMgcmVzdCByZXZlcnNlIHJ1bm5pbmcgdGltZSB2ZXJzaW9uICcgK1xuICAgICAgICAnd2Vla2RheSB3b3JkIHdvcmRzIHllYXInXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgU1RSSU5HLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0eXBlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYlBPU0lYIGZpbGVcXFxcYidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1hbmQnLFxuICAgICAgICBiZWdpbjpcbiAgICAgICAgICAnXFxcXGIoY2xpcGJvYXJkIGluZm98dGhlIGNsaXBib2FyZHxpbmZvIGZvcnxsaXN0IChkaXNrc3xmb2xkZXIpfCcgK1xuICAgICAgICAgICdtb3VudCB2b2x1bWV8cGF0aCB0b3woY2xvc2V8b3BlbiBmb3IpIGFjY2Vzc3woZ2V0fHNldCkgZW9mfCcgK1xuICAgICAgICAgICdjdXJyZW50IGRhdGV8ZG8gc2hlbGwgc2NyaXB0fGdldCB2b2x1bWUgc2V0dGluZ3N8cmFuZG9tIG51bWJlcnwnICtcbiAgICAgICAgICAnc2V0IHZvbHVtZXxzeXN0ZW0gYXR0cmlidXRlfHN5c3RlbSBpbmZvfHRpbWUgdG8gR01UfCcgK1xuICAgICAgICAgICcobG9hZHxydW58c3RvcmUpIHNjcmlwdHxzY3JpcHRpbmcgY29tcG9uZW50c3wnICtcbiAgICAgICAgICAnQVNDSUkgKGNoYXJhY3RlcnxudW1iZXIpfGxvY2FsaXplZCBzdHJpbmd8JyArXG4gICAgICAgICAgJ2Nob29zZSAoYXBwbGljYXRpb258Y29sb3J8ZmlsZXxmaWxlIG5hbWV8JyArXG4gICAgICAgICAgJ2ZvbGRlcnxmcm9tIGxpc3R8cmVtb3RlIGFwcGxpY2F0aW9ufFVSTCl8JyArXG4gICAgICAgICAgJ2Rpc3BsYXkgKGFsZXJ0fGRpYWxvZykpXFxcXGJ8XlxcXFxzKnJldHVyblxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29uc3RhbnQnLFxuICAgICAgICBiZWdpbjpcbiAgICAgICAgICAnXFxcXGIodGV4dCBpdGVtIGRlbGltaXRlcnN8Y3VycmVudCBhcHBsaWNhdGlvbnxtaXNzaW5nIHZhbHVlKVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYihhcGFydCBmcm9tfGFzaWRlIGZyb218aW5zdGVhZCBvZnxvdXQgb2Z8Z3JlYXRlciB0aGFufCcgK1xuICAgICAgICAgIFwiaXNuJ3R8KGRvZXNuJ3R8ZG9lcyBub3QpIChlcXVhbHxjb21lIGJlZm9yZXxjb21lIGFmdGVyfGNvbnRhaW4pfFwiICtcbiAgICAgICAgICAnKGdyZWF0ZXJ8bGVzcykgdGhhbiggb3IgZXF1YWwpP3woc3RhcnRzP3xlbmRzfGJlZ2lucz8pIHdpdGh8JyArXG4gICAgICAgICAgJ2NvbnRhaW5lZCBieXxjb21lcyAoYmVmb3JlfGFmdGVyKXxhIChyZWZ8cmVmZXJlbmNlKSlcXFxcYidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3Byb3BlcnR5JyxcbiAgICAgICAgYmVnaW46XG4gICAgICAgICAgJ1xcXFxiKFBPU0lYIHBhdGh8KGRhdGV8dGltZSkgc3RyaW5nfHF1b3RlZCBmb3JtKVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb25fc3RhcnQnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICBrZXl3b3JkczogJ29uJyxcbiAgICAgICAgaWxsZWdhbDogJ1skez07XFxcXG5dJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRSwgUEFSQU1TXVxuICAgICAgfVxuICAgIF0uY29uY2F0KENPTU1FTlRTKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAvKiBtbmVtb25pYyAqL1xuICAgICAgICAnYWRjIGFkZCBhZGl3IGFuZCBhbmRpIGFzciBiY2xyIGJsZCBicmJjIGJyYnMgYnJjYyBicmNzIGJyZWFrIGJyZXEgYnJnZSBicmhjIGJyaHMgJyArXG4gICAgICAgICdicmlkIGJyaWUgYnJsbyBicmx0IGJybWkgYnJuZSBicnBsIGJyc2ggYnJ0YyBicnRzIGJydmMgYnJ2cyBic2V0IGJzdCBjYWxsIGNiaSBjYnIgJyArXG4gICAgICAgICdjbGMgY2xoIGNsaSBjbG4gY2xyIGNscyBjbHQgY2x2IGNseiBjb20gY3AgY3BjIGNwaSBjcHNlIGRlYyBlaWNhbGwgZWlqbXAgZWxwbSBlb3IgJyArXG4gICAgICAgICdmbXVsIGZtdWxzIGZtdWxzdSBpY2FsbCBpam1wIGluIGluYyBqbXAgbGQgbGRkIGxkaSBsZHMgbHBtIGxzbCBsc3IgbW92IG1vdncgbXVsICcgK1xuICAgICAgICAnbXVscyBtdWxzdSBuZWcgbm9wIG9yIG9yaSBvdXQgcG9wIHB1c2ggcmNhbGwgcmV0IHJldGkgcmptcCByb2wgcm9yIHNiYyBzYnIgc2JyYyBzYnJzICcgK1xuICAgICAgICAnc2VjIHNlaCBzYmkgc2JjaSBzYmljIHNiaXMgc2JpdyBzZWkgc2VuIHNlciBzZXMgc2V0IHNldiBzZXogc2xlZXAgc3BtIHN0IHN0ZCBzdHMgc3ViICcgK1xuICAgICAgICAnc3ViaSBzd2FwIHRzdCB3ZHInLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgIC8qIGdlbmVyYWwgcHVycG9zZSByZWdpc3RlcnMgKi9cbiAgICAgICAgJ3IwIHIxIHIyIHIzIHI0IHI1IHI2IHI3IHI4IHI5IHIxMCByMTEgcjEyIHIxMyByMTQgcjE1IHIxNiByMTcgcjE4IHIxOSByMjAgcjIxIHIyMiAnICtcbiAgICAgICAgJ3IyMyByMjQgcjI1IHIyNiByMjcgcjI4IHIyOSByMzAgcjMxIHh8MCB4aCB4bCB5fDAgeWggeWwgenwwIHpoIHpsICcgK1xuICAgICAgICAvKiBJTyBSZWdpc3RlcnMgKEFUTWVnYTEyOCkgKi9cbiAgICAgICAgJ3Vjc3IxYyB1ZHIxIHVjc3IxYSB1Y3NyMWIgdWJycjFsIHVicnIxaCB1Y3NyMGMgdWJycjBoIHRjY3IzYyB0Y2NyM2EgdGNjcjNiIHRjbnQzaCAnICtcbiAgICAgICAgJ3RjbnQzbCBvY3IzYWggb2NyM2FsIG9jcjNiaCBvY3IzYmwgb2NyM2NoIG9jcjNjbCBpY3IzaCBpY3IzbCBldGltc2sgZXRpZnIgdGNjcjFjICcgK1xuICAgICAgICAnb2NyMWNoIG9jcjFjbCB0d2NyIHR3ZHIgdHdhciB0d3NyIHR3YnIgb3NjY2FsIHhtY3JhIHhtY3JiIGVpY3JhIHNwbWNzciBzcG1jciBwb3J0ZyAnICtcbiAgICAgICAgJ2RkcmcgcGluZyBwb3J0ZiBkZHJmIHNyZWcgc3BoIHNwbCB4ZGl2IHJhbXB6IGVpY3JiIGVpbXNrIGdpbXNrIGdpY3IgZWlmciBnaWZyIHRpbXNrICcgK1xuICAgICAgICAndGlmciBtY3VjciBtY3Vjc3IgdGNjcjAgdGNudDAgb2NyMCBhc3NyIHRjY3IxYSB0Y2NyMWIgdGNudDFoIHRjbnQxbCBvY3IxYWggb2NyMWFsICcgK1xuICAgICAgICAnb2NyMWJoIG9jcjFibCBpY3IxaCBpY3IxbCB0Y2NyMiB0Y250MiBvY3IyIG9jZHIgd2R0Y3Igc2Zpb3IgZWVhcmggZWVhcmwgZWVkciBlZWNyICcgK1xuICAgICAgICAncG9ydGEgZGRyYSBwaW5hIHBvcnRiIGRkcmIgcGluYiBwb3J0YyBkZHJjIHBpbmMgcG9ydGQgZGRyZCBwaW5kIHNwZHIgc3BzciBzcGNyIHVkcjAgJyArXG4gICAgICAgICd1Y3NyMGEgdWNzcjBiIHVicnIwbCBhY3NyIGFkbXV4IGFkY3NyIGFkY2ggYWRjbCBwb3J0ZSBkZHJlIHBpbmUgcGluZidcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge2NsYXNzTmFtZTogJ2NvbW1lbnQnLCBiZWdpbjogJzsnLCAgZW5kOiAnJCd9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLCAvLyAweC4uLiwgZGVjaW1hbCwgZmxvYXRcbiAgICAgIGhsanMuQklOQVJZX05VTUJFUl9NT0RFLCAvLyAwYi4uLlxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKFxcXFwkW2EtekEtWjAtOV0rfDBvWzAtN10rKScgLy8gJC4uLiwgMG8uLi5cbiAgICAgIH0sXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1teXFxcXFxcXFxdXFwnJyxcbiAgICAgICAgaWxsZWdhbDogJ1teXFxcXFxcXFxdW15cXCddJ1xuICAgICAgfSxcbiAgICAgIHtjbGFzc05hbWU6ICdsYWJlbCcsICBiZWdpbjogJ15bQS1aYS16MC05Xy4kXSs6J30sXG4gICAgICB7Y2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJywgYmVnaW46ICcjJywgZW5kOiAnJCd9LFxuICAgICAgeyAgLy8g0LTQuNGA0LXQutGC0LjQstGLIMKrLmluY2x1ZGXCuyDCqy5tYWNyb8K7INC4INGCLtC0LlxuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJ1xcXFwuW2EtekEtWl0rJ1xuICAgICAgfSxcbiAgICAgIHsgIC8vINC/0L7QtNGB0YLQsNC90L7QstC60LAg0LIgwqsubWFjcm/Cu1xuICAgICAgICBjbGFzc05hbWU6ICdsb2NhbHZhcnMnLFxuICAgICAgICBiZWdpbjogJ0BbMC05XSsnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogJ2ZhbHNlIGludCBhYnN0cmFjdCBwcml2YXRlIGNoYXIgaW50ZXJmYWNlIGJvb2xlYW4gc3RhdGljIG51bGwgaWYgZm9yIHRydWUgJyArXG4gICAgICAnd2hpbGUgbG9uZyB0aHJvdyBmaW5hbGx5IHByb3RlY3RlZCBleHRlbmRzIGZpbmFsIGltcGxlbWVudHMgcmV0dXJuIHZvaWQgZW51bSBlbHNlICcgK1xuICAgICAgJ2JyZWFrIG5ldyBjYXRjaCBieXRlIHN1cGVyIGNsYXNzIGNhc2Ugc2hvcnQgZGVmYXVsdCBkb3VibGUgcHVibGljIHRyeSB0aGlzIHN3aXRjaCAnICtcbiAgICAgICdjb250aW51ZSByZXZlcnNlIGZpcnN0ZmFzdCBmaXJzdG9ubHkgZm9ydXBkYXRlIG5vZmV0Y2ggc3VtIGF2ZyBtaW5vZiBtYXhvZiBjb3VudCAnICtcbiAgICAgICdvcmRlciBncm91cCBieSBhc2MgZGVzYyBpbmRleCBoaW50IGxpa2UgZGlzcGFseSBlZGl0IGNsaWVudCBzZXJ2ZXIgdHRzYmVnaW4gJyArXG4gICAgICAndHRzY29tbWl0IHN0ciByZWFsIGRhdGUgY29udGFpbmVyIGFueXR5cGUgY29tbW9uIGRpdiBtb2QnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcyBpbnRlcmZhY2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2luaGVyaXRhbmNlJyxcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cycsXG4gICAgICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEJBU0hfTElURVJBTCA9ICd0cnVlIGZhbHNlJztcbiAgdmFyIEJBU0hfS0VZV09SRCA9ICdpZiB0aGVuIGVsc2UgZWxpZiBmaSBmb3IgYnJlYWsgY29udGludWUgd2hpbGUgaW4gZG8gZG9uZSBlY2hvIGV4aXQgcmV0dXJuIHNldCBkZWNsYXJlJztcbiAgdmFyIFZBUjEgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkW2EtekEtWjAtOV8jXSsnXG4gIH07XG4gIHZhciBWQVIyID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJywgYmVnaW46ICdcXFxcJHsoW159XXxcXFxcXFxcXH0pK30nXG4gIH07XG4gIHZhciBRVU9URV9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFZBUjEsIFZBUjJdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQVBPU19TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgY29udGFpbnM6IFt7YmVnaW46ICdcXCdcXCcnfV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBURVNUX0NPTkRJVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICd0ZXN0X2NvbmRpdGlvbicsXG4gICAgYmVnaW46ICcnLCBlbmQ6ICcnLFxuICAgIGNvbnRhaW5zOiBbUVVPVEVfU1RSSU5HLCBBUE9TX1NUUklORywgVkFSMSwgVkFSMl0sXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGxpdGVyYWw6IEJBU0hfTElURVJBTFxuICAgIH0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDogQkFTSF9LRVlXT1JELFxuICAgICAgbGl0ZXJhbDogQkFTSF9MSVRFUkFMXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzaGViYW5nJyxcbiAgICAgICAgYmVnaW46ICcoIyFcXFxcL2JpblxcXFwvYmFzaCl8KCMhXFxcXC9iaW5cXFxcL3NoKScsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBWQVIxLFxuICAgICAgVkFSMixcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBRVU9URV9TVFJJTkcsXG4gICAgICBBUE9TX1NUUklORyxcbiAgICAgIGhsanMuaW5oZXJpdChURVNUX0NPTkRJVElPTiwge2JlZ2luOiAnXFxcXFsgJywgZW5kOiAnIFxcXFxdJywgcmVsZXZhbmNlOiAwfSksXG4gICAgICBobGpzLmluaGVyaXQoVEVTVF9DT05ESVRJT04sIHtiZWdpbjogJ1xcXFxbXFxcXFsgJywgZW5kOiAnIFxcXFxdXFxcXF0nfSlcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcyl7XG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnW15cXFxcW1xcXFxdXFxcXC4sXFxcXCtcXFxcLTw+IFxcclxcbl0nLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBlbmQ6ICdbXFxcXFtcXFxcXVxcXFwuLFxcXFwrXFxcXC08PiBcXHJcXG5dJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgIGJlZ2luOiAnW1xcXFxbXFxcXF1dJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1tcXFxcLixdJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgICAgIGJlZ2luOiAnW1xcXFwrXFxcXC1dJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBrZXl3b3JkcyA9IHtcbiAgICBidWlsdF9pbjpcbiAgICAgIC8vIENsb2p1cmUga2V5d29yZHNcbiAgICAgICdkZWYgY29uZCBhcHBseSBpZi1ub3QgaWYtbGV0IGlmIG5vdCBub3Q9ID0gJmx0OyA8ID4gJmx0Oz0gPD0gPj0gPT0gKyAvICogLSByZW0gJytcbiAgICAgICdxdW90IG5lZz8gcG9zPyBkZWxheT8gc3ltYm9sPyBrZXl3b3JkPyB0cnVlPyBmYWxzZT8gaW50ZWdlcj8gZW1wdHk/IGNvbGw/IGxpc3Q/ICcrXG4gICAgICAnc2V0PyBpZm4/IGZuPyBhc3NvY2lhdGl2ZT8gc2VxdWVudGlhbD8gc29ydGVkPyBjb3VudGVkPyByZXZlcnNpYmxlPyBudW1iZXI/IGRlY2ltYWw/ICcrXG4gICAgICAnY2xhc3M/IGRpc3RpbmN0PyBpc2E/IGZsb2F0PyByYXRpb25hbD8gcmVkdWNlZD8gcmF0aW8/IG9kZD8gZXZlbj8gY2hhcj8gc2VxPyB2ZWN0b3I/ICcrXG4gICAgICAnc3RyaW5nPyBtYXA/IG5pbD8gY29udGFpbnM/IHplcm8/IGluc3RhbmNlPyBub3QtZXZlcnk/IG5vdC1hbnk/IGxpYnNwZWM/IC0+IC0+PiAuLiAuICcrXG4gICAgICAnaW5jIGNvbXBhcmUgZG8gZG90aW1lcyBtYXBjYXQgdGFrZSByZW1vdmUgdGFrZS13aGlsZSBkcm9wIGxldGZuIGRyb3AtbGFzdCB0YWtlLWxhc3QgJytcbiAgICAgICdkcm9wLXdoaWxlIHdoaWxlIGludGVybiBjb25kcCBjYXNlIHJlZHVjZWQgY3ljbGUgc3BsaXQtYXQgc3BsaXQtd2l0aCByZXBlYXQgcmVwbGljYXRlICcrXG4gICAgICAnaXRlcmF0ZSByYW5nZSBtZXJnZSB6aXBtYXAgZGVjbGFyZSBsaW5lLXNlcSBzb3J0IGNvbXBhcmF0b3Igc29ydC1ieSBkb3J1biBkb2FsbCBudGhuZXh0ICcrXG4gICAgICAnbnRocmVzdCBwYXJ0aXRpb24gZXZhbCBkb3NlcSBhd2FpdCBhd2FpdC1mb3IgbGV0IGFnZW50IGF0b20gc2VuZCBzZW5kLW9mZiByZWxlYXNlLXBlbmRpbmctc2VuZHMgJytcbiAgICAgICdhZGQtd2F0Y2ggbWFwdiBmaWx0ZXJ2IHJlbW92ZS13YXRjaCBhZ2VudC1lcnJvciByZXN0YXJ0LWFnZW50IHNldC1lcnJvci1oYW5kbGVyIGVycm9yLWhhbmRsZXIgJytcbiAgICAgICdzZXQtZXJyb3ItbW9kZSEgZXJyb3ItbW9kZSBzaHV0ZG93bi1hZ2VudHMgcXVvdGUgdmFyIGZuIGxvb3AgcmVjdXIgdGhyb3cgdHJ5IG1vbml0b3ItZW50ZXIgJytcbiAgICAgICdtb25pdG9yLWV4aXQgZGVmbWFjcm8gZGVmbiBkZWZuLSBtYWNyb2V4cGFuZCBtYWNyb2V4cGFuZC0xIGZvciBkb3NlcSBkb3N5bmMgZG90aW1lcyBhbmQgb3IgJytcbiAgICAgICd3aGVuIHdoZW4tbm90IHdoZW4tbGV0IGNvbXAganV4dCBwYXJ0aWFsIHNlcXVlbmNlIG1lbW9pemUgY29uc3RhbnRseSBjb21wbGVtZW50IGlkZW50aXR5IGFzc2VydCAnK1xuICAgICAgJ3BlZWsgcG9wIGRvdG8gcHJveHkgZGVmc3RydWN0IGZpcnN0IHJlc3QgY29ucyBkZWZwcm90b2NvbCBjYXN0IGNvbGwgZGVmdHlwZSBkZWZyZWNvcmQgbGFzdCBidXRsYXN0ICcrXG4gICAgICAnc2lncyByZWlmeSBzZWNvbmQgZmZpcnN0IGZuZXh0IG5maXJzdCBubmV4dCBkZWZtdWx0aSBkZWZtZXRob2QgbWV0YSB3aXRoLW1ldGEgbnMgaW4tbnMgY3JlYXRlLW5zIGltcG9ydCAnK1xuICAgICAgJ2ludGVybiByZWZlciBrZXlzIHNlbGVjdC1rZXlzIHZhbHMga2V5IHZhbCByc2VxIG5hbWUgbmFtZXNwYWNlIHByb21pc2UgaW50byB0cmFuc2llbnQgcGVyc2lzdGVudCEgY29uaiEgJytcbiAgICAgICdhc3NvYyEgZGlzc29jISBwb3AhIGRpc2ohIGltcG9ydCB1c2UgY2xhc3MgdHlwZSBudW0gZmxvYXQgZG91YmxlIHNob3J0IGJ5dGUgYm9vbGVhbiBiaWdpbnQgYmlnaW50ZWdlciAnK1xuICAgICAgJ2JpZ2RlYyBwcmludC1tZXRob2QgcHJpbnQtZHVwIHRocm93LWlmIHRocm93IHByaW50ZiBmb3JtYXQgbG9hZCBjb21waWxlIGdldC1pbiB1cGRhdGUtaW4gcHIgcHItb24gbmV3bGluZSAnK1xuICAgICAgJ2ZsdXNoIHJlYWQgc2x1cnAgcmVhZC1saW5lIHN1YnZlYyB3aXRoLW9wZW4gbWVtZm4gdGltZSBucyBhc3NlcnQgcmUtZmluZCByZS1ncm91cHMgcmFuZC1pbnQgcmFuZCBtb2QgbG9ja2luZyAnK1xuICAgICAgJ2Fzc2VydC12YWxpZC1mZGVjbCBhbGlhcyBuYW1lc3BhY2UgcmVzb2x2ZSByZWYgZGVyZWYgcmVmc2V0IHN3YXAhIHJlc2V0ISBzZXQtdmFsaWRhdG9yISBjb21wYXJlLWFuZC1zZXQhIGFsdGVyLW1ldGEhICcrXG4gICAgICAncmVzZXQtbWV0YSEgY29tbXV0ZSBnZXQtdmFsaWRhdG9yIGFsdGVyIHJlZi1zZXQgcmVmLWhpc3RvcnktY291bnQgcmVmLW1pbi1oaXN0b3J5IHJlZi1tYXgtaGlzdG9yeSBlbnN1cmUgc3luYyBpbyEgJytcbiAgICAgICduZXcgbmV4dCBjb25qIHNldCEgbWVtZm4gdG8tYXJyYXkgZnV0dXJlIGZ1dHVyZS1jYWxsIGludG8tYXJyYXkgYXNldCBnZW4tY2xhc3MgcmVkdWNlIG1lcmdlIG1hcCBmaWx0ZXIgZmluZCBlbXB0eSAnK1xuICAgICAgJ2hhc2gtbWFwIGhhc2gtc2V0IHNvcnRlZC1tYXAgc29ydGVkLW1hcC1ieSBzb3J0ZWQtc2V0IHNvcnRlZC1zZXQtYnkgdmVjIHZlY3RvciBzZXEgZmxhdHRlbiByZXZlcnNlIGFzc29jIGRpc3NvYyBsaXN0ICcrXG4gICAgICAnZGlzaiBnZXQgdW5pb24gZGlmZmVyZW5jZSBpbnRlcnNlY3Rpb24gZXh0ZW5kIGV4dGVuZC10eXBlIGV4dGVuZC1wcm90b2NvbCBpbnQgbnRoIGRlbGF5IGNvdW50IGNvbmNhdCBjaHVuayBjaHVuay1idWZmZXIgJytcbiAgICAgICdjaHVuay1hcHBlbmQgY2h1bmstZmlyc3QgY2h1bmstcmVzdCBtYXggbWluIGRlYyB1bmNoZWNrZWQtaW5jLWludCB1bmNoZWNrZWQtaW5jIHVuY2hlY2tlZC1kZWMtaW5jIHVuY2hlY2tlZC1kZWMgdW5jaGVja2VkLW5lZ2F0ZSAnK1xuICAgICAgJ3VuY2hlY2tlZC1hZGQtaW50IHVuY2hlY2tlZC1hZGQgdW5jaGVja2VkLXN1YnRyYWN0LWludCB1bmNoZWNrZWQtc3VidHJhY3QgY2h1bmstbmV4dCBjaHVuay1jb25zIGNodW5rZWQtc2VxPyBwcm4gdmFyeS1tZXRhICcrXG4gICAgICAnbGF6eS1zZXEgc3ByZWFkIGxpc3QqIHN0ciBmaW5kLWtleXdvcmQga2V5d29yZCBzeW1ib2wgZ2Vuc3ltIGZvcmNlIHJhdGlvbmFsaXplJ1xuICAgfTtcblxuICB2YXIgQ0xKX0lERU5UX1JFID0gJ1thLXpBLVpfMC05XFxcXCFcXFxcLlxcXFw/XFxcXC1cXFxcK1xcXFwqXFxcXC9cXFxcPFxcXFw9XFxcXD5cXFxcJlxcXFwjXFxcXCRcXCc7XSsnO1xuICB2YXIgU0lNUExFX05VTUJFUl9SRSA9ICdbXFxcXHM6XFxcXChcXFxce10rXFxcXGQrKFxcXFwuXFxcXGQrKT8nO1xuXG4gIHZhciBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46IFNJTVBMRV9OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBTVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIENPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICc7JywgZW5kOiAnJCcsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBDT0xMRUNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbGxlY3Rpb24nLFxuICAgIGJlZ2luOiAnW1xcXFxbXFxcXHtdJywgZW5kOiAnW1xcXFxdXFxcXH1dJ1xuICB9O1xuICB2YXIgSElOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ1xcXFxeJyArIENMSl9JREVOVF9SRVxuICB9O1xuICB2YXIgSElOVF9DT0wgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICdcXFxcXlxcXFx7JywgZW5kOiAnXFxcXH0nXG4gIH07XG4gIHZhciBLRVkgPSB7XG4gICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICBiZWdpbjogJ1s6XScgKyBDTEpfSURFTlRfUkVcbiAgfTtcbiAgdmFyIExJU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnbGlzdCcsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIEJPRFkgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAga2V5d29yZHM6IHtsaXRlcmFsOiAndHJ1ZSBmYWxzZSBuaWwnfSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFRJVExFID0ge1xuICAgIGtleXdvcmRzOiBrZXl3b3JkcyxcbiAgICBsZXhlbXM6IENMSl9JREVOVF9SRSxcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBDTEpfSURFTlRfUkUsXG4gICAgc3RhcnRzOiBCT0RZXG4gIH07XG5cbiAgTElTVC5jb250YWlucyA9IFt7Y2xhc3NOYW1lOiAnY29tbWVudCcsIGJlZ2luOiAnY29tbWVudCd9LCBUSVRMRV07XG4gIEJPRFkuY29udGFpbnMgPSBbTElTVCwgU1RSSU5HLCBISU5ULCBISU5UX0NPTCwgQ09NTUVOVCwgS0VZLCBDT0xMRUNUSU9OLCBOVU1CRVJdO1xuICBDT0xMRUNUSU9OLmNvbnRhaW5zID0gW0xJU1QsIFNUUklORywgSElOVCwgQ09NTUVOVCwgS0VZLCBDT0xMRUNUSU9OLCBOVU1CRVJdO1xuXG4gIHJldHVybiB7XG4gICAgaWxsZWdhbDogJ1xcXFxTJyxcbiAgICBjb250YWluczogW1xuICAgICAgQ09NTUVOVCxcbiAgICAgIExJU1RcbiAgICBdXG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczogJ2FkZF9jdXN0b21fY29tbWFuZCBhZGRfY3VzdG9tX3RhcmdldCBhZGRfZGVmaW5pdGlvbnMgYWRkX2RlcGVuZGVuY2llcyAnICtcbiAgICAgICdhZGRfZXhlY3V0YWJsZSBhZGRfbGlicmFyeSBhZGRfc3ViZGlyZWN0b3J5IGFkZF90ZXN0IGF1eF9zb3VyY2VfZGlyZWN0b3J5ICcgK1xuICAgICAgJ2JyZWFrIGJ1aWxkX2NvbW1hbmQgY21ha2VfbWluaW11bV9yZXF1aXJlZCBjbWFrZV9wb2xpY3kgY29uZmlndXJlX2ZpbGUgJyArXG4gICAgICAnY3JlYXRlX3Rlc3Rfc291cmNlbGlzdCBkZWZpbmVfcHJvcGVydHkgZWxzZSBlbHNlaWYgZW5hYmxlX2xhbmd1YWdlIGVuYWJsZV90ZXN0aW5nICcgK1xuICAgICAgJ2VuZGZvcmVhY2ggZW5kZnVuY3Rpb24gZW5kaWYgZW5kbWFjcm8gZW5kd2hpbGUgZXhlY3V0ZV9wcm9jZXNzIGV4cG9ydCBmaW5kX2ZpbGUgJyArXG4gICAgICAnZmluZF9saWJyYXJ5IGZpbmRfcGFja2FnZSBmaW5kX3BhdGggZmluZF9wcm9ncmFtIGZsdGtfd3JhcF91aSBmb3JlYWNoIGZ1bmN0aW9uICcgK1xuICAgICAgJ2dldF9jbWFrZV9wcm9wZXJ0eSBnZXRfZGlyZWN0b3J5X3Byb3BlcnR5IGdldF9maWxlbmFtZV9jb21wb25lbnQgZ2V0X3Byb3BlcnR5ICcgK1xuICAgICAgJ2dldF9zb3VyY2VfZmlsZV9wcm9wZXJ0eSBnZXRfdGFyZ2V0X3Byb3BlcnR5IGdldF90ZXN0X3Byb3BlcnR5IGlmIGluY2x1ZGUgJyArXG4gICAgICAnaW5jbHVkZV9kaXJlY3RvcmllcyBpbmNsdWRlX2V4dGVybmFsX21zcHJvamVjdCBpbmNsdWRlX3JlZ3VsYXJfZXhwcmVzc2lvbiBpbnN0YWxsICcgK1xuICAgICAgJ2xpbmtfZGlyZWN0b3JpZXMgbG9hZF9jYWNoZSBsb2FkX2NvbW1hbmQgbWFjcm8gbWFya19hc19hZHZhbmNlZCBtZXNzYWdlIG9wdGlvbiAnICtcbiAgICAgICdvdXRwdXRfcmVxdWlyZWRfZmlsZXMgcHJvamVjdCBxdF93cmFwX2NwcCBxdF93cmFwX3VpIHJlbW92ZV9kZWZpbml0aW9ucyByZXR1cm4gJyArXG4gICAgICAnc2VwYXJhdGVfYXJndW1lbnRzIHNldCBzZXRfZGlyZWN0b3J5X3Byb3BlcnRpZXMgc2V0X3Byb3BlcnR5ICcgK1xuICAgICAgJ3NldF9zb3VyY2VfZmlsZXNfcHJvcGVydGllcyBzZXRfdGFyZ2V0X3Byb3BlcnRpZXMgc2V0X3Rlc3RzX3Byb3BlcnRpZXMgc2l0ZV9uYW1lICcgK1xuICAgICAgJ3NvdXJjZV9ncm91cCBzdHJpbmcgdGFyZ2V0X2xpbmtfbGlicmFyaWVzIHRyeV9jb21waWxlIHRyeV9ydW4gdW5zZXQgdmFyaWFibGVfd2F0Y2ggJyArXG4gICAgICAnd2hpbGUgYnVpbGRfbmFtZSBleGVjX3Byb2dyYW0gZXhwb3J0X2xpYnJhcnlfZGVwZW5kZW5jaWVzIGluc3RhbGxfZmlsZXMgJyArXG4gICAgICAnaW5zdGFsbF9wcm9ncmFtcyBpbnN0YWxsX3RhcmdldHMgbGlua19saWJyYXJpZXMgbWFrZV9kaXJlY3RvcnkgcmVtb3ZlIHN1YmRpcl9kZXBlbmRzICcgK1xuICAgICAgJ3N1YmRpcnMgdXNlX21hbmdsZWRfbWVzYSB1dGlsaXR5X3NvdXJjZSB2YXJpYWJsZV9yZXF1aXJlcyB3cml0ZV9maWxlJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbnZ2YXInLFxuICAgICAgICBiZWdpbjogJ1xcXFwkeycsIGVuZDogJ30nXG4gICAgICB9LFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLk5VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEtFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAvLyBKUyBrZXl3b3Jkc1xuICAgICAgJ2luIGlmIGZvciB3aGlsZSBmaW5hbGx5IG5ldyBkbyByZXR1cm4gZWxzZSBicmVhayBjYXRjaCBpbnN0YW5jZW9mIHRocm93IHRyeSB0aGlzICcgK1xuICAgICAgJ3N3aXRjaCBjb250aW51ZSB0eXBlb2YgZGVsZXRlIGRlYnVnZ2VyIHN1cGVyICcgK1xuICAgICAgLy8gQ29mZmVlIGtleXdvcmRzXG4gICAgICAndGhlbiB1bmxlc3MgdW50aWwgbG9vcCBvZiBieSB3aGVuIGFuZCBvciBpcyBpc250IG5vdCcsXG4gICAgbGl0ZXJhbDpcbiAgICAgIC8vIEpTIGxpdGVyYWxzXG4gICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCAnICtcbiAgICAgIC8vIENvZmZlZSBsaXRlcmFsc1xuICAgICAgJ3llcyBubyBvbiBvZmYgJyxcbiAgICByZXNlcnZlZDogJ2Nhc2UgZGVmYXVsdCBmdW5jdGlvbiB2YXIgdm9pZCB3aXRoIGNvbnN0IGxldCBlbnVtIGV4cG9ydCBpbXBvcnQgbmF0aXZlICcgK1xuICAgICAgJ19faGFzUHJvcCBfX2V4dGVuZHMgX19zbGljZSBfX2JpbmQgX19pbmRleE9mJ1xuICB9O1xuICB2YXIgSlNfSURFTlRfUkUgPSAnW0EtWmEteiRfXVswLTlBLVphLXokX10qJztcbiAgdmFyIFRJVExFID0ge2NsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IEpTX0lERU5UX1JFfTtcbiAgdmFyIFNVQlNUID0ge1xuICAgIGNsYXNzTmFtZTogJ3N1YnN0JyxcbiAgICBiZWdpbjogJyNcXFxceycsIGVuZDogJ30nLFxuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW2hsanMuQklOQVJZX05VTUJFUl9NT0RFLCBobGpzLkNfTlVNQkVSX01PREVdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIC8vIE51bWJlcnNcbiAgICAgIGhsanMuQklOQVJZX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgLy8gU3RyaW5nc1xuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiXCJcIicsIGVuZDogJ1wiXCJcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCBTVUJTVF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCBTVUJTVF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIENvbW1lbnRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJyMjIycsIGVuZDogJyMjIydcbiAgICAgIH0sXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogJy8vLycsIGVuZDogJy8vLycsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5IQVNIX0NPTU1FTlRfTU9ERV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsIGJlZ2luOiAnLy9bZ2ltXSonXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogJy9cXFxcUyhcXFxcXFxcXC58W15cXFxcbl0pKi9bZ2ltXSonIC8vIFxcUyBpcyByZXF1aXJlZCB0byBwYXJzZSB4IC8gMiAvIDMgYXMgdHdvIGRpdmlzaW9uc1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCcsXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgc3ViTGFuZ3VhZ2U6ICdqYXZhc2NyaXB0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogSlNfSURFTlRfUkUgKyAnXFxcXHMqPVxcXFxzKihcXFxcKC4rXFxcXCkpP1xcXFxzKlstPV0+JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwga2V5d29yZHM6ICdjbGFzcycsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBpbGxlZ2FsOiAnOicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwga2V5d29yZHM6ICdleHRlbmRzJyxcbiAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgaWxsZWdhbDogJzonLFxuICAgICAgICAgICAgY29udGFpbnM6IFtUSVRMRV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFRJVExFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3Byb3BlcnR5JyxcbiAgICAgICAgYmVnaW46ICdAJyArIEpTX0lERU5UX1JFXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIENQUF9LRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOiAnZmFsc2UgaW50IGZsb2F0IHdoaWxlIHByaXZhdGUgY2hhciBjYXRjaCBleHBvcnQgdmlydHVhbCBvcGVyYXRvciBzaXplb2YgJyArXG4gICAgICAnZHluYW1pY19jYXN0fDEwIHR5cGVkZWYgY29uc3RfY2FzdHwxMCBjb25zdCBzdHJ1Y3QgZm9yIHN0YXRpY19jYXN0fDEwIHVuaW9uIG5hbWVzcGFjZSAnICtcbiAgICAgICd1bnNpZ25lZCBsb25nIHRocm93IHZvbGF0aWxlIHN0YXRpYyBwcm90ZWN0ZWQgYm9vbCB0ZW1wbGF0ZSBtdXRhYmxlIGlmIHB1YmxpYyBmcmllbmQgJyArXG4gICAgICAnZG8gcmV0dXJuIGdvdG8gYXV0byB2b2lkIGVudW0gZWxzZSBicmVhayBuZXcgZXh0ZXJuIHVzaW5nIHRydWUgY2xhc3MgYXNtIGNhc2UgdHlwZWlkICcgK1xuICAgICAgJ3Nob3J0IHJlaW50ZXJwcmV0X2Nhc3R8MTAgZGVmYXVsdCBkb3VibGUgcmVnaXN0ZXIgZXhwbGljaXQgc2lnbmVkIHR5cGVuYW1lIHRyeSB0aGlzICcgK1xuICAgICAgJ3N3aXRjaCBjb250aW51ZSB3Y2hhcl90IGlubGluZSBkZWxldGUgYWxpZ25vZiBjaGFyMTZfdCBjaGFyMzJfdCBjb25zdGV4cHIgZGVjbHR5cGUgJyArXG4gICAgICAnbm9leGNlcHQgbnVsbHB0ciBzdGF0aWNfYXNzZXJ0IHRocmVhZF9sb2NhbCByZXN0cmljdCBfQm9vbCBjb21wbGV4JyxcbiAgICBidWlsdF9pbjogJ3N0ZCBzdHJpbmcgY2luIGNvdXQgY2VyciBjbG9nIHN0cmluZ3N0cmVhbSBpc3RyaW5nc3RyZWFtIG9zdHJpbmdzdHJlYW0gJyArXG4gICAgICAnYXV0b19wdHIgZGVxdWUgbGlzdCBxdWV1ZSBzdGFjayB2ZWN0b3IgbWFwIHNldCBiaXRzZXQgbXVsdGlzZXQgbXVsdGltYXAgdW5vcmRlcmVkX3NldCAnICtcbiAgICAgICd1bm9yZGVyZWRfbWFwIHVub3JkZXJlZF9tdWx0aXNldCB1bm9yZGVyZWRfbXVsdGltYXAgYXJyYXkgc2hhcmVkX3B0cidcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogQ1BQX0tFWVdPUkRTLFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcJ1xcXFxcXFxcPy4nLCBlbmQ6ICdcXCcnLFxuICAgICAgICBpbGxlZ2FsOiAnLidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoXFxcXGQrKFxcXFwuXFxcXGQqKT98XFxcXC5cXFxcZCspKHV8VXxsfEx8dWx8VUx8ZnxGKSdcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdGxfY29udGFpbmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihkZXF1ZXxsaXN0fHF1ZXVlfHN0YWNrfHZlY3RvcnxtYXB8c2V0fGJpdHNldHxtdWx0aXNldHxtdWx0aW1hcHx1bm9yZGVyZWRfbWFwfHVub3JkZXJlZF9zZXR8dW5vcmRlcmVkX211bHRpc2V0fHVub3JkZXJlZF9tdWx0aW1hcHxhcnJheSlcXFxccyo8JywgZW5kOiAnPicsXG4gICAgICAgIGtleXdvcmRzOiBDUFBfS0VZV09SRFMsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAvLyBOb3JtYWwga2V5d29yZHMuXG4gICAgICAnYWJzdHJhY3QgYXMgYmFzZSBib29sIGJyZWFrIGJ5dGUgY2FzZSBjYXRjaCBjaGFyIGNoZWNrZWQgY2xhc3MgY29uc3QgY29udGludWUgZGVjaW1hbCAnICtcbiAgICAgICdkZWZhdWx0IGRlbGVnYXRlIGRvIGRvdWJsZSBlbHNlIGVudW0gZXZlbnQgZXhwbGljaXQgZXh0ZXJuIGZhbHNlIGZpbmFsbHkgZml4ZWQgZmxvYXQgJyArXG4gICAgICAnZm9yIGZvcmVhY2ggZ290byBpZiBpbXBsaWNpdCBpbiBpbnQgaW50ZXJmYWNlIGludGVybmFsIGlzIGxvY2sgbG9uZyBuYW1lc3BhY2UgbmV3IG51bGwgJyArXG4gICAgICAnb2JqZWN0IG9wZXJhdG9yIG91dCBvdmVycmlkZSBwYXJhbXMgcHJpdmF0ZSBwcm90ZWN0ZWQgcHVibGljIHJlYWRvbmx5IHJlZiByZXR1cm4gc2J5dGUgJyArXG4gICAgICAnc2VhbGVkIHNob3J0IHNpemVvZiBzdGFja2FsbG9jIHN0YXRpYyBzdHJpbmcgc3RydWN0IHN3aXRjaCB0aGlzIHRocm93IHRydWUgdHJ5IHR5cGVvZiAnICtcbiAgICAgICd1aW50IHVsb25nIHVuY2hlY2tlZCB1bnNhZmUgdXNob3J0IHVzaW5nIHZpcnR1YWwgdm9sYXRpbGUgdm9pZCB3aGlsZSAnICtcbiAgICAgIC8vIENvbnRleHR1YWwga2V5d29yZHMuXG4gICAgICAnYXNjZW5kaW5nIGRlc2NlbmRpbmcgZnJvbSBnZXQgZ3JvdXAgaW50byBqb2luIGxldCBvcmRlcmJ5IHBhcnRpYWwgc2VsZWN0IHNldCB2YWx1ZSB2YXIgJytcbiAgICAgICd3aGVyZSB5aWVsZCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnLy8vJywgZW5kOiAnJCcsIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3htbERvY1RhZycsXG4gICAgICAgICAgICBiZWdpbjogJy8vL3w8IS0tfC0tPidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3htbERvY1RhZycsXG4gICAgICAgICAgICBiZWdpbjogJzwvPycsIGVuZDogJz4nXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnaWYgZWxzZSBlbGlmIGVuZGlmIGRlZmluZSB1bmRlZiB3YXJuaW5nIGVycm9yIGxpbmUgcmVnaW9uIGVuZHJlZ2lvbiBwcmFnbWEgY2hlY2tzdW0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ0BcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgY29udGFpbnM6IFt7YmVnaW46ICdcIlwiJ31dXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBGVU5DVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgYmVnaW46IGhsanMuSURFTlRfUkUgKyAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IFtobGpzLk5VTUJFUl9NT0RFLCBobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREVdXG4gIH07XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBpbGxlZ2FsOiAnWz0vfFxcJ10nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdpZCcsIGJlZ2luOiAnXFxcXCNbQS1aYS16MC05Xy1dKydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJywgYmVnaW46ICdcXFxcLltBLVphLXowLTlfLV0rJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyX3NlbGVjdG9yJyxcbiAgICAgICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICAgICAgaWxsZWdhbDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwc2V1ZG8nLFxuICAgICAgICBiZWdpbjogJzooOik/W2EtekEtWjAtOVxcXFxfXFxcXC1cXFxcK1xcXFwoXFxcXClcXFxcXCJcXFxcXFwnXSsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdF9ydWxlJyxcbiAgICAgICAgYmVnaW46ICdAKGZvbnQtZmFjZXxwYWdlKScsXG4gICAgICAgIGxleGVtczogJ1thLXotXSsnLFxuICAgICAgICBrZXl3b3JkczogJ2ZvbnQtZmFjZSBwYWdlJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXRfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnQCcsIGVuZDogJ1t7O10nLCAvLyBhdF9ydWxlIGVhdGluZyBmaXJzdCBcIntcIiBpcyBhIGdvb2QgdGhpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlY2F1c2UgaXQgZG9lc27igJl0IGxldCBpdCB0byBiZSBwYXJzZWQgYXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGEgcnVsZSBzZXQgYnV0IGluc3RlYWQgZHJvcHMgcGFyc2VyIGludG9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBkZWZhdWx0IG1vZGUgd2hpY2ggaXMgaG93IGl0IHNob3VsZCBiZS5cbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAga2V5d29yZHM6ICdpbXBvcnQgcGFnZSBtZWRpYSBjaGFyc2V0JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBGVU5DVElPTixcbiAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgaGxqcy5OVU1CRVJfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLCBiZWdpbjogaGxqcy5JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdydWxlcycsXG4gICAgICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgICAgICBpbGxlZ2FsOiAnW15cXFxcc10nLFxuICAgICAgICByZWxldmFuY2U6IDAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdydWxlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnW15cXFxcc10nLCByZXR1cm5CZWdpbjogdHJ1ZSwgZW5kOiAnOycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgICAgICAgICAgYmVnaW46ICdbQS1aXFxcXF9cXFxcLlxcXFwtXSsnLCBlbmQ6ICc6JyxcbiAgICAgICAgICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgICAgICAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIEZVTkNUSU9OLFxuICAgICAgICAgICAgICAgICAgICBobGpzLk5VTUJFUl9NT0RFLFxuICAgICAgICAgICAgICAgICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdoZXhjb2xvcicsIGJlZ2luOiAnXFxcXCNbMC05QS1GXSsnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdpbXBvcnRhbnQnLCBiZWdpbjogJyFpbXBvcnRhbnQnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gLyoqXG4gKiBLbm93biBpc3N1ZXM6XG4gKlxuICogLSBpbnZhbGlkIGhleCBzdHJpbmcgbGl0ZXJhbHMgd2lsbCBiZSByZWNvZ25pemVkIGFzIGEgZG91YmxlIHF1b3RlZCBzdHJpbmdzXG4gKiAgIGJ1dCAneCcgYXQgdGhlIGJlZ2lubmluZyBvZiBzdHJpbmcgd2lsbCBub3QgYmUgbWF0Y2hlZFxuICpcbiAqIC0gZGVsaW1pdGVkIHN0cmluZyBsaXRlcmFscyBhcmUgbm90IGNoZWNrZWQgZm9yIG1hdGNoaW5nIGVuZCBkZWxpbWl0ZXJcbiAqICAgKG5vdCBwb3NzaWJsZSB0byBkbyB3aXRoIGpzIHJlZ2V4cClcbiAqXG4gKiAtIGNvbnRlbnQgb2YgdG9rZW4gc3RyaW5nIGlzIGNvbG9yZWQgYXMgYSBzdHJpbmcgKGkuZS4gbm8ga2V5d29yZCBjb2xvcmluZyBpbnNpZGUgYSB0b2tlbiBzdHJpbmcpXG4gKiAgIGFsc28sIGNvbnRlbnQgb2YgdG9rZW4gc3RyaW5nIGlzIG5vdCB2YWxpZGF0ZWQgdG8gY29udGFpbiBvbmx5IHZhbGlkIEQgdG9rZW5zXG4gKlxuICogLSBzcGVjaWFsIHRva2VuIHNlcXVlbmNlIHJ1bGUgaXMgbm90IHN0cmljdGx5IGZvbGxvd2luZyBEIGdyYW1tYXIgKGFueXRoaW5nIGZvbGxvd2luZyAjbGluZVxuICogICB1cCB0byB0aGUgZW5kIG9mIGxpbmUgaXMgbWF0Y2hlZCBhcyBzcGVjaWFsIHRva2VuIHNlcXVlbmNlKVxuICovXG5cbmZ1bmN0aW9uKGhsanMpIHtcblxuXHQvKipcblx0ICogTGFuZ3VhZ2Uga2V5d29yZHNcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0tFWVdPUkRTID0ge1xuXHRcdGtleXdvcmQ6XG5cdFx0XHQnYWJzdHJhY3QgYWxpYXMgYWxpZ24gYXNtIGFzc2VydCBhdXRvIGJvZHkgYnJlYWsgYnl0ZSBjYXNlIGNhc3QgY2F0Y2ggY2xhc3MgJyArXG5cdFx0XHQnY29uc3QgY29udGludWUgZGVidWcgZGVmYXVsdCBkZWxldGUgZGVwcmVjYXRlZCBkbyBlbHNlIGVudW0gZXhwb3J0IGV4dGVybiBmaW5hbCAnICtcblx0XHRcdCdmaW5hbGx5IGZvciBmb3JlYWNoIGZvcmVhY2hfcmV2ZXJzZXwxMCBnb3RvIGlmIGltbXV0YWJsZSBpbXBvcnQgaW4gaW5vdXQgaW50ICcgK1xuXHRcdFx0J2ludGVyZmFjZSBpbnZhcmlhbnQgaXMgbGF6eSBtYWNybyBtaXhpbiBtb2R1bGUgbmV3IG5vdGhyb3cgb3V0IG92ZXJyaWRlIHBhY2thZ2UgJyArXG5cdFx0XHQncHJhZ21hIHByaXZhdGUgcHJvdGVjdGVkIHB1YmxpYyBwdXJlIHJlZiByZXR1cm4gc2NvcGUgc2hhcmVkIHN0YXRpYyBzdHJ1Y3QgJyArXG5cdFx0XHQnc3VwZXIgc3dpdGNoIHN5bmNocm9uaXplZCB0ZW1wbGF0ZSB0aGlzIHRocm93IHRyeSB0eXBlZGVmIHR5cGVpZCB0eXBlb2YgdW5pb24gJyArXG5cdFx0XHQndW5pdHRlc3QgdmVyc2lvbiB2b2lkIHZvbGF0aWxlIHdoaWxlIHdpdGggX19GSUxFX18gX19MSU5FX18gX19nc2hhcmVkfDEwICcgK1xuXHRcdFx0J19fdGhyZWFkIF9fdHJhaXRzIF9fREFURV9fIF9fRU9GX18gX19USU1FX18gX19USU1FU1RBTVBfXyBfX1ZFTkRPUl9fIF9fVkVSU0lPTl9fJyxcblx0XHRidWlsdF9pbjpcblx0XHRcdCdib29sIGNkb3VibGUgY2VudCBjZmxvYXQgY2hhciBjcmVhbCBkY2hhciBkZWxlZ2F0ZSBkb3VibGUgZHN0cmluZyBmbG9hdCBmdW5jdGlvbiAnICtcblx0XHRcdCdpZG91YmxlIGlmbG9hdCBpcmVhbCBsb25nIHJlYWwgc2hvcnQgc3RyaW5nIHVieXRlIHVjZW50IHVpbnQgdWxvbmcgdXNob3J0IHdjaGFyICcgK1xuXHRcdFx0J3dzdHJpbmcnLFxuXHRcdGxpdGVyYWw6XG5cdFx0XHQnZmFsc2UgbnVsbCB0cnVlJ1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBOdW1iZXIgbGl0ZXJhbCByZWdleHBzXG5cdCAqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHR2YXIgZGVjaW1hbF9pbnRlZ2VyX3JlID0gJygwfFsxLTldW1xcXFxkX10qKScsXG5cdFx0ZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlID0gJygwfFsxLTldW1xcXFxkX10qfFxcXFxkW1xcXFxkX10qfFtcXFxcZF9dKz9cXFxcZCknLFxuXHRcdGJpbmFyeV9pbnRlZ2VyX3JlID0gJzBbYkJdWzAxX10rJyxcblx0XHRoZXhhZGVjaW1hbF9kaWdpdHNfcmUgPSAnKFtcXFxcZGEtZkEtRl1bXFxcXGRhLWZBLUZfXSp8X1tcXFxcZGEtZkEtRl1bXFxcXGRhLWZBLUZfXSopJyxcblx0XHRoZXhhZGVjaW1hbF9pbnRlZ2VyX3JlID0gJzBbeFhdJyArIGhleGFkZWNpbWFsX2RpZ2l0c19yZSxcblxuXHRcdGRlY2ltYWxfZXhwb25lbnRfcmUgPSAnKFtlRV1bKy1dPycgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyAnKScsXG5cdFx0ZGVjaW1hbF9mbG9hdF9yZSA9ICcoJyArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArICcoXFxcXC5cXFxcZCp8JyArIGRlY2ltYWxfZXhwb25lbnRfcmUgKyAnKXwnICtcblx0XHRcdFx0XHRcdFx0XHQnXFxcXGQrXFxcXC4nICsgZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlICsgZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlICsgJ3wnICtcblx0XHRcdFx0XHRcdFx0XHQnXFxcXC4nICsgZGVjaW1hbF9pbnRlZ2VyX3JlICsgZGVjaW1hbF9leHBvbmVudF9yZSArICc/JyArXG5cdFx0XHRcdFx0XHRcdCcpJyxcblx0XHRoZXhhZGVjaW1hbF9mbG9hdF9yZSA9ICcoMFt4WF0oJyArXG5cdFx0XHRcdFx0XHRcdFx0XHRoZXhhZGVjaW1hbF9kaWdpdHNfcmUgKyAnXFxcXC4nICsgaGV4YWRlY2ltYWxfZGlnaXRzX3JlICsgJ3wnK1xuXHRcdFx0XHRcdFx0XHRcdFx0J1xcXFwuPycgKyBoZXhhZGVjaW1hbF9kaWdpdHNfcmUgK1xuXHRcdFx0XHRcdFx0XHQgICAnKVtwUF1bKy1dPycgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyAnKScsXG5cblx0XHRpbnRlZ2VyX3JlID0gJygnICtcblx0XHRcdGRlY2ltYWxfaW50ZWdlcl9yZSArICd8JyArXG5cdFx0XHRiaW5hcnlfaW50ZWdlcl9yZSAgKyAnfCcgK1xuXHRcdCBcdGhleGFkZWNpbWFsX2ludGVnZXJfcmUgICArXG5cdFx0JyknLFxuXG5cdFx0ZmxvYXRfcmUgPSAnKCcgK1xuXHRcdFx0aGV4YWRlY2ltYWxfZmxvYXRfcmUgKyAnfCcgK1xuXHRcdFx0ZGVjaW1hbF9mbG9hdF9yZSAgK1xuXHRcdCcpJztcblxuXHQvKipcblx0ICogRXNjYXBlIHNlcXVlbmNlIHN1cHBvcnRlZCBpbiBEIHN0cmluZyBhbmQgY2hhcmFjdGVyIGxpdGVyYWxzXG5cdCAqXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHR2YXIgZXNjYXBlX3NlcXVlbmNlX3JlID0gJ1xcXFxcXFxcKCcgK1xuXHRcdFx0XHRcdFx0XHQnW1xcJ1wiXFxcXD9cXFxcXFxcXGFiZm5ydHZdfCcgK1x0Ly8gY29tbW9uIGVzY2FwZXNcblx0XHRcdFx0XHRcdFx0J3VbXFxcXGRBLUZhLWZdezR9fCcgKyBcdFx0Ly8gZm91ciBoZXggZGlnaXQgdW5pY29kZSBjb2RlcG9pbnRcblx0XHRcdFx0XHRcdFx0J1swLTddezEsM318JyArIFx0XHRcdC8vIG9uZSB0byB0aHJlZSBvY3RhbCBkaWdpdCBhc2NpaSBjaGFyIGNvZGVcblx0XHRcdFx0XHRcdFx0J3hbXFxcXGRBLUZhLWZdezJ9fCcgK1x0XHQvLyB0d28gaGV4IGRpZ2l0IGFzY2lpIGNoYXIgY29kZVxuXHRcdFx0XHRcdFx0XHQnVVtcXFxcZEEtRmEtZl17OH0nICtcdFx0XHQvLyBlaWdodCBoZXggZGlnaXQgdW5pY29kZSBjb2RlcG9pbnRcblx0XHRcdFx0XHRcdCAgJyl8JyArXG5cdFx0XHRcdFx0XHQgICcmW2EtekEtWlxcXFxkXXsyLH07JztcdFx0XHQvLyBuYW1lZCBjaGFyYWN0ZXIgZW50aXR5XG5cblxuXHQvKipcblx0ICogRCBpbnRlZ2VyIG51bWJlciBsaXRlcmFsc1xuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfSU5URUdFUl9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgXHRiZWdpbjogJ1xcXFxiJyArIGludGVnZXJfcmUgKyAnKEx8dXxVfEx1fExVfHVMfFVMKT8nLFxuICAgIFx0cmVsZXZhbmNlOiAwXG5cdH07XG5cblx0LyoqXG5cdCAqIFtEX0ZMT0FUX01PREUgZGVzY3JpcHRpb25dXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9GTE9BVF9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ251bWJlcicsXG5cdFx0YmVnaW46ICdcXFxcYignICtcblx0XHRcdFx0ZmxvYXRfcmUgKyAnKFtmRl18THxpfFtmRl1pfExpKT98JyArXG5cdFx0XHRcdGludGVnZXJfcmUgKyAnKGl8W2ZGXWl8TGkpJyArXG5cdFx0XHQnKScsXG5cdFx0cmVsZXZhbmNlOiAwXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgY2hhcmFjdGVyIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0NIQVJBQ1RFUl9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdcXCcoJyArIGVzY2FwZV9zZXF1ZW5jZV9yZSArICd8LiknLCBlbmQ6ICdcXCcnLFxuXHRcdGlsbGVnYWw6ICcuJ1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIHN0cmluZyBlc2NhcGUgc2VxdWVuY2Vcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0VTQ0FQRV9TRVFVRU5DRSA9IHtcblx0XHRiZWdpbjogZXNjYXBlX3NlcXVlbmNlX3JlLFxuXHRcdHJlbGV2YW5jZTogMFxuXHR9XG5cblx0LyoqXG5cdCAqIEQgZG91YmxlIHF1b3RlZCBzdHJpbmcgbGl0ZXJhbFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfU1RSSU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ1wiJyxcblx0XHRjb250YWluczogW0RfRVNDQVBFX1NFUVVFTkNFXSxcblx0XHRlbmQ6ICdcIltjd2RdPycsXG5cdFx0cmVsZXZhbmNlOiAwXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgd3lzaXd5ZyBhbmQgZGVsaW1pdGVkIHN0cmluZyBsaXRlcmFsc1xuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfV1lTSVdZR19ERUxJTUlURURfU1RSSU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ1tycV1cIicsXG5cdFx0ZW5kOiAnXCJbY3dkXT8nLFxuXHRcdHJlbGV2YW5jZTogNVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIGFsdGVybmF0ZSB3eXNpd3lnIHN0cmluZyBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9BTFRFUk5BVEVfV1lTSVdZR19TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAnYCcsXG5cdFx0ZW5kOiAnYFtjd2RdPydcblx0fTtcblxuXHQvKipcblx0ICogRCBoZXhhZGVjaW1hbCBzdHJpbmcgbGl0ZXJhbFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfSEVYX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICd4XCJbXFxcXGRhLWZBLUZcXFxcc1xcXFxuXFxcXHJdKlwiW2N3ZF0/Jyxcblx0XHRyZWxldmFuY2U6IDEwXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgZGVsaW1pdGVkIHN0cmluZyBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9UT0tFTl9TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAncVwiXFxcXHsnLFxuXHRcdGVuZDogJ1xcXFx9XCInXG5cdH07XG5cblx0LyoqXG5cdCAqIEhhc2hiYW5nIHN1cHBvcnRcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0hBU0hCQU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc2hlYmFuZycsXG5cdFx0YmVnaW46ICdeIyEnLFxuXHRcdGVuZDogJyQnLFxuXHRcdHJlbGV2YW5jZTogNVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIHNwZWNpYWwgdG9rZW4gc2VxdWVuY2Vcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX1NQRUNJQUxfVE9LRU5fU0VRVUVOQ0VfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuXHRcdGJlZ2luOiAnIyhsaW5lKScsXG5cdFx0ZW5kOiAnJCcsXG5cdFx0cmVsZXZhbmNlOiA1XG5cdH07XG5cblx0LyoqXG5cdCAqIEQgYXR0cmlidXRlc1xuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfQVRUUklCVVRFX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAna2V5d29yZCcsXG5cdFx0YmVnaW46ICdAW2EtekEtWl9dW2EtekEtWl9cXFxcZF0qJ1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIG5lc3RpbmcgY29tbWVudFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfTkVTVElOR19DT01NRU5UX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnY29tbWVudCcsXG5cdFx0YmVnaW46ICdcXFxcL1xcXFwrJyxcblx0XHRjb250YWluczogWydzZWxmJ10sXG5cdFx0ZW5kOiAnXFxcXCtcXFxcLycsXG5cdFx0cmVsZXZhbmNlOiAxMFxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZXhlbXM6IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcblx0XHRrZXl3b3JkczogRF9LRVlXT1JEUyxcblx0XHRjb250YWluczogW1xuXHRcdFx0aGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICBcdFx0XHRobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICBcdFx0XHREX05FU1RJTkdfQ09NTUVOVF9NT0RFLFxuICBcdFx0XHREX0hFWF9TVFJJTkdfTU9ERSxcbiAgXHRcdFx0RF9TVFJJTkdfTU9ERSxcbiAgXHRcdFx0RF9XWVNJV1lHX0RFTElNSVRFRF9TVFJJTkdfTU9ERSxcbiAgXHRcdFx0RF9BTFRFUk5BVEVfV1lTSVdZR19TVFJJTkdfTU9ERSxcbiAgXHRcdFx0RF9UT0tFTl9TVFJJTkdfTU9ERSxcbiAgXHRcdFx0RF9GTE9BVF9NT0RFLFxuICBcdFx0XHREX0lOVEVHRVJfTU9ERSxcbiAgXHRcdFx0RF9DSEFSQUNURVJfTU9ERSxcbiAgXHRcdFx0RF9IQVNIQkFOR19NT0RFLFxuICBcdFx0XHREX1NQRUNJQUxfVE9LRU5fU0VRVUVOQ0VfTU9ERSxcbiAgXHRcdFx0RF9BVFRSSUJVVEVfTU9ERVxuXHRcdF1cblx0fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBERUxQSElfS0VZV09SRFMgPSAnYW5kIHNhZmVjYWxsIGNkZWNsIHRoZW4gc3RyaW5nIGV4cG9ydHMgbGlicmFyeSBub3QgcGFzY2FsIHNldCAnICtcbiAgICAndmlydHVhbCBmaWxlIGluIGFycmF5IGxhYmVsIHBhY2tlZCBlbmQuIGluZGV4IHdoaWxlIGNvbnN0IHJhaXNlIGZvciB0byBpbXBsZW1lbnRhdGlvbiAnICtcbiAgICAnd2l0aCBleGNlcHQgb3ZlcmxvYWQgZGVzdHJ1Y3RvciBkb3dudG8gZmluYWxseSBwcm9ncmFtIGV4aXQgdW5pdCBpbmhlcml0ZWQgb3ZlcnJpZGUgaWYgJyArXG4gICAgJ3R5cGUgdW50aWwgZnVuY3Rpb24gZG8gYmVnaW4gcmVwZWF0IGdvdG8gbmlsIGZhciBpbml0aWFsaXphdGlvbiBvYmplY3QgZWxzZSB2YXIgdXNlcyAnICtcbiAgICAnZXh0ZXJuYWwgcmVzb3VyY2VzdHJpbmcgaW50ZXJmYWNlIGVuZCBmaW5hbGl6YXRpb24gY2xhc3MgYXNtIG1vZCBjYXNlIG9uIHNociBzaGwgb2YgJyArXG4gICAgJ3JlZ2lzdGVyIHhvcndyaXRlIHRocmVhZHZhciB0cnkgcmVjb3JkIG5lYXIgc3RvcmVkIGNvbnN0cnVjdG9yIHN0ZGNhbGwgaW5saW5lIGRpdiBvdXQgb3IgJyArXG4gICAgJ3Byb2NlZHVyZSc7XG4gIHZhciBERUxQSElfQ0xBU1NfS0VZV09SRFMgPSAnc2FmZWNhbGwgc3RkY2FsbCBwYXNjYWwgc3RvcmVkIGNvbnN0IGltcGxlbWVudGF0aW9uICcgK1xuICAgICdmaW5hbGl6YXRpb24gZXhjZXB0IHRvIGZpbmFsbHkgcHJvZ3JhbSBpbmhlcml0ZWQgb3ZlcnJpZGUgdGhlbiBleHBvcnRzIHN0cmluZyByZWFkIG5vdCAnICtcbiAgICAnbW9kIHNociB0cnkgZGl2IHNobCBzZXQgbGlicmFyeSBtZXNzYWdlIHBhY2tlZCBpbmRleCBmb3IgbmVhciBvdmVybG9hZCBsYWJlbCBkb3dudG8gZXhpdCAnICtcbiAgICAncHVibGljIGdvdG8gaW50ZXJmYWNlIGFzbSBvbiBvZiBjb25zdHJ1Y3RvciBvciBwcml2YXRlIGFycmF5IHVuaXQgcmFpc2UgZGVzdHJ1Y3RvciB2YXIgJyArXG4gICAgJ3R5cGUgdW50aWwgZnVuY3Rpb24gZWxzZSBleHRlcm5hbCB3aXRoIGNhc2UgZGVmYXVsdCByZWNvcmQgd2hpbGUgcHJvdGVjdGVkIHByb3BlcnR5ICcgK1xuICAgICdwcm9jZWR1cmUgcHVibGlzaGVkIGFuZCBjZGVjbCBkbyB0aHJlYWR2YXIgZmlsZSBpbiBpZiBlbmQgdmlydHVhbCB3cml0ZSBmYXIgb3V0IGJlZ2luICcgK1xuICAgICdyZXBlYXQgbmlsIGluaXRpYWxpemF0aW9uIG9iamVjdCB1c2VzIHJlc291cmNlc3RyaW5nIGNsYXNzIHJlZ2lzdGVyIHhvcndyaXRlIGlubGluZSBzdGF0aWMnO1xuICB2YXIgQ1VSTFlfQ09NTUVOVCA9ICB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBQQVJFTl9DT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnXFxcXChcXFxcKicsIGVuZDogJ1xcXFwqXFxcXCknLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcbiAgdmFyIFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICBjb250YWluczogW3tiZWdpbjogJ1xcJ1xcJyd9XSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIENIQVJfU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsIGJlZ2luOiAnKCNcXFxcZCspKydcbiAgfTtcbiAgdmFyIEZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdbOjtdJyxcbiAgICBrZXl3b3JkczogJ2Z1bmN0aW9uIGNvbnN0cnVjdG9yfDEwIGRlc3RydWN0b3J8MTAgcHJvY2VkdXJlfDEwJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBobGpzLklERU5UX1JFXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICBrZXl3b3JkczogREVMUEhJX0tFWVdPUkRTLFxuICAgICAgICBjb250YWluczogW1NUUklORywgQ0hBUl9TVFJJTkddXG4gICAgICB9LFxuICAgICAgQ1VSTFlfQ09NTUVOVCwgUEFSRU5fQ09NTUVOVFxuICAgIF1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiBERUxQSElfS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJyhcInxcXFxcJFtHLVpnLXpdfFxcXFwvXFxcXCp8PC8pJyxcbiAgICBjb250YWluczogW1xuICAgICAgQ1VSTFlfQ09NTUVOVCwgUEFSRU5fQ09NTUVOVCwgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgU1RSSU5HLCBDSEFSX1NUUklORyxcbiAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICBGVU5DVElPTixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJz1cXFxcYmNsYXNzXFxcXGInLCBlbmQ6ICdlbmQ7JyxcbiAgICAgICAga2V5d29yZHM6IERFTFBISV9DTEFTU19LRVlXT1JEUyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBTVFJJTkcsIENIQVJfU1RSSU5HLFxuICAgICAgICAgIENVUkxZX0NPTU1FTlQsIFBBUkVOX0NPTU1FTlQsIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBGVU5DVElPTlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjaHVuaycsXG4gICAgICAgIGJlZ2luOiAnXlxcXFxAXFxcXEAgK1xcXFwtXFxcXGQrLFxcXFxkKyArXFxcXCtcXFxcZCssXFxcXGQrICtcXFxcQFxcXFxAJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NodW5rJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCpcXFxcKlxcXFwqICtcXFxcZCssXFxcXGQrICtcXFxcKlxcXFwqXFxcXCpcXFxcKiQnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjaHVuaycsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwtXFxcXC1cXFxcLSArXFxcXGQrLFxcXFxkKyArXFxcXC1cXFxcLVxcXFwtXFxcXC0kJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdJbmRleDogJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnPT09PT0nLCBlbmQ6ICc9PT09PSQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ15cXFxcLVxcXFwtXFxcXC0nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCp7M30gJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwrXFxcXCtcXFxcKycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFwqezV9JywgZW5kOiAnXFxcXCp7NX0kJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYWRkaXRpb24nLFxuICAgICAgICBiZWdpbjogJ15cXFxcKycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdkZWxldGlvbicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwtJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NoYW5nZScsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwhJywgZW5kOiAnJCdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuXG4gIGZ1bmN0aW9uIGFsbG93c0RqYW5nb1N5bnRheChtb2RlLCBwYXJlbnQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgcGFyZW50ID09IHVuZGVmaW5lZCB8fCAvLyBkZWZhdWx0IG1vZGVcbiAgICAgICghbW9kZS5jbGFzc05hbWUgJiYgcGFyZW50LmNsYXNzTmFtZSA9PSAndGFnJykgfHwgLy8gdGFnX2ludGVybmFsXG4gICAgICBtb2RlLmNsYXNzTmFtZSA9PSAndmFsdWUnIC8vIHZhbHVlXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvcHkobW9kZSwgcGFyZW50KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIGtleSBpbiBtb2RlKSB7XG4gICAgICBpZiAoa2V5ICE9ICdjb250YWlucycpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBtb2RlW2tleV07XG4gICAgICB9XG4gICAgICB2YXIgY29udGFpbnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBtb2RlLmNvbnRhaW5zICYmIGkgPCBtb2RlLmNvbnRhaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnRhaW5zLnB1c2goY29weShtb2RlLmNvbnRhaW5zW2ldLCBtb2RlKSk7XG4gICAgICB9XG4gICAgICBpZiAoYWxsb3dzRGphbmdvU3ludGF4KG1vZGUsIHBhcmVudCkpIHtcbiAgICAgICAgY29udGFpbnMgPSBESkFOR09fQ09OVEFJTlMuY29uY2F0KGNvbnRhaW5zKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250YWlucy5sZW5ndGgpIHtcbiAgICAgICAgcmVzdWx0LmNvbnRhaW5zID0gY29udGFpbnM7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB2YXIgRklMVEVSID0ge1xuICAgIGNsYXNzTmFtZTogJ2ZpbHRlcicsXG4gICAgYmVnaW46ICdcXFxcfFtBLVphLXpdK1xcXFw6PycsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAga2V5d29yZHM6XG4gICAgICAndHJ1bmNhdGV3b3JkcyByZW1vdmV0YWdzIGxpbmVicmVha3NiciB5ZXNubyBnZXRfZGlnaXQgdGltZXNpbmNlIHJhbmRvbSBzdHJpcHRhZ3MgJyArXG4gICAgICAnZmlsZXNpemVmb3JtYXQgZXNjYXBlIGxpbmVicmVha3MgbGVuZ3RoX2lzIGxqdXN0IHJqdXN0IGN1dCB1cmxpemUgZml4X2FtcGVyc2FuZHMgJyArXG4gICAgICAndGl0bGUgZmxvYXRmb3JtYXQgY2FwZmlyc3QgcHByaW50IGRpdmlzaWJsZWJ5IGFkZCBtYWtlX2xpc3QgdW5vcmRlcmVkX2xpc3QgdXJsZW5jb2RlICcgK1xuICAgICAgJ3RpbWV1bnRpbCB1cmxpemV0cnVuYyB3b3JkY291bnQgc3RyaW5nZm9ybWF0IGxpbmVudW1iZXJzIHNsaWNlIGRhdGUgZGljdHNvcnQgJyArXG4gICAgICAnZGljdHNvcnRyZXZlcnNlZCBkZWZhdWx0X2lmX25vbmUgcGx1cmFsaXplIGxvd2VyIGpvaW4gY2VudGVyIGRlZmF1bHQgJyArXG4gICAgICAndHJ1bmNhdGV3b3Jkc19odG1sIHVwcGVyIGxlbmd0aCBwaG9uZTJudW1lcmljIHdvcmR3cmFwIHRpbWUgYWRkc2xhc2hlcyBzbHVnaWZ5IGZpcnN0ICcgK1xuICAgICAgJ2VzY2FwZWpzIGZvcmNlX2VzY2FwZSBpcmllbmNvZGUgbGFzdCBzYWZlIHNhZmVzZXEgdHJ1bmNhdGVjaGFycyBsb2NhbGl6ZSB1bmxvY2FsaXplICcgK1xuICAgICAgJ2xvY2FsdGltZSB1dGMgdGltZXpvbmUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7Y2xhc3NOYW1lOiAnYXJndW1lbnQnLCBiZWdpbjogJ1wiJywgZW5kOiAnXCInfVxuICAgIF1cbiAgfTtcblxuICB2YXIgREpBTkdPX0NPTlRBSU5TID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlX2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICd7JVxcXFxzKmNvbW1lbnRcXFxccyolfScsIGVuZDogJ3slXFxcXHMqZW5kY29tbWVudFxcXFxzKiV9J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndGVtcGxhdGVfY29tbWVudCcsXG4gICAgICBiZWdpbjogJ3sjJywgZW5kOiAnI30nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZV90YWcnLFxuICAgICAgYmVnaW46ICd7JScsIGVuZDogJyV9JyxcbiAgICAgIGtleXdvcmRzOlxuICAgICAgICAnY29tbWVudCBlbmRjb21tZW50IGxvYWQgdGVtcGxhdGV0YWcgaWZjaGFuZ2VkIGVuZGlmY2hhbmdlZCBpZiBlbmRpZiBmaXJzdG9mIGZvciAnICtcbiAgICAgICAgJ2VuZGZvciBpbiBpZm5vdGVxdWFsIGVuZGlmbm90ZXF1YWwgd2lkdGhyYXRpbyBleHRlbmRzIGluY2x1ZGUgc3BhY2VsZXNzICcgK1xuICAgICAgICAnZW5kc3BhY2VsZXNzIHJlZ3JvdXAgYnkgYXMgaWZlcXVhbCBlbmRpZmVxdWFsIHNzaSBub3cgd2l0aCBjeWNsZSB1cmwgZmlsdGVyICcgK1xuICAgICAgICAnZW5kZmlsdGVyIGRlYnVnIGJsb2NrIGVuZGJsb2NrIGVsc2UgYXV0b2VzY2FwZSBlbmRhdXRvZXNjYXBlIGNzcmZfdG9rZW4gZW1wdHkgZWxpZiAnICtcbiAgICAgICAgJ2VuZHdpdGggc3RhdGljIHRyYW5zIGJsb2NrdHJhbnMgZW5kYmxvY2t0cmFucyBnZXRfc3RhdGljX3ByZWZpeCBnZXRfbWVkaWFfcHJlZml4ICcgK1xuICAgICAgICAncGx1cmFsIGdldF9jdXJyZW50X2xhbmd1YWdlIGxhbmd1YWdlIGdldF9hdmFpbGFibGVfbGFuZ3VhZ2VzICcgK1xuICAgICAgICAnZ2V0X2N1cnJlbnRfbGFuZ3VhZ2VfYmlkaSBnZXRfbGFuZ3VhZ2VfaW5mbyBnZXRfbGFuZ3VhZ2VfaW5mb19saXN0IGxvY2FsaXplICcgK1xuICAgICAgICAnZW5kbG9jYWxpemUgbG9jYWx0aW1lIGVuZGxvY2FsdGltZSB0aW1lem9uZSBlbmR0aW1lem9uZSBnZXRfY3VycmVudF90aW1lem9uZScsXG4gICAgICBjb250YWluczogW0ZJTFRFUl1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgIGJlZ2luOiAne3snLCBlbmQ6ICd9fScsXG4gICAgICBjb250YWluczogW0ZJTFRFUl1cbiAgICB9XG4gIF07XG5cbiAgdmFyIHJlc3VsdCA9IGNvcHkoaGxqcy5MQU5HVUFHRVMueG1sKTtcbiAgcmVzdWx0LmNhc2VfaW5zZW5zaXRpdmUgPSB0cnVlO1xuICByZXR1cm4gcmVzdWx0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBmbG93OiAnaWYgZWxzZSBnb3RvIGZvciBpbiBkbyBjYWxsIGV4aXQgbm90IGV4aXN0IGVycm9ybGV2ZWwgZGVmaW5lZCBlcXUgbmVxIGxzcyBsZXEgZ3RyIGdlcScsXG4gICAgICBrZXl3b3JkOiAnc2hpZnQgY2QgZGlyIGVjaG8gc2V0bG9jYWwgZW5kbG9jYWwgc2V0IHBhdXNlIGNvcHknLFxuICAgICAgc3RyZWFtOiAncHJuIG51bCBscHQzIGxwdDIgbHB0MSBjb24gY29tNCBjb20zIGNvbTIgY29tMSBhdXgnLFxuICAgICAgd2ludXRpbHM6ICdwaW5nIG5ldCBpcGNvbmZpZyB0YXNra2lsbCB4Y29weSByZW4gZGVsJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW52dmFyJywgYmVnaW46ICclJVteIF0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbnZ2YXInLCBiZWdpbjogJyVbXiBdKz8lJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW52dmFyJywgYmVnaW46ICchW14gXSs/ISdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnXFxcXGJcXFxcZCsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ0A/cmVtJywgZW5kOiAnJCdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBzcGVjaWFsX2Z1bmN0aW9uczpcbiAgICAgICAgJ3NwYXduIHNwYXduX2xpbmsgc2VsZicsXG4gICAgICByZXNlcnZlZDpcbiAgICAgICAgJ2FmdGVyIGFuZCBhbmRhbHNvfDEwIGJhbmQgYmVnaW4gYm5vdCBib3IgYnNsIGJzciBieG9yIGNhc2UgY2F0Y2ggY29uZCBkaXYgZW5kIGZ1biBpZiAnICtcbiAgICAgICAgJ2xldCBub3Qgb2Ygb3Igb3JlbHNlfDEwIHF1ZXJ5IHJlY2VpdmUgcmVtIHRyeSB3aGVuIHhvcidcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3Byb21wdCcsIGJlZ2luOiAnXlswLTldKz4gJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnJScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKFxcXFxkKyNbYS1mQS1GMC05XSt8XFxcXGQrKFxcXFwuXFxcXGQrKT8oW2VFXVstK10/XFxcXGQrKT8pJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29uc3RhbnQnLCBiZWdpbjogJ1xcXFw/KDo6KT8oW0EtWl1cXFxcdyooOjopPykrJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXJyb3cnLCBiZWdpbjogJy0+J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnb2snLCBiZWdpbjogJ29rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZXhjbGFtYXRpb25fbWFyaycsIGJlZ2luOiAnISdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uX29yX2F0b20nLFxuICAgICAgICBiZWdpbjogJyhcXFxcYlthLXpcXCddW2EtekEtWjAtOV9cXCddKjpbYS16XFwnXVthLXpBLVowLTlfXFwnXSopfChcXFxcYlthLXpcXCddW2EtekEtWjAtOV9cXCddKiknLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICdbQS1aXVthLXpBLVowLTlfXFwnXSonLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQkFTSUNfQVRPTV9SRSA9ICdbYS16XFwnXVthLXpBLVowLTlfXFwnXSonO1xuICB2YXIgRlVOQ1RJT05fTkFNRV9SRSA9ICcoJyArIEJBU0lDX0FUT01fUkUgKyAnOicgKyBCQVNJQ19BVE9NX1JFICsgJ3wnICsgQkFTSUNfQVRPTV9SRSArICcpJztcbiAgdmFyIEVSTEFOR19SRVNFUlZFRCA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2FmdGVyIGFuZCBhbmRhbHNvfDEwIGJhbmQgYmVnaW4gYm5vdCBib3IgYnNsIGJ6ciBieG9yIGNhc2UgY2F0Y2ggY29uZCBkaXYgZW5kIGZ1biBsZXQgJyArXG4gICAgICAnbm90IG9mIG9yZWxzZXwxMCBxdWVyeSByZWNlaXZlIHJlbSB0cnkgd2hlbiB4b3InLFxuICAgIGxpdGVyYWw6XG4gICAgICAnZmFsc2UgdHJ1ZSdcbiAgfTtcblxuICB2YXIgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJyUnLCBlbmQ6ICckJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiAnXFxcXGIoXFxcXGQrI1thLWZBLUYwLTldK3xcXFxcZCsoXFxcXC5cXFxcZCspPyhbZUVdWy0rXT9cXFxcZCspPyknLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgTkFNRURfRlVOID0ge1xuICAgIGJlZ2luOiAnZnVuXFxcXHMrJyArIEJBU0lDX0FUT01fUkUgKyAnL1xcXFxkKydcbiAgfTtcbiAgdmFyIEZVTkNUSU9OX0NBTEwgPSB7XG4gICAgYmVnaW46IEZVTkNUSU9OX05BTUVfUkUgKyAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uX25hbWUnLCBiZWdpbjogRlVOQ1RJT05fTkFNRV9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgLy8gXCJjb250YWluc1wiIGRlZmluZWQgbGF0ZXJcbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHZhciBUVVBMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0dXBsZScsXG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgcmVsZXZhbmNlOiAwXG4gICAgLy8gXCJjb250YWluc1wiIGRlZmluZWQgbGF0ZXJcbiAgfTtcbiAgdmFyIFZBUjEgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAnXFxcXGJfKFtBLVpdW0EtWmEtejAtOV9dKik/JyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFZBUjIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAnW0EtWl1bYS16QS1aMC05X10qJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFJFQ09SRF9BQ0NFU1MgPSB7XG4gICAgYmVnaW46ICcjJywgZW5kOiAnfScsXG4gICAgaWxsZWdhbDogJy4nLFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWNvcmRfbmFtZScsXG4gICAgICAgIGJlZ2luOiAnIycgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICd7JywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAvLyBcImNvbnRhaW5zXCIgZGVmaW5lZCBsYXRlclxuICAgICAgfVxuICAgIF1cbiAgfTtcblxuICB2YXIgQkxPQ0tfU1RBVEVNRU5UUyA9IHtcbiAgICBrZXl3b3JkczogRVJMQU5HX1JFU0VSVkVELFxuICAgIGJlZ2luOiAnKGZ1bnxyZWNlaXZlfGlmfHRyeXxjYXNlKScsIGVuZDogJ2VuZCdcbiAgfTtcbiAgQkxPQ0tfU1RBVEVNRU5UUy5jb250YWlucyA9IFtcbiAgICBDT01NRU5ULFxuICAgIE5BTUVEX0ZVTixcbiAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7Y2xhc3NOYW1lOiAnJ30pLFxuICAgIEJMT0NLX1NUQVRFTUVOVFMsXG4gICAgRlVOQ1RJT05fQ0FMTCxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIE5VTUJFUixcbiAgICBUVVBMRSxcbiAgICBWQVIxLCBWQVIyLFxuICAgIFJFQ09SRF9BQ0NFU1NcbiAgXTtcblxuICB2YXIgQkFTSUNfTU9ERVMgPSBbXG4gICAgQ09NTUVOVCxcbiAgICBOQU1FRF9GVU4sXG4gICAgQkxPQ0tfU1RBVEVNRU5UUyxcbiAgICBGVU5DVElPTl9DQUxMLFxuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgTlVNQkVSLFxuICAgIFRVUExFLFxuICAgIFZBUjEsIFZBUjIsXG4gICAgUkVDT1JEX0FDQ0VTU1xuICBdO1xuICBGVU5DVElPTl9DQUxMLmNvbnRhaW5zWzFdLmNvbnRhaW5zID0gQkFTSUNfTU9ERVM7XG4gIFRVUExFLmNvbnRhaW5zID0gQkFTSUNfTU9ERVM7XG4gIFJFQ09SRF9BQ0NFU1MuY29udGFpbnNbMV0uY29udGFpbnMgPSBCQVNJQ19NT0RFUztcblxuICB2YXIgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogQkFTSUNfTU9ERVNcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogRVJMQU5HX1JFU0VSVkVELFxuICAgIGlsbGVnYWw6ICcoPC98XFxcXCo9fFxcXFwrPXwtPXwvPXwvXFxcXCp8XFxcXCovfFxcXFwoXFxcXCp8XFxcXCpcXFxcKSknLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW46ICdeJyArIEJBU0lDX0FUT01fUkUgKyAnXFxcXHMqXFxcXCgnLCBlbmQ6ICctPicsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXCh8I3wvL3wvXFxcXCp8XFxcXFxcXFx8OicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgUEFSQU1TLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IEJBU0lDX0FUT01fUkVcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJzt8XFxcXC4nLFxuICAgICAgICAgIGtleXdvcmRzOiBFUkxBTkdfUkVTRVJWRUQsXG4gICAgICAgICAgY29udGFpbnM6IEJBU0lDX01PREVTXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBDT01NRU5ULFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcCcsXG4gICAgICAgIGJlZ2luOiAnXi0nLCBlbmQ6ICdcXFxcLicsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGxleGVtczogJy0nICsgaGxqcy5JREVOVF9SRSxcbiAgICAgICAga2V5d29yZHM6XG4gICAgICAgICAgJy1tb2R1bGUgLXJlY29yZCAtdW5kZWYgLWV4cG9ydCAtaWZkZWYgLWlmbmRlZiAtYXV0aG9yIC1jb3B5cmlnaHQgLWRvYyAtdnNuICcgK1xuICAgICAgICAgICctaW1wb3J0IC1pbmNsdWRlIC1pbmNsdWRlX2xpYiAtY29tcGlsZSAtZGVmaW5lIC1lbHNlIC1lbmRpZiAtZmlsZSAtYmVoYXZpb3VyICcgK1xuICAgICAgICAgICctYmVoYXZpb3InLFxuICAgICAgICBjb250YWluczogW1BBUkFNU11cbiAgICAgIH0sXG4gICAgICBOVU1CRVIsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgUkVDT1JEX0FDQ0VTUyxcbiAgICAgIFZBUjEsIFZBUjIsXG4gICAgICBUVVBMRVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhdG9taWNfdWludCBhdHRyaWJ1dGUgYm9vbCBicmVhayBidmVjMiBidmVjMyBidmVjNCBjYXNlIGNlbnRyb2lkIGNvaGVyZW50IGNvbnN0IGNvbnRpbnVlIGRlZmF1bHQgJyArXG4gICAgICAgICdkaXNjYXJkIGRtYXQyIGRtYXQyeDIgZG1hdDJ4MyBkbWF0Mng0IGRtYXQzIGRtYXQzeDIgZG1hdDN4MyBkbWF0M3g0IGRtYXQ0IGRtYXQ0eDIgZG1hdDR4MyAnICtcbiAgICAgICAgJ2RtYXQ0eDQgZG8gZG91YmxlIGR2ZWMyIGR2ZWMzIGR2ZWM0IGVsc2UgZmxhdCBmbG9hdCBmb3IgaGlnaHAgaWYgaWltYWdlMUQgaWltYWdlMURBcnJheSAnICtcbiAgICAgICAgJ2lpbWFnZTJEIGlpbWFnZTJEQXJyYXkgaWltYWdlMkRNUyBpaW1hZ2UyRE1TQXJyYXkgaWltYWdlMkRSZWN0IGlpbWFnZTNEIGlpbWFnZUJ1ZmZlciBpaW1hZ2VDdWJlICcgK1xuICAgICAgICAnaWltYWdlQ3ViZUFycmF5IGltYWdlMUQgaW1hZ2UxREFycmF5IGltYWdlMkQgaW1hZ2UyREFycmF5IGltYWdlMkRNUyBpbWFnZTJETVNBcnJheSBpbWFnZTJEUmVjdCAnICtcbiAgICAgICAgJ2ltYWdlM0QgaW1hZ2VCdWZmZXIgaW1hZ2VDdWJlIGltYWdlQ3ViZUFycmF5IGluIGlub3V0IGludCBpbnZhcmlhbnQgaXNhbXBsZXIxRCBpc2FtcGxlcjFEQXJyYXkgJyArXG4gICAgICAgICdpc2FtcGxlcjJEIGlzYW1wbGVyMkRBcnJheSBpc2FtcGxlcjJETVMgaXNhbXBsZXIyRE1TQXJyYXkgaXNhbXBsZXIyRFJlY3QgaXNhbXBsZXIzRCBpc2FtcGxlckJ1ZmZlciAnICtcbiAgICAgICAgJ2lzYW1wbGVyQ3ViZSBpc2FtcGxlckN1YmVBcnJheSBpdmVjMiBpdmVjMyBpdmVjNCBsYXlvdXQgbG93cCBtYXQyIG1hdDJ4MiBtYXQyeDMgbWF0Mng0IG1hdDMgbWF0M3gyICcgK1xuICAgICAgICAnbWF0M3gzIG1hdDN4NCBtYXQ0IG1hdDR4MiBtYXQ0eDMgbWF0NHg0IG1lZGl1bXAgbm9wZXJzcGVjdGl2ZSBvdXQgcGF0Y2ggcHJlY2lzaW9uIHJlYWRvbmx5IHJlc3RyaWN0ICcgK1xuICAgICAgICAncmV0dXJuIHNhbXBsZSBzYW1wbGVyMUQgc2FtcGxlcjFEQXJyYXkgc2FtcGxlcjFEQXJyYXlTaGFkb3cgc2FtcGxlcjFEU2hhZG93IHNhbXBsZXIyRCBzYW1wbGVyMkRBcnJheSAnICtcbiAgICAgICAgJ3NhbXBsZXIyREFycmF5U2hhZG93IHNhbXBsZXIyRE1TIHNhbXBsZXIyRE1TQXJyYXkgc2FtcGxlcjJEUmVjdCBzYW1wbGVyMkRSZWN0U2hhZG93IHNhbXBsZXIyRFNoYWRvdyAnICtcbiAgICAgICAgJ3NhbXBsZXIzRCBzYW1wbGVyQnVmZmVyIHNhbXBsZXJDdWJlIHNhbXBsZXJDdWJlQXJyYXkgc2FtcGxlckN1YmVBcnJheVNoYWRvdyBzYW1wbGVyQ3ViZVNoYWRvdyBzbW9vdGggJyArXG4gICAgICAgICdzdHJ1Y3Qgc3Vicm91dGluZSBzd2l0Y2ggdWltYWdlMUQgdWltYWdlMURBcnJheSB1aW1hZ2UyRCB1aW1hZ2UyREFycmF5IHVpbWFnZTJETVMgdWltYWdlMkRNU0FycmF5ICcgK1xuICAgICAgICAndWltYWdlMkRSZWN0IHVpbWFnZTNEIHVpbWFnZUJ1ZmZlciB1aW1hZ2VDdWJlIHVpbWFnZUN1YmVBcnJheSB1aW50IHVuaWZvcm0gdXNhbXBsZXIxRCB1c2FtcGxlcjFEQXJyYXkgJyArXG4gICAgICAgICd1c2FtcGxlcjJEIHVzYW1wbGVyMkRBcnJheSB1c2FtcGxlcjJETVMgdXNhbXBsZXIyRE1TQXJyYXkgdXNhbXBsZXIyRFJlY3QgdXNhbXBsZXIzRCB1c2FtcGxlckJ1ZmZlciAnICtcbiAgICAgICAgJ3VzYW1wbGVyQ3ViZSB1c2FtcGxlckN1YmVBcnJheSB1dmVjMiB1dmVjMyB1dmVjNCB2YXJ5aW5nIHZlYzIgdmVjMyB2ZWM0IHZvaWQgdm9sYXRpbGUgd2hpbGUgd3JpdGVvbmx5JyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnZ2xfQmFja0NvbG9yIGdsX0JhY2tMaWdodE1vZGVsUHJvZHVjdCBnbF9CYWNrTGlnaHRQcm9kdWN0IGdsX0JhY2tNYXRlcmlhbCAnICtcbiAgICAgICAgJ2dsX0JhY2tTZWNvbmRhcnlDb2xvciBnbF9DbGlwRGlzdGFuY2UgZ2xfQ2xpcFBsYW5lIGdsX0NsaXBWZXJ0ZXggZ2xfQ29sb3IgJyArXG4gICAgICAgICdnbF9EZXB0aFJhbmdlIGdsX0V5ZVBsYW5lUSBnbF9FeWVQbGFuZVIgZ2xfRXllUGxhbmVTIGdsX0V5ZVBsYW5lVCBnbF9Gb2cgZ2xfRm9nQ29vcmQgJyArXG4gICAgICAgICdnbF9Gb2dGcmFnQ29vcmQgZ2xfRnJhZ0NvbG9yIGdsX0ZyYWdDb29yZCBnbF9GcmFnRGF0YSBnbF9GcmFnRGVwdGggZ2xfRnJvbnRDb2xvciAnICtcbiAgICAgICAgJ2dsX0Zyb250RmFjaW5nIGdsX0Zyb250TGlnaHRNb2RlbFByb2R1Y3QgZ2xfRnJvbnRMaWdodFByb2R1Y3QgZ2xfRnJvbnRNYXRlcmlhbCAnICtcbiAgICAgICAgJ2dsX0Zyb250U2Vjb25kYXJ5Q29sb3IgZ2xfSW5zdGFuY2VJRCBnbF9JbnZvY2F0aW9uSUQgZ2xfTGF5ZXIgZ2xfTGlnaHRNb2RlbCAnICtcbiAgICAgICAgJ2dsX0xpZ2h0U291cmNlIGdsX01heEF0b21pY0NvdW50ZXJCaW5kaW5ncyBnbF9NYXhBdG9taWNDb3VudGVyQnVmZmVyU2l6ZSAnICtcbiAgICAgICAgJ2dsX01heENsaXBEaXN0YW5jZXMgZ2xfTWF4Q2xpcFBsYW5lcyBnbF9NYXhDb21iaW5lZEF0b21pY0NvdW50ZXJCdWZmZXJzICcgK1xuICAgICAgICAnZ2xfTWF4Q29tYmluZWRBdG9taWNDb3VudGVycyBnbF9NYXhDb21iaW5lZEltYWdlVW5pZm9ybXMgZ2xfTWF4Q29tYmluZWRJbWFnZVVuaXRzQW5kRnJhZ21lbnRPdXRwdXRzICcgK1xuICAgICAgICAnZ2xfTWF4Q29tYmluZWRUZXh0dXJlSW1hZ2VVbml0cyBnbF9NYXhEcmF3QnVmZmVycyBnbF9NYXhGcmFnbWVudEF0b21pY0NvdW50ZXJCdWZmZXJzICcgK1xuICAgICAgICAnZ2xfTWF4RnJhZ21lbnRBdG9taWNDb3VudGVycyBnbF9NYXhGcmFnbWVudEltYWdlVW5pZm9ybXMgZ2xfTWF4RnJhZ21lbnRJbnB1dENvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhGcmFnbWVudFVuaWZvcm1Db21wb25lbnRzIGdsX01heEZyYWdtZW50VW5pZm9ybVZlY3RvcnMgZ2xfTWF4R2VvbWV0cnlBdG9taWNDb3VudGVyQnVmZmVycyAnICtcbiAgICAgICAgJ2dsX01heEdlb21ldHJ5QXRvbWljQ291bnRlcnMgZ2xfTWF4R2VvbWV0cnlJbWFnZVVuaWZvcm1zIGdsX01heEdlb21ldHJ5SW5wdXRDb21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4R2VvbWV0cnlPdXRwdXRDb21wb25lbnRzIGdsX01heEdlb21ldHJ5T3V0cHV0VmVydGljZXMgZ2xfTWF4R2VvbWV0cnlUZXh0dXJlSW1hZ2VVbml0cyAnICtcbiAgICAgICAgJ2dsX01heEdlb21ldHJ5VG90YWxPdXRwdXRDb21wb25lbnRzIGdsX01heEdlb21ldHJ5VW5pZm9ybUNvbXBvbmVudHMgZ2xfTWF4R2VvbWV0cnlWYXJ5aW5nQ29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heEltYWdlU2FtcGxlcyBnbF9NYXhJbWFnZVVuaXRzIGdsX01heExpZ2h0cyBnbF9NYXhQYXRjaFZlcnRpY2VzIGdsX01heFByb2dyYW1UZXhlbE9mZnNldCAnICtcbiAgICAgICAgJ2dsX01heFRlc3NDb250cm9sQXRvbWljQ291bnRlckJ1ZmZlcnMgZ2xfTWF4VGVzc0NvbnRyb2xBdG9taWNDb3VudGVycyBnbF9NYXhUZXNzQ29udHJvbEltYWdlVW5pZm9ybXMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzQ29udHJvbElucHV0Q29tcG9uZW50cyBnbF9NYXhUZXNzQ29udHJvbE91dHB1dENvbXBvbmVudHMgZ2xfTWF4VGVzc0NvbnRyb2xUZXh0dXJlSW1hZ2VVbml0cyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NDb250cm9sVG90YWxPdXRwdXRDb21wb25lbnRzIGdsX01heFRlc3NDb250cm9sVW5pZm9ybUNvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzRXZhbHVhdGlvbkF0b21pY0NvdW50ZXJCdWZmZXJzIGdsX01heFRlc3NFdmFsdWF0aW9uQXRvbWljQ291bnRlcnMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzRXZhbHVhdGlvbkltYWdlVW5pZm9ybXMgZ2xfTWF4VGVzc0V2YWx1YXRpb25JbnB1dENvbXBvbmVudHMgZ2xfTWF4VGVzc0V2YWx1YXRpb25PdXRwdXRDb21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0V2YWx1YXRpb25UZXh0dXJlSW1hZ2VVbml0cyBnbF9NYXhUZXNzRXZhbHVhdGlvblVuaWZvcm1Db21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0dlbkxldmVsIGdsX01heFRlc3NQYXRjaENvbXBvbmVudHMgZ2xfTWF4VGV4dHVyZUNvb3JkcyBnbF9NYXhUZXh0dXJlSW1hZ2VVbml0cyAnICtcbiAgICAgICAgJ2dsX01heFRleHR1cmVVbml0cyBnbF9NYXhWYXJ5aW5nQ29tcG9uZW50cyBnbF9NYXhWYXJ5aW5nRmxvYXRzIGdsX01heFZhcnlpbmdWZWN0b3JzICcgK1xuICAgICAgICAnZ2xfTWF4VmVydGV4QXRvbWljQ291bnRlckJ1ZmZlcnMgZ2xfTWF4VmVydGV4QXRvbWljQ291bnRlcnMgZ2xfTWF4VmVydGV4QXR0cmlicyAnICtcbiAgICAgICAgJ2dsX01heFZlcnRleEltYWdlVW5pZm9ybXMgZ2xfTWF4VmVydGV4T3V0cHV0Q29tcG9uZW50cyBnbF9NYXhWZXJ0ZXhUZXh0dXJlSW1hZ2VVbml0cyAnICtcbiAgICAgICAgJ2dsX01heFZlcnRleFVuaWZvcm1Db21wb25lbnRzIGdsX01heFZlcnRleFVuaWZvcm1WZWN0b3JzIGdsX01heFZpZXdwb3J0cyBnbF9NaW5Qcm9ncmFtVGV4ZWxPZmZzZXQnK1xuICAgICAgICAnZ2xfTW9kZWxWaWV3TWF0cml4IGdsX01vZGVsVmlld01hdHJpeEludmVyc2UgZ2xfTW9kZWxWaWV3TWF0cml4SW52ZXJzZVRyYW5zcG9zZSAnICtcbiAgICAgICAgJ2dsX01vZGVsVmlld01hdHJpeFRyYW5zcG9zZSBnbF9Nb2RlbFZpZXdQcm9qZWN0aW9uTWF0cml4IGdsX01vZGVsVmlld1Byb2plY3Rpb25NYXRyaXhJbnZlcnNlICcgK1xuICAgICAgICAnZ2xfTW9kZWxWaWV3UHJvamVjdGlvbk1hdHJpeEludmVyc2VUcmFuc3Bvc2UgZ2xfTW9kZWxWaWV3UHJvamVjdGlvbk1hdHJpeFRyYW5zcG9zZSAnICtcbiAgICAgICAgJ2dsX011bHRpVGV4Q29vcmQwIGdsX011bHRpVGV4Q29vcmQxIGdsX011bHRpVGV4Q29vcmQyIGdsX011bHRpVGV4Q29vcmQzIGdsX011bHRpVGV4Q29vcmQ0ICcgK1xuICAgICAgICAnZ2xfTXVsdGlUZXhDb29yZDUgZ2xfTXVsdGlUZXhDb29yZDYgZ2xfTXVsdGlUZXhDb29yZDcgZ2xfTm9ybWFsIGdsX05vcm1hbE1hdHJpeCAnICtcbiAgICAgICAgJ2dsX05vcm1hbFNjYWxlIGdsX09iamVjdFBsYW5lUSBnbF9PYmplY3RQbGFuZVIgZ2xfT2JqZWN0UGxhbmVTIGdsX09iamVjdFBsYW5lVCBnbF9QYXRjaFZlcnRpY2VzSW4gJyArXG4gICAgICAgICdnbF9QZXJWZXJ0ZXggZ2xfUG9pbnQgZ2xfUG9pbnRDb29yZCBnbF9Qb2ludFNpemUgZ2xfUG9zaXRpb24gZ2xfUHJpbWl0aXZlSUQgZ2xfUHJpbWl0aXZlSURJbiAnICtcbiAgICAgICAgJ2dsX1Byb2plY3Rpb25NYXRyaXggZ2xfUHJvamVjdGlvbk1hdHJpeEludmVyc2UgZ2xfUHJvamVjdGlvbk1hdHJpeEludmVyc2VUcmFuc3Bvc2UgJyArXG4gICAgICAgICdnbF9Qcm9qZWN0aW9uTWF0cml4VHJhbnNwb3NlIGdsX1NhbXBsZUlEIGdsX1NhbXBsZU1hc2sgZ2xfU2FtcGxlTWFza0luIGdsX1NhbXBsZVBvc2l0aW9uICcgK1xuICAgICAgICAnZ2xfU2Vjb25kYXJ5Q29sb3IgZ2xfVGVzc0Nvb3JkIGdsX1Rlc3NMZXZlbElubmVyIGdsX1Rlc3NMZXZlbE91dGVyIGdsX1RleENvb3JkIGdsX1RleHR1cmVFbnZDb2xvciAnICtcbiAgICAgICAgJ2dsX1RleHR1cmVNYXRyaXhJbnZlcnNlVHJhbnNwb3NlIGdsX1RleHR1cmVNYXRyaXhUcmFuc3Bvc2UgZ2xfVmVydGV4IGdsX1ZlcnRleElEICcgK1xuICAgICAgICAnZ2xfVmlld3BvcnRJbmRleCBnbF9pbiBnbF9vdXQgRW1pdFN0cmVhbVZlcnRleCBFbWl0VmVydGV4IEVuZFByaW1pdGl2ZSBFbmRTdHJlYW1QcmltaXRpdmUgJyArXG4gICAgICAgICdhYnMgYWNvcyBhY29zaCBhbGwgYW55IGFzaW4gYXNpbmggYXRhbiBhdGFuaCBhdG9taWNDb3VudGVyIGF0b21pY0NvdW50ZXJEZWNyZW1lbnQgJyArXG4gICAgICAgICdhdG9taWNDb3VudGVySW5jcmVtZW50IGJhcnJpZXIgYml0Q291bnQgYml0ZmllbGRFeHRyYWN0IGJpdGZpZWxkSW5zZXJ0IGJpdGZpZWxkUmV2ZXJzZSAnICtcbiAgICAgICAgJ2NlaWwgY2xhbXAgY29zIGNvc2ggY3Jvc3MgZEZkeCBkRmR5IGRlZ3JlZXMgZGV0ZXJtaW5hbnQgZGlzdGFuY2UgZG90IGVxdWFsIGV4cCBleHAyIGZhY2Vmb3J3YXJkICcgK1xuICAgICAgICAnZmluZExTQiBmaW5kTVNCIGZsb2F0Qml0c1RvSW50IGZsb2F0Qml0c1RvVWludCBmbG9vciBmbWEgZnJhY3QgZnJleHAgZnRyYW5zZm9ybSBmd2lkdGggZ3JlYXRlclRoYW4gJyArXG4gICAgICAgICdncmVhdGVyVGhhbkVxdWFsIGltYWdlQXRvbWljQWRkIGltYWdlQXRvbWljQW5kIGltYWdlQXRvbWljQ29tcFN3YXAgaW1hZ2VBdG9taWNFeGNoYW5nZSAnICtcbiAgICAgICAgJ2ltYWdlQXRvbWljTWF4IGltYWdlQXRvbWljTWluIGltYWdlQXRvbWljT3IgaW1hZ2VBdG9taWNYb3IgaW1hZ2VMb2FkIGltYWdlU3RvcmUgaW11bEV4dGVuZGVkICcgK1xuICAgICAgICAnaW50Qml0c1RvRmxvYXQgaW50ZXJwb2xhdGVBdENlbnRyb2lkIGludGVycG9sYXRlQXRPZmZzZXQgaW50ZXJwb2xhdGVBdFNhbXBsZSBpbnZlcnNlIGludmVyc2VzcXJ0ICcgK1xuICAgICAgICAnaXNpbmYgaXNuYW4gbGRleHAgbGVuZ3RoIGxlc3NUaGFuIGxlc3NUaGFuRXF1YWwgbG9nIGxvZzIgbWF0cml4Q29tcE11bHQgbWF4IG1lbW9yeUJhcnJpZXIgJyArXG4gICAgICAgICdtaW4gbWl4IG1vZCBtb2RmIG5vaXNlMSBub2lzZTIgbm9pc2UzIG5vaXNlNCBub3JtYWxpemUgbm90IG5vdEVxdWFsIG91dGVyUHJvZHVjdCBwYWNrRG91YmxlMngzMiAnICtcbiAgICAgICAgJ3BhY2tIYWxmMngxNiBwYWNrU25vcm0yeDE2IHBhY2tTbm9ybTR4OCBwYWNrVW5vcm0yeDE2IHBhY2tVbm9ybTR4OCBwb3cgcmFkaWFucyByZWZsZWN0IHJlZnJhY3QgJyArXG4gICAgICAgICdyb3VuZCByb3VuZEV2ZW4gc2hhZG93MUQgc2hhZG93MURMb2Qgc2hhZG93MURQcm9qIHNoYWRvdzFEUHJvakxvZCBzaGFkb3cyRCBzaGFkb3cyRExvZCBzaGFkb3cyRFByb2ogJyArXG4gICAgICAgICdzaGFkb3cyRFByb2pMb2Qgc2lnbiBzaW4gc2luaCBzbW9vdGhzdGVwIHNxcnQgc3RlcCB0YW4gdGFuaCB0ZXhlbEZldGNoIHRleGVsRmV0Y2hPZmZzZXQgdGV4dHVyZSAnICtcbiAgICAgICAgJ3RleHR1cmUxRCB0ZXh0dXJlMURMb2QgdGV4dHVyZTFEUHJvaiB0ZXh0dXJlMURQcm9qTG9kIHRleHR1cmUyRCB0ZXh0dXJlMkRMb2QgdGV4dHVyZTJEUHJvaiAnICtcbiAgICAgICAgJ3RleHR1cmUyRFByb2pMb2QgdGV4dHVyZTNEIHRleHR1cmUzRExvZCB0ZXh0dXJlM0RQcm9qIHRleHR1cmUzRFByb2pMb2QgdGV4dHVyZUN1YmUgdGV4dHVyZUN1YmVMb2QgJyArXG4gICAgICAgICd0ZXh0dXJlR2F0aGVyIHRleHR1cmVHYXRoZXJPZmZzZXQgdGV4dHVyZUdhdGhlck9mZnNldHMgdGV4dHVyZUdyYWQgdGV4dHVyZUdyYWRPZmZzZXQgdGV4dHVyZUxvZCAnICtcbiAgICAgICAgJ3RleHR1cmVMb2RPZmZzZXQgdGV4dHVyZU9mZnNldCB0ZXh0dXJlUHJvaiB0ZXh0dXJlUHJvakdyYWQgdGV4dHVyZVByb2pHcmFkT2Zmc2V0IHRleHR1cmVQcm9qTG9kICcgK1xuICAgICAgICAndGV4dHVyZVByb2pMb2RPZmZzZXQgdGV4dHVyZVByb2pPZmZzZXQgdGV4dHVyZVF1ZXJ5TG9kIHRleHR1cmVTaXplIHRyYW5zcG9zZSB0cnVuYyB1YWRkQ2FycnkgJyArXG4gICAgICAgICd1aW50Qml0c1RvRmxvYXQgdW11bEV4dGVuZGVkIHVucGFja0RvdWJsZTJ4MzIgdW5wYWNrSGFsZjJ4MTYgdW5wYWNrU25vcm0yeDE2IHVucGFja1Nub3JtNHg4ICcgK1xuICAgICAgICAndW5wYWNrVW5vcm0yeDE2IHVucGFja1Vub3JtNHg4IHVzdWJCb3Jyb3cgZ2xfVGV4dHVyZU1hdHJpeCBnbF9UZXh0dXJlTWF0cml4SW52ZXJzZScsXG4gICAgICBsaXRlcmFsOiAndHJ1ZSBmYWxzZSdcbiAgICB9LFxuICAgIGlsbGVnYWw6ICdcIicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEdPX0tFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnYnJlYWsgZGVmYXVsdCBmdW5jIGludGVyZmFjZSBzZWxlY3QgY2FzZSBtYXAgc3RydWN0IGNoYW4gZWxzZSBnb3RvIHBhY2thZ2Ugc3dpdGNoICcgK1xuICAgICAgJ2NvbnN0IGZhbGx0aHJvdWdoIGlmIHJhbmdlIHR5cGUgY29udGludWUgZm9yIGltcG9ydCByZXR1cm4gdmFyIGdvIGRlZmVyJyxcbiAgICBjb25zdGFudDpcbiAgICAgICAndHJ1ZSBmYWxzZSBpb3RhIG5pbCcsXG4gICAgdHlwZW5hbWU6XG4gICAgICAnYm9vbCBieXRlIGNvbXBsZXg2NCBjb21wbGV4MTI4IGZsb2F0MzIgZmxvYXQ2NCBpbnQ4IGludDE2IGludDMyIGludDY0IHN0cmluZyB1aW50OCAnICtcbiAgICAgICd1aW50MTYgdWludDMyIHVpbnQ2NCBpbnQgdWludCB1aW50cHRyIHJ1bmUnLFxuICAgIGJ1aWx0X2luOlxuICAgICAgJ2FwcGVuZCBjYXAgY2xvc2UgY29tcGxleCBjb3B5IGltYWcgbGVuIG1ha2UgbmV3IHBhbmljIHByaW50IHByaW50bG4gcmVhbCByZWNvdmVyIGRlbGV0ZSdcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogR09fS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnW15cXFxcXFxcXF1cXCcnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1teYS16QS1aXzAtOV0oXFxcXC18XFxcXCspP1xcXFxkKyhcXFxcLlxcXFxkK3xcXFxcL1xcXFxkKyk/KChkfGV8ZnxsfHMpKFxcXFwrfFxcXFwtKT9cXFxcZCspPycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBUWVBFID0ge1xuICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgIGJlZ2luOiAnXFxcXGJbQS1aXVtcXFxcd1xcJ10qJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIENPTlRBSU5FUiA9IHtcbiAgICBjbGFzc05hbWU6ICdjb250YWluZXInLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtjbGFzc05hbWU6ICd0eXBlJywgYmVnaW46ICdcXFxcYltBLVpdW1xcXFx3XSooXFxcXCgoXFxcXC5cXFxcLnwsfFxcXFx3KylcXFxcKSk/J30sXG4gICAgICB7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogJ1tfYS16XVtcXFxcd1xcJ10qJ31cbiAgICBdXG4gIH07XG4gIHZhciBDT05UQUlORVIyID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbnRhaW5lcicsXG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgY29udGFpbnM6IENPTlRBSU5FUi5jb250YWluc1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdsZXQgaW4gaWYgdGhlbiBlbHNlIGNhc2Ugb2Ygd2hlcmUgZG8gbW9kdWxlIGltcG9ydCBoaWRpbmcgcXVhbGlmaWVkIHR5cGUgZGF0YSAnICtcbiAgICAgICduZXd0eXBlIGRlcml2aW5nIGNsYXNzIGluc3RhbmNlIG5vdCBhcyBmb3JlaWduIGNjYWxsIHNhZmUgdW5zYWZlJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICctLScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJ3stIycsIGVuZDogJyMtfSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBjb250YWluczogWydzZWxmJ10sXG4gICAgICAgIGJlZ2luOiAney0nLCBlbmQ6ICctfSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFxcXHMrXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdpbXBvcnQnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiaW1wb3J0JywgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnaW1wb3J0IHF1YWxpZmllZCBhcyBoaWRpbmcnLFxuICAgICAgICBjb250YWluczogW0NPTlRBSU5FUl0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcV1xcXFwufDsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtb2R1bGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFxibW9kdWxlJywgZW5kOiAnd2hlcmUnLFxuICAgICAgICBrZXl3b3JkczogJ21vZHVsZSB3aGVyZScsXG4gICAgICAgIGNvbnRhaW5zOiBbQ09OVEFJTkVSXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxXXFxcXC58OydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihjbGFzc3xpbnN0YW5jZSknLCBlbmQ6ICd3aGVyZScsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3Mgd2hlcmUgaW5zdGFuY2UnLFxuICAgICAgICBjb250YWluczogW1RZUEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0eXBlZGVmJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihkYXRhfChuZXcpP3R5cGUpJywgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnZGF0YSB0eXBlIG5ld3R5cGUgZGVyaXZpbmcnLFxuICAgICAgICBjb250YWluczogW1RZUEUsIENPTlRBSU5FUiwgQ09OVEFJTkVSMl1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NoZWJhbmcnLFxuICAgICAgICBiZWdpbjogJyMhXFxcXC91c3JcXFxcL2JpblxcXFwvZW52XFwgcnVuaGFza2VsbCcsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgVFlQRSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogJ15bX2Etel1bXFxcXHdcXCddKidcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsInZhciBobGpzID0gbmV3IGZ1bmN0aW9uKCkge1xuXG4gIC8qIFV0aWxpdHkgZnVuY3Rpb25zICovXG5cbiAgZnVuY3Rpb24gZXNjYXBlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoLyYvZ20sICcmYW1wOycpLnJlcGxhY2UoLzwvZ20sICcmbHQ7JykucmVwbGFjZSgvPi9nbSwgJyZndDsnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmRDb2RlKHByZSkge1xuICAgIGZvciAodmFyIG5vZGUgPSBwcmUuZmlyc3RDaGlsZDsgbm9kZTsgbm9kZSA9IG5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICAgIGlmIChub2RlLm5vZGVOYW1lID09ICdDT0RFJylcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICBpZiAoIShub2RlLm5vZGVUeXBlID09IDMgJiYgbm9kZS5ub2RlVmFsdWUubWF0Y2goL1xccysvKSkpXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJsb2NrVGV4dChibG9jaywgaWdub3JlTmV3TGluZXMpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGJsb2NrLmNoaWxkTm9kZXMsIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLm5vZGVUeXBlID09IDMpIHtcbiAgICAgICAgcmV0dXJuIGlnbm9yZU5ld0xpbmVzID8gbm9kZS5ub2RlVmFsdWUucmVwbGFjZSgvXFxuL2csICcnKSA6IG5vZGUubm9kZVZhbHVlO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT0gJ0JSJykge1xuICAgICAgICByZXR1cm4gJ1xcbic7XG4gICAgICB9XG4gICAgICByZXR1cm4gYmxvY2tUZXh0KG5vZGUsIGlnbm9yZU5ld0xpbmVzKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJsb2NrTGFuZ3VhZ2UoYmxvY2spIHtcbiAgICB2YXIgY2xhc3NlcyA9IChibG9jay5jbGFzc05hbWUgKyAnICcgKyBibG9jay5wYXJlbnROb2RlLmNsYXNzTmFtZSkuc3BsaXQoL1xccysvKTtcbiAgICBjbGFzc2VzID0gY2xhc3Nlcy5tYXAoZnVuY3Rpb24oYykge3JldHVybiBjLnJlcGxhY2UoL15sYW5ndWFnZS0vLCAnJyl9KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChsYW5ndWFnZXNbY2xhc3Nlc1tpXV0gfHwgY2xhc3Nlc1tpXSA9PSAnbm8taGlnaGxpZ2h0Jykge1xuICAgICAgICByZXR1cm4gY2xhc3Nlc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiBTdHJlYW0gbWVyZ2luZyAqL1xuXG4gIGZ1bmN0aW9uIG5vZGVTdHJlYW0obm9kZSkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAoZnVuY3Rpb24gX25vZGVTdHJlYW0obm9kZSwgb2Zmc2V0KSB7XG4gICAgICBmb3IgKHZhciBjaGlsZCA9IG5vZGUuZmlyc3RDaGlsZDsgY2hpbGQ7IGNoaWxkID0gY2hpbGQubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09IDMpXG4gICAgICAgICAgb2Zmc2V0ICs9IGNoaWxkLm5vZGVWYWx1ZS5sZW5ndGg7XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkLm5vZGVOYW1lID09ICdCUicpXG4gICAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09IDEpIHtcbiAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICBldmVudDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgICAgICAgbm9kZTogY2hpbGRcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvZmZzZXQgPSBfbm9kZVN0cmVhbShjaGlsZCwgb2Zmc2V0KTtcbiAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICBldmVudDogJ3N0b3AnLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICBub2RlOiBjaGlsZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH0pKG5vZGUsIDApO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZVN0cmVhbXMoc3RyZWFtMSwgc3RyZWFtMiwgdmFsdWUpIHtcbiAgICB2YXIgcHJvY2Vzc2VkID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdmFyIG5vZGVTdGFjayA9IFtdO1xuXG4gICAgZnVuY3Rpb24gc2VsZWN0U3RyZWFtKCkge1xuICAgICAgaWYgKHN0cmVhbTEubGVuZ3RoICYmIHN0cmVhbTIubGVuZ3RoKSB7XG4gICAgICAgIGlmIChzdHJlYW0xWzBdLm9mZnNldCAhPSBzdHJlYW0yWzBdLm9mZnNldClcbiAgICAgICAgICByZXR1cm4gKHN0cmVhbTFbMF0ub2Zmc2V0IDwgc3RyZWFtMlswXS5vZmZzZXQpID8gc3RyZWFtMSA6IHN0cmVhbTI7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgVG8gYXZvaWQgc3RhcnRpbmcgdGhlIHN0cmVhbSBqdXN0IGJlZm9yZSBpdCBzaG91bGQgc3RvcCB0aGUgb3JkZXIgaXNcbiAgICAgICAgICBlbnN1cmVkIHRoYXQgc3RyZWFtMSBhbHdheXMgc3RhcnRzIGZpcnN0IGFuZCBjbG9zZXMgbGFzdDpcblxuICAgICAgICAgIGlmIChldmVudDEgPT0gJ3N0YXJ0JyAmJiBldmVudDIgPT0gJ3N0YXJ0JylcbiAgICAgICAgICAgIHJldHVybiBzdHJlYW0xO1xuICAgICAgICAgIGlmIChldmVudDEgPT0gJ3N0YXJ0JyAmJiBldmVudDIgPT0gJ3N0b3AnKVxuICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTI7XG4gICAgICAgICAgaWYgKGV2ZW50MSA9PSAnc3RvcCcgJiYgZXZlbnQyID09ICdzdGFydCcpXG4gICAgICAgICAgICByZXR1cm4gc3RyZWFtMTtcbiAgICAgICAgICBpZiAoZXZlbnQxID09ICdzdG9wJyAmJiBldmVudDIgPT0gJ3N0b3AnKVxuICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTI7XG5cbiAgICAgICAgICAuLi4gd2hpY2ggaXMgY29sbGFwc2VkIHRvOlxuICAgICAgICAgICovXG4gICAgICAgICAgcmV0dXJuIHN0cmVhbTJbMF0uZXZlbnQgPT0gJ3N0YXJ0JyA/IHN0cmVhbTEgOiBzdHJlYW0yO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3RyZWFtMS5sZW5ndGggPyBzdHJlYW0xIDogc3RyZWFtMjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvcGVuKG5vZGUpIHtcbiAgICAgIGZ1bmN0aW9uIGF0dHJfc3RyKGEpIHtyZXR1cm4gJyAnICsgYS5ub2RlTmFtZSArICc9XCInICsgZXNjYXBlKGEudmFsdWUpICsgJ1wiJ307XG4gICAgICByZXR1cm4gJzwnICsgbm9kZS5ub2RlTmFtZSArIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChub2RlLmF0dHJpYnV0ZXMsIGF0dHJfc3RyKS5qb2luKCcnKSArICc+JztcbiAgICB9XG5cbiAgICB3aGlsZSAoc3RyZWFtMS5sZW5ndGggfHwgc3RyZWFtMi5sZW5ndGgpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gc2VsZWN0U3RyZWFtKCkuc3BsaWNlKDAsIDEpWzBdO1xuICAgICAgcmVzdWx0ICs9IGVzY2FwZSh2YWx1ZS5zdWJzdHIocHJvY2Vzc2VkLCBjdXJyZW50Lm9mZnNldCAtIHByb2Nlc3NlZCkpO1xuICAgICAgcHJvY2Vzc2VkID0gY3VycmVudC5vZmZzZXQ7XG4gICAgICBpZiAoIGN1cnJlbnQuZXZlbnQgPT0gJ3N0YXJ0Jykge1xuICAgICAgICByZXN1bHQgKz0gb3BlbihjdXJyZW50Lm5vZGUpO1xuICAgICAgICBub2RlU3RhY2sucHVzaChjdXJyZW50Lm5vZGUpO1xuICAgICAgfSBlbHNlIGlmIChjdXJyZW50LmV2ZW50ID09ICdzdG9wJykge1xuICAgICAgICB2YXIgbm9kZSwgaSA9IG5vZGVTdGFjay5sZW5ndGg7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgICAgbm9kZSA9IG5vZGVTdGFja1tpXTtcbiAgICAgICAgICByZXN1bHQgKz0gKCc8LycgKyBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgKyAnPicpO1xuICAgICAgICB9IHdoaWxlIChub2RlICE9IGN1cnJlbnQubm9kZSk7XG4gICAgICAgIG5vZGVTdGFjay5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHdoaWxlIChpIDwgbm9kZVN0YWNrLmxlbmd0aCkge1xuICAgICAgICAgIHJlc3VsdCArPSBvcGVuKG5vZGVTdGFja1tpXSk7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQgKyBlc2NhcGUodmFsdWUuc3Vic3RyKHByb2Nlc3NlZCkpO1xuICB9XG5cbiAgLyogSW5pdGlhbGl6YXRpb24gKi9cblxuICBmdW5jdGlvbiBjb21waWxlTGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcblxuICAgIGZ1bmN0aW9uIGxhbmdSZSh2YWx1ZSwgZ2xvYmFsKSB7XG4gICAgICByZXR1cm4gUmVnRXhwKFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgJ20nICsgKGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyAnaScgOiAnJykgKyAoZ2xvYmFsID8gJ2cnIDogJycpXG4gICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXBpbGVNb2RlKG1vZGUsIHBhcmVudCkge1xuICAgICAgaWYgKG1vZGUuY29tcGlsZWQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIG1vZGUuY29tcGlsZWQgPSB0cnVlO1xuXG4gICAgICB2YXIga2V5d29yZHMgPSBbXTsgLy8gdXNlZCBsYXRlciB3aXRoIGJlZ2luV2l0aEtleXdvcmQgYnV0IGZpbGxlZCBhcyBhIHNpZGUtZWZmZWN0IG9mIGtleXdvcmRzIGNvbXBpbGF0aW9uXG4gICAgICBpZiAobW9kZS5rZXl3b3Jkcykge1xuICAgICAgICB2YXIgY29tcGlsZWRfa2V5d29yZHMgPSB7fTtcblxuICAgICAgICBmdW5jdGlvbiBmbGF0dGVuKGNsYXNzTmFtZSwgc3RyKSB7XG4gICAgICAgICAgc3RyLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbihrdykge1xuICAgICAgICAgICAgdmFyIHBhaXIgPSBrdy5zcGxpdCgnfCcpO1xuICAgICAgICAgICAgY29tcGlsZWRfa2V5d29yZHNbcGFpclswXV0gPSBbY2xhc3NOYW1lLCBwYWlyWzFdID8gTnVtYmVyKHBhaXJbMV0pIDogMV07XG4gICAgICAgICAgICBrZXl3b3Jkcy5wdXNoKHBhaXJbMF0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9kZS5sZXhlbXNSZSA9IGxhbmdSZShtb2RlLmxleGVtcyB8fCBobGpzLklERU5UX1JFLCB0cnVlKTtcbiAgICAgICAgaWYgKHR5cGVvZiBtb2RlLmtleXdvcmRzID09ICdzdHJpbmcnKSB7IC8vIHN0cmluZ1xuICAgICAgICAgIGZsYXR0ZW4oJ2tleXdvcmQnLCBtb2RlLmtleXdvcmRzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAodmFyIGNsYXNzTmFtZSBpbiBtb2RlLmtleXdvcmRzKSB7XG4gICAgICAgICAgICBpZiAoIW1vZGUua2V5d29yZHMuaGFzT3duUHJvcGVydHkoY2xhc3NOYW1lKSlcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBmbGF0dGVuKGNsYXNzTmFtZSwgbW9kZS5rZXl3b3Jkc1tjbGFzc05hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbW9kZS5rZXl3b3JkcyA9IGNvbXBpbGVkX2tleXdvcmRzO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBpZiAobW9kZS5iZWdpbldpdGhLZXl3b3JkKSB7XG4gICAgICAgICAgbW9kZS5iZWdpbiA9ICdcXFxcYignICsga2V5d29yZHMuam9pbignfCcpICsgJylcXFxccyc7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZS5iZWdpblJlID0gbGFuZ1JlKG1vZGUuYmVnaW4gPyBtb2RlLmJlZ2luIDogJ1xcXFxCfFxcXFxiJyk7XG4gICAgICAgIGlmICghbW9kZS5lbmQgJiYgIW1vZGUuZW5kc1dpdGhQYXJlbnQpXG4gICAgICAgICAgbW9kZS5lbmQgPSAnXFxcXEJ8XFxcXGInO1xuICAgICAgICBpZiAobW9kZS5lbmQpXG4gICAgICAgICAgbW9kZS5lbmRSZSA9IGxhbmdSZShtb2RlLmVuZCk7XG4gICAgICAgIG1vZGUudGVybWluYXRvcl9lbmQgPSBtb2RlLmVuZCB8fCAnJztcbiAgICAgICAgaWYgKG1vZGUuZW5kc1dpdGhQYXJlbnQgJiYgcGFyZW50LnRlcm1pbmF0b3JfZW5kKVxuICAgICAgICAgIG1vZGUudGVybWluYXRvcl9lbmQgKz0gKG1vZGUuZW5kID8gJ3wnIDogJycpICsgcGFyZW50LnRlcm1pbmF0b3JfZW5kO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuaWxsZWdhbClcbiAgICAgICAgbW9kZS5pbGxlZ2FsUmUgPSBsYW5nUmUobW9kZS5pbGxlZ2FsKTtcbiAgICAgIGlmIChtb2RlLnJlbGV2YW5jZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICBtb2RlLnJlbGV2YW5jZSA9IDE7XG4gICAgICBpZiAoIW1vZGUuY29udGFpbnMpIHtcbiAgICAgICAgbW9kZS5jb250YWlucyA9IFtdO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlLmNvbnRhaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChtb2RlLmNvbnRhaW5zW2ldID09ICdzZWxmJykge1xuICAgICAgICAgIG1vZGUuY29udGFpbnNbaV0gPSBtb2RlO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBpbGVNb2RlKG1vZGUuY29udGFpbnNbaV0sIG1vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuc3RhcnRzKSB7XG4gICAgICAgIGNvbXBpbGVNb2RlKG1vZGUuc3RhcnRzLCBwYXJlbnQpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGVybWluYXRvcnMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW9kZS5jb250YWlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0ZXJtaW5hdG9ycy5wdXNoKG1vZGUuY29udGFpbnNbaV0uYmVnaW4pO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUudGVybWluYXRvcl9lbmQpIHtcbiAgICAgICAgdGVybWluYXRvcnMucHVzaChtb2RlLnRlcm1pbmF0b3JfZW5kKTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmlsbGVnYWwpIHtcbiAgICAgICAgdGVybWluYXRvcnMucHVzaChtb2RlLmlsbGVnYWwpO1xuICAgICAgfVxuICAgICAgbW9kZS50ZXJtaW5hdG9ycyA9IHRlcm1pbmF0b3JzLmxlbmd0aCA/IGxhbmdSZSh0ZXJtaW5hdG9ycy5qb2luKCd8JyksIHRydWUpIDoge2V4ZWM6IGZ1bmN0aW9uKHMpIHtyZXR1cm4gbnVsbDt9fTtcbiAgICB9XG5cbiAgICBjb21waWxlTW9kZShsYW5ndWFnZSk7XG4gIH1cblxuICAvKlxuICBDb3JlIGhpZ2hsaWdodGluZyBmdW5jdGlvbi4gQWNjZXB0cyBhIGxhbmd1YWdlIG5hbWUgYW5kIGEgc3RyaW5nIHdpdGggdGhlXG4gIGNvZGUgdG8gaGlnaGxpZ2h0LiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblxuICAtIHJlbGV2YW5jZSAoaW50KVxuICAtIGtleXdvcmRfY291bnQgKGludClcbiAgLSB2YWx1ZSAoYW4gSFRNTCBzdHJpbmcgd2l0aCBoaWdobGlnaHRpbmcgbWFya3VwKVxuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodChsYW5ndWFnZV9uYW1lLCB2YWx1ZSkge1xuXG4gICAgZnVuY3Rpb24gc3ViTW9kZShsZXhlbSwgbW9kZSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlLmNvbnRhaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IG1vZGUuY29udGFpbnNbaV0uYmVnaW5SZS5leGVjKGxleGVtKTtcbiAgICAgICAgaWYgKG1hdGNoICYmIG1hdGNoLmluZGV4ID09IDApIHtcbiAgICAgICAgICByZXR1cm4gbW9kZS5jb250YWluc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGVuZE9mTW9kZShtb2RlLCBsZXhlbSkge1xuICAgICAgaWYgKG1vZGUuZW5kICYmIG1vZGUuZW5kUmUudGVzdChsZXhlbSkpIHtcbiAgICAgICAgcmV0dXJuIG1vZGU7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCkge1xuICAgICAgICByZXR1cm4gZW5kT2ZNb2RlKG1vZGUucGFyZW50LCBsZXhlbSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNJbGxlZ2FsKGxleGVtLCBtb2RlKSB7XG4gICAgICByZXR1cm4gbW9kZS5pbGxlZ2FsICYmIG1vZGUuaWxsZWdhbFJlLnRlc3QobGV4ZW0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGtleXdvcmRNYXRjaChtb2RlLCBtYXRjaCkge1xuICAgICAgdmFyIG1hdGNoX3N0ciA9IGxhbmd1YWdlLmNhc2VfaW5zZW5zaXRpdmUgPyBtYXRjaFswXS50b0xvd2VyQ2FzZSgpIDogbWF0Y2hbMF07XG4gICAgICByZXR1cm4gbW9kZS5rZXl3b3Jkcy5oYXNPd25Qcm9wZXJ0eShtYXRjaF9zdHIpICYmIG1vZGUua2V5d29yZHNbbWF0Y2hfc3RyXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzS2V5d29yZHMoKSB7XG4gICAgICB2YXIgYnVmZmVyID0gZXNjYXBlKG1vZGVfYnVmZmVyKTtcbiAgICAgIGlmICghdG9wLmtleXdvcmRzKVxuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgICAgdmFyIGxhc3RfaW5kZXggPSAwO1xuICAgICAgdG9wLmxleGVtc1JlLmxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgbWF0Y2ggPSB0b3AubGV4ZW1zUmUuZXhlYyhidWZmZXIpO1xuICAgICAgd2hpbGUgKG1hdGNoKSB7XG4gICAgICAgIHJlc3VsdCArPSBidWZmZXIuc3Vic3RyKGxhc3RfaW5kZXgsIG1hdGNoLmluZGV4IC0gbGFzdF9pbmRleCk7XG4gICAgICAgIHZhciBrZXl3b3JkX21hdGNoID0ga2V5d29yZE1hdGNoKHRvcCwgbWF0Y2gpO1xuICAgICAgICBpZiAoa2V5d29yZF9tYXRjaCkge1xuICAgICAgICAgIGtleXdvcmRfY291bnQgKz0ga2V5d29yZF9tYXRjaFsxXTtcbiAgICAgICAgICByZXN1bHQgKz0gJzxzcGFuIGNsYXNzPVwiJysga2V5d29yZF9tYXRjaFswXSArJ1wiPicgKyBtYXRjaFswXSArICc8L3NwYW4+JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgKz0gbWF0Y2hbMF07XG4gICAgICAgIH1cbiAgICAgICAgbGFzdF9pbmRleCA9IHRvcC5sZXhlbXNSZS5sYXN0SW5kZXg7XG4gICAgICAgIG1hdGNoID0gdG9wLmxleGVtc1JlLmV4ZWMoYnVmZmVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQgKyBidWZmZXIuc3Vic3RyKGxhc3RfaW5kZXgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NTdWJMYW5ndWFnZSgpIHtcbiAgICAgIGlmICh0b3Auc3ViTGFuZ3VhZ2UgJiYgIWxhbmd1YWdlc1t0b3Auc3ViTGFuZ3VhZ2VdKSB7XG4gICAgICAgIHJldHVybiBlc2NhcGUobW9kZV9idWZmZXIpO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdCA9IHRvcC5zdWJMYW5ndWFnZSA/IGhpZ2hsaWdodCh0b3Auc3ViTGFuZ3VhZ2UsIG1vZGVfYnVmZmVyKSA6IGhpZ2hsaWdodEF1dG8obW9kZV9idWZmZXIpO1xuICAgICAgLy8gQ291bnRpbmcgZW1iZWRkZWQgbGFuZ3VhZ2Ugc2NvcmUgdG93YXJkcyB0aGUgaG9zdCBsYW5ndWFnZSBtYXkgYmUgZGlzYWJsZWRcbiAgICAgIC8vIHdpdGggemVyb2luZyB0aGUgY29udGFpbmluZyBtb2RlIHJlbGV2YW5jZS4gVXNlY2FzZSBpbiBwb2ludCBpcyBNYXJrZG93biB0aGF0XG4gICAgICAvLyBhbGxvd3MgWE1MIGV2ZXJ5d2hlcmUgYW5kIG1ha2VzIGV2ZXJ5IFhNTCBzbmlwcGV0IHRvIGhhdmUgYSBtdWNoIGxhcmdlciBNYXJrZG93blxuICAgICAgLy8gc2NvcmUuXG4gICAgICBpZiAodG9wLnJlbGV2YW5jZSA+IDApIHtcbiAgICAgICAga2V5d29yZF9jb3VudCArPSByZXN1bHQua2V5d29yZF9jb3VudDtcbiAgICAgICAgcmVsZXZhbmNlICs9IHJlc3VsdC5yZWxldmFuY2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIHJlc3VsdC5sYW5ndWFnZSAgKyAnXCI+JyArIHJlc3VsdC52YWx1ZSArICc8L3NwYW4+JztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzQnVmZmVyKCkge1xuICAgICAgcmV0dXJuIHRvcC5zdWJMYW5ndWFnZSAhPT0gdW5kZWZpbmVkID8gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkgOiBwcm9jZXNzS2V5d29yZHMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdGFydE5ld01vZGUobW9kZSwgbGV4ZW0pIHtcbiAgICAgIHZhciBtYXJrdXAgPSBtb2RlLmNsYXNzTmFtZT8gJzxzcGFuIGNsYXNzPVwiJyArIG1vZGUuY2xhc3NOYW1lICsgJ1wiPic6ICcnO1xuICAgICAgaWYgKG1vZGUucmV0dXJuQmVnaW4pIHtcbiAgICAgICAgcmVzdWx0ICs9IG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgIH0gZWxzZSBpZiAobW9kZS5leGNsdWRlQmVnaW4pIHtcbiAgICAgICAgcmVzdWx0ICs9IGVzY2FwZShsZXhlbSkgKyBtYXJrdXA7XG4gICAgICAgIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgKz0gbWFya3VwO1xuICAgICAgICBtb2RlX2J1ZmZlciA9IGxleGVtO1xuICAgICAgfVxuICAgICAgdG9wID0gT2JqZWN0LmNyZWF0ZShtb2RlLCB7cGFyZW50OiB7dmFsdWU6IHRvcH19KTtcbiAgICAgIHJlbGV2YW5jZSArPSBtb2RlLnJlbGV2YW5jZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzTGV4ZW0oYnVmZmVyLCBsZXhlbSkge1xuICAgICAgbW9kZV9idWZmZXIgKz0gYnVmZmVyO1xuICAgICAgaWYgKGxleGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVzdWx0ICs9IHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdfbW9kZSA9IHN1Yk1vZGUobGV4ZW0sIHRvcCk7XG4gICAgICBpZiAobmV3X21vZGUpIHtcbiAgICAgICAgcmVzdWx0ICs9IHByb2Nlc3NCdWZmZXIoKTtcbiAgICAgICAgc3RhcnROZXdNb2RlKG5ld19tb2RlLCBsZXhlbSk7XG4gICAgICAgIHJldHVybiBuZXdfbW9kZS5yZXR1cm5CZWdpbiA/IDAgOiBsZXhlbS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbmRfbW9kZSA9IGVuZE9mTW9kZSh0b3AsIGxleGVtKTtcbiAgICAgIGlmIChlbmRfbW9kZSkge1xuICAgICAgICBpZiAoIShlbmRfbW9kZS5yZXR1cm5FbmQgfHwgZW5kX21vZGUuZXhjbHVkZUVuZCkpIHtcbiAgICAgICAgICBtb2RlX2J1ZmZlciArPSBsZXhlbTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgaWYgKHRvcC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSAnPC9zcGFuPic7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRvcCA9IHRvcC5wYXJlbnQ7XG4gICAgICAgIH0gd2hpbGUgKHRvcCAhPSBlbmRfbW9kZS5wYXJlbnQpO1xuICAgICAgICBpZiAoZW5kX21vZGUuZXhjbHVkZUVuZCkge1xuICAgICAgICAgIHJlc3VsdCArPSBlc2NhcGUobGV4ZW0pO1xuICAgICAgICB9XG4gICAgICAgIG1vZGVfYnVmZmVyID0gJyc7XG4gICAgICAgIGlmIChlbmRfbW9kZS5zdGFydHMpIHtcbiAgICAgICAgICBzdGFydE5ld01vZGUoZW5kX21vZGUuc3RhcnRzLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVuZF9tb2RlLnJldHVybkVuZCA/IDAgOiBsZXhlbS5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc0lsbGVnYWwobGV4ZW0sIHRvcCkpXG4gICAgICAgIHRocm93ICdJbGxlZ2FsJztcblxuICAgICAgLypcbiAgICAgIFBhcnNlciBzaG91bGQgbm90IHJlYWNoIHRoaXMgcG9pbnQgYXMgYWxsIHR5cGVzIG9mIGxleGVtcyBzaG91bGQgYmUgY2F1Z2h0XG4gICAgICBlYXJsaWVyLCBidXQgaWYgaXQgZG9lcyBkdWUgdG8gc29tZSBidWcgbWFrZSBzdXJlIGl0IGFkdmFuY2VzIGF0IGxlYXN0IG9uZVxuICAgICAgY2hhcmFjdGVyIGZvcndhcmQgdG8gcHJldmVudCBpbmZpbml0ZSBsb29waW5nLlxuICAgICAgKi9cbiAgICAgIG1vZGVfYnVmZmVyICs9IGxleGVtO1xuICAgICAgcmV0dXJuIGxleGVtLmxlbmd0aCB8fCAxO1xuICAgIH1cblxuICAgIHZhciBsYW5ndWFnZSA9IGxhbmd1YWdlc1tsYW5ndWFnZV9uYW1lXTtcbiAgICBjb21waWxlTGFuZ3VhZ2UobGFuZ3VhZ2UpO1xuICAgIHZhciB0b3AgPSBsYW5ndWFnZTtcbiAgICB2YXIgbW9kZV9idWZmZXIgPSAnJztcbiAgICB2YXIgcmVsZXZhbmNlID0gMDtcbiAgICB2YXIga2V5d29yZF9jb3VudCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgIHRyeSB7XG4gICAgICB2YXIgbWF0Y2gsIGNvdW50LCBpbmRleCA9IDA7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB0b3AudGVybWluYXRvcnMubGFzdEluZGV4ID0gaW5kZXg7XG4gICAgICAgIG1hdGNoID0gdG9wLnRlcm1pbmF0b3JzLmV4ZWModmFsdWUpO1xuICAgICAgICBpZiAoIW1hdGNoKVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjb3VudCA9IHByb2Nlc3NMZXhlbSh2YWx1ZS5zdWJzdHIoaW5kZXgsIG1hdGNoLmluZGV4IC0gaW5kZXgpLCBtYXRjaFswXSk7XG4gICAgICAgIGluZGV4ID0gbWF0Y2guaW5kZXggKyBjb3VudDtcbiAgICAgIH1cbiAgICAgIHByb2Nlc3NMZXhlbSh2YWx1ZS5zdWJzdHIoaW5kZXgpKVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVsZXZhbmNlOiByZWxldmFuY2UsXG4gICAgICAgIGtleXdvcmRfY291bnQ6IGtleXdvcmRfY291bnQsXG4gICAgICAgIHZhbHVlOiByZXN1bHQsXG4gICAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZV9uYW1lXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlID09ICdJbGxlZ2FsJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgICBrZXl3b3JkX2NvdW50OiAwLFxuICAgICAgICAgIHZhbHVlOiBlc2NhcGUodmFsdWUpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qXG4gIEhpZ2hsaWdodGluZyB3aXRoIGxhbmd1YWdlIGRldGVjdGlvbi4gQWNjZXB0cyBhIHN0cmluZyB3aXRoIHRoZSBjb2RlIHRvXG4gIGhpZ2hsaWdodC4gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG5cbiAgLSBsYW5ndWFnZSAoZGV0ZWN0ZWQgbGFuZ3VhZ2UpXG4gIC0gcmVsZXZhbmNlIChpbnQpXG4gIC0ga2V5d29yZF9jb3VudCAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG4gIC0gc2Vjb25kX2Jlc3QgKG9iamVjdCB3aXRoIHRoZSBzYW1lIHN0cnVjdHVyZSBmb3Igc2Vjb25kLWJlc3QgaGV1cmlzdGljYWxseVxuICAgIGRldGVjdGVkIGxhbmd1YWdlLCBtYXkgYmUgYWJzZW50KVxuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEF1dG8odGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBrZXl3b3JkX2NvdW50OiAwLFxuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgdmFsdWU6IGVzY2FwZSh0ZXh0KVxuICAgIH07XG4gICAgdmFyIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgIGZvciAodmFyIGtleSBpbiBsYW5ndWFnZXMpIHtcbiAgICAgIGlmICghbGFuZ3VhZ2VzLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdmFyIGN1cnJlbnQgPSBoaWdobGlnaHQoa2V5LCB0ZXh0KTtcbiAgICAgIGN1cnJlbnQubGFuZ3VhZ2UgPSBrZXk7XG4gICAgICBpZiAoY3VycmVudC5rZXl3b3JkX2NvdW50ICsgY3VycmVudC5yZWxldmFuY2UgPiBzZWNvbmRfYmVzdC5rZXl3b3JkX2NvdW50ICsgc2Vjb25kX2Jlc3QucmVsZXZhbmNlKSB7XG4gICAgICAgIHNlY29uZF9iZXN0ID0gY3VycmVudDtcbiAgICAgIH1cbiAgICAgIGlmIChjdXJyZW50LmtleXdvcmRfY291bnQgKyBjdXJyZW50LnJlbGV2YW5jZSA+IHJlc3VsdC5rZXl3b3JkX2NvdW50ICsgcmVzdWx0LnJlbGV2YW5jZSkge1xuICAgICAgICBzZWNvbmRfYmVzdCA9IHJlc3VsdDtcbiAgICAgICAgcmVzdWx0ID0gY3VycmVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlY29uZF9iZXN0Lmxhbmd1YWdlKSB7XG4gICAgICByZXN1bHQuc2Vjb25kX2Jlc3QgPSBzZWNvbmRfYmVzdDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qXG4gIFBvc3QtcHJvY2Vzc2luZyBvZiB0aGUgaGlnaGxpZ2h0ZWQgbWFya3VwOlxuXG4gIC0gcmVwbGFjZSBUQUJzIHdpdGggc29tZXRoaW5nIG1vcmUgdXNlZnVsXG4gIC0gcmVwbGFjZSByZWFsIGxpbmUtYnJlYWtzIHdpdGggJzxicj4nIGZvciBub24tcHJlIGNvbnRhaW5lcnNcblxuICAqL1xuICBmdW5jdGlvbiBmaXhNYXJrdXAodmFsdWUsIHRhYlJlcGxhY2UsIHVzZUJSKSB7XG4gICAgaWYgKHRhYlJlcGxhY2UpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXigoPFtePl0rPnxcXHQpKykvZ20sIGZ1bmN0aW9uKG1hdGNoLCBwMSwgb2Zmc2V0LCBzKSB7XG4gICAgICAgIHJldHVybiBwMS5yZXBsYWNlKC9cXHQvZywgdGFiUmVwbGFjZSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHVzZUJSKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcbi9nLCAnPGJyPicpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKlxuICBBcHBsaWVzIGhpZ2hsaWdodGluZyB0byBhIERPTSBub2RlIGNvbnRhaW5pbmcgY29kZS4gQWNjZXB0cyBhIERPTSBub2RlIGFuZFxuICB0d28gb3B0aW9uYWwgcGFyYW1ldGVycyBmb3IgZml4TWFya3VwLlxuICAqL1xuICBmdW5jdGlvbiBoaWdobGlnaHRCbG9jayhibG9jaywgdGFiUmVwbGFjZSwgdXNlQlIpIHtcbiAgICB2YXIgdGV4dCA9IGJsb2NrVGV4dChibG9jaywgdXNlQlIpO1xuICAgIHZhciBsYW5ndWFnZSA9IGJsb2NrTGFuZ3VhZ2UoYmxvY2spO1xuICAgIGlmIChsYW5ndWFnZSA9PSAnbm8taGlnaGxpZ2h0JylcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciByZXN1bHQgPSBsYW5ndWFnZSA/IGhpZ2hsaWdodChsYW5ndWFnZSwgdGV4dCkgOiBoaWdobGlnaHRBdXRvKHRleHQpO1xuICAgIGxhbmd1YWdlID0gcmVzdWx0Lmxhbmd1YWdlO1xuICAgIHZhciBvcmlnaW5hbCA9IG5vZGVTdHJlYW0oYmxvY2spO1xuICAgIGlmIChvcmlnaW5hbC5sZW5ndGgpIHtcbiAgICAgIHZhciBwcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcbiAgICAgIHByZS5pbm5lckhUTUwgPSByZXN1bHQudmFsdWU7XG4gICAgICByZXN1bHQudmFsdWUgPSBtZXJnZVN0cmVhbXMob3JpZ2luYWwsIG5vZGVTdHJlYW0ocHJlKSwgdGV4dCk7XG4gICAgfVxuICAgIHJlc3VsdC52YWx1ZSA9IGZpeE1hcmt1cChyZXN1bHQudmFsdWUsIHRhYlJlcGxhY2UsIHVzZUJSKTtcblxuICAgIHZhciBjbGFzc19uYW1lID0gYmxvY2suY2xhc3NOYW1lO1xuICAgIGlmICghY2xhc3NfbmFtZS5tYXRjaCgnKFxcXFxzfF4pKGxhbmd1YWdlLSk/JyArIGxhbmd1YWdlICsgJyhcXFxcc3wkKScpKSB7XG4gICAgICBjbGFzc19uYW1lID0gY2xhc3NfbmFtZSA/IChjbGFzc19uYW1lICsgJyAnICsgbGFuZ3VhZ2UpIDogbGFuZ3VhZ2U7XG4gICAgfVxuICAgIGJsb2NrLmlubmVySFRNTCA9IHJlc3VsdC52YWx1ZTtcbiAgICBibG9jay5jbGFzc05hbWUgPSBjbGFzc19uYW1lO1xuICAgIGJsb2NrLnJlc3VsdCA9IHtcbiAgICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcbiAgICAgIGt3OiByZXN1bHQua2V5d29yZF9jb3VudCxcbiAgICAgIHJlOiByZXN1bHQucmVsZXZhbmNlXG4gICAgfTtcbiAgICBpZiAocmVzdWx0LnNlY29uZF9iZXN0KSB7XG4gICAgICBibG9jay5zZWNvbmRfYmVzdCA9IHtcbiAgICAgICAgbGFuZ3VhZ2U6IHJlc3VsdC5zZWNvbmRfYmVzdC5sYW5ndWFnZSxcbiAgICAgICAga3c6IHJlc3VsdC5zZWNvbmRfYmVzdC5rZXl3b3JkX2NvdW50LFxuICAgICAgICByZTogcmVzdWx0LnNlY29uZF9iZXN0LnJlbGV2YW5jZVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvKlxuICBBcHBsaWVzIGhpZ2hsaWdodGluZyB0byBhbGwgPHByZT48Y29kZT4uLjwvY29kZT48L3ByZT4gYmxvY2tzIG9uIGEgcGFnZS5cbiAgKi9cbiAgZnVuY3Rpb24gaW5pdEhpZ2hsaWdodGluZygpIHtcbiAgICBpZiAoaW5pdEhpZ2hsaWdodGluZy5jYWxsZWQpXG4gICAgICByZXR1cm47XG4gICAgaW5pdEhpZ2hsaWdodGluZy5jYWxsZWQgPSB0cnVlO1xuICAgIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgncHJlJyksIGZpbmRDb2RlKS5cbiAgICAgIGZpbHRlcihCb29sZWFuKS5cbiAgICAgIGZvckVhY2goZnVuY3Rpb24oY29kZSl7aGlnaGxpZ2h0QmxvY2soY29kZSwgaGxqcy50YWJSZXBsYWNlKX0pO1xuICB9XG5cbiAgLypcbiAgQXR0YWNoZXMgaGlnaGxpZ2h0aW5nIHRvIHRoZSBwYWdlIGxvYWQgZXZlbnQuXG4gICovXG4gIGZ1bmN0aW9uIGluaXRIaWdobGlnaHRpbmdPbkxvYWQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBpbml0SGlnaGxpZ2h0aW5nLCBmYWxzZSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0SGlnaGxpZ2h0aW5nLCBmYWxzZSk7XG4gIH1cblxuICB2YXIgbGFuZ3VhZ2VzID0ge307IC8vIGEgc2hvcnRjdXQgdG8gYXZvaWQgd3JpdGluZyBcInRoaXMuXCIgZXZlcnl3aGVyZVxuXG4gIC8qIEludGVyZmFjZSBkZWZpbml0aW9uICovXG5cbiAgdGhpcy5MQU5HVUFHRVMgPSBsYW5ndWFnZXM7XG4gIHRoaXMuaGlnaGxpZ2h0ID0gaGlnaGxpZ2h0O1xuICB0aGlzLmhpZ2hsaWdodEF1dG8gPSBoaWdobGlnaHRBdXRvO1xuICB0aGlzLmZpeE1hcmt1cCA9IGZpeE1hcmt1cDtcbiAgdGhpcy5oaWdobGlnaHRCbG9jayA9IGhpZ2hsaWdodEJsb2NrO1xuICB0aGlzLmluaXRIaWdobGlnaHRpbmcgPSBpbml0SGlnaGxpZ2h0aW5nO1xuICB0aGlzLmluaXRIaWdobGlnaHRpbmdPbkxvYWQgPSBpbml0SGlnaGxpZ2h0aW5nT25Mb2FkO1xuXG4gIC8vIENvbW1vbiByZWdleHBzXG4gIHRoaXMuSURFTlRfUkUgPSAnW2EtekEtWl1bYS16QS1aMC05X10qJztcbiAgdGhpcy5VTkRFUlNDT1JFX0lERU5UX1JFID0gJ1thLXpBLVpfXVthLXpBLVowLTlfXSonO1xuICB0aGlzLk5VTUJFUl9SRSA9ICdcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKyk/JztcbiAgdGhpcy5DX05VTUJFUl9SRSA9ICcoXFxcXGIwW3hYXVthLWZBLUYwLTldK3woXFxcXGJcXFxcZCsoXFxcXC5cXFxcZCopP3xcXFxcLlxcXFxkKykoW2VFXVstK10/XFxcXGQrKT8pJzsgLy8gMHguLi4sIDAuLi4sIGRlY2ltYWwsIGZsb2F0XG4gIHRoaXMuQklOQVJZX05VTUJFUl9SRSA9ICdcXFxcYigwYlswMV0rKSc7IC8vIDBiLi4uXG4gIHRoaXMuUkVfU1RBUlRFUlNfUkUgPSAnIXwhPXwhPT18JXwlPXwmfCYmfCY9fFxcXFwqfFxcXFwqPXxcXFxcK3xcXFxcKz18LHxcXFxcLnwtfC09fC98Lz18Onw7fDx8PDx8PDw9fDw9fD18PT18PT09fD58Pj18Pj58Pj49fD4+Pnw+Pj49fFxcXFw/fFxcXFxbfFxcXFx7fFxcXFwofFxcXFxefFxcXFxePXxcXFxcfHxcXFxcfD18XFxcXHxcXFxcfHx+JztcblxuICAvLyBDb21tb24gbW9kZXNcbiAgdGhpcy5CQUNLU0xBU0hfRVNDQVBFID0ge1xuICAgIGJlZ2luOiAnXFxcXFxcXFxbXFxcXHNcXFxcU10nLCByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5BUE9TX1NUUklOR19NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFt0aGlzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLlFVT1RFX1NUUklOR19NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgIGNvbnRhaW5zOiBbdGhpcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5DX0xJTkVfQ09NTUVOVF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnLy8nLCBlbmQ6ICckJ1xuICB9O1xuICB0aGlzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnL1xcXFwqJywgZW5kOiAnXFxcXCovJ1xuICB9O1xuICB0aGlzLkhBU0hfQ09NTUVOVF9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gIH07XG4gIHRoaXMuTlVNQkVSX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogdGhpcy5OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuQ19OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiB0aGlzLkNfTlVNQkVSX1JFLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkJJTkFSWV9OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiB0aGlzLkJJTkFSWV9OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgLy8gVXRpbGl0eSBmdW5jdGlvbnNcbiAgdGhpcy5pbmhlcml0ID0gZnVuY3Rpb24ocGFyZW50LCBvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge31cbiAgICBmb3IgKHZhciBrZXkgaW4gcGFyZW50KVxuICAgICAgcmVzdWx0W2tleV0gPSBwYXJlbnRba2V5XTtcbiAgICBpZiAob2JqKVxuICAgICAgZm9yICh2YXIga2V5IGluIG9iailcbiAgICAgICAgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KCk7XG5obGpzLkxBTkdVQUdFU1snYmFzaCddID0gcmVxdWlyZSgnLi9iYXNoLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZXJsYW5nJ10gPSByZXF1aXJlKCcuL2VybGFuZy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NzJ10gPSByZXF1aXJlKCcuL2NzLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYnJhaW5mdWNrJ10gPSByZXF1aXJlKCcuL2JyYWluZnVjay5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3J1YnknXSA9IHJlcXVpcmUoJy4vcnVieS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3J1c3QnXSA9IHJlcXVpcmUoJy4vcnVzdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3JpYiddID0gcmVxdWlyZSgnLi9yaWIuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydkaWZmJ10gPSByZXF1aXJlKCcuL2RpZmYuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydqYXZhc2NyaXB0J10gPSByZXF1aXJlKCcuL2phdmFzY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydnbHNsJ10gPSByZXF1aXJlKCcuL2dsc2wuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydyc2wnXSA9IHJlcXVpcmUoJy4vcnNsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snbHVhJ10gPSByZXF1aXJlKCcuL2x1YS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3htbCddID0gcmVxdWlyZSgnLi94bWwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydtYXJrZG93biddID0gcmVxdWlyZSgnLi9tYXJrZG93bi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NzcyddID0gcmVxdWlyZSgnLi9jc3MuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydsaXNwJ10gPSByZXF1aXJlKCcuL2xpc3AuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydwcm9maWxlJ10gPSByZXF1aXJlKCcuL3Byb2ZpbGUuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydodHRwJ10gPSByZXF1aXJlKCcuL2h0dHAuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydqYXZhJ10gPSByZXF1aXJlKCcuL2phdmEuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydwaHAnXSA9IHJlcXVpcmUoJy4vcGhwLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snaGFza2VsbCddID0gcmVxdWlyZSgnLi9oYXNrZWxsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snMWMnXSA9IHJlcXVpcmUoJy4vMWMuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydweXRob24nXSA9IHJlcXVpcmUoJy4vcHl0aG9uLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snc21hbGx0YWxrJ10gPSByZXF1aXJlKCcuL3NtYWxsdGFsay5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3RleCddID0gcmVxdWlyZSgnLi90ZXguanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydhY3Rpb25zY3JpcHQnXSA9IHJlcXVpcmUoJy4vYWN0aW9uc2NyaXB0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snc3FsJ10gPSByZXF1aXJlKCcuL3NxbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3ZhbGEnXSA9IHJlcXVpcmUoJy4vdmFsYS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2luaSddID0gcmVxdWlyZSgnLi9pbmkuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydkJ10gPSByZXF1aXJlKCcuL2QuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydheGFwdGEnXSA9IHJlcXVpcmUoJy4vYXhhcHRhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncGVybCddID0gcmVxdWlyZSgnLi9wZXJsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snc2NhbGEnXSA9IHJlcXVpcmUoJy4vc2NhbGEuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjbWFrZSddID0gcmVxdWlyZSgnLi9jbWFrZS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ29iamVjdGl2ZWMnXSA9IHJlcXVpcmUoJy4vb2JqZWN0aXZlYy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2F2cmFzbSddID0gcmVxdWlyZSgnLi9hdnJhc20uanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyd2aGRsJ10gPSByZXF1aXJlKCcuL3ZoZGwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjb2ZmZWVzY3JpcHQnXSA9IHJlcXVpcmUoJy4vY29mZmVlc2NyaXB0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snbmdpbngnXSA9IHJlcXVpcmUoJy4vbmdpbnguanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydlcmxhbmctcmVwbCddID0gcmVxdWlyZSgnLi9lcmxhbmctcmVwbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3InXSA9IHJlcXVpcmUoJy4vci5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2pzb24nXSA9IHJlcXVpcmUoJy4vanNvbi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2RqYW5nbyddID0gcmVxdWlyZSgnLi9kamFuZ28uanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydkZWxwaGknXSA9IHJlcXVpcmUoJy4vZGVscGhpLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sndmJzY3JpcHQnXSA9IHJlcXVpcmUoJy4vdmJzY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydtZWwnXSA9IHJlcXVpcmUoJy4vbWVsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZG9zJ10gPSByZXF1aXJlKCcuL2Rvcy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2FwYWNoZSddID0gcmVxdWlyZSgnLi9hcGFjaGUuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydhcHBsZXNjcmlwdCddID0gcmVxdWlyZSgnLi9hcHBsZXNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NwcCddID0gcmVxdWlyZSgnLi9jcHAuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydtYXRsYWInXSA9IHJlcXVpcmUoJy4vbWF0bGFiLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncGFyc2VyMyddID0gcmVxdWlyZSgnLi9wYXJzZXIzLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY2xvanVyZSddID0gcmVxdWlyZSgnLi9jbG9qdXJlLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZ28nXSA9IHJlcXVpcmUoJy4vZ28uanMnKShobGpzKTtcbm1vZHVsZS5leHBvcnRzID0gaGxqczsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBpbGxlZ2FsOiAnXFxcXFMnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0YXR1cycsXG4gICAgICAgIGJlZ2luOiAnXkhUVFAvWzAtOVxcXFwuXSsnLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFt7Y2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICdcXFxcYlxcXFxkezN9XFxcXGInfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlcXVlc3QnLFxuICAgICAgICBiZWdpbjogJ15bQS1aXSsgKC4qPykgSFRUUC9bMC05XFxcXC5dKyQnLCByZXR1cm5CZWdpbjogdHJ1ZSwgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGJlZ2luOiAnICcsIGVuZDogJyAnLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogJ15cXFxcdycsIGVuZDogJzogJywgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxufFxcXFxzfD0nLFxuICAgICAgICBzdGFydHM6IHtjbGFzc05hbWU6ICdzdHJpbmcnLCBlbmQ6ICckJ31cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXG5cXFxcbicsXG4gICAgICAgIHN0YXJ0czoge3N1Ykxhbmd1YWdlOiAnJywgZW5kc1dpdGhQYXJlbnQ6IHRydWV9XG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnOycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgIGJlZ2luOiAnXlxcXFxbJywgZW5kOiAnXFxcXF0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzZXR0aW5nJyxcbiAgICAgICAgYmVnaW46ICdeW2EtejAtOVxcXFxbXFxcXF1fLV0rWyBcXFxcdF0qPVsgXFxcXHRdKicsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdvbiBvZmYgdHJ1ZSBmYWxzZSB5ZXMgbm8nLFxuICAgICAgICAgICAgY29udGFpbnM6IFtobGpzLlFVT1RFX1NUUklOR19NT0RFLCBobGpzLk5VTUJFUl9NT0RFXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAnZmFsc2Ugc3luY2hyb25pemVkIGludCBhYnN0cmFjdCBmbG9hdCBwcml2YXRlIGNoYXIgYm9vbGVhbiBzdGF0aWMgbnVsbCBpZiBjb25zdCAnICtcbiAgICAgICdmb3IgdHJ1ZSB3aGlsZSBsb25nIHRocm93IHN0cmljdGZwIGZpbmFsbHkgcHJvdGVjdGVkIGltcG9ydCBuYXRpdmUgZmluYWwgcmV0dXJuIHZvaWQgJyArXG4gICAgICAnZW51bSBlbHNlIGJyZWFrIHRyYW5zaWVudCBuZXcgY2F0Y2ggaW5zdGFuY2VvZiBieXRlIHN1cGVyIHZvbGF0aWxlIGNhc2UgYXNzZXJ0IHNob3J0ICcgK1xuICAgICAgJ3BhY2thZ2UgZGVmYXVsdCBkb3VibGUgcHVibGljIHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB0aHJvd3MnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2phdmFkb2MnLFxuICAgICAgICBiZWdpbjogJy9cXFxcKlxcXFwqJywgZW5kOiAnXFxcXCovJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnamF2YWRvY3RhZycsIGJlZ2luOiAnQFtBLVphLXpdKydcbiAgICAgICAgfV0sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcyBpbnRlcmZhY2UnLFxuICAgICAgICBpbGxlZ2FsOiAnOicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Fubm90YXRpb24nLCBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2luIGlmIGZvciB3aGlsZSBmaW5hbGx5IHZhciBuZXcgZnVuY3Rpb24gZG8gcmV0dXJuIHZvaWQgZWxzZSBicmVhayBjYXRjaCAnICtcbiAgICAgICAgJ2luc3RhbmNlb2Ygd2l0aCB0aHJvdyBjYXNlIGRlZmF1bHQgdHJ5IHRoaXMgc3dpdGNoIGNvbnRpbnVlIHR5cGVvZiBkZWxldGUgJyArXG4gICAgICAgICdsZXQgeWllbGQgY29uc3QnLFxuICAgICAgbGl0ZXJhbDpcbiAgICAgICAgJ3RydWUgZmFsc2UgbnVsbCB1bmRlZmluZWQgTmFOIEluZmluaXR5J1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgeyAvLyBcInZhbHVlXCIgY29udGFpbmVyXG4gICAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJ3xcXFxcYihjYXNlfHJldHVybnx0aHJvdylcXFxcYilcXFxccyonLFxuICAgICAgICBrZXl3b3JkczogJ3JldHVybiB0aHJvdyBjYXNlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICAgICAgYmVnaW46ICcvJywgZW5kOiAnL1tnaW1dKicsXG4gICAgICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICAgICAgY29udGFpbnM6IFt7YmVnaW46ICdcXFxcXFxcXC8nfV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgLy8gRTRYXG4gICAgICAgICAgICBiZWdpbjogJzwnLCBlbmQ6ICc+OycsXG4gICAgICAgICAgICBzdWJMYW5ndWFnZTogJ3htbCdcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogJ1tBLVphLXokX11bMC05QS1aYS16JF9dKidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaWxsZWdhbDogJ1tcIlxcJ1xcXFwoXSdcbiAgICAgICAgICB9XG4gICAgICAgIF0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcW3wlJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBMSVRFUkFMUyA9IHtsaXRlcmFsOiAndHJ1ZSBmYWxzZSBudWxsJ307XG4gIHZhciBUWVBFUyA9IFtcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICBdO1xuICB2YXIgVkFMVUVfQ09OVEFJTkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICBlbmQ6ICcsJywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgY29udGFpbnM6IFRZUEVTLFxuICAgIGtleXdvcmRzOiBMSVRFUkFMU1xuICB9O1xuICB2YXIgT0JKRUNUID0ge1xuICAgIGJlZ2luOiAneycsIGVuZDogJ30nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXHMqXCInLCBlbmQ6ICdcIlxcXFxzKjpcXFxccyonLCBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICAgICAgc3RhcnRzOiBWQUxVRV9DT05UQUlORVJcbiAgICAgIH1cbiAgICBdLFxuICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgfTtcbiAgdmFyIEFSUkFZID0ge1xuICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgY29udGFpbnM6IFtobGpzLmluaGVyaXQoVkFMVUVfQ09OVEFJTkVSLCB7Y2xhc3NOYW1lOiBudWxsfSldLCAvLyBpbmhlcml0IGlzIGFsc28gYSB3b3JrYXJvdW5kIGZvciBhIGJ1ZyB0aGF0IG1ha2VzIHNoYXJlZCBtb2RlcyB3aXRoIGVuZHNXaXRoUGFyZW50IGNvbXBpbGUgb25seSB0aGUgZW5kaW5nIG9mIG9uZSBvZiB0aGUgcGFyZW50c1xuICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgfTtcbiAgVFlQRVMuc3BsaWNlKFRZUEVTLmxlbmd0aCwgMCwgT0JKRUNULCBBUlJBWSk7XG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFRZUEVTLFxuICAgIGtleXdvcmRzOiBMSVRFUkFMUyxcbiAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgTElTUF9JREVOVF9SRSA9ICdbYS16QS1aX1xcXFwtXFxcXCtcXFxcKlxcXFwvXFxcXDxcXFxcPVxcXFw+XFxcXCZcXFxcI11bYS16QS1aMC05X1xcXFwtXFxcXCtcXFxcKlxcXFwvXFxcXDxcXFxcPVxcXFw+XFxcXCZcXFxcI10qJztcbiAgdmFyIExJU1BfU0lNUExFX05VTUJFUl9SRSA9ICcoXFxcXC18XFxcXCspP1xcXFxkKyhcXFxcLlxcXFxkK3xcXFxcL1xcXFxkKyk/KChkfGV8ZnxsfHMpKFxcXFwrfFxcXFwtKT9cXFxcZCspPyc7XG4gIHZhciBMSVRFUkFMID0ge1xuICAgIGNsYXNzTmFtZTogJ2xpdGVyYWwnLFxuICAgIGJlZ2luOiAnXFxcXGIodHsxfXxuaWwpXFxcXGInXG4gIH07XG4gIHZhciBOVU1CRVJTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiBMSVNQX1NJTVBMRV9OVU1CRVJfUkVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnI2JbMC0xXSsoL1swLTFdKyk/J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICcjb1swLTddKygvWzAtN10rKT8nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJyN4WzAtOWEtZl0rKC9bMC05YS1mXSspPydcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnI2NcXFxcKCcgKyBMSVNQX1NJTVBMRV9OVU1CRVJfUkUgKyAnICsnICsgTElTUF9TSU1QTEVfTlVNQkVSX1JFLCBlbmQ6ICdcXFxcKSdcbiAgICB9XG4gIF1cbiAgdmFyIFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJzsnLCBlbmQ6ICckJ1xuICB9O1xuICB2YXIgVkFSSUFCTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAnXFxcXConLCBlbmQ6ICdcXFxcKidcbiAgfTtcbiAgdmFyIEtFWVdPUkQgPSB7XG4gICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgYmVnaW46ICdbOiZdJyArIExJU1BfSURFTlRfUkVcbiAgfTtcbiAgdmFyIFFVT1RFRF9MSVNUID0ge1xuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgY29udGFpbnM6IFsnc2VsZicsIExJVEVSQUwsIFNUUklOR10uY29uY2F0KE5VTUJFUlMpXG4gIH07XG4gIHZhciBRVU9URUQxID0ge1xuICAgIGNsYXNzTmFtZTogJ3F1b3RlZCcsXG4gICAgYmVnaW46ICdbXFwnYF1cXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogTlVNQkVSUy5jb25jYXQoW1NUUklORywgVkFSSUFCTEUsIEtFWVdPUkQsIFFVT1RFRF9MSVNUXSlcbiAgfTtcbiAgdmFyIFFVT1RFRDIgPSB7XG4gICAgY2xhc3NOYW1lOiAncXVvdGVkJyxcbiAgICBiZWdpbjogJ1xcXFwocXVvdGUgJywgZW5kOiAnXFxcXCknLFxuICAgIGtleXdvcmRzOiB7dGl0bGU6ICdxdW90ZSd9LFxuICAgIGNvbnRhaW5zOiBOVU1CRVJTLmNvbmNhdChbU1RSSU5HLCBWQVJJQUJMRSwgS0VZV09SRCwgUVVPVEVEX0xJU1RdKVxuICB9O1xuICB2YXIgTElTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXN0JyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknXG4gIH07XG4gIHZhciBCT0RZID0ge1xuICAgIGNsYXNzTmFtZTogJ2JvZHknLFxuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlXG4gIH07XG4gIExJU1QuY29udGFpbnMgPSBbe2NsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IExJU1BfSURFTlRfUkV9LCBCT0RZXTtcbiAgQk9EWS5jb250YWlucyA9IFtRVU9URUQxLCBRVU9URUQyLCBMSVNULCBMSVRFUkFMXS5jb25jYXQoTlVNQkVSUykuY29uY2F0KFtTVFJJTkcsIENPTU1FTlQsIFZBUklBQkxFLCBLRVlXT1JEXSk7XG5cbiAgcmV0dXJuIHtcbiAgICBpbGxlZ2FsOiAnW15cXFxcc10nLFxuICAgIGNvbnRhaW5zOiBOVU1CRVJTLmNvbmNhdChbXG4gICAgICBMSVRFUkFMLFxuICAgICAgU1RSSU5HLFxuICAgICAgQ09NTUVOVCxcbiAgICAgIFFVT1RFRDEsIFFVT1RFRDIsXG4gICAgICBMSVNUXG4gICAgXSlcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBPUEVOSU5HX0xPTkdfQlJBQ0tFVCA9ICdcXFxcWz0qXFxcXFsnO1xuICB2YXIgQ0xPU0lOR19MT05HX0JSQUNLRVQgPSAnXFxcXF09KlxcXFxdJztcbiAgdmFyIExPTkdfQlJBQ0tFVFMgPSB7XG4gICAgYmVnaW46IE9QRU5JTkdfTE9OR19CUkFDS0VULCBlbmQ6IENMT1NJTkdfTE9OR19CUkFDS0VULFxuICAgIGNvbnRhaW5zOiBbJ3NlbGYnXVxuICB9O1xuICB2YXIgQ09NTUVOVFMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJy0tKD8hJyArIE9QRU5JTkdfTE9OR19CUkFDS0VUICsgJyknLCBlbmQ6ICckJ1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJy0tJyArIE9QRU5JTkdfTE9OR19CUkFDS0VULCBlbmQ6IENMT1NJTkdfTE9OR19CUkFDS0VULFxuICAgICAgY29udGFpbnM6IFtMT05HX0JSQUNLRVRTXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9XG4gIF1cbiAgcmV0dXJuIHtcbiAgICBsZXhlbXM6IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2FuZCBicmVhayBkbyBlbHNlIGVsc2VpZiBlbmQgZmFsc2UgZm9yIGlmIGluIGxvY2FsIG5pbCBub3Qgb3IgcmVwZWF0IHJldHVybiB0aGVuICcgK1xuICAgICAgICAndHJ1ZSB1bnRpbCB3aGlsZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ19HIF9WRVJTSU9OIGFzc2VydCBjb2xsZWN0Z2FyYmFnZSBkb2ZpbGUgZXJyb3IgZ2V0ZmVudiBnZXRtZXRhdGFibGUgaXBhaXJzIGxvYWQgJyArXG4gICAgICAgICdsb2FkZmlsZSBsb2Fkc3RyaW5nIG1vZHVsZSBuZXh0IHBhaXJzIHBjYWxsIHByaW50IHJhd2VxdWFsIHJhd2dldCByYXdzZXQgcmVxdWlyZSAnICtcbiAgICAgICAgJ3NlbGVjdCBzZXRmZW52IHNldG1ldGF0YWJsZSB0b251bWJlciB0b3N0cmluZyB0eXBlIHVucGFjayB4cGNhbGwgY29yb3V0aW5lIGRlYnVnICcgK1xuICAgICAgICAnaW8gbWF0aCBvcyBwYWNrYWdlIHN0cmluZyB0YWJsZSdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBDT01NRU5UUy5jb25jYXQoW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAga2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46ICcoW19hLXpBLVpdXFxcXHcqXFxcXC4pKihbX2EtekEtWl1cXFxcdyo6KT9bX2EtekEtWl1cXFxcdyonXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAgY29udGFpbnM6IENPTU1FTlRTXG4gICAgICAgICAgfVxuICAgICAgICBdLmNvbmNhdChDT01NRU5UUylcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogT1BFTklOR19MT05HX0JSQUNLRVQsIGVuZDogQ0xPU0lOR19MT05HX0JSQUNLRVQsXG4gICAgICAgIGNvbnRhaW5zOiBbTE9OR19CUkFDS0VUU10sXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH1cbiAgICBdKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgLy8gaGlnaGxpZ2h0IGhlYWRlcnNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeI3sxLDN9JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXi4rP1xcXFxuWz0tXXsyLH0kJ1xuICAgICAgfSxcbiAgICAgIC8vIGlubGluZSBodG1sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPCcsIGVuZDogJz4nLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3htbCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIGxpc3RzIChpbmRpY2F0b3JzIG9ubHkpXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2J1bGxldCcsXG4gICAgICAgIGJlZ2luOiAnXihbKistXXwoXFxcXGQrXFxcXC4pKVxcXFxzKydcbiAgICAgIH0sXG4gICAgICAvLyBzdHJvbmcgc2VnbWVudHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3Ryb25nJyxcbiAgICAgICAgYmVnaW46ICdbKl9dezJ9Lis/WypfXXsyfSdcbiAgICAgIH0sXG4gICAgICAvLyBlbXBoYXNpcyBzZWdtZW50c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbXBoYXNpcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCouKz9cXFxcKidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VtcGhhc2lzJyxcbiAgICAgICAgYmVnaW46ICdfLis/XycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIC8vIGJsb2NrcXVvdGVzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Jsb2NrcXVvdGUnLFxuICAgICAgICBiZWdpbjogJ14+XFxcXHMrJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICAvLyBjb2RlIHNuaXBwZXRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvZGUnLFxuICAgICAgICBiZWdpbjogJ2AuKz9gJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29kZScsXG4gICAgICAgIGJlZ2luOiAnXiAgICAnLCBlbmQ6ICckJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gaG9yaXpvbnRhbCBydWxlc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdob3Jpem9udGFsX3J1bGUnLFxuICAgICAgICBiZWdpbjogJ14tezMsfScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgLy8gdXNpbmcgbGlua3MgLSB0aXRsZSBhbmQgbGlua1xuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxbLis/XFxcXF1cXFxcKC4rP1xcXFwpJyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua19sYWJlbCcsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFxbLitcXFxcXSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ2xpbmtfdXJsJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuXG4gIHZhciBDT01NT05fQ09OVEFJTlMgPSBbXG4gICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwge2JlZ2luOiAnXFwnXFwnJ31dLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfVxuICBdO1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdicmVhayBjYXNlIGNhdGNoIGNsYXNzZGVmIGNvbnRpbnVlIGVsc2UgZWxzZWlmIGVuZCBlbnVtZXJhdGVkIGV2ZW50cyBmb3IgZnVuY3Rpb24gJyArXG4gICAgICAgICdnbG9iYWwgaWYgbWV0aG9kcyBvdGhlcndpc2UgcGFyZm9yIHBlcnNpc3RlbnQgcHJvcGVydGllcyByZXR1cm4gc3BtZCBzd2l0Y2ggdHJ5IHdoaWxlJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnc2luIHNpbmQgc2luaCBhc2luIGFzaW5kIGFzaW5oIGNvcyBjb3NkIGNvc2ggYWNvcyBhY29zZCBhY29zaCB0YW4gdGFuZCB0YW5oIGF0YW4gJyArXG4gICAgICAgICdhdGFuZCBhdGFuMiBhdGFuaCBzZWMgc2VjZCBzZWNoIGFzZWMgYXNlY2QgYXNlY2ggY3NjIGNzY2QgY3NjaCBhY3NjIGFjc2NkIGFjc2NoIGNvdCAnICtcbiAgICAgICAgJ2NvdGQgY290aCBhY290IGFjb3RkIGFjb3RoIGh5cG90IGV4cCBleHBtMSBsb2cgbG9nMXAgbG9nMTAgbG9nMiBwb3cyIHJlYWxwb3cgcmVhbGxvZyAnICtcbiAgICAgICAgJ3JlYWxzcXJ0IHNxcnQgbnRocm9vdCBuZXh0cG93MiBhYnMgYW5nbGUgY29tcGxleCBjb25qIGltYWcgcmVhbCB1bndyYXAgaXNyZWFsICcgK1xuICAgICAgICAnY3BseHBhaXIgZml4IGZsb29yIGNlaWwgcm91bmQgbW9kIHJlbSBzaWduIGFpcnkgYmVzc2VsaiBiZXNzZWx5IGJlc3NlbGggYmVzc2VsaSAnICtcbiAgICAgICAgJ2Jlc3NlbGsgYmV0YSBiZXRhaW5jIGJldGFsbiBlbGxpcGogZWxsaXBrZSBlcmYgZXJmYyBlcmZjeCBlcmZpbnYgZXhwaW50IGdhbW1hICcgK1xuICAgICAgICAnZ2FtbWFpbmMgZ2FtbWFsbiBwc2kgbGVnZW5kcmUgY3Jvc3MgZG90IGZhY3RvciBpc3ByaW1lIHByaW1lcyBnY2QgbGNtIHJhdCByYXRzIHBlcm1zICcgK1xuICAgICAgICAnbmNob29zZWsgZmFjdG9yaWFsIGNhcnQyc3BoIGNhcnQycG9sIHBvbDJjYXJ0IHNwaDJjYXJ0IGhzdjJyZ2IgcmdiMmhzdiB6ZXJvcyBvbmVzICcgK1xuICAgICAgICAnZXllIHJlcG1hdCByYW5kIHJhbmRuIGxpbnNwYWNlIGxvZ3NwYWNlIGZyZXFzcGFjZSBtZXNoZ3JpZCBhY2N1bWFycmF5IHNpemUgbGVuZ3RoICcgK1xuICAgICAgICAnbmRpbXMgbnVtZWwgZGlzcCBpc2VtcHR5IGlzZXF1YWwgaXNlcXVhbHdpdGhlcXVhbG5hbnMgY2F0IHJlc2hhcGUgZGlhZyBibGtkaWFnIHRyaWwgJyArXG4gICAgICAgICd0cml1IGZsaXBsciBmbGlwdWQgZmxpcGRpbSByb3Q5MCBmaW5kIHN1YjJpbmQgaW5kMnN1YiBic3hmdW4gbmRncmlkIHBlcm11dGUgaXBlcm11dGUgJyArXG4gICAgICAgICdzaGlmdGRpbSBjaXJjc2hpZnQgc3F1ZWV6ZSBpc3NjYWxhciBpc3ZlY3RvciBhbnMgZXBzIHJlYWxtYXggcmVhbG1pbiBwaSBpIGluZiBuYW4gJyArXG4gICAgICAgICdpc25hbiBpc2luZiBpc2Zpbml0ZSBqIHdoeSBjb21wYW4gZ2FsbGVyeSBoYWRhbWFyZCBoYW5rZWwgaGlsYiBpbnZoaWxiIG1hZ2ljIHBhc2NhbCAnICtcbiAgICAgICAgJ3Jvc3NlciB0b2VwbGl0eiB2YW5kZXIgd2lsa2luc29uJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJygvL3xcInwjfC9cXFxcKnxcXFxccysvXFxcXHcrKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdmdW5jdGlvbicsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0cmFuc3Bvc2VkX3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICdbYS16QS1aX11bYS16QS1aXzAtOV0qKFxcJytbXFxcXC5cXCddKnxbXFxcXC5cXCddKyknLCBlbmQ6ICcnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtYXRyaXgnLFxuICAgICAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF1cXCcqW1xcXFwuXFwnXSonLFxuICAgICAgICBjb250YWluczogQ09NTU9OX0NPTlRBSU5TXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjZWxsJyxcbiAgICAgICAgYmVnaW46ICdcXFxceycsIGVuZDogJ1xcXFx9XFwnKltcXFxcLlxcJ10qJyxcbiAgICAgICAgY29udGFpbnM6IENPTU1PTl9DT05UQUlOU1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXCUnLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF0uY29uY2F0KENPTU1PTl9DT05UQUlOUylcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAnaW50IGZsb2F0IHN0cmluZyB2ZWN0b3IgbWF0cml4IGlmIGVsc2Ugc3dpdGNoIGNhc2UgZGVmYXVsdCB3aGlsZSBkbyBmb3IgaW4gYnJlYWsgJyArXG4gICAgICAnY29udGludWUgZ2xvYmFsIHByb2MgcmV0dXJuIGFib3V0IGFicyBhZGRBdHRyIGFkZEF0dHJpYnV0ZUVkaXRvck5vZGVIZWxwIGFkZER5bmFtaWMgJyArXG4gICAgICAnYWRkTmV3U2hlbGZUYWIgYWRkUFAgYWRkUGFuZWxDYXRlZ29yeSBhZGRQcmVmaXhUb05hbWUgYWR2YW5jZVRvTmV4dERyaXZlbktleSAnICtcbiAgICAgICdhZmZlY3RlZE5ldCBhZmZlY3RzIGFpbUNvbnN0cmFpbnQgYWlyIGFsaWFzIGFsaWFzQXR0ciBhbGlnbiBhbGlnbkN0eCBhbGlnbkN1cnZlICcgK1xuICAgICAgJ2FsaWduU3VyZmFjZSBhbGxWaWV3Rml0IGFtYmllbnRMaWdodCBhbmdsZSBhbmdsZUJldHdlZW4gYW5pbUNvbmUgYW5pbUN1cnZlRWRpdG9yICcgK1xuICAgICAgJ2FuaW1EaXNwbGF5IGFuaW1WaWV3IGFubm90YXRlIGFwcGVuZFN0cmluZ0FycmF5IGFwcGxpY2F0aW9uTmFtZSBhcHBseUF0dHJQcmVzZXQgJyArXG4gICAgICAnYXBwbHlUYWtlIGFyY0xlbkRpbUNvbnRleHQgYXJjTGVuZ3RoRGltZW5zaW9uIGFyY2xlbiBhcnJheU1hcHBlciBhcnQzZFBhaW50Q3R4ICcgK1xuICAgICAgJ2FydEF0dHJDdHggYXJ0QXR0clBhaW50VmVydGV4Q3R4IGFydEF0dHJTa2luUGFpbnRDdHggYXJ0QXR0clRvb2wgYXJ0QnVpbGRQYWludE1lbnUgJyArXG4gICAgICAnYXJ0Rmx1aWRBdHRyQ3R4IGFydFB1dHR5Q3R4IGFydFNlbGVjdEN0eCBhcnRTZXRQYWludEN0eCBhcnRVc2VyUGFpbnRDdHggYXNzaWduQ29tbWFuZCAnICtcbiAgICAgICdhc3NpZ25JbnB1dERldmljZSBhc3NpZ25WaWV3cG9ydEZhY3RvcmllcyBhdHRhY2hDdXJ2ZSBhdHRhY2hEZXZpY2VBdHRyIGF0dGFjaFN1cmZhY2UgJyArXG4gICAgICAnYXR0ckNvbG9yU2xpZGVyR3JwIGF0dHJDb21wYXRpYmlsaXR5IGF0dHJDb250cm9sR3JwIGF0dHJFbnVtT3B0aW9uTWVudSAnICtcbiAgICAgICdhdHRyRW51bU9wdGlvbk1lbnVHcnAgYXR0ckZpZWxkR3JwIGF0dHJGaWVsZFNsaWRlckdycCBhdHRyTmF2aWdhdGlvbkNvbnRyb2xHcnAgJyArXG4gICAgICAnYXR0clByZXNldEVkaXRXaW4gYXR0cmlidXRlRXhpc3RzIGF0dHJpYnV0ZUluZm8gYXR0cmlidXRlTWVudSBhdHRyaWJ1dGVRdWVyeSAnICtcbiAgICAgICdhdXRvS2V5ZnJhbWUgYXV0b1BsYWNlIGJha2VDbGlwIGJha2VGbHVpZFNoYWRpbmcgYmFrZVBhcnRpYWxIaXN0b3J5IGJha2VSZXN1bHRzICcgK1xuICAgICAgJ2Jha2VTaW11bGF0aW9uIGJhc2VuYW1lIGJhc2VuYW1lRXggYmF0Y2hSZW5kZXIgYmVzc2VsIGJldmVsIGJldmVsUGx1cyBiaW5NZW1iZXJzaGlwICcgK1xuICAgICAgJ2JpbmRTa2luIGJsZW5kMiBibGVuZFNoYXBlIGJsZW5kU2hhcGVFZGl0b3IgYmxlbmRTaGFwZVBhbmVsIGJsZW5kVHdvQXR0ciBibGluZERhdGFUeXBlICcgK1xuICAgICAgJ2JvbmVMYXR0aWNlIGJvdW5kYXJ5IGJveERvbGx5Q3R4IGJveFpvb21DdHggYnVmZmVyQ3VydmUgYnVpbGRCb29rbWFya01lbnUgJyArXG4gICAgICAnYnVpbGRLZXlmcmFtZU1lbnUgYnV0dG9uIGJ1dHRvbk1hbmlwIENCRyBjYWNoZUZpbGUgY2FjaGVGaWxlQ29tYmluZSBjYWNoZUZpbGVNZXJnZSAnICtcbiAgICAgICdjYWNoZUZpbGVUcmFjayBjYW1lcmEgY2FtZXJhVmlldyBjYW5DcmVhdGVNYW5pcCBjYW52YXMgY2FwaXRhbGl6ZVN0cmluZyBjYXRjaCAnICtcbiAgICAgICdjYXRjaFF1aWV0IGNlaWwgY2hhbmdlU3ViZGl2Q29tcG9uZW50RGlzcGxheUxldmVsIGNoYW5nZVN1YmRpdlJlZ2lvbiBjaGFubmVsQm94ICcgK1xuICAgICAgJ2NoYXJhY3RlciBjaGFyYWN0ZXJNYXAgY2hhcmFjdGVyT3V0bGluZUVkaXRvciBjaGFyYWN0ZXJpemUgY2hkaXIgY2hlY2tCb3ggY2hlY2tCb3hHcnAgJyArXG4gICAgICAnY2hlY2tEZWZhdWx0UmVuZGVyR2xvYmFscyBjaG9pY2UgY2lyY2xlIGNpcmN1bGFyRmlsbGV0IGNsYW1wIGNsZWFyIGNsZWFyQ2FjaGUgY2xpcCAnICtcbiAgICAgICdjbGlwRWRpdG9yIGNsaXBFZGl0b3JDdXJyZW50VGltZUN0eCBjbGlwU2NoZWR1bGUgY2xpcFNjaGVkdWxlck91dGxpbmVyIGNsaXBUcmltQmVmb3JlICcgK1xuICAgICAgJ2Nsb3NlQ3VydmUgY2xvc2VTdXJmYWNlIGNsdXN0ZXIgY21kRmlsZU91dHB1dCBjbWRTY3JvbGxGaWVsZEV4ZWN1dGVyICcgK1xuICAgICAgJ2NtZFNjcm9sbEZpZWxkUmVwb3J0ZXIgY21kU2hlbGwgY29hcnNlblN1YmRpdlNlbGVjdGlvbkxpc3QgY29sbGlzaW9uIGNvbG9yICcgK1xuICAgICAgJ2NvbG9yQXRQb2ludCBjb2xvckVkaXRvciBjb2xvckluZGV4IGNvbG9ySW5kZXhTbGlkZXJHcnAgY29sb3JTbGlkZXJCdXR0b25HcnAgJyArXG4gICAgICAnY29sb3JTbGlkZXJHcnAgY29sdW1uTGF5b3V0IGNvbW1hbmRFY2hvIGNvbW1hbmRMaW5lIGNvbW1hbmRQb3J0IGNvbXBhY3RIYWlyU3lzdGVtICcgK1xuICAgICAgJ2NvbXBvbmVudEVkaXRvciBjb21wb3NpdGluZ0ludGVyb3AgY29tcHV0ZVBvbHlzZXRWb2x1bWUgY29uZGl0aW9uIGNvbmUgY29uZmlybURpYWxvZyAnICtcbiAgICAgICdjb25uZWN0QXR0ciBjb25uZWN0Q29udHJvbCBjb25uZWN0RHluYW1pYyBjb25uZWN0Sm9pbnQgY29ubmVjdGlvbkluZm8gY29uc3RyYWluICcgK1xuICAgICAgJ2NvbnN0cmFpblZhbHVlIGNvbnN0cnVjdGlvbkhpc3RvcnkgY29udGFpbmVyIGNvbnRhaW5zTXVsdGlieXRlIGNvbnRleHRJbmZvIGNvbnRyb2wgJyArXG4gICAgICAnY29udmVydEZyb21PbGRMYXllcnMgY29udmVydElmZlRvUHNkIGNvbnZlcnRMaWdodG1hcCBjb252ZXJ0U29saWRUeCBjb252ZXJ0VGVzc2VsbGF0aW9uICcgK1xuICAgICAgJ2NvbnZlcnRVbml0IGNvcHlBcnJheSBjb3B5RmxleG9yIGNvcHlLZXkgY29weVNraW5XZWlnaHRzIGNvcyBjcEJ1dHRvbiBjcENhY2hlICcgK1xuICAgICAgJ2NwQ2xvdGhTZXQgY3BDb2xsaXNpb24gY3BDb25zdHJhaW50IGNwQ29udkNsb3RoVG9NZXNoIGNwRm9yY2VzIGNwR2V0U29sdmVyQXR0ciBjcFBhbmVsICcgK1xuICAgICAgJ2NwUHJvcGVydHkgY3BSaWdpZENvbGxpc2lvbkZpbHRlciBjcFNlYW0gY3BTZXRFZGl0IGNwU2V0U29sdmVyQXR0ciBjcFNvbHZlciAnICtcbiAgICAgICdjcFNvbHZlclR5cGVzIGNwVG9vbCBjcFVwZGF0ZUNsb3RoVVZzIGNyZWF0ZURpc3BsYXlMYXllciBjcmVhdGVEcmF3Q3R4IGNyZWF0ZUVkaXRvciAnICtcbiAgICAgICdjcmVhdGVMYXllcmVkUHNkRmlsZSBjcmVhdGVNb3Rpb25GaWVsZCBjcmVhdGVOZXdTaGVsZiBjcmVhdGVOb2RlIGNyZWF0ZVJlbmRlckxheWVyICcgK1xuICAgICAgJ2NyZWF0ZVN1YmRpdlJlZ2lvbiBjcm9zcyBjcm9zc1Byb2R1Y3QgY3R4QWJvcnQgY3R4Q29tcGxldGlvbiBjdHhFZGl0TW9kZSBjdHhUcmF2ZXJzZSAnICtcbiAgICAgICdjdXJyZW50Q3R4IGN1cnJlbnRUaW1lIGN1cnJlbnRUaW1lQ3R4IGN1cnJlbnRVbml0IGN1cnJlbnRVbml0IGN1cnZlIGN1cnZlQWRkUHRDdHggJyArXG4gICAgICAnY3VydmVDVkN0eCBjdXJ2ZUVQQ3R4IGN1cnZlRWRpdG9yQ3R4IGN1cnZlSW50ZXJzZWN0IGN1cnZlTW92ZUVQQ3R4IGN1cnZlT25TdXJmYWNlICcgK1xuICAgICAgJ2N1cnZlU2tldGNoQ3R4IGN1dEtleSBjeWNsZUNoZWNrIGN5bGluZGVyIGRhZ1Bvc2UgZGF0ZSBkZWZhdWx0TGlnaHRMaXN0Q2hlY2tCb3ggJyArXG4gICAgICAnZGVmYXVsdE5hdmlnYXRpb24gZGVmaW5lRGF0YVNlcnZlciBkZWZpbmVWaXJ0dWFsRGV2aWNlIGRlZm9ybWVyIGRlZ190b19yYWQgZGVsZXRlICcgK1xuICAgICAgJ2RlbGV0ZUF0dHIgZGVsZXRlU2hhZGluZ0dyb3Vwc0FuZE1hdGVyaWFscyBkZWxldGVTaGVsZlRhYiBkZWxldGVVSSBkZWxldGVVbnVzZWRCcnVzaGVzICcgK1xuICAgICAgJ2RlbHJhbmRzdHIgZGV0YWNoQ3VydmUgZGV0YWNoRGV2aWNlQXR0ciBkZXRhY2hTdXJmYWNlIGRldmljZUVkaXRvciBkZXZpY2VQYW5lbCBkZ0luZm8gJyArXG4gICAgICAnZGdkaXJ0eSBkZ2V2YWwgZGd0aW1lciBkaW1XaGVuIGRpcmVjdEtleUN0eCBkaXJlY3Rpb25hbExpZ2h0IGRpcm1hcCBkaXJuYW1lIGRpc2FibGUgJyArXG4gICAgICAnZGlzY29ubmVjdEF0dHIgZGlzY29ubmVjdEpvaW50IGRpc2tDYWNoZSBkaXNwbGFjZW1lbnRUb1BvbHkgZGlzcGxheUFmZmVjdGVkICcgK1xuICAgICAgJ2Rpc3BsYXlDb2xvciBkaXNwbGF5Q3VsbCBkaXNwbGF5TGV2ZWxPZkRldGFpbCBkaXNwbGF5UHJlZiBkaXNwbGF5UkdCQ29sb3IgJyArXG4gICAgICAnZGlzcGxheVNtb290aG5lc3MgZGlzcGxheVN0YXRzIGRpc3BsYXlTdHJpbmcgZGlzcGxheVN1cmZhY2UgZGlzdGFuY2VEaW1Db250ZXh0ICcgK1xuICAgICAgJ2Rpc3RhbmNlRGltZW5zaW9uIGRvQmx1ciBkb2xseSBkb2xseUN0eCBkb3BlU2hlZXRFZGl0b3IgZG90IGRvdFByb2R1Y3QgJyArXG4gICAgICAnZG91YmxlUHJvZmlsZUJpcmFpbFN1cmZhY2UgZHJhZyBkcmFnQXR0ckNvbnRleHQgZHJhZ2dlckNvbnRleHQgZHJvcG9mZkxvY2F0b3IgJyArXG4gICAgICAnZHVwbGljYXRlIGR1cGxpY2F0ZUN1cnZlIGR1cGxpY2F0ZVN1cmZhY2UgZHluQ2FjaGUgZHluQ29udHJvbCBkeW5FeHBvcnQgZHluRXhwcmVzc2lvbiAnICtcbiAgICAgICdkeW5HbG9iYWxzIGR5blBhaW50RWRpdG9yIGR5blBhcnRpY2xlQ3R4IGR5blByZWYgZHluUmVsRWRQYW5lbCBkeW5SZWxFZGl0b3IgJyArXG4gICAgICAnZHluYW1pY0xvYWQgZWRpdEF0dHJMaW1pdHMgZWRpdERpc3BsYXlMYXllckdsb2JhbHMgZWRpdERpc3BsYXlMYXllck1lbWJlcnMgJyArXG4gICAgICAnZWRpdFJlbmRlckxheWVyQWRqdXN0bWVudCBlZGl0UmVuZGVyTGF5ZXJHbG9iYWxzIGVkaXRSZW5kZXJMYXllck1lbWJlcnMgZWRpdG9yICcgK1xuICAgICAgJ2VkaXRvclRlbXBsYXRlIGVmZmVjdG9yIGVtaXQgZW1pdHRlciBlbmFibGVEZXZpY2UgZW5jb2RlU3RyaW5nIGVuZFN0cmluZyBlbmRzV2l0aCBlbnYgJyArXG4gICAgICAnZXF1aXZhbGVudCBlcXVpdmFsZW50VG9sIGVyZiBlcnJvciBldmFsIGV2YWwgZXZhbERlZmVycmVkIGV2YWxFY2hvIGV2ZW50ICcgK1xuICAgICAgJ2V4YWN0V29ybGRCb3VuZGluZ0JveCBleGNsdXNpdmVMaWdodENoZWNrQm94IGV4ZWMgZXhlY3V0ZUZvckVhY2hPYmplY3QgZXhpc3RzIGV4cCAnICtcbiAgICAgICdleHByZXNzaW9uIGV4cHJlc3Npb25FZGl0b3JMaXN0ZW4gZXh0ZW5kQ3VydmUgZXh0ZW5kU3VyZmFjZSBleHRydWRlIGZjaGVjayBmY2xvc2UgZmVvZiAnICtcbiAgICAgICdmZmx1c2ggZmdldGxpbmUgZmdldHdvcmQgZmlsZSBmaWxlQnJvd3NlckRpYWxvZyBmaWxlRGlhbG9nIGZpbGVFeHRlbnNpb24gZmlsZUluZm8gJyArXG4gICAgICAnZmlsZXRlc3QgZmlsbGV0Q3VydmUgZmlsdGVyIGZpbHRlckN1cnZlIGZpbHRlckV4cGFuZCBmaWx0ZXJTdHVkaW9JbXBvcnQgJyArXG4gICAgICAnZmluZEFsbEludGVyc2VjdGlvbnMgZmluZEFuaW1DdXJ2ZXMgZmluZEtleWZyYW1lIGZpbmRNZW51SXRlbSBmaW5kUmVsYXRlZFNraW5DbHVzdGVyICcgK1xuICAgICAgJ2ZpbmRlciBmaXJzdFBhcmVudE9mIGZpdEJzcGxpbmUgZmxleG9yIGZsb2F0RXEgZmxvYXRGaWVsZCBmbG9hdEZpZWxkR3JwIGZsb2F0U2Nyb2xsQmFyICcgK1xuICAgICAgJ2Zsb2F0U2xpZGVyIGZsb2F0U2xpZGVyMiBmbG9hdFNsaWRlckJ1dHRvbkdycCBmbG9hdFNsaWRlckdycCBmbG9vciBmbG93IGZsdWlkQ2FjaGVJbmZvICcgK1xuICAgICAgJ2ZsdWlkRW1pdHRlciBmbHVpZFZveGVsSW5mbyBmbHVzaFVuZG8gZm1vZCBmb250RGlhbG9nIGZvcGVuIGZvcm1MYXlvdXQgZm9ybWF0IGZwcmludCAnICtcbiAgICAgICdmcmFtZUxheW91dCBmcmVhZCBmcmVlRm9ybUZpbGxldCBmcmV3aW5kIGZyb21OYXRpdmVQYXRoIGZ3cml0ZSBnYW1tYSBnYXVzcyAnICtcbiAgICAgICdnZW9tZXRyeUNvbnN0cmFpbnQgZ2V0QXBwbGljYXRpb25WZXJzaW9uQXNGbG9hdCBnZXRBdHRyIGdldENsYXNzaWZpY2F0aW9uICcgK1xuICAgICAgJ2dldERlZmF1bHRCcnVzaCBnZXRGaWxlTGlzdCBnZXRGbHVpZEF0dHIgZ2V0SW5wdXREZXZpY2VSYW5nZSBnZXRNYXlhUGFuZWxUeXBlcyAnICtcbiAgICAgICdnZXRNb2RpZmllcnMgZ2V0UGFuZWwgZ2V0UGFydGljbGVBdHRyIGdldFBsdWdpblJlc291cmNlIGdldGVudiBnZXRwaWQgZ2xSZW5kZXIgJyArXG4gICAgICAnZ2xSZW5kZXJFZGl0b3IgZ2xvYmFsU3RpdGNoIGdtYXRjaCBnb2FsIGdvdG9CaW5kUG9zZSBncmFiQ29sb3IgZ3JhZGllbnRDb250cm9sICcgK1xuICAgICAgJ2dyYWRpZW50Q29udHJvbE5vQXR0ciBncmFwaERvbGx5Q3R4IGdyYXBoU2VsZWN0Q29udGV4dCBncmFwaFRyYWNrQ3R4IGdyYXZpdHkgZ3JpZCAnICtcbiAgICAgICdncmlkTGF5b3V0IGdyb3VwIGdyb3VwT2JqZWN0c0J5TmFtZSBIZkFkZEF0dHJhY3RvclRvQVMgSGZBc3NpZ25BUyBIZkJ1aWxkRXF1YWxNYXAgJyArXG4gICAgICAnSGZCdWlsZEZ1ckZpbGVzIEhmQnVpbGRGdXJJbWFnZXMgSGZDYW5jZWxBRlIgSGZDb25uZWN0QVNUb0hGIEhmQ3JlYXRlQXR0cmFjdG9yICcgK1xuICAgICAgJ0hmRGVsZXRlQVMgSGZFZGl0QVMgSGZQZXJmb3JtQ3JlYXRlQVMgSGZSZW1vdmVBdHRyYWN0b3JGcm9tQVMgSGZTZWxlY3RBdHRhY2hlZCAnICtcbiAgICAgICdIZlNlbGVjdEF0dHJhY3RvcnMgSGZVbkFzc2lnbkFTIGhhcmRlblBvaW50Q3VydmUgaGFyZHdhcmUgaGFyZHdhcmVSZW5kZXJQYW5lbCAnICtcbiAgICAgICdoZWFkc1VwRGlzcGxheSBoZWFkc1VwTWVzc2FnZSBoZWxwIGhlbHBMaW5lIGhlcm1pdGUgaGlkZSBoaWxpdGUgaGl0VGVzdCBob3RCb3ggaG90a2V5ICcgK1xuICAgICAgJ2hvdGtleUNoZWNrIGhzdl90b19yZ2IgaHVkQnV0dG9uIGh1ZFNsaWRlciBodWRTbGlkZXJCdXR0b24gaHdSZWZsZWN0aW9uTWFwIGh3UmVuZGVyICcgK1xuICAgICAgJ2h3UmVuZGVyTG9hZCBoeXBlckdyYXBoIGh5cGVyUGFuZWwgaHlwZXJTaGFkZSBoeXBvdCBpY29uVGV4dEJ1dHRvbiBpY29uVGV4dENoZWNrQm94ICcgK1xuICAgICAgJ2ljb25UZXh0UmFkaW9CdXR0b24gaWNvblRleHRSYWRpb0NvbGxlY3Rpb24gaWNvblRleHRTY3JvbGxMaXN0IGljb25UZXh0U3RhdGljTGFiZWwgJyArXG4gICAgICAnaWtIYW5kbGUgaWtIYW5kbGVDdHggaWtIYW5kbGVEaXNwbGF5U2NhbGUgaWtTb2x2ZXIgaWtTcGxpbmVIYW5kbGVDdHggaWtTeXN0ZW0gJyArXG4gICAgICAnaWtTeXN0ZW1JbmZvIGlrZmtEaXNwbGF5TWV0aG9kIGlsbHVzdHJhdG9yQ3VydmVzIGltYWdlIGltZlBsdWdpbnMgaW5oZXJpdFRyYW5zZm9ybSAnICtcbiAgICAgICdpbnNlcnRKb2ludCBpbnNlcnRKb2ludEN0eCBpbnNlcnRLZXlDdHggaW5zZXJ0S25vdEN1cnZlIGluc2VydEtub3RTdXJmYWNlIGluc3RhbmNlICcgK1xuICAgICAgJ2luc3RhbmNlYWJsZSBpbnN0YW5jZXIgaW50RmllbGQgaW50RmllbGRHcnAgaW50U2Nyb2xsQmFyIGludFNsaWRlciBpbnRTbGlkZXJHcnAgJyArXG4gICAgICAnaW50ZXJUb1VJIGludGVybmFsVmFyIGludGVyc2VjdCBpcHJFbmdpbmUgaXNBbmltQ3VydmUgaXNDb25uZWN0ZWQgaXNEaXJ0eSBpc1BhcmVudE9mICcgK1xuICAgICAgJ2lzU2FtZU9iamVjdCBpc1RydWUgaXNWYWxpZE9iamVjdE5hbWUgaXNWYWxpZFN0cmluZyBpc1ZhbGlkVWlOYW1lIGlzb2xhdGVTZWxlY3QgJyArXG4gICAgICAnaXRlbUZpbHRlciBpdGVtRmlsdGVyQXR0ciBpdGVtRmlsdGVyUmVuZGVyIGl0ZW1GaWx0ZXJUeXBlIGpvaW50IGpvaW50Q2x1c3RlciBqb2ludEN0eCAnICtcbiAgICAgICdqb2ludERpc3BsYXlTY2FsZSBqb2ludExhdHRpY2Uga2V5VGFuZ2VudCBrZXlmcmFtZSBrZXlmcmFtZU91dGxpbmVyICcgK1xuICAgICAgJ2tleWZyYW1lUmVnaW9uQ3VycmVudFRpbWVDdHgga2V5ZnJhbWVSZWdpb25EaXJlY3RLZXlDdHgga2V5ZnJhbWVSZWdpb25Eb2xseUN0eCAnICtcbiAgICAgICdrZXlmcmFtZVJlZ2lvbkluc2VydEtleUN0eCBrZXlmcmFtZVJlZ2lvbk1vdmVLZXlDdHgga2V5ZnJhbWVSZWdpb25TY2FsZUtleUN0eCAnICtcbiAgICAgICdrZXlmcmFtZVJlZ2lvblNlbGVjdEtleUN0eCBrZXlmcmFtZVJlZ2lvblNldEtleUN0eCBrZXlmcmFtZVJlZ2lvblRyYWNrQ3R4ICcgK1xuICAgICAgJ2tleWZyYW1lU3RhdHMgbGFzc29Db250ZXh0IGxhdHRpY2UgbGF0dGljZURlZm9ybUtleUN0eCBsYXVuY2ggbGF1bmNoSW1hZ2VFZGl0b3IgJyArXG4gICAgICAnbGF5ZXJCdXR0b24gbGF5ZXJlZFNoYWRlclBvcnQgbGF5ZXJlZFRleHR1cmVQb3J0IGxheW91dCBsYXlvdXREaWFsb2cgbGlnaHRMaXN0ICcgK1xuICAgICAgJ2xpZ2h0TGlzdEVkaXRvciBsaWdodExpc3RQYW5lbCBsaWdodGxpbmsgbGluZUludGVyc2VjdGlvbiBsaW5lYXJQcmVjaXNpb24gbGluc3RlcCAnICtcbiAgICAgICdsaXN0QW5pbWF0YWJsZSBsaXN0QXR0ciBsaXN0Q2FtZXJhcyBsaXN0Q29ubmVjdGlvbnMgbGlzdERldmljZUF0dGFjaG1lbnRzIGxpc3RIaXN0b3J5ICcgK1xuICAgICAgJ2xpc3RJbnB1dERldmljZUF4ZXMgbGlzdElucHV0RGV2aWNlQnV0dG9ucyBsaXN0SW5wdXREZXZpY2VzIGxpc3RNZW51QW5ub3RhdGlvbiAnICtcbiAgICAgICdsaXN0Tm9kZVR5cGVzIGxpc3RQYW5lbENhdGVnb3JpZXMgbGlzdFJlbGF0aXZlcyBsaXN0U2V0cyBsaXN0VHJhbnNmb3JtcyAnICtcbiAgICAgICdsaXN0VW5zZWxlY3RlZCBsaXN0ZXJFZGl0b3IgbG9hZEZsdWlkIGxvYWROZXdTaGVsZiBsb2FkUGx1Z2luICcgK1xuICAgICAgJ2xvYWRQbHVnaW5MYW5ndWFnZVJlc291cmNlcyBsb2FkUHJlZk9iamVjdHMgbG9jYWxpemVkUGFuZWxMYWJlbCBsb2NrTm9kZSBsb2Z0IGxvZyAnICtcbiAgICAgICdsb25nTmFtZU9mIGxvb2tUaHJ1IGxzIGxzVGhyb3VnaEZpbHRlciBsc1R5cGUgbHNVSSBNYXlhdG9tciBtYWcgbWFrZUlkZW50aXR5IG1ha2VMaXZlICcgK1xuICAgICAgJ21ha2VQYWludGFibGUgbWFrZVJvbGwgbWFrZVNpbmdsZVN1cmZhY2UgbWFrZVR1YmVPbiBtYWtlYm90IG1hbmlwTW92ZUNvbnRleHQgJyArXG4gICAgICAnbWFuaXBNb3ZlTGltaXRzQ3R4IG1hbmlwT3B0aW9ucyBtYW5pcFJvdGF0ZUNvbnRleHQgbWFuaXBSb3RhdGVMaW1pdHNDdHggJyArXG4gICAgICAnbWFuaXBTY2FsZUNvbnRleHQgbWFuaXBTY2FsZUxpbWl0c0N0eCBtYXJrZXIgbWF0Y2ggbWF4IG1lbW9yeSBtZW51IG1lbnVCYXJMYXlvdXQgJyArXG4gICAgICAnbWVudUVkaXRvciBtZW51SXRlbSBtZW51SXRlbVRvU2hlbGYgbWVudVNldCBtZW51U2V0UHJlZiBtZXNzYWdlTGluZSBtaW4gbWluaW1pemVBcHAgJyArXG4gICAgICAnbWlycm9ySm9pbnQgbW9kZWxDdXJyZW50VGltZUN0eCBtb2RlbEVkaXRvciBtb2RlbFBhbmVsIG1vdXNlIG1vdkluIG1vdk91dCBtb3ZlICcgK1xuICAgICAgJ21vdmVJS3RvRksgbW92ZUtleUN0eCBtb3ZlVmVydGV4QWxvbmdEaXJlY3Rpb24gbXVsdGlQcm9maWxlQmlyYWlsU3VyZmFjZSBtdXRlICcgK1xuICAgICAgJ25QYXJ0aWNsZSBuYW1lQ29tbWFuZCBuYW1lRmllbGQgbmFtZXNwYWNlIG5hbWVzcGFjZUluZm8gbmV3UGFuZWxJdGVtcyBuZXd0b24gbm9kZUNhc3QgJyArXG4gICAgICAnbm9kZUljb25CdXR0b24gbm9kZU91dGxpbmVyIG5vZGVQcmVzZXQgbm9kZVR5cGUgbm9pc2Ugbm9uTGluZWFyIG5vcm1hbENvbnN0cmFpbnQgJyArXG4gICAgICAnbm9ybWFsaXplIG51cmJzQm9vbGVhbiBudXJic0NvcHlVVlNldCBudXJic0N1YmUgbnVyYnNFZGl0VVYgbnVyYnNQbGFuZSBudXJic1NlbGVjdCAnICtcbiAgICAgICdudXJic1NxdWFyZSBudXJic1RvUG9seSBudXJic1RvUG9seWdvbnNQcmVmIG51cmJzVG9TdWJkaXYgbnVyYnNUb1N1YmRpdlByZWYgJyArXG4gICAgICAnbnVyYnNVVlNldCBudXJic1ZpZXdEaXJlY3Rpb25WZWN0b3Igb2JqRXhpc3RzIG9iamVjdENlbnRlciBvYmplY3RMYXllciBvYmplY3RUeXBlICcgK1xuICAgICAgJ29iamVjdFR5cGVVSSBvYnNvbGV0ZVByb2Mgb2NlYW5OdXJic1ByZXZpZXdQbGFuZSBvZmZzZXRDdXJ2ZSBvZmZzZXRDdXJ2ZU9uU3VyZmFjZSAnICtcbiAgICAgICdvZmZzZXRTdXJmYWNlIG9wZW5HTEV4dGVuc2lvbiBvcGVuTWF5YVByZWYgb3B0aW9uTWVudSBvcHRpb25NZW51R3JwIG9wdGlvblZhciBvcmJpdCAnICtcbiAgICAgICdvcmJpdEN0eCBvcmllbnRDb25zdHJhaW50IG91dGxpbmVyRWRpdG9yIG91dGxpbmVyUGFuZWwgb3ZlcnJpZGVNb2RpZmllciAnICtcbiAgICAgICdwYWludEVmZmVjdHNEaXNwbGF5IHBhaXJCbGVuZCBwYWxldHRlUG9ydCBwYW5lTGF5b3V0IHBhbmVsIHBhbmVsQ29uZmlndXJhdGlvbiAnICtcbiAgICAgICdwYW5lbEhpc3RvcnkgcGFyYW1EaW1Db250ZXh0IHBhcmFtRGltZW5zaW9uIHBhcmFtTG9jYXRvciBwYXJlbnQgcGFyZW50Q29uc3RyYWludCAnICtcbiAgICAgICdwYXJ0aWNsZSBwYXJ0aWNsZUV4aXN0cyBwYXJ0aWNsZUluc3RhbmNlciBwYXJ0aWNsZVJlbmRlckluZm8gcGFydGl0aW9uIHBhc3RlS2V5ICcgK1xuICAgICAgJ3BhdGhBbmltYXRpb24gcGF1c2UgcGNsb3NlIHBlcmNlbnQgcGVyZm9ybWFuY2VPcHRpb25zIHBmeHN0cm9rZXMgcGlja1dhbGsgcGljdHVyZSAnICtcbiAgICAgICdwaXhlbE1vdmUgcGxhbmFyU3JmIHBsYW5lIHBsYXkgcGxheWJhY2tPcHRpb25zIHBsYXlibGFzdCBwbHVnQXR0ciBwbHVnTm9kZSBwbHVnaW5JbmZvICcgK1xuICAgICAgJ3BsdWdpblJlc291cmNlVXRpbCBwb2ludENvbnN0cmFpbnQgcG9pbnRDdXJ2ZUNvbnN0cmFpbnQgcG9pbnRMaWdodCBwb2ludE1hdHJpeE11bHQgJyArXG4gICAgICAncG9pbnRPbkN1cnZlIHBvaW50T25TdXJmYWNlIHBvaW50UG9zaXRpb24gcG9sZVZlY3RvckNvbnN0cmFpbnQgcG9seUFwcGVuZCAnICtcbiAgICAgICdwb2x5QXBwZW5kRmFjZXRDdHggcG9seUFwcGVuZFZlcnRleCBwb2x5QXV0b1Byb2plY3Rpb24gcG9seUF2ZXJhZ2VOb3JtYWwgJyArXG4gICAgICAncG9seUF2ZXJhZ2VWZXJ0ZXggcG9seUJldmVsIHBvbHlCbGVuZENvbG9yIHBvbHlCbGluZERhdGEgcG9seUJvb2xPcCBwb2x5QnJpZGdlRWRnZSAnICtcbiAgICAgICdwb2x5Q2FjaGVNb25pdG9yIHBvbHlDaGVjayBwb2x5Q2hpcE9mZiBwb2x5Q2xpcGJvYXJkIHBvbHlDbG9zZUJvcmRlciBwb2x5Q29sbGFwc2VFZGdlICcgK1xuICAgICAgJ3BvbHlDb2xsYXBzZUZhY2V0IHBvbHlDb2xvckJsaW5kRGF0YSBwb2x5Q29sb3JEZWwgcG9seUNvbG9yUGVyVmVydGV4IHBvbHlDb2xvclNldCAnICtcbiAgICAgICdwb2x5Q29tcGFyZSBwb2x5Q29uZSBwb2x5Q29weVVWIHBvbHlDcmVhc2UgcG9seUNyZWFzZUN0eCBwb2x5Q3JlYXRlRmFjZXQgJyArXG4gICAgICAncG9seUNyZWF0ZUZhY2V0Q3R4IHBvbHlDdWJlIHBvbHlDdXQgcG9seUN1dEN0eCBwb2x5Q3lsaW5kZXIgcG9seUN5bGluZHJpY2FsUHJvamVjdGlvbiAnICtcbiAgICAgICdwb2x5RGVsRWRnZSBwb2x5RGVsRmFjZXQgcG9seURlbFZlcnRleCBwb2x5RHVwbGljYXRlQW5kQ29ubmVjdCBwb2x5RHVwbGljYXRlRWRnZSAnICtcbiAgICAgICdwb2x5RWRpdFVWIHBvbHlFZGl0VVZTaGVsbCBwb2x5RXZhbHVhdGUgcG9seUV4dHJ1ZGVFZGdlIHBvbHlFeHRydWRlRmFjZXQgJyArXG4gICAgICAncG9seUV4dHJ1ZGVWZXJ0ZXggcG9seUZsaXBFZGdlIHBvbHlGbGlwVVYgcG9seUZvcmNlVVYgcG9seUdlb1NhbXBsZXIgcG9seUhlbGl4ICcgK1xuICAgICAgJ3BvbHlJbmZvIHBvbHlJbnN0YWxsQWN0aW9uIHBvbHlMYXlvdXRVViBwb2x5TGlzdENvbXBvbmVudENvbnZlcnNpb24gcG9seU1hcEN1dCAnICtcbiAgICAgICdwb2x5TWFwRGVsIHBvbHlNYXBTZXcgcG9seU1hcFNld01vdmUgcG9seU1lcmdlRWRnZSBwb2x5TWVyZ2VFZGdlQ3R4IHBvbHlNZXJnZUZhY2V0ICcgK1xuICAgICAgJ3BvbHlNZXJnZUZhY2V0Q3R4IHBvbHlNZXJnZVVWIHBvbHlNZXJnZVZlcnRleCBwb2x5TWlycm9yRmFjZSBwb2x5TW92ZUVkZ2UgJyArXG4gICAgICAncG9seU1vdmVGYWNldCBwb2x5TW92ZUZhY2V0VVYgcG9seU1vdmVVViBwb2x5TW92ZVZlcnRleCBwb2x5Tm9ybWFsIHBvbHlOb3JtYWxQZXJWZXJ0ZXggJyArXG4gICAgICAncG9seU5vcm1hbGl6ZVVWIHBvbHlPcHRVdnMgcG9seU9wdGlvbnMgcG9seU91dHB1dCBwb2x5UGlwZSBwb2x5UGxhbmFyUHJvamVjdGlvbiAnICtcbiAgICAgICdwb2x5UGxhbmUgcG9seVBsYXRvbmljU29saWQgcG9seVBva2UgcG9seVByaW1pdGl2ZSBwb2x5UHJpc20gcG9seVByb2plY3Rpb24gJyArXG4gICAgICAncG9seVB5cmFtaWQgcG9seVF1YWQgcG9seVF1ZXJ5QmxpbmREYXRhIHBvbHlSZWR1Y2UgcG9seVNlbGVjdCBwb2x5U2VsZWN0Q29uc3RyYWludCAnICtcbiAgICAgICdwb2x5U2VsZWN0Q29uc3RyYWludE1vbml0b3IgcG9seVNlbGVjdEN0eCBwb2x5U2VsZWN0RWRpdEN0eCBwb2x5U2VwYXJhdGUgJyArXG4gICAgICAncG9seVNldFRvRmFjZU5vcm1hbCBwb2x5U2V3RWRnZSBwb2x5U2hvcnRlc3RQYXRoQ3R4IHBvbHlTbW9vdGggcG9seVNvZnRFZGdlICcgK1xuICAgICAgJ3BvbHlTcGhlcmUgcG9seVNwaGVyaWNhbFByb2plY3Rpb24gcG9seVNwbGl0IHBvbHlTcGxpdEN0eCBwb2x5U3BsaXRFZGdlIHBvbHlTcGxpdFJpbmcgJyArXG4gICAgICAncG9seVNwbGl0VmVydGV4IHBvbHlTdHJhaWdodGVuVVZCb3JkZXIgcG9seVN1YmRpdmlkZUVkZ2UgcG9seVN1YmRpdmlkZUZhY2V0ICcgK1xuICAgICAgJ3BvbHlUb1N1YmRpdiBwb2x5VG9ydXMgcG9seVRyYW5zZmVyIHBvbHlUcmlhbmd1bGF0ZSBwb2x5VVZTZXQgcG9seVVuaXRlIHBvbHlXZWRnZUZhY2UgJyArXG4gICAgICAncG9wZW4gcG9wdXBNZW51IHBvc2UgcG93IHByZWxvYWRSZWZFZCBwcmludCBwcm9ncmVzc0JhciBwcm9ncmVzc1dpbmRvdyBwcm9qRmlsZVZpZXdlciAnICtcbiAgICAgICdwcm9qZWN0Q3VydmUgcHJvamVjdFRhbmdlbnQgcHJvamVjdGlvbkNvbnRleHQgcHJvamVjdGlvbk1hbmlwIHByb21wdERpYWxvZyBwcm9wTW9kQ3R4ICcgK1xuICAgICAgJ3Byb3BNb3ZlIHBzZENoYW5uZWxPdXRsaW5lciBwc2RFZGl0VGV4dHVyZUZpbGUgcHNkRXhwb3J0IHBzZFRleHR1cmVGaWxlIHB1dGVudiBwd2QgJyArXG4gICAgICAncHl0aG9uIHF1ZXJ5U3ViZGl2IHF1aXQgcmFkX3RvX2RlZyByYWRpYWwgcmFkaW9CdXR0b24gcmFkaW9CdXR0b25HcnAgcmFkaW9Db2xsZWN0aW9uICcgK1xuICAgICAgJ3JhZGlvTWVudUl0ZW1Db2xsZWN0aW9uIHJhbXBDb2xvclBvcnQgcmFuZCByYW5kb21pemVGb2xsaWNsZXMgcmFuZHN0YXRlIHJhbmdlQ29udHJvbCAnICtcbiAgICAgICdyZWFkVGFrZSByZWJ1aWxkQ3VydmUgcmVidWlsZFN1cmZhY2UgcmVjb3JkQXR0ciByZWNvcmREZXZpY2UgcmVkbyByZWZlcmVuY2UgJyArXG4gICAgICAncmVmZXJlbmNlRWRpdCByZWZlcmVuY2VRdWVyeSByZWZpbmVTdWJkaXZTZWxlY3Rpb25MaXN0IHJlZnJlc2ggcmVmcmVzaEFFICcgK1xuICAgICAgJ3JlZ2lzdGVyUGx1Z2luUmVzb3VyY2UgcmVoYXNoIHJlbG9hZEltYWdlIHJlbW92ZUpvaW50IHJlbW92ZU11bHRpSW5zdGFuY2UgJyArXG4gICAgICAncmVtb3ZlUGFuZWxDYXRlZ29yeSByZW5hbWUgcmVuYW1lQXR0ciByZW5hbWVTZWxlY3Rpb25MaXN0IHJlbmFtZVVJIHJlbmRlciAnICtcbiAgICAgICdyZW5kZXJHbG9iYWxzTm9kZSByZW5kZXJJbmZvIHJlbmRlckxheWVyQnV0dG9uIHJlbmRlckxheWVyUGFyZW50ICcgK1xuICAgICAgJ3JlbmRlckxheWVyUG9zdFByb2Nlc3MgcmVuZGVyTGF5ZXJVbnBhcmVudCByZW5kZXJNYW5pcCByZW5kZXJQYXJ0aXRpb24gJyArXG4gICAgICAncmVuZGVyUXVhbGl0eU5vZGUgcmVuZGVyU2V0dGluZ3MgcmVuZGVyVGh1bWJuYWlsVXBkYXRlIHJlbmRlcldpbmRvd0VkaXRvciAnICtcbiAgICAgICdyZW5kZXJXaW5kb3dTZWxlY3RDb250ZXh0IHJlbmRlcmVyIHJlb3JkZXIgcmVvcmRlckRlZm9ybWVycyByZXF1aXJlcyByZXJvb3QgJyArXG4gICAgICAncmVzYW1wbGVGbHVpZCByZXNldEFFIHJlc2V0UGZ4VG9Qb2x5Q2FtZXJhIHJlc2V0VG9vbCByZXNvbHV0aW9uTm9kZSByZXRhcmdldCAnICtcbiAgICAgICdyZXZlcnNlQ3VydmUgcmV2ZXJzZVN1cmZhY2UgcmV2b2x2ZSByZ2JfdG9faHN2IHJpZ2lkQm9keSByaWdpZFNvbHZlciByb2xsIHJvbGxDdHggJyArXG4gICAgICAncm9vdE9mIHJvdCByb3RhdGUgcm90YXRpb25JbnRlcnBvbGF0aW9uIHJvdW5kQ29uc3RhbnRSYWRpdXMgcm93Q29sdW1uTGF5b3V0IHJvd0xheW91dCAnICtcbiAgICAgICdydW5UaW1lQ29tbWFuZCBydW51cCBzYW1wbGVJbWFnZSBzYXZlQWxsU2hlbHZlcyBzYXZlQXR0clByZXNldCBzYXZlRmx1aWQgc2F2ZUltYWdlICcgK1xuICAgICAgJ3NhdmVJbml0aWFsU3RhdGUgc2F2ZU1lbnUgc2F2ZVByZWZPYmplY3RzIHNhdmVQcmVmcyBzYXZlU2hlbGYgc2F2ZVRvb2xTZXR0aW5ncyBzY2FsZSAnICtcbiAgICAgICdzY2FsZUJydXNoQnJpZ2h0bmVzcyBzY2FsZUNvbXBvbmVudHMgc2NhbGVDb25zdHJhaW50IHNjYWxlS2V5IHNjYWxlS2V5Q3R4IHNjZW5lRWRpdG9yICcgK1xuICAgICAgJ3NjZW5lVUlSZXBsYWNlbWVudCBzY21oIHNjcmlwdEN0eCBzY3JpcHRFZGl0b3JJbmZvIHNjcmlwdEpvYiBzY3JpcHROb2RlIHNjcmlwdFRhYmxlICcgK1xuICAgICAgJ3NjcmlwdFRvU2hlbGYgc2NyaXB0ZWRQYW5lbCBzY3JpcHRlZFBhbmVsVHlwZSBzY3JvbGxGaWVsZCBzY3JvbGxMYXlvdXQgc2N1bHB0ICcgK1xuICAgICAgJ3NlYXJjaFBhdGhBcnJheSBzZWVkIHNlbExvYWRTZXR0aW5ncyBzZWxlY3Qgc2VsZWN0Q29udGV4dCBzZWxlY3RDdXJ2ZUNWIHNlbGVjdEtleSAnICtcbiAgICAgICdzZWxlY3RLZXlDdHggc2VsZWN0S2V5ZnJhbWVSZWdpb25DdHggc2VsZWN0TW9kZSBzZWxlY3RQcmVmIHNlbGVjdFByaW9yaXR5IHNlbGVjdFR5cGUgJyArXG4gICAgICAnc2VsZWN0ZWROb2RlcyBzZWxlY3Rpb25Db25uZWN0aW9uIHNlcGFyYXRvciBzZXRBdHRyIHNldEF0dHJFbnVtUmVzb3VyY2UgJyArXG4gICAgICAnc2V0QXR0ck1hcHBpbmcgc2V0QXR0ck5pY2VOYW1lUmVzb3VyY2Ugc2V0Q29uc3RyYWludFJlc3RQb3NpdGlvbiAnICtcbiAgICAgICdzZXREZWZhdWx0U2hhZGluZ0dyb3VwIHNldERyaXZlbktleWZyYW1lIHNldER5bmFtaWMgc2V0RWRpdEN0eCBzZXRFZGl0b3Igc2V0Rmx1aWRBdHRyICcgK1xuICAgICAgJ3NldEZvY3VzIHNldEluZmluaXR5IHNldElucHV0RGV2aWNlTWFwcGluZyBzZXRLZXlDdHggc2V0S2V5UGF0aCBzZXRLZXlmcmFtZSAnICtcbiAgICAgICdzZXRLZXlmcmFtZUJsZW5kc2hhcGVUYXJnZXRXdHMgc2V0TWVudU1vZGUgc2V0Tm9kZU5pY2VOYW1lUmVzb3VyY2Ugc2V0Tm9kZVR5cGVGbGFnICcgK1xuICAgICAgJ3NldFBhcmVudCBzZXRQYXJ0aWNsZUF0dHIgc2V0UGZ4VG9Qb2x5Q2FtZXJhIHNldFBsdWdpblJlc291cmNlIHNldFByb2plY3QgJyArXG4gICAgICAnc2V0U3RhbXBEZW5zaXR5IHNldFN0YXJ0dXBNZXNzYWdlIHNldFN0YXRlIHNldFRvb2xUbyBzZXRVSVRlbXBsYXRlIHNldFhmb3JtTWFuaXAgc2V0cyAnICtcbiAgICAgICdzaGFkaW5nQ29ubmVjdGlvbiBzaGFkaW5nR2VvbWV0cnlSZWxDdHggc2hhZGluZ0xpZ2h0UmVsQ3R4IHNoYWRpbmdOZXR3b3JrQ29tcGFyZSAnICtcbiAgICAgICdzaGFkaW5nTm9kZSBzaGFwZUNvbXBhcmUgc2hlbGZCdXR0b24gc2hlbGZMYXlvdXQgc2hlbGZUYWJMYXlvdXQgc2hlbGxGaWVsZCAnICtcbiAgICAgICdzaG9ydE5hbWVPZiBzaG93SGVscCBzaG93SGlkZGVuIHNob3dNYW5pcEN0eCBzaG93U2VsZWN0aW9uSW5UaXRsZSAnICtcbiAgICAgICdzaG93U2hhZGluZ0dyb3VwQXR0ckVkaXRvciBzaG93V2luZG93IHNpZ24gc2ltcGxpZnkgc2luIHNpbmdsZVByb2ZpbGVCaXJhaWxTdXJmYWNlICcgK1xuICAgICAgJ3NpemUgc2l6ZUJ5dGVzIHNraW5DbHVzdGVyIHNraW5QZXJjZW50IHNtb290aEN1cnZlIHNtb290aFRhbmdlbnRTdXJmYWNlIHNtb290aHN0ZXAgJyArXG4gICAgICAnc25hcDJ0bzIgc25hcEtleSBzbmFwTW9kZSBzbmFwVG9nZXRoZXJDdHggc25hcHNob3Qgc29mdCBzb2Z0TW9kIHNvZnRNb2RDdHggc29ydCBzb3VuZCAnICtcbiAgICAgICdzb3VuZENvbnRyb2wgc291cmNlIHNwYWNlTG9jYXRvciBzcGhlcmUgc3BocmFuZCBzcG90TGlnaHQgc3BvdExpZ2h0UHJldmlld1BvcnQgJyArXG4gICAgICAnc3ByZWFkU2hlZXRFZGl0b3Igc3ByaW5nIHNxcnQgc3F1YXJlU3VyZmFjZSBzcnRDb250ZXh0IHN0YWNrVHJhY2Ugc3RhcnRTdHJpbmcgJyArXG4gICAgICAnc3RhcnRzV2l0aCBzdGl0Y2hBbmRFeHBsb2RlU2hlbGwgc3RpdGNoU3VyZmFjZSBzdGl0Y2hTdXJmYWNlUG9pbnRzIHN0cmNtcCAnICtcbiAgICAgICdzdHJpbmdBcnJheUNhdGVuYXRlIHN0cmluZ0FycmF5Q29udGFpbnMgc3RyaW5nQXJyYXlDb3VudCBzdHJpbmdBcnJheUluc2VydEF0SW5kZXggJyArXG4gICAgICAnc3RyaW5nQXJyYXlJbnRlcnNlY3RvciBzdHJpbmdBcnJheVJlbW92ZSBzdHJpbmdBcnJheVJlbW92ZUF0SW5kZXggJyArXG4gICAgICAnc3RyaW5nQXJyYXlSZW1vdmVEdXBsaWNhdGVzIHN0cmluZ0FycmF5UmVtb3ZlRXhhY3Qgc3RyaW5nQXJyYXlUb1N0cmluZyAnICtcbiAgICAgICdzdHJpbmdUb1N0cmluZ0FycmF5IHN0cmlwIHN0cmlwUHJlZml4RnJvbU5hbWUgc3Ryb2tlIHN1YmRBdXRvUHJvamVjdGlvbiAnICtcbiAgICAgICdzdWJkQ2xlYW5Ub3BvbG9neSBzdWJkQ29sbGFwc2Ugc3ViZER1cGxpY2F0ZUFuZENvbm5lY3Qgc3ViZEVkaXRVViAnICtcbiAgICAgICdzdWJkTGlzdENvbXBvbmVudENvbnZlcnNpb24gc3ViZE1hcEN1dCBzdWJkTWFwU2V3TW92ZSBzdWJkTWF0Y2hUb3BvbG9neSBzdWJkTWlycm9yICcgK1xuICAgICAgJ3N1YmRUb0JsaW5kIHN1YmRUb1BvbHkgc3ViZFRyYW5zZmVyVVZzVG9DYWNoZSBzdWJkaXYgc3ViZGl2Q3JlYXNlICcgK1xuICAgICAgJ3N1YmRpdkRpc3BsYXlTbW9vdGhuZXNzIHN1YnN0aXR1dGUgc3Vic3RpdHV0ZUFsbFN0cmluZyBzdWJzdGl0dXRlR2VvbWV0cnkgc3Vic3RyaW5nICcgK1xuICAgICAgJ3N1cmZhY2Ugc3VyZmFjZVNhbXBsZXIgc3VyZmFjZVNoYWRlckxpc3Qgc3dhdGNoRGlzcGxheVBvcnQgc3dpdGNoVGFibGUgc3ltYm9sQnV0dG9uICcgK1xuICAgICAgJ3N5bWJvbENoZWNrQm94IHN5c0ZpbGUgc3lzdGVtIHRhYkxheW91dCB0YW4gdGFuZ2VudENvbnN0cmFpbnQgdGV4TGF0dGljZURlZm9ybUNvbnRleHQgJyArXG4gICAgICAndGV4TWFuaXBDb250ZXh0IHRleE1vdmVDb250ZXh0IHRleE1vdmVVVlNoZWxsQ29udGV4dCB0ZXhSb3RhdGVDb250ZXh0IHRleFNjYWxlQ29udGV4dCAnICtcbiAgICAgICd0ZXhTZWxlY3RDb250ZXh0IHRleFNlbGVjdFNob3J0ZXN0UGF0aEN0eCB0ZXhTbXVkZ2VVVkNvbnRleHQgdGV4V2luVG9vbEN0eCB0ZXh0ICcgK1xuICAgICAgJ3RleHRDdXJ2ZXMgdGV4dEZpZWxkIHRleHRGaWVsZEJ1dHRvbkdycCB0ZXh0RmllbGRHcnAgdGV4dE1hbmlwIHRleHRTY3JvbGxMaXN0ICcgK1xuICAgICAgJ3RleHRUb1NoZWxmIHRleHR1cmVEaXNwbGFjZVBsYW5lIHRleHR1cmVIYWlyQ29sb3IgdGV4dHVyZVBsYWNlbWVudENvbnRleHQgJyArXG4gICAgICAndGV4dHVyZVdpbmRvdyB0aHJlYWRDb3VudCB0aHJlZVBvaW50QXJjQ3R4IHRpbWVDb250cm9sIHRpbWVQb3J0IHRpbWVyWCB0b05hdGl2ZVBhdGggJyArXG4gICAgICAndG9nZ2xlIHRvZ2dsZUF4aXMgdG9nZ2xlV2luZG93VmlzaWJpbGl0eSB0b2tlbml6ZSB0b2tlbml6ZUxpc3QgdG9sZXJhbmNlIHRvbG93ZXIgJyArXG4gICAgICAndG9vbEJ1dHRvbiB0b29sQ29sbGVjdGlvbiB0b29sRHJvcHBlZCB0b29sSGFzT3B0aW9ucyB0b29sUHJvcGVydHlXaW5kb3cgdG9ydXMgdG91cHBlciAnICtcbiAgICAgICd0cmFjZSB0cmFjayB0cmFja0N0eCB0cmFuc2ZlckF0dHJpYnV0ZXMgdHJhbnNmb3JtQ29tcGFyZSB0cmFuc2Zvcm1MaW1pdHMgdHJhbnNsYXRvciAnICtcbiAgICAgICd0cmltIHRydW5jIHRydW5jYXRlRmx1aWRDYWNoZSB0cnVuY2F0ZUhhaXJDYWNoZSB0dW1ibGUgdHVtYmxlQ3R4IHR1cmJ1bGVuY2UgJyArXG4gICAgICAndHdvUG9pbnRBcmNDdHggdWlSZXMgdWlUZW1wbGF0ZSB1bmFzc2lnbklucHV0RGV2aWNlIHVuZG8gdW5kb0luZm8gdW5ncm91cCB1bmlmb3JtIHVuaXQgJyArXG4gICAgICAndW5sb2FkUGx1Z2luIHVudGFuZ2xlVVYgdW50aXRsZWRGaWxlTmFtZSB1bnRyaW0gdXBBeGlzIHVwZGF0ZUFFIHVzZXJDdHggdXZMaW5rICcgK1xuICAgICAgJ3V2U25hcHNob3QgdmFsaWRhdGVTaGVsZk5hbWUgdmVjdG9yaXplIHZpZXcyZFRvb2xDdHggdmlld0NhbWVyYSB2aWV3Q2xpcFBsYW5lICcgK1xuICAgICAgJ3ZpZXdGaXQgdmlld0hlYWRPbiB2aWV3TG9va0F0IHZpZXdNYW5pcCB2aWV3UGxhY2Ugdmlld1NldCB2aXNvciB2b2x1bWVBeGlzIHZvcnRleCAnICtcbiAgICAgICd3YWl0Q3Vyc29yIHdhcm5pbmcgd2ViQnJvd3NlciB3ZWJCcm93c2VyUHJlZnMgd2hhdElzIHdpbmRvdyB3aW5kb3dQcmVmIHdpcmUgJyArXG4gICAgICAnd2lyZUNvbnRleHQgd29ya3NwYWNlIHdyaW5rbGUgd3JpbmtsZUNvbnRleHQgd3JpdGVUYWtlIHhibUxhbmdQYXRoTGlzdCB4Zm9ybScsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCcsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFwkXFxcXGQnLFxuICAgICAgICByZWxldmFuY2U6IDVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXCRcXFxcJVxcXFxAXFxcXCpdKFxcXFxeXFxcXHdcXFxcYnwjXFxcXHcrfFteXFxcXHNcXFxcd3tdfHtcXFxcdyt9fFxcXFx3KyknXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBWQVJTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJywgYmVnaW46ICdcXFxcJFxcXFxkKydcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJywgYmVnaW46ICdcXFxcJHsnLCBlbmQ6ICd9J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1tcXFxcJFxcXFxAXScgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICB9XG4gIF07XG4gIHZhciBERUZBVUxUID0ge1xuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgIGxleGVtczogJ1thLXovX10rJyxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdvbiBvZmYgeWVzIG5vIHRydWUgZmFsc2Ugbm9uZSBibG9ja2VkIGRlYnVnIGluZm8gbm90aWNlIHdhcm4gZXJyb3IgY3JpdCAnICtcbiAgICAgICAgJ3NlbGVjdCBicmVhayBsYXN0IHBlcm1hbmVudCByZWRpcmVjdCBrcXVldWUgcnRzaWcgZXBvbGwgcG9sbCAvZGV2L3BvbGwnXG4gICAgfSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgaWxsZWdhbDogJz0+JyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogXCInXCIsIGVuZDogXCInXCIsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUyksXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndXJsJyxcbiAgICAgICAgYmVnaW46ICcoW2Etel0rKTovJywgZW5kOiAnXFxcXHMnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXHNcXFxcXlwiLCBlbmQ6IFwiXFxcXHN8e3w7XCIsIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKVxuICAgICAgfSxcbiAgICAgIC8vIHJlZ2V4cCBsb2NhdGlvbnMgKH4sIH4qKVxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogXCJ+XFxcXCo/XFxcXHMrXCIsIGVuZDogXCJcXFxcc3x7fDtcIiwgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpXG4gICAgICB9LFxuICAgICAgLy8gKi5leGFtcGxlLmNvbVxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogXCJcXFxcKihcXFxcLlthLXpcXFxcLV0rKStcIixcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKVxuICAgICAgfSxcbiAgICAgIC8vIHN1Yi5leGFtcGxlLipcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgYmVnaW46IFwiKFthLXpcXFxcLV0rXFxcXC4pK1xcXFwqXCIsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUylcbiAgICAgIH0sXG4gICAgICAvLyBJUFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiXFxcXGR7MSwzfVxcXFwuXFxcXGR7MSwzfVxcXFwuXFxcXGR7MSwzfVxcXFwuXFxcXGR7MSwzfSg6XFxcXGR7MSw1fSk/XFxcXGInXG4gICAgICB9LFxuICAgICAgLy8gdW5pdHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYlxcXFxkK1trS21NZ0dkc2hkd3ldKlxcXFxiJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXS5jb25jYXQoVkFSUylcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFICsgJ1xcXFxzJywgZW5kOiAnO3x7JywgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICAgICAgICAgIHN0YXJ0czogREVGQVVMVFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogJ1teXFxcXHNcXFxcfV0nXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgT0JKQ19LRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2ludCBmbG9hdCB3aGlsZSBwcml2YXRlIGNoYXIgY2F0Y2ggZXhwb3J0IHNpemVvZiB0eXBlZGVmIGNvbnN0IHN0cnVjdCBmb3IgdW5pb24gJyArXG4gICAgICAndW5zaWduZWQgbG9uZyB2b2xhdGlsZSBzdGF0aWMgcHJvdGVjdGVkIGJvb2wgbXV0YWJsZSBpZiBwdWJsaWMgZG8gcmV0dXJuIGdvdG8gdm9pZCAnICtcbiAgICAgICdlbnVtIGVsc2UgYnJlYWsgZXh0ZXJuIGNsYXNzIGFzbSBjYXNlIHNob3J0IGRlZmF1bHQgZG91YmxlIHRocm93IHJlZ2lzdGVyIGV4cGxpY2l0ICcgK1xuICAgICAgJ3NpZ25lZCB0eXBlbmFtZSB0cnkgdGhpcyBzd2l0Y2ggY29udGludWUgd2NoYXJfdCBpbmxpbmUgcmVhZG9ubHkgYXNzaWduIHByb3BlcnR5ICcgK1xuICAgICAgJ3Byb3RvY29sIHNlbGYgc3luY2hyb25pemVkIGVuZCBzeW50aGVzaXplIGlkIG9wdGlvbmFsIHJlcXVpcmVkIGltcGxlbWVudGF0aW9uICcgK1xuICAgICAgJ25vbmF0b21pYyBpbnRlcmZhY2Ugc3VwZXIgdW5pY2hhciBmaW5hbGx5IGR5bmFtaWMgSUJPdXRsZXQgSUJBY3Rpb24gc2VsZWN0b3Igc3Ryb25nICcgK1xuICAgICAgJ3dlYWsgcmVhZG9ubHknLFxuICAgIGxpdGVyYWw6XG4gICAgXHQnZmFsc2UgdHJ1ZSBGQUxTRSBUUlVFIG5pbCBZRVMgTk8gTlVMTCcsXG4gICAgYnVpbHRfaW46XG4gICAgICAnTlNTdHJpbmcgTlNEaWN0aW9uYXJ5IENHUmVjdCBDR1BvaW50IFVJQnV0dG9uIFVJTGFiZWwgVUlUZXh0VmlldyBVSVdlYlZpZXcgTUtNYXBWaWV3ICcgK1xuICAgICAgJ1VJU2VnbWVudGVkQ29udHJvbCBOU09iamVjdCBVSVRhYmxlVmlld0RlbGVnYXRlIFVJVGFibGVWaWV3RGF0YVNvdXJjZSBOU1RocmVhZCAnICtcbiAgICAgICdVSUFjdGl2aXR5SW5kaWNhdG9yIFVJVGFiYmFyIFVJVG9vbEJhciBVSUJhckJ1dHRvbkl0ZW0gVUlJbWFnZVZpZXcgTlNBdXRvcmVsZWFzZVBvb2wgJyArXG4gICAgICAnVUlUYWJsZVZpZXcgQk9PTCBOU0ludGVnZXIgQ0dGbG9hdCBOU0V4Y2VwdGlvbiBOU0xvZyBOU011dGFibGVTdHJpbmcgTlNNdXRhYmxlQXJyYXkgJyArXG4gICAgICAnTlNNdXRhYmxlRGljdGlvbmFyeSBOU1VSTCBOU0luZGV4UGF0aCBDR1NpemUgVUlUYWJsZVZpZXdDZWxsIFVJVmlldyBVSVZpZXdDb250cm9sbGVyICcgK1xuICAgICAgJ1VJTmF2aWdhdGlvbkJhciBVSU5hdmlnYXRpb25Db250cm9sbGVyIFVJVGFiQmFyQ29udHJvbGxlciBVSVBvcG92ZXJDb250cm9sbGVyICcgK1xuICAgICAgJ1VJUG9wb3ZlckNvbnRyb2xsZXJEZWxlZ2F0ZSBVSUltYWdlIE5TTnVtYmVyIFVJU2VhcmNoQmFyIE5TRmV0Y2hlZFJlc3VsdHNDb250cm9sbGVyICcgK1xuICAgICAgJ05TRmV0Y2hlZFJlc3VsdHNDaGFuZ2VUeXBlIFVJU2Nyb2xsVmlldyBVSVNjcm9sbFZpZXdEZWxlZ2F0ZSBVSUVkZ2VJbnNldHMgVUlDb2xvciAnICtcbiAgICAgICdVSUZvbnQgVUlBcHBsaWNhdGlvbiBOU05vdEZvdW5kIE5TTm90aWZpY2F0aW9uQ2VudGVyIE5TTm90aWZpY2F0aW9uICcgK1xuICAgICAgJ1VJTG9jYWxOb3RpZmljYXRpb24gTlNCdW5kbGUgTlNGaWxlTWFuYWdlciBOU1RpbWVJbnRlcnZhbCBOU0RhdGUgTlNDYWxlbmRhciAnICtcbiAgICAgICdOU1VzZXJEZWZhdWx0cyBVSVdpbmRvdyBOU1JhbmdlIE5TQXJyYXkgTlNFcnJvciBOU1VSTFJlcXVlc3QgTlNVUkxDb25uZWN0aW9uIGNsYXNzICcgK1xuICAgICAgJ1VJSW50ZXJmYWNlT3JpZW50YXRpb24gTVBNb3ZpZVBsYXllckNvbnRyb2xsZXIgZGlzcGF0Y2hfb25jZV90ICcgK1xuICAgICAgJ2Rpc3BhdGNoX3F1ZXVlX3QgZGlzcGF0Y2hfc3luYyBkaXNwYXRjaF9hc3luYyBkaXNwYXRjaF9vbmNlJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBPQkpDX0tFWVdPUkRTLFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1xcJycsXG4gICAgICAgIGVuZDogJ1teXFxcXFxcXFxdXFwnJyxcbiAgICAgICAgaWxsZWdhbDogJ1teXFxcXFxcXFxdW15cXCddJ1xuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyNpbXBvcnQnLFxuICAgICAgICBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBiZWdpbjogJ1xcXCInLFxuICAgICAgICAgIGVuZDogJ1xcXCInXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgYmVnaW46ICc8JyxcbiAgICAgICAgICBlbmQ6ICc+J1xuICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsXG4gICAgICAgIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgIGVuZDogJyh7fCQpJyxcbiAgICAgICAga2V5d29yZHM6ICdpbnRlcmZhY2UgY2xhc3MgcHJvdG9jb2wgaW1wbGVtZW50YXRpb24nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICdpZCcsXG4gICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcLicraGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBzdWJMYW5ndWFnZTogJ3htbCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnXiMnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXF5yZW17JywgZW5kOiAnfScsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgICAgICAgICBjb250YWluczogWydzZWxmJ11cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnXkAoPzpCQVNFfFVTRXxDTEFTU3xPUFRJT05TKSQnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgIGJlZ2luOiAnQFtcXFxcd1xcXFwtXStcXFxcW1tcXFxcd147XFxcXC1dKlxcXFxdKD86XFxcXFtbXFxcXHdeO1xcXFwtXSpcXFxcXSk/KD86LiopJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgICAgYmVnaW46ICdcXFxcJFxcXFx7P1tcXFxcd1xcXFwtXFxcXC5cXFxcOl0rXFxcXH0/J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAna2V5d29yZCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXF5bXFxcXHdcXFxcLVxcXFwuXFxcXDpdKydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXF4jWzAtOWEtZkEtRl0rJ1xuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBQRVJMX0tFWVdPUkRTID0gJ2dldHB3ZW50IGdldHNlcnZlbnQgcXVvdGVtZXRhIG1zZ3JjdiBzY2FsYXIga2lsbCBkYm1jbG9zZSB1bmRlZiBsYyAnICtcbiAgICAnbWEgc3lzd3JpdGUgdHIgc2VuZCB1bWFzayBzeXNvcGVuIHNobXdyaXRlIHZlYyBxeCB1dGltZSBsb2NhbCBvY3Qgc2VtY3RsIGxvY2FsdGltZSAnICtcbiAgICAncmVhZHBpcGUgZG8gcmV0dXJuIGZvcm1hdCByZWFkIHNwcmludGYgZGJtb3BlbiBwb3AgZ2V0cGdycCBub3QgZ2V0cHduYW0gcmV3aW5kZGlyIHFxJyArXG4gICAgJ2ZpbGVubyBxdyBlbmRwcm90b2VudCB3YWl0IHNldGhvc3RlbnQgYmxlc3Mgc3wwIG9wZW5kaXIgY29udGludWUgZWFjaCBzbGVlcCBlbmRncmVudCAnICtcbiAgICAnc2h1dGRvd24gZHVtcCBjaG9tcCBjb25uZWN0IGdldHNvY2tuYW1lIGRpZSBzb2NrZXRwYWlyIGNsb3NlIGZsb2NrIGV4aXN0cyBpbmRleCBzaG1nZXQnICtcbiAgICAnc3ViIGZvciBlbmRwd2VudCByZWRvIGxzdGF0IG1zZ2N0bCBzZXRwZ3JwIGFicyBleGl0IHNlbGVjdCBwcmludCByZWYgZ2V0aG9zdGJ5YWRkciAnICtcbiAgICAndW5zaGlmdCBmY250bCBzeXNjYWxsIGdvdG8gZ2V0bmV0YnlhZGRyIGpvaW4gZ210aW1lIHN5bWxpbmsgc2VtZ2V0IHNwbGljZSB4fDAgJyArXG4gICAgJ2dldHBlZXJuYW1lIHJlY3YgbG9nIHNldHNvY2tvcHQgY29zIGxhc3QgcmV2ZXJzZSBnZXRob3N0YnluYW1lIGdldGdybmFtIHN0dWR5IGZvcm1saW5lICcgK1xuICAgICdlbmRob3N0ZW50IHRpbWVzIGNob3AgbGVuZ3RoIGdldGhvc3RlbnQgZ2V0bmV0ZW50IHBhY2sgZ2V0cHJvdG9lbnQgZ2V0c2VydmJ5bmFtZSByYW5kICcgK1xuICAgICdta2RpciBwb3MgY2htb2QgeXwwIHN1YnN0ciBlbmRuZXRlbnQgcHJpbnRmIG5leHQgb3BlbiBtc2dzbmQgcmVhZGRpciB1c2UgdW5saW5rICcgK1xuICAgICdnZXRzb2Nrb3B0IGdldHByaW9yaXR5IHJpbmRleCB3YW50YXJyYXkgaGV4IHN5c3RlbSBnZXRzZXJ2Ynlwb3J0IGVuZHNlcnZlbnQgaW50IGNociAnICtcbiAgICAndW50aWUgcm1kaXIgcHJvdG90eXBlIHRlbGwgbGlzdGVuIGZvcmsgc2htcmVhZCB1Y2ZpcnN0IHNldHByb3RvZW50IGVsc2Ugc3lzc2VlayBsaW5rICcgK1xuICAgICdnZXRncmdpZCBzaG1jdGwgd2FpdHBpZCB1bnBhY2sgZ2V0bmV0YnluYW1lIHJlc2V0IGNoZGlyIGdyZXAgc3BsaXQgcmVxdWlyZSBjYWxsZXIgJyArXG4gICAgJ2xjZmlyc3QgdW50aWwgd2FybiB3aGlsZSB2YWx1ZXMgc2hpZnQgdGVsbGRpciBnZXRwd3VpZCBteSBnZXRwcm90b2J5bnVtYmVyIGRlbGV0ZSBhbmQgJyArXG4gICAgJ3NvcnQgdWMgZGVmaW5lZCBzcmFuZCBhY2NlcHQgcGFja2FnZSBzZWVrZGlyIGdldHByb3RvYnluYW1lIHNlbW9wIG91ciByZW5hbWUgc2VlayBpZiBxfDAgJyArXG4gICAgJ2Nocm9vdCBzeXNyZWFkIHNldHB3ZW50IG5vIGNyeXB0IGdldGMgY2hvd24gc3FydCB3cml0ZSBzZXRuZXRlbnQgc2V0cHJpb3JpdHkgZm9yZWFjaCAnICtcbiAgICAndGllIHNpbiBtc2dnZXQgbWFwIHN0YXQgZ2V0bG9naW4gdW5sZXNzIGVsc2lmIHRydW5jYXRlIGV4ZWMga2V5cyBnbG9iIHRpZWQgY2xvc2VkaXInICtcbiAgICAnaW9jdGwgc29ja2V0IHJlYWRsaW5rIGV2YWwgeG9yIHJlYWRsaW5lIGJpbm1vZGUgc2V0c2VydmVudCBlb2Ygb3JkIGJpbmQgYWxhcm0gcGlwZSAnICtcbiAgICAnYXRhbjIgZ2V0Z3JlbnQgZXhwIHRpbWUgcHVzaCBzZXRncmVudCBndCBsdCBvciBuZSBtfDAgYnJlYWsgZ2l2ZW4gc2F5IHN0YXRlIHdoZW4nO1xuICB2YXIgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnWyRAXVxcXFx7JywgZW5kOiAnXFxcXH0nLFxuICAgIGtleXdvcmRzOiBQRVJMX0tFWVdPUkRTLFxuICAgIHJlbGV2YW5jZTogMTBcbiAgfTtcbiAgdmFyIFZBUjEgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAnXFxcXCRcXFxcZCdcbiAgfTtcbiAgdmFyIFZBUjIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgIGJlZ2luOiAnW1xcXFwkXFxcXCVcXFxcQFxcXFwqXShcXFxcXlxcXFx3XFxcXGJ8I1xcXFx3KyhcXFxcOlxcXFw6XFxcXHcrKSp8W15cXFxcc1xcXFx3e118e1xcXFx3K318XFxcXHcrKFxcXFw6XFxcXDpcXFxcdyopKiknXG4gIH07XG4gIHZhciBTVFJJTkdfQ09OVEFJTlMgPSBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCBTVUJTVCwgVkFSMSwgVkFSMl07XG4gIHZhciBNRVRIT0QgPSB7XG4gICAgYmVnaW46ICctPicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtiZWdpbjogaGxqcy5JREVOVF9SRX0sXG4gICAgICB7YmVnaW46ICd7JywgZW5kOiAnfSd9XG4gICAgXVxuICB9O1xuICB2YXIgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ14oX19FTkRfX3xfX0RBVEFfXyknLCBlbmQ6ICdcXFxcbiQnLFxuICAgIHJlbGV2YW5jZTogNVxuICB9XG4gIHZhciBQRVJMX0RFRkFVTFRfQ09OVEFJTlMgPSBbXG4gICAgVkFSMSwgVkFSMixcbiAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgIENPTU1FTlQsXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJ15cXFxcPVxcXFx3JywgZW5kOiAnXFxcXD1jdXQnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZVxuICAgIH0sXG4gICAgTUVUSE9ELFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxceycsIGVuZDogJ1xcXFx9JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXHwnLCBlbmQ6ICdcXFxcfCcsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFw8JywgZW5kOiAnXFxcXD4nLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncXdcXFxccytxJywgZW5kOiAncScsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAne1xcXFx3K30nLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcXC0/XFxcXHcrXFxcXHMqXFxcXD1cXFxcPicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICBiZWdpbjogJyhcXFxcYjBbMC03X10rKXwoXFxcXGIweFswLTlhLWZBLUZfXSspfChcXFxcYlsxLTldWzAtOV9dKihcXFxcLlswLTlfXSspPyl8WzBfXVxcXFxiJyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAgeyAvLyByZWdleHAgY29udGFpbmVyXG4gICAgICBiZWdpbjogJygnICsgaGxqcy5SRV9TVEFSVEVSU19SRSArICd8XFxcXGIoc3BsaXR8cmV0dXJufHByaW50fHJldmVyc2V8Z3JlcClcXFxcYilcXFxccyonLFxuICAgICAga2V5d29yZHM6ICdzcGxpdCByZXR1cm4gcHJpbnQgcmV2ZXJzZSBncmVwJyxcbiAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICAgIENPTU1FTlQsXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICAgIGJlZ2luOiAnKHN8dHJ8eSkvKFxcXFxcXFxcLnxbXi9dKSovKFxcXFxcXFxcLnxbXi9dKSovW2Etel0qJyxcbiAgICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICAgIGJlZ2luOiAnKG18cXIpPy8nLCBlbmQ6ICcvW2Etel0qJyxcbiAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgICAgcmVsZXZhbmNlOiAwIC8vIGFsbG93cyBlbXB0eSBcIi8vXCIgd2hpY2ggaXMgYSBjb21tb24gY29tbWVudCBkZWxpbWl0ZXIgaW4gb3RoZXIgbGFuZ3VhZ2VzXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N1YicsXG4gICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICcoXFxcXHMqXFxcXCguKj9cXFxcKSk/Wzt7XScsXG4gICAgICBrZXl3b3JkczogJ3N1YicsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ29wZXJhdG9yJyxcbiAgICAgIGJlZ2luOiAnLVxcXFx3XFxcXGInLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfVxuICBdO1xuICBTVUJTVC5jb250YWlucyA9IFBFUkxfREVGQVVMVF9DT05UQUlOUztcbiAgTUVUSE9ELmNvbnRhaW5zWzFdLmNvbnRhaW5zID0gUEVSTF9ERUZBVUxUX0NPTlRBSU5TO1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IFBFUkxfS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFBFUkxfREVGQVVMVF9DT05UQUlOU1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFZBUklBQkxFID0ge1xuICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJywgYmVnaW46ICdcXFxcJCtbYS16QS1aX1xceDdmLVxceGZmXVthLXpBLVowLTlfXFx4N2YtXFx4ZmZdKidcbiAgfTtcbiAgdmFyIFNUUklOR1MgPSBbXG4gICAgaGxqcy5pbmhlcml0KGhsanMuQVBPU19TVFJJTkdfTU9ERSwge2lsbGVnYWw6IG51bGx9KSxcbiAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwge2lsbGVnYWw6IG51bGx9KSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdiXCInLCBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ2JcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfVxuICBdO1xuICB2YXIgTlVNQkVSUyA9IFtobGpzLkJJTkFSWV9OVU1CRVJfTU9ERSwgaGxqcy5DX05VTUJFUl9NT0RFXTtcbiAgdmFyIFRJVExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICB9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6XG4gICAgICAnYW5kIGluY2x1ZGVfb25jZSBsaXN0IGFic3RyYWN0IGdsb2JhbCBwcml2YXRlIGVjaG8gaW50ZXJmYWNlIGFzIHN0YXRpYyBlbmRzd2l0Y2ggJyArXG4gICAgICAnYXJyYXkgbnVsbCBpZiBlbmR3aGlsZSBvciBjb25zdCBmb3IgZW5kZm9yZWFjaCBzZWxmIHZhciB3aGlsZSBpc3NldCBwdWJsaWMgJyArXG4gICAgICAncHJvdGVjdGVkIGV4aXQgZm9yZWFjaCB0aHJvdyBlbHNlaWYgaW5jbHVkZSBfX0ZJTEVfXyBlbXB0eSByZXF1aXJlX29uY2UgZG8geG9yICcgK1xuICAgICAgJ3JldHVybiBpbXBsZW1lbnRzIHBhcmVudCBjbG9uZSB1c2UgX19DTEFTU19fIF9fTElORV9fIGVsc2UgYnJlYWsgcHJpbnQgZXZhbCBuZXcgJyArXG4gICAgICAnY2F0Y2ggX19NRVRIT0RfXyBjYXNlIGV4Y2VwdGlvbiBwaHBfdXNlcl9maWx0ZXIgZGVmYXVsdCBkaWUgcmVxdWlyZSBfX0ZVTkNUSU9OX18gJyArXG4gICAgICAnZW5kZGVjbGFyZSBmaW5hbCB0cnkgdGhpcyBzd2l0Y2ggY29udGludWUgZW5kZm9yIGVuZGlmIGRlY2xhcmUgdW5zZXQgdHJ1ZSBmYWxzZSAnICtcbiAgICAgICduYW1lc3BhY2UgdHJhaXQgZ290byBpbnN0YW5jZW9mIGluc3RlYWRvZiBfX0RJUl9fIF9fTkFNRVNQQUNFX18gX19oYWx0X2NvbXBpbGVyJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnL1xcXFwqJywgZW5kOiAnXFxcXCovJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwaHBkb2MnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcc0BbQS1aYS16XSsnXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSxcbiAgICAgICAgICBiZWdpbjogJ19faGFsdF9jb21waWxlci4rPzsnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICc8PDxbXFwnXCJdP1xcXFx3K1tcXCdcIl0/JCcsIGVuZDogJ15cXFxcdys7JyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJzxcXFxcP3BocCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXD8+J1xuICAgICAgfSxcbiAgICAgIFZBUklBQkxFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFwkfFxcXFxbfCUnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFRJVExFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgJ3NlbGYnLFxuICAgICAgICAgICAgICBWQVJJQUJMRSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERVxuICAgICAgICAgICAgXS5jb25jYXQoU1RSSU5HUykuY29uY2F0KE5VTUJFUlMpXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzJyxcbiAgICAgICAgaWxsZWdhbDogJ1s6XFxcXChcXFxcJF0nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbVElUTEVdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUSVRMRVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz0+JyAvLyBObyBtYXJrdXAsIGp1c3QgYSByZWxldmFuY2UgYm9vc3RlclxuICAgICAgfVxuICAgIF0uY29uY2F0KFNUUklOR1MpLmNvbmNhdChOVU1CRVJTKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdidWlsdGluJyxcbiAgICAgICAgYmVnaW46ICd7JywgZW5kOiAnfSQnLFxuICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmaWxlbmFtZScsXG4gICAgICAgIGJlZ2luOiAnW2EtekEtWl9dW1xcXFxkYS16QS1aX10rXFxcXC5bXFxcXGRhLXpBLVpfXXsxLDN9JywgZW5kOiAnOicsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnKG5jYWxsc3x0b3R0aW1lfGN1bXRpbWUpJywgZW5kOiAnJCcsXG4gICAgICAgIGtleXdvcmRzOiAnbmNhbGxzIHRvdHRpbWV8MTAgY3VtdGltZXwxMCBmaWxlbmFtZScsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N1bW1hcnknLFxuICAgICAgICBiZWdpbjogJ2Z1bmN0aW9uIGNhbGxzJywgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5DX05VTUJFUl9NT0RFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICB9XSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFBST01QVCA9IHtcbiAgICBjbGFzc05hbWU6ICdwcm9tcHQnLCAgYmVnaW46ICdeKD4+PnxcXFxcLlxcXFwuXFxcXC4pICdcbiAgfVxuICB2YXIgU1RSSU5HUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcodXxiKT9yP1xcJ1xcJ1xcJycsIGVuZDogJ1xcJ1xcJ1xcJycsXG4gICAgICBjb250YWluczogW1BST01QVF0sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcodXxiKT9yP1wiXCJcIicsIGVuZDogJ1wiXCJcIicsXG4gICAgICBjb250YWluczogW1BST01QVF0sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcodXxyfHVyKVxcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcodXxyfHVyKVwiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnKGJ8YnIpXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnKGJ8YnIpXCInLCBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9XG4gIF0uY29uY2F0KFtcbiAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERVxuICBdKTtcbiAgdmFyIFRJVExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICB9O1xuICB2YXIgUEFSQU1TID0ge1xuICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogWydzZWxmJywgaGxqcy5DX05VTUJFUl9NT0RFLCBQUk9NUFRdLmNvbmNhdChTVFJJTkdTKVxuICB9O1xuICB2YXIgRlVOQ19DTEFTU19QUk9UTyA9IHtcbiAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICc6JyxcbiAgICBpbGxlZ2FsOiAnWyR7PTtcXFxcbl0nLFxuICAgIGNvbnRhaW5zOiBbVElUTEUsIFBBUkFNU10sXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuXG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgICdhbmQgZWxpZiBpcyBnbG9iYWwgYXMgaW4gaWYgZnJvbSByYWlzZSBmb3IgZXhjZXB0IGZpbmFsbHkgcHJpbnQgaW1wb3J0IHBhc3MgcmV0dXJuICcgK1xuICAgICAgICAnZXhlYyBlbHNlIGJyZWFrIG5vdCB3aXRoIGNsYXNzIGFzc2VydCB5aWVsZCB0cnkgd2hpbGUgY29udGludWUgZGVsIG9yIGRlZiBsYW1iZGEgJyArXG4gICAgICAgICdub25sb2NhbHwxMCcsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ05vbmUgVHJ1ZSBGYWxzZSBFbGxpcHNpcyBOb3RJbXBsZW1lbnRlZCdcbiAgICB9LFxuICAgIGlsbGVnYWw6ICcoPC98LT58XFxcXD8pJyxcbiAgICBjb250YWluczogU1RSSU5HUy5jb25jYXQoW1xuICAgICAgUFJPTVBULFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuaW5oZXJpdChGVU5DX0NMQVNTX1BST1RPLCB7Y2xhc3NOYW1lOiAnZnVuY3Rpb24nLCBrZXl3b3JkczogJ2RlZid9KSxcbiAgICAgIGhsanMuaW5oZXJpdChGVU5DX0NMQVNTX1BST1RPLCB7Y2xhc3NOYW1lOiAnY2xhc3MnLCBrZXl3b3JkczogJ2NsYXNzJ30pLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdkZWNvcmF0b3InLFxuICAgICAgICBiZWdpbjogJ0AnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcYihwcmludHxleGVjKVxcXFwoJyAvLyBkb27igJl0IGhpZ2hsaWdodCBrZXl3b3Jkcy10dXJuZWQtZnVuY3Rpb25zIGluIFB5dGhvbiAzXG4gICAgICB9XG4gICAgXSlcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBJREVOVF9SRSA9ICcoW2EtekEtWl18XFxcXC5bYS16QS1aLl0pW2EtekEtWjAtOS5fXSonO1xuXG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBJREVOVF9SRSxcbiAgICAgICAgbGV4ZW1zOiBJREVOVF9SRSxcbiAgICAgICAga2V5d29yZHM6IHtcbiAgICAgICAgICBrZXl3b3JkOlxuICAgICAgICAgICAgJ2Z1bmN0aW9uIGlmIGluIGJyZWFrIG5leHQgcmVwZWF0IGVsc2UgZm9yIHJldHVybiBzd2l0Y2ggd2hpbGUgdHJ5IHRyeUNhdGNofDEwICcgK1xuICAgICAgICAgICAgJ3N0b3Agd2FybmluZyByZXF1aXJlIGxpYnJhcnkgYXR0YWNoIGRldGFjaCBzb3VyY2Ugc2V0TWV0aG9kIHNldEdlbmVyaWMgJyArXG4gICAgICAgICAgICAnc2V0R3JvdXBHZW5lcmljIHNldENsYXNzIC4uLnwxMCcsXG4gICAgICAgICAgbGl0ZXJhbDpcbiAgICAgICAgICAgICdOVUxMIE5BIFRSVUUgRkFMU0UgVCBGIEluZiBOYU4gTkFfaW50ZWdlcl98MTAgTkFfcmVhbF98MTAgTkFfY2hhcmFjdGVyX3wxMCAnICtcbiAgICAgICAgICAgICdOQV9jb21wbGV4X3wxMCdcbiAgICAgICAgfSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBoZXggdmFsdWVcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IFwiMFt4WF1bMC05YS1mQS1GXStbTGldP1xcXFxiXCIsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgLy8gZXhwbGljaXQgaW50ZWdlclxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCJcXFxcZCsoPzpbZUVdWytcXFxcLV0/XFxcXGQqKT9MXFxcXGJcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBudW1iZXIgd2l0aCB0cmFpbGluZyBkZWNpbWFsXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBcIlxcXFxkK1xcXFwuKD8hXFxcXGQpKD86aVxcXFxiKT9cIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBudW1iZXJcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXGQrKD86XFxcXC5cXFxcZCopPyg/OltlRV1bK1xcXFwtXT9cXFxcZCopP2k/XFxcXGJcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBudW1iZXIgd2l0aCBsZWFkaW5nIGRlY2ltYWxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXC5cXFxcZCsoPzpbZUVdWytcXFxcLV0/XFxcXGQqKT9pP1xcXFxiXCIsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICAvLyBlc2NhcGVkIGlkZW50aWZpZXJcbiAgICAgICAgYmVnaW46ICdgJyxcbiAgICAgICAgZW5kOiAnYCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcblxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiJyxcbiAgICAgICAgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46IFwiJ1wiLFxuICAgICAgICBlbmQ6IFwiJ1wiLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAnQXJjaGl2ZVJlY29yZCBBcmVhTGlnaHRTb3VyY2UgQXRtb3NwaGVyZSBBdHRyaWJ1dGUgQXR0cmlidXRlQmVnaW4gQXR0cmlidXRlRW5kIEJhc2lzICcgK1xuICAgICAgJ0JlZ2luIEJsb2JieSBCb3VuZCBDbGlwcGluZyBDbGlwcGluZ1BsYW5lIENvbG9yIENvbG9yU2FtcGxlcyBDb25jYXRUcmFuc2Zvcm0gQ29uZSAnICtcbiAgICAgICdDb29yZGluYXRlU3lzdGVtIENvb3JkU3lzVHJhbnNmb3JtIENyb3BXaW5kb3cgQ3VydmVzIEN5bGluZGVyIERlcHRoT2ZGaWVsZCBEZXRhaWwgJyArXG4gICAgICAnRGV0YWlsUmFuZ2UgRGlzayBEaXNwbGFjZW1lbnQgRGlzcGxheSBFbmQgRXJyb3JIYW5kbGVyIEV4cG9zdXJlIEV4dGVyaW9yIEZvcm1hdCAnICtcbiAgICAgICdGcmFtZUFzcGVjdFJhdGlvIEZyYW1lQmVnaW4gRnJhbWVFbmQgR2VuZXJhbFBvbHlnb24gR2VvbWV0cmljQXBwcm94aW1hdGlvbiBHZW9tZXRyeSAnICtcbiAgICAgICdIaWRlciBIeXBlcmJvbG9pZCBJZGVudGl0eSBJbGx1bWluYXRlIEltYWdlciBJbnRlcmlvciBMaWdodFNvdXJjZSAnICtcbiAgICAgICdNYWtlQ3ViZUZhY2VFbnZpcm9ubWVudCBNYWtlTGF0TG9uZ0Vudmlyb25tZW50IE1ha2VTaGFkb3cgTWFrZVRleHR1cmUgTWF0dGUgJyArXG4gICAgICAnTW90aW9uQmVnaW4gTW90aW9uRW5kIE51UGF0Y2ggT2JqZWN0QmVnaW4gT2JqZWN0RW5kIE9iamVjdEluc3RhbmNlIE9wYWNpdHkgT3B0aW9uICcgK1xuICAgICAgJ09yaWVudGF0aW9uIFBhcmFib2xvaWQgUGF0Y2ggUGF0Y2hNZXNoIFBlcnNwZWN0aXZlIFBpeGVsRmlsdGVyIFBpeGVsU2FtcGxlcyAnICtcbiAgICAgICdQaXhlbFZhcmlhbmNlIFBvaW50cyBQb2ludHNHZW5lcmFsUG9seWdvbnMgUG9pbnRzUG9seWdvbnMgUG9seWdvbiBQcm9jZWR1cmFsIFByb2plY3Rpb24gJyArXG4gICAgICAnUXVhbnRpemUgUmVhZEFyY2hpdmUgUmVsYXRpdmVEZXRhaWwgUmV2ZXJzZU9yaWVudGF0aW9uIFJvdGF0ZSBTY2FsZSBTY3JlZW5XaW5kb3cgJyArXG4gICAgICAnU2hhZGluZ0ludGVycG9sYXRpb24gU2hhZGluZ1JhdGUgU2h1dHRlciBTaWRlcyBTa2V3IFNvbGlkQmVnaW4gU29saWRFbmQgU3BoZXJlICcgK1xuICAgICAgJ1N1YmRpdmlzaW9uTWVzaCBTdXJmYWNlIFRleHR1cmVDb29yZGluYXRlcyBUb3J1cyBUcmFuc2Zvcm0gVHJhbnNmb3JtQmVnaW4gVHJhbnNmb3JtRW5kICcgK1xuICAgICAgJ1RyYW5zZm9ybVBvaW50cyBUcmFuc2xhdGUgVHJpbUN1cnZlIFdvcmxkQmVnaW4gV29ybGRFbmQnLFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2Zsb2F0IGNvbG9yIHBvaW50IG5vcm1hbCB2ZWN0b3IgbWF0cml4IHdoaWxlIGZvciBpZiBkbyByZXR1cm4gZWxzZSBicmVhayBleHRlcm4gY29udGludWUnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdhYnMgYWNvcyBhbWJpZW50IGFyZWEgYXNpbiBhdGFuIGF0bW9zcGhlcmUgYXR0cmlidXRlIGNhbGN1bGF0ZW5vcm1hbCBjZWlsIGNlbGxub2lzZSAnICtcbiAgICAgICAgJ2NsYW1wIGNvbXAgY29uY2F0IGNvcyBkZWdyZWVzIGRlcHRoIERlcml2IGRpZmZ1c2UgZGlzdGFuY2UgRHUgRHYgZW52aXJvbm1lbnQgZXhwICcgK1xuICAgICAgICAnZmFjZWZvcndhcmQgZmlsdGVyc3RlcCBmbG9vciBmb3JtYXQgZnJlc25lbCBpbmNpZGVudCBsZW5ndGggbGlnaHRzb3VyY2UgbG9nIG1hdGNoICcgK1xuICAgICAgICAnbWF4IG1pbiBtb2Qgbm9pc2Ugbm9ybWFsaXplIG50cmFuc2Zvcm0gb3Bwb3NpdGUgb3B0aW9uIHBob25nIHBub2lzZSBwb3cgcHJpbnRmICcgK1xuICAgICAgICAncHRsaW5lZCByYWRpYW5zIHJhbmRvbSByZWZsZWN0IHJlZnJhY3QgcmVuZGVyaW5mbyByb3VuZCBzZXRjb21wIHNldHhjb21wIHNldHljb21wICcgK1xuICAgICAgICAnc2V0emNvbXAgc2hhZG93IHNpZ24gc2luIHNtb290aHN0ZXAgc3BlY3VsYXIgc3BlY3VsYXJicmRmIHNwbGluZSBzcXJ0IHN0ZXAgdGFuICcgK1xuICAgICAgICAndGV4dHVyZSB0ZXh0dXJlaW5mbyB0cmFjZSB0cmFuc2Zvcm0gdnRyYW5zZm9ybSB4Y29tcCB5Y29tcCB6Y29tcCdcbiAgICB9LFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2hhZGVyJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnXFxcXCgnLFxuICAgICAgICBrZXl3b3JkczogJ3N1cmZhY2UgZGlzcGxhY2VtZW50IGxpZ2h0IHZvbHVtZSBpbWFnZXInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzaGFkaW5nJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnXFxcXCgnLFxuICAgICAgICBrZXl3b3JkczogJ2lsbHVtaW5hdGUgaWxsdW1pbmFuY2UgZ2F0aGVyJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBSVUJZX0lERU5UX1JFID0gJ1thLXpBLVpfXVthLXpBLVowLTlfXSooXFxcXCF8XFxcXD8pPyc7XG4gIHZhciBSVUJZX01FVEhPRF9SRSA9ICdbYS16QS1aX11cXFxcdypbIT89XT98Wy0rfl1cXFxcQHw8PHw+Pnw9fnw9PT0/fDw9PnxbPD5dPT98XFxcXCpcXFxcKnxbLS8rJV4mKn5gfF18XFxcXFtcXFxcXT0/JztcbiAgdmFyIFJVQllfS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgICdhbmQgZmFsc2UgdGhlbiBkZWZpbmVkIG1vZHVsZSBpbiByZXR1cm4gcmVkbyBpZiBCRUdJTiByZXRyeSBlbmQgZm9yIHRydWUgc2VsZiB3aGVuICcgK1xuICAgICAgJ25leHQgdW50aWwgZG8gYmVnaW4gdW5sZXNzIEVORCByZXNjdWUgbmlsIGVsc2UgYnJlYWsgdW5kZWYgbm90IHN1cGVyIGNsYXNzIGNhc2UgJyArXG4gICAgICAncmVxdWlyZSB5aWVsZCBhbGlhcyB3aGlsZSBlbnN1cmUgZWxzaWYgb3IgaW5jbHVkZSdcbiAgfTtcbiAgdmFyIFlBUkRPQ1RBRyA9IHtcbiAgICBjbGFzc05hbWU6ICd5YXJkb2N0YWcnLFxuICAgIGJlZ2luOiAnQFtBLVphLXpdKydcbiAgfTtcbiAgdmFyIENPTU1FTlRTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCcsXG4gICAgICBjb250YWluczogW1lBUkRPQ1RBR11cbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICdeXFxcXD1iZWdpbicsIGVuZDogJ15cXFxcPWVuZCcsXG4gICAgICBjb250YWluczogW1lBUkRPQ1RBR10sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnXl9fRU5EX18nLCBlbmQ6ICdcXFxcbiQnXG4gICAgfVxuICBdO1xuICB2YXIgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnI1xcXFx7JywgZW5kOiAnfScsXG4gICAgbGV4ZW1zOiBSVUJZX0lERU5UX1JFLFxuICAgIGtleXdvcmRzOiBSVUJZX0tFWVdPUkRTXG4gIH07XG4gIHZhciBTVFJfQ09OVEFJTlMgPSBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCBTVUJTVF07XG4gIHZhciBTVFJJTkdTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddP1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOU1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/XFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT97JywgZW5kOiAnfScsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT88JywgZW5kOiAnPicsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/LycsIGVuZDogJy8nLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddPyUnLCBlbmQ6ICclJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT8tJywgZW5kOiAnLScsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/XFxcXHwnLCBlbmQ6ICdcXFxcfCcsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH1cbiAgXTtcbiAgdmFyIEZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICcgfCR8OycsXG4gICAga2V5d29yZHM6ICdkZWYnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46IFJVQllfTUVUSE9EX1JFLFxuICAgICAgICBsZXhlbXM6IFJVQllfSURFTlRfUkUsXG4gICAgICAgIGtleXdvcmRzOiBSVUJZX0tFWVdPUkRTXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICBsZXhlbXM6IFJVQllfSURFTlRfUkUsXG4gICAgICAgIGtleXdvcmRzOiBSVUJZX0tFWVdPUkRTXG4gICAgICB9XG4gICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gIH07XG5cbiAgdmFyIFJVQllfREVGQVVMVF9DT05UQUlOUyA9IENPTU1FTlRTLmNvbmNhdChTVFJJTkdTLmNvbmNhdChbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnJHw7JyxcbiAgICAgIGtleXdvcmRzOiAnY2xhc3MgbW9kdWxlJyxcbiAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgYmVnaW46ICdbQS1aYS16X11cXFxcdyooOjpcXFxcdyspKihcXFxcP3xcXFxcISk/JyxcbiAgICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2luaGVyaXRhbmNlJyxcbiAgICAgICAgICBiZWdpbjogJzxcXFxccyonLFxuICAgICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyZW50JyxcbiAgICAgICAgICAgIGJlZ2luOiAnKCcgKyBobGpzLklERU5UX1JFICsgJzo6KT8nICsgaGxqcy5JREVOVF9SRVxuICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIF0uY29uY2F0KENPTU1FTlRTKVxuICAgIH0sXG4gICAgRlVOQ1RJT04sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29uc3RhbnQnLFxuICAgICAgYmVnaW46ICcoOjopPyhcXFxcYltBLVpdXFxcXHcqKDo6KT8pKycsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICBiZWdpbjogJzonLFxuICAgICAgY29udGFpbnM6IFNUUklOR1MuY29uY2F0KFt7YmVnaW46IFJVQllfTUVUSE9EX1JFfV0pLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgICAgYmVnaW46IFJVQllfSURFTlRfUkUgKyAnOicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICBiZWdpbjogJyhcXFxcYjBbMC03X10rKXwoXFxcXGIweFswLTlhLWZBLUZfXSspfChcXFxcYlsxLTldWzAtOV9dKihcXFxcLlswLTlfXSspPyl8WzBfXVxcXFxiJyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiAnXFxcXD9cXFxcdydcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3ZhcmlhYmxlJyxcbiAgICAgIGJlZ2luOiAnKFxcXFwkXFxcXFcpfCgoXFxcXCR8XFxcXEBcXFxcQD8pKFxcXFx3KykpJ1xuICAgIH0sXG4gICAgeyAvLyByZWdleHAgY29udGFpbmVyXG4gICAgICBiZWdpbjogJygnICsgaGxqcy5SRV9TVEFSVEVSU19SRSArICcpXFxcXHMqJyxcbiAgICAgIGNvbnRhaW5zOiBDT01NRU5UUy5jb25jYXQoW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJyxcbiAgICAgICAgICBiZWdpbjogJy8nLCBlbmQ6ICcvW2Etel0qJyxcbiAgICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCBTVUJTVF1cbiAgICAgICAgfVxuICAgICAgXSksXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF0pKTtcbiAgU1VCU1QuY29udGFpbnMgPSBSVUJZX0RFRkFVTFRfQ09OVEFJTlM7XG4gIEZVTkNUSU9OLmNvbnRhaW5zWzFdLmNvbnRhaW5zID0gUlVCWV9ERUZBVUxUX0NPTlRBSU5TO1xuXG4gIHJldHVybiB7XG4gICAgbGV4ZW1zOiBSVUJZX0lERU5UX1JFLFxuICAgIGtleXdvcmRzOiBSVUJZX0tFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBSVUJZX0RFRkFVTFRfQ09OVEFJTlNcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBUSVRMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICB9O1xuICB2YXIgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46ICdcXFxcYigwW3hiXVtBLVphLXowLTlfXSt8WzAtOV9dKyhcXFxcLlswLTlfXSspPyhbdWlmXSg4fDE2fDMyfDY0KT8pPyknLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgS0VZV09SRFMgPVxuICAgICdhbHQgYW55IGFzIGFzc2VydCBiZSBiaW5kIGJsb2NrIGJvb2wgYnJlYWsgY2hhciBjaGVjayBjbGFpbSBjb25zdCBjb250IGRpciBkbyBlbHNlIGVudW0gJyArXG4gICAgJ2V4cG9ydCBmMzIgZjY0IGZhaWwgZmFsc2UgZmxvYXQgZm4gZm9yIGkxNiBpMzIgaTY0IGk4IGlmIGlmYWNlIGltcGwgaW1wb3J0IGluIGludCBsZXQgJyArXG4gICAgJ2xvZyBtb2QgbXV0YWJsZSBuYXRpdmUgbm90ZSBvZiBwcm92ZSBwdXJlIHJlc291cmNlIHJldCBzZWxmIHN0ciBzeW50YXggdHJ1ZSB0eXBlIHUxNiB1MzIgJyArXG4gICAgJ3U2NCB1OCB1aW50IHVuY2hlY2tlZCB1bnNhZmUgdXNlIHZlYyB3aGlsZSc7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGlsbGVnYWw6ICc8LycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwge2lsbGVnYWw6IG51bGx9KSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIE5VTUJFUixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICcoXFxcXCh8PCknLFxuICAgICAgICBrZXl3b3JkczogJ2ZuJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnI1xcXFxbJywgZW5kOiAnXFxcXF0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICcoPXw8KScsXG4gICAgICAgIGtleXdvcmRzOiAndHlwZScsXG4gICAgICAgIGNvbnRhaW5zOiBbVElUTEVdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICcoe3w8KScsXG4gICAgICAgIGtleXdvcmRzOiAnaWZhY2UgZW51bScsXG4gICAgICAgIGNvbnRhaW5zOiBbVElUTEVdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFMnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEFOTk9UQVRJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnYW5ub3RhdGlvbicsIGJlZ2luOiAnQFtBLVphLXpdKydcbiAgfTtcbiAgdmFyIFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAndT9yP1wiXCJcIicsIGVuZDogJ1wiXCJcIicsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgJ3R5cGUgeWllbGQgbGF6eSBvdmVycmlkZSBkZWYgd2l0aCB2YWwgdmFyIGZhbHNlIHRydWUgc2VhbGVkIGFic3RyYWN0IHByaXZhdGUgdHJhaXQgJyArXG4gICAgICAnb2JqZWN0IG51bGwgaWYgZm9yIHdoaWxlIHRocm93IGZpbmFsbHkgcHJvdGVjdGVkIGV4dGVuZHMgaW1wb3J0IGZpbmFsIHJldHVybiBlbHNlICcgK1xuICAgICAgJ2JyZWFrIG5ldyBjYXRjaCBzdXBlciBjbGFzcyBjYXNlIHBhY2thZ2UgZGVmYXVsdCB0cnkgdGhpcyBtYXRjaCBjb250aW51ZSB0aHJvd3MnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2phdmFkb2MnLFxuICAgICAgICBiZWdpbjogJy9cXFxcKlxcXFwqJywgZW5kOiAnXFxcXCovJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnamF2YWRvY3RhZycsXG4gICAgICAgICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICB9XSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSwgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgU1RSSU5HLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luOiAnKChjYXNlICk/Y2xhc3MgfG9iamVjdCB8dHJhaXQgKScsIGVuZDogJyh7fCQpJywgLy8gYmVnaW5XaXRoS2V5d29yZCB3b24ndCB3b3JrIGJlY2F1c2UgYSBzaW5nbGUgXCJjYXNlXCIgc2hvdWxkbid0IHN0YXJ0IHRoaXMgbW9kZVxuICAgICAgICBpbGxlZ2FsOiAnOicsXG4gICAgICAgIGtleXdvcmRzOiAnY2FzZSBjbGFzcyB0cmFpdCBvYmplY3QnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMgd2l0aCcsXG4gICAgICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwgU1RSSU5HLFxuICAgICAgICAgICAgICBBTk5PVEFUSU9OXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgQU5OT1RBVElPTlxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBWQVJfSURFTlRfUkUgPSAnW2Etel1bYS16QS1aMC05X10qJztcbiAgdmFyIENIQVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnY2hhcicsXG4gICAgYmVnaW46ICdcXFxcJC57MX0nXG4gIH07XG4gIHZhciBTWU1CT0wgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICBiZWdpbjogJyMnICsgaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6ICdzZWxmIHN1cGVyIG5pbCB0cnVlIGZhbHNlIHRoaXNDb250ZXh0JywgLy8gb25seSA2XG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiW0EtWl1bQS1aYS16MC05X10qJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdtZXRob2QnLFxuICAgICAgICBiZWdpbjogVkFSX0lERU5UX1JFICsgJzonXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgU1lNQk9MLFxuICAgICAgQ0hBUixcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbG9jYWx2YXJzJyxcbiAgICAgICAgYmVnaW46ICdcXFxcfFxcXFxzKigoJyArIFZBUl9JREVOVF9SRSArICcpXFxcXHMqKStcXFxcfCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2FycmF5JyxcbiAgICAgICAgYmVnaW46ICdcXFxcI1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICBDSEFSLFxuICAgICAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgICAgICBTWU1CT0xcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdvcGVyYXRvcicsXG4gICAgICAgIGJlZ2luOiAnKGJlZ2lufHN0YXJ0fGNvbW1pdHxyb2xsYmFja3xzYXZlcG9pbnR8bG9ja3xhbHRlcnxjcmVhdGV8ZHJvcHxyZW5hbWV8Y2FsbHxkZWxldGV8ZG98aGFuZGxlcnxpbnNlcnR8bG9hZHxyZXBsYWNlfHNlbGVjdHx0cnVuY2F0ZXx1cGRhdGV8c2V0fHNob3d8cHJhZ21hfGdyYW50KVxcXFxiKD8hOiknLCAvLyBuZWdhdGl2ZSBsb29rLWFoZWFkIGhlcmUgaXMgc3BlY2lmaWNhbGx5IHRvIHByZXZlbnQgc3RvbXBpbmcgb24gU21hbGxUYWxrXG4gICAgICAgIGVuZDogJzsnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAga2V5d29yZHM6IHtcbiAgICAgICAgICBrZXl3b3JkOiAnYWxsIHBhcnRpYWwgZ2xvYmFsIG1vbnRoIGN1cnJlbnRfdGltZXN0YW1wIHVzaW5nIGdvIHJldm9rZSBzbWFsbGludCAnICtcbiAgICAgICAgICAgICdpbmRpY2F0b3IgZW5kLWV4ZWMgZGlzY29ubmVjdCB6b25lIHdpdGggY2hhcmFjdGVyIGFzc2VydGlvbiB0byBhZGQgY3VycmVudF91c2VyICcgK1xuICAgICAgICAgICAgJ3VzYWdlIGlucHV0IGxvY2FsIGFsdGVyIG1hdGNoIGNvbGxhdGUgcmVhbCB0aGVuIHJvbGxiYWNrIGdldCByZWFkIHRpbWVzdGFtcCAnICtcbiAgICAgICAgICAgICdzZXNzaW9uX3VzZXIgbm90IGludGVnZXIgYml0IHVuaXF1ZSBkYXkgbWludXRlIGRlc2MgaW5zZXJ0IGV4ZWN1dGUgbGlrZSBpbGlrZXwyICcgK1xuICAgICAgICAgICAgJ2xldmVsIGRlY2ltYWwgZHJvcCBjb250aW51ZSBpc29sYXRpb24gZm91bmQgd2hlcmUgY29uc3RyYWludHMgZG9tYWluIHJpZ2h0ICcgK1xuICAgICAgICAgICAgJ25hdGlvbmFsIHNvbWUgbW9kdWxlIHRyYW5zYWN0aW9uIHJlbGF0aXZlIHNlY29uZCBjb25uZWN0IGVzY2FwZSBjbG9zZSBzeXN0ZW1fdXNlciAnICtcbiAgICAgICAgICAgICdmb3IgZGVmZXJyZWQgc2VjdGlvbiBjYXN0IGN1cnJlbnQgc3Fsc3RhdGUgYWxsb2NhdGUgaW50ZXJzZWN0IGRlYWxsb2NhdGUgbnVtZXJpYyAnICtcbiAgICAgICAgICAgICdwdWJsaWMgcHJlc2VydmUgZnVsbCBnb3RvIGluaXRpYWxseSBhc2Mgbm8ga2V5IG91dHB1dCBjb2xsYXRpb24gZ3JvdXAgYnkgdW5pb24gJyArXG4gICAgICAgICAgICAnc2Vzc2lvbiBib3RoIGxhc3QgbGFuZ3VhZ2UgY29uc3RyYWludCBjb2x1bW4gb2Ygc3BhY2UgZm9yZWlnbiBkZWZlcnJhYmxlIHByaW9yICcgK1xuICAgICAgICAgICAgJ2Nvbm5lY3Rpb24gdW5rbm93biBhY3Rpb24gY29tbWl0IHZpZXcgb3IgZmlyc3QgaW50byBmbG9hdCB5ZWFyIHByaW1hcnkgY2FzY2FkZWQgJyArXG4gICAgICAgICAgICAnZXhjZXB0IHJlc3RyaWN0IHNldCByZWZlcmVuY2VzIG5hbWVzIHRhYmxlIG91dGVyIG9wZW4gc2VsZWN0IHNpemUgYXJlIHJvd3MgZnJvbSAnICtcbiAgICAgICAgICAgICdwcmVwYXJlIGRpc3RpbmN0IGxlYWRpbmcgY3JlYXRlIG9ubHkgbmV4dCBpbm5lciBhdXRob3JpemF0aW9uIHNjaGVtYSAnICtcbiAgICAgICAgICAgICdjb3JyZXNwb25kaW5nIG9wdGlvbiBkZWNsYXJlIHByZWNpc2lvbiBpbW1lZGlhdGUgZWxzZSB0aW1lem9uZV9taW51dGUgZXh0ZXJuYWwgJyArXG4gICAgICAgICAgICAndmFyeWluZyB0cmFuc2xhdGlvbiB0cnVlIGNhc2UgZXhjZXB0aW9uIGpvaW4gaG91ciBkZWZhdWx0IGRvdWJsZSBzY3JvbGwgdmFsdWUgJyArXG4gICAgICAgICAgICAnY3Vyc29yIGRlc2NyaXB0b3IgdmFsdWVzIGRlYyBmZXRjaCBwcm9jZWR1cmUgZGVsZXRlIGFuZCBmYWxzZSBpbnQgaXMgZGVzY3JpYmUgJyArXG4gICAgICAgICAgICAnY2hhciBhcyBhdCBpbiB2YXJjaGFyIG51bGwgdHJhaWxpbmcgYW55IGFic29sdXRlIGN1cnJlbnRfdGltZSBlbmQgZ3JhbnQgJyArXG4gICAgICAgICAgICAncHJpdmlsZWdlcyB3aGVuIGNyb3NzIGNoZWNrIHdyaXRlIGN1cnJlbnRfZGF0ZSBwYWQgYmVnaW4gdGVtcG9yYXJ5IGV4ZWMgdGltZSAnICtcbiAgICAgICAgICAgICd1cGRhdGUgY2F0YWxvZyB1c2VyIHNxbCBkYXRlIG9uIGlkZW50aXR5IHRpbWV6b25lX2hvdXIgbmF0dXJhbCB3aGVuZXZlciBpbnRlcnZhbCAnICtcbiAgICAgICAgICAgICd3b3JrIG9yZGVyIGNhc2NhZGUgZGlhZ25vc3RpY3MgbmNoYXIgaGF2aW5nIGxlZnQgY2FsbCBkbyBoYW5kbGVyIGxvYWQgcmVwbGFjZSAnICtcbiAgICAgICAgICAgICd0cnVuY2F0ZSBzdGFydCBsb2NrIHNob3cgcHJhZ21hIGV4aXN0cyBudW1iZXInLFxuICAgICAgICAgIGFnZ3JlZ2F0ZTogJ2NvdW50IHN1bSBtaW4gbWF4IGF2ZydcbiAgICAgICAgfSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIHtiZWdpbjogJ1xcJ1xcJyd9XSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwge2JlZ2luOiAnXCJcIid9XSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBobGpzLkNfTlVNQkVSX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy0tJywgZW5kOiAnJCdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQ09NTUFORDEgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWFuZCcsXG4gICAgYmVnaW46ICdcXFxcXFxcXFthLXpBLVrQsC3Rj9CQLdGPXStbXFxcXCpdPydcbiAgfTtcbiAgdmFyIENPTU1BTkQyID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1hbmQnLFxuICAgIGJlZ2luOiAnXFxcXFxcXFxbXmEtekEtWtCwLdGP0JAt0Y8wLTldJ1xuICB9O1xuICB2YXIgU1BFQ0lBTCA9IHtcbiAgICBjbGFzc05hbWU6ICdzcGVjaWFsJyxcbiAgICBiZWdpbjogJ1t7fVxcXFxbXFxcXF1cXFxcJiN+XScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgeyAvLyBwYXJhbWV0ZXJcbiAgICAgICAgYmVnaW46ICdcXFxcXFxcXFthLXpBLVrQsC3Rj9CQLdGPXStbXFxcXCpdPyAqPSAqLT9cXFxcZCpcXFxcLj9cXFxcZCsocHR8cGN8bW18Y218aW58ZGR8Y2N8ZXh8ZW0pPycsXG4gICAgICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIENPTU1BTkQxLCBDT01NQU5EMixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICAgICAgYmVnaW46ICcgKj0nLCBlbmQ6ICctP1xcXFxkKlxcXFwuP1xcXFxkKyhwdHxwY3xtbXxjbXxpbnxkZHxjY3xleHxlbSk/JyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIENPTU1BTkQxLCBDT01NQU5EMixcbiAgICAgIFNQRUNJQUwsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm11bGEnLFxuICAgICAgICBiZWdpbjogJ1xcXFwkXFxcXCQnLCBlbmQ6ICdcXFxcJFxcXFwkJyxcbiAgICAgICAgY29udGFpbnM6IFtDT01NQU5EMSwgQ09NTUFORDIsIFNQRUNJQUxdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm11bGEnLFxuICAgICAgICBiZWdpbjogJ1xcXFwkJywgZW5kOiAnXFxcXCQnLFxuICAgICAgICBjb250YWluczogW0NPTU1BTkQxLCBDT01NQU5EMiwgU1BFQ0lBTF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnJScsIGVuZDogJyQnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAvLyBWYWx1ZSB0eXBlc1xuICAgICAgICAnY2hhciB1Y2hhciB1bmljaGFyIGludCB1aW50IGxvbmcgdWxvbmcgc2hvcnQgdXNob3J0IGludDggaW50MTYgaW50MzIgaW50NjQgdWludDggJyArXG4gICAgICAgICd1aW50MTYgdWludDMyIHVpbnQ2NCBmbG9hdCBkb3VibGUgYm9vbCBzdHJ1Y3QgZW51bSBzdHJpbmcgdm9pZCAnICtcbiAgICAgICAgLy8gUmVmZXJlbmNlIHR5cGVzXG4gICAgICAgICd3ZWFrIHVub3duZWQgb3duZWQgJyArXG4gICAgICAgIC8vIE1vZGlmaWVyc1xuICAgICAgICAnYXN5bmMgc2lnbmFsIHN0YXRpYyBhYnN0cmFjdCBpbnRlcmZhY2Ugb3ZlcnJpZGUgJyArXG4gICAgICAgIC8vIENvbnRyb2wgU3RydWN0dXJlc1xuICAgICAgICAnd2hpbGUgZG8gZm9yIGZvcmVhY2ggZWxzZSBzd2l0Y2ggY2FzZSBicmVhayBkZWZhdWx0IHJldHVybiB0cnkgY2F0Y2ggJyArXG4gICAgICAgIC8vIFZpc2liaWxpdHlcbiAgICAgICAgJ3B1YmxpYyBwcml2YXRlIHByb3RlY3RlZCBpbnRlcm5hbCAnICtcbiAgICAgICAgLy8gT3RoZXJcbiAgICAgICAgJ3VzaW5nIG5ldyB0aGlzIGdldCBzZXQgY29uc3Qgc3Rkb3V0IHN0ZGluIHN0ZGVyciB2YXInLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdEQnVzIEdMaWIgQ0NvZGUgR2VlIE9iamVjdCcsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAnZmFsc2UgdHJ1ZSBudWxsJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcyBpbnRlcmZhY2UgZGVsZWdhdGUgbmFtZXNwYWNlJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzIGltcGxlbWVudHMnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIlwiXCInLCBlbmQ6ICdcIlwiXCInLFxuICAgICAgICByZWxldmFuY2U6IDVcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJ14jJywgZW5kOiAnJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMlxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29uc3RhbnQnLFxuICAgICAgICBiZWdpbjogJyBbQS1aX10rICcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2NhbGwgY2xhc3MgY29uc3QgZGltIGRvIGxvb3AgZXJhc2UgZXhlY3V0ZSBleGVjdXRlZ2xvYmFsIGV4aXQgZm9yIGVhY2ggbmV4dCBmdW5jdGlvbiAnICtcbiAgICAgICAgJ2lmIHRoZW4gZWxzZSBvbiBlcnJvciBvcHRpb24gZXhwbGljaXQgbmV3IHByaXZhdGUgcHJvcGVydHkgbGV0IGdldCBwdWJsaWMgcmFuZG9taXplICcgK1xuICAgICAgICAncmVkaW0gcmVtIHNlbGVjdCBjYXNlIHNldCBzdG9wIHN1YiB3aGlsZSB3ZW5kIHdpdGggZW5kIHRvIGVsc2VpZiBpcyBvciB4b3IgYW5kIG5vdCAnICtcbiAgICAgICAgJ2NsYXNzX2luaXRpYWxpemUgY2xhc3NfdGVybWluYXRlIGRlZmF1bHQgcHJlc2VydmUgaW4gbWUgYnl2YWwgYnlyZWYgc3RlcCByZXN1bWUgZ290bycsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ2xjYXNlIG1vbnRoIHZhcnR5cGUgaW5zdHJyZXYgdWJvdW5kIHNldGxvY2FsZSBnZXRvYmplY3QgcmdiIGdldHJlZiBzdHJpbmcgJyArXG4gICAgICAgICd3ZWVrZGF5bmFtZSBybmQgZGF0ZWFkZCBtb250aG5hbWUgbm93IGRheSBtaW51dGUgaXNhcnJheSBjYm9vbCByb3VuZCBmb3JtYXRjdXJyZW5jeSAnICtcbiAgICAgICAgJ2NvbnZlcnNpb25zIGNzbmcgdGltZXZhbHVlIHNlY29uZCB5ZWFyIHNwYWNlIGFicyBjbG5nIHRpbWVzZXJpYWwgZml4cyBsZW4gYXNjICcgK1xuICAgICAgICAnaXNlbXB0eSBtYXRocyBkYXRlc2VyaWFsIGF0biB0aW1lciBpc29iamVjdCBmaWx0ZXIgd2Vla2RheSBkYXRldmFsdWUgY2N1ciBpc2RhdGUgJyArXG4gICAgICAgICdpbnN0ciBkYXRlZGlmZiBmb3JtYXRkYXRldGltZSByZXBsYWNlIGlzbnVsbCByaWdodCBzZ24gYXJyYXkgc251bWVyaWMgbG9nIGNkYmwgaGV4ICcgK1xuICAgICAgICAnY2hyIGxib3VuZCBtc2dib3ggdWNhc2UgZ2V0bG9jYWxlIGNvcyBjZGF0ZSBjYnl0ZSBydHJpbSBqb2luIGhvdXIgb2N0IHR5cGVuYW1lIHRyaW0gJyArXG4gICAgICAgICdzdHJjb21wIGludCBjcmVhdGVvYmplY3QgbG9hZHBpY3R1cmUgdGFuIGZvcm1hdG51bWJlciBtaWQgc2NyaXB0ZW5naW5lYnVpbGR2ZXJzaW9uICcgK1xuICAgICAgICAnc2NyaXB0ZW5naW5lIHNwbGl0IHNjcmlwdGVuZ2luZW1pbm9ydmVyc2lvbiBjaW50IHNpbiBkYXRlcGFydCBsdHJpbSBzcXIgJyArXG4gICAgICAgICdzY3JpcHRlbmdpbmVtYWpvcnZlcnNpb24gdGltZSBkZXJpdmVkIGV2YWwgZGF0ZSBmb3JtYXRwZXJjZW50IGV4cCBpbnB1dGJveCBsZWZ0IGFzY3cgJyArXG4gICAgICAgICdjaHJ3IHJlZ2V4cCBzZXJ2ZXIgcmVzcG9uc2UgcmVxdWVzdCBjc3RyIGVycicsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZSBudWxsIG5vdGhpbmcgZW1wdHknXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnLy8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLmluaGVyaXQoaGxqcy5RVU9URV9TVFJJTkdfTU9ERSwge2NvbnRhaW5zOiBbe2JlZ2luOiAnXCJcIid9XX0pLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2FicyBhY2Nlc3MgYWZ0ZXIgYWxpYXMgYWxsIGFuZCBhcmNoaXRlY3R1cmUgYXJyYXkgYXNzZXJ0IGF0dHJpYnV0ZSBiZWdpbiBibG9jayAnICtcbiAgICAgICAgJ2JvZHkgYnVmZmVyIGJ1cyBjYXNlIGNvbXBvbmVudCBjb25maWd1cmF0aW9uIGNvbnN0YW50IGNvbnRleHQgY292ZXIgZGlzY29ubmVjdCAnICtcbiAgICAgICAgJ2Rvd250byBkZWZhdWx0IGVsc2UgZWxzaWYgZW5kIGVudGl0eSBleGl0IGZhaXJuZXNzIGZpbGUgZm9yIGZvcmNlIGZ1bmN0aW9uIGdlbmVyYXRlICcgK1xuICAgICAgICAnZ2VuZXJpYyBncm91cCBndWFyZGVkIGlmIGltcHVyZSBpbiBpbmVydGlhbCBpbm91dCBpcyBsYWJlbCBsaWJyYXJ5IGxpbmthZ2UgbGl0ZXJhbCAnICtcbiAgICAgICAgJ2xvb3AgbWFwIG1vZCBuYW5kIG5ldyBuZXh0IG5vciBub3QgbnVsbCBvZiBvbiBvcGVuIG9yIG90aGVycyBvdXQgcGFja2FnZSBwb3J0ICcgK1xuICAgICAgICAncG9zdHBvbmVkIHByb2NlZHVyZSBwcm9jZXNzIHByb3BlcnR5IHByb3RlY3RlZCBwdXJlIHJhbmdlIHJlY29yZCByZWdpc3RlciByZWplY3QgJyArXG4gICAgICAgICdyZWxlYXNlIHJlbSByZXBvcnQgcmVzdHJpY3QgcmVzdHJpY3RfZ3VhcmFudGVlIHJldHVybiByb2wgcm9yIHNlbGVjdCBzZXF1ZW5jZSAnICtcbiAgICAgICAgJ3NldmVyaXR5IHNoYXJlZCBzaWduYWwgc2xhIHNsbCBzcmEgc3JsIHN0cm9uZyBzdWJ0eXBlIHRoZW4gdG8gdHJhbnNwb3J0IHR5cGUgJyArXG4gICAgICAgICd1bmFmZmVjdGVkIHVuaXRzIHVudGlsIHVzZSB2YXJpYWJsZSB2bW9kZSB2cHJvcCB2dW5pdCB3YWl0IHdoZW4gd2hpbGUgd2l0aCB4bm9yIHhvcicsXG4gICAgICB0eXBlbmFtZTpcbiAgICAgICAgJ2Jvb2xlYW4gYml0IGNoYXJhY3RlciBzZXZlcml0eV9sZXZlbCBpbnRlZ2VyIHRpbWUgZGVsYXlfbGVuZ3RoIG5hdHVyYWwgcG9zaXRpdmUgJyArXG4gICAgICAgICdzdHJpbmcgYml0X3ZlY3RvciBmaWxlX29wZW5fa2luZCBmaWxlX29wZW5fc3RhdHVzIHN0ZF91bG9naWMgc3RkX3Vsb2dpY192ZWN0b3IgJyArXG4gICAgICAgICdzdGRfbG9naWMgc3RkX2xvZ2ljX3ZlY3RvciB1bnNpZ25lZCBzaWduZWQgYm9vbGVhbl92ZWN0b3IgaW50ZWdlcl92ZWN0b3IgJyArXG4gICAgICAgICdyZWFsX3ZlY3RvciB0aW1lX3ZlY3RvcidcbiAgICB9LFxuICAgIGlsbGVnYWw6ICd7JyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSwgICAgICAgIC8vIFZIREwtMjAwOCBibG9jayBjb21tZW50aW5nLlxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICctLScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgICAgIGJlZ2luOiAnXFwnKFV8WHwwfDF8WnxXfEx8SHwtKVxcJycsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdcXCdbQS1aYS16XShfP1tBLVphLXowLTldKSonLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH1cbiAgICBdXG4gIH07IC8vIHJldHVyblxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFhNTF9JREVOVF9SRSA9ICdbQS1aYS16MC05XFxcXC5fOi1dKyc7XG4gIHZhciBUQUdfSU5URVJOQUxTID0ge1xuICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiBYTUxfSURFTlRfUkUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc9XCInLCByZXR1cm5CZWdpbjogdHJ1ZSwgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXCInLCBlbmRzV2l0aFBhcmVudDogdHJ1ZVxuICAgICAgICB9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc9XFwnJywgcmV0dXJuQmVnaW46IHRydWUsIGVuZDogJ1xcJycsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICBiZWdpbjogJ1xcJycsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz0nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICd2YWx1ZScsXG4gICAgICAgICAgYmVnaW46ICdbXlxcXFxzLz5dKydcbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICBdXG4gIH07XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwaScsXG4gICAgICAgIGJlZ2luOiAnPFxcXFw/JywgZW5kOiAnXFxcXD8+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZG9jdHlwZScsXG4gICAgICAgIGJlZ2luOiAnPCFET0NUWVBFJywgZW5kOiAnPicsXG4gICAgICAgIHJlbGV2YW5jZTogMTAsXG4gICAgICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXSd9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnPCEtLScsIGVuZDogJy0tPicsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NkYXRhJyxcbiAgICAgICAgYmVnaW46ICc8XFxcXCFcXFxcW0NEQVRBXFxcXFsnLCBlbmQ6ICdcXFxcXVxcXFxdPicsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIC8qXG4gICAgICAgIFRoZSBsb29rYWhlYWQgcGF0dGVybiAoPz0uLi4pIGVuc3VyZXMgdGhhdCAnYmVnaW4nIG9ubHkgbWF0Y2hlc1xuICAgICAgICAnPHN0eWxlJyBhcyBhIHNpbmdsZSB3b3JkLCBmb2xsb3dlZCBieSBhIHdoaXRlc3BhY2Ugb3IgYW5cbiAgICAgICAgZW5kaW5nIGJyYWtldC4gVGhlICckJyBpcyBuZWVkZWQgZm9yIHRoZSBsZXhlbSB0byBiZSByZWNvZ25pemVkXG4gICAgICAgIGJ5IGhsanMuc3ViTW9kZSgpIHRoYXQgdGVzdHMgbGV4ZW1zIG91dHNpZGUgdGhlIHN0cmVhbS5cbiAgICAgICAgKi9cbiAgICAgICAgYmVnaW46ICc8c3R5bGUoPz1cXFxcc3w+fCQpJywgZW5kOiAnPicsXG4gICAgICAgIGtleXdvcmRzOiB7dGl0bGU6ICdzdHlsZSd9LFxuICAgICAgICBjb250YWluczogW1RBR19JTlRFUk5BTFNdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6ICc8L3N0eWxlPicsIHJldHVybkVuZDogdHJ1ZSxcbiAgICAgICAgICBzdWJMYW5ndWFnZTogJ2NzcydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgLy8gU2VlIHRoZSBjb21tZW50IGluIHRoZSA8c3R5bGUgdGFnIGFib3V0IHRoZSBsb29rYWhlYWQgcGF0dGVyblxuICAgICAgICBiZWdpbjogJzxzY3JpcHQoPz1cXFxcc3w+fCQpJywgZW5kOiAnPicsXG4gICAgICAgIGtleXdvcmRzOiB7dGl0bGU6ICdzY3JpcHQnfSxcbiAgICAgICAgY29udGFpbnM6IFtUQUdfSU5URVJOQUxTXSxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnPC9zY3JpcHQ+JywgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnamF2YXNjcmlwdCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc8JScsIGVuZDogJyU+JyxcbiAgICAgICAgc3ViTGFuZ3VhZ2U6ICd2YnNjcmlwdCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsXG4gICAgICAgIGJlZ2luOiAnPC8/JywgZW5kOiAnLz8+JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnW14gLz5dKydcbiAgICAgICAgICB9LFxuICAgICAgICAgIFRBR19JTlRFUk5BTFNcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwidmFyIGluc2VydGVkID0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAgIGlmIChpbnNlcnRlZC5pbmRleE9mKGNzcykgPj0gMCkgcmV0dXJuO1xuICAgIGluc2VydGVkLnB1c2goY3NzKTtcbiAgICBcbiAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgdmFyIHRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuICAgIGVsZW0uYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgXG4gICAgaWYgKGRvY3VtZW50LmhlYWQuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUoZWxlbSwgZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzWzBdKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoZWxlbSk7XG4gICAgfVxufTtcbiIsInZhciBnbG9iYWw9c2VsZjsvKipcbiAqIG1hcmtlZCAtIGEgbWFya2Rvd24gcGFyc2VyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMywgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICovXG5cbjsoZnVuY3Rpb24oKSB7XG5cbi8qKlxuICogQmxvY2stTGV2ZWwgR3JhbW1hclxuICovXG5cbnZhciBibG9jayA9IHtcbiAgbmV3bGluZTogL15cXG4rLyxcbiAgY29kZTogL14oIHs0fVteXFxuXStcXG4qKSsvLFxuICBmZW5jZXM6IG5vb3AsXG4gIGhyOiAvXiggKlstKl9dKXszLH0gKig/Olxcbit8JCkvLFxuICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKihbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpLyxcbiAgbnB0YWJsZTogbm9vcCxcbiAgbGhlYWRpbmc6IC9eKFteXFxuXSspXFxuICooPXwtKXszLH0gKlxcbiovLFxuICBibG9ja3F1b3RlOiAvXiggKj5bXlxcbl0rKFxcblteXFxuXSspKlxcbiopKy8sXG4gIGxpc3Q6IC9eKCAqKShidWxsKSBbXFxzXFxTXSs/KD86aHJ8XFxuezIsfSg/ISApKD8hXFwxYnVsbCApXFxuKnxcXHMqJCkvLFxuICBodG1sOiAvXiAqKD86Y29tbWVudHxjbG9zZWR8Y2xvc2luZykgKig/OlxcbnsyLH18XFxzKiQpLyxcbiAgZGVmOiAvXiAqXFxbKFteXFxdXSspXFxdOiAqPD8oW15cXHM+XSspPj8oPzogK1tcIihdKFteXFxuXSspW1wiKV0pPyAqKD86XFxuK3wkKS8sXG4gIHRhYmxlOiBub29wLFxuICBwYXJhZ3JhcGg6IC9eKCg/OlteXFxuXStcXG4/KD8haHJ8aGVhZGluZ3xsaGVhZGluZ3xibG9ja3F1b3RlfHRhZ3xkZWYpKSspXFxuKi8sXG4gIHRleHQ6IC9eW15cXG5dKy9cbn07XG5cbmJsb2NrLmJ1bGxldCA9IC8oPzpbKistXXxcXGQrXFwuKS87XG5ibG9jay5pdGVtID0gL14oICopKGJ1bGwpIFteXFxuXSooPzpcXG4oPyFcXDFidWxsIClbXlxcbl0qKSovO1xuYmxvY2suaXRlbSA9IHJlcGxhY2UoYmxvY2suaXRlbSwgJ2dtJylcbiAgKC9idWxsL2csIGJsb2NrLmJ1bGxldClcbiAgKCk7XG5cbmJsb2NrLmxpc3QgPSByZXBsYWNlKGJsb2NrLmxpc3QpXG4gICgvYnVsbC9nLCBibG9jay5idWxsZXQpXG4gICgnaHInLCAvXFxuKyg/PSg/OiAqWy0qX10pezMsfSAqKD86XFxuK3wkKSkvKVxuICAoKTtcblxuYmxvY2suX3RhZyA9ICcoPyEoPzonXG4gICsgJ2F8ZW18c3Ryb25nfHNtYWxsfHN8Y2l0ZXxxfGRmbnxhYmJyfGRhdGF8dGltZXxjb2RlJ1xuICArICd8dmFyfHNhbXB8a2JkfHN1YnxzdXB8aXxifHV8bWFya3xydWJ5fHJ0fHJwfGJkaXxiZG8nXG4gICsgJ3xzcGFufGJyfHdicnxpbnN8ZGVsfGltZylcXFxcYilcXFxcdysoPyE6L3xAKVxcXFxiJztcblxuYmxvY2suaHRtbCA9IHJlcGxhY2UoYmxvY2suaHRtbClcbiAgKCdjb21tZW50JywgLzwhLS1bXFxzXFxTXSo/LS0+LylcbiAgKCdjbG9zZWQnLCAvPCh0YWcpW1xcc1xcU10rPzxcXC9cXDE+LylcbiAgKCdjbG9zaW5nJywgLzx0YWcoPzpcIlteXCJdKlwifCdbXiddKid8W14nXCI+XSkqPz4vKVxuICAoL3RhZy9nLCBibG9jay5fdGFnKVxuICAoKTtcblxuYmxvY2sucGFyYWdyYXBoID0gcmVwbGFjZShibG9jay5wYXJhZ3JhcGgpXG4gICgnaHInLCBibG9jay5ocilcbiAgKCdoZWFkaW5nJywgYmxvY2suaGVhZGluZylcbiAgKCdsaGVhZGluZycsIGJsb2NrLmxoZWFkaW5nKVxuICAoJ2Jsb2NrcXVvdGUnLCBibG9jay5ibG9ja3F1b3RlKVxuICAoJ3RhZycsICc8JyArIGJsb2NrLl90YWcpXG4gICgnZGVmJywgYmxvY2suZGVmKVxuICAoKTtcblxuLyoqXG4gKiBOb3JtYWwgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLm5vcm1hbCA9IG1lcmdlKHt9LCBibG9jayk7XG5cbi8qKlxuICogR0ZNIEJsb2NrIEdyYW1tYXJcbiAqL1xuXG5ibG9jay5nZm0gPSBtZXJnZSh7fSwgYmxvY2subm9ybWFsLCB7XG4gIGZlbmNlczogL14gKihgezMsfXx+ezMsfSkgKihcXFMrKT8gKlxcbihbXFxzXFxTXSs/KVxccypcXDEgKig/Olxcbit8JCkvLFxuICBwYXJhZ3JhcGg6IC9eL1xufSk7XG5cbmJsb2NrLmdmbS5wYXJhZ3JhcGggPSByZXBsYWNlKGJsb2NrLnBhcmFncmFwaClcbiAgKCcoPyEnLCAnKD8hJyArIGJsb2NrLmdmbS5mZW5jZXMuc291cmNlLnJlcGxhY2UoJ1xcXFwxJywgJ1xcXFwyJykgKyAnfCcpXG4gICgpO1xuXG4vKipcbiAqIEdGTSArIFRhYmxlcyBCbG9jayBHcmFtbWFyXG4gKi9cblxuYmxvY2sudGFibGVzID0gbWVyZ2Uoe30sIGJsb2NrLmdmbSwge1xuICBucHRhYmxlOiAvXiAqKFxcUy4qXFx8LiopXFxuICooWy06XSsgKlxcfFstfCA6XSopXFxuKCg/Oi4qXFx8LiooPzpcXG58JCkpKilcXG4qLyxcbiAgdGFibGU6IC9eICpcXHwoLispXFxuICpcXHwoICpbLTpdK1stfCA6XSopXFxuKCg/OiAqXFx8LiooPzpcXG58JCkpKilcXG4qL1xufSk7XG5cbi8qKlxuICogQmxvY2sgTGV4ZXJcbiAqL1xuXG5mdW5jdGlvbiBMZXhlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW5zLmxpbmtzID0ge307XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgbWFya2VkLmRlZmF1bHRzO1xuICB0aGlzLnJ1bGVzID0gYmxvY2subm9ybWFsO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy50YWJsZXMpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBibG9jay50YWJsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSBibG9jay5nZm07XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIEJsb2NrIFJ1bGVzXG4gKi9cblxuTGV4ZXIucnVsZXMgPSBibG9jaztcblxuLyoqXG4gKiBTdGF0aWMgTGV4IE1ldGhvZFxuICovXG5cbkxleGVyLmxleCA9IGZ1bmN0aW9uKHNyYywgb3B0aW9ucykge1xuICB2YXIgbGV4ZXIgPSBuZXcgTGV4ZXIob3B0aW9ucyk7XG4gIHJldHVybiBsZXhlci5sZXgoc3JjKTtcbn07XG5cbi8qKlxuICogUHJlcHJvY2Vzc2luZ1xuICovXG5cbkxleGVyLnByb3RvdHlwZS5sZXggPSBmdW5jdGlvbihzcmMpIHtcbiAgc3JjID0gc3JjXG4gICAgLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpXG4gICAgLnJlcGxhY2UoL1xcdC9nLCAnICAgICcpXG4gICAgLnJlcGxhY2UoL1xcdTAwYTAvZywgJyAnKVxuICAgIC5yZXBsYWNlKC9cXHUyNDI0L2csICdcXG4nKTtcblxuICByZXR1cm4gdGhpcy50b2tlbihzcmMsIHRydWUpO1xufTtcblxuLyoqXG4gKiBMZXhpbmdcbiAqL1xuXG5MZXhlci5wcm90b3R5cGUudG9rZW4gPSBmdW5jdGlvbihzcmMsIHRvcCkge1xuICB2YXIgc3JjID0gc3JjLnJlcGxhY2UoL14gKyQvZ20sICcnKVxuICAgICwgbmV4dFxuICAgICwgbG9vc2VcbiAgICAsIGNhcFxuICAgICwgYnVsbFxuICAgICwgYlxuICAgICwgaXRlbVxuICAgICwgc3BhY2VcbiAgICAsIGlcbiAgICAsIGw7XG5cbiAgd2hpbGUgKHNyYykge1xuICAgIC8vIG5ld2xpbmVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5uZXdsaW5lLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMF0ubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnc3BhY2UnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvZGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGNhcCA9IGNhcFswXS5yZXBsYWNlKC9eIHs0fS9nbSwgJycpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgID8gY2FwLnJlcGxhY2UoL1xcbiskLywgJycpXG4gICAgICAgICAgOiBjYXBcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZmVuY2VzIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZmVuY2VzLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgIGxhbmc6IGNhcFsyXSxcbiAgICAgICAgdGV4dDogY2FwWzNdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGhlYWRpbmdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5oZWFkaW5nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgIGRlcHRoOiBjYXBbMV0ubGVuZ3RoLFxuICAgICAgICB0ZXh0OiBjYXBbMl1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgbm8gbGVhZGluZyBwaXBlIChnZm0pXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5ucHRhYmxlLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgIGhlYWRlcjogY2FwWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBjZWxsczogY2FwWzNdLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0uY2VsbHNbaV0gPSBpdGVtLmNlbGxzW2ldLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxoZWFkaW5nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGhlYWRpbmcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgZGVwdGg6IGNhcFsyXSA9PT0gJz0nID8gMSA6IDIsXG4gICAgICAgIHRleHQ6IGNhcFsxXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBoclxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmhyLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaHInXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGJsb2NrcXVvdGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5ibG9ja3F1b3RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdibG9ja3F1b3RlX3N0YXJ0J1xuICAgICAgfSk7XG5cbiAgICAgIGNhcCA9IGNhcFswXS5yZXBsYWNlKC9eICo+ID8vZ20sICcnKTtcblxuICAgICAgLy8gUGFzcyBgdG9wYCB0byBrZWVwIHRoZSBjdXJyZW50XG4gICAgICAvLyBcInRvcGxldmVsXCIgc3RhdGUuIFRoaXMgaXMgZXhhY3RseVxuICAgICAgLy8gaG93IG1hcmtkb3duLnBsIHdvcmtzLlxuICAgICAgdGhpcy50b2tlbihjYXAsIHRvcCk7XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmxvY2txdW90ZV9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGlzdFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxpc3QuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgYnVsbCA9IGNhcFsyXTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaXN0X3N0YXJ0JyxcbiAgICAgICAgb3JkZXJlZDogYnVsbC5sZW5ndGggPiAxXG4gICAgICB9KTtcblxuICAgICAgLy8gR2V0IGVhY2ggdG9wLWxldmVsIGl0ZW0uXG4gICAgICBjYXAgPSBjYXBbMF0ubWF0Y2godGhpcy5ydWxlcy5pdGVtKTtcblxuICAgICAgbmV4dCA9IGZhbHNlO1xuICAgICAgbCA9IGNhcC5sZW5ndGg7XG4gICAgICBpID0gMDtcblxuICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaXRlbSA9IGNhcFtpXTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaXRlbSdzIGJ1bGxldFxuICAgICAgICAvLyBzbyBpdCBpcyBzZWVuIGFzIHRoZSBuZXh0IHRva2VuLlxuICAgICAgICBzcGFjZSA9IGl0ZW0ubGVuZ3RoO1xuICAgICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9eICooWyorLV18XFxkK1xcLikgKy8sICcnKTtcblxuICAgICAgICAvLyBPdXRkZW50IHdoYXRldmVyIHRoZVxuICAgICAgICAvLyBsaXN0IGl0ZW0gY29udGFpbnMuIEhhY2t5LlxuICAgICAgICBpZiAofml0ZW0uaW5kZXhPZignXFxuICcpKSB7XG4gICAgICAgICAgc3BhY2UgLT0gaXRlbS5sZW5ndGg7XG4gICAgICAgICAgaXRlbSA9ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICAgID8gaXRlbS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14gezEsJyArIHNwYWNlICsgJ30nLCAnZ20nKSwgJycpXG4gICAgICAgICAgICA6IGl0ZW0ucmVwbGFjZSgvXiB7MSw0fS9nbSwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG5leHQgbGlzdCBpdGVtIGJlbG9uZ3MgaGVyZS5cbiAgICAgICAgLy8gQmFja3BlZGFsIGlmIGl0IGRvZXMgbm90IGJlbG9uZyBpbiB0aGlzIGxpc3QuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc21hcnRMaXN0cyAmJiBpICE9PSBsIC0gMSkge1xuICAgICAgICAgIGIgPSBibG9jay5idWxsZXQuZXhlYyhjYXBbaSsxXSlbMF07XG4gICAgICAgICAgaWYgKGJ1bGwgIT09IGIgJiYgIShidWxsLmxlbmd0aCA+IDEgJiYgYi5sZW5ndGggPiAxKSkge1xuICAgICAgICAgICAgc3JjID0gY2FwLnNsaWNlKGkgKyAxKS5qb2luKCdcXG4nKSArIHNyYztcbiAgICAgICAgICAgIGkgPSBsIC0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBpdGVtIGlzIGxvb3NlIG9yIG5vdC5cbiAgICAgICAgLy8gVXNlOiAvKF58XFxuKSg/ISApW15cXG5dK1xcblxcbig/IVxccyokKS9cbiAgICAgICAgLy8gZm9yIGRpc2NvdW50IGJlaGF2aW9yLlxuICAgICAgICBsb29zZSA9IG5leHQgfHwgL1xcblxcbig/IVxccyokKS8udGVzdChpdGVtKTtcbiAgICAgICAgaWYgKGkgIT09IGwgLSAxKSB7XG4gICAgICAgICAgbmV4dCA9IGl0ZW1baXRlbS5sZW5ndGgtMV0gPT09ICdcXG4nO1xuICAgICAgICAgIGlmICghbG9vc2UpIGxvb3NlID0gbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IGxvb3NlXG4gICAgICAgICAgICA/ICdsb29zZV9pdGVtX3N0YXJ0J1xuICAgICAgICAgICAgOiAnbGlzdF9pdGVtX3N0YXJ0J1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWN1cnNlLlxuICAgICAgICB0aGlzLnRva2VuKGl0ZW0sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnbGlzdF9pdGVtX2VuZCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHRtbFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmh0bWwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICAgID8gJ3BhcmFncmFwaCdcbiAgICAgICAgICA6ICdodG1sJyxcbiAgICAgICAgcHJlOiBjYXBbMV0gPT09ICdwcmUnIHx8IGNhcFsxXSA9PT0gJ3NjcmlwdCcsXG4gICAgICAgIHRleHQ6IGNhcFswXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBkZWZcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLmRlZi5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMubGlua3NbY2FwWzFdLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgIH07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSAoZ2ZtKVxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMudGFibGUuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgaXRlbSA9IHtcbiAgICAgICAgdHlwZTogJ3RhYmxlJyxcbiAgICAgICAgaGVhZGVyOiBjYXBbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBhbGlnbjogY2FwWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGNlbGxzOiBjYXBbM10ucmVwbGFjZSgvKD86ICpcXHwgKik/XFxuJC8sICcnKS5zcGxpdCgnXFxuJylcbiAgICAgIH07XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdyaWdodCc7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKyAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbS5jZWxsc1tpXSA9IGl0ZW0uY2VsbHNbaV1cbiAgICAgICAgICAucmVwbGFjZSgvXiAqXFx8ICp8ICpcXHwgKiQvZywgJycpXG4gICAgICAgICAgLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRvcC1sZXZlbCBwYXJhZ3JhcGhcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLnBhcmFncmFwaC5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICB0ZXh0OiBjYXBbMV1bY2FwWzFdLmxlbmd0aC0xXSA9PT0gJ1xcbidcbiAgICAgICAgICA/IGNhcFsxXS5zbGljZSgwLCAtMSlcbiAgICAgICAgICA6IGNhcFsxXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudGV4dC5leGVjKHNyYykpIHtcbiAgICAgIC8vIFRvcC1sZXZlbCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZS5cbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICB0ZXh0OiBjYXBbMF1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhyb3cgbmV3XG4gICAgICAgIEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMudG9rZW5zO1xufTtcblxuLyoqXG4gKiBJbmxpbmUtTGV2ZWwgR3JhbW1hclxuICovXG5cbnZhciBpbmxpbmUgPSB7XG4gIGVzY2FwZTogL15cXFxcKFtcXFxcYCp7fVxcW1xcXSgpIytcXC0uIV8+XSkvLFxuICBhdXRvbGluazogL148KFteID5dKyhAfDpcXC8pW14gPl0rKT4vLFxuICB1cmw6IG5vb3AsXG4gIHRhZzogL148IS0tW1xcc1xcU10qPy0tPnxePFxcLz9cXHcrKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LyxcbiAgbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFwoaHJlZlxcKS8sXG4gIHJlZmxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxccypcXFsoW15cXF1dKilcXF0vLFxuICBub2xpbms6IC9eIT9cXFsoKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV0pKilcXF0vLFxuICBzdHJvbmc6IC9eX18oW1xcc1xcU10rPylfXyg/IV8pfF5cXCpcXCooW1xcc1xcU10rPylcXCpcXCooPyFcXCopLyxcbiAgZW06IC9eXFxiXygoPzpfX3xbXFxzXFxTXSkrPylfXFxifF5cXCooKD86XFwqXFwqfFtcXHNcXFNdKSs/KVxcKig/IVxcKikvLFxuICBjb2RlOiAvXihgKylcXHMqKFtcXHNcXFNdKj9bXmBdKVxccypcXDEoPyFgKS8sXG4gIGJyOiAvXiB7Mix9XFxuKD8hXFxzKiQpLyxcbiAgZGVsOiBub29wLFxuICB0ZXh0OiAvXltcXHNcXFNdKz8oPz1bXFxcXDwhXFxbXypgXXwgezIsfVxcbnwkKS9cbn07XG5cbmlubGluZS5faW5zaWRlID0gLyg/OlxcW1teXFxdXSpcXF18W15cXF1dfFxcXSg/PVteXFxbXSpcXF0pKSovO1xuaW5saW5lLl9ocmVmID0gL1xccyo8PyhbXlxcc10qPyk+Pyg/OlxccytbJ1wiXShbXFxzXFxTXSo/KVsnXCJdKT9cXHMqLztcblxuaW5saW5lLmxpbmsgPSByZXBsYWNlKGlubGluZS5saW5rKVxuICAoJ2luc2lkZScsIGlubGluZS5faW5zaWRlKVxuICAoJ2hyZWYnLCBpbmxpbmUuX2hyZWYpXG4gICgpO1xuXG5pbmxpbmUucmVmbGluayA9IHJlcGxhY2UoaW5saW5lLnJlZmxpbmspXG4gICgnaW5zaWRlJywgaW5saW5lLl9pbnNpZGUpXG4gICgpO1xuXG4vKipcbiAqIE5vcm1hbCBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5ub3JtYWwgPSBtZXJnZSh7fSwgaW5saW5lKTtcblxuLyoqXG4gKiBQZWRhbnRpYyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5wZWRhbnRpYyA9IG1lcmdlKHt9LCBpbmxpbmUubm9ybWFsLCB7XG4gIHN0cm9uZzogL15fXyg/PVxcUykoW1xcc1xcU10qP1xcUylfXyg/IV8pfF5cXCpcXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXl8oPz1cXFMpKFtcXHNcXFNdKj9cXFMpXyg/IV8pfF5cXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqKD8hXFwqKS9cbn0pO1xuXG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5nZm0gPSBtZXJnZSh7fSwgaW5saW5lLm5vcm1hbCwge1xuICBlc2NhcGU6IHJlcGxhY2UoaW5saW5lLmVzY2FwZSkoJ10pJywgJ358XSknKSgpLFxuICB1cmw6IC9eKGh0dHBzPzpcXC9cXC9bXlxcczxdK1tePC4sOjtcIicpXFxdXFxzXSkvLFxuICBkZWw6IC9efn4oPz1cXFMpKFtcXHNcXFNdKj9cXFMpfn4vLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS50ZXh0KVxuICAgICgnXXwnLCAnfl18JylcbiAgICAoJ3wnLCAnfGh0dHBzPzovL3wnKVxuICAgICgpXG59KTtcblxuLyoqXG4gKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5icmVha3MgPSBtZXJnZSh7fSwgaW5saW5lLmdmbSwge1xuICBicjogcmVwbGFjZShpbmxpbmUuYnIpKCd7Mix9JywgJyonKSgpLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS5nZm0udGV4dCkoJ3syLH0nLCAnKicpKClcbn0pO1xuXG4vKipcbiAqIElubGluZSBMZXhlciAmIENvbXBpbGVyXG4gKi9cblxuZnVuY3Rpb24gSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG4gIHRoaXMubGlua3MgPSBsaW5rcztcbiAgdGhpcy5ydWxlcyA9IGlubGluZS5ub3JtYWw7XG5cbiAgaWYgKCF0aGlzLmxpbmtzKSB7XG4gICAgdGhyb3cgbmV3XG4gICAgICBFcnJvcignVG9rZW5zIGFycmF5IHJlcXVpcmVzIGEgYGxpbmtzYCBwcm9wZXJ0eS4nKTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBpbmxpbmUuYnJlYWtzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gaW5saW5lLmdmbTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgdGhpcy5ydWxlcyA9IGlubGluZS5wZWRhbnRpYztcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBJbmxpbmUgUnVsZXNcbiAqL1xuXG5JbmxpbmVMZXhlci5ydWxlcyA9IGlubGluZTtcblxuLyoqXG4gKiBTdGF0aWMgTGV4aW5nL0NvbXBpbGluZyBNZXRob2RcbiAqL1xuXG5JbmxpbmVMZXhlci5vdXRwdXQgPSBmdW5jdGlvbihzcmMsIGxpbmtzLCBvcHRpb25zKSB7XG4gIHZhciBpbmxpbmUgPSBuZXcgSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpO1xuICByZXR1cm4gaW5saW5lLm91dHB1dChzcmMpO1xufTtcblxuLyoqXG4gKiBMZXhpbmcvQ29tcGlsaW5nXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKHNyYykge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGxpbmtcbiAgICAsIHRleHRcbiAgICAsIGhyZWZcbiAgICAsIGNhcDtcblxuICB3aGlsZSAoc3JjKSB7XG4gICAgLy8gZXNjYXBlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZXNjYXBlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSBjYXBbMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBhdXRvbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmF1dG9saW5rLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICB0ZXh0ID0gY2FwWzFdWzZdID09PSAnOidcbiAgICAgICAgICA/IHRoaXMubWFuZ2xlKGNhcFsxXS5zdWJzdHJpbmcoNykpXG4gICAgICAgICAgOiB0aGlzLm1hbmdsZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGhpcy5tYW5nbGUoJ21haWx0bzonKSArIHRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gZXNjYXBlKGNhcFsxXSk7XG4gICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgb3V0ICs9ICc8YSBocmVmPVwiJ1xuICAgICAgICArIGhyZWZcbiAgICAgICAgKyAnXCI+J1xuICAgICAgICArIHRleHRcbiAgICAgICAgKyAnPC9hPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB1cmwgKGdmbSlcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy51cmwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICBvdXQgKz0gJzxhIGhyZWY9XCInXG4gICAgICAgICsgaHJlZlxuICAgICAgICArICdcIj4nXG4gICAgICAgICsgdGV4dFxuICAgICAgICArICc8L2E+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRhZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRhZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5vcHRpb25zLnNhbml0aXplXG4gICAgICAgID8gZXNjYXBlKGNhcFswXSlcbiAgICAgICAgOiBjYXBbMF07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaW5rXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGluay5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGNhcCwge1xuICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gcmVmbGluaywgbm9saW5rXG4gICAgaWYgKChjYXAgPSB0aGlzLnJ1bGVzLnJlZmxpbmsuZXhlYyhzcmMpKVxuICAgICAgICB8fCAoY2FwID0gdGhpcy5ydWxlcy5ub2xpbmsuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGxpbmsgPSAoY2FwWzJdIHx8IGNhcFsxXSkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgICAgbGluayA9IHRoaXMubGlua3NbbGluay50b0xvd2VyQ2FzZSgpXTtcbiAgICAgIGlmICghbGluayB8fCAhbGluay5ocmVmKSB7XG4gICAgICAgIG91dCArPSBjYXBbMF1bMF07XG4gICAgICAgIHNyYyA9IGNhcFswXS5zdWJzdHJpbmcoMSkgKyBzcmM7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhjYXAsIGxpbmspO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gc3Ryb25nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuc3Ryb25nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPHN0cm9uZz4nXG4gICAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzJdIHx8IGNhcFsxXSlcbiAgICAgICAgKyAnPC9zdHJvbmc+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGVtXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZW0uZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8ZW0+J1xuICAgICAgICArIHRoaXMub3V0cHV0KGNhcFsyXSB8fCBjYXBbMV0pXG4gICAgICAgICsgJzwvZW0+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGNvZGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGNvZGU+J1xuICAgICAgICArIGVzY2FwZShjYXBbMl0sIHRydWUpXG4gICAgICAgICsgJzwvY29kZT4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYnJcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5ici5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxicj4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZGVsIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZGVsLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGRlbD4nXG4gICAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzFdKVxuICAgICAgICArICc8L2RlbD4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGV4dFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IGVzY2FwZSh0aGlzLnNtYXJ0eXBhbnRzKGNhcFswXSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhyb3cgbmV3XG4gICAgICAgIEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29tcGlsZSBMaW5rXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dExpbmsgPSBmdW5jdGlvbihjYXAsIGxpbmspIHtcbiAgaWYgKGNhcFswXVswXSAhPT0gJyEnKSB7XG4gICAgcmV0dXJuICc8YSBocmVmPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay5ocmVmKVxuICAgICAgKyAnXCInXG4gICAgICArIChsaW5rLnRpdGxlXG4gICAgICA/ICcgdGl0bGU9XCInXG4gICAgICArIGVzY2FwZShsaW5rLnRpdGxlKVxuICAgICAgKyAnXCInXG4gICAgICA6ICcnKVxuICAgICAgKyAnPidcbiAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzFdKVxuICAgICAgKyAnPC9hPic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8aW1nIHNyYz1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsuaHJlZilcbiAgICAgICsgJ1wiIGFsdD1cIidcbiAgICAgICsgZXNjYXBlKGNhcFsxXSlcbiAgICAgICsgJ1wiJ1xuICAgICAgKyAobGluay50aXRsZVxuICAgICAgPyAnIHRpdGxlPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay50aXRsZSlcbiAgICAgICsgJ1wiJ1xuICAgICAgOiAnJylcbiAgICAgICsgJz4nO1xuICB9XG59O1xuXG4vKipcbiAqIFNtYXJ0eXBhbnRzIFRyYW5zZm9ybWF0aW9uc1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5zbWFydHlwYW50cyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMuc21hcnR5cGFudHMpIHJldHVybiB0ZXh0O1xuICByZXR1cm4gdGV4dFxuICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxNCcpXG4gICAgLnJlcGxhY2UoLycoW14nXSopJy9nLCAnXFx1MjAxOCQxXFx1MjAxOScpXG4gICAgLnJlcGxhY2UoL1wiKFteXCJdKilcIi9nLCAnXFx1MjAxQyQxXFx1MjAxRCcpXG4gICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpO1xufTtcblxuLyoqXG4gKiBNYW5nbGUgTGlua3NcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUubWFuZ2xlID0gZnVuY3Rpb24odGV4dCkge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGwgPSB0ZXh0Lmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIGNoO1xuXG4gIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2ggPSB0ZXh0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgIGNoID0gJ3gnICsgY2gudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgICBvdXQgKz0gJyYjJyArIGNoICsgJzsnO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGFyc2luZyAmIENvbXBpbGluZ1xuICovXG5cbmZ1bmN0aW9uIFBhcnNlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW4gPSBudWxsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbn1cblxuLyoqXG4gKiBTdGF0aWMgUGFyc2UgTWV0aG9kXG4gKi9cblxuUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24oc3JjLCBvcHRpb25zKSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICByZXR1cm4gcGFyc2VyLnBhcnNlKHNyYyk7XG59O1xuXG4vKipcbiAqIFBhcnNlIExvb3BcbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oc3JjKSB7XG4gIHRoaXMuaW5saW5lID0gbmV3IElubGluZUxleGVyKHNyYy5saW5rcywgdGhpcy5vcHRpb25zKTtcbiAgdGhpcy50b2tlbnMgPSBzcmMucmV2ZXJzZSgpO1xuXG4gIHZhciBvdXQgPSAnJztcbiAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgb3V0ICs9IHRoaXMudG9rKCk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBOZXh0IFRva2VuXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRva2VuID0gdGhpcy50b2tlbnMucG9wKCk7XG59O1xuXG4vKipcbiAqIFByZXZpZXcgTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy50b2tlbnMubGVuZ3RoLTFdIHx8IDA7XG59O1xuXG4vKipcbiAqIFBhcnNlIFRleHQgVG9rZW5zXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGJvZHkgPSB0aGlzLnRva2VuLnRleHQ7XG5cbiAgd2hpbGUgKHRoaXMucGVlaygpLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgIGJvZHkgKz0gJ1xcbicgKyB0aGlzLm5leHQoKS50ZXh0O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5saW5lLm91dHB1dChib2R5KTtcbn07XG5cbi8qKlxuICogUGFyc2UgQ3VycmVudCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUudG9rID0gZnVuY3Rpb24oKSB7XG4gIHN3aXRjaCAodGhpcy50b2tlbi50eXBlKSB7XG4gICAgY2FzZSAnc3BhY2UnOiB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNhc2UgJ2hyJzoge1xuICAgICAgcmV0dXJuICc8aHI+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnaGVhZGluZyc6IHtcbiAgICAgIHJldHVybiAnPGgnXG4gICAgICAgICsgdGhpcy50b2tlbi5kZXB0aFxuICAgICAgICArICc+J1xuICAgICAgICArIHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpXG4gICAgICAgICsgJzwvaCdcbiAgICAgICAgKyB0aGlzLnRva2VuLmRlcHRoXG4gICAgICAgICsgJz5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdjb2RlJzoge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KHRoaXMudG9rZW4udGV4dCwgdGhpcy50b2tlbi5sYW5nKTtcbiAgICAgICAgaWYgKGNvZGUgIT0gbnVsbCAmJiBjb2RlICE9PSB0aGlzLnRva2VuLnRleHQpIHtcbiAgICAgICAgICB0aGlzLnRva2VuLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudG9rZW4udGV4dCA9IGNvZGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuLmVzY2FwZWQpIHtcbiAgICAgICAgdGhpcy50b2tlbi50ZXh0ID0gZXNjYXBlKHRoaXMudG9rZW4udGV4dCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPHByZT48Y29kZSdcbiAgICAgICAgKyAodGhpcy50b2tlbi5sYW5nXG4gICAgICAgID8gJyBjbGFzcz1cIidcbiAgICAgICAgKyB0aGlzLm9wdGlvbnMubGFuZ1ByZWZpeFxuICAgICAgICArIHRoaXMudG9rZW4ubGFuZ1xuICAgICAgICArICdcIidcbiAgICAgICAgOiAnJylcbiAgICAgICAgKyAnPidcbiAgICAgICAgKyB0aGlzLnRva2VuLnRleHRcbiAgICAgICAgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ3RhYmxlJzoge1xuICAgICAgdmFyIGJvZHkgPSAnJ1xuICAgICAgICAsIGhlYWRpbmdcbiAgICAgICAgLCBpXG4gICAgICAgICwgcm93XG4gICAgICAgICwgY2VsbFxuICAgICAgICAsIGo7XG5cbiAgICAgIC8vIGhlYWRlclxuICAgICAgYm9keSArPSAnPHRoZWFkPlxcbjx0cj5cXG4nO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhlYWRpbmcgPSB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi5oZWFkZXJbaV0pO1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4uYWxpZ25baV1cbiAgICAgICAgICA/ICc8dGggYWxpZ249XCInICsgdGhpcy50b2tlbi5hbGlnbltpXSArICdcIj4nICsgaGVhZGluZyArICc8L3RoPlxcbidcbiAgICAgICAgICA6ICc8dGg+JyArIGhlYWRpbmcgKyAnPC90aD5cXG4nO1xuICAgICAgfVxuICAgICAgYm9keSArPSAnPC90cj5cXG48L3RoZWFkPlxcbic7XG5cbiAgICAgIC8vIGJvZHlcbiAgICAgIGJvZHkgKz0gJzx0Ym9keT5cXG4nXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy50b2tlbi5jZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3cgPSB0aGlzLnRva2VuLmNlbGxzW2ldO1xuICAgICAgICBib2R5ICs9ICc8dHI+XFxuJztcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNlbGwgPSB0aGlzLmlubGluZS5vdXRwdXQocm93W2pdKTtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4uYWxpZ25bal1cbiAgICAgICAgICAgID8gJzx0ZCBhbGlnbj1cIicgKyB0aGlzLnRva2VuLmFsaWduW2pdICsgJ1wiPicgKyBjZWxsICsgJzwvdGQ+XFxuJ1xuICAgICAgICAgICAgOiAnPHRkPicgKyBjZWxsICsgJzwvdGQ+XFxuJztcbiAgICAgICAgfVxuICAgICAgICBib2R5ICs9ICc8L3RyPlxcbic7XG4gICAgICB9XG4gICAgICBib2R5ICs9ICc8L3Rib2R5Plxcbic7XG5cbiAgICAgIHJldHVybiAnPHRhYmxlPlxcbidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvdGFibGU+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnYmxvY2txdW90ZV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnYmxvY2txdW90ZV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8YmxvY2txdW90ZT5cXG4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L2Jsb2NrcXVvdGU+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnbGlzdF9zdGFydCc6IHtcbiAgICAgIHZhciB0eXBlID0gdGhpcy50b2tlbi5vcmRlcmVkID8gJ29sJyA6ICd1bCdcbiAgICAgICAgLCBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8J1xuICAgICAgICArIHR5cGVcbiAgICAgICAgKyAnPlxcbidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvJ1xuICAgICAgICArIHR5cGVcbiAgICAgICAgKyAnPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2xpc3RfaXRlbV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9pdGVtX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLnR5cGUgPT09ICd0ZXh0J1xuICAgICAgICAgID8gdGhpcy5wYXJzZVRleHQoKVxuICAgICAgICAgIDogdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8bGk+J1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC9saT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdsb29zZV9pdGVtX3N0YXJ0Jzoge1xuICAgICAgdmFyIGJvZHkgPSAnJztcblxuICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT09ICdsaXN0X2l0ZW1fZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGxpPidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvbGk+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnaHRtbCc6IHtcbiAgICAgIHJldHVybiAhdGhpcy50b2tlbi5wcmUgJiYgIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICA/IHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpXG4gICAgICAgIDogdGhpcy50b2tlbi50ZXh0O1xuICAgIH1cbiAgICBjYXNlICdwYXJhZ3JhcGgnOiB7XG4gICAgICByZXR1cm4gJzxwPidcbiAgICAgICAgKyB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi50ZXh0KVxuICAgICAgICArICc8L3A+XFxuJztcbiAgICB9XG4gICAgY2FzZSAndGV4dCc6IHtcbiAgICAgIHJldHVybiAnPHA+J1xuICAgICAgICArIHRoaXMucGFyc2VUZXh0KClcbiAgICAgICAgKyAnPC9wPlxcbic7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuXG5mdW5jdGlvbiBlc2NhcGUoaHRtbCwgZW5jb2RlKSB7XG4gIHJldHVybiBodG1sXG4gICAgLnJlcGxhY2UoIWVuY29kZSA/IC8mKD8hIz9cXHcrOykvZyA6IC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2UocmVnZXgsIG9wdCkge1xuICByZWdleCA9IHJlZ2V4LnNvdXJjZTtcbiAgb3B0ID0gb3B0IHx8ICcnO1xuICByZXR1cm4gZnVuY3Rpb24gc2VsZihuYW1lLCB2YWwpIHtcbiAgICBpZiAoIW5hbWUpIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4LCBvcHQpO1xuICAgIHZhbCA9IHZhbC5zb3VyY2UgfHwgdmFsO1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKC8oXnxbXlxcW10pXFxeL2csICckMScpO1xuICAgIHJlZ2V4ID0gcmVnZXgucmVwbGFjZShuYW1lLCB2YWwpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cbm5vb3AuZXhlYyA9IG5vb3A7XG5cbmZ1bmN0aW9uIG1lcmdlKG9iaikge1xuICB2YXIgaSA9IDFcbiAgICAsIHRhcmdldFxuICAgICwga2V5O1xuXG4gIGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSB0YXJnZXRba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIE1hcmtlZFxuICovXG5cbmZ1bmN0aW9uIG1hcmtlZChzcmMsIG9wdCwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrIHx8IHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdDtcbiAgICAgIG9wdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG9wdCkgb3B0ID0gbWVyZ2Uoe30sIG1hcmtlZC5kZWZhdWx0cywgb3B0KTtcblxuICAgIHZhciBoaWdobGlnaHQgPSBvcHQuaGlnaGxpZ2h0XG4gICAgICAsIHRva2Vuc1xuICAgICAgLCBwZW5kaW5nXG4gICAgICAsIGkgPSAwO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRva2VucyA9IExleGVyLmxleChzcmMsIG9wdClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfVxuXG4gICAgcGVuZGluZyA9IHRva2Vucy5sZW5ndGg7XG5cbiAgICB2YXIgZG9uZSA9IGZ1bmN0aW9uKGhpKSB7XG4gICAgICB2YXIgb3V0LCBlcnI7XG5cbiAgICAgIGlmIChoaSAhPT0gdHJ1ZSkge1xuICAgICAgICBkZWxldGUgb3B0LmhpZ2hsaWdodDtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgb3V0ID0gUGFyc2VyLnBhcnNlKHRva2Vucywgb3B0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyID0gZTtcbiAgICAgIH1cblxuICAgICAgb3B0LmhpZ2hsaWdodCA9IGhpZ2hsaWdodDtcblxuICAgICAgcmV0dXJuIGVyclxuICAgICAgICA/IGNhbGxiYWNrKGVycilcbiAgICAgICAgOiBjYWxsYmFjayhudWxsLCBvdXQpO1xuICAgIH07XG5cbiAgICBpZiAoIWhpZ2hsaWdodCB8fCBoaWdobGlnaHQubGVuZ3RoIDwgMykge1xuICAgICAgcmV0dXJuIGRvbmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFwZW5kaW5nKSByZXR1cm4gZG9uZSgpO1xuXG4gICAgZm9yICg7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIChmdW5jdGlvbih0b2tlbikge1xuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gJ2NvZGUnKSB7XG4gICAgICAgICAgcmV0dXJuIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhpZ2hsaWdodCh0b2tlbi50ZXh0LCB0b2tlbi5sYW5nLCBmdW5jdGlvbihlcnIsIGNvZGUpIHtcbiAgICAgICAgICBpZiAoY29kZSA9PSBudWxsIHx8IGNvZGUgPT09IHRva2VuLnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtLXBlbmRpbmcgfHwgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b2tlbi50ZXh0ID0gY29kZTtcbiAgICAgICAgICB0b2tlbi5lc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAtLXBlbmRpbmcgfHwgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pKHRva2Vuc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKG9wdCkgb3B0ID0gbWVyZ2Uoe30sIG1hcmtlZC5kZWZhdWx0cywgb3B0KTtcbiAgICByZXR1cm4gUGFyc2VyLnBhcnNlKExleGVyLmxleChzcmMsIG9wdCksIG9wdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlLm1lc3NhZ2UgKz0gJ1xcblBsZWFzZSByZXBvcnQgdGhpcyB0byBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWQuJztcbiAgICBpZiAoKG9wdCB8fCBtYXJrZWQuZGVmYXVsdHMpLnNpbGVudCkge1xuICAgICAgcmV0dXJuICc8cD5BbiBlcnJvciBvY2N1cmVkOjwvcD48cHJlPidcbiAgICAgICAgKyBlc2NhcGUoZS5tZXNzYWdlICsgJycsIHRydWUpXG4gICAgICAgICsgJzwvcHJlPic7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zXG4gKi9cblxubWFya2VkLm9wdGlvbnMgPVxubWFya2VkLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHQpIHtcbiAgbWVyZ2UobWFya2VkLmRlZmF1bHRzLCBvcHQpO1xuICByZXR1cm4gbWFya2VkO1xufTtcblxubWFya2VkLmRlZmF1bHRzID0ge1xuICBnZm06IHRydWUsXG4gIHRhYmxlczogdHJ1ZSxcbiAgYnJlYWtzOiBmYWxzZSxcbiAgcGVkYW50aWM6IGZhbHNlLFxuICBzYW5pdGl6ZTogZmFsc2UsXG4gIHNtYXJ0TGlzdHM6IGZhbHNlLFxuICBzaWxlbnQ6IGZhbHNlLFxuICBoaWdobGlnaHQ6IG51bGwsXG4gIGxhbmdQcmVmaXg6ICdsYW5nLScsXG4gIHNtYXJ0eXBhbnRzOiBmYWxzZVxufTtcblxuLyoqXG4gKiBFeHBvc2VcbiAqL1xuXG5tYXJrZWQuUGFyc2VyID0gUGFyc2VyO1xubWFya2VkLnBhcnNlciA9IFBhcnNlci5wYXJzZTtcblxubWFya2VkLkxleGVyID0gTGV4ZXI7XG5tYXJrZWQubGV4ZXIgPSBMZXhlci5sZXg7XG5cbm1hcmtlZC5JbmxpbmVMZXhlciA9IElubGluZUxleGVyO1xubWFya2VkLmlubGluZUxleGVyID0gSW5saW5lTGV4ZXIub3V0cHV0O1xuXG5tYXJrZWQucGFyc2UgPSBtYXJrZWQ7XG5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBtYXJrZWQ7XG59IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBtYXJrZWQ7IH0pO1xufSBlbHNlIHtcbiAgdGhpcy5tYXJrZWQgPSBtYXJrZWQ7XG59XG5cbn0pLmNhbGwoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzIHx8ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCk7XG59KCkpO1xuIiwidmFyIHNvdXJjZXMgID0gcmVxdWlyZSgnLi9zb3VyY2VzJylcbnZhciBzaW5rcyAgICA9IHJlcXVpcmUoJy4vc2lua3MnKVxudmFyIHRocm91Z2hzID0gcmVxdWlyZSgnLi90aHJvdWdocycpXG52YXIgdSAgICAgICAgPSByZXF1aXJlKCdwdWxsLWNvcmUnKVxuXG5mdW5jdGlvbiBpc1Rocm91Z2ggKGZ1bikge1xuICByZXR1cm4gZnVuLnR5cGUgPT09IFwiVGhyb3VnaFwiIHx8IGZ1bi5sZW5ndGggPT09IDFcbn1cblxudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHB1bGwgKCkge1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuXG4gIGlmKGlzVGhyb3VnaChhcmdzWzBdKSlcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJlYWQpIHtcbiAgICAgIGFyZ3MudW5zaGlmdChyZWFkKVxuICAgICAgcmV0dXJuIHB1bGwuYXBwbHkobnVsbCwgYXJncylcbiAgICB9XG5cbiAgdmFyIHJlYWQgPSBhcmdzLnNoaWZ0KClcbiAgd2hpbGUoYXJncy5sZW5ndGgpXG4gICAgcmVhZCA9IGFyZ3Muc2hpZnQoKSAocmVhZClcbiAgcmV0dXJuIHJlYWRcbn1cblxuZm9yKHZhciBrIGluIHNvdXJjZXMpXG4gIGV4cG9ydHNba10gPSB1LlNvdXJjZShzb3VyY2VzW2tdKVxuXG5mb3IodmFyIGsgaW4gdGhyb3VnaHMpXG4gIGV4cG9ydHNba10gPSB1LlRocm91Z2godGhyb3VnaHNba10pXG5cbmZvcih2YXIgayBpbiBzaW5rcylcbiAgZXhwb3J0c1trXSA9IHUuU2luayhzaW5rc1trXSlcblxudmFyIG1heWJlID0gcmVxdWlyZSgnLi9tYXliZScpKGV4cG9ydHMpXG5cbmZvcih2YXIgayBpbiBtYXliZSlcbiAgZXhwb3J0c1trXSA9IG1heWJlW2tdXG5cbmV4cG9ydHMuRHVwbGV4ICA9IFxuZXhwb3J0cy5UaHJvdWdoID0gZXhwb3J0cy5waXBlYWJsZSAgICAgICA9IHUuVGhyb3VnaFxuZXhwb3J0cy5Tb3VyY2UgID0gZXhwb3J0cy5waXBlYWJsZVNvdXJjZSA9IHUuU291cmNlXG5leHBvcnRzLlNpbmsgICAgPSBleHBvcnRzLnBpcGVhYmxlU2luayAgID0gdS5TaW5rXG5cblxuIiwidmFyIHUgPSByZXF1aXJlKCdwdWxsLWNvcmUnKVxudmFyIHByb3AgPSB1LnByb3BcbnZhciBpZCAgID0gdS5pZFxudmFyIG1heWJlU2luayA9IHUubWF5YmVTaW5rXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHB1bGwpIHtcblxuICB2YXIgZXhwb3J0cyA9IHt9XG4gIHZhciBkcmFpbiA9IHB1bGwuZHJhaW5cblxuICB2YXIgZmluZCA9IFxuICBleHBvcnRzLmZpbmQgPSBmdW5jdGlvbiAodGVzdCwgY2IpIHtcbiAgICByZXR1cm4gbWF5YmVTaW5rKGZ1bmN0aW9uIChjYikge1xuICAgICAgdmFyIGVuZGVkID0gZmFsc2VcbiAgICAgIGlmKCFjYilcbiAgICAgICAgY2IgPSB0ZXN0LCB0ZXN0ID0gaWRcbiAgICAgIGVsc2VcbiAgICAgICAgdGVzdCA9IHByb3AodGVzdCkgfHwgaWRcblxuICAgICAgcmV0dXJuIGRyYWluKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmKHRlc3QoZGF0YSkpIHtcbiAgICAgICAgICBlbmRlZCA9IHRydWVcbiAgICAgICAgICBjYihudWxsLCBkYXRhKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZihlbmRlZCkgcmV0dXJuIC8vYWxyZWFkeSBjYWxsZWQgYmFja1xuICAgICAgICBjYihlcnIgPT09IHRydWUgPyBudWxsIDogZXJyLCBudWxsKVxuICAgICAgfSlcblxuICAgIH0sIGNiKVxuICB9XG5cbiAgdmFyIHJlZHVjZSA9IGV4cG9ydHMucmVkdWNlID0gXG4gIGZ1bmN0aW9uIChyZWR1Y2UsIGFjYywgY2IpIHtcbiAgICBcbiAgICByZXR1cm4gbWF5YmVTaW5rKGZ1bmN0aW9uIChjYikge1xuICAgICAgcmV0dXJuIGRyYWluKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGFjYyA9IHJlZHVjZShhY2MsIGRhdGEpXG4gICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNiKGVyciwgYWNjKVxuICAgICAgfSlcblxuICAgIH0sIGNiKVxuICB9XG5cbiAgdmFyIGNvbGxlY3QgPSBleHBvcnRzLmNvbGxlY3QgPSBleHBvcnRzLndyaXRlQXJyYXkgPVxuICBmdW5jdGlvbiAoY2IpIHtcbiAgICByZXR1cm4gcmVkdWNlKGZ1bmN0aW9uIChhcnIsIGl0ZW0pIHtcbiAgICAgIGFyci5wdXNoKGl0ZW0pXG4gICAgICByZXR1cm4gYXJyXG4gICAgfSwgW10sIGNiKVxuICB9XG5cbiAgdmFyIGNvbmNhdCA9IGV4cG9ydHMuY29uY2F0ID1cbiAgZnVuY3Rpb24gKGNiKSB7XG4gICAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEgKyBiXG4gICAgfSwgJycsIGNiKVxuICB9XG5cbiAgcmV0dXJuIGV4cG9ydHNcbn1cbiIsImV4cG9ydHMuaWQgPSBcbmZ1bmN0aW9uIChpdGVtKSB7XG4gIHJldHVybiBpdGVtXG59XG5cbmV4cG9ydHMucHJvcCA9IFxuZnVuY3Rpb24gKG1hcCkgeyAgXG4gIGlmKCdzdHJpbmcnID09IHR5cGVvZiBtYXApIHtcbiAgICB2YXIga2V5ID0gbWFwXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7IHJldHVybiBkYXRhW2tleV0gfVxuICB9XG4gIHJldHVybiBtYXBcbn1cblxuZXhwb3J0cy50ZXN0ZXIgPSBmdW5jdGlvbiAodGVzdCkge1xuICBpZighdGVzdCkgcmV0dXJuIGV4cG9ydHMuaWRcbiAgaWYoJ29iamVjdCcgPT09IHR5cGVvZiB0ZXN0XG4gICAgJiYgJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIHRlc3QudGVzdClcbiAgICAgIHJldHVybiB0ZXN0LnRlc3QuYmluZCh0ZXN0KVxuICByZXR1cm4gZXhwb3J0cy5wcm9wKHRlc3QpIHx8IGV4cG9ydHMuaWRcbn1cblxuZXhwb3J0cy5hZGRQaXBlID0gYWRkUGlwZVxuXG5mdW5jdGlvbiBhZGRQaXBlKHJlYWQpIHtcbiAgaWYoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlYWQpXG4gICAgcmV0dXJuIHJlYWRcblxuICByZWFkLnBpcGUgPSByZWFkLnBpcGUgfHwgZnVuY3Rpb24gKHJlYWRlcikge1xuICAgIGlmKCdmdW5jdGlvbicgIT0gdHlwZW9mIHJlYWRlcilcbiAgICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBwaXBlIHRvIHJlYWRlcicpXG4gICAgcmV0dXJuIGFkZFBpcGUocmVhZGVyKHJlYWQpKVxuICB9XG4gIHJlYWQudHlwZSA9ICdTb3VyY2UnXG4gIHJldHVybiByZWFkXG59XG5cbnZhciBTb3VyY2UgPVxuZXhwb3J0cy5Tb3VyY2UgPVxuZnVuY3Rpb24gU291cmNlIChjcmVhdGVSZWFkKSB7XG4gIGZ1bmN0aW9uIHMoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICByZXR1cm4gYWRkUGlwZShjcmVhdGVSZWFkLmFwcGx5KG51bGwsIGFyZ3MpKVxuICB9XG4gIHMudHlwZSA9ICdTb3VyY2UnXG4gIHJldHVybiBzXG59XG5cblxudmFyIFRocm91Z2ggPVxuZXhwb3J0cy5UaHJvdWdoID0gXG5mdW5jdGlvbiAoY3JlYXRlUmVhZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgdmFyIHBpcGVkID0gW11cbiAgICBmdW5jdGlvbiByZWFkZXIgKHJlYWQpIHtcbiAgICAgIGFyZ3MudW5zaGlmdChyZWFkKVxuICAgICAgcmVhZCA9IGNyZWF0ZVJlYWQuYXBwbHkobnVsbCwgYXJncylcbiAgICAgIHdoaWxlKHBpcGVkLmxlbmd0aClcbiAgICAgICAgcmVhZCA9IHBpcGVkLnNoaWZ0KCkocmVhZClcbiAgICAgIHJldHVybiByZWFkXG4gICAgICAvL3BpcGVpbmcgdG8gZnJvbSB0aGlzIHJlYWRlciBzaG91bGQgY29tcG9zZS4uLlxuICAgIH1cbiAgICByZWFkZXIucGlwZSA9IGZ1bmN0aW9uIChyZWFkKSB7XG4gICAgICBwaXBlZC5wdXNoKHJlYWQpIFxuICAgICAgaWYocmVhZC50eXBlID09PSAnU291cmNlJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgcGlwZSAnICsgcmVhZGVyLnR5cGUgKyAnIHRvIFNvdXJjZScpXG4gICAgICByZWFkZXIudHlwZSA9IHJlYWQudHlwZSA9PT0gJ1NpbmsnID8gJ1NpbmsnIDogJ1Rocm91Z2gnXG4gICAgICByZXR1cm4gcmVhZGVyXG4gICAgfVxuICAgIHJlYWRlci50eXBlID0gJ1Rocm91Z2gnXG4gICAgcmV0dXJuIHJlYWRlclxuICB9XG59XG5cbnZhciBTaW5rID1cbmV4cG9ydHMuU2luayA9IFxuZnVuY3Rpb24gU2luayhjcmVhdGVSZWFkZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgIGlmKCFjcmVhdGVSZWFkZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgYmUgY3JlYXRlUmVhZGVyIGZ1bmN0aW9uJylcbiAgICBmdW5jdGlvbiBzIChyZWFkKSB7XG4gICAgICBhcmdzLnVuc2hpZnQocmVhZClcbiAgICAgIHJldHVybiBjcmVhdGVSZWFkZXIuYXBwbHkobnVsbCwgYXJncylcbiAgICB9XG4gICAgcy50eXBlID0gJ1NpbmsnXG4gICAgcmV0dXJuIHNcbiAgfVxufVxuXG5cbmV4cG9ydHMubWF5YmVTaW5rID0gXG5leHBvcnRzLm1heWJlRHJhaW4gPSBcbmZ1bmN0aW9uIChjcmVhdGVTaW5rLCBjYikge1xuICBpZighY2IpXG4gICAgcmV0dXJuIFRocm91Z2goZnVuY3Rpb24gKHJlYWQpIHtcbiAgICAgIHZhciBlbmRlZFxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjbG9zZSwgY2IpIHtcbiAgICAgICAgaWYoY2xvc2UpIHJldHVybiByZWFkKGNsb3NlLCBjYilcbiAgICAgICAgaWYoZW5kZWQpIHJldHVybiBjYihlbmRlZClcblxuICAgICAgICBjcmVhdGVTaW5rKGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICBlbmRlZCA9IGVyciB8fCB0cnVlXG4gICAgICAgICAgaWYoIWVycikgY2IobnVsbCwgZGF0YSlcbiAgICAgICAgICBlbHNlICAgICBjYihlbmRlZClcbiAgICAgICAgfSkgKHJlYWQpXG4gICAgICB9XG4gICAgfSkoKVxuXG4gIHJldHVybiBTaW5rKGZ1bmN0aW9uIChyZWFkKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVNpbmsoY2IpIChyZWFkKVxuICB9KSgpXG59XG5cbiIsInZhciBkcmFpbiA9IGV4cG9ydHMuZHJhaW4gPSBmdW5jdGlvbiAocmVhZCwgb3AsIGRvbmUpIHtcblxuICA7KGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgdmFyIGxvb3AgPSB0cnVlLCBjYmVkID0gZmFsc2VcbiAgICB3aGlsZShsb29wKSB7XG4gICAgICBjYmVkID0gZmFsc2VcbiAgICAgIHJlYWQobnVsbCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgICBjYmVkID0gdHJ1ZVxuICAgICAgICBpZihlbmQpIHtcbiAgICAgICAgICBsb29wID0gZmFsc2VcbiAgICAgICAgICBkb25lICYmIGRvbmUoZW5kID09PSB0cnVlID8gbnVsbCA6IGVuZClcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG9wICYmIGZhbHNlID09PSBvcChkYXRhKSkge1xuICAgICAgICAgIGxvb3AgPSBmYWxzZVxuICAgICAgICAgIHJlYWQodHJ1ZSwgZG9uZSB8fCBmdW5jdGlvbiAoKSB7fSlcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKCFsb29wKXtcbiAgICAgICAgICBuZXh0KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIGlmKCFjYmVkKSB7XG4gICAgICAgIGxvb3AgPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gIH0pKClcbn1cblxudmFyIG9uRW5kID0gZXhwb3J0cy5vbkVuZCA9IGZ1bmN0aW9uIChyZWFkLCBkb25lKSB7XG4gIHJldHVybiBkcmFpbihyZWFkLCBudWxsLCBkb25lKVxufVxuXG52YXIgbG9nID0gZXhwb3J0cy5sb2cgPSBmdW5jdGlvbiAocmVhZCwgZG9uZSkge1xuICByZXR1cm4gZHJhaW4ocmVhZCwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKVxuICB9LCBkb25lKVxufVxuXG4iLCJcbnZhciBrZXlzID0gZXhwb3J0cy5rZXlzID1cbmZ1bmN0aW9uIChvYmplY3QpIHtcbiAgcmV0dXJuIHZhbHVlcyhPYmplY3Qua2V5cyhvYmplY3QpKVxufVxuXG52YXIgb25jZSA9IGV4cG9ydHMub25jZSA9XG5mdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChhYm9ydCwgY2IpIHtcbiAgICBpZihhYm9ydCkgcmV0dXJuIGNiKGFib3J0KVxuICAgIGlmKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciBfdmFsdWUgPSB2YWx1ZTsgdmFsdWUgPSBudWxsXG4gICAgICBjYihudWxsLCBfdmFsdWUpXG4gICAgfSBlbHNlXG4gICAgICBjYih0cnVlKVxuICB9XG59XG5cbnZhciB2YWx1ZXMgPSBleHBvcnRzLnZhbHVlcyA9IGV4cG9ydHMucmVhZEFycmF5ID1cbmZ1bmN0aW9uIChhcnJheSkge1xuICBpZighQXJyYXkuaXNBcnJheShhcnJheSkpXG4gICAgYXJyYXkgPSBPYmplY3Qua2V5cyhhcnJheSkubWFwKGZ1bmN0aW9uIChrKSB7XG4gICAgICByZXR1cm4gYXJyYXlba11cbiAgICB9KVxuICB2YXIgaSA9IDBcbiAgcmV0dXJuIGZ1bmN0aW9uIChlbmQsIGNiKSB7XG4gICAgaWYoZW5kKVxuICAgICAgcmV0dXJuIGNiICYmIGNiKGVuZCkgIFxuICAgIGNiKGkgPj0gYXJyYXkubGVuZ3RoIHx8IG51bGwsIGFycmF5W2krK10pXG4gIH1cbn1cblxuXG52YXIgY291bnQgPSBleHBvcnRzLmNvdW50ID0gXG5mdW5jdGlvbiAobWF4KSB7XG4gIHZhciBpID0gMDsgbWF4ID0gbWF4IHx8IEluZmluaXR5XG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZCkgcmV0dXJuIGNiICYmIGNiKGVuZClcbiAgICBpZihpID4gbWF4KVxuICAgICAgcmV0dXJuIGNiKHRydWUpXG4gICAgY2IobnVsbCwgaSsrKVxuICB9XG59XG5cbnZhciBpbmZpbml0ZSA9IGV4cG9ydHMuaW5maW5pdGUgPSBcbmZ1bmN0aW9uIChnZW5lcmF0ZSkge1xuICBnZW5lcmF0ZSA9IGdlbmVyYXRlIHx8IE1hdGgucmFuZG9tXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZCkgcmV0dXJuIGNiICYmIGNiKGVuZClcbiAgICByZXR1cm4gY2IobnVsbCwgZ2VuZXJhdGUoKSlcbiAgfVxufVxuXG52YXIgZGVmZXIgPSBleHBvcnRzLmRlZmVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3JlYWQsIGNicyA9IFtdLCBfZW5kXG5cbiAgdmFyIHJlYWQgPSBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKCFfcmVhZCkge1xuICAgICAgX2VuZCA9IGVuZFxuICAgICAgY2JzLnB1c2goY2IpXG4gICAgfSBcbiAgICBlbHNlIF9yZWFkKGVuZCwgY2IpXG4gIH1cbiAgcmVhZC5yZXNvbHZlID0gZnVuY3Rpb24gKHJlYWQpIHtcbiAgICBpZihfcmVhZCkgdGhyb3cgbmV3IEVycm9yKCdhbHJlYWR5IHJlc29sdmVkJylcbiAgICBfcmVhZCA9IHJlYWRcbiAgICBpZighX3JlYWQpIHRocm93IG5ldyBFcnJvcignbm8gcmVhZCBjYW5ub3QgcmVzb2x2ZSEnICsgX3JlYWQpXG4gICAgd2hpbGUoY2JzLmxlbmd0aClcbiAgICAgIF9yZWFkKF9lbmQsIGNicy5zaGlmdCgpKVxuICB9XG4gIHJlYWQuYWJvcnQgPSBmdW5jdGlvbihlcnIpIHtcbiAgICByZWFkLnJlc29sdmUoZnVuY3Rpb24gKF8sIGNiKSB7XG4gICAgICBjYihlcnIgfHwgdHJ1ZSlcbiAgICB9KVxuICB9XG4gIHJldHVybiByZWFkXG59XG5cbnZhciBlbXB0eSA9IGV4cG9ydHMuZW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYWJvcnQsIGNiKSB7XG4gICAgY2IodHJ1ZSlcbiAgfVxufVxuXG52YXIgZGVwdGhGaXJzdCA9IGV4cG9ydHMuZGVwdGhGaXJzdCA9XG5mdW5jdGlvbiAoc3RhcnQsIGNyZWF0ZVN0cmVhbSkge1xuICB2YXIgcmVhZHMgPSBbXVxuXG4gIHJlYWRzLnVuc2hpZnQob25jZShzdGFydCkpXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG5leHQgKGVuZCwgY2IpIHtcbiAgICBpZighcmVhZHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGNiKHRydWUpXG4gICAgcmVhZHNbMF0oZW5kLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZihlbmQpIHtcbiAgICAgICAgLy9pZiB0aGlzIHN0cmVhbSBoYXMgZW5kZWQsIGdvIHRvIHRoZSBuZXh0IHF1ZXVlXG4gICAgICAgIHJlYWRzLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIG5leHQobnVsbCwgY2IpXG4gICAgICB9XG4gICAgICByZWFkcy51bnNoaWZ0KGNyZWF0ZVN0cmVhbShkYXRhKSlcbiAgICAgIGNiKGVuZCwgZGF0YSlcbiAgICB9KVxuICB9XG59XG4vL3dpZHRoIGZpcnN0IGlzIGp1c3QgbGlrZSBkZXB0aCBmaXJzdCxcbi8vYnV0IHB1c2ggZWFjaCBuZXcgc3RyZWFtIG9udG8gdGhlIGVuZCBvZiB0aGUgcXVldWVcbnZhciB3aWR0aEZpcnN0ID0gZXhwb3J0cy53aWR0aEZpcnN0ID0gXG5mdW5jdGlvbiAoc3RhcnQsIGNyZWF0ZVN0cmVhbSkge1xuICB2YXIgcmVhZHMgPSBbXVxuXG4gIHJlYWRzLnB1c2gob25jZShzdGFydCkpXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIG5leHQgKGVuZCwgY2IpIHtcbiAgICBpZighcmVhZHMubGVuZ3RoKVxuICAgICAgcmV0dXJuIGNiKHRydWUpXG4gICAgcmVhZHNbMF0oZW5kLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZihlbmQpIHtcbiAgICAgICAgcmVhZHMuc2hpZnQoKVxuICAgICAgICByZXR1cm4gbmV4dChudWxsLCBjYilcbiAgICAgIH1cbiAgICAgIHJlYWRzLnB1c2goY3JlYXRlU3RyZWFtKGRhdGEpKVxuICAgICAgY2IoZW5kLCBkYXRhKVxuICAgIH0pXG4gIH1cbn1cblxuLy90aGlzIGNhbWUgb3V0IGRpZmZlcmVudCB0byB0aGUgZmlyc3QgKHN0cm0pXG4vL2F0dGVtcHQgYXQgbGVhZkZpcnN0LCBidXQgaXQncyBzdGlsbCBhIHZhbGlkXG4vL3RvcG9sb2dpY2FsIHNvcnQuXG52YXIgbGVhZkZpcnN0ID0gZXhwb3J0cy5sZWFmRmlyc3QgPSBcbmZ1bmN0aW9uIChzdGFydCwgY3JlYXRlU3RyZWFtKSB7XG4gIHZhciByZWFkcyA9IFtdXG4gIHZhciBvdXRwdXQgPSBbXVxuICByZWFkcy5wdXNoKG9uY2Uoc3RhcnQpKVxuICBcbiAgcmV0dXJuIGZ1bmN0aW9uIG5leHQgKGVuZCwgY2IpIHtcbiAgICByZWFkc1swXShlbmQsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgIGlmKGVuZCkge1xuICAgICAgICByZWFkcy5zaGlmdCgpXG4gICAgICAgIGlmKCFvdXRwdXQubGVuZ3RoKVxuICAgICAgICAgIHJldHVybiBjYih0cnVlKVxuICAgICAgICByZXR1cm4gY2IobnVsbCwgb3V0cHV0LnNoaWZ0KCkpXG4gICAgICB9XG4gICAgICByZWFkcy51bnNoaWZ0KGNyZWF0ZVN0cmVhbShkYXRhKSlcbiAgICAgIG91dHB1dC51bnNoaWZ0KGRhdGEpXG4gICAgICBuZXh0KG51bGwsIGNiKVxuICAgIH0pXG4gIH1cbn1cblxuIiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpO3ZhciB1ICAgICAgPSByZXF1aXJlKCdwdWxsLWNvcmUnKVxudmFyIHNvdXJjZXMgPSByZXF1aXJlKCcuL3NvdXJjZXMnKVxudmFyIHNpbmtzID0gcmVxdWlyZSgnLi9zaW5rcycpXG5cbnZhciBwcm9wICAgPSB1LnByb3BcbnZhciBpZCAgICAgPSB1LmlkXG52YXIgdGVzdGVyID0gdS50ZXN0ZXJcblxudmFyIG1hcCA9IGV4cG9ydHMubWFwID0gXG5mdW5jdGlvbiAocmVhZCwgbWFwKSB7XG4gIG1hcCA9IHByb3AobWFwKSB8fCBpZFxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICByZWFkKGVuZCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgdmFyIGRhdGEgPSAhZW5kID8gbWFwKGRhdGEpIDogbnVsbFxuICAgICAgY2IoZW5kLCBkYXRhKVxuICAgIH0pXG4gIH1cbn1cblxudmFyIGFzeW5jTWFwID0gZXhwb3J0cy5hc3luY01hcCA9XG5mdW5jdGlvbiAocmVhZCwgbWFwKSB7XG4gIGlmKCFtYXApIHJldHVybiByZWFkXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZCkgcmV0dXJuIHJlYWQoZW5kLCBjYikgLy9hYm9ydFxuICAgIHJlYWQobnVsbCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgaWYoZW5kKSByZXR1cm4gY2IoZW5kLCBkYXRhKVxuICAgICAgbWFwKGRhdGEsIGNiKVxuICAgIH0pXG4gIH1cbn1cblxudmFyIHBhcmFNYXAgPSBleHBvcnRzLnBhcmFNYXAgPVxuZnVuY3Rpb24gKHJlYWQsIG1hcCwgd2lkdGgpIHtcbiAgaWYoIW1hcCkgcmV0dXJuIHJlYWRcbiAgdmFyIGVuZGVkID0gZmFsc2UsIHF1ZXVlID0gW10sIF9jYlxuXG4gIGZ1bmN0aW9uIGRyYWluICgpIHtcbiAgICBpZighX2NiKSByZXR1cm5cbiAgICB2YXIgY2IgPSBfY2JcbiAgICBfY2IgPSBudWxsXG4gICAgaWYocXVldWUubGVuZ3RoKVxuICAgICAgcmV0dXJuIGNiKG51bGwsIHF1ZXVlLnNoaWZ0KCkpXG4gICAgZWxzZSBpZihlbmRlZCAmJiAhbilcbiAgICAgIHJldHVybiBjYihlbmRlZClcbiAgICBfY2IgPSBjYlxuICB9XG5cbiAgZnVuY3Rpb24gcHVsbCAoKSB7XG4gICAgcmVhZChudWxsLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZihlbmQpIHtcbiAgICAgICAgZW5kZWQgPSBlbmRcbiAgICAgICAgcmV0dXJuIGRyYWluKClcbiAgICAgIH1cbiAgICAgIG4rK1xuICAgICAgbWFwKGRhdGEsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgbi0tXG5cbiAgICAgICAgcXVldWUucHVzaChkYXRhKVxuICAgICAgICBkcmFpbigpXG4gICAgICB9KVxuXG4gICAgICBpZihuIDwgd2lkdGggJiYgIWVuZGVkKVxuICAgICAgICBwdWxsKClcbiAgICB9KVxuICB9XG5cbiAgdmFyIG4gPSAwXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZCkgcmV0dXJuIHJlYWQoZW5kLCBjYikgLy9hYm9ydFxuICAgIC8vY29udGludWUgdG8gcmVhZCB3aGlsZSB0aGVyZSBhcmUgbGVzcyB0aGFuIDMgbWFwcyBpbiBmbGlnaHRcbiAgICBfY2IgPSBjYlxuICAgIGlmKHF1ZXVlLmxlbmd0aCB8fCBlbmRlZClcbiAgICAgIHB1bGwoKSwgZHJhaW4oKVxuICAgIGVsc2UgcHVsbCgpXG4gIH1cbiAgcmV0dXJuIGhpZ2hXYXRlck1hcmsoYXN5bmNNYXAocmVhZCwgbWFwKSwgd2lkdGgpXG59XG5cbnZhciBmaWx0ZXIgPSBleHBvcnRzLmZpbHRlciA9XG5mdW5jdGlvbiAocmVhZCwgdGVzdCkge1xuICAvL3JlZ2V4cFxuICB0ZXN0ID0gdGVzdGVyKHRlc3QpXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0IChlbmQsIGNiKSB7XG4gICAgcmVhZChlbmQsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgIGlmKCFlbmQgJiYgIXRlc3QoZGF0YSkpXG4gICAgICAgIHJldHVybiBuZXh0KGVuZCwgY2IpXG4gICAgICBjYihlbmQsIGRhdGEpXG4gICAgfSlcbiAgfVxufVxuXG52YXIgZmlsdGVyTm90ID0gZXhwb3J0cy5maWx0ZXJOb3QgPVxuZnVuY3Rpb24gKHJlYWQsIHRlc3QpIHtcbiAgdGVzdCA9IHRlc3Rlcih0ZXN0KVxuICByZXR1cm4gZmlsdGVyKHJlYWQsIGZ1bmN0aW9uIChlKSB7XG4gICAgcmV0dXJuICF0ZXN0KGUpXG4gIH0pXG59XG5cbnZhciB0aHJvdWdoID0gZXhwb3J0cy50aHJvdWdoID0gXG5mdW5jdGlvbiAocmVhZCwgb3AsIG9uRW5kKSB7XG4gIHZhciBhID0gZmFsc2VcbiAgZnVuY3Rpb24gb25jZSAoYWJvcnQpIHtcbiAgICBpZihhIHx8ICFvbkVuZCkgcmV0dXJuXG4gICAgYSA9IHRydWVcbiAgICBvbkVuZChhYm9ydCA9PT0gdHJ1ZSA/IG51bGwgOiBhYm9ydClcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZCkgb25jZShlbmQpXG4gICAgcmV0dXJuIHJlYWQoZW5kLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZighZW5kKSBvcCAmJiBvcChkYXRhKVxuICAgICAgZWxzZSBvbmNlKGVuZClcbiAgICAgIGNiKGVuZCwgZGF0YSlcbiAgICB9KVxuICB9XG59XG5cbnZhciB0YWtlID0gZXhwb3J0cy50YWtlID1cbmZ1bmN0aW9uIChyZWFkLCB0ZXN0KSB7XG4gIHZhciBlbmRlZCA9IGZhbHNlXG4gIGlmKCdudW1iZXInID09PSB0eXBlb2YgdGVzdCkge1xuICAgIHZhciBuID0gdGVzdDsgdGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuIC0tXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChlbmQsIGNiKSB7XG4gICAgaWYoZW5kZWQpIHJldHVybiBjYihlbmRlZClcbiAgICBpZihlbmRlZCA9IGVuZCkgcmV0dXJuIHJlYWQoZW5kZWQsIGNiKVxuXG4gICAgcmVhZChudWxsLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZihlbmRlZCA9IGVuZGVkIHx8IGVuZCkgcmV0dXJuIGNiKGVuZGVkKVxuICAgICAgaWYoIXRlc3QoZGF0YSkpIHtcbiAgICAgICAgZW5kZWQgPSB0cnVlXG4gICAgICAgIHJlYWQodHJ1ZSwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgICAgIGNiKGVuZGVkLCBkYXRhKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICBjYihudWxsLCBkYXRhKVxuICAgIH0pXG4gIH1cbn1cblxudmFyIHVuaXF1ZSA9IGV4cG9ydHMudW5pcXVlID0gZnVuY3Rpb24gKHJlYWQsIGZpZWxkLCBpbnZlcnQpIHtcbiAgZmllbGQgPSBwcm9wKGZpZWxkKSB8fCBpZFxuICB2YXIgc2VlbiA9IHt9XG4gIHJldHVybiBmaWx0ZXIocmVhZCwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIga2V5ID0gZmllbGQoZGF0YSlcbiAgICBpZihzZWVuW2tleV0pIHJldHVybiAhIWludmVydCAvL2ZhbHNlLCBieSBkZWZhdWx0XG4gICAgZWxzZSBzZWVuW2tleV0gPSB0cnVlXG4gICAgcmV0dXJuICFpbnZlcnQgLy90cnVlIGJ5IGRlZmF1bHRcbiAgfSlcbn1cblxudmFyIG5vblVuaXF1ZSA9IGV4cG9ydHMubm9uVW5pcXVlID0gZnVuY3Rpb24gKHJlYWQsIGZpZWxkKSB7XG4gIHJldHVybiB1bmlxdWUocmVhZCwgZmllbGQsIHRydWUpXG59XG5cbnZhciBncm91cCA9IGV4cG9ydHMuZ3JvdXAgPVxuZnVuY3Rpb24gKHJlYWQsIHNpemUpIHtcbiAgdmFyIGVuZGVkOyBzaXplID0gc2l6ZSB8fCA1XG4gIHZhciBxdWV1ZSA9IFtdXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChlbmQsIGNiKSB7XG4gICAgLy90aGlzIG1lYW5zIHRoYXQgdGhlIHVwc3RyZWFtIGlzIHNlbmRpbmcgYW4gZXJyb3IuXG4gICAgaWYoZW5kKSByZXR1cm4gcmVhZChlbmRlZCA9IGVuZCwgY2IpXG4gICAgLy90aGlzIG1lYW5zIHRoYXQgd2UgcmVhZCBhbiBlbmQgYmVmb3JlLlxuICAgIGlmKGVuZGVkKSByZXR1cm4gY2IoZW5kZWQpXG5cbiAgICByZWFkKG51bGwsIGZ1bmN0aW9uIG5leHQoZW5kLCBkYXRhKSB7XG4gICAgICBpZihlbmRlZCA9IGVuZGVkIHx8IGVuZCkge1xuICAgICAgICBpZighcXVldWUubGVuZ3RoKVxuICAgICAgICAgIHJldHVybiBjYihlbmRlZClcblxuICAgICAgICB2YXIgX3F1ZXVlID0gcXVldWU7IHF1ZXVlID0gW11cbiAgICAgICAgcmV0dXJuIGNiKG51bGwsIF9xdWV1ZSlcbiAgICAgIH1cbiAgICAgIHF1ZXVlLnB1c2goZGF0YSlcbiAgICAgIGlmKHF1ZXVlLmxlbmd0aCA8IHNpemUpXG4gICAgICAgIHJldHVybiByZWFkKG51bGwsIG5leHQpXG5cbiAgICAgIHZhciBfcXVldWUgPSBxdWV1ZTsgcXVldWUgPSBbXVxuICAgICAgY2IobnVsbCwgX3F1ZXVlKVxuICAgIH0pXG4gIH1cbn1cblxudmFyIGZsYXR0ZW4gPSBleHBvcnRzLmZsYXR0ZW4gPSBmdW5jdGlvbiAocmVhZCkge1xuICB2YXIgX3JlYWRcbiAgcmV0dXJuIGZ1bmN0aW9uIChhYm9ydCwgY2IpIHtcbiAgICBpZihfcmVhZCkgbmV4dENodW5rKClcbiAgICBlbHNlICAgICAgbmV4dFN0cmVhbSgpXG5cbiAgICBmdW5jdGlvbiBuZXh0Q2h1bmsgKCkge1xuICAgICAgX3JlYWQobnVsbCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgICBpZihlbmQpIG5leHRTdHJlYW0oKVxuICAgICAgICBlbHNlICAgIGNiKG51bGwsIGRhdGEpXG4gICAgICB9KVxuICAgIH1cbiAgICBmdW5jdGlvbiBuZXh0U3RyZWFtICgpIHtcbiAgICAgIHJlYWQobnVsbCwgZnVuY3Rpb24gKGVuZCwgc3RyZWFtKSB7XG4gICAgICAgIGlmKGVuZClcbiAgICAgICAgICByZXR1cm4gY2IoZW5kKVxuICAgICAgICBpZihBcnJheS5pc0FycmF5KHN0cmVhbSkpXG4gICAgICAgICAgc3RyZWFtID0gc291cmNlcy52YWx1ZXMoc3RyZWFtKVxuICAgICAgICBlbHNlIGlmKCdmdW5jdGlvbicgIT0gdHlwZW9mIHN0cmVhbSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4cGVjdGVkIHN0cmVhbSBvZiBzdHJlYW1zJylcbiAgICAgICAgXG4gICAgICAgIF9yZWFkID0gc3RyZWFtXG4gICAgICAgIG5leHRDaHVuaygpXG4gICAgICB9KVxuICAgIH1cbiAgfVxufVxuXG52YXIgcHJlcGVuZCA9XG5leHBvcnRzLnByZXBlbmQgPVxuZnVuY3Rpb24gKHJlYWQsIGhlYWQpIHtcblxuICByZXR1cm4gZnVuY3Rpb24gKGFib3J0LCBjYikge1xuICAgIGlmKGhlYWQgIT09IG51bGwpIHtcbiAgICAgIGlmKGFib3J0KVxuICAgICAgICByZXR1cm4gcmVhZChhYm9ydCwgY2IpXG4gICAgICB2YXIgX2hlYWQgPSBoZWFkXG4gICAgICBoZWFkID0gbnVsbFxuICAgICAgY2IobnVsbCwgX2hlYWQpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYWQoYWJvcnQsIGNiKVxuICAgIH1cbiAgfVxuXG59XG5cbi8vdmFyIGRyYWluSWYgPSBleHBvcnRzLmRyYWluSWYgPSBmdW5jdGlvbiAob3AsIGRvbmUpIHtcbi8vICBzaW5rcy5kcmFpbihcbi8vfVxuXG52YXIgX3JlZHVjZSA9IGV4cG9ydHMuX3JlZHVjZSA9IGZ1bmN0aW9uIChyZWFkLCByZWR1Y2UsIGluaXRpYWwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChjbG9zZSwgY2IpIHtcbiAgICBpZihjbG9zZSkgcmV0dXJuIHJlYWQoY2xvc2UsIGNiKVxuICAgIGlmKGVuZGVkKSByZXR1cm4gY2IoZW5kZWQpXG5cbiAgICBzaW5rcy5kcmFpbihmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgaW5pdGlhbCA9IHJlZHVjZShpbml0aWFsLCBpdGVtKVxuICAgIH0sIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgIGVuZGVkID0gZXJyIHx8IHRydWVcbiAgICAgIGlmKCFlcnIpIGNiKG51bGwsIGluaXRpYWwpXG4gICAgICBlbHNlICAgICBjYihlbmRlZClcbiAgICB9KVxuICAgIChyZWFkKVxuICB9XG59XG5cbnZhciBuZXh0VGljayA9IHByb2Nlc3MubmV4dFRpY2tcblxudmFyIGhpZ2hXYXRlck1hcmsgPSBleHBvcnRzLmhpZ2hXYXRlck1hcmsgPSBcbmZ1bmN0aW9uIChyZWFkLCBoaWdoV2F0ZXJNYXJrKSB7XG4gIHZhciBidWZmZXIgPSBbXSwgd2FpdGluZyA9IFtdLCBlbmRlZCwgcmVhZGluZyA9IGZhbHNlXG4gIGhpZ2hXYXRlck1hcmsgPSBoaWdoV2F0ZXJNYXJrIHx8IDEwXG5cbiAgZnVuY3Rpb24gcmVhZEFoZWFkICgpIHtcbiAgICB3aGlsZSh3YWl0aW5nLmxlbmd0aCAmJiAoYnVmZmVyLmxlbmd0aCB8fCBlbmRlZCkpXG4gICAgICB3YWl0aW5nLnNoaWZ0KCkoZW5kZWQsIGVuZGVkID8gbnVsbCA6IGJ1ZmZlci5zaGlmdCgpKVxuICB9XG5cbiAgZnVuY3Rpb24gbmV4dCAoKSB7XG4gICAgaWYoZW5kZWQgfHwgcmVhZGluZyB8fCBidWZmZXIubGVuZ3RoID49IGhpZ2hXYXRlck1hcmspXG4gICAgICByZXR1cm5cbiAgICByZWFkaW5nID0gdHJ1ZVxuICAgIHJldHVybiByZWFkKGVuZGVkLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICByZWFkaW5nID0gZmFsc2VcbiAgICAgIGVuZGVkID0gZW5kZWQgfHwgZW5kXG4gICAgICBpZihkYXRhICE9IG51bGwpIGJ1ZmZlci5wdXNoKGRhdGEpXG4gICAgICBcbiAgICAgIG5leHQoKTsgcmVhZEFoZWFkKClcbiAgICB9KVxuICB9XG5cbiAgbmV4dFRpY2sobmV4dClcblxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBlbmRlZCA9IGVuZGVkIHx8IGVuZFxuICAgIHdhaXRpbmcucHVzaChjYilcblxuICAgIG5leHQoKTsgcmVhZEFoZWFkKClcbiAgfVxufVxuXG5cblxuIiwiLyoqXG4gICMjIGZsYXR0ZW5cblxuICBGbGF0dGVuIGFuIGFycmF5IHVzaW5nIGBbXS5yZWR1Y2VgXG5cbiAgPDw8IGV4YW1wbGVzL2ZsYXR0ZW4uanNcbiAgXG4qKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhLCBiKSB7XG4gIC8vIGlmIGEgaXMgbm90IGFscmVhZHkgYW4gYXJyYXksIG1ha2UgaXQgb25lXG4gIGEgPSBBcnJheS5pc0FycmF5KGEpID8gYSA6IFthXTtcblxuICAvLyBjb25jYXQgYiB3aXRoIGFcbiAgcmV0dXJuIGEuY29uY2F0KGIpO1xufTsiLCJ2YXIgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcbnZhciBTbGlkZSA9IHJlcXVpcmUoJy4vc2xpZGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRzKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb250ZW50KSB7XG4gICAgdmFyIHNsaWRlO1xuXG4gICAgLy8gaGFuZGxlIHRoaW5ncyB0aGF0IGFyZSBhbHJlYWR5IGEgSFRNTEVsZW1lbnRcbiAgICBpZiAoY29udGVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICBzbGlkZSA9IG5ldyBTbGlkZShjb250ZW50KTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgY29udGVudCByZW5kZXJpbmdcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgfHwgKGNvbnRlbnQgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICBzbGlkZSA9IG5ldyBTbGlkZShjcmVsKCdkaXYnLCBjb250ZW50KSk7XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgbmV3IHNsaWRlIChpZiByZXF1aXJlZClcbiAgICBzbGlkZSA9IHNsaWRlIHx8IG5ldyBTbGlkZSgpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCB0aGVuIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIHNsaWRlIGFzIFwidGhpc1wiXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRlbnQuY2FsbChzbGlkZSk7XG4gICAgfVxuICAgIC8vIGlmIHdlIGhhdmUgYW4gb2JqZWN0LCB0aGVuIGl0ZXJhdGUgdGhyb3VnaCB0aGUga2V5cyBhbmQgY2FsbFxuICAgIC8vIHJlbGV2YW50IHNsaWRlIGZ1bmN0aW9uc1xuICAgIGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb250ZW50KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHNsaWRlW2tleV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNsaWRlW2tleV0oY29udGVudFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWRlO1xuICB9O1xufTsiLCJ2YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcblxuZnVuY3Rpb24gU2xpZGUoZWwpIHtcbiAgaWYgKCEgKHRoaXMgaW5zdGFuY2VvZiBTbGlkZSkpIHtcbiAgICByZXR1cm4gbmV3IFNsaWRlKGVsKTtcbiAgfVxuXG4gIC8vIGFzc2lnbiBvciBjcmVhdGUgdGhlIGVsZW1lbnRcbiAgdGhpcy5lbCA9IGVsIHx8IGNyZWwoJ2RpdicpO1xuXG4gIC8vIHByZXBhcmUgdGhlIGVsZW1lbnRcbiAgdGhpcy5fcHJlcCh0aGlzLmVsKTtcbn1cblxudXRpbC5pbmhlcml0cyhTbGlkZSwgRXZlbnRFbWl0dGVyKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTbGlkZTtcbnZhciBwcm90byA9IFNsaWRlLnByb3RvdHlwZTtcblxucHJvdG8udGl0bGUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMudGl0bGUgPSBjcmVsKCdoMScsIHZhbHVlKSk7XG59O1xuXG5wcm90by5jb2RlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgY29uc29sZS5sb2codmFsdWUpO1xufTtcblxuLyogaW50ZXJuYWwgbWV0aG9kcyAqL1xuXG5wcm90by5fcHJlcCA9IGZ1bmN0aW9uKGVsKSB7XG4gIC8vIGFkZCB0aGUgc2xpZGUgY2xhc3NcbiAgZWwuY2xhc3NMaXN0LmFkZCgnc2xpZGUnKTtcbn07Il19
;