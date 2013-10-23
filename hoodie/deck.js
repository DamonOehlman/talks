;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"fs":1,"shazam":6}],4:[function(require,module,exports){
var crel = require('crel');

module.exports = function(html) {
  var el = crel('div', { class: 'slide' });

  // set the inner html
  el.innerHTML = html;
  return el;
};
},{"crel":8}],5:[function(require,module,exports){
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
},{"crel":8}],6:[function(require,module,exports){
var __dirname="/node_modules/shazam";/* jshint node: true */
/* global document: false */
'use strict';

var fs = require('fs');
// var bedazzle = require('bedazzle');
var crel = require('crel');
var transform = require('feature/css')('transform');
var flatten = require('whisk/flatten');
var keydown = require('dd/next')('keydown', document);
var pull = require('pull-stream');
var render = require('./render');
var current;
var slide;

// transform functions
var activate = push(0);
var pushRight = push(screen.width);
var pushLeft = push(-screen.width);
var wooble = "alert('hello');";

// create a key directions hash
var keyDirections = {
  37: 'back',
  38: 'back',
  39: 'next',
  40: 'next'
};

require('insert-css')("html, body {\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\n\n.slide {\n  padding: 1em;\n  font-size: 3em;\n  transition: all ease-in-out 0.5s;\n  background-size: cover;\n}\n");

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
    // create the element
    .map(render(opts))
    // apply required base styling
    .map(style)
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
    transform(slide, 'translateX(' + position + 'px) translateZ(0)');
    return slide;
  };
}

function append(slide) {
  // add to the document
  document.body.appendChild(slide);

  // return the slide
  return slide;
}

function style(slide) {
  slide.style.position = 'absolute';
  slide.style.height = screen.height + 'px';
  slide.style.width = screen.width + 'px';

  return slide;
}
},{"./html":4,"./img":5,"./markdown":7,"./render":75,"crel":8,"dd/next":9,"feature/css":10,"fs":1,"insert-css":66,"pull-stream":68,"whisk/flatten":74}],7:[function(require,module,exports){
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
},{"./html":4,"highlight.js":35,"marked":67}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
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
},{"./1c.js":11,"./actionscript.js":12,"./apache.js":13,"./applescript.js":14,"./avrasm.js":15,"./axapta.js":16,"./bash.js":17,"./brainfuck.js":18,"./clojure.js":19,"./cmake.js":20,"./coffeescript.js":21,"./cpp.js":22,"./cs.js":23,"./css.js":24,"./d.js":25,"./delphi.js":26,"./diff.js":27,"./django.js":28,"./dos.js":29,"./erlang-repl.js":30,"./erlang.js":31,"./glsl.js":32,"./go.js":33,"./haskell.js":34,"./http.js":36,"./ini.js":37,"./java.js":38,"./javascript.js":39,"./json.js":40,"./lisp.js":41,"./lua.js":42,"./markdown.js":43,"./matlab.js":44,"./mel.js":45,"./nginx.js":46,"./objectivec.js":47,"./parser3.js":48,"./perl.js":49,"./php.js":50,"./profile.js":51,"./python.js":52,"./r.js":53,"./rib.js":54,"./rsl.js":55,"./ruby.js":56,"./rust.js":57,"./scala.js":58,"./smalltalk.js":59,"./sql.js":60,"./tex.js":61,"./vala.js":62,"./vbscript.js":63,"./vhdl.js":64,"./xml.js":65}],36:[function(require,module,exports){
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
},{}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
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
},{}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
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
},{}],46:[function(require,module,exports){
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
},{}],47:[function(require,module,exports){
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
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
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
},{}],50:[function(require,module,exports){
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
},{}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
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
},{}],54:[function(require,module,exports){
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
},{}],55:[function(require,module,exports){
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
},{}],56:[function(require,module,exports){
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
},{}],57:[function(require,module,exports){
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
},{}],58:[function(require,module,exports){
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
},{}],59:[function(require,module,exports){
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
},{}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
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
},{}],62:[function(require,module,exports){
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
},{}],63:[function(require,module,exports){
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
},{}],64:[function(require,module,exports){
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
},{}],65:[function(require,module,exports){
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
},{}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/**
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

},{}],68:[function(require,module,exports){
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



},{"./maybe":69,"./sinks":71,"./sources":72,"./throughs":73,"pull-core":70}],69:[function(require,module,exports){
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

},{"pull-core":70}],70:[function(require,module,exports){
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


},{}],71:[function(require,module,exports){
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


},{}],72:[function(require,module,exports){

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


},{}],73:[function(require,module,exports){
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




},{"./sinks":71,"./sources":72,"__browserify_process":2,"pull-core":70}],74:[function(require,module,exports){
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
},{}],75:[function(require,module,exports){
var crel = require('crel');
var Slide = require('./slide');

module.exports = function(opts) {
  return function(content) {
    var slide;

    // handle things that are already a HTMLElement
    if (content instanceof HTMLElement) {
      // ensure the content has the class of slide
      content.classList.add('slide');

      // return the content
      return content;
    }

    // handle content rendering
    if (typeof content == 'string' || (content instanceof String)) {
      return crel('div', { class: 'slide' }, content);
    }

    // create a new slide
    slide = new Slide();

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

    return slide.el;
  };
};
},{"./slide":76,"crel":8}],76:[function(require,module,exports){
var crel = require('crel');

function Slide() {
  if (! (this instanceof Slide)) {
    return new Slide();
  }

  this.el = crel('div', { class: 'slide' });
}

module.exports = Slide;
var proto = Slide.prototype;

proto.title = function(value) {
  this.el.appendChild(this.title = crel('h1', value));
};

proto.code = function(value) {
  console.log(value);
};
},{"crel":8}]},{},[3])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9pbnNlcnQtbW9kdWxlLWdsb2JhbHMvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL2luZGV4LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9odG1sLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9pbWcuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL2luZGV4LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9tYXJrZG93bi5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2NyZWwvY3JlbC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2RkL25leHQuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9mZWF0dXJlL2Nzcy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy8xYy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9hY3Rpb25zY3JpcHQuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYXBhY2hlLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2FwcGxlc2NyaXB0LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2F2cmFzbS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9heGFwdGEuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvYmFzaC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9icmFpbmZ1Y2suanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY2xvanVyZS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jbWFrZS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jb2ZmZWVzY3JpcHQuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY3BwLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2NzLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2Nzcy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2RlbHBoaS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kaWZmLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2RqYW5nby5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kb3MuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXJsYW5nLXJlcGwuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXJsYW5nLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2dsc2wuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZ28uanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaGFza2VsbC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9oaWdobGlnaHQuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaHR0cC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9pbmkuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvamF2YS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9qYXZhc2NyaXB0LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2pzb24uanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbGlzcC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9sdWEuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbWFya2Rvd24uanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvbWF0bGFiLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL21lbC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9uZ2lueC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9vYmplY3RpdmVjLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3BhcnNlcjMuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcGVybC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9waHAuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcHJvZmlsZS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9weXRob24uanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvci5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9yaWIuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcnNsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3J1YnkuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcnVzdC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zY2FsYS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9zbWFsbHRhbGsuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3FsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3RleC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy92YWxhLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3Zic2NyaXB0LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3ZoZGwuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMveG1sLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL21hcmtlZC9saWIvbWFya2VkLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrcy9ob29kaWUvbm9kZV9tb2R1bGVzL3NoYXphbS9ub2RlX21vZHVsZXMvcHVsbC1zdHJlYW0vaW5kZXguanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9wdWxsLXN0cmVhbS9tYXliZS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL3B1bGwtc3RyZWFtL25vZGVfbW9kdWxlcy9wdWxsLWNvcmUvaW5kZXguanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9wdWxsLXN0cmVhbS9zaW5rcy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL3B1bGwtc3RyZWFtL3NvdXJjZXMuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL25vZGVfbW9kdWxlcy9wdWxsLXN0cmVhbS90aHJvdWdocy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vbm9kZV9tb2R1bGVzL3doaXNrL2ZsYXR0ZW4uanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGtzL2hvb2RpZS9ub2RlX21vZHVsZXMvc2hhemFtL3JlbmRlci5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsa3MvaG9vZGllL25vZGVfbW9kdWxlcy9zaGF6YW0vc2xpZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcG9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9uQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxuLy8gbm90IGltcGxlbWVudGVkXG4vLyBUaGUgcmVhc29uIGZvciBoYXZpbmcgYW4gZW1wdHkgZmlsZSBhbmQgbm90IHRocm93aW5nIGlzIHRvIGFsbG93XG4vLyB1bnRyYWRpdGlvbmFsIGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbW9kdWxlLlxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmIChldi5zb3VyY2UgPT09IHdpbmRvdyAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuLy8gdmFyIGRlY2sgPSByZXF1aXJlKCdkZWNrZXInKSgpO1xudmFyIHMgPSByZXF1aXJlKCdzaGF6YW0nKTtcblxucygnUHJvdG90eXBpbmcgYXBwcyB3aXRoIEhvb2RpZScsIFtcbiAgcy5tZChcIiMgUHJvdG90eXBpbmcgQXBwbGljYXRpb25zIHdpdGggSG9vZGllXFxuXFxuLS0tXFxuXFxuIyMgV2hhdCBpcyBIb29kaWU/XFxuXFxuW0hvb2RpZV0oaHR0cDovL2hvb2QuaWUpIGlzIGFuIEpTIGFwcGxpY2F0aW9uIGRldmVsb3BtZW50IGFwcHJvYWNoIHdoaWNoIGhhcyBhIGZvY3VzIG9uIG1ha2luZyBhcHBsaWNhdGlvbnMgd2l0aCBvZmZsaW5lIHN5bmNocm9uaXphdGlvbiAqKmp1c3Qgd29yayoqLlxcblxcbi0tLVxcblxcbiMjIFdoeSBVc2UgKG9yIGV2ZW4gbG9vayBhdCkgSG9vZGllP1xcblxcbjEuIEJlY2F1c2UgdGhleSBhcmUgZm9jdXNlZCBvbiBzb2x2aW5nIGhhcmQgcHJvYmxlbXMgKGRhdGEgc3luYykgc3RyYWlnaHQgdXAsIHJhdGhlciB0aGFuIGdpdmluZyB5b3UgZmxhc2h5IHRoaW5ncyB0byBkaXN0cmFjdCB5b3UuXFxuXFxuMi4gTGV2ZXJhZ2VzIENvdWNoREIgZm9yIHN0dWZmIGl0J3MgcmVhbGx5IGdvb2QgYXQuXFxuXFxuMy4gVGhlcmUncyBzb21lIHJlYWxseSBzbWFydCwgZXhwZXJpZW5jZWQgcGVvcGxlIHdvcmtpbmcgb24gaXQuXFxuXFxuLS0tXFxuXFxuIyMgSG9vZGllIENvcmUgQ29uY2VwdHNcXG5cXG4tIFVzZXIgQWNjb3VudHMgYW5kIEF1dGhlbnRpY2F0aW9uXFxuLSBHZW5lcmljIERvY3VtZW50IFN0b3JlXFxuLSBUYXNrc1xcbi0gQnVzLWxpa2UgZXZlbnRpbmcgKG5vdCBhcyBnb29kIGFzIFtldmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9hZG9iZS13ZWJwbGF0Zm9ybS9ldmUpLCBidXQgZ29vZClcXG5cXG4tLS1cXG5cXG4jIyBHZXR0aW5nIHlvdXIgSG9vZGllIG9uXFxuXFxuYGBganNcXG52YXIgaG9vZGllID0gbmV3IEhvb2RpZSgpO1xcbmBgYFxcblxcblRoaXMgdHJhbnNwYXJlbnRseSBjcmVhdGVzIGEgY29ubmVjdGlvbiB0byB0aGUgaG9vZGllIGFwaSBydW5uaW5nIG9uIHRoZSBsb2NhbCBtYWNoaW5lIGluIHRoZSBiYWNrZ3JvdW5kLiAgQXMgeW91IHdvdWxkIGV4cGVjdCwgeW91IGNhbiBvdmVycmlkZSB0aGUgZGVmYXVsdCBlbmRwb2ludC5cXG5cXG4tLS1cXG5cXG4jIyBBdXRoZW50aWNhdGlvblxcblxcbmBgYGpzXFxuaG9vZGllLmFjY291bnQuc2lnbkluKCdtZUB0ZXN0LmNvbScsICdzdXBlcnNlY3JldHBhc3MnKTtcXG5gYGBcXG5cXG5GdW5jdGlvbnMgbGlrZSB0aGUgYHNpZ25JbmAgZnVuY3Rpb24gYWJvdmUgcmV0dXJuIGEgcHJvbWlzZS4gIFdoaWxlIG5vdCBteSBwZXJzb25hbCBwcmVmZXJlbmNlLCBpdCBkb2VzIG1ha2UgZm9yIGEgdmVyeSBjbGVhbiBsb29raW5nIEFQSS5cXG5cXG5gYGBqc1xcbmhvb2RpZS5hY2NvdW50LnNpZ25JbignbWVAdGVzdC5jb20nLCAnc2VjcmV0JykudGhlbihmdW5jdGlvbigpIHtcXG5cXHRjb25zb2xlLmxvZyhob29kaWUuYWNjb3VudC51c2VybmFtZSk7XFxufSk7XFxuYGBgXFxuXFxuLS0tXFxuXFxuIyMgR2VuZXJpYyBEb2N1bWVudCBTdG9yZVxcblxcblRoaXMgaXMgdmVyeSBuaWNlbHkgZG9uZSwgYW5kIG1ha2VzIGV4Y2VsbGVudCB1c2Ugb2YgQ291Y2ggYXMgYSBkb2N1bWVudCBzdG9yZS5cXG5cXG5gYGBqc1xcbmhvb2RpZS5zdG9yZS5hZGQoJ2N1c3RvbWVyJywgeyBuYW1lOiAnQm9iJyB9KTtcXG5gYGBcXG5cXG5EYXRhIGlzIGFkZGVkIHRvIGEgX3VzZXIgc3BlY2lmaWMgZGF0YWJhc2VfIGluIHRoZSBjb3VjaCBiYWNrZW5kIGlmIG9ubGluZS4gIEhlY2ssIHlvdSBjYW4gZXZlbiB1c2UgXFxcImZ1dG9uXFxcIiAoQ291Y2hEQidzIGFkbWluIGludGVyZmFjZSkgdG8gbG9vayBhdCB5b3VyIGRhdGE6XFxuXFxuaHR0cDovLzEyNy4wLjAuMTo2MDAxL19hcGkvX3V0aWxzXFxuXFxuLS0tXFxuXFxuIyMgRXhhbXBsZTogQ2FwdHVyZSBHZW8gVHJhY2tzXFxuXFxuU28gdHJhY2tpbmcgYSBnZW8gdHJhY2sgY291bGQgYmUgYXMgc2ltcGxlIGFzOlxcblxcbmBgYGpzXFxubmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24oZnVuY3Rpb24ocG9zKSB7XFxuXFx0aG9vZGllLnN0b3JlLmFkZCgncG9zJywgcG9zLmNvb3Jkcyk7XFxufSk7XFxuYGBgXFxuXFxuV2hpY2ggaXMgcHJldHR5IGF3ZXNvbWUuICBIZXJlJ3Mgd2hhdCB0aGUgZGF0YSBsb29rcyBsaWtlIGluIGNvdWNoOlxcblxcbmBgYGpzb25cXG57XFxuICAgXFxcIl9pZFxcXCI6IFxcXCJwb3MvMzMyMjIzMVxcXCIsXFxuICAgXFxcIl9yZXZcXFwiOiBcXFwiMS0xMjEwMjIxMjFcXFwiLFxcbiAgIFxcXCJzcGVlZFxcXCI6IG51bGwsXFxuICAgXFxcImhlYWRpbmdcXFwiOiBudWxsLFxcbiAgIFxcXCJhbHRpdHVkZUFjY3VyYWN5XFxcIjogbnVsbCxcXG4gICBcXFwiYWNjdXJhY3lcXFwiOiAxODAwMCxcXG4gICBcXFwiYWx0aXR1ZGVcXFwiOiBudWxsLFxcbiAgIFxcXCJsb25naXR1ZGVcXFwiOiAxNTEuMjA2OTksXFxuICAgXFxcImxhdGl0dWRlXFxcIjogLTMzLjg2NzQ4NyxcXG4gICBcXFwiY3JlYXRlZEJ5XFxcIjogXFxcIjIxMjIyMjJcXFwiLFxcbiAgIFxcXCJ1cGRhdGVkQXRcXFwiOiBcXFwiMjAxMy0xMC0yM1QwMzozMTowNy4wNTlaXFxcIixcXG4gICBcXFwiY3JlYXRlZEF0XFxcIjogXFxcIjIwMTMtMTAtMjNUMDM6MzE6MDcuMDU5WlxcXCIsXFxuICAgXFxcInR5cGVcXFwiOiBcXFwicG9zXFxcIlxcbn1cXG5gYGBcXG5cXG4tLS1cXG5cXG4jIyBIb29kaWUgRXZlbnRpbmdcXG5cXG5Ib29kaWUgdXNlcyBhIHB1YnN1YiBldmVudGluZyBtb2RlbCB3aGljaCBhbGxvd3MgZm9yIHdvbmRlcmZ1bCBkZWNvdXBsaW5nIGF0IHRoZSBVSSBsYXllci5cXG5cXG5IYW5kbGluZyBhY2NvdW50IHNpZ24taW46XFxuXFxuYGBganNcXG5ob29kaWUuYWNjb3VudC5vbignc2lnbmluJywgZnVuY3Rpb24oKSB7XFxufSk7XFxuYGBgXFxuXFxuT3Igd2hlbiBhIG5ldyBwb3NpdGlvbiBpcyBhZGRlZDpcXG5cXG5gYGBqc1xcbmhvb2RpZS5zdG9yZS5vbignYWRkOnBvcycsIGZ1bmN0aW9uKHBvcykge1xcblxcdC8vIEkgY291bGQgZG8gbmlmdHkgZ2VvZmVuY2luZyBzdHVmZiBoZXJlIDopXFxufSk7XFxuYGBgXFxuXFxuLS0tXFxuXFxuIyMgT2ZmbGluZSArIERhdGEgU3luY2hyb25pemF0aW9uXFxuXFxuQWxsIGRhdGEgaXMgc3RvcmVkIGluIGBsb2NhbFN0b3JhZ2VgIChjaGVjayB5b3VyIHdlYiBpbnNwZWN0b3IpIGFuZCB3aGVuIG9ubGluZSBhdXRvbWF0aWNhbGx5IHN5bmNocm9uaXplZCB3aXRoIHNlcnZlci4gIElmIHlvdSB3YW50IHRvIGtub3cgd2hlbiBzeW5jaHJvbml6YXRpb24gaXMgaGFwcGVuaW5nLCB0aGVuIHlvdSBjYW4gdXNlIGV2ZW50cy5cXG5cXG5Zb3UgY291bGQgbW9uaXRvciB5b3VyIG1vdmVtZW50cyBvbiBhIGRlc2t0b3AgZGlzcGxheVxcblxcbmBgYGpzXFxuaG9vZGllLnJlbW90ZS5vbignYWRkOnBvcycsIGZ1bmN0aW9uIChwb3MpIHtcXG5cXHQvLyB1cGRhdGUgeW91ciBjdXJyZW50IHBvc2l0aW9uIG9uIHlvdXIgbWFwXFxufSk7XFxuYGBgXFxuLS0tXFxuXFxuIyMgUHJvcyAvIENvbnNcXG5cXG4tICoqUFJPKio6IFRhY2tsaW5nIG9mZmxpbmUgc3luYyBoZWFkIG9uIGlzIGdyZWF0Llxcbi0gKipQUk8qKjogR2V0dGluZyBzdGFydGVkIGZsZXNoaW5nIG91dCB5b3VyIGFwcCBpcyByZWFsbHkgc2ltcGxlLlxcbi0gKipDT04/Kio6IEJ1aWx0IG9uIGpRdWVyeSAoYXQgdGhlIG1vbWVudClcXG4tICoqQ09OPyoqOiBGZWVscyBhIGJpdCBmcmFtZXdvcmt5IGZvciBteSB0YXN0ZXMuXFxuLSBCZSBhd2FyZSB0aGF0IHN0b3JhZ2UgaW1wbGVtZW50YXRpb24gaXMgcHJldHR5IGNsb3NlbHkgdGllZCB0byBbQ291Y2hEQl0oaHR0cDovL2NvdWNoZGIuYXBhY2hlLm9yZykgYXQgdGhlIG1vbWVudC4gIEkgKipsb3ZlKiogQ291Y2ggc28gSSBkb24ndCBjb25zaWRlciB0aGlzIGEgcHJvYmxlbSwgYnV0IHlvdSBzaG91bGQgYmUgYXdhcmUuLi5cXG5cXG4tLS1cXG5cXG4jIyBDbG9zaW5nIFRob3VnaHRzXFxuXFxuVGhleSBoYXZlIGEgZG9nIHdlYXJpbmcgYSBob29kaWUgLSB5b3Ugc2hvdWxkIGF0IGxlYXN0IHRha2UgYSBsb29rLlxcblxcbkl0J3MgZ3JlYXQgdG8gc2VlIHNvbWVvbmUgbWFrZSBhIHNlcmlvdXMgZ28gb2YgdW5sb2NraW5nIHRoZSBwb3RlbnRpYWwgb2YgQ291Y2hEQiArIHNpbmdsZSBwYWdlIGFwcHMuXCIpXG5dKTtcblxuLy8gZGVjay5jc3MoZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvbm9kZV9tb2R1bGVzL2RlY2tlci90aGVtZXMvYmFzaWMuY3NzJykpO1xuLy8gZGVjay5jc3MoZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvbm9kZV9tb2R1bGVzL2RlY2tlci90aGVtZXMvY29kZS9kZWZhdWx0LmNzcycpKTtcbi8vIGRlY2suYWRkKGZzLnJlYWRGaWxlU3luYygnLi9SRUFETUUubWQnKSk7XG4vLyBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRlY2sucmVuZGVyKCkpO1xuIiwidmFyIGNyZWwgPSByZXF1aXJlKCdjcmVsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaHRtbCkge1xuICB2YXIgZWwgPSBjcmVsKCdkaXYnLCB7IGNsYXNzOiAnc2xpZGUnIH0pO1xuXG4gIC8vIHNldCB0aGUgaW5uZXIgaHRtbFxuICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICByZXR1cm4gZWw7XG59OyIsInZhciBjcmVsID0gcmVxdWlyZSgnY3JlbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVybCkge1xuICB2YXIgZWwgPSBjcmVsKCdkaXYnKTtcblxuICAvLyBjcmVhdGUgYW4gaW1hZ2UgdG8gdHJpZ2dlciBsb2FkaW5nXG4gIHZhciBpbWcgPSBjcmVsKCdpbWcnLCB7XG4gICAgc3JjOiB1cmxcbiAgfSk7XG5cbiAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZygnbG9hZGVkOiAnICsgdXJsKTtcbiAgfSk7XG5cbiAgLy8gc2V0IHRoZSBpbWFnZSBhcyB0aGUgYmFja2dyb3VuZCBpbWFnZSBmb3IgdGhlIGVsZW1lbnRcbiAgZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcXCcnICsgdXJsICsgJ1xcJyknO1xuXG4gIHJldHVybiBlbDtcbn07IiwidmFyIF9fZGlybmFtZT1cIi9ub2RlX21vZHVsZXMvc2hhemFtXCI7LyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGdsb2JhbCBkb2N1bWVudDogZmFsc2UgKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbi8vIHZhciBiZWRhenpsZSA9IHJlcXVpcmUoJ2JlZGF6emxlJyk7XG52YXIgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCdmZWF0dXJlL2NzcycpKCd0cmFuc2Zvcm0nKTtcbnZhciBmbGF0dGVuID0gcmVxdWlyZSgnd2hpc2svZmxhdHRlbicpO1xudmFyIGtleWRvd24gPSByZXF1aXJlKCdkZC9uZXh0JykoJ2tleWRvd24nLCBkb2N1bWVudCk7XG52YXIgcHVsbCA9IHJlcXVpcmUoJ3B1bGwtc3RyZWFtJyk7XG52YXIgcmVuZGVyID0gcmVxdWlyZSgnLi9yZW5kZXInKTtcbnZhciBjdXJyZW50O1xudmFyIHNsaWRlO1xuXG4vLyB0cmFuc2Zvcm0gZnVuY3Rpb25zXG52YXIgYWN0aXZhdGUgPSBwdXNoKDApO1xudmFyIHB1c2hSaWdodCA9IHB1c2goc2NyZWVuLndpZHRoKTtcbnZhciBwdXNoTGVmdCA9IHB1c2goLXNjcmVlbi53aWR0aCk7XG52YXIgd29vYmxlID0gXCJhbGVydCgnaGVsbG8nKTtcIjtcblxuLy8gY3JlYXRlIGEga2V5IGRpcmVjdGlvbnMgaGFzaFxudmFyIGtleURpcmVjdGlvbnMgPSB7XG4gIDM3OiAnYmFjaycsXG4gIDM4OiAnYmFjaycsXG4gIDM5OiAnbmV4dCcsXG4gIDQwOiAnbmV4dCdcbn07XG5cbnJlcXVpcmUoJ2luc2VydC1jc3MnKShcImh0bWwsIGJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5zbGlkZSB7XFxuICBwYWRkaW5nOiAxZW07XFxuICBmb250LXNpemU6IDNlbTtcXG4gIHRyYW5zaXRpb246IGFsbCBlYXNlLWluLW91dCAwLjVzO1xcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXG59XFxuXCIpO1xuXG4vKipcbiAgIyBzaGF6YW1cbiAgXG4gIFNoYXphbSBpcyBhIHNpbXBsZSBjb2RlIGRyaXZlbiBwcmVzZW50YXRpb24gc3lzdGVtLlxuXG4gICMjIEV4YW1wbGUgVXNhZ2VcblxuICA8PDwgZXhhbXBsZXMvd2VsY29tZS5qc1xuKiovXG5cbnZhciBzaGF6YW0gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRpdGxlLCBvcHRzLCBkZWNrKSB7XG4gIHZhciBzbGlkZXMgPSBbXTtcbiAgdmFyIHNsaWRlSWR4ID0gMDtcblxuICB2YXIga2V5QWN0aW9ucyA9IHtcbiAgICAzNzogcHJldmlvdXNTbGlkZSxcbiAgICAzODogcHJldmlvdXNTbGlkZSxcbiAgICAzOTogbmV4dFNsaWRlLFxuICAgIDQwOiBuZXh0U2xpZGVcbiAgfTtcblxuICBmdW5jdGlvbiBuZXh0U2xpZGUoKSB7XG4gICAgaWYgKHNsaWRlSWR4IDwgc2xpZGVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHNsaWRlSWR4ICs9IDE7XG5cbiAgICAgIHB1c2hMZWZ0KHNsaWRlc1tzbGlkZUlkeCAtIDFdKTtcbiAgICAgIGFjdGl2YXRlKHNsaWRlc1tzbGlkZUlkeF0pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHByZXZpb3VzU2xpZGUoKSB7XG4gICAgaWYgKHNsaWRlSWR4ID4gMCkge1xuICAgICAgc2xpZGVJZHggLT0gMTtcblxuICAgICAgcHVzaFJpZ2h0KHNsaWRlc1tzbGlkZUlkeCArIDFdKTtcbiAgICAgIGFjdGl2YXRlKHNsaWRlc1tzbGlkZUlkeF0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHdlIGRvbid0IGhhdmUgdHJhbnNmb3JtcyBzcGl0IHRoZSBkdW1teVxuICBpZiAoISB0cmFuc2Zvcm0pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25lZWQgY3NzIHRyYW5zZm9ybXMnKTtcbiAgfVxuXG4gIC8vIGNoZWNrIGZvciBubyBvcHRzXG4gIGlmIChBcnJheS5pc0FycmF5KG9wdHMpKSB7XG4gICAgZGVjayA9IG9wdHM7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgLy8gaW5pdGlhbGlzZSB0aGUgYmFzZXBhdGhcbiAgb3B0cy5iYXNlcGF0aCA9IG9wdHMuYmFzZXBhdGggfHwgJyc7XG5cbiAgY29uc29sZS5sb2coX19kaXJuYW1lKTtcblxuICAvLyBjcmVhdGUgdGhlIHNsaWRlc1xuICBzbGlkZXMgPSBkZWNrLnJlZHVjZShmbGF0dGVuKVxuICAgIC8vIGNyZWF0ZSB0aGUgZWxlbWVudFxuICAgIC5tYXAocmVuZGVyKG9wdHMpKVxuICAgIC8vIGFwcGx5IHJlcXVpcmVkIGJhc2Ugc3R5bGluZ1xuICAgIC5tYXAoc3R5bGUpXG4gICAgLy8gcHVzaCByaWdodFxuICAgIC5tYXAocHVzaFJpZ2h0KVxuICAgIC8vIGFwcGVuZCB0byB0aGUgYm9keVxuICAgIC5tYXAoYXBwZW5kKTtcblxuICAvLyBzZXQgb3V0IHRpdGxlIGJhc2VkIG9uIHRoZSB0aXRsZSBwcm92aWRlZFxuICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuXG4gIC8vIGhhbmRsZSBrZXlzXG4gIHB1bGwoXG4gICAgcHVsbC5Tb3VyY2Uoa2V5ZG93biksXG4gICAgcHVsbC5tYXAoZnVuY3Rpb24oZXZ0KSB7XG4gICAgICByZXR1cm4gZXZ0LmtleUNvZGU7XG4gICAgfSksXG4gICAgcHVsbC5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4ga2V5QWN0aW9uc1trZXldO1xuICAgIH0pLFxuICAgIHB1bGwuZHJhaW4oZnVuY3Rpb24oa2V5KSB7XG4gICAgICBrZXlBY3Rpb25zW2tleV0oKTtcbiAgICB9KVxuICApO1xuXG4gIC8vIGRpc3BsYXkgdGhlIGluaXRpYWwgc2xpZGVcbiAgaWYgKHNsaWRlcy5sZW5ndGggPiAwKSB7XG4gICAgYWN0aXZhdGUoc2xpZGVzW3NsaWRlSWR4XSk7XG4gIH1cbn07XG5cbi8qIHNpbXBsZSBpbmxpbmUgcGx1Z2lucyAqL1xuXG5zaGF6YW0uaW1nID0gcmVxdWlyZSgnLi9pbWcnKTtcbnNoYXphbS5tYXJrZG93biA9IHNoYXphbS5tZCA9IHJlcXVpcmUoJy4vbWFya2Rvd24nKTtcbnNoYXphbS5odG1sID0gcmVxdWlyZSgnLi9odG1sJyk7XG5cbi8qIGludGVybmFsIGZ1bmN0aW9ucyAqL1xuXG5mdW5jdGlvbiBwdXNoKHBvc2l0aW9uKSB7XG4gIHJldHVybiBmdW5jdGlvbihzbGlkZSkge1xuICAgIHRyYW5zZm9ybShzbGlkZSwgJ3RyYW5zbGF0ZVgoJyArIHBvc2l0aW9uICsgJ3B4KSB0cmFuc2xhdGVaKDApJyk7XG4gICAgcmV0dXJuIHNsaWRlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBhcHBlbmQoc2xpZGUpIHtcbiAgLy8gYWRkIHRvIHRoZSBkb2N1bWVudFxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNsaWRlKTtcblxuICAvLyByZXR1cm4gdGhlIHNsaWRlXG4gIHJldHVybiBzbGlkZTtcbn1cblxuZnVuY3Rpb24gc3R5bGUoc2xpZGUpIHtcbiAgc2xpZGUuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICBzbGlkZS5zdHlsZS5oZWlnaHQgPSBzY3JlZW4uaGVpZ2h0ICsgJ3B4JztcbiAgc2xpZGUuc3R5bGUud2lkdGggPSBzY3JlZW4ud2lkdGggKyAncHgnO1xuXG4gIHJldHVybiBzbGlkZTtcbn0iLCJ2YXIgbWFya2VkID0gcmVxdWlyZSgnbWFya2VkJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vaHRtbCcpO1xudmFyIGhsanMgPSByZXF1aXJlKCdoaWdobGlnaHQuanMnKTtcbnZhciBobGpzTGFuZ01hcHBpbmdzID0ge1xuICBqczogJ2phdmFzY3JpcHQnXG59O1xuXG52YXIgcmVTbGlkZUJyZWFrID0gL1xcblxccj9cXC17Mix9L207XG52YXIgcmVMZWFkaW5nQW5kVHJhaWxpbmdTcGFjZXMgPSAvXlxccyooLiopXFxzKiQvbTtcblxuLyogaW5pdGlhbGlzZSBtYXJrZWQgKi9cblxubWFya2VkLnNldE9wdGlvbnMoe1xuICBoaWdobGlnaHQ6IGZ1bmN0aW9uKGNvZGUsIGxhbmcpIHtcbiAgICBsYW5nID0gaGxqc0xhbmdNYXBwaW5nc1tsYW5nXSB8fCBsYW5nO1xuXG4gICAgLy8gaWYgdGhpcyBpcyBhIGtub3duIGhsanMgbGFuZ3VhZ2UgdGhlbiBoaWdobGlnaHRcbiAgICBpZiAoaGxqcy5MQU5HVUFHRVNbbGFuZ10pIHtcbiAgICAgIHJldHVybiBobGpzLmhpZ2hsaWdodChsYW5nLCBjb2RlKS52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gY29kZTtcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgbWFya2Rvd24gPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1kKSB7XG4gIC8vIGlmIHdlIGhhdmUgbXVsdGlwbGUgc2xpZGVzLCBzcGxpdCBhbmQgbWFwXG4gIGlmIChyZVNsaWRlQnJlYWsudGVzdChtZCkpIHtcbiAgICByZXR1cm4gbWQuc3BsaXQocmVTbGlkZUJyZWFrKS5tYXAobWFya2Rvd24pO1xuICB9XG5cbiAgcmV0dXJuIGh0bWwobWFya2VkKG1kLnJlcGxhY2UocmVMZWFkaW5nQW5kVHJhaWxpbmdTcGFjZXMsICckMScpKSk7XG59IiwiLy9Db3B5cmlnaHQgKEMpIDIwMTIgS29yeSBOdW5uXHJcblxyXG4vL1Blcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4vL1RoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuLy9USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuXHJcbi8qXHJcblxyXG4gICAgVGhpcyBjb2RlIGlzIG5vdCBmb3JtYXR0ZWQgZm9yIHJlYWRhYmlsaXR5LCBidXQgcmF0aGVyIHJ1bi1zcGVlZCBhbmQgdG8gYXNzaXN0IGNvbXBpbGVycy5cclxuXHJcbiAgICBIb3dldmVyLCB0aGUgY29kZSdzIGludGVudGlvbiBzaG91bGQgYmUgdHJhbnNwYXJlbnQuXHJcblxyXG4gICAgKioqIElFIFNVUFBPUlQgKioqXHJcblxyXG4gICAgSWYgeW91IHJlcXVpcmUgdGhpcyBsaWJyYXJ5IHRvIHdvcmsgaW4gSUU3LCBhZGQgdGhlIGZvbGxvd2luZyBhZnRlciBkZWNsYXJpbmcgY3JlbC5cclxuXHJcbiAgICB2YXIgdGVzdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICAgIHRlc3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XHJcblxyXG4gICAgdGVzdERpdi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2EnKTtcclxuICAgIHRlc3REaXZbJ2NsYXNzTmFtZSddICE9PSAnYScgPyBjcmVsLmF0dHJNYXBbJ2NsYXNzJ10gPSAnY2xhc3NOYW1lJzp1bmRlZmluZWQ7XHJcbiAgICB0ZXN0RGl2LnNldEF0dHJpYnV0ZSgnbmFtZScsJ2EnKTtcclxuICAgIHRlc3REaXZbJ25hbWUnXSAhPT0gJ2EnID8gY3JlbC5hdHRyTWFwWyduYW1lJ10gPSBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZSl7XHJcbiAgICAgICAgZWxlbWVudC5pZCA9IHZhbHVlO1xyXG4gICAgfTp1bmRlZmluZWQ7XHJcblxyXG5cclxuICAgIHRlc3RMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdhJyk7XHJcbiAgICB0ZXN0TGFiZWxbJ2h0bWxGb3InXSAhPT0gJ2EnID8gY3JlbC5hdHRyTWFwWydmb3InXSA9ICdodG1sRm9yJzp1bmRlZmluZWQ7XHJcblxyXG5cclxuXHJcbiovXHJcblxyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByb290LmNyZWwgPSBmYWN0b3J5KCk7XHJcbiAgICB9XHJcbn0odGhpcywgZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gYmFzZWQgb24gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zODQyODYvamF2YXNjcmlwdC1pc2RvbS1ob3ctZG8teW91LWNoZWNrLWlmLWEtamF2YXNjcmlwdC1vYmplY3QtaXMtYS1kb20tb2JqZWN0XHJcbiAgICB2YXIgaXNOb2RlID0gdHlwZW9mIE5vZGUgPT09ICdvYmplY3QnXHJcbiAgICAgICAgPyBmdW5jdGlvbiAob2JqZWN0KSB7IHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBOb2RlOyB9XHJcbiAgICAgICAgOiBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmplY3RcclxuICAgICAgICAgICAgICAgICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICAgICAgICAgICAgICAmJiB0eXBlb2Ygb2JqZWN0Lm5vZGVUeXBlID09PSAnbnVtYmVyJ1xyXG4gICAgICAgICAgICAgICAgJiYgdHlwZW9mIG9iamVjdC5ub2RlTmFtZSA9PT0gJ3N0cmluZyc7XHJcbiAgICAgICAgfTtcclxuICAgIHZhciBpc0FycmF5ID0gZnVuY3Rpb24oYSl7IHJldHVybiBhIGluc3RhbmNlb2YgQXJyYXk7IH07XHJcbiAgICB2YXIgYXBwZW5kQ2hpbGQgPSBmdW5jdGlvbihlbGVtZW50LCBjaGlsZCkge1xyXG4gICAgICBpZighaXNOb2RlKGNoaWxkKSl7XHJcbiAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNyZWwoKXtcclxuICAgICAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXHJcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHMsIC8vTm90ZTogYXNzaWduZWQgdG8gYSB2YXJpYWJsZSB0byBhc3Npc3QgY29tcGlsZXJzLiBTYXZlcyBhYm91dCA0MCBieXRlcyBpbiBjbG9zdXJlIGNvbXBpbGVyLiBIYXMgbmVnbGlnYWJsZSBlZmZlY3Qgb24gcGVyZm9ybWFuY2UuXHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSBhcmdzWzBdLFxyXG4gICAgICAgICAgICBjaGlsZCxcclxuICAgICAgICAgICAgc2V0dGluZ3MgPSBhcmdzWzFdLFxyXG4gICAgICAgICAgICBjaGlsZEluZGV4ID0gMixcclxuICAgICAgICAgICAgYXJndW1lbnRzTGVuZ3RoID0gYXJncy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZU1hcCA9IGNyZWwuYXR0ck1hcDtcclxuXHJcbiAgICAgICAgZWxlbWVudCA9IGlzTm9kZShlbGVtZW50KSA/IGVsZW1lbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIC8vIHNob3J0Y3V0XHJcbiAgICAgICAgaWYoYXJndW1lbnRzTGVuZ3RoID09PSAxKXtcclxuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0eXBlb2Ygc2V0dGluZ3MgIT09ICdvYmplY3QnIHx8IGlzTm9kZShzZXR0aW5ncykgfHwgaXNBcnJheShzZXR0aW5ncykpIHtcclxuICAgICAgICAgICAgLS1jaGlsZEluZGV4O1xyXG4gICAgICAgICAgICBzZXR0aW5ncyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzaG9ydGN1dCBpZiB0aGVyZSBpcyBvbmx5IG9uZSBjaGlsZCB0aGF0IGlzIGEgc3RyaW5nXHJcbiAgICAgICAgaWYoKGFyZ3VtZW50c0xlbmd0aCAtIGNoaWxkSW5kZXgpID09PSAxICYmIHR5cGVvZiBhcmdzW2NoaWxkSW5kZXhdID09PSAnc3RyaW5nJyAmJiBlbGVtZW50LnRleHRDb250ZW50ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICBlbGVtZW50LnRleHRDb250ZW50ID0gYXJnc1tjaGlsZEluZGV4XTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZm9yKDsgY2hpbGRJbmRleCA8IGFyZ3VtZW50c0xlbmd0aDsgKytjaGlsZEluZGV4KXtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gYXJnc1tjaGlsZEluZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihjaGlsZCA9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpIDwgY2hpbGQubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcHBlbmRDaGlsZChlbGVtZW50LCBjaGlsZFtpXSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkKGVsZW1lbnQsIGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgICBpZighYXR0cmlidXRlTWFwW2tleV0pe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBzZXR0aW5nc1trZXldKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IGNyZWwuYXR0ck1hcFtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGF0dHIgPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dHIoZWxlbWVudCwgc2V0dGluZ3Nba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyLCBzZXR0aW5nc1trZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXNlZCBmb3IgbWFwcGluZyBvbmUga2luZCBvZiBhdHRyaWJ1dGUgdG8gdGhlIHN1cHBvcnRlZCB2ZXJzaW9uIG9mIHRoYXQgaW4gYmFkIGJyb3dzZXJzLlxyXG4gICAgLy8gU3RyaW5nIHJlZmVyZW5jZWQgc28gdGhhdCBjb21waWxlcnMgbWFpbnRhaW4gdGhlIHByb3BlcnR5IG5hbWUuXHJcbiAgICBjcmVsWydhdHRyTWFwJ10gPSB7fTtcclxuXHJcbiAgICAvLyBTdHJpbmcgcmVmZXJlbmNlZCBzbyB0aGF0IGNvbXBpbGVycyBtYWludGFpbiB0aGUgcHJvcGVydHkgbmFtZS5cclxuICAgIGNyZWxbXCJpc05vZGVcIl0gPSBpc05vZGU7XHJcblxyXG4gICAgcmV0dXJuIGNyZWw7XHJcbn0pKTtcclxuIiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gICMjIyBuZXh0XG5cbiAgYGBgXG4gIGYobmFtZSwgZWwpID0+IGZuXG4gIGBgYFxuXG4gIFRoZSBgbmV4dGAgZnVuY3Rpb24gaXMgdXNlZCB0byBwdWxsIGV2ZW50IGRhdGEgZnJvbSBgZWxgIGZvciB0aGUgZXZlbnRcbiAgbmFtZWQgYG5hbWVgLiAgVGhpcyBjYW4gYmUgdXNlZnVsIHdoZW4gY29tYmluZWQgd2l0aCBhXG4gIFtwdWxsLXN0cmVhbV0oaHR0cHM6Ly9naXRodWIuY29tL2RvbWluaWN0YXJyL3B1bGwtc3RyZWFtKSB0byBjYXB0dXJlXG4gIGEgc3RyZWFtIG9mIGV2ZW50cyBmcm9tIGEgRE9NIGVsZW1lbnRzLlxuXG4gIDw8PCBleGFtcGxlcy9uZXh0LmpzXG4qKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSwgZWwpIHtcbiAgdmFyIGJ1ZmZlciA9IFtdO1xuICB2YXIgcXVldWVkID0gW107XG5cbiAgZnVuY3Rpb24gaGFuZGxlRXZlbnQoZXZ0KSB7XG4gICAgcXVldWVkLmxlbmd0aCA/IHF1ZXVlZC5zaGlmdCgpKG51bGwsIGV2dCkgOiBidWZmZXJbYnVmZmVyLmxlbmd0aF0gPSBldnQ7XG4gIH1cblxuICAvLyBhZGQgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBvYmplY3RcbiAgZWwuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBoYW5kbGVFdmVudCk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGVuZCwgY2IpIHtcbiAgICAvLyBoYW5kbGUgdGhlIG5vbiBwdWxsLXN0cmVhbSBjYXNlIG9mIGEgc2luZ2xlIGFyZ3VtZW50XG4gICAgaWYgKHR5cGVvZiBlbmQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2IgPSBlbmQ7XG4gICAgICBlbmQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBpZiB3ZSBhcmUgZW5kaW5nIHRoZSBzdHJlYW0sIHRoZW4gcmVtb3ZlIHRoZSBsaXN0ZW5lclxuICAgIGlmIChlbmQpIHtcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgaGFuZGxlRXZlbnQpO1xuICAgICAgcmV0dXJuIGNiID8gY2IoZW5kKSA6IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gY2IobnVsbCwgYnVmZmVyLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIC8vIG90aGVyd2lzZSwgc2F2ZSB0aGUgY2JcbiAgICBxdWV1ZWRbcXVldWVkLmxlbmd0aF0gPSBjYjtcbiAgfTtcbn07XG4iLCIvKiBqc2hpbnQgbm9kZTogdHJ1ZSAqL1xuLyogZ2xvYmFsIHdpbmRvdzogZmFsc2UgKi9cbi8qIGdsb2JhbCBkb2N1bWVudDogZmFsc2UgKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gbGlzdCBwcmVmaXhlcyBhbmQgY2FzZSB0cmFuc2Zvcm1zXG4vLyAocmV2ZXJzZSBvcmRlciBhcyBhIGRlY3JlbWVudGluZyBmb3IgbG9vcCBpcyB1c2VkKVxudmFyIHByZWZpeGVzID0gW1xuICAnbXMnLFxuICAnbXMnLCAvLyBpbnRlbnRpb25hbDogMm5kIGVudHJ5IGZvciBtcyBhcyB3ZSB3aWxsIGFsc28gdHJ5IFBhc2NhbCBjYXNlIGZvciBNU1xuICAnTycsXG4gICdNb3onLFxuICAnV2Via2l0JyxcbiAgJydcbl07XG5cbnZhciBjYXNlVHJhbnNmb3JtcyA9IFtcbiAgdG9DYW1lbENhc2UsXG4gIG51bGwsXG4gIG51bGwsXG4gIHRvQ2FtZWxDYXNlLFxuICBudWxsLFxuICB0b0NhbWVsQ2FzZVxuXTtcblxudmFyIHByb3BzID0ge307XG52YXIgc3R5bGU7XG5cbi8qKlxuIyMgY3NzKHByb3ApXG5cblRlc3QgZm9yIHRoZSBwcmVzY2VuY2Ugb2YgdGhlIHNwZWNpZmllZCBDU1MgcHJvcGVydHkgKGluIGFsbCBpdCdzIFxucG9zc2libGUgYnJvd3NlciBwcmVmaXhlZCB2YXJpYW50cylcbioqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihwcm9wKSB7XG4gIHZhciBpaTtcbiAgdmFyIHByb3BOYW1lO1xuICB2YXIgcGFzY2FsQ2FzZU5hbWU7XG5cbiAgc3R5bGUgPSBzdHlsZSB8fCBkb2N1bWVudC5ib2R5LnN0eWxlO1xuXG4gIC8vIGlmIHdlIGFscmVhZHkgaGF2ZSBhIHZhbHVlIGZvciB0aGUgdGFyZ2V0IHByb3BlcnR5LCByZXR1cm5cbiAgaWYgKHByb3BzW3Byb3BdIHx8IHN0eWxlW3Byb3BdKSB7XG4gICAgcmV0dXJuIHByb3BzW3Byb3BdO1xuICB9XG5cbiAgLy8gY29udmVydCBhIGRhc2ggZGVsaW1pdGVkIHByb3BlcnR5bmFtZSAoZS5nLiBib3gtc2hhZG93KSBpbnRvIFxuICAvLyBwYXNjYWwgY2FzZWQgbmFtZSAoZS5nLiBCb3hTaGFkb3cpXG4gIHBhc2NhbENhc2VOYW1lID0gcHJvcC5zcGxpdCgnLScpLnJlZHVjZShmdW5jdGlvbihtZW1vLCB2YWwpIHtcbiAgICByZXR1cm4gbWVtbyArIHZhbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHZhbC5zbGljZSgxKTtcbiAgfSwgJycpO1xuXG4gIC8vIGNoZWNrIGZvciB0aGUgcHJvcGVydHlcbiAgZm9yIChpaSA9IHByZWZpeGVzLmxlbmd0aDsgaWktLTsgKSB7XG4gICAgcHJvcE5hbWUgPSBwcmVmaXhlc1tpaV0gKyAoY2FzZVRyYW5zZm9ybXNbaWldID9cbiAgICAgICAgICAgICAgICAgIGNhc2VUcmFuc2Zvcm1zW2lpXShwYXNjYWxDYXNlTmFtZSkgOlxuICAgICAgICAgICAgICAgICAgcGFzY2FsQ2FzZU5hbWUpO1xuXG4gICAgaWYgKHR5cGVvZiBzdHlsZVtwcm9wTmFtZV0gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHByb3BzW3Byb3BdID0gY3JlYXRlR2V0dGVyU2V0dGVyKHByb3BOYW1lKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBcbiAgcmV0dXJuIHByb3BzW3Byb3BdO1xufTtcblxuLyogaW50ZXJuYWwgaGVscGVyIGZ1bmN0aW9ucyAqL1xuXG5mdW5jdGlvbiBjcmVhdGVHZXR0ZXJTZXR0ZXIocHJvcE5hbWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgLy8gaWYgd2UgaGF2ZSBhIHZhbHVlIHVwZGF0ZSBcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICBlbGVtZW50LnN0eWxlW3Byb3BOYW1lXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KVtwcm9wTmFtZV07XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKGlucHV0KSB7XG4gIHJldHVybiBpbnB1dC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGlucHV0LnNsaWNlKDEpO1xufSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcyl7XG4gIHZhciBJREVOVF9SRV9SVSA9ICdbYS16QS1a0LAt0Y/QkC3Qr11bYS16QS1aMC05X9CwLdGP0JAt0K9dKic7XG4gIHZhciBPbmVTX0tFWVdPUkRTID0gJ9Cy0L7Qt9Cy0YDQsNGCINC00LDRgtCwINC00LvRjyDQtdGB0LvQuCDQuCDQuNC70Lgg0LjQvdCw0YfQtSDQuNC90LDRh9C10LXRgdC70Lgg0LjRgdC60LvRjtGH0LXQvdC40LUg0LrQvtC90LXRhtC10YHQu9C4ICcgK1xuICAgICfQutC+0L3QtdGG0L/QvtC/0YvRgtC60Lgg0LrQvtC90LXRhtC/0YDQvtGG0LXQtNGD0YDRiyDQutC+0L3QtdGG0YTRg9C90LrRhtC40Lgg0LrQvtC90LXRhtGG0LjQutC70LAg0LrQvtC90YHRgtCw0L3RgtCwINC90LUg0L/QtdGA0LXQudGC0Lgg0L/QtdGA0LXQvCAnICtcbiAgICAn0L/QtdGA0LXRh9C40YHQu9C10L3QuNC1INC/0L4g0L/QvtC60LAg0L/QvtC/0YvRgtC60LAg0L/RgNC10YDQstCw0YLRjCDQv9GA0L7QtNC+0LvQttC40YLRjCDQv9GA0L7RhtC10LTRg9GA0LAg0YHRgtGA0L7QutCwINGC0L7Qs9C00LAg0YTRgSDRhNGD0L3QutGG0LjRjyDRhtC40LrQuyAnICtcbiAgICAn0YfQuNGB0LvQviDRjdC60YHQv9C+0YDRgic7XG4gIHZhciBPbmVTX0JVSUxUX0lOID0gJ2Fuc2l0b29lbSBvZW10b2Fuc2kg0LLQstC10YHRgtC40LLQuNC00YHRg9Cx0LrQvtC90YLQviDQstCy0LXRgdGC0LjQtNCw0YLRgyDQstCy0LXRgdGC0LjQt9C90LDRh9C10L3QuNC1ICcgK1xuICAgICfQstCy0LXRgdGC0LjQv9C10YDQtdGH0LjRgdC70LXQvdC40LUg0LLQstC10YHRgtC40L/QtdGA0LjQvtC0INCy0LLQtdGB0YLQuNC/0LvQsNC90YHRh9C10YLQvtCyINCy0LLQtdGB0YLQuNGB0YLRgNC+0LrRgyDQstCy0LXRgdGC0LjRh9C40YHQu9C+INCy0L7Qv9GA0L7RgSAnICtcbiAgICAn0LLQvtGB0YHRgtCw0L3QvtCy0LjRgtGM0LfQvdCw0YfQtdC90LjQtSDQstGA0LXQsyDQstGL0LHRgNCw0L3QvdGL0LnQv9C70LDQvdGB0YfQtdGC0L7QsiDQstGL0LfQstCw0YLRjNC40YHQutC70Y7Rh9C10L3QuNC1INC00LDRgtCw0LPQvtC0INC00LDRgtCw0LzQtdGB0Y/RhiAnICtcbiAgICAn0LTQsNGC0LDRh9C40YHQu9C+INC00L7QsdCw0LLQuNGC0YzQvNC10YHRj9GGINC30LDQstC10YDRiNC40YLRjNGA0LDQsdC+0YLRg9GB0LjRgdGC0LXQvNGLINC30LDQs9C+0LvQvtCy0L7QutGB0LjRgdGC0LXQvNGLINC30LDQv9C40YHRjNC20YPRgNC90LDQu9Cw0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCAnICtcbiAgICAn0LfQsNC/0YPRgdGC0LjRgtGM0L/RgNC40LvQvtC20LXQvdC40LUg0LfQsNGE0LjQutGB0LjRgNC+0LLQsNGC0YzRgtGA0LDQvdC30LDQutGG0LjRjiDQt9C90LDRh9C10L3QuNC10LLRgdGC0YDQvtC60YMg0LfQvdCw0YfQtdC90LjQtdCy0YHRgtGA0L7QutGD0LLQvdGD0YLRgCAnICtcbiAgICAn0LfQvdCw0YfQtdC90LjQtdCy0YTQsNC50Lsg0LfQvdCw0YfQtdC90LjQtdC40LfRgdGC0YDQvtC60Lgg0LfQvdCw0YfQtdC90LjQtdC40LfRgdGC0YDQvtC60LjQstC90YPRgtGAINC30L3QsNGH0LXQvdC40LXQuNC30YTQsNC50LvQsCDQuNC80Y/QutC+0LzQv9GM0Y7RgtC10YDQsCAnICtcbiAgICAn0LjQvNGP0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC60LDRgtCw0LvQvtCz0LLRgNC10LzQtdC90L3Ri9GF0YTQsNC50LvQvtCyINC60LDRgtCw0LvQvtCz0LjQsSDQutCw0YLQsNC70L7Qs9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQutCw0YLQsNC70L7Qs9C/0YDQvtCz0YDQsNC80LzRiyAnICtcbiAgICAn0LrQvtC00YHQuNC80LIg0LrQvtC80LDQvdC00LDRgdC40YHRgtC10LzRiyDQutC+0L3Qs9C+0LTQsCDQutC+0L3QtdGG0L/QtdGA0LjQvtC00LDQsdC4INC60L7QvdC10YbRgNCw0YHRgdGH0LjRgtCw0L3QvdC+0LPQvtC/0LXRgNC40L7QtNCw0LHQuCAnICtcbiAgICAn0LrQvtC90LXRhtGB0YLQsNC90LTQsNGA0YLQvdC+0LPQvtC40L3RgtC10YDQstCw0LvQsCDQutC+0L3QutCy0LDRgNGC0LDQu9CwINC60L7QvdC80LXRgdGP0YbQsCDQutC+0L3QvdC10LTQtdC70Lgg0LvQtdCyINC70L7QsyDQu9C+0LMxMCDQvNCw0LrRgSAnICtcbiAgICAn0LzQsNC60YHQuNC80LDQu9GM0L3QvtC10LrQvtC70LjRh9C10YHRgtCy0L7RgdGD0LHQutC+0L3RgtC+INC80LjQvSDQvNC+0L3QvtC/0L7Qu9GM0L3Ri9C50YDQtdC20LjQvCDQvdCw0LfQstCw0L3QuNC10LjQvdGC0LXRgNGE0LXQudGB0LAg0L3QsNC30LLQsNC90LjQtdC90LDQsdC+0YDQsNC/0YDQsNCyICcgK1xuICAgICfQvdCw0LfQvdCw0YfQuNGC0YzQstC40LQg0L3QsNC30L3QsNGH0LjRgtGM0YHRh9C10YIg0L3QsNC50YLQuCDQvdCw0LnRgtC40L/QvtC80LXRh9C10L3QvdGL0LXQvdCw0YPQtNCw0LvQtdC90LjQtSDQvdCw0LnRgtC40YHRgdGL0LvQutC4INC90LDRh9Cw0LvQvtC/0LXRgNC40L7QtNCw0LHQuCAnICtcbiAgICAn0L3QsNGH0LDQu9C+0YHRgtCw0L3QtNCw0YDRgtC90L7Qs9C+0LjQvdGC0LXRgNCy0LDQu9CwINC90LDRh9Cw0YLRjNGC0YDQsNC90LfQsNC60YbQuNGOINC90LDRh9Cz0L7QtNCwINC90LDRh9C60LLQsNGA0YLQsNC70LAg0L3QsNGH0LzQtdGB0Y/RhtCwINC90LDRh9C90LXQtNC10LvQuCAnICtcbiAgICAn0L3QvtC80LXRgNC00L3Rj9Cz0L7QtNCwINC90L7QvNC10YDQtNC90Y/QvdC10LTQtdC70Lgg0L3QvtC80LXRgNC90LXQtNC10LvQuNCz0L7QtNCwINC90YDQtdCzINC+0LHRgNCw0LHQvtGC0LrQsNC+0LbQuNC00LDQvdC40Y8g0L7QutGAINC+0L/QuNGB0LDQvdC40LXQvtGI0LjQsdC60LggJyArXG4gICAgJ9C+0YHQvdC+0LLQvdC+0LnQttGD0YDQvdCw0LvRgNCw0YHRh9C10YLQvtCyINC+0YHQvdC+0LLQvdC+0LnQv9C70LDQvdGB0YfQtdGC0L7QsiDQvtGB0L3QvtCy0L3QvtC50Y/Qt9GL0Log0L7RgtC60YDRi9GC0YzRhNC+0YDQvNGDINC+0YLQutGA0YvRgtGM0YTQvtGA0LzRg9C80L7QtNCw0LvRjNC90L4gJyArXG4gICAgJ9C+0YLQvNC10L3QuNGC0YzRgtGA0LDQvdC30LDQutGG0LjRjiDQvtGH0LjRgdGC0LjRgtGM0L7QutC90L7RgdC+0L7QsdGJ0LXQvdC40Lkg0L/QtdGA0LjQvtC00YHRgtGAINC/0L7Qu9C90L7QtdC40LzRj9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQv9C+0LvRg9GH0LjRgtGM0LLRgNC10LzRj9GC0LAgJyArXG4gICAgJ9C/0L7Qu9GD0YfQuNGC0YzQtNCw0YLRg9GC0LAg0L/QvtC70YPRh9C40YLRjNC00L7QutGD0LzQtdC90YLRgtCwINC/0L7Qu9GD0YfQuNGC0YzQt9C90LDRh9C10L3QuNGP0L7RgtCx0L7RgNCwINC/0L7Qu9GD0YfQuNGC0YzQv9C+0LfQuNGG0LjRjtGC0LAgJyArXG4gICAgJ9C/0L7Qu9GD0YfQuNGC0YzQv9GD0YHRgtC+0LXQt9C90LDRh9C10L3QuNC1INC/0L7Qu9GD0YfQuNGC0YzRgtCwINC/0YDQsNCyINC/0YDQsNCy0L7QtNC+0YHRgtGD0L/QsCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1INC/0YDQtdGE0LjQutGB0LDQstGC0L7QvdGD0LzQtdGA0LDRhtC40LggJyArXG4gICAgJ9C/0YPRgdGC0LDRj9GB0YLRgNC+0LrQsCDQv9GD0YHRgtC+0LXQt9C90LDRh9C10L3QuNC1INGA0LDQsdC+0YfQsNGP0LTQsNGC0YLRjNC/0YPRgdGC0L7QtdC30L3QsNGH0LXQvdC40LUg0YDQsNCx0L7Rh9Cw0Y/QtNCw0YLQsCDRgNCw0LfQtNC10LvQuNGC0LXQu9GM0YHRgtGA0LDQvdC40YYgJyArXG4gICAgJ9GA0LDQt9C00LXQu9C40YLQtdC70YzRgdGC0YDQvtC6INGA0LDQt9C8INGA0LDQt9C+0LHRgNCw0YLRjNC/0L7Qt9C40YbQuNGO0LTQvtC60YPQvNC10L3RgtCwINGA0LDRgdGB0YfQuNGC0LDRgtGM0YDQtdCz0LjRgdGC0YDRi9C90LAgJyArXG4gICAgJ9GA0LDRgdGB0YfQuNGC0LDRgtGM0YDQtdCz0LjRgdGC0YDRi9C/0L4g0YHQuNCz0L3QsNC7INGB0LjQvNCyINGB0LjQvNCy0L7Qu9GC0LDQsdGD0LvRj9GG0LjQuCDRgdC+0LfQtNCw0YLRjNC+0LHRitC10LrRgiDRgdC+0LrRgNC7INGB0L7QutGA0LvQvyDRgdC+0LrRgNC/ICcgK1xuICAgICfRgdC+0L7QsdGJ0LjRgtGMINGB0L7RgdGC0L7Rj9C90LjQtSDRgdC+0YXRgNCw0L3QuNGC0YzQt9C90LDRh9C10L3QuNC1INGB0YDQtdC0INGB0YLQsNGC0YPRgdCy0L7Qt9Cy0YDQsNGC0LAg0YHRgtGA0LTQu9C40L3QsCDRgdGC0YDQt9Cw0LzQtdC90LjRgtGMICcgK1xuICAgICfRgdGC0YDQutC+0LvQuNGH0LXRgdGC0LLQvtGB0YLRgNC+0Log0YHRgtGA0L/QvtC70YPRh9C40YLRjNGB0YLRgNC+0LrRgyAg0YHRgtGA0YfQuNGB0LvQvtCy0YXQvtC20LTQtdC90LjQuSDRgdGE0L7RgNC80LjRgNC+0LLQsNGC0YzQv9C+0LfQuNGG0LjRjtC00L7QutGD0LzQtdC90YLQsCAnICtcbiAgICAn0YHRh9C10YLQv9C+0LrQvtC00YMg0YLQtdC60YPRidCw0Y/QtNCw0YLQsCDRgtC10LrRg9GJ0LXQtdCy0YDQtdC80Y8g0YLQuNC/0LfQvdCw0YfQtdC90LjRjyDRgtC40L/Qt9C90LDRh9C10L3QuNGP0YHRgtGAINGD0LTQsNC70LjRgtGM0L7QsdGK0LXQutGC0YsgJyArXG4gICAgJ9GD0YHRgtCw0L3QvtCy0LjRgtGM0YLQsNC90LAg0YPRgdGC0LDQvdC+0LLQuNGC0YzRgtCw0L/QviDRhNC40LrRgdGI0LDQsdC70L7QvSDRhNC+0YDQvNCw0YIg0YbQtdC7INGI0LDQsdC70L7QvSc7XG4gIHZhciBEUVVPVEUgPSAge2NsYXNzTmFtZTogJ2RxdW90ZScsICBiZWdpbjogJ1wiXCInfTtcbiAgdmFyIFNUUl9TVEFSVCA9IHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCJ8JCcsXG4gICAgICBjb250YWluczogW0RRVU9URV0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9O1xuICB2YXIgU1RSX0NPTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcXFx8JywgZW5kOiAnXCJ8JCcsXG4gICAgY29udGFpbnM6IFtEUVVPVEVdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGxleGVtczogSURFTlRfUkVfUlUsXG4gICAga2V5d29yZHM6IHtrZXl3b3JkOiBPbmVTX0tFWVdPUkRTLCBidWlsdF9pbjogT25lU19CVUlMVF9JTn0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICBTVFJfU1RBUlQsIFNUUl9DT05ULFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnKNC/0YDQvtGG0LXQtNGD0YDQsHzRhNGD0L3QutGG0LjRjyknLCBlbmQ6ICckJyxcbiAgICAgICAgbGV4ZW1zOiBJREVOVF9SRV9SVSxcbiAgICAgICAga2V5d29yZHM6ICfQv9GA0L7RhtC10LTRg9GA0LAg0YTRg9C90LrRhtC40Y8nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBJREVOVF9SRV9SVX0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGFpbCcsXG4gICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICAgICAgbGV4ZW1zOiBJREVOVF9SRV9SVSxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogJ9C30L3QsNGHJyxcbiAgICAgICAgICAgICAgICBjb250YWluczogW1NUUl9TVEFSVCwgU1RSX0NPTlRdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdleHBvcnQnLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAn0Y3QutGB0L/QvtGA0YInLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsZXhlbXM6IElERU5UX1JFX1JVLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiAn0Y3QutGB0L/QvtGA0YInLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLCBiZWdpbjogJyMnLCBlbmQ6ICckJ30sXG4gICAgICB7Y2xhc3NOYW1lOiAnZGF0ZScsIGJlZ2luOiAnXFwnXFxcXGR7Mn1cXFxcLlxcXFxkezJ9XFxcXC4oXFxcXGR7Mn18XFxcXGR7NH0pXFwnJ31cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgSURFTlRfUkUgPSAnW2EtekEtWl8kXVthLXpBLVowLTlfJF0qJztcbiAgdmFyIElERU5UX0ZVTkNfUkVUVVJOX1RZUEVfUkUgPSAnKFsqXXxbYS16QS1aXyRdW2EtekEtWjAtOV8kXSopJztcblxuICB2YXIgQVMzX1JFU1RfQVJHX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAncmVzdF9hcmcnLFxuICAgIGJlZ2luOiAnWy5dezN9JywgZW5kOiBJREVOVF9SRSxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIHZhciBUSVRMRV9NT0RFID0ge2NsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IElERU5UX1JFfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiAnYXMgYnJlYWsgY2FzZSBjYXRjaCBjbGFzcyBjb25zdCBjb250aW51ZSBkZWZhdWx0IGRlbGV0ZSBkbyBkeW5hbWljIGVhY2ggJyArXG4gICAgICAgICdlbHNlIGV4dGVuZHMgZmluYWwgZmluYWxseSBmb3IgZnVuY3Rpb24gZ2V0IGlmIGltcGxlbWVudHMgaW1wb3J0IGluIGluY2x1ZGUgJyArXG4gICAgICAgICdpbnN0YW5jZW9mIGludGVyZmFjZSBpbnRlcm5hbCBpcyBuYW1lc3BhY2UgbmF0aXZlIG5ldyBvdmVycmlkZSBwYWNrYWdlIHByaXZhdGUgJyArXG4gICAgICAgICdwcm90ZWN0ZWQgcHVibGljIHJldHVybiBzZXQgc3RhdGljIHN1cGVyIHN3aXRjaCB0aGlzIHRocm93IHRyeSB0eXBlb2YgdXNlIHZhciB2b2lkICcgK1xuICAgICAgICAnd2hpbGUgd2l0aCcsXG4gICAgICBsaXRlcmFsOiAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGFja2FnZScsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ3BhY2thZ2UnLFxuICAgICAgICBjb250YWluczogW1RJVExFX01PREVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgVElUTEVfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICc7JyxcbiAgICAgICAga2V5d29yZHM6ICdpbXBvcnQgaW5jbHVkZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnW3s7XScsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFMnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFRJVExFX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgQVMzX1JFU1RfQVJHX01PREVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICAgICAgYmVnaW46ICc6JyxcbiAgICAgICAgICAgIGVuZDogSURFTlRfRlVOQ19SRVRVUk5fVFlQRV9SRSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgTlVNQkVSID0ge2NsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnW1xcXFwkJV1cXFxcZCsnfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiAnYWNjZXB0ZmlsdGVyIGFjY2VwdG11dGV4IGFjY2VwdHBhdGhpbmZvIGFjY2Vzc2ZpbGVuYW1lIGFjdGlvbiBhZGRhbHQgJyArXG4gICAgICAgICdhZGRhbHRieWVuY29kaW5nIGFkZGFsdGJ5dHlwZSBhZGRjaGFyc2V0IGFkZGRlZmF1bHRjaGFyc2V0IGFkZGRlc2NyaXB0aW9uICcgK1xuICAgICAgICAnYWRkZW5jb2RpbmcgYWRkaGFuZGxlciBhZGRpY29uIGFkZGljb25ieWVuY29kaW5nIGFkZGljb25ieXR5cGUgYWRkaW5wdXRmaWx0ZXIgJyArXG4gICAgICAgICdhZGRsYW5ndWFnZSBhZGRtb2R1bGVpbmZvIGFkZG91dHB1dGZpbHRlciBhZGRvdXRwdXRmaWx0ZXJieXR5cGUgYWRkdHlwZSBhbGlhcyAnICtcbiAgICAgICAgJ2FsaWFzbWF0Y2ggYWxsb3cgYWxsb3djb25uZWN0IGFsbG93ZW5jb2RlZHNsYXNoZXMgYWxsb3dvdmVycmlkZSBhbm9ueW1vdXMgJyArXG4gICAgICAgICdhbm9ueW1vdXNfbG9nZW1haWwgYW5vbnltb3VzX211c3RnaXZlZW1haWwgYW5vbnltb3VzX25vdXNlcmlkIGFub255bW91c192ZXJpZnllbWFpbCAnICtcbiAgICAgICAgJ2F1dGhiYXNpY2F1dGhvcml0YXRpdmUgYXV0aGJhc2ljcHJvdmlkZXIgYXV0aGRiZHVzZXJwd3F1ZXJ5IGF1dGhkYmR1c2VycmVhbG1xdWVyeSAnICtcbiAgICAgICAgJ2F1dGhkYm1ncm91cGZpbGUgYXV0aGRibXR5cGUgYXV0aGRibXVzZXJmaWxlIGF1dGhkZWZhdWx0YXV0aG9yaXRhdGl2ZSAnICtcbiAgICAgICAgJ2F1dGhkaWdlc3RhbGdvcml0aG0gYXV0aGRpZ2VzdGRvbWFpbiBhdXRoZGlnZXN0bmNjaGVjayBhdXRoZGlnZXN0bm9uY2Vmb3JtYXQgJyArXG4gICAgICAgICdhdXRoZGlnZXN0bm9uY2VsaWZldGltZSBhdXRoZGlnZXN0cHJvdmlkZXIgYXV0aGRpZ2VzdHFvcCBhdXRoZGlnZXN0c2htZW1zaXplICcgK1xuICAgICAgICAnYXV0aGdyb3VwZmlsZSBhdXRobGRhcGJpbmRkbiBhdXRobGRhcGJpbmRwYXNzd29yZCBhdXRobGRhcGNoYXJzZXRjb25maWcgJyArXG4gICAgICAgICdhdXRobGRhcGNvbXBhcmVkbm9uc2VydmVyIGF1dGhsZGFwZGVyZWZlcmVuY2VhbGlhc2VzIGF1dGhsZGFwZ3JvdXBhdHRyaWJ1dGUgJyArXG4gICAgICAgICdhdXRobGRhcGdyb3VwYXR0cmlidXRlaXNkbiBhdXRobGRhcHJlbW90ZXVzZXJhdHRyaWJ1dGUgYXV0aGxkYXByZW1vdGV1c2VyaXNkbiAnICtcbiAgICAgICAgJ2F1dGhsZGFwdXJsIGF1dGhuYW1lIGF1dGhucHJvdmlkZXJhbGlhcyBhdXRodHlwZSBhdXRodXNlcmZpbGUgYXV0aHpkYm1hdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYXV0aHpkYm10eXBlIGF1dGh6ZGVmYXVsdGF1dGhvcml0YXRpdmUgYXV0aHpncm91cGZpbGVhdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYXV0aHpsZGFwYXV0aG9yaXRhdGl2ZSBhdXRoem93bmVyYXV0aG9yaXRhdGl2ZSBhdXRoenVzZXJhdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYmFsYW5jZXJtZW1iZXIgYnJvd3Nlcm1hdGNoIGJyb3dzZXJtYXRjaG5vY2FzZSBidWZmZXJlZGxvZ3MgY2FjaGVkZWZhdWx0ZXhwaXJlICcgK1xuICAgICAgICAnY2FjaGVkaXJsZW5ndGggY2FjaGVkaXJsZXZlbHMgY2FjaGVkaXNhYmxlIGNhY2hlZW5hYmxlIGNhY2hlZmlsZSAnICtcbiAgICAgICAgJ2NhY2hlaWdub3JlY2FjaGVjb250cm9sIGNhY2hlaWdub3JlaGVhZGVycyBjYWNoZWlnbm9yZW5vbGFzdG1vZCAnICtcbiAgICAgICAgJ2NhY2hlaWdub3JlcXVlcnlzdHJpbmcgY2FjaGVsYXN0bW9kaWZpZWRmYWN0b3IgY2FjaGVtYXhleHBpcmUgY2FjaGVtYXhmaWxlc2l6ZSAnICtcbiAgICAgICAgJ2NhY2hlbWluZmlsZXNpemUgY2FjaGVuZWdvdGlhdGVkZG9jcyBjYWNoZXJvb3QgY2FjaGVzdG9yZW5vc3RvcmUgY2FjaGVzdG9yZXByaXZhdGUgJyArXG4gICAgICAgICdjZ2ltYXBleHRlbnNpb24gY2hhcnNldGRlZmF1bHQgY2hhcnNldG9wdGlvbnMgY2hhcnNldHNvdXJjZWVuYyBjaGVja2Nhc2Vvbmx5ICcgK1xuICAgICAgICAnY2hlY2tzcGVsbGluZyBjaHJvb3RkaXIgY29udGVudGRpZ2VzdCBjb29raWVkb21haW4gY29va2llZXhwaXJlcyBjb29raWVsb2cgJyArXG4gICAgICAgICdjb29raWVuYW1lIGNvb2tpZXN0eWxlIGNvb2tpZXRyYWNraW5nIGNvcmVkdW1wZGlyZWN0b3J5IGN1c3RvbWxvZyBkYXYgJyArXG4gICAgICAgICdkYXZkZXB0aGluZmluaXR5IGRhdmdlbmVyaWNsb2NrZGIgZGF2bG9ja2RiIGRhdm1pbnRpbWVvdXQgZGJkZXhwdGltZSBkYmRrZWVwICcgK1xuICAgICAgICAnZGJkbWF4IGRiZG1pbiBkYmRwYXJhbXMgZGJkcGVyc2lzdCBkYmRwcmVwYXJlc3FsIGRiZHJpdmVyIGRlZmF1bHRpY29uICcgK1xuICAgICAgICAnZGVmYXVsdGxhbmd1YWdlIGRlZmF1bHR0eXBlIGRlZmxhdGVidWZmZXJzaXplIGRlZmxhdGVjb21wcmVzc2lvbmxldmVsICcgK1xuICAgICAgICAnZGVmbGF0ZWZpbHRlcm5vdGUgZGVmbGF0ZW1lbWxldmVsIGRlZmxhdGV3aW5kb3dzaXplIGRlbnkgZGlyZWN0b3J5aW5kZXggJyArXG4gICAgICAgICdkaXJlY3RvcnltYXRjaCBkaXJlY3RvcnlzbGFzaCBkb2N1bWVudHJvb3QgZHVtcGlvaW5wdXQgZHVtcGlvbG9nbGV2ZWwgZHVtcGlvb3V0cHV0ICcgK1xuICAgICAgICAnZW5hYmxlZXhjZXB0aW9uaG9vayBlbmFibGVtbWFwIGVuYWJsZXNlbmRmaWxlIGVycm9yZG9jdW1lbnQgZXJyb3Jsb2cgZXhhbXBsZSAnICtcbiAgICAgICAgJ2V4cGlyZXNhY3RpdmUgZXhwaXJlc2J5dHlwZSBleHBpcmVzZGVmYXVsdCBleHRlbmRlZHN0YXR1cyBleHRmaWx0ZXJkZWZpbmUgJyArXG4gICAgICAgICdleHRmaWx0ZXJvcHRpb25zIGZpbGVldGFnIGZpbHRlcmNoYWluIGZpbHRlcmRlY2xhcmUgZmlsdGVycHJvdG9jb2wgZmlsdGVycHJvdmlkZXIgJyArXG4gICAgICAgICdmaWx0ZXJ0cmFjZSBmb3JjZWxhbmd1YWdlcHJpb3JpdHkgZm9yY2V0eXBlIGZvcmVuc2ljbG9nIGdyYWNlZnVsc2h1dGRvd250aW1lb3V0ICcgK1xuICAgICAgICAnZ3JvdXAgaGVhZGVyIGhlYWRlcm5hbWUgaG9zdG5hbWVsb29rdXBzIGlkZW50aXR5Y2hlY2sgaWRlbnRpdHljaGVja3RpbWVvdXQgJyArXG4gICAgICAgICdpbWFwYmFzZSBpbWFwZGVmYXVsdCBpbWFwbWVudSBpbmNsdWRlIGluZGV4aGVhZGluc2VydCBpbmRleGlnbm9yZSBpbmRleG9wdGlvbnMgJyArXG4gICAgICAgICdpbmRleG9yZGVyZGVmYXVsdCBpbmRleHN0eWxlc2hlZXQgaXNhcGlhcHBlbmRsb2d0b2Vycm9ycyBpc2FwaWFwcGVuZGxvZ3RvcXVlcnkgJyArXG4gICAgICAgICdpc2FwaWNhY2hlZmlsZSBpc2FwaWZha2Vhc3luYyBpc2FwaWxvZ25vdHN1cHBvcnRlZCBpc2FwaXJlYWRhaGVhZGJ1ZmZlciBrZWVwYWxpdmUgJyArXG4gICAgICAgICdrZWVwYWxpdmV0aW1lb3V0IGxhbmd1YWdlcHJpb3JpdHkgbGRhcGNhY2hlZW50cmllcyBsZGFwY2FjaGV0dGwgJyArXG4gICAgICAgICdsZGFwY29ubmVjdGlvbnRpbWVvdXQgbGRhcG9wY2FjaGVlbnRyaWVzIGxkYXBvcGNhY2hldHRsIGxkYXBzaGFyZWRjYWNoZWZpbGUgJyArXG4gICAgICAgICdsZGFwc2hhcmVkY2FjaGVzaXplIGxkYXB0cnVzdGVkY2xpZW50Y2VydCBsZGFwdHJ1c3RlZGdsb2JhbGNlcnQgbGRhcHRydXN0ZWRtb2RlICcgK1xuICAgICAgICAnbGRhcHZlcmlmeXNlcnZlcmNlcnQgbGltaXRpbnRlcm5hbHJlY3Vyc2lvbiBsaW1pdHJlcXVlc3Rib2R5IGxpbWl0cmVxdWVzdGZpZWxkcyAnICtcbiAgICAgICAgJ2xpbWl0cmVxdWVzdGZpZWxkc2l6ZSBsaW1pdHJlcXVlc3RsaW5lIGxpbWl0eG1scmVxdWVzdGJvZHkgbGlzdGVuIGxpc3RlbmJhY2tsb2cgJyArXG4gICAgICAgICdsb2FkZmlsZSBsb2FkbW9kdWxlIGxvY2tmaWxlIGxvZ2Zvcm1hdCBsb2dsZXZlbCBtYXhjbGllbnRzIG1heGtlZXBhbGl2ZXJlcXVlc3RzICcgK1xuICAgICAgICAnbWF4bWVtZnJlZSBtYXhyZXF1ZXN0c3BlcmNoaWxkIG1heHJlcXVlc3RzcGVydGhyZWFkIG1heHNwYXJlc2VydmVycyBtYXhzcGFyZXRocmVhZHMgJyArXG4gICAgICAgICdtYXh0aHJlYWRzIG1jYWNoZW1heG9iamVjdGNvdW50IG1jYWNoZW1heG9iamVjdHNpemUgbWNhY2hlbWF4c3RyZWFtaW5nYnVmZmVyICcgK1xuICAgICAgICAnbWNhY2hlbWlub2JqZWN0c2l6ZSBtY2FjaGVyZW1vdmFsYWxnb3JpdGhtIG1jYWNoZXNpemUgbWV0YWRpciBtZXRhZmlsZXMgbWV0YXN1ZmZpeCAnICtcbiAgICAgICAgJ21pbWVtYWdpY2ZpbGUgbWluc3BhcmVzZXJ2ZXJzIG1pbnNwYXJldGhyZWFkcyBtbWFwZmlsZSBtb2RfZ3ppcF9vbiAnICtcbiAgICAgICAgJ21vZF9nemlwX2FkZF9oZWFkZXJfY291bnQgbW9kX2d6aXBfa2VlcF93b3JrZmlsZXMgbW9kX2d6aXBfZGVjaHVuayAnICtcbiAgICAgICAgJ21vZF9nemlwX21pbl9odHRwIG1vZF9nemlwX21pbmltdW1fZmlsZV9zaXplIG1vZF9nemlwX21heGltdW1fZmlsZV9zaXplICcgK1xuICAgICAgICAnbW9kX2d6aXBfbWF4aW11bV9pbm1lbV9zaXplIG1vZF9nemlwX3RlbXBfZGlyIG1vZF9nemlwX2l0ZW1faW5jbHVkZSAnICtcbiAgICAgICAgJ21vZF9nemlwX2l0ZW1fZXhjbHVkZSBtb2RfZ3ppcF9jb21tYW5kX3ZlcnNpb24gbW9kX2d6aXBfY2FuX25lZ290aWF0ZSAnICtcbiAgICAgICAgJ21vZF9nemlwX2hhbmRsZV9tZXRob2RzIG1vZF9nemlwX3N0YXRpY19zdWZmaXggbW9kX2d6aXBfc2VuZF92YXJ5ICcgK1xuICAgICAgICAnbW9kX2d6aXBfdXBkYXRlX3N0YXRpYyBtb2RtaW1ldXNlcGF0aGluZm8gbXVsdGl2aWV3c21hdGNoIG5hbWV2aXJ0dWFsaG9zdCBub3Byb3h5ICcgK1xuICAgICAgICAnbndzc2x0cnVzdGVkY2VydHMgbndzc2x1cGdyYWRlYWJsZSBvcHRpb25zIG9yZGVyIHBhc3NlbnYgcGlkZmlsZSBwcm90b2NvbGVjaG8gJyArXG4gICAgICAgICdwcm94eWJhZGhlYWRlciBwcm94eWJsb2NrIHByb3h5ZG9tYWluIHByb3h5ZXJyb3JvdmVycmlkZSBwcm94eWZ0cGRpcmNoYXJzZXQgJyArXG4gICAgICAgICdwcm94eWlvYnVmZmVyc2l6ZSBwcm94eW1heGZvcndhcmRzIHByb3h5cGFzcyBwcm94eXBhc3NpbnRlcnBvbGF0ZWVudiAnICtcbiAgICAgICAgJ3Byb3h5cGFzc21hdGNoIHByb3h5cGFzc3JldmVyc2UgcHJveHlwYXNzcmV2ZXJzZWNvb2tpZWRvbWFpbiAnICtcbiAgICAgICAgJ3Byb3h5cGFzc3JldmVyc2Vjb29raWVwYXRoIHByb3h5cHJlc2VydmVob3N0IHByb3h5cmVjZWl2ZWJ1ZmZlcnNpemUgcHJveHlyZW1vdGUgJyArXG4gICAgICAgICdwcm94eXJlbW90ZW1hdGNoIHByb3h5cmVxdWVzdHMgcHJveHlzZXQgcHJveHlzdGF0dXMgcHJveHl0aW1lb3V0IHByb3h5dmlhICcgK1xuICAgICAgICAncmVhZG1lbmFtZSByZWNlaXZlYnVmZmVyc2l6ZSByZWRpcmVjdCByZWRpcmVjdG1hdGNoIHJlZGlyZWN0cGVybWFuZW50ICcgK1xuICAgICAgICAncmVkaXJlY3R0ZW1wIHJlbW92ZWNoYXJzZXQgcmVtb3ZlZW5jb2RpbmcgcmVtb3ZlaGFuZGxlciByZW1vdmVpbnB1dGZpbHRlciAnICtcbiAgICAgICAgJ3JlbW92ZWxhbmd1YWdlIHJlbW92ZW91dHB1dGZpbHRlciByZW1vdmV0eXBlIHJlcXVlc3RoZWFkZXIgcmVxdWlyZSByZXdyaXRlYmFzZSAnICtcbiAgICAgICAgJ3Jld3JpdGVjb25kIHJld3JpdGVlbmdpbmUgcmV3cml0ZWxvY2sgcmV3cml0ZWxvZyByZXdyaXRlbG9nbGV2ZWwgcmV3cml0ZW1hcCAnICtcbiAgICAgICAgJ3Jld3JpdGVvcHRpb25zIHJld3JpdGVydWxlIHJsaW1pdGNwdSBybGltaXRtZW0gcmxpbWl0bnByb2Mgc2F0aXNmeSBzY29yZWJvYXJkZmlsZSAnICtcbiAgICAgICAgJ3NjcmlwdCBzY3JpcHRhbGlhcyBzY3JpcHRhbGlhc21hdGNoIHNjcmlwdGludGVycHJldGVyc291cmNlIHNjcmlwdGxvZyAnICtcbiAgICAgICAgJ3NjcmlwdGxvZ2J1ZmZlciBzY3JpcHRsb2dsZW5ndGggc2NyaXB0c29jayBzZWN1cmVsaXN0ZW4gc2VlcmVxdWVzdHRhaWwgJyArXG4gICAgICAgICdzZW5kYnVmZmVyc2l6ZSBzZXJ2ZXJhZG1pbiBzZXJ2ZXJhbGlhcyBzZXJ2ZXJsaW1pdCBzZXJ2ZXJuYW1lIHNlcnZlcnBhdGggJyArXG4gICAgICAgICdzZXJ2ZXJyb290IHNlcnZlcnNpZ25hdHVyZSBzZXJ2ZXJ0b2tlbnMgc2V0ZW52IHNldGVudmlmIHNldGVudmlmbm9jYXNlIHNldGhhbmRsZXIgJyArXG4gICAgICAgICdzZXRpbnB1dGZpbHRlciBzZXRvdXRwdXRmaWx0ZXIgc3NpZW5hYmxlYWNjZXNzIHNzaWVuZHRhZyBzc2llcnJvcm1zZyBzc2lzdGFydHRhZyAnICtcbiAgICAgICAgJ3NzaXRpbWVmb3JtYXQgc3NpdW5kZWZpbmVkZWNobyBzc2xjYWNlcnRpZmljYXRlZmlsZSBzc2xjYWNlcnRpZmljYXRlcGF0aCAnICtcbiAgICAgICAgJ3NzbGNhZG5yZXF1ZXN0ZmlsZSBzc2xjYWRucmVxdWVzdHBhdGggc3NsY2FyZXZvY2F0aW9uZmlsZSBzc2xjYXJldm9jYXRpb25wYXRoICcgK1xuICAgICAgICAnc3NsY2VydGlmaWNhdGVjaGFpbmZpbGUgc3NsY2VydGlmaWNhdGVmaWxlIHNzbGNlcnRpZmljYXRla2V5ZmlsZSBzc2xjaXBoZXJzdWl0ZSAnICtcbiAgICAgICAgJ3NzbGNyeXB0b2RldmljZSBzc2xlbmdpbmUgc3NsaG9ub3JjaXBlcm9yZGVyIHNzbG11dGV4IHNzbG9wdGlvbnMgJyArXG4gICAgICAgICdzc2xwYXNzcGhyYXNlZGlhbG9nIHNzbHByb3RvY29sIHNzbHByb3h5Y2FjZXJ0aWZpY2F0ZWZpbGUgJyArXG4gICAgICAgICdzc2xwcm94eWNhY2VydGlmaWNhdGVwYXRoIHNzbHByb3h5Y2FyZXZvY2F0aW9uZmlsZSBzc2xwcm94eWNhcmV2b2NhdGlvbnBhdGggJyArXG4gICAgICAgICdzc2xwcm94eWNpcGhlcnN1aXRlIHNzbHByb3h5ZW5naW5lIHNzbHByb3h5bWFjaGluZWNlcnRpZmljYXRlZmlsZSAnICtcbiAgICAgICAgJ3NzbHByb3h5bWFjaGluZWNlcnRpZmljYXRlcGF0aCBzc2xwcm94eXByb3RvY29sIHNzbHByb3h5dmVyaWZ5ICcgK1xuICAgICAgICAnc3NscHJveHl2ZXJpZnlkZXB0aCBzc2xyYW5kb21zZWVkIHNzbHJlcXVpcmUgc3NscmVxdWlyZXNzbCBzc2xzZXNzaW9uY2FjaGUgJyArXG4gICAgICAgICdzc2xzZXNzaW9uY2FjaGV0aW1lb3V0IHNzbHVzZXJuYW1lIHNzbHZlcmlmeWNsaWVudCBzc2x2ZXJpZnlkZXB0aCBzdGFydHNlcnZlcnMgJyArXG4gICAgICAgICdzdGFydHRocmVhZHMgc3Vic3RpdHV0ZSBzdWV4ZWN1c2VyZ3JvdXAgdGhyZWFkbGltaXQgdGhyZWFkc3BlcmNoaWxkICcgK1xuICAgICAgICAndGhyZWFkc3RhY2tzaXplIHRpbWVvdXQgdHJhY2VlbmFibGUgdHJhbnNmZXJsb2cgdHlwZXNjb25maWcgdW5zZXRlbnYgJyArXG4gICAgICAgICd1c2VjYW5vbmljYWxuYW1lIHVzZWNhbm9uaWNhbHBoeXNpY2FscG9ydCB1c2VyIHVzZXJkaXIgdmlydHVhbGRvY3VtZW50cm9vdCAnICtcbiAgICAgICAgJ3ZpcnR1YWxkb2N1bWVudHJvb3RpcCB2aXJ0dWFsc2NyaXB0YWxpYXMgdmlydHVhbHNjcmlwdGFsaWFzaXAgJyArXG4gICAgICAgICd3aW4zMmRpc2FibGVhY2NlcHRleCB4Yml0aGFjaycsXG4gICAgICBsaXRlcmFsOiAnb24gb2ZmJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NxYnJhY2tldCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXHNcXFxcWycsIGVuZDogJ1xcXFxdJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NicmFja2V0JyxcbiAgICAgICAgYmVnaW46ICdbXFxcXCQlXVxcXFx7JywgZW5kOiAnXFxcXH0nLFxuICAgICAgICBjb250YWluczogWydzZWxmJywgTlVNQkVSXVxuICAgICAgfSxcbiAgICAgIE5VTUJFUixcbiAgICAgIHtjbGFzc05hbWU6ICd0YWcnLCBiZWdpbjogJzwvPycsIGVuZDogJz4nfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgU1RSSU5HID0gaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtpbGxlZ2FsOiAnJ30pO1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHZhciBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCBobGpzLkNfTlVNQkVSX01PREUsIFNUUklOR11cbiAgfTtcbiAgdmFyIENPTU1FTlRTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICctLScsIGVuZDogJyQnLFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJ1xcXFwoXFxcXConLCBlbmQ6ICdcXFxcKlxcXFwpJyxcbiAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCB7YmVnaW46ICctLScsIGVuZDogJyQnfV0gLy9hbGxvdyBuZXN0aW5nXG4gICAgfSxcbiAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2Fib3V0IGFib3ZlIGFmdGVyIGFnYWluc3QgYW5kIGFyb3VuZCBhcyBhdCBiYWNrIGJlZm9yZSBiZWdpbm5pbmcgJyArXG4gICAgICAgICdiZWhpbmQgYmVsb3cgYmVuZWF0aCBiZXNpZGUgYmV0d2VlbiBidXQgYnkgY29uc2lkZXJpbmcgJyArXG4gICAgICAgICdjb250YWluIGNvbnRhaW5zIGNvbnRpbnVlIGNvcHkgZGl2IGRvZXMgZWlnaHRoIGVsc2UgZW5kIGVxdWFsICcgK1xuICAgICAgICAnZXF1YWxzIGVycm9yIGV2ZXJ5IGV4aXQgZmlmdGggZmlyc3QgZm9yIGZvdXJ0aCBmcm9tIGZyb250ICcgK1xuICAgICAgICAnZ2V0IGdpdmVuIGdsb2JhbCBpZiBpZ25vcmluZyBpbiBpbnRvIGlzIGl0IGl0cyBsYXN0IGxvY2FsIG1lICcgK1xuICAgICAgICAnbWlkZGxlIG1vZCBteSBuaW50aCBub3Qgb2Ygb24gb250byBvciBvdmVyIHByb3AgcHJvcGVydHkgcHV0IHJlZiAnICtcbiAgICAgICAgJ3JlZmVyZW5jZSByZXBlYXQgcmV0dXJuaW5nIHNjcmlwdCBzZWNvbmQgc2V0IHNldmVudGggc2luY2UgJyArXG4gICAgICAgICdzaXh0aCBzb21lIHRlbGwgdGVudGggdGhhdCB0aGUgdGhlbiB0aGlyZCB0aHJvdWdoIHRocnUgJyArXG4gICAgICAgICd0aW1lb3V0IHRpbWVzIHRvIHRyYW5zYWN0aW9uIHRyeSB1bnRpbCB3aGVyZSB3aGlsZSB3aG9zZSB3aXRoICcgK1xuICAgICAgICAnd2l0aG91dCcsXG4gICAgICBjb25zdGFudDpcbiAgICAgICAgJ0FwcGxlU2NyaXB0IGZhbHNlIGxpbmVmZWVkIHJldHVybiBwaSBxdW90ZSByZXN1bHQgc3BhY2UgdGFiIHRydWUnLFxuICAgICAgdHlwZTpcbiAgICAgICAgJ2FsaWFzIGFwcGxpY2F0aW9uIGJvb2xlYW4gY2xhc3MgY29uc3RhbnQgZGF0ZSBmaWxlIGludGVnZXIgbGlzdCAnICtcbiAgICAgICAgJ251bWJlciByZWFsIHJlY29yZCBzdHJpbmcgdGV4dCcsXG4gICAgICBjb21tYW5kOlxuICAgICAgICAnYWN0aXZhdGUgYmVlcCBjb3VudCBkZWxheSBsYXVuY2ggbG9nIG9mZnNldCByZWFkIHJvdW5kICcgK1xuICAgICAgICAncnVuIHNheSBzdW1tYXJpemUgd3JpdGUnLFxuICAgICAgcHJvcGVydHk6XG4gICAgICAgICdjaGFyYWN0ZXIgY2hhcmFjdGVycyBjb250ZW50cyBkYXkgZnJvbnRtb3N0IGlkIGl0ZW0gbGVuZ3RoICcgK1xuICAgICAgICAnbW9udGggbmFtZSBwYXJhZ3JhcGggcGFyYWdyYXBocyByZXN0IHJldmVyc2UgcnVubmluZyB0aW1lIHZlcnNpb24gJyArXG4gICAgICAgICd3ZWVrZGF5IHdvcmQgd29yZHMgeWVhcidcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBTVFJJTkcsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiUE9TSVggZmlsZVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWFuZCcsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYihjbGlwYm9hcmQgaW5mb3x0aGUgY2xpcGJvYXJkfGluZm8gZm9yfGxpc3QgKGRpc2tzfGZvbGRlcil8JyArXG4gICAgICAgICAgJ21vdW50IHZvbHVtZXxwYXRoIHRvfChjbG9zZXxvcGVuIGZvcikgYWNjZXNzfChnZXR8c2V0KSBlb2Z8JyArXG4gICAgICAgICAgJ2N1cnJlbnQgZGF0ZXxkbyBzaGVsbCBzY3JpcHR8Z2V0IHZvbHVtZSBzZXR0aW5nc3xyYW5kb20gbnVtYmVyfCcgK1xuICAgICAgICAgICdzZXQgdm9sdW1lfHN5c3RlbSBhdHRyaWJ1dGV8c3lzdGVtIGluZm98dGltZSB0byBHTVR8JyArXG4gICAgICAgICAgJyhsb2FkfHJ1bnxzdG9yZSkgc2NyaXB0fHNjcmlwdGluZyBjb21wb25lbnRzfCcgK1xuICAgICAgICAgICdBU0NJSSAoY2hhcmFjdGVyfG51bWJlcil8bG9jYWxpemVkIHN0cmluZ3wnICtcbiAgICAgICAgICAnY2hvb3NlIChhcHBsaWNhdGlvbnxjb2xvcnxmaWxlfGZpbGUgbmFtZXwnICtcbiAgICAgICAgICAnZm9sZGVyfGZyb20gbGlzdHxyZW1vdGUgYXBwbGljYXRpb258VVJMKXwnICtcbiAgICAgICAgICAnZGlzcGxheSAoYWxlcnR8ZGlhbG9nKSlcXFxcYnxeXFxcXHMqcmV0dXJuXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYih0ZXh0IGl0ZW0gZGVsaW1pdGVyc3xjdXJyZW50IGFwcGxpY2F0aW9ufG1pc3NpbmcgdmFsdWUpXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgYmVnaW46XG4gICAgICAgICAgJ1xcXFxiKGFwYXJ0IGZyb218YXNpZGUgZnJvbXxpbnN0ZWFkIG9mfG91dCBvZnxncmVhdGVyIHRoYW58JyArXG4gICAgICAgICAgXCJpc24ndHwoZG9lc24ndHxkb2VzIG5vdCkgKGVxdWFsfGNvbWUgYmVmb3JlfGNvbWUgYWZ0ZXJ8Y29udGFpbil8XCIgK1xuICAgICAgICAgICcoZ3JlYXRlcnxsZXNzKSB0aGFuKCBvciBlcXVhbCk/fChzdGFydHM/fGVuZHN8YmVnaW5zPykgd2l0aHwnICtcbiAgICAgICAgICAnY29udGFpbmVkIGJ5fGNvbWVzIChiZWZvcmV8YWZ0ZXIpfGEgKHJlZnxyZWZlcmVuY2UpKVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJvcGVydHknLFxuICAgICAgICBiZWdpbjpcbiAgICAgICAgICAnXFxcXGIoUE9TSVggcGF0aHwoZGF0ZXx0aW1lKSBzdHJpbmd8cXVvdGVkIGZvcm0pXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbl9zdGFydCcsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgIGtleXdvcmRzOiAnb24nLFxuICAgICAgICBpbGxlZ2FsOiAnWyR7PTtcXFxcbl0nLFxuICAgICAgICBjb250YWluczogW1RJVExFLCBQQVJBTVNdXG4gICAgICB9XG4gICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgIC8qIG1uZW1vbmljICovXG4gICAgICAgICdhZGMgYWRkIGFkaXcgYW5kIGFuZGkgYXNyIGJjbHIgYmxkIGJyYmMgYnJicyBicmNjIGJyY3MgYnJlYWsgYnJlcSBicmdlIGJyaGMgYnJocyAnICtcbiAgICAgICAgJ2JyaWQgYnJpZSBicmxvIGJybHQgYnJtaSBicm5lIGJycGwgYnJzaCBicnRjIGJydHMgYnJ2YyBicnZzIGJzZXQgYnN0IGNhbGwgY2JpIGNiciAnICtcbiAgICAgICAgJ2NsYyBjbGggY2xpIGNsbiBjbHIgY2xzIGNsdCBjbHYgY2x6IGNvbSBjcCBjcGMgY3BpIGNwc2UgZGVjIGVpY2FsbCBlaWptcCBlbHBtIGVvciAnICtcbiAgICAgICAgJ2ZtdWwgZm11bHMgZm11bHN1IGljYWxsIGlqbXAgaW4gaW5jIGptcCBsZCBsZGQgbGRpIGxkcyBscG0gbHNsIGxzciBtb3YgbW92dyBtdWwgJyArXG4gICAgICAgICdtdWxzIG11bHN1IG5lZyBub3Agb3Igb3JpIG91dCBwb3AgcHVzaCByY2FsbCByZXQgcmV0aSByam1wIHJvbCByb3Igc2JjIHNiciBzYnJjIHNicnMgJyArXG4gICAgICAgICdzZWMgc2VoIHNiaSBzYmNpIHNiaWMgc2JpcyBzYml3IHNlaSBzZW4gc2VyIHNlcyBzZXQgc2V2IHNleiBzbGVlcCBzcG0gc3Qgc3RkIHN0cyBzdWIgJyArXG4gICAgICAgICdzdWJpIHN3YXAgdHN0IHdkcicsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgLyogZ2VuZXJhbCBwdXJwb3NlIHJlZ2lzdGVycyAqL1xuICAgICAgICAncjAgcjEgcjIgcjMgcjQgcjUgcjYgcjcgcjggcjkgcjEwIHIxMSByMTIgcjEzIHIxNCByMTUgcjE2IHIxNyByMTggcjE5IHIyMCByMjEgcjIyICcgK1xuICAgICAgICAncjIzIHIyNCByMjUgcjI2IHIyNyByMjggcjI5IHIzMCByMzEgeHwwIHhoIHhsIHl8MCB5aCB5bCB6fDAgemggemwgJyArXG4gICAgICAgIC8qIElPIFJlZ2lzdGVycyAoQVRNZWdhMTI4KSAqL1xuICAgICAgICAndWNzcjFjIHVkcjEgdWNzcjFhIHVjc3IxYiB1YnJyMWwgdWJycjFoIHVjc3IwYyB1YnJyMGggdGNjcjNjIHRjY3IzYSB0Y2NyM2IgdGNudDNoICcgK1xuICAgICAgICAndGNudDNsIG9jcjNhaCBvY3IzYWwgb2NyM2JoIG9jcjNibCBvY3IzY2ggb2NyM2NsIGljcjNoIGljcjNsIGV0aW1zayBldGlmciB0Y2NyMWMgJyArXG4gICAgICAgICdvY3IxY2ggb2NyMWNsIHR3Y3IgdHdkciB0d2FyIHR3c3IgdHdiciBvc2NjYWwgeG1jcmEgeG1jcmIgZWljcmEgc3BtY3NyIHNwbWNyIHBvcnRnICcgK1xuICAgICAgICAnZGRyZyBwaW5nIHBvcnRmIGRkcmYgc3JlZyBzcGggc3BsIHhkaXYgcmFtcHogZWljcmIgZWltc2sgZ2ltc2sgZ2ljciBlaWZyIGdpZnIgdGltc2sgJyArXG4gICAgICAgICd0aWZyIG1jdWNyIG1jdWNzciB0Y2NyMCB0Y250MCBvY3IwIGFzc3IgdGNjcjFhIHRjY3IxYiB0Y250MWggdGNudDFsIG9jcjFhaCBvY3IxYWwgJyArXG4gICAgICAgICdvY3IxYmggb2NyMWJsIGljcjFoIGljcjFsIHRjY3IyIHRjbnQyIG9jcjIgb2NkciB3ZHRjciBzZmlvciBlZWFyaCBlZWFybCBlZWRyIGVlY3IgJyArXG4gICAgICAgICdwb3J0YSBkZHJhIHBpbmEgcG9ydGIgZGRyYiBwaW5iIHBvcnRjIGRkcmMgcGluYyBwb3J0ZCBkZHJkIHBpbmQgc3BkciBzcHNyIHNwY3IgdWRyMCAnICtcbiAgICAgICAgJ3Vjc3IwYSB1Y3NyMGIgdWJycjBsIGFjc3IgYWRtdXggYWRjc3IgYWRjaCBhZGNsIHBvcnRlIGRkcmUgcGluZSBwaW5mJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7Y2xhc3NOYW1lOiAnY29tbWVudCcsIGJlZ2luOiAnOycsICBlbmQ6ICckJ30sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsIC8vIDB4Li4uLCBkZWNpbWFsLCBmbG9hdFxuICAgICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsIC8vIDBiLi4uXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoXFxcXCRbYS16QS1aMC05XSt8MG9bMC03XSspJyAvLyAkLi4uLCAwby4uLlxuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnW15cXFxcXFxcXF1cXCcnLFxuICAgICAgICBpbGxlZ2FsOiAnW15cXFxcXFxcXF1bXlxcJ10nXG4gICAgICB9LFxuICAgICAge2NsYXNzTmFtZTogJ2xhYmVsJywgIGJlZ2luOiAnXltBLVphLXowLTlfLiRdKzonfSxcbiAgICAgIHtjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLCBiZWdpbjogJyMnLCBlbmQ6ICckJ30sXG4gICAgICB7ICAvLyDQtNC40YDQtdC60YLQuNCy0YsgwqsuaW5jbHVkZcK7IMKrLm1hY3Jvwrsg0Lgg0YIu0LQuXG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXC5bYS16QS1aXSsnXG4gICAgICB9LFxuICAgICAgeyAgLy8g0L/QvtC00YHRgtCw0L3QvtCy0LrQsCDQsiDCqy5tYWNyb8K7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xvY2FsdmFycycsXG4gICAgICAgIGJlZ2luOiAnQFswLTldKydcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiAnZmFsc2UgaW50IGFic3RyYWN0IHByaXZhdGUgY2hhciBpbnRlcmZhY2UgYm9vbGVhbiBzdGF0aWMgbnVsbCBpZiBmb3IgdHJ1ZSAnICtcbiAgICAgICd3aGlsZSBsb25nIHRocm93IGZpbmFsbHkgcHJvdGVjdGVkIGV4dGVuZHMgZmluYWwgaW1wbGVtZW50cyByZXR1cm4gdm9pZCBlbnVtIGVsc2UgJyArXG4gICAgICAnYnJlYWsgbmV3IGNhdGNoIGJ5dGUgc3VwZXIgY2xhc3MgY2FzZSBzaG9ydCBkZWZhdWx0IGRvdWJsZSBwdWJsaWMgdHJ5IHRoaXMgc3dpdGNoICcgK1xuICAgICAgJ2NvbnRpbnVlIHJldmVyc2UgZmlyc3RmYXN0IGZpcnN0b25seSBmb3J1cGRhdGUgbm9mZXRjaCBzdW0gYXZnIG1pbm9mIG1heG9mIGNvdW50ICcgK1xuICAgICAgJ29yZGVyIGdyb3VwIGJ5IGFzYyBkZXNjIGluZGV4IGhpbnQgbGlrZSBkaXNwYWx5IGVkaXQgY2xpZW50IHNlcnZlciB0dHNiZWdpbiAnICtcbiAgICAgICd0dHNjb21taXQgc3RyIHJlYWwgZGF0ZSBjb250YWluZXIgYW55dHlwZSBjb21tb24gZGl2IG1vZCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAgaWxsZWdhbDogJzonLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnaW5oZXJpdGFuY2UnLFxuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQkFTSF9MSVRFUkFMID0gJ3RydWUgZmFsc2UnO1xuICB2YXIgQkFTSF9LRVlXT1JEID0gJ2lmIHRoZW4gZWxzZSBlbGlmIGZpIGZvciBicmVhayBjb250aW51ZSB3aGlsZSBpbiBkbyBkb25lIGVjaG8gZXhpdCByZXR1cm4gc2V0IGRlY2xhcmUnO1xuICB2YXIgVkFSMSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnXFxcXCRbYS16QS1aMC05XyNdKydcbiAgfTtcbiAgdmFyIFZBUjIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkeyhbXn1dfFxcXFxcXFxcfSkrfSdcbiAgfTtcbiAgdmFyIFFVT1RFX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgVkFSMSwgVkFSMl0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBBUE9TX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICBjb250YWluczogW3tiZWdpbjogJ1xcJ1xcJyd9XSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFRFU1RfQ09ORElUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ3Rlc3RfY29uZGl0aW9uJyxcbiAgICBiZWdpbjogJycsIGVuZDogJycsXG4gICAgY29udGFpbnM6IFtRVU9URV9TVFJJTkcsIEFQT1NfU1RSSU5HLCBWQVIxLCBWQVIyXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgbGl0ZXJhbDogQkFTSF9MSVRFUkFMXG4gICAgfSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiBCQVNIX0tFWVdPUkQsXG4gICAgICBsaXRlcmFsOiBCQVNIX0xJVEVSQUxcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NoZWJhbmcnLFxuICAgICAgICBiZWdpbjogJygjIVxcXFwvYmluXFxcXC9iYXNoKXwoIyFcXFxcL2JpblxcXFwvc2gpJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIFZBUjEsXG4gICAgICBWQVIyLFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIFFVT1RFX1NUUklORyxcbiAgICAgIEFQT1NfU1RSSU5HLFxuICAgICAgaGxqcy5pbmhlcml0KFRFU1RfQ09ORElUSU9OLCB7YmVnaW46ICdcXFxcWyAnLCBlbmQ6ICcgXFxcXF0nLCByZWxldmFuY2U6IDB9KSxcbiAgICAgIGhsanMuaW5oZXJpdChURVNUX0NPTkRJVElPTiwge2JlZ2luOiAnXFxcXFtcXFxcWyAnLCBlbmQ6ICcgXFxcXF1cXFxcXSd9KVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKXtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdbXlxcXFxbXFxcXF1cXFxcLixcXFxcK1xcXFwtPD4gXFxyXFxuXScsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGVuZDogJ1tcXFxcW1xcXFxdXFxcXC4sXFxcXCtcXFxcLTw+IFxcclxcbl0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXFtcXFxcXV0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnW1xcXFwuLF0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXCtcXFxcLV0nXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIGtleXdvcmRzID0ge1xuICAgIGJ1aWx0X2luOlxuICAgICAgLy8gQ2xvanVyZSBrZXl3b3Jkc1xuICAgICAgJ2RlZiBjb25kIGFwcGx5IGlmLW5vdCBpZi1sZXQgaWYgbm90IG5vdD0gPSAmbHQ7IDwgPiAmbHQ7PSA8PSA+PSA9PSArIC8gKiAtIHJlbSAnK1xuICAgICAgJ3F1b3QgbmVnPyBwb3M/IGRlbGF5PyBzeW1ib2w/IGtleXdvcmQ/IHRydWU/IGZhbHNlPyBpbnRlZ2VyPyBlbXB0eT8gY29sbD8gbGlzdD8gJytcbiAgICAgICdzZXQ/IGlmbj8gZm4/IGFzc29jaWF0aXZlPyBzZXF1ZW50aWFsPyBzb3J0ZWQ/IGNvdW50ZWQ/IHJldmVyc2libGU/IG51bWJlcj8gZGVjaW1hbD8gJytcbiAgICAgICdjbGFzcz8gZGlzdGluY3Q/IGlzYT8gZmxvYXQ/IHJhdGlvbmFsPyByZWR1Y2VkPyByYXRpbz8gb2RkPyBldmVuPyBjaGFyPyBzZXE/IHZlY3Rvcj8gJytcbiAgICAgICdzdHJpbmc/IG1hcD8gbmlsPyBjb250YWlucz8gemVybz8gaW5zdGFuY2U/IG5vdC1ldmVyeT8gbm90LWFueT8gbGlic3BlYz8gLT4gLT4+IC4uIC4gJytcbiAgICAgICdpbmMgY29tcGFyZSBkbyBkb3RpbWVzIG1hcGNhdCB0YWtlIHJlbW92ZSB0YWtlLXdoaWxlIGRyb3AgbGV0Zm4gZHJvcC1sYXN0IHRha2UtbGFzdCAnK1xuICAgICAgJ2Ryb3Atd2hpbGUgd2hpbGUgaW50ZXJuIGNvbmRwIGNhc2UgcmVkdWNlZCBjeWNsZSBzcGxpdC1hdCBzcGxpdC13aXRoIHJlcGVhdCByZXBsaWNhdGUgJytcbiAgICAgICdpdGVyYXRlIHJhbmdlIG1lcmdlIHppcG1hcCBkZWNsYXJlIGxpbmUtc2VxIHNvcnQgY29tcGFyYXRvciBzb3J0LWJ5IGRvcnVuIGRvYWxsIG50aG5leHQgJytcbiAgICAgICdudGhyZXN0IHBhcnRpdGlvbiBldmFsIGRvc2VxIGF3YWl0IGF3YWl0LWZvciBsZXQgYWdlbnQgYXRvbSBzZW5kIHNlbmQtb2ZmIHJlbGVhc2UtcGVuZGluZy1zZW5kcyAnK1xuICAgICAgJ2FkZC13YXRjaCBtYXB2IGZpbHRlcnYgcmVtb3ZlLXdhdGNoIGFnZW50LWVycm9yIHJlc3RhcnQtYWdlbnQgc2V0LWVycm9yLWhhbmRsZXIgZXJyb3ItaGFuZGxlciAnK1xuICAgICAgJ3NldC1lcnJvci1tb2RlISBlcnJvci1tb2RlIHNodXRkb3duLWFnZW50cyBxdW90ZSB2YXIgZm4gbG9vcCByZWN1ciB0aHJvdyB0cnkgbW9uaXRvci1lbnRlciAnK1xuICAgICAgJ21vbml0b3ItZXhpdCBkZWZtYWNybyBkZWZuIGRlZm4tIG1hY3JvZXhwYW5kIG1hY3JvZXhwYW5kLTEgZm9yIGRvc2VxIGRvc3luYyBkb3RpbWVzIGFuZCBvciAnK1xuICAgICAgJ3doZW4gd2hlbi1ub3Qgd2hlbi1sZXQgY29tcCBqdXh0IHBhcnRpYWwgc2VxdWVuY2UgbWVtb2l6ZSBjb25zdGFudGx5IGNvbXBsZW1lbnQgaWRlbnRpdHkgYXNzZXJ0ICcrXG4gICAgICAncGVlayBwb3AgZG90byBwcm94eSBkZWZzdHJ1Y3QgZmlyc3QgcmVzdCBjb25zIGRlZnByb3RvY29sIGNhc3QgY29sbCBkZWZ0eXBlIGRlZnJlY29yZCBsYXN0IGJ1dGxhc3QgJytcbiAgICAgICdzaWdzIHJlaWZ5IHNlY29uZCBmZmlyc3QgZm5leHQgbmZpcnN0IG5uZXh0IGRlZm11bHRpIGRlZm1ldGhvZCBtZXRhIHdpdGgtbWV0YSBucyBpbi1ucyBjcmVhdGUtbnMgaW1wb3J0ICcrXG4gICAgICAnaW50ZXJuIHJlZmVyIGtleXMgc2VsZWN0LWtleXMgdmFscyBrZXkgdmFsIHJzZXEgbmFtZSBuYW1lc3BhY2UgcHJvbWlzZSBpbnRvIHRyYW5zaWVudCBwZXJzaXN0ZW50ISBjb25qISAnK1xuICAgICAgJ2Fzc29jISBkaXNzb2MhIHBvcCEgZGlzaiEgaW1wb3J0IHVzZSBjbGFzcyB0eXBlIG51bSBmbG9hdCBkb3VibGUgc2hvcnQgYnl0ZSBib29sZWFuIGJpZ2ludCBiaWdpbnRlZ2VyICcrXG4gICAgICAnYmlnZGVjIHByaW50LW1ldGhvZCBwcmludC1kdXAgdGhyb3ctaWYgdGhyb3cgcHJpbnRmIGZvcm1hdCBsb2FkIGNvbXBpbGUgZ2V0LWluIHVwZGF0ZS1pbiBwciBwci1vbiBuZXdsaW5lICcrXG4gICAgICAnZmx1c2ggcmVhZCBzbHVycCByZWFkLWxpbmUgc3VidmVjIHdpdGgtb3BlbiBtZW1mbiB0aW1lIG5zIGFzc2VydCByZS1maW5kIHJlLWdyb3VwcyByYW5kLWludCByYW5kIG1vZCBsb2NraW5nICcrXG4gICAgICAnYXNzZXJ0LXZhbGlkLWZkZWNsIGFsaWFzIG5hbWVzcGFjZSByZXNvbHZlIHJlZiBkZXJlZiByZWZzZXQgc3dhcCEgcmVzZXQhIHNldC12YWxpZGF0b3IhIGNvbXBhcmUtYW5kLXNldCEgYWx0ZXItbWV0YSEgJytcbiAgICAgICdyZXNldC1tZXRhISBjb21tdXRlIGdldC12YWxpZGF0b3IgYWx0ZXIgcmVmLXNldCByZWYtaGlzdG9yeS1jb3VudCByZWYtbWluLWhpc3RvcnkgcmVmLW1heC1oaXN0b3J5IGVuc3VyZSBzeW5jIGlvISAnK1xuICAgICAgJ25ldyBuZXh0IGNvbmogc2V0ISBtZW1mbiB0by1hcnJheSBmdXR1cmUgZnV0dXJlLWNhbGwgaW50by1hcnJheSBhc2V0IGdlbi1jbGFzcyByZWR1Y2UgbWVyZ2UgbWFwIGZpbHRlciBmaW5kIGVtcHR5ICcrXG4gICAgICAnaGFzaC1tYXAgaGFzaC1zZXQgc29ydGVkLW1hcCBzb3J0ZWQtbWFwLWJ5IHNvcnRlZC1zZXQgc29ydGVkLXNldC1ieSB2ZWMgdmVjdG9yIHNlcSBmbGF0dGVuIHJldmVyc2UgYXNzb2MgZGlzc29jIGxpc3QgJytcbiAgICAgICdkaXNqIGdldCB1bmlvbiBkaWZmZXJlbmNlIGludGVyc2VjdGlvbiBleHRlbmQgZXh0ZW5kLXR5cGUgZXh0ZW5kLXByb3RvY29sIGludCBudGggZGVsYXkgY291bnQgY29uY2F0IGNodW5rIGNodW5rLWJ1ZmZlciAnK1xuICAgICAgJ2NodW5rLWFwcGVuZCBjaHVuay1maXJzdCBjaHVuay1yZXN0IG1heCBtaW4gZGVjIHVuY2hlY2tlZC1pbmMtaW50IHVuY2hlY2tlZC1pbmMgdW5jaGVja2VkLWRlYy1pbmMgdW5jaGVja2VkLWRlYyB1bmNoZWNrZWQtbmVnYXRlICcrXG4gICAgICAndW5jaGVja2VkLWFkZC1pbnQgdW5jaGVja2VkLWFkZCB1bmNoZWNrZWQtc3VidHJhY3QtaW50IHVuY2hlY2tlZC1zdWJ0cmFjdCBjaHVuay1uZXh0IGNodW5rLWNvbnMgY2h1bmtlZC1zZXE/IHBybiB2YXJ5LW1ldGEgJytcbiAgICAgICdsYXp5LXNlcSBzcHJlYWQgbGlzdCogc3RyIGZpbmQta2V5d29yZCBrZXl3b3JkIHN5bWJvbCBnZW5zeW0gZm9yY2UgcmF0aW9uYWxpemUnXG4gICB9O1xuXG4gIHZhciBDTEpfSURFTlRfUkUgPSAnW2EtekEtWl8wLTlcXFxcIVxcXFwuXFxcXD9cXFxcLVxcXFwrXFxcXCpcXFxcL1xcXFw8XFxcXD1cXFxcPlxcXFwmXFxcXCNcXFxcJFxcJztdKyc7XG4gIHZhciBTSU1QTEVfTlVNQkVSX1JFID0gJ1tcXFxcczpcXFxcKFxcXFx7XStcXFxcZCsoXFxcXC5cXFxcZCspPyc7XG5cbiAgdmFyIE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogU0lNUExFX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJzsnLCBlbmQ6ICckJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIENPTExFQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnY29sbGVjdGlvbicsXG4gICAgYmVnaW46ICdbXFxcXFtcXFxce10nLCBlbmQ6ICdbXFxcXF1cXFxcfV0nXG4gIH07XG4gIHZhciBISU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnXFxcXF4nICsgQ0xKX0lERU5UX1JFXG4gIH07XG4gIHZhciBISU5UX0NPTCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ1xcXFxeXFxcXHsnLCBlbmQ6ICdcXFxcfSdcbiAgfTtcbiAgdmFyIEtFWSA9IHtcbiAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgIGJlZ2luOiAnWzpdJyArIENMSl9JREVOVF9SRVxuICB9O1xuICB2YXIgTElTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXN0JyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQk9EWSA9IHtcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge2xpdGVyYWw6ICd0cnVlIGZhbHNlIG5pbCd9LFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgVElUTEUgPSB7XG4gICAga2V5d29yZHM6IGtleXdvcmRzLFxuICAgIGxleGVtczogQ0xKX0lERU5UX1JFLFxuICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IENMSl9JREVOVF9SRSxcbiAgICBzdGFydHM6IEJPRFlcbiAgfTtcblxuICBMSVNULmNvbnRhaW5zID0gW3tjbGFzc05hbWU6ICdjb21tZW50JywgYmVnaW46ICdjb21tZW50J30sIFRJVExFXTtcbiAgQk9EWS5jb250YWlucyA9IFtMSVNULCBTVFJJTkcsIEhJTlQsIEhJTlRfQ09MLCBDT01NRU5ULCBLRVksIENPTExFQ1RJT04sIE5VTUJFUl07XG4gIENPTExFQ1RJT04uY29udGFpbnMgPSBbTElTVCwgU1RSSU5HLCBISU5ULCBDT01NRU5ULCBLRVksIENPTExFQ1RJT04sIE5VTUJFUl07XG5cbiAgcmV0dXJuIHtcbiAgICBpbGxlZ2FsOiAnXFxcXFMnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBDT01NRU5ULFxuICAgICAgTElTVFxuICAgIF1cbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiAnYWRkX2N1c3RvbV9jb21tYW5kIGFkZF9jdXN0b21fdGFyZ2V0IGFkZF9kZWZpbml0aW9ucyBhZGRfZGVwZW5kZW5jaWVzICcgK1xuICAgICAgJ2FkZF9leGVjdXRhYmxlIGFkZF9saWJyYXJ5IGFkZF9zdWJkaXJlY3RvcnkgYWRkX3Rlc3QgYXV4X3NvdXJjZV9kaXJlY3RvcnkgJyArXG4gICAgICAnYnJlYWsgYnVpbGRfY29tbWFuZCBjbWFrZV9taW5pbXVtX3JlcXVpcmVkIGNtYWtlX3BvbGljeSBjb25maWd1cmVfZmlsZSAnICtcbiAgICAgICdjcmVhdGVfdGVzdF9zb3VyY2VsaXN0IGRlZmluZV9wcm9wZXJ0eSBlbHNlIGVsc2VpZiBlbmFibGVfbGFuZ3VhZ2UgZW5hYmxlX3Rlc3RpbmcgJyArXG4gICAgICAnZW5kZm9yZWFjaCBlbmRmdW5jdGlvbiBlbmRpZiBlbmRtYWNybyBlbmR3aGlsZSBleGVjdXRlX3Byb2Nlc3MgZXhwb3J0IGZpbmRfZmlsZSAnICtcbiAgICAgICdmaW5kX2xpYnJhcnkgZmluZF9wYWNrYWdlIGZpbmRfcGF0aCBmaW5kX3Byb2dyYW0gZmx0a193cmFwX3VpIGZvcmVhY2ggZnVuY3Rpb24gJyArXG4gICAgICAnZ2V0X2NtYWtlX3Byb3BlcnR5IGdldF9kaXJlY3RvcnlfcHJvcGVydHkgZ2V0X2ZpbGVuYW1lX2NvbXBvbmVudCBnZXRfcHJvcGVydHkgJyArXG4gICAgICAnZ2V0X3NvdXJjZV9maWxlX3Byb3BlcnR5IGdldF90YXJnZXRfcHJvcGVydHkgZ2V0X3Rlc3RfcHJvcGVydHkgaWYgaW5jbHVkZSAnICtcbiAgICAgICdpbmNsdWRlX2RpcmVjdG9yaWVzIGluY2x1ZGVfZXh0ZXJuYWxfbXNwcm9qZWN0IGluY2x1ZGVfcmVndWxhcl9leHByZXNzaW9uIGluc3RhbGwgJyArXG4gICAgICAnbGlua19kaXJlY3RvcmllcyBsb2FkX2NhY2hlIGxvYWRfY29tbWFuZCBtYWNybyBtYXJrX2FzX2FkdmFuY2VkIG1lc3NhZ2Ugb3B0aW9uICcgK1xuICAgICAgJ291dHB1dF9yZXF1aXJlZF9maWxlcyBwcm9qZWN0IHF0X3dyYXBfY3BwIHF0X3dyYXBfdWkgcmVtb3ZlX2RlZmluaXRpb25zIHJldHVybiAnICtcbiAgICAgICdzZXBhcmF0ZV9hcmd1bWVudHMgc2V0IHNldF9kaXJlY3RvcnlfcHJvcGVydGllcyBzZXRfcHJvcGVydHkgJyArXG4gICAgICAnc2V0X3NvdXJjZV9maWxlc19wcm9wZXJ0aWVzIHNldF90YXJnZXRfcHJvcGVydGllcyBzZXRfdGVzdHNfcHJvcGVydGllcyBzaXRlX25hbWUgJyArXG4gICAgICAnc291cmNlX2dyb3VwIHN0cmluZyB0YXJnZXRfbGlua19saWJyYXJpZXMgdHJ5X2NvbXBpbGUgdHJ5X3J1biB1bnNldCB2YXJpYWJsZV93YXRjaCAnICtcbiAgICAgICd3aGlsZSBidWlsZF9uYW1lIGV4ZWNfcHJvZ3JhbSBleHBvcnRfbGlicmFyeV9kZXBlbmRlbmNpZXMgaW5zdGFsbF9maWxlcyAnICtcbiAgICAgICdpbnN0YWxsX3Byb2dyYW1zIGluc3RhbGxfdGFyZ2V0cyBsaW5rX2xpYnJhcmllcyBtYWtlX2RpcmVjdG9yeSByZW1vdmUgc3ViZGlyX2RlcGVuZHMgJyArXG4gICAgICAnc3ViZGlycyB1c2VfbWFuZ2xlZF9tZXNhIHV0aWxpdHlfc291cmNlIHZhcmlhYmxlX3JlcXVpcmVzIHdyaXRlX2ZpbGUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VudnZhcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXCR7JywgZW5kOiAnfSdcbiAgICAgIH0sXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgIC8vIEpTIGtleXdvcmRzXG4gICAgICAnaW4gaWYgZm9yIHdoaWxlIGZpbmFsbHkgbmV3IGRvIHJldHVybiBlbHNlIGJyZWFrIGNhdGNoIGluc3RhbmNlb2YgdGhyb3cgdHJ5IHRoaXMgJyArXG4gICAgICAnc3dpdGNoIGNvbnRpbnVlIHR5cGVvZiBkZWxldGUgZGVidWdnZXIgc3VwZXIgJyArXG4gICAgICAvLyBDb2ZmZWUga2V5d29yZHNcbiAgICAgICd0aGVuIHVubGVzcyB1bnRpbCBsb29wIG9mIGJ5IHdoZW4gYW5kIG9yIGlzIGlzbnQgbm90JyxcbiAgICBsaXRlcmFsOlxuICAgICAgLy8gSlMgbGl0ZXJhbHNcbiAgICAgICd0cnVlIGZhbHNlIG51bGwgdW5kZWZpbmVkICcgK1xuICAgICAgLy8gQ29mZmVlIGxpdGVyYWxzXG4gICAgICAneWVzIG5vIG9uIG9mZiAnLFxuICAgIHJlc2VydmVkOiAnY2FzZSBkZWZhdWx0IGZ1bmN0aW9uIHZhciB2b2lkIHdpdGggY29uc3QgbGV0IGVudW0gZXhwb3J0IGltcG9ydCBuYXRpdmUgJyArXG4gICAgICAnX19oYXNQcm9wIF9fZXh0ZW5kcyBfX3NsaWNlIF9fYmluZCBfX2luZGV4T2YnXG4gIH07XG4gIHZhciBKU19JREVOVF9SRSA9ICdbQS1aYS16JF9dWzAtOUEtWmEteiRfXSonO1xuICB2YXIgVElUTEUgPSB7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogSlNfSURFTlRfUkV9O1xuICB2YXIgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnI1xcXFx7JywgZW5kOiAnfScsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CSU5BUllfTlVNQkVSX01PREUsIGhsanMuQ19OVU1CRVJfTU9ERV1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgLy8gTnVtYmVyc1xuICAgICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICAvLyBTdHJpbmdzXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gQ29tbWVudHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnIyMjJywgZW5kOiAnIyMjJ1xuICAgICAgfSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiAnLy8vJywgZW5kOiAnLy8vJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkhBU0hfQ09NTUVOVF9NT0RFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJywgYmVnaW46ICcvL1tnaW1dKidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiAnL1xcXFxTKFxcXFxcXFxcLnxbXlxcXFxuXSkqL1tnaW1dKicgLy8gXFxTIGlzIHJlcXVpcmVkIHRvIHBhcnNlIHggLyAyIC8gMyBhcyB0d28gZGl2aXNpb25zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ2phdmFzY3JpcHQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiBKU19JREVOVF9SRSArICdcXFxccyo9XFxcXHMqKFxcXFwoLitcXFxcKSk/XFxcXHMqWy09XT4nLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBUSVRMRSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBrZXl3b3JkczogJ2NsYXNzJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBrZXl3b3JkczogJ2V4dGVuZHMnLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBpbGxlZ2FsOiAnOicsXG4gICAgICAgICAgICBjb250YWluczogW1RJVExFXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgVElUTEVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJvcGVydHknLFxuICAgICAgICBiZWdpbjogJ0AnICsgSlNfSURFTlRfUkVcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQ1BQX0tFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6ICdmYWxzZSBpbnQgZmxvYXQgd2hpbGUgcHJpdmF0ZSBjaGFyIGNhdGNoIGV4cG9ydCB2aXJ0dWFsIG9wZXJhdG9yIHNpemVvZiAnICtcbiAgICAgICdkeW5hbWljX2Nhc3R8MTAgdHlwZWRlZiBjb25zdF9jYXN0fDEwIGNvbnN0IHN0cnVjdCBmb3Igc3RhdGljX2Nhc3R8MTAgdW5pb24gbmFtZXNwYWNlICcgK1xuICAgICAgJ3Vuc2lnbmVkIGxvbmcgdGhyb3cgdm9sYXRpbGUgc3RhdGljIHByb3RlY3RlZCBib29sIHRlbXBsYXRlIG11dGFibGUgaWYgcHVibGljIGZyaWVuZCAnICtcbiAgICAgICdkbyByZXR1cm4gZ290byBhdXRvIHZvaWQgZW51bSBlbHNlIGJyZWFrIG5ldyBleHRlcm4gdXNpbmcgdHJ1ZSBjbGFzcyBhc20gY2FzZSB0eXBlaWQgJyArXG4gICAgICAnc2hvcnQgcmVpbnRlcnByZXRfY2FzdHwxMCBkZWZhdWx0IGRvdWJsZSByZWdpc3RlciBleHBsaWNpdCBzaWduZWQgdHlwZW5hbWUgdHJ5IHRoaXMgJyArXG4gICAgICAnc3dpdGNoIGNvbnRpbnVlIHdjaGFyX3QgaW5saW5lIGRlbGV0ZSBhbGlnbm9mIGNoYXIxNl90IGNoYXIzMl90IGNvbnN0ZXhwciBkZWNsdHlwZSAnICtcbiAgICAgICdub2V4Y2VwdCBudWxscHRyIHN0YXRpY19hc3NlcnQgdGhyZWFkX2xvY2FsIHJlc3RyaWN0IF9Cb29sIGNvbXBsZXgnLFxuICAgIGJ1aWx0X2luOiAnc3RkIHN0cmluZyBjaW4gY291dCBjZXJyIGNsb2cgc3RyaW5nc3RyZWFtIGlzdHJpbmdzdHJlYW0gb3N0cmluZ3N0cmVhbSAnICtcbiAgICAgICdhdXRvX3B0ciBkZXF1ZSBsaXN0IHF1ZXVlIHN0YWNrIHZlY3RvciBtYXAgc2V0IGJpdHNldCBtdWx0aXNldCBtdWx0aW1hcCB1bm9yZGVyZWRfc2V0ICcgK1xuICAgICAgJ3Vub3JkZXJlZF9tYXAgdW5vcmRlcmVkX211bHRpc2V0IHVub3JkZXJlZF9tdWx0aW1hcCBhcnJheSBzaGFyZWRfcHRyJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBDUFBfS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnXFxcXFxcXFw/LicsIGVuZDogJ1xcJycsXG4gICAgICAgIGlsbGVnYWw6ICcuJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihcXFxcZCsoXFxcXC5cXFxcZCopP3xcXFxcLlxcXFxkKykodXxVfGx8THx1bHxVTHxmfEYpJ1xuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0bF9jb250YWluZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGRlcXVlfGxpc3R8cXVldWV8c3RhY2t8dmVjdG9yfG1hcHxzZXR8Yml0c2V0fG11bHRpc2V0fG11bHRpbWFwfHVub3JkZXJlZF9tYXB8dW5vcmRlcmVkX3NldHx1bm9yZGVyZWRfbXVsdGlzZXR8dW5vcmRlcmVkX211bHRpbWFwfGFycmF5KVxcXFxzKjwnLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFsnc2VsZiddXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgIC8vIE5vcm1hbCBrZXl3b3Jkcy5cbiAgICAgICdhYnN0cmFjdCBhcyBiYXNlIGJvb2wgYnJlYWsgYnl0ZSBjYXNlIGNhdGNoIGNoYXIgY2hlY2tlZCBjbGFzcyBjb25zdCBjb250aW51ZSBkZWNpbWFsICcgK1xuICAgICAgJ2RlZmF1bHQgZGVsZWdhdGUgZG8gZG91YmxlIGVsc2UgZW51bSBldmVudCBleHBsaWNpdCBleHRlcm4gZmFsc2UgZmluYWxseSBmaXhlZCBmbG9hdCAnICtcbiAgICAgICdmb3IgZm9yZWFjaCBnb3RvIGlmIGltcGxpY2l0IGluIGludCBpbnRlcmZhY2UgaW50ZXJuYWwgaXMgbG9jayBsb25nIG5hbWVzcGFjZSBuZXcgbnVsbCAnICtcbiAgICAgICdvYmplY3Qgb3BlcmF0b3Igb3V0IG92ZXJyaWRlIHBhcmFtcyBwcml2YXRlIHByb3RlY3RlZCBwdWJsaWMgcmVhZG9ubHkgcmVmIHJldHVybiBzYnl0ZSAnICtcbiAgICAgICdzZWFsZWQgc2hvcnQgc2l6ZW9mIHN0YWNrYWxsb2Mgc3RhdGljIHN0cmluZyBzdHJ1Y3Qgc3dpdGNoIHRoaXMgdGhyb3cgdHJ1ZSB0cnkgdHlwZW9mICcgK1xuICAgICAgJ3VpbnQgdWxvbmcgdW5jaGVja2VkIHVuc2FmZSB1c2hvcnQgdXNpbmcgdmlydHVhbCB2b2xhdGlsZSB2b2lkIHdoaWxlICcgK1xuICAgICAgLy8gQ29udGV4dHVhbCBrZXl3b3Jkcy5cbiAgICAgICdhc2NlbmRpbmcgZGVzY2VuZGluZyBmcm9tIGdldCBncm91cCBpbnRvIGpvaW4gbGV0IG9yZGVyYnkgcGFydGlhbCBzZWxlY3Qgc2V0IHZhbHVlIHZhciAnK1xuICAgICAgJ3doZXJlIHlpZWxkJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICcvLy8nLCBlbmQ6ICckJywgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAneG1sRG9jVGFnJyxcbiAgICAgICAgICAgIGJlZ2luOiAnLy8vfDwhLS18LS0+J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAneG1sRG9jVGFnJyxcbiAgICAgICAgICAgIGJlZ2luOiAnPC8/JywgZW5kOiAnPidcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdpZiBlbHNlIGVsaWYgZW5kaWYgZGVmaW5lIHVuZGVmIHdhcm5pbmcgZXJyb3IgbGluZSByZWdpb24gZW5kcmVnaW9uIHByYWdtYSBjaGVja3N1bSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnQFwiJywgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW3tiZWdpbjogJ1wiXCInfV1cbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbjogaGxqcy5JREVOVF9SRSArICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogW2hsanMuTlVNQkVSX01PREUsIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERV1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGlsbGVnYWw6ICdbPS98XFwnXScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2lkJywgYmVnaW46ICdcXFxcI1tBLVphLXowLTlfLV0rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLCBiZWdpbjogJ1xcXFwuW0EtWmEtejAtOV8tXSsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJfc2VsZWN0b3InLFxuICAgICAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgICAgICBpbGxlZ2FsOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BzZXVkbycsXG4gICAgICAgIGJlZ2luOiAnOig6KT9bYS16QS1aMC05XFxcXF9cXFxcLVxcXFwrXFxcXChcXFxcKVxcXFxcIlxcXFxcXCddKydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0X3J1bGUnLFxuICAgICAgICBiZWdpbjogJ0AoZm9udC1mYWNlfHBhZ2UpJyxcbiAgICAgICAgbGV4ZW1zOiAnW2Etei1dKycsXG4gICAgICAgIGtleXdvcmRzOiAnZm9udC1mYWNlIHBhZ2UnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdF9ydWxlJyxcbiAgICAgICAgYmVnaW46ICdAJywgZW5kOiAnW3s7XScsIC8vIGF0X3J1bGUgZWF0aW5nIGZpcnN0IFwie1wiIGlzIGEgZ29vZCB0aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBpdCBkb2VzbuKAmXQgbGV0IGl0IHRvIGJlIHBhcnNlZCBhc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBydWxlIHNldCBidXQgaW5zdGVhZCBkcm9wcyBwYXJzZXIgaW50b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRlZmF1bHQgbW9kZSB3aGljaCBpcyBob3cgaXQgc2hvdWxkIGJlLlxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBrZXl3b3JkczogJ2ltcG9ydCBwYWdlIG1lZGlhIGNoYXJzZXQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIEZVTkNUSU9OLFxuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLk5VTUJFUl9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsIGJlZ2luOiBobGpzLklERU5UX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3J1bGVzJyxcbiAgICAgICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3J1bGUnLFxuICAgICAgICAgICAgYmVnaW46ICdbXlxcXFxzXScsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICc7JywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1tBLVpcXFxcX1xcXFwuXFxcXC1dKycsIGVuZDogJzonLFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICAgICAgICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgRlVOQ1RJT04sXG4gICAgICAgICAgICAgICAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICAgICAgICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hleGNvbG9yJywgYmVnaW46ICdcXFxcI1swLTlBLUZdKydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ltcG9ydGFudCcsIGJlZ2luOiAnIWltcG9ydGFudCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAvKipcbiAqIEtub3duIGlzc3VlczpcbiAqXG4gKiAtIGludmFsaWQgaGV4IHN0cmluZyBsaXRlcmFscyB3aWxsIGJlIHJlY29nbml6ZWQgYXMgYSBkb3VibGUgcXVvdGVkIHN0cmluZ3NcbiAqICAgYnV0ICd4JyBhdCB0aGUgYmVnaW5uaW5nIG9mIHN0cmluZyB3aWxsIG5vdCBiZSBtYXRjaGVkXG4gKlxuICogLSBkZWxpbWl0ZWQgc3RyaW5nIGxpdGVyYWxzIGFyZSBub3QgY2hlY2tlZCBmb3IgbWF0Y2hpbmcgZW5kIGRlbGltaXRlclxuICogICAobm90IHBvc3NpYmxlIHRvIGRvIHdpdGgganMgcmVnZXhwKVxuICpcbiAqIC0gY29udGVudCBvZiB0b2tlbiBzdHJpbmcgaXMgY29sb3JlZCBhcyBhIHN0cmluZyAoaS5lLiBubyBrZXl3b3JkIGNvbG9yaW5nIGluc2lkZSBhIHRva2VuIHN0cmluZylcbiAqICAgYWxzbywgY29udGVudCBvZiB0b2tlbiBzdHJpbmcgaXMgbm90IHZhbGlkYXRlZCB0byBjb250YWluIG9ubHkgdmFsaWQgRCB0b2tlbnNcbiAqXG4gKiAtIHNwZWNpYWwgdG9rZW4gc2VxdWVuY2UgcnVsZSBpcyBub3Qgc3RyaWN0bHkgZm9sbG93aW5nIEQgZ3JhbW1hciAoYW55dGhpbmcgZm9sbG93aW5nICNsaW5lXG4gKiAgIHVwIHRvIHRoZSBlbmQgb2YgbGluZSBpcyBtYXRjaGVkIGFzIHNwZWNpYWwgdG9rZW4gc2VxdWVuY2UpXG4gKi9cblxuZnVuY3Rpb24oaGxqcykge1xuXG5cdC8qKlxuXHQgKiBMYW5ndWFnZSBrZXl3b3Jkc1xuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfS0VZV09SRFMgPSB7XG5cdFx0a2V5d29yZDpcblx0XHRcdCdhYnN0cmFjdCBhbGlhcyBhbGlnbiBhc20gYXNzZXJ0IGF1dG8gYm9keSBicmVhayBieXRlIGNhc2UgY2FzdCBjYXRjaCBjbGFzcyAnICtcblx0XHRcdCdjb25zdCBjb250aW51ZSBkZWJ1ZyBkZWZhdWx0IGRlbGV0ZSBkZXByZWNhdGVkIGRvIGVsc2UgZW51bSBleHBvcnQgZXh0ZXJuIGZpbmFsICcgK1xuXHRcdFx0J2ZpbmFsbHkgZm9yIGZvcmVhY2ggZm9yZWFjaF9yZXZlcnNlfDEwIGdvdG8gaWYgaW1tdXRhYmxlIGltcG9ydCBpbiBpbm91dCBpbnQgJyArXG5cdFx0XHQnaW50ZXJmYWNlIGludmFyaWFudCBpcyBsYXp5IG1hY3JvIG1peGluIG1vZHVsZSBuZXcgbm90aHJvdyBvdXQgb3ZlcnJpZGUgcGFja2FnZSAnICtcblx0XHRcdCdwcmFnbWEgcHJpdmF0ZSBwcm90ZWN0ZWQgcHVibGljIHB1cmUgcmVmIHJldHVybiBzY29wZSBzaGFyZWQgc3RhdGljIHN0cnVjdCAnICtcblx0XHRcdCdzdXBlciBzd2l0Y2ggc3luY2hyb25pemVkIHRlbXBsYXRlIHRoaXMgdGhyb3cgdHJ5IHR5cGVkZWYgdHlwZWlkIHR5cGVvZiB1bmlvbiAnICtcblx0XHRcdCd1bml0dGVzdCB2ZXJzaW9uIHZvaWQgdm9sYXRpbGUgd2hpbGUgd2l0aCBfX0ZJTEVfXyBfX0xJTkVfXyBfX2dzaGFyZWR8MTAgJyArXG5cdFx0XHQnX190aHJlYWQgX190cmFpdHMgX19EQVRFX18gX19FT0ZfXyBfX1RJTUVfXyBfX1RJTUVTVEFNUF9fIF9fVkVORE9SX18gX19WRVJTSU9OX18nLFxuXHRcdGJ1aWx0X2luOlxuXHRcdFx0J2Jvb2wgY2RvdWJsZSBjZW50IGNmbG9hdCBjaGFyIGNyZWFsIGRjaGFyIGRlbGVnYXRlIGRvdWJsZSBkc3RyaW5nIGZsb2F0IGZ1bmN0aW9uICcgK1xuXHRcdFx0J2lkb3VibGUgaWZsb2F0IGlyZWFsIGxvbmcgcmVhbCBzaG9ydCBzdHJpbmcgdWJ5dGUgdWNlbnQgdWludCB1bG9uZyB1c2hvcnQgd2NoYXIgJyArXG5cdFx0XHQnd3N0cmluZycsXG5cdFx0bGl0ZXJhbDpcblx0XHRcdCdmYWxzZSBudWxsIHRydWUnXG5cdH07XG5cblx0LyoqXG5cdCAqIE51bWJlciBsaXRlcmFsIHJlZ2V4cHNcblx0ICpcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHZhciBkZWNpbWFsX2ludGVnZXJfcmUgPSAnKDB8WzEtOV1bXFxcXGRfXSopJyxcblx0XHRkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgPSAnKDB8WzEtOV1bXFxcXGRfXSp8XFxcXGRbXFxcXGRfXSp8W1xcXFxkX10rP1xcXFxkKScsXG5cdFx0YmluYXJ5X2ludGVnZXJfcmUgPSAnMFtiQl1bMDFfXSsnLFxuXHRcdGhleGFkZWNpbWFsX2RpZ2l0c19yZSA9ICcoW1xcXFxkYS1mQS1GXVtcXFxcZGEtZkEtRl9dKnxfW1xcXFxkYS1mQS1GXVtcXFxcZGEtZkEtRl9dKiknLFxuXHRcdGhleGFkZWNpbWFsX2ludGVnZXJfcmUgPSAnMFt4WF0nICsgaGV4YWRlY2ltYWxfZGlnaXRzX3JlLFxuXG5cdFx0ZGVjaW1hbF9leHBvbmVudF9yZSA9ICcoW2VFXVsrLV0/JyArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArICcpJyxcblx0XHRkZWNpbWFsX2Zsb2F0X3JlID0gJygnICsgZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlICsgJyhcXFxcLlxcXFxkKnwnICsgZGVjaW1hbF9leHBvbmVudF9yZSArICcpfCcgK1xuXHRcdFx0XHRcdFx0XHRcdCdcXFxcZCtcXFxcLicgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyAnfCcgK1xuXHRcdFx0XHRcdFx0XHRcdCdcXFxcLicgKyBkZWNpbWFsX2ludGVnZXJfcmUgKyBkZWNpbWFsX2V4cG9uZW50X3JlICsgJz8nICtcblx0XHRcdFx0XHRcdFx0JyknLFxuXHRcdGhleGFkZWNpbWFsX2Zsb2F0X3JlID0gJygwW3hYXSgnICtcblx0XHRcdFx0XHRcdFx0XHRcdGhleGFkZWNpbWFsX2RpZ2l0c19yZSArICdcXFxcLicgKyBoZXhhZGVjaW1hbF9kaWdpdHNfcmUgKyAnfCcrXG5cdFx0XHRcdFx0XHRcdFx0XHQnXFxcXC4/JyArIGhleGFkZWNpbWFsX2RpZ2l0c19yZSArXG5cdFx0XHRcdFx0XHRcdCAgICcpW3BQXVsrLV0/JyArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArICcpJyxcblxuXHRcdGludGVnZXJfcmUgPSAnKCcgK1xuXHRcdFx0ZGVjaW1hbF9pbnRlZ2VyX3JlICsgJ3wnICtcblx0XHRcdGJpbmFyeV9pbnRlZ2VyX3JlICArICd8JyArXG5cdFx0IFx0aGV4YWRlY2ltYWxfaW50ZWdlcl9yZSAgICtcblx0XHQnKScsXG5cblx0XHRmbG9hdF9yZSA9ICcoJyArXG5cdFx0XHRoZXhhZGVjaW1hbF9mbG9hdF9yZSArICd8JyArXG5cdFx0XHRkZWNpbWFsX2Zsb2F0X3JlICArXG5cdFx0JyknO1xuXG5cdC8qKlxuXHQgKiBFc2NhcGUgc2VxdWVuY2Ugc3VwcG9ydGVkIGluIEQgc3RyaW5nIGFuZCBjaGFyYWN0ZXIgbGl0ZXJhbHNcblx0ICpcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHZhciBlc2NhcGVfc2VxdWVuY2VfcmUgPSAnXFxcXFxcXFwoJyArXG5cdFx0XHRcdFx0XHRcdCdbXFwnXCJcXFxcP1xcXFxcXFxcYWJmbnJ0dl18JyArXHQvLyBjb21tb24gZXNjYXBlc1xuXHRcdFx0XHRcdFx0XHQndVtcXFxcZEEtRmEtZl17NH18JyArIFx0XHQvLyBmb3VyIGhleCBkaWdpdCB1bmljb2RlIGNvZGVwb2ludFxuXHRcdFx0XHRcdFx0XHQnWzAtN117MSwzfXwnICsgXHRcdFx0Ly8gb25lIHRvIHRocmVlIG9jdGFsIGRpZ2l0IGFzY2lpIGNoYXIgY29kZVxuXHRcdFx0XHRcdFx0XHQneFtcXFxcZEEtRmEtZl17Mn18JyArXHRcdC8vIHR3byBoZXggZGlnaXQgYXNjaWkgY2hhciBjb2RlXG5cdFx0XHRcdFx0XHRcdCdVW1xcXFxkQS1GYS1mXXs4fScgK1x0XHRcdC8vIGVpZ2h0IGhleCBkaWdpdCB1bmljb2RlIGNvZGVwb2ludFxuXHRcdFx0XHRcdFx0ICAnKXwnICtcblx0XHRcdFx0XHRcdCAgJyZbYS16QS1aXFxcXGRdezIsfTsnO1x0XHRcdC8vIG5hbWVkIGNoYXJhY3RlciBlbnRpdHlcblxuXG5cdC8qKlxuXHQgKiBEIGludGVnZXIgbnVtYmVyIGxpdGVyYWxzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9JTlRFR0VSX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBcdGJlZ2luOiAnXFxcXGInICsgaW50ZWdlcl9yZSArICcoTHx1fFV8THV8TFV8dUx8VUwpPycsXG4gICAgXHRyZWxldmFuY2U6IDBcblx0fTtcblxuXHQvKipcblx0ICogW0RfRkxPQVRfTU9ERSBkZXNjcmlwdGlvbl1cblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0ZMT0FUX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnbnVtYmVyJyxcblx0XHRiZWdpbjogJ1xcXFxiKCcgK1xuXHRcdFx0XHRmbG9hdF9yZSArICcoW2ZGXXxMfGl8W2ZGXWl8TGkpP3wnICtcblx0XHRcdFx0aW50ZWdlcl9yZSArICcoaXxbZkZdaXxMaSknICtcblx0XHRcdCcpJyxcblx0XHRyZWxldmFuY2U6IDBcblx0fTtcblxuXHQvKipcblx0ICogRCBjaGFyYWN0ZXIgbGl0ZXJhbFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfQ0hBUkFDVEVSX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ1xcJygnICsgZXNjYXBlX3NlcXVlbmNlX3JlICsgJ3wuKScsIGVuZDogJ1xcJycsXG5cdFx0aWxsZWdhbDogJy4nXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgc3RyaW5nIGVzY2FwZSBzZXF1ZW5jZVxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfRVNDQVBFX1NFUVVFTkNFID0ge1xuXHRcdGJlZ2luOiBlc2NhcGVfc2VxdWVuY2VfcmUsXG5cdFx0cmVsZXZhbmNlOiAwXG5cdH1cblxuXHQvKipcblx0ICogRCBkb3VibGUgcXVvdGVkIHN0cmluZyBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAnXCInLFxuXHRcdGNvbnRhaW5zOiBbRF9FU0NBUEVfU0VRVUVOQ0VdLFxuXHRcdGVuZDogJ1wiW2N3ZF0/Jyxcblx0XHRyZWxldmFuY2U6IDBcblx0fTtcblxuXHQvKipcblx0ICogRCB3eXNpd3lnIGFuZCBkZWxpbWl0ZWQgc3RyaW5nIGxpdGVyYWxzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9XWVNJV1lHX0RFTElNSVRFRF9TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAnW3JxXVwiJyxcblx0XHRlbmQ6ICdcIltjd2RdPycsXG5cdFx0cmVsZXZhbmNlOiA1XG5cdH07XG5cblx0LyoqXG5cdCAqIEQgYWx0ZXJuYXRlIHd5c2l3eWcgc3RyaW5nIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0FMVEVSTkFURV9XWVNJV1lHX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdgJyxcblx0XHRlbmQ6ICdgW2N3ZF0/J1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIGhleGFkZWNpbWFsIHN0cmluZyBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9IRVhfU1RSSU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ3hcIltcXFxcZGEtZkEtRlxcXFxzXFxcXG5cXFxccl0qXCJbY3dkXT8nLFxuXHRcdHJlbGV2YW5jZTogMTBcblx0fTtcblxuXHQvKipcblx0ICogRCBkZWxpbWl0ZWQgc3RyaW5nIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX1RPS0VOX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdxXCJcXFxceycsXG5cdFx0ZW5kOiAnXFxcXH1cIidcblx0fTtcblxuXHQvKipcblx0ICogSGFzaGJhbmcgc3VwcG9ydFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfSEFTSEJBTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzaGViYW5nJyxcblx0XHRiZWdpbjogJ14jIScsXG5cdFx0ZW5kOiAnJCcsXG5cdFx0cmVsZXZhbmNlOiA1XG5cdH07XG5cblx0LyoqXG5cdCAqIEQgc3BlY2lhbCB0b2tlbiBzZXF1ZW5jZVxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfU1BFQ0lBTF9UT0tFTl9TRVFVRU5DRV9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG5cdFx0YmVnaW46ICcjKGxpbmUpJyxcblx0XHRlbmQ6ICckJyxcblx0XHRyZWxldmFuY2U6IDVcblx0fTtcblxuXHQvKipcblx0ICogRCBhdHRyaWJ1dGVzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9BVFRSSUJVVEVfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdrZXl3b3JkJyxcblx0XHRiZWdpbjogJ0BbYS16QS1aX11bYS16QS1aX1xcXFxkXSonXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgbmVzdGluZyBjb21tZW50XG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9ORVNUSU5HX0NPTU1FTlRfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdjb21tZW50Jyxcblx0XHRiZWdpbjogJ1xcXFwvXFxcXCsnLFxuXHRcdGNvbnRhaW5zOiBbJ3NlbGYnXSxcblx0XHRlbmQ6ICdcXFxcK1xcXFwvJyxcblx0XHRyZWxldmFuY2U6IDEwXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGxleGVtczogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuXHRcdGtleXdvcmRzOiBEX0tFWVdPUkRTLFxuXHRcdGNvbnRhaW5zOiBbXG5cdFx0XHRobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gIFx0XHRcdGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gIFx0XHRcdERfTkVTVElOR19DT01NRU5UX01PREUsXG4gIFx0XHRcdERfSEVYX1NUUklOR19NT0RFLFxuICBcdFx0XHREX1NUUklOR19NT0RFLFxuICBcdFx0XHREX1dZU0lXWUdfREVMSU1JVEVEX1NUUklOR19NT0RFLFxuICBcdFx0XHREX0FMVEVSTkFURV9XWVNJV1lHX1NUUklOR19NT0RFLFxuICBcdFx0XHREX1RPS0VOX1NUUklOR19NT0RFLFxuICBcdFx0XHREX0ZMT0FUX01PREUsXG4gIFx0XHRcdERfSU5URUdFUl9NT0RFLFxuICBcdFx0XHREX0NIQVJBQ1RFUl9NT0RFLFxuICBcdFx0XHREX0hBU0hCQU5HX01PREUsXG4gIFx0XHRcdERfU1BFQ0lBTF9UT0tFTl9TRVFVRU5DRV9NT0RFLFxuICBcdFx0XHREX0FUVFJJQlVURV9NT0RFXG5cdFx0XVxuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIERFTFBISV9LRVlXT1JEUyA9ICdhbmQgc2FmZWNhbGwgY2RlY2wgdGhlbiBzdHJpbmcgZXhwb3J0cyBsaWJyYXJ5IG5vdCBwYXNjYWwgc2V0ICcgK1xuICAgICd2aXJ0dWFsIGZpbGUgaW4gYXJyYXkgbGFiZWwgcGFja2VkIGVuZC4gaW5kZXggd2hpbGUgY29uc3QgcmFpc2UgZm9yIHRvIGltcGxlbWVudGF0aW9uICcgK1xuICAgICd3aXRoIGV4Y2VwdCBvdmVybG9hZCBkZXN0cnVjdG9yIGRvd250byBmaW5hbGx5IHByb2dyYW0gZXhpdCB1bml0IGluaGVyaXRlZCBvdmVycmlkZSBpZiAnICtcbiAgICAndHlwZSB1bnRpbCBmdW5jdGlvbiBkbyBiZWdpbiByZXBlYXQgZ290byBuaWwgZmFyIGluaXRpYWxpemF0aW9uIG9iamVjdCBlbHNlIHZhciB1c2VzICcgK1xuICAgICdleHRlcm5hbCByZXNvdXJjZXN0cmluZyBpbnRlcmZhY2UgZW5kIGZpbmFsaXphdGlvbiBjbGFzcyBhc20gbW9kIGNhc2Ugb24gc2hyIHNobCBvZiAnICtcbiAgICAncmVnaXN0ZXIgeG9yd3JpdGUgdGhyZWFkdmFyIHRyeSByZWNvcmQgbmVhciBzdG9yZWQgY29uc3RydWN0b3Igc3RkY2FsbCBpbmxpbmUgZGl2IG91dCBvciAnICtcbiAgICAncHJvY2VkdXJlJztcbiAgdmFyIERFTFBISV9DTEFTU19LRVlXT1JEUyA9ICdzYWZlY2FsbCBzdGRjYWxsIHBhc2NhbCBzdG9yZWQgY29uc3QgaW1wbGVtZW50YXRpb24gJyArXG4gICAgJ2ZpbmFsaXphdGlvbiBleGNlcHQgdG8gZmluYWxseSBwcm9ncmFtIGluaGVyaXRlZCBvdmVycmlkZSB0aGVuIGV4cG9ydHMgc3RyaW5nIHJlYWQgbm90ICcgK1xuICAgICdtb2Qgc2hyIHRyeSBkaXYgc2hsIHNldCBsaWJyYXJ5IG1lc3NhZ2UgcGFja2VkIGluZGV4IGZvciBuZWFyIG92ZXJsb2FkIGxhYmVsIGRvd250byBleGl0ICcgK1xuICAgICdwdWJsaWMgZ290byBpbnRlcmZhY2UgYXNtIG9uIG9mIGNvbnN0cnVjdG9yIG9yIHByaXZhdGUgYXJyYXkgdW5pdCByYWlzZSBkZXN0cnVjdG9yIHZhciAnICtcbiAgICAndHlwZSB1bnRpbCBmdW5jdGlvbiBlbHNlIGV4dGVybmFsIHdpdGggY2FzZSBkZWZhdWx0IHJlY29yZCB3aGlsZSBwcm90ZWN0ZWQgcHJvcGVydHkgJyArXG4gICAgJ3Byb2NlZHVyZSBwdWJsaXNoZWQgYW5kIGNkZWNsIGRvIHRocmVhZHZhciBmaWxlIGluIGlmIGVuZCB2aXJ0dWFsIHdyaXRlIGZhciBvdXQgYmVnaW4gJyArXG4gICAgJ3JlcGVhdCBuaWwgaW5pdGlhbGl6YXRpb24gb2JqZWN0IHVzZXMgcmVzb3VyY2VzdHJpbmcgY2xhc3MgcmVnaXN0ZXIgeG9yd3JpdGUgaW5saW5lIHN0YXRpYyc7XG4gIHZhciBDVVJMWV9DT01NRU5UID0gIHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFBBUkVOX0NPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICdcXFxcKFxcXFwqJywgZW5kOiAnXFxcXCpcXFxcKScsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXFwnXFwnJ31dLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ0hBUl9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJywgYmVnaW46ICcoI1xcXFxkKykrJ1xuICB9O1xuICB2YXIgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ1s6O10nLFxuICAgIGtleXdvcmRzOiAnZnVuY3Rpb24gY29uc3RydWN0b3J8MTAgZGVzdHJ1Y3RvcnwxMCBwcm9jZWR1cmV8MTAnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IGhsanMuSURFTlRfUkVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGtleXdvcmRzOiBERUxQSElfS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbU1RSSU5HLCBDSEFSX1NUUklOR11cbiAgICAgIH0sXG4gICAgICBDVVJMWV9DT01NRU5ULCBQQVJFTl9DT01NRU5UXG4gICAgXVxuICB9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IERFTFBISV9LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnKFwifFxcXFwkW0ctWmctel18XFxcXC9cXFxcKnw8LyknLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBDVVJMWV9DT01NRU5ULCBQQVJFTl9DT01NRU5ULCBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBTVFJJTkcsIENIQVJfU1RSSU5HLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIEZVTkNUSU9OLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luOiAnPVxcXFxiY2xhc3NcXFxcYicsIGVuZDogJ2VuZDsnLFxuICAgICAgICBrZXl3b3JkczogREVMUEhJX0NMQVNTX0tFWVdPUkRTLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFNUUklORywgQ0hBUl9TVFJJTkcsXG4gICAgICAgICAgQ1VSTFlfQ09NTUVOVCwgUEFSRU5fQ09NTUVOVCwgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIEZVTkNUSU9OXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NodW5rJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXEBcXFxcQCArXFxcXC1cXFxcZCssXFxcXGQrICtcXFxcK1xcXFxkKyxcXFxcZCsgK1xcXFxAXFxcXEAkJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2h1bmsnLFxuICAgICAgICBiZWdpbjogJ15cXFxcKlxcXFwqXFxcXCogK1xcXFxkKyxcXFxcZCsgK1xcXFwqXFxcXCpcXFxcKlxcXFwqJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NodW5rJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXC1cXFxcLVxcXFwtICtcXFxcZCssXFxcXGQrICtcXFxcLVxcXFwtXFxcXC1cXFxcLSQnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ0luZGV4OiAnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICc9PT09PScsIGVuZDogJz09PT09JCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwtXFxcXC1cXFxcLScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ15cXFxcKnszfSAnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCtcXFxcK1xcXFwrJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXCp7NX0nLCBlbmQ6ICdcXFxcKns1fSQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhZGRpdGlvbicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwrJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2RlbGV0aW9uJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXC0nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCEnLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG5cbiAgZnVuY3Rpb24gYWxsb3dzRGphbmdvU3ludGF4KG1vZGUsIHBhcmVudCkge1xuICAgIHJldHVybiAoXG4gICAgICBwYXJlbnQgPT0gdW5kZWZpbmVkIHx8IC8vIGRlZmF1bHQgbW9kZVxuICAgICAgKCFtb2RlLmNsYXNzTmFtZSAmJiBwYXJlbnQuY2xhc3NOYW1lID09ICd0YWcnKSB8fCAvLyB0YWdfaW50ZXJuYWxcbiAgICAgIG1vZGUuY2xhc3NOYW1lID09ICd2YWx1ZScgLy8gdmFsdWVcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gY29weShtb2RlLCBwYXJlbnQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG1vZGUpIHtcbiAgICAgIGlmIChrZXkgIT0gJ2NvbnRhaW5zJykge1xuICAgICAgICByZXN1bHRba2V5XSA9IG1vZGVba2V5XTtcbiAgICAgIH1cbiAgICAgIHZhciBjb250YWlucyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IG1vZGUuY29udGFpbnMgJiYgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29udGFpbnMucHVzaChjb3B5KG1vZGUuY29udGFpbnNbaV0sIG1vZGUpKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbGxvd3NEamFuZ29TeW50YXgobW9kZSwgcGFyZW50KSkge1xuICAgICAgICBjb250YWlucyA9IERKQU5HT19DT05UQUlOUy5jb25jYXQoY29udGFpbnMpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRhaW5zLmxlbmd0aCkge1xuICAgICAgICByZXN1bHQuY29udGFpbnMgPSBjb250YWlucztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBGSUxURVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnZmlsdGVyJyxcbiAgICBiZWdpbjogJ1xcXFx8W0EtWmEtel0rXFxcXDo/JywgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3JkczpcbiAgICAgICd0cnVuY2F0ZXdvcmRzIHJlbW92ZXRhZ3MgbGluZWJyZWFrc2JyIHllc25vIGdldF9kaWdpdCB0aW1lc2luY2UgcmFuZG9tIHN0cmlwdGFncyAnICtcbiAgICAgICdmaWxlc2l6ZWZvcm1hdCBlc2NhcGUgbGluZWJyZWFrcyBsZW5ndGhfaXMgbGp1c3Qgcmp1c3QgY3V0IHVybGl6ZSBmaXhfYW1wZXJzYW5kcyAnICtcbiAgICAgICd0aXRsZSBmbG9hdGZvcm1hdCBjYXBmaXJzdCBwcHJpbnQgZGl2aXNpYmxlYnkgYWRkIG1ha2VfbGlzdCB1bm9yZGVyZWRfbGlzdCB1cmxlbmNvZGUgJyArXG4gICAgICAndGltZXVudGlsIHVybGl6ZXRydW5jIHdvcmRjb3VudCBzdHJpbmdmb3JtYXQgbGluZW51bWJlcnMgc2xpY2UgZGF0ZSBkaWN0c29ydCAnICtcbiAgICAgICdkaWN0c29ydHJldmVyc2VkIGRlZmF1bHRfaWZfbm9uZSBwbHVyYWxpemUgbG93ZXIgam9pbiBjZW50ZXIgZGVmYXVsdCAnICtcbiAgICAgICd0cnVuY2F0ZXdvcmRzX2h0bWwgdXBwZXIgbGVuZ3RoIHBob25lMm51bWVyaWMgd29yZHdyYXAgdGltZSBhZGRzbGFzaGVzIHNsdWdpZnkgZmlyc3QgJyArXG4gICAgICAnZXNjYXBlanMgZm9yY2VfZXNjYXBlIGlyaWVuY29kZSBsYXN0IHNhZmUgc2FmZXNlcSB0cnVuY2F0ZWNoYXJzIGxvY2FsaXplIHVubG9jYWxpemUgJyArXG4gICAgICAnbG9jYWx0aW1lIHV0YyB0aW1lem9uZScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtjbGFzc05hbWU6ICdhcmd1bWVudCcsIGJlZ2luOiAnXCInLCBlbmQ6ICdcIid9XG4gICAgXVxuICB9O1xuXG4gIHZhciBESkFOR09fQ09OVEFJTlMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndGVtcGxhdGVfY29tbWVudCcsXG4gICAgICBiZWdpbjogJ3slXFxcXHMqY29tbWVudFxcXFxzKiV9JywgZW5kOiAneyVcXFxccyplbmRjb21tZW50XFxcXHMqJX0nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZV9jb21tZW50JyxcbiAgICAgIGJlZ2luOiAneyMnLCBlbmQ6ICcjfSdcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlX3RhZycsXG4gICAgICBiZWdpbjogJ3slJywgZW5kOiAnJX0nLFxuICAgICAga2V5d29yZHM6XG4gICAgICAgICdjb21tZW50IGVuZGNvbW1lbnQgbG9hZCB0ZW1wbGF0ZXRhZyBpZmNoYW5nZWQgZW5kaWZjaGFuZ2VkIGlmIGVuZGlmIGZpcnN0b2YgZm9yICcgK1xuICAgICAgICAnZW5kZm9yIGluIGlmbm90ZXF1YWwgZW5kaWZub3RlcXVhbCB3aWR0aHJhdGlvIGV4dGVuZHMgaW5jbHVkZSBzcGFjZWxlc3MgJyArXG4gICAgICAgICdlbmRzcGFjZWxlc3MgcmVncm91cCBieSBhcyBpZmVxdWFsIGVuZGlmZXF1YWwgc3NpIG5vdyB3aXRoIGN5Y2xlIHVybCBmaWx0ZXIgJyArXG4gICAgICAgICdlbmRmaWx0ZXIgZGVidWcgYmxvY2sgZW5kYmxvY2sgZWxzZSBhdXRvZXNjYXBlIGVuZGF1dG9lc2NhcGUgY3NyZl90b2tlbiBlbXB0eSBlbGlmICcgK1xuICAgICAgICAnZW5kd2l0aCBzdGF0aWMgdHJhbnMgYmxvY2t0cmFucyBlbmRibG9ja3RyYW5zIGdldF9zdGF0aWNfcHJlZml4IGdldF9tZWRpYV9wcmVmaXggJyArXG4gICAgICAgICdwbHVyYWwgZ2V0X2N1cnJlbnRfbGFuZ3VhZ2UgbGFuZ3VhZ2UgZ2V0X2F2YWlsYWJsZV9sYW5ndWFnZXMgJyArXG4gICAgICAgICdnZXRfY3VycmVudF9sYW5ndWFnZV9iaWRpIGdldF9sYW5ndWFnZV9pbmZvIGdldF9sYW5ndWFnZV9pbmZvX2xpc3QgbG9jYWxpemUgJyArXG4gICAgICAgICdlbmRsb2NhbGl6ZSBsb2NhbHRpbWUgZW5kbG9jYWx0aW1lIHRpbWV6b25lIGVuZHRpbWV6b25lIGdldF9jdXJyZW50X3RpbWV6b25lJyxcbiAgICAgIGNvbnRhaW5zOiBbRklMVEVSXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgYmVnaW46ICd7eycsIGVuZDogJ319JyxcbiAgICAgIGNvbnRhaW5zOiBbRklMVEVSXVxuICAgIH1cbiAgXTtcblxuICB2YXIgcmVzdWx0ID0gY29weShobGpzLkxBTkdVQUdFUy54bWwpO1xuICByZXN1bHQuY2FzZV9pbnNlbnNpdGl2ZSA9IHRydWU7XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGZsb3c6ICdpZiBlbHNlIGdvdG8gZm9yIGluIGRvIGNhbGwgZXhpdCBub3QgZXhpc3QgZXJyb3JsZXZlbCBkZWZpbmVkIGVxdSBuZXEgbHNzIGxlcSBndHIgZ2VxJyxcbiAgICAgIGtleXdvcmQ6ICdzaGlmdCBjZCBkaXIgZWNobyBzZXRsb2NhbCBlbmRsb2NhbCBzZXQgcGF1c2UgY29weScsXG4gICAgICBzdHJlYW06ICdwcm4gbnVsIGxwdDMgbHB0MiBscHQxIGNvbiBjb200IGNvbTMgY29tMiBjb20xIGF1eCcsXG4gICAgICB3aW51dGlsczogJ3BpbmcgbmV0IGlwY29uZmlnIHRhc2traWxsIHhjb3B5IHJlbiBkZWwnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbnZ2YXInLCBiZWdpbjogJyUlW14gXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VudnZhcicsIGJlZ2luOiAnJVteIF0rPyUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbnZ2YXInLCBiZWdpbjogJyFbXiBdKz8hJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICdcXFxcYlxcXFxkKycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnQD9yZW0nLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIHNwZWNpYWxfZnVuY3Rpb25zOlxuICAgICAgICAnc3Bhd24gc3Bhd25fbGluayBzZWxmJyxcbiAgICAgIHJlc2VydmVkOlxuICAgICAgICAnYWZ0ZXIgYW5kIGFuZGFsc298MTAgYmFuZCBiZWdpbiBibm90IGJvciBic2wgYnNyIGJ4b3IgY2FzZSBjYXRjaCBjb25kIGRpdiBlbmQgZnVuIGlmICcgK1xuICAgICAgICAnbGV0IG5vdCBvZiBvciBvcmVsc2V8MTAgcXVlcnkgcmVjZWl2ZSByZW0gdHJ5IHdoZW4geG9yJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJvbXB0JywgYmVnaW46ICdeWzAtOV0rPiAnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICclJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoXFxcXGQrI1thLWZBLUYwLTldK3xcXFxcZCsoXFxcXC5cXFxcZCspPyhbZUVdWy0rXT9cXFxcZCspPyknLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsIGJlZ2luOiAnXFxcXD8oOjopPyhbQS1aXVxcXFx3Kig6Oik/KSsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhcnJvdycsIGJlZ2luOiAnLT4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdvaycsIGJlZ2luOiAnb2snXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdleGNsYW1hdGlvbl9tYXJrJywgYmVnaW46ICchJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb25fb3JfYXRvbScsXG4gICAgICAgIGJlZ2luOiAnKFxcXFxiW2EtelxcJ11bYS16QS1aMC05X1xcJ10qOlthLXpcXCddW2EtekEtWjAtOV9cXCddKil8KFxcXFxiW2EtelxcJ11bYS16QS1aMC05X1xcJ10qKScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1tBLVpdW2EtekEtWjAtOV9cXCddKicsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBCQVNJQ19BVE9NX1JFID0gJ1thLXpcXCddW2EtekEtWjAtOV9cXCddKic7XG4gIHZhciBGVU5DVElPTl9OQU1FX1JFID0gJygnICsgQkFTSUNfQVRPTV9SRSArICc6JyArIEJBU0lDX0FUT01fUkUgKyAnfCcgKyBCQVNJQ19BVE9NX1JFICsgJyknO1xuICB2YXIgRVJMQU5HX1JFU0VSVkVEID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnYWZ0ZXIgYW5kIGFuZGFsc298MTAgYmFuZCBiZWdpbiBibm90IGJvciBic2wgYnpyIGJ4b3IgY2FzZSBjYXRjaCBjb25kIGRpdiBlbmQgZnVuIGxldCAnICtcbiAgICAgICdub3Qgb2Ygb3JlbHNlfDEwIHF1ZXJ5IHJlY2VpdmUgcmVtIHRyeSB3aGVuIHhvcicsXG4gICAgbGl0ZXJhbDpcbiAgICAgICdmYWxzZSB0cnVlJ1xuICB9O1xuXG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnJScsIGVuZDogJyQnLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46ICdcXFxcYihcXFxcZCsjW2EtZkEtRjAtOV0rfFxcXFxkKyhcXFxcLlxcXFxkKyk/KFtlRV1bLStdP1xcXFxkKyk/KScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBOQU1FRF9GVU4gPSB7XG4gICAgYmVnaW46ICdmdW5cXFxccysnICsgQkFTSUNfQVRPTV9SRSArICcvXFxcXGQrJ1xuICB9O1xuICB2YXIgRlVOQ1RJT05fQ0FMTCA9IHtcbiAgICBiZWdpbjogRlVOQ1RJT05fTkFNRV9SRSArICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb25fbmFtZScsIGJlZ2luOiBGVU5DVElPTl9OQU1FX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAvLyBcImNvbnRhaW5zXCIgZGVmaW5lZCBsYXRlclxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgdmFyIFRVUExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3R1cGxlJyxcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICByZWxldmFuY2U6IDBcbiAgICAvLyBcImNvbnRhaW5zXCIgZGVmaW5lZCBsYXRlclxuICB9O1xuICB2YXIgVkFSMSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdcXFxcYl8oW0EtWl1bQS1aYS16MC05X10qKT8nLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgVkFSMiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdbQS1aXVthLXpBLVowLTlfXSonLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgUkVDT1JEX0FDQ0VTUyA9IHtcbiAgICBiZWdpbjogJyMnLCBlbmQ6ICd9JyxcbiAgICBpbGxlZ2FsOiAnLicsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlY29yZF9uYW1lJyxcbiAgICAgICAgYmVnaW46ICcjJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ3snLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIC8vIFwiY29udGFpbnNcIiBkZWZpbmVkIGxhdGVyXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIHZhciBCTE9DS19TVEFURU1FTlRTID0ge1xuICAgIGtleXdvcmRzOiBFUkxBTkdfUkVTRVJWRUQsXG4gICAgYmVnaW46ICcoZnVufHJlY2VpdmV8aWZ8dHJ5fGNhc2UpJywgZW5kOiAnZW5kJ1xuICB9O1xuICBCTE9DS19TVEFURU1FTlRTLmNvbnRhaW5zID0gW1xuICAgIENPTU1FTlQsXG4gICAgTkFNRURfRlVOLFxuICAgIGhsanMuaW5oZXJpdChobGpzLkFQT1NfU1RSSU5HX01PREUsIHtjbGFzc05hbWU6ICcnfSksXG4gICAgQkxPQ0tfU1RBVEVNRU5UUyxcbiAgICBGVU5DVElPTl9DQUxMLFxuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgTlVNQkVSLFxuICAgIFRVUExFLFxuICAgIFZBUjEsIFZBUjIsXG4gICAgUkVDT1JEX0FDQ0VTU1xuICBdO1xuXG4gIHZhciBCQVNJQ19NT0RFUyA9IFtcbiAgICBDT01NRU5ULFxuICAgIE5BTUVEX0ZVTixcbiAgICBCTE9DS19TVEFURU1FTlRTLFxuICAgIEZVTkNUSU9OX0NBTEwsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBOVU1CRVIsXG4gICAgVFVQTEUsXG4gICAgVkFSMSwgVkFSMixcbiAgICBSRUNPUkRfQUNDRVNTXG4gIF07XG4gIEZVTkNUSU9OX0NBTEwuY29udGFpbnNbMV0uY29udGFpbnMgPSBCQVNJQ19NT0RFUztcbiAgVFVQTEUuY29udGFpbnMgPSBCQVNJQ19NT0RFUztcbiAgUkVDT1JEX0FDQ0VTUy5jb250YWluc1sxXS5jb250YWlucyA9IEJBU0lDX01PREVTO1xuXG4gIHZhciBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBCQVNJQ19NT0RFU1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBFUkxBTkdfUkVTRVJWRUQsXG4gICAgaWxsZWdhbDogJyg8L3xcXFxcKj18XFxcXCs9fC09fC89fC9cXFxcKnxcXFxcKi98XFxcXChcXFxcKnxcXFxcKlxcXFwpKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogJ14nICsgQkFTSUNfQVRPTV9SRSArICdcXFxccypcXFxcKCcsIGVuZDogJy0+JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcKHwjfC8vfC9cXFxcKnxcXFxcXFxcXHw6JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBQQVJBTVMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogQkFTSUNfQVRPTV9SRVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnO3xcXFxcLicsXG4gICAgICAgICAga2V5d29yZHM6IEVSTEFOR19SRVNFUlZFRCxcbiAgICAgICAgICBjb250YWluczogQkFTSUNfTU9ERVNcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENPTU1FTlQsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BwJyxcbiAgICAgICAgYmVnaW46ICdeLScsIGVuZDogJ1xcXFwuJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgbGV4ZW1zOiAnLScgKyBobGpzLklERU5UX1JFLFxuICAgICAgICBrZXl3b3JkczpcbiAgICAgICAgICAnLW1vZHVsZSAtcmVjb3JkIC11bmRlZiAtZXhwb3J0IC1pZmRlZiAtaWZuZGVmIC1hdXRob3IgLWNvcHlyaWdodCAtZG9jIC12c24gJyArXG4gICAgICAgICAgJy1pbXBvcnQgLWluY2x1ZGUgLWluY2x1ZGVfbGliIC1jb21waWxlIC1kZWZpbmUgLWVsc2UgLWVuZGlmIC1maWxlIC1iZWhhdmlvdXIgJyArXG4gICAgICAgICAgJy1iZWhhdmlvcicsXG4gICAgICAgIGNvbnRhaW5zOiBbUEFSQU1TXVxuICAgICAgfSxcbiAgICAgIE5VTUJFUixcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBSRUNPUkRfQUNDRVNTLFxuICAgICAgVkFSMSwgVkFSMixcbiAgICAgIFRVUExFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2F0b21pY191aW50IGF0dHJpYnV0ZSBib29sIGJyZWFrIGJ2ZWMyIGJ2ZWMzIGJ2ZWM0IGNhc2UgY2VudHJvaWQgY29oZXJlbnQgY29uc3QgY29udGludWUgZGVmYXVsdCAnICtcbiAgICAgICAgJ2Rpc2NhcmQgZG1hdDIgZG1hdDJ4MiBkbWF0MngzIGRtYXQyeDQgZG1hdDMgZG1hdDN4MiBkbWF0M3gzIGRtYXQzeDQgZG1hdDQgZG1hdDR4MiBkbWF0NHgzICcgK1xuICAgICAgICAnZG1hdDR4NCBkbyBkb3VibGUgZHZlYzIgZHZlYzMgZHZlYzQgZWxzZSBmbGF0IGZsb2F0IGZvciBoaWdocCBpZiBpaW1hZ2UxRCBpaW1hZ2UxREFycmF5ICcgK1xuICAgICAgICAnaWltYWdlMkQgaWltYWdlMkRBcnJheSBpaW1hZ2UyRE1TIGlpbWFnZTJETVNBcnJheSBpaW1hZ2UyRFJlY3QgaWltYWdlM0QgaWltYWdlQnVmZmVyIGlpbWFnZUN1YmUgJyArXG4gICAgICAgICdpaW1hZ2VDdWJlQXJyYXkgaW1hZ2UxRCBpbWFnZTFEQXJyYXkgaW1hZ2UyRCBpbWFnZTJEQXJyYXkgaW1hZ2UyRE1TIGltYWdlMkRNU0FycmF5IGltYWdlMkRSZWN0ICcgK1xuICAgICAgICAnaW1hZ2UzRCBpbWFnZUJ1ZmZlciBpbWFnZUN1YmUgaW1hZ2VDdWJlQXJyYXkgaW4gaW5vdXQgaW50IGludmFyaWFudCBpc2FtcGxlcjFEIGlzYW1wbGVyMURBcnJheSAnICtcbiAgICAgICAgJ2lzYW1wbGVyMkQgaXNhbXBsZXIyREFycmF5IGlzYW1wbGVyMkRNUyBpc2FtcGxlcjJETVNBcnJheSBpc2FtcGxlcjJEUmVjdCBpc2FtcGxlcjNEIGlzYW1wbGVyQnVmZmVyICcgK1xuICAgICAgICAnaXNhbXBsZXJDdWJlIGlzYW1wbGVyQ3ViZUFycmF5IGl2ZWMyIGl2ZWMzIGl2ZWM0IGxheW91dCBsb3dwIG1hdDIgbWF0MngyIG1hdDJ4MyBtYXQyeDQgbWF0MyBtYXQzeDIgJyArXG4gICAgICAgICdtYXQzeDMgbWF0M3g0IG1hdDQgbWF0NHgyIG1hdDR4MyBtYXQ0eDQgbWVkaXVtcCBub3BlcnNwZWN0aXZlIG91dCBwYXRjaCBwcmVjaXNpb24gcmVhZG9ubHkgcmVzdHJpY3QgJyArXG4gICAgICAgICdyZXR1cm4gc2FtcGxlIHNhbXBsZXIxRCBzYW1wbGVyMURBcnJheSBzYW1wbGVyMURBcnJheVNoYWRvdyBzYW1wbGVyMURTaGFkb3cgc2FtcGxlcjJEIHNhbXBsZXIyREFycmF5ICcgK1xuICAgICAgICAnc2FtcGxlcjJEQXJyYXlTaGFkb3cgc2FtcGxlcjJETVMgc2FtcGxlcjJETVNBcnJheSBzYW1wbGVyMkRSZWN0IHNhbXBsZXIyRFJlY3RTaGFkb3cgc2FtcGxlcjJEU2hhZG93ICcgK1xuICAgICAgICAnc2FtcGxlcjNEIHNhbXBsZXJCdWZmZXIgc2FtcGxlckN1YmUgc2FtcGxlckN1YmVBcnJheSBzYW1wbGVyQ3ViZUFycmF5U2hhZG93IHNhbXBsZXJDdWJlU2hhZG93IHNtb290aCAnICtcbiAgICAgICAgJ3N0cnVjdCBzdWJyb3V0aW5lIHN3aXRjaCB1aW1hZ2UxRCB1aW1hZ2UxREFycmF5IHVpbWFnZTJEIHVpbWFnZTJEQXJyYXkgdWltYWdlMkRNUyB1aW1hZ2UyRE1TQXJyYXkgJyArXG4gICAgICAgICd1aW1hZ2UyRFJlY3QgdWltYWdlM0QgdWltYWdlQnVmZmVyIHVpbWFnZUN1YmUgdWltYWdlQ3ViZUFycmF5IHVpbnQgdW5pZm9ybSB1c2FtcGxlcjFEIHVzYW1wbGVyMURBcnJheSAnICtcbiAgICAgICAgJ3VzYW1wbGVyMkQgdXNhbXBsZXIyREFycmF5IHVzYW1wbGVyMkRNUyB1c2FtcGxlcjJETVNBcnJheSB1c2FtcGxlcjJEUmVjdCB1c2FtcGxlcjNEIHVzYW1wbGVyQnVmZmVyICcgK1xuICAgICAgICAndXNhbXBsZXJDdWJlIHVzYW1wbGVyQ3ViZUFycmF5IHV2ZWMyIHV2ZWMzIHV2ZWM0IHZhcnlpbmcgdmVjMiB2ZWMzIHZlYzQgdm9pZCB2b2xhdGlsZSB3aGlsZSB3cml0ZW9ubHknLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdnbF9CYWNrQ29sb3IgZ2xfQmFja0xpZ2h0TW9kZWxQcm9kdWN0IGdsX0JhY2tMaWdodFByb2R1Y3QgZ2xfQmFja01hdGVyaWFsICcgK1xuICAgICAgICAnZ2xfQmFja1NlY29uZGFyeUNvbG9yIGdsX0NsaXBEaXN0YW5jZSBnbF9DbGlwUGxhbmUgZ2xfQ2xpcFZlcnRleCBnbF9Db2xvciAnICtcbiAgICAgICAgJ2dsX0RlcHRoUmFuZ2UgZ2xfRXllUGxhbmVRIGdsX0V5ZVBsYW5lUiBnbF9FeWVQbGFuZVMgZ2xfRXllUGxhbmVUIGdsX0ZvZyBnbF9Gb2dDb29yZCAnICtcbiAgICAgICAgJ2dsX0ZvZ0ZyYWdDb29yZCBnbF9GcmFnQ29sb3IgZ2xfRnJhZ0Nvb3JkIGdsX0ZyYWdEYXRhIGdsX0ZyYWdEZXB0aCBnbF9Gcm9udENvbG9yICcgK1xuICAgICAgICAnZ2xfRnJvbnRGYWNpbmcgZ2xfRnJvbnRMaWdodE1vZGVsUHJvZHVjdCBnbF9Gcm9udExpZ2h0UHJvZHVjdCBnbF9Gcm9udE1hdGVyaWFsICcgK1xuICAgICAgICAnZ2xfRnJvbnRTZWNvbmRhcnlDb2xvciBnbF9JbnN0YW5jZUlEIGdsX0ludm9jYXRpb25JRCBnbF9MYXllciBnbF9MaWdodE1vZGVsICcgK1xuICAgICAgICAnZ2xfTGlnaHRTb3VyY2UgZ2xfTWF4QXRvbWljQ291bnRlckJpbmRpbmdzIGdsX01heEF0b21pY0NvdW50ZXJCdWZmZXJTaXplICcgK1xuICAgICAgICAnZ2xfTWF4Q2xpcERpc3RhbmNlcyBnbF9NYXhDbGlwUGxhbmVzIGdsX01heENvbWJpbmVkQXRvbWljQ291bnRlckJ1ZmZlcnMgJyArXG4gICAgICAgICdnbF9NYXhDb21iaW5lZEF0b21pY0NvdW50ZXJzIGdsX01heENvbWJpbmVkSW1hZ2VVbmlmb3JtcyBnbF9NYXhDb21iaW5lZEltYWdlVW5pdHNBbmRGcmFnbWVudE91dHB1dHMgJyArXG4gICAgICAgICdnbF9NYXhDb21iaW5lZFRleHR1cmVJbWFnZVVuaXRzIGdsX01heERyYXdCdWZmZXJzIGdsX01heEZyYWdtZW50QXRvbWljQ291bnRlckJ1ZmZlcnMgJyArXG4gICAgICAgICdnbF9NYXhGcmFnbWVudEF0b21pY0NvdW50ZXJzIGdsX01heEZyYWdtZW50SW1hZ2VVbmlmb3JtcyBnbF9NYXhGcmFnbWVudElucHV0Q29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heEZyYWdtZW50VW5pZm9ybUNvbXBvbmVudHMgZ2xfTWF4RnJhZ21lbnRVbmlmb3JtVmVjdG9ycyBnbF9NYXhHZW9tZXRyeUF0b21pY0NvdW50ZXJCdWZmZXJzICcgK1xuICAgICAgICAnZ2xfTWF4R2VvbWV0cnlBdG9taWNDb3VudGVycyBnbF9NYXhHZW9tZXRyeUltYWdlVW5pZm9ybXMgZ2xfTWF4R2VvbWV0cnlJbnB1dENvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhHZW9tZXRyeU91dHB1dENvbXBvbmVudHMgZ2xfTWF4R2VvbWV0cnlPdXRwdXRWZXJ0aWNlcyBnbF9NYXhHZW9tZXRyeVRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4R2VvbWV0cnlUb3RhbE91dHB1dENvbXBvbmVudHMgZ2xfTWF4R2VvbWV0cnlVbmlmb3JtQ29tcG9uZW50cyBnbF9NYXhHZW9tZXRyeVZhcnlpbmdDb21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4SW1hZ2VTYW1wbGVzIGdsX01heEltYWdlVW5pdHMgZ2xfTWF4TGlnaHRzIGdsX01heFBhdGNoVmVydGljZXMgZ2xfTWF4UHJvZ3JhbVRleGVsT2Zmc2V0ICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0NvbnRyb2xBdG9taWNDb3VudGVyQnVmZmVycyBnbF9NYXhUZXNzQ29udHJvbEF0b21pY0NvdW50ZXJzIGdsX01heFRlc3NDb250cm9sSW1hZ2VVbmlmb3JtcyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NDb250cm9sSW5wdXRDb21wb25lbnRzIGdsX01heFRlc3NDb250cm9sT3V0cHV0Q29tcG9uZW50cyBnbF9NYXhUZXNzQ29udHJvbFRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0NvbnRyb2xUb3RhbE91dHB1dENvbXBvbmVudHMgZ2xfTWF4VGVzc0NvbnRyb2xVbmlmb3JtQ29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NFdmFsdWF0aW9uQXRvbWljQ291bnRlckJ1ZmZlcnMgZ2xfTWF4VGVzc0V2YWx1YXRpb25BdG9taWNDb3VudGVycyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NFdmFsdWF0aW9uSW1hZ2VVbmlmb3JtcyBnbF9NYXhUZXNzRXZhbHVhdGlvbklucHV0Q29tcG9uZW50cyBnbF9NYXhUZXNzRXZhbHVhdGlvbk91dHB1dENvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzRXZhbHVhdGlvblRleHR1cmVJbWFnZVVuaXRzIGdsX01heFRlc3NFdmFsdWF0aW9uVW5pZm9ybUNvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzR2VuTGV2ZWwgZ2xfTWF4VGVzc1BhdGNoQ29tcG9uZW50cyBnbF9NYXhUZXh0dXJlQ29vcmRzIGdsX01heFRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4VGV4dHVyZVVuaXRzIGdsX01heFZhcnlpbmdDb21wb25lbnRzIGdsX01heFZhcnlpbmdGbG9hdHMgZ2xfTWF4VmFyeWluZ1ZlY3RvcnMgJyArXG4gICAgICAgICdnbF9NYXhWZXJ0ZXhBdG9taWNDb3VudGVyQnVmZmVycyBnbF9NYXhWZXJ0ZXhBdG9taWNDb3VudGVycyBnbF9NYXhWZXJ0ZXhBdHRyaWJzICcgK1xuICAgICAgICAnZ2xfTWF4VmVydGV4SW1hZ2VVbmlmb3JtcyBnbF9NYXhWZXJ0ZXhPdXRwdXRDb21wb25lbnRzIGdsX01heFZlcnRleFRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4VmVydGV4VW5pZm9ybUNvbXBvbmVudHMgZ2xfTWF4VmVydGV4VW5pZm9ybVZlY3RvcnMgZ2xfTWF4Vmlld3BvcnRzIGdsX01pblByb2dyYW1UZXhlbE9mZnNldCcrXG4gICAgICAgICdnbF9Nb2RlbFZpZXdNYXRyaXggZ2xfTW9kZWxWaWV3TWF0cml4SW52ZXJzZSBnbF9Nb2RlbFZpZXdNYXRyaXhJbnZlcnNlVHJhbnNwb3NlICcgK1xuICAgICAgICAnZ2xfTW9kZWxWaWV3TWF0cml4VHJhbnNwb3NlIGdsX01vZGVsVmlld1Byb2plY3Rpb25NYXRyaXggZ2xfTW9kZWxWaWV3UHJvamVjdGlvbk1hdHJpeEludmVyc2UgJyArXG4gICAgICAgICdnbF9Nb2RlbFZpZXdQcm9qZWN0aW9uTWF0cml4SW52ZXJzZVRyYW5zcG9zZSBnbF9Nb2RlbFZpZXdQcm9qZWN0aW9uTWF0cml4VHJhbnNwb3NlICcgK1xuICAgICAgICAnZ2xfTXVsdGlUZXhDb29yZDAgZ2xfTXVsdGlUZXhDb29yZDEgZ2xfTXVsdGlUZXhDb29yZDIgZ2xfTXVsdGlUZXhDb29yZDMgZ2xfTXVsdGlUZXhDb29yZDQgJyArXG4gICAgICAgICdnbF9NdWx0aVRleENvb3JkNSBnbF9NdWx0aVRleENvb3JkNiBnbF9NdWx0aVRleENvb3JkNyBnbF9Ob3JtYWwgZ2xfTm9ybWFsTWF0cml4ICcgK1xuICAgICAgICAnZ2xfTm9ybWFsU2NhbGUgZ2xfT2JqZWN0UGxhbmVRIGdsX09iamVjdFBsYW5lUiBnbF9PYmplY3RQbGFuZVMgZ2xfT2JqZWN0UGxhbmVUIGdsX1BhdGNoVmVydGljZXNJbiAnICtcbiAgICAgICAgJ2dsX1BlclZlcnRleCBnbF9Qb2ludCBnbF9Qb2ludENvb3JkIGdsX1BvaW50U2l6ZSBnbF9Qb3NpdGlvbiBnbF9QcmltaXRpdmVJRCBnbF9QcmltaXRpdmVJREluICcgK1xuICAgICAgICAnZ2xfUHJvamVjdGlvbk1hdHJpeCBnbF9Qcm9qZWN0aW9uTWF0cml4SW52ZXJzZSBnbF9Qcm9qZWN0aW9uTWF0cml4SW52ZXJzZVRyYW5zcG9zZSAnICtcbiAgICAgICAgJ2dsX1Byb2plY3Rpb25NYXRyaXhUcmFuc3Bvc2UgZ2xfU2FtcGxlSUQgZ2xfU2FtcGxlTWFzayBnbF9TYW1wbGVNYXNrSW4gZ2xfU2FtcGxlUG9zaXRpb24gJyArXG4gICAgICAgICdnbF9TZWNvbmRhcnlDb2xvciBnbF9UZXNzQ29vcmQgZ2xfVGVzc0xldmVsSW5uZXIgZ2xfVGVzc0xldmVsT3V0ZXIgZ2xfVGV4Q29vcmQgZ2xfVGV4dHVyZUVudkNvbG9yICcgK1xuICAgICAgICAnZ2xfVGV4dHVyZU1hdHJpeEludmVyc2VUcmFuc3Bvc2UgZ2xfVGV4dHVyZU1hdHJpeFRyYW5zcG9zZSBnbF9WZXJ0ZXggZ2xfVmVydGV4SUQgJyArXG4gICAgICAgICdnbF9WaWV3cG9ydEluZGV4IGdsX2luIGdsX291dCBFbWl0U3RyZWFtVmVydGV4IEVtaXRWZXJ0ZXggRW5kUHJpbWl0aXZlIEVuZFN0cmVhbVByaW1pdGl2ZSAnICtcbiAgICAgICAgJ2FicyBhY29zIGFjb3NoIGFsbCBhbnkgYXNpbiBhc2luaCBhdGFuIGF0YW5oIGF0b21pY0NvdW50ZXIgYXRvbWljQ291bnRlckRlY3JlbWVudCAnICtcbiAgICAgICAgJ2F0b21pY0NvdW50ZXJJbmNyZW1lbnQgYmFycmllciBiaXRDb3VudCBiaXRmaWVsZEV4dHJhY3QgYml0ZmllbGRJbnNlcnQgYml0ZmllbGRSZXZlcnNlICcgK1xuICAgICAgICAnY2VpbCBjbGFtcCBjb3MgY29zaCBjcm9zcyBkRmR4IGRGZHkgZGVncmVlcyBkZXRlcm1pbmFudCBkaXN0YW5jZSBkb3QgZXF1YWwgZXhwIGV4cDIgZmFjZWZvcndhcmQgJyArXG4gICAgICAgICdmaW5kTFNCIGZpbmRNU0IgZmxvYXRCaXRzVG9JbnQgZmxvYXRCaXRzVG9VaW50IGZsb29yIGZtYSBmcmFjdCBmcmV4cCBmdHJhbnNmb3JtIGZ3aWR0aCBncmVhdGVyVGhhbiAnICtcbiAgICAgICAgJ2dyZWF0ZXJUaGFuRXF1YWwgaW1hZ2VBdG9taWNBZGQgaW1hZ2VBdG9taWNBbmQgaW1hZ2VBdG9taWNDb21wU3dhcCBpbWFnZUF0b21pY0V4Y2hhbmdlICcgK1xuICAgICAgICAnaW1hZ2VBdG9taWNNYXggaW1hZ2VBdG9taWNNaW4gaW1hZ2VBdG9taWNPciBpbWFnZUF0b21pY1hvciBpbWFnZUxvYWQgaW1hZ2VTdG9yZSBpbXVsRXh0ZW5kZWQgJyArXG4gICAgICAgICdpbnRCaXRzVG9GbG9hdCBpbnRlcnBvbGF0ZUF0Q2VudHJvaWQgaW50ZXJwb2xhdGVBdE9mZnNldCBpbnRlcnBvbGF0ZUF0U2FtcGxlIGludmVyc2UgaW52ZXJzZXNxcnQgJyArXG4gICAgICAgICdpc2luZiBpc25hbiBsZGV4cCBsZW5ndGggbGVzc1RoYW4gbGVzc1RoYW5FcXVhbCBsb2cgbG9nMiBtYXRyaXhDb21wTXVsdCBtYXggbWVtb3J5QmFycmllciAnICtcbiAgICAgICAgJ21pbiBtaXggbW9kIG1vZGYgbm9pc2UxIG5vaXNlMiBub2lzZTMgbm9pc2U0IG5vcm1hbGl6ZSBub3Qgbm90RXF1YWwgb3V0ZXJQcm9kdWN0IHBhY2tEb3VibGUyeDMyICcgK1xuICAgICAgICAncGFja0hhbGYyeDE2IHBhY2tTbm9ybTJ4MTYgcGFja1Nub3JtNHg4IHBhY2tVbm9ybTJ4MTYgcGFja1Vub3JtNHg4IHBvdyByYWRpYW5zIHJlZmxlY3QgcmVmcmFjdCAnICtcbiAgICAgICAgJ3JvdW5kIHJvdW5kRXZlbiBzaGFkb3cxRCBzaGFkb3cxRExvZCBzaGFkb3cxRFByb2ogc2hhZG93MURQcm9qTG9kIHNoYWRvdzJEIHNoYWRvdzJETG9kIHNoYWRvdzJEUHJvaiAnICtcbiAgICAgICAgJ3NoYWRvdzJEUHJvakxvZCBzaWduIHNpbiBzaW5oIHNtb290aHN0ZXAgc3FydCBzdGVwIHRhbiB0YW5oIHRleGVsRmV0Y2ggdGV4ZWxGZXRjaE9mZnNldCB0ZXh0dXJlICcgK1xuICAgICAgICAndGV4dHVyZTFEIHRleHR1cmUxRExvZCB0ZXh0dXJlMURQcm9qIHRleHR1cmUxRFByb2pMb2QgdGV4dHVyZTJEIHRleHR1cmUyRExvZCB0ZXh0dXJlMkRQcm9qICcgK1xuICAgICAgICAndGV4dHVyZTJEUHJvakxvZCB0ZXh0dXJlM0QgdGV4dHVyZTNETG9kIHRleHR1cmUzRFByb2ogdGV4dHVyZTNEUHJvakxvZCB0ZXh0dXJlQ3ViZSB0ZXh0dXJlQ3ViZUxvZCAnICtcbiAgICAgICAgJ3RleHR1cmVHYXRoZXIgdGV4dHVyZUdhdGhlck9mZnNldCB0ZXh0dXJlR2F0aGVyT2Zmc2V0cyB0ZXh0dXJlR3JhZCB0ZXh0dXJlR3JhZE9mZnNldCB0ZXh0dXJlTG9kICcgK1xuICAgICAgICAndGV4dHVyZUxvZE9mZnNldCB0ZXh0dXJlT2Zmc2V0IHRleHR1cmVQcm9qIHRleHR1cmVQcm9qR3JhZCB0ZXh0dXJlUHJvakdyYWRPZmZzZXQgdGV4dHVyZVByb2pMb2QgJyArXG4gICAgICAgICd0ZXh0dXJlUHJvakxvZE9mZnNldCB0ZXh0dXJlUHJvak9mZnNldCB0ZXh0dXJlUXVlcnlMb2QgdGV4dHVyZVNpemUgdHJhbnNwb3NlIHRydW5jIHVhZGRDYXJyeSAnICtcbiAgICAgICAgJ3VpbnRCaXRzVG9GbG9hdCB1bXVsRXh0ZW5kZWQgdW5wYWNrRG91YmxlMngzMiB1bnBhY2tIYWxmMngxNiB1bnBhY2tTbm9ybTJ4MTYgdW5wYWNrU25vcm00eDggJyArXG4gICAgICAgICd1bnBhY2tVbm9ybTJ4MTYgdW5wYWNrVW5vcm00eDggdXN1YkJvcnJvdyBnbF9UZXh0dXJlTWF0cml4IGdsX1RleHR1cmVNYXRyaXhJbnZlcnNlJyxcbiAgICAgIGxpdGVyYWw6ICd0cnVlIGZhbHNlJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJ1wiJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgR09fS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgICdicmVhayBkZWZhdWx0IGZ1bmMgaW50ZXJmYWNlIHNlbGVjdCBjYXNlIG1hcCBzdHJ1Y3QgY2hhbiBlbHNlIGdvdG8gcGFja2FnZSBzd2l0Y2ggJyArXG4gICAgICAnY29uc3QgZmFsbHRocm91Z2ggaWYgcmFuZ2UgdHlwZSBjb250aW51ZSBmb3IgaW1wb3J0IHJldHVybiB2YXIgZ28gZGVmZXInLFxuICAgIGNvbnN0YW50OlxuICAgICAgICd0cnVlIGZhbHNlIGlvdGEgbmlsJyxcbiAgICB0eXBlbmFtZTpcbiAgICAgICdib29sIGJ5dGUgY29tcGxleDY0IGNvbXBsZXgxMjggZmxvYXQzMiBmbG9hdDY0IGludDggaW50MTYgaW50MzIgaW50NjQgc3RyaW5nIHVpbnQ4ICcgK1xuICAgICAgJ3VpbnQxNiB1aW50MzIgdWludDY0IGludCB1aW50IHVpbnRwdHIgcnVuZScsXG4gICAgYnVpbHRfaW46XG4gICAgICAnYXBwZW5kIGNhcCBjbG9zZSBjb21wbGV4IGNvcHkgaW1hZyBsZW4gbWFrZSBuZXcgcGFuaWMgcHJpbnQgcHJpbnRsbiByZWFsIHJlY292ZXIgZGVsZXRlJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBHT19LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdbXlxcXFxcXFxcXVxcJycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnW15hLXpBLVpfMC05XShcXFxcLXxcXFxcKyk/XFxcXGQrKFxcXFwuXFxcXGQrfFxcXFwvXFxcXGQrKT8oKGR8ZXxmfGx8cykoXFxcXCt8XFxcXC0pP1xcXFxkKyk/JyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFRZUEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgYmVnaW46ICdcXFxcYltBLVpdW1xcXFx3XFwnXSonLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ09OVEFJTkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbnRhaW5lcicsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogW1xuICAgICAge2NsYXNzTmFtZTogJ3R5cGUnLCBiZWdpbjogJ1xcXFxiW0EtWl1bXFxcXHddKihcXFxcKChcXFxcLlxcXFwufCx8XFxcXHcrKVxcXFwpKT8nfSxcbiAgICAgIHtjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnW19hLXpdW1xcXFx3XFwnXSonfVxuICAgIF1cbiAgfTtcbiAgdmFyIENPTlRBSU5FUjIgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29udGFpbmVyJyxcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICBjb250YWluczogQ09OVEFJTkVSLmNvbnRhaW5zXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgJ2xldCBpbiBpZiB0aGVuIGVsc2UgY2FzZSBvZiB3aGVyZSBkbyBtb2R1bGUgaW1wb3J0IGhpZGluZyBxdWFsaWZpZWQgdHlwZSBkYXRhICcgK1xuICAgICAgJ25ld3R5cGUgZGVyaXZpbmcgY2xhc3MgaW5zdGFuY2Ugbm90IGFzIGZvcmVpZ24gY2NhbGwgc2FmZSB1bnNhZmUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy0tJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAney0jJywgZW5kOiAnIy19J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnXSxcbiAgICAgICAgYmVnaW46ICd7LScsIGVuZDogJy19J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXFxccytcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2ltcG9ydCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJpbXBvcnQnLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdpbXBvcnQgcXVhbGlmaWVkIGFzIGhpZGluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbQ09OVEFJTkVSXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxXXFxcXC58OydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21vZHVsZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJtb2R1bGUnLCBlbmQ6ICd3aGVyZScsXG4gICAgICAgIGtleXdvcmRzOiAnbW9kdWxlIHdoZXJlJyxcbiAgICAgICAgY29udGFpbnM6IFtDT05UQUlORVJdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFdcXFxcLnw7J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGNsYXNzfGluc3RhbmNlKScsIGVuZDogJ3doZXJlJyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcyB3aGVyZSBpbnN0YW5jZScsXG4gICAgICAgIGNvbnRhaW5zOiBbVFlQRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGVkZWYnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGRhdGF8KG5ldyk/dHlwZSknLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdkYXRhIHR5cGUgbmV3dHlwZSBkZXJpdmluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbVFlQRSwgQ09OVEFJTkVSLCBDT05UQUlORVIyXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2hlYmFuZycsXG4gICAgICAgIGJlZ2luOiAnIyFcXFxcL3VzclxcXFwvYmluXFxcXC9lbnZcXCBydW5oYXNrZWxsJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICBUWVBFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnXltfYS16XVtcXFxcd1xcJ10qJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwidmFyIGhsanMgPSBuZXcgZnVuY3Rpb24oKSB7XG5cbiAgLyogVXRpbGl0eSBmdW5jdGlvbnMgKi9cblxuICBmdW5jdGlvbiBlc2NhcGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvJi9nbSwgJyZhbXA7JykucmVwbGFjZSgvPC9nbSwgJyZsdDsnKS5yZXBsYWNlKC8+L2dtLCAnJmd0OycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluZENvZGUocHJlKSB7XG4gICAgZm9yICh2YXIgbm9kZSA9IHByZS5maXJzdENoaWxkOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZykge1xuICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT0gJ0NPREUnKVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIGlmICghKG5vZGUubm9kZVR5cGUgPT0gMyAmJiBub2RlLm5vZGVWYWx1ZS5tYXRjaCgvXFxzKy8pKSlcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tUZXh0KGJsb2NrLCBpZ25vcmVOZXdMaW5lcykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYmxvY2suY2hpbGROb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gMykge1xuICAgICAgICByZXR1cm4gaWdub3JlTmV3TGluZXMgPyBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9cXG4vZywgJycpIDogbm9kZS5ub2RlVmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PSAnQlInKSB7XG4gICAgICAgIHJldHVybiAnXFxuJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBibG9ja1RleHQobm9kZSwgaWdub3JlTmV3TGluZXMpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tMYW5ndWFnZShibG9jaykge1xuICAgIHZhciBjbGFzc2VzID0gKGJsb2NrLmNsYXNzTmFtZSArICcgJyArIGJsb2NrLnBhcmVudE5vZGUuY2xhc3NOYW1lKS5zcGxpdCgvXFxzKy8pO1xuICAgIGNsYXNzZXMgPSBjbGFzc2VzLm1hcChmdW5jdGlvbihjKSB7cmV0dXJuIGMucmVwbGFjZSgvXmxhbmd1YWdlLS8sICcnKX0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxhbmd1YWdlc1tjbGFzc2VzW2ldXSB8fCBjbGFzc2VzW2ldID09ICduby1oaWdobGlnaHQnKSB7XG4gICAgICAgIHJldHVybiBjbGFzc2VzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qIFN0cmVhbSBtZXJnaW5nICovXG5cbiAgZnVuY3Rpb24gbm9kZVN0cmVhbShub2RlKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIChmdW5jdGlvbiBfbm9kZVN0cmVhbShub2RlLCBvZmZzZXQpIHtcbiAgICAgIGZvciAodmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkOyBjaGlsZDsgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZykge1xuICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT0gMylcbiAgICAgICAgICBvZmZzZXQgKz0gY2hpbGQubm9kZVZhbHVlLmxlbmd0aDtcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT0gJ0JSJylcbiAgICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RhcnQnLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICBub2RlOiBjaGlsZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9mZnNldCA9IF9ub2RlU3RyZWFtKGNoaWxkLCBvZmZzZXQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RvcCcsXG4gICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgIG5vZGU6IGNoaWxkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfSkobm9kZSwgMCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlU3RyZWFtcyhzdHJlYW0xLCBzdHJlYW0yLCB2YWx1ZSkge1xuICAgIHZhciBwcm9jZXNzZWQgPSAwO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgbm9kZVN0YWNrID0gW107XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RTdHJlYW0oKSB7XG4gICAgICBpZiAoc3RyZWFtMS5sZW5ndGggJiYgc3RyZWFtMi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHN0cmVhbTFbMF0ub2Zmc2V0ICE9IHN0cmVhbTJbMF0ub2Zmc2V0KVxuICAgICAgICAgIHJldHVybiAoc3RyZWFtMVswXS5vZmZzZXQgPCBzdHJlYW0yWzBdLm9mZnNldCkgPyBzdHJlYW0xIDogc3RyZWFtMjtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLypcbiAgICAgICAgICBUbyBhdm9pZCBzdGFydGluZyB0aGUgc3RyZWFtIGp1c3QgYmVmb3JlIGl0IHNob3VsZCBzdG9wIHRoZSBvcmRlciBpc1xuICAgICAgICAgIGVuc3VyZWQgdGhhdCBzdHJlYW0xIGFsd2F5cyBzdGFydHMgZmlyc3QgYW5kIGNsb3NlcyBsYXN0OlxuXG4gICAgICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RhcnQnKVxuICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTE7XG4gICAgICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgICAgICByZXR1cm4gc3RyZWFtMjtcbiAgICAgICAgICBpZiAoZXZlbnQxID09ICdzdG9wJyAmJiBldmVudDIgPT0gJ3N0YXJ0JylcbiAgICAgICAgICAgIHJldHVybiBzdHJlYW0xO1xuICAgICAgICAgIGlmIChldmVudDEgPT0gJ3N0b3AnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgICAgICByZXR1cm4gc3RyZWFtMjtcblxuICAgICAgICAgIC4uLiB3aGljaCBpcyBjb2xsYXBzZWQgdG86XG4gICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm4gc3RyZWFtMlswXS5ldmVudCA9PSAnc3RhcnQnID8gc3RyZWFtMSA6IHN0cmVhbTI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdHJlYW0xLmxlbmd0aCA/IHN0cmVhbTEgOiBzdHJlYW0yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9wZW4obm9kZSkge1xuICAgICAgZnVuY3Rpb24gYXR0cl9zdHIoYSkge3JldHVybiAnICcgKyBhLm5vZGVOYW1lICsgJz1cIicgKyBlc2NhcGUoYS52YWx1ZSkgKyAnXCInfTtcbiAgICAgIHJldHVybiAnPCcgKyBub2RlLm5vZGVOYW1lICsgQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKG5vZGUuYXR0cmlidXRlcywgYXR0cl9zdHIpLmpvaW4oJycpICsgJz4nO1xuICAgIH1cblxuICAgIHdoaWxlIChzdHJlYW0xLmxlbmd0aCB8fCBzdHJlYW0yLmxlbmd0aCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBzZWxlY3RTdHJlYW0oKS5zcGxpY2UoMCwgMSlbMF07XG4gICAgICByZXN1bHQgKz0gZXNjYXBlKHZhbHVlLnN1YnN0cihwcm9jZXNzZWQsIGN1cnJlbnQub2Zmc2V0IC0gcHJvY2Vzc2VkKSk7XG4gICAgICBwcm9jZXNzZWQgPSBjdXJyZW50Lm9mZnNldDtcbiAgICAgIGlmICggY3VycmVudC5ldmVudCA9PSAnc3RhcnQnKSB7XG4gICAgICAgIHJlc3VsdCArPSBvcGVuKGN1cnJlbnQubm9kZSk7XG4gICAgICAgIG5vZGVTdGFjay5wdXNoKGN1cnJlbnQubm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQuZXZlbnQgPT0gJ3N0b3AnKSB7XG4gICAgICAgIHZhciBub2RlLCBpID0gbm9kZVN0YWNrLmxlbmd0aDtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGktLTtcbiAgICAgICAgICBub2RlID0gbm9kZVN0YWNrW2ldO1xuICAgICAgICAgIHJlc3VsdCArPSAoJzwvJyArIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArICc+Jyk7XG4gICAgICAgIH0gd2hpbGUgKG5vZGUgIT0gY3VycmVudC5ub2RlKTtcbiAgICAgICAgbm9kZVN0YWNrLnNwbGljZShpLCAxKTtcbiAgICAgICAgd2hpbGUgKGkgPCBub2RlU3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IG9wZW4obm9kZVN0YWNrW2ldKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCArIGVzY2FwZSh2YWx1ZS5zdWJzdHIocHJvY2Vzc2VkKSk7XG4gIH1cblxuICAvKiBJbml0aWFsaXphdGlvbiAqL1xuXG4gIGZ1bmN0aW9uIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSkge1xuXG4gICAgZnVuY3Rpb24gbGFuZ1JlKHZhbHVlLCBnbG9iYWwpIHtcbiAgICAgIHJldHVybiBSZWdFeHAoXG4gICAgICAgIHZhbHVlLFxuICAgICAgICAnbScgKyAobGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKSArIChnbG9iYWwgPyAnZycgOiAnJylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGlsZU1vZGUobW9kZSwgcGFyZW50KSB7XG4gICAgICBpZiAobW9kZS5jb21waWxlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbW9kZS5jb21waWxlZCA9IHRydWU7XG5cbiAgICAgIHZhciBrZXl3b3JkcyA9IFtdOyAvLyB1c2VkIGxhdGVyIHdpdGggYmVnaW5XaXRoS2V5d29yZCBidXQgZmlsbGVkIGFzIGEgc2lkZS1lZmZlY3Qgb2Yga2V5d29yZHMgY29tcGlsYXRpb25cbiAgICAgIGlmIChtb2RlLmtleXdvcmRzKSB7XG4gICAgICAgIHZhciBjb21waWxlZF9rZXl3b3JkcyA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGZsYXR0ZW4oY2xhc3NOYW1lLCBzdHIpIHtcbiAgICAgICAgICBzdHIuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGt3KSB7XG4gICAgICAgICAgICB2YXIgcGFpciA9IGt3LnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICBjb21waWxlZF9rZXl3b3Jkc1twYWlyWzBdXSA9IFtjbGFzc05hbWUsIHBhaXJbMV0gPyBOdW1iZXIocGFpclsxXSkgOiAxXTtcbiAgICAgICAgICAgIGtleXdvcmRzLnB1c2gocGFpclswXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtb2RlLmxleGVtc1JlID0gbGFuZ1JlKG1vZGUubGV4ZW1zIHx8IGhsanMuSURFTlRfUkUsIHRydWUpO1xuICAgICAgICBpZiAodHlwZW9mIG1vZGUua2V5d29yZHMgPT0gJ3N0cmluZycpIHsgLy8gc3RyaW5nXG4gICAgICAgICAgZmxhdHRlbigna2V5d29yZCcsIG1vZGUua2V5d29yZHMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yICh2YXIgY2xhc3NOYW1lIGluIG1vZGUua2V5d29yZHMpIHtcbiAgICAgICAgICAgIGlmICghbW9kZS5rZXl3b3Jkcy5oYXNPd25Qcm9wZXJ0eShjbGFzc05hbWUpKVxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGZsYXR0ZW4oY2xhc3NOYW1lLCBtb2RlLmtleXdvcmRzW2NsYXNzTmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtb2RlLmtleXdvcmRzID0gY29tcGlsZWRfa2V5d29yZHM7XG4gICAgICB9XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGlmIChtb2RlLmJlZ2luV2l0aEtleXdvcmQpIHtcbiAgICAgICAgICBtb2RlLmJlZ2luID0gJ1xcXFxiKCcgKyBrZXl3b3Jkcy5qb2luKCd8JykgKyAnKVxcXFxzJztcbiAgICAgICAgfVxuICAgICAgICBtb2RlLmJlZ2luUmUgPSBsYW5nUmUobW9kZS5iZWdpbiA/IG1vZGUuYmVnaW4gOiAnXFxcXEJ8XFxcXGInKTtcbiAgICAgICAgaWYgKCFtb2RlLmVuZCAmJiAhbW9kZS5lbmRzV2l0aFBhcmVudClcbiAgICAgICAgICBtb2RlLmVuZCA9ICdcXFxcQnxcXFxcYic7XG4gICAgICAgIGlmIChtb2RlLmVuZClcbiAgICAgICAgICBtb2RlLmVuZFJlID0gbGFuZ1JlKG1vZGUuZW5kKTtcbiAgICAgICAgbW9kZS50ZXJtaW5hdG9yX2VuZCA9IG1vZGUuZW5kIHx8ICcnO1xuICAgICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCAmJiBwYXJlbnQudGVybWluYXRvcl9lbmQpXG4gICAgICAgICAgbW9kZS50ZXJtaW5hdG9yX2VuZCArPSAobW9kZS5lbmQgPyAnfCcgOiAnJykgKyBwYXJlbnQudGVybWluYXRvcl9lbmQ7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5pbGxlZ2FsKVxuICAgICAgICBtb2RlLmlsbGVnYWxSZSA9IGxhbmdSZShtb2RlLmlsbGVnYWwpO1xuICAgICAgaWYgKG1vZGUucmVsZXZhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgIG1vZGUucmVsZXZhbmNlID0gMTtcbiAgICAgIGlmICghbW9kZS5jb250YWlucykge1xuICAgICAgICBtb2RlLmNvbnRhaW5zID0gW107XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG1vZGUuY29udGFpbnNbaV0gPT0gJ3NlbGYnKSB7XG4gICAgICAgICAgbW9kZS5jb250YWluc1tpXSA9IG1vZGU7XG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsZU1vZGUobW9kZS5jb250YWluc1tpXSwgbW9kZSk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5zdGFydHMpIHtcbiAgICAgICAgY29tcGlsZU1vZGUobW9kZS5zdGFydHMsIHBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXJtaW5hdG9ycyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlLmNvbnRhaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRlcm1pbmF0b3JzLnB1c2gobW9kZS5jb250YWluc1tpXS5iZWdpbik7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS50ZXJtaW5hdG9yX2VuZCkge1xuICAgICAgICB0ZXJtaW5hdG9ycy5wdXNoKG1vZGUudGVybWluYXRvcl9lbmQpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuaWxsZWdhbCkge1xuICAgICAgICB0ZXJtaW5hdG9ycy5wdXNoKG1vZGUuaWxsZWdhbCk7XG4gICAgICB9XG4gICAgICBtb2RlLnRlcm1pbmF0b3JzID0gdGVybWluYXRvcnMubGVuZ3RoID8gbGFuZ1JlKHRlcm1pbmF0b3JzLmpvaW4oJ3wnKSwgdHJ1ZSkgOiB7ZXhlYzogZnVuY3Rpb24ocykge3JldHVybiBudWxsO319O1xuICAgIH1cblxuICAgIGNvbXBpbGVNb2RlKGxhbmd1YWdlKTtcbiAgfVxuXG4gIC8qXG4gIENvcmUgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uLiBBY2NlcHRzIGEgbGFuZ3VhZ2UgbmFtZSBhbmQgYSBzdHJpbmcgd2l0aCB0aGVcbiAgY29kZSB0byBoaWdobGlnaHQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXG4gIC0gcmVsZXZhbmNlIChpbnQpXG4gIC0ga2V5d29yZF9jb3VudCAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0KGxhbmd1YWdlX25hbWUsIHZhbHVlKSB7XG5cbiAgICBmdW5jdGlvbiBzdWJNb2RlKGxleGVtLCBtb2RlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG1hdGNoID0gbW9kZS5jb250YWluc1tpXS5iZWdpblJlLmV4ZWMobGV4ZW0pO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2guaW5kZXggPT0gMCkge1xuICAgICAgICAgIHJldHVybiBtb2RlLmNvbnRhaW5zW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2ZNb2RlKG1vZGUsIGxleGVtKSB7XG4gICAgICBpZiAobW9kZS5lbmQgJiYgbW9kZS5lbmRSZS50ZXN0KGxleGVtKSkge1xuICAgICAgICByZXR1cm4gbW9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50KSB7XG4gICAgICAgIHJldHVybiBlbmRPZk1vZGUobW9kZS5wYXJlbnQsIGxleGVtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0lsbGVnYWwobGV4ZW0sIG1vZGUpIHtcbiAgICAgIHJldHVybiBtb2RlLmlsbGVnYWwgJiYgbW9kZS5pbGxlZ2FsUmUudGVzdChsZXhlbSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga2V5d29yZE1hdGNoKG1vZGUsIG1hdGNoKSB7XG4gICAgICB2YXIgbWF0Y2hfc3RyID0gbGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/IG1hdGNoWzBdLnRvTG93ZXJDYXNlKCkgOiBtYXRjaFswXTtcbiAgICAgIHJldHVybiBtb2RlLmtleXdvcmRzLmhhc093blByb3BlcnR5KG1hdGNoX3N0cikgJiYgbW9kZS5rZXl3b3Jkc1ttYXRjaF9zdHJdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NLZXl3b3JkcygpIHtcbiAgICAgIHZhciBidWZmZXIgPSBlc2NhcGUobW9kZV9idWZmZXIpO1xuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICB2YXIgbGFzdF9pbmRleCA9IDA7XG4gICAgICB0b3AubGV4ZW1zUmUubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBtYXRjaCA9IHRvcC5sZXhlbXNSZS5leGVjKGJ1ZmZlcik7XG4gICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0ICs9IGJ1ZmZlci5zdWJzdHIobGFzdF9pbmRleCwgbWF0Y2guaW5kZXggLSBsYXN0X2luZGV4KTtcbiAgICAgICAgdmFyIGtleXdvcmRfbWF0Y2ggPSBrZXl3b3JkTWF0Y2godG9wLCBtYXRjaCk7XG4gICAgICAgIGlmIChrZXl3b3JkX21hdGNoKSB7XG4gICAgICAgICAga2V5d29yZF9jb3VudCArPSBrZXl3b3JkX21hdGNoWzFdO1xuICAgICAgICAgIHJlc3VsdCArPSAnPHNwYW4gY2xhc3M9XCInKyBrZXl3b3JkX21hdGNoWzBdICsnXCI+JyArIG1hdGNoWzBdICsgJzwvc3Bhbj4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCArPSBtYXRjaFswXTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0X2luZGV4ID0gdG9wLmxleGVtc1JlLmxhc3RJbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AubGV4ZW1zUmUuZXhlYyhidWZmZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdCArIGJ1ZmZlci5zdWJzdHIobGFzdF9pbmRleCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkge1xuICAgICAgaWYgKHRvcC5zdWJMYW5ndWFnZSAmJiAhbGFuZ3VhZ2VzW3RvcC5zdWJMYW5ndWFnZV0pIHtcbiAgICAgICAgcmV0dXJuIGVzY2FwZShtb2RlX2J1ZmZlcik7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gdG9wLnN1Ykxhbmd1YWdlID8gaGlnaGxpZ2h0KHRvcC5zdWJMYW5ndWFnZSwgbW9kZV9idWZmZXIpIDogaGlnaGxpZ2h0QXV0byhtb2RlX2J1ZmZlcik7XG4gICAgICAvLyBDb3VudGluZyBlbWJlZGRlZCBsYW5ndWFnZSBzY29yZSB0b3dhcmRzIHRoZSBob3N0IGxhbmd1YWdlIG1heSBiZSBkaXNhYmxlZFxuICAgICAgLy8gd2l0aCB6ZXJvaW5nIHRoZSBjb250YWluaW5nIG1vZGUgcmVsZXZhbmNlLiBVc2VjYXNlIGluIHBvaW50IGlzIE1hcmtkb3duIHRoYXRcbiAgICAgIC8vIGFsbG93cyBYTUwgZXZlcnl3aGVyZSBhbmQgbWFrZXMgZXZlcnkgWE1MIHNuaXBwZXQgdG8gaGF2ZSBhIG11Y2ggbGFyZ2VyIE1hcmtkb3duXG4gICAgICAvLyBzY29yZS5cbiAgICAgIGlmICh0b3AucmVsZXZhbmNlID4gMCkge1xuICAgICAgICBrZXl3b3JkX2NvdW50ICs9IHJlc3VsdC5rZXl3b3JkX2NvdW50O1xuICAgICAgICByZWxldmFuY2UgKz0gcmVzdWx0LnJlbGV2YW5jZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgcmVzdWx0Lmxhbmd1YWdlICArICdcIj4nICsgcmVzdWx0LnZhbHVlICsgJzwvc3Bhbj4nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NCdWZmZXIoKSB7XG4gICAgICByZXR1cm4gdG9wLnN1Ykxhbmd1YWdlICE9PSB1bmRlZmluZWQgPyBwcm9jZXNzU3ViTGFuZ3VhZ2UoKSA6IHByb2Nlc3NLZXl3b3JkcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0TmV3TW9kZShtb2RlLCBsZXhlbSkge1xuICAgICAgdmFyIG1hcmt1cCA9IG1vZGUuY2xhc3NOYW1lPyAnPHNwYW4gY2xhc3M9XCInICsgbW9kZS5jbGFzc05hbWUgKyAnXCI+JzogJyc7XG4gICAgICBpZiAobW9kZS5yZXR1cm5CZWdpbikge1xuICAgICAgICByZXN1bHQgKz0gbWFya3VwO1xuICAgICAgICBtb2RlX2J1ZmZlciA9ICcnO1xuICAgICAgfSBlbHNlIGlmIChtb2RlLmV4Y2x1ZGVCZWdpbikge1xuICAgICAgICByZXN1bHQgKz0gZXNjYXBlKGxleGVtKSArIG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCArPSBtYXJrdXA7XG4gICAgICAgIG1vZGVfYnVmZmVyID0gbGV4ZW07XG4gICAgICB9XG4gICAgICB0b3AgPSBPYmplY3QuY3JlYXRlKG1vZGUsIHtwYXJlbnQ6IHt2YWx1ZTogdG9wfX0pO1xuICAgICAgcmVsZXZhbmNlICs9IG1vZGUucmVsZXZhbmNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NMZXhlbShidWZmZXIsIGxleGVtKSB7XG4gICAgICBtb2RlX2J1ZmZlciArPSBidWZmZXI7XG4gICAgICBpZiAobGV4ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld19tb2RlID0gc3ViTW9kZShsZXhlbSwgdG9wKTtcbiAgICAgIGlmIChuZXdfbW9kZSkge1xuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBzdGFydE5ld01vZGUobmV3X21vZGUsIGxleGVtKTtcbiAgICAgICAgcmV0dXJuIG5ld19tb2RlLnJldHVybkJlZ2luID8gMCA6IGxleGVtLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZF9tb2RlID0gZW5kT2ZNb2RlKHRvcCwgbGV4ZW0pO1xuICAgICAgaWYgKGVuZF9tb2RlKSB7XG4gICAgICAgIGlmICghKGVuZF9tb2RlLnJldHVybkVuZCB8fCBlbmRfbW9kZS5leGNsdWRlRW5kKSkge1xuICAgICAgICAgIG1vZGVfYnVmZmVyICs9IGxleGVtO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAodG9wLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICc8L3NwYW4+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgICAgfSB3aGlsZSAodG9wICE9IGVuZF9tb2RlLnBhcmVudCk7XG4gICAgICAgIGlmIChlbmRfbW9kZS5leGNsdWRlRW5kKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IGVzY2FwZShsZXhlbSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgICAgaWYgKGVuZF9tb2RlLnN0YXJ0cykge1xuICAgICAgICAgIHN0YXJ0TmV3TW9kZShlbmRfbW9kZS5zdGFydHMsICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW5kX21vZGUucmV0dXJuRW5kID8gMCA6IGxleGVtLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzSWxsZWdhbChsZXhlbSwgdG9wKSlcbiAgICAgICAgdGhyb3cgJ0lsbGVnYWwnO1xuXG4gICAgICAvKlxuICAgICAgUGFyc2VyIHNob3VsZCBub3QgcmVhY2ggdGhpcyBwb2ludCBhcyBhbGwgdHlwZXMgb2YgbGV4ZW1zIHNob3VsZCBiZSBjYXVnaHRcbiAgICAgIGVhcmxpZXIsIGJ1dCBpZiBpdCBkb2VzIGR1ZSB0byBzb21lIGJ1ZyBtYWtlIHN1cmUgaXQgYWR2YW5jZXMgYXQgbGVhc3Qgb25lXG4gICAgICBjaGFyYWN0ZXIgZm9yd2FyZCB0byBwcmV2ZW50IGluZmluaXRlIGxvb3BpbmcuXG4gICAgICAqL1xuICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW07XG4gICAgICByZXR1cm4gbGV4ZW0ubGVuZ3RoIHx8IDE7XG4gICAgfVxuXG4gICAgdmFyIGxhbmd1YWdlID0gbGFuZ3VhZ2VzW2xhbmd1YWdlX25hbWVdO1xuICAgIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgdmFyIHRvcCA9IGxhbmd1YWdlO1xuICAgIHZhciBtb2RlX2J1ZmZlciA9ICcnO1xuICAgIHZhciByZWxldmFuY2UgPSAwO1xuICAgIHZhciBrZXl3b3JkX2NvdW50ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBtYXRjaCwgY291bnQsIGluZGV4ID0gMDtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRvcC50ZXJtaW5hdG9ycy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AudGVybWluYXRvcnMuZXhlYyh2YWx1ZSk7XG4gICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNvdW50ID0gcHJvY2Vzc0xleGVtKHZhbHVlLnN1YnN0cihpbmRleCwgbWF0Y2guaW5kZXggLSBpbmRleCksIG1hdGNoWzBdKTtcbiAgICAgICAgaW5kZXggPSBtYXRjaC5pbmRleCArIGNvdW50O1xuICAgICAgfVxuICAgICAgcHJvY2Vzc0xleGVtKHZhbHVlLnN1YnN0cihpbmRleCkpXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWxldmFuY2U6IHJlbGV2YW5jZSxcbiAgICAgICAga2V5d29yZF9jb3VudDoga2V5d29yZF9jb3VudCxcbiAgICAgICAgdmFsdWU6IHJlc3VsdCxcbiAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlX25hbWVcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgPT0gJ0lsbGVnYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIGtleXdvcmRfY291bnQ6IDAsXG4gICAgICAgICAgdmFsdWU6IGVzY2FwZSh2YWx1ZSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLypcbiAgSGlnaGxpZ2h0aW5nIHdpdGggbGFuZ3VhZ2UgZGV0ZWN0aW9uLiBBY2NlcHRzIGEgc3RyaW5nIHdpdGggdGhlIGNvZGUgdG9cbiAgaGlnaGxpZ2h0LiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblxuICAtIGxhbmd1YWdlIChkZXRlY3RlZCBsYW5ndWFnZSlcbiAgLSByZWxldmFuY2UgKGludClcbiAgLSBrZXl3b3JkX2NvdW50IChpbnQpXG4gIC0gdmFsdWUgKGFuIEhUTUwgc3RyaW5nIHdpdGggaGlnaGxpZ2h0aW5nIG1hcmt1cClcbiAgLSBzZWNvbmRfYmVzdCAob2JqZWN0IHdpdGggdGhlIHNhbWUgc3RydWN0dXJlIGZvciBzZWNvbmQtYmVzdCBoZXVyaXN0aWNhbGx5XG4gICAgZGV0ZWN0ZWQgbGFuZ3VhZ2UsIG1heSBiZSBhYnNlbnQpXG5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QXV0byh0ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIGtleXdvcmRfY291bnQ6IDAsXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICB2YWx1ZTogZXNjYXBlKHRleHQpXG4gICAgfTtcbiAgICB2YXIgc2Vjb25kX2Jlc3QgPSByZXN1bHQ7XG4gICAgZm9yICh2YXIga2V5IGluIGxhbmd1YWdlcykge1xuICAgICAgaWYgKCFsYW5ndWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgY29udGludWU7XG4gICAgICB2YXIgY3VycmVudCA9IGhpZ2hsaWdodChrZXksIHRleHQpO1xuICAgICAgY3VycmVudC5sYW5ndWFnZSA9IGtleTtcbiAgICAgIGlmIChjdXJyZW50LmtleXdvcmRfY291bnQgKyBjdXJyZW50LnJlbGV2YW5jZSA+IHNlY29uZF9iZXN0LmtleXdvcmRfY291bnQgKyBzZWNvbmRfYmVzdC5yZWxldmFuY2UpIHtcbiAgICAgICAgc2Vjb25kX2Jlc3QgPSBjdXJyZW50O1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQua2V5d29yZF9jb3VudCArIGN1cnJlbnQucmVsZXZhbmNlID4gcmVzdWx0LmtleXdvcmRfY291bnQgKyByZXN1bHQucmVsZXZhbmNlKSB7XG4gICAgICAgIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgICAgICByZXN1bHQgPSBjdXJyZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2Vjb25kX2Jlc3QubGFuZ3VhZ2UpIHtcbiAgICAgIHJlc3VsdC5zZWNvbmRfYmVzdCA9IHNlY29uZF9iZXN0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLypcbiAgUG9zdC1wcm9jZXNzaW5nIG9mIHRoZSBoaWdobGlnaHRlZCBtYXJrdXA6XG5cbiAgLSByZXBsYWNlIFRBQnMgd2l0aCBzb21ldGhpbmcgbW9yZSB1c2VmdWxcbiAgLSByZXBsYWNlIHJlYWwgbGluZS1icmVha3Mgd2l0aCAnPGJyPicgZm9yIG5vbi1wcmUgY29udGFpbmVyc1xuXG4gICovXG4gIGZ1bmN0aW9uIGZpeE1hcmt1cCh2YWx1ZSwgdGFiUmVwbGFjZSwgdXNlQlIpIHtcbiAgICBpZiAodGFiUmVwbGFjZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKCg8W14+XSs+fFxcdCkrKS9nbSwgZnVuY3Rpb24obWF0Y2gsIHAxLCBvZmZzZXQsIHMpIHtcbiAgICAgICAgcmV0dXJuIHAxLnJlcGxhY2UoL1xcdC9nLCB0YWJSZXBsYWNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodXNlQlIpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxuL2csICc8YnI+Jyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qXG4gIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGEgRE9NIG5vZGUgY29udGFpbmluZyBjb2RlLiBBY2NlcHRzIGEgRE9NIG5vZGUgYW5kXG4gIHR3byBvcHRpb25hbCBwYXJhbWV0ZXJzIGZvciBmaXhNYXJrdXAuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEJsb2NrKGJsb2NrLCB0YWJSZXBsYWNlLCB1c2VCUikge1xuICAgIHZhciB0ZXh0ID0gYmxvY2tUZXh0KGJsb2NrLCB1c2VCUik7XG4gICAgdmFyIGxhbmd1YWdlID0gYmxvY2tMYW5ndWFnZShibG9jayk7XG4gICAgaWYgKGxhbmd1YWdlID09ICduby1oaWdobGlnaHQnKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIHJlc3VsdCA9IGxhbmd1YWdlID8gaGlnaGxpZ2h0KGxhbmd1YWdlLCB0ZXh0KSA6IGhpZ2hsaWdodEF1dG8odGV4dCk7XG4gICAgbGFuZ3VhZ2UgPSByZXN1bHQubGFuZ3VhZ2U7XG4gICAgdmFyIG9yaWdpbmFsID0gbm9kZVN0cmVhbShibG9jayk7XG4gICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgdmFyIHByZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ByZScpO1xuICAgICAgcHJlLmlubmVySFRNTCA9IHJlc3VsdC52YWx1ZTtcbiAgICAgIHJlc3VsdC52YWx1ZSA9IG1lcmdlU3RyZWFtcyhvcmlnaW5hbCwgbm9kZVN0cmVhbShwcmUpLCB0ZXh0KTtcbiAgICB9XG4gICAgcmVzdWx0LnZhbHVlID0gZml4TWFya3VwKHJlc3VsdC52YWx1ZSwgdGFiUmVwbGFjZSwgdXNlQlIpO1xuXG4gICAgdmFyIGNsYXNzX25hbWUgPSBibG9jay5jbGFzc05hbWU7XG4gICAgaWYgKCFjbGFzc19uYW1lLm1hdGNoKCcoXFxcXHN8XikobGFuZ3VhZ2UtKT8nICsgbGFuZ3VhZ2UgKyAnKFxcXFxzfCQpJykpIHtcbiAgICAgIGNsYXNzX25hbWUgPSBjbGFzc19uYW1lID8gKGNsYXNzX25hbWUgKyAnICcgKyBsYW5ndWFnZSkgOiBsYW5ndWFnZTtcbiAgICB9XG4gICAgYmxvY2suaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgIGJsb2NrLmNsYXNzTmFtZSA9IGNsYXNzX25hbWU7XG4gICAgYmxvY2sucmVzdWx0ID0ge1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxuICAgICAga3c6IHJlc3VsdC5rZXl3b3JkX2NvdW50LFxuICAgICAgcmU6IHJlc3VsdC5yZWxldmFuY2VcbiAgICB9O1xuICAgIGlmIChyZXN1bHQuc2Vjb25kX2Jlc3QpIHtcbiAgICAgIGJsb2NrLnNlY29uZF9iZXN0ID0ge1xuICAgICAgICBsYW5ndWFnZTogcmVzdWx0LnNlY29uZF9iZXN0Lmxhbmd1YWdlLFxuICAgICAgICBrdzogcmVzdWx0LnNlY29uZF9iZXN0LmtleXdvcmRfY291bnQsXG4gICAgICAgIHJlOiByZXN1bHQuc2Vjb25kX2Jlc3QucmVsZXZhbmNlXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGFsbCA8cHJlPjxjb2RlPi4uPC9jb2RlPjwvcHJlPiBibG9ja3Mgb24gYSBwYWdlLlxuICAqL1xuICBmdW5jdGlvbiBpbml0SGlnaGxpZ2h0aW5nKCkge1xuICAgIGlmIChpbml0SGlnaGxpZ2h0aW5nLmNhbGxlZClcbiAgICAgIHJldHVybjtcbiAgICBpbml0SGlnaGxpZ2h0aW5nLmNhbGxlZCA9IHRydWU7XG4gICAgQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwcmUnKSwgZmluZENvZGUpLlxuICAgICAgZmlsdGVyKEJvb2xlYW4pLlxuICAgICAgZm9yRWFjaChmdW5jdGlvbihjb2RlKXtoaWdobGlnaHRCbG9jayhjb2RlLCBobGpzLnRhYlJlcGxhY2UpfSk7XG4gIH1cblxuICAvKlxuICBBdHRhY2hlcyBoaWdobGlnaHRpbmcgdG8gdGhlIHBhZ2UgbG9hZCBldmVudC5cbiAgKi9cbiAgZnVuY3Rpb24gaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgfVxuXG4gIHZhciBsYW5ndWFnZXMgPSB7fTsgLy8gYSBzaG9ydGN1dCB0byBhdm9pZCB3cml0aW5nIFwidGhpcy5cIiBldmVyeXdoZXJlXG5cbiAgLyogSW50ZXJmYWNlIGRlZmluaXRpb24gKi9cblxuICB0aGlzLkxBTkdVQUdFUyA9IGxhbmd1YWdlcztcbiAgdGhpcy5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gIHRoaXMuaGlnaGxpZ2h0QXV0byA9IGhpZ2hsaWdodEF1dG87XG4gIHRoaXMuZml4TWFya3VwID0gZml4TWFya3VwO1xuICB0aGlzLmhpZ2hsaWdodEJsb2NrID0gaGlnaGxpZ2h0QmxvY2s7XG4gIHRoaXMuaW5pdEhpZ2hsaWdodGluZyA9IGluaXRIaWdobGlnaHRpbmc7XG4gIHRoaXMuaW5pdEhpZ2hsaWdodGluZ09uTG9hZCA9IGluaXRIaWdobGlnaHRpbmdPbkxvYWQ7XG5cbiAgLy8gQ29tbW9uIHJlZ2V4cHNcbiAgdGhpcy5JREVOVF9SRSA9ICdbYS16QS1aXVthLXpBLVowLTlfXSonO1xuICB0aGlzLlVOREVSU0NPUkVfSURFTlRfUkUgPSAnW2EtekEtWl9dW2EtekEtWjAtOV9dKic7XG4gIHRoaXMuTlVNQkVSX1JFID0gJ1xcXFxiXFxcXGQrKFxcXFwuXFxcXGQrKT8nO1xuICB0aGlzLkNfTlVNQkVSX1JFID0gJyhcXFxcYjBbeFhdW2EtZkEtRjAtOV0rfChcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKik/fFxcXFwuXFxcXGQrKShbZUVdWy0rXT9cXFxcZCspPyknOyAvLyAweC4uLiwgMC4uLiwgZGVjaW1hbCwgZmxvYXRcbiAgdGhpcy5CSU5BUllfTlVNQkVSX1JFID0gJ1xcXFxiKDBiWzAxXSspJzsgLy8gMGIuLi5cbiAgdGhpcy5SRV9TVEFSVEVSU19SRSA9ICchfCE9fCE9PXwlfCU9fCZ8JiZ8Jj18XFxcXCp8XFxcXCo9fFxcXFwrfFxcXFwrPXwsfFxcXFwufC18LT18L3wvPXw6fDt8PHw8PHw8PD18PD18PXw9PXw9PT18Pnw+PXw+Pnw+Pj18Pj4+fD4+Pj18XFxcXD98XFxcXFt8XFxcXHt8XFxcXCh8XFxcXF58XFxcXF49fFxcXFx8fFxcXFx8PXxcXFxcfFxcXFx8fH4nO1xuXG4gIC8vIENvbW1vbiBtb2Rlc1xuICB0aGlzLkJBQ0tTTEFTSF9FU0NBUEUgPSB7XG4gICAgYmVnaW46ICdcXFxcXFxcXFtcXFxcc1xcXFxTXScsIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkFQT1NfU1RSSU5HX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW3RoaXMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuUVVPVEVfU1RSSU5HX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFt0aGlzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkNfTElORV9DT01NRU5UX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICcvLycsIGVuZDogJyQnXG4gIH07XG4gIHRoaXMuQ19CTE9DS19DT01NRU5UX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICcvXFxcXConLCBlbmQ6ICdcXFxcKi8nXG4gIH07XG4gIHRoaXMuSEFTSF9DT01NRU5UX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgfTtcbiAgdGhpcy5OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiB0aGlzLk5VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5DX05VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IHRoaXMuQ19OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuQklOQVJZX05VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IHRoaXMuQklOQVJZX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICAvLyBVdGlsaXR5IGZ1bmN0aW9uc1xuICB0aGlzLmluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fVxuICAgIGZvciAodmFyIGtleSBpbiBwYXJlbnQpXG4gICAgICByZXN1bHRba2V5XSA9IHBhcmVudFtrZXldO1xuICAgIGlmIChvYmopXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0oKTtcbmhsanMuTEFOR1VBR0VTWydiYXNoJ10gPSByZXF1aXJlKCcuL2Jhc2guanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydlcmxhbmcnXSA9IHJlcXVpcmUoJy4vZXJsYW5nLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY3MnXSA9IHJlcXVpcmUoJy4vY3MuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydicmFpbmZ1Y2snXSA9IHJlcXVpcmUoJy4vYnJhaW5mdWNrLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncnVieSddID0gcmVxdWlyZSgnLi9ydWJ5LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncnVzdCddID0gcmVxdWlyZSgnLi9ydXN0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncmliJ10gPSByZXF1aXJlKCcuL3JpYi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2RpZmYnXSA9IHJlcXVpcmUoJy4vZGlmZi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2phdmFzY3JpcHQnXSA9IHJlcXVpcmUoJy4vamF2YXNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2dsc2wnXSA9IHJlcXVpcmUoJy4vZ2xzbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3JzbCddID0gcmVxdWlyZSgnLi9yc2wuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydsdWEnXSA9IHJlcXVpcmUoJy4vbHVhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sneG1sJ10gPSByZXF1aXJlKCcuL3htbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ21hcmtkb3duJ10gPSByZXF1aXJlKCcuL21hcmtkb3duLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY3NzJ10gPSByZXF1aXJlKCcuL2Nzcy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2xpc3AnXSA9IHJlcXVpcmUoJy4vbGlzcC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3Byb2ZpbGUnXSA9IHJlcXVpcmUoJy4vcHJvZmlsZS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2h0dHAnXSA9IHJlcXVpcmUoJy4vaHR0cC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2phdmEnXSA9IHJlcXVpcmUoJy4vamF2YS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3BocCddID0gcmVxdWlyZSgnLi9waHAuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydoYXNrZWxsJ10gPSByZXF1aXJlKCcuL2hhc2tlbGwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWycxYyddID0gcmVxdWlyZSgnLi8xYy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3B5dGhvbiddID0gcmVxdWlyZSgnLi9weXRob24uanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydzbWFsbHRhbGsnXSA9IHJlcXVpcmUoJy4vc21hbGx0YWxrLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sndGV4J10gPSByZXF1aXJlKCcuL3RleC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2FjdGlvbnNjcmlwdCddID0gcmVxdWlyZSgnLi9hY3Rpb25zY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydzcWwnXSA9IHJlcXVpcmUoJy4vc3FsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sndmFsYSddID0gcmVxdWlyZSgnLi92YWxhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snaW5pJ10gPSByZXF1aXJlKCcuL2luaS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2QnXSA9IHJlcXVpcmUoJy4vZC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2F4YXB0YSddID0gcmVxdWlyZSgnLi9heGFwdGEuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydwZXJsJ10gPSByZXF1aXJlKCcuL3BlcmwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydzY2FsYSddID0gcmVxdWlyZSgnLi9zY2FsYS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NtYWtlJ10gPSByZXF1aXJlKCcuL2NtYWtlLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snb2JqZWN0aXZlYyddID0gcmVxdWlyZSgnLi9vYmplY3RpdmVjLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYXZyYXNtJ10gPSByZXF1aXJlKCcuL2F2cmFzbS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3ZoZGwnXSA9IHJlcXVpcmUoJy4vdmhkbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NvZmZlZXNjcmlwdCddID0gcmVxdWlyZSgnLi9jb2ZmZWVzY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyduZ2lueCddID0gcmVxdWlyZSgnLi9uZ2lueC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2VybGFuZy1yZXBsJ10gPSByZXF1aXJlKCcuL2VybGFuZy1yZXBsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snciddID0gcmVxdWlyZSgnLi9yLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snanNvbiddID0gcmVxdWlyZSgnLi9qc29uLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZGphbmdvJ10gPSByZXF1aXJlKCcuL2RqYW5nby5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2RlbHBoaSddID0gcmVxdWlyZSgnLi9kZWxwaGkuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyd2YnNjcmlwdCddID0gcmVxdWlyZSgnLi92YnNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ21lbCddID0gcmVxdWlyZSgnLi9tZWwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydkb3MnXSA9IHJlcXVpcmUoJy4vZG9zLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYXBhY2hlJ10gPSByZXF1aXJlKCcuL2FwYWNoZS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2FwcGxlc2NyaXB0J10gPSByZXF1aXJlKCcuL2FwcGxlc2NyaXB0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY3BwJ10gPSByZXF1aXJlKCcuL2NwcC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ21hdGxhYiddID0gcmVxdWlyZSgnLi9tYXRsYWIuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydwYXJzZXIzJ10gPSByZXF1aXJlKCcuL3BhcnNlcjMuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjbG9qdXJlJ10gPSByZXF1aXJlKCcuL2Nsb2p1cmUuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydnbyddID0gcmVxdWlyZSgnLi9nby5qcycpKGhsanMpO1xubW9kdWxlLmV4cG9ydHMgPSBobGpzOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGlsbGVnYWw6ICdcXFxcUycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgYmVnaW46ICdeSFRUUC9bMC05XFxcXC5dKycsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW3tjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJ1xcXFxiXFxcXGR7M31cXFxcYid9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVxdWVzdCcsXG4gICAgICAgIGJlZ2luOiAnXltBLVpdKyAoLio/KSBIVFRQL1swLTlcXFxcLl0rJCcsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICcgJywgZW5kOiAnICcsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXlxcXFx3JywgZW5kOiAnOiAnLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG58XFxcXHN8PScsXG4gICAgICAgIHN0YXJ0czoge2NsYXNzTmFtZTogJ3N0cmluZycsIGVuZDogJyQnfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcblxcXFxuJyxcbiAgICAgICAgc3RhcnRzOiB7c3ViTGFuZ3VhZ2U6ICcnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZX1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICc7JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NldHRpbmcnLFxuICAgICAgICBiZWdpbjogJ15bYS16MC05XFxcXFtcXFxcXV8tXStbIFxcXFx0XSo9WyBcXFxcdF0qJywgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ29uIG9mZiB0cnVlIGZhbHNlIHllcyBubycsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuUVVPVEVfU1RSSU5HX01PREUsIGhsanMuTlVNQkVSX01PREVdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdmYWxzZSBzeW5jaHJvbml6ZWQgaW50IGFic3RyYWN0IGZsb2F0IHByaXZhdGUgY2hhciBib29sZWFuIHN0YXRpYyBudWxsIGlmIGNvbnN0ICcgK1xuICAgICAgJ2ZvciB0cnVlIHdoaWxlIGxvbmcgdGhyb3cgc3RyaWN0ZnAgZmluYWxseSBwcm90ZWN0ZWQgaW1wb3J0IG5hdGl2ZSBmaW5hbCByZXR1cm4gdm9pZCAnICtcbiAgICAgICdlbnVtIGVsc2UgYnJlYWsgdHJhbnNpZW50IG5ldyBjYXRjaCBpbnN0YW5jZW9mIGJ5dGUgc3VwZXIgdm9sYXRpbGUgY2FzZSBhc3NlcnQgc2hvcnQgJyArXG4gICAgICAncGFja2FnZSBkZWZhdWx0IGRvdWJsZSBwdWJsaWMgdHJ5IHRoaXMgc3dpdGNoIGNvbnRpbnVlIHRocm93cycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnamF2YWRvYycsXG4gICAgICAgIGJlZ2luOiAnL1xcXFwqXFxcXConLCBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICdqYXZhZG9jdGFnJywgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICB9XSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzIGltcGxlbWVudHMnLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYW5ub3RhdGlvbicsIGJlZ2luOiAnQFtBLVphLXpdKydcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnaW4gaWYgZm9yIHdoaWxlIGZpbmFsbHkgdmFyIG5ldyBmdW5jdGlvbiBkbyByZXR1cm4gdm9pZCBlbHNlIGJyZWFrIGNhdGNoICcgK1xuICAgICAgICAnaW5zdGFuY2VvZiB3aXRoIHRocm93IGNhc2UgZGVmYXVsdCB0cnkgdGhpcyBzd2l0Y2ggY29udGludWUgdHlwZW9mIGRlbGV0ZSAnICtcbiAgICAgICAgJ2xldCB5aWVsZCBjb25zdCcsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCBOYU4gSW5maW5pdHknXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7IC8vIFwidmFsdWVcIiBjb250YWluZXJcbiAgICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKGNhc2V8cmV0dXJufHRocm93KVxcXFxiKVxcXFxzKicsXG4gICAgICAgIGtleXdvcmRzOiAncmV0dXJuIHRocm93IGNhc2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgICBiZWdpbjogJy8nLCBlbmQ6ICcvW2dpbV0qJyxcbiAgICAgICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgICAgICBjb250YWluczogW3tiZWdpbjogJ1xcXFxcXFxcLyd9XVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyAvLyBFNFhcbiAgICAgICAgICAgIGJlZ2luOiAnPCcsIGVuZDogJz47JyxcbiAgICAgICAgICAgIHN1Ykxhbmd1YWdlOiAneG1sJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnW0EtWmEteiRfXVswLTlBLVphLXokX10qJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbGxlZ2FsOiAnW1wiXFwnXFxcXChdJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxbfCUnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIExJVEVSQUxTID0ge2xpdGVyYWw6ICd0cnVlIGZhbHNlIG51bGwnfTtcbiAgdmFyIFRZUEVTID0gW1xuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gIF07XG4gIHZhciBWQUxVRV9DT05UQUlORVIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgIGVuZDogJywnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTXG4gIH07XG4gIHZhciBPQkpFQ1QgPSB7XG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdcXFxccypcIicsIGVuZDogJ1wiXFxcXHMqOlxcXFxzKicsIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBzdGFydHM6IFZBTFVFX0NPTlRBSU5FUlxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xuICB2YXIgQVJSQVkgPSB7XG4gICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICBjb250YWluczogW2hsanMuaW5oZXJpdChWQUxVRV9DT05UQUlORVIsIHtjbGFzc05hbWU6IG51bGx9KV0sIC8vIGluaGVyaXQgaXMgYWxzbyBhIHdvcmthcm91bmQgZm9yIGEgYnVnIHRoYXQgbWFrZXMgc2hhcmVkIG1vZGVzIHdpdGggZW5kc1dpdGhQYXJlbnQgY29tcGlsZSBvbmx5IHRoZSBlbmRpbmcgb2Ygb25lIG9mIHRoZSBwYXJlbnRzXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xuICBUWVBFUy5zcGxpY2UoVFlQRVMubGVuZ3RoLCAwLCBPQkpFQ1QsIEFSUkFZKTtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTLFxuICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBMSVNQX0lERU5UX1JFID0gJ1thLXpBLVpfXFxcXC1cXFxcK1xcXFwqXFxcXC9cXFxcPFxcXFw9XFxcXD5cXFxcJlxcXFwjXVthLXpBLVowLTlfXFxcXC1cXFxcK1xcXFwqXFxcXC9cXFxcPFxcXFw9XFxcXD5cXFxcJlxcXFwjXSonO1xuICB2YXIgTElTUF9TSU1QTEVfTlVNQkVSX1JFID0gJyhcXFxcLXxcXFxcKyk/XFxcXGQrKFxcXFwuXFxcXGQrfFxcXFwvXFxcXGQrKT8oKGR8ZXxmfGx8cykoXFxcXCt8XFxcXC0pP1xcXFxkKyk/JztcbiAgdmFyIExJVEVSQUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgYmVnaW46ICdcXFxcYih0ezF9fG5pbClcXFxcYidcbiAgfTtcbiAgdmFyIE5VTUJFUlMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46IExJU1BfU0lNUExFX05VTUJFUl9SRVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICcjYlswLTFdKygvWzAtMV0rKT8nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJyNvWzAtN10rKC9bMC03XSspPydcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnI3hbMC05YS1mXSsoL1swLTlhLWZdKyk/J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICcjY1xcXFwoJyArIExJU1BfU0lNUExFX05VTUJFUl9SRSArICcgKycgKyBMSVNQX1NJTVBMRV9OVU1CRVJfUkUsIGVuZDogJ1xcXFwpJ1xuICAgIH1cbiAgXVxuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnOycsIGVuZDogJyQnXG4gIH07XG4gIHZhciBWQVJJQUJMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdcXFxcKicsIGVuZDogJ1xcXFwqJ1xuICB9O1xuICB2YXIgS0VZV09SRCA9IHtcbiAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICBiZWdpbjogJ1s6Jl0nICsgTElTUF9JREVOVF9SRVxuICB9O1xuICB2YXIgUVVPVEVEX0xJU1QgPSB7XG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogWydzZWxmJywgTElURVJBTCwgU1RSSU5HXS5jb25jYXQoTlVNQkVSUylcbiAgfTtcbiAgdmFyIFFVT1RFRDEgPSB7XG4gICAgY2xhc3NOYW1lOiAncXVvdGVkJyxcbiAgICBiZWdpbjogJ1tcXCdgXVxcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBOVU1CRVJTLmNvbmNhdChbU1RSSU5HLCBWQVJJQUJMRSwgS0VZV09SRCwgUVVPVEVEX0xJU1RdKVxuICB9O1xuICB2YXIgUVVPVEVEMiA9IHtcbiAgICBjbGFzc05hbWU6ICdxdW90ZWQnLFxuICAgIGJlZ2luOiAnXFxcXChxdW90ZSAnLCBlbmQ6ICdcXFxcKScsXG4gICAga2V5d29yZHM6IHt0aXRsZTogJ3F1b3RlJ30sXG4gICAgY29udGFpbnM6IE5VTUJFUlMuY29uY2F0KFtTVFJJTkcsIFZBUklBQkxFLCBLRVlXT1JELCBRVU9URURfTElTVF0pXG4gIH07XG4gIHZhciBMSVNUID0ge1xuICAgIGNsYXNzTmFtZTogJ2xpc3QnLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKSdcbiAgfTtcbiAgdmFyIEJPRFkgPSB7XG4gICAgY2xhc3NOYW1lOiAnYm9keScsXG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgfTtcbiAgTElTVC5jb250YWlucyA9IFt7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogTElTUF9JREVOVF9SRX0sIEJPRFldO1xuICBCT0RZLmNvbnRhaW5zID0gW1FVT1RFRDEsIFFVT1RFRDIsIExJU1QsIExJVEVSQUxdLmNvbmNhdChOVU1CRVJTKS5jb25jYXQoW1NUUklORywgQ09NTUVOVCwgVkFSSUFCTEUsIEtFWVdPUkRdKTtcblxuICByZXR1cm4ge1xuICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgY29udGFpbnM6IE5VTUJFUlMuY29uY2F0KFtcbiAgICAgIExJVEVSQUwsXG4gICAgICBTVFJJTkcsXG4gICAgICBDT01NRU5ULFxuICAgICAgUVVPVEVEMSwgUVVPVEVEMixcbiAgICAgIExJU1RcbiAgICBdKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIE9QRU5JTkdfTE9OR19CUkFDS0VUID0gJ1xcXFxbPSpcXFxcWyc7XG4gIHZhciBDTE9TSU5HX0xPTkdfQlJBQ0tFVCA9ICdcXFxcXT0qXFxcXF0nO1xuICB2YXIgTE9OR19CUkFDS0VUUyA9IHtcbiAgICBiZWdpbjogT1BFTklOR19MT05HX0JSQUNLRVQsIGVuZDogQ0xPU0lOR19MT05HX0JSQUNLRVQsXG4gICAgY29udGFpbnM6IFsnc2VsZiddXG4gIH07XG4gIHZhciBDT01NRU5UUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnLS0oPyEnICsgT1BFTklOR19MT05HX0JSQUNLRVQgKyAnKScsIGVuZDogJyQnXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnLS0nICsgT1BFTklOR19MT05HX0JSQUNLRVQsIGVuZDogQ0xPU0lOR19MT05HX0JSQUNLRVQsXG4gICAgICBjb250YWluczogW0xPTkdfQlJBQ0tFVFNdLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH1cbiAgXVxuICByZXR1cm4ge1xuICAgIGxleGVtczogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYW5kIGJyZWFrIGRvIGVsc2UgZWxzZWlmIGVuZCBmYWxzZSBmb3IgaWYgaW4gbG9jYWwgbmlsIG5vdCBvciByZXBlYXQgcmV0dXJuIHRoZW4gJyArXG4gICAgICAgICd0cnVlIHVudGlsIHdoaWxlJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnX0cgX1ZFUlNJT04gYXNzZXJ0IGNvbGxlY3RnYXJiYWdlIGRvZmlsZSBlcnJvciBnZXRmZW52IGdldG1ldGF0YWJsZSBpcGFpcnMgbG9hZCAnICtcbiAgICAgICAgJ2xvYWRmaWxlIGxvYWRzdHJpbmcgbW9kdWxlIG5leHQgcGFpcnMgcGNhbGwgcHJpbnQgcmF3ZXF1YWwgcmF3Z2V0IHJhd3NldCByZXF1aXJlICcgK1xuICAgICAgICAnc2VsZWN0IHNldGZlbnYgc2V0bWV0YXRhYmxlIHRvbnVtYmVyIHRvc3RyaW5nIHR5cGUgdW5wYWNrIHhwY2FsbCBjb3JvdXRpbmUgZGVidWcgJyArXG4gICAgICAgICdpbyBtYXRoIG9zIHBhY2thZ2Ugc3RyaW5nIHRhYmxlJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IENPTU1FTlRTLmNvbmNhdChbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnXFxcXCknLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogJyhbX2EtekEtWl1cXFxcdypcXFxcLikqKFtfYS16QS1aXVxcXFx3KjopP1tfYS16QS1aXVxcXFx3KidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogQ09NTUVOVFNcbiAgICAgICAgICB9XG4gICAgICAgIF0uY29uY2F0KENPTU1FTlRTKVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiBPUEVOSU5HX0xPTkdfQlJBQ0tFVCwgZW5kOiBDTE9TSU5HX0xPTkdfQlJBQ0tFVCxcbiAgICAgICAgY29udGFpbnM6IFtMT05HX0JSQUNLRVRTXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfVxuICAgIF0pXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICAvLyBoaWdobGlnaHQgaGVhZGVyc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ14jezEsM30nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeLis/XFxcXG5bPS1dezIsfSQnXG4gICAgICB9LFxuICAgICAgLy8gaW5saW5lIGh0bWxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc8JywgZW5kOiAnPicsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gbGlzdHMgKGluZGljYXRvcnMgb25seSlcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVsbGV0JyxcbiAgICAgICAgYmVnaW46ICdeKFsqKy1dfChcXFxcZCtcXFxcLikpXFxcXHMrJ1xuICAgICAgfSxcbiAgICAgIC8vIHN0cm9uZyBzZWdtZW50c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJvbmcnLFxuICAgICAgICBiZWdpbjogJ1sqX117Mn0uKz9bKl9dezJ9J1xuICAgICAgfSxcbiAgICAgIC8vIGVtcGhhc2lzIHNlZ21lbnRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VtcGhhc2lzJyxcbiAgICAgICAgYmVnaW46ICdcXFxcKi4rP1xcXFwqJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW1waGFzaXMnLFxuICAgICAgICBiZWdpbjogJ18uKz9fJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gYmxvY2txdW90ZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYmxvY2txdW90ZScsXG4gICAgICAgIGJlZ2luOiAnXj5cXFxccysnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIC8vIGNvZGUgc25pcHBldHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29kZScsXG4gICAgICAgIGJlZ2luOiAnYC4rP2AnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICAgICAgYmVnaW46ICdeICAgICcsIGVuZDogJyQnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBob3Jpem9udGFsIHJ1bGVzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWxfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnXi17Myx9JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICAvLyB1c2luZyBsaW5rcyAtIHRpdGxlIGFuZCBsaW5rXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXFsuKz9cXFxcXVxcXFwoLis/XFxcXCknLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5rX2xhYmVsJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXFsuK1xcXFxdJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua191cmwnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG5cbiAgdmFyIENPTU1PTl9DT05UQUlOUyA9IFtcbiAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCB7YmVnaW46ICdcXCdcXCcnfV0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2JyZWFrIGNhc2UgY2F0Y2ggY2xhc3NkZWYgY29udGludWUgZWxzZSBlbHNlaWYgZW5kIGVudW1lcmF0ZWQgZXZlbnRzIGZvciBmdW5jdGlvbiAnICtcbiAgICAgICAgJ2dsb2JhbCBpZiBtZXRob2RzIG90aGVyd2lzZSBwYXJmb3IgcGVyc2lzdGVudCBwcm9wZXJ0aWVzIHJldHVybiBzcG1kIHN3aXRjaCB0cnkgd2hpbGUnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdzaW4gc2luZCBzaW5oIGFzaW4gYXNpbmQgYXNpbmggY29zIGNvc2QgY29zaCBhY29zIGFjb3NkIGFjb3NoIHRhbiB0YW5kIHRhbmggYXRhbiAnICtcbiAgICAgICAgJ2F0YW5kIGF0YW4yIGF0YW5oIHNlYyBzZWNkIHNlY2ggYXNlYyBhc2VjZCBhc2VjaCBjc2MgY3NjZCBjc2NoIGFjc2MgYWNzY2QgYWNzY2ggY290ICcgK1xuICAgICAgICAnY290ZCBjb3RoIGFjb3QgYWNvdGQgYWNvdGggaHlwb3QgZXhwIGV4cG0xIGxvZyBsb2cxcCBsb2cxMCBsb2cyIHBvdzIgcmVhbHBvdyByZWFsbG9nICcgK1xuICAgICAgICAncmVhbHNxcnQgc3FydCBudGhyb290IG5leHRwb3cyIGFicyBhbmdsZSBjb21wbGV4IGNvbmogaW1hZyByZWFsIHVud3JhcCBpc3JlYWwgJyArXG4gICAgICAgICdjcGx4cGFpciBmaXggZmxvb3IgY2VpbCByb3VuZCBtb2QgcmVtIHNpZ24gYWlyeSBiZXNzZWxqIGJlc3NlbHkgYmVzc2VsaCBiZXNzZWxpICcgK1xuICAgICAgICAnYmVzc2VsayBiZXRhIGJldGFpbmMgYmV0YWxuIGVsbGlwaiBlbGxpcGtlIGVyZiBlcmZjIGVyZmN4IGVyZmludiBleHBpbnQgZ2FtbWEgJyArXG4gICAgICAgICdnYW1tYWluYyBnYW1tYWxuIHBzaSBsZWdlbmRyZSBjcm9zcyBkb3QgZmFjdG9yIGlzcHJpbWUgcHJpbWVzIGdjZCBsY20gcmF0IHJhdHMgcGVybXMgJyArXG4gICAgICAgICduY2hvb3NlayBmYWN0b3JpYWwgY2FydDJzcGggY2FydDJwb2wgcG9sMmNhcnQgc3BoMmNhcnQgaHN2MnJnYiByZ2IyaHN2IHplcm9zIG9uZXMgJyArXG4gICAgICAgICdleWUgcmVwbWF0IHJhbmQgcmFuZG4gbGluc3BhY2UgbG9nc3BhY2UgZnJlcXNwYWNlIG1lc2hncmlkIGFjY3VtYXJyYXkgc2l6ZSBsZW5ndGggJyArXG4gICAgICAgICduZGltcyBudW1lbCBkaXNwIGlzZW1wdHkgaXNlcXVhbCBpc2VxdWFsd2l0aGVxdWFsbmFucyBjYXQgcmVzaGFwZSBkaWFnIGJsa2RpYWcgdHJpbCAnICtcbiAgICAgICAgJ3RyaXUgZmxpcGxyIGZsaXB1ZCBmbGlwZGltIHJvdDkwIGZpbmQgc3ViMmluZCBpbmQyc3ViIGJzeGZ1biBuZGdyaWQgcGVybXV0ZSBpcGVybXV0ZSAnICtcbiAgICAgICAgJ3NoaWZ0ZGltIGNpcmNzaGlmdCBzcXVlZXplIGlzc2NhbGFyIGlzdmVjdG9yIGFucyBlcHMgcmVhbG1heCByZWFsbWluIHBpIGkgaW5mIG5hbiAnICtcbiAgICAgICAgJ2lzbmFuIGlzaW5mIGlzZmluaXRlIGogd2h5IGNvbXBhbiBnYWxsZXJ5IGhhZGFtYXJkIGhhbmtlbCBoaWxiIGludmhpbGIgbWFnaWMgcGFzY2FsICcgK1xuICAgICAgICAncm9zc2VyIHRvZXBsaXR6IHZhbmRlciB3aWxraW5zb24nXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnKC8vfFwifCN8L1xcXFwqfFxcXFxzKy9cXFxcdyspJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RyYW5zcG9zZWRfdmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1thLXpBLVpfXVthLXpBLVpfMC05XSooXFwnK1tcXFxcLlxcJ10qfFtcXFxcLlxcJ10rKScsIGVuZDogJydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21hdHJpeCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXVxcJypbXFxcXC5cXCddKicsXG4gICAgICAgIGNvbnRhaW5zOiBDT01NT05fQ09OVEFJTlNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NlbGwnLFxuICAgICAgICBiZWdpbjogJ1xcXFx7JywgZW5kOiAnXFxcXH1cXCcqW1xcXFwuXFwnXSonLFxuICAgICAgICBjb250YWluczogQ09NTU9OX0NPTlRBSU5TXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcXFxcJScsIGVuZDogJyQnXG4gICAgICB9XG4gICAgXS5jb25jYXQoQ09NTU9OX0NPTlRBSU5TKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdpbnQgZmxvYXQgc3RyaW5nIHZlY3RvciBtYXRyaXggaWYgZWxzZSBzd2l0Y2ggY2FzZSBkZWZhdWx0IHdoaWxlIGRvIGZvciBpbiBicmVhayAnICtcbiAgICAgICdjb250aW51ZSBnbG9iYWwgcHJvYyByZXR1cm4gYWJvdXQgYWJzIGFkZEF0dHIgYWRkQXR0cmlidXRlRWRpdG9yTm9kZUhlbHAgYWRkRHluYW1pYyAnICtcbiAgICAgICdhZGROZXdTaGVsZlRhYiBhZGRQUCBhZGRQYW5lbENhdGVnb3J5IGFkZFByZWZpeFRvTmFtZSBhZHZhbmNlVG9OZXh0RHJpdmVuS2V5ICcgK1xuICAgICAgJ2FmZmVjdGVkTmV0IGFmZmVjdHMgYWltQ29uc3RyYWludCBhaXIgYWxpYXMgYWxpYXNBdHRyIGFsaWduIGFsaWduQ3R4IGFsaWduQ3VydmUgJyArXG4gICAgICAnYWxpZ25TdXJmYWNlIGFsbFZpZXdGaXQgYW1iaWVudExpZ2h0IGFuZ2xlIGFuZ2xlQmV0d2VlbiBhbmltQ29uZSBhbmltQ3VydmVFZGl0b3IgJyArXG4gICAgICAnYW5pbURpc3BsYXkgYW5pbVZpZXcgYW5ub3RhdGUgYXBwZW5kU3RyaW5nQXJyYXkgYXBwbGljYXRpb25OYW1lIGFwcGx5QXR0clByZXNldCAnICtcbiAgICAgICdhcHBseVRha2UgYXJjTGVuRGltQ29udGV4dCBhcmNMZW5ndGhEaW1lbnNpb24gYXJjbGVuIGFycmF5TWFwcGVyIGFydDNkUGFpbnRDdHggJyArXG4gICAgICAnYXJ0QXR0ckN0eCBhcnRBdHRyUGFpbnRWZXJ0ZXhDdHggYXJ0QXR0clNraW5QYWludEN0eCBhcnRBdHRyVG9vbCBhcnRCdWlsZFBhaW50TWVudSAnICtcbiAgICAgICdhcnRGbHVpZEF0dHJDdHggYXJ0UHV0dHlDdHggYXJ0U2VsZWN0Q3R4IGFydFNldFBhaW50Q3R4IGFydFVzZXJQYWludEN0eCBhc3NpZ25Db21tYW5kICcgK1xuICAgICAgJ2Fzc2lnbklucHV0RGV2aWNlIGFzc2lnblZpZXdwb3J0RmFjdG9yaWVzIGF0dGFjaEN1cnZlIGF0dGFjaERldmljZUF0dHIgYXR0YWNoU3VyZmFjZSAnICtcbiAgICAgICdhdHRyQ29sb3JTbGlkZXJHcnAgYXR0ckNvbXBhdGliaWxpdHkgYXR0ckNvbnRyb2xHcnAgYXR0ckVudW1PcHRpb25NZW51ICcgK1xuICAgICAgJ2F0dHJFbnVtT3B0aW9uTWVudUdycCBhdHRyRmllbGRHcnAgYXR0ckZpZWxkU2xpZGVyR3JwIGF0dHJOYXZpZ2F0aW9uQ29udHJvbEdycCAnICtcbiAgICAgICdhdHRyUHJlc2V0RWRpdFdpbiBhdHRyaWJ1dGVFeGlzdHMgYXR0cmlidXRlSW5mbyBhdHRyaWJ1dGVNZW51IGF0dHJpYnV0ZVF1ZXJ5ICcgK1xuICAgICAgJ2F1dG9LZXlmcmFtZSBhdXRvUGxhY2UgYmFrZUNsaXAgYmFrZUZsdWlkU2hhZGluZyBiYWtlUGFydGlhbEhpc3RvcnkgYmFrZVJlc3VsdHMgJyArXG4gICAgICAnYmFrZVNpbXVsYXRpb24gYmFzZW5hbWUgYmFzZW5hbWVFeCBiYXRjaFJlbmRlciBiZXNzZWwgYmV2ZWwgYmV2ZWxQbHVzIGJpbk1lbWJlcnNoaXAgJyArXG4gICAgICAnYmluZFNraW4gYmxlbmQyIGJsZW5kU2hhcGUgYmxlbmRTaGFwZUVkaXRvciBibGVuZFNoYXBlUGFuZWwgYmxlbmRUd29BdHRyIGJsaW5kRGF0YVR5cGUgJyArXG4gICAgICAnYm9uZUxhdHRpY2UgYm91bmRhcnkgYm94RG9sbHlDdHggYm94Wm9vbUN0eCBidWZmZXJDdXJ2ZSBidWlsZEJvb2ttYXJrTWVudSAnICtcbiAgICAgICdidWlsZEtleWZyYW1lTWVudSBidXR0b24gYnV0dG9uTWFuaXAgQ0JHIGNhY2hlRmlsZSBjYWNoZUZpbGVDb21iaW5lIGNhY2hlRmlsZU1lcmdlICcgK1xuICAgICAgJ2NhY2hlRmlsZVRyYWNrIGNhbWVyYSBjYW1lcmFWaWV3IGNhbkNyZWF0ZU1hbmlwIGNhbnZhcyBjYXBpdGFsaXplU3RyaW5nIGNhdGNoICcgK1xuICAgICAgJ2NhdGNoUXVpZXQgY2VpbCBjaGFuZ2VTdWJkaXZDb21wb25lbnREaXNwbGF5TGV2ZWwgY2hhbmdlU3ViZGl2UmVnaW9uIGNoYW5uZWxCb3ggJyArXG4gICAgICAnY2hhcmFjdGVyIGNoYXJhY3Rlck1hcCBjaGFyYWN0ZXJPdXRsaW5lRWRpdG9yIGNoYXJhY3Rlcml6ZSBjaGRpciBjaGVja0JveCBjaGVja0JveEdycCAnICtcbiAgICAgICdjaGVja0RlZmF1bHRSZW5kZXJHbG9iYWxzIGNob2ljZSBjaXJjbGUgY2lyY3VsYXJGaWxsZXQgY2xhbXAgY2xlYXIgY2xlYXJDYWNoZSBjbGlwICcgK1xuICAgICAgJ2NsaXBFZGl0b3IgY2xpcEVkaXRvckN1cnJlbnRUaW1lQ3R4IGNsaXBTY2hlZHVsZSBjbGlwU2NoZWR1bGVyT3V0bGluZXIgY2xpcFRyaW1CZWZvcmUgJyArXG4gICAgICAnY2xvc2VDdXJ2ZSBjbG9zZVN1cmZhY2UgY2x1c3RlciBjbWRGaWxlT3V0cHV0IGNtZFNjcm9sbEZpZWxkRXhlY3V0ZXIgJyArXG4gICAgICAnY21kU2Nyb2xsRmllbGRSZXBvcnRlciBjbWRTaGVsbCBjb2Fyc2VuU3ViZGl2U2VsZWN0aW9uTGlzdCBjb2xsaXNpb24gY29sb3IgJyArXG4gICAgICAnY29sb3JBdFBvaW50IGNvbG9yRWRpdG9yIGNvbG9ySW5kZXggY29sb3JJbmRleFNsaWRlckdycCBjb2xvclNsaWRlckJ1dHRvbkdycCAnICtcbiAgICAgICdjb2xvclNsaWRlckdycCBjb2x1bW5MYXlvdXQgY29tbWFuZEVjaG8gY29tbWFuZExpbmUgY29tbWFuZFBvcnQgY29tcGFjdEhhaXJTeXN0ZW0gJyArXG4gICAgICAnY29tcG9uZW50RWRpdG9yIGNvbXBvc2l0aW5nSW50ZXJvcCBjb21wdXRlUG9seXNldFZvbHVtZSBjb25kaXRpb24gY29uZSBjb25maXJtRGlhbG9nICcgK1xuICAgICAgJ2Nvbm5lY3RBdHRyIGNvbm5lY3RDb250cm9sIGNvbm5lY3REeW5hbWljIGNvbm5lY3RKb2ludCBjb25uZWN0aW9uSW5mbyBjb25zdHJhaW4gJyArXG4gICAgICAnY29uc3RyYWluVmFsdWUgY29uc3RydWN0aW9uSGlzdG9yeSBjb250YWluZXIgY29udGFpbnNNdWx0aWJ5dGUgY29udGV4dEluZm8gY29udHJvbCAnICtcbiAgICAgICdjb252ZXJ0RnJvbU9sZExheWVycyBjb252ZXJ0SWZmVG9Qc2QgY29udmVydExpZ2h0bWFwIGNvbnZlcnRTb2xpZFR4IGNvbnZlcnRUZXNzZWxsYXRpb24gJyArXG4gICAgICAnY29udmVydFVuaXQgY29weUFycmF5IGNvcHlGbGV4b3IgY29weUtleSBjb3B5U2tpbldlaWdodHMgY29zIGNwQnV0dG9uIGNwQ2FjaGUgJyArXG4gICAgICAnY3BDbG90aFNldCBjcENvbGxpc2lvbiBjcENvbnN0cmFpbnQgY3BDb252Q2xvdGhUb01lc2ggY3BGb3JjZXMgY3BHZXRTb2x2ZXJBdHRyIGNwUGFuZWwgJyArXG4gICAgICAnY3BQcm9wZXJ0eSBjcFJpZ2lkQ29sbGlzaW9uRmlsdGVyIGNwU2VhbSBjcFNldEVkaXQgY3BTZXRTb2x2ZXJBdHRyIGNwU29sdmVyICcgK1xuICAgICAgJ2NwU29sdmVyVHlwZXMgY3BUb29sIGNwVXBkYXRlQ2xvdGhVVnMgY3JlYXRlRGlzcGxheUxheWVyIGNyZWF0ZURyYXdDdHggY3JlYXRlRWRpdG9yICcgK1xuICAgICAgJ2NyZWF0ZUxheWVyZWRQc2RGaWxlIGNyZWF0ZU1vdGlvbkZpZWxkIGNyZWF0ZU5ld1NoZWxmIGNyZWF0ZU5vZGUgY3JlYXRlUmVuZGVyTGF5ZXIgJyArXG4gICAgICAnY3JlYXRlU3ViZGl2UmVnaW9uIGNyb3NzIGNyb3NzUHJvZHVjdCBjdHhBYm9ydCBjdHhDb21wbGV0aW9uIGN0eEVkaXRNb2RlIGN0eFRyYXZlcnNlICcgK1xuICAgICAgJ2N1cnJlbnRDdHggY3VycmVudFRpbWUgY3VycmVudFRpbWVDdHggY3VycmVudFVuaXQgY3VycmVudFVuaXQgY3VydmUgY3VydmVBZGRQdEN0eCAnICtcbiAgICAgICdjdXJ2ZUNWQ3R4IGN1cnZlRVBDdHggY3VydmVFZGl0b3JDdHggY3VydmVJbnRlcnNlY3QgY3VydmVNb3ZlRVBDdHggY3VydmVPblN1cmZhY2UgJyArXG4gICAgICAnY3VydmVTa2V0Y2hDdHggY3V0S2V5IGN5Y2xlQ2hlY2sgY3lsaW5kZXIgZGFnUG9zZSBkYXRlIGRlZmF1bHRMaWdodExpc3RDaGVja0JveCAnICtcbiAgICAgICdkZWZhdWx0TmF2aWdhdGlvbiBkZWZpbmVEYXRhU2VydmVyIGRlZmluZVZpcnR1YWxEZXZpY2UgZGVmb3JtZXIgZGVnX3RvX3JhZCBkZWxldGUgJyArXG4gICAgICAnZGVsZXRlQXR0ciBkZWxldGVTaGFkaW5nR3JvdXBzQW5kTWF0ZXJpYWxzIGRlbGV0ZVNoZWxmVGFiIGRlbGV0ZVVJIGRlbGV0ZVVudXNlZEJydXNoZXMgJyArXG4gICAgICAnZGVscmFuZHN0ciBkZXRhY2hDdXJ2ZSBkZXRhY2hEZXZpY2VBdHRyIGRldGFjaFN1cmZhY2UgZGV2aWNlRWRpdG9yIGRldmljZVBhbmVsIGRnSW5mbyAnICtcbiAgICAgICdkZ2RpcnR5IGRnZXZhbCBkZ3RpbWVyIGRpbVdoZW4gZGlyZWN0S2V5Q3R4IGRpcmVjdGlvbmFsTGlnaHQgZGlybWFwIGRpcm5hbWUgZGlzYWJsZSAnICtcbiAgICAgICdkaXNjb25uZWN0QXR0ciBkaXNjb25uZWN0Sm9pbnQgZGlza0NhY2hlIGRpc3BsYWNlbWVudFRvUG9seSBkaXNwbGF5QWZmZWN0ZWQgJyArXG4gICAgICAnZGlzcGxheUNvbG9yIGRpc3BsYXlDdWxsIGRpc3BsYXlMZXZlbE9mRGV0YWlsIGRpc3BsYXlQcmVmIGRpc3BsYXlSR0JDb2xvciAnICtcbiAgICAgICdkaXNwbGF5U21vb3RobmVzcyBkaXNwbGF5U3RhdHMgZGlzcGxheVN0cmluZyBkaXNwbGF5U3VyZmFjZSBkaXN0YW5jZURpbUNvbnRleHQgJyArXG4gICAgICAnZGlzdGFuY2VEaW1lbnNpb24gZG9CbHVyIGRvbGx5IGRvbGx5Q3R4IGRvcGVTaGVldEVkaXRvciBkb3QgZG90UHJvZHVjdCAnICtcbiAgICAgICdkb3VibGVQcm9maWxlQmlyYWlsU3VyZmFjZSBkcmFnIGRyYWdBdHRyQ29udGV4dCBkcmFnZ2VyQ29udGV4dCBkcm9wb2ZmTG9jYXRvciAnICtcbiAgICAgICdkdXBsaWNhdGUgZHVwbGljYXRlQ3VydmUgZHVwbGljYXRlU3VyZmFjZSBkeW5DYWNoZSBkeW5Db250cm9sIGR5bkV4cG9ydCBkeW5FeHByZXNzaW9uICcgK1xuICAgICAgJ2R5bkdsb2JhbHMgZHluUGFpbnRFZGl0b3IgZHluUGFydGljbGVDdHggZHluUHJlZiBkeW5SZWxFZFBhbmVsIGR5blJlbEVkaXRvciAnICtcbiAgICAgICdkeW5hbWljTG9hZCBlZGl0QXR0ckxpbWl0cyBlZGl0RGlzcGxheUxheWVyR2xvYmFscyBlZGl0RGlzcGxheUxheWVyTWVtYmVycyAnICtcbiAgICAgICdlZGl0UmVuZGVyTGF5ZXJBZGp1c3RtZW50IGVkaXRSZW5kZXJMYXllckdsb2JhbHMgZWRpdFJlbmRlckxheWVyTWVtYmVycyBlZGl0b3IgJyArXG4gICAgICAnZWRpdG9yVGVtcGxhdGUgZWZmZWN0b3IgZW1pdCBlbWl0dGVyIGVuYWJsZURldmljZSBlbmNvZGVTdHJpbmcgZW5kU3RyaW5nIGVuZHNXaXRoIGVudiAnICtcbiAgICAgICdlcXVpdmFsZW50IGVxdWl2YWxlbnRUb2wgZXJmIGVycm9yIGV2YWwgZXZhbCBldmFsRGVmZXJyZWQgZXZhbEVjaG8gZXZlbnQgJyArXG4gICAgICAnZXhhY3RXb3JsZEJvdW5kaW5nQm94IGV4Y2x1c2l2ZUxpZ2h0Q2hlY2tCb3ggZXhlYyBleGVjdXRlRm9yRWFjaE9iamVjdCBleGlzdHMgZXhwICcgK1xuICAgICAgJ2V4cHJlc3Npb24gZXhwcmVzc2lvbkVkaXRvckxpc3RlbiBleHRlbmRDdXJ2ZSBleHRlbmRTdXJmYWNlIGV4dHJ1ZGUgZmNoZWNrIGZjbG9zZSBmZW9mICcgK1xuICAgICAgJ2ZmbHVzaCBmZ2V0bGluZSBmZ2V0d29yZCBmaWxlIGZpbGVCcm93c2VyRGlhbG9nIGZpbGVEaWFsb2cgZmlsZUV4dGVuc2lvbiBmaWxlSW5mbyAnICtcbiAgICAgICdmaWxldGVzdCBmaWxsZXRDdXJ2ZSBmaWx0ZXIgZmlsdGVyQ3VydmUgZmlsdGVyRXhwYW5kIGZpbHRlclN0dWRpb0ltcG9ydCAnICtcbiAgICAgICdmaW5kQWxsSW50ZXJzZWN0aW9ucyBmaW5kQW5pbUN1cnZlcyBmaW5kS2V5ZnJhbWUgZmluZE1lbnVJdGVtIGZpbmRSZWxhdGVkU2tpbkNsdXN0ZXIgJyArXG4gICAgICAnZmluZGVyIGZpcnN0UGFyZW50T2YgZml0QnNwbGluZSBmbGV4b3IgZmxvYXRFcSBmbG9hdEZpZWxkIGZsb2F0RmllbGRHcnAgZmxvYXRTY3JvbGxCYXIgJyArXG4gICAgICAnZmxvYXRTbGlkZXIgZmxvYXRTbGlkZXIyIGZsb2F0U2xpZGVyQnV0dG9uR3JwIGZsb2F0U2xpZGVyR3JwIGZsb29yIGZsb3cgZmx1aWRDYWNoZUluZm8gJyArXG4gICAgICAnZmx1aWRFbWl0dGVyIGZsdWlkVm94ZWxJbmZvIGZsdXNoVW5kbyBmbW9kIGZvbnREaWFsb2cgZm9wZW4gZm9ybUxheW91dCBmb3JtYXQgZnByaW50ICcgK1xuICAgICAgJ2ZyYW1lTGF5b3V0IGZyZWFkIGZyZWVGb3JtRmlsbGV0IGZyZXdpbmQgZnJvbU5hdGl2ZVBhdGggZndyaXRlIGdhbW1hIGdhdXNzICcgK1xuICAgICAgJ2dlb21ldHJ5Q29uc3RyYWludCBnZXRBcHBsaWNhdGlvblZlcnNpb25Bc0Zsb2F0IGdldEF0dHIgZ2V0Q2xhc3NpZmljYXRpb24gJyArXG4gICAgICAnZ2V0RGVmYXVsdEJydXNoIGdldEZpbGVMaXN0IGdldEZsdWlkQXR0ciBnZXRJbnB1dERldmljZVJhbmdlIGdldE1heWFQYW5lbFR5cGVzICcgK1xuICAgICAgJ2dldE1vZGlmaWVycyBnZXRQYW5lbCBnZXRQYXJ0aWNsZUF0dHIgZ2V0UGx1Z2luUmVzb3VyY2UgZ2V0ZW52IGdldHBpZCBnbFJlbmRlciAnICtcbiAgICAgICdnbFJlbmRlckVkaXRvciBnbG9iYWxTdGl0Y2ggZ21hdGNoIGdvYWwgZ290b0JpbmRQb3NlIGdyYWJDb2xvciBncmFkaWVudENvbnRyb2wgJyArXG4gICAgICAnZ3JhZGllbnRDb250cm9sTm9BdHRyIGdyYXBoRG9sbHlDdHggZ3JhcGhTZWxlY3RDb250ZXh0IGdyYXBoVHJhY2tDdHggZ3Jhdml0eSBncmlkICcgK1xuICAgICAgJ2dyaWRMYXlvdXQgZ3JvdXAgZ3JvdXBPYmplY3RzQnlOYW1lIEhmQWRkQXR0cmFjdG9yVG9BUyBIZkFzc2lnbkFTIEhmQnVpbGRFcXVhbE1hcCAnICtcbiAgICAgICdIZkJ1aWxkRnVyRmlsZXMgSGZCdWlsZEZ1ckltYWdlcyBIZkNhbmNlbEFGUiBIZkNvbm5lY3RBU1RvSEYgSGZDcmVhdGVBdHRyYWN0b3IgJyArXG4gICAgICAnSGZEZWxldGVBUyBIZkVkaXRBUyBIZlBlcmZvcm1DcmVhdGVBUyBIZlJlbW92ZUF0dHJhY3RvckZyb21BUyBIZlNlbGVjdEF0dGFjaGVkICcgK1xuICAgICAgJ0hmU2VsZWN0QXR0cmFjdG9ycyBIZlVuQXNzaWduQVMgaGFyZGVuUG9pbnRDdXJ2ZSBoYXJkd2FyZSBoYXJkd2FyZVJlbmRlclBhbmVsICcgK1xuICAgICAgJ2hlYWRzVXBEaXNwbGF5IGhlYWRzVXBNZXNzYWdlIGhlbHAgaGVscExpbmUgaGVybWl0ZSBoaWRlIGhpbGl0ZSBoaXRUZXN0IGhvdEJveCBob3RrZXkgJyArXG4gICAgICAnaG90a2V5Q2hlY2sgaHN2X3RvX3JnYiBodWRCdXR0b24gaHVkU2xpZGVyIGh1ZFNsaWRlckJ1dHRvbiBod1JlZmxlY3Rpb25NYXAgaHdSZW5kZXIgJyArXG4gICAgICAnaHdSZW5kZXJMb2FkIGh5cGVyR3JhcGggaHlwZXJQYW5lbCBoeXBlclNoYWRlIGh5cG90IGljb25UZXh0QnV0dG9uIGljb25UZXh0Q2hlY2tCb3ggJyArXG4gICAgICAnaWNvblRleHRSYWRpb0J1dHRvbiBpY29uVGV4dFJhZGlvQ29sbGVjdGlvbiBpY29uVGV4dFNjcm9sbExpc3QgaWNvblRleHRTdGF0aWNMYWJlbCAnICtcbiAgICAgICdpa0hhbmRsZSBpa0hhbmRsZUN0eCBpa0hhbmRsZURpc3BsYXlTY2FsZSBpa1NvbHZlciBpa1NwbGluZUhhbmRsZUN0eCBpa1N5c3RlbSAnICtcbiAgICAgICdpa1N5c3RlbUluZm8gaWtma0Rpc3BsYXlNZXRob2QgaWxsdXN0cmF0b3JDdXJ2ZXMgaW1hZ2UgaW1mUGx1Z2lucyBpbmhlcml0VHJhbnNmb3JtICcgK1xuICAgICAgJ2luc2VydEpvaW50IGluc2VydEpvaW50Q3R4IGluc2VydEtleUN0eCBpbnNlcnRLbm90Q3VydmUgaW5zZXJ0S25vdFN1cmZhY2UgaW5zdGFuY2UgJyArXG4gICAgICAnaW5zdGFuY2VhYmxlIGluc3RhbmNlciBpbnRGaWVsZCBpbnRGaWVsZEdycCBpbnRTY3JvbGxCYXIgaW50U2xpZGVyIGludFNsaWRlckdycCAnICtcbiAgICAgICdpbnRlclRvVUkgaW50ZXJuYWxWYXIgaW50ZXJzZWN0IGlwckVuZ2luZSBpc0FuaW1DdXJ2ZSBpc0Nvbm5lY3RlZCBpc0RpcnR5IGlzUGFyZW50T2YgJyArXG4gICAgICAnaXNTYW1lT2JqZWN0IGlzVHJ1ZSBpc1ZhbGlkT2JqZWN0TmFtZSBpc1ZhbGlkU3RyaW5nIGlzVmFsaWRVaU5hbWUgaXNvbGF0ZVNlbGVjdCAnICtcbiAgICAgICdpdGVtRmlsdGVyIGl0ZW1GaWx0ZXJBdHRyIGl0ZW1GaWx0ZXJSZW5kZXIgaXRlbUZpbHRlclR5cGUgam9pbnQgam9pbnRDbHVzdGVyIGpvaW50Q3R4ICcgK1xuICAgICAgJ2pvaW50RGlzcGxheVNjYWxlIGpvaW50TGF0dGljZSBrZXlUYW5nZW50IGtleWZyYW1lIGtleWZyYW1lT3V0bGluZXIgJyArXG4gICAgICAna2V5ZnJhbWVSZWdpb25DdXJyZW50VGltZUN0eCBrZXlmcmFtZVJlZ2lvbkRpcmVjdEtleUN0eCBrZXlmcmFtZVJlZ2lvbkRvbGx5Q3R4ICcgK1xuICAgICAgJ2tleWZyYW1lUmVnaW9uSW5zZXJ0S2V5Q3R4IGtleWZyYW1lUmVnaW9uTW92ZUtleUN0eCBrZXlmcmFtZVJlZ2lvblNjYWxlS2V5Q3R4ICcgK1xuICAgICAgJ2tleWZyYW1lUmVnaW9uU2VsZWN0S2V5Q3R4IGtleWZyYW1lUmVnaW9uU2V0S2V5Q3R4IGtleWZyYW1lUmVnaW9uVHJhY2tDdHggJyArXG4gICAgICAna2V5ZnJhbWVTdGF0cyBsYXNzb0NvbnRleHQgbGF0dGljZSBsYXR0aWNlRGVmb3JtS2V5Q3R4IGxhdW5jaCBsYXVuY2hJbWFnZUVkaXRvciAnICtcbiAgICAgICdsYXllckJ1dHRvbiBsYXllcmVkU2hhZGVyUG9ydCBsYXllcmVkVGV4dHVyZVBvcnQgbGF5b3V0IGxheW91dERpYWxvZyBsaWdodExpc3QgJyArXG4gICAgICAnbGlnaHRMaXN0RWRpdG9yIGxpZ2h0TGlzdFBhbmVsIGxpZ2h0bGluayBsaW5lSW50ZXJzZWN0aW9uIGxpbmVhclByZWNpc2lvbiBsaW5zdGVwICcgK1xuICAgICAgJ2xpc3RBbmltYXRhYmxlIGxpc3RBdHRyIGxpc3RDYW1lcmFzIGxpc3RDb25uZWN0aW9ucyBsaXN0RGV2aWNlQXR0YWNobWVudHMgbGlzdEhpc3RvcnkgJyArXG4gICAgICAnbGlzdElucHV0RGV2aWNlQXhlcyBsaXN0SW5wdXREZXZpY2VCdXR0b25zIGxpc3RJbnB1dERldmljZXMgbGlzdE1lbnVBbm5vdGF0aW9uICcgK1xuICAgICAgJ2xpc3ROb2RlVHlwZXMgbGlzdFBhbmVsQ2F0ZWdvcmllcyBsaXN0UmVsYXRpdmVzIGxpc3RTZXRzIGxpc3RUcmFuc2Zvcm1zICcgK1xuICAgICAgJ2xpc3RVbnNlbGVjdGVkIGxpc3RlckVkaXRvciBsb2FkRmx1aWQgbG9hZE5ld1NoZWxmIGxvYWRQbHVnaW4gJyArXG4gICAgICAnbG9hZFBsdWdpbkxhbmd1YWdlUmVzb3VyY2VzIGxvYWRQcmVmT2JqZWN0cyBsb2NhbGl6ZWRQYW5lbExhYmVsIGxvY2tOb2RlIGxvZnQgbG9nICcgK1xuICAgICAgJ2xvbmdOYW1lT2YgbG9va1RocnUgbHMgbHNUaHJvdWdoRmlsdGVyIGxzVHlwZSBsc1VJIE1heWF0b21yIG1hZyBtYWtlSWRlbnRpdHkgbWFrZUxpdmUgJyArXG4gICAgICAnbWFrZVBhaW50YWJsZSBtYWtlUm9sbCBtYWtlU2luZ2xlU3VyZmFjZSBtYWtlVHViZU9uIG1ha2Vib3QgbWFuaXBNb3ZlQ29udGV4dCAnICtcbiAgICAgICdtYW5pcE1vdmVMaW1pdHNDdHggbWFuaXBPcHRpb25zIG1hbmlwUm90YXRlQ29udGV4dCBtYW5pcFJvdGF0ZUxpbWl0c0N0eCAnICtcbiAgICAgICdtYW5pcFNjYWxlQ29udGV4dCBtYW5pcFNjYWxlTGltaXRzQ3R4IG1hcmtlciBtYXRjaCBtYXggbWVtb3J5IG1lbnUgbWVudUJhckxheW91dCAnICtcbiAgICAgICdtZW51RWRpdG9yIG1lbnVJdGVtIG1lbnVJdGVtVG9TaGVsZiBtZW51U2V0IG1lbnVTZXRQcmVmIG1lc3NhZ2VMaW5lIG1pbiBtaW5pbWl6ZUFwcCAnICtcbiAgICAgICdtaXJyb3JKb2ludCBtb2RlbEN1cnJlbnRUaW1lQ3R4IG1vZGVsRWRpdG9yIG1vZGVsUGFuZWwgbW91c2UgbW92SW4gbW92T3V0IG1vdmUgJyArXG4gICAgICAnbW92ZUlLdG9GSyBtb3ZlS2V5Q3R4IG1vdmVWZXJ0ZXhBbG9uZ0RpcmVjdGlvbiBtdWx0aVByb2ZpbGVCaXJhaWxTdXJmYWNlIG11dGUgJyArXG4gICAgICAnblBhcnRpY2xlIG5hbWVDb21tYW5kIG5hbWVGaWVsZCBuYW1lc3BhY2UgbmFtZXNwYWNlSW5mbyBuZXdQYW5lbEl0ZW1zIG5ld3RvbiBub2RlQ2FzdCAnICtcbiAgICAgICdub2RlSWNvbkJ1dHRvbiBub2RlT3V0bGluZXIgbm9kZVByZXNldCBub2RlVHlwZSBub2lzZSBub25MaW5lYXIgbm9ybWFsQ29uc3RyYWludCAnICtcbiAgICAgICdub3JtYWxpemUgbnVyYnNCb29sZWFuIG51cmJzQ29weVVWU2V0IG51cmJzQ3ViZSBudXJic0VkaXRVViBudXJic1BsYW5lIG51cmJzU2VsZWN0ICcgK1xuICAgICAgJ251cmJzU3F1YXJlIG51cmJzVG9Qb2x5IG51cmJzVG9Qb2x5Z29uc1ByZWYgbnVyYnNUb1N1YmRpdiBudXJic1RvU3ViZGl2UHJlZiAnICtcbiAgICAgICdudXJic1VWU2V0IG51cmJzVmlld0RpcmVjdGlvblZlY3RvciBvYmpFeGlzdHMgb2JqZWN0Q2VudGVyIG9iamVjdExheWVyIG9iamVjdFR5cGUgJyArXG4gICAgICAnb2JqZWN0VHlwZVVJIG9ic29sZXRlUHJvYyBvY2Vhbk51cmJzUHJldmlld1BsYW5lIG9mZnNldEN1cnZlIG9mZnNldEN1cnZlT25TdXJmYWNlICcgK1xuICAgICAgJ29mZnNldFN1cmZhY2Ugb3BlbkdMRXh0ZW5zaW9uIG9wZW5NYXlhUHJlZiBvcHRpb25NZW51IG9wdGlvbk1lbnVHcnAgb3B0aW9uVmFyIG9yYml0ICcgK1xuICAgICAgJ29yYml0Q3R4IG9yaWVudENvbnN0cmFpbnQgb3V0bGluZXJFZGl0b3Igb3V0bGluZXJQYW5lbCBvdmVycmlkZU1vZGlmaWVyICcgK1xuICAgICAgJ3BhaW50RWZmZWN0c0Rpc3BsYXkgcGFpckJsZW5kIHBhbGV0dGVQb3J0IHBhbmVMYXlvdXQgcGFuZWwgcGFuZWxDb25maWd1cmF0aW9uICcgK1xuICAgICAgJ3BhbmVsSGlzdG9yeSBwYXJhbURpbUNvbnRleHQgcGFyYW1EaW1lbnNpb24gcGFyYW1Mb2NhdG9yIHBhcmVudCBwYXJlbnRDb25zdHJhaW50ICcgK1xuICAgICAgJ3BhcnRpY2xlIHBhcnRpY2xlRXhpc3RzIHBhcnRpY2xlSW5zdGFuY2VyIHBhcnRpY2xlUmVuZGVySW5mbyBwYXJ0aXRpb24gcGFzdGVLZXkgJyArXG4gICAgICAncGF0aEFuaW1hdGlvbiBwYXVzZSBwY2xvc2UgcGVyY2VudCBwZXJmb3JtYW5jZU9wdGlvbnMgcGZ4c3Ryb2tlcyBwaWNrV2FsayBwaWN0dXJlICcgK1xuICAgICAgJ3BpeGVsTW92ZSBwbGFuYXJTcmYgcGxhbmUgcGxheSBwbGF5YmFja09wdGlvbnMgcGxheWJsYXN0IHBsdWdBdHRyIHBsdWdOb2RlIHBsdWdpbkluZm8gJyArXG4gICAgICAncGx1Z2luUmVzb3VyY2VVdGlsIHBvaW50Q29uc3RyYWludCBwb2ludEN1cnZlQ29uc3RyYWludCBwb2ludExpZ2h0IHBvaW50TWF0cml4TXVsdCAnICtcbiAgICAgICdwb2ludE9uQ3VydmUgcG9pbnRPblN1cmZhY2UgcG9pbnRQb3NpdGlvbiBwb2xlVmVjdG9yQ29uc3RyYWludCBwb2x5QXBwZW5kICcgK1xuICAgICAgJ3BvbHlBcHBlbmRGYWNldEN0eCBwb2x5QXBwZW5kVmVydGV4IHBvbHlBdXRvUHJvamVjdGlvbiBwb2x5QXZlcmFnZU5vcm1hbCAnICtcbiAgICAgICdwb2x5QXZlcmFnZVZlcnRleCBwb2x5QmV2ZWwgcG9seUJsZW5kQ29sb3IgcG9seUJsaW5kRGF0YSBwb2x5Qm9vbE9wIHBvbHlCcmlkZ2VFZGdlICcgK1xuICAgICAgJ3BvbHlDYWNoZU1vbml0b3IgcG9seUNoZWNrIHBvbHlDaGlwT2ZmIHBvbHlDbGlwYm9hcmQgcG9seUNsb3NlQm9yZGVyIHBvbHlDb2xsYXBzZUVkZ2UgJyArXG4gICAgICAncG9seUNvbGxhcHNlRmFjZXQgcG9seUNvbG9yQmxpbmREYXRhIHBvbHlDb2xvckRlbCBwb2x5Q29sb3JQZXJWZXJ0ZXggcG9seUNvbG9yU2V0ICcgK1xuICAgICAgJ3BvbHlDb21wYXJlIHBvbHlDb25lIHBvbHlDb3B5VVYgcG9seUNyZWFzZSBwb2x5Q3JlYXNlQ3R4IHBvbHlDcmVhdGVGYWNldCAnICtcbiAgICAgICdwb2x5Q3JlYXRlRmFjZXRDdHggcG9seUN1YmUgcG9seUN1dCBwb2x5Q3V0Q3R4IHBvbHlDeWxpbmRlciBwb2x5Q3lsaW5kcmljYWxQcm9qZWN0aW9uICcgK1xuICAgICAgJ3BvbHlEZWxFZGdlIHBvbHlEZWxGYWNldCBwb2x5RGVsVmVydGV4IHBvbHlEdXBsaWNhdGVBbmRDb25uZWN0IHBvbHlEdXBsaWNhdGVFZGdlICcgK1xuICAgICAgJ3BvbHlFZGl0VVYgcG9seUVkaXRVVlNoZWxsIHBvbHlFdmFsdWF0ZSBwb2x5RXh0cnVkZUVkZ2UgcG9seUV4dHJ1ZGVGYWNldCAnICtcbiAgICAgICdwb2x5RXh0cnVkZVZlcnRleCBwb2x5RmxpcEVkZ2UgcG9seUZsaXBVViBwb2x5Rm9yY2VVViBwb2x5R2VvU2FtcGxlciBwb2x5SGVsaXggJyArXG4gICAgICAncG9seUluZm8gcG9seUluc3RhbGxBY3Rpb24gcG9seUxheW91dFVWIHBvbHlMaXN0Q29tcG9uZW50Q29udmVyc2lvbiBwb2x5TWFwQ3V0ICcgK1xuICAgICAgJ3BvbHlNYXBEZWwgcG9seU1hcFNldyBwb2x5TWFwU2V3TW92ZSBwb2x5TWVyZ2VFZGdlIHBvbHlNZXJnZUVkZ2VDdHggcG9seU1lcmdlRmFjZXQgJyArXG4gICAgICAncG9seU1lcmdlRmFjZXRDdHggcG9seU1lcmdlVVYgcG9seU1lcmdlVmVydGV4IHBvbHlNaXJyb3JGYWNlIHBvbHlNb3ZlRWRnZSAnICtcbiAgICAgICdwb2x5TW92ZUZhY2V0IHBvbHlNb3ZlRmFjZXRVViBwb2x5TW92ZVVWIHBvbHlNb3ZlVmVydGV4IHBvbHlOb3JtYWwgcG9seU5vcm1hbFBlclZlcnRleCAnICtcbiAgICAgICdwb2x5Tm9ybWFsaXplVVYgcG9seU9wdFV2cyBwb2x5T3B0aW9ucyBwb2x5T3V0cHV0IHBvbHlQaXBlIHBvbHlQbGFuYXJQcm9qZWN0aW9uICcgK1xuICAgICAgJ3BvbHlQbGFuZSBwb2x5UGxhdG9uaWNTb2xpZCBwb2x5UG9rZSBwb2x5UHJpbWl0aXZlIHBvbHlQcmlzbSBwb2x5UHJvamVjdGlvbiAnICtcbiAgICAgICdwb2x5UHlyYW1pZCBwb2x5UXVhZCBwb2x5UXVlcnlCbGluZERhdGEgcG9seVJlZHVjZSBwb2x5U2VsZWN0IHBvbHlTZWxlY3RDb25zdHJhaW50ICcgK1xuICAgICAgJ3BvbHlTZWxlY3RDb25zdHJhaW50TW9uaXRvciBwb2x5U2VsZWN0Q3R4IHBvbHlTZWxlY3RFZGl0Q3R4IHBvbHlTZXBhcmF0ZSAnICtcbiAgICAgICdwb2x5U2V0VG9GYWNlTm9ybWFsIHBvbHlTZXdFZGdlIHBvbHlTaG9ydGVzdFBhdGhDdHggcG9seVNtb290aCBwb2x5U29mdEVkZ2UgJyArXG4gICAgICAncG9seVNwaGVyZSBwb2x5U3BoZXJpY2FsUHJvamVjdGlvbiBwb2x5U3BsaXQgcG9seVNwbGl0Q3R4IHBvbHlTcGxpdEVkZ2UgcG9seVNwbGl0UmluZyAnICtcbiAgICAgICdwb2x5U3BsaXRWZXJ0ZXggcG9seVN0cmFpZ2h0ZW5VVkJvcmRlciBwb2x5U3ViZGl2aWRlRWRnZSBwb2x5U3ViZGl2aWRlRmFjZXQgJyArXG4gICAgICAncG9seVRvU3ViZGl2IHBvbHlUb3J1cyBwb2x5VHJhbnNmZXIgcG9seVRyaWFuZ3VsYXRlIHBvbHlVVlNldCBwb2x5VW5pdGUgcG9seVdlZGdlRmFjZSAnICtcbiAgICAgICdwb3BlbiBwb3B1cE1lbnUgcG9zZSBwb3cgcHJlbG9hZFJlZkVkIHByaW50IHByb2dyZXNzQmFyIHByb2dyZXNzV2luZG93IHByb2pGaWxlVmlld2VyICcgK1xuICAgICAgJ3Byb2plY3RDdXJ2ZSBwcm9qZWN0VGFuZ2VudCBwcm9qZWN0aW9uQ29udGV4dCBwcm9qZWN0aW9uTWFuaXAgcHJvbXB0RGlhbG9nIHByb3BNb2RDdHggJyArXG4gICAgICAncHJvcE1vdmUgcHNkQ2hhbm5lbE91dGxpbmVyIHBzZEVkaXRUZXh0dXJlRmlsZSBwc2RFeHBvcnQgcHNkVGV4dHVyZUZpbGUgcHV0ZW52IHB3ZCAnICtcbiAgICAgICdweXRob24gcXVlcnlTdWJkaXYgcXVpdCByYWRfdG9fZGVnIHJhZGlhbCByYWRpb0J1dHRvbiByYWRpb0J1dHRvbkdycCByYWRpb0NvbGxlY3Rpb24gJyArXG4gICAgICAncmFkaW9NZW51SXRlbUNvbGxlY3Rpb24gcmFtcENvbG9yUG9ydCByYW5kIHJhbmRvbWl6ZUZvbGxpY2xlcyByYW5kc3RhdGUgcmFuZ2VDb250cm9sICcgK1xuICAgICAgJ3JlYWRUYWtlIHJlYnVpbGRDdXJ2ZSByZWJ1aWxkU3VyZmFjZSByZWNvcmRBdHRyIHJlY29yZERldmljZSByZWRvIHJlZmVyZW5jZSAnICtcbiAgICAgICdyZWZlcmVuY2VFZGl0IHJlZmVyZW5jZVF1ZXJ5IHJlZmluZVN1YmRpdlNlbGVjdGlvbkxpc3QgcmVmcmVzaCByZWZyZXNoQUUgJyArXG4gICAgICAncmVnaXN0ZXJQbHVnaW5SZXNvdXJjZSByZWhhc2ggcmVsb2FkSW1hZ2UgcmVtb3ZlSm9pbnQgcmVtb3ZlTXVsdGlJbnN0YW5jZSAnICtcbiAgICAgICdyZW1vdmVQYW5lbENhdGVnb3J5IHJlbmFtZSByZW5hbWVBdHRyIHJlbmFtZVNlbGVjdGlvbkxpc3QgcmVuYW1lVUkgcmVuZGVyICcgK1xuICAgICAgJ3JlbmRlckdsb2JhbHNOb2RlIHJlbmRlckluZm8gcmVuZGVyTGF5ZXJCdXR0b24gcmVuZGVyTGF5ZXJQYXJlbnQgJyArXG4gICAgICAncmVuZGVyTGF5ZXJQb3N0UHJvY2VzcyByZW5kZXJMYXllclVucGFyZW50IHJlbmRlck1hbmlwIHJlbmRlclBhcnRpdGlvbiAnICtcbiAgICAgICdyZW5kZXJRdWFsaXR5Tm9kZSByZW5kZXJTZXR0aW5ncyByZW5kZXJUaHVtYm5haWxVcGRhdGUgcmVuZGVyV2luZG93RWRpdG9yICcgK1xuICAgICAgJ3JlbmRlcldpbmRvd1NlbGVjdENvbnRleHQgcmVuZGVyZXIgcmVvcmRlciByZW9yZGVyRGVmb3JtZXJzIHJlcXVpcmVzIHJlcm9vdCAnICtcbiAgICAgICdyZXNhbXBsZUZsdWlkIHJlc2V0QUUgcmVzZXRQZnhUb1BvbHlDYW1lcmEgcmVzZXRUb29sIHJlc29sdXRpb25Ob2RlIHJldGFyZ2V0ICcgK1xuICAgICAgJ3JldmVyc2VDdXJ2ZSByZXZlcnNlU3VyZmFjZSByZXZvbHZlIHJnYl90b19oc3YgcmlnaWRCb2R5IHJpZ2lkU29sdmVyIHJvbGwgcm9sbEN0eCAnICtcbiAgICAgICdyb290T2Ygcm90IHJvdGF0ZSByb3RhdGlvbkludGVycG9sYXRpb24gcm91bmRDb25zdGFudFJhZGl1cyByb3dDb2x1bW5MYXlvdXQgcm93TGF5b3V0ICcgK1xuICAgICAgJ3J1blRpbWVDb21tYW5kIHJ1bnVwIHNhbXBsZUltYWdlIHNhdmVBbGxTaGVsdmVzIHNhdmVBdHRyUHJlc2V0IHNhdmVGbHVpZCBzYXZlSW1hZ2UgJyArXG4gICAgICAnc2F2ZUluaXRpYWxTdGF0ZSBzYXZlTWVudSBzYXZlUHJlZk9iamVjdHMgc2F2ZVByZWZzIHNhdmVTaGVsZiBzYXZlVG9vbFNldHRpbmdzIHNjYWxlICcgK1xuICAgICAgJ3NjYWxlQnJ1c2hCcmlnaHRuZXNzIHNjYWxlQ29tcG9uZW50cyBzY2FsZUNvbnN0cmFpbnQgc2NhbGVLZXkgc2NhbGVLZXlDdHggc2NlbmVFZGl0b3IgJyArXG4gICAgICAnc2NlbmVVSVJlcGxhY2VtZW50IHNjbWggc2NyaXB0Q3R4IHNjcmlwdEVkaXRvckluZm8gc2NyaXB0Sm9iIHNjcmlwdE5vZGUgc2NyaXB0VGFibGUgJyArXG4gICAgICAnc2NyaXB0VG9TaGVsZiBzY3JpcHRlZFBhbmVsIHNjcmlwdGVkUGFuZWxUeXBlIHNjcm9sbEZpZWxkIHNjcm9sbExheW91dCBzY3VscHQgJyArXG4gICAgICAnc2VhcmNoUGF0aEFycmF5IHNlZWQgc2VsTG9hZFNldHRpbmdzIHNlbGVjdCBzZWxlY3RDb250ZXh0IHNlbGVjdEN1cnZlQ1Ygc2VsZWN0S2V5ICcgK1xuICAgICAgJ3NlbGVjdEtleUN0eCBzZWxlY3RLZXlmcmFtZVJlZ2lvbkN0eCBzZWxlY3RNb2RlIHNlbGVjdFByZWYgc2VsZWN0UHJpb3JpdHkgc2VsZWN0VHlwZSAnICtcbiAgICAgICdzZWxlY3RlZE5vZGVzIHNlbGVjdGlvbkNvbm5lY3Rpb24gc2VwYXJhdG9yIHNldEF0dHIgc2V0QXR0ckVudW1SZXNvdXJjZSAnICtcbiAgICAgICdzZXRBdHRyTWFwcGluZyBzZXRBdHRyTmljZU5hbWVSZXNvdXJjZSBzZXRDb25zdHJhaW50UmVzdFBvc2l0aW9uICcgK1xuICAgICAgJ3NldERlZmF1bHRTaGFkaW5nR3JvdXAgc2V0RHJpdmVuS2V5ZnJhbWUgc2V0RHluYW1pYyBzZXRFZGl0Q3R4IHNldEVkaXRvciBzZXRGbHVpZEF0dHIgJyArXG4gICAgICAnc2V0Rm9jdXMgc2V0SW5maW5pdHkgc2V0SW5wdXREZXZpY2VNYXBwaW5nIHNldEtleUN0eCBzZXRLZXlQYXRoIHNldEtleWZyYW1lICcgK1xuICAgICAgJ3NldEtleWZyYW1lQmxlbmRzaGFwZVRhcmdldFd0cyBzZXRNZW51TW9kZSBzZXROb2RlTmljZU5hbWVSZXNvdXJjZSBzZXROb2RlVHlwZUZsYWcgJyArXG4gICAgICAnc2V0UGFyZW50IHNldFBhcnRpY2xlQXR0ciBzZXRQZnhUb1BvbHlDYW1lcmEgc2V0UGx1Z2luUmVzb3VyY2Ugc2V0UHJvamVjdCAnICtcbiAgICAgICdzZXRTdGFtcERlbnNpdHkgc2V0U3RhcnR1cE1lc3NhZ2Ugc2V0U3RhdGUgc2V0VG9vbFRvIHNldFVJVGVtcGxhdGUgc2V0WGZvcm1NYW5pcCBzZXRzICcgK1xuICAgICAgJ3NoYWRpbmdDb25uZWN0aW9uIHNoYWRpbmdHZW9tZXRyeVJlbEN0eCBzaGFkaW5nTGlnaHRSZWxDdHggc2hhZGluZ05ldHdvcmtDb21wYXJlICcgK1xuICAgICAgJ3NoYWRpbmdOb2RlIHNoYXBlQ29tcGFyZSBzaGVsZkJ1dHRvbiBzaGVsZkxheW91dCBzaGVsZlRhYkxheW91dCBzaGVsbEZpZWxkICcgK1xuICAgICAgJ3Nob3J0TmFtZU9mIHNob3dIZWxwIHNob3dIaWRkZW4gc2hvd01hbmlwQ3R4IHNob3dTZWxlY3Rpb25JblRpdGxlICcgK1xuICAgICAgJ3Nob3dTaGFkaW5nR3JvdXBBdHRyRWRpdG9yIHNob3dXaW5kb3cgc2lnbiBzaW1wbGlmeSBzaW4gc2luZ2xlUHJvZmlsZUJpcmFpbFN1cmZhY2UgJyArXG4gICAgICAnc2l6ZSBzaXplQnl0ZXMgc2tpbkNsdXN0ZXIgc2tpblBlcmNlbnQgc21vb3RoQ3VydmUgc21vb3RoVGFuZ2VudFN1cmZhY2Ugc21vb3Roc3RlcCAnICtcbiAgICAgICdzbmFwMnRvMiBzbmFwS2V5IHNuYXBNb2RlIHNuYXBUb2dldGhlckN0eCBzbmFwc2hvdCBzb2Z0IHNvZnRNb2Qgc29mdE1vZEN0eCBzb3J0IHNvdW5kICcgK1xuICAgICAgJ3NvdW5kQ29udHJvbCBzb3VyY2Ugc3BhY2VMb2NhdG9yIHNwaGVyZSBzcGhyYW5kIHNwb3RMaWdodCBzcG90TGlnaHRQcmV2aWV3UG9ydCAnICtcbiAgICAgICdzcHJlYWRTaGVldEVkaXRvciBzcHJpbmcgc3FydCBzcXVhcmVTdXJmYWNlIHNydENvbnRleHQgc3RhY2tUcmFjZSBzdGFydFN0cmluZyAnICtcbiAgICAgICdzdGFydHNXaXRoIHN0aXRjaEFuZEV4cGxvZGVTaGVsbCBzdGl0Y2hTdXJmYWNlIHN0aXRjaFN1cmZhY2VQb2ludHMgc3RyY21wICcgK1xuICAgICAgJ3N0cmluZ0FycmF5Q2F0ZW5hdGUgc3RyaW5nQXJyYXlDb250YWlucyBzdHJpbmdBcnJheUNvdW50IHN0cmluZ0FycmF5SW5zZXJ0QXRJbmRleCAnICtcbiAgICAgICdzdHJpbmdBcnJheUludGVyc2VjdG9yIHN0cmluZ0FycmF5UmVtb3ZlIHN0cmluZ0FycmF5UmVtb3ZlQXRJbmRleCAnICtcbiAgICAgICdzdHJpbmdBcnJheVJlbW92ZUR1cGxpY2F0ZXMgc3RyaW5nQXJyYXlSZW1vdmVFeGFjdCBzdHJpbmdBcnJheVRvU3RyaW5nICcgK1xuICAgICAgJ3N0cmluZ1RvU3RyaW5nQXJyYXkgc3RyaXAgc3RyaXBQcmVmaXhGcm9tTmFtZSBzdHJva2Ugc3ViZEF1dG9Qcm9qZWN0aW9uICcgK1xuICAgICAgJ3N1YmRDbGVhblRvcG9sb2d5IHN1YmRDb2xsYXBzZSBzdWJkRHVwbGljYXRlQW5kQ29ubmVjdCBzdWJkRWRpdFVWICcgK1xuICAgICAgJ3N1YmRMaXN0Q29tcG9uZW50Q29udmVyc2lvbiBzdWJkTWFwQ3V0IHN1YmRNYXBTZXdNb3ZlIHN1YmRNYXRjaFRvcG9sb2d5IHN1YmRNaXJyb3IgJyArXG4gICAgICAnc3ViZFRvQmxpbmQgc3ViZFRvUG9seSBzdWJkVHJhbnNmZXJVVnNUb0NhY2hlIHN1YmRpdiBzdWJkaXZDcmVhc2UgJyArXG4gICAgICAnc3ViZGl2RGlzcGxheVNtb290aG5lc3Mgc3Vic3RpdHV0ZSBzdWJzdGl0dXRlQWxsU3RyaW5nIHN1YnN0aXR1dGVHZW9tZXRyeSBzdWJzdHJpbmcgJyArXG4gICAgICAnc3VyZmFjZSBzdXJmYWNlU2FtcGxlciBzdXJmYWNlU2hhZGVyTGlzdCBzd2F0Y2hEaXNwbGF5UG9ydCBzd2l0Y2hUYWJsZSBzeW1ib2xCdXR0b24gJyArXG4gICAgICAnc3ltYm9sQ2hlY2tCb3ggc3lzRmlsZSBzeXN0ZW0gdGFiTGF5b3V0IHRhbiB0YW5nZW50Q29uc3RyYWludCB0ZXhMYXR0aWNlRGVmb3JtQ29udGV4dCAnICtcbiAgICAgICd0ZXhNYW5pcENvbnRleHQgdGV4TW92ZUNvbnRleHQgdGV4TW92ZVVWU2hlbGxDb250ZXh0IHRleFJvdGF0ZUNvbnRleHQgdGV4U2NhbGVDb250ZXh0ICcgK1xuICAgICAgJ3RleFNlbGVjdENvbnRleHQgdGV4U2VsZWN0U2hvcnRlc3RQYXRoQ3R4IHRleFNtdWRnZVVWQ29udGV4dCB0ZXhXaW5Ub29sQ3R4IHRleHQgJyArXG4gICAgICAndGV4dEN1cnZlcyB0ZXh0RmllbGQgdGV4dEZpZWxkQnV0dG9uR3JwIHRleHRGaWVsZEdycCB0ZXh0TWFuaXAgdGV4dFNjcm9sbExpc3QgJyArXG4gICAgICAndGV4dFRvU2hlbGYgdGV4dHVyZURpc3BsYWNlUGxhbmUgdGV4dHVyZUhhaXJDb2xvciB0ZXh0dXJlUGxhY2VtZW50Q29udGV4dCAnICtcbiAgICAgICd0ZXh0dXJlV2luZG93IHRocmVhZENvdW50IHRocmVlUG9pbnRBcmNDdHggdGltZUNvbnRyb2wgdGltZVBvcnQgdGltZXJYIHRvTmF0aXZlUGF0aCAnICtcbiAgICAgICd0b2dnbGUgdG9nZ2xlQXhpcyB0b2dnbGVXaW5kb3dWaXNpYmlsaXR5IHRva2VuaXplIHRva2VuaXplTGlzdCB0b2xlcmFuY2UgdG9sb3dlciAnICtcbiAgICAgICd0b29sQnV0dG9uIHRvb2xDb2xsZWN0aW9uIHRvb2xEcm9wcGVkIHRvb2xIYXNPcHRpb25zIHRvb2xQcm9wZXJ0eVdpbmRvdyB0b3J1cyB0b3VwcGVyICcgK1xuICAgICAgJ3RyYWNlIHRyYWNrIHRyYWNrQ3R4IHRyYW5zZmVyQXR0cmlidXRlcyB0cmFuc2Zvcm1Db21wYXJlIHRyYW5zZm9ybUxpbWl0cyB0cmFuc2xhdG9yICcgK1xuICAgICAgJ3RyaW0gdHJ1bmMgdHJ1bmNhdGVGbHVpZENhY2hlIHRydW5jYXRlSGFpckNhY2hlIHR1bWJsZSB0dW1ibGVDdHggdHVyYnVsZW5jZSAnICtcbiAgICAgICd0d29Qb2ludEFyY0N0eCB1aVJlcyB1aVRlbXBsYXRlIHVuYXNzaWduSW5wdXREZXZpY2UgdW5kbyB1bmRvSW5mbyB1bmdyb3VwIHVuaWZvcm0gdW5pdCAnICtcbiAgICAgICd1bmxvYWRQbHVnaW4gdW50YW5nbGVVViB1bnRpdGxlZEZpbGVOYW1lIHVudHJpbSB1cEF4aXMgdXBkYXRlQUUgdXNlckN0eCB1dkxpbmsgJyArXG4gICAgICAndXZTbmFwc2hvdCB2YWxpZGF0ZVNoZWxmTmFtZSB2ZWN0b3JpemUgdmlldzJkVG9vbEN0eCB2aWV3Q2FtZXJhIHZpZXdDbGlwUGxhbmUgJyArXG4gICAgICAndmlld0ZpdCB2aWV3SGVhZE9uIHZpZXdMb29rQXQgdmlld01hbmlwIHZpZXdQbGFjZSB2aWV3U2V0IHZpc29yIHZvbHVtZUF4aXMgdm9ydGV4ICcgK1xuICAgICAgJ3dhaXRDdXJzb3Igd2FybmluZyB3ZWJCcm93c2VyIHdlYkJyb3dzZXJQcmVmcyB3aGF0SXMgd2luZG93IHdpbmRvd1ByZWYgd2lyZSAnICtcbiAgICAgICd3aXJlQ29udGV4dCB3b3Jrc3BhY2Ugd3JpbmtsZSB3cmlua2xlQ29udGV4dCB3cml0ZVRha2UgeGJtTGFuZ1BhdGhMaXN0IHhmb3JtJyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCRcXFxcZCcsXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1tcXFxcJFxcXFwlXFxcXEBcXFxcKl0oXFxcXF5cXFxcd1xcXFxifCNcXFxcdyt8W15cXFxcc1xcXFx3e118e1xcXFx3K318XFxcXHcrKSdcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFZBUlMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkXFxcXGQrJ1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkeycsIGVuZDogJ30nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnW1xcXFwkXFxcXEBdJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgIH1cbiAgXTtcbiAgdmFyIERFRkFVTFQgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgbGV4ZW1zOiAnW2Etei9fXSsnLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ29uIG9mZiB5ZXMgbm8gdHJ1ZSBmYWxzZSBub25lIGJsb2NrZWQgZGVidWcgaW5mbyBub3RpY2Ugd2FybiBlcnJvciBjcml0ICcgK1xuICAgICAgICAnc2VsZWN0IGJyZWFrIGxhc3QgcGVybWFuZW50IHJlZGlyZWN0IGtxdWV1ZSBydHNpZyBlcG9sbCBwb2xsIC9kZXYvcG9sbCdcbiAgICB9LFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBpbGxlZ2FsOiAnPT4nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiBcIidcIiwgZW5kOiBcIidcIixcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd1cmwnLFxuICAgICAgICBiZWdpbjogJyhbYS16XSspOi8nLCBlbmQ6ICdcXFxccycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogXCJcXFxcc1xcXFxeXCIsIGVuZDogXCJcXFxcc3x7fDtcIiwgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpXG4gICAgICB9LFxuICAgICAgLy8gcmVnZXhwIGxvY2F0aW9ucyAofiwgfiopXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiBcIn5cXFxcKj9cXFxccytcIiwgZW5kOiBcIlxcXFxzfHt8O1wiLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUylcbiAgICAgIH0sXG4gICAgICAvLyAqLmV4YW1wbGUuY29tXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiBcIlxcXFwqKFxcXFwuW2EtelxcXFwtXSspK1wiLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpXG4gICAgICB9LFxuICAgICAgLy8gc3ViLmV4YW1wbGUuKlxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogXCIoW2EtelxcXFwtXStcXFxcLikrXFxcXCpcIixcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKVxuICAgICAgfSxcbiAgICAgIC8vIElQXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJcXFxcZHsxLDN9XFxcXC5cXFxcZHsxLDN9XFxcXC5cXFxcZHsxLDN9XFxcXC5cXFxcZHsxLDN9KDpcXFxcZHsxLDV9KT9cXFxcYidcbiAgICAgIH0sXG4gICAgICAvLyB1bml0c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiXFxcXGQrW2tLbU1nR2RzaGR3eV0qXFxcXGInLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdLmNvbmNhdChWQVJTKVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnXFxcXHMnLCBlbmQ6ICc7fHsnLCByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICAgICAgc3RhcnRzOiBERUZBVUxUXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnW15cXFxcc1xcXFx9XSdcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBPQkpDX0tFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnaW50IGZsb2F0IHdoaWxlIHByaXZhdGUgY2hhciBjYXRjaCBleHBvcnQgc2l6ZW9mIHR5cGVkZWYgY29uc3Qgc3RydWN0IGZvciB1bmlvbiAnICtcbiAgICAgICd1bnNpZ25lZCBsb25nIHZvbGF0aWxlIHN0YXRpYyBwcm90ZWN0ZWQgYm9vbCBtdXRhYmxlIGlmIHB1YmxpYyBkbyByZXR1cm4gZ290byB2b2lkICcgK1xuICAgICAgJ2VudW0gZWxzZSBicmVhayBleHRlcm4gY2xhc3MgYXNtIGNhc2Ugc2hvcnQgZGVmYXVsdCBkb3VibGUgdGhyb3cgcmVnaXN0ZXIgZXhwbGljaXQgJyArXG4gICAgICAnc2lnbmVkIHR5cGVuYW1lIHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB3Y2hhcl90IGlubGluZSByZWFkb25seSBhc3NpZ24gcHJvcGVydHkgJyArXG4gICAgICAncHJvdG9jb2wgc2VsZiBzeW5jaHJvbml6ZWQgZW5kIHN5bnRoZXNpemUgaWQgb3B0aW9uYWwgcmVxdWlyZWQgaW1wbGVtZW50YXRpb24gJyArXG4gICAgICAnbm9uYXRvbWljIGludGVyZmFjZSBzdXBlciB1bmljaGFyIGZpbmFsbHkgZHluYW1pYyBJQk91dGxldCBJQkFjdGlvbiBzZWxlY3RvciBzdHJvbmcgJyArXG4gICAgICAnd2VhayByZWFkb25seScsXG4gICAgbGl0ZXJhbDpcbiAgICBcdCdmYWxzZSB0cnVlIEZBTFNFIFRSVUUgbmlsIFlFUyBOTyBOVUxMJyxcbiAgICBidWlsdF9pbjpcbiAgICAgICdOU1N0cmluZyBOU0RpY3Rpb25hcnkgQ0dSZWN0IENHUG9pbnQgVUlCdXR0b24gVUlMYWJlbCBVSVRleHRWaWV3IFVJV2ViVmlldyBNS01hcFZpZXcgJyArXG4gICAgICAnVUlTZWdtZW50ZWRDb250cm9sIE5TT2JqZWN0IFVJVGFibGVWaWV3RGVsZWdhdGUgVUlUYWJsZVZpZXdEYXRhU291cmNlIE5TVGhyZWFkICcgK1xuICAgICAgJ1VJQWN0aXZpdHlJbmRpY2F0b3IgVUlUYWJiYXIgVUlUb29sQmFyIFVJQmFyQnV0dG9uSXRlbSBVSUltYWdlVmlldyBOU0F1dG9yZWxlYXNlUG9vbCAnICtcbiAgICAgICdVSVRhYmxlVmlldyBCT09MIE5TSW50ZWdlciBDR0Zsb2F0IE5TRXhjZXB0aW9uIE5TTG9nIE5TTXV0YWJsZVN0cmluZyBOU011dGFibGVBcnJheSAnICtcbiAgICAgICdOU011dGFibGVEaWN0aW9uYXJ5IE5TVVJMIE5TSW5kZXhQYXRoIENHU2l6ZSBVSVRhYmxlVmlld0NlbGwgVUlWaWV3IFVJVmlld0NvbnRyb2xsZXIgJyArXG4gICAgICAnVUlOYXZpZ2F0aW9uQmFyIFVJTmF2aWdhdGlvbkNvbnRyb2xsZXIgVUlUYWJCYXJDb250cm9sbGVyIFVJUG9wb3ZlckNvbnRyb2xsZXIgJyArXG4gICAgICAnVUlQb3BvdmVyQ29udHJvbGxlckRlbGVnYXRlIFVJSW1hZ2UgTlNOdW1iZXIgVUlTZWFyY2hCYXIgTlNGZXRjaGVkUmVzdWx0c0NvbnRyb2xsZXIgJyArXG4gICAgICAnTlNGZXRjaGVkUmVzdWx0c0NoYW5nZVR5cGUgVUlTY3JvbGxWaWV3IFVJU2Nyb2xsVmlld0RlbGVnYXRlIFVJRWRnZUluc2V0cyBVSUNvbG9yICcgK1xuICAgICAgJ1VJRm9udCBVSUFwcGxpY2F0aW9uIE5TTm90Rm91bmQgTlNOb3RpZmljYXRpb25DZW50ZXIgTlNOb3RpZmljYXRpb24gJyArXG4gICAgICAnVUlMb2NhbE5vdGlmaWNhdGlvbiBOU0J1bmRsZSBOU0ZpbGVNYW5hZ2VyIE5TVGltZUludGVydmFsIE5TRGF0ZSBOU0NhbGVuZGFyICcgK1xuICAgICAgJ05TVXNlckRlZmF1bHRzIFVJV2luZG93IE5TUmFuZ2UgTlNBcnJheSBOU0Vycm9yIE5TVVJMUmVxdWVzdCBOU1VSTENvbm5lY3Rpb24gY2xhc3MgJyArXG4gICAgICAnVUlJbnRlcmZhY2VPcmllbnRhdGlvbiBNUE1vdmllUGxheWVyQ29udHJvbGxlciBkaXNwYXRjaF9vbmNlX3QgJyArXG4gICAgICAnZGlzcGF0Y2hfcXVldWVfdCBkaXNwYXRjaF9zeW5jIGRpc3BhdGNoX2FzeW5jIGRpc3BhdGNoX29uY2UnXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IE9CSkNfS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJyxcbiAgICAgICAgZW5kOiAnW15cXFxcXFxcXF1cXCcnLFxuICAgICAgICBpbGxlZ2FsOiAnW15cXFxcXFxcXF1bXlxcJ10nXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnI2ltcG9ydCcsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGJlZ2luOiAnXFxcIicsXG4gICAgICAgICAgZW5kOiAnXFxcIidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBiZWdpbjogJzwnLFxuICAgICAgICAgIGVuZDogJz4nXG4gICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJyxcbiAgICAgICAgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgZW5kOiAnKHt8JCknLFxuICAgICAgICBrZXl3b3JkczogJ2ludGVyZmFjZSBjbGFzcyBwcm90b2NvbCBpbXBsZW1lbnRhdGlvbicsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2lkJyxcbiAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFwuJytobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdeIycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcXFxcXnJlbXsnLCBlbmQ6ICd9JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICdeQCg/OkJBU0V8VVNFfENMQVNTfE9QVElPTlMpJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdAW1xcXFx3XFxcXC1dK1xcXFxbW1xcXFx3XjtcXFxcLV0qXFxcXF0oPzpcXFxcW1tcXFxcd147XFxcXC1dKlxcXFxdKT8oPzouKikkJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFwkXFxcXHs/W1xcXFx3XFxcXC1cXFxcLlxcXFw6XStcXFxcfT8nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgYmVnaW46ICdcXFxcXltcXFxcd1xcXFwtXFxcXC5cXFxcOl0rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcXiNbMC05YS1mQS1GXSsnXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFBFUkxfS0VZV09SRFMgPSAnZ2V0cHdlbnQgZ2V0c2VydmVudCBxdW90ZW1ldGEgbXNncmN2IHNjYWxhciBraWxsIGRibWNsb3NlIHVuZGVmIGxjICcgK1xuICAgICdtYSBzeXN3cml0ZSB0ciBzZW5kIHVtYXNrIHN5c29wZW4gc2htd3JpdGUgdmVjIHF4IHV0aW1lIGxvY2FsIG9jdCBzZW1jdGwgbG9jYWx0aW1lICcgK1xuICAgICdyZWFkcGlwZSBkbyByZXR1cm4gZm9ybWF0IHJlYWQgc3ByaW50ZiBkYm1vcGVuIHBvcCBnZXRwZ3JwIG5vdCBnZXRwd25hbSByZXdpbmRkaXIgcXEnICtcbiAgICAnZmlsZW5vIHF3IGVuZHByb3RvZW50IHdhaXQgc2V0aG9zdGVudCBibGVzcyBzfDAgb3BlbmRpciBjb250aW51ZSBlYWNoIHNsZWVwIGVuZGdyZW50ICcgK1xuICAgICdzaHV0ZG93biBkdW1wIGNob21wIGNvbm5lY3QgZ2V0c29ja25hbWUgZGllIHNvY2tldHBhaXIgY2xvc2UgZmxvY2sgZXhpc3RzIGluZGV4IHNobWdldCcgK1xuICAgICdzdWIgZm9yIGVuZHB3ZW50IHJlZG8gbHN0YXQgbXNnY3RsIHNldHBncnAgYWJzIGV4aXQgc2VsZWN0IHByaW50IHJlZiBnZXRob3N0YnlhZGRyICcgK1xuICAgICd1bnNoaWZ0IGZjbnRsIHN5c2NhbGwgZ290byBnZXRuZXRieWFkZHIgam9pbiBnbXRpbWUgc3ltbGluayBzZW1nZXQgc3BsaWNlIHh8MCAnICtcbiAgICAnZ2V0cGVlcm5hbWUgcmVjdiBsb2cgc2V0c29ja29wdCBjb3MgbGFzdCByZXZlcnNlIGdldGhvc3RieW5hbWUgZ2V0Z3JuYW0gc3R1ZHkgZm9ybWxpbmUgJyArXG4gICAgJ2VuZGhvc3RlbnQgdGltZXMgY2hvcCBsZW5ndGggZ2V0aG9zdGVudCBnZXRuZXRlbnQgcGFjayBnZXRwcm90b2VudCBnZXRzZXJ2YnluYW1lIHJhbmQgJyArXG4gICAgJ21rZGlyIHBvcyBjaG1vZCB5fDAgc3Vic3RyIGVuZG5ldGVudCBwcmludGYgbmV4dCBvcGVuIG1zZ3NuZCByZWFkZGlyIHVzZSB1bmxpbmsgJyArXG4gICAgJ2dldHNvY2tvcHQgZ2V0cHJpb3JpdHkgcmluZGV4IHdhbnRhcnJheSBoZXggc3lzdGVtIGdldHNlcnZieXBvcnQgZW5kc2VydmVudCBpbnQgY2hyICcgK1xuICAgICd1bnRpZSBybWRpciBwcm90b3R5cGUgdGVsbCBsaXN0ZW4gZm9yayBzaG1yZWFkIHVjZmlyc3Qgc2V0cHJvdG9lbnQgZWxzZSBzeXNzZWVrIGxpbmsgJyArXG4gICAgJ2dldGdyZ2lkIHNobWN0bCB3YWl0cGlkIHVucGFjayBnZXRuZXRieW5hbWUgcmVzZXQgY2hkaXIgZ3JlcCBzcGxpdCByZXF1aXJlIGNhbGxlciAnICtcbiAgICAnbGNmaXJzdCB1bnRpbCB3YXJuIHdoaWxlIHZhbHVlcyBzaGlmdCB0ZWxsZGlyIGdldHB3dWlkIG15IGdldHByb3RvYnludW1iZXIgZGVsZXRlIGFuZCAnICtcbiAgICAnc29ydCB1YyBkZWZpbmVkIHNyYW5kIGFjY2VwdCBwYWNrYWdlIHNlZWtkaXIgZ2V0cHJvdG9ieW5hbWUgc2Vtb3Agb3VyIHJlbmFtZSBzZWVrIGlmIHF8MCAnICtcbiAgICAnY2hyb290IHN5c3JlYWQgc2V0cHdlbnQgbm8gY3J5cHQgZ2V0YyBjaG93biBzcXJ0IHdyaXRlIHNldG5ldGVudCBzZXRwcmlvcml0eSBmb3JlYWNoICcgK1xuICAgICd0aWUgc2luIG1zZ2dldCBtYXAgc3RhdCBnZXRsb2dpbiB1bmxlc3MgZWxzaWYgdHJ1bmNhdGUgZXhlYyBrZXlzIGdsb2IgdGllZCBjbG9zZWRpcicgK1xuICAgICdpb2N0bCBzb2NrZXQgcmVhZGxpbmsgZXZhbCB4b3IgcmVhZGxpbmUgYmlubW9kZSBzZXRzZXJ2ZW50IGVvZiBvcmQgYmluZCBhbGFybSBwaXBlICcgK1xuICAgICdhdGFuMiBnZXRncmVudCBleHAgdGltZSBwdXNoIHNldGdyZW50IGd0IGx0IG9yIG5lIG18MCBicmVhayBnaXZlbiBzYXkgc3RhdGUgd2hlbic7XG4gIHZhciBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46ICdbJEBdXFxcXHsnLCBlbmQ6ICdcXFxcfScsXG4gICAga2V5d29yZHM6IFBFUkxfS0VZV09SRFMsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuICB2YXIgVkFSMSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdcXFxcJFxcXFxkJ1xuICB9O1xuICB2YXIgVkFSMiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdbXFxcXCRcXFxcJVxcXFxAXFxcXCpdKFxcXFxeXFxcXHdcXFxcYnwjXFxcXHcrKFxcXFw6XFxcXDpcXFxcdyspKnxbXlxcXFxzXFxcXHd7XXx7XFxcXHcrfXxcXFxcdysoXFxcXDpcXFxcOlxcXFx3KikqKSdcbiAgfTtcbiAgdmFyIFNUUklOR19DT05UQUlOUyA9IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNULCBWQVIxLCBWQVIyXTtcbiAgdmFyIE1FVEhPRCA9IHtcbiAgICBiZWdpbjogJy0+JyxcbiAgICBjb250YWluczogW1xuICAgICAge2JlZ2luOiBobGpzLklERU5UX1JFfSxcbiAgICAgIHtiZWdpbjogJ3snLCBlbmQ6ICd9J31cbiAgICBdXG4gIH07XG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnXihfX0VORF9ffF9fREFUQV9fKScsIGVuZDogJ1xcXFxuJCcsXG4gICAgcmVsZXZhbmNlOiA1XG4gIH1cbiAgdmFyIFBFUkxfREVGQVVMVF9DT05UQUlOUyA9IFtcbiAgICBWQVIxLCBWQVIyLFxuICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgQ09NTUVOVCxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnXlxcXFw9XFxcXHcnLCBlbmQ6ICdcXFxcPWN1dCcsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgfSxcbiAgICBNRVRIT0QsXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFx7JywgZW5kOiAnXFxcXH0nLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcfCcsIGVuZDogJ1xcXFx8JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXDwnLCBlbmQ6ICdcXFxcPicsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxd1xcXFxzK3EnLCBlbmQ6ICdxJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICd7XFxcXHcrfScsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1xcLT9cXFxcdytcXFxccypcXFxcPVxcXFw+JyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiAnKFxcXFxiMFswLTdfXSspfChcXFxcYjB4WzAtOWEtZkEtRl9dKyl8KFxcXFxiWzEtOV1bMC05X10qKFxcXFwuWzAtOV9dKyk/KXxbMF9dXFxcXGInLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7IC8vIHJlZ2V4cCBjb250YWluZXJcbiAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJ3xcXFxcYihzcGxpdHxyZXR1cm58cHJpbnR8cmV2ZXJzZXxncmVwKVxcXFxiKVxcXFxzKicsXG4gICAgICBrZXl3b3JkczogJ3NwbGl0IHJldHVybiBwcmludCByZXZlcnNlIGdyZXAnLFxuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgQ09NTUVOVCxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgYmVnaW46ICcoc3x0cnx5KS8oXFxcXFxcXFwufFteL10pKi8oXFxcXFxcXFwufFteL10pKi9bYS16XSonLFxuICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgYmVnaW46ICcobXxxcik/LycsIGVuZDogJy9bYS16XSonLFxuICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgICByZWxldmFuY2U6IDAgLy8gYWxsb3dzIGVtcHR5IFwiLy9cIiB3aGljaCBpcyBhIGNvbW1vbiBjb21tZW50IGRlbGltaXRlciBpbiBvdGhlciBsYW5ndWFnZXNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3ViJyxcbiAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyhcXFxccypcXFxcKC4qP1xcXFwpKT9bO3tdJyxcbiAgICAgIGtleXdvcmRzOiAnc3ViJyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnb3BlcmF0b3InLFxuICAgICAgYmVnaW46ICctXFxcXHdcXFxcYicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF07XG4gIFNVQlNULmNvbnRhaW5zID0gUEVSTF9ERUZBVUxUX0NPTlRBSU5TO1xuICBNRVRIT0QuY29udGFpbnNbMV0uY29udGFpbnMgPSBQRVJMX0RFRkFVTFRfQ09OVEFJTlM7XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogUEVSTF9LRVlXT1JEUyxcbiAgICBjb250YWluczogUEVSTF9ERUZBVUxUX0NPTlRBSU5TXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVkFSSUFCTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkK1thLXpBLVpfXFx4N2YtXFx4ZmZdW2EtekEtWjAtOV9cXHg3Zi1cXHhmZl0qJ1xuICB9O1xuICB2YXIgU1RSSU5HUyA9IFtcbiAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ2JcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnYlxcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9XG4gIF07XG4gIHZhciBOVU1CRVJTID0gW2hsanMuQklOQVJZX05VTUJFUl9NT0RFLCBobGpzLkNfTlVNQkVSX01PREVdO1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczpcbiAgICAgICdhbmQgaW5jbHVkZV9vbmNlIGxpc3QgYWJzdHJhY3QgZ2xvYmFsIHByaXZhdGUgZWNobyBpbnRlcmZhY2UgYXMgc3RhdGljIGVuZHN3aXRjaCAnICtcbiAgICAgICdhcnJheSBudWxsIGlmIGVuZHdoaWxlIG9yIGNvbnN0IGZvciBlbmRmb3JlYWNoIHNlbGYgdmFyIHdoaWxlIGlzc2V0IHB1YmxpYyAnICtcbiAgICAgICdwcm90ZWN0ZWQgZXhpdCBmb3JlYWNoIHRocm93IGVsc2VpZiBpbmNsdWRlIF9fRklMRV9fIGVtcHR5IHJlcXVpcmVfb25jZSBkbyB4b3IgJyArXG4gICAgICAncmV0dXJuIGltcGxlbWVudHMgcGFyZW50IGNsb25lIHVzZSBfX0NMQVNTX18gX19MSU5FX18gZWxzZSBicmVhayBwcmludCBldmFsIG5ldyAnICtcbiAgICAgICdjYXRjaCBfX01FVEhPRF9fIGNhc2UgZXhjZXB0aW9uIHBocF91c2VyX2ZpbHRlciBkZWZhdWx0IGRpZSByZXF1aXJlIF9fRlVOQ1RJT05fXyAnICtcbiAgICAgICdlbmRkZWNsYXJlIGZpbmFsIHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSBlbmRmb3IgZW5kaWYgZGVjbGFyZSB1bnNldCB0cnVlIGZhbHNlICcgK1xuICAgICAgJ25hbWVzcGFjZSB0cmFpdCBnb3RvIGluc3RhbmNlb2YgaW5zdGVhZG9mIF9fRElSX18gX19OQU1FU1BBQ0VfXyBfX2hhbHRfY29tcGlsZXInLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICcvXFxcXConLCBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BocGRvYycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFxzQFtBLVphLXpdKydcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgIGJlZ2luOiAnX19oYWx0X2NvbXBpbGVyLis/OycsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJzw8PFtcXCdcIl0/XFxcXHcrW1xcJ1wiXT8kJywgZW5kOiAnXlxcXFx3KzsnLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnPFxcXFw/cGhwJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICdcXFxcPz4nXG4gICAgICB9LFxuICAgICAgVkFSSUFCTEUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXCR8XFxcXFt8JScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgICAgIFZBUklBQkxFLFxuICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgICAgICBdLmNvbmNhdChTVFJJTkdTKS5jb25jYXQoTlVNQkVSUylcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MnLFxuICAgICAgICBpbGxlZ2FsOiAnWzpcXFxcKFxcXFwkXScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtUSVRMRV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFRJVExFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPT4nIC8vIE5vIG1hcmt1cCwganVzdCBhIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICB9XG4gICAgXS5jb25jYXQoU1RSSU5HUykuY29uY2F0KE5VTUJFUlMpXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2J1aWx0aW4nLFxuICAgICAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JCcsXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREVdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2ZpbGVuYW1lJyxcbiAgICAgICAgYmVnaW46ICdbYS16QS1aX11bXFxcXGRhLXpBLVpfXStcXFxcLltcXFxcZGEtekEtWl9dezEsM30nLCBlbmQ6ICc6JyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICcobmNhbGxzfHRvdHRpbWV8Y3VtdGltZSknLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICduY2FsbHMgdG90dGltZXwxMCBjdW10aW1lfDEwIGZpbGVuYW1lJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3VtbWFyeScsXG4gICAgICAgIGJlZ2luOiAnZnVuY3Rpb24gY2FsbHMnLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkNfTlVNQkVSX01PREVdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCkkJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIH1dLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgUFJPTVBUID0ge1xuICAgIGNsYXNzTmFtZTogJ3Byb21wdCcsICBiZWdpbjogJ14oPj4+fFxcXFwuXFxcXC5cXFxcLikgJ1xuICB9XG4gIHZhciBTVFJJTkdTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fGIpP3I/XFwnXFwnXFwnJywgZW5kOiAnXFwnXFwnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbUFJPTVBUXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fGIpP3I/XCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICAgIGNvbnRhaW5zOiBbUFJPTVBUXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fHJ8dXIpXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fHJ8dXIpXCInLCBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcoYnxicilcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcoYnxicilcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH1cbiAgXS5jb25jYXQoW1xuICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gIF0pO1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHZhciBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCBobGpzLkNfTlVNQkVSX01PREUsIFBST01QVF0uY29uY2F0KFNUUklOR1MpXG4gIH07XG4gIHZhciBGVU5DX0NMQVNTX1BST1RPID0ge1xuICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJzonLFxuICAgIGlsbGVnYWw6ICdbJHs9O1xcXFxuXScsXG4gICAgY29udGFpbnM6IFtUSVRMRSwgUEFSQU1TXSxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2FuZCBlbGlmIGlzIGdsb2JhbCBhcyBpbiBpZiBmcm9tIHJhaXNlIGZvciBleGNlcHQgZmluYWxseSBwcmludCBpbXBvcnQgcGFzcyByZXR1cm4gJyArXG4gICAgICAgICdleGVjIGVsc2UgYnJlYWsgbm90IHdpdGggY2xhc3MgYXNzZXJ0IHlpZWxkIHRyeSB3aGlsZSBjb250aW51ZSBkZWwgb3IgZGVmIGxhbWJkYSAnICtcbiAgICAgICAgJ25vbmxvY2FsfDEwJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnTm9uZSBUcnVlIEZhbHNlIEVsbGlwc2lzIE5vdEltcGxlbWVudGVkJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJyg8L3wtPnxcXFxcPyknLFxuICAgIGNvbnRhaW5zOiBTVFJJTkdTLmNvbmNhdChbXG4gICAgICBQUk9NUFQsXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5pbmhlcml0KEZVTkNfQ0xBU1NfUFJPVE8sIHtjbGFzc05hbWU6ICdmdW5jdGlvbicsIGtleXdvcmRzOiAnZGVmJ30pLFxuICAgICAgaGxqcy5pbmhlcml0KEZVTkNfQ0xBU1NfUFJPVE8sIHtjbGFzc05hbWU6ICdjbGFzcycsIGtleXdvcmRzOiAnY2xhc3MnfSksXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2RlY29yYXRvcicsXG4gICAgICAgIGJlZ2luOiAnQCcsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxiKHByaW50fGV4ZWMpXFxcXCgnIC8vIGRvbuKAmXQgaGlnaGxpZ2h0IGtleXdvcmRzLXR1cm5lZC1mdW5jdGlvbnMgaW4gUHl0aG9uIDNcbiAgICAgIH1cbiAgICBdKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIElERU5UX1JFID0gJyhbYS16QS1aXXxcXFxcLlthLXpBLVouXSlbYS16QS1aMC05Ll9dKic7XG5cbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IElERU5UX1JFLFxuICAgICAgICBsZXhlbXM6IElERU5UX1JFLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgIGtleXdvcmQ6XG4gICAgICAgICAgICAnZnVuY3Rpb24gaWYgaW4gYnJlYWsgbmV4dCByZXBlYXQgZWxzZSBmb3IgcmV0dXJuIHN3aXRjaCB3aGlsZSB0cnkgdHJ5Q2F0Y2h8MTAgJyArXG4gICAgICAgICAgICAnc3RvcCB3YXJuaW5nIHJlcXVpcmUgbGlicmFyeSBhdHRhY2ggZGV0YWNoIHNvdXJjZSBzZXRNZXRob2Qgc2V0R2VuZXJpYyAnICtcbiAgICAgICAgICAgICdzZXRHcm91cEdlbmVyaWMgc2V0Q2xhc3MgLi4ufDEwJyxcbiAgICAgICAgICBsaXRlcmFsOlxuICAgICAgICAgICAgJ05VTEwgTkEgVFJVRSBGQUxTRSBUIEYgSW5mIE5hTiBOQV9pbnRlZ2VyX3wxMCBOQV9yZWFsX3wxMCBOQV9jaGFyYWN0ZXJffDEwICcgK1xuICAgICAgICAgICAgJ05BX2NvbXBsZXhffDEwJ1xuICAgICAgICB9LFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIGhleCB2YWx1ZVxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCIwW3hYXVswLTlhLWZBLUZdK1tMaV0/XFxcXGJcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBleHBsaWNpdCBpbnRlZ2VyXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBcIlxcXFxkKyg/OltlRV1bK1xcXFwtXT9cXFxcZCopP0xcXFxcYlwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIG51bWJlciB3aXRoIHRyYWlsaW5nIGRlY2ltYWxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXGQrXFxcXC4oPyFcXFxcZCkoPzppXFxcXGIpP1wiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIG51bWJlclxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCJcXFxcZCsoPzpcXFxcLlxcXFxkKik/KD86W2VFXVsrXFxcXC1dP1xcXFxkKik/aT9cXFxcYlwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIG51bWJlciB3aXRoIGxlYWRpbmcgZGVjaW1hbFxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCJcXFxcLlxcXFxkKyg/OltlRV1bK1xcXFwtXT9cXFxcZCopP2k/XFxcXGJcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIC8vIGVzY2FwZWQgaWRlbnRpZmllclxuICAgICAgICBiZWdpbjogJ2AnLFxuICAgICAgICBlbmQ6ICdgJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogXCInXCIsXG4gICAgICAgIGVuZDogXCInXCIsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdBcmNoaXZlUmVjb3JkIEFyZWFMaWdodFNvdXJjZSBBdG1vc3BoZXJlIEF0dHJpYnV0ZSBBdHRyaWJ1dGVCZWdpbiBBdHRyaWJ1dGVFbmQgQmFzaXMgJyArXG4gICAgICAnQmVnaW4gQmxvYmJ5IEJvdW5kIENsaXBwaW5nIENsaXBwaW5nUGxhbmUgQ29sb3IgQ29sb3JTYW1wbGVzIENvbmNhdFRyYW5zZm9ybSBDb25lICcgK1xuICAgICAgJ0Nvb3JkaW5hdGVTeXN0ZW0gQ29vcmRTeXNUcmFuc2Zvcm0gQ3JvcFdpbmRvdyBDdXJ2ZXMgQ3lsaW5kZXIgRGVwdGhPZkZpZWxkIERldGFpbCAnICtcbiAgICAgICdEZXRhaWxSYW5nZSBEaXNrIERpc3BsYWNlbWVudCBEaXNwbGF5IEVuZCBFcnJvckhhbmRsZXIgRXhwb3N1cmUgRXh0ZXJpb3IgRm9ybWF0ICcgK1xuICAgICAgJ0ZyYW1lQXNwZWN0UmF0aW8gRnJhbWVCZWdpbiBGcmFtZUVuZCBHZW5lcmFsUG9seWdvbiBHZW9tZXRyaWNBcHByb3hpbWF0aW9uIEdlb21ldHJ5ICcgK1xuICAgICAgJ0hpZGVyIEh5cGVyYm9sb2lkIElkZW50aXR5IElsbHVtaW5hdGUgSW1hZ2VyIEludGVyaW9yIExpZ2h0U291cmNlICcgK1xuICAgICAgJ01ha2VDdWJlRmFjZUVudmlyb25tZW50IE1ha2VMYXRMb25nRW52aXJvbm1lbnQgTWFrZVNoYWRvdyBNYWtlVGV4dHVyZSBNYXR0ZSAnICtcbiAgICAgICdNb3Rpb25CZWdpbiBNb3Rpb25FbmQgTnVQYXRjaCBPYmplY3RCZWdpbiBPYmplY3RFbmQgT2JqZWN0SW5zdGFuY2UgT3BhY2l0eSBPcHRpb24gJyArXG4gICAgICAnT3JpZW50YXRpb24gUGFyYWJvbG9pZCBQYXRjaCBQYXRjaE1lc2ggUGVyc3BlY3RpdmUgUGl4ZWxGaWx0ZXIgUGl4ZWxTYW1wbGVzICcgK1xuICAgICAgJ1BpeGVsVmFyaWFuY2UgUG9pbnRzIFBvaW50c0dlbmVyYWxQb2x5Z29ucyBQb2ludHNQb2x5Z29ucyBQb2x5Z29uIFByb2NlZHVyYWwgUHJvamVjdGlvbiAnICtcbiAgICAgICdRdWFudGl6ZSBSZWFkQXJjaGl2ZSBSZWxhdGl2ZURldGFpbCBSZXZlcnNlT3JpZW50YXRpb24gUm90YXRlIFNjYWxlIFNjcmVlbldpbmRvdyAnICtcbiAgICAgICdTaGFkaW5nSW50ZXJwb2xhdGlvbiBTaGFkaW5nUmF0ZSBTaHV0dGVyIFNpZGVzIFNrZXcgU29saWRCZWdpbiBTb2xpZEVuZCBTcGhlcmUgJyArXG4gICAgICAnU3ViZGl2aXNpb25NZXNoIFN1cmZhY2UgVGV4dHVyZUNvb3JkaW5hdGVzIFRvcnVzIFRyYW5zZm9ybSBUcmFuc2Zvcm1CZWdpbiBUcmFuc2Zvcm1FbmQgJyArXG4gICAgICAnVHJhbnNmb3JtUG9pbnRzIFRyYW5zbGF0ZSBUcmltQ3VydmUgV29ybGRCZWdpbiBXb3JsZEVuZCcsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnZmxvYXQgY29sb3IgcG9pbnQgbm9ybWFsIHZlY3RvciBtYXRyaXggd2hpbGUgZm9yIGlmIGRvIHJldHVybiBlbHNlIGJyZWFrIGV4dGVybiBjb250aW51ZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ2FicyBhY29zIGFtYmllbnQgYXJlYSBhc2luIGF0YW4gYXRtb3NwaGVyZSBhdHRyaWJ1dGUgY2FsY3VsYXRlbm9ybWFsIGNlaWwgY2VsbG5vaXNlICcgK1xuICAgICAgICAnY2xhbXAgY29tcCBjb25jYXQgY29zIGRlZ3JlZXMgZGVwdGggRGVyaXYgZGlmZnVzZSBkaXN0YW5jZSBEdSBEdiBlbnZpcm9ubWVudCBleHAgJyArXG4gICAgICAgICdmYWNlZm9yd2FyZCBmaWx0ZXJzdGVwIGZsb29yIGZvcm1hdCBmcmVzbmVsIGluY2lkZW50IGxlbmd0aCBsaWdodHNvdXJjZSBsb2cgbWF0Y2ggJyArXG4gICAgICAgICdtYXggbWluIG1vZCBub2lzZSBub3JtYWxpemUgbnRyYW5zZm9ybSBvcHBvc2l0ZSBvcHRpb24gcGhvbmcgcG5vaXNlIHBvdyBwcmludGYgJyArXG4gICAgICAgICdwdGxpbmVkIHJhZGlhbnMgcmFuZG9tIHJlZmxlY3QgcmVmcmFjdCByZW5kZXJpbmZvIHJvdW5kIHNldGNvbXAgc2V0eGNvbXAgc2V0eWNvbXAgJyArXG4gICAgICAgICdzZXR6Y29tcCBzaGFkb3cgc2lnbiBzaW4gc21vb3Roc3RlcCBzcGVjdWxhciBzcGVjdWxhcmJyZGYgc3BsaW5lIHNxcnQgc3RlcCB0YW4gJyArXG4gICAgICAgICd0ZXh0dXJlIHRleHR1cmVpbmZvIHRyYWNlIHRyYW5zZm9ybSB2dHJhbnNmb3JtIHhjb21wIHljb21wIHpjb21wJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzaGFkZXInLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdcXFxcKCcsXG4gICAgICAgIGtleXdvcmRzOiAnc3VyZmFjZSBkaXNwbGFjZW1lbnQgbGlnaHQgdm9sdW1lIGltYWdlcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NoYWRpbmcnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdcXFxcKCcsXG4gICAgICAgIGtleXdvcmRzOiAnaWxsdW1pbmF0ZSBpbGx1bWluYW5jZSBnYXRoZXInXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFJVQllfSURFTlRfUkUgPSAnW2EtekEtWl9dW2EtekEtWjAtOV9dKihcXFxcIXxcXFxcPyk/JztcbiAgdmFyIFJVQllfTUVUSE9EX1JFID0gJ1thLXpBLVpfXVxcXFx3KlshPz1dP3xbLSt+XVxcXFxAfDw8fD4+fD1+fD09PT98PD0+fFs8Pl09P3xcXFxcKlxcXFwqfFstLyslXiYqfmB8XXxcXFxcW1xcXFxdPT8nO1xuICB2YXIgUlVCWV9LRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2FuZCBmYWxzZSB0aGVuIGRlZmluZWQgbW9kdWxlIGluIHJldHVybiByZWRvIGlmIEJFR0lOIHJldHJ5IGVuZCBmb3IgdHJ1ZSBzZWxmIHdoZW4gJyArXG4gICAgICAnbmV4dCB1bnRpbCBkbyBiZWdpbiB1bmxlc3MgRU5EIHJlc2N1ZSBuaWwgZWxzZSBicmVhayB1bmRlZiBub3Qgc3VwZXIgY2xhc3MgY2FzZSAnICtcbiAgICAgICdyZXF1aXJlIHlpZWxkIGFsaWFzIHdoaWxlIGVuc3VyZSBlbHNpZiBvciBpbmNsdWRlJ1xuICB9O1xuICB2YXIgWUFSRE9DVEFHID0ge1xuICAgIGNsYXNzTmFtZTogJ3lhcmRvY3RhZycsXG4gICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICB9O1xuICB2YXIgQ09NTUVOVFMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJyxcbiAgICAgIGNvbnRhaW5zOiBbWUFSRE9DVEFHXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJ15cXFxcPWJlZ2luJywgZW5kOiAnXlxcXFw9ZW5kJyxcbiAgICAgIGNvbnRhaW5zOiBbWUFSRE9DVEFHXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICdeX19FTkRfXycsIGVuZDogJ1xcXFxuJCdcbiAgICB9XG4gIF07XG4gIHZhciBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46ICcjXFxcXHsnLCBlbmQ6ICd9JyxcbiAgICBsZXhlbXM6IFJVQllfSURFTlRfUkUsXG4gICAga2V5d29yZHM6IFJVQllfS0VZV09SRFNcbiAgfTtcbiAgdmFyIFNUUl9DT05UQUlOUyA9IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXTtcbiAgdmFyIFNUUklOR1MgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/XFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT9cXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlNcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddP3snLCBlbmQ6ICd9JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlNcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddPzwnLCBlbmQ6ICc+JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT8vJywgZW5kOiAnLycsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/JScsIGVuZDogJyUnLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddPy0nLCBlbmQ6ICctJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT9cXFxcfCcsIGVuZDogJ1xcXFx8JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfVxuICBdO1xuICB2YXIgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyB8JHw7JyxcbiAgICBrZXl3b3JkczogJ2RlZicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogUlVCWV9NRVRIT0RfUkUsXG4gICAgICAgIGxleGVtczogUlVCWV9JREVOVF9SRSxcbiAgICAgICAga2V5d29yZHM6IFJVQllfS0VZV09SRFNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGxleGVtczogUlVCWV9JREVOVF9SRSxcbiAgICAgICAga2V5d29yZHM6IFJVQllfS0VZV09SRFNcbiAgICAgIH1cbiAgICBdLmNvbmNhdChDT01NRU5UUylcbiAgfTtcblxuICB2YXIgUlVCWV9ERUZBVUxUX0NPTlRBSU5TID0gQ09NTUVOVFMuY29uY2F0KFNUUklOR1MuY29uY2F0KFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICckfDsnLFxuICAgICAga2V5d29yZHM6ICdjbGFzcyBtb2R1bGUnLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBiZWdpbjogJ1tBLVphLXpfXVxcXFx3Kig6OlxcXFx3KykqKFxcXFw/fFxcXFwhKT8nLFxuICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnaW5oZXJpdGFuY2UnLFxuICAgICAgICAgIGJlZ2luOiAnPFxcXFxzKicsXG4gICAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJlbnQnLFxuICAgICAgICAgICAgYmVnaW46ICcoJyArIGhsanMuSURFTlRfUkUgKyAnOjopPycgKyBobGpzLklERU5UX1JFXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gICAgfSxcbiAgICBGVU5DVElPTixcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsXG4gICAgICBiZWdpbjogJyg6Oik/KFxcXFxiW0EtWl1cXFxcdyooOjopPykrJyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgIGJlZ2luOiAnOicsXG4gICAgICBjb250YWluczogU1RSSU5HUy5jb25jYXQoW3tiZWdpbjogUlVCWV9NRVRIT0RfUkV9XSksXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICBiZWdpbjogUlVCWV9JREVOVF9SRSArICc6JyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiAnKFxcXFxiMFswLTdfXSspfChcXFxcYjB4WzAtOWEtZkEtRl9dKyl8KFxcXFxiWzEtOV1bMC05X10qKFxcXFwuWzAtOV9dKyk/KXxbMF9dXFxcXGInLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgYmVnaW46ICdcXFxcP1xcXFx3J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgYmVnaW46ICcoXFxcXCRcXFxcVyl8KChcXFxcJHxcXFxcQFxcXFxAPykoXFxcXHcrKSknXG4gICAgfSxcbiAgICB7IC8vIHJlZ2V4cCBjb250YWluZXJcbiAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJylcXFxccyonLFxuICAgICAgY29udGFpbnM6IENPTU1FTlRTLmNvbmNhdChbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICAgIGJlZ2luOiAnLycsIGVuZDogJy9bYS16XSonLFxuICAgICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXVxuICAgICAgICB9XG4gICAgICBdKSxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH1cbiAgXSkpO1xuICBTVUJTVC5jb250YWlucyA9IFJVQllfREVGQVVMVF9DT05UQUlOUztcbiAgRlVOQ1RJT04uY29udGFpbnNbMV0uY29udGFpbnMgPSBSVUJZX0RFRkFVTFRfQ09OVEFJTlM7XG5cbiAgcmV0dXJuIHtcbiAgICBsZXhlbXM6IFJVQllfSURFTlRfUkUsXG4gICAga2V5d29yZHM6IFJVQllfS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFJVQllfREVGQVVMVF9DT05UQUlOU1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFRJVExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHZhciBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogJ1xcXFxiKDBbeGJdW0EtWmEtejAtOV9dK3xbMC05X10rKFxcXFwuWzAtOV9dKyk/KFt1aWZdKDh8MTZ8MzJ8NjQpPyk/KScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBLRVlXT1JEUyA9XG4gICAgJ2FsdCBhbnkgYXMgYXNzZXJ0IGJlIGJpbmQgYmxvY2sgYm9vbCBicmVhayBjaGFyIGNoZWNrIGNsYWltIGNvbnN0IGNvbnQgZGlyIGRvIGVsc2UgZW51bSAnICtcbiAgICAnZXhwb3J0IGYzMiBmNjQgZmFpbCBmYWxzZSBmbG9hdCBmbiBmb3IgaTE2IGkzMiBpNjQgaTggaWYgaWZhY2UgaW1wbCBpbXBvcnQgaW4gaW50IGxldCAnICtcbiAgICAnbG9nIG1vZCBtdXRhYmxlIG5hdGl2ZSBub3RlIG9mIHByb3ZlIHB1cmUgcmVzb3VyY2UgcmV0IHNlbGYgc3RyIHN5bnRheCB0cnVlIHR5cGUgdTE2IHUzMiAnICtcbiAgICAndTY0IHU4IHVpbnQgdW5jaGVja2VkIHVuc2FmZSB1c2UgdmVjIHdoaWxlJztcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgTlVNQkVSLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyhcXFxcKHw8KScsXG4gICAgICAgIGtleXdvcmRzOiAnZm4nLFxuICAgICAgICBjb250YWluczogW1RJVExFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyg9fDwpJyxcbiAgICAgICAga2V5d29yZHM6ICd0eXBlJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRV0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyh7fDwpJyxcbiAgICAgICAga2V5d29yZHM6ICdpZmFjZSBlbnVtJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRV0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQU5OT1RBVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdhbm5vdGF0aW9uJywgYmVnaW46ICdAW0EtWmEtel0rJ1xuICB9O1xuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICd1P3I/XCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAndHlwZSB5aWVsZCBsYXp5IG92ZXJyaWRlIGRlZiB3aXRoIHZhbCB2YXIgZmFsc2UgdHJ1ZSBzZWFsZWQgYWJzdHJhY3QgcHJpdmF0ZSB0cmFpdCAnICtcbiAgICAgICdvYmplY3QgbnVsbCBpZiBmb3Igd2hpbGUgdGhyb3cgZmluYWxseSBwcm90ZWN0ZWQgZXh0ZW5kcyBpbXBvcnQgZmluYWwgcmV0dXJuIGVsc2UgJyArXG4gICAgICAnYnJlYWsgbmV3IGNhdGNoIHN1cGVyIGNsYXNzIGNhc2UgcGFja2FnZSBkZWZhdWx0IHRyeSB0aGlzIG1hdGNoIGNvbnRpbnVlIHRocm93cycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnamF2YWRvYycsXG4gICAgICAgIGJlZ2luOiAnL1xcXFwqXFxcXConLCBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICdqYXZhZG9jdGFnJyxcbiAgICAgICAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICAgIH1dLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLCBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFLCBTVFJJTkcsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW46ICcoKGNhc2UgKT9jbGFzcyB8b2JqZWN0IHx0cmFpdCApJywgZW5kOiAnKHt8JCknLCAvLyBiZWdpbldpdGhLZXl3b3JkIHdvbid0IHdvcmsgYmVjYXVzZSBhIHNpbmdsZSBcImNhc2VcIiBzaG91bGRuJ3Qgc3RhcnQgdGhpcyBtb2RlXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAga2V5d29yZHM6ICdjYXNlIGNsYXNzIHRyYWl0IG9iamVjdCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyB3aXRoJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFLCBTVFJJTkcsXG4gICAgICAgICAgICAgIEFOTk9UQVRJT05cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBBTk5PVEFUSU9OXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFZBUl9JREVOVF9SRSA9ICdbYS16XVthLXpBLVowLTlfXSonO1xuICB2YXIgQ0hBUiA9IHtcbiAgICBjbGFzc05hbWU6ICdjaGFyJyxcbiAgICBiZWdpbjogJ1xcXFwkLnsxfSdcbiAgfTtcbiAgdmFyIFNZTUJPTCA9IHtcbiAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgIGJlZ2luOiAnIycgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogJ3NlbGYgc3VwZXIgbmlsIHRydWUgZmFsc2UgdGhpc0NvbnRleHQnLCAvLyBvbmx5IDZcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJbQS1aXVtBLVphLXowLTlfXSonLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGhvZCcsXG4gICAgICAgIGJlZ2luOiBWQVJfSURFTlRfUkUgKyAnOidcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBTWU1CT0wsXG4gICAgICBDSEFSLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsb2NhbHZhcnMnLFxuICAgICAgICBiZWdpbjogJ1xcXFx8XFxcXHMqKCgnICsgVkFSX0lERU5UX1JFICsgJylcXFxccyopK1xcXFx8J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXJyYXknLFxuICAgICAgICBiZWdpbjogJ1xcXFwjXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgIENIQVIsXG4gICAgICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgICAgIFNZTUJPTFxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ29wZXJhdG9yJyxcbiAgICAgICAgYmVnaW46ICcoYmVnaW58c3RhcnR8Y29tbWl0fHJvbGxiYWNrfHNhdmVwb2ludHxsb2NrfGFsdGVyfGNyZWF0ZXxkcm9wfHJlbmFtZXxjYWxsfGRlbGV0ZXxkb3xoYW5kbGVyfGluc2VydHxsb2FkfHJlcGxhY2V8c2VsZWN0fHRydW5jYXRlfHVwZGF0ZXxzZXR8c2hvd3xwcmFnbWF8Z3JhbnQpXFxcXGIoPyE6KScsIC8vIG5lZ2F0aXZlIGxvb2stYWhlYWQgaGVyZSBpcyBzcGVjaWZpY2FsbHkgdG8gcHJldmVudCBzdG9tcGluZyBvbiBTbWFsbFRhbGtcbiAgICAgICAgZW5kOiAnOycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgIGtleXdvcmQ6ICdhbGwgcGFydGlhbCBnbG9iYWwgbW9udGggY3VycmVudF90aW1lc3RhbXAgdXNpbmcgZ28gcmV2b2tlIHNtYWxsaW50ICcgK1xuICAgICAgICAgICAgJ2luZGljYXRvciBlbmQtZXhlYyBkaXNjb25uZWN0IHpvbmUgd2l0aCBjaGFyYWN0ZXIgYXNzZXJ0aW9uIHRvIGFkZCBjdXJyZW50X3VzZXIgJyArXG4gICAgICAgICAgICAndXNhZ2UgaW5wdXQgbG9jYWwgYWx0ZXIgbWF0Y2ggY29sbGF0ZSByZWFsIHRoZW4gcm9sbGJhY2sgZ2V0IHJlYWQgdGltZXN0YW1wICcgK1xuICAgICAgICAgICAgJ3Nlc3Npb25fdXNlciBub3QgaW50ZWdlciBiaXQgdW5pcXVlIGRheSBtaW51dGUgZGVzYyBpbnNlcnQgZXhlY3V0ZSBsaWtlIGlsaWtlfDIgJyArXG4gICAgICAgICAgICAnbGV2ZWwgZGVjaW1hbCBkcm9wIGNvbnRpbnVlIGlzb2xhdGlvbiBmb3VuZCB3aGVyZSBjb25zdHJhaW50cyBkb21haW4gcmlnaHQgJyArXG4gICAgICAgICAgICAnbmF0aW9uYWwgc29tZSBtb2R1bGUgdHJhbnNhY3Rpb24gcmVsYXRpdmUgc2Vjb25kIGNvbm5lY3QgZXNjYXBlIGNsb3NlIHN5c3RlbV91c2VyICcgK1xuICAgICAgICAgICAgJ2ZvciBkZWZlcnJlZCBzZWN0aW9uIGNhc3QgY3VycmVudCBzcWxzdGF0ZSBhbGxvY2F0ZSBpbnRlcnNlY3QgZGVhbGxvY2F0ZSBudW1lcmljICcgK1xuICAgICAgICAgICAgJ3B1YmxpYyBwcmVzZXJ2ZSBmdWxsIGdvdG8gaW5pdGlhbGx5IGFzYyBubyBrZXkgb3V0cHV0IGNvbGxhdGlvbiBncm91cCBieSB1bmlvbiAnICtcbiAgICAgICAgICAgICdzZXNzaW9uIGJvdGggbGFzdCBsYW5ndWFnZSBjb25zdHJhaW50IGNvbHVtbiBvZiBzcGFjZSBmb3JlaWduIGRlZmVycmFibGUgcHJpb3IgJyArXG4gICAgICAgICAgICAnY29ubmVjdGlvbiB1bmtub3duIGFjdGlvbiBjb21taXQgdmlldyBvciBmaXJzdCBpbnRvIGZsb2F0IHllYXIgcHJpbWFyeSBjYXNjYWRlZCAnICtcbiAgICAgICAgICAgICdleGNlcHQgcmVzdHJpY3Qgc2V0IHJlZmVyZW5jZXMgbmFtZXMgdGFibGUgb3V0ZXIgb3BlbiBzZWxlY3Qgc2l6ZSBhcmUgcm93cyBmcm9tICcgK1xuICAgICAgICAgICAgJ3ByZXBhcmUgZGlzdGluY3QgbGVhZGluZyBjcmVhdGUgb25seSBuZXh0IGlubmVyIGF1dGhvcml6YXRpb24gc2NoZW1hICcgK1xuICAgICAgICAgICAgJ2NvcnJlc3BvbmRpbmcgb3B0aW9uIGRlY2xhcmUgcHJlY2lzaW9uIGltbWVkaWF0ZSBlbHNlIHRpbWV6b25lX21pbnV0ZSBleHRlcm5hbCAnICtcbiAgICAgICAgICAgICd2YXJ5aW5nIHRyYW5zbGF0aW9uIHRydWUgY2FzZSBleGNlcHRpb24gam9pbiBob3VyIGRlZmF1bHQgZG91YmxlIHNjcm9sbCB2YWx1ZSAnICtcbiAgICAgICAgICAgICdjdXJzb3IgZGVzY3JpcHRvciB2YWx1ZXMgZGVjIGZldGNoIHByb2NlZHVyZSBkZWxldGUgYW5kIGZhbHNlIGludCBpcyBkZXNjcmliZSAnICtcbiAgICAgICAgICAgICdjaGFyIGFzIGF0IGluIHZhcmNoYXIgbnVsbCB0cmFpbGluZyBhbnkgYWJzb2x1dGUgY3VycmVudF90aW1lIGVuZCBncmFudCAnICtcbiAgICAgICAgICAgICdwcml2aWxlZ2VzIHdoZW4gY3Jvc3MgY2hlY2sgd3JpdGUgY3VycmVudF9kYXRlIHBhZCBiZWdpbiB0ZW1wb3JhcnkgZXhlYyB0aW1lICcgK1xuICAgICAgICAgICAgJ3VwZGF0ZSBjYXRhbG9nIHVzZXIgc3FsIGRhdGUgb24gaWRlbnRpdHkgdGltZXpvbmVfaG91ciBuYXR1cmFsIHdoZW5ldmVyIGludGVydmFsICcgK1xuICAgICAgICAgICAgJ3dvcmsgb3JkZXIgY2FzY2FkZSBkaWFnbm9zdGljcyBuY2hhciBoYXZpbmcgbGVmdCBjYWxsIGRvIGhhbmRsZXIgbG9hZCByZXBsYWNlICcgK1xuICAgICAgICAgICAgJ3RydW5jYXRlIHN0YXJ0IGxvY2sgc2hvdyBwcmFnbWEgZXhpc3RzIG51bWJlcicsXG4gICAgICAgICAgYWdncmVnYXRlOiAnY291bnQgc3VtIG1pbiBtYXggYXZnJ1xuICAgICAgICB9LFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwge2JlZ2luOiAnXFwnXFwnJ31dLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCB7YmVnaW46ICdcIlwiJ31dLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCcsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnLS0nLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBDT01NQU5EMSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tYW5kJyxcbiAgICBiZWdpbjogJ1xcXFxcXFxcW2EtekEtWtCwLdGP0JAt0Y9dK1tcXFxcKl0/J1xuICB9O1xuICB2YXIgQ09NTUFORDIgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWFuZCcsXG4gICAgYmVnaW46ICdcXFxcXFxcXFteYS16QS1a0LAt0Y/QkC3RjzAtOV0nXG4gIH07XG4gIHZhciBTUEVDSUFMID0ge1xuICAgIGNsYXNzTmFtZTogJ3NwZWNpYWwnLFxuICAgIGJlZ2luOiAnW3t9XFxcXFtcXFxcXVxcXFwmI35dJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7IC8vIHBhcmFtZXRlclxuICAgICAgICBiZWdpbjogJ1xcXFxcXFxcW2EtekEtWtCwLdGP0JAt0Y9dK1tcXFxcKl0/ICo9ICotP1xcXFxkKlxcXFwuP1xcXFxkKyhwdHxwY3xtbXxjbXxpbnxkZHxjY3xleHxlbSk/JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgQ09NTUFORDEsIENPTU1BTkQyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgICAgICBiZWdpbjogJyAqPScsIGVuZDogJy0/XFxcXGQqXFxcXC4/XFxcXGQrKHB0fHBjfG1tfGNtfGlufGRkfGNjfGV4fGVtKT8nLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgQ09NTUFORDEsIENPTU1BTkQyLFxuICAgICAgU1BFQ0lBTCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybXVsYScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCRcXFxcJCcsIGVuZDogJ1xcXFwkXFxcXCQnLFxuICAgICAgICBjb250YWluczogW0NPTU1BTkQxLCBDT01NQU5EMiwgU1BFQ0lBTF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybXVsYScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCQnLCBlbmQ6ICdcXFxcJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbQ09NTUFORDEsIENPTU1BTkQyLCBTUEVDSUFMXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICclJywgZW5kOiAnJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgIC8vIFZhbHVlIHR5cGVzXG4gICAgICAgICdjaGFyIHVjaGFyIHVuaWNoYXIgaW50IHVpbnQgbG9uZyB1bG9uZyBzaG9ydCB1c2hvcnQgaW50OCBpbnQxNiBpbnQzMiBpbnQ2NCB1aW50OCAnICtcbiAgICAgICAgJ3VpbnQxNiB1aW50MzIgdWludDY0IGZsb2F0IGRvdWJsZSBib29sIHN0cnVjdCBlbnVtIHN0cmluZyB2b2lkICcgK1xuICAgICAgICAvLyBSZWZlcmVuY2UgdHlwZXNcbiAgICAgICAgJ3dlYWsgdW5vd25lZCBvd25lZCAnICtcbiAgICAgICAgLy8gTW9kaWZpZXJzXG4gICAgICAgICdhc3luYyBzaWduYWwgc3RhdGljIGFic3RyYWN0IGludGVyZmFjZSBvdmVycmlkZSAnICtcbiAgICAgICAgLy8gQ29udHJvbCBTdHJ1Y3R1cmVzXG4gICAgICAgICd3aGlsZSBkbyBmb3IgZm9yZWFjaCBlbHNlIHN3aXRjaCBjYXNlIGJyZWFrIGRlZmF1bHQgcmV0dXJuIHRyeSBjYXRjaCAnICtcbiAgICAgICAgLy8gVmlzaWJpbGl0eVxuICAgICAgICAncHVibGljIHByaXZhdGUgcHJvdGVjdGVkIGludGVybmFsICcgK1xuICAgICAgICAvLyBPdGhlclxuICAgICAgICAndXNpbmcgbmV3IHRoaXMgZ2V0IHNldCBjb25zdCBzdGRvdXQgc3RkaW4gc3RkZXJyIHZhcicsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ0RCdXMgR0xpYiBDQ29kZSBHZWUgT2JqZWN0JyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdmYWxzZSB0cnVlIG51bGwnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZSBkZWxlZ2F0ZSBuYW1lc3BhY2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiXCJcIicsIGVuZDogJ1wiXCJcIicsXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnXiMnLCBlbmQ6ICckJyxcbiAgICAgICAgcmVsZXZhbmNlOiAyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsXG4gICAgICAgIGJlZ2luOiAnIFtBLVpfXSsgJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnY2FsbCBjbGFzcyBjb25zdCBkaW0gZG8gbG9vcCBlcmFzZSBleGVjdXRlIGV4ZWN1dGVnbG9iYWwgZXhpdCBmb3IgZWFjaCBuZXh0IGZ1bmN0aW9uICcgK1xuICAgICAgICAnaWYgdGhlbiBlbHNlIG9uIGVycm9yIG9wdGlvbiBleHBsaWNpdCBuZXcgcHJpdmF0ZSBwcm9wZXJ0eSBsZXQgZ2V0IHB1YmxpYyByYW5kb21pemUgJyArXG4gICAgICAgICdyZWRpbSByZW0gc2VsZWN0IGNhc2Ugc2V0IHN0b3Agc3ViIHdoaWxlIHdlbmQgd2l0aCBlbmQgdG8gZWxzZWlmIGlzIG9yIHhvciBhbmQgbm90ICcgK1xuICAgICAgICAnY2xhc3NfaW5pdGlhbGl6ZSBjbGFzc190ZXJtaW5hdGUgZGVmYXVsdCBwcmVzZXJ2ZSBpbiBtZSBieXZhbCBieXJlZiBzdGVwIHJlc3VtZSBnb3RvJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnbGNhc2UgbW9udGggdmFydHlwZSBpbnN0cnJldiB1Ym91bmQgc2V0bG9jYWxlIGdldG9iamVjdCByZ2IgZ2V0cmVmIHN0cmluZyAnICtcbiAgICAgICAgJ3dlZWtkYXluYW1lIHJuZCBkYXRlYWRkIG1vbnRobmFtZSBub3cgZGF5IG1pbnV0ZSBpc2FycmF5IGNib29sIHJvdW5kIGZvcm1hdGN1cnJlbmN5ICcgK1xuICAgICAgICAnY29udmVyc2lvbnMgY3NuZyB0aW1ldmFsdWUgc2Vjb25kIHllYXIgc3BhY2UgYWJzIGNsbmcgdGltZXNlcmlhbCBmaXhzIGxlbiBhc2MgJyArXG4gICAgICAgICdpc2VtcHR5IG1hdGhzIGRhdGVzZXJpYWwgYXRuIHRpbWVyIGlzb2JqZWN0IGZpbHRlciB3ZWVrZGF5IGRhdGV2YWx1ZSBjY3VyIGlzZGF0ZSAnICtcbiAgICAgICAgJ2luc3RyIGRhdGVkaWZmIGZvcm1hdGRhdGV0aW1lIHJlcGxhY2UgaXNudWxsIHJpZ2h0IHNnbiBhcnJheSBzbnVtZXJpYyBsb2cgY2RibCBoZXggJyArXG4gICAgICAgICdjaHIgbGJvdW5kIG1zZ2JveCB1Y2FzZSBnZXRsb2NhbGUgY29zIGNkYXRlIGNieXRlIHJ0cmltIGpvaW4gaG91ciBvY3QgdHlwZW5hbWUgdHJpbSAnICtcbiAgICAgICAgJ3N0cmNvbXAgaW50IGNyZWF0ZW9iamVjdCBsb2FkcGljdHVyZSB0YW4gZm9ybWF0bnVtYmVyIG1pZCBzY3JpcHRlbmdpbmVidWlsZHZlcnNpb24gJyArXG4gICAgICAgICdzY3JpcHRlbmdpbmUgc3BsaXQgc2NyaXB0ZW5naW5lbWlub3J2ZXJzaW9uIGNpbnQgc2luIGRhdGVwYXJ0IGx0cmltIHNxciAnICtcbiAgICAgICAgJ3NjcmlwdGVuZ2luZW1ham9ydmVyc2lvbiB0aW1lIGRlcml2ZWQgZXZhbCBkYXRlIGZvcm1hdHBlcmNlbnQgZXhwIGlucHV0Ym94IGxlZnQgYXNjdyAnICtcbiAgICAgICAgJ2NocncgcmVnZXhwIHNlcnZlciByZXNwb25zZSByZXF1ZXN0IGNzdHIgZXJyJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICd0cnVlIGZhbHNlIG51bGwgbm90aGluZyBlbXB0eSdcbiAgICB9LFxuICAgIGlsbGVnYWw6ICcvLycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7Y29udGFpbnM6IFt7YmVnaW46ICdcIlwiJ31dfSksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ1xcJycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYWJzIGFjY2VzcyBhZnRlciBhbGlhcyBhbGwgYW5kIGFyY2hpdGVjdHVyZSBhcnJheSBhc3NlcnQgYXR0cmlidXRlIGJlZ2luIGJsb2NrICcgK1xuICAgICAgICAnYm9keSBidWZmZXIgYnVzIGNhc2UgY29tcG9uZW50IGNvbmZpZ3VyYXRpb24gY29uc3RhbnQgY29udGV4dCBjb3ZlciBkaXNjb25uZWN0ICcgK1xuICAgICAgICAnZG93bnRvIGRlZmF1bHQgZWxzZSBlbHNpZiBlbmQgZW50aXR5IGV4aXQgZmFpcm5lc3MgZmlsZSBmb3IgZm9yY2UgZnVuY3Rpb24gZ2VuZXJhdGUgJyArXG4gICAgICAgICdnZW5lcmljIGdyb3VwIGd1YXJkZWQgaWYgaW1wdXJlIGluIGluZXJ0aWFsIGlub3V0IGlzIGxhYmVsIGxpYnJhcnkgbGlua2FnZSBsaXRlcmFsICcgK1xuICAgICAgICAnbG9vcCBtYXAgbW9kIG5hbmQgbmV3IG5leHQgbm9yIG5vdCBudWxsIG9mIG9uIG9wZW4gb3Igb3RoZXJzIG91dCBwYWNrYWdlIHBvcnQgJyArXG4gICAgICAgICdwb3N0cG9uZWQgcHJvY2VkdXJlIHByb2Nlc3MgcHJvcGVydHkgcHJvdGVjdGVkIHB1cmUgcmFuZ2UgcmVjb3JkIHJlZ2lzdGVyIHJlamVjdCAnICtcbiAgICAgICAgJ3JlbGVhc2UgcmVtIHJlcG9ydCByZXN0cmljdCByZXN0cmljdF9ndWFyYW50ZWUgcmV0dXJuIHJvbCByb3Igc2VsZWN0IHNlcXVlbmNlICcgK1xuICAgICAgICAnc2V2ZXJpdHkgc2hhcmVkIHNpZ25hbCBzbGEgc2xsIHNyYSBzcmwgc3Ryb25nIHN1YnR5cGUgdGhlbiB0byB0cmFuc3BvcnQgdHlwZSAnICtcbiAgICAgICAgJ3VuYWZmZWN0ZWQgdW5pdHMgdW50aWwgdXNlIHZhcmlhYmxlIHZtb2RlIHZwcm9wIHZ1bml0IHdhaXQgd2hlbiB3aGlsZSB3aXRoIHhub3IgeG9yJyxcbiAgICAgIHR5cGVuYW1lOlxuICAgICAgICAnYm9vbGVhbiBiaXQgY2hhcmFjdGVyIHNldmVyaXR5X2xldmVsIGludGVnZXIgdGltZSBkZWxheV9sZW5ndGggbmF0dXJhbCBwb3NpdGl2ZSAnICtcbiAgICAgICAgJ3N0cmluZyBiaXRfdmVjdG9yIGZpbGVfb3Blbl9raW5kIGZpbGVfb3Blbl9zdGF0dXMgc3RkX3Vsb2dpYyBzdGRfdWxvZ2ljX3ZlY3RvciAnICtcbiAgICAgICAgJ3N0ZF9sb2dpYyBzdGRfbG9naWNfdmVjdG9yIHVuc2lnbmVkIHNpZ25lZCBib29sZWFuX3ZlY3RvciBpbnRlZ2VyX3ZlY3RvciAnICtcbiAgICAgICAgJ3JlYWxfdmVjdG9yIHRpbWVfdmVjdG9yJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJ3snLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLCAgICAgICAgLy8gVkhETC0yMDA4IGJsb2NrIGNvbW1lbnRpbmcuXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy0tJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgYmVnaW46ICdcXCcoVXxYfDB8MXxafFd8THxIfC0pXFwnJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogJ1xcJ1tBLVphLXpdKF8/W0EtWmEtejAtOV0pKicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfVxuICAgIF1cbiAgfTsgLy8gcmV0dXJuXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgWE1MX0lERU5UX1JFID0gJ1tBLVphLXowLTlcXFxcLl86LV0rJztcbiAgdmFyIFRBR19JTlRFUk5BTFMgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46IFhNTF9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz1cIicsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgYmVnaW46ICdcIicsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz1cXCcnLCByZXR1cm5CZWdpbjogdHJ1ZSwgZW5kOiAnXFwnJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgIGJlZ2luOiAnXFwnJywgZW5kc1dpdGhQYXJlbnQ6IHRydWVcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPScsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICBiZWdpbjogJ1teXFxcXHMvPl0rJ1xuICAgICAgICB9XVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BpJyxcbiAgICAgICAgYmVnaW46ICc8XFxcXD8nLCBlbmQ6ICdcXFxcPz4nLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdkb2N0eXBlJyxcbiAgICAgICAgYmVnaW46ICc8IURPQ1RZUEUnLCBlbmQ6ICc+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFt7YmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJ31dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICc8IS0tJywgZW5kOiAnLS0+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2RhdGEnLFxuICAgICAgICBiZWdpbjogJzxcXFxcIVxcXFxbQ0RBVEFcXFxcWycsIGVuZDogJ1xcXFxdXFxcXF0+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgLypcbiAgICAgICAgVGhlIGxvb2thaGVhZCBwYXR0ZXJuICg/PS4uLikgZW5zdXJlcyB0aGF0ICdiZWdpbicgb25seSBtYXRjaGVzXG4gICAgICAgICc8c3R5bGUnIGFzIGEgc2luZ2xlIHdvcmQsIGZvbGxvd2VkIGJ5IGEgd2hpdGVzcGFjZSBvciBhblxuICAgICAgICBlbmRpbmcgYnJha2V0LiBUaGUgJyQnIGlzIG5lZWRlZCBmb3IgdGhlIGxleGVtIHRvIGJlIHJlY29nbml6ZWRcbiAgICAgICAgYnkgaGxqcy5zdWJNb2RlKCkgdGhhdCB0ZXN0cyBsZXhlbXMgb3V0c2lkZSB0aGUgc3RyZWFtLlxuICAgICAgICAqL1xuICAgICAgICBiZWdpbjogJzxzdHlsZSg/PVxcXFxzfD58JCknLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IHt0aXRsZTogJ3N0eWxlJ30sXG4gICAgICAgIGNvbnRhaW5zOiBbVEFHX0lOVEVSTkFMU10sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJzwvc3R5bGU+JywgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnY3NzJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLFxuICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgaW4gdGhlIDxzdHlsZSB0YWcgYWJvdXQgdGhlIGxvb2thaGVhZCBwYXR0ZXJuXG4gICAgICAgIGJlZ2luOiAnPHNjcmlwdCg/PVxcXFxzfD58JCknLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IHt0aXRsZTogJ3NjcmlwdCd9LFxuICAgICAgICBjb250YWluczogW1RBR19JTlRFUk5BTFNdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6ICc8L3NjcmlwdD4nLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdqYXZhc2NyaXB0J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJzwlJywgZW5kOiAnJT4nLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3Zic2NyaXB0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgYmVnaW46ICc8Lz8nLCBlbmQ6ICcvPz4nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46ICdbXiAvPl0rJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgVEFHX0lOVEVSTkFMU1xuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJ2YXIgaW5zZXJ0ZWQgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gICAgaWYgKGluc2VydGVkLmluZGV4T2YoY3NzKSA+PSAwKSByZXR1cm47XG4gICAgaW5zZXJ0ZWQucHVzaChjc3MpO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgZWxlbS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBcbiAgICBpZiAoZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShlbGVtLCBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbMF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwidmFyIGdsb2JhbD10eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge307LyoqXG4gKiBtYXJrZWQgLSBhIG1hcmtkb3duIHBhcnNlclxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMTMsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWRcbiAqL1xuXG47KGZ1bmN0aW9uKCkge1xuXG4vKipcbiAqIEJsb2NrLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgYmxvY2sgPSB7XG4gIG5ld2xpbmU6IC9eXFxuKy8sXG4gIGNvZGU6IC9eKCB7NH1bXlxcbl0rXFxuKikrLyxcbiAgZmVuY2VzOiBub29wLFxuICBocjogL14oICpbLSpfXSl7Myx9ICooPzpcXG4rfCQpLyxcbiAgaGVhZGluZzogL14gKigjezEsNn0pICooW15cXG5dKz8pICojKiAqKD86XFxuK3wkKS8sXG4gIG5wdGFibGU6IG5vb3AsXG4gIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiAqKD18LSl7Myx9ICpcXG4qLyxcbiAgYmxvY2txdW90ZTogL14oICo+W15cXG5dKyhcXG5bXlxcbl0rKSpcXG4qKSsvLFxuICBsaXN0OiAvXiggKikoYnVsbCkgW1xcc1xcU10rPyg/OmhyfFxcbnsyLH0oPyEgKSg/IVxcMWJ1bGwgKVxcbip8XFxzKiQpLyxcbiAgaHRtbDogL14gKig/OmNvbW1lbnR8Y2xvc2VkfGNsb3NpbmcpICooPzpcXG57Mix9fFxccyokKS8sXG4gIGRlZjogL14gKlxcWyhbXlxcXV0rKVxcXTogKjw/KFteXFxzPl0rKT4/KD86ICtbXCIoXShbXlxcbl0rKVtcIildKT8gKig/Olxcbit8JCkvLFxuICB0YWJsZTogbm9vcCxcbiAgcGFyYWdyYXBoOiAvXigoPzpbXlxcbl0rXFxuPyg/IWhyfGhlYWRpbmd8bGhlYWRpbmd8YmxvY2txdW90ZXx0YWd8ZGVmKSkrKVxcbiovLFxuICB0ZXh0OiAvXlteXFxuXSsvXG59O1xuXG5ibG9jay5idWxsZXQgPSAvKD86WyorLV18XFxkK1xcLikvO1xuYmxvY2suaXRlbSA9IC9eKCAqKShidWxsKSBbXlxcbl0qKD86XFxuKD8hXFwxYnVsbCApW15cXG5dKikqLztcbmJsb2NrLml0ZW0gPSByZXBsYWNlKGJsb2NrLml0ZW0sICdnbScpXG4gICgvYnVsbC9nLCBibG9jay5idWxsZXQpXG4gICgpO1xuXG5ibG9jay5saXN0ID0gcmVwbGFjZShibG9jay5saXN0KVxuICAoL2J1bGwvZywgYmxvY2suYnVsbGV0KVxuICAoJ2hyJywgL1xcbisoPz0oPzogKlstKl9dKXszLH0gKig/Olxcbit8JCkpLylcbiAgKCk7XG5cbmJsb2NrLl90YWcgPSAnKD8hKD86J1xuICArICdhfGVtfHN0cm9uZ3xzbWFsbHxzfGNpdGV8cXxkZm58YWJicnxkYXRhfHRpbWV8Y29kZSdcbiAgKyAnfHZhcnxzYW1wfGtiZHxzdWJ8c3VwfGl8Ynx1fG1hcmt8cnVieXxydHxycHxiZGl8YmRvJ1xuICArICd8c3Bhbnxicnx3YnJ8aW5zfGRlbHxpbWcpXFxcXGIpXFxcXHcrKD8hOi98QClcXFxcYic7XG5cbmJsb2NrLmh0bWwgPSByZXBsYWNlKGJsb2NrLmh0bWwpXG4gICgnY29tbWVudCcsIC88IS0tW1xcc1xcU10qPy0tPi8pXG4gICgnY2xvc2VkJywgLzwodGFnKVtcXHNcXFNdKz88XFwvXFwxPi8pXG4gICgnY2xvc2luZycsIC88dGFnKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LylcbiAgKC90YWcvZywgYmxvY2suX3RhZylcbiAgKCk7XG5cbmJsb2NrLnBhcmFncmFwaCA9IHJlcGxhY2UoYmxvY2sucGFyYWdyYXBoKVxuICAoJ2hyJywgYmxvY2suaHIpXG4gICgnaGVhZGluZycsIGJsb2NrLmhlYWRpbmcpXG4gICgnbGhlYWRpbmcnLCBibG9jay5saGVhZGluZylcbiAgKCdibG9ja3F1b3RlJywgYmxvY2suYmxvY2txdW90ZSlcbiAgKCd0YWcnLCAnPCcgKyBibG9jay5fdGFnKVxuICAoJ2RlZicsIGJsb2NrLmRlZilcbiAgKCk7XG5cbi8qKlxuICogTm9ybWFsIEJsb2NrIEdyYW1tYXJcbiAqL1xuXG5ibG9jay5ub3JtYWwgPSBtZXJnZSh7fSwgYmxvY2spO1xuXG4vKipcbiAqIEdGTSBCbG9jayBHcmFtbWFyXG4gKi9cblxuYmxvY2suZ2ZtID0gbWVyZ2Uoe30sIGJsb2NrLm5vcm1hbCwge1xuICBmZW5jZXM6IC9eICooYHszLH18fnszLH0pICooXFxTKyk/ICpcXG4oW1xcc1xcU10rPylcXHMqXFwxICooPzpcXG4rfCQpLyxcbiAgcGFyYWdyYXBoOiAvXi9cbn0pO1xuXG5ibG9jay5nZm0ucGFyYWdyYXBoID0gcmVwbGFjZShibG9jay5wYXJhZ3JhcGgpXG4gICgnKD8hJywgJyg/IScgKyBibG9jay5nZm0uZmVuY2VzLnNvdXJjZS5yZXBsYWNlKCdcXFxcMScsICdcXFxcMicpICsgJ3wnKVxuICAoKTtcblxuLyoqXG4gKiBHRk0gKyBUYWJsZXMgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLnRhYmxlcyA9IG1lcmdlKHt9LCBibG9jay5nZm0sIHtcbiAgbnB0YWJsZTogL14gKihcXFMuKlxcfC4qKVxcbiAqKFstOl0rICpcXHxbLXwgOl0qKVxcbigoPzouKlxcfC4qKD86XFxufCQpKSopXFxuKi8sXG4gIHRhYmxlOiAvXiAqXFx8KC4rKVxcbiAqXFx8KCAqWy06XStbLXwgOl0qKVxcbigoPzogKlxcfC4qKD86XFxufCQpKSopXFxuKi9cbn0pO1xuXG4vKipcbiAqIEJsb2NrIExleGVyXG4gKi9cblxuZnVuY3Rpb24gTGV4ZXIob3B0aW9ucykge1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLnRva2Vucy5saW5rcyA9IHt9O1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbiAgdGhpcy5ydWxlcyA9IGJsb2NrLm5vcm1hbDtcblxuICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMudGFibGVzKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2sudGFibGVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gYmxvY2suZ2ZtO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBCbG9jayBSdWxlc1xuICovXG5cbkxleGVyLnJ1bGVzID0gYmxvY2s7XG5cbi8qKlxuICogU3RhdGljIExleCBNZXRob2RcbiAqL1xuXG5MZXhlci5sZXggPSBmdW5jdGlvbihzcmMsIG9wdGlvbnMpIHtcbiAgdmFyIGxleGVyID0gbmV3IExleGVyKG9wdGlvbnMpO1xuICByZXR1cm4gbGV4ZXIubGV4KHNyYyk7XG59O1xuXG4vKipcbiAqIFByZXByb2Nlc3NpbmdcbiAqL1xuXG5MZXhlci5wcm90b3R5cGUubGV4ID0gZnVuY3Rpb24oc3JjKSB7XG4gIHNyYyA9IHNyY1xuICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgIC5yZXBsYWNlKC9cXHQvZywgJyAgICAnKVxuICAgIC5yZXBsYWNlKC9cXHUwMGEwL2csICcgJylcbiAgICAucmVwbGFjZSgvXFx1MjQyNC9nLCAnXFxuJyk7XG5cbiAgcmV0dXJuIHRoaXMudG9rZW4oc3JjLCB0cnVlKTtcbn07XG5cbi8qKlxuICogTGV4aW5nXG4gKi9cblxuTGV4ZXIucHJvdG90eXBlLnRva2VuID0gZnVuY3Rpb24oc3JjLCB0b3ApIHtcbiAgdmFyIHNyYyA9IHNyYy5yZXBsYWNlKC9eICskL2dtLCAnJylcbiAgICAsIG5leHRcbiAgICAsIGxvb3NlXG4gICAgLCBjYXBcbiAgICAsIGJ1bGxcbiAgICAsIGJcbiAgICAsIGl0ZW1cbiAgICAsIHNwYWNlXG4gICAgLCBpXG4gICAgLCBsO1xuXG4gIHdoaWxlIChzcmMpIHtcbiAgICAvLyBuZXdsaW5lXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubmV3bGluZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBpZiAoY2FwWzBdLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ3NwYWNlJ1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb2RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuY29kZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBjYXAgPSBjYXBbMF0ucmVwbGFjZSgvXiB7NH0vZ20sICcnKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgIHRleHQ6ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICA/IGNhcC5yZXBsYWNlKC9cXG4rJC8sICcnKVxuICAgICAgICAgIDogY2FwXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGZlbmNlcyAoZ2ZtKVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmZlbmNlcy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICBsYW5nOiBjYXBbMl0sXG4gICAgICAgIHRleHQ6IGNhcFszXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBoZWFkaW5nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuaGVhZGluZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICBkZXB0aDogY2FwWzFdLmxlbmd0aCxcbiAgICAgICAgdGV4dDogY2FwWzJdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRhYmxlIG5vIGxlYWRpbmcgcGlwZSAoZ2ZtKVxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMubnB0YWJsZS5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuXG4gICAgICBpdGVtID0ge1xuICAgICAgICB0eXBlOiAndGFibGUnLFxuICAgICAgICBoZWFkZXI6IGNhcFsxXS5yZXBsYWNlKC9eICp8ICpcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGFsaWduOiBjYXBbMl0ucmVwbGFjZSgvXiAqfFxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgY2VsbHM6IGNhcFszXS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKVxuICAgICAgfTtcblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uYWxpZ24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKC9eICotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnY2VudGVyJztcbiAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5jZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtLmNlbGxzW2ldID0gaXRlbS5jZWxsc1tpXS5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaGVhZGluZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxoZWFkaW5nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgIGRlcHRoOiBjYXBbMl0gPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICB0ZXh0OiBjYXBbMV1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHJcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5oci5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2hyJ1xuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBibG9ja3F1b3RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYmxvY2txdW90ZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmxvY2txdW90ZV9zdGFydCdcbiAgICAgIH0pO1xuXG4gICAgICBjYXAgPSBjYXBbMF0ucmVwbGFjZSgvXiAqPiA/L2dtLCAnJyk7XG5cbiAgICAgIC8vIFBhc3MgYHRvcGAgdG8ga2VlcCB0aGUgY3VycmVudFxuICAgICAgLy8gXCJ0b3BsZXZlbFwiIHN0YXRlLiBUaGlzIGlzIGV4YWN0bHlcbiAgICAgIC8vIGhvdyBtYXJrZG93bi5wbCB3b3Jrcy5cbiAgICAgIHRoaXMudG9rZW4oY2FwLCB0b3ApO1xuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2Jsb2NrcXVvdGVfZW5kJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxpc3RcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5saXN0LmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGJ1bGwgPSBjYXBbMl07XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9zdGFydCcsXG4gICAgICAgIG9yZGVyZWQ6IGJ1bGwubGVuZ3RoID4gMVxuICAgICAgfSk7XG5cbiAgICAgIC8vIEdldCBlYWNoIHRvcC1sZXZlbCBpdGVtLlxuICAgICAgY2FwID0gY2FwWzBdLm1hdGNoKHRoaXMucnVsZXMuaXRlbSk7XG5cbiAgICAgIG5leHQgPSBmYWxzZTtcbiAgICAgIGwgPSBjYXAubGVuZ3RoO1xuICAgICAgaSA9IDA7XG5cbiAgICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIGl0ZW0gPSBjYXBbaV07XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGl0ZW0ncyBidWxsZXRcbiAgICAgICAgLy8gc28gaXQgaXMgc2VlbiBhcyB0aGUgbmV4dCB0b2tlbi5cbiAgICAgICAgc3BhY2UgPSBpdGVtLmxlbmd0aDtcbiAgICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvXiAqKFsqKy1dfFxcZCtcXC4pICsvLCAnJyk7XG5cbiAgICAgICAgLy8gT3V0ZGVudCB3aGF0ZXZlciB0aGVcbiAgICAgICAgLy8gbGlzdCBpdGVtIGNvbnRhaW5zLiBIYWNreS5cbiAgICAgICAgaWYgKH5pdGVtLmluZGV4T2YoJ1xcbiAnKSkge1xuICAgICAgICAgIHNwYWNlIC09IGl0ZW0ubGVuZ3RoO1xuICAgICAgICAgIGl0ZW0gPSAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgICA/IGl0ZW0ucmVwbGFjZShuZXcgUmVnRXhwKCdeIHsxLCcgKyBzcGFjZSArICd9JywgJ2dtJyksICcnKVxuICAgICAgICAgICAgOiBpdGVtLnJlcGxhY2UoL14gezEsNH0vZ20sICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSB3aGV0aGVyIHRoZSBuZXh0IGxpc3QgaXRlbSBiZWxvbmdzIGhlcmUuXG4gICAgICAgIC8vIEJhY2twZWRhbCBpZiBpdCBkb2VzIG5vdCBiZWxvbmcgaW4gdGhpcyBsaXN0LlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNtYXJ0TGlzdHMgJiYgaSAhPT0gbCAtIDEpIHtcbiAgICAgICAgICBiID0gYmxvY2suYnVsbGV0LmV4ZWMoY2FwW2krMV0pWzBdO1xuICAgICAgICAgIGlmIChidWxsICE9PSBiICYmICEoYnVsbC5sZW5ndGggPiAxICYmIGIubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgIHNyYyA9IGNhcC5zbGljZShpICsgMSkuam9pbignXFxuJykgKyBzcmM7XG4gICAgICAgICAgICBpID0gbCAtIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgaXRlbSBpcyBsb29zZSBvciBub3QuXG4gICAgICAgIC8vIFVzZTogLyhefFxcbikoPyEgKVteXFxuXStcXG5cXG4oPyFcXHMqJCkvXG4gICAgICAgIC8vIGZvciBkaXNjb3VudCBiZWhhdmlvci5cbiAgICAgICAgbG9vc2UgPSBuZXh0IHx8IC9cXG5cXG4oPyFcXHMqJCkvLnRlc3QoaXRlbSk7XG4gICAgICAgIGlmIChpICE9PSBsIC0gMSkge1xuICAgICAgICAgIG5leHQgPSBpdGVtW2l0ZW0ubGVuZ3RoLTFdID09PSAnXFxuJztcbiAgICAgICAgICBpZiAoIWxvb3NlKSBsb29zZSA9IG5leHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiBsb29zZVxuICAgICAgICAgICAgPyAnbG9vc2VfaXRlbV9zdGFydCdcbiAgICAgICAgICAgIDogJ2xpc3RfaXRlbV9zdGFydCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVjdXJzZS5cbiAgICAgICAgdGhpcy50b2tlbihpdGVtLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2xpc3RfaXRlbV9lbmQnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2xpc3RfZW5kJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGh0bWxcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5odG1sLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMuc2FuaXRpemVcbiAgICAgICAgICA/ICdwYXJhZ3JhcGgnXG4gICAgICAgICAgOiAnaHRtbCcsXG4gICAgICAgIHByZTogY2FwWzFdID09PSAncHJlJyB8fCBjYXBbMV0gPT09ICdzY3JpcHQnLFxuICAgICAgICB0ZXh0OiBjYXBbMF1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZGVmXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5kZWYuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLmxpbmtzW2NhcFsxXS50b0xvd2VyQ2FzZSgpXSA9IHtcbiAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICB0aXRsZTogY2FwWzNdXG4gICAgICB9O1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgKGdmbSlcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLnRhYmxlLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgIGhlYWRlcjogY2FwWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBjZWxsczogY2FwWzNdLnJlcGxhY2UoLyg/OiAqXFx8ICopP1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0uY2VsbHNbaV0gPSBpdGVtLmNlbGxzW2ldXG4gICAgICAgICAgLnJlcGxhY2UoL14gKlxcfCAqfCAqXFx8ICokL2csICcnKVxuICAgICAgICAgIC5zcGxpdCgvICpcXHwgKi8pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2Vucy5wdXNoKGl0ZW0pO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0b3AtbGV2ZWwgcGFyYWdyYXBoXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5wYXJhZ3JhcGguZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAncGFyYWdyYXBoJyxcbiAgICAgICAgdGV4dDogY2FwWzFdW2NhcFsxXS5sZW5ndGgtMV0gPT09ICdcXG4nXG4gICAgICAgICAgPyBjYXBbMV0uc2xpY2UoMCwgLTEpXG4gICAgICAgICAgOiBjYXBbMV1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGV4dFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhzcmMpKSB7XG4gICAgICAvLyBUb3AtbGV2ZWwgc2hvdWxkIG5ldmVyIHJlYWNoIGhlcmUuXG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgdGV4dDogY2FwWzBdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHRocm93IG5ld1xuICAgICAgICBFcnJvcignSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLnRva2Vucztcbn07XG5cbi8qKlxuICogSW5saW5lLUxldmVsIEdyYW1tYXJcbiAqL1xuXG52YXIgaW5saW5lID0ge1xuICBlc2NhcGU6IC9eXFxcXChbXFxcXGAqe31cXFtcXF0oKSMrXFwtLiFfPl0pLyxcbiAgYXV0b2xpbms6IC9ePChbXiA+XSsoQHw6XFwvKVteID5dKyk+LyxcbiAgdXJsOiBub29wLFxuICB0YWc6IC9ePCEtLVtcXHNcXFNdKj8tLT58XjxcXC8/XFx3Kyg/OlwiW15cIl0qXCJ8J1teJ10qJ3xbXidcIj5dKSo/Pi8sXG4gIGxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxcKGhyZWZcXCkvLFxuICByZWZsaW5rOiAvXiE/XFxbKGluc2lkZSlcXF1cXHMqXFxbKFteXFxdXSopXFxdLyxcbiAgbm9saW5rOiAvXiE/XFxbKCg/OlxcW1teXFxdXSpcXF18W15cXFtcXF1dKSopXFxdLyxcbiAgc3Ryb25nOiAvXl9fKFtcXHNcXFNdKz8pX18oPyFfKXxeXFwqXFwqKFtcXHNcXFNdKz8pXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXlxcYl8oKD86X198W1xcc1xcU10pKz8pX1xcYnxeXFwqKCg/OlxcKlxcKnxbXFxzXFxTXSkrPylcXCooPyFcXCopLyxcbiAgY29kZTogL14oYCspXFxzKihbXFxzXFxTXSo/W15gXSlcXHMqXFwxKD8hYCkvLFxuICBicjogL14gezIsfVxcbig/IVxccyokKS8sXG4gIGRlbDogbm9vcCxcbiAgdGV4dDogL15bXFxzXFxTXSs/KD89W1xcXFw8IVxcW18qYF18IHsyLH1cXG58JCkvXG59O1xuXG5pbmxpbmUuX2luc2lkZSA9IC8oPzpcXFtbXlxcXV0qXFxdfFteXFxdXXxcXF0oPz1bXlxcW10qXFxdKSkqLztcbmlubGluZS5faHJlZiA9IC9cXHMqPD8oW15cXHNdKj8pPj8oPzpcXHMrWydcIl0oW1xcc1xcU10qPylbJ1wiXSk/XFxzKi87XG5cbmlubGluZS5saW5rID0gcmVwbGFjZShpbmxpbmUubGluaylcbiAgKCdpbnNpZGUnLCBpbmxpbmUuX2luc2lkZSlcbiAgKCdocmVmJywgaW5saW5lLl9ocmVmKVxuICAoKTtcblxuaW5saW5lLnJlZmxpbmsgPSByZXBsYWNlKGlubGluZS5yZWZsaW5rKVxuICAoJ2luc2lkZScsIGlubGluZS5faW5zaWRlKVxuICAoKTtcblxuLyoqXG4gKiBOb3JtYWwgSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUubm9ybWFsID0gbWVyZ2Uoe30sIGlubGluZSk7XG5cbi8qKlxuICogUGVkYW50aWMgSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUucGVkYW50aWMgPSBtZXJnZSh7fSwgaW5saW5lLm5vcm1hbCwge1xuICBzdHJvbmc6IC9eX18oPz1cXFMpKFtcXHNcXFNdKj9cXFMpX18oPyFfKXxeXFwqXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKlxcKig/IVxcKikvLFxuICBlbTogL15fKD89XFxTKShbXFxzXFxTXSo/XFxTKV8oPyFfKXxeXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKig/IVxcKikvXG59KTtcblxuLyoqXG4gKiBHRk0gSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUuZ2ZtID0gbWVyZ2Uoe30sIGlubGluZS5ub3JtYWwsIHtcbiAgZXNjYXBlOiByZXBsYWNlKGlubGluZS5lc2NhcGUpKCddKScsICd+fF0pJykoKSxcbiAgdXJsOiAvXihodHRwcz86XFwvXFwvW15cXHM8XStbXjwuLDo7XCInKVxcXVxcc10pLyxcbiAgZGVsOiAvXn5+KD89XFxTKShbXFxzXFxTXSo/XFxTKX5+LyxcbiAgdGV4dDogcmVwbGFjZShpbmxpbmUudGV4dClcbiAgICAoJ118JywgJ35dfCcpXG4gICAgKCd8JywgJ3xodHRwcz86Ly98JylcbiAgICAoKVxufSk7XG5cbi8qKlxuICogR0ZNICsgTGluZSBCcmVha3MgSW5saW5lIEdyYW1tYXJcbiAqL1xuXG5pbmxpbmUuYnJlYWtzID0gbWVyZ2Uoe30sIGlubGluZS5nZm0sIHtcbiAgYnI6IHJlcGxhY2UoaW5saW5lLmJyKSgnezIsfScsICcqJykoKSxcbiAgdGV4dDogcmVwbGFjZShpbmxpbmUuZ2ZtLnRleHQpKCd7Mix9JywgJyonKSgpXG59KTtcblxuLyoqXG4gKiBJbmxpbmUgTGV4ZXIgJiBDb21waWxlclxuICovXG5cbmZ1bmN0aW9uIElubGluZUxleGVyKGxpbmtzLCBvcHRpb25zKSB7XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgbWFya2VkLmRlZmF1bHRzO1xuICB0aGlzLmxpbmtzID0gbGlua3M7XG4gIHRoaXMucnVsZXMgPSBpbmxpbmUubm9ybWFsO1xuXG4gIGlmICghdGhpcy5saW5rcykge1xuICAgIHRocm93IG5ld1xuICAgICAgRXJyb3IoJ1Rva2VucyBhcnJheSByZXF1aXJlcyBhIGBsaW5rc2AgcHJvcGVydHkuJyk7XG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYnJlYWtzKSB7XG4gICAgICB0aGlzLnJ1bGVzID0gaW5saW5lLmJyZWFrcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ydWxlcyA9IGlubGluZS5nZm07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgIHRoaXMucnVsZXMgPSBpbmxpbmUucGVkYW50aWM7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvc2UgSW5saW5lIFJ1bGVzXG4gKi9cblxuSW5saW5lTGV4ZXIucnVsZXMgPSBpbmxpbmU7XG5cbi8qKlxuICogU3RhdGljIExleGluZy9Db21waWxpbmcgTWV0aG9kXG4gKi9cblxuSW5saW5lTGV4ZXIub3V0cHV0ID0gZnVuY3Rpb24oc3JjLCBsaW5rcywgb3B0aW9ucykge1xuICB2YXIgaW5saW5lID0gbmV3IElubGluZUxleGVyKGxpbmtzLCBvcHRpb25zKTtcbiAgcmV0dXJuIGlubGluZS5vdXRwdXQoc3JjKTtcbn07XG5cbi8qKlxuICogTGV4aW5nL0NvbXBpbGluZ1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5vdXRwdXQgPSBmdW5jdGlvbihzcmMpIHtcbiAgdmFyIG91dCA9ICcnXG4gICAgLCBsaW5rXG4gICAgLCB0ZXh0XG4gICAgLCBocmVmXG4gICAgLCBjYXA7XG5cbiAgd2hpbGUgKHNyYykge1xuICAgIC8vIGVzY2FwZVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmVzY2FwZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gY2FwWzFdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYXV0b2xpbmtcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5hdXRvbGluay5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBpZiAoY2FwWzJdID09PSAnQCcpIHtcbiAgICAgICAgdGV4dCA9IGNhcFsxXVs2XSA9PT0gJzonXG4gICAgICAgICAgPyB0aGlzLm1hbmdsZShjYXBbMV0uc3Vic3RyaW5nKDcpKVxuICAgICAgICAgIDogdGhpcy5tYW5nbGUoY2FwWzFdKTtcbiAgICAgICAgaHJlZiA9IHRoaXMubWFuZ2xlKCdtYWlsdG86JykgKyB0ZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgIH1cbiAgICAgIG91dCArPSAnPGEgaHJlZj1cIidcbiAgICAgICAgKyBocmVmXG4gICAgICAgICsgJ1wiPidcbiAgICAgICAgKyB0ZXh0XG4gICAgICAgICsgJzwvYT4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdXJsIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudXJsLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRleHQgPSBlc2NhcGUoY2FwWzFdKTtcbiAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgb3V0ICs9ICc8YSBocmVmPVwiJ1xuICAgICAgICArIGhyZWZcbiAgICAgICAgKyAnXCI+J1xuICAgICAgICArIHRleHRcbiAgICAgICAgKyAnPC9hPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50YWcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICA/IGVzY2FwZShjYXBbMF0pXG4gICAgICAgIDogY2FwWzBdO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxpbmsuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhjYXAsIHtcbiAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICB0aXRsZTogY2FwWzNdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHJlZmxpbmssIG5vbGlua1xuICAgIGlmICgoY2FwID0gdGhpcy5ydWxlcy5yZWZsaW5rLmV4ZWMoc3JjKSlcbiAgICAgICAgfHwgKGNhcCA9IHRoaXMucnVsZXMubm9saW5rLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBsaW5rID0gKGNhcFsyXSB8fCBjYXBbMV0pLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgIGxpbmsgPSB0aGlzLmxpbmtzW2xpbmsudG9Mb3dlckNhc2UoKV07XG4gICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICBvdXQgKz0gY2FwWzBdWzBdO1xuICAgICAgICBzcmMgPSBjYXBbMF0uc3Vic3RyaW5nKDEpICsgc3JjO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG91dCArPSB0aGlzLm91dHB1dExpbmsoY2FwLCBsaW5rKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHN0cm9uZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnN0cm9uZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxzdHJvbmc+J1xuICAgICAgICArIHRoaXMub3V0cHV0KGNhcFsyXSB8fCBjYXBbMV0pXG4gICAgICAgICsgJzwvc3Ryb25nPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBlbVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmVtLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGVtPidcbiAgICAgICAgKyB0aGlzLm91dHB1dChjYXBbMl0gfHwgY2FwWzFdKVxuICAgICAgICArICc8L2VtPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBjb2RlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuY29kZS5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxjb2RlPidcbiAgICAgICAgKyBlc2NhcGUoY2FwWzJdLCB0cnVlKVxuICAgICAgICArICc8L2NvZGU+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGJyXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuYnIuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8YnI+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGRlbCAoZ2ZtKVxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmRlbC5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxkZWw+J1xuICAgICAgICArIHRoaXMub3V0cHV0KGNhcFsxXSlcbiAgICAgICAgKyAnPC9kZWw+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRleHRcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy50ZXh0LmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSBlc2NhcGUodGhpcy5zbWFydHlwYW50cyhjYXBbMF0pKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChzcmMpIHtcbiAgICAgIHRocm93IG5ld1xuICAgICAgICBFcnJvcignSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIENvbXBpbGUgTGlua1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5vdXRwdXRMaW5rID0gZnVuY3Rpb24oY2FwLCBsaW5rKSB7XG4gIGlmIChjYXBbMF1bMF0gIT09ICchJykge1xuICAgIHJldHVybiAnPGEgaHJlZj1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsuaHJlZilcbiAgICAgICsgJ1wiJ1xuICAgICAgKyAobGluay50aXRsZVxuICAgICAgPyAnIHRpdGxlPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay50aXRsZSlcbiAgICAgICsgJ1wiJ1xuICAgICAgOiAnJylcbiAgICAgICsgJz4nXG4gICAgICArIHRoaXMub3V0cHV0KGNhcFsxXSlcbiAgICAgICsgJzwvYT4nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnPGltZyBzcmM9XCInXG4gICAgICArIGVzY2FwZShsaW5rLmhyZWYpXG4gICAgICArICdcIiBhbHQ9XCInXG4gICAgICArIGVzY2FwZShjYXBbMV0pXG4gICAgICArICdcIidcbiAgICAgICsgKGxpbmsudGl0bGVcbiAgICAgID8gJyB0aXRsZT1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsudGl0bGUpXG4gICAgICArICdcIidcbiAgICAgIDogJycpXG4gICAgICArICc+JztcbiAgfVxufTtcblxuLyoqXG4gKiBTbWFydHlwYW50cyBUcmFuc2Zvcm1hdGlvbnNcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUuc21hcnR5cGFudHMgPSBmdW5jdGlvbih0ZXh0KSB7XG4gIGlmICghdGhpcy5vcHRpb25zLnNtYXJ0eXBhbnRzKSByZXR1cm4gdGV4dDtcbiAgcmV0dXJuIHRleHRcbiAgICAucmVwbGFjZSgvLS0vZywgJ1xcdTIwMTQnKVxuICAgIC5yZXBsYWNlKC8nKFteJ10qKScvZywgJ1xcdTIwMTgkMVxcdTIwMTknKVxuICAgIC5yZXBsYWNlKC9cIihbXlwiXSopXCIvZywgJ1xcdTIwMUMkMVxcdTIwMUQnKVxuICAgIC5yZXBsYWNlKC9cXC57M30vZywgJ1xcdTIwMjYnKTtcbn07XG5cbi8qKlxuICogTWFuZ2xlIExpbmtzXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm1hbmdsZSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgdmFyIG91dCA9ICcnXG4gICAgLCBsID0gdGV4dC5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBjaDtcblxuICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgIGNoID0gdGV4dC5jaGFyQ29kZUF0KGkpO1xuICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICBjaCA9ICd4JyArIGNoLnRvU3RyaW5nKDE2KTtcbiAgICB9XG4gICAgb3V0ICs9ICcmIycgKyBjaCArICc7JztcbiAgfVxuXG4gIHJldHVybiBvdXQ7XG59O1xuXG4vKipcbiAqIFBhcnNpbmcgJiBDb21waWxpbmdcbiAqL1xuXG5mdW5jdGlvbiBQYXJzZXIob3B0aW9ucykge1xuICB0aGlzLnRva2VucyA9IFtdO1xuICB0aGlzLnRva2VuID0gbnVsbDtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG59XG5cbi8qKlxuICogU3RhdGljIFBhcnNlIE1ldGhvZFxuICovXG5cblBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uKHNyYywgb3B0aW9ucykge1xuICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcihvcHRpb25zKTtcbiAgcmV0dXJuIHBhcnNlci5wYXJzZShzcmMpO1xufTtcblxuLyoqXG4gKiBQYXJzZSBMb29wXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHNyYykge1xuICB0aGlzLmlubGluZSA9IG5ldyBJbmxpbmVMZXhlcihzcmMubGlua3MsIHRoaXMub3B0aW9ucyk7XG4gIHRoaXMudG9rZW5zID0gc3JjLnJldmVyc2UoKTtcblxuICB2YXIgb3V0ID0gJyc7XG4gIHdoaWxlICh0aGlzLm5leHQoKSkge1xuICAgIG91dCArPSB0aGlzLnRvaygpO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbiA9IHRoaXMudG9rZW5zLnBvcCgpO1xufTtcblxuLyoqXG4gKiBQcmV2aWV3IE5leHQgVG9rZW5cbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMudG9rZW5zLmxlbmd0aC0xXSB8fCAwO1xufTtcblxuLyoqXG4gKiBQYXJzZSBUZXh0IFRva2Vuc1xuICovXG5cblBhcnNlci5wcm90b3R5cGUucGFyc2VUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBib2R5ID0gdGhpcy50b2tlbi50ZXh0O1xuXG4gIHdoaWxlICh0aGlzLnBlZWsoKS50eXBlID09PSAndGV4dCcpIHtcbiAgICBib2R5ICs9ICdcXG4nICsgdGhpcy5uZXh0KCkudGV4dDtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmlubGluZS5vdXRwdXQoYm9keSk7XG59O1xuXG4vKipcbiAqIFBhcnNlIEN1cnJlbnQgVG9rZW5cbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnRvayA9IGZ1bmN0aW9uKCkge1xuICBzd2l0Y2ggKHRoaXMudG9rZW4udHlwZSkge1xuICAgIGNhc2UgJ3NwYWNlJzoge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjYXNlICdocic6IHtcbiAgICAgIHJldHVybiAnPGhyPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2hlYWRpbmcnOiB7XG4gICAgICByZXR1cm4gJzxoJ1xuICAgICAgICArIHRoaXMudG9rZW4uZGVwdGhcbiAgICAgICAgKyAnPidcbiAgICAgICAgKyB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi50ZXh0KVxuICAgICAgICArICc8L2gnXG4gICAgICAgICsgdGhpcy50b2tlbi5kZXB0aFxuICAgICAgICArICc+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnY29kZSc6IHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5vcHRpb25zLmhpZ2hsaWdodCh0aGlzLnRva2VuLnRleHQsIHRoaXMudG9rZW4ubGFuZyk7XG4gICAgICAgIGlmIChjb2RlICE9IG51bGwgJiYgY29kZSAhPT0gdGhpcy50b2tlbi50ZXh0KSB7XG4gICAgICAgICAgdGhpcy50b2tlbi5lc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnRva2VuLnRleHQgPSBjb2RlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy50b2tlbi5lc2NhcGVkKSB7XG4gICAgICAgIHRoaXMudG9rZW4udGV4dCA9IGVzY2FwZSh0aGlzLnRva2VuLnRleHQsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxwcmU+PGNvZGUnXG4gICAgICAgICsgKHRoaXMudG9rZW4ubGFuZ1xuICAgICAgICA/ICcgY2xhc3M9XCInXG4gICAgICAgICsgdGhpcy5vcHRpb25zLmxhbmdQcmVmaXhcbiAgICAgICAgKyB0aGlzLnRva2VuLmxhbmdcbiAgICAgICAgKyAnXCInXG4gICAgICAgIDogJycpXG4gICAgICAgICsgJz4nXG4gICAgICAgICsgdGhpcy50b2tlbi50ZXh0XG4gICAgICAgICsgJzwvY29kZT48L3ByZT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICd0YWJsZSc6IHtcbiAgICAgIHZhciBib2R5ID0gJydcbiAgICAgICAgLCBoZWFkaW5nXG4gICAgICAgICwgaVxuICAgICAgICAsIHJvd1xuICAgICAgICAsIGNlbGxcbiAgICAgICAgLCBqO1xuXG4gICAgICAvLyBoZWFkZXJcbiAgICAgIGJvZHkgKz0gJzx0aGVhZD5cXG48dHI+XFxuJztcbiAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnRva2VuLmhlYWRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZWFkaW5nID0gdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4uaGVhZGVyW2ldKTtcbiAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLmFsaWduW2ldXG4gICAgICAgICAgPyAnPHRoIGFsaWduPVwiJyArIHRoaXMudG9rZW4uYWxpZ25baV0gKyAnXCI+JyArIGhlYWRpbmcgKyAnPC90aD5cXG4nXG4gICAgICAgICAgOiAnPHRoPicgKyBoZWFkaW5nICsgJzwvdGg+XFxuJztcbiAgICAgIH1cbiAgICAgIGJvZHkgKz0gJzwvdHI+XFxuPC90aGVhZD5cXG4nO1xuXG4gICAgICAvLyBib2R5XG4gICAgICBib2R5ICs9ICc8dGJvZHk+XFxuJ1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcm93ID0gdGhpcy50b2tlbi5jZWxsc1tpXTtcbiAgICAgICAgYm9keSArPSAnPHRyPlxcbic7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCByb3cubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBjZWxsID0gdGhpcy5pbmxpbmUub3V0cHV0KHJvd1tqXSk7XG4gICAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLmFsaWduW2pdXG4gICAgICAgICAgICA/ICc8dGQgYWxpZ249XCInICsgdGhpcy50b2tlbi5hbGlnbltqXSArICdcIj4nICsgY2VsbCArICc8L3RkPlxcbidcbiAgICAgICAgICAgIDogJzx0ZD4nICsgY2VsbCArICc8L3RkPlxcbic7XG4gICAgICAgIH1cbiAgICAgICAgYm9keSArPSAnPC90cj5cXG4nO1xuICAgICAgfVxuICAgICAgYm9keSArPSAnPC90Ym9keT5cXG4nO1xuXG4gICAgICByZXR1cm4gJzx0YWJsZT5cXG4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L3RhYmxlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2Jsb2NrcXVvdGVfc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2Jsb2NrcXVvdGVfZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGJsb2NrcXVvdGU+XFxuJ1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC9ibG9ja3F1b3RlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2xpc3Rfc3RhcnQnOiB7XG4gICAgICB2YXIgdHlwZSA9IHRoaXMudG9rZW4ub3JkZXJlZCA/ICdvbCcgOiAndWwnXG4gICAgICAgICwgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPCdcbiAgICAgICAgKyB0eXBlXG4gICAgICAgICsgJz5cXG4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8LydcbiAgICAgICAgKyB0eXBlXG4gICAgICAgICsgJz5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdsaXN0X2l0ZW1fc3RhcnQnOiB7XG4gICAgICB2YXIgYm9keSA9ICcnO1xuXG4gICAgICB3aGlsZSAodGhpcy5uZXh0KCkudHlwZSAhPT0gJ2xpc3RfaXRlbV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2tlbi50eXBlID09PSAndGV4dCdcbiAgICAgICAgICA/IHRoaXMucGFyc2VUZXh0KClcbiAgICAgICAgICA6IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGxpPidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvbGk+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnbG9vc2VfaXRlbV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9pdGVtX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRvaygpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxsaT4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L2xpPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2h0bWwnOiB7XG4gICAgICByZXR1cm4gIXRoaXMudG9rZW4ucHJlICYmICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgPyB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi50ZXh0KVxuICAgICAgICA6IHRoaXMudG9rZW4udGV4dDtcbiAgICB9XG4gICAgY2FzZSAncGFyYWdyYXBoJzoge1xuICAgICAgcmV0dXJuICc8cD4nXG4gICAgICAgICsgdGhpcy5pbmxpbmUub3V0cHV0KHRoaXMudG9rZW4udGV4dClcbiAgICAgICAgKyAnPC9wPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ3RleHQnOiB7XG4gICAgICByZXR1cm4gJzxwPidcbiAgICAgICAgKyB0aGlzLnBhcnNlVGV4dCgpXG4gICAgICAgICsgJzwvcD5cXG4nO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBIZWxwZXJzXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGh0bWwsIGVuY29kZSkge1xuICByZXR1cm4gaHRtbFxuICAgIC5yZXBsYWNlKCFlbmNvZGUgPyAvJig/ISM/XFx3KzspL2cgOiAvJi9nLCAnJmFtcDsnKVxuICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXG4gICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxuICAgIC5yZXBsYWNlKC8nL2csICcmIzM5OycpO1xufVxuXG5mdW5jdGlvbiByZXBsYWNlKHJlZ2V4LCBvcHQpIHtcbiAgcmVnZXggPSByZWdleC5zb3VyY2U7XG4gIG9wdCA9IG9wdCB8fCAnJztcbiAgcmV0dXJuIGZ1bmN0aW9uIHNlbGYobmFtZSwgdmFsKSB7XG4gICAgaWYgKCFuYW1lKSByZXR1cm4gbmV3IFJlZ0V4cChyZWdleCwgb3B0KTtcbiAgICB2YWwgPSB2YWwuc291cmNlIHx8IHZhbDtcbiAgICB2YWwgPSB2YWwucmVwbGFjZSgvKF58W15cXFtdKVxcXi9nLCAnJDEnKTtcbiAgICByZWdleCA9IHJlZ2V4LnJlcGxhY2UobmFtZSwgdmFsKTtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5ub29wLmV4ZWMgPSBub29wO1xuXG5mdW5jdGlvbiBtZXJnZShvYmopIHtcbiAgdmFyIGkgPSAxXG4gICAgLCB0YXJnZXRcbiAgICAsIGtleTtcblxuICBmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0gdGFyZ2V0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuLyoqXG4gKiBNYXJrZWRcbiAqL1xuXG5mdW5jdGlvbiBtYXJrZWQoc3JjLCBvcHQsIGNhbGxiYWNrKSB7XG4gIGlmIChjYWxsYmFjayB8fCB0eXBlb2Ygb3B0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sgPSBvcHQ7XG4gICAgICBvcHQgPSBudWxsO1xuICAgIH1cblxuICAgIGlmIChvcHQpIG9wdCA9IG1lcmdlKHt9LCBtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG5cbiAgICB2YXIgaGlnaGxpZ2h0ID0gb3B0LmhpZ2hsaWdodFxuICAgICAgLCB0b2tlbnNcbiAgICAgICwgcGVuZGluZ1xuICAgICAgLCBpID0gMDtcblxuICAgIHRyeSB7XG4gICAgICB0b2tlbnMgPSBMZXhlci5sZXgoc3JjLCBvcHQpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgIH1cblxuICAgIHBlbmRpbmcgPSB0b2tlbnMubGVuZ3RoO1xuXG4gICAgdmFyIGRvbmUgPSBmdW5jdGlvbihoaSkge1xuICAgICAgdmFyIG91dCwgZXJyO1xuXG4gICAgICBpZiAoaGkgIT09IHRydWUpIHtcbiAgICAgICAgZGVsZXRlIG9wdC5oaWdobGlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIG91dCA9IFBhcnNlci5wYXJzZSh0b2tlbnMsIG9wdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGVyciA9IGU7XG4gICAgICB9XG5cbiAgICAgIG9wdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG5cbiAgICAgIHJldHVybiBlcnJcbiAgICAgICAgPyBjYWxsYmFjayhlcnIpXG4gICAgICAgIDogY2FsbGJhY2sobnVsbCwgb3V0KTtcbiAgICB9O1xuXG4gICAgaWYgKCFoaWdobGlnaHQgfHwgaGlnaGxpZ2h0Lmxlbmd0aCA8IDMpIHtcbiAgICAgIHJldHVybiBkb25lKHRydWUpO1xuICAgIH1cblxuICAgIGlmICghcGVuZGluZykgcmV0dXJuIGRvbmUoKTtcblxuICAgIGZvciAoOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAoZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09ICdjb2RlJykge1xuICAgICAgICAgIHJldHVybiAtLXBlbmRpbmcgfHwgZG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoaWdobGlnaHQodG9rZW4udGV4dCwgdG9rZW4ubGFuZywgZnVuY3Rpb24oZXJyLCBjb2RlKSB7XG4gICAgICAgICAgaWYgKGNvZGUgPT0gbnVsbCB8fCBjb2RlID09PSB0b2tlbi50ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gLS1wZW5kaW5nIHx8IGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9rZW4udGV4dCA9IGNvZGU7XG4gICAgICAgICAgdG9rZW4uZXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgLS1wZW5kaW5nIHx8IGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KSh0b2tlbnNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfVxuICB0cnkge1xuICAgIGlmIChvcHQpIG9wdCA9IG1lcmdlKHt9LCBtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG4gICAgcmV0dXJuIFBhcnNlci5wYXJzZShMZXhlci5sZXgoc3JjLCBvcHQpLCBvcHQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZS5tZXNzYWdlICs9ICdcXG5QbGVhc2UgcmVwb3J0IHRoaXMgdG8gaHR0cHM6Ly9naXRodWIuY29tL2NoamovbWFya2VkLic7XG4gICAgaWYgKChvcHQgfHwgbWFya2VkLmRlZmF1bHRzKS5zaWxlbnQpIHtcbiAgICAgIHJldHVybiAnPHA+QW4gZXJyb3Igb2NjdXJlZDo8L3A+PHByZT4nXG4gICAgICAgICsgZXNjYXBlKGUubWVzc2FnZSArICcnLCB0cnVlKVxuICAgICAgICArICc8L3ByZT4nO1xuICAgIH1cbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9uc1xuICovXG5cbm1hcmtlZC5vcHRpb25zID1cbm1hcmtlZC5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0KSB7XG4gIG1lcmdlKG1hcmtlZC5kZWZhdWx0cywgb3B0KTtcbiAgcmV0dXJuIG1hcmtlZDtcbn07XG5cbm1hcmtlZC5kZWZhdWx0cyA9IHtcbiAgZ2ZtOiB0cnVlLFxuICB0YWJsZXM6IHRydWUsXG4gIGJyZWFrczogZmFsc2UsXG4gIHBlZGFudGljOiBmYWxzZSxcbiAgc2FuaXRpemU6IGZhbHNlLFxuICBzbWFydExpc3RzOiBmYWxzZSxcbiAgc2lsZW50OiBmYWxzZSxcbiAgaGlnaGxpZ2h0OiBudWxsLFxuICBsYW5nUHJlZml4OiAnbGFuZy0nLFxuICBzbWFydHlwYW50czogZmFsc2Vcbn07XG5cbi8qKlxuICogRXhwb3NlXG4gKi9cblxubWFya2VkLlBhcnNlciA9IFBhcnNlcjtcbm1hcmtlZC5wYXJzZXIgPSBQYXJzZXIucGFyc2U7XG5cbm1hcmtlZC5MZXhlciA9IExleGVyO1xubWFya2VkLmxleGVyID0gTGV4ZXIubGV4O1xuXG5tYXJrZWQuSW5saW5lTGV4ZXIgPSBJbmxpbmVMZXhlcjtcbm1hcmtlZC5pbmxpbmVMZXhlciA9IElubGluZUxleGVyLm91dHB1dDtcblxubWFya2VkLnBhcnNlID0gbWFya2VkO1xuXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gbWFya2VkO1xufSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gbWFya2VkOyB9KTtcbn0gZWxzZSB7XG4gIHRoaXMubWFya2VkID0gbWFya2VkO1xufVxuXG59KS5jYWxsKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcyB8fCAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiBnbG9iYWwpO1xufSgpKTtcbiIsInZhciBzb3VyY2VzICA9IHJlcXVpcmUoJy4vc291cmNlcycpXG52YXIgc2lua3MgICAgPSByZXF1aXJlKCcuL3NpbmtzJylcbnZhciB0aHJvdWdocyA9IHJlcXVpcmUoJy4vdGhyb3VnaHMnKVxudmFyIHUgICAgICAgID0gcmVxdWlyZSgncHVsbC1jb3JlJylcblxuZnVuY3Rpb24gaXNUaHJvdWdoIChmdW4pIHtcbiAgcmV0dXJuIGZ1bi50eXBlID09PSBcIlRocm91Z2hcIiB8fCBmdW4ubGVuZ3RoID09PSAxXG59XG5cbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwdWxsICgpIHtcbiAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcblxuICBpZihpc1Rocm91Z2goYXJnc1swXSkpXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyZWFkKSB7XG4gICAgICBhcmdzLnVuc2hpZnQocmVhZClcbiAgICAgIHJldHVybiBwdWxsLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgfVxuXG4gIHZhciByZWFkID0gYXJncy5zaGlmdCgpXG4gIHdoaWxlKGFyZ3MubGVuZ3RoKVxuICAgIHJlYWQgPSBhcmdzLnNoaWZ0KCkgKHJlYWQpXG4gIHJldHVybiByZWFkXG59XG5cbmZvcih2YXIgayBpbiBzb3VyY2VzKVxuICBleHBvcnRzW2tdID0gdS5Tb3VyY2Uoc291cmNlc1trXSlcblxuZm9yKHZhciBrIGluIHRocm91Z2hzKVxuICBleHBvcnRzW2tdID0gdS5UaHJvdWdoKHRocm91Z2hzW2tdKVxuXG5mb3IodmFyIGsgaW4gc2lua3MpXG4gIGV4cG9ydHNba10gPSB1LlNpbmsoc2lua3Nba10pXG5cbnZhciBtYXliZSA9IHJlcXVpcmUoJy4vbWF5YmUnKShleHBvcnRzKVxuXG5mb3IodmFyIGsgaW4gbWF5YmUpXG4gIGV4cG9ydHNba10gPSBtYXliZVtrXVxuXG5leHBvcnRzLkR1cGxleCAgPSBcbmV4cG9ydHMuVGhyb3VnaCA9IGV4cG9ydHMucGlwZWFibGUgICAgICAgPSB1LlRocm91Z2hcbmV4cG9ydHMuU291cmNlICA9IGV4cG9ydHMucGlwZWFibGVTb3VyY2UgPSB1LlNvdXJjZVxuZXhwb3J0cy5TaW5rICAgID0gZXhwb3J0cy5waXBlYWJsZVNpbmsgICA9IHUuU2lua1xuXG5cbiIsInZhciB1ID0gcmVxdWlyZSgncHVsbC1jb3JlJylcbnZhciBwcm9wID0gdS5wcm9wXG52YXIgaWQgICA9IHUuaWRcbnZhciBtYXliZVNpbmsgPSB1Lm1heWJlU2lua1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwdWxsKSB7XG5cbiAgdmFyIGV4cG9ydHMgPSB7fVxuICB2YXIgZHJhaW4gPSBwdWxsLmRyYWluXG5cbiAgdmFyIGZpbmQgPSBcbiAgZXhwb3J0cy5maW5kID0gZnVuY3Rpb24gKHRlc3QsIGNiKSB7XG4gICAgcmV0dXJuIG1heWJlU2luayhmdW5jdGlvbiAoY2IpIHtcbiAgICAgIHZhciBlbmRlZCA9IGZhbHNlXG4gICAgICBpZighY2IpXG4gICAgICAgIGNiID0gdGVzdCwgdGVzdCA9IGlkXG4gICAgICBlbHNlXG4gICAgICAgIHRlc3QgPSBwcm9wKHRlc3QpIHx8IGlkXG5cbiAgICAgIHJldHVybiBkcmFpbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZih0ZXN0KGRhdGEpKSB7XG4gICAgICAgICAgZW5kZWQgPSB0cnVlXG4gICAgICAgICAgY2IobnVsbCwgZGF0YSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYoZW5kZWQpIHJldHVybiAvL2FscmVhZHkgY2FsbGVkIGJhY2tcbiAgICAgICAgY2IoZXJyID09PSB0cnVlID8gbnVsbCA6IGVyciwgbnVsbClcbiAgICAgIH0pXG5cbiAgICB9LCBjYilcbiAgfVxuXG4gIHZhciByZWR1Y2UgPSBleHBvcnRzLnJlZHVjZSA9IFxuICBmdW5jdGlvbiAocmVkdWNlLCBhY2MsIGNiKSB7XG4gICAgXG4gICAgcmV0dXJuIG1heWJlU2luayhmdW5jdGlvbiAoY2IpIHtcbiAgICAgIHJldHVybiBkcmFpbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBhY2MgPSByZWR1Y2UoYWNjLCBkYXRhKVxuICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYihlcnIsIGFjYylcbiAgICAgIH0pXG5cbiAgICB9LCBjYilcbiAgfVxuXG4gIHZhciBjb2xsZWN0ID0gZXhwb3J0cy5jb2xsZWN0ID0gZXhwb3J0cy53cml0ZUFycmF5ID1cbiAgZnVuY3Rpb24gKGNiKSB7XG4gICAgcmV0dXJuIHJlZHVjZShmdW5jdGlvbiAoYXJyLCBpdGVtKSB7XG4gICAgICBhcnIucHVzaChpdGVtKVxuICAgICAgcmV0dXJuIGFyclxuICAgIH0sIFtdLCBjYilcbiAgfVxuXG4gIHZhciBjb25jYXQgPSBleHBvcnRzLmNvbmNhdCA9XG4gIGZ1bmN0aW9uIChjYikge1xuICAgIHJldHVybiByZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhICsgYlxuICAgIH0sICcnLCBjYilcbiAgfVxuXG4gIHJldHVybiBleHBvcnRzXG59XG4iLCJleHBvcnRzLmlkID0gXG5mdW5jdGlvbiAoaXRlbSkge1xuICByZXR1cm4gaXRlbVxufVxuXG5leHBvcnRzLnByb3AgPSBcbmZ1bmN0aW9uIChtYXApIHsgIFxuICBpZignc3RyaW5nJyA9PSB0eXBlb2YgbWFwKSB7XG4gICAgdmFyIGtleSA9IG1hcFxuICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkgeyByZXR1cm4gZGF0YVtrZXldIH1cbiAgfVxuICByZXR1cm4gbWFwXG59XG5cbmV4cG9ydHMudGVzdGVyID0gZnVuY3Rpb24gKHRlc3QpIHtcbiAgaWYoIXRlc3QpIHJldHVybiBleHBvcnRzLmlkXG4gIGlmKCdvYmplY3QnID09PSB0eXBlb2YgdGVzdFxuICAgICYmICdmdW5jdGlvbicgPT09IHR5cGVvZiB0ZXN0LnRlc3QpXG4gICAgICByZXR1cm4gdGVzdC50ZXN0LmJpbmQodGVzdClcbiAgcmV0dXJuIGV4cG9ydHMucHJvcCh0ZXN0KSB8fCBleHBvcnRzLmlkXG59XG5cbmV4cG9ydHMuYWRkUGlwZSA9IGFkZFBpcGVcblxuZnVuY3Rpb24gYWRkUGlwZShyZWFkKSB7XG4gIGlmKCdmdW5jdGlvbicgIT09IHR5cGVvZiByZWFkKVxuICAgIHJldHVybiByZWFkXG5cbiAgcmVhZC5waXBlID0gcmVhZC5waXBlIHx8IGZ1bmN0aW9uIChyZWFkZXIpIHtcbiAgICBpZignZnVuY3Rpb24nICE9IHR5cGVvZiByZWFkZXIpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ211c3QgcGlwZSB0byByZWFkZXInKVxuICAgIHJldHVybiBhZGRQaXBlKHJlYWRlcihyZWFkKSlcbiAgfVxuICByZWFkLnR5cGUgPSAnU291cmNlJ1xuICByZXR1cm4gcmVhZFxufVxuXG52YXIgU291cmNlID1cbmV4cG9ydHMuU291cmNlID1cbmZ1bmN0aW9uIFNvdXJjZSAoY3JlYXRlUmVhZCkge1xuICBmdW5jdGlvbiBzKCkge1xuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gICAgcmV0dXJuIGFkZFBpcGUoY3JlYXRlUmVhZC5hcHBseShudWxsLCBhcmdzKSlcbiAgfVxuICBzLnR5cGUgPSAnU291cmNlJ1xuICByZXR1cm4gc1xufVxuXG5cbnZhciBUaHJvdWdoID1cbmV4cG9ydHMuVGhyb3VnaCA9IFxuZnVuY3Rpb24gKGNyZWF0ZVJlYWQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgIHZhciBwaXBlZCA9IFtdXG4gICAgZnVuY3Rpb24gcmVhZGVyIChyZWFkKSB7XG4gICAgICBhcmdzLnVuc2hpZnQocmVhZClcbiAgICAgIHJlYWQgPSBjcmVhdGVSZWFkLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgICB3aGlsZShwaXBlZC5sZW5ndGgpXG4gICAgICAgIHJlYWQgPSBwaXBlZC5zaGlmdCgpKHJlYWQpXG4gICAgICByZXR1cm4gcmVhZFxuICAgICAgLy9waXBlaW5nIHRvIGZyb20gdGhpcyByZWFkZXIgc2hvdWxkIGNvbXBvc2UuLi5cbiAgICB9XG4gICAgcmVhZGVyLnBpcGUgPSBmdW5jdGlvbiAocmVhZCkge1xuICAgICAgcGlwZWQucHVzaChyZWFkKSBcbiAgICAgIGlmKHJlYWQudHlwZSA9PT0gJ1NvdXJjZScpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IHBpcGUgJyArIHJlYWRlci50eXBlICsgJyB0byBTb3VyY2UnKVxuICAgICAgcmVhZGVyLnR5cGUgPSByZWFkLnR5cGUgPT09ICdTaW5rJyA/ICdTaW5rJyA6ICdUaHJvdWdoJ1xuICAgICAgcmV0dXJuIHJlYWRlclxuICAgIH1cbiAgICByZWFkZXIudHlwZSA9ICdUaHJvdWdoJ1xuICAgIHJldHVybiByZWFkZXJcbiAgfVxufVxuXG52YXIgU2luayA9XG5leHBvcnRzLlNpbmsgPSBcbmZ1bmN0aW9uIFNpbmsoY3JlYXRlUmVhZGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICBpZighY3JlYXRlUmVhZGVyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtdXN0IGJlIGNyZWF0ZVJlYWRlciBmdW5jdGlvbicpXG4gICAgZnVuY3Rpb24gcyAocmVhZCkge1xuICAgICAgYXJncy51bnNoaWZ0KHJlYWQpXG4gICAgICByZXR1cm4gY3JlYXRlUmVhZGVyLmFwcGx5KG51bGwsIGFyZ3MpXG4gICAgfVxuICAgIHMudHlwZSA9ICdTaW5rJ1xuICAgIHJldHVybiBzXG4gIH1cbn1cblxuXG5leHBvcnRzLm1heWJlU2luayA9IFxuZXhwb3J0cy5tYXliZURyYWluID0gXG5mdW5jdGlvbiAoY3JlYXRlU2luaywgY2IpIHtcbiAgaWYoIWNiKVxuICAgIHJldHVybiBUaHJvdWdoKGZ1bmN0aW9uIChyZWFkKSB7XG4gICAgICB2YXIgZW5kZWRcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoY2xvc2UsIGNiKSB7XG4gICAgICAgIGlmKGNsb3NlKSByZXR1cm4gcmVhZChjbG9zZSwgY2IpXG4gICAgICAgIGlmKGVuZGVkKSByZXR1cm4gY2IoZW5kZWQpXG5cbiAgICAgICAgY3JlYXRlU2luayhmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgZW5kZWQgPSBlcnIgfHwgdHJ1ZVxuICAgICAgICAgIGlmKCFlcnIpIGNiKG51bGwsIGRhdGEpXG4gICAgICAgICAgZWxzZSAgICAgY2IoZW5kZWQpXG4gICAgICAgIH0pIChyZWFkKVxuICAgICAgfVxuICAgIH0pKClcblxuICByZXR1cm4gU2luayhmdW5jdGlvbiAocmVhZCkge1xuICAgIHJldHVybiBjcmVhdGVTaW5rKGNiKSAocmVhZClcbiAgfSkoKVxufVxuXG4iLCJ2YXIgZHJhaW4gPSBleHBvcnRzLmRyYWluID0gZnVuY3Rpb24gKHJlYWQsIG9wLCBkb25lKSB7XG5cbiAgOyhmdW5jdGlvbiBuZXh0KCkge1xuICAgIHZhciBsb29wID0gdHJ1ZSwgY2JlZCA9IGZhbHNlXG4gICAgd2hpbGUobG9vcCkge1xuICAgICAgY2JlZCA9IGZhbHNlXG4gICAgICByZWFkKG51bGwsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgICAgY2JlZCA9IHRydWVcbiAgICAgICAgaWYoZW5kKSB7XG4gICAgICAgICAgbG9vcCA9IGZhbHNlXG4gICAgICAgICAgZG9uZSAmJiBkb25lKGVuZCA9PT0gdHJ1ZSA/IG51bGwgOiBlbmQpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihvcCAmJiBmYWxzZSA9PT0gb3AoZGF0YSkpIHtcbiAgICAgICAgICBsb29wID0gZmFsc2VcbiAgICAgICAgICByZWFkKHRydWUsIGRvbmUgfHwgZnVuY3Rpb24gKCkge30pXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZighbG9vcCl7XG4gICAgICAgICAgbmV4dCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBpZighY2JlZCkge1xuICAgICAgICBsb29wID0gZmFsc2VcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICB9KSgpXG59XG5cbnZhciBvbkVuZCA9IGV4cG9ydHMub25FbmQgPSBmdW5jdGlvbiAocmVhZCwgZG9uZSkge1xuICByZXR1cm4gZHJhaW4ocmVhZCwgbnVsbCwgZG9uZSlcbn1cblxudmFyIGxvZyA9IGV4cG9ydHMubG9nID0gZnVuY3Rpb24gKHJlYWQsIGRvbmUpIHtcbiAgcmV0dXJuIGRyYWluKHJlYWQsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coZGF0YSlcbiAgfSwgZG9uZSlcbn1cblxuIiwiXG52YXIga2V5cyA9IGV4cG9ydHMua2V5cyA9XG5mdW5jdGlvbiAob2JqZWN0KSB7XG4gIHJldHVybiB2YWx1ZXMoT2JqZWN0LmtleXMob2JqZWN0KSlcbn1cblxudmFyIG9uY2UgPSBleHBvcnRzLm9uY2UgPVxuZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoYWJvcnQsIGNiKSB7XG4gICAgaWYoYWJvcnQpIHJldHVybiBjYihhYm9ydClcbiAgICBpZih2YWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgX3ZhbHVlID0gdmFsdWU7IHZhbHVlID0gbnVsbFxuICAgICAgY2IobnVsbCwgX3ZhbHVlKVxuICAgIH0gZWxzZVxuICAgICAgY2IodHJ1ZSlcbiAgfVxufVxuXG52YXIgdmFsdWVzID0gZXhwb3J0cy52YWx1ZXMgPSBleHBvcnRzLnJlYWRBcnJheSA9XG5mdW5jdGlvbiAoYXJyYXkpIHtcbiAgaWYoIUFycmF5LmlzQXJyYXkoYXJyYXkpKVxuICAgIGFycmF5ID0gT2JqZWN0LmtleXMoYXJyYXkpLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgcmV0dXJuIGFycmF5W2tdXG4gICAgfSlcbiAgdmFyIGkgPSAwXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZClcbiAgICAgIHJldHVybiBjYiAmJiBjYihlbmQpICBcbiAgICBjYihpID49IGFycmF5Lmxlbmd0aCB8fCBudWxsLCBhcnJheVtpKytdKVxuICB9XG59XG5cblxudmFyIGNvdW50ID0gZXhwb3J0cy5jb3VudCA9IFxuZnVuY3Rpb24gKG1heCkge1xuICB2YXIgaSA9IDA7IG1heCA9IG1heCB8fCBJbmZpbml0eVxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBpZihlbmQpIHJldHVybiBjYiAmJiBjYihlbmQpXG4gICAgaWYoaSA+IG1heClcbiAgICAgIHJldHVybiBjYih0cnVlKVxuICAgIGNiKG51bGwsIGkrKylcbiAgfVxufVxuXG52YXIgaW5maW5pdGUgPSBleHBvcnRzLmluZmluaXRlID0gXG5mdW5jdGlvbiAoZ2VuZXJhdGUpIHtcbiAgZ2VuZXJhdGUgPSBnZW5lcmF0ZSB8fCBNYXRoLnJhbmRvbVxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBpZihlbmQpIHJldHVybiBjYiAmJiBjYihlbmQpXG4gICAgcmV0dXJuIGNiKG51bGwsIGdlbmVyYXRlKCkpXG4gIH1cbn1cblxudmFyIGRlZmVyID0gZXhwb3J0cy5kZWZlciA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9yZWFkLCBjYnMgPSBbXSwgX2VuZFxuXG4gIHZhciByZWFkID0gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBpZighX3JlYWQpIHtcbiAgICAgIF9lbmQgPSBlbmRcbiAgICAgIGNicy5wdXNoKGNiKVxuICAgIH0gXG4gICAgZWxzZSBfcmVhZChlbmQsIGNiKVxuICB9XG4gIHJlYWQucmVzb2x2ZSA9IGZ1bmN0aW9uIChyZWFkKSB7XG4gICAgaWYoX3JlYWQpIHRocm93IG5ldyBFcnJvcignYWxyZWFkeSByZXNvbHZlZCcpXG4gICAgX3JlYWQgPSByZWFkXG4gICAgaWYoIV9yZWFkKSB0aHJvdyBuZXcgRXJyb3IoJ25vIHJlYWQgY2Fubm90IHJlc29sdmUhJyArIF9yZWFkKVxuICAgIHdoaWxlKGNicy5sZW5ndGgpXG4gICAgICBfcmVhZChfZW5kLCBjYnMuc2hpZnQoKSlcbiAgfVxuICByZWFkLmFib3J0ID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgcmVhZC5yZXNvbHZlKGZ1bmN0aW9uIChfLCBjYikge1xuICAgICAgY2IoZXJyIHx8IHRydWUpXG4gICAgfSlcbiAgfVxuICByZXR1cm4gcmVhZFxufVxuXG52YXIgZW1wdHkgPSBleHBvcnRzLmVtcHR5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGFib3J0LCBjYikge1xuICAgIGNiKHRydWUpXG4gIH1cbn1cblxudmFyIGRlcHRoRmlyc3QgPSBleHBvcnRzLmRlcHRoRmlyc3QgPVxuZnVuY3Rpb24gKHN0YXJ0LCBjcmVhdGVTdHJlYW0pIHtcbiAgdmFyIHJlYWRzID0gW11cblxuICByZWFkcy51bnNoaWZ0KG9uY2Uoc3RhcnQpKVxuXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0IChlbmQsIGNiKSB7XG4gICAgaWYoIXJlYWRzLmxlbmd0aClcbiAgICAgIHJldHVybiBjYih0cnVlKVxuICAgIHJlYWRzWzBdKGVuZCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgaWYoZW5kKSB7XG4gICAgICAgIC8vaWYgdGhpcyBzdHJlYW0gaGFzIGVuZGVkLCBnbyB0byB0aGUgbmV4dCBxdWV1ZVxuICAgICAgICByZWFkcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiBuZXh0KG51bGwsIGNiKVxuICAgICAgfVxuICAgICAgcmVhZHMudW5zaGlmdChjcmVhdGVTdHJlYW0oZGF0YSkpXG4gICAgICBjYihlbmQsIGRhdGEpXG4gICAgfSlcbiAgfVxufVxuLy93aWR0aCBmaXJzdCBpcyBqdXN0IGxpa2UgZGVwdGggZmlyc3QsXG4vL2J1dCBwdXNoIGVhY2ggbmV3IHN0cmVhbSBvbnRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlXG52YXIgd2lkdGhGaXJzdCA9IGV4cG9ydHMud2lkdGhGaXJzdCA9IFxuZnVuY3Rpb24gKHN0YXJ0LCBjcmVhdGVTdHJlYW0pIHtcbiAgdmFyIHJlYWRzID0gW11cblxuICByZWFkcy5wdXNoKG9uY2Uoc3RhcnQpKVxuXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0IChlbmQsIGNiKSB7XG4gICAgaWYoIXJlYWRzLmxlbmd0aClcbiAgICAgIHJldHVybiBjYih0cnVlKVxuICAgIHJlYWRzWzBdKGVuZCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgaWYoZW5kKSB7XG4gICAgICAgIHJlYWRzLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIG5leHQobnVsbCwgY2IpXG4gICAgICB9XG4gICAgICByZWFkcy5wdXNoKGNyZWF0ZVN0cmVhbShkYXRhKSlcbiAgICAgIGNiKGVuZCwgZGF0YSlcbiAgICB9KVxuICB9XG59XG5cbi8vdGhpcyBjYW1lIG91dCBkaWZmZXJlbnQgdG8gdGhlIGZpcnN0IChzdHJtKVxuLy9hdHRlbXB0IGF0IGxlYWZGaXJzdCwgYnV0IGl0J3Mgc3RpbGwgYSB2YWxpZFxuLy90b3BvbG9naWNhbCBzb3J0LlxudmFyIGxlYWZGaXJzdCA9IGV4cG9ydHMubGVhZkZpcnN0ID0gXG5mdW5jdGlvbiAoc3RhcnQsIGNyZWF0ZVN0cmVhbSkge1xuICB2YXIgcmVhZHMgPSBbXVxuICB2YXIgb3V0cHV0ID0gW11cbiAgcmVhZHMucHVzaChvbmNlKHN0YXJ0KSlcbiAgXG4gIHJldHVybiBmdW5jdGlvbiBuZXh0IChlbmQsIGNiKSB7XG4gICAgcmVhZHNbMF0oZW5kLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZihlbmQpIHtcbiAgICAgICAgcmVhZHMuc2hpZnQoKVxuICAgICAgICBpZighb3V0cHV0Lmxlbmd0aClcbiAgICAgICAgICByZXR1cm4gY2IodHJ1ZSlcbiAgICAgICAgcmV0dXJuIGNiKG51bGwsIG91dHB1dC5zaGlmdCgpKVxuICAgICAgfVxuICAgICAgcmVhZHMudW5zaGlmdChjcmVhdGVTdHJlYW0oZGF0YSkpXG4gICAgICBvdXRwdXQudW5zaGlmdChkYXRhKVxuICAgICAgbmV4dChudWxsLCBjYilcbiAgICB9KVxuICB9XG59XG5cbiIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKTt2YXIgdSAgICAgID0gcmVxdWlyZSgncHVsbC1jb3JlJylcbnZhciBzb3VyY2VzID0gcmVxdWlyZSgnLi9zb3VyY2VzJylcbnZhciBzaW5rcyA9IHJlcXVpcmUoJy4vc2lua3MnKVxuXG52YXIgcHJvcCAgID0gdS5wcm9wXG52YXIgaWQgICAgID0gdS5pZFxudmFyIHRlc3RlciA9IHUudGVzdGVyXG5cbnZhciBtYXAgPSBleHBvcnRzLm1hcCA9IFxuZnVuY3Rpb24gKHJlYWQsIG1hcCkge1xuICBtYXAgPSBwcm9wKG1hcCkgfHwgaWRcbiAgcmV0dXJuIGZ1bmN0aW9uIChlbmQsIGNiKSB7XG4gICAgcmVhZChlbmQsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgIHZhciBkYXRhID0gIWVuZCA/IG1hcChkYXRhKSA6IG51bGxcbiAgICAgIGNiKGVuZCwgZGF0YSlcbiAgICB9KVxuICB9XG59XG5cbnZhciBhc3luY01hcCA9IGV4cG9ydHMuYXN5bmNNYXAgPVxuZnVuY3Rpb24gKHJlYWQsIG1hcCkge1xuICBpZighbWFwKSByZXR1cm4gcmVhZFxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBpZihlbmQpIHJldHVybiByZWFkKGVuZCwgY2IpIC8vYWJvcnRcbiAgICByZWFkKG51bGwsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgIGlmKGVuZCkgcmV0dXJuIGNiKGVuZCwgZGF0YSlcbiAgICAgIG1hcChkYXRhLCBjYilcbiAgICB9KVxuICB9XG59XG5cbnZhciBwYXJhTWFwID0gZXhwb3J0cy5wYXJhTWFwID1cbmZ1bmN0aW9uIChyZWFkLCBtYXAsIHdpZHRoKSB7XG4gIGlmKCFtYXApIHJldHVybiByZWFkXG4gIHZhciBlbmRlZCA9IGZhbHNlLCBxdWV1ZSA9IFtdLCBfY2JcblxuICBmdW5jdGlvbiBkcmFpbiAoKSB7XG4gICAgaWYoIV9jYikgcmV0dXJuXG4gICAgdmFyIGNiID0gX2NiXG4gICAgX2NiID0gbnVsbFxuICAgIGlmKHF1ZXVlLmxlbmd0aClcbiAgICAgIHJldHVybiBjYihudWxsLCBxdWV1ZS5zaGlmdCgpKVxuICAgIGVsc2UgaWYoZW5kZWQgJiYgIW4pXG4gICAgICByZXR1cm4gY2IoZW5kZWQpXG4gICAgX2NiID0gY2JcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1bGwgKCkge1xuICAgIHJlYWQobnVsbCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgaWYoZW5kKSB7XG4gICAgICAgIGVuZGVkID0gZW5kXG4gICAgICAgIHJldHVybiBkcmFpbigpXG4gICAgICB9XG4gICAgICBuKytcbiAgICAgIG1hcChkYXRhLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIG4tLVxuXG4gICAgICAgIHF1ZXVlLnB1c2goZGF0YSlcbiAgICAgICAgZHJhaW4oKVxuICAgICAgfSlcblxuICAgICAgaWYobiA8IHdpZHRoICYmICFlbmRlZClcbiAgICAgICAgcHVsbCgpXG4gICAgfSlcbiAgfVxuXG4gIHZhciBuID0gMFxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBpZihlbmQpIHJldHVybiByZWFkKGVuZCwgY2IpIC8vYWJvcnRcbiAgICAvL2NvbnRpbnVlIHRvIHJlYWQgd2hpbGUgdGhlcmUgYXJlIGxlc3MgdGhhbiAzIG1hcHMgaW4gZmxpZ2h0XG4gICAgX2NiID0gY2JcbiAgICBpZihxdWV1ZS5sZW5ndGggfHwgZW5kZWQpXG4gICAgICBwdWxsKCksIGRyYWluKClcbiAgICBlbHNlIHB1bGwoKVxuICB9XG4gIHJldHVybiBoaWdoV2F0ZXJNYXJrKGFzeW5jTWFwKHJlYWQsIG1hcCksIHdpZHRoKVxufVxuXG52YXIgZmlsdGVyID0gZXhwb3J0cy5maWx0ZXIgPVxuZnVuY3Rpb24gKHJlYWQsIHRlc3QpIHtcbiAgLy9yZWdleHBcbiAgdGVzdCA9IHRlc3Rlcih0ZXN0KVxuICByZXR1cm4gZnVuY3Rpb24gbmV4dCAoZW5kLCBjYikge1xuICAgIHJlYWQoZW5kLCBmdW5jdGlvbiAoZW5kLCBkYXRhKSB7XG4gICAgICBpZighZW5kICYmICF0ZXN0KGRhdGEpKVxuICAgICAgICByZXR1cm4gbmV4dChlbmQsIGNiKVxuICAgICAgY2IoZW5kLCBkYXRhKVxuICAgIH0pXG4gIH1cbn1cblxudmFyIGZpbHRlck5vdCA9IGV4cG9ydHMuZmlsdGVyTm90ID1cbmZ1bmN0aW9uIChyZWFkLCB0ZXN0KSB7XG4gIHRlc3QgPSB0ZXN0ZXIodGVzdClcbiAgcmV0dXJuIGZpbHRlcihyZWFkLCBmdW5jdGlvbiAoZSkge1xuICAgIHJldHVybiAhdGVzdChlKVxuICB9KVxufVxuXG52YXIgdGhyb3VnaCA9IGV4cG9ydHMudGhyb3VnaCA9IFxuZnVuY3Rpb24gKHJlYWQsIG9wLCBvbkVuZCkge1xuICB2YXIgYSA9IGZhbHNlXG4gIGZ1bmN0aW9uIG9uY2UgKGFib3J0KSB7XG4gICAgaWYoYSB8fCAhb25FbmQpIHJldHVyblxuICAgIGEgPSB0cnVlXG4gICAgb25FbmQoYWJvcnQgPT09IHRydWUgPyBudWxsIDogYWJvcnQpXG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGVuZCwgY2IpIHtcbiAgICBpZihlbmQpIG9uY2UoZW5kKVxuICAgIHJldHVybiByZWFkKGVuZCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgaWYoIWVuZCkgb3AgJiYgb3AoZGF0YSlcbiAgICAgIGVsc2Ugb25jZShlbmQpXG4gICAgICBjYihlbmQsIGRhdGEpXG4gICAgfSlcbiAgfVxufVxuXG52YXIgdGFrZSA9IGV4cG9ydHMudGFrZSA9XG5mdW5jdGlvbiAocmVhZCwgdGVzdCkge1xuICB2YXIgZW5kZWQgPSBmYWxzZVxuICBpZignbnVtYmVyJyA9PT0gdHlwZW9mIHRlc3QpIHtcbiAgICB2YXIgbiA9IHRlc3Q7IHRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbiAtLVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIGlmKGVuZGVkKSByZXR1cm4gY2IoZW5kZWQpXG4gICAgaWYoZW5kZWQgPSBlbmQpIHJldHVybiByZWFkKGVuZGVkLCBjYilcblxuICAgIHJlYWQobnVsbCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgaWYoZW5kZWQgPSBlbmRlZCB8fCBlbmQpIHJldHVybiBjYihlbmRlZClcbiAgICAgIGlmKCF0ZXN0KGRhdGEpKSB7XG4gICAgICAgIGVuZGVkID0gdHJ1ZVxuICAgICAgICByZWFkKHRydWUsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgICAgICBjYihlbmRlZCwgZGF0YSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgY2IobnVsbCwgZGF0YSlcbiAgICB9KVxuICB9XG59XG5cbnZhciB1bmlxdWUgPSBleHBvcnRzLnVuaXF1ZSA9IGZ1bmN0aW9uIChyZWFkLCBmaWVsZCwgaW52ZXJ0KSB7XG4gIGZpZWxkID0gcHJvcChmaWVsZCkgfHwgaWRcbiAgdmFyIHNlZW4gPSB7fVxuICByZXR1cm4gZmlsdGVyKHJlYWQsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdmFyIGtleSA9IGZpZWxkKGRhdGEpXG4gICAgaWYoc2VlbltrZXldKSByZXR1cm4gISFpbnZlcnQgLy9mYWxzZSwgYnkgZGVmYXVsdFxuICAgIGVsc2Ugc2VlbltrZXldID0gdHJ1ZVxuICAgIHJldHVybiAhaW52ZXJ0IC8vdHJ1ZSBieSBkZWZhdWx0XG4gIH0pXG59XG5cbnZhciBub25VbmlxdWUgPSBleHBvcnRzLm5vblVuaXF1ZSA9IGZ1bmN0aW9uIChyZWFkLCBmaWVsZCkge1xuICByZXR1cm4gdW5pcXVlKHJlYWQsIGZpZWxkLCB0cnVlKVxufVxuXG52YXIgZ3JvdXAgPSBleHBvcnRzLmdyb3VwID1cbmZ1bmN0aW9uIChyZWFkLCBzaXplKSB7XG4gIHZhciBlbmRlZDsgc2l6ZSA9IHNpemUgfHwgNVxuICB2YXIgcXVldWUgPSBbXVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZW5kLCBjYikge1xuICAgIC8vdGhpcyBtZWFucyB0aGF0IHRoZSB1cHN0cmVhbSBpcyBzZW5kaW5nIGFuIGVycm9yLlxuICAgIGlmKGVuZCkgcmV0dXJuIHJlYWQoZW5kZWQgPSBlbmQsIGNiKVxuICAgIC8vdGhpcyBtZWFucyB0aGF0IHdlIHJlYWQgYW4gZW5kIGJlZm9yZS5cbiAgICBpZihlbmRlZCkgcmV0dXJuIGNiKGVuZGVkKVxuXG4gICAgcmVhZChudWxsLCBmdW5jdGlvbiBuZXh0KGVuZCwgZGF0YSkge1xuICAgICAgaWYoZW5kZWQgPSBlbmRlZCB8fCBlbmQpIHtcbiAgICAgICAgaWYoIXF1ZXVlLmxlbmd0aClcbiAgICAgICAgICByZXR1cm4gY2IoZW5kZWQpXG5cbiAgICAgICAgdmFyIF9xdWV1ZSA9IHF1ZXVlOyBxdWV1ZSA9IFtdXG4gICAgICAgIHJldHVybiBjYihudWxsLCBfcXVldWUpXG4gICAgICB9XG4gICAgICBxdWV1ZS5wdXNoKGRhdGEpXG4gICAgICBpZihxdWV1ZS5sZW5ndGggPCBzaXplKVxuICAgICAgICByZXR1cm4gcmVhZChudWxsLCBuZXh0KVxuXG4gICAgICB2YXIgX3F1ZXVlID0gcXVldWU7IHF1ZXVlID0gW11cbiAgICAgIGNiKG51bGwsIF9xdWV1ZSlcbiAgICB9KVxuICB9XG59XG5cbnZhciBmbGF0dGVuID0gZXhwb3J0cy5mbGF0dGVuID0gZnVuY3Rpb24gKHJlYWQpIHtcbiAgdmFyIF9yZWFkXG4gIHJldHVybiBmdW5jdGlvbiAoYWJvcnQsIGNiKSB7XG4gICAgaWYoX3JlYWQpIG5leHRDaHVuaygpXG4gICAgZWxzZSAgICAgIG5leHRTdHJlYW0oKVxuXG4gICAgZnVuY3Rpb24gbmV4dENodW5rICgpIHtcbiAgICAgIF9yZWFkKG51bGwsIGZ1bmN0aW9uIChlbmQsIGRhdGEpIHtcbiAgICAgICAgaWYoZW5kKSBuZXh0U3RyZWFtKClcbiAgICAgICAgZWxzZSAgICBjYihudWxsLCBkYXRhKVxuICAgICAgfSlcbiAgICB9XG4gICAgZnVuY3Rpb24gbmV4dFN0cmVhbSAoKSB7XG4gICAgICByZWFkKG51bGwsIGZ1bmN0aW9uIChlbmQsIHN0cmVhbSkge1xuICAgICAgICBpZihlbmQpXG4gICAgICAgICAgcmV0dXJuIGNiKGVuZClcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShzdHJlYW0pKVxuICAgICAgICAgIHN0cmVhbSA9IHNvdXJjZXMudmFsdWVzKHN0cmVhbSlcbiAgICAgICAgZWxzZSBpZignZnVuY3Rpb24nICE9IHR5cGVvZiBzdHJlYW0pXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHBlY3RlZCBzdHJlYW0gb2Ygc3RyZWFtcycpXG4gICAgICAgIFxuICAgICAgICBfcmVhZCA9IHN0cmVhbVxuICAgICAgICBuZXh0Q2h1bmsoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxudmFyIHByZXBlbmQgPVxuZXhwb3J0cy5wcmVwZW5kID1cbmZ1bmN0aW9uIChyZWFkLCBoZWFkKSB7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChhYm9ydCwgY2IpIHtcbiAgICBpZihoZWFkICE9PSBudWxsKSB7XG4gICAgICBpZihhYm9ydClcbiAgICAgICAgcmV0dXJuIHJlYWQoYWJvcnQsIGNiKVxuICAgICAgdmFyIF9oZWFkID0gaGVhZFxuICAgICAgaGVhZCA9IG51bGxcbiAgICAgIGNiKG51bGwsIF9oZWFkKVxuICAgIH0gZWxzZSB7XG4gICAgICByZWFkKGFib3J0LCBjYilcbiAgICB9XG4gIH1cblxufVxuXG4vL3ZhciBkcmFpbklmID0gZXhwb3J0cy5kcmFpbklmID0gZnVuY3Rpb24gKG9wLCBkb25lKSB7XG4vLyAgc2lua3MuZHJhaW4oXG4vL31cblxudmFyIF9yZWR1Y2UgPSBleHBvcnRzLl9yZWR1Y2UgPSBmdW5jdGlvbiAocmVhZCwgcmVkdWNlLCBpbml0aWFsKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY2xvc2UsIGNiKSB7XG4gICAgaWYoY2xvc2UpIHJldHVybiByZWFkKGNsb3NlLCBjYilcbiAgICBpZihlbmRlZCkgcmV0dXJuIGNiKGVuZGVkKVxuXG4gICAgc2lua3MuZHJhaW4oZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIGluaXRpYWwgPSByZWR1Y2UoaW5pdGlhbCwgaXRlbSlcbiAgICB9LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICBlbmRlZCA9IGVyciB8fCB0cnVlXG4gICAgICBpZighZXJyKSBjYihudWxsLCBpbml0aWFsKVxuICAgICAgZWxzZSAgICAgY2IoZW5kZWQpXG4gICAgfSlcbiAgICAocmVhZClcbiAgfVxufVxuXG52YXIgbmV4dFRpY2sgPSBwcm9jZXNzLm5leHRUaWNrXG5cbnZhciBoaWdoV2F0ZXJNYXJrID0gZXhwb3J0cy5oaWdoV2F0ZXJNYXJrID0gXG5mdW5jdGlvbiAocmVhZCwgaGlnaFdhdGVyTWFyaykge1xuICB2YXIgYnVmZmVyID0gW10sIHdhaXRpbmcgPSBbXSwgZW5kZWQsIHJlYWRpbmcgPSBmYWxzZVxuICBoaWdoV2F0ZXJNYXJrID0gaGlnaFdhdGVyTWFyayB8fCAxMFxuXG4gIGZ1bmN0aW9uIHJlYWRBaGVhZCAoKSB7XG4gICAgd2hpbGUod2FpdGluZy5sZW5ndGggJiYgKGJ1ZmZlci5sZW5ndGggfHwgZW5kZWQpKVxuICAgICAgd2FpdGluZy5zaGlmdCgpKGVuZGVkLCBlbmRlZCA/IG51bGwgOiBidWZmZXIuc2hpZnQoKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQgKCkge1xuICAgIGlmKGVuZGVkIHx8IHJlYWRpbmcgfHwgYnVmZmVyLmxlbmd0aCA+PSBoaWdoV2F0ZXJNYXJrKVxuICAgICAgcmV0dXJuXG4gICAgcmVhZGluZyA9IHRydWVcbiAgICByZXR1cm4gcmVhZChlbmRlZCwgZnVuY3Rpb24gKGVuZCwgZGF0YSkge1xuICAgICAgcmVhZGluZyA9IGZhbHNlXG4gICAgICBlbmRlZCA9IGVuZGVkIHx8IGVuZFxuICAgICAgaWYoZGF0YSAhPSBudWxsKSBidWZmZXIucHVzaChkYXRhKVxuICAgICAgXG4gICAgICBuZXh0KCk7IHJlYWRBaGVhZCgpXG4gICAgfSlcbiAgfVxuXG4gIG5leHRUaWNrKG5leHQpXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChlbmQsIGNiKSB7XG4gICAgZW5kZWQgPSBlbmRlZCB8fCBlbmRcbiAgICB3YWl0aW5nLnB1c2goY2IpXG5cbiAgICBuZXh0KCk7IHJlYWRBaGVhZCgpXG4gIH1cbn1cblxuXG5cbiIsIi8qKlxuICAjIyBmbGF0dGVuXG5cbiAgRmxhdHRlbiBhbiBhcnJheSB1c2luZyBgW10ucmVkdWNlYFxuXG4gIDw8PCBleGFtcGxlcy9mbGF0dGVuLmpzXG4gIFxuKiovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYSwgYikge1xuICAvLyBpZiBhIGlzIG5vdCBhbHJlYWR5IGFuIGFycmF5LCBtYWtlIGl0IG9uZVxuICBhID0gQXJyYXkuaXNBcnJheShhKSA/IGEgOiBbYV07XG5cbiAgLy8gY29uY2F0IGIgd2l0aCBhXG4gIHJldHVybiBhLmNvbmNhdChiKTtcbn07IiwidmFyIGNyZWwgPSByZXF1aXJlKCdjcmVsJyk7XG52YXIgU2xpZGUgPSByZXF1aXJlKCcuL3NsaWRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0cykge1xuICByZXR1cm4gZnVuY3Rpb24oY29udGVudCkge1xuICAgIHZhciBzbGlkZTtcblxuICAgIC8vIGhhbmRsZSB0aGluZ3MgdGhhdCBhcmUgYWxyZWFkeSBhIEhUTUxFbGVtZW50XG4gICAgaWYgKGNvbnRlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgLy8gZW5zdXJlIHRoZSBjb250ZW50IGhhcyB0aGUgY2xhc3Mgb2Ygc2xpZGVcbiAgICAgIGNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnc2xpZGUnKTtcblxuICAgICAgLy8gcmV0dXJuIHRoZSBjb250ZW50XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgY29udGVudCByZW5kZXJpbmdcbiAgICBpZiAodHlwZW9mIGNvbnRlbnQgPT0gJ3N0cmluZycgfHwgKGNvbnRlbnQgaW5zdGFuY2VvZiBTdHJpbmcpKSB7XG4gICAgICByZXR1cm4gY3JlbCgnZGl2JywgeyBjbGFzczogJ3NsaWRlJyB9LCBjb250ZW50KTtcbiAgICB9XG5cbiAgICAvLyBjcmVhdGUgYSBuZXcgc2xpZGVcbiAgICBzbGlkZSA9IG5ldyBTbGlkZSgpO1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBhIGZ1bmN0aW9uLCB0aGVuIGNhbGwgdGhlIGZ1bmN0aW9uIHdpdGggdGhlIHNsaWRlIGFzIFwidGhpc1wiXG4gICAgaWYgKHR5cGVvZiBjb250ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRlbnQuY2FsbChzbGlkZSk7XG4gICAgfVxuICAgIC8vIGlmIHdlIGhhdmUgYW4gb2JqZWN0LCB0aGVuIGl0ZXJhdGUgdGhyb3VnaCB0aGUga2V5cyBhbmQgY2FsbFxuICAgIC8vIHJlbGV2YW50IHNsaWRlIGZ1bmN0aW9uc1xuICAgIGVsc2UgaWYgKHR5cGVvZiBjb250ZW50ID09ICdvYmplY3QnKSB7XG4gICAgICBPYmplY3Qua2V5cyhjb250ZW50KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHNsaWRlW2tleV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHNsaWRlW2tleV0oY29udGVudFtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNsaWRlLmVsO1xuICB9O1xufTsiLCJ2YXIgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcblxuZnVuY3Rpb24gU2xpZGUoKSB7XG4gIGlmICghICh0aGlzIGluc3RhbmNlb2YgU2xpZGUpKSB7XG4gICAgcmV0dXJuIG5ldyBTbGlkZSgpO1xuICB9XG5cbiAgdGhpcy5lbCA9IGNyZWwoJ2RpdicsIHsgY2xhc3M6ICdzbGlkZScgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2xpZGU7XG52YXIgcHJvdG8gPSBTbGlkZS5wcm90b3R5cGU7XG5cbnByb3RvLnRpdGxlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLnRpdGxlID0gY3JlbCgnaDEnLCB2YWx1ZSkpO1xufTtcblxucHJvdG8uY29kZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGNvbnNvbGUubG9nKHZhbHVlKTtcbn07Il19
;