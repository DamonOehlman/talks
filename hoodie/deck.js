;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


//
// The shims in this file are not fully implemented shims for the ES5
// features, but do work for the particular usecases there is in
// the other modules.
//

var toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

// Array.isArray is supported in IE9
function isArray(xs) {
  return toString.call(xs) === '[object Array]';
}
exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

// Array.prototype.indexOf is supported in IE9
exports.indexOf = function indexOf(xs, x) {
  if (xs.indexOf) return xs.indexOf(x);
  for (var i = 0; i < xs.length; i++) {
    if (x === xs[i]) return i;
  }
  return -1;
};

// Array.prototype.filter is supported in IE9
exports.filter = function filter(xs, fn) {
  if (xs.filter) return xs.filter(fn);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    if (fn(xs[i], i, xs)) res.push(xs[i]);
  }
  return res;
};

// Array.prototype.forEach is supported in IE9
exports.forEach = function forEach(xs, fn, self) {
  if (xs.forEach) return xs.forEach(fn, self);
  for (var i = 0; i < xs.length; i++) {
    fn.call(self, xs[i], i, xs);
  }
};

// Array.prototype.map is supported in IE9
exports.map = function map(xs, fn) {
  if (xs.map) return xs.map(fn);
  var out = new Array(xs.length);
  for (var i = 0; i < xs.length; i++) {
    out[i] = fn(xs[i], i, xs);
  }
  return out;
};

// Array.prototype.reduce is supported in IE9
exports.reduce = function reduce(array, callback, opt_initialValue) {
  if (array.reduce) return array.reduce(callback, opt_initialValue);
  var value, isValueSet = false;

  if (2 < arguments.length) {
    value = opt_initialValue;
    isValueSet = true;
  }
  for (var i = 0, l = array.length; l > i; ++i) {
    if (array.hasOwnProperty(i)) {
      if (isValueSet) {
        value = callback(value, array[i], i, array);
      }
      else {
        value = array[i];
        isValueSet = true;
      }
    }
  }

  return value;
};

// String.prototype.substr - negative index don't work in IE8
if ('ab'.substr(-1) !== 'b') {
  exports.substr = function (str, start, length) {
    // did we get a negative start, calculate how much it is from the beginning of the string
    if (start < 0) start = str.length + start;

    // call the original function
    return str.substr(start, length);
  };
} else {
  exports.substr = function (str, start, length) {
    return str.substr(start, length);
  };
}

// String.prototype.trim is supported in IE9
exports.trim = function (str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
};

// Function.prototype.bind is supported in IE9
exports.bind = function () {
  var args = Array.prototype.slice.call(arguments);
  var fn = args.shift();
  if (fn.bind) return fn.bind.apply(fn, args);
  var self = args.shift();
  return function () {
    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
  };
};

// Object.create is supported in IE9
function create(prototype, properties) {
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
}
exports.create = typeof Object.create === 'function' ? Object.create : create;

// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
// they do show a description and number property on Error objects
function notObject(object) {
  return ((typeof object != "object" && typeof object != "function") || object === null);
}

function keysShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.keys called on a non-object");
  }

  var result = [];
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// getOwnPropertyNames is almost the same as Object.keys one key feature
//  is that it returns hidden properties, since that can't be implemented,
//  this feature gets reduced so it just shows the length property on arrays
function propertyShim(object) {
  if (notObject(object)) {
    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
  }

  var result = keysShim(object);
  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
    result.push('length');
  }
  return result;
}

var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
  Object.getOwnPropertyNames : propertyShim;

if (new Error().hasOwnProperty('description')) {
  var ERROR_PROPERTY_FILTER = function (obj, array) {
    if (toString.call(obj) === '[object Error]') {
      array = exports.filter(array, function (name) {
        return name !== 'description' && name !== 'number' && name !== 'message';
      });
    }
    return array;
  };

  exports.keys = function (object) {
    return ERROR_PROPERTY_FILTER(object, keys(object));
  };
  exports.getOwnPropertyNames = function (object) {
    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
  };
} else {
  exports.keys = keys;
  exports.getOwnPropertyNames = getOwnPropertyNames;
}

// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
function valueObject(value, key) {
  return { value: value[key] };
}

if (typeof Object.getOwnPropertyDescriptor === 'function') {
  try {
    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  } catch (e) {
    // IE8 dom element issue - use a try catch and default to valueObject
    exports.getOwnPropertyDescriptor = function (value, key) {
      try {
        return Object.getOwnPropertyDescriptor(value, key);
      } catch (e) {
        return valueObject(value, key);
      }
    };
  }
} else {
  exports.getOwnPropertyDescriptor = valueObject;
}

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;
var util = require('util');
var shims = require('_shims');
var timers = require('timers');
var Readable = require('_stream_readable');
var Writable = require('_stream_writable');

util.inherits(Duplex, Readable);

shims.forEach(shims.keys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  timers.setImmediate(shims.bind(this.end, this));
}

},{"_shims":1,"_stream_readable":4,"_stream_writable":6,"timers":12,"util":13}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('_stream_transform');
var util = require('util');
util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"_stream_transform":5,"util":13}],4:[function(require,module,exports){
var process=require("__browserify_process");// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;
Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;
var Stream = require('stream');
var shims = require('_shims');
var Buffer = require('buffer').Buffer;
var timers = require('timers');
var util = require('util');
var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || n === null) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode &&
      !er) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    timers.setImmediate(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    timers.setImmediate(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    timers.setImmediate(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  // check for listeners before emit removes one-time listeners.
  var errListeners = EE.listenerCount(dest, 'error');
  function onerror(er) {
    unpipe();
    if (errListeners === 0 && EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  dest.once('error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    timers.setImmediate(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      shims.forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = shims.indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      timers.setImmediate(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  shims.forEach(events, function(ev) {
    stream.on(ev, shims.bind(self.emit, self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    timers.setImmediate(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

},{"__browserify_process":17,"_shims":1,"buffer":15,"events":8,"stream":10,"string_decoder":11,"timers":12,"util":13}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('_stream_duplex');
var util = require('util');
util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"_stream_duplex":2,"util":13}],6:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;
Writable.WritableState = WritableState;

var util = require('util');
var Stream = require('stream');
var timers = require('timers');
var Buffer = require('buffer').Buffer;

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];
}

function Writable(options) {
  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  timers.setImmediate(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    timers.setImmediate(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  state.needDrain = !ret;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    timers.setImmediate(function() {
      cb(er);
    });
  else
    cb(er);

  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      timers.setImmediate(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      timers.setImmediate(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

},{"buffer":15,"stream":10,"timers":12,"util":13}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// UTILITY
var util = require('util');
var shims = require('_shims');
var pSlice = Array.prototype.slice;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  this.message = options.message || getMessage(this);
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = shims.keys(a),
        kb = shims.keys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};
},{"_shims":1,"util":13}],8:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util');

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!util.isNumber(n) || n < 0)
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (util.isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (util.isUndefined(handler))
    return false;

  if (util.isFunction(handler)) {
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
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (util.isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              util.isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (util.isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (util.isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!util.isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
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

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  function g() {
    this.removeListener(type, g);
    listener.apply(this, arguments);
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!util.isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (util.isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (util.isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (util.isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (util.isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (util.isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};
},{"util":13}],9:[function(require,module,exports){

// not implemented
// The reason for having an empty file and not throwing is to allow
// untraditional implementation of this module.

},{}],10:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var util = require('util');

util.inherits(Stream, EE);
Stream.Readable = require('_stream_readable');
Stream.Writable = require('_stream_writable');
Stream.Duplex = require('_stream_duplex');
Stream.Transform = require('_stream_transform');
Stream.PassThrough = require('_stream_passthrough');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"_stream_duplex":2,"_stream_passthrough":3,"_stream_readable":4,"_stream_transform":5,"_stream_writable":6,"events":8,"util":13}],11:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

function assertEncoding(encoding) {
  if (encoding && !Buffer.isEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  this.charBuffer = new Buffer(6);
  this.charReceived = 0;
  this.charLength = 0;
};


StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  var offset = 0;

  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var i = (buffer.length >= this.charLength - this.charReceived) ?
                this.charLength - this.charReceived :
                buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, offset, i);
    this.charReceived += (i - offset);
    offset = i;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (i == buffer.length) return charStr;

    // otherwise cut off the characters end from the beginning of this buffer
    buffer = buffer.slice(i, buffer.length);
    break;
  }

  var lenIncomplete = this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
    this.charReceived = lenIncomplete;
    end -= lenIncomplete;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  return i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 2;
  this.charLength = incomplete ? 2 : 0;
  return incomplete;
}

function base64DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 3;
  this.charLength = incomplete ? 3 : 0;
  return incomplete;
}

},{"buffer":15}],12:[function(require,module,exports){
try {
    // Old IE browsers that do not curry arguments
    if (!setTimeout.call) {
        var slicer = Array.prototype.slice;
        exports.setTimeout = function(fn) {
            var args = slicer.call(arguments, 1);
            return setTimeout(function() {
                return fn.apply(this, args);
            })
        };

        exports.setInterval = function(fn) {
            var args = slicer.call(arguments, 1);
            return setInterval(function() {
                return fn.apply(this, args);
            });
        };
    } else {
        exports.setTimeout = setTimeout;
        exports.setInterval = setInterval;
    }
    exports.clearTimeout = clearTimeout;
    exports.clearInterval = clearInterval;

    if (window.setImmediate) {
      exports.setImmediate = window.setImmediate;
      exports.clearImmediate = window.clearImmediate;
    }

    // Chrome and PhantomJS seems to depend on `this` pseudo variable being a
    // `window` and throws invalid invocation exception otherwise. If this code
    // runs in such JS runtime next line will throw and `catch` clause will
    // exported timers functions bound to a window.
    exports.setTimeout(function() {});
} catch (_) {
    function bind(f, context) {
        return function () { return f.apply(context, arguments) };
    }

    if (typeof window !== 'undefined') {
      exports.setTimeout = bind(setTimeout, window);
      exports.setInterval = bind(setInterval, window);
      exports.clearTimeout = bind(clearTimeout, window);
      exports.clearInterval = bind(clearInterval, window);
      if (window.setImmediate) {
        exports.setImmediate = bind(window.setImmediate, window);
        exports.clearImmediate = bind(window.clearImmediate, window);
      }
    } else {
      if (typeof setTimeout !== 'undefined') {
        exports.setTimeout = setTimeout;
      }
      if (typeof setInterval !== 'undefined') {
        exports.setInterval = setInterval;
      }
      if (typeof clearTimeout !== 'undefined') {
        exports.clearTimeout = clearTimeout;
      }
      if (typeof clearInterval === 'function') {
        exports.clearInterval = clearInterval;
      }
    }
}

exports.unref = function unref() {};
exports.ref = function ref() {};

if (!exports.setImmediate) {
  var currentKey = 0, queue = {}, active = false;

  exports.setImmediate = (function () {
      function drain() {
        active = false;
        for (var key in queue) {
          if (queue.hasOwnProperty(currentKey, key)) {
            var fn = queue[key];
            delete queue[key];
            fn();
          }
        }
      }

      if (typeof window !== 'undefined' &&
          window.postMessage && window.addEventListener) {
        window.addEventListener('message', function (ev) {
          if (ev.source === window && ev.data === 'browserify-tick') {
            ev.stopPropagation();
            drain();
          }
        }, true);

        return function setImmediate(fn) {
          var id = ++currentKey;
          queue[id] = fn;
          if (!active) {
            active = true;
            window.postMessage('browserify-tick', '*');
          }
          return id;
        };
      } else {
        return function setImmediate(fn) {
          var id = ++currentKey;
          queue[id] = fn;
          if (!active) {
            active = true;
            setTimeout(drain, 0);
          }
          return id;
        };
      }
  })();

  exports.clearImmediate = function clearImmediate(id) {
    delete queue[id];
  };
}

},{}],13:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var shims = require('_shims');

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
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
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};

/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
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
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  shims.forEach(array, function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = shims.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = shims.getOwnPropertyNames(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }

  shims.forEach(keys, function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = shims.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (shims.indexOf(ctx.seen, desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
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
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = shims.reduce(output, function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return shims.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && objectToString(e) === '[object Error]';
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.binarySlice === 'function'
  ;
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
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


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = shims.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = shims.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

},{"_shims":1}],14:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],15:[function(require,module,exports){
var assert;
exports.Buffer = Buffer;
exports.SlowBuffer = Buffer;
Buffer.poolSize = 8192;
exports.INSPECT_MAX_BYTES = 50;

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function Buffer(subject, encoding, offset) {
  if(!assert) assert= require('assert');
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }
  this.parent = this;
  this.offset = 0;

  // Work-around: node's base64 implementation
  // allows for non-padded strings while base64-js
  // does not..
  if (encoding == "base64" && typeof subject == "string") {
    subject = stringtrim(subject);
    while (subject.length % 4 != 0) {
      subject = subject + "="; 
    }
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    // slicing works, with limitations (no parent tracking/update)
    // check https://github.com/toots/buffer-browserify/issues/19
    for (var i = 0; i < this.length; i++) {
        this[i] = subject.get(i+offset);
    }
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this[i] = subject.readUInt8(i);
        }
        else {
          this[i] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    } else if (type === 'number') {
      for (var i = 0; i < this.length; i++) {
        this[i] = 0;
      }
    }
  }
}

Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this[i];
};

Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this[i] = v;
};

Buffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

Buffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return Buffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

Buffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return Buffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

Buffer.prototype.binaryWrite = Buffer.prototype.asciiWrite;

Buffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

Buffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
};

Buffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

Buffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

Buffer.prototype.binarySlice = Buffer.prototype.asciiSlice;

Buffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


Buffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  Buffer._charsWritten = i * 2;
  return i;
};


Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};

// slice(start, end)
function clamp(index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue;
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len;
  if (index >= 0) return index;
  index += len;
  if (index >= 0) return index;
  return 0;
}

Buffer.prototype.slice = function(start, end) {
  var len = this.length;
  start = clamp(start, len, 0);
  end = clamp(end, len, len);
  return new Buffer(this, end - start, +start);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  if (end === undefined || isNaN(end)) {
    end = this.length;
  }
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  var temp = [];
  for (var i=start; i<end; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=target_start; i<target_start+temp.length; i++) {
    target[i] = temp[i-target_start];
  }
};

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof Buffer;
};

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

Buffer.isEncoding = function(encoding) {
  switch ((encoding + '').toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;

    default:
      return false;
  }
};

// helpers

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}

function isArray(subject) {
  return (Array.isArray ||
    function(subject){
      return {}.toString.apply(subject) == '[object Array]'
    })
    (subject)
}

function isArrayIsh(subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

// read/write bit-twiddling

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer[offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer[offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer[offset + 1];
    }
  } else {
    val = buffer[offset];
    if (offset + 1 < buffer.length) {
      val |= buffer[offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer[offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer[offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer[offset + 3];
    val = val + (buffer[offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer[offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer[offset + 1] << 8;
    val |= buffer[offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer[offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer[offset] & 0x80;
  if (!neg) {
    return (buffer[offset]);
  }

  return ((0xff - buffer[offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer[offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer[offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer[offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

},{"./buffer_ieee754":14,"assert":7,"base64-js":16}],16:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
var fs = require('fs');
var deck = require('decker')();

deck.css("article.decker {\n  font-family: Helvetica, Arial, sans-serif;\n  font-size: 1.4em;\n  line-height: 1.6em;\n}\narticle.decker h1 {\n  font-size: 1.6em;\n  margin: 0;\n  text-shadow: 0 1px 2px #e8e8e8;\n}\narticle.decker h1:last-child {\n  text-align: center;\n  height: 100%;\n  padding-top: 40%;\n}\narticle.decker h2,\narticle.decker h3,\narticle.decker h4 {\n  margin-top: 0px;\n  text-shadow: 0 1px 2px #e8e8e8;\n}\narticle.decker pre {\n  line-height: 1.4em;\n}\n\n");
deck.css("/*\n\nOriginal style from softwaremaniacs.org (c) Ivan Sagalaev <Maniac@SoftwareManiacs.Org>\n\n*/\n\npre code {\n  display: block; padding: 0.5em;\n  background: #F0F0F0;\n}\n\npre code,\npre .subst,\npre .tag .title,\npre .lisp .title,\npre .clojure .built_in,\npre .nginx .title {\n  color: black;\n}\n\npre .string,\npre .title,\npre .constant,\npre .parent,\npre .tag .value,\npre .rules .value,\npre .rules .value .number,\npre .preprocessor,\npre .haml .symbol,\npre .ruby .symbol,\npre .ruby .symbol .string,\npre .aggregate,\npre .template_tag,\npre .django .variable,\npre .smalltalk .class,\npre .addition,\npre .flow,\npre .stream,\npre .bash .variable,\npre .apache .tag,\npre .apache .cbracket,\npre .tex .command,\npre .tex .special,\npre .erlang_repl .function_or_atom,\npre .asciidoc .header,\npre .markdown .header,\npre .coffeescript .attribute {\n  color: #800;\n}\n\npre .comment,\npre .annotation,\npre .template_comment,\npre .diff .header,\npre .chunk,\npre .asciidoc .blockquote,\npre .markdown .blockquote {\n  color: #888;\n}\n\npre .number,\npre .date,\npre .regexp,\npre .literal,\npre .hexcolor,\npre .smalltalk .symbol,\npre .smalltalk .char,\npre .go .constant,\npre .change,\npre .lasso .variable,\npre .asciidoc .bullet,\npre .markdown .bullet,\npre .asciidoc .link_url,\npre .markdown .link_url {\n  color: #080;\n}\n\npre .label,\npre .javadoc,\npre .ruby .string,\npre .decorator,\npre .filter .argument,\npre .localvars,\npre .array,\npre .attr_selector,\npre .important,\npre .pseudo,\npre .pi,\npre .haml .bullet,\npre .doctype,\npre .deletion,\npre .envvar,\npre .shebang,\npre .apache .sqbracket,\npre .nginx .built_in,\npre .tex .formula,\npre .erlang_repl .reserved,\npre .prompt,\npre .asciidoc .link_label,\npre .markdown .link_label,\npre .vhdl .attribute,\npre .clojure .attribute,\npre .asciidoc .attribute,\npre .lasso .attribute,\npre .coffeescript .property {\n  color: #88F\n}\n\npre .keyword,\npre .id,\npre .title,\npre .built_in,\npre .aggregate,\npre .css .tag,\npre .javadoctag,\npre .phpdoc,\npre .yardoctag,\npre .smalltalk .class,\npre .winutils,\npre .bash .variable,\npre .apache .tag,\npre .go .typename,\npre .tex .command,\npre .asciidoc .strong,\npre .markdown .strong,\npre .request,\npre .status {\n  font-weight: bold;\n}\n\npre .asciidoc .emphasis,\npre .markdown .emphasis {\n  font-style: italic;\n}\n\npre .nginx .built_in {\n  font-weight: normal;\n}\n\npre .coffeescript .javascript,\npre .javascript .xml,\npre .lasso .markup,\npre .tex .formula,\npre .xml .javascript,\npre .xml .vbscript,\npre .xml .css,\npre .xml .cdata {\n  opacity: 0.5;\n}");
deck.add("# Prototyping Applications with Hoodie\n\n---\n\n## What is Hoodie?\n\n[Hoodie](http://hood.ie) is an JS application development approach which has a focus on making applications with offline synchronization **just work**.\n\n---\n\n## Why Use (or even look at) Hoodie?\n\n1. Because they are focused on solving hard problems (data sync) straight up, rather than giving you flashy things to distract you.\n\n2. Leverages CouchDB for stuff it's really good at.\n\n3. There's some really smart, experienced people working on it.\n\n---\n\n## Hoodie Core Concepts\n\n- User Accounts and Authentication\n- Generic Document Store\n- Tasks\n- Bus-like eventing (not as good as [eve](https://github.com/adobe-webplatform/eve), but good)\n\n---\n\n## Getting your Hoodie on\n\n```js\nvar hoodie = new Hoodie();\n```\n\nThis transparently creates a connection to the hoodie api running on the local machine in the background.  As you would expect, you can override the default endpoint.\n\n---\n\n## Authentication\n\n```js\nhoodie.account.signIn('me@test.com', 'supersecretpass');\n```\n\nFunctions like the `signIn` function above return a promise.  While not my personal preference, it does make for a very clean looking API.\n\n```js\nhoodie.account.signIn('me@test.com', 'secret').then(function() {\n\tconsole.log(hoodie.account.username);\n});\n```\n\n---\n\n## Generic Document Store\n\nThis is very nicely done, and makes excellent use of Couch as a document store.\n\n```js\nhoodie.store.add('customer', { name: 'Bob' });\n```\n\nData is added to a _user specific database_ in the couch backend if online.  Heck, you can even use \"futon\" (CouchDB's admin interface) to look at your data:\n\nhttp://127.0.0.1:6001/_api/_utils\n\n---\n\n## Example: Capture Geo Tracks\n\nSo tracking a geo track could be as simple as:\n\n```js\nnavigator.geolocation.watchPosition(function(pos) {\n\thoodie.store.add('pos', pos.coords);\n});\n```\n\nWhich is pretty awesome.  Here's what the data looks like in couch:\n\n```json\n{\n   \"_id\": \"pos/3322231\",\n   \"_rev\": \"1-121022121\",\n   \"speed\": null,\n   \"heading\": null,\n   \"altitudeAccuracy\": null,\n   \"accuracy\": 18000,\n   \"altitude\": null,\n   \"longitude\": 151.20699,\n   \"latitude\": -33.867487,\n   \"createdBy\": \"2122222\",\n   \"updatedAt\": \"2013-10-23T03:31:07.059Z\",\n   \"createdAt\": \"2013-10-23T03:31:07.059Z\",\n   \"type\": \"pos\"\n}\n```\n\n---\n\n## Hoodie Eventing\n\nHoodie uses a pubsub eventing model which allows for wonderful decoupling at the UI layer.\n\nHandling account sign-in:\n\n```js\nhoodie.account.on('signin', function() {\n});\n```\n\nOr when a new position is added:\n\n```js\nhoodie.store.on('add:pos', function(pos) {\n\t// I could do nifty geofencing stuff here :)\n});\n```\n\n---\n\n## Offline + Data Synchronization\n\nAll data is stored in `localStorage` (check your web inspector) and when online automatically synchronized with server.  If you want to know when synchronization is happening, then you can use events.\n\nYou could monitor your movements on a desktop display\n\n```js\nhoodie.remote.on('add:pos', function (pos) {\n\t// update your current position on your map\n});\n```\n---\n\n## Pros / Cons\n\n- **PRO**: Tackling offline sync head on is great.\n- **PRO**: Getting started fleshing out your app is really simple.\n- **CON?**: Built on jQuery (at the moment)\n- **CON?**: Feels a bit frameworky for my tastes.\n- Be aware that storage implementation is pretty closely tied to [CouchDB](http://couchdb.apache.org) at the moment.  I **love** Couch so I don't consider this a problem, but you should be aware...\n\n---\n\n## Closing Thoughts\n\nThey have a dog wearing a hoodie - you should at least take a look.\n\nIt's great to see someone make a serious go of unlocking the potential of CouchDB + single page apps.");
document.body.appendChild(deck.render());
},{"decker":19,"fs":9}],19:[function(require,module,exports){
/* jshint node: true */
/* global window: false */
'use strict';

/**
  # Welcome to Decker

  --

  ## What is Decker?

  Decker is a tool for generating presentations using
  [browserify](https://github.com/substack/node-browserify).

  --

  ## Why Decker?

  Because if you are talking about Browserify, then using presentation
  software built another way feels kind of wrong :/ 

**/

var classtweak = require('classtweak');
var crel = require('crel');
var insertCss = require('insert-css');
var key = require('keymaster');
var Stream = require('stream');
var hljs = require('highlight.js');
var marked = require('marked');
var util = require('util');
var fs = require('fs');

var reSlideBreak = /\n\r?\-{2,}/m;
var reLeadingAndTrailingSpaces = /^\s*(.*)\s*$/m;

var hljsLangMappings = {
  js: 'javascript'
};

module.exports = function(options) {
  return new Deck(options || {});
};

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


/**
  --
  ## Decker Reference

**/

function Deck() {
  Stream.call(this);

  // initialise the slides array
  this.slides = [];

  // initialise the elements array that will contain the section elements
  this._elements = [];

  // mark as writable
  this.writable = true;
}

util.inherits(Deck, Stream);

/**
  ### add(data)
**/
Deck.prototype.add = function(slide) {
  var textData = typeof slide == 'string' || (slide instanceof String);

  if (textData && reSlideBreak.test(slide)) {
    return slide.split(reSlideBreak).forEach(this.add.bind(this));
  }

  // attempt a converstion to html if a string
  if (textData) {
    // trim trailing line breaks and spaces
    slide = {
      type: 'html',
      data: marked(slide.replace(reLeadingAndTrailingSpaces, '$1'))
    };
  }

  // add the slide to the list
  this.slides.push(slide);
};

Deck.prototype.css = function(css) {
  insertCss(css);
};

/**
  ### render() -> HTMLElement

  Render a new slide deck as an HTML element ready for insertion into
  the DOM.
**/
Deck.prototype.render = function() {
  function createSlide(slide, index) {
    var section;

    switch (slide.type) {
    case 'html':
      section = crel('section');
      section.innerHTML = slide.data;

      break;
    }

    // set the data attributes
    section.dataset.index = index;

    return section;
  }

  // create the dom elements
  this._elements = this.slides.map(createSlide);

  // set the index to 0 if not already defined
  this.index = this.index || this.hashIndex || 0;

  // bind keys
  key('right, space, left', this._handleKey.bind(this));

  // ensure we have the baseline css
  insertCss("html,\nbody,\nsection {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  overflow: hidden;\n}\narticle.decker section {\n  position: absolute;\n  padding: 5%;\n  width: 90%;\n  height: 90%;\n  top: 0;\n  left: 0;\n  -webkit-transform: translateX(100%) translateZ(0px);\n  -webkit-transition: all ease-in-out 0.5s;\n}\narticle.decker section.decker-active {\n  -webkit-transform: translateX(0px) translateZ(0px);\n}\narticle.decker section.decker-past {\n  -webkit-transform: translateX(-100%) translateZ(0px);\n}\n\n");

  // create the container article
  return crel.apply(
    null,
    ['article', { class: 'decker '}].concat(this._elements)
  );
};

/**
  ### write(data)
**/
Deck.prototype.write = function() {
    // apply the action from the deck
};

/**
  ### _handleKey(evt, handler)

  Handle key events as per
  [keymaster](https://github.com/madrobby/keymaster) docs.
**/
Deck.prototype._handleKey = function(evt, handler) {
  switch (handler.shortcut) {
  case 'left':
    this.index -= 1;
    break;

  default:
    this.index += 1;
  }
};

/* deck properties */

/**
  ### deck@index

**/
Object.defineProperty(Deck.prototype, 'index', {
  get: function() {
    return this._index;
  },

  set: function(value) {
    // constrain the value to within valid bounds
    value = this._elements.length ?
      Math.max(0, Math.min(parseInt(value, 10), this._elements.length - 1)) :
      -1;

    if (this._index !== value) {
      // unset active for the articles
      classtweak(this._elements, '-decker-active -decker-past');

      // set the current section to active
      if (value >= 0) {
        classtweak(this._elements.slice(0, value), '+decker-past');
        classtweak(this._elements[value], '+decker-active');
        this._index = value;

        if (typeof window != 'undefined') {
          window.location.hash = value;
        }
      }
    }
  }
});

/**
  ### deck@hashIndex

**/
Object.defineProperty(Deck.prototype, 'hashIndex', {
  get: function() {
    if (typeof window != 'undefined') {
      return parseInt(window.location.hash.slice(1), 10);
    }
  }
});
},{"classtweak":20,"crel":21,"fs":9,"highlight.js":46,"insert-css":77,"keymaster":78,"marked":79,"stream":10,"util":13}],20:[function(require,module,exports){
// classtweak 0.1.0 - Simple DOM element class manipulator
//
// Copyright (c) 2011 Damon Oehlman (http://www.sidelab.com/)
// Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.

/*\
 * classtweak
 [ function ]
 **
 * The `classtweak` function can be used in multiple ways
 **
 > Arguments (option 1)
 **
 - elements (string|array) string that is passed to the Selectors API, or an array of DOM elements to update classes on
 - initAction (string) class modifier string
 - scope (DOMElement) target dom element for querySelector calls (default: document)
 **
 = (function) returns the classtweak function for chaining
 **
 **
 > Usage
 | // add the button class to all anchor tags
 | classtweak('a', '+button');
 > Arguments (option 2)
 **
 - elements (string|array) as per option 1
 **
 = (function) returns the @tweak function to enable class manipulation on the specified elements
\*/
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.classtweak = factory();
    }
}(this, function () {
    function classtweak(elements, initAction, scope) {
        // if elements is not defined, then return
        if (! elements) {
            return undefined;
        } // if

        // internals
        var reSpaces = /[\s\,]+/,
            instructionHandlers = {
                '+': function(current, target, foundIdx) {
                    // if the style was not found, then add it
                    if (foundIdx < 0) {
                        current[current.length] = target;
                    } // if
                },
                
                '-': function(current, target, foundIdx) {
                    if (foundIdx >= 0) {
                        current.splice(foundIdx, 1);
                    } // if
                },
                
                '!': function(current, target, foundIdx) {
                    instructionHandlers[foundIdx < 0 ? '+' : '-'](current, target, foundIdx);
                }
            };
            
        /*\
         * tweak
         [ function ]
         **
         * Apply the specified actions to the previously specified elements
         **
         > Arguments
         **
         - actions (string)
         **
         = (function) return the `tweak` function for chaining
         **
        \*/
        function tweak(actions) {
            // itereate through the elements
            for (var elIdx = elements.length; elIdx--; ) {
                var element = elements[elIdx],
                    activeClasses = element.className ? element.className.split(/\s+/).sort() : [],
                    ii;

                // if the action is a string, then parse into an array
                if (typeof actions == 'string') {
                    actions = actions.split(reSpaces);
                } // if

                // iterate through the actions and apply the tweaks
                for (ii = actions.length; ii--; ) {
                    // get the action instruction
                    var action = actions[ii],
                        instruction = action.slice(0, 1),
                        lastChar = action.slice(-1),
                        className = action.slice(1),
                        handler = instructionHandlers[instruction],
                        dotSyntax = instruction == '.' || lastChar == '.',
                        classIdx, found = -1;
                        
                    // if the instruction handler is not found, then default to +
                    // also, use the full action text
                    if (! handler) {
                        // if we have the dot syntax then do more parsing
                        if (dotSyntax) {
                            // update the handler
                            handler = instructionHandlers[
                                instruction == '.' && lastChar == '.' ? '!' : 
                                    instruction == '.' ? '+' : '-'
                            ];
                            
                            // update the classname
                            className = action.slice(
                                instruction == '.' ? 1 : 0, 
                                lastChar == '.' ? -1 : undefined
                            );
                        }
                        // otherwise, just fall back to the add handler
                        else {
                            // if the last character is a dot, push to the dot handler, otherwise +
                            handler = instructionHandlers['+'];
                            className = actions[ii];
                        } // if..else
                    } // if
                    
                    // iterate through the active classes and update the found state
                    for (classIdx = activeClasses.length; (found < 0) && classIdx--; ) {
                        // if we have a match on the class, then update the found index
                        if (activeClasses[classIdx] === className) {
                            found = classIdx;
                        } // if
                    } // for

                    // apply the handler, activeClasses modified in place
                    handler(activeClasses, className, found);
                } // for

                // update the element classname
                element.className = activeClasses.join(' ');
            } // for
            
            return tweak;
        } // tweak
        
        // check the elements
        if (typeof elements == 'string' || elements instanceof String) {
            // if we have a qsa function defined (for speed or backwards compatibility) use that
            // otherwise default to the querySelector API
            elements = typeof qsa == 'function' ? qsa(elements, scope) : (scope || document).querySelectorAll(elements);
        }
        // if we don't have a splice function, then we don't have an array
        // make it one
        else if (! elements.splice) {
            elements = [elements];
        } // if..else

        // apply the requested action
        if (initAction) {
            tweak(initAction);
        } // if
        
        // return the tweak
        return initAction ? classtweak : tweak;
    } // classtweak

    return classtweak;
}));
},{}],21:[function(require,module,exports){
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

// if the module has no dependencies, the above pattern can be simplified to
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
        ? function (object) { return object instanceof Node }
        : function (object) {
            return object
                && typeof object === 'object'
                && typeof object.nodeType === 'number'
                && typeof object.nodeName === 'string';
        };

    function crel(){
        var document = window.document,
            args = arguments, //Note: assigned to a variable to assist compilers. Saves about 40 bytes in closure compiler. Has negligable effect on performance.
            element = document.createElement(args[0]),
            child,
            settings = args[1],
            childIndex = 2,
            argumentsLength = args.length,
            attributeMap = crel.attrMap;

        // shortcut
        if(argumentsLength === 1){
            return element;
        }

        if(typeof settings !== 'object' || isNode(settings)) {
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
                
                if(!isNode(child)){
                    child = document.createTextNode(child);
                }
                
                element.appendChild(child);
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

},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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
},{}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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
},{}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{}],28:[function(require,module,exports){
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
},{}],29:[function(require,module,exports){
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
},{}],30:[function(require,module,exports){
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
},{}],31:[function(require,module,exports){
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
},{}],32:[function(require,module,exports){
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
},{}],33:[function(require,module,exports){
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
},{}],34:[function(require,module,exports){
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
},{}],35:[function(require,module,exports){
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
},{}],36:[function(require,module,exports){
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
},{}],37:[function(require,module,exports){
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
},{}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
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
},{}],40:[function(require,module,exports){
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
},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
},{}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
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
},{}],46:[function(require,module,exports){
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
},{"./1c.js":22,"./actionscript.js":23,"./apache.js":24,"./applescript.js":25,"./avrasm.js":26,"./axapta.js":27,"./bash.js":28,"./brainfuck.js":29,"./clojure.js":30,"./cmake.js":31,"./coffeescript.js":32,"./cpp.js":33,"./cs.js":34,"./css.js":35,"./d.js":36,"./delphi.js":37,"./diff.js":38,"./django.js":39,"./dos.js":40,"./erlang-repl.js":41,"./erlang.js":42,"./glsl.js":43,"./go.js":44,"./haskell.js":45,"./http.js":47,"./ini.js":48,"./java.js":49,"./javascript.js":50,"./json.js":51,"./lisp.js":52,"./lua.js":53,"./markdown.js":54,"./matlab.js":55,"./mel.js":56,"./nginx.js":57,"./objectivec.js":58,"./parser3.js":59,"./perl.js":60,"./php.js":61,"./profile.js":62,"./python.js":63,"./r.js":64,"./rib.js":65,"./rsl.js":66,"./ruby.js":67,"./rust.js":68,"./scala.js":69,"./smalltalk.js":70,"./sql.js":71,"./tex.js":72,"./vala.js":73,"./vbscript.js":74,"./vhdl.js":75,"./xml.js":76}],47:[function(require,module,exports){
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
},{}],48:[function(require,module,exports){
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
},{}],49:[function(require,module,exports){
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
},{}],50:[function(require,module,exports){
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
},{}],51:[function(require,module,exports){
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
},{}],52:[function(require,module,exports){
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
},{}],53:[function(require,module,exports){
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
},{}],54:[function(require,module,exports){
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
},{}],55:[function(require,module,exports){
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
},{}],56:[function(require,module,exports){
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
},{}],57:[function(require,module,exports){
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
},{}],58:[function(require,module,exports){
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
},{}],59:[function(require,module,exports){
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
},{}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
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
},{}],62:[function(require,module,exports){
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
},{}],63:[function(require,module,exports){
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
},{}],64:[function(require,module,exports){
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
},{}],65:[function(require,module,exports){
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
},{}],66:[function(require,module,exports){
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
},{}],67:[function(require,module,exports){
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
},{}],68:[function(require,module,exports){
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
},{}],69:[function(require,module,exports){
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
},{}],70:[function(require,module,exports){
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
},{}],71:[function(require,module,exports){
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
},{}],72:[function(require,module,exports){
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
},{}],73:[function(require,module,exports){
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
},{}],74:[function(require,module,exports){
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
},{}],75:[function(require,module,exports){
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
},{}],76:[function(require,module,exports){
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
},{}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
//     keymaster.js
//     (c) 2011 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;(function(global){
  var k,
    _handlers = {},
    _mods = { 16: false, 18: false, 17: false, 91: false },
    _scope = 'all',
    // modifier keys
    _MODIFIERS = {
      '⇧': 16, shift: 16,
      '⌥': 18, alt: 18, option: 18,
      '⌃': 17, ctrl: 17, control: 17,
      '⌘': 91, command: 91
    },
    // special keys
    _MAP = {
      backspace: 8, tab: 9, clear: 12,
      enter: 13, 'return': 13,
      esc: 27, escape: 27, space: 32,
      left: 37, up: 38,
      right: 39, down: 40,
      del: 46, 'delete': 46,
      home: 36, end: 35,
      pageup: 33, pagedown: 34,
      ',': 188, '.': 190, '/': 191,
      '`': 192, '-': 189, '=': 187,
      ';': 186, '\'': 222,
      '[': 219, ']': 221, '\\': 220
    };

  for(k=1;k<20;k++) _MODIFIERS['f'+k] = 111+k;

  // IE doesn't support Array#indexOf, so have a simple replacement
  function index(array, item){
    var i = array.length;
    while(i--) if(array[i]===item) return i;
    return -1;
  }

  // handle keydown event
  function dispatch(event){
    var key, tagName, handler, k, i, modifiersMatch;
    tagName = (event.target || event.srcElement).tagName;
    key = event.keyCode;

    // if a modifier key, set the key.<modifierkeyname> property to true and return
    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
    if(key in _mods) {
      _mods[key] = true;
      // 'assignKey' from inside this closure is exported to window.key
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
      return;
    }

    // ignore keypressed in any elements that support keyboard data input
    if (tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA') return;

    // abort if no potentially matching shortcuts found
    if (!(key in _handlers)) return;

    // for each potential shortcut
    for (i = 0; i < _handlers[key].length; i++) {
      handler = _handlers[key][i];

      // see if it's in the current scope
      if(handler.scope == _scope || handler.scope == 'all'){
        // check if modifiers match if any
        modifiersMatch = handler.mods.length > 0;
        for(k in _mods)
          if((!_mods[k] && index(handler.mods, +k) > -1) ||
            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
        // call the handler and stop the event if neccessary
        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
          if(handler.method(event, handler)===false){
            if(event.preventDefault) event.preventDefault();
              else event.returnValue = false;
            if(event.stopPropagation) event.stopPropagation();
            if(event.cancelBubble) event.cancelBubble = true;
          }
        }
      }
	}
  };

  // unset modifier keys on keyup
  function clearModifier(event){
    var key = event.keyCode, k;
    if(key == 93 || key == 224) key = 91;
    if(key in _mods) {
      _mods[key] = false;
      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
    }
  };

  // parse and assign shortcut
  function assignKey(key, scope, method){
    var keys, mods, i, mi;
    if (method === undefined) {
      method = scope;
      scope = 'all';
    }
    key = key.replace(/\s/g,'');
    keys = key.split(',');

    if((keys[keys.length-1])=='')
      keys[keys.length-2] += ',';
    // for each shortcut
    for (i = 0; i < keys.length; i++) {
      // set modifier keys if any
      mods = [];
      key = keys[i].split('+');
      if(key.length > 1){
        mods = key.slice(0,key.length-1);
        for (mi = 0; mi < mods.length; mi++)
          mods[mi] = _MODIFIERS[mods[mi]];
        key = [key[key.length-1]];
      }
      // convert to keycode and...
      key = key[0]
      key = _MAP[key] || key.toUpperCase().charCodeAt(0);
      // ...store handler
      if (!(key in _handlers)) _handlers[key] = [];
      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
    }
  };

  // initialize key.<modifier> to false
  for(k in _MODIFIERS) assignKey[k] = false;

  // set current scope (default 'all')
  function setScope(scope){ _scope = scope || 'all' };

  // cross-browser events
  function addEvent(object, event, method) {
    if (object.addEventListener)
      object.addEventListener(event, method, false);
    else if(object.attachEvent)
      object.attachEvent('on'+event, function(){ method(window.event) });
  };

  // set the handlers globally on document
  addEvent(document, 'keydown', dispatch);
  addEvent(document, 'keyup', clearModifier);

  // set window.key and window.key.setScope
  global.key = assignKey;
  global.key.setScope = setScope;

  if(typeof module !== 'undefined') module.exports = global.key;

})(this);

},{}],79:[function(require,module,exports){
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

},{}]},{},[18])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vX3NoaW1zLmpzIiwiL2hvbWUvZGFtby8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjIwL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL19zdHJlYW1fZHVwbGV4LmpzIiwiL2hvbWUvZGFtby8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjIwL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL19zdHJlYW1fcGFzc3Rocm91Z2guanMiLCIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vX3N0cmVhbV9yZWFkYWJsZS5qcyIsIi9ob21lL2RhbW8vLmJhc2hpbmF0ZS9pbnN0YWxsL25vZGUvMC4xMC4yMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9fc3RyZWFtX3RyYW5zZm9ybS5qcyIsIi9ob21lL2RhbW8vLmJhc2hpbmF0ZS9pbnN0YWxsL25vZGUvMC4xMC4yMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9fc3RyZWFtX3dyaXRhYmxlLmpzIiwiL2hvbWUvZGFtby8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjIwL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL2Fzc2VydC5qcyIsIi9ob21lL2RhbW8vLmJhc2hpbmF0ZS9pbnN0YWxsL25vZGUvMC4xMC4yMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi9ldmVudHMuanMiLCIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vZnMuanMiLCIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL2J1aWx0aW4vc3RyZWFtLmpzIiwiL2hvbWUvZGFtby8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjIwL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL3N0cmluZ19kZWNvZGVyLmpzIiwiL2hvbWUvZGFtby8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjIwL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9idWlsdGluL3RpbWVycy5qcyIsIi9ob21lL2RhbW8vLmJhc2hpbmF0ZS9pbnN0YWxsL25vZGUvMC4xMC4yMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvYnVpbHRpbi91dGlsLmpzIiwiL2hvbWUvZGFtby8uYmFzaGluYXRlL2luc3RhbGwvbm9kZS8wLjEwLjIwL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1idWlsdGlucy9ub2RlX21vZHVsZXMvYnVmZmVyLWJyb3dzZXJpZnkvYnVmZmVyX2llZWU3NTQuanMiLCIvaG9tZS9kYW1vLy5iYXNoaW5hdGUvaW5zdGFsbC9ub2RlLzAuMTAuMjAvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLWJ1aWx0aW5zL25vZGVfbW9kdWxlcy9idWZmZXItYnJvd3NlcmlmeS9pbmRleC5qcyIsIi9ob21lL2RhbW8vLmJhc2hpbmF0ZS9pbnN0YWxsL25vZGUvMC4xMC4yMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItYnVpbHRpbnMvbm9kZV9tb2R1bGVzL2J1ZmZlci1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIi9ob21lL2RhbW8vLmJhc2hpbmF0ZS9pbnN0YWxsL25vZGUvMC4xMC4yMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9pbmRleC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9pbmRleC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvY2xhc3N0d2Vhay9pbmRleC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvY3JlbC9jcmVsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvMWMuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9hY3Rpb25zY3JpcHQuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9hcGFjaGUuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9hcHBsZXNjcmlwdC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2F2cmFzbS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2F4YXB0YS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2Jhc2guanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9icmFpbmZ1Y2suanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jbG9qdXJlLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvY21ha2UuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jb2ZmZWVzY3JpcHQuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jcHAuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9jcy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2Nzcy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2QuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kZWxwaGkuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9kaWZmLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZGphbmdvLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZG9zLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZXJsYW5nLXJlcGwuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9lcmxhbmcuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9nbHNsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvZ28uanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9oYXNrZWxsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaGlnaGxpZ2h0LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvaHR0cC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2luaS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2phdmEuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9qYXZhc2NyaXB0LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvanNvbi5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL2xpc3AuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9sdWEuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9tYXJrZG93bi5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL21hdGxhYi5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL21lbC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL25naW54LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvb2JqZWN0aXZlYy5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3BhcnNlcjMuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9wZXJsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcGhwLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcHJvZmlsZS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3B5dGhvbi5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3IuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9yaWIuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9yc2wuanMiLCIvaG9tZS9kYW1vL2NvZGUvRGFtb25PZWhsbWFuL3RhbGstaG9vZGllL25vZGVfbW9kdWxlcy9kZWNrZXIvbm9kZV9tb2R1bGVzL2hpZ2hsaWdodC5qcy9ydWJ5LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvcnVzdC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3NjYWxhLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc21hbGx0YWxrLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvc3FsLmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvdGV4LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvdmFsYS5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3Zic2NyaXB0LmpzIiwiL2hvbWUvZGFtby9jb2RlL0RhbW9uT2VobG1hbi90YWxrLWhvb2RpZS9ub2RlX21vZHVsZXMvZGVja2VyL25vZGVfbW9kdWxlcy9oaWdobGlnaHQuanMvdmhkbC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaGlnaGxpZ2h0LmpzL3htbC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvaW5zZXJ0LWNzcy9pbmRleC5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMva2V5bWFzdGVyL2tleW1hc3Rlci5qcyIsIi9ob21lL2RhbW8vY29kZS9EYW1vbk9laGxtYW4vdGFsay1ob29kaWUvbm9kZV9tb2R1bGVzL2RlY2tlci9ub2RlX21vZHVsZXMvbWFya2VkL2xpYi9tYXJrZWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2NUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcG1DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcG9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXG4vL1xuLy8gVGhlIHNoaW1zIGluIHRoaXMgZmlsZSBhcmUgbm90IGZ1bGx5IGltcGxlbWVudGVkIHNoaW1zIGZvciB0aGUgRVM1XG4vLyBmZWF0dXJlcywgYnV0IGRvIHdvcmsgZm9yIHRoZSBwYXJ0aWN1bGFyIHVzZWNhc2VzIHRoZXJlIGlzIGluXG4vLyB0aGUgb3RoZXIgbW9kdWxlcy5cbi8vXG5cbnZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vLyBBcnJheS5pc0FycmF5IGlzIHN1cHBvcnRlZCBpbiBJRTlcbmZ1bmN0aW9uIGlzQXJyYXkoeHMpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gdHlwZW9mIEFycmF5LmlzQXJyYXkgPT09ICdmdW5jdGlvbicgPyBBcnJheS5pc0FycmF5IDogaXNBcnJheTtcblxuLy8gQXJyYXkucHJvdG90eXBlLmluZGV4T2YgaXMgc3VwcG9ydGVkIGluIElFOVxuZXhwb3J0cy5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZih4cywgeCkge1xuICBpZiAoeHMuaW5kZXhPZikgcmV0dXJuIHhzLmluZGV4T2YoeCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeCA9PT0geHNbaV0pIHJldHVybiBpO1xuICB9XG4gIHJldHVybiAtMTtcbn07XG5cbi8vIEFycmF5LnByb3RvdHlwZS5maWx0ZXIgaXMgc3VwcG9ydGVkIGluIElFOVxuZXhwb3J0cy5maWx0ZXIgPSBmdW5jdGlvbiBmaWx0ZXIoeHMsIGZuKSB7XG4gIGlmICh4cy5maWx0ZXIpIHJldHVybiB4cy5maWx0ZXIoZm4pO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoZm4oeHNbaV0sIGksIHhzKSkgcmVzLnB1c2goeHNbaV0pO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuXG4vLyBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCBpcyBzdXBwb3J0ZWQgaW4gSUU5XG5leHBvcnRzLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKHhzLCBmbiwgc2VsZikge1xuICBpZiAoeHMuZm9yRWFjaCkgcmV0dXJuIHhzLmZvckVhY2goZm4sIHNlbGYpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm4uY2FsbChzZWxmLCB4c1tpXSwgaSwgeHMpO1xuICB9XG59O1xuXG4vLyBBcnJheS5wcm90b3R5cGUubWFwIGlzIHN1cHBvcnRlZCBpbiBJRTlcbmV4cG9ydHMubWFwID0gZnVuY3Rpb24gbWFwKHhzLCBmbikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGZuKTtcbiAgdmFyIG91dCA9IG5ldyBBcnJheSh4cy5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHhzLmxlbmd0aDsgaSsrKSB7XG4gICAgb3V0W2ldID0gZm4oeHNbaV0sIGksIHhzKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuLy8gQXJyYXkucHJvdG90eXBlLnJlZHVjZSBpcyBzdXBwb3J0ZWQgaW4gSUU5XG5leHBvcnRzLnJlZHVjZSA9IGZ1bmN0aW9uIHJlZHVjZShhcnJheSwgY2FsbGJhY2ssIG9wdF9pbml0aWFsVmFsdWUpIHtcbiAgaWYgKGFycmF5LnJlZHVjZSkgcmV0dXJuIGFycmF5LnJlZHVjZShjYWxsYmFjaywgb3B0X2luaXRpYWxWYWx1ZSk7XG4gIHZhciB2YWx1ZSwgaXNWYWx1ZVNldCA9IGZhbHNlO1xuXG4gIGlmICgyIDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHZhbHVlID0gb3B0X2luaXRpYWxWYWx1ZTtcbiAgICBpc1ZhbHVlU2V0ID0gdHJ1ZTtcbiAgfVxuICBmb3IgKHZhciBpID0gMCwgbCA9IGFycmF5Lmxlbmd0aDsgbCA+IGk7ICsraSkge1xuICAgIGlmIChhcnJheS5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgaWYgKGlzVmFsdWVTZXQpIHtcbiAgICAgICAgdmFsdWUgPSBjYWxsYmFjayh2YWx1ZSwgYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGFycmF5W2ldO1xuICAgICAgICBpc1ZhbHVlU2V0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG5pZiAoJ2FiJy5zdWJzdHIoLTEpICE9PSAnYicpIHtcbiAgZXhwb3J0cy5zdWJzdHIgPSBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuZ3RoKSB7XG4gICAgLy8gZGlkIHdlIGdldCBhIG5lZ2F0aXZlIHN0YXJ0LCBjYWxjdWxhdGUgaG93IG11Y2ggaXQgaXMgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmdcbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcblxuICAgIC8vIGNhbGwgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uXG4gICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbmd0aCk7XG4gIH07XG59IGVsc2Uge1xuICBleHBvcnRzLnN1YnN0ciA9IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW5ndGgpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuZ3RoKTtcbiAgfTtcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS50cmltIGlzIHN1cHBvcnRlZCBpbiBJRTlcbmV4cG9ydHMudHJpbSA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKTtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59O1xuXG4vLyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBpcyBzdXBwb3J0ZWQgaW4gSUU5XG5leHBvcnRzLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgdmFyIGZuID0gYXJncy5zaGlmdCgpO1xuICBpZiAoZm4uYmluZCkgcmV0dXJuIGZuLmJpbmQuYXBwbHkoZm4sIGFyZ3MpO1xuICB2YXIgc2VsZiA9IGFyZ3Muc2hpZnQoKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBmbi5hcHBseShzZWxmLCBhcmdzLmNvbmNhdChbQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKV0pKTtcbiAgfTtcbn07XG5cbi8vIE9iamVjdC5jcmVhdGUgaXMgc3VwcG9ydGVkIGluIElFOVxuZnVuY3Rpb24gY3JlYXRlKHByb3RvdHlwZSwgcHJvcGVydGllcykge1xuICB2YXIgb2JqZWN0O1xuICBpZiAocHJvdG90eXBlID09PSBudWxsKSB7XG4gICAgb2JqZWN0ID0geyAnX19wcm90b19fJyA6IG51bGwgfTtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIHByb3RvdHlwZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICd0eXBlb2YgcHJvdG90eXBlWycgKyAodHlwZW9mIHByb3RvdHlwZSkgKyAnXSAhPSBcXCdvYmplY3RcXCcnXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgVHlwZSA9IGZ1bmN0aW9uICgpIHt9O1xuICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIG9iamVjdCA9IG5ldyBUeXBlKCk7XG4gICAgb2JqZWN0Ll9fcHJvdG9fXyA9IHByb3RvdHlwZTtcbiAgfVxuICBpZiAodHlwZW9mIHByb3BlcnRpZXMgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMob2JqZWN0LCBwcm9wZXJ0aWVzKTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuZXhwb3J0cy5jcmVhdGUgPSB0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5jcmVhdGUgOiBjcmVhdGU7XG5cbi8vIE9iamVjdC5rZXlzIGFuZCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyBpcyBzdXBwb3J0ZWQgaW4gSUU5IGhvd2V2ZXJcbi8vIHRoZXkgZG8gc2hvdyBhIGRlc2NyaXB0aW9uIGFuZCBudW1iZXIgcHJvcGVydHkgb24gRXJyb3Igb2JqZWN0c1xuZnVuY3Rpb24gbm90T2JqZWN0KG9iamVjdCkge1xuICByZXR1cm4gKCh0eXBlb2Ygb2JqZWN0ICE9IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9iamVjdCAhPSBcImZ1bmN0aW9uXCIpIHx8IG9iamVjdCA9PT0gbnVsbCk7XG59XG5cbmZ1bmN0aW9uIGtleXNTaGltKG9iamVjdCkge1xuICBpZiAobm90T2JqZWN0KG9iamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmtleXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIgbmFtZSBpbiBvYmplY3QpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIG5hbWUpKSB7XG4gICAgICByZXN1bHQucHVzaChuYW1lKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gZ2V0T3duUHJvcGVydHlOYW1lcyBpcyBhbG1vc3QgdGhlIHNhbWUgYXMgT2JqZWN0LmtleXMgb25lIGtleSBmZWF0dXJlXG4vLyAgaXMgdGhhdCBpdCByZXR1cm5zIGhpZGRlbiBwcm9wZXJ0aWVzLCBzaW5jZSB0aGF0IGNhbid0IGJlIGltcGxlbWVudGVkLFxuLy8gIHRoaXMgZmVhdHVyZSBnZXRzIHJlZHVjZWQgc28gaXQganVzdCBzaG93cyB0aGUgbGVuZ3RoIHByb3BlcnR5IG9uIGFycmF5c1xuZnVuY3Rpb24gcHJvcGVydHlTaGltKG9iamVjdCkge1xuICBpZiAobm90T2JqZWN0KG9iamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgY2FsbGVkIG9uIGEgbm9uLW9iamVjdFwiKTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBrZXlzU2hpbShvYmplY3QpO1xuICBpZiAoZXhwb3J0cy5pc0FycmF5KG9iamVjdCkgJiYgZXhwb3J0cy5pbmRleE9mKG9iamVjdCwgJ2xlbmd0aCcpID09PSAtMSkge1xuICAgIHJlc3VsdC5wdXNoKCdsZW5ndGgnKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG52YXIga2V5cyA9IHR5cGVvZiBPYmplY3Qua2V5cyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5rZXlzIDoga2V5c1NoaW07XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyA9PT0gJ2Z1bmN0aW9uJyA/XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIDogcHJvcGVydHlTaGltO1xuXG5pZiAobmV3IEVycm9yKCkuaGFzT3duUHJvcGVydHkoJ2Rlc2NyaXB0aW9uJykpIHtcbiAgdmFyIEVSUk9SX1BST1BFUlRZX0ZJTFRFUiA9IGZ1bmN0aW9uIChvYmosIGFycmF5KSB7XG4gICAgaWYgKHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRXJyb3JdJykge1xuICAgICAgYXJyYXkgPSBleHBvcnRzLmZpbHRlcihhcnJheSwgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5hbWUgIT09ICdkZXNjcmlwdGlvbicgJiYgbmFtZSAhPT0gJ251bWJlcicgJiYgbmFtZSAhPT0gJ21lc3NhZ2UnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnJheTtcbiAgfTtcblxuICBleHBvcnRzLmtleXMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIEVSUk9SX1BST1BFUlRZX0ZJTFRFUihvYmplY3QsIGtleXMob2JqZWN0KSk7XG4gIH07XG4gIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gRVJST1JfUFJPUEVSVFlfRklMVEVSKG9iamVjdCwgZ2V0T3duUHJvcGVydHlOYW1lcyhvYmplY3QpKTtcbiAgfTtcbn0gZWxzZSB7XG4gIGV4cG9ydHMua2V5cyA9IGtleXM7XG4gIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlOYW1lcyA9IGdldE93blByb3BlcnR5TmFtZXM7XG59XG5cbi8vIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgLSBzdXBwb3J0ZWQgaW4gSUU4IGJ1dCBvbmx5IG9uIGRvbSBlbGVtZW50c1xuZnVuY3Rpb24gdmFsdWVPYmplY3QodmFsdWUsIGtleSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWVba2V5XSB9O1xufVxuXG5pZiAodHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgdHJ5IHtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHsnYSc6IDF9LCAnYScpO1xuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElFOCBkb20gZWxlbWVudCBpc3N1ZSAtIHVzZSBhIHRyeSBjYXRjaCBhbmQgZGVmYXVsdCB0byB2YWx1ZU9iamVjdFxuICAgIGV4cG9ydHMuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gdmFsdWVPYmplY3QodmFsdWUsIGtleSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufSBlbHNlIHtcbiAgZXhwb3J0cy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSB2YWx1ZU9iamVjdDtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBhIGR1cGxleCBzdHJlYW0gaXMganVzdCBhIHN0cmVhbSB0aGF0IGlzIGJvdGggcmVhZGFibGUgYW5kIHdyaXRhYmxlLlxuLy8gU2luY2UgSlMgZG9lc24ndCBoYXZlIG11bHRpcGxlIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UsIHRoaXMgY2xhc3Ncbi8vIHByb3RvdHlwYWxseSBpbmhlcml0cyBmcm9tIFJlYWRhYmxlLCBhbmQgdGhlbiBwYXJhc2l0aWNhbGx5IGZyb21cbi8vIFdyaXRhYmxlLlxuXG5tb2R1bGUuZXhwb3J0cyA9IER1cGxleDtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHNoaW1zID0gcmVxdWlyZSgnX3NoaW1zJyk7XG52YXIgdGltZXJzID0gcmVxdWlyZSgndGltZXJzJyk7XG52YXIgUmVhZGFibGUgPSByZXF1aXJlKCdfc3RyZWFtX3JlYWRhYmxlJyk7XG52YXIgV3JpdGFibGUgPSByZXF1aXJlKCdfc3RyZWFtX3dyaXRhYmxlJyk7XG5cbnV0aWwuaW5oZXJpdHMoRHVwbGV4LCBSZWFkYWJsZSk7XG5cbnNoaW1zLmZvckVhY2goc2hpbXMua2V5cyhXcml0YWJsZS5wcm90b3R5cGUpLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgaWYgKCFEdXBsZXgucHJvdG90eXBlW21ldGhvZF0pXG4gICAgRHVwbGV4LnByb3RvdHlwZVttZXRob2RdID0gV3JpdGFibGUucHJvdG90eXBlW21ldGhvZF07XG59KTtcblxuZnVuY3Rpb24gRHVwbGV4KG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIER1cGxleCkpXG4gICAgcmV0dXJuIG5ldyBEdXBsZXgob3B0aW9ucyk7XG5cbiAgUmVhZGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgV3JpdGFibGUuY2FsbCh0aGlzLCBvcHRpb25zKTtcblxuICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRhYmxlID09PSBmYWxzZSlcbiAgICB0aGlzLnJlYWRhYmxlID0gZmFsc2U7XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy53cml0YWJsZSA9PT0gZmFsc2UpXG4gICAgdGhpcy53cml0YWJsZSA9IGZhbHNlO1xuXG4gIHRoaXMuYWxsb3dIYWxmT3BlbiA9IHRydWU7XG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYWxsb3dIYWxmT3BlbiA9PT0gZmFsc2UpXG4gICAgdGhpcy5hbGxvd0hhbGZPcGVuID0gZmFsc2U7XG5cbiAgdGhpcy5vbmNlKCdlbmQnLCBvbmVuZCk7XG59XG5cbi8vIHRoZSBuby1oYWxmLW9wZW4gZW5mb3JjZXJcbmZ1bmN0aW9uIG9uZW5kKCkge1xuICAvLyBpZiB3ZSBhbGxvdyBoYWxmLW9wZW4gc3RhdGUsIG9yIGlmIHRoZSB3cml0YWJsZSBzaWRlIGVuZGVkLFxuICAvLyB0aGVuIHdlJ3JlIG9rLlxuICBpZiAodGhpcy5hbGxvd0hhbGZPcGVuIHx8IHRoaXMuX3dyaXRhYmxlU3RhdGUuZW5kZWQpXG4gICAgcmV0dXJuO1xuXG4gIC8vIG5vIG1vcmUgZGF0YSBjYW4gYmUgd3JpdHRlbi5cbiAgLy8gQnV0IGFsbG93IG1vcmUgd3JpdGVzIHRvIGhhcHBlbiBpbiB0aGlzIHRpY2suXG4gIHRpbWVycy5zZXRJbW1lZGlhdGUoc2hpbXMuYmluZCh0aGlzLmVuZCwgdGhpcykpO1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIGEgcGFzc3Rocm91Z2ggc3RyZWFtLlxuLy8gYmFzaWNhbGx5IGp1c3QgdGhlIG1vc3QgbWluaW1hbCBzb3J0IG9mIFRyYW5zZm9ybSBzdHJlYW0uXG4vLyBFdmVyeSB3cml0dGVuIGNodW5rIGdldHMgb3V0cHV0IGFzLWlzLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhc3NUaHJvdWdoO1xuXG52YXIgVHJhbnNmb3JtID0gcmVxdWlyZSgnX3N0cmVhbV90cmFuc2Zvcm0nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudXRpbC5pbmhlcml0cyhQYXNzVGhyb3VnaCwgVHJhbnNmb3JtKTtcblxuZnVuY3Rpb24gUGFzc1Rocm91Z2gob3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUGFzc1Rocm91Z2gpKVxuICAgIHJldHVybiBuZXcgUGFzc1Rocm91Z2gob3B0aW9ucyk7XG5cbiAgVHJhbnNmb3JtLmNhbGwodGhpcywgb3B0aW9ucyk7XG59XG5cblBhc3NUaHJvdWdoLnByb3RvdHlwZS5fdHJhbnNmb3JtID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihudWxsLCBjaHVuayk7XG59O1xuIiwidmFyIHByb2Nlc3M9cmVxdWlyZShcIl9fYnJvd3NlcmlmeV9wcm9jZXNzXCIpOy8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRhYmxlO1xuUmVhZGFibGUuUmVhZGFibGVTdGF0ZSA9IFJlYWRhYmxlU3RhdGU7XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciBzaGltcyA9IHJlcXVpcmUoJ19zaGltcycpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpLkJ1ZmZlcjtcbnZhciB0aW1lcnMgPSByZXF1aXJlKCd0aW1lcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIFN0cmluZ0RlY29kZXI7XG5cbnV0aWwuaW5oZXJpdHMoUmVhZGFibGUsIFN0cmVhbSk7XG5cbmZ1bmN0aW9uIFJlYWRhYmxlU3RhdGUob3B0aW9ucywgc3RyZWFtKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIHRoZSBwb2ludCBhdCB3aGljaCBpdCBzdG9wcyBjYWxsaW5nIF9yZWFkKCkgdG8gZmlsbCB0aGUgYnVmZmVyXG4gIC8vIE5vdGU6IDAgaXMgYSB2YWxpZCB2YWx1ZSwgbWVhbnMgXCJkb24ndCBjYWxsIF9yZWFkIHByZWVtcHRpdmVseSBldmVyXCJcbiAgdmFyIGh3bSA9IG9wdGlvbnMuaGlnaFdhdGVyTWFyaztcbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gKGh3bSB8fCBod20gPT09IDApID8gaHdtIDogMTYgKiAxMDI0O1xuXG4gIC8vIGNhc3QgdG8gaW50cy5cbiAgdGhpcy5oaWdoV2F0ZXJNYXJrID0gfn50aGlzLmhpZ2hXYXRlck1hcms7XG5cbiAgdGhpcy5idWZmZXIgPSBbXTtcbiAgdGhpcy5sZW5ndGggPSAwO1xuICB0aGlzLnBpcGVzID0gbnVsbDtcbiAgdGhpcy5waXBlc0NvdW50ID0gMDtcbiAgdGhpcy5mbG93aW5nID0gZmFsc2U7XG4gIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgdGhpcy5lbmRFbWl0dGVkID0gZmFsc2U7XG4gIHRoaXMucmVhZGluZyA9IGZhbHNlO1xuXG4gIC8vIEluIHN0cmVhbXMgdGhhdCBuZXZlciBoYXZlIGFueSBkYXRhLCBhbmQgZG8gcHVzaChudWxsKSByaWdodCBhd2F5LFxuICAvLyB0aGUgY29uc3VtZXIgY2FuIG1pc3MgdGhlICdlbmQnIGV2ZW50IGlmIHRoZXkgZG8gc29tZSBJL08gYmVmb3JlXG4gIC8vIGNvbnN1bWluZyB0aGUgc3RyZWFtLiAgU28sIHdlIGRvbid0IGVtaXQoJ2VuZCcpIHVudGlsIHNvbWUgcmVhZGluZ1xuICAvLyBoYXBwZW5zLlxuICB0aGlzLmNhbGxlZFJlYWQgPSBmYWxzZTtcblxuICAvLyBhIGZsYWcgdG8gYmUgYWJsZSB0byB0ZWxsIGlmIHRoZSBvbndyaXRlIGNiIGlzIGNhbGxlZCBpbW1lZGlhdGVseSxcbiAgLy8gb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjdWFzZSBhbnlcbiAgLy8gYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3Qgd3JpdGUgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyB3aGVuZXZlciB3ZSByZXR1cm4gbnVsbCwgdGhlbiB3ZSBzZXQgYSBmbGFnIHRvIHNheVxuICAvLyB0aGF0IHdlJ3JlIGF3YWl0aW5nIGEgJ3JlYWRhYmxlJyBldmVudCBlbWlzc2lvbi5cbiAgdGhpcy5uZWVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcbiAgdGhpcy5yZWFkYWJsZUxpc3RlbmluZyA9IGZhbHNlO1xuXG5cbiAgLy8gb2JqZWN0IHN0cmVhbSBmbGFnLiBVc2VkIHRvIG1ha2UgcmVhZChuKSBpZ25vcmUgbiBhbmQgdG9cbiAgLy8gbWFrZSBhbGwgdGhlIGJ1ZmZlciBtZXJnaW5nIGFuZCBsZW5ndGggY2hlY2tzIGdvIGF3YXlcbiAgdGhpcy5vYmplY3RNb2RlID0gISFvcHRpb25zLm9iamVjdE1vZGU7XG5cbiAgLy8gQ3J5cHRvIGlzIGtpbmQgb2Ygb2xkIGFuZCBjcnVzdHkuICBIaXN0b3JpY2FsbHksIGl0cyBkZWZhdWx0IHN0cmluZ1xuICAvLyBlbmNvZGluZyBpcyAnYmluYXJ5JyBzbyB3ZSBoYXZlIHRvIG1ha2UgdGhpcyBjb25maWd1cmFibGUuXG4gIC8vIEV2ZXJ5dGhpbmcgZWxzZSBpbiB0aGUgdW5pdmVyc2UgdXNlcyAndXRmOCcsIHRob3VnaC5cbiAgdGhpcy5kZWZhdWx0RW5jb2RpbmcgPSBvcHRpb25zLmRlZmF1bHRFbmNvZGluZyB8fCAndXRmOCc7XG5cbiAgLy8gd2hlbiBwaXBpbmcsIHdlIG9ubHkgY2FyZSBhYm91dCAncmVhZGFibGUnIGV2ZW50cyB0aGF0IGhhcHBlblxuICAvLyBhZnRlciByZWFkKClpbmcgYWxsIHRoZSBieXRlcyBhbmQgbm90IGdldHRpbmcgYW55IHB1c2hiYWNrLlxuICB0aGlzLnJhbk91dCA9IGZhbHNlO1xuXG4gIC8vIHRoZSBudW1iZXIgb2Ygd3JpdGVycyB0aGF0IGFyZSBhd2FpdGluZyBhIGRyYWluIGV2ZW50IGluIC5waXBlKClzXG4gIHRoaXMuYXdhaXREcmFpbiA9IDA7XG5cbiAgLy8gaWYgdHJ1ZSwgYSBtYXliZVJlYWRNb3JlIGhhcyBiZWVuIHNjaGVkdWxlZFxuICB0aGlzLnJlYWRpbmdNb3JlID0gZmFsc2U7XG5cbiAgdGhpcy5kZWNvZGVyID0gbnVsbDtcbiAgdGhpcy5lbmNvZGluZyA9IG51bGw7XG4gIGlmIChvcHRpb25zLmVuY29kaW5nKSB7XG4gICAgaWYgKCFTdHJpbmdEZWNvZGVyKVxuICAgICAgU3RyaW5nRGVjb2RlciA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyJykuU3RyaW5nRGVjb2RlcjtcbiAgICB0aGlzLmRlY29kZXIgPSBuZXcgU3RyaW5nRGVjb2RlcihvcHRpb25zLmVuY29kaW5nKTtcbiAgICB0aGlzLmVuY29kaW5nID0gb3B0aW9ucy5lbmNvZGluZztcbiAgfVxufVxuXG5mdW5jdGlvbiBSZWFkYWJsZShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZWFkYWJsZSkpXG4gICAgcmV0dXJuIG5ldyBSZWFkYWJsZShvcHRpb25zKTtcblxuICB0aGlzLl9yZWFkYWJsZVN0YXRlID0gbmV3IFJlYWRhYmxlU3RhdGUob3B0aW9ucywgdGhpcyk7XG5cbiAgLy8gbGVnYWN5XG4gIHRoaXMucmVhZGFibGUgPSB0cnVlO1xuXG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xufVxuXG4vLyBNYW51YWxseSBzaG92ZSBzb21ldGhpbmcgaW50byB0aGUgcmVhZCgpIGJ1ZmZlci5cbi8vIFRoaXMgcmV0dXJucyB0cnVlIGlmIHRoZSBoaWdoV2F0ZXJNYXJrIGhhcyBub3QgYmVlbiBoaXQgeWV0LFxuLy8gc2ltaWxhciB0byBob3cgV3JpdGFibGUud3JpdGUoKSByZXR1cm5zIHRydWUgaWYgeW91IHNob3VsZFxuLy8gd3JpdGUoKSBzb21lIG1vcmUuXG5SZWFkYWJsZS5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZykge1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIGlmICh0eXBlb2YgY2h1bmsgPT09ICdzdHJpbmcnICYmICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgZW5jb2RpbmcgPSBlbmNvZGluZyB8fCBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG4gICAgaWYgKGVuY29kaW5nICE9PSBzdGF0ZS5lbmNvZGluZykge1xuICAgICAgY2h1bmsgPSBuZXcgQnVmZmVyKGNodW5rLCBlbmNvZGluZyk7XG4gICAgICBlbmNvZGluZyA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGZhbHNlKTtcbn07XG5cbi8vIFVuc2hpZnQgc2hvdWxkICphbHdheXMqIGJlIHNvbWV0aGluZyBkaXJlY3RseSBvdXQgb2YgcmVhZCgpXG5SZWFkYWJsZS5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uKGNodW5rKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG4gIHJldHVybiByZWFkYWJsZUFkZENodW5rKHRoaXMsIHN0YXRlLCBjaHVuaywgJycsIHRydWUpO1xufTtcblxuZnVuY3Rpb24gcmVhZGFibGVBZGRDaHVuayhzdHJlYW0sIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGFkZFRvRnJvbnQpIHtcbiAgdmFyIGVyID0gY2h1bmtJbnZhbGlkKHN0YXRlLCBjaHVuayk7XG4gIGlmIChlcikge1xuICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgfSBlbHNlIGlmIChjaHVuayA9PT0gbnVsbCB8fCBjaHVuayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICAgIGlmICghc3RhdGUuZW5kZWQpXG4gICAgICBvbkVvZkNodW5rKHN0cmVhbSwgc3RhdGUpO1xuICB9IGVsc2UgaWYgKHN0YXRlLm9iamVjdE1vZGUgfHwgY2h1bmsgJiYgY2h1bmsubGVuZ3RoID4gMCkge1xuICAgIGlmIChzdGF0ZS5lbmRlZCAmJiAhYWRkVG9Gcm9udCkge1xuICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ3N0cmVhbS5wdXNoKCkgYWZ0ZXIgRU9GJyk7XG4gICAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlKTtcbiAgICB9IGVsc2UgaWYgKHN0YXRlLmVuZEVtaXR0ZWQgJiYgYWRkVG9Gcm9udCkge1xuICAgICAgdmFyIGUgPSBuZXcgRXJyb3IoJ3N0cmVhbS51bnNoaWZ0KCkgYWZ0ZXIgZW5kIGV2ZW50Jyk7XG4gICAgICBzdHJlYW0uZW1pdCgnZXJyb3InLCBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXRlLmRlY29kZXIgJiYgIWFkZFRvRnJvbnQgJiYgIWVuY29kaW5nKVxuICAgICAgICBjaHVuayA9IHN0YXRlLmRlY29kZXIud3JpdGUoY2h1bmspO1xuXG4gICAgICAvLyB1cGRhdGUgdGhlIGJ1ZmZlciBpbmZvLlxuICAgICAgc3RhdGUubGVuZ3RoICs9IHN0YXRlLm9iamVjdE1vZGUgPyAxIDogY2h1bmsubGVuZ3RoO1xuICAgICAgaWYgKGFkZFRvRnJvbnQpIHtcbiAgICAgICAgc3RhdGUuYnVmZmVyLnVuc2hpZnQoY2h1bmspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUucmVhZGluZyA9IGZhbHNlO1xuICAgICAgICBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGF0ZS5uZWVkUmVhZGFibGUpXG4gICAgICAgIGVtaXRSZWFkYWJsZShzdHJlYW0pO1xuXG4gICAgICBtYXliZVJlYWRNb3JlKHN0cmVhbSwgc3RhdGUpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghYWRkVG9Gcm9udCkge1xuICAgIHN0YXRlLnJlYWRpbmcgPSBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBuZWVkTW9yZURhdGEoc3RhdGUpO1xufVxuXG5cblxuLy8gaWYgaXQncyBwYXN0IHRoZSBoaWdoIHdhdGVyIG1hcmssIHdlIGNhbiBwdXNoIGluIHNvbWUgbW9yZS5cbi8vIEFsc28sIGlmIHdlIGhhdmUgbm8gZGF0YSB5ZXQsIHdlIGNhbiBzdGFuZCBzb21lXG4vLyBtb3JlIGJ5dGVzLiAgVGhpcyBpcyB0byB3b3JrIGFyb3VuZCBjYXNlcyB3aGVyZSBod209MCxcbi8vIHN1Y2ggYXMgdGhlIHJlcGwuICBBbHNvLCBpZiB0aGUgcHVzaCgpIHRyaWdnZXJlZCBhXG4vLyByZWFkYWJsZSBldmVudCwgYW5kIHRoZSB1c2VyIGNhbGxlZCByZWFkKGxhcmdlTnVtYmVyKSBzdWNoIHRoYXRcbi8vIG5lZWRSZWFkYWJsZSB3YXMgc2V0LCB0aGVuIHdlIG91Z2h0IHRvIHB1c2ggbW9yZSwgc28gdGhhdCBhbm90aGVyXG4vLyAncmVhZGFibGUnIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkLlxuZnVuY3Rpb24gbmVlZE1vcmVEYXRhKHN0YXRlKSB7XG4gIHJldHVybiAhc3RhdGUuZW5kZWQgJiZcbiAgICAgICAgIChzdGF0ZS5uZWVkUmVhZGFibGUgfHxcbiAgICAgICAgICBzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrIHx8XG4gICAgICAgICAgc3RhdGUubGVuZ3RoID09PSAwKTtcbn1cblxuLy8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG5SZWFkYWJsZS5wcm90b3R5cGUuc2V0RW5jb2RpbmcgPSBmdW5jdGlvbihlbmMpIHtcbiAgaWYgKCFTdHJpbmdEZWNvZGVyKVxuICAgIFN0cmluZ0RlY29kZXIgPSByZXF1aXJlKCdzdHJpbmdfZGVjb2RlcicpLlN0cmluZ0RlY29kZXI7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZGVjb2RlciA9IG5ldyBTdHJpbmdEZWNvZGVyKGVuYyk7XG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuZW5jb2RpbmcgPSBlbmM7XG59O1xuXG4vLyBEb24ndCByYWlzZSB0aGUgaHdtID4gMTI4TUJcbnZhciBNQVhfSFdNID0gMHg4MDAwMDA7XG5mdW5jdGlvbiByb3VuZFVwVG9OZXh0UG93ZXJPZjIobikge1xuICBpZiAobiA+PSBNQVhfSFdNKSB7XG4gICAgbiA9IE1BWF9IV007XG4gIH0gZWxzZSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGhpZ2hlc3QgcG93ZXIgb2YgMlxuICAgIG4tLTtcbiAgICBmb3IgKHZhciBwID0gMTsgcCA8IDMyOyBwIDw8PSAxKSBuIHw9IG4gPj4gcDtcbiAgICBuKys7XG4gIH1cbiAgcmV0dXJuIG47XG59XG5cbmZ1bmN0aW9uIGhvd011Y2hUb1JlYWQobiwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5lbmRlZClcbiAgICByZXR1cm4gMDtcblxuICBpZiAoc3RhdGUub2JqZWN0TW9kZSlcbiAgICByZXR1cm4gbiA9PT0gMCA/IDAgOiAxO1xuXG4gIGlmIChpc05hTihuKSB8fCBuID09PSBudWxsKSB7XG4gICAgLy8gb25seSBmbG93IG9uZSBidWZmZXIgYXQgYSB0aW1lXG4gICAgaWYgKHN0YXRlLmZsb3dpbmcgJiYgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIHJldHVybiBzdGF0ZS5idWZmZXJbMF0ubGVuZ3RoO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBzdGF0ZS5sZW5ndGg7XG4gIH1cblxuICBpZiAobiA8PSAwKVxuICAgIHJldHVybiAwO1xuXG4gIC8vIElmIHdlJ3JlIGFza2luZyBmb3IgbW9yZSB0aGFuIHRoZSB0YXJnZXQgYnVmZmVyIGxldmVsLFxuICAvLyB0aGVuIHJhaXNlIHRoZSB3YXRlciBtYXJrLiAgQnVtcCB1cCB0byB0aGUgbmV4dCBoaWdoZXN0XG4gIC8vIHBvd2VyIG9mIDIsIHRvIHByZXZlbnQgaW5jcmVhc2luZyBpdCBleGNlc3NpdmVseSBpbiB0aW55XG4gIC8vIGFtb3VudHMuXG4gIGlmIChuID4gc3RhdGUuaGlnaFdhdGVyTWFyaylcbiAgICBzdGF0ZS5oaWdoV2F0ZXJNYXJrID0gcm91bmRVcFRvTmV4dFBvd2VyT2YyKG4pO1xuXG4gIC8vIGRvbid0IGhhdmUgdGhhdCBtdWNoLiAgcmV0dXJuIG51bGwsIHVubGVzcyB3ZSd2ZSBlbmRlZC5cbiAgaWYgKG4gPiBzdGF0ZS5sZW5ndGgpIHtcbiAgICBpZiAoIXN0YXRlLmVuZGVkKSB7XG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gc3RhdGUubGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIG47XG59XG5cbi8vIHlvdSBjYW4gb3ZlcnJpZGUgZWl0aGVyIHRoaXMgbWV0aG9kLCBvciB0aGUgYXN5bmMgX3JlYWQobikgYmVsb3cuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uKG4pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgc3RhdGUuY2FsbGVkUmVhZCA9IHRydWU7XG4gIHZhciBuT3JpZyA9IG47XG5cbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuID4gMClcbiAgICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSBmYWxzZTtcblxuICAvLyBpZiB3ZSdyZSBkb2luZyByZWFkKDApIHRvIHRyaWdnZXIgYSByZWFkYWJsZSBldmVudCwgYnV0IHdlXG4gIC8vIGFscmVhZHkgaGF2ZSBhIGJ1bmNoIG9mIGRhdGEgaW4gdGhlIGJ1ZmZlciwgdGhlbiBqdXN0IHRyaWdnZXJcbiAgLy8gdGhlICdyZWFkYWJsZScgZXZlbnQgYW5kIG1vdmUgb24uXG4gIGlmIChuID09PSAwICYmXG4gICAgICBzdGF0ZS5uZWVkUmVhZGFibGUgJiZcbiAgICAgIChzdGF0ZS5sZW5ndGggPj0gc3RhdGUuaGlnaFdhdGVyTWFyayB8fCBzdGF0ZS5lbmRlZCkpIHtcbiAgICBlbWl0UmVhZGFibGUodGhpcyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBuID0gaG93TXVjaFRvUmVhZChuLCBzdGF0ZSk7XG5cbiAgLy8gaWYgd2UndmUgZW5kZWQsIGFuZCB3ZSdyZSBub3cgY2xlYXIsIHRoZW4gZmluaXNoIGl0IHVwLlxuICBpZiAobiA9PT0gMCAmJiBzdGF0ZS5lbmRlZCkge1xuICAgIGlmIChzdGF0ZS5sZW5ndGggPT09IDApXG4gICAgICBlbmRSZWFkYWJsZSh0aGlzKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFsbCB0aGUgYWN0dWFsIGNodW5rIGdlbmVyYXRpb24gbG9naWMgbmVlZHMgdG8gYmVcbiAgLy8gKmJlbG93KiB0aGUgY2FsbCB0byBfcmVhZC4gIFRoZSByZWFzb24gaXMgdGhhdCBpbiBjZXJ0YWluXG4gIC8vIHN5bnRoZXRpYyBzdHJlYW0gY2FzZXMsIHN1Y2ggYXMgcGFzc3Rocm91Z2ggc3RyZWFtcywgX3JlYWRcbiAgLy8gbWF5IGJlIGEgY29tcGxldGVseSBzeW5jaHJvbm91cyBvcGVyYXRpb24gd2hpY2ggbWF5IGNoYW5nZVxuICAvLyB0aGUgc3RhdGUgb2YgdGhlIHJlYWQgYnVmZmVyLCBwcm92aWRpbmcgZW5vdWdoIGRhdGEgd2hlblxuICAvLyBiZWZvcmUgdGhlcmUgd2FzICpub3QqIGVub3VnaC5cbiAgLy9cbiAgLy8gU28sIHRoZSBzdGVwcyBhcmU6XG4gIC8vIDEuIEZpZ3VyZSBvdXQgd2hhdCB0aGUgc3RhdGUgb2YgdGhpbmdzIHdpbGwgYmUgYWZ0ZXIgd2UgZG9cbiAgLy8gYSByZWFkIGZyb20gdGhlIGJ1ZmZlci5cbiAgLy9cbiAgLy8gMi4gSWYgdGhhdCByZXN1bHRpbmcgc3RhdGUgd2lsbCB0cmlnZ2VyIGEgX3JlYWQsIHRoZW4gY2FsbCBfcmVhZC5cbiAgLy8gTm90ZSB0aGF0IHRoaXMgbWF5IGJlIGFzeW5jaHJvbm91cywgb3Igc3luY2hyb25vdXMuICBZZXMsIGl0IGlzXG4gIC8vIGRlZXBseSB1Z2x5IHRvIHdyaXRlIEFQSXMgdGhpcyB3YXksIGJ1dCB0aGF0IHN0aWxsIGRvZXNuJ3QgbWVhblxuICAvLyB0aGF0IHRoZSBSZWFkYWJsZSBjbGFzcyBzaG91bGQgYmVoYXZlIGltcHJvcGVybHksIGFzIHN0cmVhbXMgYXJlXG4gIC8vIGRlc2lnbmVkIHRvIGJlIHN5bmMvYXN5bmMgYWdub3N0aWMuXG4gIC8vIFRha2Ugbm90ZSBpZiB0aGUgX3JlYWQgY2FsbCBpcyBzeW5jIG9yIGFzeW5jIChpZSwgaWYgdGhlIHJlYWQgY2FsbFxuICAvLyBoYXMgcmV0dXJuZWQgeWV0KSwgc28gdGhhdCB3ZSBrbm93IHdoZXRoZXIgb3Igbm90IGl0J3Mgc2FmZSB0byBlbWl0XG4gIC8vICdyZWFkYWJsZScgZXRjLlxuICAvL1xuICAvLyAzLiBBY3R1YWxseSBwdWxsIHRoZSByZXF1ZXN0ZWQgY2h1bmtzIG91dCBvZiB0aGUgYnVmZmVyIGFuZCByZXR1cm4uXG5cbiAgLy8gaWYgd2UgbmVlZCBhIHJlYWRhYmxlIGV2ZW50LCB0aGVuIHdlIG5lZWQgdG8gZG8gc29tZSByZWFkaW5nLlxuICB2YXIgZG9SZWFkID0gc3RhdGUubmVlZFJlYWRhYmxlO1xuXG4gIC8vIGlmIHdlIGN1cnJlbnRseSBoYXZlIGxlc3MgdGhhbiB0aGUgaGlnaFdhdGVyTWFyaywgdGhlbiBhbHNvIHJlYWQgc29tZVxuICBpZiAoc3RhdGUubGVuZ3RoIC0gbiA8PSBzdGF0ZS5oaWdoV2F0ZXJNYXJrKVxuICAgIGRvUmVhZCA9IHRydWU7XG5cbiAgLy8gaG93ZXZlciwgaWYgd2UndmUgZW5kZWQsIHRoZW4gdGhlcmUncyBubyBwb2ludCwgYW5kIGlmIHdlJ3JlIGFscmVhZHlcbiAgLy8gcmVhZGluZywgdGhlbiBpdCdzIHVubmVjZXNzYXJ5LlxuICBpZiAoc3RhdGUuZW5kZWQgfHwgc3RhdGUucmVhZGluZylcbiAgICBkb1JlYWQgPSBmYWxzZTtcblxuICBpZiAoZG9SZWFkKSB7XG4gICAgc3RhdGUucmVhZGluZyA9IHRydWU7XG4gICAgc3RhdGUuc3luYyA9IHRydWU7XG4gICAgLy8gaWYgdGhlIGxlbmd0aCBpcyBjdXJyZW50bHkgemVybywgdGhlbiB3ZSAqbmVlZCogYSByZWFkYWJsZSBldmVudC5cbiAgICBpZiAoc3RhdGUubGVuZ3RoID09PSAwKVxuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAvLyBjYWxsIGludGVybmFsIHJlYWQgbWV0aG9kXG4gICAgdGhpcy5fcmVhZChzdGF0ZS5oaWdoV2F0ZXJNYXJrKTtcbiAgICBzdGF0ZS5zeW5jID0gZmFsc2U7XG4gIH1cblxuICAvLyBJZiBfcmVhZCBjYWxsZWQgaXRzIGNhbGxiYWNrIHN5bmNocm9ub3VzbHksIHRoZW4gYHJlYWRpbmdgXG4gIC8vIHdpbGwgYmUgZmFsc2UsIGFuZCB3ZSBuZWVkIHRvIHJlLWV2YWx1YXRlIGhvdyBtdWNoIGRhdGEgd2VcbiAgLy8gY2FuIHJldHVybiB0byB0aGUgdXNlci5cbiAgaWYgKGRvUmVhZCAmJiAhc3RhdGUucmVhZGluZylcbiAgICBuID0gaG93TXVjaFRvUmVhZChuT3JpZywgc3RhdGUpO1xuXG4gIHZhciByZXQ7XG4gIGlmIChuID4gMClcbiAgICByZXQgPSBmcm9tTGlzdChuLCBzdGF0ZSk7XG4gIGVsc2VcbiAgICByZXQgPSBudWxsO1xuXG4gIGlmIChyZXQgPT09IG51bGwpIHtcbiAgICBzdGF0ZS5uZWVkUmVhZGFibGUgPSB0cnVlO1xuICAgIG4gPSAwO1xuICB9XG5cbiAgc3RhdGUubGVuZ3RoIC09IG47XG5cbiAgLy8gSWYgd2UgaGF2ZSBub3RoaW5nIGluIHRoZSBidWZmZXIsIHRoZW4gd2Ugd2FudCB0byBrbm93XG4gIC8vIGFzIHNvb24gYXMgd2UgKmRvKiBnZXQgc29tZXRoaW5nIGludG8gdGhlIGJ1ZmZlci5cbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiAhc3RhdGUuZW5kZWQpXG4gICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcblxuICAvLyBJZiB3ZSBoYXBwZW5lZCB0byByZWFkKCkgZXhhY3RseSB0aGUgcmVtYWluaW5nIGFtb3VudCBpbiB0aGVcbiAgLy8gYnVmZmVyLCBhbmQgdGhlIEVPRiBoYXMgYmVlbiBzZWVuIGF0IHRoaXMgcG9pbnQsIHRoZW4gbWFrZSBzdXJlXG4gIC8vIHRoYXQgd2UgZW1pdCAnZW5kJyBvbiB0aGUgdmVyeSBuZXh0IHRpY2suXG4gIGlmIChzdGF0ZS5lbmRlZCAmJiAhc3RhdGUuZW5kRW1pdHRlZCAmJiBzdGF0ZS5sZW5ndGggPT09IDApXG4gICAgZW5kUmVhZGFibGUodGhpcyk7XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGNodW5rSW52YWxpZChzdGF0ZSwgY2h1bmspIHtcbiAgdmFyIGVyID0gbnVsbDtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoY2h1bmspICYmXG4gICAgICAnc3RyaW5nJyAhPT0gdHlwZW9mIGNodW5rICYmXG4gICAgICBjaHVuayAhPT0gbnVsbCAmJlxuICAgICAgY2h1bmsgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgIXN0YXRlLm9iamVjdE1vZGUgJiZcbiAgICAgICFlcikge1xuICAgIGVyID0gbmV3IFR5cGVFcnJvcignSW52YWxpZCBub24tc3RyaW5nL2J1ZmZlciBjaHVuaycpO1xuICB9XG4gIHJldHVybiBlcjtcbn1cblxuXG5mdW5jdGlvbiBvbkVvZkNodW5rKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmRlY29kZXIgJiYgIXN0YXRlLmVuZGVkKSB7XG4gICAgdmFyIGNodW5rID0gc3RhdGUuZGVjb2Rlci5lbmQoKTtcbiAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKSB7XG4gICAgICBzdGF0ZS5idWZmZXIucHVzaChjaHVuayk7XG4gICAgICBzdGF0ZS5sZW5ndGggKz0gc3RhdGUub2JqZWN0TW9kZSA/IDEgOiBjaHVuay5sZW5ndGg7XG4gICAgfVxuICB9XG4gIHN0YXRlLmVuZGVkID0gdHJ1ZTtcblxuICAvLyBpZiB3ZSd2ZSBlbmRlZCBhbmQgd2UgaGF2ZSBzb21lIGRhdGEgbGVmdCwgdGhlbiBlbWl0XG4gIC8vICdyZWFkYWJsZScgbm93IHRvIG1ha2Ugc3VyZSBpdCBnZXRzIHBpY2tlZCB1cC5cbiAgaWYgKHN0YXRlLmxlbmd0aCA+IDApXG4gICAgZW1pdFJlYWRhYmxlKHN0cmVhbSk7XG4gIGVsc2VcbiAgICBlbmRSZWFkYWJsZShzdHJlYW0pO1xufVxuXG4vLyBEb24ndCBlbWl0IHJlYWRhYmxlIHJpZ2h0IGF3YXkgaW4gc3luYyBtb2RlLCBiZWNhdXNlIHRoaXMgY2FuIHRyaWdnZXJcbi8vIGFub3RoZXIgcmVhZCgpIGNhbGwgPT4gc3RhY2sgb3ZlcmZsb3cuICBUaGlzIHdheSwgaXQgbWlnaHQgdHJpZ2dlclxuLy8gYSBuZXh0VGljayByZWN1cnNpb24gd2FybmluZywgYnV0IHRoYXQncyBub3Qgc28gYmFkLlxuZnVuY3Rpb24gZW1pdFJlYWRhYmxlKHN0cmVhbSkge1xuICB2YXIgc3RhdGUgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG4gIHN0YXRlLm5lZWRSZWFkYWJsZSA9IGZhbHNlO1xuICBpZiAoc3RhdGUuZW1pdHRlZFJlYWRhYmxlKVxuICAgIHJldHVybjtcblxuICBzdGF0ZS5lbWl0dGVkUmVhZGFibGUgPSB0cnVlO1xuICBpZiAoc3RhdGUuc3luYylcbiAgICB0aW1lcnMuc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgZW1pdFJlYWRhYmxlXyhzdHJlYW0pO1xuICAgIH0pO1xuICBlbHNlXG4gICAgZW1pdFJlYWRhYmxlXyhzdHJlYW0pO1xufVxuXG5mdW5jdGlvbiBlbWl0UmVhZGFibGVfKHN0cmVhbSkge1xuICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbn1cblxuXG4vLyBhdCB0aGlzIHBvaW50LCB0aGUgdXNlciBoYXMgcHJlc3VtYWJseSBzZWVuIHRoZSAncmVhZGFibGUnIGV2ZW50LFxuLy8gYW5kIGNhbGxlZCByZWFkKCkgdG8gY29uc3VtZSBzb21lIGRhdGEuICB0aGF0IG1heSBoYXZlIHRyaWdnZXJlZFxuLy8gaW4gdHVybiBhbm90aGVyIF9yZWFkKG4pIGNhbGwsIGluIHdoaWNoIGNhc2UgcmVhZGluZyA9IHRydWUgaWZcbi8vIGl0J3MgaW4gcHJvZ3Jlc3MuXG4vLyBIb3dldmVyLCBpZiB3ZSdyZSBub3QgZW5kZWQsIG9yIHJlYWRpbmcsIGFuZCB0aGUgbGVuZ3RoIDwgaHdtLFxuLy8gdGhlbiBnbyBhaGVhZCBhbmQgdHJ5IHRvIHJlYWQgc29tZSBtb3JlIHByZWVtcHRpdmVseS5cbmZ1bmN0aW9uIG1heWJlUmVhZE1vcmUoc3RyZWFtLCBzdGF0ZSkge1xuICBpZiAoIXN0YXRlLnJlYWRpbmdNb3JlKSB7XG4gICAgc3RhdGUucmVhZGluZ01vcmUgPSB0cnVlO1xuICAgIHRpbWVycy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgICBtYXliZVJlYWRNb3JlXyhzdHJlYW0sIHN0YXRlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYXliZVJlYWRNb3JlXyhzdHJlYW0sIHN0YXRlKSB7XG4gIHZhciBsZW4gPSBzdGF0ZS5sZW5ndGg7XG4gIHdoaWxlICghc3RhdGUucmVhZGluZyAmJiAhc3RhdGUuZmxvd2luZyAmJiAhc3RhdGUuZW5kZWQgJiZcbiAgICAgICAgIHN0YXRlLmxlbmd0aCA8IHN0YXRlLmhpZ2hXYXRlck1hcmspIHtcbiAgICBzdHJlYW0ucmVhZCgwKTtcbiAgICBpZiAobGVuID09PSBzdGF0ZS5sZW5ndGgpXG4gICAgICAvLyBkaWRuJ3QgZ2V0IGFueSBkYXRhLCBzdG9wIHNwaW5uaW5nLlxuICAgICAgYnJlYWs7XG4gICAgZWxzZVxuICAgICAgbGVuID0gc3RhdGUubGVuZ3RoO1xuICB9XG4gIHN0YXRlLnJlYWRpbmdNb3JlID0gZmFsc2U7XG59XG5cbi8vIGFic3RyYWN0IG1ldGhvZC4gIHRvIGJlIG92ZXJyaWRkZW4gaW4gc3BlY2lmaWMgaW1wbGVtZW50YXRpb24gY2xhc3Nlcy5cbi8vIGNhbGwgY2IoZXIsIGRhdGEpIHdoZXJlIGRhdGEgaXMgPD0gbiBpbiBsZW5ndGguXG4vLyBmb3IgdmlydHVhbCAobm9uLXN0cmluZywgbm9uLWJ1ZmZlcikgc3RyZWFtcywgXCJsZW5ndGhcIiBpcyBzb21ld2hhdFxuLy8gYXJiaXRyYXJ5LCBhbmQgcGVyaGFwcyBub3QgdmVyeSBtZWFuaW5nZnVsLlxuUmVhZGFibGUucHJvdG90eXBlLl9yZWFkID0gZnVuY3Rpb24obikge1xuICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKSk7XG59O1xuXG5SZWFkYWJsZS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKGRlc3QsIHBpcGVPcHRzKSB7XG4gIHZhciBzcmMgPSB0aGlzO1xuICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuXG4gIHN3aXRjaCAoc3RhdGUucGlwZXNDb3VudCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHN0YXRlLnBpcGVzID0gZGVzdDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgMTpcbiAgICAgIHN0YXRlLnBpcGVzID0gW3N0YXRlLnBpcGVzLCBkZXN0XTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdGF0ZS5waXBlcy5wdXNoKGRlc3QpO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgc3RhdGUucGlwZXNDb3VudCArPSAxO1xuXG4gIHZhciBkb0VuZCA9ICghcGlwZU9wdHMgfHwgcGlwZU9wdHMuZW5kICE9PSBmYWxzZSkgJiZcbiAgICAgICAgICAgICAgZGVzdCAhPT0gcHJvY2Vzcy5zdGRvdXQgJiZcbiAgICAgICAgICAgICAgZGVzdCAhPT0gcHJvY2Vzcy5zdGRlcnI7XG5cbiAgdmFyIGVuZEZuID0gZG9FbmQgPyBvbmVuZCA6IGNsZWFudXA7XG4gIGlmIChzdGF0ZS5lbmRFbWl0dGVkKVxuICAgIHRpbWVycy5zZXRJbW1lZGlhdGUoZW5kRm4pO1xuICBlbHNlXG4gICAgc3JjLm9uY2UoJ2VuZCcsIGVuZEZuKTtcblxuICBkZXN0Lm9uKCd1bnBpcGUnLCBvbnVucGlwZSk7XG4gIGZ1bmN0aW9uIG9udW5waXBlKHJlYWRhYmxlKSB7XG4gICAgaWYgKHJlYWRhYmxlICE9PSBzcmMpIHJldHVybjtcbiAgICBjbGVhbnVwKCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbmVuZCgpIHtcbiAgICBkZXN0LmVuZCgpO1xuICB9XG5cbiAgLy8gd2hlbiB0aGUgZGVzdCBkcmFpbnMsIGl0IHJlZHVjZXMgdGhlIGF3YWl0RHJhaW4gY291bnRlclxuICAvLyBvbiB0aGUgc291cmNlLiAgVGhpcyB3b3VsZCBiZSBtb3JlIGVsZWdhbnQgd2l0aCBhIC5vbmNlKClcbiAgLy8gaGFuZGxlciBpbiBmbG93KCksIGJ1dCBhZGRpbmcgYW5kIHJlbW92aW5nIHJlcGVhdGVkbHkgaXNcbiAgLy8gdG9vIHNsb3cuXG4gIHZhciBvbmRyYWluID0gcGlwZU9uRHJhaW4oc3JjKTtcbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcblxuICBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIC8vIGNsZWFudXAgZXZlbnQgaGFuZGxlcnMgb25jZSB0aGUgcGlwZSBpcyBicm9rZW5cbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2ZpbmlzaCcsIG9uZmluaXNoKTtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdkcmFpbicsIG9uZHJhaW4pO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcigndW5waXBlJywgb251bnBpcGUpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25lbmQpO1xuICAgIHNyYy5yZW1vdmVMaXN0ZW5lcignZW5kJywgY2xlYW51cCk7XG5cbiAgICAvLyBpZiB0aGUgcmVhZGVyIGlzIHdhaXRpbmcgZm9yIGEgZHJhaW4gZXZlbnQgZnJvbSB0aGlzXG4gICAgLy8gc3BlY2lmaWMgd3JpdGVyLCB0aGVuIGl0IHdvdWxkIGNhdXNlIGl0IHRvIG5ldmVyIHN0YXJ0XG4gICAgLy8gZmxvd2luZyBhZ2Fpbi5cbiAgICAvLyBTbywgaWYgdGhpcyBpcyBhd2FpdGluZyBhIGRyYWluLCB0aGVuIHdlIGp1c3QgY2FsbCBpdCBub3cuXG4gICAgLy8gSWYgd2UgZG9uJ3Qga25vdywgdGhlbiBhc3N1bWUgdGhhdCB3ZSBhcmUgd2FpdGluZyBmb3Igb25lLlxuICAgIGlmICghZGVzdC5fd3JpdGFibGVTdGF0ZSB8fCBkZXN0Ll93cml0YWJsZVN0YXRlLm5lZWREcmFpbilcbiAgICAgIG9uZHJhaW4oKTtcbiAgfVxuXG4gIC8vIGlmIHRoZSBkZXN0IGhhcyBhbiBlcnJvciwgdGhlbiBzdG9wIHBpcGluZyBpbnRvIGl0LlxuICAvLyBob3dldmVyLCBkb24ndCBzdXBwcmVzcyB0aGUgdGhyb3dpbmcgYmVoYXZpb3IgZm9yIHRoaXMuXG4gIC8vIGNoZWNrIGZvciBsaXN0ZW5lcnMgYmVmb3JlIGVtaXQgcmVtb3ZlcyBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gIHZhciBlcnJMaXN0ZW5lcnMgPSBFRS5saXN0ZW5lckNvdW50KGRlc3QsICdlcnJvcicpO1xuICBmdW5jdGlvbiBvbmVycm9yKGVyKSB7XG4gICAgdW5waXBlKCk7XG4gICAgaWYgKGVyckxpc3RlbmVycyA9PT0gMCAmJiBFRS5saXN0ZW5lckNvdW50KGRlc3QsICdlcnJvcicpID09PSAwKVxuICAgICAgZGVzdC5lbWl0KCdlcnJvcicsIGVyKTtcbiAgfVxuICBkZXN0Lm9uY2UoJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgLy8gQm90aCBjbG9zZSBhbmQgZmluaXNoIHNob3VsZCB0cmlnZ2VyIHVucGlwZSwgYnV0IG9ubHkgb25jZS5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG4gICAgdW5waXBlKCk7XG4gIH1cbiAgZGVzdC5vbmNlKCdjbG9zZScsIG9uY2xvc2UpO1xuICBmdW5jdGlvbiBvbmZpbmlzaCgpIHtcbiAgICBkZXN0LnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuICAgIHVucGlwZSgpO1xuICB9XG4gIGRlc3Qub25jZSgnZmluaXNoJywgb25maW5pc2gpO1xuXG4gIGZ1bmN0aW9uIHVucGlwZSgpIHtcbiAgICBzcmMudW5waXBlKGRlc3QpO1xuICB9XG5cbiAgLy8gdGVsbCB0aGUgZGVzdCB0aGF0IGl0J3MgYmVpbmcgcGlwZWQgdG9cbiAgZGVzdC5lbWl0KCdwaXBlJywgc3JjKTtcblxuICAvLyBzdGFydCB0aGUgZmxvdyBpZiBpdCBoYXNuJ3QgYmVlbiBzdGFydGVkIGFscmVhZHkuXG4gIGlmICghc3RhdGUuZmxvd2luZykge1xuICAgIC8vIHRoZSBoYW5kbGVyIHRoYXQgd2FpdHMgZm9yIHJlYWRhYmxlIGV2ZW50cyBhZnRlciBhbGxcbiAgICAvLyB0aGUgZGF0YSBnZXRzIHN1Y2tlZCBvdXQgaW4gZmxvdy5cbiAgICAvLyBUaGlzIHdvdWxkIGJlIGVhc2llciB0byBmb2xsb3cgd2l0aCBhIC5vbmNlKCkgaGFuZGxlclxuICAgIC8vIGluIGZsb3coKSwgYnV0IHRoYXQgaXMgdG9vIHNsb3cuXG4gICAgdGhpcy5vbigncmVhZGFibGUnLCBwaXBlT25SZWFkYWJsZSk7XG5cbiAgICBzdGF0ZS5mbG93aW5nID0gdHJ1ZTtcbiAgICB0aW1lcnMuc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgZmxvdyhzcmMpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRlc3Q7XG59O1xuXG5mdW5jdGlvbiBwaXBlT25EcmFpbihzcmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZXN0ID0gdGhpcztcbiAgICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gICAgc3RhdGUuYXdhaXREcmFpbi0tO1xuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluID09PSAwKVxuICAgICAgZmxvdyhzcmMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBmbG93KHNyYykge1xuICB2YXIgc3RhdGUgPSBzcmMuX3JlYWRhYmxlU3RhdGU7XG4gIHZhciBjaHVuaztcbiAgc3RhdGUuYXdhaXREcmFpbiA9IDA7XG5cbiAgZnVuY3Rpb24gd3JpdGUoZGVzdCwgaSwgbGlzdCkge1xuICAgIHZhciB3cml0dGVuID0gZGVzdC53cml0ZShjaHVuayk7XG4gICAgaWYgKGZhbHNlID09PSB3cml0dGVuKSB7XG4gICAgICBzdGF0ZS5hd2FpdERyYWluKys7XG4gICAgfVxuICB9XG5cbiAgd2hpbGUgKHN0YXRlLnBpcGVzQ291bnQgJiYgbnVsbCAhPT0gKGNodW5rID0gc3JjLnJlYWQoKSkpIHtcblxuICAgIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKVxuICAgICAgd3JpdGUoc3RhdGUucGlwZXMsIDAsIG51bGwpO1xuICAgIGVsc2VcbiAgICAgIHNoaW1zLmZvckVhY2goc3RhdGUucGlwZXMsIHdyaXRlKTtcblxuICAgIHNyYy5lbWl0KCdkYXRhJywgY2h1bmspO1xuXG4gICAgLy8gaWYgYW55b25lIG5lZWRzIGEgZHJhaW4sIHRoZW4gd2UgaGF2ZSB0byB3YWl0IGZvciB0aGF0LlxuICAgIGlmIChzdGF0ZS5hd2FpdERyYWluID4gMClcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGlmIGV2ZXJ5IGRlc3RpbmF0aW9uIHdhcyB1bnBpcGVkLCBlaXRoZXIgYmVmb3JlIGVudGVyaW5nIHRoaXNcbiAgLy8gZnVuY3Rpb24sIG9yIGluIHRoZSB3aGlsZSBsb29wLCB0aGVuIHN0b3AgZmxvd2luZy5cbiAgLy9cbiAgLy8gTkI6IFRoaXMgaXMgYSBwcmV0dHkgcmFyZSBlZGdlIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAwKSB7XG4gICAgc3RhdGUuZmxvd2luZyA9IGZhbHNlO1xuXG4gICAgLy8gaWYgdGhlcmUgd2VyZSBkYXRhIGV2ZW50IGxpc3RlbmVycyBhZGRlZCwgdGhlbiBzd2l0Y2ggdG8gb2xkIG1vZGUuXG4gICAgaWYgKEVFLmxpc3RlbmVyQ291bnQoc3JjLCAnZGF0YScpID4gMClcbiAgICAgIGVtaXREYXRhRXZlbnRzKHNyYyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gYXQgdGhpcyBwb2ludCwgbm8gb25lIG5lZWRlZCBhIGRyYWluLCBzbyB3ZSBqdXN0IHJhbiBvdXQgb2YgZGF0YVxuICAvLyBvbiB0aGUgbmV4dCByZWFkYWJsZSBldmVudCwgc3RhcnQgaXQgb3ZlciBhZ2Fpbi5cbiAgc3RhdGUucmFuT3V0ID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gcGlwZU9uUmVhZGFibGUoKSB7XG4gIGlmICh0aGlzLl9yZWFkYWJsZVN0YXRlLnJhbk91dCkge1xuICAgIHRoaXMuX3JlYWRhYmxlU3RhdGUucmFuT3V0ID0gZmFsc2U7XG4gICAgZmxvdyh0aGlzKTtcbiAgfVxufVxuXG5cblJlYWRhYmxlLnByb3RvdHlwZS51bnBpcGUgPSBmdW5jdGlvbihkZXN0KSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3JlYWRhYmxlU3RhdGU7XG5cbiAgLy8gaWYgd2UncmUgbm90IHBpcGluZyBhbnl3aGVyZSwgdGhlbiBkbyBub3RoaW5nLlxuICBpZiAoc3RhdGUucGlwZXNDb3VudCA9PT0gMClcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBqdXN0IG9uZSBkZXN0aW5hdGlvbi4gIG1vc3QgY29tbW9uIGNhc2UuXG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKSB7XG4gICAgLy8gcGFzc2VkIGluIG9uZSwgYnV0IGl0J3Mgbm90IHRoZSByaWdodCBvbmUuXG4gICAgaWYgKGRlc3QgJiYgZGVzdCAhPT0gc3RhdGUucGlwZXMpXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmICghZGVzdClcbiAgICAgIGRlc3QgPSBzdGF0ZS5waXBlcztcblxuICAgIC8vIGdvdCBhIG1hdGNoLlxuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIHBpcGVPblJlYWRhYmxlKTtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG4gICAgaWYgKGRlc3QpXG4gICAgICBkZXN0LmVtaXQoJ3VucGlwZScsIHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc2xvdyBjYXNlLiBtdWx0aXBsZSBwaXBlIGRlc3RpbmF0aW9ucy5cblxuICBpZiAoIWRlc3QpIHtcbiAgICAvLyByZW1vdmUgYWxsLlxuICAgIHZhciBkZXN0cyA9IHN0YXRlLnBpcGVzO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5waXBlc0NvdW50O1xuICAgIHN0YXRlLnBpcGVzID0gbnVsbDtcbiAgICBzdGF0ZS5waXBlc0NvdW50ID0gMDtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIHBpcGVPblJlYWRhYmxlKTtcbiAgICBzdGF0ZS5mbG93aW5nID0gZmFsc2U7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgZGVzdHNbaV0uZW1pdCgndW5waXBlJywgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB0cnkgdG8gZmluZCB0aGUgcmlnaHQgb25lLlxuICB2YXIgaSA9IHNoaW1zLmluZGV4T2Yoc3RhdGUucGlwZXMsIGRlc3QpO1xuICBpZiAoaSA9PT0gLTEpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgc3RhdGUucGlwZXMuc3BsaWNlKGksIDEpO1xuICBzdGF0ZS5waXBlc0NvdW50IC09IDE7XG4gIGlmIChzdGF0ZS5waXBlc0NvdW50ID09PSAxKVxuICAgIHN0YXRlLnBpcGVzID0gc3RhdGUucGlwZXNbMF07XG5cbiAgZGVzdC5lbWl0KCd1bnBpcGUnLCB0aGlzKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIHNldCB1cCBkYXRhIGV2ZW50cyBpZiB0aGV5IGFyZSBhc2tlZCBmb3Jcbi8vIEVuc3VyZSByZWFkYWJsZSBsaXN0ZW5lcnMgZXZlbnR1YWxseSBnZXQgc29tZXRoaW5nXG5SZWFkYWJsZS5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldiwgZm4pIHtcbiAgdmFyIHJlcyA9IFN0cmVhbS5wcm90b3R5cGUub24uY2FsbCh0aGlzLCBldiwgZm4pO1xuXG4gIGlmIChldiA9PT0gJ2RhdGEnICYmICF0aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcpXG4gICAgZW1pdERhdGFFdmVudHModGhpcyk7XG5cbiAgaWYgKGV2ID09PSAncmVhZGFibGUnICYmIHRoaXMucmVhZGFibGUpIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9yZWFkYWJsZVN0YXRlO1xuICAgIGlmICghc3RhdGUucmVhZGFibGVMaXN0ZW5pbmcpIHtcbiAgICAgIHN0YXRlLnJlYWRhYmxlTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICAgIHN0YXRlLmVtaXR0ZWRSZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcbiAgICAgIGlmICghc3RhdGUucmVhZGluZykge1xuICAgICAgICB0aGlzLnJlYWQoMCk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlLmxlbmd0aCkge1xuICAgICAgICBlbWl0UmVhZGFibGUodGhpcywgc3RhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXM7XG59O1xuUmVhZGFibGUucHJvdG90eXBlLmFkZExpc3RlbmVyID0gUmVhZGFibGUucHJvdG90eXBlLm9uO1xuXG4vLyBwYXVzZSgpIGFuZCByZXN1bWUoKSBhcmUgcmVtbmFudHMgb2YgdGhlIGxlZ2FjeSByZWFkYWJsZSBzdHJlYW0gQVBJXG4vLyBJZiB0aGUgdXNlciB1c2VzIHRoZW0sIHRoZW4gc3dpdGNoIGludG8gb2xkIG1vZGUuXG5SZWFkYWJsZS5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gIGVtaXREYXRhRXZlbnRzKHRoaXMpO1xuICB0aGlzLnJlYWQoMCk7XG4gIHRoaXMuZW1pdCgncmVzdW1lJyk7XG59O1xuXG5SZWFkYWJsZS5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgZW1pdERhdGFFdmVudHModGhpcywgdHJ1ZSk7XG4gIHRoaXMuZW1pdCgncGF1c2UnKTtcbn07XG5cbmZ1bmN0aW9uIGVtaXREYXRhRXZlbnRzKHN0cmVhbSwgc3RhcnRQYXVzZWQpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuXG4gIGlmIChzdGF0ZS5mbG93aW5nKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9yZWFkYWJsZS1zdHJlYW0vaXNzdWVzLzE2XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3Qgc3dpdGNoIHRvIG9sZCBtb2RlIG5vdy4nKTtcbiAgfVxuXG4gIHZhciBwYXVzZWQgPSBzdGFydFBhdXNlZCB8fCBmYWxzZTtcbiAgdmFyIHJlYWRhYmxlID0gZmFsc2U7XG5cbiAgLy8gY29udmVydCB0byBhbiBvbGQtc3R5bGUgc3RyZWFtLlxuICBzdHJlYW0ucmVhZGFibGUgPSB0cnVlO1xuICBzdHJlYW0ucGlwZSA9IFN0cmVhbS5wcm90b3R5cGUucGlwZTtcbiAgc3RyZWFtLm9uID0gc3RyZWFtLmFkZExpc3RlbmVyID0gU3RyZWFtLnByb3RvdHlwZS5vbjtcblxuICBzdHJlYW0ub24oJ3JlYWRhYmxlJywgZnVuY3Rpb24oKSB7XG4gICAgcmVhZGFibGUgPSB0cnVlO1xuXG4gICAgdmFyIGM7XG4gICAgd2hpbGUgKCFwYXVzZWQgJiYgKG51bGwgIT09IChjID0gc3RyZWFtLnJlYWQoKSkpKVxuICAgICAgc3RyZWFtLmVtaXQoJ2RhdGEnLCBjKTtcblxuICAgIGlmIChjID09PSBudWxsKSB7XG4gICAgICByZWFkYWJsZSA9IGZhbHNlO1xuICAgICAgc3RyZWFtLl9yZWFkYWJsZVN0YXRlLm5lZWRSZWFkYWJsZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICBzdHJlYW0ucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICBwYXVzZWQgPSB0cnVlO1xuICAgIHRoaXMuZW1pdCgncGF1c2UnKTtcbiAgfTtcblxuICBzdHJlYW0ucmVzdW1lID0gZnVuY3Rpb24oKSB7XG4gICAgcGF1c2VkID0gZmFsc2U7XG4gICAgaWYgKHJlYWRhYmxlKVxuICAgICAgdGltZXJzLnNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgc3RyZWFtLmVtaXQoJ3JlYWRhYmxlJyk7XG4gICAgICB9KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnJlYWQoMCk7XG4gICAgdGhpcy5lbWl0KCdyZXN1bWUnKTtcbiAgfTtcblxuICAvLyBub3cgbWFrZSBpdCBzdGFydCwganVzdCBpbiBjYXNlIGl0IGhhZG4ndCBhbHJlYWR5LlxuICBzdHJlYW0uZW1pdCgncmVhZGFibGUnKTtcbn1cblxuLy8gd3JhcCBhbiBvbGQtc3R5bGUgc3RyZWFtIGFzIHRoZSBhc3luYyBkYXRhIHNvdXJjZS5cbi8vIFRoaXMgaXMgKm5vdCogcGFydCBvZiB0aGUgcmVhZGFibGUgc3RyZWFtIGludGVyZmFjZS5cbi8vIEl0IGlzIGFuIHVnbHkgdW5mb3J0dW5hdGUgbWVzcyBvZiBoaXN0b3J5LlxuUmVhZGFibGUucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgdmFyIHBhdXNlZCA9IGZhbHNlO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgc3RyZWFtLm9uKCdlbmQnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAoc3RhdGUuZGVjb2RlciAmJiAhc3RhdGUuZW5kZWQpIHtcbiAgICAgIHZhciBjaHVuayA9IHN0YXRlLmRlY29kZXIuZW5kKCk7XG4gICAgICBpZiAoY2h1bmsgJiYgY2h1bmsubGVuZ3RoKVxuICAgICAgICBzZWxmLnB1c2goY2h1bmspO1xuICAgIH1cblxuICAgIHNlbGYucHVzaChudWxsKTtcbiAgfSk7XG5cbiAgc3RyZWFtLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICBpZiAoc3RhdGUuZGVjb2RlcilcbiAgICAgIGNodW5rID0gc3RhdGUuZGVjb2Rlci53cml0ZShjaHVuayk7XG4gICAgaWYgKCFjaHVuayB8fCAhc3RhdGUub2JqZWN0TW9kZSAmJiAhY2h1bmsubGVuZ3RoKVxuICAgICAgcmV0dXJuO1xuXG4gICAgdmFyIHJldCA9IHNlbGYucHVzaChjaHVuayk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICBzdHJlYW0ucGF1c2UoKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHByb3h5IGFsbCB0aGUgb3RoZXIgbWV0aG9kcy5cbiAgLy8gaW1wb3J0YW50IHdoZW4gd3JhcHBpbmcgZmlsdGVycyBhbmQgZHVwbGV4ZXMuXG4gIGZvciAodmFyIGkgaW4gc3RyZWFtKSB7XG4gICAgaWYgKHR5cGVvZiBzdHJlYW1baV0gPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdHlwZW9mIHRoaXNbaV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzW2ldID0gZnVuY3Rpb24obWV0aG9kKSB7IHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHN0cmVhbVttZXRob2RdLmFwcGx5KHN0cmVhbSwgYXJndW1lbnRzKTtcbiAgICAgIH19KGkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIHByb3h5IGNlcnRhaW4gaW1wb3J0YW50IGV2ZW50cy5cbiAgdmFyIGV2ZW50cyA9IFsnZXJyb3InLCAnY2xvc2UnLCAnZGVzdHJveScsICdwYXVzZScsICdyZXN1bWUnXTtcbiAgc2hpbXMuZm9yRWFjaChldmVudHMsIGZ1bmN0aW9uKGV2KSB7XG4gICAgc3RyZWFtLm9uKGV2LCBzaGltcy5iaW5kKHNlbGYuZW1pdCwgc2VsZiwgZXYpKTtcbiAgfSk7XG5cbiAgLy8gd2hlbiB3ZSB0cnkgdG8gY29uc3VtZSBzb21lIG1vcmUgYnl0ZXMsIHNpbXBseSB1bnBhdXNlIHRoZVxuICAvLyB1bmRlcmx5aW5nIHN0cmVhbS5cbiAgc2VsZi5fcmVhZCA9IGZ1bmN0aW9uKG4pIHtcbiAgICBpZiAocGF1c2VkKSB7XG4gICAgICBwYXVzZWQgPSBmYWxzZTtcbiAgICAgIHN0cmVhbS5yZXN1bWUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHNlbGY7XG59O1xuXG5cblxuLy8gZXhwb3NlZCBmb3IgdGVzdGluZyBwdXJwb3NlcyBvbmx5LlxuUmVhZGFibGUuX2Zyb21MaXN0ID0gZnJvbUxpc3Q7XG5cbi8vIFBsdWNrIG9mZiBuIGJ5dGVzIGZyb20gYW4gYXJyYXkgb2YgYnVmZmVycy5cbi8vIExlbmd0aCBpcyB0aGUgY29tYmluZWQgbGVuZ3RocyBvZiBhbGwgdGhlIGJ1ZmZlcnMgaW4gdGhlIGxpc3QuXG5mdW5jdGlvbiBmcm9tTGlzdChuLCBzdGF0ZSkge1xuICB2YXIgbGlzdCA9IHN0YXRlLmJ1ZmZlcjtcbiAgdmFyIGxlbmd0aCA9IHN0YXRlLmxlbmd0aDtcbiAgdmFyIHN0cmluZ01vZGUgPSAhIXN0YXRlLmRlY29kZXI7XG4gIHZhciBvYmplY3RNb2RlID0gISFzdGF0ZS5vYmplY3RNb2RlO1xuICB2YXIgcmV0O1xuXG4gIC8vIG5vdGhpbmcgaW4gdGhlIGxpc3QsIGRlZmluaXRlbHkgZW1wdHkuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gbnVsbDtcblxuICBpZiAobGVuZ3RoID09PSAwKVxuICAgIHJldCA9IG51bGw7XG4gIGVsc2UgaWYgKG9iamVjdE1vZGUpXG4gICAgcmV0ID0gbGlzdC5zaGlmdCgpO1xuICBlbHNlIGlmICghbiB8fCBuID49IGxlbmd0aCkge1xuICAgIC8vIHJlYWQgaXQgYWxsLCB0cnVuY2F0ZSB0aGUgYXJyYXkuXG4gICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICByZXQgPSBsaXN0LmpvaW4oJycpO1xuICAgIGVsc2VcbiAgICAgIHJldCA9IEJ1ZmZlci5jb25jYXQobGlzdCwgbGVuZ3RoKTtcbiAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gcmVhZCBqdXN0IHNvbWUgb2YgaXQuXG4gICAgaWYgKG4gPCBsaXN0WzBdLmxlbmd0aCkge1xuICAgICAgLy8ganVzdCB0YWtlIGEgcGFydCBvZiB0aGUgZmlyc3QgbGlzdCBpdGVtLlxuICAgICAgLy8gc2xpY2UgaXMgdGhlIHNhbWUgZm9yIGJ1ZmZlcnMgYW5kIHN0cmluZ3MuXG4gICAgICB2YXIgYnVmID0gbGlzdFswXTtcbiAgICAgIHJldCA9IGJ1Zi5zbGljZSgwLCBuKTtcbiAgICAgIGxpc3RbMF0gPSBidWYuc2xpY2Uobik7XG4gICAgfSBlbHNlIGlmIChuID09PSBsaXN0WzBdLmxlbmd0aCkge1xuICAgICAgLy8gZmlyc3QgbGlzdCBpcyBhIHBlcmZlY3QgbWF0Y2hcbiAgICAgIHJldCA9IGxpc3Quc2hpZnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29tcGxleCBjYXNlLlxuICAgICAgLy8gd2UgaGF2ZSBlbm91Z2ggdG8gY292ZXIgaXQsIGJ1dCBpdCBzcGFucyBwYXN0IHRoZSBmaXJzdCBidWZmZXIuXG4gICAgICBpZiAoc3RyaW5nTW9kZSlcbiAgICAgICAgcmV0ID0gJyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldCA9IG5ldyBCdWZmZXIobik7XG5cbiAgICAgIHZhciBjID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdC5sZW5ndGg7IGkgPCBsICYmIGMgPCBuOyBpKyspIHtcbiAgICAgICAgdmFyIGJ1ZiA9IGxpc3RbMF07XG4gICAgICAgIHZhciBjcHkgPSBNYXRoLm1pbihuIC0gYywgYnVmLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKHN0cmluZ01vZGUpXG4gICAgICAgICAgcmV0ICs9IGJ1Zi5zbGljZSgwLCBjcHkpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgYnVmLmNvcHkocmV0LCBjLCAwLCBjcHkpO1xuXG4gICAgICAgIGlmIChjcHkgPCBidWYubGVuZ3RoKVxuICAgICAgICAgIGxpc3RbMF0gPSBidWYuc2xpY2UoY3B5KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcblxuICAgICAgICBjICs9IGNweTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBlbmRSZWFkYWJsZShzdHJlYW0pIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuXG4gIC8vIElmIHdlIGdldCBoZXJlIGJlZm9yZSBjb25zdW1pbmcgYWxsIHRoZSBieXRlcywgdGhlbiB0aGF0IGlzIGFcbiAgLy8gYnVnIGluIG5vZGUuICBTaG91bGQgbmV2ZXIgaGFwcGVuLlxuICBpZiAoc3RhdGUubGVuZ3RoID4gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuZFJlYWRhYmxlIGNhbGxlZCBvbiBub24tZW1wdHkgc3RyZWFtJyk7XG5cbiAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmNhbGxlZFJlYWQpIHtcbiAgICBzdGF0ZS5lbmRlZCA9IHRydWU7XG4gICAgdGltZXJzLnNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgIC8vIENoZWNrIHRoYXQgd2UgZGlkbid0IGdldCBvbmUgbGFzdCB1bnNoaWZ0LlxuICAgICAgaWYgKCFzdGF0ZS5lbmRFbWl0dGVkICYmIHN0YXRlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzdGF0ZS5lbmRFbWl0dGVkID0gdHJ1ZTtcbiAgICAgICAgc3RyZWFtLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgICAgIHN0cmVhbS5lbWl0KCdlbmQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbi8vIGEgdHJhbnNmb3JtIHN0cmVhbSBpcyBhIHJlYWRhYmxlL3dyaXRhYmxlIHN0cmVhbSB3aGVyZSB5b3UgZG9cbi8vIHNvbWV0aGluZyB3aXRoIHRoZSBkYXRhLiAgU29tZXRpbWVzIGl0J3MgY2FsbGVkIGEgXCJmaWx0ZXJcIixcbi8vIGJ1dCB0aGF0J3Mgbm90IGEgZ3JlYXQgbmFtZSBmb3IgaXQsIHNpbmNlIHRoYXQgaW1wbGllcyBhIHRoaW5nIHdoZXJlXG4vLyBzb21lIGJpdHMgcGFzcyB0aHJvdWdoLCBhbmQgb3RoZXJzIGFyZSBzaW1wbHkgaWdub3JlZC4gIChUaGF0IHdvdWxkXG4vLyBiZSBhIHZhbGlkIGV4YW1wbGUgb2YgYSB0cmFuc2Zvcm0sIG9mIGNvdXJzZS4pXG4vL1xuLy8gV2hpbGUgdGhlIG91dHB1dCBpcyBjYXVzYWxseSByZWxhdGVkIHRvIHRoZSBpbnB1dCwgaXQncyBub3QgYVxuLy8gbmVjZXNzYXJpbHkgc3ltbWV0cmljIG9yIHN5bmNocm9ub3VzIHRyYW5zZm9ybWF0aW9uLiAgRm9yIGV4YW1wbGUsXG4vLyBhIHpsaWIgc3RyZWFtIG1pZ2h0IHRha2UgbXVsdGlwbGUgcGxhaW4tdGV4dCB3cml0ZXMoKSwgYW5kIHRoZW5cbi8vIGVtaXQgYSBzaW5nbGUgY29tcHJlc3NlZCBjaHVuayBzb21lIHRpbWUgaW4gdGhlIGZ1dHVyZS5cbi8vXG4vLyBIZXJlJ3MgaG93IHRoaXMgd29ya3M6XG4vL1xuLy8gVGhlIFRyYW5zZm9ybSBzdHJlYW0gaGFzIGFsbCB0aGUgYXNwZWN0cyBvZiB0aGUgcmVhZGFibGUgYW5kIHdyaXRhYmxlXG4vLyBzdHJlYW0gY2xhc3Nlcy4gIFdoZW4geW91IHdyaXRlKGNodW5rKSwgdGhhdCBjYWxscyBfd3JpdGUoY2h1bmssY2IpXG4vLyBpbnRlcm5hbGx5LCBhbmQgcmV0dXJucyBmYWxzZSBpZiB0aGVyZSdzIGEgbG90IG9mIHBlbmRpbmcgd3JpdGVzXG4vLyBidWZmZXJlZCB1cC4gIFdoZW4geW91IGNhbGwgcmVhZCgpLCB0aGF0IGNhbGxzIF9yZWFkKG4pIHVudGlsXG4vLyB0aGVyZSdzIGVub3VnaCBwZW5kaW5nIHJlYWRhYmxlIGRhdGEgYnVmZmVyZWQgdXAuXG4vL1xuLy8gSW4gYSB0cmFuc2Zvcm0gc3RyZWFtLCB0aGUgd3JpdHRlbiBkYXRhIGlzIHBsYWNlZCBpbiBhIGJ1ZmZlci4gIFdoZW5cbi8vIF9yZWFkKG4pIGlzIGNhbGxlZCwgaXQgdHJhbnNmb3JtcyB0aGUgcXVldWVkIHVwIGRhdGEsIGNhbGxpbmcgdGhlXG4vLyBidWZmZXJlZCBfd3JpdGUgY2IncyBhcyBpdCBjb25zdW1lcyBjaHVua3MuICBJZiBjb25zdW1pbmcgYSBzaW5nbGVcbi8vIHdyaXR0ZW4gY2h1bmsgd291bGQgcmVzdWx0IGluIG11bHRpcGxlIG91dHB1dCBjaHVua3MsIHRoZW4gdGhlIGZpcnN0XG4vLyBvdXRwdXR0ZWQgYml0IGNhbGxzIHRoZSByZWFkY2IsIGFuZCBzdWJzZXF1ZW50IGNodW5rcyBqdXN0IGdvIGludG9cbi8vIHRoZSByZWFkIGJ1ZmZlciwgYW5kIHdpbGwgY2F1c2UgaXQgdG8gZW1pdCAncmVhZGFibGUnIGlmIG5lY2Vzc2FyeS5cbi8vXG4vLyBUaGlzIHdheSwgYmFjay1wcmVzc3VyZSBpcyBhY3R1YWxseSBkZXRlcm1pbmVkIGJ5IHRoZSByZWFkaW5nIHNpZGUsXG4vLyBzaW5jZSBfcmVhZCBoYXMgdG8gYmUgY2FsbGVkIHRvIHN0YXJ0IHByb2Nlc3NpbmcgYSBuZXcgY2h1bmsuICBIb3dldmVyLFxuLy8gYSBwYXRob2xvZ2ljYWwgaW5mbGF0ZSB0eXBlIG9mIHRyYW5zZm9ybSBjYW4gY2F1c2UgZXhjZXNzaXZlIGJ1ZmZlcmluZ1xuLy8gaGVyZS4gIEZvciBleGFtcGxlLCBpbWFnaW5lIGEgc3RyZWFtIHdoZXJlIGV2ZXJ5IGJ5dGUgb2YgaW5wdXQgaXNcbi8vIGludGVycHJldGVkIGFzIGFuIGludGVnZXIgZnJvbSAwLTI1NSwgYW5kIHRoZW4gcmVzdWx0cyBpbiB0aGF0IG1hbnlcbi8vIGJ5dGVzIG9mIG91dHB1dC4gIFdyaXRpbmcgdGhlIDQgYnl0ZXMge2ZmLGZmLGZmLGZmfSB3b3VsZCByZXN1bHQgaW5cbi8vIDFrYiBvZiBkYXRhIGJlaW5nIG91dHB1dC4gIEluIHRoaXMgY2FzZSwgeW91IGNvdWxkIHdyaXRlIGEgdmVyeSBzbWFsbFxuLy8gYW1vdW50IG9mIGlucHV0LCBhbmQgZW5kIHVwIHdpdGggYSB2ZXJ5IGxhcmdlIGFtb3VudCBvZiBvdXRwdXQuICBJblxuLy8gc3VjaCBhIHBhdGhvbG9naWNhbCBpbmZsYXRpbmcgbWVjaGFuaXNtLCB0aGVyZSdkIGJlIG5vIHdheSB0byB0ZWxsXG4vLyB0aGUgc3lzdGVtIHRvIHN0b3AgZG9pbmcgdGhlIHRyYW5zZm9ybS4gIEEgc2luZ2xlIDRNQiB3cml0ZSBjb3VsZFxuLy8gY2F1c2UgdGhlIHN5c3RlbSB0byBydW4gb3V0IG9mIG1lbW9yeS5cbi8vXG4vLyBIb3dldmVyLCBldmVuIGluIHN1Y2ggYSBwYXRob2xvZ2ljYWwgY2FzZSwgb25seSBhIHNpbmdsZSB3cml0dGVuIGNodW5rXG4vLyB3b3VsZCBiZSBjb25zdW1lZCwgYW5kIHRoZW4gdGhlIHJlc3Qgd291bGQgd2FpdCAodW4tdHJhbnNmb3JtZWQpIHVudGlsXG4vLyB0aGUgcmVzdWx0cyBvZiB0aGUgcHJldmlvdXMgdHJhbnNmb3JtZWQgY2h1bmsgd2VyZSBjb25zdW1lZC5cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFuc2Zvcm07XG5cbnZhciBEdXBsZXggPSByZXF1aXJlKCdfc3RyZWFtX2R1cGxleCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG51dGlsLmluaGVyaXRzKFRyYW5zZm9ybSwgRHVwbGV4KTtcblxuXG5mdW5jdGlvbiBUcmFuc2Zvcm1TdGF0ZShvcHRpb25zLCBzdHJlYW0pIHtcbiAgdGhpcy5hZnRlclRyYW5zZm9ybSA9IGZ1bmN0aW9uKGVyLCBkYXRhKSB7XG4gICAgcmV0dXJuIGFmdGVyVHJhbnNmb3JtKHN0cmVhbSwgZXIsIGRhdGEpO1xuICB9O1xuXG4gIHRoaXMubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICB0aGlzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuICB0aGlzLndyaXRlY2IgPSBudWxsO1xuICB0aGlzLndyaXRlY2h1bmsgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBhZnRlclRyYW5zZm9ybShzdHJlYW0sIGVyLCBkYXRhKSB7XG4gIHZhciB0cyA9IHN0cmVhbS5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLnRyYW5zZm9ybWluZyA9IGZhbHNlO1xuXG4gIHZhciBjYiA9IHRzLndyaXRlY2I7XG5cbiAgaWYgKCFjYilcbiAgICByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdubyB3cml0ZWNiIGluIFRyYW5zZm9ybSBjbGFzcycpKTtcblxuICB0cy53cml0ZWNodW5rID0gbnVsbDtcbiAgdHMud3JpdGVjYiA9IG51bGw7XG5cbiAgaWYgKGRhdGEgIT09IG51bGwgJiYgZGF0YSAhPT0gdW5kZWZpbmVkKVxuICAgIHN0cmVhbS5wdXNoKGRhdGEpO1xuXG4gIGlmIChjYilcbiAgICBjYihlcik7XG5cbiAgdmFyIHJzID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICBycy5yZWFkaW5nID0gZmFsc2U7XG4gIGlmIChycy5uZWVkUmVhZGFibGUgfHwgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaykge1xuICAgIHN0cmVhbS5fcmVhZChycy5oaWdoV2F0ZXJNYXJrKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIFRyYW5zZm9ybShvcHRpb25zKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUcmFuc2Zvcm0pKVxuICAgIHJldHVybiBuZXcgVHJhbnNmb3JtKG9wdGlvbnMpO1xuXG4gIER1cGxleC5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuXG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlID0gbmV3IFRyYW5zZm9ybVN0YXRlKG9wdGlvbnMsIHRoaXMpO1xuXG4gIC8vIHdoZW4gdGhlIHdyaXRhYmxlIHNpZGUgZmluaXNoZXMsIHRoZW4gZmx1c2ggb3V0IGFueXRoaW5nIHJlbWFpbmluZy5cbiAgdmFyIHN0cmVhbSA9IHRoaXM7XG5cbiAgLy8gc3RhcnQgb3V0IGFza2luZyBmb3IgYSByZWFkYWJsZSBldmVudCBvbmNlIGRhdGEgaXMgdHJhbnNmb3JtZWQuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUubmVlZFJlYWRhYmxlID0gdHJ1ZTtcblxuICAvLyB3ZSBoYXZlIGltcGxlbWVudGVkIHRoZSBfcmVhZCBtZXRob2QsIGFuZCBkb25lIHRoZSBvdGhlciB0aGluZ3NcbiAgLy8gdGhhdCBSZWFkYWJsZSB3YW50cyBiZWZvcmUgdGhlIGZpcnN0IF9yZWFkIGNhbGwsIHNvIHVuc2V0IHRoZVxuICAvLyBzeW5jIGd1YXJkIGZsYWcuXG4gIHRoaXMuX3JlYWRhYmxlU3RhdGUuc3luYyA9IGZhbHNlO1xuXG4gIHRoaXMub25jZSgnZmluaXNoJywgZnVuY3Rpb24oKSB7XG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiB0aGlzLl9mbHVzaClcbiAgICAgIHRoaXMuX2ZsdXNoKGZ1bmN0aW9uKGVyKSB7XG4gICAgICAgIGRvbmUoc3RyZWFtLCBlcik7XG4gICAgICB9KTtcbiAgICBlbHNlXG4gICAgICBkb25lKHN0cmVhbSk7XG4gIH0pO1xufVxuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcpIHtcbiAgdGhpcy5fdHJhbnNmb3JtU3RhdGUubmVlZFRyYW5zZm9ybSA9IGZhbHNlO1xuICByZXR1cm4gRHVwbGV4LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgY2h1bmssIGVuY29kaW5nKTtcbn07XG5cbi8vIFRoaXMgaXMgdGhlIHBhcnQgd2hlcmUgeW91IGRvIHN0dWZmIVxuLy8gb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBpbiBpbXBsZW1lbnRhdGlvbiBjbGFzc2VzLlxuLy8gJ2NodW5rJyBpcyBhbiBpbnB1dCBjaHVuay5cbi8vXG4vLyBDYWxsIGBwdXNoKG5ld0NodW5rKWAgdG8gcGFzcyBhbG9uZyB0cmFuc2Zvcm1lZCBvdXRwdXRcbi8vIHRvIHRoZSByZWFkYWJsZSBzaWRlLiAgWW91IG1heSBjYWxsICdwdXNoJyB6ZXJvIG9yIG1vcmUgdGltZXMuXG4vL1xuLy8gQ2FsbCBgY2IoZXJyKWAgd2hlbiB5b3UgYXJlIGRvbmUgd2l0aCB0aGlzIGNodW5rLiAgSWYgeW91IHBhc3Ncbi8vIGFuIGVycm9yLCB0aGVuIHRoYXQnbGwgcHV0IHRoZSBodXJ0IG9uIHRoZSB3aG9sZSBvcGVyYXRpb24uICBJZiB5b3Vcbi8vIG5ldmVyIGNhbGwgY2IoKSwgdGhlbiB5b3UnbGwgbmV2ZXIgZ2V0IGFub3RoZXIgY2h1bmsuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl90cmFuc2Zvcm0gPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XG59O1xuXG5UcmFuc2Zvcm0ucHJvdG90eXBlLl93cml0ZSA9IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdmFyIHRzID0gdGhpcy5fdHJhbnNmb3JtU3RhdGU7XG4gIHRzLndyaXRlY2IgPSBjYjtcbiAgdHMud3JpdGVjaHVuayA9IGNodW5rO1xuICB0cy53cml0ZWVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIGlmICghdHMudHJhbnNmb3JtaW5nKSB7XG4gICAgdmFyIHJzID0gdGhpcy5fcmVhZGFibGVTdGF0ZTtcbiAgICBpZiAodHMubmVlZFRyYW5zZm9ybSB8fFxuICAgICAgICBycy5uZWVkUmVhZGFibGUgfHxcbiAgICAgICAgcnMubGVuZ3RoIDwgcnMuaGlnaFdhdGVyTWFyaylcbiAgICAgIHRoaXMuX3JlYWQocnMuaGlnaFdhdGVyTWFyayk7XG4gIH1cbn07XG5cbi8vIERvZXNuJ3QgbWF0dGVyIHdoYXQgdGhlIGFyZ3MgYXJlIGhlcmUuXG4vLyBfdHJhbnNmb3JtIGRvZXMgYWxsIHRoZSB3b3JrLlxuLy8gVGhhdCB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoZSByZWFkYWJsZSBzaWRlIHdhbnRzIG1vcmUgZGF0YS5cblRyYW5zZm9ybS5wcm90b3R5cGUuX3JlYWQgPSBmdW5jdGlvbihuKSB7XG4gIHZhciB0cyA9IHRoaXMuX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICh0cy53cml0ZWNodW5rICYmIHRzLndyaXRlY2IgJiYgIXRzLnRyYW5zZm9ybWluZykge1xuICAgIHRzLnRyYW5zZm9ybWluZyA9IHRydWU7XG4gICAgdGhpcy5fdHJhbnNmb3JtKHRzLndyaXRlY2h1bmssIHRzLndyaXRlZW5jb2RpbmcsIHRzLmFmdGVyVHJhbnNmb3JtKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBtYXJrIHRoYXQgd2UgbmVlZCBhIHRyYW5zZm9ybSwgc28gdGhhdCBhbnkgZGF0YSB0aGF0IGNvbWVzIGluXG4gICAgLy8gd2lsbCBnZXQgcHJvY2Vzc2VkLCBub3cgdGhhdCB3ZSd2ZSBhc2tlZCBmb3IgaXQuXG4gICAgdHMubmVlZFRyYW5zZm9ybSA9IHRydWU7XG4gIH1cbn07XG5cblxuZnVuY3Rpb24gZG9uZShzdHJlYW0sIGVyKSB7XG4gIGlmIChlcilcbiAgICByZXR1cm4gc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXIpO1xuXG4gIC8vIGlmIHRoZXJlJ3Mgbm90aGluZyBpbiB0aGUgd3JpdGUgYnVmZmVyLCB0aGVuIHRoYXQgbWVhbnNcbiAgLy8gdGhhdCBub3RoaW5nIG1vcmUgd2lsbCBldmVyIGJlIHByb3ZpZGVkXG4gIHZhciB3cyA9IHN0cmVhbS5fd3JpdGFibGVTdGF0ZTtcbiAgdmFyIHJzID0gc3RyZWFtLl9yZWFkYWJsZVN0YXRlO1xuICB2YXIgdHMgPSBzdHJlYW0uX3RyYW5zZm9ybVN0YXRlO1xuXG4gIGlmICh3cy5sZW5ndGgpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsaW5nIHRyYW5zZm9ybSBkb25lIHdoZW4gd3MubGVuZ3RoICE9IDAnKTtcblxuICBpZiAodHMudHJhbnNmb3JtaW5nKVxuICAgIHRocm93IG5ldyBFcnJvcignY2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHN0aWxsIHRyYW5zZm9ybWluZycpO1xuXG4gIHJldHVybiBzdHJlYW0ucHVzaChudWxsKTtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBBIGJpdCBzaW1wbGVyIHRoYW4gcmVhZGFibGUgc3RyZWFtcy5cbi8vIEltcGxlbWVudCBhbiBhc3luYyAuX3dyaXRlKGNodW5rLCBjYiksIGFuZCBpdCdsbCBoYW5kbGUgYWxsXG4vLyB0aGUgZHJhaW4gZXZlbnQgZW1pc3Npb24gYW5kIGJ1ZmZlcmluZy5cblxubW9kdWxlLmV4cG9ydHMgPSBXcml0YWJsZTtcbldyaXRhYmxlLldyaXRhYmxlU3RhdGUgPSBXcml0YWJsZVN0YXRlO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBTdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciB0aW1lcnMgPSByZXF1aXJlKCd0aW1lcnMnKTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbnV0aWwuaW5oZXJpdHMoV3JpdGFibGUsIFN0cmVhbSk7XG5cbmZ1bmN0aW9uIFdyaXRlUmVxKGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgdGhpcy5jaHVuayA9IGNodW5rO1xuICB0aGlzLmVuY29kaW5nID0gZW5jb2Rpbmc7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYjtcbn1cblxuZnVuY3Rpb24gV3JpdGFibGVTdGF0ZShvcHRpb25zLCBzdHJlYW0pIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gdGhlIHBvaW50IGF0IHdoaWNoIHdyaXRlKCkgc3RhcnRzIHJldHVybmluZyBmYWxzZVxuICAvLyBOb3RlOiAwIGlzIGEgdmFsaWQgdmFsdWUsIG1lYW5zIHRoYXQgd2UgYWx3YXlzIHJldHVybiBmYWxzZSBpZlxuICAvLyB0aGUgZW50aXJlIGJ1ZmZlciBpcyBub3QgZmx1c2hlZCBpbW1lZGlhdGVseSBvbiB3cml0ZSgpXG4gIHZhciBod20gPSBvcHRpb25zLmhpZ2hXYXRlck1hcms7XG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IChod20gfHwgaHdtID09PSAwKSA/IGh3bSA6IDE2ICogMTAyNDtcblxuICAvLyBvYmplY3Qgc3RyZWFtIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciBvciBub3QgdGhpcyBzdHJlYW1cbiAgLy8gY29udGFpbnMgYnVmZmVycyBvciBvYmplY3RzLlxuICB0aGlzLm9iamVjdE1vZGUgPSAhIW9wdGlvbnMub2JqZWN0TW9kZTtcblxuICAvLyBjYXN0IHRvIGludHMuXG4gIHRoaXMuaGlnaFdhdGVyTWFyayA9IH5+dGhpcy5oaWdoV2F0ZXJNYXJrO1xuXG4gIHRoaXMubmVlZERyYWluID0gZmFsc2U7XG4gIC8vIGF0IHRoZSBzdGFydCBvZiBjYWxsaW5nIGVuZCgpXG4gIHRoaXMuZW5kaW5nID0gZmFsc2U7XG4gIC8vIHdoZW4gZW5kKCkgaGFzIGJlZW4gY2FsbGVkLCBhbmQgcmV0dXJuZWRcbiAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICAvLyB3aGVuICdmaW5pc2gnIGlzIGVtaXR0ZWRcbiAgdGhpcy5maW5pc2hlZCA9IGZhbHNlO1xuXG4gIC8vIHNob3VsZCB3ZSBkZWNvZGUgc3RyaW5ncyBpbnRvIGJ1ZmZlcnMgYmVmb3JlIHBhc3NpbmcgdG8gX3dyaXRlP1xuICAvLyB0aGlzIGlzIGhlcmUgc28gdGhhdCBzb21lIG5vZGUtY29yZSBzdHJlYW1zIGNhbiBvcHRpbWl6ZSBzdHJpbmdcbiAgLy8gaGFuZGxpbmcgYXQgYSBsb3dlciBsZXZlbC5cbiAgdmFyIG5vRGVjb2RlID0gb3B0aW9ucy5kZWNvZGVTdHJpbmdzID09PSBmYWxzZTtcbiAgdGhpcy5kZWNvZGVTdHJpbmdzID0gIW5vRGVjb2RlO1xuXG4gIC8vIENyeXB0byBpcyBraW5kIG9mIG9sZCBhbmQgY3J1c3R5LiAgSGlzdG9yaWNhbGx5LCBpdHMgZGVmYXVsdCBzdHJpbmdcbiAgLy8gZW5jb2RpbmcgaXMgJ2JpbmFyeScgc28gd2UgaGF2ZSB0byBtYWtlIHRoaXMgY29uZmlndXJhYmxlLlxuICAvLyBFdmVyeXRoaW5nIGVsc2UgaW4gdGhlIHVuaXZlcnNlIHVzZXMgJ3V0ZjgnLCB0aG91Z2guXG4gIHRoaXMuZGVmYXVsdEVuY29kaW5nID0gb3B0aW9ucy5kZWZhdWx0RW5jb2RpbmcgfHwgJ3V0ZjgnO1xuXG4gIC8vIG5vdCBhbiBhY3R1YWwgYnVmZmVyIHdlIGtlZXAgdHJhY2sgb2YsIGJ1dCBhIG1lYXN1cmVtZW50XG4gIC8vIG9mIGhvdyBtdWNoIHdlJ3JlIHdhaXRpbmcgdG8gZ2V0IHB1c2hlZCB0byBzb21lIHVuZGVybHlpbmdcbiAgLy8gc29ja2V0IG9yIGZpbGUuXG4gIHRoaXMubGVuZ3RoID0gMDtcblxuICAvLyBhIGZsYWcgdG8gc2VlIHdoZW4gd2UncmUgaW4gdGhlIG1pZGRsZSBvZiBhIHdyaXRlLlxuICB0aGlzLndyaXRpbmcgPSBmYWxzZTtcblxuICAvLyBhIGZsYWcgdG8gYmUgYWJsZSB0byB0ZWxsIGlmIHRoZSBvbndyaXRlIGNiIGlzIGNhbGxlZCBpbW1lZGlhdGVseSxcbiAgLy8gb3Igb24gYSBsYXRlciB0aWNrLiAgV2Ugc2V0IHRoaXMgdG8gdHJ1ZSBhdCBmaXJzdCwgYmVjdWFzZSBhbnlcbiAgLy8gYWN0aW9ucyB0aGF0IHNob3VsZG4ndCBoYXBwZW4gdW50aWwgXCJsYXRlclwiIHNob3VsZCBnZW5lcmFsbHkgYWxzb1xuICAvLyBub3QgaGFwcGVuIGJlZm9yZSB0aGUgZmlyc3Qgd3JpdGUgY2FsbC5cbiAgdGhpcy5zeW5jID0gdHJ1ZTtcblxuICAvLyBhIGZsYWcgdG8ga25vdyBpZiB3ZSdyZSBwcm9jZXNzaW5nIHByZXZpb3VzbHkgYnVmZmVyZWQgaXRlbXMsIHdoaWNoXG4gIC8vIG1heSBjYWxsIHRoZSBfd3JpdGUoKSBjYWxsYmFjayBpbiB0aGUgc2FtZSB0aWNrLCBzbyB0aGF0IHdlIGRvbid0XG4gIC8vIGVuZCB1cCBpbiBhbiBvdmVybGFwcGVkIG9ud3JpdGUgc2l0dWF0aW9uLlxuICB0aGlzLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcblxuICAvLyB0aGUgY2FsbGJhY2sgdGhhdCdzIHBhc3NlZCB0byBfd3JpdGUoY2h1bmssY2IpXG4gIHRoaXMub253cml0ZSA9IGZ1bmN0aW9uKGVyKSB7XG4gICAgb253cml0ZShzdHJlYW0sIGVyKTtcbiAgfTtcblxuICAvLyB0aGUgY2FsbGJhY2sgdGhhdCB0aGUgdXNlciBzdXBwbGllcyB0byB3cml0ZShjaHVuayxlbmNvZGluZyxjYilcbiAgdGhpcy53cml0ZWNiID0gbnVsbDtcblxuICAvLyB0aGUgYW1vdW50IHRoYXQgaXMgYmVpbmcgd3JpdHRlbiB3aGVuIF93cml0ZSBpcyBjYWxsZWQuXG4gIHRoaXMud3JpdGVsZW4gPSAwO1xuXG4gIHRoaXMuYnVmZmVyID0gW107XG59XG5cbmZ1bmN0aW9uIFdyaXRhYmxlKG9wdGlvbnMpIHtcbiAgLy8gV3JpdGFibGUgY3RvciBpcyBhcHBsaWVkIHRvIER1cGxleGVzLCB0aG91Z2ggdGhleSdyZSBub3RcbiAgLy8gaW5zdGFuY2VvZiBXcml0YWJsZSwgdGhleSdyZSBpbnN0YW5jZW9mIFJlYWRhYmxlLlxuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgV3JpdGFibGUpICYmICEodGhpcyBpbnN0YW5jZW9mIFN0cmVhbS5EdXBsZXgpKVxuICAgIHJldHVybiBuZXcgV3JpdGFibGUob3B0aW9ucyk7XG5cbiAgdGhpcy5fd3JpdGFibGVTdGF0ZSA9IG5ldyBXcml0YWJsZVN0YXRlKG9wdGlvbnMsIHRoaXMpO1xuXG4gIC8vIGxlZ2FjeS5cbiAgdGhpcy53cml0YWJsZSA9IHRydWU7XG5cbiAgU3RyZWFtLmNhbGwodGhpcyk7XG59XG5cbi8vIE90aGVyd2lzZSBwZW9wbGUgY2FuIHBpcGUgV3JpdGFibGUgc3RyZWFtcywgd2hpY2ggaXMganVzdCB3cm9uZy5cbldyaXRhYmxlLnByb3RvdHlwZS5waXBlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ0Nhbm5vdCBwaXBlLiBOb3QgcmVhZGFibGUuJykpO1xufTtcblxuXG5mdW5jdGlvbiB3cml0ZUFmdGVyRW5kKHN0cmVhbSwgc3RhdGUsIGNiKSB7XG4gIHZhciBlciA9IG5ldyBFcnJvcignd3JpdGUgYWZ0ZXIgZW5kJyk7XG4gIC8vIFRPRE86IGRlZmVyIGVycm9yIGV2ZW50cyBjb25zaXN0ZW50bHkgZXZlcnl3aGVyZSwgbm90IGp1c3QgdGhlIGNiXG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgdGltZXJzLnNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICBjYihlcik7XG4gIH0pO1xufVxuXG4vLyBJZiB3ZSBnZXQgc29tZXRoaW5nIHRoYXQgaXMgbm90IGEgYnVmZmVyLCBzdHJpbmcsIG51bGwsIG9yIHVuZGVmaW5lZCxcbi8vIGFuZCB3ZSdyZSBub3QgaW4gb2JqZWN0TW9kZSwgdGhlbiB0aGF0J3MgYW4gZXJyb3IuXG4vLyBPdGhlcndpc2Ugc3RyZWFtIGNodW5rcyBhcmUgYWxsIGNvbnNpZGVyZWQgdG8gYmUgb2YgbGVuZ3RoPTEsIGFuZCB0aGVcbi8vIHdhdGVybWFya3MgZGV0ZXJtaW5lIGhvdyBtYW55IG9iamVjdHMgdG8ga2VlcCBpbiB0aGUgYnVmZmVyLCByYXRoZXIgdGhhblxuLy8gaG93IG1hbnkgYnl0ZXMgb3IgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIHZhbGlkQ2h1bmsoc3RyZWFtLCBzdGF0ZSwgY2h1bmssIGNiKSB7XG4gIHZhciB2YWxpZCA9IHRydWU7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGNodW5rKSAmJlxuICAgICAgJ3N0cmluZycgIT09IHR5cGVvZiBjaHVuayAmJlxuICAgICAgY2h1bmsgIT09IG51bGwgJiZcbiAgICAgIGNodW5rICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICFzdGF0ZS5vYmplY3RNb2RlKSB7XG4gICAgdmFyIGVyID0gbmV3IFR5cGVFcnJvcignSW52YWxpZCBub24tc3RyaW5nL2J1ZmZlciBjaHVuaycpO1xuICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbiAgICB0aW1lcnMuc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgY2IoZXIpO1xuICAgIH0pO1xuICAgIHZhbGlkID0gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHZhbGlkO1xufVxuXG5Xcml0YWJsZS5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG4gIHZhciByZXQgPSBmYWxzZTtcblxuICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2IgPSBlbmNvZGluZztcbiAgICBlbmNvZGluZyA9IG51bGw7XG4gIH1cblxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSlcbiAgICBlbmNvZGluZyA9ICdidWZmZXInO1xuICBlbHNlIGlmICghZW5jb2RpbmcpXG4gICAgZW5jb2RpbmcgPSBzdGF0ZS5kZWZhdWx0RW5jb2Rpbmc7XG5cbiAgaWYgKHR5cGVvZiBjYiAhPT0gJ2Z1bmN0aW9uJylcbiAgICBjYiA9IGZ1bmN0aW9uKCkge307XG5cbiAgaWYgKHN0YXRlLmVuZGVkKVxuICAgIHdyaXRlQWZ0ZXJFbmQodGhpcywgc3RhdGUsIGNiKTtcbiAgZWxzZSBpZiAodmFsaWRDaHVuayh0aGlzLCBzdGF0ZSwgY2h1bmssIGNiKSlcbiAgICByZXQgPSB3cml0ZU9yQnVmZmVyKHRoaXMsIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcblxuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gZGVjb2RlQ2h1bmsoc3RhdGUsIGNodW5rLCBlbmNvZGluZykge1xuICBpZiAoIXN0YXRlLm9iamVjdE1vZGUgJiZcbiAgICAgIHN0YXRlLmRlY29kZVN0cmluZ3MgIT09IGZhbHNlICYmXG4gICAgICB0eXBlb2YgY2h1bmsgPT09ICdzdHJpbmcnKSB7XG4gICAgY2h1bmsgPSBuZXcgQnVmZmVyKGNodW5rLCBlbmNvZGluZyk7XG4gIH1cbiAgcmV0dXJuIGNodW5rO1xufVxuXG4vLyBpZiB3ZSdyZSBhbHJlYWR5IHdyaXRpbmcgc29tZXRoaW5nLCB0aGVuIGp1c3QgcHV0IHRoaXNcbi8vIGluIHRoZSBxdWV1ZSwgYW5kIHdhaXQgb3VyIHR1cm4uICBPdGhlcndpc2UsIGNhbGwgX3dyaXRlXG4vLyBJZiB3ZSByZXR1cm4gZmFsc2UsIHRoZW4gd2UgbmVlZCBhIGRyYWluIGV2ZW50LCBzbyBzZXQgdGhhdCBmbGFnLlxuZnVuY3Rpb24gd3JpdGVPckJ1ZmZlcihzdHJlYW0sIHN0YXRlLCBjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIGNodW5rID0gZGVjb2RlQ2h1bmsoc3RhdGUsIGNodW5rLCBlbmNvZGluZyk7XG4gIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcblxuICBzdGF0ZS5sZW5ndGggKz0gbGVuO1xuXG4gIHZhciByZXQgPSBzdGF0ZS5sZW5ndGggPCBzdGF0ZS5oaWdoV2F0ZXJNYXJrO1xuICBzdGF0ZS5uZWVkRHJhaW4gPSAhcmV0O1xuXG4gIGlmIChzdGF0ZS53cml0aW5nKVxuICAgIHN0YXRlLmJ1ZmZlci5wdXNoKG5ldyBXcml0ZVJlcShjaHVuaywgZW5jb2RpbmcsIGNiKSk7XG4gIGVsc2VcbiAgICBkb1dyaXRlKHN0cmVhbSwgc3RhdGUsIGxlbiwgY2h1bmssIGVuY29kaW5nLCBjYik7XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZG9Xcml0ZShzdHJlYW0sIHN0YXRlLCBsZW4sIGNodW5rLCBlbmNvZGluZywgY2IpIHtcbiAgc3RhdGUud3JpdGVsZW4gPSBsZW47XG4gIHN0YXRlLndyaXRlY2IgPSBjYjtcbiAgc3RhdGUud3JpdGluZyA9IHRydWU7XG4gIHN0YXRlLnN5bmMgPSB0cnVlO1xuICBzdHJlYW0uX3dyaXRlKGNodW5rLCBlbmNvZGluZywgc3RhdGUub253cml0ZSk7XG4gIHN0YXRlLnN5bmMgPSBmYWxzZTtcbn1cblxuZnVuY3Rpb24gb253cml0ZUVycm9yKHN0cmVhbSwgc3RhdGUsIHN5bmMsIGVyLCBjYikge1xuICBpZiAoc3luYylcbiAgICB0aW1lcnMuc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgY2IoZXIpO1xuICAgIH0pO1xuICBlbHNlXG4gICAgY2IoZXIpO1xuXG4gIHN0cmVhbS5lbWl0KCdlcnJvcicsIGVyKTtcbn1cblxuZnVuY3Rpb24gb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKSB7XG4gIHN0YXRlLndyaXRpbmcgPSBmYWxzZTtcbiAgc3RhdGUud3JpdGVjYiA9IG51bGw7XG4gIHN0YXRlLmxlbmd0aCAtPSBzdGF0ZS53cml0ZWxlbjtcbiAgc3RhdGUud3JpdGVsZW4gPSAwO1xufVxuXG5mdW5jdGlvbiBvbndyaXRlKHN0cmVhbSwgZXIpIHtcbiAgdmFyIHN0YXRlID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuICB2YXIgc3luYyA9IHN0YXRlLnN5bmM7XG4gIHZhciBjYiA9IHN0YXRlLndyaXRlY2I7XG5cbiAgb253cml0ZVN0YXRlVXBkYXRlKHN0YXRlKTtcblxuICBpZiAoZXIpXG4gICAgb253cml0ZUVycm9yKHN0cmVhbSwgc3RhdGUsIHN5bmMsIGVyLCBjYik7XG4gIGVsc2Uge1xuICAgIC8vIENoZWNrIGlmIHdlJ3JlIGFjdHVhbGx5IHJlYWR5IHRvIGZpbmlzaCwgYnV0IGRvbid0IGVtaXQgeWV0XG4gICAgdmFyIGZpbmlzaGVkID0gbmVlZEZpbmlzaChzdHJlYW0sIHN0YXRlKTtcblxuICAgIGlmICghZmluaXNoZWQgJiYgIXN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgJiYgc3RhdGUuYnVmZmVyLmxlbmd0aClcbiAgICAgIGNsZWFyQnVmZmVyKHN0cmVhbSwgc3RhdGUpO1xuXG4gICAgaWYgKHN5bmMpIHtcbiAgICAgIHRpbWVycy5zZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhZnRlcldyaXRlKHN0cmVhbSwgc3RhdGUsIGZpbmlzaGVkLCBjYik7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFmdGVyV3JpdGUoc3RyZWFtLCBzdGF0ZSwgZmluaXNoZWQsIGNiKSB7XG4gIGlmICghZmluaXNoZWQpXG4gICAgb253cml0ZURyYWluKHN0cmVhbSwgc3RhdGUpO1xuICBjYigpO1xuICBpZiAoZmluaXNoZWQpXG4gICAgZmluaXNoTWF5YmUoc3RyZWFtLCBzdGF0ZSk7XG59XG5cbi8vIE11c3QgZm9yY2UgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIG9uIG5leHRUaWNrLCBzbyB0aGF0IHdlIGRvbid0XG4vLyBlbWl0ICdkcmFpbicgYmVmb3JlIHRoZSB3cml0ZSgpIGNvbnN1bWVyIGdldHMgdGhlICdmYWxzZScgcmV0dXJuXG4vLyB2YWx1ZSwgYW5kIGhhcyBhIGNoYW5jZSB0byBhdHRhY2ggYSAnZHJhaW4nIGxpc3RlbmVyLlxuZnVuY3Rpb24gb253cml0ZURyYWluKHN0cmVhbSwgc3RhdGUpIHtcbiAgaWYgKHN0YXRlLmxlbmd0aCA9PT0gMCAmJiBzdGF0ZS5uZWVkRHJhaW4pIHtcbiAgICBzdGF0ZS5uZWVkRHJhaW4gPSBmYWxzZTtcbiAgICBzdHJlYW0uZW1pdCgnZHJhaW4nKTtcbiAgfVxufVxuXG5cbi8vIGlmIHRoZXJlJ3Mgc29tZXRoaW5nIGluIHRoZSBidWZmZXIgd2FpdGluZywgdGhlbiBwcm9jZXNzIGl0XG5mdW5jdGlvbiBjbGVhckJ1ZmZlcihzdHJlYW0sIHN0YXRlKSB7XG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSB0cnVlO1xuXG4gIGZvciAodmFyIGMgPSAwOyBjIDwgc3RhdGUuYnVmZmVyLmxlbmd0aDsgYysrKSB7XG4gICAgdmFyIGVudHJ5ID0gc3RhdGUuYnVmZmVyW2NdO1xuICAgIHZhciBjaHVuayA9IGVudHJ5LmNodW5rO1xuICAgIHZhciBlbmNvZGluZyA9IGVudHJ5LmVuY29kaW5nO1xuICAgIHZhciBjYiA9IGVudHJ5LmNhbGxiYWNrO1xuICAgIHZhciBsZW4gPSBzdGF0ZS5vYmplY3RNb2RlID8gMSA6IGNodW5rLmxlbmd0aDtcblxuICAgIGRvV3JpdGUoc3RyZWFtLCBzdGF0ZSwgbGVuLCBjaHVuaywgZW5jb2RpbmcsIGNiKTtcblxuICAgIC8vIGlmIHdlIGRpZG4ndCBjYWxsIHRoZSBvbndyaXRlIGltbWVkaWF0ZWx5LCB0aGVuXG4gICAgLy8gaXQgbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgaXQgZG9lcy5cbiAgICAvLyBhbHNvLCB0aGF0IG1lYW5zIHRoYXQgdGhlIGNodW5rIGFuZCBjYiBhcmUgY3VycmVudGx5XG4gICAgLy8gYmVpbmcgcHJvY2Vzc2VkLCBzbyBtb3ZlIHRoZSBidWZmZXIgY291bnRlciBwYXN0IHRoZW0uXG4gICAgaWYgKHN0YXRlLndyaXRpbmcpIHtcbiAgICAgIGMrKztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLmJ1ZmZlclByb2Nlc3NpbmcgPSBmYWxzZTtcbiAgaWYgKGMgPCBzdGF0ZS5idWZmZXIubGVuZ3RoKVxuICAgIHN0YXRlLmJ1ZmZlciA9IHN0YXRlLmJ1ZmZlci5zbGljZShjKTtcbiAgZWxzZVxuICAgIHN0YXRlLmJ1ZmZlci5sZW5ndGggPSAwO1xufVxuXG5Xcml0YWJsZS5wcm90b3R5cGUuX3dyaXRlID0gZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjYikge1xuICBjYihuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpKTtcbn07XG5cbldyaXRhYmxlLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbihjaHVuaywgZW5jb2RpbmcsIGNiKSB7XG4gIHZhciBzdGF0ZSA9IHRoaXMuX3dyaXRhYmxlU3RhdGU7XG5cbiAgaWYgKHR5cGVvZiBjaHVuayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gY2h1bms7XG4gICAgY2h1bmsgPSBudWxsO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYiA9IGVuY29kaW5nO1xuICAgIGVuY29kaW5nID0gbnVsbDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY2h1bmsgIT09ICd1bmRlZmluZWQnICYmIGNodW5rICE9PSBudWxsKVxuICAgIHRoaXMud3JpdGUoY2h1bmssIGVuY29kaW5nKTtcblxuICAvLyBpZ25vcmUgdW5uZWNlc3NhcnkgZW5kKCkgY2FsbHMuXG4gIGlmICghc3RhdGUuZW5kaW5nICYmICFzdGF0ZS5maW5pc2hlZClcbiAgICBlbmRXcml0YWJsZSh0aGlzLCBzdGF0ZSwgY2IpO1xufTtcblxuXG5mdW5jdGlvbiBuZWVkRmluaXNoKHN0cmVhbSwgc3RhdGUpIHtcbiAgcmV0dXJuIChzdGF0ZS5lbmRpbmcgJiZcbiAgICAgICAgICBzdGF0ZS5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgICAhc3RhdGUuZmluaXNoZWQgJiZcbiAgICAgICAgICAhc3RhdGUud3JpdGluZyk7XG59XG5cbmZ1bmN0aW9uIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpIHtcbiAgdmFyIG5lZWQgPSBuZWVkRmluaXNoKHN0cmVhbSwgc3RhdGUpO1xuICBpZiAobmVlZCkge1xuICAgIHN0YXRlLmZpbmlzaGVkID0gdHJ1ZTtcbiAgICBzdHJlYW0uZW1pdCgnZmluaXNoJyk7XG4gIH1cbiAgcmV0dXJuIG5lZWQ7XG59XG5cbmZ1bmN0aW9uIGVuZFdyaXRhYmxlKHN0cmVhbSwgc3RhdGUsIGNiKSB7XG4gIHN0YXRlLmVuZGluZyA9IHRydWU7XG4gIGZpbmlzaE1heWJlKHN0cmVhbSwgc3RhdGUpO1xuICBpZiAoY2IpIHtcbiAgICBpZiAoc3RhdGUuZmluaXNoZWQpXG4gICAgICB0aW1lcnMuc2V0SW1tZWRpYXRlKGNiKTtcbiAgICBlbHNlXG4gICAgICBzdHJlYW0ub25jZSgnZmluaXNoJywgY2IpO1xuICB9XG4gIHN0YXRlLmVuZGVkID0gdHJ1ZTtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4vLyBVVElMSVRZXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBzaGltcyA9IHJlcXVpcmUoJ19zaGltcycpO1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCBnZXRNZXNzYWdlKHRoaXMpO1xufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHJlcGxhY2VyKGtleSwgdmFsdWUpIHtcbiAgaWYgKHV0aWwuaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuICcnICsgdmFsdWU7XG4gIH1cbiAgaWYgKHV0aWwuaXNOdW1iZXIodmFsdWUpICYmIChpc05hTih2YWx1ZSkgfHwgIWlzRmluaXRlKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgfVxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKHZhbHVlKSB8fCB1dGlsLmlzUmVnRXhwKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodXRpbC5pc1N0cmluZyhzKSkge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKEpTT04uc3RyaW5naWZ5KHNlbGYuYWN0dWFsLCByZXBsYWNlciksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShKU09OLnN0cmluZ2lmeShzZWxmLmV4cGVjdGVkLCByZXBsYWNlciksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9IGVsc2UgaWYgKHV0aWwuaXNCdWZmZXIoYWN0dWFsKSAmJiB1dGlsLmlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIGlmIChhY3R1YWwubGVuZ3RoICE9IGV4cGVjdGVkLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY3R1YWwubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhY3R1YWxbaV0gIT09IGV4cGVjdGVkW2ldKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKCF1dGlsLmlzT2JqZWN0KGFjdHVhbCkgJiYgIXV0aWwuaXNPYmplY3QoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiKSB7XG4gIGlmICh1dGlsLmlzTnVsbE9yVW5kZWZpbmVkKGEpIHx8IHV0aWwuaXNOdWxsT3JVbmRlZmluZWQoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuXG4gIGlmIChhLnByb3RvdHlwZSAhPT0gYi5wcm90b3R5cGUpIHJldHVybiBmYWxzZTtcbiAgLy9+fn5JJ3ZlIG1hbmFnZWQgdG8gYnJlYWsgT2JqZWN0LmtleXMgdGhyb3VnaCBzY3Jld3kgYXJndW1lbnRzIHBhc3NpbmcuXG4gIC8vICAgQ29udmVydGluZyB0byBhcnJheSBzb2x2ZXMgdGhlIHByb2JsZW0uXG4gIGlmIChpc0FyZ3VtZW50cyhhKSkge1xuICAgIGlmICghaXNBcmd1bWVudHMoYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiKTtcbiAgfVxuICB0cnkge1xuICAgIHZhciBrYSA9IHNoaW1zLmtleXMoYSksXG4gICAgICAgIGtiID0gc2hpbXMua2V5cyhiKSxcbiAgICAgICAga2V5LCBpO1xuICB9IGNhdGNoIChlKSB7Ly9oYXBwZW5zIHdoZW4gb25lIGlzIGEgc3RyaW5nIGxpdGVyYWwgYW5kIHRoZSBvdGhlciBpc24ndFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldKSkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9IGVsc2UgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodXRpbC5pc1N0cmluZyhleHBlY3RlZCkpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgYWN0dWFsID0gZTtcbiAgfVxuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKCFzaG91bGRUaHJvdyAmJiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cy5hcHBseSh0aGlzLCBbdHJ1ZV0uY29uY2F0KHBTbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MuYXBwbHkodGhpcywgW2ZhbHNlXS5jb25jYXQocFNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikge3Rocm93IGVycjt9fTsiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghdXRpbC5pc051bWJlcihuKSB8fCBuIDwgMClcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKHV0aWwuaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAodXRpbC5pc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHV0aWwuaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKHV0aWwuaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIHV0aWwuaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAodXRpbC5pc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKHV0aWwuaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghdXRpbC5pc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAodXRpbC5pc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmICh1dGlsLmlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAodXRpbC5pc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKHV0aWwuaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmICh1dGlsLmlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07IiwiXG4vLyBub3QgaW1wbGVtZW50ZWRcbi8vIFRoZSByZWFzb24gZm9yIGhhdmluZyBhbiBlbXB0eSBmaWxlIGFuZCBub3QgdGhyb3dpbmcgaXMgdG8gYWxsb3dcbi8vIHVudHJhZGl0aW9uYWwgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtb2R1bGUuXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBTdHJlYW07XG5cbnZhciBFRSA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG51dGlsLmluaGVyaXRzKFN0cmVhbSwgRUUpO1xuU3RyZWFtLlJlYWRhYmxlID0gcmVxdWlyZSgnX3N0cmVhbV9yZWFkYWJsZScpO1xuU3RyZWFtLldyaXRhYmxlID0gcmVxdWlyZSgnX3N0cmVhbV93cml0YWJsZScpO1xuU3RyZWFtLkR1cGxleCA9IHJlcXVpcmUoJ19zdHJlYW1fZHVwbGV4Jyk7XG5TdHJlYW0uVHJhbnNmb3JtID0gcmVxdWlyZSgnX3N0cmVhbV90cmFuc2Zvcm0nKTtcblN0cmVhbS5QYXNzVGhyb3VnaCA9IHJlcXVpcmUoJ19zdHJlYW1fcGFzc3Rocm91Z2gnKTtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC40LnhcblN0cmVhbS5TdHJlYW0gPSBTdHJlYW07XG5cblxuXG4vLyBvbGQtc3R5bGUgc3RyZWFtcy4gIE5vdGUgdGhhdCB0aGUgcGlwZSBtZXRob2QgKHRoZSBvbmx5IHJlbGV2YW50XG4vLyBwYXJ0IG9mIHRoaXMgY2xhc3MpIGlzIG92ZXJyaWRkZW4gaW4gdGhlIFJlYWRhYmxlIGNsYXNzLlxuXG5mdW5jdGlvbiBTdHJlYW0oKSB7XG4gIEVFLmNhbGwodGhpcyk7XG59XG5cblN0cmVhbS5wcm90b3R5cGUucGlwZSA9IGZ1bmN0aW9uKGRlc3QsIG9wdGlvbnMpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXM7XG5cbiAgZnVuY3Rpb24gb25kYXRhKGNodW5rKSB7XG4gICAgaWYgKGRlc3Qud3JpdGFibGUpIHtcbiAgICAgIGlmIChmYWxzZSA9PT0gZGVzdC53cml0ZShjaHVuaykgJiYgc291cmNlLnBhdXNlKSB7XG4gICAgICAgIHNvdXJjZS5wYXVzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNvdXJjZS5vbignZGF0YScsIG9uZGF0YSk7XG5cbiAgZnVuY3Rpb24gb25kcmFpbigpIHtcbiAgICBpZiAoc291cmNlLnJlYWRhYmxlICYmIHNvdXJjZS5yZXN1bWUpIHtcbiAgICAgIHNvdXJjZS5yZXN1bWUoKTtcbiAgICB9XG4gIH1cblxuICBkZXN0Lm9uKCdkcmFpbicsIG9uZHJhaW4pO1xuXG4gIC8vIElmIHRoZSAnZW5kJyBvcHRpb24gaXMgbm90IHN1cHBsaWVkLCBkZXN0LmVuZCgpIHdpbGwgYmUgY2FsbGVkIHdoZW5cbiAgLy8gc291cmNlIGdldHMgdGhlICdlbmQnIG9yICdjbG9zZScgZXZlbnRzLiAgT25seSBkZXN0LmVuZCgpIG9uY2UuXG4gIGlmICghZGVzdC5faXNTdGRpbyAmJiAoIW9wdGlvbnMgfHwgb3B0aW9ucy5lbmQgIT09IGZhbHNlKSkge1xuICAgIHNvdXJjZS5vbignZW5kJywgb25lbmQpO1xuICAgIHNvdXJjZS5vbignY2xvc2UnLCBvbmNsb3NlKTtcbiAgfVxuXG4gIHZhciBkaWRPbkVuZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBvbmVuZCgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBkZXN0LmVuZCgpO1xuICB9XG5cblxuICBmdW5jdGlvbiBvbmNsb3NlKCkge1xuICAgIGlmIChkaWRPbkVuZCkgcmV0dXJuO1xuICAgIGRpZE9uRW5kID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgZGVzdC5kZXN0cm95ID09PSAnZnVuY3Rpb24nKSBkZXN0LmRlc3Ryb3koKTtcbiAgfVxuXG4gIC8vIGRvbid0IGxlYXZlIGRhbmdsaW5nIHBpcGVzIHdoZW4gdGhlcmUgYXJlIGVycm9ycy5cbiAgZnVuY3Rpb24gb25lcnJvcihlcikge1xuICAgIGNsZWFudXAoKTtcbiAgICBpZiAoRUUubGlzdGVuZXJDb3VudCh0aGlzLCAnZXJyb3InKSA9PT0gMCkge1xuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCBzdHJlYW0gZXJyb3IgaW4gcGlwZS5cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2Vycm9yJywgb25lcnJvcik7XG4gIGRlc3Qub24oJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgLy8gcmVtb3ZlIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZC5cbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2RhdGEnLCBvbmRhdGEpO1xuICAgIGRlc3QucmVtb3ZlTGlzdGVuZXIoJ2RyYWluJywgb25kcmFpbik7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Nsb3NlJywgb25jbG9zZSk7XG5cbiAgICBzb3VyY2UucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbmVycm9yKTtcblxuICAgIHNvdXJjZS5yZW1vdmVMaXN0ZW5lcignZW5kJywgY2xlYW51cCk7XG4gICAgc291cmNlLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIGNsZWFudXApO1xuXG4gICAgZGVzdC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBjbGVhbnVwKTtcbiAgfVxuXG4gIHNvdXJjZS5vbignZW5kJywgY2xlYW51cCk7XG4gIHNvdXJjZS5vbignY2xvc2UnLCBjbGVhbnVwKTtcblxuICBkZXN0Lm9uKCdjbG9zZScsIGNsZWFudXApO1xuXG4gIGRlc3QuZW1pdCgncGlwZScsIHNvdXJjZSk7XG5cbiAgLy8gQWxsb3cgZm9yIHVuaXgtbGlrZSB1c2FnZTogQS5waXBlKEIpLnBpcGUoQylcbiAgcmV0dXJuIGRlc3Q7XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdidWZmZXInKS5CdWZmZXI7XG5cbmZ1bmN0aW9uIGFzc2VydEVuY29kaW5nKGVuY29kaW5nKSB7XG4gIGlmIChlbmNvZGluZyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpO1xuICB9XG59XG5cbnZhciBTdHJpbmdEZWNvZGVyID0gZXhwb3J0cy5TdHJpbmdEZWNvZGVyID0gZnVuY3Rpb24oZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IChlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvWy1fXS8sICcnKTtcbiAgYXNzZXJ0RW5jb2RpbmcoZW5jb2RpbmcpO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIC8vIENFU1UtOCByZXByZXNlbnRzIGVhY2ggb2YgU3Vycm9nYXRlIFBhaXIgYnkgMy1ieXRlc1xuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgLy8gVVRGLTE2IHJlcHJlc2VudHMgZWFjaCBvZiBTdXJyb2dhdGUgUGFpciBieSAyLWJ5dGVzXG4gICAgICB0aGlzLnN1cnJvZ2F0ZVNpemUgPSAyO1xuICAgICAgdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhciA9IHV0ZjE2RGV0ZWN0SW5jb21wbGV0ZUNoYXI7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgLy8gQmFzZS02NCBzdG9yZXMgMyBieXRlcyBpbiA0IGNoYXJzLCBhbmQgcGFkcyB0aGUgcmVtYWluZGVyLlxuICAgICAgdGhpcy5zdXJyb2dhdGVTaXplID0gMztcbiAgICAgIHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcjtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aGlzLndyaXRlID0gcGFzc1Rocm91Z2hXcml0ZTtcbiAgICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMuY2hhckJ1ZmZlciA9IG5ldyBCdWZmZXIoNik7XG4gIHRoaXMuY2hhclJlY2VpdmVkID0gMDtcbiAgdGhpcy5jaGFyTGVuZ3RoID0gMDtcbn07XG5cblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgdmFyIGNoYXJTdHIgPSAnJztcbiAgdmFyIG9mZnNldCA9IDA7XG5cbiAgLy8gaWYgb3VyIGxhc3Qgd3JpdGUgZW5kZWQgd2l0aCBhbiBpbmNvbXBsZXRlIG11bHRpYnl0ZSBjaGFyYWN0ZXJcbiAgd2hpbGUgKHRoaXMuY2hhckxlbmd0aCkge1xuICAgIC8vIGRldGVybWluZSBob3cgbWFueSByZW1haW5pbmcgYnl0ZXMgdGhpcyBidWZmZXIgaGFzIHRvIG9mZmVyIGZvciB0aGlzIGNoYXJcbiAgICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IHRoaXMuY2hhckxlbmd0aCAtIHRoaXMuY2hhclJlY2VpdmVkKSA/XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFyTGVuZ3RoIC0gdGhpcy5jaGFyUmVjZWl2ZWQgOlxuICAgICAgICAgICAgICAgIGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAvLyBhZGQgdGhlIG5ldyBieXRlcyB0byB0aGUgY2hhciBidWZmZXJcbiAgICBidWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsIHRoaXMuY2hhclJlY2VpdmVkLCBvZmZzZXQsIGkpO1xuICAgIHRoaXMuY2hhclJlY2VpdmVkICs9IChpIC0gb2Zmc2V0KTtcbiAgICBvZmZzZXQgPSBpO1xuXG4gICAgaWYgKHRoaXMuY2hhclJlY2VpdmVkIDwgdGhpcy5jaGFyTGVuZ3RoKSB7XG4gICAgICAvLyBzdGlsbCBub3QgZW5vdWdoIGNoYXJzIGluIHRoaXMgYnVmZmVyPyB3YWl0IGZvciBtb3JlIC4uLlxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIGdldCB0aGUgY2hhcmFjdGVyIHRoYXQgd2FzIHNwbGl0XG4gICAgY2hhclN0ciA9IHRoaXMuY2hhckJ1ZmZlci5zbGljZSgwLCB0aGlzLmNoYXJMZW5ndGgpLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xuXG4gICAgLy8gbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoY2hhclN0ci5sZW5ndGggLSAxKTtcbiAgICBpZiAoY2hhckNvZGUgPj0gMHhEODAwICYmIGNoYXJDb2RlIDw9IDB4REJGRikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoICs9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICAgIGNoYXJTdHIgPSAnJztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB0aGlzLmNoYXJSZWNlaXZlZCA9IHRoaXMuY2hhckxlbmd0aCA9IDA7XG5cbiAgICAvLyBpZiB0aGVyZSBhcmUgbm8gbW9yZSBieXRlcyBpbiB0aGlzIGJ1ZmZlciwganVzdCBlbWl0IG91ciBjaGFyXG4gICAgaWYgKGkgPT0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuIGNoYXJTdHI7XG5cbiAgICAvLyBvdGhlcndpc2UgY3V0IG9mZiB0aGUgY2hhcmFjdGVycyBlbmQgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRoaXMgYnVmZmVyXG4gICAgYnVmZmVyID0gYnVmZmVyLnNsaWNlKGksIGJ1ZmZlci5sZW5ndGgpO1xuICAgIGJyZWFrO1xuICB9XG5cbiAgdmFyIGxlbkluY29tcGxldGUgPSB0aGlzLmRldGVjdEluY29tcGxldGVDaGFyKGJ1ZmZlcik7XG5cbiAgdmFyIGVuZCA9IGJ1ZmZlci5sZW5ndGg7XG4gIGlmICh0aGlzLmNoYXJMZW5ndGgpIHtcbiAgICAvLyBidWZmZXIgdGhlIGluY29tcGxldGUgY2hhcmFjdGVyIGJ5dGVzIHdlIGdvdFxuICAgIGJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgMCwgYnVmZmVyLmxlbmd0aCAtIGxlbkluY29tcGxldGUsIGVuZCk7XG4gICAgdGhpcy5jaGFyUmVjZWl2ZWQgPSBsZW5JbmNvbXBsZXRlO1xuICAgIGVuZCAtPSBsZW5JbmNvbXBsZXRlO1xuICB9XG5cbiAgY2hhclN0ciArPSBidWZmZXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgZW5kKTtcblxuICB2YXIgZW5kID0gY2hhclN0ci5sZW5ndGggLSAxO1xuICB2YXIgY2hhckNvZGUgPSBjaGFyU3RyLmNoYXJDb2RlQXQoZW5kKTtcbiAgLy8gbGVhZCBzdXJyb2dhdGUgKEQ4MDAtREJGRikgaXMgYWxzbyB0aGUgaW5jb21wbGV0ZSBjaGFyYWN0ZXJcbiAgaWYgKGNoYXJDb2RlID49IDB4RDgwMCAmJiBjaGFyQ29kZSA8PSAweERCRkYpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc3Vycm9nYXRlU2l6ZTtcbiAgICB0aGlzLmNoYXJMZW5ndGggKz0gc2l6ZTtcbiAgICB0aGlzLmNoYXJSZWNlaXZlZCArPSBzaXplO1xuICAgIHRoaXMuY2hhckJ1ZmZlci5jb3B5KHRoaXMuY2hhckJ1ZmZlciwgc2l6ZSwgMCwgc2l6ZSk7XG4gICAgdGhpcy5jaGFyQnVmZmVyLndyaXRlKGNoYXJTdHIuY2hhckF0KGNoYXJTdHIubGVuZ3RoIC0gMSksIHRoaXMuZW5jb2RpbmcpO1xuICAgIHJldHVybiBjaGFyU3RyLnN1YnN0cmluZygwLCBlbmQpO1xuICB9XG5cbiAgLy8gb3IganVzdCBlbWl0IHRoZSBjaGFyU3RyXG4gIHJldHVybiBjaGFyU3RyO1xufTtcblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZGV0ZWN0SW5jb21wbGV0ZUNoYXIgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgLy8gZGV0ZXJtaW5lIGhvdyBtYW55IGJ5dGVzIHdlIGhhdmUgdG8gY2hlY2sgYXQgdGhlIGVuZCBvZiB0aGlzIGJ1ZmZlclxuICB2YXIgaSA9IChidWZmZXIubGVuZ3RoID49IDMpID8gMyA6IGJ1ZmZlci5sZW5ndGg7XG5cbiAgLy8gRmlndXJlIG91dCBpZiBvbmUgb2YgdGhlIGxhc3QgaSBieXRlcyBvZiBvdXIgYnVmZmVyIGFubm91bmNlcyBhblxuICAvLyBpbmNvbXBsZXRlIGNoYXIuXG4gIGZvciAoOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGMgPSBidWZmZXJbYnVmZmVyLmxlbmd0aCAtIGldO1xuXG4gICAgLy8gU2VlIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVVRGLTgjRGVzY3JpcHRpb25cblxuICAgIC8vIDExMFhYWFhYXG4gICAgaWYgKGkgPT0gMSAmJiBjID4+IDUgPT0gMHgwNikge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTBYWFhYXG4gICAgaWYgKGkgPD0gMiAmJiBjID4+IDQgPT0gMHgwRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gMztcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDExMTEwWFhYXG4gICAgaWYgKGkgPD0gMyAmJiBjID4+IDMgPT0gMHgxRSkge1xuICAgICAgdGhpcy5jaGFyTGVuZ3RoID0gNDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufTtcblxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gIHZhciByZXMgPSAnJztcbiAgaWYgKGJ1ZmZlciAmJiBidWZmZXIubGVuZ3RoKVxuICAgIHJlcyA9IHRoaXMud3JpdGUoYnVmZmVyKTtcblxuICBpZiAodGhpcy5jaGFyUmVjZWl2ZWQpIHtcbiAgICB2YXIgY3IgPSB0aGlzLmNoYXJSZWNlaXZlZDtcbiAgICB2YXIgYnVmID0gdGhpcy5jaGFyQnVmZmVyO1xuICAgIHZhciBlbmMgPSB0aGlzLmVuY29kaW5nO1xuICAgIHJlcyArPSBidWYuc2xpY2UoMCwgY3IpLnRvU3RyaW5nKGVuYyk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufTtcblxuZnVuY3Rpb24gcGFzc1Rocm91Z2hXcml0ZShidWZmZXIpIHtcbiAgcmV0dXJuIGJ1ZmZlci50b1N0cmluZyh0aGlzLmVuY29kaW5nKTtcbn1cblxuZnVuY3Rpb24gdXRmMTZEZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdmFyIGluY29tcGxldGUgPSB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAyO1xuICB0aGlzLmNoYXJMZW5ndGggPSBpbmNvbXBsZXRlID8gMiA6IDA7XG4gIHJldHVybiBpbmNvbXBsZXRlO1xufVxuXG5mdW5jdGlvbiBiYXNlNjREZXRlY3RJbmNvbXBsZXRlQ2hhcihidWZmZXIpIHtcbiAgdmFyIGluY29tcGxldGUgPSB0aGlzLmNoYXJSZWNlaXZlZCA9IGJ1ZmZlci5sZW5ndGggJSAzO1xuICB0aGlzLmNoYXJMZW5ndGggPSBpbmNvbXBsZXRlID8gMyA6IDA7XG4gIHJldHVybiBpbmNvbXBsZXRlO1xufVxuIiwidHJ5IHtcbiAgICAvLyBPbGQgSUUgYnJvd3NlcnMgdGhhdCBkbyBub3QgY3VycnkgYXJndW1lbnRzXG4gICAgaWYgKCFzZXRUaW1lb3V0LmNhbGwpIHtcbiAgICAgICAgdmFyIHNsaWNlciA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbiAgICAgICAgZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gc2xpY2VyLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IHNsaWNlci5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICByZXR1cm4gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZXhwb3J0cy5zZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgZXhwb3J0cy5zZXRJbnRlcnZhbCA9IHNldEludGVydmFsO1xuICAgIH1cbiAgICBleHBvcnRzLmNsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICBleHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBjbGVhckludGVydmFsO1xuXG4gICAgaWYgKHdpbmRvdy5zZXRJbW1lZGlhdGUpIHtcbiAgICAgIGV4cG9ydHMuc2V0SW1tZWRpYXRlID0gd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICAgIGV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSB3aW5kb3cuY2xlYXJJbW1lZGlhdGU7XG4gICAgfVxuXG4gICAgLy8gQ2hyb21lIGFuZCBQaGFudG9tSlMgc2VlbXMgdG8gZGVwZW5kIG9uIGB0aGlzYCBwc2V1ZG8gdmFyaWFibGUgYmVpbmcgYVxuICAgIC8vIGB3aW5kb3dgIGFuZCB0aHJvd3MgaW52YWxpZCBpbnZvY2F0aW9uIGV4Y2VwdGlvbiBvdGhlcndpc2UuIElmIHRoaXMgY29kZVxuICAgIC8vIHJ1bnMgaW4gc3VjaCBKUyBydW50aW1lIG5leHQgbGluZSB3aWxsIHRocm93IGFuZCBgY2F0Y2hgIGNsYXVzZSB3aWxsXG4gICAgLy8gZXhwb3J0ZWQgdGltZXJzIGZ1bmN0aW9ucyBib3VuZCB0byBhIHdpbmRvdy5cbiAgICBleHBvcnRzLnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7fSk7XG59IGNhdGNoIChfKSB7XG4gICAgZnVuY3Rpb24gYmluZChmLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7IHJldHVybiBmLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cykgfTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGV4cG9ydHMuc2V0VGltZW91dCA9IGJpbmQoc2V0VGltZW91dCwgd2luZG93KTtcbiAgICAgIGV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBiaW5kKHNldEludGVydmFsLCB3aW5kb3cpO1xuICAgICAgZXhwb3J0cy5jbGVhclRpbWVvdXQgPSBiaW5kKGNsZWFyVGltZW91dCwgd2luZG93KTtcbiAgICAgIGV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGJpbmQoY2xlYXJJbnRlcnZhbCwgd2luZG93KTtcbiAgICAgIGlmICh3aW5kb3cuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIGV4cG9ydHMuc2V0SW1tZWRpYXRlID0gYmluZCh3aW5kb3cuc2V0SW1tZWRpYXRlLCB3aW5kb3cpO1xuICAgICAgICBleHBvcnRzLmNsZWFySW1tZWRpYXRlID0gYmluZCh3aW5kb3cuY2xlYXJJbW1lZGlhdGUsIHdpbmRvdyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZXhwb3J0cy5zZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygc2V0SW50ZXJ2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzLmNsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY2xlYXJJbnRlcnZhbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBleHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBjbGVhckludGVydmFsO1xuICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0cy51bnJlZiA9IGZ1bmN0aW9uIHVucmVmKCkge307XG5leHBvcnRzLnJlZiA9IGZ1bmN0aW9uIHJlZigpIHt9O1xuXG5pZiAoIWV4cG9ydHMuc2V0SW1tZWRpYXRlKSB7XG4gIHZhciBjdXJyZW50S2V5ID0gMCwgcXVldWUgPSB7fSwgYWN0aXZlID0gZmFsc2U7XG5cbiAgZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgZnVuY3Rpb24gZHJhaW4oKSB7XG4gICAgICAgIGFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcXVldWUpIHtcbiAgICAgICAgICBpZiAocXVldWUuaGFzT3duUHJvcGVydHkoY3VycmVudEtleSwga2V5KSkge1xuICAgICAgICAgICAgdmFyIGZuID0gcXVldWVba2V5XTtcbiAgICAgICAgICAgIGRlbGV0ZSBxdWV1ZVtrZXldO1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdicm93c2VyaWZ5LXRpY2snKSB7XG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGRyYWluKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgICAgICAgdmFyIGlkID0gKytjdXJyZW50S2V5O1xuICAgICAgICAgIHF1ZXVlW2lkXSA9IGZuO1xuICAgICAgICAgIGlmICghYWN0aXZlKSB7XG4gICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdicm93c2VyaWZ5LXRpY2snLCAnKicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgICAgICAgdmFyIGlkID0gKytjdXJyZW50S2V5O1xuICAgICAgICAgIHF1ZXVlW2lkXSA9IGZuO1xuICAgICAgICAgIGlmICghYWN0aXZlKSB7XG4gICAgICAgICAgICBhY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgc2V0VGltZW91dChkcmFpbiwgMCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgfSkoKTtcblxuICBleHBvcnRzLmNsZWFySW1tZWRpYXRlID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBzaGltcyA9IHJlcXVpcmUoJ19zaGltcycpO1xuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIHNoaW1zLmZvckVhY2goYXJyYXksIGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBzaGltcy5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IHNoaW1zLmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG5cbiAgc2hpbXMuZm9yRWFjaChrZXlzLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBzaGltcy5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoc2hpbXMuaW5kZXhPZihjdHguc2VlbiwgZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IHNoaW1zLnJlZHVjZShvdXRwdXQsIGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBzaGltcy5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZztcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJiBvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJztcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5iaW5hcnlTbGljZSA9PT0gJ2Z1bmN0aW9uJ1xuICA7XG59XG5leHBvcnRzLmlzQnVmZmVyID0gaXNCdWZmZXI7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IGZ1bmN0aW9uKGN0b3IsIHN1cGVyQ3Rvcikge1xuICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvcjtcbiAgY3Rvci5wcm90b3R5cGUgPSBzaGltcy5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogY3RvcixcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IHNoaW1zLmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsImV4cG9ydHMucmVhZElFRUU3NTQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNCRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNCRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNCRSA/IDEgOiAtMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlSUVFRTc1NCA9IGZ1bmN0aW9uKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKSxcbiAgICAgIGkgPSBpc0JFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0JFID8gLTEgOiAxLFxuICAgICAgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDtcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7XG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyODtcbn07XG4iLCJ2YXIgYXNzZXJ0O1xuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXI7XG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXI7XG5CdWZmZXIucG9vbFNpemUgPSA4MTkyO1xuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwO1xuXG5mdW5jdGlvbiBzdHJpbmd0cmltKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpO1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn1cblxuZnVuY3Rpb24gQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBvZmZzZXQpIHtcbiAgaWYoIWFzc2VydCkgYXNzZXJ0PSByZXF1aXJlKCdhc3NlcnQnKTtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgb2Zmc2V0KTtcbiAgfVxuICB0aGlzLnBhcmVudCA9IHRoaXM7XG4gIHRoaXMub2Zmc2V0ID0gMDtcblxuICAvLyBXb3JrLWFyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvblxuICAvLyBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5ncyB3aGlsZSBiYXNlNjQtanNcbiAgLy8gZG9lcyBub3QuLlxuICBpZiAoZW5jb2RpbmcgPT0gXCJiYXNlNjRcIiAmJiB0eXBlb2Ygc3ViamVjdCA9PSBcInN0cmluZ1wiKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdCk7XG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArIFwiPVwiOyBcbiAgICB9XG4gIH1cblxuICB2YXIgdHlwZTtcblxuICAvLyBBcmUgd2Ugc2xpY2luZz9cbiAgaWYgKHR5cGVvZiBvZmZzZXQgPT09ICdudW1iZXInKSB7XG4gICAgdGhpcy5sZW5ndGggPSBjb2VyY2UoZW5jb2RpbmcpO1xuICAgIC8vIHNsaWNpbmcgd29ya3MsIHdpdGggbGltaXRhdGlvbnMgKG5vIHBhcmVudCB0cmFja2luZy91cGRhdGUpXG4gICAgLy8gY2hlY2sgaHR0cHM6Ly9naXRodWIuY29tL3Rvb3RzL2J1ZmZlci1icm93c2VyaWZ5L2lzc3Vlcy8xOVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzW2ldID0gc3ViamVjdC5nZXQoaStvZmZzZXQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgICBzd2l0Y2ggKHR5cGUgPSB0eXBlb2Ygc3ViamVjdCkge1xuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgdGhpcy5sZW5ndGggPSBjb2VyY2Uoc3ViamVjdCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICB0aGlzLmxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ29iamVjdCc6IC8vIEFzc3VtZSBvYmplY3QgaXMgYW4gYXJyYXlcbiAgICAgICAgdGhpcy5sZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpO1xuICAgICAgICBicmVhaztcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnYXJyYXkgb3Igc3RyaW5nLicpO1xuICAgIH1cblxuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheS5cbiAgICBpZiAoaXNBcnJheUlzaChzdWJqZWN0KSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzdWJqZWN0IGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICAgICAgdGhpc1tpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXNbaV0gPSBzdWJqZWN0W2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdzdHJpbmcnKSB7XG4gICAgICAvLyBXZSBhcmUgYSBzdHJpbmdcbiAgICAgIHRoaXMubGVuZ3RoID0gdGhpcy53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZyk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXNbaV0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldChpKSB7XG4gIGlmIChpIDwgMCB8fCBpID49IHRoaXMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ29vYicpO1xuICByZXR1cm4gdGhpc1tpXTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KGksIHYpIHtcbiAgaWYgKGkgPCAwIHx8IGkgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignb29iJyk7XG4gIHJldHVybiB0aGlzW2ldID0gdjtcbn07XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChlbmNvZGluZyB8fCBcInV0ZjhcIikge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXR1cm4gc3RyLmxlbmd0aCAvIDI7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGg7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiBzdHIubGVuZ3RoO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnV0ZjhXcml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBieXRlcywgcG9zO1xuICByZXR1cm4gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCB0aGlzLCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIHRoaXMsIG9mZnNldCwgbGVuZ3RoKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYmluYXJ5V3JpdGUgPSBCdWZmZXIucHJvdG90eXBlLmFzY2lpV3JpdGU7XG5cbkJ1ZmZlci5wcm90b3R5cGUuYmFzZTY0V3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgYnl0ZXMsIHBvcztcbiAgcmV0dXJuIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIHRoaXMsIG9mZnNldCwgbGVuZ3RoKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUuYmFzZTY0U2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICByZXR1cm4gcmVxdWlyZShcImJhc2U2NC1qc1wiKS5mcm9tQnl0ZUFycmF5KGJ5dGVzKTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUudXRmOFNsaWNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgYnl0ZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgdmFyIHJlcyA9IFwiXCI7XG4gIHZhciB0bXAgPSBcIlwiO1xuICB2YXIgaSA9IDA7XG4gIHdoaWxlIChpIDwgYnl0ZXMubGVuZ3RoKSB7XG4gICAgaWYgKGJ5dGVzW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XG4gICAgICB0bXAgPSBcIlwiO1xuICAgIH0gZWxzZVxuICAgICAgdG1wICs9IFwiJVwiICsgYnl0ZXNbaV0udG9TdHJpbmcoMTYpO1xuXG4gICAgaSsrO1xuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuYXNjaWlTbGljZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGJ5dGVzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIHZhciByZXQgPSBcIlwiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKTtcbiAgcmV0dXJuIHJldDtcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5iaW5hcnlTbGljZSA9IEJ1ZmZlci5wcm90b3R5cGUuYXNjaWlTbGljZTtcblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBvdXQgPSBbXSxcbiAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSk7XG4gICAgaWYgKGkgPT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+Jztcbn07XG5cblxuQnVmZmVyLnByb3RvdHlwZS5oZXhTbGljZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDA7XG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW47XG5cbiAgdmFyIG91dCA9ICcnO1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleCh0aGlzW2ldKTtcbiAgfVxuICByZXR1cm4gb3V0O1xufTtcblxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpO1xuICBzdGFydCA9ICtzdGFydCB8fCAwO1xuICBpZiAodHlwZW9mIGVuZCA9PSAndW5kZWZpbmVkJykgZW5kID0gdGhpcy5sZW5ndGg7XG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoK2VuZCA9PSBzdGFydCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0dXJuIHRoaXMuaGV4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXR1cm4gdGhpcy51dGY4U2xpY2Uoc3RhcnQsIGVuZCk7XG5cbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXR1cm4gdGhpcy5hc2NpaVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldHVybiB0aGlzLmJpbmFyeVNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldHVybiB0aGlzLmJhc2U2NFNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgICAgcmV0dXJuIHRoaXMudWNzMlNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpO1xuICB9XG59O1xuXG5cbkJ1ZmZlci5wcm90b3R5cGUuaGV4V3JpdGUgPSBmdW5jdGlvbihzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9ICtvZmZzZXQgfHwgMDtcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0O1xuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSArbGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZztcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aDtcbiAgaWYgKHN0ckxlbiAlIDIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGV4IHN0cmluZycpO1xuICB9XG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMjtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpO1xuICAgIGlmIChpc05hTihieXRlKSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKTtcbiAgICB0aGlzW29mZnNldCArIGldID0gYnl0ZTtcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyO1xuICByZXR1cm4gaTtcbn07XG5cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoO1xuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2Rpbmc7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXQ7XG4gICAgb2Zmc2V0ID0gbGVuZ3RoO1xuICAgIGxlbmd0aCA9IHN3YXA7XG4gIH1cblxuICBvZmZzZXQgPSArb2Zmc2V0IHx8IDA7XG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gK2xlbmd0aDtcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmc7XG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKTtcblxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldHVybiB0aGlzLmhleFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0dXJuIHRoaXMudXRmOFdyaXRlKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpO1xuXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0dXJuIHRoaXMuYXNjaWlXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXR1cm4gdGhpcy5iaW5hcnlXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXR1cm4gdGhpcy5iYXNlNjRXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIHJldHVybiB0aGlzLnVjczJXcml0ZShzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKTtcbiAgfVxufTtcblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW47XG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXg7XG4gIGluZGV4ICs9IGxlbjtcbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleDtcbiAgcmV0dXJuIDA7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKTtcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbik7XG4gIHJldHVybiBuZXcgQnVmZmVyKHRoaXMsIGVuZCAtIHN0YXJ0LCArc3RhcnQpO1xufTtcblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24odGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXM7XG4gIHN0YXJ0IHx8IChzdGFydCA9IDApO1xuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgaXNOYU4oZW5kKSkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoO1xuICB9XG4gIHRhcmdldF9zdGFydCB8fCAodGFyZ2V0X3N0YXJ0ID0gMCk7XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0Jyk7XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMDtcbiAgaWYgKHRhcmdldC5sZW5ndGggPT0gMCB8fCBzb3VyY2UubGVuZ3RoID09IDApIHJldHVybiAwO1xuXG4gIGlmICh0YXJnZXRfc3RhcnQgPCAwIHx8IHRhcmdldF9zdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IHN0YXJ0ID49IHNvdXJjZS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKTtcbiAgfVxuXG4gIGlmIChlbmQgPCAwIHx8IGVuZCA+IHNvdXJjZS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aDtcbiAgfVxuXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnQ7XG4gIH1cblxuICB2YXIgdGVtcCA9IFtdO1xuICBmb3IgKHZhciBpPXN0YXJ0OyBpPGVuZDsgaSsrKSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiB0aGlzW2ldICE9PSAndW5kZWZpbmVkJywgXCJjb3B5aW5nIHVuZGVmaW5lZCBidWZmZXIgYnl0ZXMhXCIpO1xuICAgIHRlbXAucHVzaCh0aGlzW2ldKTtcbiAgfVxuXG4gIGZvciAodmFyIGk9dGFyZ2V0X3N0YXJ0OyBpPHRhcmdldF9zdGFydCt0ZW1wLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0W2ldID0gdGVtcFtpLXRhcmdldF9zdGFydF07XG4gIH1cbn07XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICB2YWx1ZSB8fCAodmFsdWUgPSAwKTtcbiAgc3RhcnQgfHwgKHN0YXJ0ID0gMCk7XG4gIGVuZCB8fCAoZW5kID0gdGhpcy5sZW5ndGgpO1xuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApO1xuICB9XG4gIGlmICghKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHx8IGlzTmFOKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndmFsdWUgaXMgbm90IGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIHRocm93IG5ldyBFcnJvcignZW5kIDwgc3RhcnQnKTtcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVybiAwO1xuICBpZiAodGhpcy5sZW5ndGggPT0gMCkgcmV0dXJuIDA7XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc3RhcnQgb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgaWYgKGVuZCA8IDAgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2VuZCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZTtcbiAgfVxufVxuXG4vLyBTdGF0aWMgbWV0aG9kc1xuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICByZXR1cm4gYiBpbnN0YW5jZW9mIEJ1ZmZlciB8fCBiIGluc3RhbmNlb2YgQnVmZmVyO1xufTtcblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbiBcXFxuICAgICAgbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuXCIpO1xuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMCk7XG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGJ1ZiA9IGxpc3RbaV07XG4gICAgICB0b3RhbExlbmd0aCArPSBidWYubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHZhciBidWZmZXIgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKTtcbiAgdmFyIHBvcyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBidWYgPSBsaXN0W2ldO1xuICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKTtcbiAgICBwb3MgKz0gYnVmLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gYnVmZmVyO1xufTtcblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbihlbmNvZGluZykge1xuICBzd2l0Y2ggKChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbi8vIGhlbHBlcnNcblxuZnVuY3Rpb24gY29lcmNlKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpO1xuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGg7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHxcbiAgICBmdW5jdGlvbihzdWJqZWN0KXtcbiAgICAgIHJldHVybiB7fS50b1N0cmluZy5hcHBseShzdWJqZWN0KSA9PSAnW29iamVjdCBBcnJheV0nXG4gICAgfSlcbiAgICAoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheUlzaChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIHRvSGV4KG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpO1xuICByZXR1cm4gbi50b1N0cmluZygxNik7XG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKVxuICAgIGlmIChzdHIuY2hhckNvZGVBdChpKSA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpO1xuICAgIGVsc2Uge1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLmNoYXJBdChpKSkuc3Vic3RyKDEpLnNwbGl0KCclJyk7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSk7XG4gICAgfVxuXG4gIHJldHVybiBieXRlQXJyYXk7XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyhzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrIClcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaCggc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGICk7XG5cbiAgcmV0dXJuIGJ5dGVBcnJheTtcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyhzdHIpIHtcbiAgcmV0dXJuIHJlcXVpcmUoXCJiYXNlNjQtanNcIikudG9CeXRlQXJyYXkoc3RyKTtcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlcihzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvcywgaSA9IDA7XG4gIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgaWYgKChpK29mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrO1xuXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldO1xuICAgIGkrKztcbiAgfVxuICByZXR1cm4gaTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpOyAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vLyByZWFkL3dyaXRlIGJpdC10d2lkZGxpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuO1xuXG4gIHJldHVybiBidWZmZXJbb2Zmc2V0XTtcbn07XG5cbmZ1bmN0aW9uIHJlYWRVSW50MTYoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YXIgdmFsID0gMDtcblxuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuIDA7XG5cbiAgaWYgKGlzQmlnRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmZmVyW29mZnNldF0gPDwgODtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgIHZhbCB8PSBidWZmZXJbb2Zmc2V0ICsgMV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZmZlcltvZmZzZXRdO1xuICAgIGlmIChvZmZzZXQgKyAxIDwgYnVmZmVyLmxlbmd0aCkge1xuICAgICAgdmFsIHw9IGJ1ZmZlcltvZmZzZXQgKyAxXSA8PCA4O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkVUludDMyKGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIHZhbCA9IDA7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgaWYgKG9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSByZXR1cm4gMDtcblxuICBpZiAoaXNCaWdFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgPSBidWZmZXJbb2Zmc2V0ICsgMV0gPDwgMTY7XG4gICAgaWYgKG9mZnNldCArIDIgPCBidWZmZXIubGVuZ3RoKVxuICAgICAgdmFsIHw9IGJ1ZmZlcltvZmZzZXQgKyAyXSA8PCA4O1xuICAgIGlmIChvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aClcbiAgICAgIHZhbCB8PSBidWZmZXJbb2Zmc2V0ICsgM107XG4gICAgdmFsID0gdmFsICsgKGJ1ZmZlcltvZmZzZXRdIDw8IDI0ID4+PiAwKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgPSBidWZmZXJbb2Zmc2V0ICsgMl0gPDwgMTY7XG4gICAgaWYgKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoKVxuICAgICAgdmFsIHw9IGJ1ZmZlcltvZmZzZXQgKyAxXSA8PCA4O1xuICAgIHZhbCB8PSBidWZmZXJbb2Zmc2V0XTtcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgpXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmZmVyW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKTtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5cbi8qXG4gKiBTaWduZWQgaW50ZWdlciB0eXBlcywgeWF5IHRlYW0hIEEgcmVtaW5kZXIgb24gaG93IHR3bydzIGNvbXBsZW1lbnQgYWN0dWFsbHlcbiAqIHdvcmtzLiBUaGUgZmlyc3QgYml0IGlzIHRoZSBzaWduZWQgYml0LCBpLmUuIHRlbGxzIHVzIHdoZXRoZXIgb3Igbm90IHRoZVxuICogbnVtYmVyIHNob3VsZCBiZSBwb3NpdGl2ZSBvciBuZWdhdGl2ZS4gSWYgdGhlIHR3bydzIGNvbXBsZW1lbnQgdmFsdWUgaXNcbiAqIHBvc2l0aXZlLCB0aGVuIHdlJ3JlIGRvbmUsIGFzIGl0J3MgZXF1aXZhbGVudCB0byB0aGUgdW5zaWduZWQgcmVwcmVzZW50YXRpb24uXG4gKlxuICogTm93IGlmIHRoZSBudW1iZXIgaXMgcG9zaXRpdmUsIHlvdSdyZSBwcmV0dHkgbXVjaCBkb25lLCB5b3UgY2FuIGp1c3QgbGV2ZXJhZ2VcbiAqIHRoZSB1bnNpZ25lZCB0cmFuc2xhdGlvbnMgYW5kIHJldHVybiB0aG9zZS4gVW5mb3J0dW5hdGVseSwgbmVnYXRpdmUgbnVtYmVyc1xuICogYXJlbid0IHF1aXRlIHRoYXQgc3RyYWlnaHRmb3J3YXJkLlxuICpcbiAqIEF0IGZpcnN0IGdsYW5jZSwgb25lIG1pZ2h0IGJlIGluY2xpbmVkIHRvIHVzZSB0aGUgdHJhZGl0aW9uYWwgZm9ybXVsYSB0b1xuICogdHJhbnNsYXRlIGJpbmFyeSBudW1iZXJzIGJldHdlZW4gdGhlIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSB2YWx1ZXMgaW4gdHdvJ3NcbiAqIGNvbXBsZW1lbnQuIChUaG91Z2ggaXQgZG9lc24ndCBxdWl0ZSB3b3JrIGZvciB0aGUgbW9zdCBuZWdhdGl2ZSB2YWx1ZSlcbiAqIE1haW5seTpcbiAqICAtIGludmVydCBhbGwgdGhlIGJpdHNcbiAqICAtIGFkZCBvbmUgdG8gdGhlIHJlc3VsdFxuICpcbiAqIE9mIGNvdXJzZSwgdGhpcyBkb2Vzbid0IHF1aXRlIHdvcmsgaW4gSmF2YXNjcmlwdC4gVGFrZSBmb3IgZXhhbXBsZSB0aGUgdmFsdWVcbiAqIG9mIC0xMjguIFRoaXMgY291bGQgYmUgcmVwcmVzZW50ZWQgaW4gMTYgYml0cyAoYmlnLWVuZGlhbikgYXMgMHhmZjgwLiBCdXQgb2ZcbiAqIGNvdXJzZSwgSmF2YXNjcmlwdCB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6XG4gKlxuICogPiB+MHhmZjgwXG4gKiAtNjU0MDlcbiAqXG4gKiBXaG9oIHRoZXJlLCBKYXZhc2NyaXB0LCB0aGF0J3Mgbm90IHF1aXRlIHJpZ2h0LiBCdXQgd2FpdCwgYWNjb3JkaW5nIHRvXG4gKiBKYXZhc2NyaXB0IHRoYXQncyBwZXJmZWN0bHkgY29ycmVjdC4gV2hlbiBKYXZhc2NyaXB0IGVuZHMgdXAgc2VlaW5nIHRoZVxuICogY29uc3RhbnQgMHhmZjgwLCBpdCBoYXMgbm8gbm90aW9uIHRoYXQgaXQgaXMgYWN0dWFsbHkgYSBzaWduZWQgbnVtYmVyLiBJdFxuICogYXNzdW1lcyB0aGF0IHdlJ3ZlIGlucHV0IHRoZSB1bnNpZ25lZCB2YWx1ZSAweGZmODAuIFRodXMsIHdoZW4gaXQgZG9lcyB0aGVcbiAqIGJpbmFyeSBuZWdhdGlvbiwgaXQgY2FzdHMgaXQgaW50byBhIHNpZ25lZCB2YWx1ZSwgKHBvc2l0aXZlIDB4ZmY4MCkuIFRoZW5cbiAqIHdoZW4geW91IHBlcmZvcm0gYmluYXJ5IG5lZ2F0aW9uIG9uIHRoYXQsIGl0IHR1cm5zIGl0IGludG8gYSBuZWdhdGl2ZSBudW1iZXIuXG4gKlxuICogSW5zdGVhZCwgd2UncmUgZ29pbmcgdG8gaGF2ZSB0byB1c2UgdGhlIGZvbGxvd2luZyBnZW5lcmFsIGZvcm11bGEsIHRoYXQgd29ya3NcbiAqIGluIGEgcmF0aGVyIEphdmFzY3JpcHQgZnJpZW5kbHkgd2F5LiBJJ20gZ2xhZCB3ZSBkb24ndCBzdXBwb3J0IHRoaXMga2luZCBvZlxuICogd2VpcmQgbnVtYmVyaW5nIHNjaGVtZSBpbiB0aGUga2VybmVsLlxuICpcbiAqIChCSVQtTUFYIC0gKHVuc2lnbmVkKXZhbCArIDEpICogLTFcbiAqXG4gKiBUaGUgYXN0dXRlIG9ic2VydmVyLCBtYXkgdGhpbmsgdGhhdCB0aGlzIGRvZXNuJ3QgbWFrZSBzZW5zZSBmb3IgOC1iaXQgbnVtYmVyc1xuICogKHJlYWxseSBpdCBpc24ndCBuZWNlc3NhcnkgZm9yIHRoZW0pLiBIb3dldmVyLCB3aGVuIHlvdSBnZXQgMTYtYml0IG51bWJlcnMsXG4gKiB5b3UgZG8uIExldCdzIGdvIGJhY2sgdG8gb3VyIHByaW9yIGV4YW1wbGUgYW5kIHNlZSBob3cgdGhpcyB3aWxsIGxvb2s6XG4gKlxuICogKDB4ZmZmZiAtIDB4ZmY4MCArIDEpICogLTFcbiAqICgweDAwN2YgKyAxKSAqIC0xXG4gKiAoMHgwMDgwKSAqIC0xXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuICB2YXIgbmVnO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuO1xuXG4gIG5lZyA9IGJ1ZmZlcltvZmZzZXRdICYgMHg4MDtcbiAgaWYgKCFuZWcpIHtcbiAgICByZXR1cm4gKGJ1ZmZlcltvZmZzZXRdKTtcbiAgfVxuXG4gIHJldHVybiAoKDB4ZmYgLSBidWZmZXJbb2Zmc2V0XSArIDEpICogLTEpO1xufTtcblxuZnVuY3Rpb24gcmVhZEludDE2KGJ1ZmZlciwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFyIG5lZywgdmFsO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcbiAgfVxuXG4gIHZhbCA9IHJlYWRVSW50MTYoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCk7XG4gIG5lZyA9IHZhbCAmIDB4ODAwMDtcbiAgaWYgKCFuZWcpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkSW50MzIoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YXIgbmVnLCB2YWw7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgdmFsID0gcmVhZFVJbnQzMihidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgbmVnID0gdmFsICYgMHg4MDAwMDAwMDtcbiAgaWYgKCFuZWcpIHtcbiAgICByZXR1cm4gKHZhbCk7XG4gIH1cblxuICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiByZWFkRmxvYXQoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS5yZWFkSUVFRTc1NChidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sXG4gICAgICAyMywgNCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbihvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiByZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHJlYWREb3VibGUoYnVmZmVyLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgNyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuICB9XG5cbiAgcmV0dXJuIHJlcXVpcmUoJy4vYnVmZmVyX2llZWU3NTQnKS5yZWFkSUVFRTc1NChidWZmZXIsIG9mZnNldCwgaXNCaWdFbmRpYW4sXG4gICAgICA1MiwgOCk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24ob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydCk7XG59O1xuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHJlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdCBpc1xuICogbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3QgZXhjZWVkIHRoZVxuICogbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICpcbiAqICAgICAgdmFsdWUgICAgICAgICAgIFRoZSBudW1iZXIgdG8gY2hlY2sgZm9yIHZhbGlkaXR5XG4gKlxuICogICAgICBtYXggICAgICAgICAgICAgVGhlIG1heGltdW0gdmFsdWVcbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50KHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0Lm9rKHR5cGVvZiAodmFsdWUpID09ICdudW1iZXInLFxuICAgICAgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKTtcblxuICBhc3NlcnQub2sodmFsdWUgPj0gMCxcbiAgICAgICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJyk7XG5cbiAgYXNzZXJ0Lm9rKE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jyk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhciBidWZmZXIgPSB0aGlzO1xuXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZik7XG4gIH1cblxuICBpZiAob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCkge1xuICAgIGJ1ZmZlcltvZmZzZXRdID0gdmFsdWU7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHdyaXRlVUludDE2KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMSA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgTWF0aC5taW4oYnVmZmVyLmxlbmd0aCAtIG9mZnNldCwgMik7IGkrKykge1xuICAgIGJ1ZmZlcltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGlzQmlnRW5kaWFuID8gMSAtIGkgOiBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChpc0JpZ0VuZGlhbiA/IDEgLSBpIDogaSkgKiA4O1xuICB9XG5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlVUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZik7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IE1hdGgubWluKGJ1ZmZlci5sZW5ndGggLSBvZmZzZXQsIDQpOyBpKyspIHtcbiAgICBidWZmZXJbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChpc0JpZ0VuZGlhbiA/IDMgLSBpIDogaSkgKiA4KSAmIDB4ZmY7XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cblxuLypcbiAqIFdlIG5vdyBtb3ZlIG9udG8gb3VyIGZyaWVuZHMgaW4gdGhlIHNpZ25lZCBudW1iZXIgY2F0ZWdvcnkuIFVubGlrZSB1bnNpZ25lZFxuICogbnVtYmVycywgd2UncmUgZ29pbmcgdG8gaGF2ZSB0byB3b3JyeSBhIGJpdCBtb3JlIGFib3V0IGhvdyB3ZSBwdXQgdmFsdWVzIGludG9cbiAqIGFycmF5cy4gU2luY2Ugd2UgYXJlIG9ubHkgd29ycnlpbmcgYWJvdXQgc2lnbmVkIDMyLWJpdCB2YWx1ZXMsIHdlJ3JlIGluXG4gKiBzbGlnaHRseSBiZXR0ZXIgc2hhcGUuIFVuZm9ydHVuYXRlbHksIHdlIHJlYWxseSBjYW4ndCBkbyBvdXIgZmF2b3JpdGUgYmluYXJ5XG4gKiAmIGluIHRoaXMgc3lzdGVtLiBJdCByZWFsbHkgc2VlbXMgdG8gZG8gdGhlIHdyb25nIHRoaW5nLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiA+IC0zMiAmIDB4ZmZcbiAqIDIyNFxuICpcbiAqIFdoYXQncyBoYXBwZW5pbmcgYWJvdmUgaXMgcmVhbGx5OiAweGUwICYgMHhmZiA9IDB4ZTAuIEhvd2V2ZXIsIHRoZSByZXN1bHRzIG9mXG4gKiB0aGlzIGFyZW4ndCB0cmVhdGVkIGFzIGEgc2lnbmVkIG51bWJlci4gVWx0aW1hdGVseSBhIGJhZCB0aGluZy5cbiAqXG4gKiBXaGF0IHdlJ3JlIGdvaW5nIHRvIHdhbnQgdG8gZG8gaXMgYmFzaWNhbGx5IGNyZWF0ZSB0aGUgdW5zaWduZWQgZXF1aXZhbGVudCBvZlxuICogb3VyIHJlcHJlc2VudGF0aW9uIGFuZCBwYXNzIHRoYXQgb2ZmIHRvIHRoZSB3dWludCogZnVuY3Rpb25zLiBUbyBkbyB0aGF0XG4gKiB3ZSdyZSBnb2luZyB0byBkbyB0aGUgZm9sbG93aW5nOlxuICpcbiAqICAtIGlmIHRoZSB2YWx1ZSBpcyBwb3NpdGl2ZVxuICogICAgICB3ZSBjYW4gcGFzcyBpdCBkaXJlY3RseSBvZmYgdG8gdGhlIGVxdWl2YWxlbnQgd3VpbnRcbiAqICAtIGlmIHRoZSB2YWx1ZSBpcyBuZWdhdGl2ZVxuICogICAgICB3ZSBkbyB0aGUgZm9sbG93aW5nIGNvbXB1dGF0aW9uOlxuICogICAgICAgICBtYiArIHZhbCArIDEsIHdoZXJlXG4gKiAgICAgICAgIG1iICAgaXMgdGhlIG1heGltdW0gdW5zaWduZWQgdmFsdWUgaW4gdGhhdCBieXRlIHNpemVcbiAqICAgICAgICAgdmFsICBpcyB0aGUgSmF2YXNjcmlwdCBuZWdhdGl2ZSBpbnRlZ2VyXG4gKlxuICpcbiAqIEFzIGEgY29uY3JldGUgdmFsdWUsIHRha2UgLTEyOC4gSW4gc2lnbmVkIDE2IGJpdHMgdGhpcyB3b3VsZCBiZSAweGZmODAuIElmXG4gKiB5b3UgZG8gb3V0IHRoZSBjb21wdXRhdGlvbnM6XG4gKlxuICogMHhmZmZmIC0gMTI4ICsgMVxuICogMHhmZmZmIC0gMTI3XG4gKiAweGZmODBcbiAqXG4gKiBZb3UgY2FuIHRoZW4gZW5jb2RlIHRoaXMgdmFsdWUgYXMgdGhlIHNpZ25lZCB2ZXJzaW9uLiBUaGlzIGlzIHJlYWxseSByYXRoZXJcbiAqIGhhY2t5LCBidXQgaXQgc2hvdWxkIHdvcmsgYW5kIGdldCB0aGUgam9iIGRvbmUgd2hpY2ggaXMgb3VyIGdvYWwgaGVyZS5cbiAqL1xuXG4vKlxuICogQSBzZXJpZXMgb2YgY2hlY2tzIHRvIG1ha2Ugc3VyZSB3ZSBhY3R1YWxseSBoYXZlIGEgc2lnbmVkIDMyLWJpdCBudW1iZXJcbiAqL1xuZnVuY3Rpb24gdmVyaWZzaW50KHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQub2sodHlwZW9mICh2YWx1ZSkgPT0gJ251bWJlcicsXG4gICAgICAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKTtcblxuICBhc3NlcnQub2sodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayhNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpO1xufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydC5vayh0eXBlb2YgKHZhbHVlKSA9PSAnbnVtYmVyJyxcbiAgICAgICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJyk7XG5cbiAgYXNzZXJ0Lm9rKHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpO1xuXG4gIGFzc2VydC5vayh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJyk7XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFyIGJ1ZmZlciA9IHRoaXM7XG5cbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0IDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MCk7XG4gIH1cblxuICBpZiAodmFsdWUgPj0gMCkge1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KTtcbiAgfVxufTtcblxuZnVuY3Rpb24gd3JpdGVJbnQxNihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDEgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMCk7XG4gIH1cblxuICBpZiAodmFsdWUgPj0gMCkge1xuICAgIHdyaXRlVUludDE2KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICB3cml0ZVVJbnQxNihidWZmZXIsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpO1xuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KTtcbn07XG5cbmZ1bmN0aW9uIHdyaXRlSW50MzIoYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0JpZ0VuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydC5vayh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyB2YWx1ZScpO1xuXG4gICAgYXNzZXJ0Lm9rKHR5cGVvZiAoaXNCaWdFbmRpYW4pID09PSAnYm9vbGVhbicsXG4gICAgICAgICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgKyAzIDwgYnVmZmVyLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpO1xuXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMCk7XG4gIH1cblxuICBpZiAodmFsdWUgPj0gMCkge1xuICAgIHdyaXRlVUludDMyKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfSBlbHNlIHtcbiAgICB3cml0ZVVJbnQzMihidWZmZXIsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KTtcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZUZsb2F0KGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNCaWdFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQub2sodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3NpbmcgdmFsdWUnKTtcblxuICAgIGFzc2VydC5vayh0eXBlb2YgKGlzQmlnRW5kaWFuKSA9PT0gJ2Jvb2xlYW4nLFxuICAgICAgICAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0Jyk7XG5cbiAgICBhc3NlcnQub2sob2Zmc2V0ICsgMyA8IGJ1ZmZlci5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKTtcblxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpO1xuICB9XG5cbiAgcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLndyaXRlSUVFRTc1NChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLFxuICAgICAgMjMsIDQpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KTtcbn07XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydCk7XG59O1xuXG5mdW5jdGlvbiB3cml0ZURvdWJsZShidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0Lm9rKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIHZhbHVlJyk7XG5cbiAgICBhc3NlcnQub2sodHlwZW9mIChpc0JpZ0VuZGlhbikgPT09ICdib29sZWFuJyxcbiAgICAgICAgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKTtcblxuICAgIGFzc2VydC5vayhvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpO1xuXG4gICAgYXNzZXJ0Lm9rKG9mZnNldCArIDcgPCBidWZmZXIubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJyk7XG5cbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpO1xuICB9XG5cbiAgcmVxdWlyZSgnLi9idWZmZXJfaWVlZTc1NCcpLndyaXRlSUVFRTc1NChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzQmlnRW5kaWFuLFxuICAgICAgNTIsIDgpO1xufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbih2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpO1xufTtcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24odmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpO1xufTtcbiIsIihmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheShiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFycjtcblx0XG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnO1xuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHRwbGFjZUhvbGRlcnMgPSBiNjQuaW5kZXhPZignPScpO1xuXHRcdHBsYWNlSG9sZGVycyA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gcGxhY2VIb2xkZXJzIDogMDtcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IFtdOy8vbmV3IFVpbnQ4QXJyYXkoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKTtcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aDtcblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChsb29rdXAuaW5kZXhPZihiNjRbaV0pIDw8IDE4KSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA8PCAxMikgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPDwgNikgfCBsb29rdXAuaW5kZXhPZihiNjRbaSArIDNdKTtcblx0XHRcdGFyci5wdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpO1xuXHRcdFx0YXJyLnB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOCk7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAyKSB8IChsb29rdXAuaW5kZXhPZihiNjRbaSArIDFdKSA+PiA0KTtcblx0XHRcdGFyci5wdXNoKHRtcCAmIDB4RkYpO1xuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAobG9va3VwLmluZGV4T2YoYjY0W2ldKSA8PCAxMCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAxXSkgPDwgNCkgfCAobG9va3VwLmluZGV4T2YoYjY0W2kgKyAyXSkgPj4gMik7XG5cdFx0XHRhcnIucHVzaCgodG1wID4+IDgpICYgMHhGRik7XG5cdFx0XHRhcnIucHVzaCh0bXAgJiAweEZGKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyO1xuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoO1xuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gKyBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArIGxvb2t1cFtudW0gJiAweDNGXTtcblx0XHR9O1xuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSk7XG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApO1xuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwW3RlbXAgPj4gMl07XG5cdFx0XHRcdG91dHB1dCArPSBsb29rdXBbKHRlbXAgPDwgNCkgJiAweDNGXTtcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFt0ZW1wID4+IDEwXTtcblx0XHRcdFx0b3V0cHV0ICs9IGxvb2t1cFsodGVtcCA+PiA0KSAmIDB4M0ZdO1xuXHRcdFx0XHRvdXRwdXQgKz0gbG9va3VwWyh0ZW1wIDw8IDIpICYgMHgzRl07XG5cdFx0XHRcdG91dHB1dCArPSAnPSc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXQ7XG5cdH1cblxuXHRtb2R1bGUuZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5O1xuXHRtb2R1bGUuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NDtcbn0oKSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LnNvdXJjZSA9PT0gd2luZG93ICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbiIsInZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgZGVjayA9IHJlcXVpcmUoJ2RlY2tlcicpKCk7XG5cbmRlY2suY3NzKFwiYXJ0aWNsZS5kZWNrZXIge1xcbiAgZm9udC1mYW1pbHk6IEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDEuNGVtO1xcbiAgbGluZS1oZWlnaHQ6IDEuNmVtO1xcbn1cXG5hcnRpY2xlLmRlY2tlciBoMSB7XFxuICBmb250LXNpemU6IDEuNmVtO1xcbiAgbWFyZ2luOiAwO1xcbiAgdGV4dC1zaGFkb3c6IDAgMXB4IDJweCAjZThlOGU4O1xcbn1cXG5hcnRpY2xlLmRlY2tlciBoMTpsYXN0LWNoaWxkIHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHBhZGRpbmctdG9wOiA0MCU7XFxufVxcbmFydGljbGUuZGVja2VyIGgyLFxcbmFydGljbGUuZGVja2VyIGgzLFxcbmFydGljbGUuZGVja2VyIGg0IHtcXG4gIG1hcmdpbi10b3A6IDBweDtcXG4gIHRleHQtc2hhZG93OiAwIDFweCAycHggI2U4ZThlODtcXG59XFxuYXJ0aWNsZS5kZWNrZXIgcHJlIHtcXG4gIGxpbmUtaGVpZ2h0OiAxLjRlbTtcXG59XFxuXFxuXCIpO1xuZGVjay5jc3MoXCIvKlxcblxcbk9yaWdpbmFsIHN0eWxlIGZyb20gc29mdHdhcmVtYW5pYWNzLm9yZyAoYykgSXZhbiBTYWdhbGFldiA8TWFuaWFjQFNvZnR3YXJlTWFuaWFjcy5Pcmc+XFxuXFxuKi9cXG5cXG5wcmUgY29kZSB7XFxuICBkaXNwbGF5OiBibG9jazsgcGFkZGluZzogMC41ZW07XFxuICBiYWNrZ3JvdW5kOiAjRjBGMEYwO1xcbn1cXG5cXG5wcmUgY29kZSxcXG5wcmUgLnN1YnN0LFxcbnByZSAudGFnIC50aXRsZSxcXG5wcmUgLmxpc3AgLnRpdGxlLFxcbnByZSAuY2xvanVyZSAuYnVpbHRfaW4sXFxucHJlIC5uZ2lueCAudGl0bGUge1xcbiAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG5wcmUgLnN0cmluZyxcXG5wcmUgLnRpdGxlLFxcbnByZSAuY29uc3RhbnQsXFxucHJlIC5wYXJlbnQsXFxucHJlIC50YWcgLnZhbHVlLFxcbnByZSAucnVsZXMgLnZhbHVlLFxcbnByZSAucnVsZXMgLnZhbHVlIC5udW1iZXIsXFxucHJlIC5wcmVwcm9jZXNzb3IsXFxucHJlIC5oYW1sIC5zeW1ib2wsXFxucHJlIC5ydWJ5IC5zeW1ib2wsXFxucHJlIC5ydWJ5IC5zeW1ib2wgLnN0cmluZyxcXG5wcmUgLmFnZ3JlZ2F0ZSxcXG5wcmUgLnRlbXBsYXRlX3RhZyxcXG5wcmUgLmRqYW5nbyAudmFyaWFibGUsXFxucHJlIC5zbWFsbHRhbGsgLmNsYXNzLFxcbnByZSAuYWRkaXRpb24sXFxucHJlIC5mbG93LFxcbnByZSAuc3RyZWFtLFxcbnByZSAuYmFzaCAudmFyaWFibGUsXFxucHJlIC5hcGFjaGUgLnRhZyxcXG5wcmUgLmFwYWNoZSAuY2JyYWNrZXQsXFxucHJlIC50ZXggLmNvbW1hbmQsXFxucHJlIC50ZXggLnNwZWNpYWwsXFxucHJlIC5lcmxhbmdfcmVwbCAuZnVuY3Rpb25fb3JfYXRvbSxcXG5wcmUgLmFzY2lpZG9jIC5oZWFkZXIsXFxucHJlIC5tYXJrZG93biAuaGVhZGVyLFxcbnByZSAuY29mZmVlc2NyaXB0IC5hdHRyaWJ1dGUge1xcbiAgY29sb3I6ICM4MDA7XFxufVxcblxcbnByZSAuY29tbWVudCxcXG5wcmUgLmFubm90YXRpb24sXFxucHJlIC50ZW1wbGF0ZV9jb21tZW50LFxcbnByZSAuZGlmZiAuaGVhZGVyLFxcbnByZSAuY2h1bmssXFxucHJlIC5hc2NpaWRvYyAuYmxvY2txdW90ZSxcXG5wcmUgLm1hcmtkb3duIC5ibG9ja3F1b3RlIHtcXG4gIGNvbG9yOiAjODg4O1xcbn1cXG5cXG5wcmUgLm51bWJlcixcXG5wcmUgLmRhdGUsXFxucHJlIC5yZWdleHAsXFxucHJlIC5saXRlcmFsLFxcbnByZSAuaGV4Y29sb3IsXFxucHJlIC5zbWFsbHRhbGsgLnN5bWJvbCxcXG5wcmUgLnNtYWxsdGFsayAuY2hhcixcXG5wcmUgLmdvIC5jb25zdGFudCxcXG5wcmUgLmNoYW5nZSxcXG5wcmUgLmxhc3NvIC52YXJpYWJsZSxcXG5wcmUgLmFzY2lpZG9jIC5idWxsZXQsXFxucHJlIC5tYXJrZG93biAuYnVsbGV0LFxcbnByZSAuYXNjaWlkb2MgLmxpbmtfdXJsLFxcbnByZSAubWFya2Rvd24gLmxpbmtfdXJsIHtcXG4gIGNvbG9yOiAjMDgwO1xcbn1cXG5cXG5wcmUgLmxhYmVsLFxcbnByZSAuamF2YWRvYyxcXG5wcmUgLnJ1YnkgLnN0cmluZyxcXG5wcmUgLmRlY29yYXRvcixcXG5wcmUgLmZpbHRlciAuYXJndW1lbnQsXFxucHJlIC5sb2NhbHZhcnMsXFxucHJlIC5hcnJheSxcXG5wcmUgLmF0dHJfc2VsZWN0b3IsXFxucHJlIC5pbXBvcnRhbnQsXFxucHJlIC5wc2V1ZG8sXFxucHJlIC5waSxcXG5wcmUgLmhhbWwgLmJ1bGxldCxcXG5wcmUgLmRvY3R5cGUsXFxucHJlIC5kZWxldGlvbixcXG5wcmUgLmVudnZhcixcXG5wcmUgLnNoZWJhbmcsXFxucHJlIC5hcGFjaGUgLnNxYnJhY2tldCxcXG5wcmUgLm5naW54IC5idWlsdF9pbixcXG5wcmUgLnRleCAuZm9ybXVsYSxcXG5wcmUgLmVybGFuZ19yZXBsIC5yZXNlcnZlZCxcXG5wcmUgLnByb21wdCxcXG5wcmUgLmFzY2lpZG9jIC5saW5rX2xhYmVsLFxcbnByZSAubWFya2Rvd24gLmxpbmtfbGFiZWwsXFxucHJlIC52aGRsIC5hdHRyaWJ1dGUsXFxucHJlIC5jbG9qdXJlIC5hdHRyaWJ1dGUsXFxucHJlIC5hc2NpaWRvYyAuYXR0cmlidXRlLFxcbnByZSAubGFzc28gLmF0dHJpYnV0ZSxcXG5wcmUgLmNvZmZlZXNjcmlwdCAucHJvcGVydHkge1xcbiAgY29sb3I6ICM4OEZcXG59XFxuXFxucHJlIC5rZXl3b3JkLFxcbnByZSAuaWQsXFxucHJlIC50aXRsZSxcXG5wcmUgLmJ1aWx0X2luLFxcbnByZSAuYWdncmVnYXRlLFxcbnByZSAuY3NzIC50YWcsXFxucHJlIC5qYXZhZG9jdGFnLFxcbnByZSAucGhwZG9jLFxcbnByZSAueWFyZG9jdGFnLFxcbnByZSAuc21hbGx0YWxrIC5jbGFzcyxcXG5wcmUgLndpbnV0aWxzLFxcbnByZSAuYmFzaCAudmFyaWFibGUsXFxucHJlIC5hcGFjaGUgLnRhZyxcXG5wcmUgLmdvIC50eXBlbmFtZSxcXG5wcmUgLnRleCAuY29tbWFuZCxcXG5wcmUgLmFzY2lpZG9jIC5zdHJvbmcsXFxucHJlIC5tYXJrZG93biAuc3Ryb25nLFxcbnByZSAucmVxdWVzdCxcXG5wcmUgLnN0YXR1cyB7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxucHJlIC5hc2NpaWRvYyAuZW1waGFzaXMsXFxucHJlIC5tYXJrZG93biAuZW1waGFzaXMge1xcbiAgZm9udC1zdHlsZTogaXRhbGljO1xcbn1cXG5cXG5wcmUgLm5naW54IC5idWlsdF9pbiB7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbn1cXG5cXG5wcmUgLmNvZmZlZXNjcmlwdCAuamF2YXNjcmlwdCxcXG5wcmUgLmphdmFzY3JpcHQgLnhtbCxcXG5wcmUgLmxhc3NvIC5tYXJrdXAsXFxucHJlIC50ZXggLmZvcm11bGEsXFxucHJlIC54bWwgLmphdmFzY3JpcHQsXFxucHJlIC54bWwgLnZic2NyaXB0LFxcbnByZSAueG1sIC5jc3MsXFxucHJlIC54bWwgLmNkYXRhIHtcXG4gIG9wYWNpdHk6IDAuNTtcXG59XCIpO1xuZGVjay5hZGQoXCIjIFByb3RvdHlwaW5nIEFwcGxpY2F0aW9ucyB3aXRoIEhvb2RpZVxcblxcbi0tLVxcblxcbiMjIFdoYXQgaXMgSG9vZGllP1xcblxcbltIb29kaWVdKGh0dHA6Ly9ob29kLmllKSBpcyBhbiBKUyBhcHBsaWNhdGlvbiBkZXZlbG9wbWVudCBhcHByb2FjaCB3aGljaCBoYXMgYSBmb2N1cyBvbiBtYWtpbmcgYXBwbGljYXRpb25zIHdpdGggb2ZmbGluZSBzeW5jaHJvbml6YXRpb24gKipqdXN0IHdvcmsqKi5cXG5cXG4tLS1cXG5cXG4jIyBXaHkgVXNlIChvciBldmVuIGxvb2sgYXQpIEhvb2RpZT9cXG5cXG4xLiBCZWNhdXNlIHRoZXkgYXJlIGZvY3VzZWQgb24gc29sdmluZyBoYXJkIHByb2JsZW1zIChkYXRhIHN5bmMpIHN0cmFpZ2h0IHVwLCByYXRoZXIgdGhhbiBnaXZpbmcgeW91IGZsYXNoeSB0aGluZ3MgdG8gZGlzdHJhY3QgeW91LlxcblxcbjIuIExldmVyYWdlcyBDb3VjaERCIGZvciBzdHVmZiBpdCdzIHJlYWxseSBnb29kIGF0LlxcblxcbjMuIFRoZXJlJ3Mgc29tZSByZWFsbHkgc21hcnQsIGV4cGVyaWVuY2VkIHBlb3BsZSB3b3JraW5nIG9uIGl0Llxcblxcbi0tLVxcblxcbiMjIEhvb2RpZSBDb3JlIENvbmNlcHRzXFxuXFxuLSBVc2VyIEFjY291bnRzIGFuZCBBdXRoZW50aWNhdGlvblxcbi0gR2VuZXJpYyBEb2N1bWVudCBTdG9yZVxcbi0gVGFza3NcXG4tIEJ1cy1saWtlIGV2ZW50aW5nIChub3QgYXMgZ29vZCBhcyBbZXZlXShodHRwczovL2dpdGh1Yi5jb20vYWRvYmUtd2VicGxhdGZvcm0vZXZlKSwgYnV0IGdvb2QpXFxuXFxuLS0tXFxuXFxuIyMgR2V0dGluZyB5b3VyIEhvb2RpZSBvblxcblxcbmBgYGpzXFxudmFyIGhvb2RpZSA9IG5ldyBIb29kaWUoKTtcXG5gYGBcXG5cXG5UaGlzIHRyYW5zcGFyZW50bHkgY3JlYXRlcyBhIGNvbm5lY3Rpb24gdG8gdGhlIGhvb2RpZSBhcGkgcnVubmluZyBvbiB0aGUgbG9jYWwgbWFjaGluZSBpbiB0aGUgYmFja2dyb3VuZC4gIEFzIHlvdSB3b3VsZCBleHBlY3QsIHlvdSBjYW4gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgZW5kcG9pbnQuXFxuXFxuLS0tXFxuXFxuIyMgQXV0aGVudGljYXRpb25cXG5cXG5gYGBqc1xcbmhvb2RpZS5hY2NvdW50LnNpZ25JbignbWVAdGVzdC5jb20nLCAnc3VwZXJzZWNyZXRwYXNzJyk7XFxuYGBgXFxuXFxuRnVuY3Rpb25zIGxpa2UgdGhlIGBzaWduSW5gIGZ1bmN0aW9uIGFib3ZlIHJldHVybiBhIHByb21pc2UuICBXaGlsZSBub3QgbXkgcGVyc29uYWwgcHJlZmVyZW5jZSwgaXQgZG9lcyBtYWtlIGZvciBhIHZlcnkgY2xlYW4gbG9va2luZyBBUEkuXFxuXFxuYGBganNcXG5ob29kaWUuYWNjb3VudC5zaWduSW4oJ21lQHRlc3QuY29tJywgJ3NlY3JldCcpLnRoZW4oZnVuY3Rpb24oKSB7XFxuXFx0Y29uc29sZS5sb2coaG9vZGllLmFjY291bnQudXNlcm5hbWUpO1xcbn0pO1xcbmBgYFxcblxcbi0tLVxcblxcbiMjIEdlbmVyaWMgRG9jdW1lbnQgU3RvcmVcXG5cXG5UaGlzIGlzIHZlcnkgbmljZWx5IGRvbmUsIGFuZCBtYWtlcyBleGNlbGxlbnQgdXNlIG9mIENvdWNoIGFzIGEgZG9jdW1lbnQgc3RvcmUuXFxuXFxuYGBganNcXG5ob29kaWUuc3RvcmUuYWRkKCdjdXN0b21lcicsIHsgbmFtZTogJ0JvYicgfSk7XFxuYGBgXFxuXFxuRGF0YSBpcyBhZGRlZCB0byBhIF91c2VyIHNwZWNpZmljIGRhdGFiYXNlXyBpbiB0aGUgY291Y2ggYmFja2VuZCBpZiBvbmxpbmUuICBIZWNrLCB5b3UgY2FuIGV2ZW4gdXNlIFxcXCJmdXRvblxcXCIgKENvdWNoREIncyBhZG1pbiBpbnRlcmZhY2UpIHRvIGxvb2sgYXQgeW91ciBkYXRhOlxcblxcbmh0dHA6Ly8xMjcuMC4wLjE6NjAwMS9fYXBpL191dGlsc1xcblxcbi0tLVxcblxcbiMjIEV4YW1wbGU6IENhcHR1cmUgR2VvIFRyYWNrc1xcblxcblNvIHRyYWNraW5nIGEgZ2VvIHRyYWNrIGNvdWxkIGJlIGFzIHNpbXBsZSBhczpcXG5cXG5gYGBqc1xcbm5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKGZ1bmN0aW9uKHBvcykge1xcblxcdGhvb2RpZS5zdG9yZS5hZGQoJ3BvcycsIHBvcy5jb29yZHMpO1xcbn0pO1xcbmBgYFxcblxcbldoaWNoIGlzIHByZXR0eSBhd2Vzb21lLiAgSGVyZSdzIHdoYXQgdGhlIGRhdGEgbG9va3MgbGlrZSBpbiBjb3VjaDpcXG5cXG5gYGBqc29uXFxue1xcbiAgIFxcXCJfaWRcXFwiOiBcXFwicG9zLzMzMjIyMzFcXFwiLFxcbiAgIFxcXCJfcmV2XFxcIjogXFxcIjEtMTIxMDIyMTIxXFxcIixcXG4gICBcXFwic3BlZWRcXFwiOiBudWxsLFxcbiAgIFxcXCJoZWFkaW5nXFxcIjogbnVsbCxcXG4gICBcXFwiYWx0aXR1ZGVBY2N1cmFjeVxcXCI6IG51bGwsXFxuICAgXFxcImFjY3VyYWN5XFxcIjogMTgwMDAsXFxuICAgXFxcImFsdGl0dWRlXFxcIjogbnVsbCxcXG4gICBcXFwibG9uZ2l0dWRlXFxcIjogMTUxLjIwNjk5LFxcbiAgIFxcXCJsYXRpdHVkZVxcXCI6IC0zMy44Njc0ODcsXFxuICAgXFxcImNyZWF0ZWRCeVxcXCI6IFxcXCIyMTIyMjIyXFxcIixcXG4gICBcXFwidXBkYXRlZEF0XFxcIjogXFxcIjIwMTMtMTAtMjNUMDM6MzE6MDcuMDU5WlxcXCIsXFxuICAgXFxcImNyZWF0ZWRBdFxcXCI6IFxcXCIyMDEzLTEwLTIzVDAzOjMxOjA3LjA1OVpcXFwiLFxcbiAgIFxcXCJ0eXBlXFxcIjogXFxcInBvc1xcXCJcXG59XFxuYGBgXFxuXFxuLS0tXFxuXFxuIyMgSG9vZGllIEV2ZW50aW5nXFxuXFxuSG9vZGllIHVzZXMgYSBwdWJzdWIgZXZlbnRpbmcgbW9kZWwgd2hpY2ggYWxsb3dzIGZvciB3b25kZXJmdWwgZGVjb3VwbGluZyBhdCB0aGUgVUkgbGF5ZXIuXFxuXFxuSGFuZGxpbmcgYWNjb3VudCBzaWduLWluOlxcblxcbmBgYGpzXFxuaG9vZGllLmFjY291bnQub24oJ3NpZ25pbicsIGZ1bmN0aW9uKCkge1xcbn0pO1xcbmBgYFxcblxcbk9yIHdoZW4gYSBuZXcgcG9zaXRpb24gaXMgYWRkZWQ6XFxuXFxuYGBganNcXG5ob29kaWUuc3RvcmUub24oJ2FkZDpwb3MnLCBmdW5jdGlvbihwb3MpIHtcXG5cXHQvLyBJIGNvdWxkIGRvIG5pZnR5IGdlb2ZlbmNpbmcgc3R1ZmYgaGVyZSA6KVxcbn0pO1xcbmBgYFxcblxcbi0tLVxcblxcbiMjIE9mZmxpbmUgKyBEYXRhIFN5bmNocm9uaXphdGlvblxcblxcbkFsbCBkYXRhIGlzIHN0b3JlZCBpbiBgbG9jYWxTdG9yYWdlYCAoY2hlY2sgeW91ciB3ZWIgaW5zcGVjdG9yKSBhbmQgd2hlbiBvbmxpbmUgYXV0b21hdGljYWxseSBzeW5jaHJvbml6ZWQgd2l0aCBzZXJ2ZXIuICBJZiB5b3Ugd2FudCB0byBrbm93IHdoZW4gc3luY2hyb25pemF0aW9uIGlzIGhhcHBlbmluZywgdGhlbiB5b3UgY2FuIHVzZSBldmVudHMuXFxuXFxuWW91IGNvdWxkIG1vbml0b3IgeW91ciBtb3ZlbWVudHMgb24gYSBkZXNrdG9wIGRpc3BsYXlcXG5cXG5gYGBqc1xcbmhvb2RpZS5yZW1vdGUub24oJ2FkZDpwb3MnLCBmdW5jdGlvbiAocG9zKSB7XFxuXFx0Ly8gdXBkYXRlIHlvdXIgY3VycmVudCBwb3NpdGlvbiBvbiB5b3VyIG1hcFxcbn0pO1xcbmBgYFxcbi0tLVxcblxcbiMjIFByb3MgLyBDb25zXFxuXFxuLSAqKlBSTyoqOiBUYWNrbGluZyBvZmZsaW5lIHN5bmMgaGVhZCBvbiBpcyBncmVhdC5cXG4tICoqUFJPKio6IEdldHRpbmcgc3RhcnRlZCBmbGVzaGluZyBvdXQgeW91ciBhcHAgaXMgcmVhbGx5IHNpbXBsZS5cXG4tICoqQ09OPyoqOiBCdWlsdCBvbiBqUXVlcnkgKGF0IHRoZSBtb21lbnQpXFxuLSAqKkNPTj8qKjogRmVlbHMgYSBiaXQgZnJhbWV3b3JreSBmb3IgbXkgdGFzdGVzLlxcbi0gQmUgYXdhcmUgdGhhdCBzdG9yYWdlIGltcGxlbWVudGF0aW9uIGlzIHByZXR0eSBjbG9zZWx5IHRpZWQgdG8gW0NvdWNoREJdKGh0dHA6Ly9jb3VjaGRiLmFwYWNoZS5vcmcpIGF0IHRoZSBtb21lbnQuICBJICoqbG92ZSoqIENvdWNoIHNvIEkgZG9uJ3QgY29uc2lkZXIgdGhpcyBhIHByb2JsZW0sIGJ1dCB5b3Ugc2hvdWxkIGJlIGF3YXJlLi4uXFxuXFxuLS0tXFxuXFxuIyMgQ2xvc2luZyBUaG91Z2h0c1xcblxcblRoZXkgaGF2ZSBhIGRvZyB3ZWFyaW5nIGEgaG9vZGllIC0geW91IHNob3VsZCBhdCBsZWFzdCB0YWtlIGEgbG9vay5cXG5cXG5JdCdzIGdyZWF0IHRvIHNlZSBzb21lb25lIG1ha2UgYSBzZXJpb3VzIGdvIG9mIHVubG9ja2luZyB0aGUgcG90ZW50aWFsIG9mIENvdWNoREIgKyBzaW5nbGUgcGFnZSBhcHBzLlwiKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZGVjay5yZW5kZXIoKSk7IiwiLyoganNoaW50IG5vZGU6IHRydWUgKi9cbi8qIGdsb2JhbCB3aW5kb3c6IGZhbHNlICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICAjIFdlbGNvbWUgdG8gRGVja2VyXG5cbiAgLS1cblxuICAjIyBXaGF0IGlzIERlY2tlcj9cblxuICBEZWNrZXIgaXMgYSB0b29sIGZvciBnZW5lcmF0aW5nIHByZXNlbnRhdGlvbnMgdXNpbmdcbiAgW2Jyb3dzZXJpZnldKGh0dHBzOi8vZ2l0aHViLmNvbS9zdWJzdGFjay9ub2RlLWJyb3dzZXJpZnkpLlxuXG4gIC0tXG5cbiAgIyMgV2h5IERlY2tlcj9cblxuICBCZWNhdXNlIGlmIHlvdSBhcmUgdGFsa2luZyBhYm91dCBCcm93c2VyaWZ5LCB0aGVuIHVzaW5nIHByZXNlbnRhdGlvblxuICBzb2Z0d2FyZSBidWlsdCBhbm90aGVyIHdheSBmZWVscyBraW5kIG9mIHdyb25nIDovIFxuXG4qKi9cblxudmFyIGNsYXNzdHdlYWsgPSByZXF1aXJlKCdjbGFzc3R3ZWFrJyk7XG52YXIgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcbnZhciBpbnNlcnRDc3MgPSByZXF1aXJlKCdpbnNlcnQtY3NzJyk7XG52YXIga2V5ID0gcmVxdWlyZSgna2V5bWFzdGVyJyk7XG52YXIgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgaGxqcyA9IHJlcXVpcmUoJ2hpZ2hsaWdodC5qcycpO1xudmFyIG1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG52YXIgcmVTbGlkZUJyZWFrID0gL1xcblxccj9cXC17Mix9L207XG52YXIgcmVMZWFkaW5nQW5kVHJhaWxpbmdTcGFjZXMgPSAvXlxccyooLiopXFxzKiQvbTtcblxudmFyIGhsanNMYW5nTWFwcGluZ3MgPSB7XG4gIGpzOiAnamF2YXNjcmlwdCdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICByZXR1cm4gbmV3IERlY2sob3B0aW9ucyB8fCB7fSk7XG59O1xuXG4vKiBpbml0aWFsaXNlIG1hcmtlZCAqL1xuXG5tYXJrZWQuc2V0T3B0aW9ucyh7XG4gIGhpZ2hsaWdodDogZnVuY3Rpb24oY29kZSwgbGFuZykge1xuICAgIGxhbmcgPSBobGpzTGFuZ01hcHBpbmdzW2xhbmddIHx8IGxhbmc7XG5cbiAgICAvLyBpZiB0aGlzIGlzIGEga25vd24gaGxqcyBsYW5ndWFnZSB0aGVuIGhpZ2hsaWdodFxuICAgIGlmIChobGpzLkxBTkdVQUdFU1tsYW5nXSkge1xuICAgICAgcmV0dXJuIGhsanMuaGlnaGxpZ2h0KGxhbmcsIGNvZGUpLnZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBjb2RlO1xuICAgIH1cbiAgfVxufSk7XG5cblxuLyoqXG4gIC0tXG4gICMjIERlY2tlciBSZWZlcmVuY2VcblxuKiovXG5cbmZ1bmN0aW9uIERlY2soKSB7XG4gIFN0cmVhbS5jYWxsKHRoaXMpO1xuXG4gIC8vIGluaXRpYWxpc2UgdGhlIHNsaWRlcyBhcnJheVxuICB0aGlzLnNsaWRlcyA9IFtdO1xuXG4gIC8vIGluaXRpYWxpc2UgdGhlIGVsZW1lbnRzIGFycmF5IHRoYXQgd2lsbCBjb250YWluIHRoZSBzZWN0aW9uIGVsZW1lbnRzXG4gIHRoaXMuX2VsZW1lbnRzID0gW107XG5cbiAgLy8gbWFyayBhcyB3cml0YWJsZVxuICB0aGlzLndyaXRhYmxlID0gdHJ1ZTtcbn1cblxudXRpbC5pbmhlcml0cyhEZWNrLCBTdHJlYW0pO1xuXG4vKipcbiAgIyMjIGFkZChkYXRhKVxuKiovXG5EZWNrLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihzbGlkZSkge1xuICB2YXIgdGV4dERhdGEgPSB0eXBlb2Ygc2xpZGUgPT0gJ3N0cmluZycgfHwgKHNsaWRlIGluc3RhbmNlb2YgU3RyaW5nKTtcblxuICBpZiAodGV4dERhdGEgJiYgcmVTbGlkZUJyZWFrLnRlc3Qoc2xpZGUpKSB7XG4gICAgcmV0dXJuIHNsaWRlLnNwbGl0KHJlU2xpZGVCcmVhaykuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIC8vIGF0dGVtcHQgYSBjb252ZXJzdGlvbiB0byBodG1sIGlmIGEgc3RyaW5nXG4gIGlmICh0ZXh0RGF0YSkge1xuICAgIC8vIHRyaW0gdHJhaWxpbmcgbGluZSBicmVha3MgYW5kIHNwYWNlc1xuICAgIHNsaWRlID0ge1xuICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgZGF0YTogbWFya2VkKHNsaWRlLnJlcGxhY2UocmVMZWFkaW5nQW5kVHJhaWxpbmdTcGFjZXMsICckMScpKVxuICAgIH07XG4gIH1cblxuICAvLyBhZGQgdGhlIHNsaWRlIHRvIHRoZSBsaXN0XG4gIHRoaXMuc2xpZGVzLnB1c2goc2xpZGUpO1xufTtcblxuRGVjay5wcm90b3R5cGUuY3NzID0gZnVuY3Rpb24oY3NzKSB7XG4gIGluc2VydENzcyhjc3MpO1xufTtcblxuLyoqXG4gICMjIyByZW5kZXIoKSAtPiBIVE1MRWxlbWVudFxuXG4gIFJlbmRlciBhIG5ldyBzbGlkZSBkZWNrIGFzIGFuIEhUTUwgZWxlbWVudCByZWFkeSBmb3IgaW5zZXJ0aW9uIGludG9cbiAgdGhlIERPTS5cbioqL1xuRGVjay5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGNyZWF0ZVNsaWRlKHNsaWRlLCBpbmRleCkge1xuICAgIHZhciBzZWN0aW9uO1xuXG4gICAgc3dpdGNoIChzbGlkZS50eXBlKSB7XG4gICAgY2FzZSAnaHRtbCc6XG4gICAgICBzZWN0aW9uID0gY3JlbCgnc2VjdGlvbicpO1xuICAgICAgc2VjdGlvbi5pbm5lckhUTUwgPSBzbGlkZS5kYXRhO1xuXG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIGRhdGEgYXR0cmlidXRlc1xuICAgIHNlY3Rpb24uZGF0YXNldC5pbmRleCA9IGluZGV4O1xuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICAvLyBjcmVhdGUgdGhlIGRvbSBlbGVtZW50c1xuICB0aGlzLl9lbGVtZW50cyA9IHRoaXMuc2xpZGVzLm1hcChjcmVhdGVTbGlkZSk7XG5cbiAgLy8gc2V0IHRoZSBpbmRleCB0byAwIGlmIG5vdCBhbHJlYWR5IGRlZmluZWRcbiAgdGhpcy5pbmRleCA9IHRoaXMuaW5kZXggfHwgdGhpcy5oYXNoSW5kZXggfHwgMDtcblxuICAvLyBiaW5kIGtleXNcbiAga2V5KCdyaWdodCwgc3BhY2UsIGxlZnQnLCB0aGlzLl9oYW5kbGVLZXkuYmluZCh0aGlzKSk7XG5cbiAgLy8gZW5zdXJlIHdlIGhhdmUgdGhlIGJhc2VsaW5lIGNzc1xuICBpbnNlcnRDc3MoXCJodG1sLFxcbmJvZHksXFxuc2VjdGlvbiB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5hcnRpY2xlLmRlY2tlciBzZWN0aW9uIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHBhZGRpbmc6IDUlO1xcbiAgd2lkdGg6IDkwJTtcXG4gIGhlaWdodDogOTAlO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpIHRyYW5zbGF0ZVooMHB4KTtcXG4gIC13ZWJraXQtdHJhbnNpdGlvbjogYWxsIGVhc2UtaW4tb3V0IDAuNXM7XFxufVxcbmFydGljbGUuZGVja2VyIHNlY3Rpb24uZGVja2VyLWFjdGl2ZSB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpIHRyYW5zbGF0ZVooMHB4KTtcXG59XFxuYXJ0aWNsZS5kZWNrZXIgc2VjdGlvbi5kZWNrZXItcGFzdCB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSkgdHJhbnNsYXRlWigwcHgpO1xcbn1cXG5cXG5cIik7XG5cbiAgLy8gY3JlYXRlIHRoZSBjb250YWluZXIgYXJ0aWNsZVxuICByZXR1cm4gY3JlbC5hcHBseShcbiAgICBudWxsLFxuICAgIFsnYXJ0aWNsZScsIHsgY2xhc3M6ICdkZWNrZXIgJ31dLmNvbmNhdCh0aGlzLl9lbGVtZW50cylcbiAgKTtcbn07XG5cbi8qKlxuICAjIyMgd3JpdGUoZGF0YSlcbioqL1xuRGVjay5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBhcHBseSB0aGUgYWN0aW9uIGZyb20gdGhlIGRlY2tcbn07XG5cbi8qKlxuICAjIyMgX2hhbmRsZUtleShldnQsIGhhbmRsZXIpXG5cbiAgSGFuZGxlIGtleSBldmVudHMgYXMgcGVyXG4gIFtrZXltYXN0ZXJdKGh0dHBzOi8vZ2l0aHViLmNvbS9tYWRyb2JieS9rZXltYXN0ZXIpIGRvY3MuXG4qKi9cbkRlY2sucHJvdG90eXBlLl9oYW5kbGVLZXkgPSBmdW5jdGlvbihldnQsIGhhbmRsZXIpIHtcbiAgc3dpdGNoIChoYW5kbGVyLnNob3J0Y3V0KSB7XG4gIGNhc2UgJ2xlZnQnOlxuICAgIHRoaXMuaW5kZXggLT0gMTtcbiAgICBicmVhaztcblxuICBkZWZhdWx0OlxuICAgIHRoaXMuaW5kZXggKz0gMTtcbiAgfVxufTtcblxuLyogZGVjayBwcm9wZXJ0aWVzICovXG5cbi8qKlxuICAjIyMgZGVja0BpbmRleFxuXG4qKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEZWNrLnByb3RvdHlwZSwgJ2luZGV4Jywge1xuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleDtcbiAgfSxcblxuICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gY29uc3RyYWluIHRoZSB2YWx1ZSB0byB3aXRoaW4gdmFsaWQgYm91bmRzXG4gICAgdmFsdWUgPSB0aGlzLl9lbGVtZW50cy5sZW5ndGggP1xuICAgICAgTWF0aC5tYXgoMCwgTWF0aC5taW4ocGFyc2VJbnQodmFsdWUsIDEwKSwgdGhpcy5fZWxlbWVudHMubGVuZ3RoIC0gMSkpIDpcbiAgICAgIC0xO1xuXG4gICAgaWYgKHRoaXMuX2luZGV4ICE9PSB2YWx1ZSkge1xuICAgICAgLy8gdW5zZXQgYWN0aXZlIGZvciB0aGUgYXJ0aWNsZXNcbiAgICAgIGNsYXNzdHdlYWsodGhpcy5fZWxlbWVudHMsICctZGVja2VyLWFjdGl2ZSAtZGVja2VyLXBhc3QnKTtcblxuICAgICAgLy8gc2V0IHRoZSBjdXJyZW50IHNlY3Rpb24gdG8gYWN0aXZlXG4gICAgICBpZiAodmFsdWUgPj0gMCkge1xuICAgICAgICBjbGFzc3R3ZWFrKHRoaXMuX2VsZW1lbnRzLnNsaWNlKDAsIHZhbHVlKSwgJytkZWNrZXItcGFzdCcpO1xuICAgICAgICBjbGFzc3R3ZWFrKHRoaXMuX2VsZW1lbnRzW3ZhbHVlXSwgJytkZWNrZXItYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuX2luZGV4ID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuLyoqXG4gICMjIyBkZWNrQGhhc2hJbmRleFxuXG4qKi9cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShEZWNrLnByb3RvdHlwZSwgJ2hhc2hJbmRleCcsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpLCAxMCk7XG4gICAgfVxuICB9XG59KTsiLCIvLyBjbGFzc3R3ZWFrIDAuMS4wIC0gU2ltcGxlIERPTSBlbGVtZW50IGNsYXNzIG1hbmlwdWxhdG9yXG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDExIERhbW9uIE9laGxtYW4gKGh0dHA6Ly93d3cuc2lkZWxhYi5jb20vKVxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCAoaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHApIGxpY2Vuc2UuXG5cbi8qXFxcbiAqIGNsYXNzdHdlYWtcbiBbIGZ1bmN0aW9uIF1cbiAqKlxuICogVGhlIGBjbGFzc3R3ZWFrYCBmdW5jdGlvbiBjYW4gYmUgdXNlZCBpbiBtdWx0aXBsZSB3YXlzXG4gKipcbiA+IEFyZ3VtZW50cyAob3B0aW9uIDEpXG4gKipcbiAtIGVsZW1lbnRzIChzdHJpbmd8YXJyYXkpIHN0cmluZyB0aGF0IGlzIHBhc3NlZCB0byB0aGUgU2VsZWN0b3JzIEFQSSwgb3IgYW4gYXJyYXkgb2YgRE9NIGVsZW1lbnRzIHRvIHVwZGF0ZSBjbGFzc2VzIG9uXG4gLSBpbml0QWN0aW9uIChzdHJpbmcpIGNsYXNzIG1vZGlmaWVyIHN0cmluZ1xuIC0gc2NvcGUgKERPTUVsZW1lbnQpIHRhcmdldCBkb20gZWxlbWVudCBmb3IgcXVlcnlTZWxlY3RvciBjYWxscyAoZGVmYXVsdDogZG9jdW1lbnQpXG4gKipcbiA9IChmdW5jdGlvbikgcmV0dXJucyB0aGUgY2xhc3N0d2VhayBmdW5jdGlvbiBmb3IgY2hhaW5pbmdcbiAqKlxuICoqXG4gPiBVc2FnZVxuIHwgLy8gYWRkIHRoZSBidXR0b24gY2xhc3MgdG8gYWxsIGFuY2hvciB0YWdzXG4gfCBjbGFzc3R3ZWFrKCdhJywgJytidXR0b24nKTtcbiA+IEFyZ3VtZW50cyAob3B0aW9uIDIpXG4gKipcbiAtIGVsZW1lbnRzIChzdHJpbmd8YXJyYXkpIGFzIHBlciBvcHRpb24gMVxuICoqXG4gPSAoZnVuY3Rpb24pIHJldHVybnMgdGhlIEB0d2VhayBmdW5jdGlvbiB0byBlbmFibGUgY2xhc3MgbWFuaXB1bGF0aW9uIG9uIHRoZSBzcGVjaWZpZWQgZWxlbWVudHNcblxcKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuY2xhc3N0d2VhayA9IGZhY3RvcnkoKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBjbGFzc3R3ZWFrKGVsZW1lbnRzLCBpbml0QWN0aW9uLCBzY29wZSkge1xuICAgICAgICAvLyBpZiBlbGVtZW50cyBpcyBub3QgZGVmaW5lZCwgdGhlbiByZXR1cm5cbiAgICAgICAgaWYgKCEgZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH0gLy8gaWZcblxuICAgICAgICAvLyBpbnRlcm5hbHNcbiAgICAgICAgdmFyIHJlU3BhY2VzID0gL1tcXHNcXCxdKy8sXG4gICAgICAgICAgICBpbnN0cnVjdGlvbkhhbmRsZXJzID0ge1xuICAgICAgICAgICAgICAgICcrJzogZnVuY3Rpb24oY3VycmVudCwgdGFyZ2V0LCBmb3VuZElkeCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgc3R5bGUgd2FzIG5vdCBmb3VuZCwgdGhlbiBhZGQgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kSWR4IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFtjdXJyZW50Lmxlbmd0aF0gPSB0YXJnZXQ7XG4gICAgICAgICAgICAgICAgICAgIH0gLy8gaWZcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICctJzogZnVuY3Rpb24oY3VycmVudCwgdGFyZ2V0LCBmb3VuZElkeCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRJZHggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudC5zcGxpY2UoZm91bmRJZHgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9IC8vIGlmXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAnISc6IGZ1bmN0aW9uKGN1cnJlbnQsIHRhcmdldCwgZm91bmRJZHgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25IYW5kbGVyc1tmb3VuZElkeCA8IDAgPyAnKycgOiAnLSddKGN1cnJlbnQsIHRhcmdldCwgZm91bmRJZHgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgLypcXFxuICAgICAgICAgKiB0d2Vha1xuICAgICAgICAgWyBmdW5jdGlvbiBdXG4gICAgICAgICAqKlxuICAgICAgICAgKiBBcHBseSB0aGUgc3BlY2lmaWVkIGFjdGlvbnMgdG8gdGhlIHByZXZpb3VzbHkgc3BlY2lmaWVkIGVsZW1lbnRzXG4gICAgICAgICAqKlxuICAgICAgICAgPiBBcmd1bWVudHNcbiAgICAgICAgICoqXG4gICAgICAgICAtIGFjdGlvbnMgKHN0cmluZylcbiAgICAgICAgICoqXG4gICAgICAgICA9IChmdW5jdGlvbikgcmV0dXJuIHRoZSBgdHdlYWtgIGZ1bmN0aW9uIGZvciBjaGFpbmluZ1xuICAgICAgICAgKipcbiAgICAgICAgXFwqL1xuICAgICAgICBmdW5jdGlvbiB0d2VhayhhY3Rpb25zKSB7XG4gICAgICAgICAgICAvLyBpdGVyZWF0ZSB0aHJvdWdoIHRoZSBlbGVtZW50c1xuICAgICAgICAgICAgZm9yICh2YXIgZWxJZHggPSBlbGVtZW50cy5sZW5ndGg7IGVsSWR4LS07ICkge1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZWxlbWVudHNbZWxJZHhdLFxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVDbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUgPyBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLnNvcnQoKSA6IFtdLFxuICAgICAgICAgICAgICAgICAgICBpaTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBhY3Rpb24gaXMgYSBzdHJpbmcsIHRoZW4gcGFyc2UgaW50byBhbiBhcnJheVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0aW9ucyA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zID0gYWN0aW9ucy5zcGxpdChyZVNwYWNlcyk7XG4gICAgICAgICAgICAgICAgfSAvLyBpZlxuXG4gICAgICAgICAgICAgICAgLy8gaXRlcmF0ZSB0aHJvdWdoIHRoZSBhY3Rpb25zIGFuZCBhcHBseSB0aGUgdHdlYWtzXG4gICAgICAgICAgICAgICAgZm9yIChpaSA9IGFjdGlvbnMubGVuZ3RoOyBpaS0tOyApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBhY3Rpb24gaW5zdHJ1Y3Rpb25cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFjdGlvbiA9IGFjdGlvbnNbaWldLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb24gPSBhY3Rpb24uc2xpY2UoMCwgMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0Q2hhciA9IGFjdGlvbi5zbGljZSgtMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBhY3Rpb24uc2xpY2UoMSksXG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyID0gaW5zdHJ1Y3Rpb25IYW5kbGVyc1tpbnN0cnVjdGlvbl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkb3RTeW50YXggPSBpbnN0cnVjdGlvbiA9PSAnLicgfHwgbGFzdENoYXIgPT0gJy4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NJZHgsIGZvdW5kID0gLTE7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGluc3RydWN0aW9uIGhhbmRsZXIgaXMgbm90IGZvdW5kLCB0aGVuIGRlZmF1bHQgdG8gK1xuICAgICAgICAgICAgICAgICAgICAvLyBhbHNvLCB1c2UgdGhlIGZ1bGwgYWN0aW9uIHRleHRcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEgaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UgaGF2ZSB0aGUgZG90IHN5bnRheCB0aGVuIGRvIG1vcmUgcGFyc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRvdFN5bnRheCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgaGFuZGxlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBpbnN0cnVjdGlvbkhhbmRsZXJzW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSAnLicgJiYgbGFzdENoYXIgPT0gJy4nID8gJyEnIDogXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSAnLicgPyAnKycgOiAnLSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY2xhc3NuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gYWN0aW9uLnNsaWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0cnVjdGlvbiA9PSAnLicgPyAxIDogMCwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RDaGFyID09ICcuJyA/IC0xIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSwganVzdCBmYWxsIGJhY2sgdG8gdGhlIGFkZCBoYW5kbGVyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbGFzdCBjaGFyYWN0ZXIgaXMgYSBkb3QsIHB1c2ggdG8gdGhlIGRvdCBoYW5kbGVyLCBvdGhlcndpc2UgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIgPSBpbnN0cnVjdGlvbkhhbmRsZXJzWycrJ107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gYWN0aW9uc1tpaV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IC8vIGlmLi5lbHNlXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gaWZcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCB0aGUgYWN0aXZlIGNsYXNzZXMgYW5kIHVwZGF0ZSB0aGUgZm91bmQgc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjbGFzc0lkeCA9IGFjdGl2ZUNsYXNzZXMubGVuZ3RoOyAoZm91bmQgPCAwKSAmJiBjbGFzc0lkeC0tOyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGhhdmUgYSBtYXRjaCBvbiB0aGUgY2xhc3MsIHRoZW4gdXBkYXRlIHRoZSBmb3VuZCBpbmRleFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUNsYXNzZXNbY2xhc3NJZHhdID09PSBjbGFzc05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGNsYXNzSWR4O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBpZlxuICAgICAgICAgICAgICAgICAgICB9IC8vIGZvclxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGFwcGx5IHRoZSBoYW5kbGVyLCBhY3RpdmVDbGFzc2VzIG1vZGlmaWVkIGluIHBsYWNlXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIoYWN0aXZlQ2xhc3NlcywgY2xhc3NOYW1lLCBmb3VuZCk7XG4gICAgICAgICAgICAgICAgfSAvLyBmb3JcblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgZWxlbWVudCBjbGFzc25hbWVcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGFjdGl2ZUNsYXNzZXMuam9pbignICcpO1xuICAgICAgICAgICAgfSAvLyBmb3JcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHR3ZWFrO1xuICAgICAgICB9IC8vIHR3ZWFrXG4gICAgICAgIFxuICAgICAgICAvLyBjaGVjayB0aGUgZWxlbWVudHNcbiAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PSAnc3RyaW5nJyB8fCBlbGVtZW50cyBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgICAgLy8gaWYgd2UgaGF2ZSBhIHFzYSBmdW5jdGlvbiBkZWZpbmVkIChmb3Igc3BlZWQgb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkpIHVzZSB0aGF0XG4gICAgICAgICAgICAvLyBvdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgcXVlcnlTZWxlY3RvciBBUElcbiAgICAgICAgICAgIGVsZW1lbnRzID0gdHlwZW9mIHFzYSA9PSAnZnVuY3Rpb24nID8gcXNhKGVsZW1lbnRzLCBzY29wZSkgOiAoc2NvcGUgfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIHdlIGRvbid0IGhhdmUgYSBzcGxpY2UgZnVuY3Rpb24sIHRoZW4gd2UgZG9uJ3QgaGF2ZSBhbiBhcnJheVxuICAgICAgICAvLyBtYWtlIGl0IG9uZVxuICAgICAgICBlbHNlIGlmICghIGVsZW1lbnRzLnNwbGljZSkge1xuICAgICAgICAgICAgZWxlbWVudHMgPSBbZWxlbWVudHNdO1xuICAgICAgICB9IC8vIGlmLi5lbHNlXG5cbiAgICAgICAgLy8gYXBwbHkgdGhlIHJlcXVlc3RlZCBhY3Rpb25cbiAgICAgICAgaWYgKGluaXRBY3Rpb24pIHtcbiAgICAgICAgICAgIHR3ZWFrKGluaXRBY3Rpb24pO1xuICAgICAgICB9IC8vIGlmXG4gICAgICAgIFxuICAgICAgICAvLyByZXR1cm4gdGhlIHR3ZWFrXG4gICAgICAgIHJldHVybiBpbml0QWN0aW9uID8gY2xhc3N0d2VhayA6IHR3ZWFrO1xuICAgIH0gLy8gY2xhc3N0d2Vha1xuXG4gICAgcmV0dXJuIGNsYXNzdHdlYWs7XG59KSk7IiwiLy9Db3B5cmlnaHQgKEMpIDIwMTIgS29yeSBOdW5uXHJcblxyXG4vL1Blcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4vL1RoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuLy9USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuXHJcbi8qXHJcblxyXG4gICAgVGhpcyBjb2RlIGlzIG5vdCBmb3JtYXR0ZWQgZm9yIHJlYWRhYmlsaXR5LCBidXQgcmF0aGVyIHJ1bi1zcGVlZCBhbmQgdG8gYXNzaXN0IGNvbXBpbGVycy5cclxuICAgIFxyXG4gICAgSG93ZXZlciwgdGhlIGNvZGUncyBpbnRlbnRpb24gc2hvdWxkIGJlIHRyYW5zcGFyZW50LlxyXG4gICAgXHJcbiAgICAqKiogSUUgU1VQUE9SVCAqKipcclxuICAgIFxyXG4gICAgSWYgeW91IHJlcXVpcmUgdGhpcyBsaWJyYXJ5IHRvIHdvcmsgaW4gSUU3LCBhZGQgdGhlIGZvbGxvd2luZyBhZnRlciBkZWNsYXJpbmcgY3JlbC5cclxuICAgIFxyXG4gICAgdmFyIHRlc3REaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICB0ZXN0TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xyXG5cclxuICAgIHRlc3REaXYuc2V0QXR0cmlidXRlKCdjbGFzcycsICdhJyk7ICAgIFxyXG4gICAgdGVzdERpdlsnY2xhc3NOYW1lJ10gIT09ICdhJyA/IGNyZWwuYXR0ck1hcFsnY2xhc3MnXSA9ICdjbGFzc05hbWUnOnVuZGVmaW5lZDtcclxuICAgIHRlc3REaXYuc2V0QXR0cmlidXRlKCduYW1lJywnYScpO1xyXG4gICAgdGVzdERpdlsnbmFtZSddICE9PSAnYScgPyBjcmVsLmF0dHJNYXBbJ25hbWUnXSA9IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKXtcclxuICAgICAgICBlbGVtZW50LmlkID0gdmFsdWU7XHJcbiAgICB9OnVuZGVmaW5lZDtcclxuICAgIFxyXG5cclxuICAgIHRlc3RMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdhJyk7XHJcbiAgICB0ZXN0TGFiZWxbJ2h0bWxGb3InXSAhPT0gJ2EnID8gY3JlbC5hdHRyTWFwWydmb3InXSA9ICdodG1sRm9yJzp1bmRlZmluZWQ7XHJcbiAgICBcclxuICAgIFxyXG5cclxuKi9cclxuXHJcbi8vIGlmIHRoZSBtb2R1bGUgaGFzIG5vIGRlcGVuZGVuY2llcywgdGhlIGFib3ZlIHBhdHRlcm4gY2FuIGJlIHNpbXBsaWZpZWQgdG9cclxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XHJcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIGRlZmluZShmYWN0b3J5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm9vdC5jcmVsID0gZmFjdG9yeSgpO1xyXG4gIH1cclxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBiYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM4NDI4Ni9qYXZhc2NyaXB0LWlzZG9tLWhvdy1kby15b3UtY2hlY2staWYtYS1qYXZhc2NyaXB0LW9iamVjdC1pcy1hLWRvbS1vYmplY3RcclxuICAgIHZhciBpc05vZGUgPSB0eXBlb2YgTm9kZSA9PT0gJ29iamVjdCdcclxuICAgICAgICA/IGZ1bmN0aW9uIChvYmplY3QpIHsgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIE5vZGUgfVxyXG4gICAgICAgIDogZnVuY3Rpb24gKG9iamVjdCkge1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgICAgICAgICAgICAgJiYgdHlwZW9mIG9iamVjdC5ub2RlVHlwZSA9PT0gJ251bWJlcidcclxuICAgICAgICAgICAgICAgICYmIHR5cGVvZiBvYmplY3Qubm9kZU5hbWUgPT09ICdzdHJpbmcnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlbCgpe1xyXG4gICAgICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcclxuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cywgLy9Ob3RlOiBhc3NpZ25lZCB0byBhIHZhcmlhYmxlIHRvIGFzc2lzdCBjb21waWxlcnMuIFNhdmVzIGFib3V0IDQwIGJ5dGVzIGluIGNsb3N1cmUgY29tcGlsZXIuIEhhcyBuZWdsaWdhYmxlIGVmZmVjdCBvbiBwZXJmb3JtYW5jZS5cclxuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXJnc1swXSksXHJcbiAgICAgICAgICAgIGNoaWxkLFxyXG4gICAgICAgICAgICBzZXR0aW5ncyA9IGFyZ3NbMV0sXHJcbiAgICAgICAgICAgIGNoaWxkSW5kZXggPSAyLFxyXG4gICAgICAgICAgICBhcmd1bWVudHNMZW5ndGggPSBhcmdzLmxlbmd0aCxcclxuICAgICAgICAgICAgYXR0cmlidXRlTWFwID0gY3JlbC5hdHRyTWFwO1xyXG5cclxuICAgICAgICAvLyBzaG9ydGN1dFxyXG4gICAgICAgIGlmKGFyZ3VtZW50c0xlbmd0aCA9PT0gMSl7XHJcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYodHlwZW9mIHNldHRpbmdzICE9PSAnb2JqZWN0JyB8fCBpc05vZGUoc2V0dGluZ3MpKSB7XHJcbiAgICAgICAgICAgIC0tY2hpbGRJbmRleDtcclxuICAgICAgICAgICAgc2V0dGluZ3MgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc2hvcnRjdXQgaWYgdGhlcmUgaXMgb25seSBvbmUgY2hpbGQgdGhhdCBpcyBhIHN0cmluZyAgICBcclxuICAgICAgICBpZigoYXJndW1lbnRzTGVuZ3RoIC0gY2hpbGRJbmRleCkgPT09IDEgJiYgdHlwZW9mIGFyZ3NbY2hpbGRJbmRleF0gPT09ICdzdHJpbmcnICYmIGVsZW1lbnQudGV4dENvbnRlbnQgIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBhcmdzW2NoaWxkSW5kZXhdO1xyXG4gICAgICAgIH1lbHNleyAgICBcclxuICAgICAgICAgICAgZm9yKDsgY2hpbGRJbmRleCA8IGFyZ3VtZW50c0xlbmd0aDsgKytjaGlsZEluZGV4KXtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gYXJnc1tjaGlsZEluZGV4XTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoY2hpbGQgPT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGlmKCFpc05vZGUoY2hpbGQpKXtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gc2V0dGluZ3Mpe1xyXG4gICAgICAgICAgICBpZighYXR0cmlidXRlTWFwW2tleV0pe1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBzZXR0aW5nc1trZXldKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9IGNyZWwuYXR0ck1hcFtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGF0dHIgPT09ICdmdW5jdGlvbicpeyAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cihlbGVtZW50LCBzZXR0aW5nc1trZXldKTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1lbHNleyAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHIsIHNldHRpbmdzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBVc2VkIGZvciBtYXBwaW5nIG9uZSBraW5kIG9mIGF0dHJpYnV0ZSB0byB0aGUgc3VwcG9ydGVkIHZlcnNpb24gb2YgdGhhdCBpbiBiYWQgYnJvd3NlcnMuXHJcbiAgICAvLyBTdHJpbmcgcmVmZXJlbmNlZCBzbyB0aGF0IGNvbXBpbGVycyBtYWludGFpbiB0aGUgcHJvcGVydHkgbmFtZS5cclxuICAgIGNyZWxbJ2F0dHJNYXAnXSA9IHt9O1xyXG4gICAgXHJcbiAgICAvLyBTdHJpbmcgcmVmZXJlbmNlZCBzbyB0aGF0IGNvbXBpbGVycyBtYWludGFpbiB0aGUgcHJvcGVydHkgbmFtZS5cclxuICAgIGNyZWxbXCJpc05vZGVcIl0gPSBpc05vZGU7XHJcbiAgICBcclxuICAgIHJldHVybiBjcmVsO1xyXG59KSk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcyl7XG4gIHZhciBJREVOVF9SRV9SVSA9ICdbYS16QS1a0LAt0Y/QkC3Qr11bYS16QS1aMC05X9CwLdGP0JAt0K9dKic7XG4gIHZhciBPbmVTX0tFWVdPUkRTID0gJ9Cy0L7Qt9Cy0YDQsNGCINC00LDRgtCwINC00LvRjyDQtdGB0LvQuCDQuCDQuNC70Lgg0LjQvdCw0YfQtSDQuNC90LDRh9C10LXRgdC70Lgg0LjRgdC60LvRjtGH0LXQvdC40LUg0LrQvtC90LXRhtC10YHQu9C4ICcgK1xuICAgICfQutC+0L3QtdGG0L/QvtC/0YvRgtC60Lgg0LrQvtC90LXRhtC/0YDQvtGG0LXQtNGD0YDRiyDQutC+0L3QtdGG0YTRg9C90LrRhtC40Lgg0LrQvtC90LXRhtGG0LjQutC70LAg0LrQvtC90YHRgtCw0L3RgtCwINC90LUg0L/QtdGA0LXQudGC0Lgg0L/QtdGA0LXQvCAnICtcbiAgICAn0L/QtdGA0LXRh9C40YHQu9C10L3QuNC1INC/0L4g0L/QvtC60LAg0L/QvtC/0YvRgtC60LAg0L/RgNC10YDQstCw0YLRjCDQv9GA0L7QtNC+0LvQttC40YLRjCDQv9GA0L7RhtC10LTRg9GA0LAg0YHRgtGA0L7QutCwINGC0L7Qs9C00LAg0YTRgSDRhNGD0L3QutGG0LjRjyDRhtC40LrQuyAnICtcbiAgICAn0YfQuNGB0LvQviDRjdC60YHQv9C+0YDRgic7XG4gIHZhciBPbmVTX0JVSUxUX0lOID0gJ2Fuc2l0b29lbSBvZW10b2Fuc2kg0LLQstC10YHRgtC40LLQuNC00YHRg9Cx0LrQvtC90YLQviDQstCy0LXRgdGC0LjQtNCw0YLRgyDQstCy0LXRgdGC0LjQt9C90LDRh9C10L3QuNC1ICcgK1xuICAgICfQstCy0LXRgdGC0LjQv9C10YDQtdGH0LjRgdC70LXQvdC40LUg0LLQstC10YHRgtC40L/QtdGA0LjQvtC0INCy0LLQtdGB0YLQuNC/0LvQsNC90YHRh9C10YLQvtCyINCy0LLQtdGB0YLQuNGB0YLRgNC+0LrRgyDQstCy0LXRgdGC0LjRh9C40YHQu9C+INCy0L7Qv9GA0L7RgSAnICtcbiAgICAn0LLQvtGB0YHRgtCw0L3QvtCy0LjRgtGM0LfQvdCw0YfQtdC90LjQtSDQstGA0LXQsyDQstGL0LHRgNCw0L3QvdGL0LnQv9C70LDQvdGB0YfQtdGC0L7QsiDQstGL0LfQstCw0YLRjNC40YHQutC70Y7Rh9C10L3QuNC1INC00LDRgtCw0LPQvtC0INC00LDRgtCw0LzQtdGB0Y/RhiAnICtcbiAgICAn0LTQsNGC0LDRh9C40YHQu9C+INC00L7QsdCw0LLQuNGC0YzQvNC10YHRj9GGINC30LDQstC10YDRiNC40YLRjNGA0LDQsdC+0YLRg9GB0LjRgdGC0LXQvNGLINC30LDQs9C+0LvQvtCy0L7QutGB0LjRgdGC0LXQvNGLINC30LDQv9C40YHRjNC20YPRgNC90LDQu9Cw0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCAnICtcbiAgICAn0LfQsNC/0YPRgdGC0LjRgtGM0L/RgNC40LvQvtC20LXQvdC40LUg0LfQsNGE0LjQutGB0LjRgNC+0LLQsNGC0YzRgtGA0LDQvdC30LDQutGG0LjRjiDQt9C90LDRh9C10L3QuNC10LLRgdGC0YDQvtC60YMg0LfQvdCw0YfQtdC90LjQtdCy0YHRgtGA0L7QutGD0LLQvdGD0YLRgCAnICtcbiAgICAn0LfQvdCw0YfQtdC90LjQtdCy0YTQsNC50Lsg0LfQvdCw0YfQtdC90LjQtdC40LfRgdGC0YDQvtC60Lgg0LfQvdCw0YfQtdC90LjQtdC40LfRgdGC0YDQvtC60LjQstC90YPRgtGAINC30L3QsNGH0LXQvdC40LXQuNC30YTQsNC50LvQsCDQuNC80Y/QutC+0LzQv9GM0Y7RgtC10YDQsCAnICtcbiAgICAn0LjQvNGP0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPINC60LDRgtCw0LvQvtCz0LLRgNC10LzQtdC90L3Ri9GF0YTQsNC50LvQvtCyINC60LDRgtCw0LvQvtCz0LjQsSDQutCw0YLQsNC70L7Qs9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQutCw0YLQsNC70L7Qs9C/0YDQvtCz0YDQsNC80LzRiyAnICtcbiAgICAn0LrQvtC00YHQuNC80LIg0LrQvtC80LDQvdC00LDRgdC40YHRgtC10LzRiyDQutC+0L3Qs9C+0LTQsCDQutC+0L3QtdGG0L/QtdGA0LjQvtC00LDQsdC4INC60L7QvdC10YbRgNCw0YHRgdGH0LjRgtCw0L3QvdC+0LPQvtC/0LXRgNC40L7QtNCw0LHQuCAnICtcbiAgICAn0LrQvtC90LXRhtGB0YLQsNC90LTQsNGA0YLQvdC+0LPQvtC40L3RgtC10YDQstCw0LvQsCDQutC+0L3QutCy0LDRgNGC0LDQu9CwINC60L7QvdC80LXRgdGP0YbQsCDQutC+0L3QvdC10LTQtdC70Lgg0LvQtdCyINC70L7QsyDQu9C+0LMxMCDQvNCw0LrRgSAnICtcbiAgICAn0LzQsNC60YHQuNC80LDQu9GM0L3QvtC10LrQvtC70LjRh9C10YHRgtCy0L7RgdGD0LHQutC+0L3RgtC+INC80LjQvSDQvNC+0L3QvtC/0L7Qu9GM0L3Ri9C50YDQtdC20LjQvCDQvdCw0LfQstCw0L3QuNC10LjQvdGC0LXRgNGE0LXQudGB0LAg0L3QsNC30LLQsNC90LjQtdC90LDQsdC+0YDQsNC/0YDQsNCyICcgK1xuICAgICfQvdCw0LfQvdCw0YfQuNGC0YzQstC40LQg0L3QsNC30L3QsNGH0LjRgtGM0YHRh9C10YIg0L3QsNC50YLQuCDQvdCw0LnRgtC40L/QvtC80LXRh9C10L3QvdGL0LXQvdCw0YPQtNCw0LvQtdC90LjQtSDQvdCw0LnRgtC40YHRgdGL0LvQutC4INC90LDRh9Cw0LvQvtC/0LXRgNC40L7QtNCw0LHQuCAnICtcbiAgICAn0L3QsNGH0LDQu9C+0YHRgtCw0L3QtNCw0YDRgtC90L7Qs9C+0LjQvdGC0LXRgNCy0LDQu9CwINC90LDRh9Cw0YLRjNGC0YDQsNC90LfQsNC60YbQuNGOINC90LDRh9Cz0L7QtNCwINC90LDRh9C60LLQsNGA0YLQsNC70LAg0L3QsNGH0LzQtdGB0Y/RhtCwINC90LDRh9C90LXQtNC10LvQuCAnICtcbiAgICAn0L3QvtC80LXRgNC00L3Rj9Cz0L7QtNCwINC90L7QvNC10YDQtNC90Y/QvdC10LTQtdC70Lgg0L3QvtC80LXRgNC90LXQtNC10LvQuNCz0L7QtNCwINC90YDQtdCzINC+0LHRgNCw0LHQvtGC0LrQsNC+0LbQuNC00LDQvdC40Y8g0L7QutGAINC+0L/QuNGB0LDQvdC40LXQvtGI0LjQsdC60LggJyArXG4gICAgJ9C+0YHQvdC+0LLQvdC+0LnQttGD0YDQvdCw0LvRgNCw0YHRh9C10YLQvtCyINC+0YHQvdC+0LLQvdC+0LnQv9C70LDQvdGB0YfQtdGC0L7QsiDQvtGB0L3QvtCy0L3QvtC50Y/Qt9GL0Log0L7RgtC60YDRi9GC0YzRhNC+0YDQvNGDINC+0YLQutGA0YvRgtGM0YTQvtGA0LzRg9C80L7QtNCw0LvRjNC90L4gJyArXG4gICAgJ9C+0YLQvNC10L3QuNGC0YzRgtGA0LDQvdC30LDQutGG0LjRjiDQvtGH0LjRgdGC0LjRgtGM0L7QutC90L7RgdC+0L7QsdGJ0LXQvdC40Lkg0L/QtdGA0LjQvtC00YHRgtGAINC/0L7Qu9C90L7QtdC40LzRj9C/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQv9C+0LvRg9GH0LjRgtGM0LLRgNC10LzRj9GC0LAgJyArXG4gICAgJ9C/0L7Qu9GD0YfQuNGC0YzQtNCw0YLRg9GC0LAg0L/QvtC70YPRh9C40YLRjNC00L7QutGD0LzQtdC90YLRgtCwINC/0L7Qu9GD0YfQuNGC0YzQt9C90LDRh9C10L3QuNGP0L7RgtCx0L7RgNCwINC/0L7Qu9GD0YfQuNGC0YzQv9C+0LfQuNGG0LjRjtGC0LAgJyArXG4gICAgJ9C/0L7Qu9GD0YfQuNGC0YzQv9GD0YHRgtC+0LXQt9C90LDRh9C10L3QuNC1INC/0L7Qu9GD0YfQuNGC0YzRgtCwINC/0YDQsNCyINC/0YDQsNCy0L7QtNC+0YHRgtGD0L/QsCDQv9GA0LXQtNGD0L/RgNC10LbQtNC10L3QuNC1INC/0YDQtdGE0LjQutGB0LDQstGC0L7QvdGD0LzQtdGA0LDRhtC40LggJyArXG4gICAgJ9C/0YPRgdGC0LDRj9GB0YLRgNC+0LrQsCDQv9GD0YHRgtC+0LXQt9C90LDRh9C10L3QuNC1INGA0LDQsdC+0YfQsNGP0LTQsNGC0YLRjNC/0YPRgdGC0L7QtdC30L3QsNGH0LXQvdC40LUg0YDQsNCx0L7Rh9Cw0Y/QtNCw0YLQsCDRgNCw0LfQtNC10LvQuNGC0LXQu9GM0YHRgtGA0LDQvdC40YYgJyArXG4gICAgJ9GA0LDQt9C00LXQu9C40YLQtdC70YzRgdGC0YDQvtC6INGA0LDQt9C8INGA0LDQt9C+0LHRgNCw0YLRjNC/0L7Qt9C40YbQuNGO0LTQvtC60YPQvNC10L3RgtCwINGA0LDRgdGB0YfQuNGC0LDRgtGM0YDQtdCz0LjRgdGC0YDRi9C90LAgJyArXG4gICAgJ9GA0LDRgdGB0YfQuNGC0LDRgtGM0YDQtdCz0LjRgdGC0YDRi9C/0L4g0YHQuNCz0L3QsNC7INGB0LjQvNCyINGB0LjQvNCy0L7Qu9GC0LDQsdGD0LvRj9GG0LjQuCDRgdC+0LfQtNCw0YLRjNC+0LHRitC10LrRgiDRgdC+0LrRgNC7INGB0L7QutGA0LvQvyDRgdC+0LrRgNC/ICcgK1xuICAgICfRgdC+0L7QsdGJ0LjRgtGMINGB0L7RgdGC0L7Rj9C90LjQtSDRgdC+0YXRgNCw0L3QuNGC0YzQt9C90LDRh9C10L3QuNC1INGB0YDQtdC0INGB0YLQsNGC0YPRgdCy0L7Qt9Cy0YDQsNGC0LAg0YHRgtGA0LTQu9C40L3QsCDRgdGC0YDQt9Cw0LzQtdC90LjRgtGMICcgK1xuICAgICfRgdGC0YDQutC+0LvQuNGH0LXRgdGC0LLQvtGB0YLRgNC+0Log0YHRgtGA0L/QvtC70YPRh9C40YLRjNGB0YLRgNC+0LrRgyAg0YHRgtGA0YfQuNGB0LvQvtCy0YXQvtC20LTQtdC90LjQuSDRgdGE0L7RgNC80LjRgNC+0LLQsNGC0YzQv9C+0LfQuNGG0LjRjtC00L7QutGD0LzQtdC90YLQsCAnICtcbiAgICAn0YHRh9C10YLQv9C+0LrQvtC00YMg0YLQtdC60YPRidCw0Y/QtNCw0YLQsCDRgtC10LrRg9GJ0LXQtdCy0YDQtdC80Y8g0YLQuNC/0LfQvdCw0YfQtdC90LjRjyDRgtC40L/Qt9C90LDRh9C10L3QuNGP0YHRgtGAINGD0LTQsNC70LjRgtGM0L7QsdGK0LXQutGC0YsgJyArXG4gICAgJ9GD0YHRgtCw0L3QvtCy0LjRgtGM0YLQsNC90LAg0YPRgdGC0LDQvdC+0LLQuNGC0YzRgtCw0L/QviDRhNC40LrRgdGI0LDQsdC70L7QvSDRhNC+0YDQvNCw0YIg0YbQtdC7INGI0LDQsdC70L7QvSc7XG4gIHZhciBEUVVPVEUgPSAge2NsYXNzTmFtZTogJ2RxdW90ZScsICBiZWdpbjogJ1wiXCInfTtcbiAgdmFyIFNUUl9TVEFSVCA9IHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCJ8JCcsXG4gICAgICBjb250YWluczogW0RRVU9URV0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9O1xuICB2YXIgU1RSX0NPTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcXFx8JywgZW5kOiAnXCJ8JCcsXG4gICAgY29udGFpbnM6IFtEUVVPVEVdXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGxleGVtczogSURFTlRfUkVfUlUsXG4gICAga2V5d29yZHM6IHtrZXl3b3JkOiBPbmVTX0tFWVdPUkRTLCBidWlsdF9pbjogT25lU19CVUlMVF9JTn0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICBTVFJfU1RBUlQsIFNUUl9DT05ULFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiAnKNC/0YDQvtGG0LXQtNGD0YDQsHzRhNGD0L3QutGG0LjRjyknLCBlbmQ6ICckJyxcbiAgICAgICAgbGV4ZW1zOiBJREVOVF9SRV9SVSxcbiAgICAgICAga2V5d29yZHM6ICfQv9GA0L7RhtC10LTRg9GA0LAg0YTRg9C90LrRhtC40Y8nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiBJREVOVF9SRV9SVX0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGFpbCcsXG4gICAgICAgICAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICAgICAgbGV4ZW1zOiBJREVOVF9SRV9SVSxcbiAgICAgICAgICAgICAgICBrZXl3b3JkczogJ9C30L3QsNGHJyxcbiAgICAgICAgICAgICAgICBjb250YWluczogW1NUUl9TVEFSVCwgU1RSX0NPTlRdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdleHBvcnQnLFxuICAgICAgICAgICAgICAgIGJlZ2luOiAn0Y3QutGB0L/QvtGA0YInLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsZXhlbXM6IElERU5UX1JFX1JVLFxuICAgICAgICAgICAgICAgIGtleXdvcmRzOiAn0Y3QutGB0L/QvtGA0YInLFxuICAgICAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLCBiZWdpbjogJyMnLCBlbmQ6ICckJ30sXG4gICAgICB7Y2xhc3NOYW1lOiAnZGF0ZScsIGJlZ2luOiAnXFwnXFxcXGR7Mn1cXFxcLlxcXFxkezJ9XFxcXC4oXFxcXGR7Mn18XFxcXGR7NH0pXFwnJ31cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgSURFTlRfUkUgPSAnW2EtekEtWl8kXVthLXpBLVowLTlfJF0qJztcbiAgdmFyIElERU5UX0ZVTkNfUkVUVVJOX1RZUEVfUkUgPSAnKFsqXXxbYS16QS1aXyRdW2EtekEtWjAtOV8kXSopJztcblxuICB2YXIgQVMzX1JFU1RfQVJHX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAncmVzdF9hcmcnLFxuICAgIGJlZ2luOiAnWy5dezN9JywgZW5kOiBJREVOVF9SRSxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIHZhciBUSVRMRV9NT0RFID0ge2NsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IElERU5UX1JFfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiAnYXMgYnJlYWsgY2FzZSBjYXRjaCBjbGFzcyBjb25zdCBjb250aW51ZSBkZWZhdWx0IGRlbGV0ZSBkbyBkeW5hbWljIGVhY2ggJyArXG4gICAgICAgICdlbHNlIGV4dGVuZHMgZmluYWwgZmluYWxseSBmb3IgZnVuY3Rpb24gZ2V0IGlmIGltcGxlbWVudHMgaW1wb3J0IGluIGluY2x1ZGUgJyArXG4gICAgICAgICdpbnN0YW5jZW9mIGludGVyZmFjZSBpbnRlcm5hbCBpcyBuYW1lc3BhY2UgbmF0aXZlIG5ldyBvdmVycmlkZSBwYWNrYWdlIHByaXZhdGUgJyArXG4gICAgICAgICdwcm90ZWN0ZWQgcHVibGljIHJldHVybiBzZXQgc3RhdGljIHN1cGVyIHN3aXRjaCB0aGlzIHRocm93IHRyeSB0eXBlb2YgdXNlIHZhciB2b2lkICcgK1xuICAgICAgICAnd2hpbGUgd2l0aCcsXG4gICAgICBsaXRlcmFsOiAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCdcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncGFja2FnZScsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ3BhY2thZ2UnLFxuICAgICAgICBjb250YWluczogW1RJVExFX01PREVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgVElUTEVfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICc7JyxcbiAgICAgICAga2V5d29yZHM6ICdpbXBvcnQgaW5jbHVkZSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnW3s7XScsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFMnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFRJVExFX01PREUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgQVMzX1JFU1RfQVJHX01PREVcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICAgICAgYmVnaW46ICc6JyxcbiAgICAgICAgICAgIGVuZDogSURFTlRfRlVOQ19SRVRVUk5fVFlQRV9SRSxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgTlVNQkVSID0ge2NsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnW1xcXFwkJV1cXFxcZCsnfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiAnYWNjZXB0ZmlsdGVyIGFjY2VwdG11dGV4IGFjY2VwdHBhdGhpbmZvIGFjY2Vzc2ZpbGVuYW1lIGFjdGlvbiBhZGRhbHQgJyArXG4gICAgICAgICdhZGRhbHRieWVuY29kaW5nIGFkZGFsdGJ5dHlwZSBhZGRjaGFyc2V0IGFkZGRlZmF1bHRjaGFyc2V0IGFkZGRlc2NyaXB0aW9uICcgK1xuICAgICAgICAnYWRkZW5jb2RpbmcgYWRkaGFuZGxlciBhZGRpY29uIGFkZGljb25ieWVuY29kaW5nIGFkZGljb25ieXR5cGUgYWRkaW5wdXRmaWx0ZXIgJyArXG4gICAgICAgICdhZGRsYW5ndWFnZSBhZGRtb2R1bGVpbmZvIGFkZG91dHB1dGZpbHRlciBhZGRvdXRwdXRmaWx0ZXJieXR5cGUgYWRkdHlwZSBhbGlhcyAnICtcbiAgICAgICAgJ2FsaWFzbWF0Y2ggYWxsb3cgYWxsb3djb25uZWN0IGFsbG93ZW5jb2RlZHNsYXNoZXMgYWxsb3dvdmVycmlkZSBhbm9ueW1vdXMgJyArXG4gICAgICAgICdhbm9ueW1vdXNfbG9nZW1haWwgYW5vbnltb3VzX211c3RnaXZlZW1haWwgYW5vbnltb3VzX25vdXNlcmlkIGFub255bW91c192ZXJpZnllbWFpbCAnICtcbiAgICAgICAgJ2F1dGhiYXNpY2F1dGhvcml0YXRpdmUgYXV0aGJhc2ljcHJvdmlkZXIgYXV0aGRiZHVzZXJwd3F1ZXJ5IGF1dGhkYmR1c2VycmVhbG1xdWVyeSAnICtcbiAgICAgICAgJ2F1dGhkYm1ncm91cGZpbGUgYXV0aGRibXR5cGUgYXV0aGRibXVzZXJmaWxlIGF1dGhkZWZhdWx0YXV0aG9yaXRhdGl2ZSAnICtcbiAgICAgICAgJ2F1dGhkaWdlc3RhbGdvcml0aG0gYXV0aGRpZ2VzdGRvbWFpbiBhdXRoZGlnZXN0bmNjaGVjayBhdXRoZGlnZXN0bm9uY2Vmb3JtYXQgJyArXG4gICAgICAgICdhdXRoZGlnZXN0bm9uY2VsaWZldGltZSBhdXRoZGlnZXN0cHJvdmlkZXIgYXV0aGRpZ2VzdHFvcCBhdXRoZGlnZXN0c2htZW1zaXplICcgK1xuICAgICAgICAnYXV0aGdyb3VwZmlsZSBhdXRobGRhcGJpbmRkbiBhdXRobGRhcGJpbmRwYXNzd29yZCBhdXRobGRhcGNoYXJzZXRjb25maWcgJyArXG4gICAgICAgICdhdXRobGRhcGNvbXBhcmVkbm9uc2VydmVyIGF1dGhsZGFwZGVyZWZlcmVuY2VhbGlhc2VzIGF1dGhsZGFwZ3JvdXBhdHRyaWJ1dGUgJyArXG4gICAgICAgICdhdXRobGRhcGdyb3VwYXR0cmlidXRlaXNkbiBhdXRobGRhcHJlbW90ZXVzZXJhdHRyaWJ1dGUgYXV0aGxkYXByZW1vdGV1c2VyaXNkbiAnICtcbiAgICAgICAgJ2F1dGhsZGFwdXJsIGF1dGhuYW1lIGF1dGhucHJvdmlkZXJhbGlhcyBhdXRodHlwZSBhdXRodXNlcmZpbGUgYXV0aHpkYm1hdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYXV0aHpkYm10eXBlIGF1dGh6ZGVmYXVsdGF1dGhvcml0YXRpdmUgYXV0aHpncm91cGZpbGVhdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYXV0aHpsZGFwYXV0aG9yaXRhdGl2ZSBhdXRoem93bmVyYXV0aG9yaXRhdGl2ZSBhdXRoenVzZXJhdXRob3JpdGF0aXZlICcgK1xuICAgICAgICAnYmFsYW5jZXJtZW1iZXIgYnJvd3Nlcm1hdGNoIGJyb3dzZXJtYXRjaG5vY2FzZSBidWZmZXJlZGxvZ3MgY2FjaGVkZWZhdWx0ZXhwaXJlICcgK1xuICAgICAgICAnY2FjaGVkaXJsZW5ndGggY2FjaGVkaXJsZXZlbHMgY2FjaGVkaXNhYmxlIGNhY2hlZW5hYmxlIGNhY2hlZmlsZSAnICtcbiAgICAgICAgJ2NhY2hlaWdub3JlY2FjaGVjb250cm9sIGNhY2hlaWdub3JlaGVhZGVycyBjYWNoZWlnbm9yZW5vbGFzdG1vZCAnICtcbiAgICAgICAgJ2NhY2hlaWdub3JlcXVlcnlzdHJpbmcgY2FjaGVsYXN0bW9kaWZpZWRmYWN0b3IgY2FjaGVtYXhleHBpcmUgY2FjaGVtYXhmaWxlc2l6ZSAnICtcbiAgICAgICAgJ2NhY2hlbWluZmlsZXNpemUgY2FjaGVuZWdvdGlhdGVkZG9jcyBjYWNoZXJvb3QgY2FjaGVzdG9yZW5vc3RvcmUgY2FjaGVzdG9yZXByaXZhdGUgJyArXG4gICAgICAgICdjZ2ltYXBleHRlbnNpb24gY2hhcnNldGRlZmF1bHQgY2hhcnNldG9wdGlvbnMgY2hhcnNldHNvdXJjZWVuYyBjaGVja2Nhc2Vvbmx5ICcgK1xuICAgICAgICAnY2hlY2tzcGVsbGluZyBjaHJvb3RkaXIgY29udGVudGRpZ2VzdCBjb29raWVkb21haW4gY29va2llZXhwaXJlcyBjb29raWVsb2cgJyArXG4gICAgICAgICdjb29raWVuYW1lIGNvb2tpZXN0eWxlIGNvb2tpZXRyYWNraW5nIGNvcmVkdW1wZGlyZWN0b3J5IGN1c3RvbWxvZyBkYXYgJyArXG4gICAgICAgICdkYXZkZXB0aGluZmluaXR5IGRhdmdlbmVyaWNsb2NrZGIgZGF2bG9ja2RiIGRhdm1pbnRpbWVvdXQgZGJkZXhwdGltZSBkYmRrZWVwICcgK1xuICAgICAgICAnZGJkbWF4IGRiZG1pbiBkYmRwYXJhbXMgZGJkcGVyc2lzdCBkYmRwcmVwYXJlc3FsIGRiZHJpdmVyIGRlZmF1bHRpY29uICcgK1xuICAgICAgICAnZGVmYXVsdGxhbmd1YWdlIGRlZmF1bHR0eXBlIGRlZmxhdGVidWZmZXJzaXplIGRlZmxhdGVjb21wcmVzc2lvbmxldmVsICcgK1xuICAgICAgICAnZGVmbGF0ZWZpbHRlcm5vdGUgZGVmbGF0ZW1lbWxldmVsIGRlZmxhdGV3aW5kb3dzaXplIGRlbnkgZGlyZWN0b3J5aW5kZXggJyArXG4gICAgICAgICdkaXJlY3RvcnltYXRjaCBkaXJlY3RvcnlzbGFzaCBkb2N1bWVudHJvb3QgZHVtcGlvaW5wdXQgZHVtcGlvbG9nbGV2ZWwgZHVtcGlvb3V0cHV0ICcgK1xuICAgICAgICAnZW5hYmxlZXhjZXB0aW9uaG9vayBlbmFibGVtbWFwIGVuYWJsZXNlbmRmaWxlIGVycm9yZG9jdW1lbnQgZXJyb3Jsb2cgZXhhbXBsZSAnICtcbiAgICAgICAgJ2V4cGlyZXNhY3RpdmUgZXhwaXJlc2J5dHlwZSBleHBpcmVzZGVmYXVsdCBleHRlbmRlZHN0YXR1cyBleHRmaWx0ZXJkZWZpbmUgJyArXG4gICAgICAgICdleHRmaWx0ZXJvcHRpb25zIGZpbGVldGFnIGZpbHRlcmNoYWluIGZpbHRlcmRlY2xhcmUgZmlsdGVycHJvdG9jb2wgZmlsdGVycHJvdmlkZXIgJyArXG4gICAgICAgICdmaWx0ZXJ0cmFjZSBmb3JjZWxhbmd1YWdlcHJpb3JpdHkgZm9yY2V0eXBlIGZvcmVuc2ljbG9nIGdyYWNlZnVsc2h1dGRvd250aW1lb3V0ICcgK1xuICAgICAgICAnZ3JvdXAgaGVhZGVyIGhlYWRlcm5hbWUgaG9zdG5hbWVsb29rdXBzIGlkZW50aXR5Y2hlY2sgaWRlbnRpdHljaGVja3RpbWVvdXQgJyArXG4gICAgICAgICdpbWFwYmFzZSBpbWFwZGVmYXVsdCBpbWFwbWVudSBpbmNsdWRlIGluZGV4aGVhZGluc2VydCBpbmRleGlnbm9yZSBpbmRleG9wdGlvbnMgJyArXG4gICAgICAgICdpbmRleG9yZGVyZGVmYXVsdCBpbmRleHN0eWxlc2hlZXQgaXNhcGlhcHBlbmRsb2d0b2Vycm9ycyBpc2FwaWFwcGVuZGxvZ3RvcXVlcnkgJyArXG4gICAgICAgICdpc2FwaWNhY2hlZmlsZSBpc2FwaWZha2Vhc3luYyBpc2FwaWxvZ25vdHN1cHBvcnRlZCBpc2FwaXJlYWRhaGVhZGJ1ZmZlciBrZWVwYWxpdmUgJyArXG4gICAgICAgICdrZWVwYWxpdmV0aW1lb3V0IGxhbmd1YWdlcHJpb3JpdHkgbGRhcGNhY2hlZW50cmllcyBsZGFwY2FjaGV0dGwgJyArXG4gICAgICAgICdsZGFwY29ubmVjdGlvbnRpbWVvdXQgbGRhcG9wY2FjaGVlbnRyaWVzIGxkYXBvcGNhY2hldHRsIGxkYXBzaGFyZWRjYWNoZWZpbGUgJyArXG4gICAgICAgICdsZGFwc2hhcmVkY2FjaGVzaXplIGxkYXB0cnVzdGVkY2xpZW50Y2VydCBsZGFwdHJ1c3RlZGdsb2JhbGNlcnQgbGRhcHRydXN0ZWRtb2RlICcgK1xuICAgICAgICAnbGRhcHZlcmlmeXNlcnZlcmNlcnQgbGltaXRpbnRlcm5hbHJlY3Vyc2lvbiBsaW1pdHJlcXVlc3Rib2R5IGxpbWl0cmVxdWVzdGZpZWxkcyAnICtcbiAgICAgICAgJ2xpbWl0cmVxdWVzdGZpZWxkc2l6ZSBsaW1pdHJlcXVlc3RsaW5lIGxpbWl0eG1scmVxdWVzdGJvZHkgbGlzdGVuIGxpc3RlbmJhY2tsb2cgJyArXG4gICAgICAgICdsb2FkZmlsZSBsb2FkbW9kdWxlIGxvY2tmaWxlIGxvZ2Zvcm1hdCBsb2dsZXZlbCBtYXhjbGllbnRzIG1heGtlZXBhbGl2ZXJlcXVlc3RzICcgK1xuICAgICAgICAnbWF4bWVtZnJlZSBtYXhyZXF1ZXN0c3BlcmNoaWxkIG1heHJlcXVlc3RzcGVydGhyZWFkIG1heHNwYXJlc2VydmVycyBtYXhzcGFyZXRocmVhZHMgJyArXG4gICAgICAgICdtYXh0aHJlYWRzIG1jYWNoZW1heG9iamVjdGNvdW50IG1jYWNoZW1heG9iamVjdHNpemUgbWNhY2hlbWF4c3RyZWFtaW5nYnVmZmVyICcgK1xuICAgICAgICAnbWNhY2hlbWlub2JqZWN0c2l6ZSBtY2FjaGVyZW1vdmFsYWxnb3JpdGhtIG1jYWNoZXNpemUgbWV0YWRpciBtZXRhZmlsZXMgbWV0YXN1ZmZpeCAnICtcbiAgICAgICAgJ21pbWVtYWdpY2ZpbGUgbWluc3BhcmVzZXJ2ZXJzIG1pbnNwYXJldGhyZWFkcyBtbWFwZmlsZSBtb2RfZ3ppcF9vbiAnICtcbiAgICAgICAgJ21vZF9nemlwX2FkZF9oZWFkZXJfY291bnQgbW9kX2d6aXBfa2VlcF93b3JrZmlsZXMgbW9kX2d6aXBfZGVjaHVuayAnICtcbiAgICAgICAgJ21vZF9nemlwX21pbl9odHRwIG1vZF9nemlwX21pbmltdW1fZmlsZV9zaXplIG1vZF9nemlwX21heGltdW1fZmlsZV9zaXplICcgK1xuICAgICAgICAnbW9kX2d6aXBfbWF4aW11bV9pbm1lbV9zaXplIG1vZF9nemlwX3RlbXBfZGlyIG1vZF9nemlwX2l0ZW1faW5jbHVkZSAnICtcbiAgICAgICAgJ21vZF9nemlwX2l0ZW1fZXhjbHVkZSBtb2RfZ3ppcF9jb21tYW5kX3ZlcnNpb24gbW9kX2d6aXBfY2FuX25lZ290aWF0ZSAnICtcbiAgICAgICAgJ21vZF9nemlwX2hhbmRsZV9tZXRob2RzIG1vZF9nemlwX3N0YXRpY19zdWZmaXggbW9kX2d6aXBfc2VuZF92YXJ5ICcgK1xuICAgICAgICAnbW9kX2d6aXBfdXBkYXRlX3N0YXRpYyBtb2RtaW1ldXNlcGF0aGluZm8gbXVsdGl2aWV3c21hdGNoIG5hbWV2aXJ0dWFsaG9zdCBub3Byb3h5ICcgK1xuICAgICAgICAnbndzc2x0cnVzdGVkY2VydHMgbndzc2x1cGdyYWRlYWJsZSBvcHRpb25zIG9yZGVyIHBhc3NlbnYgcGlkZmlsZSBwcm90b2NvbGVjaG8gJyArXG4gICAgICAgICdwcm94eWJhZGhlYWRlciBwcm94eWJsb2NrIHByb3h5ZG9tYWluIHByb3h5ZXJyb3JvdmVycmlkZSBwcm94eWZ0cGRpcmNoYXJzZXQgJyArXG4gICAgICAgICdwcm94eWlvYnVmZmVyc2l6ZSBwcm94eW1heGZvcndhcmRzIHByb3h5cGFzcyBwcm94eXBhc3NpbnRlcnBvbGF0ZWVudiAnICtcbiAgICAgICAgJ3Byb3h5cGFzc21hdGNoIHByb3h5cGFzc3JldmVyc2UgcHJveHlwYXNzcmV2ZXJzZWNvb2tpZWRvbWFpbiAnICtcbiAgICAgICAgJ3Byb3h5cGFzc3JldmVyc2Vjb29raWVwYXRoIHByb3h5cHJlc2VydmVob3N0IHByb3h5cmVjZWl2ZWJ1ZmZlcnNpemUgcHJveHlyZW1vdGUgJyArXG4gICAgICAgICdwcm94eXJlbW90ZW1hdGNoIHByb3h5cmVxdWVzdHMgcHJveHlzZXQgcHJveHlzdGF0dXMgcHJveHl0aW1lb3V0IHByb3h5dmlhICcgK1xuICAgICAgICAncmVhZG1lbmFtZSByZWNlaXZlYnVmZmVyc2l6ZSByZWRpcmVjdCByZWRpcmVjdG1hdGNoIHJlZGlyZWN0cGVybWFuZW50ICcgK1xuICAgICAgICAncmVkaXJlY3R0ZW1wIHJlbW92ZWNoYXJzZXQgcmVtb3ZlZW5jb2RpbmcgcmVtb3ZlaGFuZGxlciByZW1vdmVpbnB1dGZpbHRlciAnICtcbiAgICAgICAgJ3JlbW92ZWxhbmd1YWdlIHJlbW92ZW91dHB1dGZpbHRlciByZW1vdmV0eXBlIHJlcXVlc3RoZWFkZXIgcmVxdWlyZSByZXdyaXRlYmFzZSAnICtcbiAgICAgICAgJ3Jld3JpdGVjb25kIHJld3JpdGVlbmdpbmUgcmV3cml0ZWxvY2sgcmV3cml0ZWxvZyByZXdyaXRlbG9nbGV2ZWwgcmV3cml0ZW1hcCAnICtcbiAgICAgICAgJ3Jld3JpdGVvcHRpb25zIHJld3JpdGVydWxlIHJsaW1pdGNwdSBybGltaXRtZW0gcmxpbWl0bnByb2Mgc2F0aXNmeSBzY29yZWJvYXJkZmlsZSAnICtcbiAgICAgICAgJ3NjcmlwdCBzY3JpcHRhbGlhcyBzY3JpcHRhbGlhc21hdGNoIHNjcmlwdGludGVycHJldGVyc291cmNlIHNjcmlwdGxvZyAnICtcbiAgICAgICAgJ3NjcmlwdGxvZ2J1ZmZlciBzY3JpcHRsb2dsZW5ndGggc2NyaXB0c29jayBzZWN1cmVsaXN0ZW4gc2VlcmVxdWVzdHRhaWwgJyArXG4gICAgICAgICdzZW5kYnVmZmVyc2l6ZSBzZXJ2ZXJhZG1pbiBzZXJ2ZXJhbGlhcyBzZXJ2ZXJsaW1pdCBzZXJ2ZXJuYW1lIHNlcnZlcnBhdGggJyArXG4gICAgICAgICdzZXJ2ZXJyb290IHNlcnZlcnNpZ25hdHVyZSBzZXJ2ZXJ0b2tlbnMgc2V0ZW52IHNldGVudmlmIHNldGVudmlmbm9jYXNlIHNldGhhbmRsZXIgJyArXG4gICAgICAgICdzZXRpbnB1dGZpbHRlciBzZXRvdXRwdXRmaWx0ZXIgc3NpZW5hYmxlYWNjZXNzIHNzaWVuZHRhZyBzc2llcnJvcm1zZyBzc2lzdGFydHRhZyAnICtcbiAgICAgICAgJ3NzaXRpbWVmb3JtYXQgc3NpdW5kZWZpbmVkZWNobyBzc2xjYWNlcnRpZmljYXRlZmlsZSBzc2xjYWNlcnRpZmljYXRlcGF0aCAnICtcbiAgICAgICAgJ3NzbGNhZG5yZXF1ZXN0ZmlsZSBzc2xjYWRucmVxdWVzdHBhdGggc3NsY2FyZXZvY2F0aW9uZmlsZSBzc2xjYXJldm9jYXRpb25wYXRoICcgK1xuICAgICAgICAnc3NsY2VydGlmaWNhdGVjaGFpbmZpbGUgc3NsY2VydGlmaWNhdGVmaWxlIHNzbGNlcnRpZmljYXRla2V5ZmlsZSBzc2xjaXBoZXJzdWl0ZSAnICtcbiAgICAgICAgJ3NzbGNyeXB0b2RldmljZSBzc2xlbmdpbmUgc3NsaG9ub3JjaXBlcm9yZGVyIHNzbG11dGV4IHNzbG9wdGlvbnMgJyArXG4gICAgICAgICdzc2xwYXNzcGhyYXNlZGlhbG9nIHNzbHByb3RvY29sIHNzbHByb3h5Y2FjZXJ0aWZpY2F0ZWZpbGUgJyArXG4gICAgICAgICdzc2xwcm94eWNhY2VydGlmaWNhdGVwYXRoIHNzbHByb3h5Y2FyZXZvY2F0aW9uZmlsZSBzc2xwcm94eWNhcmV2b2NhdGlvbnBhdGggJyArXG4gICAgICAgICdzc2xwcm94eWNpcGhlcnN1aXRlIHNzbHByb3h5ZW5naW5lIHNzbHByb3h5bWFjaGluZWNlcnRpZmljYXRlZmlsZSAnICtcbiAgICAgICAgJ3NzbHByb3h5bWFjaGluZWNlcnRpZmljYXRlcGF0aCBzc2xwcm94eXByb3RvY29sIHNzbHByb3h5dmVyaWZ5ICcgK1xuICAgICAgICAnc3NscHJveHl2ZXJpZnlkZXB0aCBzc2xyYW5kb21zZWVkIHNzbHJlcXVpcmUgc3NscmVxdWlyZXNzbCBzc2xzZXNzaW9uY2FjaGUgJyArXG4gICAgICAgICdzc2xzZXNzaW9uY2FjaGV0aW1lb3V0IHNzbHVzZXJuYW1lIHNzbHZlcmlmeWNsaWVudCBzc2x2ZXJpZnlkZXB0aCBzdGFydHNlcnZlcnMgJyArXG4gICAgICAgICdzdGFydHRocmVhZHMgc3Vic3RpdHV0ZSBzdWV4ZWN1c2VyZ3JvdXAgdGhyZWFkbGltaXQgdGhyZWFkc3BlcmNoaWxkICcgK1xuICAgICAgICAndGhyZWFkc3RhY2tzaXplIHRpbWVvdXQgdHJhY2VlbmFibGUgdHJhbnNmZXJsb2cgdHlwZXNjb25maWcgdW5zZXRlbnYgJyArXG4gICAgICAgICd1c2VjYW5vbmljYWxuYW1lIHVzZWNhbm9uaWNhbHBoeXNpY2FscG9ydCB1c2VyIHVzZXJkaXIgdmlydHVhbGRvY3VtZW50cm9vdCAnICtcbiAgICAgICAgJ3ZpcnR1YWxkb2N1bWVudHJvb3RpcCB2aXJ0dWFsc2NyaXB0YWxpYXMgdmlydHVhbHNjcmlwdGFsaWFzaXAgJyArXG4gICAgICAgICd3aW4zMmRpc2FibGVhY2NlcHRleCB4Yml0aGFjaycsXG4gICAgICBsaXRlcmFsOiAnb24gb2ZmJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NxYnJhY2tldCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXHNcXFxcWycsIGVuZDogJ1xcXFxdJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NicmFja2V0JyxcbiAgICAgICAgYmVnaW46ICdbXFxcXCQlXVxcXFx7JywgZW5kOiAnXFxcXH0nLFxuICAgICAgICBjb250YWluczogWydzZWxmJywgTlVNQkVSXVxuICAgICAgfSxcbiAgICAgIE5VTUJFUixcbiAgICAgIHtjbGFzc05hbWU6ICd0YWcnLCBiZWdpbjogJzwvPycsIGVuZDogJz4nfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgU1RSSU5HID0gaGxqcy5pbmhlcml0KGhsanMuUVVPVEVfU1RSSU5HX01PREUsIHtpbGxlZ2FsOiAnJ30pO1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHZhciBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCBobGpzLkNfTlVNQkVSX01PREUsIFNUUklOR11cbiAgfTtcbiAgdmFyIENPTU1FTlRTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICctLScsIGVuZDogJyQnLFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJ1xcXFwoXFxcXConLCBlbmQ6ICdcXFxcKlxcXFwpJyxcbiAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCB7YmVnaW46ICctLScsIGVuZDogJyQnfV0gLy9hbGxvdyBuZXN0aW5nXG4gICAgfSxcbiAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFXG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2Fib3V0IGFib3ZlIGFmdGVyIGFnYWluc3QgYW5kIGFyb3VuZCBhcyBhdCBiYWNrIGJlZm9yZSBiZWdpbm5pbmcgJyArXG4gICAgICAgICdiZWhpbmQgYmVsb3cgYmVuZWF0aCBiZXNpZGUgYmV0d2VlbiBidXQgYnkgY29uc2lkZXJpbmcgJyArXG4gICAgICAgICdjb250YWluIGNvbnRhaW5zIGNvbnRpbnVlIGNvcHkgZGl2IGRvZXMgZWlnaHRoIGVsc2UgZW5kIGVxdWFsICcgK1xuICAgICAgICAnZXF1YWxzIGVycm9yIGV2ZXJ5IGV4aXQgZmlmdGggZmlyc3QgZm9yIGZvdXJ0aCBmcm9tIGZyb250ICcgK1xuICAgICAgICAnZ2V0IGdpdmVuIGdsb2JhbCBpZiBpZ25vcmluZyBpbiBpbnRvIGlzIGl0IGl0cyBsYXN0IGxvY2FsIG1lICcgK1xuICAgICAgICAnbWlkZGxlIG1vZCBteSBuaW50aCBub3Qgb2Ygb24gb250byBvciBvdmVyIHByb3AgcHJvcGVydHkgcHV0IHJlZiAnICtcbiAgICAgICAgJ3JlZmVyZW5jZSByZXBlYXQgcmV0dXJuaW5nIHNjcmlwdCBzZWNvbmQgc2V0IHNldmVudGggc2luY2UgJyArXG4gICAgICAgICdzaXh0aCBzb21lIHRlbGwgdGVudGggdGhhdCB0aGUgdGhlbiB0aGlyZCB0aHJvdWdoIHRocnUgJyArXG4gICAgICAgICd0aW1lb3V0IHRpbWVzIHRvIHRyYW5zYWN0aW9uIHRyeSB1bnRpbCB3aGVyZSB3aGlsZSB3aG9zZSB3aXRoICcgK1xuICAgICAgICAnd2l0aG91dCcsXG4gICAgICBjb25zdGFudDpcbiAgICAgICAgJ0FwcGxlU2NyaXB0IGZhbHNlIGxpbmVmZWVkIHJldHVybiBwaSBxdW90ZSByZXN1bHQgc3BhY2UgdGFiIHRydWUnLFxuICAgICAgdHlwZTpcbiAgICAgICAgJ2FsaWFzIGFwcGxpY2F0aW9uIGJvb2xlYW4gY2xhc3MgY29uc3RhbnQgZGF0ZSBmaWxlIGludGVnZXIgbGlzdCAnICtcbiAgICAgICAgJ251bWJlciByZWFsIHJlY29yZCBzdHJpbmcgdGV4dCcsXG4gICAgICBjb21tYW5kOlxuICAgICAgICAnYWN0aXZhdGUgYmVlcCBjb3VudCBkZWxheSBsYXVuY2ggbG9nIG9mZnNldCByZWFkIHJvdW5kICcgK1xuICAgICAgICAncnVuIHNheSBzdW1tYXJpemUgd3JpdGUnLFxuICAgICAgcHJvcGVydHk6XG4gICAgICAgICdjaGFyYWN0ZXIgY2hhcmFjdGVycyBjb250ZW50cyBkYXkgZnJvbnRtb3N0IGlkIGl0ZW0gbGVuZ3RoICcgK1xuICAgICAgICAnbW9udGggbmFtZSBwYXJhZ3JhcGggcGFyYWdyYXBocyByZXN0IHJldmVyc2UgcnVubmluZyB0aW1lIHZlcnNpb24gJyArXG4gICAgICAgICd3ZWVrZGF5IHdvcmQgd29yZHMgeWVhcidcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBTVFJJTkcsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiUE9TSVggZmlsZVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWFuZCcsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYihjbGlwYm9hcmQgaW5mb3x0aGUgY2xpcGJvYXJkfGluZm8gZm9yfGxpc3QgKGRpc2tzfGZvbGRlcil8JyArXG4gICAgICAgICAgJ21vdW50IHZvbHVtZXxwYXRoIHRvfChjbG9zZXxvcGVuIGZvcikgYWNjZXNzfChnZXR8c2V0KSBlb2Z8JyArXG4gICAgICAgICAgJ2N1cnJlbnQgZGF0ZXxkbyBzaGVsbCBzY3JpcHR8Z2V0IHZvbHVtZSBzZXR0aW5nc3xyYW5kb20gbnVtYmVyfCcgK1xuICAgICAgICAgICdzZXQgdm9sdW1lfHN5c3RlbSBhdHRyaWJ1dGV8c3lzdGVtIGluZm98dGltZSB0byBHTVR8JyArXG4gICAgICAgICAgJyhsb2FkfHJ1bnxzdG9yZSkgc2NyaXB0fHNjcmlwdGluZyBjb21wb25lbnRzfCcgK1xuICAgICAgICAgICdBU0NJSSAoY2hhcmFjdGVyfG51bWJlcil8bG9jYWxpemVkIHN0cmluZ3wnICtcbiAgICAgICAgICAnY2hvb3NlIChhcHBsaWNhdGlvbnxjb2xvcnxmaWxlfGZpbGUgbmFtZXwnICtcbiAgICAgICAgICAnZm9sZGVyfGZyb20gbGlzdHxyZW1vdGUgYXBwbGljYXRpb258VVJMKXwnICtcbiAgICAgICAgICAnZGlzcGxheSAoYWxlcnR8ZGlhbG9nKSlcXFxcYnxeXFxcXHMqcmV0dXJuXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsXG4gICAgICAgIGJlZ2luOlxuICAgICAgICAgICdcXFxcYih0ZXh0IGl0ZW0gZGVsaW1pdGVyc3xjdXJyZW50IGFwcGxpY2F0aW9ufG1pc3NpbmcgdmFsdWUpXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgYmVnaW46XG4gICAgICAgICAgJ1xcXFxiKGFwYXJ0IGZyb218YXNpZGUgZnJvbXxpbnN0ZWFkIG9mfG91dCBvZnxncmVhdGVyIHRoYW58JyArXG4gICAgICAgICAgXCJpc24ndHwoZG9lc24ndHxkb2VzIG5vdCkgKGVxdWFsfGNvbWUgYmVmb3JlfGNvbWUgYWZ0ZXJ8Y29udGFpbil8XCIgK1xuICAgICAgICAgICcoZ3JlYXRlcnxsZXNzKSB0aGFuKCBvciBlcXVhbCk/fChzdGFydHM/fGVuZHN8YmVnaW5zPykgd2l0aHwnICtcbiAgICAgICAgICAnY29udGFpbmVkIGJ5fGNvbWVzIChiZWZvcmV8YWZ0ZXIpfGEgKHJlZnxyZWZlcmVuY2UpKVxcXFxiJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJvcGVydHknLFxuICAgICAgICBiZWdpbjpcbiAgICAgICAgICAnXFxcXGIoUE9TSVggcGF0aHwoZGF0ZXx0aW1lKSBzdHJpbmd8cXVvdGVkIGZvcm0pXFxcXGInXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbl9zdGFydCcsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgIGtleXdvcmRzOiAnb24nLFxuICAgICAgICBpbGxlZ2FsOiAnWyR7PTtcXFxcbl0nLFxuICAgICAgICBjb250YWluczogW1RJVExFLCBQQVJBTVNdXG4gICAgICB9XG4gICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgIC8qIG1uZW1vbmljICovXG4gICAgICAgICdhZGMgYWRkIGFkaXcgYW5kIGFuZGkgYXNyIGJjbHIgYmxkIGJyYmMgYnJicyBicmNjIGJyY3MgYnJlYWsgYnJlcSBicmdlIGJyaGMgYnJocyAnICtcbiAgICAgICAgJ2JyaWQgYnJpZSBicmxvIGJybHQgYnJtaSBicm5lIGJycGwgYnJzaCBicnRjIGJydHMgYnJ2YyBicnZzIGJzZXQgYnN0IGNhbGwgY2JpIGNiciAnICtcbiAgICAgICAgJ2NsYyBjbGggY2xpIGNsbiBjbHIgY2xzIGNsdCBjbHYgY2x6IGNvbSBjcCBjcGMgY3BpIGNwc2UgZGVjIGVpY2FsbCBlaWptcCBlbHBtIGVvciAnICtcbiAgICAgICAgJ2ZtdWwgZm11bHMgZm11bHN1IGljYWxsIGlqbXAgaW4gaW5jIGptcCBsZCBsZGQgbGRpIGxkcyBscG0gbHNsIGxzciBtb3YgbW92dyBtdWwgJyArXG4gICAgICAgICdtdWxzIG11bHN1IG5lZyBub3Agb3Igb3JpIG91dCBwb3AgcHVzaCByY2FsbCByZXQgcmV0aSByam1wIHJvbCByb3Igc2JjIHNiciBzYnJjIHNicnMgJyArXG4gICAgICAgICdzZWMgc2VoIHNiaSBzYmNpIHNiaWMgc2JpcyBzYml3IHNlaSBzZW4gc2VyIHNlcyBzZXQgc2V2IHNleiBzbGVlcCBzcG0gc3Qgc3RkIHN0cyBzdWIgJyArXG4gICAgICAgICdzdWJpIHN3YXAgdHN0IHdkcicsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgLyogZ2VuZXJhbCBwdXJwb3NlIHJlZ2lzdGVycyAqL1xuICAgICAgICAncjAgcjEgcjIgcjMgcjQgcjUgcjYgcjcgcjggcjkgcjEwIHIxMSByMTIgcjEzIHIxNCByMTUgcjE2IHIxNyByMTggcjE5IHIyMCByMjEgcjIyICcgK1xuICAgICAgICAncjIzIHIyNCByMjUgcjI2IHIyNyByMjggcjI5IHIzMCByMzEgeHwwIHhoIHhsIHl8MCB5aCB5bCB6fDAgemggemwgJyArXG4gICAgICAgIC8qIElPIFJlZ2lzdGVycyAoQVRNZWdhMTI4KSAqL1xuICAgICAgICAndWNzcjFjIHVkcjEgdWNzcjFhIHVjc3IxYiB1YnJyMWwgdWJycjFoIHVjc3IwYyB1YnJyMGggdGNjcjNjIHRjY3IzYSB0Y2NyM2IgdGNudDNoICcgK1xuICAgICAgICAndGNudDNsIG9jcjNhaCBvY3IzYWwgb2NyM2JoIG9jcjNibCBvY3IzY2ggb2NyM2NsIGljcjNoIGljcjNsIGV0aW1zayBldGlmciB0Y2NyMWMgJyArXG4gICAgICAgICdvY3IxY2ggb2NyMWNsIHR3Y3IgdHdkciB0d2FyIHR3c3IgdHdiciBvc2NjYWwgeG1jcmEgeG1jcmIgZWljcmEgc3BtY3NyIHNwbWNyIHBvcnRnICcgK1xuICAgICAgICAnZGRyZyBwaW5nIHBvcnRmIGRkcmYgc3JlZyBzcGggc3BsIHhkaXYgcmFtcHogZWljcmIgZWltc2sgZ2ltc2sgZ2ljciBlaWZyIGdpZnIgdGltc2sgJyArXG4gICAgICAgICd0aWZyIG1jdWNyIG1jdWNzciB0Y2NyMCB0Y250MCBvY3IwIGFzc3IgdGNjcjFhIHRjY3IxYiB0Y250MWggdGNudDFsIG9jcjFhaCBvY3IxYWwgJyArXG4gICAgICAgICdvY3IxYmggb2NyMWJsIGljcjFoIGljcjFsIHRjY3IyIHRjbnQyIG9jcjIgb2NkciB3ZHRjciBzZmlvciBlZWFyaCBlZWFybCBlZWRyIGVlY3IgJyArXG4gICAgICAgICdwb3J0YSBkZHJhIHBpbmEgcG9ydGIgZGRyYiBwaW5iIHBvcnRjIGRkcmMgcGluYyBwb3J0ZCBkZHJkIHBpbmQgc3BkciBzcHNyIHNwY3IgdWRyMCAnICtcbiAgICAgICAgJ3Vjc3IwYSB1Y3NyMGIgdWJycjBsIGFjc3IgYWRtdXggYWRjc3IgYWRjaCBhZGNsIHBvcnRlIGRkcmUgcGluZSBwaW5mJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7Y2xhc3NOYW1lOiAnY29tbWVudCcsIGJlZ2luOiAnOycsICBlbmQ6ICckJ30sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsIC8vIDB4Li4uLCBkZWNpbWFsLCBmbG9hdFxuICAgICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsIC8vIDBiLi4uXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoXFxcXCRbYS16QS1aMC05XSt8MG9bMC03XSspJyAvLyAkLi4uLCAwby4uLlxuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnW15cXFxcXFxcXF1cXCcnLFxuICAgICAgICBpbGxlZ2FsOiAnW15cXFxcXFxcXF1bXlxcJ10nXG4gICAgICB9LFxuICAgICAge2NsYXNzTmFtZTogJ2xhYmVsJywgIGJlZ2luOiAnXltBLVphLXowLTlfLiRdKzonfSxcbiAgICAgIHtjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLCBiZWdpbjogJyMnLCBlbmQ6ICckJ30sXG4gICAgICB7ICAvLyDQtNC40YDQtdC60YLQuNCy0YsgwqsuaW5jbHVkZcK7IMKrLm1hY3Jvwrsg0Lgg0YIu0LQuXG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXC5bYS16QS1aXSsnXG4gICAgICB9LFxuICAgICAgeyAgLy8g0L/QvtC00YHRgtCw0L3QvtCy0LrQsCDQsiDCqy5tYWNyb8K7XG4gICAgICAgIGNsYXNzTmFtZTogJ2xvY2FsdmFycycsXG4gICAgICAgIGJlZ2luOiAnQFswLTldKydcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiAnZmFsc2UgaW50IGFic3RyYWN0IHByaXZhdGUgY2hhciBpbnRlcmZhY2UgYm9vbGVhbiBzdGF0aWMgbnVsbCBpZiBmb3IgdHJ1ZSAnICtcbiAgICAgICd3aGlsZSBsb25nIHRocm93IGZpbmFsbHkgcHJvdGVjdGVkIGV4dGVuZHMgZmluYWwgaW1wbGVtZW50cyByZXR1cm4gdm9pZCBlbnVtIGVsc2UgJyArXG4gICAgICAnYnJlYWsgbmV3IGNhdGNoIGJ5dGUgc3VwZXIgY2xhc3MgY2FzZSBzaG9ydCBkZWZhdWx0IGRvdWJsZSBwdWJsaWMgdHJ5IHRoaXMgc3dpdGNoICcgK1xuICAgICAgJ2NvbnRpbnVlIHJldmVyc2UgZmlyc3RmYXN0IGZpcnN0b25seSBmb3J1cGRhdGUgbm9mZXRjaCBzdW0gYXZnIG1pbm9mIG1heG9mIGNvdW50ICcgK1xuICAgICAgJ29yZGVyIGdyb3VwIGJ5IGFzYyBkZXNjIGluZGV4IGhpbnQgbGlrZSBkaXNwYWx5IGVkaXQgY2xpZW50IHNlcnZlciB0dHNiZWdpbiAnICtcbiAgICAgICd0dHNjb21taXQgc3RyIHJlYWwgZGF0ZSBjb250YWluZXIgYW55dHlwZSBjb21tb24gZGl2IG1vZCcsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICd7JyxcbiAgICAgICAgaWxsZWdhbDogJzonLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnaW5oZXJpdGFuY2UnLFxuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyBpbXBsZW1lbnRzJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQkFTSF9MSVRFUkFMID0gJ3RydWUgZmFsc2UnO1xuICB2YXIgQkFTSF9LRVlXT1JEID0gJ2lmIHRoZW4gZWxzZSBlbGlmIGZpIGZvciBicmVhayBjb250aW51ZSB3aGlsZSBpbiBkbyBkb25lIGVjaG8gZXhpdCByZXR1cm4gc2V0IGRlY2xhcmUnO1xuICB2YXIgVkFSMSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnXFxcXCRbYS16QS1aMC05XyNdKydcbiAgfTtcbiAgdmFyIFZBUjIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkeyhbXn1dfFxcXFxcXFxcfSkrfSdcbiAgfTtcbiAgdmFyIFFVT1RFX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwgVkFSMSwgVkFSMl0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBBUE9TX1NUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICBjb250YWluczogW3tiZWdpbjogJ1xcJ1xcJyd9XSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFRFU1RfQ09ORElUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ3Rlc3RfY29uZGl0aW9uJyxcbiAgICBiZWdpbjogJycsIGVuZDogJycsXG4gICAgY29udGFpbnM6IFtRVU9URV9TVFJJTkcsIEFQT1NfU1RSSU5HLCBWQVIxLCBWQVIyXSxcbiAgICBrZXl3b3Jkczoge1xuICAgICAgbGl0ZXJhbDogQkFTSF9MSVRFUkFMXG4gICAgfSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOiBCQVNIX0tFWVdPUkQsXG4gICAgICBsaXRlcmFsOiBCQVNIX0xJVEVSQUxcbiAgICB9LFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NoZWJhbmcnLFxuICAgICAgICBiZWdpbjogJygjIVxcXFwvYmluXFxcXC9iYXNoKXwoIyFcXFxcL2JpblxcXFwvc2gpJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIFZBUjEsXG4gICAgICBWQVIyLFxuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIFFVT1RFX1NUUklORyxcbiAgICAgIEFQT1NfU1RSSU5HLFxuICAgICAgaGxqcy5pbmhlcml0KFRFU1RfQ09ORElUSU9OLCB7YmVnaW46ICdcXFxcWyAnLCBlbmQ6ICcgXFxcXF0nLCByZWxldmFuY2U6IDB9KSxcbiAgICAgIGhsanMuaW5oZXJpdChURVNUX0NPTkRJVElPTiwge2JlZ2luOiAnXFxcXFtcXFxcWyAnLCBlbmQ6ICcgXFxcXF1cXFxcXSd9KVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKXtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdbXlxcXFxbXFxcXF1cXFxcLixcXFxcK1xcXFwtPD4gXFxyXFxuXScsXG4gICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgIGVuZDogJ1tcXFxcW1xcXFxdXFxcXC4sXFxcXCtcXFxcLTw+IFxcclxcbl0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXFtcXFxcXV0nLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnW1xcXFwuLF0nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgYmVnaW46ICdbXFxcXCtcXFxcLV0nXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIGtleXdvcmRzID0ge1xuICAgIGJ1aWx0X2luOlxuICAgICAgLy8gQ2xvanVyZSBrZXl3b3Jkc1xuICAgICAgJ2RlZiBjb25kIGFwcGx5IGlmLW5vdCBpZi1sZXQgaWYgbm90IG5vdD0gPSAmbHQ7IDwgPiAmbHQ7PSA8PSA+PSA9PSArIC8gKiAtIHJlbSAnK1xuICAgICAgJ3F1b3QgbmVnPyBwb3M/IGRlbGF5PyBzeW1ib2w/IGtleXdvcmQ/IHRydWU/IGZhbHNlPyBpbnRlZ2VyPyBlbXB0eT8gY29sbD8gbGlzdD8gJytcbiAgICAgICdzZXQ/IGlmbj8gZm4/IGFzc29jaWF0aXZlPyBzZXF1ZW50aWFsPyBzb3J0ZWQ/IGNvdW50ZWQ/IHJldmVyc2libGU/IG51bWJlcj8gZGVjaW1hbD8gJytcbiAgICAgICdjbGFzcz8gZGlzdGluY3Q/IGlzYT8gZmxvYXQ/IHJhdGlvbmFsPyByZWR1Y2VkPyByYXRpbz8gb2RkPyBldmVuPyBjaGFyPyBzZXE/IHZlY3Rvcj8gJytcbiAgICAgICdzdHJpbmc/IG1hcD8gbmlsPyBjb250YWlucz8gemVybz8gaW5zdGFuY2U/IG5vdC1ldmVyeT8gbm90LWFueT8gbGlic3BlYz8gLT4gLT4+IC4uIC4gJytcbiAgICAgICdpbmMgY29tcGFyZSBkbyBkb3RpbWVzIG1hcGNhdCB0YWtlIHJlbW92ZSB0YWtlLXdoaWxlIGRyb3AgbGV0Zm4gZHJvcC1sYXN0IHRha2UtbGFzdCAnK1xuICAgICAgJ2Ryb3Atd2hpbGUgd2hpbGUgaW50ZXJuIGNvbmRwIGNhc2UgcmVkdWNlZCBjeWNsZSBzcGxpdC1hdCBzcGxpdC13aXRoIHJlcGVhdCByZXBsaWNhdGUgJytcbiAgICAgICdpdGVyYXRlIHJhbmdlIG1lcmdlIHppcG1hcCBkZWNsYXJlIGxpbmUtc2VxIHNvcnQgY29tcGFyYXRvciBzb3J0LWJ5IGRvcnVuIGRvYWxsIG50aG5leHQgJytcbiAgICAgICdudGhyZXN0IHBhcnRpdGlvbiBldmFsIGRvc2VxIGF3YWl0IGF3YWl0LWZvciBsZXQgYWdlbnQgYXRvbSBzZW5kIHNlbmQtb2ZmIHJlbGVhc2UtcGVuZGluZy1zZW5kcyAnK1xuICAgICAgJ2FkZC13YXRjaCBtYXB2IGZpbHRlcnYgcmVtb3ZlLXdhdGNoIGFnZW50LWVycm9yIHJlc3RhcnQtYWdlbnQgc2V0LWVycm9yLWhhbmRsZXIgZXJyb3ItaGFuZGxlciAnK1xuICAgICAgJ3NldC1lcnJvci1tb2RlISBlcnJvci1tb2RlIHNodXRkb3duLWFnZW50cyBxdW90ZSB2YXIgZm4gbG9vcCByZWN1ciB0aHJvdyB0cnkgbW9uaXRvci1lbnRlciAnK1xuICAgICAgJ21vbml0b3ItZXhpdCBkZWZtYWNybyBkZWZuIGRlZm4tIG1hY3JvZXhwYW5kIG1hY3JvZXhwYW5kLTEgZm9yIGRvc2VxIGRvc3luYyBkb3RpbWVzIGFuZCBvciAnK1xuICAgICAgJ3doZW4gd2hlbi1ub3Qgd2hlbi1sZXQgY29tcCBqdXh0IHBhcnRpYWwgc2VxdWVuY2UgbWVtb2l6ZSBjb25zdGFudGx5IGNvbXBsZW1lbnQgaWRlbnRpdHkgYXNzZXJ0ICcrXG4gICAgICAncGVlayBwb3AgZG90byBwcm94eSBkZWZzdHJ1Y3QgZmlyc3QgcmVzdCBjb25zIGRlZnByb3RvY29sIGNhc3QgY29sbCBkZWZ0eXBlIGRlZnJlY29yZCBsYXN0IGJ1dGxhc3QgJytcbiAgICAgICdzaWdzIHJlaWZ5IHNlY29uZCBmZmlyc3QgZm5leHQgbmZpcnN0IG5uZXh0IGRlZm11bHRpIGRlZm1ldGhvZCBtZXRhIHdpdGgtbWV0YSBucyBpbi1ucyBjcmVhdGUtbnMgaW1wb3J0ICcrXG4gICAgICAnaW50ZXJuIHJlZmVyIGtleXMgc2VsZWN0LWtleXMgdmFscyBrZXkgdmFsIHJzZXEgbmFtZSBuYW1lc3BhY2UgcHJvbWlzZSBpbnRvIHRyYW5zaWVudCBwZXJzaXN0ZW50ISBjb25qISAnK1xuICAgICAgJ2Fzc29jISBkaXNzb2MhIHBvcCEgZGlzaiEgaW1wb3J0IHVzZSBjbGFzcyB0eXBlIG51bSBmbG9hdCBkb3VibGUgc2hvcnQgYnl0ZSBib29sZWFuIGJpZ2ludCBiaWdpbnRlZ2VyICcrXG4gICAgICAnYmlnZGVjIHByaW50LW1ldGhvZCBwcmludC1kdXAgdGhyb3ctaWYgdGhyb3cgcHJpbnRmIGZvcm1hdCBsb2FkIGNvbXBpbGUgZ2V0LWluIHVwZGF0ZS1pbiBwciBwci1vbiBuZXdsaW5lICcrXG4gICAgICAnZmx1c2ggcmVhZCBzbHVycCByZWFkLWxpbmUgc3VidmVjIHdpdGgtb3BlbiBtZW1mbiB0aW1lIG5zIGFzc2VydCByZS1maW5kIHJlLWdyb3VwcyByYW5kLWludCByYW5kIG1vZCBsb2NraW5nICcrXG4gICAgICAnYXNzZXJ0LXZhbGlkLWZkZWNsIGFsaWFzIG5hbWVzcGFjZSByZXNvbHZlIHJlZiBkZXJlZiByZWZzZXQgc3dhcCEgcmVzZXQhIHNldC12YWxpZGF0b3IhIGNvbXBhcmUtYW5kLXNldCEgYWx0ZXItbWV0YSEgJytcbiAgICAgICdyZXNldC1tZXRhISBjb21tdXRlIGdldC12YWxpZGF0b3IgYWx0ZXIgcmVmLXNldCByZWYtaGlzdG9yeS1jb3VudCByZWYtbWluLWhpc3RvcnkgcmVmLW1heC1oaXN0b3J5IGVuc3VyZSBzeW5jIGlvISAnK1xuICAgICAgJ25ldyBuZXh0IGNvbmogc2V0ISBtZW1mbiB0by1hcnJheSBmdXR1cmUgZnV0dXJlLWNhbGwgaW50by1hcnJheSBhc2V0IGdlbi1jbGFzcyByZWR1Y2UgbWVyZ2UgbWFwIGZpbHRlciBmaW5kIGVtcHR5ICcrXG4gICAgICAnaGFzaC1tYXAgaGFzaC1zZXQgc29ydGVkLW1hcCBzb3J0ZWQtbWFwLWJ5IHNvcnRlZC1zZXQgc29ydGVkLXNldC1ieSB2ZWMgdmVjdG9yIHNlcSBmbGF0dGVuIHJldmVyc2UgYXNzb2MgZGlzc29jIGxpc3QgJytcbiAgICAgICdkaXNqIGdldCB1bmlvbiBkaWZmZXJlbmNlIGludGVyc2VjdGlvbiBleHRlbmQgZXh0ZW5kLXR5cGUgZXh0ZW5kLXByb3RvY29sIGludCBudGggZGVsYXkgY291bnQgY29uY2F0IGNodW5rIGNodW5rLWJ1ZmZlciAnK1xuICAgICAgJ2NodW5rLWFwcGVuZCBjaHVuay1maXJzdCBjaHVuay1yZXN0IG1heCBtaW4gZGVjIHVuY2hlY2tlZC1pbmMtaW50IHVuY2hlY2tlZC1pbmMgdW5jaGVja2VkLWRlYy1pbmMgdW5jaGVja2VkLWRlYyB1bmNoZWNrZWQtbmVnYXRlICcrXG4gICAgICAndW5jaGVja2VkLWFkZC1pbnQgdW5jaGVja2VkLWFkZCB1bmNoZWNrZWQtc3VidHJhY3QtaW50IHVuY2hlY2tlZC1zdWJ0cmFjdCBjaHVuay1uZXh0IGNodW5rLWNvbnMgY2h1bmtlZC1zZXE/IHBybiB2YXJ5LW1ldGEgJytcbiAgICAgICdsYXp5LXNlcSBzcHJlYWQgbGlzdCogc3RyIGZpbmQta2V5d29yZCBrZXl3b3JkIHN5bWJvbCBnZW5zeW0gZm9yY2UgcmF0aW9uYWxpemUnXG4gICB9O1xuXG4gIHZhciBDTEpfSURFTlRfUkUgPSAnW2EtekEtWl8wLTlcXFxcIVxcXFwuXFxcXD9cXFxcLVxcXFwrXFxcXCpcXFxcL1xcXFw8XFxcXD1cXFxcPlxcXFwmXFxcXCNcXFxcJFxcJztdKyc7XG4gIHZhciBTSU1QTEVfTlVNQkVSX1JFID0gJ1tcXFxcczpcXFxcKFxcXFx7XStcXFxcZCsoXFxcXC5cXFxcZCspPyc7XG5cbiAgdmFyIE5VTUJFUiA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogU0lNUExFX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFNUUklORyA9IHtcbiAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgIGJlZ2luOiAnXCInLCBlbmQ6ICdcIicsXG4gICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ09NTUVOVCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJzsnLCBlbmQ6ICckJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIENPTExFQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnY29sbGVjdGlvbicsXG4gICAgYmVnaW46ICdbXFxcXFtcXFxce10nLCBlbmQ6ICdbXFxcXF1cXFxcfV0nXG4gIH07XG4gIHZhciBISU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnXFxcXF4nICsgQ0xKX0lERU5UX1JFXG4gIH07XG4gIHZhciBISU5UX0NPTCA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ1xcXFxeXFxcXHsnLCBlbmQ6ICdcXFxcfSdcbiAgfTtcbiAgdmFyIEtFWSA9IHtcbiAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgIGJlZ2luOiAnWzpdJyArIENMSl9JREVOVF9SRVxuICB9O1xuICB2YXIgTElTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdsaXN0JyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQk9EWSA9IHtcbiAgICBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3Jkczoge2xpdGVyYWw6ICd0cnVlIGZhbHNlIG5pbCd9LFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgVElUTEUgPSB7XG4gICAga2V5d29yZHM6IGtleXdvcmRzLFxuICAgIGxleGVtczogQ0xKX0lERU5UX1JFLFxuICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IENMSl9JREVOVF9SRSxcbiAgICBzdGFydHM6IEJPRFlcbiAgfTtcblxuICBMSVNULmNvbnRhaW5zID0gW3tjbGFzc05hbWU6ICdjb21tZW50JywgYmVnaW46ICdjb21tZW50J30sIFRJVExFXTtcbiAgQk9EWS5jb250YWlucyA9IFtMSVNULCBTVFJJTkcsIEhJTlQsIEhJTlRfQ09MLCBDT01NRU5ULCBLRVksIENPTExFQ1RJT04sIE5VTUJFUl07XG4gIENPTExFQ1RJT04uY29udGFpbnMgPSBbTElTVCwgU1RSSU5HLCBISU5ULCBDT01NRU5ULCBLRVksIENPTExFQ1RJT04sIE5VTUJFUl07XG5cbiAgcmV0dXJuIHtcbiAgICBpbGxlZ2FsOiAnXFxcXFMnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBDT01NRU5ULFxuICAgICAgTElTVFxuICAgIF1cbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiAnYWRkX2N1c3RvbV9jb21tYW5kIGFkZF9jdXN0b21fdGFyZ2V0IGFkZF9kZWZpbml0aW9ucyBhZGRfZGVwZW5kZW5jaWVzICcgK1xuICAgICAgJ2FkZF9leGVjdXRhYmxlIGFkZF9saWJyYXJ5IGFkZF9zdWJkaXJlY3RvcnkgYWRkX3Rlc3QgYXV4X3NvdXJjZV9kaXJlY3RvcnkgJyArXG4gICAgICAnYnJlYWsgYnVpbGRfY29tbWFuZCBjbWFrZV9taW5pbXVtX3JlcXVpcmVkIGNtYWtlX3BvbGljeSBjb25maWd1cmVfZmlsZSAnICtcbiAgICAgICdjcmVhdGVfdGVzdF9zb3VyY2VsaXN0IGRlZmluZV9wcm9wZXJ0eSBlbHNlIGVsc2VpZiBlbmFibGVfbGFuZ3VhZ2UgZW5hYmxlX3Rlc3RpbmcgJyArXG4gICAgICAnZW5kZm9yZWFjaCBlbmRmdW5jdGlvbiBlbmRpZiBlbmRtYWNybyBlbmR3aGlsZSBleGVjdXRlX3Byb2Nlc3MgZXhwb3J0IGZpbmRfZmlsZSAnICtcbiAgICAgICdmaW5kX2xpYnJhcnkgZmluZF9wYWNrYWdlIGZpbmRfcGF0aCBmaW5kX3Byb2dyYW0gZmx0a193cmFwX3VpIGZvcmVhY2ggZnVuY3Rpb24gJyArXG4gICAgICAnZ2V0X2NtYWtlX3Byb3BlcnR5IGdldF9kaXJlY3RvcnlfcHJvcGVydHkgZ2V0X2ZpbGVuYW1lX2NvbXBvbmVudCBnZXRfcHJvcGVydHkgJyArXG4gICAgICAnZ2V0X3NvdXJjZV9maWxlX3Byb3BlcnR5IGdldF90YXJnZXRfcHJvcGVydHkgZ2V0X3Rlc3RfcHJvcGVydHkgaWYgaW5jbHVkZSAnICtcbiAgICAgICdpbmNsdWRlX2RpcmVjdG9yaWVzIGluY2x1ZGVfZXh0ZXJuYWxfbXNwcm9qZWN0IGluY2x1ZGVfcmVndWxhcl9leHByZXNzaW9uIGluc3RhbGwgJyArXG4gICAgICAnbGlua19kaXJlY3RvcmllcyBsb2FkX2NhY2hlIGxvYWRfY29tbWFuZCBtYWNybyBtYXJrX2FzX2FkdmFuY2VkIG1lc3NhZ2Ugb3B0aW9uICcgK1xuICAgICAgJ291dHB1dF9yZXF1aXJlZF9maWxlcyBwcm9qZWN0IHF0X3dyYXBfY3BwIHF0X3dyYXBfdWkgcmVtb3ZlX2RlZmluaXRpb25zIHJldHVybiAnICtcbiAgICAgICdzZXBhcmF0ZV9hcmd1bWVudHMgc2V0IHNldF9kaXJlY3RvcnlfcHJvcGVydGllcyBzZXRfcHJvcGVydHkgJyArXG4gICAgICAnc2V0X3NvdXJjZV9maWxlc19wcm9wZXJ0aWVzIHNldF90YXJnZXRfcHJvcGVydGllcyBzZXRfdGVzdHNfcHJvcGVydGllcyBzaXRlX25hbWUgJyArXG4gICAgICAnc291cmNlX2dyb3VwIHN0cmluZyB0YXJnZXRfbGlua19saWJyYXJpZXMgdHJ5X2NvbXBpbGUgdHJ5X3J1biB1bnNldCB2YXJpYWJsZV93YXRjaCAnICtcbiAgICAgICd3aGlsZSBidWlsZF9uYW1lIGV4ZWNfcHJvZ3JhbSBleHBvcnRfbGlicmFyeV9kZXBlbmRlbmNpZXMgaW5zdGFsbF9maWxlcyAnICtcbiAgICAgICdpbnN0YWxsX3Byb2dyYW1zIGluc3RhbGxfdGFyZ2V0cyBsaW5rX2xpYnJhcmllcyBtYWtlX2RpcmVjdG9yeSByZW1vdmUgc3ViZGlyX2RlcGVuZHMgJyArXG4gICAgICAnc3ViZGlycyB1c2VfbWFuZ2xlZF9tZXNhIHV0aWxpdHlfc291cmNlIHZhcmlhYmxlX3JlcXVpcmVzIHdyaXRlX2ZpbGUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VudnZhcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXCR7JywgZW5kOiAnfSdcbiAgICAgIH0sXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuTlVNQkVSX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgIC8vIEpTIGtleXdvcmRzXG4gICAgICAnaW4gaWYgZm9yIHdoaWxlIGZpbmFsbHkgbmV3IGRvIHJldHVybiBlbHNlIGJyZWFrIGNhdGNoIGluc3RhbmNlb2YgdGhyb3cgdHJ5IHRoaXMgJyArXG4gICAgICAnc3dpdGNoIGNvbnRpbnVlIHR5cGVvZiBkZWxldGUgZGVidWdnZXIgc3VwZXIgJyArXG4gICAgICAvLyBDb2ZmZWUga2V5d29yZHNcbiAgICAgICd0aGVuIHVubGVzcyB1bnRpbCBsb29wIG9mIGJ5IHdoZW4gYW5kIG9yIGlzIGlzbnQgbm90JyxcbiAgICBsaXRlcmFsOlxuICAgICAgLy8gSlMgbGl0ZXJhbHNcbiAgICAgICd0cnVlIGZhbHNlIG51bGwgdW5kZWZpbmVkICcgK1xuICAgICAgLy8gQ29mZmVlIGxpdGVyYWxzXG4gICAgICAneWVzIG5vIG9uIG9mZiAnLFxuICAgIHJlc2VydmVkOiAnY2FzZSBkZWZhdWx0IGZ1bmN0aW9uIHZhciB2b2lkIHdpdGggY29uc3QgbGV0IGVudW0gZXhwb3J0IGltcG9ydCBuYXRpdmUgJyArXG4gICAgICAnX19oYXNQcm9wIF9fZXh0ZW5kcyBfX3NsaWNlIF9fYmluZCBfX2luZGV4T2YnXG4gIH07XG4gIHZhciBKU19JREVOVF9SRSA9ICdbQS1aYS16JF9dWzAtOUEtWmEteiRfXSonO1xuICB2YXIgVElUTEUgPSB7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogSlNfSURFTlRfUkV9O1xuICB2YXIgU1VCU1QgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3Vic3QnLFxuICAgIGJlZ2luOiAnI1xcXFx7JywgZW5kOiAnfScsXG4gICAga2V5d29yZHM6IEtFWVdPUkRTLFxuICAgIGNvbnRhaW5zOiBbaGxqcy5CSU5BUllfTlVNQkVSX01PREUsIGhsanMuQ19OVU1CRVJfTU9ERV1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBLRVlXT1JEUyxcbiAgICBjb250YWluczogW1xuICAgICAgLy8gTnVtYmVyc1xuICAgICAgaGxqcy5CSU5BUllfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICAvLyBTdHJpbmdzXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gQ29tbWVudHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnIyMjJywgZW5kOiAnIyMjJ1xuICAgICAgfSxcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiAnLy8vJywgZW5kOiAnLy8vJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkhBU0hfQ09NTUVOVF9NT0RFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVnZXhwJywgYmVnaW46ICcvL1tnaW1dKidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiAnL1xcXFxTKFxcXFxcXFxcLnxbXlxcXFxuXSkqL1tnaW1dKicgLy8gXFxTIGlzIHJlcXVpcmVkIHRvIHBhcnNlIHggLyAyIC8gMyBhcyB0d28gZGl2aXNpb25zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ2phdmFzY3JpcHQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luOiBKU19JREVOVF9SRSArICdcXFxccyo9XFxcXHMqKFxcXFwoLitcXFxcKSk/XFxcXHMqWy09XT4nLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBUSVRMRSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBrZXl3b3JkczogJ2NsYXNzJyxcbiAgICAgICAgZW5kOiAnJCcsXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBrZXl3b3JkczogJ2V4dGVuZHMnLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBpbGxlZ2FsOiAnOicsXG4gICAgICAgICAgICBjb250YWluczogW1RJVExFXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgVElUTEVcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJvcGVydHknLFxuICAgICAgICBiZWdpbjogJ0AnICsgSlNfSURFTlRfUkVcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQ1BQX0tFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6ICdmYWxzZSBpbnQgZmxvYXQgd2hpbGUgcHJpdmF0ZSBjaGFyIGNhdGNoIGV4cG9ydCB2aXJ0dWFsIG9wZXJhdG9yIHNpemVvZiAnICtcbiAgICAgICdkeW5hbWljX2Nhc3R8MTAgdHlwZWRlZiBjb25zdF9jYXN0fDEwIGNvbnN0IHN0cnVjdCBmb3Igc3RhdGljX2Nhc3R8MTAgdW5pb24gbmFtZXNwYWNlICcgK1xuICAgICAgJ3Vuc2lnbmVkIGxvbmcgdGhyb3cgdm9sYXRpbGUgc3RhdGljIHByb3RlY3RlZCBib29sIHRlbXBsYXRlIG11dGFibGUgaWYgcHVibGljIGZyaWVuZCAnICtcbiAgICAgICdkbyByZXR1cm4gZ290byBhdXRvIHZvaWQgZW51bSBlbHNlIGJyZWFrIG5ldyBleHRlcm4gdXNpbmcgdHJ1ZSBjbGFzcyBhc20gY2FzZSB0eXBlaWQgJyArXG4gICAgICAnc2hvcnQgcmVpbnRlcnByZXRfY2FzdHwxMCBkZWZhdWx0IGRvdWJsZSByZWdpc3RlciBleHBsaWNpdCBzaWduZWQgdHlwZW5hbWUgdHJ5IHRoaXMgJyArXG4gICAgICAnc3dpdGNoIGNvbnRpbnVlIHdjaGFyX3QgaW5saW5lIGRlbGV0ZSBhbGlnbm9mIGNoYXIxNl90IGNoYXIzMl90IGNvbnN0ZXhwciBkZWNsdHlwZSAnICtcbiAgICAgICdub2V4Y2VwdCBudWxscHRyIHN0YXRpY19hc3NlcnQgdGhyZWFkX2xvY2FsIHJlc3RyaWN0IF9Cb29sIGNvbXBsZXgnLFxuICAgIGJ1aWx0X2luOiAnc3RkIHN0cmluZyBjaW4gY291dCBjZXJyIGNsb2cgc3RyaW5nc3RyZWFtIGlzdHJpbmdzdHJlYW0gb3N0cmluZ3N0cmVhbSAnICtcbiAgICAgICdhdXRvX3B0ciBkZXF1ZSBsaXN0IHF1ZXVlIHN0YWNrIHZlY3RvciBtYXAgc2V0IGJpdHNldCBtdWx0aXNldCBtdWx0aW1hcCB1bm9yZGVyZWRfc2V0ICcgK1xuICAgICAgJ3Vub3JkZXJlZF9tYXAgdW5vcmRlcmVkX211bHRpc2V0IHVub3JkZXJlZF9tdWx0aW1hcCBhcnJheSBzaGFyZWRfcHRyJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBDUFBfS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnXFxcXFxcXFw/LicsIGVuZDogJ1xcJycsXG4gICAgICAgIGlsbGVnYWw6ICcuJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcYihcXFxcZCsoXFxcXC5cXFxcZCopP3xcXFxcLlxcXFxkKykodXxVfGx8THx1bHxVTHxmfEYpJ1xuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0bF9jb250YWluZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGRlcXVlfGxpc3R8cXVldWV8c3RhY2t8dmVjdG9yfG1hcHxzZXR8Yml0c2V0fG11bHRpc2V0fG11bHRpbWFwfHVub3JkZXJlZF9tYXB8dW5vcmRlcmVkX3NldHx1bm9yZGVyZWRfbXVsdGlzZXR8dW5vcmRlcmVkX211bHRpbWFwfGFycmF5KVxcXFxzKjwnLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IENQUF9LRVlXT1JEUyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFsnc2VsZiddXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgIC8vIE5vcm1hbCBrZXl3b3Jkcy5cbiAgICAgICdhYnN0cmFjdCBhcyBiYXNlIGJvb2wgYnJlYWsgYnl0ZSBjYXNlIGNhdGNoIGNoYXIgY2hlY2tlZCBjbGFzcyBjb25zdCBjb250aW51ZSBkZWNpbWFsICcgK1xuICAgICAgJ2RlZmF1bHQgZGVsZWdhdGUgZG8gZG91YmxlIGVsc2UgZW51bSBldmVudCBleHBsaWNpdCBleHRlcm4gZmFsc2UgZmluYWxseSBmaXhlZCBmbG9hdCAnICtcbiAgICAgICdmb3IgZm9yZWFjaCBnb3RvIGlmIGltcGxpY2l0IGluIGludCBpbnRlcmZhY2UgaW50ZXJuYWwgaXMgbG9jayBsb25nIG5hbWVzcGFjZSBuZXcgbnVsbCAnICtcbiAgICAgICdvYmplY3Qgb3BlcmF0b3Igb3V0IG92ZXJyaWRlIHBhcmFtcyBwcml2YXRlIHByb3RlY3RlZCBwdWJsaWMgcmVhZG9ubHkgcmVmIHJldHVybiBzYnl0ZSAnICtcbiAgICAgICdzZWFsZWQgc2hvcnQgc2l6ZW9mIHN0YWNrYWxsb2Mgc3RhdGljIHN0cmluZyBzdHJ1Y3Qgc3dpdGNoIHRoaXMgdGhyb3cgdHJ1ZSB0cnkgdHlwZW9mICcgK1xuICAgICAgJ3VpbnQgdWxvbmcgdW5jaGVja2VkIHVuc2FmZSB1c2hvcnQgdXNpbmcgdmlydHVhbCB2b2xhdGlsZSB2b2lkIHdoaWxlICcgK1xuICAgICAgLy8gQ29udGV4dHVhbCBrZXl3b3Jkcy5cbiAgICAgICdhc2NlbmRpbmcgZGVzY2VuZGluZyBmcm9tIGdldCBncm91cCBpbnRvIGpvaW4gbGV0IG9yZGVyYnkgcGFydGlhbCBzZWxlY3Qgc2V0IHZhbHVlIHZhciAnK1xuICAgICAgJ3doZXJlIHlpZWxkJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICcvLy8nLCBlbmQ6ICckJywgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAneG1sRG9jVGFnJyxcbiAgICAgICAgICAgIGJlZ2luOiAnLy8vfDwhLS18LS0+J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAneG1sRG9jVGFnJyxcbiAgICAgICAgICAgIGJlZ2luOiAnPC8/JywgZW5kOiAnPidcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdwcmVwcm9jZXNzb3InLFxuICAgICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdpZiBlbHNlIGVsaWYgZW5kaWYgZGVmaW5lIHVuZGVmIHdhcm5pbmcgZXJyb3IgbGluZSByZWdpb24gZW5kcmVnaW9uIHByYWdtYSBjaGVja3N1bSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnQFwiJywgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW3tiZWdpbjogJ1wiXCInfV1cbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIEZVTkNUSU9OID0ge1xuICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICBiZWdpbjogaGxqcy5JREVOVF9SRSArICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogW2hsanMuTlVNQkVSX01PREUsIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERV1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGlsbGVnYWw6ICdbPS98XFwnXScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2lkJywgYmVnaW46ICdcXFxcI1tBLVphLXowLTlfLV0rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLCBiZWdpbjogJ1xcXFwuW0EtWmEtejAtOV8tXSsnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJfc2VsZWN0b3InLFxuICAgICAgICBiZWdpbjogJ1xcXFxbJywgZW5kOiAnXFxcXF0nLFxuICAgICAgICBpbGxlZ2FsOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BzZXVkbycsXG4gICAgICAgIGJlZ2luOiAnOig6KT9bYS16QS1aMC05XFxcXF9cXFxcLVxcXFwrXFxcXChcXFxcKVxcXFxcIlxcXFxcXCddKydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0X3J1bGUnLFxuICAgICAgICBiZWdpbjogJ0AoZm9udC1mYWNlfHBhZ2UpJyxcbiAgICAgICAgbGV4ZW1zOiAnW2Etei1dKycsXG4gICAgICAgIGtleXdvcmRzOiAnZm9udC1mYWNlIHBhZ2UnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdF9ydWxlJyxcbiAgICAgICAgYmVnaW46ICdAJywgZW5kOiAnW3s7XScsIC8vIGF0X3J1bGUgZWF0aW5nIGZpcnN0IFwie1wiIGlzIGEgZ29vZCB0aGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBpdCBkb2VzbuKAmXQgbGV0IGl0IHRvIGJlIHBhcnNlZCBhc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYSBydWxlIHNldCBidXQgaW5zdGVhZCBkcm9wcyBwYXJzZXIgaW50b1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRlZmF1bHQgbW9kZSB3aGljaCBpcyBob3cgaXQgc2hvdWxkIGJlLlxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBrZXl3b3JkczogJ2ltcG9ydCBwYWdlIG1lZGlhIGNoYXJzZXQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIEZVTkNUSU9OLFxuICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSwgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgICAgICBobGpzLk5VTUJFUl9NT0RFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RhZycsIGJlZ2luOiBobGpzLklERU5UX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3J1bGVzJyxcbiAgICAgICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgICAgIHJlbGV2YW5jZTogMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3J1bGUnLFxuICAgICAgICAgICAgYmVnaW46ICdbXlxcXFxzXScsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICc7JywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgICAgICAgICBiZWdpbjogJ1tBLVpcXFxcX1xcXFwuXFxcXC1dKycsIGVuZDogJzonLFxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVFbmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICAgICAgICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgRlVOQ1RJT04sXG4gICAgICAgICAgICAgICAgICAgIGhsanMuTlVNQkVSX01PREUsXG4gICAgICAgICAgICAgICAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICAgICAgICAgICAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2hleGNvbG9yJywgYmVnaW46ICdcXFxcI1swLTlBLUZdKydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ2ltcG9ydGFudCcsIGJlZ2luOiAnIWltcG9ydGFudCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAvKipcbiAqIEtub3duIGlzc3VlczpcbiAqXG4gKiAtIGludmFsaWQgaGV4IHN0cmluZyBsaXRlcmFscyB3aWxsIGJlIHJlY29nbml6ZWQgYXMgYSBkb3VibGUgcXVvdGVkIHN0cmluZ3NcbiAqICAgYnV0ICd4JyBhdCB0aGUgYmVnaW5uaW5nIG9mIHN0cmluZyB3aWxsIG5vdCBiZSBtYXRjaGVkXG4gKlxuICogLSBkZWxpbWl0ZWQgc3RyaW5nIGxpdGVyYWxzIGFyZSBub3QgY2hlY2tlZCBmb3IgbWF0Y2hpbmcgZW5kIGRlbGltaXRlclxuICogICAobm90IHBvc3NpYmxlIHRvIGRvIHdpdGgganMgcmVnZXhwKVxuICpcbiAqIC0gY29udGVudCBvZiB0b2tlbiBzdHJpbmcgaXMgY29sb3JlZCBhcyBhIHN0cmluZyAoaS5lLiBubyBrZXl3b3JkIGNvbG9yaW5nIGluc2lkZSBhIHRva2VuIHN0cmluZylcbiAqICAgYWxzbywgY29udGVudCBvZiB0b2tlbiBzdHJpbmcgaXMgbm90IHZhbGlkYXRlZCB0byBjb250YWluIG9ubHkgdmFsaWQgRCB0b2tlbnNcbiAqXG4gKiAtIHNwZWNpYWwgdG9rZW4gc2VxdWVuY2UgcnVsZSBpcyBub3Qgc3RyaWN0bHkgZm9sbG93aW5nIEQgZ3JhbW1hciAoYW55dGhpbmcgZm9sbG93aW5nICNsaW5lXG4gKiAgIHVwIHRvIHRoZSBlbmQgb2YgbGluZSBpcyBtYXRjaGVkIGFzIHNwZWNpYWwgdG9rZW4gc2VxdWVuY2UpXG4gKi9cblxuZnVuY3Rpb24oaGxqcykge1xuXG5cdC8qKlxuXHQgKiBMYW5ndWFnZSBrZXl3b3Jkc1xuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfS0VZV09SRFMgPSB7XG5cdFx0a2V5d29yZDpcblx0XHRcdCdhYnN0cmFjdCBhbGlhcyBhbGlnbiBhc20gYXNzZXJ0IGF1dG8gYm9keSBicmVhayBieXRlIGNhc2UgY2FzdCBjYXRjaCBjbGFzcyAnICtcblx0XHRcdCdjb25zdCBjb250aW51ZSBkZWJ1ZyBkZWZhdWx0IGRlbGV0ZSBkZXByZWNhdGVkIGRvIGVsc2UgZW51bSBleHBvcnQgZXh0ZXJuIGZpbmFsICcgK1xuXHRcdFx0J2ZpbmFsbHkgZm9yIGZvcmVhY2ggZm9yZWFjaF9yZXZlcnNlfDEwIGdvdG8gaWYgaW1tdXRhYmxlIGltcG9ydCBpbiBpbm91dCBpbnQgJyArXG5cdFx0XHQnaW50ZXJmYWNlIGludmFyaWFudCBpcyBsYXp5IG1hY3JvIG1peGluIG1vZHVsZSBuZXcgbm90aHJvdyBvdXQgb3ZlcnJpZGUgcGFja2FnZSAnICtcblx0XHRcdCdwcmFnbWEgcHJpdmF0ZSBwcm90ZWN0ZWQgcHVibGljIHB1cmUgcmVmIHJldHVybiBzY29wZSBzaGFyZWQgc3RhdGljIHN0cnVjdCAnICtcblx0XHRcdCdzdXBlciBzd2l0Y2ggc3luY2hyb25pemVkIHRlbXBsYXRlIHRoaXMgdGhyb3cgdHJ5IHR5cGVkZWYgdHlwZWlkIHR5cGVvZiB1bmlvbiAnICtcblx0XHRcdCd1bml0dGVzdCB2ZXJzaW9uIHZvaWQgdm9sYXRpbGUgd2hpbGUgd2l0aCBfX0ZJTEVfXyBfX0xJTkVfXyBfX2dzaGFyZWR8MTAgJyArXG5cdFx0XHQnX190aHJlYWQgX190cmFpdHMgX19EQVRFX18gX19FT0ZfXyBfX1RJTUVfXyBfX1RJTUVTVEFNUF9fIF9fVkVORE9SX18gX19WRVJTSU9OX18nLFxuXHRcdGJ1aWx0X2luOlxuXHRcdFx0J2Jvb2wgY2RvdWJsZSBjZW50IGNmbG9hdCBjaGFyIGNyZWFsIGRjaGFyIGRlbGVnYXRlIGRvdWJsZSBkc3RyaW5nIGZsb2F0IGZ1bmN0aW9uICcgK1xuXHRcdFx0J2lkb3VibGUgaWZsb2F0IGlyZWFsIGxvbmcgcmVhbCBzaG9ydCBzdHJpbmcgdWJ5dGUgdWNlbnQgdWludCB1bG9uZyB1c2hvcnQgd2NoYXIgJyArXG5cdFx0XHQnd3N0cmluZycsXG5cdFx0bGl0ZXJhbDpcblx0XHRcdCdmYWxzZSBudWxsIHRydWUnXG5cdH07XG5cblx0LyoqXG5cdCAqIE51bWJlciBsaXRlcmFsIHJlZ2V4cHNcblx0ICpcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHZhciBkZWNpbWFsX2ludGVnZXJfcmUgPSAnKDB8WzEtOV1bXFxcXGRfXSopJyxcblx0XHRkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgPSAnKDB8WzEtOV1bXFxcXGRfXSp8XFxcXGRbXFxcXGRfXSp8W1xcXFxkX10rP1xcXFxkKScsXG5cdFx0YmluYXJ5X2ludGVnZXJfcmUgPSAnMFtiQl1bMDFfXSsnLFxuXHRcdGhleGFkZWNpbWFsX2RpZ2l0c19yZSA9ICcoW1xcXFxkYS1mQS1GXVtcXFxcZGEtZkEtRl9dKnxfW1xcXFxkYS1mQS1GXVtcXFxcZGEtZkEtRl9dKiknLFxuXHRcdGhleGFkZWNpbWFsX2ludGVnZXJfcmUgPSAnMFt4WF0nICsgaGV4YWRlY2ltYWxfZGlnaXRzX3JlLFxuXG5cdFx0ZGVjaW1hbF9leHBvbmVudF9yZSA9ICcoW2VFXVsrLV0/JyArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArICcpJyxcblx0XHRkZWNpbWFsX2Zsb2F0X3JlID0gJygnICsgZGVjaW1hbF9pbnRlZ2VyX25vc3VzX3JlICsgJyhcXFxcLlxcXFxkKnwnICsgZGVjaW1hbF9leHBvbmVudF9yZSArICcpfCcgK1xuXHRcdFx0XHRcdFx0XHRcdCdcXFxcZCtcXFxcLicgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyBkZWNpbWFsX2ludGVnZXJfbm9zdXNfcmUgKyAnfCcgK1xuXHRcdFx0XHRcdFx0XHRcdCdcXFxcLicgKyBkZWNpbWFsX2ludGVnZXJfcmUgKyBkZWNpbWFsX2V4cG9uZW50X3JlICsgJz8nICtcblx0XHRcdFx0XHRcdFx0JyknLFxuXHRcdGhleGFkZWNpbWFsX2Zsb2F0X3JlID0gJygwW3hYXSgnICtcblx0XHRcdFx0XHRcdFx0XHRcdGhleGFkZWNpbWFsX2RpZ2l0c19yZSArICdcXFxcLicgKyBoZXhhZGVjaW1hbF9kaWdpdHNfcmUgKyAnfCcrXG5cdFx0XHRcdFx0XHRcdFx0XHQnXFxcXC4/JyArIGhleGFkZWNpbWFsX2RpZ2l0c19yZSArXG5cdFx0XHRcdFx0XHRcdCAgICcpW3BQXVsrLV0/JyArIGRlY2ltYWxfaW50ZWdlcl9ub3N1c19yZSArICcpJyxcblxuXHRcdGludGVnZXJfcmUgPSAnKCcgK1xuXHRcdFx0ZGVjaW1hbF9pbnRlZ2VyX3JlICsgJ3wnICtcblx0XHRcdGJpbmFyeV9pbnRlZ2VyX3JlICArICd8JyArXG5cdFx0IFx0aGV4YWRlY2ltYWxfaW50ZWdlcl9yZSAgICtcblx0XHQnKScsXG5cblx0XHRmbG9hdF9yZSA9ICcoJyArXG5cdFx0XHRoZXhhZGVjaW1hbF9mbG9hdF9yZSArICd8JyArXG5cdFx0XHRkZWNpbWFsX2Zsb2F0X3JlICArXG5cdFx0JyknO1xuXG5cdC8qKlxuXHQgKiBFc2NhcGUgc2VxdWVuY2Ugc3VwcG9ydGVkIGluIEQgc3RyaW5nIGFuZCBjaGFyYWN0ZXIgbGl0ZXJhbHNcblx0ICpcblx0ICogQHR5cGUge1N0cmluZ31cblx0ICovXG5cdHZhciBlc2NhcGVfc2VxdWVuY2VfcmUgPSAnXFxcXFxcXFwoJyArXG5cdFx0XHRcdFx0XHRcdCdbXFwnXCJcXFxcP1xcXFxcXFxcYWJmbnJ0dl18JyArXHQvLyBjb21tb24gZXNjYXBlc1xuXHRcdFx0XHRcdFx0XHQndVtcXFxcZEEtRmEtZl17NH18JyArIFx0XHQvLyBmb3VyIGhleCBkaWdpdCB1bmljb2RlIGNvZGVwb2ludFxuXHRcdFx0XHRcdFx0XHQnWzAtN117MSwzfXwnICsgXHRcdFx0Ly8gb25lIHRvIHRocmVlIG9jdGFsIGRpZ2l0IGFzY2lpIGNoYXIgY29kZVxuXHRcdFx0XHRcdFx0XHQneFtcXFxcZEEtRmEtZl17Mn18JyArXHRcdC8vIHR3byBoZXggZGlnaXQgYXNjaWkgY2hhciBjb2RlXG5cdFx0XHRcdFx0XHRcdCdVW1xcXFxkQS1GYS1mXXs4fScgK1x0XHRcdC8vIGVpZ2h0IGhleCBkaWdpdCB1bmljb2RlIGNvZGVwb2ludFxuXHRcdFx0XHRcdFx0ICAnKXwnICtcblx0XHRcdFx0XHRcdCAgJyZbYS16QS1aXFxcXGRdezIsfTsnO1x0XHRcdC8vIG5hbWVkIGNoYXJhY3RlciBlbnRpdHlcblxuXG5cdC8qKlxuXHQgKiBEIGludGVnZXIgbnVtYmVyIGxpdGVyYWxzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9JTlRFR0VSX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBcdGJlZ2luOiAnXFxcXGInICsgaW50ZWdlcl9yZSArICcoTHx1fFV8THV8TFV8dUx8VUwpPycsXG4gICAgXHRyZWxldmFuY2U6IDBcblx0fTtcblxuXHQvKipcblx0ICogW0RfRkxPQVRfTU9ERSBkZXNjcmlwdGlvbl1cblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0ZMT0FUX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnbnVtYmVyJyxcblx0XHRiZWdpbjogJ1xcXFxiKCcgK1xuXHRcdFx0XHRmbG9hdF9yZSArICcoW2ZGXXxMfGl8W2ZGXWl8TGkpP3wnICtcblx0XHRcdFx0aW50ZWdlcl9yZSArICcoaXxbZkZdaXxMaSknICtcblx0XHRcdCcpJyxcblx0XHRyZWxldmFuY2U6IDBcblx0fTtcblxuXHQvKipcblx0ICogRCBjaGFyYWN0ZXIgbGl0ZXJhbFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfQ0hBUkFDVEVSX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ1xcJygnICsgZXNjYXBlX3NlcXVlbmNlX3JlICsgJ3wuKScsIGVuZDogJ1xcJycsXG5cdFx0aWxsZWdhbDogJy4nXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgc3RyaW5nIGVzY2FwZSBzZXF1ZW5jZVxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfRVNDQVBFX1NFUVVFTkNFID0ge1xuXHRcdGJlZ2luOiBlc2NhcGVfc2VxdWVuY2VfcmUsXG5cdFx0cmVsZXZhbmNlOiAwXG5cdH1cblxuXHQvKipcblx0ICogRCBkb3VibGUgcXVvdGVkIHN0cmluZyBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAnXCInLFxuXHRcdGNvbnRhaW5zOiBbRF9FU0NBUEVfU0VRVUVOQ0VdLFxuXHRcdGVuZDogJ1wiW2N3ZF0/Jyxcblx0XHRyZWxldmFuY2U6IDBcblx0fTtcblxuXHQvKipcblx0ICogRCB3eXNpd3lnIGFuZCBkZWxpbWl0ZWQgc3RyaW5nIGxpdGVyYWxzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9XWVNJV1lHX0RFTElNSVRFRF9TVFJJTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzdHJpbmcnLFxuXHRcdGJlZ2luOiAnW3JxXVwiJyxcblx0XHRlbmQ6ICdcIltjd2RdPycsXG5cdFx0cmVsZXZhbmNlOiA1XG5cdH07XG5cblx0LyoqXG5cdCAqIEQgYWx0ZXJuYXRlIHd5c2l3eWcgc3RyaW5nIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX0FMVEVSTkFURV9XWVNJV1lHX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdgJyxcblx0XHRlbmQ6ICdgW2N3ZF0/J1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBEIGhleGFkZWNpbWFsIHN0cmluZyBsaXRlcmFsXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9IRVhfU1RSSU5HX01PREUgPSB7XG5cdFx0Y2xhc3NOYW1lOiAnc3RyaW5nJyxcblx0XHRiZWdpbjogJ3hcIltcXFxcZGEtZkEtRlxcXFxzXFxcXG5cXFxccl0qXCJbY3dkXT8nLFxuXHRcdHJlbGV2YW5jZTogMTBcblx0fTtcblxuXHQvKipcblx0ICogRCBkZWxpbWl0ZWQgc3RyaW5nIGxpdGVyYWxcblx0ICpcblx0ICogQHR5cGUge09iamVjdH1cblx0ICovXG5cdHZhciBEX1RPS0VOX1NUUklOR19NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3N0cmluZycsXG5cdFx0YmVnaW46ICdxXCJcXFxceycsXG5cdFx0ZW5kOiAnXFxcXH1cIidcblx0fTtcblxuXHQvKipcblx0ICogSGFzaGJhbmcgc3VwcG9ydFxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfSEFTSEJBTkdfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdzaGViYW5nJyxcblx0XHRiZWdpbjogJ14jIScsXG5cdFx0ZW5kOiAnJCcsXG5cdFx0cmVsZXZhbmNlOiA1XG5cdH07XG5cblx0LyoqXG5cdCAqIEQgc3BlY2lhbCB0b2tlbiBzZXF1ZW5jZVxuXHQgKlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKi9cblx0dmFyIERfU1BFQ0lBTF9UT0tFTl9TRVFVRU5DRV9NT0RFID0ge1xuXHRcdGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG5cdFx0YmVnaW46ICcjKGxpbmUpJyxcblx0XHRlbmQ6ICckJyxcblx0XHRyZWxldmFuY2U6IDVcblx0fTtcblxuXHQvKipcblx0ICogRCBhdHRyaWJ1dGVzXG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9BVFRSSUJVVEVfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdrZXl3b3JkJyxcblx0XHRiZWdpbjogJ0BbYS16QS1aX11bYS16QS1aX1xcXFxkXSonXG5cdH07XG5cblx0LyoqXG5cdCAqIEQgbmVzdGluZyBjb21tZW50XG5cdCAqXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqL1xuXHR2YXIgRF9ORVNUSU5HX0NPTU1FTlRfTU9ERSA9IHtcblx0XHRjbGFzc05hbWU6ICdjb21tZW50Jyxcblx0XHRiZWdpbjogJ1xcXFwvXFxcXCsnLFxuXHRcdGNvbnRhaW5zOiBbJ3NlbGYnXSxcblx0XHRlbmQ6ICdcXFxcK1xcXFwvJyxcblx0XHRyZWxldmFuY2U6IDEwXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGxleGVtczogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuXHRcdGtleXdvcmRzOiBEX0tFWVdPUkRTLFxuXHRcdGNvbnRhaW5zOiBbXG5cdFx0XHRobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gIFx0XHRcdGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gIFx0XHRcdERfTkVTVElOR19DT01NRU5UX01PREUsXG4gIFx0XHRcdERfSEVYX1NUUklOR19NT0RFLFxuICBcdFx0XHREX1NUUklOR19NT0RFLFxuICBcdFx0XHREX1dZU0lXWUdfREVMSU1JVEVEX1NUUklOR19NT0RFLFxuICBcdFx0XHREX0FMVEVSTkFURV9XWVNJV1lHX1NUUklOR19NT0RFLFxuICBcdFx0XHREX1RPS0VOX1NUUklOR19NT0RFLFxuICBcdFx0XHREX0ZMT0FUX01PREUsXG4gIFx0XHRcdERfSU5URUdFUl9NT0RFLFxuICBcdFx0XHREX0NIQVJBQ1RFUl9NT0RFLFxuICBcdFx0XHREX0hBU0hCQU5HX01PREUsXG4gIFx0XHRcdERfU1BFQ0lBTF9UT0tFTl9TRVFVRU5DRV9NT0RFLFxuICBcdFx0XHREX0FUVFJJQlVURV9NT0RFXG5cdFx0XVxuXHR9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIERFTFBISV9LRVlXT1JEUyA9ICdhbmQgc2FmZWNhbGwgY2RlY2wgdGhlbiBzdHJpbmcgZXhwb3J0cyBsaWJyYXJ5IG5vdCBwYXNjYWwgc2V0ICcgK1xuICAgICd2aXJ0dWFsIGZpbGUgaW4gYXJyYXkgbGFiZWwgcGFja2VkIGVuZC4gaW5kZXggd2hpbGUgY29uc3QgcmFpc2UgZm9yIHRvIGltcGxlbWVudGF0aW9uICcgK1xuICAgICd3aXRoIGV4Y2VwdCBvdmVybG9hZCBkZXN0cnVjdG9yIGRvd250byBmaW5hbGx5IHByb2dyYW0gZXhpdCB1bml0IGluaGVyaXRlZCBvdmVycmlkZSBpZiAnICtcbiAgICAndHlwZSB1bnRpbCBmdW5jdGlvbiBkbyBiZWdpbiByZXBlYXQgZ290byBuaWwgZmFyIGluaXRpYWxpemF0aW9uIG9iamVjdCBlbHNlIHZhciB1c2VzICcgK1xuICAgICdleHRlcm5hbCByZXNvdXJjZXN0cmluZyBpbnRlcmZhY2UgZW5kIGZpbmFsaXphdGlvbiBjbGFzcyBhc20gbW9kIGNhc2Ugb24gc2hyIHNobCBvZiAnICtcbiAgICAncmVnaXN0ZXIgeG9yd3JpdGUgdGhyZWFkdmFyIHRyeSByZWNvcmQgbmVhciBzdG9yZWQgY29uc3RydWN0b3Igc3RkY2FsbCBpbmxpbmUgZGl2IG91dCBvciAnICtcbiAgICAncHJvY2VkdXJlJztcbiAgdmFyIERFTFBISV9DTEFTU19LRVlXT1JEUyA9ICdzYWZlY2FsbCBzdGRjYWxsIHBhc2NhbCBzdG9yZWQgY29uc3QgaW1wbGVtZW50YXRpb24gJyArXG4gICAgJ2ZpbmFsaXphdGlvbiBleGNlcHQgdG8gZmluYWxseSBwcm9ncmFtIGluaGVyaXRlZCBvdmVycmlkZSB0aGVuIGV4cG9ydHMgc3RyaW5nIHJlYWQgbm90ICcgK1xuICAgICdtb2Qgc2hyIHRyeSBkaXYgc2hsIHNldCBsaWJyYXJ5IG1lc3NhZ2UgcGFja2VkIGluZGV4IGZvciBuZWFyIG92ZXJsb2FkIGxhYmVsIGRvd250byBleGl0ICcgK1xuICAgICdwdWJsaWMgZ290byBpbnRlcmZhY2UgYXNtIG9uIG9mIGNvbnN0cnVjdG9yIG9yIHByaXZhdGUgYXJyYXkgdW5pdCByYWlzZSBkZXN0cnVjdG9yIHZhciAnICtcbiAgICAndHlwZSB1bnRpbCBmdW5jdGlvbiBlbHNlIGV4dGVybmFsIHdpdGggY2FzZSBkZWZhdWx0IHJlY29yZCB3aGlsZSBwcm90ZWN0ZWQgcHJvcGVydHkgJyArXG4gICAgJ3Byb2NlZHVyZSBwdWJsaXNoZWQgYW5kIGNkZWNsIGRvIHRocmVhZHZhciBmaWxlIGluIGlmIGVuZCB2aXJ0dWFsIHdyaXRlIGZhciBvdXQgYmVnaW4gJyArXG4gICAgJ3JlcGVhdCBuaWwgaW5pdGlhbGl6YXRpb24gb2JqZWN0IHVzZXMgcmVzb3VyY2VzdHJpbmcgY2xhc3MgcmVnaXN0ZXIgeG9yd3JpdGUgaW5saW5lIHN0YXRpYyc7XG4gIHZhciBDVVJMWV9DT01NRU5UID0gIHtcbiAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdmFyIFBBUkVOX0NPTU1FTlQgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICdcXFxcKFxcXFwqJywgZW5kOiAnXFxcXCpcXFxcKScsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdcXCcnLFxuICAgIGNvbnRhaW5zOiBbe2JlZ2luOiAnXFwnXFwnJ31dLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ0hBUl9TVFJJTkcgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJywgYmVnaW46ICcoI1xcXFxkKykrJ1xuICB9O1xuICB2YXIgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ1s6O10nLFxuICAgIGtleXdvcmRzOiAnZnVuY3Rpb24gY29uc3RydWN0b3J8MTAgZGVzdHJ1Y3RvcnwxMCBwcm9jZWR1cmV8MTAnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46IGhsanMuSURFTlRfUkVcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGtleXdvcmRzOiBERUxQSElfS0VZV09SRFMsXG4gICAgICAgIGNvbnRhaW5zOiBbU1RSSU5HLCBDSEFSX1NUUklOR11cbiAgICAgIH0sXG4gICAgICBDVVJMWV9DT01NRU5ULCBQQVJFTl9DT01NRU5UXG4gICAgXVxuICB9O1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IERFTFBISV9LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnKFwifFxcXFwkW0ctWmctel18XFxcXC9cXFxcKnw8LyknLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBDVVJMWV9DT01NRU5ULCBQQVJFTl9DT01NRU5ULCBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBTVFJJTkcsIENIQVJfU1RSSU5HLFxuICAgICAgaGxqcy5OVU1CRVJfTU9ERSxcbiAgICAgIEZVTkNUSU9OLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luOiAnPVxcXFxiY2xhc3NcXFxcYicsIGVuZDogJ2VuZDsnLFxuICAgICAgICBrZXl3b3JkczogREVMUEhJX0NMQVNTX0tFWVdPUkRTLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIFNUUklORywgQ0hBUl9TVFJJTkcsXG4gICAgICAgICAgQ1VSTFlfQ09NTUVOVCwgUEFSRU5fQ09NTUVOVCwgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIEZVTkNUSU9OXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NodW5rJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXEBcXFxcQCArXFxcXC1cXFxcZCssXFxcXGQrICtcXFxcK1xcXFxkKyxcXFxcZCsgK1xcXFxAXFxcXEAkJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2h1bmsnLFxuICAgICAgICBiZWdpbjogJ15cXFxcKlxcXFwqXFxcXCogK1xcXFxkKyxcXFxcZCsgK1xcXFwqXFxcXCpcXFxcKlxcXFwqJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NodW5rJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXC1cXFxcLVxcXFwtICtcXFxcZCssXFxcXGQrICtcXFxcLVxcXFwtXFxcXC1cXFxcLSQnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ0luZGV4OiAnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICc9PT09PScsIGVuZDogJz09PT09JCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwtXFxcXC1cXFxcLScsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ15cXFxcKnszfSAnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCtcXFxcK1xcXFwrJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hlYWRlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXCp7NX0nLCBlbmQ6ICdcXFxcKns1fSQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhZGRpdGlvbicsXG4gICAgICAgIGJlZ2luOiAnXlxcXFwrJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2RlbGV0aW9uJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXC0nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXCEnLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG5cbiAgZnVuY3Rpb24gYWxsb3dzRGphbmdvU3ludGF4KG1vZGUsIHBhcmVudCkge1xuICAgIHJldHVybiAoXG4gICAgICBwYXJlbnQgPT0gdW5kZWZpbmVkIHx8IC8vIGRlZmF1bHQgbW9kZVxuICAgICAgKCFtb2RlLmNsYXNzTmFtZSAmJiBwYXJlbnQuY2xhc3NOYW1lID09ICd0YWcnKSB8fCAvLyB0YWdfaW50ZXJuYWxcbiAgICAgIG1vZGUuY2xhc3NOYW1lID09ICd2YWx1ZScgLy8gdmFsdWVcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gY29weShtb2RlLCBwYXJlbnQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIG1vZGUpIHtcbiAgICAgIGlmIChrZXkgIT0gJ2NvbnRhaW5zJykge1xuICAgICAgICByZXN1bHRba2V5XSA9IG1vZGVba2V5XTtcbiAgICAgIH1cbiAgICAgIHZhciBjb250YWlucyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IG1vZGUuY29udGFpbnMgJiYgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29udGFpbnMucHVzaChjb3B5KG1vZGUuY29udGFpbnNbaV0sIG1vZGUpKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbGxvd3NEamFuZ29TeW50YXgobW9kZSwgcGFyZW50KSkge1xuICAgICAgICBjb250YWlucyA9IERKQU5HT19DT05UQUlOUy5jb25jYXQoY29udGFpbnMpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRhaW5zLmxlbmd0aCkge1xuICAgICAgICByZXN1bHQuY29udGFpbnMgPSBjb250YWlucztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBGSUxURVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnZmlsdGVyJyxcbiAgICBiZWdpbjogJ1xcXFx8W0EtWmEtel0rXFxcXDo/JywgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBrZXl3b3JkczpcbiAgICAgICd0cnVuY2F0ZXdvcmRzIHJlbW92ZXRhZ3MgbGluZWJyZWFrc2JyIHllc25vIGdldF9kaWdpdCB0aW1lc2luY2UgcmFuZG9tIHN0cmlwdGFncyAnICtcbiAgICAgICdmaWxlc2l6ZWZvcm1hdCBlc2NhcGUgbGluZWJyZWFrcyBsZW5ndGhfaXMgbGp1c3Qgcmp1c3QgY3V0IHVybGl6ZSBmaXhfYW1wZXJzYW5kcyAnICtcbiAgICAgICd0aXRsZSBmbG9hdGZvcm1hdCBjYXBmaXJzdCBwcHJpbnQgZGl2aXNpYmxlYnkgYWRkIG1ha2VfbGlzdCB1bm9yZGVyZWRfbGlzdCB1cmxlbmNvZGUgJyArXG4gICAgICAndGltZXVudGlsIHVybGl6ZXRydW5jIHdvcmRjb3VudCBzdHJpbmdmb3JtYXQgbGluZW51bWJlcnMgc2xpY2UgZGF0ZSBkaWN0c29ydCAnICtcbiAgICAgICdkaWN0c29ydHJldmVyc2VkIGRlZmF1bHRfaWZfbm9uZSBwbHVyYWxpemUgbG93ZXIgam9pbiBjZW50ZXIgZGVmYXVsdCAnICtcbiAgICAgICd0cnVuY2F0ZXdvcmRzX2h0bWwgdXBwZXIgbGVuZ3RoIHBob25lMm51bWVyaWMgd29yZHdyYXAgdGltZSBhZGRzbGFzaGVzIHNsdWdpZnkgZmlyc3QgJyArXG4gICAgICAnZXNjYXBlanMgZm9yY2VfZXNjYXBlIGlyaWVuY29kZSBsYXN0IHNhZmUgc2FmZXNlcSB0cnVuY2F0ZWNoYXJzIGxvY2FsaXplIHVubG9jYWxpemUgJyArXG4gICAgICAnbG9jYWx0aW1lIHV0YyB0aW1lem9uZScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtjbGFzc05hbWU6ICdhcmd1bWVudCcsIGJlZ2luOiAnXCInLCBlbmQ6ICdcIid9XG4gICAgXVxuICB9O1xuXG4gIHZhciBESkFOR09fQ09OVEFJTlMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndGVtcGxhdGVfY29tbWVudCcsXG4gICAgICBiZWdpbjogJ3slXFxcXHMqY29tbWVudFxcXFxzKiV9JywgZW5kOiAneyVcXFxccyplbmRjb21tZW50XFxcXHMqJX0nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd0ZW1wbGF0ZV9jb21tZW50JyxcbiAgICAgIGJlZ2luOiAneyMnLCBlbmQ6ICcjfSdcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3RlbXBsYXRlX3RhZycsXG4gICAgICBiZWdpbjogJ3slJywgZW5kOiAnJX0nLFxuICAgICAga2V5d29yZHM6XG4gICAgICAgICdjb21tZW50IGVuZGNvbW1lbnQgbG9hZCB0ZW1wbGF0ZXRhZyBpZmNoYW5nZWQgZW5kaWZjaGFuZ2VkIGlmIGVuZGlmIGZpcnN0b2YgZm9yICcgK1xuICAgICAgICAnZW5kZm9yIGluIGlmbm90ZXF1YWwgZW5kaWZub3RlcXVhbCB3aWR0aHJhdGlvIGV4dGVuZHMgaW5jbHVkZSBzcGFjZWxlc3MgJyArXG4gICAgICAgICdlbmRzcGFjZWxlc3MgcmVncm91cCBieSBhcyBpZmVxdWFsIGVuZGlmZXF1YWwgc3NpIG5vdyB3aXRoIGN5Y2xlIHVybCBmaWx0ZXIgJyArXG4gICAgICAgICdlbmRmaWx0ZXIgZGVidWcgYmxvY2sgZW5kYmxvY2sgZWxzZSBhdXRvZXNjYXBlIGVuZGF1dG9lc2NhcGUgY3NyZl90b2tlbiBlbXB0eSBlbGlmICcgK1xuICAgICAgICAnZW5kd2l0aCBzdGF0aWMgdHJhbnMgYmxvY2t0cmFucyBlbmRibG9ja3RyYW5zIGdldF9zdGF0aWNfcHJlZml4IGdldF9tZWRpYV9wcmVmaXggJyArXG4gICAgICAgICdwbHVyYWwgZ2V0X2N1cnJlbnRfbGFuZ3VhZ2UgbGFuZ3VhZ2UgZ2V0X2F2YWlsYWJsZV9sYW5ndWFnZXMgJyArXG4gICAgICAgICdnZXRfY3VycmVudF9sYW5ndWFnZV9iaWRpIGdldF9sYW5ndWFnZV9pbmZvIGdldF9sYW5ndWFnZV9pbmZvX2xpc3QgbG9jYWxpemUgJyArXG4gICAgICAgICdlbmRsb2NhbGl6ZSBsb2NhbHRpbWUgZW5kbG9jYWx0aW1lIHRpbWV6b25lIGVuZHRpbWV6b25lIGdldF9jdXJyZW50X3RpbWV6b25lJyxcbiAgICAgIGNvbnRhaW5zOiBbRklMVEVSXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgYmVnaW46ICd7eycsIGVuZDogJ319JyxcbiAgICAgIGNvbnRhaW5zOiBbRklMVEVSXVxuICAgIH1cbiAgXTtcblxuICB2YXIgcmVzdWx0ID0gY29weShobGpzLkxBTkdVQUdFUy54bWwpO1xuICByZXN1bHQuY2FzZV9pbnNlbnNpdGl2ZSA9IHRydWU7XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAga2V5d29yZHM6IHtcbiAgICAgIGZsb3c6ICdpZiBlbHNlIGdvdG8gZm9yIGluIGRvIGNhbGwgZXhpdCBub3QgZXhpc3QgZXJyb3JsZXZlbCBkZWZpbmVkIGVxdSBuZXEgbHNzIGxlcSBndHIgZ2VxJyxcbiAgICAgIGtleXdvcmQ6ICdzaGlmdCBjZCBkaXIgZWNobyBzZXRsb2NhbCBlbmRsb2NhbCBzZXQgcGF1c2UgY29weScsXG4gICAgICBzdHJlYW06ICdwcm4gbnVsIGxwdDMgbHB0MiBscHQxIGNvbiBjb200IGNvbTMgY29tMiBjb20xIGF1eCcsXG4gICAgICB3aW51dGlsczogJ3BpbmcgbmV0IGlwY29uZmlnIHRhc2traWxsIHhjb3B5IHJlbiBkZWwnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbnZ2YXInLCBiZWdpbjogJyUlW14gXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VudnZhcicsIGJlZ2luOiAnJVteIF0rPyUnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdlbnZ2YXInLCBiZWdpbjogJyFbXiBdKz8hJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICdcXFxcYlxcXFxkKycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnQD9yZW0nLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIHNwZWNpYWxfZnVuY3Rpb25zOlxuICAgICAgICAnc3Bhd24gc3Bhd25fbGluayBzZWxmJyxcbiAgICAgIHJlc2VydmVkOlxuICAgICAgICAnYWZ0ZXIgYW5kIGFuZGFsc298MTAgYmFuZCBiZWdpbiBibm90IGJvciBic2wgYnNyIGJ4b3IgY2FzZSBjYXRjaCBjb25kIGRpdiBlbmQgZnVuIGlmICcgK1xuICAgICAgICAnbGV0IG5vdCBvZiBvciBvcmVsc2V8MTAgcXVlcnkgcmVjZWl2ZSByZW0gdHJ5IHdoZW4geG9yJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJvbXB0JywgYmVnaW46ICdeWzAtOV0rPiAnLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICclJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGIoXFxcXGQrI1thLWZBLUYwLTldK3xcXFxcZCsoXFxcXC5cXFxcZCspPyhbZUVdWy0rXT9cXFxcZCspPyknLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsIGJlZ2luOiAnXFxcXD8oOjopPyhbQS1aXVxcXFx3Kig6Oik/KSsnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhcnJvdycsIGJlZ2luOiAnLT4nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdvaycsIGJlZ2luOiAnb2snXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdleGNsYW1hdGlvbl9tYXJrJywgYmVnaW46ICchJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb25fb3JfYXRvbScsXG4gICAgICAgIGJlZ2luOiAnKFxcXFxiW2EtelxcJ11bYS16QS1aMC05X1xcJ10qOlthLXpcXCddW2EtekEtWjAtOV9cXCddKil8KFxcXFxiW2EtelxcJ11bYS16QS1aMC05X1xcJ10qKScsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1tBLVpdW2EtekEtWjAtOV9cXCddKicsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBCQVNJQ19BVE9NX1JFID0gJ1thLXpcXCddW2EtekEtWjAtOV9cXCddKic7XG4gIHZhciBGVU5DVElPTl9OQU1FX1JFID0gJygnICsgQkFTSUNfQVRPTV9SRSArICc6JyArIEJBU0lDX0FUT01fUkUgKyAnfCcgKyBCQVNJQ19BVE9NX1JFICsgJyknO1xuICB2YXIgRVJMQU5HX1JFU0VSVkVEID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnYWZ0ZXIgYW5kIGFuZGFsc298MTAgYmFuZCBiZWdpbiBibm90IGJvciBic2wgYnpyIGJ4b3IgY2FzZSBjYXRjaCBjb25kIGRpdiBlbmQgZnVuIGxldCAnICtcbiAgICAgICdub3Qgb2Ygb3JlbHNlfDEwIHF1ZXJ5IHJlY2VpdmUgcmVtIHRyeSB3aGVuIHhvcicsXG4gICAgbGl0ZXJhbDpcbiAgICAgICdmYWxzZSB0cnVlJ1xuICB9O1xuXG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnJScsIGVuZDogJyQnLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgTlVNQkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46ICdcXFxcYihcXFxcZCsjW2EtZkEtRjAtOV0rfFxcXFxkKyhcXFxcLlxcXFxkKyk/KFtlRV1bLStdP1xcXFxkKyk/KScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBOQU1FRF9GVU4gPSB7XG4gICAgYmVnaW46ICdmdW5cXFxccysnICsgQkFTSUNfQVRPTV9SRSArICcvXFxcXGQrJ1xuICB9O1xuICB2YXIgRlVOQ1RJT05fQ0FMTCA9IHtcbiAgICBiZWdpbjogRlVOQ1RJT05fTkFNRV9SRSArICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICByZWxldmFuY2U6IDAsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb25fbmFtZScsIGJlZ2luOiBGVU5DVElPTl9OQU1FX1JFLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICAvLyBcImNvbnRhaW5zXCIgZGVmaW5lZCBsYXRlclxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgdmFyIFRVUExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3R1cGxlJyxcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICByZWxldmFuY2U6IDBcbiAgICAvLyBcImNvbnRhaW5zXCIgZGVmaW5lZCBsYXRlclxuICB9O1xuICB2YXIgVkFSMSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdcXFxcYl8oW0EtWl1bQS1aYS16MC05X10qKT8nLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgVkFSMiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdbQS1aXVthLXpBLVowLTlfXSonLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgUkVDT1JEX0FDQ0VTUyA9IHtcbiAgICBiZWdpbjogJyMnLCBlbmQ6ICd9JyxcbiAgICBpbGxlZ2FsOiAnLicsXG4gICAgcmVsZXZhbmNlOiAwLFxuICAgIHJldHVybkJlZ2luOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlY29yZF9uYW1lJyxcbiAgICAgICAgYmVnaW46ICcjJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ3snLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIC8vIFwiY29udGFpbnNcIiBkZWZpbmVkIGxhdGVyXG4gICAgICB9XG4gICAgXVxuICB9O1xuXG4gIHZhciBCTE9DS19TVEFURU1FTlRTID0ge1xuICAgIGtleXdvcmRzOiBFUkxBTkdfUkVTRVJWRUQsXG4gICAgYmVnaW46ICcoZnVufHJlY2VpdmV8aWZ8dHJ5fGNhc2UpJywgZW5kOiAnZW5kJ1xuICB9O1xuICBCTE9DS19TVEFURU1FTlRTLmNvbnRhaW5zID0gW1xuICAgIENPTU1FTlQsXG4gICAgTkFNRURfRlVOLFxuICAgIGhsanMuaW5oZXJpdChobGpzLkFQT1NfU1RSSU5HX01PREUsIHtjbGFzc05hbWU6ICcnfSksXG4gICAgQkxPQ0tfU1RBVEVNRU5UUyxcbiAgICBGVU5DVElPTl9DQUxMLFxuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgTlVNQkVSLFxuICAgIFRVUExFLFxuICAgIFZBUjEsIFZBUjIsXG4gICAgUkVDT1JEX0FDQ0VTU1xuICBdO1xuXG4gIHZhciBCQVNJQ19NT0RFUyA9IFtcbiAgICBDT01NRU5ULFxuICAgIE5BTUVEX0ZVTixcbiAgICBCTE9DS19TVEFURU1FTlRTLFxuICAgIEZVTkNUSU9OX0NBTEwsXG4gICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICBOVU1CRVIsXG4gICAgVFVQTEUsXG4gICAgVkFSMSwgVkFSMixcbiAgICBSRUNPUkRfQUNDRVNTXG4gIF07XG4gIEZVTkNUSU9OX0NBTEwuY29udGFpbnNbMV0uY29udGFpbnMgPSBCQVNJQ19NT0RFUztcbiAgVFVQTEUuY29udGFpbnMgPSBCQVNJQ19NT0RFUztcbiAgUkVDT1JEX0FDQ0VTUy5jb250YWluc1sxXS5jb250YWlucyA9IEJBU0lDX01PREVTO1xuXG4gIHZhciBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBCQVNJQ19NT0RFU1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBFUkxBTkdfUkVTRVJWRUQsXG4gICAgaWxsZWdhbDogJyg8L3xcXFxcKj18XFxcXCs9fC09fC89fC9cXFxcKnxcXFxcKi98XFxcXChcXFxcKnxcXFxcKlxcXFwpKScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogJ14nICsgQkFTSUNfQVRPTV9SRSArICdcXFxccypcXFxcKCcsIGVuZDogJy0+JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcKHwjfC8vfC9cXFxcKnxcXFxcXFxcXHw6JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICBQQVJBTVMsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogQkFTSUNfQVRPTV9SRVxuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgc3RhcnRzOiB7XG4gICAgICAgICAgZW5kOiAnO3xcXFxcLicsXG4gICAgICAgICAga2V5d29yZHM6IEVSTEFOR19SRVNFUlZFRCxcbiAgICAgICAgICBjb250YWluczogQkFTSUNfTU9ERVNcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIENPTU1FTlQsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BwJyxcbiAgICAgICAgYmVnaW46ICdeLScsIGVuZDogJ1xcXFwuJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgbGV4ZW1zOiAnLScgKyBobGpzLklERU5UX1JFLFxuICAgICAgICBrZXl3b3JkczpcbiAgICAgICAgICAnLW1vZHVsZSAtcmVjb3JkIC11bmRlZiAtZXhwb3J0IC1pZmRlZiAtaWZuZGVmIC1hdXRob3IgLWNvcHlyaWdodCAtZG9jIC12c24gJyArXG4gICAgICAgICAgJy1pbXBvcnQgLWluY2x1ZGUgLWluY2x1ZGVfbGliIC1jb21waWxlIC1kZWZpbmUgLWVsc2UgLWVuZGlmIC1maWxlIC1iZWhhdmlvdXIgJyArXG4gICAgICAgICAgJy1iZWhhdmlvcicsXG4gICAgICAgIGNvbnRhaW5zOiBbUEFSQU1TXVxuICAgICAgfSxcbiAgICAgIE5VTUJFUixcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBSRUNPUkRfQUNDRVNTLFxuICAgICAgVkFSMSwgVkFSMixcbiAgICAgIFRVUExFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2F0b21pY191aW50IGF0dHJpYnV0ZSBib29sIGJyZWFrIGJ2ZWMyIGJ2ZWMzIGJ2ZWM0IGNhc2UgY2VudHJvaWQgY29oZXJlbnQgY29uc3QgY29udGludWUgZGVmYXVsdCAnICtcbiAgICAgICAgJ2Rpc2NhcmQgZG1hdDIgZG1hdDJ4MiBkbWF0MngzIGRtYXQyeDQgZG1hdDMgZG1hdDN4MiBkbWF0M3gzIGRtYXQzeDQgZG1hdDQgZG1hdDR4MiBkbWF0NHgzICcgK1xuICAgICAgICAnZG1hdDR4NCBkbyBkb3VibGUgZHZlYzIgZHZlYzMgZHZlYzQgZWxzZSBmbGF0IGZsb2F0IGZvciBoaWdocCBpZiBpaW1hZ2UxRCBpaW1hZ2UxREFycmF5ICcgK1xuICAgICAgICAnaWltYWdlMkQgaWltYWdlMkRBcnJheSBpaW1hZ2UyRE1TIGlpbWFnZTJETVNBcnJheSBpaW1hZ2UyRFJlY3QgaWltYWdlM0QgaWltYWdlQnVmZmVyIGlpbWFnZUN1YmUgJyArXG4gICAgICAgICdpaW1hZ2VDdWJlQXJyYXkgaW1hZ2UxRCBpbWFnZTFEQXJyYXkgaW1hZ2UyRCBpbWFnZTJEQXJyYXkgaW1hZ2UyRE1TIGltYWdlMkRNU0FycmF5IGltYWdlMkRSZWN0ICcgK1xuICAgICAgICAnaW1hZ2UzRCBpbWFnZUJ1ZmZlciBpbWFnZUN1YmUgaW1hZ2VDdWJlQXJyYXkgaW4gaW5vdXQgaW50IGludmFyaWFudCBpc2FtcGxlcjFEIGlzYW1wbGVyMURBcnJheSAnICtcbiAgICAgICAgJ2lzYW1wbGVyMkQgaXNhbXBsZXIyREFycmF5IGlzYW1wbGVyMkRNUyBpc2FtcGxlcjJETVNBcnJheSBpc2FtcGxlcjJEUmVjdCBpc2FtcGxlcjNEIGlzYW1wbGVyQnVmZmVyICcgK1xuICAgICAgICAnaXNhbXBsZXJDdWJlIGlzYW1wbGVyQ3ViZUFycmF5IGl2ZWMyIGl2ZWMzIGl2ZWM0IGxheW91dCBsb3dwIG1hdDIgbWF0MngyIG1hdDJ4MyBtYXQyeDQgbWF0MyBtYXQzeDIgJyArXG4gICAgICAgICdtYXQzeDMgbWF0M3g0IG1hdDQgbWF0NHgyIG1hdDR4MyBtYXQ0eDQgbWVkaXVtcCBub3BlcnNwZWN0aXZlIG91dCBwYXRjaCBwcmVjaXNpb24gcmVhZG9ubHkgcmVzdHJpY3QgJyArXG4gICAgICAgICdyZXR1cm4gc2FtcGxlIHNhbXBsZXIxRCBzYW1wbGVyMURBcnJheSBzYW1wbGVyMURBcnJheVNoYWRvdyBzYW1wbGVyMURTaGFkb3cgc2FtcGxlcjJEIHNhbXBsZXIyREFycmF5ICcgK1xuICAgICAgICAnc2FtcGxlcjJEQXJyYXlTaGFkb3cgc2FtcGxlcjJETVMgc2FtcGxlcjJETVNBcnJheSBzYW1wbGVyMkRSZWN0IHNhbXBsZXIyRFJlY3RTaGFkb3cgc2FtcGxlcjJEU2hhZG93ICcgK1xuICAgICAgICAnc2FtcGxlcjNEIHNhbXBsZXJCdWZmZXIgc2FtcGxlckN1YmUgc2FtcGxlckN1YmVBcnJheSBzYW1wbGVyQ3ViZUFycmF5U2hhZG93IHNhbXBsZXJDdWJlU2hhZG93IHNtb290aCAnICtcbiAgICAgICAgJ3N0cnVjdCBzdWJyb3V0aW5lIHN3aXRjaCB1aW1hZ2UxRCB1aW1hZ2UxREFycmF5IHVpbWFnZTJEIHVpbWFnZTJEQXJyYXkgdWltYWdlMkRNUyB1aW1hZ2UyRE1TQXJyYXkgJyArXG4gICAgICAgICd1aW1hZ2UyRFJlY3QgdWltYWdlM0QgdWltYWdlQnVmZmVyIHVpbWFnZUN1YmUgdWltYWdlQ3ViZUFycmF5IHVpbnQgdW5pZm9ybSB1c2FtcGxlcjFEIHVzYW1wbGVyMURBcnJheSAnICtcbiAgICAgICAgJ3VzYW1wbGVyMkQgdXNhbXBsZXIyREFycmF5IHVzYW1wbGVyMkRNUyB1c2FtcGxlcjJETVNBcnJheSB1c2FtcGxlcjJEUmVjdCB1c2FtcGxlcjNEIHVzYW1wbGVyQnVmZmVyICcgK1xuICAgICAgICAndXNhbXBsZXJDdWJlIHVzYW1wbGVyQ3ViZUFycmF5IHV2ZWMyIHV2ZWMzIHV2ZWM0IHZhcnlpbmcgdmVjMiB2ZWMzIHZlYzQgdm9pZCB2b2xhdGlsZSB3aGlsZSB3cml0ZW9ubHknLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdnbF9CYWNrQ29sb3IgZ2xfQmFja0xpZ2h0TW9kZWxQcm9kdWN0IGdsX0JhY2tMaWdodFByb2R1Y3QgZ2xfQmFja01hdGVyaWFsICcgK1xuICAgICAgICAnZ2xfQmFja1NlY29uZGFyeUNvbG9yIGdsX0NsaXBEaXN0YW5jZSBnbF9DbGlwUGxhbmUgZ2xfQ2xpcFZlcnRleCBnbF9Db2xvciAnICtcbiAgICAgICAgJ2dsX0RlcHRoUmFuZ2UgZ2xfRXllUGxhbmVRIGdsX0V5ZVBsYW5lUiBnbF9FeWVQbGFuZVMgZ2xfRXllUGxhbmVUIGdsX0ZvZyBnbF9Gb2dDb29yZCAnICtcbiAgICAgICAgJ2dsX0ZvZ0ZyYWdDb29yZCBnbF9GcmFnQ29sb3IgZ2xfRnJhZ0Nvb3JkIGdsX0ZyYWdEYXRhIGdsX0ZyYWdEZXB0aCBnbF9Gcm9udENvbG9yICcgK1xuICAgICAgICAnZ2xfRnJvbnRGYWNpbmcgZ2xfRnJvbnRMaWdodE1vZGVsUHJvZHVjdCBnbF9Gcm9udExpZ2h0UHJvZHVjdCBnbF9Gcm9udE1hdGVyaWFsICcgK1xuICAgICAgICAnZ2xfRnJvbnRTZWNvbmRhcnlDb2xvciBnbF9JbnN0YW5jZUlEIGdsX0ludm9jYXRpb25JRCBnbF9MYXllciBnbF9MaWdodE1vZGVsICcgK1xuICAgICAgICAnZ2xfTGlnaHRTb3VyY2UgZ2xfTWF4QXRvbWljQ291bnRlckJpbmRpbmdzIGdsX01heEF0b21pY0NvdW50ZXJCdWZmZXJTaXplICcgK1xuICAgICAgICAnZ2xfTWF4Q2xpcERpc3RhbmNlcyBnbF9NYXhDbGlwUGxhbmVzIGdsX01heENvbWJpbmVkQXRvbWljQ291bnRlckJ1ZmZlcnMgJyArXG4gICAgICAgICdnbF9NYXhDb21iaW5lZEF0b21pY0NvdW50ZXJzIGdsX01heENvbWJpbmVkSW1hZ2VVbmlmb3JtcyBnbF9NYXhDb21iaW5lZEltYWdlVW5pdHNBbmRGcmFnbWVudE91dHB1dHMgJyArXG4gICAgICAgICdnbF9NYXhDb21iaW5lZFRleHR1cmVJbWFnZVVuaXRzIGdsX01heERyYXdCdWZmZXJzIGdsX01heEZyYWdtZW50QXRvbWljQ291bnRlckJ1ZmZlcnMgJyArXG4gICAgICAgICdnbF9NYXhGcmFnbWVudEF0b21pY0NvdW50ZXJzIGdsX01heEZyYWdtZW50SW1hZ2VVbmlmb3JtcyBnbF9NYXhGcmFnbWVudElucHV0Q29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heEZyYWdtZW50VW5pZm9ybUNvbXBvbmVudHMgZ2xfTWF4RnJhZ21lbnRVbmlmb3JtVmVjdG9ycyBnbF9NYXhHZW9tZXRyeUF0b21pY0NvdW50ZXJCdWZmZXJzICcgK1xuICAgICAgICAnZ2xfTWF4R2VvbWV0cnlBdG9taWNDb3VudGVycyBnbF9NYXhHZW9tZXRyeUltYWdlVW5pZm9ybXMgZ2xfTWF4R2VvbWV0cnlJbnB1dENvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhHZW9tZXRyeU91dHB1dENvbXBvbmVudHMgZ2xfTWF4R2VvbWV0cnlPdXRwdXRWZXJ0aWNlcyBnbF9NYXhHZW9tZXRyeVRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4R2VvbWV0cnlUb3RhbE91dHB1dENvbXBvbmVudHMgZ2xfTWF4R2VvbWV0cnlVbmlmb3JtQ29tcG9uZW50cyBnbF9NYXhHZW9tZXRyeVZhcnlpbmdDb21wb25lbnRzICcgK1xuICAgICAgICAnZ2xfTWF4SW1hZ2VTYW1wbGVzIGdsX01heEltYWdlVW5pdHMgZ2xfTWF4TGlnaHRzIGdsX01heFBhdGNoVmVydGljZXMgZ2xfTWF4UHJvZ3JhbVRleGVsT2Zmc2V0ICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0NvbnRyb2xBdG9taWNDb3VudGVyQnVmZmVycyBnbF9NYXhUZXNzQ29udHJvbEF0b21pY0NvdW50ZXJzIGdsX01heFRlc3NDb250cm9sSW1hZ2VVbmlmb3JtcyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NDb250cm9sSW5wdXRDb21wb25lbnRzIGdsX01heFRlc3NDb250cm9sT3V0cHV0Q29tcG9uZW50cyBnbF9NYXhUZXNzQ29udHJvbFRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4VGVzc0NvbnRyb2xUb3RhbE91dHB1dENvbXBvbmVudHMgZ2xfTWF4VGVzc0NvbnRyb2xVbmlmb3JtQ29tcG9uZW50cyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NFdmFsdWF0aW9uQXRvbWljQ291bnRlckJ1ZmZlcnMgZ2xfTWF4VGVzc0V2YWx1YXRpb25BdG9taWNDb3VudGVycyAnICtcbiAgICAgICAgJ2dsX01heFRlc3NFdmFsdWF0aW9uSW1hZ2VVbmlmb3JtcyBnbF9NYXhUZXNzRXZhbHVhdGlvbklucHV0Q29tcG9uZW50cyBnbF9NYXhUZXNzRXZhbHVhdGlvbk91dHB1dENvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzRXZhbHVhdGlvblRleHR1cmVJbWFnZVVuaXRzIGdsX01heFRlc3NFdmFsdWF0aW9uVW5pZm9ybUNvbXBvbmVudHMgJyArXG4gICAgICAgICdnbF9NYXhUZXNzR2VuTGV2ZWwgZ2xfTWF4VGVzc1BhdGNoQ29tcG9uZW50cyBnbF9NYXhUZXh0dXJlQ29vcmRzIGdsX01heFRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4VGV4dHVyZVVuaXRzIGdsX01heFZhcnlpbmdDb21wb25lbnRzIGdsX01heFZhcnlpbmdGbG9hdHMgZ2xfTWF4VmFyeWluZ1ZlY3RvcnMgJyArXG4gICAgICAgICdnbF9NYXhWZXJ0ZXhBdG9taWNDb3VudGVyQnVmZmVycyBnbF9NYXhWZXJ0ZXhBdG9taWNDb3VudGVycyBnbF9NYXhWZXJ0ZXhBdHRyaWJzICcgK1xuICAgICAgICAnZ2xfTWF4VmVydGV4SW1hZ2VVbmlmb3JtcyBnbF9NYXhWZXJ0ZXhPdXRwdXRDb21wb25lbnRzIGdsX01heFZlcnRleFRleHR1cmVJbWFnZVVuaXRzICcgK1xuICAgICAgICAnZ2xfTWF4VmVydGV4VW5pZm9ybUNvbXBvbmVudHMgZ2xfTWF4VmVydGV4VW5pZm9ybVZlY3RvcnMgZ2xfTWF4Vmlld3BvcnRzIGdsX01pblByb2dyYW1UZXhlbE9mZnNldCcrXG4gICAgICAgICdnbF9Nb2RlbFZpZXdNYXRyaXggZ2xfTW9kZWxWaWV3TWF0cml4SW52ZXJzZSBnbF9Nb2RlbFZpZXdNYXRyaXhJbnZlcnNlVHJhbnNwb3NlICcgK1xuICAgICAgICAnZ2xfTW9kZWxWaWV3TWF0cml4VHJhbnNwb3NlIGdsX01vZGVsVmlld1Byb2plY3Rpb25NYXRyaXggZ2xfTW9kZWxWaWV3UHJvamVjdGlvbk1hdHJpeEludmVyc2UgJyArXG4gICAgICAgICdnbF9Nb2RlbFZpZXdQcm9qZWN0aW9uTWF0cml4SW52ZXJzZVRyYW5zcG9zZSBnbF9Nb2RlbFZpZXdQcm9qZWN0aW9uTWF0cml4VHJhbnNwb3NlICcgK1xuICAgICAgICAnZ2xfTXVsdGlUZXhDb29yZDAgZ2xfTXVsdGlUZXhDb29yZDEgZ2xfTXVsdGlUZXhDb29yZDIgZ2xfTXVsdGlUZXhDb29yZDMgZ2xfTXVsdGlUZXhDb29yZDQgJyArXG4gICAgICAgICdnbF9NdWx0aVRleENvb3JkNSBnbF9NdWx0aVRleENvb3JkNiBnbF9NdWx0aVRleENvb3JkNyBnbF9Ob3JtYWwgZ2xfTm9ybWFsTWF0cml4ICcgK1xuICAgICAgICAnZ2xfTm9ybWFsU2NhbGUgZ2xfT2JqZWN0UGxhbmVRIGdsX09iamVjdFBsYW5lUiBnbF9PYmplY3RQbGFuZVMgZ2xfT2JqZWN0UGxhbmVUIGdsX1BhdGNoVmVydGljZXNJbiAnICtcbiAgICAgICAgJ2dsX1BlclZlcnRleCBnbF9Qb2ludCBnbF9Qb2ludENvb3JkIGdsX1BvaW50U2l6ZSBnbF9Qb3NpdGlvbiBnbF9QcmltaXRpdmVJRCBnbF9QcmltaXRpdmVJREluICcgK1xuICAgICAgICAnZ2xfUHJvamVjdGlvbk1hdHJpeCBnbF9Qcm9qZWN0aW9uTWF0cml4SW52ZXJzZSBnbF9Qcm9qZWN0aW9uTWF0cml4SW52ZXJzZVRyYW5zcG9zZSAnICtcbiAgICAgICAgJ2dsX1Byb2plY3Rpb25NYXRyaXhUcmFuc3Bvc2UgZ2xfU2FtcGxlSUQgZ2xfU2FtcGxlTWFzayBnbF9TYW1wbGVNYXNrSW4gZ2xfU2FtcGxlUG9zaXRpb24gJyArXG4gICAgICAgICdnbF9TZWNvbmRhcnlDb2xvciBnbF9UZXNzQ29vcmQgZ2xfVGVzc0xldmVsSW5uZXIgZ2xfVGVzc0xldmVsT3V0ZXIgZ2xfVGV4Q29vcmQgZ2xfVGV4dHVyZUVudkNvbG9yICcgK1xuICAgICAgICAnZ2xfVGV4dHVyZU1hdHJpeEludmVyc2VUcmFuc3Bvc2UgZ2xfVGV4dHVyZU1hdHJpeFRyYW5zcG9zZSBnbF9WZXJ0ZXggZ2xfVmVydGV4SUQgJyArXG4gICAgICAgICdnbF9WaWV3cG9ydEluZGV4IGdsX2luIGdsX291dCBFbWl0U3RyZWFtVmVydGV4IEVtaXRWZXJ0ZXggRW5kUHJpbWl0aXZlIEVuZFN0cmVhbVByaW1pdGl2ZSAnICtcbiAgICAgICAgJ2FicyBhY29zIGFjb3NoIGFsbCBhbnkgYXNpbiBhc2luaCBhdGFuIGF0YW5oIGF0b21pY0NvdW50ZXIgYXRvbWljQ291bnRlckRlY3JlbWVudCAnICtcbiAgICAgICAgJ2F0b21pY0NvdW50ZXJJbmNyZW1lbnQgYmFycmllciBiaXRDb3VudCBiaXRmaWVsZEV4dHJhY3QgYml0ZmllbGRJbnNlcnQgYml0ZmllbGRSZXZlcnNlICcgK1xuICAgICAgICAnY2VpbCBjbGFtcCBjb3MgY29zaCBjcm9zcyBkRmR4IGRGZHkgZGVncmVlcyBkZXRlcm1pbmFudCBkaXN0YW5jZSBkb3QgZXF1YWwgZXhwIGV4cDIgZmFjZWZvcndhcmQgJyArXG4gICAgICAgICdmaW5kTFNCIGZpbmRNU0IgZmxvYXRCaXRzVG9JbnQgZmxvYXRCaXRzVG9VaW50IGZsb29yIGZtYSBmcmFjdCBmcmV4cCBmdHJhbnNmb3JtIGZ3aWR0aCBncmVhdGVyVGhhbiAnICtcbiAgICAgICAgJ2dyZWF0ZXJUaGFuRXF1YWwgaW1hZ2VBdG9taWNBZGQgaW1hZ2VBdG9taWNBbmQgaW1hZ2VBdG9taWNDb21wU3dhcCBpbWFnZUF0b21pY0V4Y2hhbmdlICcgK1xuICAgICAgICAnaW1hZ2VBdG9taWNNYXggaW1hZ2VBdG9taWNNaW4gaW1hZ2VBdG9taWNPciBpbWFnZUF0b21pY1hvciBpbWFnZUxvYWQgaW1hZ2VTdG9yZSBpbXVsRXh0ZW5kZWQgJyArXG4gICAgICAgICdpbnRCaXRzVG9GbG9hdCBpbnRlcnBvbGF0ZUF0Q2VudHJvaWQgaW50ZXJwb2xhdGVBdE9mZnNldCBpbnRlcnBvbGF0ZUF0U2FtcGxlIGludmVyc2UgaW52ZXJzZXNxcnQgJyArXG4gICAgICAgICdpc2luZiBpc25hbiBsZGV4cCBsZW5ndGggbGVzc1RoYW4gbGVzc1RoYW5FcXVhbCBsb2cgbG9nMiBtYXRyaXhDb21wTXVsdCBtYXggbWVtb3J5QmFycmllciAnICtcbiAgICAgICAgJ21pbiBtaXggbW9kIG1vZGYgbm9pc2UxIG5vaXNlMiBub2lzZTMgbm9pc2U0IG5vcm1hbGl6ZSBub3Qgbm90RXF1YWwgb3V0ZXJQcm9kdWN0IHBhY2tEb3VibGUyeDMyICcgK1xuICAgICAgICAncGFja0hhbGYyeDE2IHBhY2tTbm9ybTJ4MTYgcGFja1Nub3JtNHg4IHBhY2tVbm9ybTJ4MTYgcGFja1Vub3JtNHg4IHBvdyByYWRpYW5zIHJlZmxlY3QgcmVmcmFjdCAnICtcbiAgICAgICAgJ3JvdW5kIHJvdW5kRXZlbiBzaGFkb3cxRCBzaGFkb3cxRExvZCBzaGFkb3cxRFByb2ogc2hhZG93MURQcm9qTG9kIHNoYWRvdzJEIHNoYWRvdzJETG9kIHNoYWRvdzJEUHJvaiAnICtcbiAgICAgICAgJ3NoYWRvdzJEUHJvakxvZCBzaWduIHNpbiBzaW5oIHNtb290aHN0ZXAgc3FydCBzdGVwIHRhbiB0YW5oIHRleGVsRmV0Y2ggdGV4ZWxGZXRjaE9mZnNldCB0ZXh0dXJlICcgK1xuICAgICAgICAndGV4dHVyZTFEIHRleHR1cmUxRExvZCB0ZXh0dXJlMURQcm9qIHRleHR1cmUxRFByb2pMb2QgdGV4dHVyZTJEIHRleHR1cmUyRExvZCB0ZXh0dXJlMkRQcm9qICcgK1xuICAgICAgICAndGV4dHVyZTJEUHJvakxvZCB0ZXh0dXJlM0QgdGV4dHVyZTNETG9kIHRleHR1cmUzRFByb2ogdGV4dHVyZTNEUHJvakxvZCB0ZXh0dXJlQ3ViZSB0ZXh0dXJlQ3ViZUxvZCAnICtcbiAgICAgICAgJ3RleHR1cmVHYXRoZXIgdGV4dHVyZUdhdGhlck9mZnNldCB0ZXh0dXJlR2F0aGVyT2Zmc2V0cyB0ZXh0dXJlR3JhZCB0ZXh0dXJlR3JhZE9mZnNldCB0ZXh0dXJlTG9kICcgK1xuICAgICAgICAndGV4dHVyZUxvZE9mZnNldCB0ZXh0dXJlT2Zmc2V0IHRleHR1cmVQcm9qIHRleHR1cmVQcm9qR3JhZCB0ZXh0dXJlUHJvakdyYWRPZmZzZXQgdGV4dHVyZVByb2pMb2QgJyArXG4gICAgICAgICd0ZXh0dXJlUHJvakxvZE9mZnNldCB0ZXh0dXJlUHJvak9mZnNldCB0ZXh0dXJlUXVlcnlMb2QgdGV4dHVyZVNpemUgdHJhbnNwb3NlIHRydW5jIHVhZGRDYXJyeSAnICtcbiAgICAgICAgJ3VpbnRCaXRzVG9GbG9hdCB1bXVsRXh0ZW5kZWQgdW5wYWNrRG91YmxlMngzMiB1bnBhY2tIYWxmMngxNiB1bnBhY2tTbm9ybTJ4MTYgdW5wYWNrU25vcm00eDggJyArXG4gICAgICAgICd1bnBhY2tVbm9ybTJ4MTYgdW5wYWNrVW5vcm00eDggdXN1YkJvcnJvdyBnbF9UZXh0dXJlTWF0cml4IGdsX1RleHR1cmVNYXRyaXhJbnZlcnNlJyxcbiAgICAgIGxpdGVyYWw6ICd0cnVlIGZhbHNlJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJ1wiJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgR09fS0VZV09SRFMgPSB7XG4gICAga2V5d29yZDpcbiAgICAgICdicmVhayBkZWZhdWx0IGZ1bmMgaW50ZXJmYWNlIHNlbGVjdCBjYXNlIG1hcCBzdHJ1Y3QgY2hhbiBlbHNlIGdvdG8gcGFja2FnZSBzd2l0Y2ggJyArXG4gICAgICAnY29uc3QgZmFsbHRocm91Z2ggaWYgcmFuZ2UgdHlwZSBjb250aW51ZSBmb3IgaW1wb3J0IHJldHVybiB2YXIgZ28gZGVmZXInLFxuICAgIGNvbnN0YW50OlxuICAgICAgICd0cnVlIGZhbHNlIGlvdGEgbmlsJyxcbiAgICB0eXBlbmFtZTpcbiAgICAgICdib29sIGJ5dGUgY29tcGxleDY0IGNvbXBsZXgxMjggZmxvYXQzMiBmbG9hdDY0IGludDggaW50MTYgaW50MzIgaW50NjQgc3RyaW5nIHVpbnQ4ICcgK1xuICAgICAgJ3VpbnQxNiB1aW50MzIgdWludDY0IGludCB1aW50IHVpbnRwdHIgcnVuZScsXG4gICAgYnVpbHRfaW46XG4gICAgICAnYXBwZW5kIGNhcCBjbG9zZSBjb21wbGV4IGNvcHkgaW1hZyBsZW4gbWFrZSBuZXcgcGFuaWMgcHJpbnQgcHJpbnRsbiByZWFsIHJlY292ZXIgZGVsZXRlJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiBHT19LRVlXT1JEUyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXCcnLCBlbmQ6ICdbXlxcXFxcXFxcXVxcJycsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnW15hLXpBLVpfMC05XShcXFxcLXxcXFxcKyk/XFxcXGQrKFxcXFwuXFxcXGQrfFxcXFwvXFxcXGQrKT8oKGR8ZXxmfGx8cykoXFxcXCt8XFxcXC0pP1xcXFxkKyk/JyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFRZUEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndHlwZScsXG4gICAgYmVnaW46ICdcXFxcYltBLVpdW1xcXFx3XFwnXSonLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB2YXIgQ09OVEFJTkVSID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbnRhaW5lcicsXG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogW1xuICAgICAge2NsYXNzTmFtZTogJ3R5cGUnLCBiZWdpbjogJ1xcXFxiW0EtWl1bXFxcXHddKihcXFxcKChcXFxcLlxcXFwufCx8XFxcXHcrKVxcXFwpKT8nfSxcbiAgICAgIHtjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnW19hLXpdW1xcXFx3XFwnXSonfVxuICAgIF1cbiAgfTtcbiAgdmFyIENPTlRBSU5FUjIgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29udGFpbmVyJyxcbiAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICBjb250YWluczogQ09OVEFJTkVSLmNvbnRhaW5zXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOlxuICAgICAgJ2xldCBpbiBpZiB0aGVuIGVsc2UgY2FzZSBvZiB3aGVyZSBkbyBtb2R1bGUgaW1wb3J0IGhpZGluZyBxdWFsaWZpZWQgdHlwZSBkYXRhICcgK1xuICAgICAgJ25ld3R5cGUgZGVyaXZpbmcgY2xhc3MgaW5zdGFuY2Ugbm90IGFzIGZvcmVpZ24gY2NhbGwgc2FmZSB1bnNhZmUnLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy0tJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAney0jJywgZW5kOiAnIy19J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnXSxcbiAgICAgICAgYmVnaW46ICd7LScsIGVuZDogJy19J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgICAgYmVnaW46ICdcXFxccytcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2ltcG9ydCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJpbXBvcnQnLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdpbXBvcnQgcXVhbGlmaWVkIGFzIGhpZGluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbQ09OVEFJTkVSXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxXXFxcXC58OydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21vZHVsZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJtb2R1bGUnLCBlbmQ6ICd3aGVyZScsXG4gICAgICAgIGtleXdvcmRzOiAnbW9kdWxlIHdoZXJlJyxcbiAgICAgICAgY29udGFpbnM6IFtDT05UQUlORVJdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXFdcXFxcLnw7J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2xhc3MnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGNsYXNzfGluc3RhbmNlKScsIGVuZDogJ3doZXJlJyxcbiAgICAgICAga2V5d29yZHM6ICdjbGFzcyB3aGVyZSBpbnN0YW5jZScsXG4gICAgICAgIGNvbnRhaW5zOiBbVFlQRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3R5cGVkZWYnLFxuICAgICAgICBiZWdpbjogJ1xcXFxiKGRhdGF8KG5ldyk/dHlwZSknLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICdkYXRhIHR5cGUgbmV3dHlwZSBkZXJpdmluZycsXG4gICAgICAgIGNvbnRhaW5zOiBbVFlQRSwgQ09OVEFJTkVSLCBDT05UQUlORVIyXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc2hlYmFuZycsXG4gICAgICAgIGJlZ2luOiAnIyFcXFxcL3VzclxcXFwvYmluXFxcXC9lbnZcXCBydW5oYXNrZWxsJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICBUWVBFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnXltfYS16XVtcXFxcd1xcJ10qJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwidmFyIGhsanMgPSBuZXcgZnVuY3Rpb24oKSB7XG5cbiAgLyogVXRpbGl0eSBmdW5jdGlvbnMgKi9cblxuICBmdW5jdGlvbiBlc2NhcGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvJi9nbSwgJyZhbXA7JykucmVwbGFjZSgvPC9nbSwgJyZsdDsnKS5yZXBsYWNlKC8+L2dtLCAnJmd0OycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluZENvZGUocHJlKSB7XG4gICAgZm9yICh2YXIgbm9kZSA9IHByZS5maXJzdENoaWxkOyBub2RlOyBub2RlID0gbm9kZS5uZXh0U2libGluZykge1xuICAgICAgaWYgKG5vZGUubm9kZU5hbWUgPT0gJ0NPREUnKVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgIGlmICghKG5vZGUubm9kZVR5cGUgPT0gMyAmJiBub2RlLm5vZGVWYWx1ZS5tYXRjaCgvXFxzKy8pKSlcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tUZXh0KGJsb2NrLCBpZ25vcmVOZXdMaW5lcykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUubWFwLmNhbGwoYmxvY2suY2hpbGROb2RlcywgZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUubm9kZVR5cGUgPT0gMykge1xuICAgICAgICByZXR1cm4gaWdub3JlTmV3TGluZXMgPyBub2RlLm5vZGVWYWx1ZS5yZXBsYWNlKC9cXG4vZywgJycpIDogbm9kZS5ub2RlVmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAobm9kZS5ub2RlTmFtZSA9PSAnQlInKSB7XG4gICAgICAgIHJldHVybiAnXFxuJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBibG9ja1RleHQobm9kZSwgaWdub3JlTmV3TGluZXMpO1xuICAgIH0pLmpvaW4oJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gYmxvY2tMYW5ndWFnZShibG9jaykge1xuICAgIHZhciBjbGFzc2VzID0gKGJsb2NrLmNsYXNzTmFtZSArICcgJyArIGJsb2NrLnBhcmVudE5vZGUuY2xhc3NOYW1lKS5zcGxpdCgvXFxzKy8pO1xuICAgIGNsYXNzZXMgPSBjbGFzc2VzLm1hcChmdW5jdGlvbihjKSB7cmV0dXJuIGMucmVwbGFjZSgvXmxhbmd1YWdlLS8sICcnKX0pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxhbmd1YWdlc1tjbGFzc2VzW2ldXSB8fCBjbGFzc2VzW2ldID09ICduby1oaWdobGlnaHQnKSB7XG4gICAgICAgIHJldHVybiBjbGFzc2VzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qIFN0cmVhbSBtZXJnaW5nICovXG5cbiAgZnVuY3Rpb24gbm9kZVN0cmVhbShub2RlKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIChmdW5jdGlvbiBfbm9kZVN0cmVhbShub2RlLCBvZmZzZXQpIHtcbiAgICAgIGZvciAodmFyIGNoaWxkID0gbm9kZS5maXJzdENoaWxkOyBjaGlsZDsgY2hpbGQgPSBjaGlsZC5uZXh0U2libGluZykge1xuICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT0gMylcbiAgICAgICAgICBvZmZzZXQgKz0gY2hpbGQubm9kZVZhbHVlLmxlbmd0aDtcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQubm9kZU5hbWUgPT0gJ0JSJylcbiAgICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgICAgZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT0gMSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RhcnQnLFxuICAgICAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgICAgICBub2RlOiBjaGlsZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9mZnNldCA9IF9ub2RlU3RyZWFtKGNoaWxkLCBvZmZzZXQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIGV2ZW50OiAnc3RvcCcsXG4gICAgICAgICAgICBvZmZzZXQ6IG9mZnNldCxcbiAgICAgICAgICAgIG5vZGU6IGNoaWxkXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfSkobm9kZSwgMCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlU3RyZWFtcyhzdHJlYW0xLCBzdHJlYW0yLCB2YWx1ZSkge1xuICAgIHZhciBwcm9jZXNzZWQgPSAwO1xuICAgIHZhciByZXN1bHQgPSAnJztcbiAgICB2YXIgbm9kZVN0YWNrID0gW107XG5cbiAgICBmdW5jdGlvbiBzZWxlY3RTdHJlYW0oKSB7XG4gICAgICBpZiAoc3RyZWFtMS5sZW5ndGggJiYgc3RyZWFtMi5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHN0cmVhbTFbMF0ub2Zmc2V0ICE9IHN0cmVhbTJbMF0ub2Zmc2V0KVxuICAgICAgICAgIHJldHVybiAoc3RyZWFtMVswXS5vZmZzZXQgPCBzdHJlYW0yWzBdLm9mZnNldCkgPyBzdHJlYW0xIDogc3RyZWFtMjtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgLypcbiAgICAgICAgICBUbyBhdm9pZCBzdGFydGluZyB0aGUgc3RyZWFtIGp1c3QgYmVmb3JlIGl0IHNob3VsZCBzdG9wIHRoZSBvcmRlciBpc1xuICAgICAgICAgIGVuc3VyZWQgdGhhdCBzdHJlYW0xIGFsd2F5cyBzdGFydHMgZmlyc3QgYW5kIGNsb3NlcyBsYXN0OlxuXG4gICAgICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RhcnQnKVxuICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTE7XG4gICAgICAgICAgaWYgKGV2ZW50MSA9PSAnc3RhcnQnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgICAgICByZXR1cm4gc3RyZWFtMjtcbiAgICAgICAgICBpZiAoZXZlbnQxID09ICdzdG9wJyAmJiBldmVudDIgPT0gJ3N0YXJ0JylcbiAgICAgICAgICAgIHJldHVybiBzdHJlYW0xO1xuICAgICAgICAgIGlmIChldmVudDEgPT0gJ3N0b3AnICYmIGV2ZW50MiA9PSAnc3RvcCcpXG4gICAgICAgICAgICByZXR1cm4gc3RyZWFtMjtcblxuICAgICAgICAgIC4uLiB3aGljaCBpcyBjb2xsYXBzZWQgdG86XG4gICAgICAgICAgKi9cbiAgICAgICAgICByZXR1cm4gc3RyZWFtMlswXS5ldmVudCA9PSAnc3RhcnQnID8gc3RyZWFtMSA6IHN0cmVhbTI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzdHJlYW0xLmxlbmd0aCA/IHN0cmVhbTEgOiBzdHJlYW0yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9wZW4obm9kZSkge1xuICAgICAgZnVuY3Rpb24gYXR0cl9zdHIoYSkge3JldHVybiAnICcgKyBhLm5vZGVOYW1lICsgJz1cIicgKyBlc2NhcGUoYS52YWx1ZSkgKyAnXCInfTtcbiAgICAgIHJldHVybiAnPCcgKyBub2RlLm5vZGVOYW1lICsgQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKG5vZGUuYXR0cmlidXRlcywgYXR0cl9zdHIpLmpvaW4oJycpICsgJz4nO1xuICAgIH1cblxuICAgIHdoaWxlIChzdHJlYW0xLmxlbmd0aCB8fCBzdHJlYW0yLmxlbmd0aCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBzZWxlY3RTdHJlYW0oKS5zcGxpY2UoMCwgMSlbMF07XG4gICAgICByZXN1bHQgKz0gZXNjYXBlKHZhbHVlLnN1YnN0cihwcm9jZXNzZWQsIGN1cnJlbnQub2Zmc2V0IC0gcHJvY2Vzc2VkKSk7XG4gICAgICBwcm9jZXNzZWQgPSBjdXJyZW50Lm9mZnNldDtcbiAgICAgIGlmICggY3VycmVudC5ldmVudCA9PSAnc3RhcnQnKSB7XG4gICAgICAgIHJlc3VsdCArPSBvcGVuKGN1cnJlbnQubm9kZSk7XG4gICAgICAgIG5vZGVTdGFjay5wdXNoKGN1cnJlbnQubm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQuZXZlbnQgPT0gJ3N0b3AnKSB7XG4gICAgICAgIHZhciBub2RlLCBpID0gbm9kZVN0YWNrLmxlbmd0aDtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGktLTtcbiAgICAgICAgICBub2RlID0gbm9kZVN0YWNrW2ldO1xuICAgICAgICAgIHJlc3VsdCArPSAoJzwvJyArIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSArICc+Jyk7XG4gICAgICAgIH0gd2hpbGUgKG5vZGUgIT0gY3VycmVudC5ub2RlKTtcbiAgICAgICAgbm9kZVN0YWNrLnNwbGljZShpLCAxKTtcbiAgICAgICAgd2hpbGUgKGkgPCBub2RlU3RhY2subGVuZ3RoKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IG9wZW4obm9kZVN0YWNrW2ldKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdCArIGVzY2FwZSh2YWx1ZS5zdWJzdHIocHJvY2Vzc2VkKSk7XG4gIH1cblxuICAvKiBJbml0aWFsaXphdGlvbiAqL1xuXG4gIGZ1bmN0aW9uIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSkge1xuXG4gICAgZnVuY3Rpb24gbGFuZ1JlKHZhbHVlLCBnbG9iYWwpIHtcbiAgICAgIHJldHVybiBSZWdFeHAoXG4gICAgICAgIHZhbHVlLFxuICAgICAgICAnbScgKyAobGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/ICdpJyA6ICcnKSArIChnbG9iYWwgPyAnZycgOiAnJylcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcGlsZU1vZGUobW9kZSwgcGFyZW50KSB7XG4gICAgICBpZiAobW9kZS5jb21waWxlZClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgbW9kZS5jb21waWxlZCA9IHRydWU7XG5cbiAgICAgIHZhciBrZXl3b3JkcyA9IFtdOyAvLyB1c2VkIGxhdGVyIHdpdGggYmVnaW5XaXRoS2V5d29yZCBidXQgZmlsbGVkIGFzIGEgc2lkZS1lZmZlY3Qgb2Yga2V5d29yZHMgY29tcGlsYXRpb25cbiAgICAgIGlmIChtb2RlLmtleXdvcmRzKSB7XG4gICAgICAgIHZhciBjb21waWxlZF9rZXl3b3JkcyA9IHt9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGZsYXR0ZW4oY2xhc3NOYW1lLCBzdHIpIHtcbiAgICAgICAgICBzdHIuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGt3KSB7XG4gICAgICAgICAgICB2YXIgcGFpciA9IGt3LnNwbGl0KCd8Jyk7XG4gICAgICAgICAgICBjb21waWxlZF9rZXl3b3Jkc1twYWlyWzBdXSA9IFtjbGFzc05hbWUsIHBhaXJbMV0gPyBOdW1iZXIocGFpclsxXSkgOiAxXTtcbiAgICAgICAgICAgIGtleXdvcmRzLnB1c2gocGFpclswXSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBtb2RlLmxleGVtc1JlID0gbGFuZ1JlKG1vZGUubGV4ZW1zIHx8IGhsanMuSURFTlRfUkUsIHRydWUpO1xuICAgICAgICBpZiAodHlwZW9mIG1vZGUua2V5d29yZHMgPT0gJ3N0cmluZycpIHsgLy8gc3RyaW5nXG4gICAgICAgICAgZmxhdHRlbigna2V5d29yZCcsIG1vZGUua2V5d29yZHMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9yICh2YXIgY2xhc3NOYW1lIGluIG1vZGUua2V5d29yZHMpIHtcbiAgICAgICAgICAgIGlmICghbW9kZS5rZXl3b3Jkcy5oYXNPd25Qcm9wZXJ0eShjbGFzc05hbWUpKVxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGZsYXR0ZW4oY2xhc3NOYW1lLCBtb2RlLmtleXdvcmRzW2NsYXNzTmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtb2RlLmtleXdvcmRzID0gY29tcGlsZWRfa2V5d29yZHM7XG4gICAgICB9XG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIGlmIChtb2RlLmJlZ2luV2l0aEtleXdvcmQpIHtcbiAgICAgICAgICBtb2RlLmJlZ2luID0gJ1xcXFxiKCcgKyBrZXl3b3Jkcy5qb2luKCd8JykgKyAnKVxcXFxzJztcbiAgICAgICAgfVxuICAgICAgICBtb2RlLmJlZ2luUmUgPSBsYW5nUmUobW9kZS5iZWdpbiA/IG1vZGUuYmVnaW4gOiAnXFxcXEJ8XFxcXGInKTtcbiAgICAgICAgaWYgKCFtb2RlLmVuZCAmJiAhbW9kZS5lbmRzV2l0aFBhcmVudClcbiAgICAgICAgICBtb2RlLmVuZCA9ICdcXFxcQnxcXFxcYic7XG4gICAgICAgIGlmIChtb2RlLmVuZClcbiAgICAgICAgICBtb2RlLmVuZFJlID0gbGFuZ1JlKG1vZGUuZW5kKTtcbiAgICAgICAgbW9kZS50ZXJtaW5hdG9yX2VuZCA9IG1vZGUuZW5kIHx8ICcnO1xuICAgICAgICBpZiAobW9kZS5lbmRzV2l0aFBhcmVudCAmJiBwYXJlbnQudGVybWluYXRvcl9lbmQpXG4gICAgICAgICAgbW9kZS50ZXJtaW5hdG9yX2VuZCArPSAobW9kZS5lbmQgPyAnfCcgOiAnJykgKyBwYXJlbnQudGVybWluYXRvcl9lbmQ7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5pbGxlZ2FsKVxuICAgICAgICBtb2RlLmlsbGVnYWxSZSA9IGxhbmdSZShtb2RlLmlsbGVnYWwpO1xuICAgICAgaWYgKG1vZGUucmVsZXZhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgIG1vZGUucmVsZXZhbmNlID0gMTtcbiAgICAgIGlmICghbW9kZS5jb250YWlucykge1xuICAgICAgICBtb2RlLmNvbnRhaW5zID0gW107XG4gICAgICB9XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG1vZGUuY29udGFpbnNbaV0gPT0gJ3NlbGYnKSB7XG4gICAgICAgICAgbW9kZS5jb250YWluc1tpXSA9IG1vZGU7XG4gICAgICAgIH1cbiAgICAgICAgY29tcGlsZU1vZGUobW9kZS5jb250YWluc1tpXSwgbW9kZSk7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS5zdGFydHMpIHtcbiAgICAgICAgY29tcGlsZU1vZGUobW9kZS5zdGFydHMsIHBhcmVudCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ZXJtaW5hdG9ycyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb2RlLmNvbnRhaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRlcm1pbmF0b3JzLnB1c2gobW9kZS5jb250YWluc1tpXS5iZWdpbik7XG4gICAgICB9XG4gICAgICBpZiAobW9kZS50ZXJtaW5hdG9yX2VuZCkge1xuICAgICAgICB0ZXJtaW5hdG9ycy5wdXNoKG1vZGUudGVybWluYXRvcl9lbmQpO1xuICAgICAgfVxuICAgICAgaWYgKG1vZGUuaWxsZWdhbCkge1xuICAgICAgICB0ZXJtaW5hdG9ycy5wdXNoKG1vZGUuaWxsZWdhbCk7XG4gICAgICB9XG4gICAgICBtb2RlLnRlcm1pbmF0b3JzID0gdGVybWluYXRvcnMubGVuZ3RoID8gbGFuZ1JlKHRlcm1pbmF0b3JzLmpvaW4oJ3wnKSwgdHJ1ZSkgOiB7ZXhlYzogZnVuY3Rpb24ocykge3JldHVybiBudWxsO319O1xuICAgIH1cblxuICAgIGNvbXBpbGVNb2RlKGxhbmd1YWdlKTtcbiAgfVxuXG4gIC8qXG4gIENvcmUgaGlnaGxpZ2h0aW5nIGZ1bmN0aW9uLiBBY2NlcHRzIGEgbGFuZ3VhZ2UgbmFtZSBhbmQgYSBzdHJpbmcgd2l0aCB0aGVcbiAgY29kZSB0byBoaWdobGlnaHQuIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXG4gIC0gcmVsZXZhbmNlIChpbnQpXG4gIC0ga2V5d29yZF9jb3VudCAoaW50KVxuICAtIHZhbHVlIChhbiBIVE1MIHN0cmluZyB3aXRoIGhpZ2hsaWdodGluZyBtYXJrdXApXG5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0KGxhbmd1YWdlX25hbWUsIHZhbHVlKSB7XG5cbiAgICBmdW5jdGlvbiBzdWJNb2RlKGxleGVtLCBtb2RlKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1vZGUuY29udGFpbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG1hdGNoID0gbW9kZS5jb250YWluc1tpXS5iZWdpblJlLmV4ZWMobGV4ZW0pO1xuICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2guaW5kZXggPT0gMCkge1xuICAgICAgICAgIHJldHVybiBtb2RlLmNvbnRhaW5zW2ldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZW5kT2ZNb2RlKG1vZGUsIGxleGVtKSB7XG4gICAgICBpZiAobW9kZS5lbmQgJiYgbW9kZS5lbmRSZS50ZXN0KGxleGVtKSkge1xuICAgICAgICByZXR1cm4gbW9kZTtcbiAgICAgIH1cbiAgICAgIGlmIChtb2RlLmVuZHNXaXRoUGFyZW50KSB7XG4gICAgICAgIHJldHVybiBlbmRPZk1vZGUobW9kZS5wYXJlbnQsIGxleGVtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0lsbGVnYWwobGV4ZW0sIG1vZGUpIHtcbiAgICAgIHJldHVybiBtb2RlLmlsbGVnYWwgJiYgbW9kZS5pbGxlZ2FsUmUudGVzdChsZXhlbSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24ga2V5d29yZE1hdGNoKG1vZGUsIG1hdGNoKSB7XG4gICAgICB2YXIgbWF0Y2hfc3RyID0gbGFuZ3VhZ2UuY2FzZV9pbnNlbnNpdGl2ZSA/IG1hdGNoWzBdLnRvTG93ZXJDYXNlKCkgOiBtYXRjaFswXTtcbiAgICAgIHJldHVybiBtb2RlLmtleXdvcmRzLmhhc093blByb3BlcnR5KG1hdGNoX3N0cikgJiYgbW9kZS5rZXl3b3Jkc1ttYXRjaF9zdHJdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NLZXl3b3JkcygpIHtcbiAgICAgIHZhciBidWZmZXIgPSBlc2NhcGUobW9kZV9idWZmZXIpO1xuICAgICAgaWYgKCF0b3Aua2V5d29yZHMpXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgICB2YXIgbGFzdF9pbmRleCA9IDA7XG4gICAgICB0b3AubGV4ZW1zUmUubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBtYXRjaCA9IHRvcC5sZXhlbXNSZS5leGVjKGJ1ZmZlcik7XG4gICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgcmVzdWx0ICs9IGJ1ZmZlci5zdWJzdHIobGFzdF9pbmRleCwgbWF0Y2guaW5kZXggLSBsYXN0X2luZGV4KTtcbiAgICAgICAgdmFyIGtleXdvcmRfbWF0Y2ggPSBrZXl3b3JkTWF0Y2godG9wLCBtYXRjaCk7XG4gICAgICAgIGlmIChrZXl3b3JkX21hdGNoKSB7XG4gICAgICAgICAga2V5d29yZF9jb3VudCArPSBrZXl3b3JkX21hdGNoWzFdO1xuICAgICAgICAgIHJlc3VsdCArPSAnPHNwYW4gY2xhc3M9XCInKyBrZXl3b3JkX21hdGNoWzBdICsnXCI+JyArIG1hdGNoWzBdICsgJzwvc3Bhbj4nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCArPSBtYXRjaFswXTtcbiAgICAgICAgfVxuICAgICAgICBsYXN0X2luZGV4ID0gdG9wLmxleGVtc1JlLmxhc3RJbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AubGV4ZW1zUmUuZXhlYyhidWZmZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdCArIGJ1ZmZlci5zdWJzdHIobGFzdF9pbmRleCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc1N1Ykxhbmd1YWdlKCkge1xuICAgICAgaWYgKHRvcC5zdWJMYW5ndWFnZSAmJiAhbGFuZ3VhZ2VzW3RvcC5zdWJMYW5ndWFnZV0pIHtcbiAgICAgICAgcmV0dXJuIGVzY2FwZShtb2RlX2J1ZmZlcik7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0ID0gdG9wLnN1Ykxhbmd1YWdlID8gaGlnaGxpZ2h0KHRvcC5zdWJMYW5ndWFnZSwgbW9kZV9idWZmZXIpIDogaGlnaGxpZ2h0QXV0byhtb2RlX2J1ZmZlcik7XG4gICAgICAvLyBDb3VudGluZyBlbWJlZGRlZCBsYW5ndWFnZSBzY29yZSB0b3dhcmRzIHRoZSBob3N0IGxhbmd1YWdlIG1heSBiZSBkaXNhYmxlZFxuICAgICAgLy8gd2l0aCB6ZXJvaW5nIHRoZSBjb250YWluaW5nIG1vZGUgcmVsZXZhbmNlLiBVc2VjYXNlIGluIHBvaW50IGlzIE1hcmtkb3duIHRoYXRcbiAgICAgIC8vIGFsbG93cyBYTUwgZXZlcnl3aGVyZSBhbmQgbWFrZXMgZXZlcnkgWE1MIHNuaXBwZXQgdG8gaGF2ZSBhIG11Y2ggbGFyZ2VyIE1hcmtkb3duXG4gICAgICAvLyBzY29yZS5cbiAgICAgIGlmICh0b3AucmVsZXZhbmNlID4gMCkge1xuICAgICAgICBrZXl3b3JkX2NvdW50ICs9IHJlc3VsdC5rZXl3b3JkX2NvdW50O1xuICAgICAgICByZWxldmFuY2UgKz0gcmVzdWx0LnJlbGV2YW5jZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgcmVzdWx0Lmxhbmd1YWdlICArICdcIj4nICsgcmVzdWx0LnZhbHVlICsgJzwvc3Bhbj4nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NCdWZmZXIoKSB7XG4gICAgICByZXR1cm4gdG9wLnN1Ykxhbmd1YWdlICE9PSB1bmRlZmluZWQgPyBwcm9jZXNzU3ViTGFuZ3VhZ2UoKSA6IHByb2Nlc3NLZXl3b3JkcygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0YXJ0TmV3TW9kZShtb2RlLCBsZXhlbSkge1xuICAgICAgdmFyIG1hcmt1cCA9IG1vZGUuY2xhc3NOYW1lPyAnPHNwYW4gY2xhc3M9XCInICsgbW9kZS5jbGFzc05hbWUgKyAnXCI+JzogJyc7XG4gICAgICBpZiAobW9kZS5yZXR1cm5CZWdpbikge1xuICAgICAgICByZXN1bHQgKz0gbWFya3VwO1xuICAgICAgICBtb2RlX2J1ZmZlciA9ICcnO1xuICAgICAgfSBlbHNlIGlmIChtb2RlLmV4Y2x1ZGVCZWdpbikge1xuICAgICAgICByZXN1bHQgKz0gZXNjYXBlKGxleGVtKSArIG1hcmt1cDtcbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCArPSBtYXJrdXA7XG4gICAgICAgIG1vZGVfYnVmZmVyID0gbGV4ZW07XG4gICAgICB9XG4gICAgICB0b3AgPSBPYmplY3QuY3JlYXRlKG1vZGUsIHtwYXJlbnQ6IHt2YWx1ZTogdG9wfX0pO1xuICAgICAgcmVsZXZhbmNlICs9IG1vZGUucmVsZXZhbmNlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByb2Nlc3NMZXhlbShidWZmZXIsIGxleGVtKSB7XG4gICAgICBtb2RlX2J1ZmZlciArPSBidWZmZXI7XG4gICAgICBpZiAobGV4ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld19tb2RlID0gc3ViTW9kZShsZXhlbSwgdG9wKTtcbiAgICAgIGlmIChuZXdfbW9kZSkge1xuICAgICAgICByZXN1bHQgKz0gcHJvY2Vzc0J1ZmZlcigpO1xuICAgICAgICBzdGFydE5ld01vZGUobmV3X21vZGUsIGxleGVtKTtcbiAgICAgICAgcmV0dXJuIG5ld19tb2RlLnJldHVybkJlZ2luID8gMCA6IGxleGVtLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgdmFyIGVuZF9tb2RlID0gZW5kT2ZNb2RlKHRvcCwgbGV4ZW0pO1xuICAgICAgaWYgKGVuZF9tb2RlKSB7XG4gICAgICAgIGlmICghKGVuZF9tb2RlLnJldHVybkVuZCB8fCBlbmRfbW9kZS5leGNsdWRlRW5kKSkge1xuICAgICAgICAgIG1vZGVfYnVmZmVyICs9IGxleGVtO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCArPSBwcm9jZXNzQnVmZmVyKCk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBpZiAodG9wLmNsYXNzTmFtZSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9ICc8L3NwYW4+JztcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9wID0gdG9wLnBhcmVudDtcbiAgICAgICAgfSB3aGlsZSAodG9wICE9IGVuZF9tb2RlLnBhcmVudCk7XG4gICAgICAgIGlmIChlbmRfbW9kZS5leGNsdWRlRW5kKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IGVzY2FwZShsZXhlbSk7XG4gICAgICAgIH1cbiAgICAgICAgbW9kZV9idWZmZXIgPSAnJztcbiAgICAgICAgaWYgKGVuZF9tb2RlLnN0YXJ0cykge1xuICAgICAgICAgIHN0YXJ0TmV3TW9kZShlbmRfbW9kZS5zdGFydHMsICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZW5kX21vZGUucmV0dXJuRW5kID8gMCA6IGxleGVtLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzSWxsZWdhbChsZXhlbSwgdG9wKSlcbiAgICAgICAgdGhyb3cgJ0lsbGVnYWwnO1xuXG4gICAgICAvKlxuICAgICAgUGFyc2VyIHNob3VsZCBub3QgcmVhY2ggdGhpcyBwb2ludCBhcyBhbGwgdHlwZXMgb2YgbGV4ZW1zIHNob3VsZCBiZSBjYXVnaHRcbiAgICAgIGVhcmxpZXIsIGJ1dCBpZiBpdCBkb2VzIGR1ZSB0byBzb21lIGJ1ZyBtYWtlIHN1cmUgaXQgYWR2YW5jZXMgYXQgbGVhc3Qgb25lXG4gICAgICBjaGFyYWN0ZXIgZm9yd2FyZCB0byBwcmV2ZW50IGluZmluaXRlIGxvb3BpbmcuXG4gICAgICAqL1xuICAgICAgbW9kZV9idWZmZXIgKz0gbGV4ZW07XG4gICAgICByZXR1cm4gbGV4ZW0ubGVuZ3RoIHx8IDE7XG4gICAgfVxuXG4gICAgdmFyIGxhbmd1YWdlID0gbGFuZ3VhZ2VzW2xhbmd1YWdlX25hbWVdO1xuICAgIGNvbXBpbGVMYW5ndWFnZShsYW5ndWFnZSk7XG4gICAgdmFyIHRvcCA9IGxhbmd1YWdlO1xuICAgIHZhciBtb2RlX2J1ZmZlciA9ICcnO1xuICAgIHZhciByZWxldmFuY2UgPSAwO1xuICAgIHZhciBrZXl3b3JkX2NvdW50ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gJyc7XG4gICAgdHJ5IHtcbiAgICAgIHZhciBtYXRjaCwgY291bnQsIGluZGV4ID0gMDtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRvcC50ZXJtaW5hdG9ycy5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgbWF0Y2ggPSB0b3AudGVybWluYXRvcnMuZXhlYyh2YWx1ZSk7XG4gICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNvdW50ID0gcHJvY2Vzc0xleGVtKHZhbHVlLnN1YnN0cihpbmRleCwgbWF0Y2guaW5kZXggLSBpbmRleCksIG1hdGNoWzBdKTtcbiAgICAgICAgaW5kZXggPSBtYXRjaC5pbmRleCArIGNvdW50O1xuICAgICAgfVxuICAgICAgcHJvY2Vzc0xleGVtKHZhbHVlLnN1YnN0cihpbmRleCkpXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWxldmFuY2U6IHJlbGV2YW5jZSxcbiAgICAgICAga2V5d29yZF9jb3VudDoga2V5d29yZF9jb3VudCxcbiAgICAgICAgdmFsdWU6IHJlc3VsdCxcbiAgICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlX25hbWVcbiAgICAgIH07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgPT0gJ0lsbGVnYWwnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgICAgIGtleXdvcmRfY291bnQ6IDAsXG4gICAgICAgICAgdmFsdWU6IGVzY2FwZSh2YWx1ZSlcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLypcbiAgSGlnaGxpZ2h0aW5nIHdpdGggbGFuZ3VhZ2UgZGV0ZWN0aW9uLiBBY2NlcHRzIGEgc3RyaW5nIHdpdGggdGhlIGNvZGUgdG9cbiAgaGlnaGxpZ2h0LiBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblxuICAtIGxhbmd1YWdlIChkZXRlY3RlZCBsYW5ndWFnZSlcbiAgLSByZWxldmFuY2UgKGludClcbiAgLSBrZXl3b3JkX2NvdW50IChpbnQpXG4gIC0gdmFsdWUgKGFuIEhUTUwgc3RyaW5nIHdpdGggaGlnaGxpZ2h0aW5nIG1hcmt1cClcbiAgLSBzZWNvbmRfYmVzdCAob2JqZWN0IHdpdGggdGhlIHNhbWUgc3RydWN0dXJlIGZvciBzZWNvbmQtYmVzdCBoZXVyaXN0aWNhbGx5XG4gICAgZGV0ZWN0ZWQgbGFuZ3VhZ2UsIG1heSBiZSBhYnNlbnQpXG5cbiAgKi9cbiAgZnVuY3Rpb24gaGlnaGxpZ2h0QXV0byh0ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgIGtleXdvcmRfY291bnQ6IDAsXG4gICAgICByZWxldmFuY2U6IDAsXG4gICAgICB2YWx1ZTogZXNjYXBlKHRleHQpXG4gICAgfTtcbiAgICB2YXIgc2Vjb25kX2Jlc3QgPSByZXN1bHQ7XG4gICAgZm9yICh2YXIga2V5IGluIGxhbmd1YWdlcykge1xuICAgICAgaWYgKCFsYW5ndWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgY29udGludWU7XG4gICAgICB2YXIgY3VycmVudCA9IGhpZ2hsaWdodChrZXksIHRleHQpO1xuICAgICAgY3VycmVudC5sYW5ndWFnZSA9IGtleTtcbiAgICAgIGlmIChjdXJyZW50LmtleXdvcmRfY291bnQgKyBjdXJyZW50LnJlbGV2YW5jZSA+IHNlY29uZF9iZXN0LmtleXdvcmRfY291bnQgKyBzZWNvbmRfYmVzdC5yZWxldmFuY2UpIHtcbiAgICAgICAgc2Vjb25kX2Jlc3QgPSBjdXJyZW50O1xuICAgICAgfVxuICAgICAgaWYgKGN1cnJlbnQua2V5d29yZF9jb3VudCArIGN1cnJlbnQucmVsZXZhbmNlID4gcmVzdWx0LmtleXdvcmRfY291bnQgKyByZXN1bHQucmVsZXZhbmNlKSB7XG4gICAgICAgIHNlY29uZF9iZXN0ID0gcmVzdWx0O1xuICAgICAgICByZXN1bHQgPSBjdXJyZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2Vjb25kX2Jlc3QubGFuZ3VhZ2UpIHtcbiAgICAgIHJlc3VsdC5zZWNvbmRfYmVzdCA9IHNlY29uZF9iZXN0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLypcbiAgUG9zdC1wcm9jZXNzaW5nIG9mIHRoZSBoaWdobGlnaHRlZCBtYXJrdXA6XG5cbiAgLSByZXBsYWNlIFRBQnMgd2l0aCBzb21ldGhpbmcgbW9yZSB1c2VmdWxcbiAgLSByZXBsYWNlIHJlYWwgbGluZS1icmVha3Mgd2l0aCAnPGJyPicgZm9yIG5vbi1wcmUgY29udGFpbmVyc1xuXG4gICovXG4gIGZ1bmN0aW9uIGZpeE1hcmt1cCh2YWx1ZSwgdGFiUmVwbGFjZSwgdXNlQlIpIHtcbiAgICBpZiAodGFiUmVwbGFjZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eKCg8W14+XSs+fFxcdCkrKS9nbSwgZnVuY3Rpb24obWF0Y2gsIHAxLCBvZmZzZXQsIHMpIHtcbiAgICAgICAgcmV0dXJuIHAxLnJlcGxhY2UoL1xcdC9nLCB0YWJSZXBsYWNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodXNlQlIpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxuL2csICc8YnI+Jyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qXG4gIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGEgRE9NIG5vZGUgY29udGFpbmluZyBjb2RlLiBBY2NlcHRzIGEgRE9NIG5vZGUgYW5kXG4gIHR3byBvcHRpb25hbCBwYXJhbWV0ZXJzIGZvciBmaXhNYXJrdXAuXG4gICovXG4gIGZ1bmN0aW9uIGhpZ2hsaWdodEJsb2NrKGJsb2NrLCB0YWJSZXBsYWNlLCB1c2VCUikge1xuICAgIHZhciB0ZXh0ID0gYmxvY2tUZXh0KGJsb2NrLCB1c2VCUik7XG4gICAgdmFyIGxhbmd1YWdlID0gYmxvY2tMYW5ndWFnZShibG9jayk7XG4gICAgaWYgKGxhbmd1YWdlID09ICduby1oaWdobGlnaHQnKVxuICAgICAgICByZXR1cm47XG4gICAgdmFyIHJlc3VsdCA9IGxhbmd1YWdlID8gaGlnaGxpZ2h0KGxhbmd1YWdlLCB0ZXh0KSA6IGhpZ2hsaWdodEF1dG8odGV4dCk7XG4gICAgbGFuZ3VhZ2UgPSByZXN1bHQubGFuZ3VhZ2U7XG4gICAgdmFyIG9yaWdpbmFsID0gbm9kZVN0cmVhbShibG9jayk7XG4gICAgaWYgKG9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgdmFyIHByZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ByZScpO1xuICAgICAgcHJlLmlubmVySFRNTCA9IHJlc3VsdC52YWx1ZTtcbiAgICAgIHJlc3VsdC52YWx1ZSA9IG1lcmdlU3RyZWFtcyhvcmlnaW5hbCwgbm9kZVN0cmVhbShwcmUpLCB0ZXh0KTtcbiAgICB9XG4gICAgcmVzdWx0LnZhbHVlID0gZml4TWFya3VwKHJlc3VsdC52YWx1ZSwgdGFiUmVwbGFjZSwgdXNlQlIpO1xuXG4gICAgdmFyIGNsYXNzX25hbWUgPSBibG9jay5jbGFzc05hbWU7XG4gICAgaWYgKCFjbGFzc19uYW1lLm1hdGNoKCcoXFxcXHN8XikobGFuZ3VhZ2UtKT8nICsgbGFuZ3VhZ2UgKyAnKFxcXFxzfCQpJykpIHtcbiAgICAgIGNsYXNzX25hbWUgPSBjbGFzc19uYW1lID8gKGNsYXNzX25hbWUgKyAnICcgKyBsYW5ndWFnZSkgOiBsYW5ndWFnZTtcbiAgICB9XG4gICAgYmxvY2suaW5uZXJIVE1MID0gcmVzdWx0LnZhbHVlO1xuICAgIGJsb2NrLmNsYXNzTmFtZSA9IGNsYXNzX25hbWU7XG4gICAgYmxvY2sucmVzdWx0ID0ge1xuICAgICAgbGFuZ3VhZ2U6IGxhbmd1YWdlLFxuICAgICAga3c6IHJlc3VsdC5rZXl3b3JkX2NvdW50LFxuICAgICAgcmU6IHJlc3VsdC5yZWxldmFuY2VcbiAgICB9O1xuICAgIGlmIChyZXN1bHQuc2Vjb25kX2Jlc3QpIHtcbiAgICAgIGJsb2NrLnNlY29uZF9iZXN0ID0ge1xuICAgICAgICBsYW5ndWFnZTogcmVzdWx0LnNlY29uZF9iZXN0Lmxhbmd1YWdlLFxuICAgICAgICBrdzogcmVzdWx0LnNlY29uZF9iZXN0LmtleXdvcmRfY291bnQsXG4gICAgICAgIHJlOiByZXN1bHQuc2Vjb25kX2Jlc3QucmVsZXZhbmNlXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gIEFwcGxpZXMgaGlnaGxpZ2h0aW5nIHRvIGFsbCA8cHJlPjxjb2RlPi4uPC9jb2RlPjwvcHJlPiBibG9ja3Mgb24gYSBwYWdlLlxuICAqL1xuICBmdW5jdGlvbiBpbml0SGlnaGxpZ2h0aW5nKCkge1xuICAgIGlmIChpbml0SGlnaGxpZ2h0aW5nLmNhbGxlZClcbiAgICAgIHJldHVybjtcbiAgICBpbml0SGlnaGxpZ2h0aW5nLmNhbGxlZCA9IHRydWU7XG4gICAgQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwcmUnKSwgZmluZENvZGUpLlxuICAgICAgZmlsdGVyKEJvb2xlYW4pLlxuICAgICAgZm9yRWFjaChmdW5jdGlvbihjb2RlKXtoaWdobGlnaHRCbG9jayhjb2RlLCBobGpzLnRhYlJlcGxhY2UpfSk7XG4gIH1cblxuICAvKlxuICBBdHRhY2hlcyBoaWdobGlnaHRpbmcgdG8gdGhlIHBhZ2UgbG9hZCBldmVudC5cbiAgKi9cbiAgZnVuY3Rpb24gaW5pdEhpZ2hsaWdodGluZ09uTG9hZCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXRIaWdobGlnaHRpbmcsIGZhbHNlKTtcbiAgfVxuXG4gIHZhciBsYW5ndWFnZXMgPSB7fTsgLy8gYSBzaG9ydGN1dCB0byBhdm9pZCB3cml0aW5nIFwidGhpcy5cIiBldmVyeXdoZXJlXG5cbiAgLyogSW50ZXJmYWNlIGRlZmluaXRpb24gKi9cblxuICB0aGlzLkxBTkdVQUdFUyA9IGxhbmd1YWdlcztcbiAgdGhpcy5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gIHRoaXMuaGlnaGxpZ2h0QXV0byA9IGhpZ2hsaWdodEF1dG87XG4gIHRoaXMuZml4TWFya3VwID0gZml4TWFya3VwO1xuICB0aGlzLmhpZ2hsaWdodEJsb2NrID0gaGlnaGxpZ2h0QmxvY2s7XG4gIHRoaXMuaW5pdEhpZ2hsaWdodGluZyA9IGluaXRIaWdobGlnaHRpbmc7XG4gIHRoaXMuaW5pdEhpZ2hsaWdodGluZ09uTG9hZCA9IGluaXRIaWdobGlnaHRpbmdPbkxvYWQ7XG5cbiAgLy8gQ29tbW9uIHJlZ2V4cHNcbiAgdGhpcy5JREVOVF9SRSA9ICdbYS16QS1aXVthLXpBLVowLTlfXSonO1xuICB0aGlzLlVOREVSU0NPUkVfSURFTlRfUkUgPSAnW2EtekEtWl9dW2EtekEtWjAtOV9dKic7XG4gIHRoaXMuTlVNQkVSX1JFID0gJ1xcXFxiXFxcXGQrKFxcXFwuXFxcXGQrKT8nO1xuICB0aGlzLkNfTlVNQkVSX1JFID0gJyhcXFxcYjBbeFhdW2EtZkEtRjAtOV0rfChcXFxcYlxcXFxkKyhcXFxcLlxcXFxkKik/fFxcXFwuXFxcXGQrKShbZUVdWy0rXT9cXFxcZCspPyknOyAvLyAweC4uLiwgMC4uLiwgZGVjaW1hbCwgZmxvYXRcbiAgdGhpcy5CSU5BUllfTlVNQkVSX1JFID0gJ1xcXFxiKDBiWzAxXSspJzsgLy8gMGIuLi5cbiAgdGhpcy5SRV9TVEFSVEVSU19SRSA9ICchfCE9fCE9PXwlfCU9fCZ8JiZ8Jj18XFxcXCp8XFxcXCo9fFxcXFwrfFxcXFwrPXwsfFxcXFwufC18LT18L3wvPXw6fDt8PHw8PHw8PD18PD18PXw9PXw9PT18Pnw+PXw+Pnw+Pj18Pj4+fD4+Pj18XFxcXD98XFxcXFt8XFxcXHt8XFxcXCh8XFxcXF58XFxcXF49fFxcXFx8fFxcXFx8PXxcXFxcfFxcXFx8fH4nO1xuXG4gIC8vIENvbW1vbiBtb2Rlc1xuICB0aGlzLkJBQ0tTTEFTSF9FU0NBUEUgPSB7XG4gICAgYmVnaW46ICdcXFxcXFxcXFtcXFxcc1xcXFxTXScsIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkFQT1NfU1RSSU5HX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgaWxsZWdhbDogJ1xcXFxuJyxcbiAgICBjb250YWluczogW3RoaXMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuUVVPVEVfU1RSSU5HX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgY29udGFpbnM6IFt0aGlzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgIHJlbGV2YW5jZTogMFxuICB9O1xuICB0aGlzLkNfTElORV9DT01NRU5UX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICcvLycsIGVuZDogJyQnXG4gIH07XG4gIHRoaXMuQ19CTE9DS19DT01NRU5UX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICcvXFxcXConLCBlbmQ6ICdcXFxcKi8nXG4gIH07XG4gIHRoaXMuSEFTSF9DT01NRU5UX01PREUgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgYmVnaW46ICcjJywgZW5kOiAnJCdcbiAgfTtcbiAgdGhpcy5OVU1CRVJfTU9ERSA9IHtcbiAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgIGJlZ2luOiB0aGlzLk5VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcbiAgdGhpcy5DX05VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IHRoaXMuQ19OVU1CRVJfUkUsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHRoaXMuQklOQVJZX05VTUJFUl9NT0RFID0ge1xuICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgYmVnaW46IHRoaXMuQklOQVJZX05VTUJFUl9SRSxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICAvLyBVdGlsaXR5IGZ1bmN0aW9uc1xuICB0aGlzLmluaGVyaXQgPSBmdW5jdGlvbihwYXJlbnQsIG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fVxuICAgIGZvciAodmFyIGtleSBpbiBwYXJlbnQpXG4gICAgICByZXN1bHRba2V5XSA9IHBhcmVudFtrZXldO1xuICAgIGlmIChvYmopXG4gICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKVxuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0oKTtcbmhsanMuTEFOR1VBR0VTWydiYXNoJ10gPSByZXF1aXJlKCcuL2Jhc2guanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydlcmxhbmcnXSA9IHJlcXVpcmUoJy4vZXJsYW5nLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY3MnXSA9IHJlcXVpcmUoJy4vY3MuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydicmFpbmZ1Y2snXSA9IHJlcXVpcmUoJy4vYnJhaW5mdWNrLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncnVieSddID0gcmVxdWlyZSgnLi9ydWJ5LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncnVzdCddID0gcmVxdWlyZSgnLi9ydXN0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sncmliJ10gPSByZXF1aXJlKCcuL3JpYi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2RpZmYnXSA9IHJlcXVpcmUoJy4vZGlmZi5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2phdmFzY3JpcHQnXSA9IHJlcXVpcmUoJy4vamF2YXNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2dsc2wnXSA9IHJlcXVpcmUoJy4vZ2xzbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3JzbCddID0gcmVxdWlyZSgnLi9yc2wuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydsdWEnXSA9IHJlcXVpcmUoJy4vbHVhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sneG1sJ10gPSByZXF1aXJlKCcuL3htbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ21hcmtkb3duJ10gPSByZXF1aXJlKCcuL21hcmtkb3duLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY3NzJ10gPSByZXF1aXJlKCcuL2Nzcy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2xpc3AnXSA9IHJlcXVpcmUoJy4vbGlzcC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3Byb2ZpbGUnXSA9IHJlcXVpcmUoJy4vcHJvZmlsZS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2h0dHAnXSA9IHJlcXVpcmUoJy4vaHR0cC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2phdmEnXSA9IHJlcXVpcmUoJy4vamF2YS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3BocCddID0gcmVxdWlyZSgnLi9waHAuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydoYXNrZWxsJ10gPSByZXF1aXJlKCcuL2hhc2tlbGwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWycxYyddID0gcmVxdWlyZSgnLi8xYy5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3B5dGhvbiddID0gcmVxdWlyZSgnLi9weXRob24uanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydzbWFsbHRhbGsnXSA9IHJlcXVpcmUoJy4vc21hbGx0YWxrLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sndGV4J10gPSByZXF1aXJlKCcuL3RleC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2FjdGlvbnNjcmlwdCddID0gcmVxdWlyZSgnLi9hY3Rpb25zY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydzcWwnXSA9IHJlcXVpcmUoJy4vc3FsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1sndmFsYSddID0gcmVxdWlyZSgnLi92YWxhLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snaW5pJ10gPSByZXF1aXJlKCcuL2luaS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2QnXSA9IHJlcXVpcmUoJy4vZC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2F4YXB0YSddID0gcmVxdWlyZSgnLi9heGFwdGEuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydwZXJsJ10gPSByZXF1aXJlKCcuL3BlcmwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydzY2FsYSddID0gcmVxdWlyZSgnLi9zY2FsYS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NtYWtlJ10gPSByZXF1aXJlKCcuL2NtYWtlLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snb2JqZWN0aXZlYyddID0gcmVxdWlyZSgnLi9vYmplY3RpdmVjLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYXZyYXNtJ10gPSByZXF1aXJlKCcuL2F2cmFzbS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ3ZoZGwnXSA9IHJlcXVpcmUoJy4vdmhkbC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2NvZmZlZXNjcmlwdCddID0gcmVxdWlyZSgnLi9jb2ZmZWVzY3JpcHQuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyduZ2lueCddID0gcmVxdWlyZSgnLi9uZ2lueC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2VybGFuZy1yZXBsJ10gPSByZXF1aXJlKCcuL2VybGFuZy1yZXBsLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snciddID0gcmVxdWlyZSgnLi9yLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snanNvbiddID0gcmVxdWlyZSgnLi9qc29uLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snZGphbmdvJ10gPSByZXF1aXJlKCcuL2RqYW5nby5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2RlbHBoaSddID0gcmVxdWlyZSgnLi9kZWxwaGkuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWyd2YnNjcmlwdCddID0gcmVxdWlyZSgnLi92YnNjcmlwdC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ21lbCddID0gcmVxdWlyZSgnLi9tZWwuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydkb3MnXSA9IHJlcXVpcmUoJy4vZG9zLmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snYXBhY2hlJ10gPSByZXF1aXJlKCcuL2FwYWNoZS5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ2FwcGxlc2NyaXB0J10gPSByZXF1aXJlKCcuL2FwcGxlc2NyaXB0LmpzJykoaGxqcyk7XG5obGpzLkxBTkdVQUdFU1snY3BwJ10gPSByZXF1aXJlKCcuL2NwcC5qcycpKGhsanMpO1xuaGxqcy5MQU5HVUFHRVNbJ21hdGxhYiddID0gcmVxdWlyZSgnLi9tYXRsYWIuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydwYXJzZXIzJ10gPSByZXF1aXJlKCcuL3BhcnNlcjMuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydjbG9qdXJlJ10gPSByZXF1aXJlKCcuL2Nsb2p1cmUuanMnKShobGpzKTtcbmhsanMuTEFOR1VBR0VTWydnbyddID0gcmVxdWlyZSgnLi9nby5qcycpKGhsanMpO1xubW9kdWxlLmV4cG9ydHMgPSBobGpzOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGlsbGVnYWw6ICdcXFxcUycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3RhdHVzJyxcbiAgICAgICAgYmVnaW46ICdeSFRUUC9bMC05XFxcXC5dKycsIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW3tjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJ1xcXFxiXFxcXGR7M31cXFxcYid9XVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncmVxdWVzdCcsXG4gICAgICAgIGJlZ2luOiAnXltBLVpdKyAoLio/KSBIVFRQL1swLTlcXFxcLl0rJCcsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICcgJywgZW5kOiAnICcsXG4gICAgICAgICAgICBleGNsdWRlQmVnaW46IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2F0dHJpYnV0ZScsXG4gICAgICAgIGJlZ2luOiAnXlxcXFx3JywgZW5kOiAnOiAnLCBleGNsdWRlRW5kOiB0cnVlLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG58XFxcXHN8PScsXG4gICAgICAgIHN0YXJ0czoge2NsYXNzTmFtZTogJ3N0cmluZycsIGVuZDogJyQnfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICdcXFxcblxcXFxuJyxcbiAgICAgICAgc3RhcnRzOiB7c3ViTGFuZ3VhZ2U6ICcnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZX1cbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNhc2VfaW5zZW5zaXRpdmU6IHRydWUsXG4gICAgaWxsZWdhbDogJ1teXFxcXHNdJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICc7JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdeXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NldHRpbmcnLFxuICAgICAgICBiZWdpbjogJ15bYS16MC05XFxcXFtcXFxcXV8tXStbIFxcXFx0XSo9WyBcXFxcdF0qJywgZW5kOiAnJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ29uIG9mZiB0cnVlIGZhbHNlIHllcyBubycsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuUVVPVEVfU1RSSU5HX01PREUsIGhsanMuTlVNQkVSX01PREVdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdmYWxzZSBzeW5jaHJvbml6ZWQgaW50IGFic3RyYWN0IGZsb2F0IHByaXZhdGUgY2hhciBib29sZWFuIHN0YXRpYyBudWxsIGlmIGNvbnN0ICcgK1xuICAgICAgJ2ZvciB0cnVlIHdoaWxlIGxvbmcgdGhyb3cgc3RyaWN0ZnAgZmluYWxseSBwcm90ZWN0ZWQgaW1wb3J0IG5hdGl2ZSBmaW5hbCByZXR1cm4gdm9pZCAnICtcbiAgICAgICdlbnVtIGVsc2UgYnJlYWsgdHJhbnNpZW50IG5ldyBjYXRjaCBpbnN0YW5jZW9mIGJ5dGUgc3VwZXIgdm9sYXRpbGUgY2FzZSBhc3NlcnQgc2hvcnQgJyArXG4gICAgICAncGFja2FnZSBkZWZhdWx0IGRvdWJsZSBwdWJsaWMgdHJ5IHRoaXMgc3dpdGNoIGNvbnRpbnVlIHRocm93cycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnamF2YWRvYycsXG4gICAgICAgIGJlZ2luOiAnL1xcXFwqXFxcXConLCBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICdqYXZhZG9jdGFnJywgYmVnaW46ICdAW0EtWmEtel0rJ1xuICAgICAgICB9XSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZScsXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLFxuICAgICAgICAgICAga2V5d29yZHM6ICdleHRlbmRzIGltcGxlbWVudHMnLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYW5ub3RhdGlvbicsIGJlZ2luOiAnQFtBLVphLXpdKydcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnaW4gaWYgZm9yIHdoaWxlIGZpbmFsbHkgdmFyIG5ldyBmdW5jdGlvbiBkbyByZXR1cm4gdm9pZCBlbHNlIGJyZWFrIGNhdGNoICcgK1xuICAgICAgICAnaW5zdGFuY2VvZiB3aXRoIHRocm93IGNhc2UgZGVmYXVsdCB0cnkgdGhpcyBzd2l0Y2ggY29udGludWUgdHlwZW9mIGRlbGV0ZSAnICtcbiAgICAgICAgJ2xldCB5aWVsZCBjb25zdCcsXG4gICAgICBsaXRlcmFsOlxuICAgICAgICAndHJ1ZSBmYWxzZSBudWxsIHVuZGVmaW5lZCBOYU4gSW5maW5pdHknXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7IC8vIFwidmFsdWVcIiBjb250YWluZXJcbiAgICAgICAgYmVnaW46ICcoJyArIGhsanMuUkVfU1RBUlRFUlNfUkUgKyAnfFxcXFxiKGNhc2V8cmV0dXJufHRocm93KVxcXFxiKVxcXFxzKicsXG4gICAgICAgIGtleXdvcmRzOiAncmV0dXJuIHRocm93IGNhc2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIGhsanMuQ19MSU5FX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgICBiZWdpbjogJy8nLCBlbmQ6ICcvW2dpbV0qJyxcbiAgICAgICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgICAgICBjb250YWluczogW3tiZWdpbjogJ1xcXFxcXFxcLyd9XVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyAvLyBFNFhcbiAgICAgICAgICAgIGJlZ2luOiAnPCcsIGVuZDogJz47JyxcbiAgICAgICAgICAgIHN1Ykxhbmd1YWdlOiAneG1sJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsIGJlZ2luOiAnW0EtWmEteiRfXVswLTlBLVphLXokX10qJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICAgICAgICAgIGhsanMuQ19CTE9DS19DT01NRU5UX01PREVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBpbGxlZ2FsOiAnW1wiXFwnXFxcXChdJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgaWxsZWdhbDogJ1xcXFxbfCUnXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIExJVEVSQUxTID0ge2xpdGVyYWw6ICd0cnVlIGZhbHNlIG51bGwnfTtcbiAgdmFyIFRZUEVTID0gW1xuICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gIF07XG4gIHZhciBWQUxVRV9DT05UQUlORVIgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgIGVuZDogJywnLCBlbmRzV2l0aFBhcmVudDogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTXG4gIH07XG4gIHZhciBPQkpFQ1QgPSB7XG4gICAgYmVnaW46ICd7JywgZW5kOiAnfScsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46ICdcXFxccypcIicsIGVuZDogJ1wiXFxcXHMqOlxcXFxzKicsIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXG4nLFxuICAgICAgICBzdGFydHM6IFZBTFVFX0NPTlRBSU5FUlxuICAgICAgfVxuICAgIF0sXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xuICB2YXIgQVJSQVkgPSB7XG4gICAgYmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICBjb250YWluczogW2hsanMuaW5oZXJpdChWQUxVRV9DT05UQUlORVIsIHtjbGFzc05hbWU6IG51bGx9KV0sIC8vIGluaGVyaXQgaXMgYWxzbyBhIHdvcmthcm91bmQgZm9yIGEgYnVnIHRoYXQgbWFrZXMgc2hhcmVkIG1vZGVzIHdpdGggZW5kc1dpdGhQYXJlbnQgY29tcGlsZSBvbmx5IHRoZSBlbmRpbmcgb2Ygb25lIG9mIHRoZSBwYXJlbnRzXG4gICAgaWxsZWdhbDogJ1xcXFxTJ1xuICB9O1xuICBUWVBFUy5zcGxpY2UoVFlQRVMubGVuZ3RoLCAwLCBPQkpFQ1QsIEFSUkFZKTtcbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogVFlQRVMsXG4gICAga2V5d29yZHM6IExJVEVSQUxTLFxuICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBMSVNQX0lERU5UX1JFID0gJ1thLXpBLVpfXFxcXC1cXFxcK1xcXFwqXFxcXC9cXFxcPFxcXFw9XFxcXD5cXFxcJlxcXFwjXVthLXpBLVowLTlfXFxcXC1cXFxcK1xcXFwqXFxcXC9cXFxcPFxcXFw9XFxcXD5cXFxcJlxcXFwjXSonO1xuICB2YXIgTElTUF9TSU1QTEVfTlVNQkVSX1JFID0gJyhcXFxcLXxcXFxcKyk/XFxcXGQrKFxcXFwuXFxcXGQrfFxcXFwvXFxcXGQrKT8oKGR8ZXxmfGx8cykoXFxcXCt8XFxcXC0pP1xcXFxkKyk/JztcbiAgdmFyIExJVEVSQUwgPSB7XG4gICAgY2xhc3NOYW1lOiAnbGl0ZXJhbCcsXG4gICAgYmVnaW46ICdcXFxcYih0ezF9fG5pbClcXFxcYidcbiAgfTtcbiAgdmFyIE5VTUJFUlMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46IExJU1BfU0lNUExFX05VTUJFUl9SRVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICcjYlswLTFdKygvWzAtMV0rKT8nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLCBiZWdpbjogJyNvWzAtN10rKC9bMC03XSspPydcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsIGJlZ2luOiAnI3hbMC05YS1mXSsoL1swLTlhLWZdKyk/J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJywgYmVnaW46ICcjY1xcXFwoJyArIExJU1BfU0lNUExFX05VTUJFUl9SRSArICcgKycgKyBMSVNQX1NJTVBMRV9OVU1CRVJfUkUsIGVuZDogJ1xcXFwpJ1xuICAgIH1cbiAgXVxuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnOycsIGVuZDogJyQnXG4gIH07XG4gIHZhciBWQVJJQUJMRSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdcXFxcKicsIGVuZDogJ1xcXFwqJ1xuICB9O1xuICB2YXIgS0VZV09SRCA9IHtcbiAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICBiZWdpbjogJ1s6Jl0nICsgTElTUF9JREVOVF9SRVxuICB9O1xuICB2YXIgUVVPVEVEX0xJU1QgPSB7XG4gICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICBjb250YWluczogWydzZWxmJywgTElURVJBTCwgU1RSSU5HXS5jb25jYXQoTlVNQkVSUylcbiAgfTtcbiAgdmFyIFFVT1RFRDEgPSB7XG4gICAgY2xhc3NOYW1lOiAncXVvdGVkJyxcbiAgICBiZWdpbjogJ1tcXCdgXVxcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBOVU1CRVJTLmNvbmNhdChbU1RSSU5HLCBWQVJJQUJMRSwgS0VZV09SRCwgUVVPVEVEX0xJU1RdKVxuICB9O1xuICB2YXIgUVVPVEVEMiA9IHtcbiAgICBjbGFzc05hbWU6ICdxdW90ZWQnLFxuICAgIGJlZ2luOiAnXFxcXChxdW90ZSAnLCBlbmQ6ICdcXFxcKScsXG4gICAga2V5d29yZHM6IHt0aXRsZTogJ3F1b3RlJ30sXG4gICAgY29udGFpbnM6IE5VTUJFUlMuY29uY2F0KFtTVFJJTkcsIFZBUklBQkxFLCBLRVlXT1JELCBRVU9URURfTElTVF0pXG4gIH07XG4gIHZhciBMSVNUID0ge1xuICAgIGNsYXNzTmFtZTogJ2xpc3QnLFxuICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKSdcbiAgfTtcbiAgdmFyIEJPRFkgPSB7XG4gICAgY2xhc3NOYW1lOiAnYm9keScsXG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsIGV4Y2x1ZGVFbmQ6IHRydWVcbiAgfTtcbiAgTElTVC5jb250YWlucyA9IFt7Y2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogTElTUF9JREVOVF9SRX0sIEJPRFldO1xuICBCT0RZLmNvbnRhaW5zID0gW1FVT1RFRDEsIFFVT1RFRDIsIExJU1QsIExJVEVSQUxdLmNvbmNhdChOVU1CRVJTKS5jb25jYXQoW1NUUklORywgQ09NTUVOVCwgVkFSSUFCTEUsIEtFWVdPUkRdKTtcblxuICByZXR1cm4ge1xuICAgIGlsbGVnYWw6ICdbXlxcXFxzXScsXG4gICAgY29udGFpbnM6IE5VTUJFUlMuY29uY2F0KFtcbiAgICAgIExJVEVSQUwsXG4gICAgICBTVFJJTkcsXG4gICAgICBDT01NRU5ULFxuICAgICAgUVVPVEVEMSwgUVVPVEVEMixcbiAgICAgIExJU1RcbiAgICBdKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIE9QRU5JTkdfTE9OR19CUkFDS0VUID0gJ1xcXFxbPSpcXFxcWyc7XG4gIHZhciBDTE9TSU5HX0xPTkdfQlJBQ0tFVCA9ICdcXFxcXT0qXFxcXF0nO1xuICB2YXIgTE9OR19CUkFDS0VUUyA9IHtcbiAgICBiZWdpbjogT1BFTklOR19MT05HX0JSQUNLRVQsIGVuZDogQ0xPU0lOR19MT05HX0JSQUNLRVQsXG4gICAgY29udGFpbnM6IFsnc2VsZiddXG4gIH07XG4gIHZhciBDT01NRU5UUyA9IFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnLS0oPyEnICsgT1BFTklOR19MT05HX0JSQUNLRVQgKyAnKScsIGVuZDogJyQnXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnLS0nICsgT1BFTklOR19MT05HX0JSQUNLRVQsIGVuZDogQ0xPU0lOR19MT05HX0JSQUNLRVQsXG4gICAgICBjb250YWluczogW0xPTkdfQlJBQ0tFVFNdLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH1cbiAgXVxuICByZXR1cm4ge1xuICAgIGxleGVtczogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYW5kIGJyZWFrIGRvIGVsc2UgZWxzZWlmIGVuZCBmYWxzZSBmb3IgaWYgaW4gbG9jYWwgbmlsIG5vdCBvciByZXBlYXQgcmV0dXJuIHRoZW4gJyArXG4gICAgICAgICd0cnVlIHVudGlsIHdoaWxlJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnX0cgX1ZFUlNJT04gYXNzZXJ0IGNvbGxlY3RnYXJiYWdlIGRvZmlsZSBlcnJvciBnZXRmZW52IGdldG1ldGF0YWJsZSBpcGFpcnMgbG9hZCAnICtcbiAgICAgICAgJ2xvYWRmaWxlIGxvYWRzdHJpbmcgbW9kdWxlIG5leHQgcGFpcnMgcGNhbGwgcHJpbnQgcmF3ZXF1YWwgcmF3Z2V0IHJhd3NldCByZXF1aXJlICcgK1xuICAgICAgICAnc2VsZWN0IHNldGZlbnYgc2V0bWV0YXRhYmxlIHRvbnVtYmVyIHRvc3RyaW5nIHR5cGUgdW5wYWNrIHhwY2FsbCBjb3JvdXRpbmUgZGVidWcgJyArXG4gICAgICAgICdpbyBtYXRoIG9zIHBhY2thZ2Ugc3RyaW5nIHRhYmxlJ1xuICAgIH0sXG4gICAgY29udGFpbnM6IENPTU1FTlRTLmNvbmNhdChbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAnXFxcXCknLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogJyhbX2EtekEtWl1cXFxcdypcXFxcLikqKFtfYS16QS1aXVxcXFx3KjopP1tfYS16QS1aXVxcXFx3KidcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBjb250YWluczogQ09NTUVOVFNcbiAgICAgICAgICB9XG4gICAgICAgIF0uY29uY2F0KENPTU1FTlRTKVxuICAgICAgfSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiBPUEVOSU5HX0xPTkdfQlJBQ0tFVCwgZW5kOiBDTE9TSU5HX0xPTkdfQlJBQ0tFVCxcbiAgICAgICAgY29udGFpbnM6IFtMT05HX0JSQUNLRVRTXSxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfVxuICAgIF0pXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICAvLyBoaWdobGlnaHQgaGVhZGVyc1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdoZWFkZXInLFxuICAgICAgICBiZWdpbjogJ14jezEsM30nLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICdeLis/XFxcXG5bPS1dezIsfSQnXG4gICAgICB9LFxuICAgICAgLy8gaW5saW5lIGh0bWxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46ICc8JywgZW5kOiAnPicsXG4gICAgICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gbGlzdHMgKGluZGljYXRvcnMgb25seSlcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYnVsbGV0JyxcbiAgICAgICAgYmVnaW46ICdeKFsqKy1dfChcXFxcZCtcXFxcLikpXFxcXHMrJ1xuICAgICAgfSxcbiAgICAgIC8vIHN0cm9uZyBzZWdtZW50c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJvbmcnLFxuICAgICAgICBiZWdpbjogJ1sqX117Mn0uKz9bKl9dezJ9J1xuICAgICAgfSxcbiAgICAgIC8vIGVtcGhhc2lzIHNlZ21lbnRzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2VtcGhhc2lzJyxcbiAgICAgICAgYmVnaW46ICdcXFxcKi4rP1xcXFwqJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZW1waGFzaXMnLFxuICAgICAgICBiZWdpbjogJ18uKz9fJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgLy8gYmxvY2txdW90ZXNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYmxvY2txdW90ZScsXG4gICAgICAgIGJlZ2luOiAnXj5cXFxccysnLCBlbmQ6ICckJ1xuICAgICAgfSxcbiAgICAgIC8vIGNvZGUgc25pcHBldHNcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29kZScsXG4gICAgICAgIGJlZ2luOiAnYC4rP2AnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb2RlJyxcbiAgICAgICAgYmVnaW46ICdeICAgICcsIGVuZDogJyQnLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICAvLyBob3Jpem9udGFsIHJ1bGVzXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2hvcml6b250YWxfcnVsZScsXG4gICAgICAgIGJlZ2luOiAnXi17Myx9JywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICAvLyB1c2luZyBsaW5rcyAtIHRpdGxlIGFuZCBsaW5rXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnXFxcXFsuKz9cXFxcXVxcXFwoLis/XFxcXCknLFxuICAgICAgICByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdsaW5rX2xhYmVsJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXFsuK1xcXFxdJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAnbGlua191cmwnLFxuICAgICAgICAgICAgYmVnaW46ICdcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG5cbiAgdmFyIENPTU1PTl9DT05UQUlOUyA9IFtcbiAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCB7YmVnaW46ICdcXCdcXCcnfV0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2JyZWFrIGNhc2UgY2F0Y2ggY2xhc3NkZWYgY29udGludWUgZWxzZSBlbHNlaWYgZW5kIGVudW1lcmF0ZWQgZXZlbnRzIGZvciBmdW5jdGlvbiAnICtcbiAgICAgICAgJ2dsb2JhbCBpZiBtZXRob2RzIG90aGVyd2lzZSBwYXJmb3IgcGVyc2lzdGVudCBwcm9wZXJ0aWVzIHJldHVybiBzcG1kIHN3aXRjaCB0cnkgd2hpbGUnLFxuICAgICAgYnVpbHRfaW46XG4gICAgICAgICdzaW4gc2luZCBzaW5oIGFzaW4gYXNpbmQgYXNpbmggY29zIGNvc2QgY29zaCBhY29zIGFjb3NkIGFjb3NoIHRhbiB0YW5kIHRhbmggYXRhbiAnICtcbiAgICAgICAgJ2F0YW5kIGF0YW4yIGF0YW5oIHNlYyBzZWNkIHNlY2ggYXNlYyBhc2VjZCBhc2VjaCBjc2MgY3NjZCBjc2NoIGFjc2MgYWNzY2QgYWNzY2ggY290ICcgK1xuICAgICAgICAnY290ZCBjb3RoIGFjb3QgYWNvdGQgYWNvdGggaHlwb3QgZXhwIGV4cG0xIGxvZyBsb2cxcCBsb2cxMCBsb2cyIHBvdzIgcmVhbHBvdyByZWFsbG9nICcgK1xuICAgICAgICAncmVhbHNxcnQgc3FydCBudGhyb290IG5leHRwb3cyIGFicyBhbmdsZSBjb21wbGV4IGNvbmogaW1hZyByZWFsIHVud3JhcCBpc3JlYWwgJyArXG4gICAgICAgICdjcGx4cGFpciBmaXggZmxvb3IgY2VpbCByb3VuZCBtb2QgcmVtIHNpZ24gYWlyeSBiZXNzZWxqIGJlc3NlbHkgYmVzc2VsaCBiZXNzZWxpICcgK1xuICAgICAgICAnYmVzc2VsayBiZXRhIGJldGFpbmMgYmV0YWxuIGVsbGlwaiBlbGxpcGtlIGVyZiBlcmZjIGVyZmN4IGVyZmludiBleHBpbnQgZ2FtbWEgJyArXG4gICAgICAgICdnYW1tYWluYyBnYW1tYWxuIHBzaSBsZWdlbmRyZSBjcm9zcyBkb3QgZmFjdG9yIGlzcHJpbWUgcHJpbWVzIGdjZCBsY20gcmF0IHJhdHMgcGVybXMgJyArXG4gICAgICAgICduY2hvb3NlayBmYWN0b3JpYWwgY2FydDJzcGggY2FydDJwb2wgcG9sMmNhcnQgc3BoMmNhcnQgaHN2MnJnYiByZ2IyaHN2IHplcm9zIG9uZXMgJyArXG4gICAgICAgICdleWUgcmVwbWF0IHJhbmQgcmFuZG4gbGluc3BhY2UgbG9nc3BhY2UgZnJlcXNwYWNlIG1lc2hncmlkIGFjY3VtYXJyYXkgc2l6ZSBsZW5ndGggJyArXG4gICAgICAgICduZGltcyBudW1lbCBkaXNwIGlzZW1wdHkgaXNlcXVhbCBpc2VxdWFsd2l0aGVxdWFsbmFucyBjYXQgcmVzaGFwZSBkaWFnIGJsa2RpYWcgdHJpbCAnICtcbiAgICAgICAgJ3RyaXUgZmxpcGxyIGZsaXB1ZCBmbGlwZGltIHJvdDkwIGZpbmQgc3ViMmluZCBpbmQyc3ViIGJzeGZ1biBuZGdyaWQgcGVybXV0ZSBpcGVybXV0ZSAnICtcbiAgICAgICAgJ3NoaWZ0ZGltIGNpcmNzaGlmdCBzcXVlZXplIGlzc2NhbGFyIGlzdmVjdG9yIGFucyBlcHMgcmVhbG1heCByZWFsbWluIHBpIGkgaW5mIG5hbiAnICtcbiAgICAgICAgJ2lzbmFuIGlzaW5mIGlzZmluaXRlIGogd2h5IGNvbXBhbiBnYWxsZXJ5IGhhZGFtYXJkIGhhbmtlbCBoaWxiIGludmhpbGIgbWFnaWMgcGFzY2FsICcgK1xuICAgICAgICAncm9zc2VyIHRvZXBsaXR6IHZhbmRlciB3aWxraW5zb24nXG4gICAgfSxcbiAgICBpbGxlZ2FsOiAnKC8vfFwifCN8L1xcXFwqfFxcXFxzKy9cXFxcdyspJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyQnLFxuICAgICAgICBrZXl3b3JkczogJ2Z1bmN0aW9uJyxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgICAgYmVnaW46IGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJhbXMnLFxuICAgICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RyYW5zcG9zZWRfdmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1thLXpBLVpfXVthLXpBLVpfMC05XSooXFwnK1tcXFxcLlxcJ10qfFtcXFxcLlxcJ10rKScsIGVuZDogJydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21hdHJpeCcsXG4gICAgICAgIGJlZ2luOiAnXFxcXFsnLCBlbmQ6ICdcXFxcXVxcJypbXFxcXC5cXCddKicsXG4gICAgICAgIGNvbnRhaW5zOiBDT01NT05fQ09OVEFJTlNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NlbGwnLFxuICAgICAgICBiZWdpbjogJ1xcXFx7JywgZW5kOiAnXFxcXH1cXCcqW1xcXFwuXFwnXSonLFxuICAgICAgICBjb250YWluczogQ09NTU9OX0NPTlRBSU5TXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcXFxcJScsIGVuZDogJyQnXG4gICAgICB9XG4gICAgXS5jb25jYXQoQ09NTU9OX0NPTlRBSU5TKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdpbnQgZmxvYXQgc3RyaW5nIHZlY3RvciBtYXRyaXggaWYgZWxzZSBzd2l0Y2ggY2FzZSBkZWZhdWx0IHdoaWxlIGRvIGZvciBpbiBicmVhayAnICtcbiAgICAgICdjb250aW51ZSBnbG9iYWwgcHJvYyByZXR1cm4gYWJvdXQgYWJzIGFkZEF0dHIgYWRkQXR0cmlidXRlRWRpdG9yTm9kZUhlbHAgYWRkRHluYW1pYyAnICtcbiAgICAgICdhZGROZXdTaGVsZlRhYiBhZGRQUCBhZGRQYW5lbENhdGVnb3J5IGFkZFByZWZpeFRvTmFtZSBhZHZhbmNlVG9OZXh0RHJpdmVuS2V5ICcgK1xuICAgICAgJ2FmZmVjdGVkTmV0IGFmZmVjdHMgYWltQ29uc3RyYWludCBhaXIgYWxpYXMgYWxpYXNBdHRyIGFsaWduIGFsaWduQ3R4IGFsaWduQ3VydmUgJyArXG4gICAgICAnYWxpZ25TdXJmYWNlIGFsbFZpZXdGaXQgYW1iaWVudExpZ2h0IGFuZ2xlIGFuZ2xlQmV0d2VlbiBhbmltQ29uZSBhbmltQ3VydmVFZGl0b3IgJyArXG4gICAgICAnYW5pbURpc3BsYXkgYW5pbVZpZXcgYW5ub3RhdGUgYXBwZW5kU3RyaW5nQXJyYXkgYXBwbGljYXRpb25OYW1lIGFwcGx5QXR0clByZXNldCAnICtcbiAgICAgICdhcHBseVRha2UgYXJjTGVuRGltQ29udGV4dCBhcmNMZW5ndGhEaW1lbnNpb24gYXJjbGVuIGFycmF5TWFwcGVyIGFydDNkUGFpbnRDdHggJyArXG4gICAgICAnYXJ0QXR0ckN0eCBhcnRBdHRyUGFpbnRWZXJ0ZXhDdHggYXJ0QXR0clNraW5QYWludEN0eCBhcnRBdHRyVG9vbCBhcnRCdWlsZFBhaW50TWVudSAnICtcbiAgICAgICdhcnRGbHVpZEF0dHJDdHggYXJ0UHV0dHlDdHggYXJ0U2VsZWN0Q3R4IGFydFNldFBhaW50Q3R4IGFydFVzZXJQYWludEN0eCBhc3NpZ25Db21tYW5kICcgK1xuICAgICAgJ2Fzc2lnbklucHV0RGV2aWNlIGFzc2lnblZpZXdwb3J0RmFjdG9yaWVzIGF0dGFjaEN1cnZlIGF0dGFjaERldmljZUF0dHIgYXR0YWNoU3VyZmFjZSAnICtcbiAgICAgICdhdHRyQ29sb3JTbGlkZXJHcnAgYXR0ckNvbXBhdGliaWxpdHkgYXR0ckNvbnRyb2xHcnAgYXR0ckVudW1PcHRpb25NZW51ICcgK1xuICAgICAgJ2F0dHJFbnVtT3B0aW9uTWVudUdycCBhdHRyRmllbGRHcnAgYXR0ckZpZWxkU2xpZGVyR3JwIGF0dHJOYXZpZ2F0aW9uQ29udHJvbEdycCAnICtcbiAgICAgICdhdHRyUHJlc2V0RWRpdFdpbiBhdHRyaWJ1dGVFeGlzdHMgYXR0cmlidXRlSW5mbyBhdHRyaWJ1dGVNZW51IGF0dHJpYnV0ZVF1ZXJ5ICcgK1xuICAgICAgJ2F1dG9LZXlmcmFtZSBhdXRvUGxhY2UgYmFrZUNsaXAgYmFrZUZsdWlkU2hhZGluZyBiYWtlUGFydGlhbEhpc3RvcnkgYmFrZVJlc3VsdHMgJyArXG4gICAgICAnYmFrZVNpbXVsYXRpb24gYmFzZW5hbWUgYmFzZW5hbWVFeCBiYXRjaFJlbmRlciBiZXNzZWwgYmV2ZWwgYmV2ZWxQbHVzIGJpbk1lbWJlcnNoaXAgJyArXG4gICAgICAnYmluZFNraW4gYmxlbmQyIGJsZW5kU2hhcGUgYmxlbmRTaGFwZUVkaXRvciBibGVuZFNoYXBlUGFuZWwgYmxlbmRUd29BdHRyIGJsaW5kRGF0YVR5cGUgJyArXG4gICAgICAnYm9uZUxhdHRpY2UgYm91bmRhcnkgYm94RG9sbHlDdHggYm94Wm9vbUN0eCBidWZmZXJDdXJ2ZSBidWlsZEJvb2ttYXJrTWVudSAnICtcbiAgICAgICdidWlsZEtleWZyYW1lTWVudSBidXR0b24gYnV0dG9uTWFuaXAgQ0JHIGNhY2hlRmlsZSBjYWNoZUZpbGVDb21iaW5lIGNhY2hlRmlsZU1lcmdlICcgK1xuICAgICAgJ2NhY2hlRmlsZVRyYWNrIGNhbWVyYSBjYW1lcmFWaWV3IGNhbkNyZWF0ZU1hbmlwIGNhbnZhcyBjYXBpdGFsaXplU3RyaW5nIGNhdGNoICcgK1xuICAgICAgJ2NhdGNoUXVpZXQgY2VpbCBjaGFuZ2VTdWJkaXZDb21wb25lbnREaXNwbGF5TGV2ZWwgY2hhbmdlU3ViZGl2UmVnaW9uIGNoYW5uZWxCb3ggJyArXG4gICAgICAnY2hhcmFjdGVyIGNoYXJhY3Rlck1hcCBjaGFyYWN0ZXJPdXRsaW5lRWRpdG9yIGNoYXJhY3Rlcml6ZSBjaGRpciBjaGVja0JveCBjaGVja0JveEdycCAnICtcbiAgICAgICdjaGVja0RlZmF1bHRSZW5kZXJHbG9iYWxzIGNob2ljZSBjaXJjbGUgY2lyY3VsYXJGaWxsZXQgY2xhbXAgY2xlYXIgY2xlYXJDYWNoZSBjbGlwICcgK1xuICAgICAgJ2NsaXBFZGl0b3IgY2xpcEVkaXRvckN1cnJlbnRUaW1lQ3R4IGNsaXBTY2hlZHVsZSBjbGlwU2NoZWR1bGVyT3V0bGluZXIgY2xpcFRyaW1CZWZvcmUgJyArXG4gICAgICAnY2xvc2VDdXJ2ZSBjbG9zZVN1cmZhY2UgY2x1c3RlciBjbWRGaWxlT3V0cHV0IGNtZFNjcm9sbEZpZWxkRXhlY3V0ZXIgJyArXG4gICAgICAnY21kU2Nyb2xsRmllbGRSZXBvcnRlciBjbWRTaGVsbCBjb2Fyc2VuU3ViZGl2U2VsZWN0aW9uTGlzdCBjb2xsaXNpb24gY29sb3IgJyArXG4gICAgICAnY29sb3JBdFBvaW50IGNvbG9yRWRpdG9yIGNvbG9ySW5kZXggY29sb3JJbmRleFNsaWRlckdycCBjb2xvclNsaWRlckJ1dHRvbkdycCAnICtcbiAgICAgICdjb2xvclNsaWRlckdycCBjb2x1bW5MYXlvdXQgY29tbWFuZEVjaG8gY29tbWFuZExpbmUgY29tbWFuZFBvcnQgY29tcGFjdEhhaXJTeXN0ZW0gJyArXG4gICAgICAnY29tcG9uZW50RWRpdG9yIGNvbXBvc2l0aW5nSW50ZXJvcCBjb21wdXRlUG9seXNldFZvbHVtZSBjb25kaXRpb24gY29uZSBjb25maXJtRGlhbG9nICcgK1xuICAgICAgJ2Nvbm5lY3RBdHRyIGNvbm5lY3RDb250cm9sIGNvbm5lY3REeW5hbWljIGNvbm5lY3RKb2ludCBjb25uZWN0aW9uSW5mbyBjb25zdHJhaW4gJyArXG4gICAgICAnY29uc3RyYWluVmFsdWUgY29uc3RydWN0aW9uSGlzdG9yeSBjb250YWluZXIgY29udGFpbnNNdWx0aWJ5dGUgY29udGV4dEluZm8gY29udHJvbCAnICtcbiAgICAgICdjb252ZXJ0RnJvbU9sZExheWVycyBjb252ZXJ0SWZmVG9Qc2QgY29udmVydExpZ2h0bWFwIGNvbnZlcnRTb2xpZFR4IGNvbnZlcnRUZXNzZWxsYXRpb24gJyArXG4gICAgICAnY29udmVydFVuaXQgY29weUFycmF5IGNvcHlGbGV4b3IgY29weUtleSBjb3B5U2tpbldlaWdodHMgY29zIGNwQnV0dG9uIGNwQ2FjaGUgJyArXG4gICAgICAnY3BDbG90aFNldCBjcENvbGxpc2lvbiBjcENvbnN0cmFpbnQgY3BDb252Q2xvdGhUb01lc2ggY3BGb3JjZXMgY3BHZXRTb2x2ZXJBdHRyIGNwUGFuZWwgJyArXG4gICAgICAnY3BQcm9wZXJ0eSBjcFJpZ2lkQ29sbGlzaW9uRmlsdGVyIGNwU2VhbSBjcFNldEVkaXQgY3BTZXRTb2x2ZXJBdHRyIGNwU29sdmVyICcgK1xuICAgICAgJ2NwU29sdmVyVHlwZXMgY3BUb29sIGNwVXBkYXRlQ2xvdGhVVnMgY3JlYXRlRGlzcGxheUxheWVyIGNyZWF0ZURyYXdDdHggY3JlYXRlRWRpdG9yICcgK1xuICAgICAgJ2NyZWF0ZUxheWVyZWRQc2RGaWxlIGNyZWF0ZU1vdGlvbkZpZWxkIGNyZWF0ZU5ld1NoZWxmIGNyZWF0ZU5vZGUgY3JlYXRlUmVuZGVyTGF5ZXIgJyArXG4gICAgICAnY3JlYXRlU3ViZGl2UmVnaW9uIGNyb3NzIGNyb3NzUHJvZHVjdCBjdHhBYm9ydCBjdHhDb21wbGV0aW9uIGN0eEVkaXRNb2RlIGN0eFRyYXZlcnNlICcgK1xuICAgICAgJ2N1cnJlbnRDdHggY3VycmVudFRpbWUgY3VycmVudFRpbWVDdHggY3VycmVudFVuaXQgY3VycmVudFVuaXQgY3VydmUgY3VydmVBZGRQdEN0eCAnICtcbiAgICAgICdjdXJ2ZUNWQ3R4IGN1cnZlRVBDdHggY3VydmVFZGl0b3JDdHggY3VydmVJbnRlcnNlY3QgY3VydmVNb3ZlRVBDdHggY3VydmVPblN1cmZhY2UgJyArXG4gICAgICAnY3VydmVTa2V0Y2hDdHggY3V0S2V5IGN5Y2xlQ2hlY2sgY3lsaW5kZXIgZGFnUG9zZSBkYXRlIGRlZmF1bHRMaWdodExpc3RDaGVja0JveCAnICtcbiAgICAgICdkZWZhdWx0TmF2aWdhdGlvbiBkZWZpbmVEYXRhU2VydmVyIGRlZmluZVZpcnR1YWxEZXZpY2UgZGVmb3JtZXIgZGVnX3RvX3JhZCBkZWxldGUgJyArXG4gICAgICAnZGVsZXRlQXR0ciBkZWxldGVTaGFkaW5nR3JvdXBzQW5kTWF0ZXJpYWxzIGRlbGV0ZVNoZWxmVGFiIGRlbGV0ZVVJIGRlbGV0ZVVudXNlZEJydXNoZXMgJyArXG4gICAgICAnZGVscmFuZHN0ciBkZXRhY2hDdXJ2ZSBkZXRhY2hEZXZpY2VBdHRyIGRldGFjaFN1cmZhY2UgZGV2aWNlRWRpdG9yIGRldmljZVBhbmVsIGRnSW5mbyAnICtcbiAgICAgICdkZ2RpcnR5IGRnZXZhbCBkZ3RpbWVyIGRpbVdoZW4gZGlyZWN0S2V5Q3R4IGRpcmVjdGlvbmFsTGlnaHQgZGlybWFwIGRpcm5hbWUgZGlzYWJsZSAnICtcbiAgICAgICdkaXNjb25uZWN0QXR0ciBkaXNjb25uZWN0Sm9pbnQgZGlza0NhY2hlIGRpc3BsYWNlbWVudFRvUG9seSBkaXNwbGF5QWZmZWN0ZWQgJyArXG4gICAgICAnZGlzcGxheUNvbG9yIGRpc3BsYXlDdWxsIGRpc3BsYXlMZXZlbE9mRGV0YWlsIGRpc3BsYXlQcmVmIGRpc3BsYXlSR0JDb2xvciAnICtcbiAgICAgICdkaXNwbGF5U21vb3RobmVzcyBkaXNwbGF5U3RhdHMgZGlzcGxheVN0cmluZyBkaXNwbGF5U3VyZmFjZSBkaXN0YW5jZURpbUNvbnRleHQgJyArXG4gICAgICAnZGlzdGFuY2VEaW1lbnNpb24gZG9CbHVyIGRvbGx5IGRvbGx5Q3R4IGRvcGVTaGVldEVkaXRvciBkb3QgZG90UHJvZHVjdCAnICtcbiAgICAgICdkb3VibGVQcm9maWxlQmlyYWlsU3VyZmFjZSBkcmFnIGRyYWdBdHRyQ29udGV4dCBkcmFnZ2VyQ29udGV4dCBkcm9wb2ZmTG9jYXRvciAnICtcbiAgICAgICdkdXBsaWNhdGUgZHVwbGljYXRlQ3VydmUgZHVwbGljYXRlU3VyZmFjZSBkeW5DYWNoZSBkeW5Db250cm9sIGR5bkV4cG9ydCBkeW5FeHByZXNzaW9uICcgK1xuICAgICAgJ2R5bkdsb2JhbHMgZHluUGFpbnRFZGl0b3IgZHluUGFydGljbGVDdHggZHluUHJlZiBkeW5SZWxFZFBhbmVsIGR5blJlbEVkaXRvciAnICtcbiAgICAgICdkeW5hbWljTG9hZCBlZGl0QXR0ckxpbWl0cyBlZGl0RGlzcGxheUxheWVyR2xvYmFscyBlZGl0RGlzcGxheUxheWVyTWVtYmVycyAnICtcbiAgICAgICdlZGl0UmVuZGVyTGF5ZXJBZGp1c3RtZW50IGVkaXRSZW5kZXJMYXllckdsb2JhbHMgZWRpdFJlbmRlckxheWVyTWVtYmVycyBlZGl0b3IgJyArXG4gICAgICAnZWRpdG9yVGVtcGxhdGUgZWZmZWN0b3IgZW1pdCBlbWl0dGVyIGVuYWJsZURldmljZSBlbmNvZGVTdHJpbmcgZW5kU3RyaW5nIGVuZHNXaXRoIGVudiAnICtcbiAgICAgICdlcXVpdmFsZW50IGVxdWl2YWxlbnRUb2wgZXJmIGVycm9yIGV2YWwgZXZhbCBldmFsRGVmZXJyZWQgZXZhbEVjaG8gZXZlbnQgJyArXG4gICAgICAnZXhhY3RXb3JsZEJvdW5kaW5nQm94IGV4Y2x1c2l2ZUxpZ2h0Q2hlY2tCb3ggZXhlYyBleGVjdXRlRm9yRWFjaE9iamVjdCBleGlzdHMgZXhwICcgK1xuICAgICAgJ2V4cHJlc3Npb24gZXhwcmVzc2lvbkVkaXRvckxpc3RlbiBleHRlbmRDdXJ2ZSBleHRlbmRTdXJmYWNlIGV4dHJ1ZGUgZmNoZWNrIGZjbG9zZSBmZW9mICcgK1xuICAgICAgJ2ZmbHVzaCBmZ2V0bGluZSBmZ2V0d29yZCBmaWxlIGZpbGVCcm93c2VyRGlhbG9nIGZpbGVEaWFsb2cgZmlsZUV4dGVuc2lvbiBmaWxlSW5mbyAnICtcbiAgICAgICdmaWxldGVzdCBmaWxsZXRDdXJ2ZSBmaWx0ZXIgZmlsdGVyQ3VydmUgZmlsdGVyRXhwYW5kIGZpbHRlclN0dWRpb0ltcG9ydCAnICtcbiAgICAgICdmaW5kQWxsSW50ZXJzZWN0aW9ucyBmaW5kQW5pbUN1cnZlcyBmaW5kS2V5ZnJhbWUgZmluZE1lbnVJdGVtIGZpbmRSZWxhdGVkU2tpbkNsdXN0ZXIgJyArXG4gICAgICAnZmluZGVyIGZpcnN0UGFyZW50T2YgZml0QnNwbGluZSBmbGV4b3IgZmxvYXRFcSBmbG9hdEZpZWxkIGZsb2F0RmllbGRHcnAgZmxvYXRTY3JvbGxCYXIgJyArXG4gICAgICAnZmxvYXRTbGlkZXIgZmxvYXRTbGlkZXIyIGZsb2F0U2xpZGVyQnV0dG9uR3JwIGZsb2F0U2xpZGVyR3JwIGZsb29yIGZsb3cgZmx1aWRDYWNoZUluZm8gJyArXG4gICAgICAnZmx1aWRFbWl0dGVyIGZsdWlkVm94ZWxJbmZvIGZsdXNoVW5kbyBmbW9kIGZvbnREaWFsb2cgZm9wZW4gZm9ybUxheW91dCBmb3JtYXQgZnByaW50ICcgK1xuICAgICAgJ2ZyYW1lTGF5b3V0IGZyZWFkIGZyZWVGb3JtRmlsbGV0IGZyZXdpbmQgZnJvbU5hdGl2ZVBhdGggZndyaXRlIGdhbW1hIGdhdXNzICcgK1xuICAgICAgJ2dlb21ldHJ5Q29uc3RyYWludCBnZXRBcHBsaWNhdGlvblZlcnNpb25Bc0Zsb2F0IGdldEF0dHIgZ2V0Q2xhc3NpZmljYXRpb24gJyArXG4gICAgICAnZ2V0RGVmYXVsdEJydXNoIGdldEZpbGVMaXN0IGdldEZsdWlkQXR0ciBnZXRJbnB1dERldmljZVJhbmdlIGdldE1heWFQYW5lbFR5cGVzICcgK1xuICAgICAgJ2dldE1vZGlmaWVycyBnZXRQYW5lbCBnZXRQYXJ0aWNsZUF0dHIgZ2V0UGx1Z2luUmVzb3VyY2UgZ2V0ZW52IGdldHBpZCBnbFJlbmRlciAnICtcbiAgICAgICdnbFJlbmRlckVkaXRvciBnbG9iYWxTdGl0Y2ggZ21hdGNoIGdvYWwgZ290b0JpbmRQb3NlIGdyYWJDb2xvciBncmFkaWVudENvbnRyb2wgJyArXG4gICAgICAnZ3JhZGllbnRDb250cm9sTm9BdHRyIGdyYXBoRG9sbHlDdHggZ3JhcGhTZWxlY3RDb250ZXh0IGdyYXBoVHJhY2tDdHggZ3Jhdml0eSBncmlkICcgK1xuICAgICAgJ2dyaWRMYXlvdXQgZ3JvdXAgZ3JvdXBPYmplY3RzQnlOYW1lIEhmQWRkQXR0cmFjdG9yVG9BUyBIZkFzc2lnbkFTIEhmQnVpbGRFcXVhbE1hcCAnICtcbiAgICAgICdIZkJ1aWxkRnVyRmlsZXMgSGZCdWlsZEZ1ckltYWdlcyBIZkNhbmNlbEFGUiBIZkNvbm5lY3RBU1RvSEYgSGZDcmVhdGVBdHRyYWN0b3IgJyArXG4gICAgICAnSGZEZWxldGVBUyBIZkVkaXRBUyBIZlBlcmZvcm1DcmVhdGVBUyBIZlJlbW92ZUF0dHJhY3RvckZyb21BUyBIZlNlbGVjdEF0dGFjaGVkICcgK1xuICAgICAgJ0hmU2VsZWN0QXR0cmFjdG9ycyBIZlVuQXNzaWduQVMgaGFyZGVuUG9pbnRDdXJ2ZSBoYXJkd2FyZSBoYXJkd2FyZVJlbmRlclBhbmVsICcgK1xuICAgICAgJ2hlYWRzVXBEaXNwbGF5IGhlYWRzVXBNZXNzYWdlIGhlbHAgaGVscExpbmUgaGVybWl0ZSBoaWRlIGhpbGl0ZSBoaXRUZXN0IGhvdEJveCBob3RrZXkgJyArXG4gICAgICAnaG90a2V5Q2hlY2sgaHN2X3RvX3JnYiBodWRCdXR0b24gaHVkU2xpZGVyIGh1ZFNsaWRlckJ1dHRvbiBod1JlZmxlY3Rpb25NYXAgaHdSZW5kZXIgJyArXG4gICAgICAnaHdSZW5kZXJMb2FkIGh5cGVyR3JhcGggaHlwZXJQYW5lbCBoeXBlclNoYWRlIGh5cG90IGljb25UZXh0QnV0dG9uIGljb25UZXh0Q2hlY2tCb3ggJyArXG4gICAgICAnaWNvblRleHRSYWRpb0J1dHRvbiBpY29uVGV4dFJhZGlvQ29sbGVjdGlvbiBpY29uVGV4dFNjcm9sbExpc3QgaWNvblRleHRTdGF0aWNMYWJlbCAnICtcbiAgICAgICdpa0hhbmRsZSBpa0hhbmRsZUN0eCBpa0hhbmRsZURpc3BsYXlTY2FsZSBpa1NvbHZlciBpa1NwbGluZUhhbmRsZUN0eCBpa1N5c3RlbSAnICtcbiAgICAgICdpa1N5c3RlbUluZm8gaWtma0Rpc3BsYXlNZXRob2QgaWxsdXN0cmF0b3JDdXJ2ZXMgaW1hZ2UgaW1mUGx1Z2lucyBpbmhlcml0VHJhbnNmb3JtICcgK1xuICAgICAgJ2luc2VydEpvaW50IGluc2VydEpvaW50Q3R4IGluc2VydEtleUN0eCBpbnNlcnRLbm90Q3VydmUgaW5zZXJ0S25vdFN1cmZhY2UgaW5zdGFuY2UgJyArXG4gICAgICAnaW5zdGFuY2VhYmxlIGluc3RhbmNlciBpbnRGaWVsZCBpbnRGaWVsZEdycCBpbnRTY3JvbGxCYXIgaW50U2xpZGVyIGludFNsaWRlckdycCAnICtcbiAgICAgICdpbnRlclRvVUkgaW50ZXJuYWxWYXIgaW50ZXJzZWN0IGlwckVuZ2luZSBpc0FuaW1DdXJ2ZSBpc0Nvbm5lY3RlZCBpc0RpcnR5IGlzUGFyZW50T2YgJyArXG4gICAgICAnaXNTYW1lT2JqZWN0IGlzVHJ1ZSBpc1ZhbGlkT2JqZWN0TmFtZSBpc1ZhbGlkU3RyaW5nIGlzVmFsaWRVaU5hbWUgaXNvbGF0ZVNlbGVjdCAnICtcbiAgICAgICdpdGVtRmlsdGVyIGl0ZW1GaWx0ZXJBdHRyIGl0ZW1GaWx0ZXJSZW5kZXIgaXRlbUZpbHRlclR5cGUgam9pbnQgam9pbnRDbHVzdGVyIGpvaW50Q3R4ICcgK1xuICAgICAgJ2pvaW50RGlzcGxheVNjYWxlIGpvaW50TGF0dGljZSBrZXlUYW5nZW50IGtleWZyYW1lIGtleWZyYW1lT3V0bGluZXIgJyArXG4gICAgICAna2V5ZnJhbWVSZWdpb25DdXJyZW50VGltZUN0eCBrZXlmcmFtZVJlZ2lvbkRpcmVjdEtleUN0eCBrZXlmcmFtZVJlZ2lvbkRvbGx5Q3R4ICcgK1xuICAgICAgJ2tleWZyYW1lUmVnaW9uSW5zZXJ0S2V5Q3R4IGtleWZyYW1lUmVnaW9uTW92ZUtleUN0eCBrZXlmcmFtZVJlZ2lvblNjYWxlS2V5Q3R4ICcgK1xuICAgICAgJ2tleWZyYW1lUmVnaW9uU2VsZWN0S2V5Q3R4IGtleWZyYW1lUmVnaW9uU2V0S2V5Q3R4IGtleWZyYW1lUmVnaW9uVHJhY2tDdHggJyArXG4gICAgICAna2V5ZnJhbWVTdGF0cyBsYXNzb0NvbnRleHQgbGF0dGljZSBsYXR0aWNlRGVmb3JtS2V5Q3R4IGxhdW5jaCBsYXVuY2hJbWFnZUVkaXRvciAnICtcbiAgICAgICdsYXllckJ1dHRvbiBsYXllcmVkU2hhZGVyUG9ydCBsYXllcmVkVGV4dHVyZVBvcnQgbGF5b3V0IGxheW91dERpYWxvZyBsaWdodExpc3QgJyArXG4gICAgICAnbGlnaHRMaXN0RWRpdG9yIGxpZ2h0TGlzdFBhbmVsIGxpZ2h0bGluayBsaW5lSW50ZXJzZWN0aW9uIGxpbmVhclByZWNpc2lvbiBsaW5zdGVwICcgK1xuICAgICAgJ2xpc3RBbmltYXRhYmxlIGxpc3RBdHRyIGxpc3RDYW1lcmFzIGxpc3RDb25uZWN0aW9ucyBsaXN0RGV2aWNlQXR0YWNobWVudHMgbGlzdEhpc3RvcnkgJyArXG4gICAgICAnbGlzdElucHV0RGV2aWNlQXhlcyBsaXN0SW5wdXREZXZpY2VCdXR0b25zIGxpc3RJbnB1dERldmljZXMgbGlzdE1lbnVBbm5vdGF0aW9uICcgK1xuICAgICAgJ2xpc3ROb2RlVHlwZXMgbGlzdFBhbmVsQ2F0ZWdvcmllcyBsaXN0UmVsYXRpdmVzIGxpc3RTZXRzIGxpc3RUcmFuc2Zvcm1zICcgK1xuICAgICAgJ2xpc3RVbnNlbGVjdGVkIGxpc3RlckVkaXRvciBsb2FkRmx1aWQgbG9hZE5ld1NoZWxmIGxvYWRQbHVnaW4gJyArXG4gICAgICAnbG9hZFBsdWdpbkxhbmd1YWdlUmVzb3VyY2VzIGxvYWRQcmVmT2JqZWN0cyBsb2NhbGl6ZWRQYW5lbExhYmVsIGxvY2tOb2RlIGxvZnQgbG9nICcgK1xuICAgICAgJ2xvbmdOYW1lT2YgbG9va1RocnUgbHMgbHNUaHJvdWdoRmlsdGVyIGxzVHlwZSBsc1VJIE1heWF0b21yIG1hZyBtYWtlSWRlbnRpdHkgbWFrZUxpdmUgJyArXG4gICAgICAnbWFrZVBhaW50YWJsZSBtYWtlUm9sbCBtYWtlU2luZ2xlU3VyZmFjZSBtYWtlVHViZU9uIG1ha2Vib3QgbWFuaXBNb3ZlQ29udGV4dCAnICtcbiAgICAgICdtYW5pcE1vdmVMaW1pdHNDdHggbWFuaXBPcHRpb25zIG1hbmlwUm90YXRlQ29udGV4dCBtYW5pcFJvdGF0ZUxpbWl0c0N0eCAnICtcbiAgICAgICdtYW5pcFNjYWxlQ29udGV4dCBtYW5pcFNjYWxlTGltaXRzQ3R4IG1hcmtlciBtYXRjaCBtYXggbWVtb3J5IG1lbnUgbWVudUJhckxheW91dCAnICtcbiAgICAgICdtZW51RWRpdG9yIG1lbnVJdGVtIG1lbnVJdGVtVG9TaGVsZiBtZW51U2V0IG1lbnVTZXRQcmVmIG1lc3NhZ2VMaW5lIG1pbiBtaW5pbWl6ZUFwcCAnICtcbiAgICAgICdtaXJyb3JKb2ludCBtb2RlbEN1cnJlbnRUaW1lQ3R4IG1vZGVsRWRpdG9yIG1vZGVsUGFuZWwgbW91c2UgbW92SW4gbW92T3V0IG1vdmUgJyArXG4gICAgICAnbW92ZUlLdG9GSyBtb3ZlS2V5Q3R4IG1vdmVWZXJ0ZXhBbG9uZ0RpcmVjdGlvbiBtdWx0aVByb2ZpbGVCaXJhaWxTdXJmYWNlIG11dGUgJyArXG4gICAgICAnblBhcnRpY2xlIG5hbWVDb21tYW5kIG5hbWVGaWVsZCBuYW1lc3BhY2UgbmFtZXNwYWNlSW5mbyBuZXdQYW5lbEl0ZW1zIG5ld3RvbiBub2RlQ2FzdCAnICtcbiAgICAgICdub2RlSWNvbkJ1dHRvbiBub2RlT3V0bGluZXIgbm9kZVByZXNldCBub2RlVHlwZSBub2lzZSBub25MaW5lYXIgbm9ybWFsQ29uc3RyYWludCAnICtcbiAgICAgICdub3JtYWxpemUgbnVyYnNCb29sZWFuIG51cmJzQ29weVVWU2V0IG51cmJzQ3ViZSBudXJic0VkaXRVViBudXJic1BsYW5lIG51cmJzU2VsZWN0ICcgK1xuICAgICAgJ251cmJzU3F1YXJlIG51cmJzVG9Qb2x5IG51cmJzVG9Qb2x5Z29uc1ByZWYgbnVyYnNUb1N1YmRpdiBudXJic1RvU3ViZGl2UHJlZiAnICtcbiAgICAgICdudXJic1VWU2V0IG51cmJzVmlld0RpcmVjdGlvblZlY3RvciBvYmpFeGlzdHMgb2JqZWN0Q2VudGVyIG9iamVjdExheWVyIG9iamVjdFR5cGUgJyArXG4gICAgICAnb2JqZWN0VHlwZVVJIG9ic29sZXRlUHJvYyBvY2Vhbk51cmJzUHJldmlld1BsYW5lIG9mZnNldEN1cnZlIG9mZnNldEN1cnZlT25TdXJmYWNlICcgK1xuICAgICAgJ29mZnNldFN1cmZhY2Ugb3BlbkdMRXh0ZW5zaW9uIG9wZW5NYXlhUHJlZiBvcHRpb25NZW51IG9wdGlvbk1lbnVHcnAgb3B0aW9uVmFyIG9yYml0ICcgK1xuICAgICAgJ29yYml0Q3R4IG9yaWVudENvbnN0cmFpbnQgb3V0bGluZXJFZGl0b3Igb3V0bGluZXJQYW5lbCBvdmVycmlkZU1vZGlmaWVyICcgK1xuICAgICAgJ3BhaW50RWZmZWN0c0Rpc3BsYXkgcGFpckJsZW5kIHBhbGV0dGVQb3J0IHBhbmVMYXlvdXQgcGFuZWwgcGFuZWxDb25maWd1cmF0aW9uICcgK1xuICAgICAgJ3BhbmVsSGlzdG9yeSBwYXJhbURpbUNvbnRleHQgcGFyYW1EaW1lbnNpb24gcGFyYW1Mb2NhdG9yIHBhcmVudCBwYXJlbnRDb25zdHJhaW50ICcgK1xuICAgICAgJ3BhcnRpY2xlIHBhcnRpY2xlRXhpc3RzIHBhcnRpY2xlSW5zdGFuY2VyIHBhcnRpY2xlUmVuZGVySW5mbyBwYXJ0aXRpb24gcGFzdGVLZXkgJyArXG4gICAgICAncGF0aEFuaW1hdGlvbiBwYXVzZSBwY2xvc2UgcGVyY2VudCBwZXJmb3JtYW5jZU9wdGlvbnMgcGZ4c3Ryb2tlcyBwaWNrV2FsayBwaWN0dXJlICcgK1xuICAgICAgJ3BpeGVsTW92ZSBwbGFuYXJTcmYgcGxhbmUgcGxheSBwbGF5YmFja09wdGlvbnMgcGxheWJsYXN0IHBsdWdBdHRyIHBsdWdOb2RlIHBsdWdpbkluZm8gJyArXG4gICAgICAncGx1Z2luUmVzb3VyY2VVdGlsIHBvaW50Q29uc3RyYWludCBwb2ludEN1cnZlQ29uc3RyYWludCBwb2ludExpZ2h0IHBvaW50TWF0cml4TXVsdCAnICtcbiAgICAgICdwb2ludE9uQ3VydmUgcG9pbnRPblN1cmZhY2UgcG9pbnRQb3NpdGlvbiBwb2xlVmVjdG9yQ29uc3RyYWludCBwb2x5QXBwZW5kICcgK1xuICAgICAgJ3BvbHlBcHBlbmRGYWNldEN0eCBwb2x5QXBwZW5kVmVydGV4IHBvbHlBdXRvUHJvamVjdGlvbiBwb2x5QXZlcmFnZU5vcm1hbCAnICtcbiAgICAgICdwb2x5QXZlcmFnZVZlcnRleCBwb2x5QmV2ZWwgcG9seUJsZW5kQ29sb3IgcG9seUJsaW5kRGF0YSBwb2x5Qm9vbE9wIHBvbHlCcmlkZ2VFZGdlICcgK1xuICAgICAgJ3BvbHlDYWNoZU1vbml0b3IgcG9seUNoZWNrIHBvbHlDaGlwT2ZmIHBvbHlDbGlwYm9hcmQgcG9seUNsb3NlQm9yZGVyIHBvbHlDb2xsYXBzZUVkZ2UgJyArXG4gICAgICAncG9seUNvbGxhcHNlRmFjZXQgcG9seUNvbG9yQmxpbmREYXRhIHBvbHlDb2xvckRlbCBwb2x5Q29sb3JQZXJWZXJ0ZXggcG9seUNvbG9yU2V0ICcgK1xuICAgICAgJ3BvbHlDb21wYXJlIHBvbHlDb25lIHBvbHlDb3B5VVYgcG9seUNyZWFzZSBwb2x5Q3JlYXNlQ3R4IHBvbHlDcmVhdGVGYWNldCAnICtcbiAgICAgICdwb2x5Q3JlYXRlRmFjZXRDdHggcG9seUN1YmUgcG9seUN1dCBwb2x5Q3V0Q3R4IHBvbHlDeWxpbmRlciBwb2x5Q3lsaW5kcmljYWxQcm9qZWN0aW9uICcgK1xuICAgICAgJ3BvbHlEZWxFZGdlIHBvbHlEZWxGYWNldCBwb2x5RGVsVmVydGV4IHBvbHlEdXBsaWNhdGVBbmRDb25uZWN0IHBvbHlEdXBsaWNhdGVFZGdlICcgK1xuICAgICAgJ3BvbHlFZGl0VVYgcG9seUVkaXRVVlNoZWxsIHBvbHlFdmFsdWF0ZSBwb2x5RXh0cnVkZUVkZ2UgcG9seUV4dHJ1ZGVGYWNldCAnICtcbiAgICAgICdwb2x5RXh0cnVkZVZlcnRleCBwb2x5RmxpcEVkZ2UgcG9seUZsaXBVViBwb2x5Rm9yY2VVViBwb2x5R2VvU2FtcGxlciBwb2x5SGVsaXggJyArXG4gICAgICAncG9seUluZm8gcG9seUluc3RhbGxBY3Rpb24gcG9seUxheW91dFVWIHBvbHlMaXN0Q29tcG9uZW50Q29udmVyc2lvbiBwb2x5TWFwQ3V0ICcgK1xuICAgICAgJ3BvbHlNYXBEZWwgcG9seU1hcFNldyBwb2x5TWFwU2V3TW92ZSBwb2x5TWVyZ2VFZGdlIHBvbHlNZXJnZUVkZ2VDdHggcG9seU1lcmdlRmFjZXQgJyArXG4gICAgICAncG9seU1lcmdlRmFjZXRDdHggcG9seU1lcmdlVVYgcG9seU1lcmdlVmVydGV4IHBvbHlNaXJyb3JGYWNlIHBvbHlNb3ZlRWRnZSAnICtcbiAgICAgICdwb2x5TW92ZUZhY2V0IHBvbHlNb3ZlRmFjZXRVViBwb2x5TW92ZVVWIHBvbHlNb3ZlVmVydGV4IHBvbHlOb3JtYWwgcG9seU5vcm1hbFBlclZlcnRleCAnICtcbiAgICAgICdwb2x5Tm9ybWFsaXplVVYgcG9seU9wdFV2cyBwb2x5T3B0aW9ucyBwb2x5T3V0cHV0IHBvbHlQaXBlIHBvbHlQbGFuYXJQcm9qZWN0aW9uICcgK1xuICAgICAgJ3BvbHlQbGFuZSBwb2x5UGxhdG9uaWNTb2xpZCBwb2x5UG9rZSBwb2x5UHJpbWl0aXZlIHBvbHlQcmlzbSBwb2x5UHJvamVjdGlvbiAnICtcbiAgICAgICdwb2x5UHlyYW1pZCBwb2x5UXVhZCBwb2x5UXVlcnlCbGluZERhdGEgcG9seVJlZHVjZSBwb2x5U2VsZWN0IHBvbHlTZWxlY3RDb25zdHJhaW50ICcgK1xuICAgICAgJ3BvbHlTZWxlY3RDb25zdHJhaW50TW9uaXRvciBwb2x5U2VsZWN0Q3R4IHBvbHlTZWxlY3RFZGl0Q3R4IHBvbHlTZXBhcmF0ZSAnICtcbiAgICAgICdwb2x5U2V0VG9GYWNlTm9ybWFsIHBvbHlTZXdFZGdlIHBvbHlTaG9ydGVzdFBhdGhDdHggcG9seVNtb290aCBwb2x5U29mdEVkZ2UgJyArXG4gICAgICAncG9seVNwaGVyZSBwb2x5U3BoZXJpY2FsUHJvamVjdGlvbiBwb2x5U3BsaXQgcG9seVNwbGl0Q3R4IHBvbHlTcGxpdEVkZ2UgcG9seVNwbGl0UmluZyAnICtcbiAgICAgICdwb2x5U3BsaXRWZXJ0ZXggcG9seVN0cmFpZ2h0ZW5VVkJvcmRlciBwb2x5U3ViZGl2aWRlRWRnZSBwb2x5U3ViZGl2aWRlRmFjZXQgJyArXG4gICAgICAncG9seVRvU3ViZGl2IHBvbHlUb3J1cyBwb2x5VHJhbnNmZXIgcG9seVRyaWFuZ3VsYXRlIHBvbHlVVlNldCBwb2x5VW5pdGUgcG9seVdlZGdlRmFjZSAnICtcbiAgICAgICdwb3BlbiBwb3B1cE1lbnUgcG9zZSBwb3cgcHJlbG9hZFJlZkVkIHByaW50IHByb2dyZXNzQmFyIHByb2dyZXNzV2luZG93IHByb2pGaWxlVmlld2VyICcgK1xuICAgICAgJ3Byb2plY3RDdXJ2ZSBwcm9qZWN0VGFuZ2VudCBwcm9qZWN0aW9uQ29udGV4dCBwcm9qZWN0aW9uTWFuaXAgcHJvbXB0RGlhbG9nIHByb3BNb2RDdHggJyArXG4gICAgICAncHJvcE1vdmUgcHNkQ2hhbm5lbE91dGxpbmVyIHBzZEVkaXRUZXh0dXJlRmlsZSBwc2RFeHBvcnQgcHNkVGV4dHVyZUZpbGUgcHV0ZW52IHB3ZCAnICtcbiAgICAgICdweXRob24gcXVlcnlTdWJkaXYgcXVpdCByYWRfdG9fZGVnIHJhZGlhbCByYWRpb0J1dHRvbiByYWRpb0J1dHRvbkdycCByYWRpb0NvbGxlY3Rpb24gJyArXG4gICAgICAncmFkaW9NZW51SXRlbUNvbGxlY3Rpb24gcmFtcENvbG9yUG9ydCByYW5kIHJhbmRvbWl6ZUZvbGxpY2xlcyByYW5kc3RhdGUgcmFuZ2VDb250cm9sICcgK1xuICAgICAgJ3JlYWRUYWtlIHJlYnVpbGRDdXJ2ZSByZWJ1aWxkU3VyZmFjZSByZWNvcmRBdHRyIHJlY29yZERldmljZSByZWRvIHJlZmVyZW5jZSAnICtcbiAgICAgICdyZWZlcmVuY2VFZGl0IHJlZmVyZW5jZVF1ZXJ5IHJlZmluZVN1YmRpdlNlbGVjdGlvbkxpc3QgcmVmcmVzaCByZWZyZXNoQUUgJyArXG4gICAgICAncmVnaXN0ZXJQbHVnaW5SZXNvdXJjZSByZWhhc2ggcmVsb2FkSW1hZ2UgcmVtb3ZlSm9pbnQgcmVtb3ZlTXVsdGlJbnN0YW5jZSAnICtcbiAgICAgICdyZW1vdmVQYW5lbENhdGVnb3J5IHJlbmFtZSByZW5hbWVBdHRyIHJlbmFtZVNlbGVjdGlvbkxpc3QgcmVuYW1lVUkgcmVuZGVyICcgK1xuICAgICAgJ3JlbmRlckdsb2JhbHNOb2RlIHJlbmRlckluZm8gcmVuZGVyTGF5ZXJCdXR0b24gcmVuZGVyTGF5ZXJQYXJlbnQgJyArXG4gICAgICAncmVuZGVyTGF5ZXJQb3N0UHJvY2VzcyByZW5kZXJMYXllclVucGFyZW50IHJlbmRlck1hbmlwIHJlbmRlclBhcnRpdGlvbiAnICtcbiAgICAgICdyZW5kZXJRdWFsaXR5Tm9kZSByZW5kZXJTZXR0aW5ncyByZW5kZXJUaHVtYm5haWxVcGRhdGUgcmVuZGVyV2luZG93RWRpdG9yICcgK1xuICAgICAgJ3JlbmRlcldpbmRvd1NlbGVjdENvbnRleHQgcmVuZGVyZXIgcmVvcmRlciByZW9yZGVyRGVmb3JtZXJzIHJlcXVpcmVzIHJlcm9vdCAnICtcbiAgICAgICdyZXNhbXBsZUZsdWlkIHJlc2V0QUUgcmVzZXRQZnhUb1BvbHlDYW1lcmEgcmVzZXRUb29sIHJlc29sdXRpb25Ob2RlIHJldGFyZ2V0ICcgK1xuICAgICAgJ3JldmVyc2VDdXJ2ZSByZXZlcnNlU3VyZmFjZSByZXZvbHZlIHJnYl90b19oc3YgcmlnaWRCb2R5IHJpZ2lkU29sdmVyIHJvbGwgcm9sbEN0eCAnICtcbiAgICAgICdyb290T2Ygcm90IHJvdGF0ZSByb3RhdGlvbkludGVycG9sYXRpb24gcm91bmRDb25zdGFudFJhZGl1cyByb3dDb2x1bW5MYXlvdXQgcm93TGF5b3V0ICcgK1xuICAgICAgJ3J1blRpbWVDb21tYW5kIHJ1bnVwIHNhbXBsZUltYWdlIHNhdmVBbGxTaGVsdmVzIHNhdmVBdHRyUHJlc2V0IHNhdmVGbHVpZCBzYXZlSW1hZ2UgJyArXG4gICAgICAnc2F2ZUluaXRpYWxTdGF0ZSBzYXZlTWVudSBzYXZlUHJlZk9iamVjdHMgc2F2ZVByZWZzIHNhdmVTaGVsZiBzYXZlVG9vbFNldHRpbmdzIHNjYWxlICcgK1xuICAgICAgJ3NjYWxlQnJ1c2hCcmlnaHRuZXNzIHNjYWxlQ29tcG9uZW50cyBzY2FsZUNvbnN0cmFpbnQgc2NhbGVLZXkgc2NhbGVLZXlDdHggc2NlbmVFZGl0b3IgJyArXG4gICAgICAnc2NlbmVVSVJlcGxhY2VtZW50IHNjbWggc2NyaXB0Q3R4IHNjcmlwdEVkaXRvckluZm8gc2NyaXB0Sm9iIHNjcmlwdE5vZGUgc2NyaXB0VGFibGUgJyArXG4gICAgICAnc2NyaXB0VG9TaGVsZiBzY3JpcHRlZFBhbmVsIHNjcmlwdGVkUGFuZWxUeXBlIHNjcm9sbEZpZWxkIHNjcm9sbExheW91dCBzY3VscHQgJyArXG4gICAgICAnc2VhcmNoUGF0aEFycmF5IHNlZWQgc2VsTG9hZFNldHRpbmdzIHNlbGVjdCBzZWxlY3RDb250ZXh0IHNlbGVjdEN1cnZlQ1Ygc2VsZWN0S2V5ICcgK1xuICAgICAgJ3NlbGVjdEtleUN0eCBzZWxlY3RLZXlmcmFtZVJlZ2lvbkN0eCBzZWxlY3RNb2RlIHNlbGVjdFByZWYgc2VsZWN0UHJpb3JpdHkgc2VsZWN0VHlwZSAnICtcbiAgICAgICdzZWxlY3RlZE5vZGVzIHNlbGVjdGlvbkNvbm5lY3Rpb24gc2VwYXJhdG9yIHNldEF0dHIgc2V0QXR0ckVudW1SZXNvdXJjZSAnICtcbiAgICAgICdzZXRBdHRyTWFwcGluZyBzZXRBdHRyTmljZU5hbWVSZXNvdXJjZSBzZXRDb25zdHJhaW50UmVzdFBvc2l0aW9uICcgK1xuICAgICAgJ3NldERlZmF1bHRTaGFkaW5nR3JvdXAgc2V0RHJpdmVuS2V5ZnJhbWUgc2V0RHluYW1pYyBzZXRFZGl0Q3R4IHNldEVkaXRvciBzZXRGbHVpZEF0dHIgJyArXG4gICAgICAnc2V0Rm9jdXMgc2V0SW5maW5pdHkgc2V0SW5wdXREZXZpY2VNYXBwaW5nIHNldEtleUN0eCBzZXRLZXlQYXRoIHNldEtleWZyYW1lICcgK1xuICAgICAgJ3NldEtleWZyYW1lQmxlbmRzaGFwZVRhcmdldFd0cyBzZXRNZW51TW9kZSBzZXROb2RlTmljZU5hbWVSZXNvdXJjZSBzZXROb2RlVHlwZUZsYWcgJyArXG4gICAgICAnc2V0UGFyZW50IHNldFBhcnRpY2xlQXR0ciBzZXRQZnhUb1BvbHlDYW1lcmEgc2V0UGx1Z2luUmVzb3VyY2Ugc2V0UHJvamVjdCAnICtcbiAgICAgICdzZXRTdGFtcERlbnNpdHkgc2V0U3RhcnR1cE1lc3NhZ2Ugc2V0U3RhdGUgc2V0VG9vbFRvIHNldFVJVGVtcGxhdGUgc2V0WGZvcm1NYW5pcCBzZXRzICcgK1xuICAgICAgJ3NoYWRpbmdDb25uZWN0aW9uIHNoYWRpbmdHZW9tZXRyeVJlbEN0eCBzaGFkaW5nTGlnaHRSZWxDdHggc2hhZGluZ05ldHdvcmtDb21wYXJlICcgK1xuICAgICAgJ3NoYWRpbmdOb2RlIHNoYXBlQ29tcGFyZSBzaGVsZkJ1dHRvbiBzaGVsZkxheW91dCBzaGVsZlRhYkxheW91dCBzaGVsbEZpZWxkICcgK1xuICAgICAgJ3Nob3J0TmFtZU9mIHNob3dIZWxwIHNob3dIaWRkZW4gc2hvd01hbmlwQ3R4IHNob3dTZWxlY3Rpb25JblRpdGxlICcgK1xuICAgICAgJ3Nob3dTaGFkaW5nR3JvdXBBdHRyRWRpdG9yIHNob3dXaW5kb3cgc2lnbiBzaW1wbGlmeSBzaW4gc2luZ2xlUHJvZmlsZUJpcmFpbFN1cmZhY2UgJyArXG4gICAgICAnc2l6ZSBzaXplQnl0ZXMgc2tpbkNsdXN0ZXIgc2tpblBlcmNlbnQgc21vb3RoQ3VydmUgc21vb3RoVGFuZ2VudFN1cmZhY2Ugc21vb3Roc3RlcCAnICtcbiAgICAgICdzbmFwMnRvMiBzbmFwS2V5IHNuYXBNb2RlIHNuYXBUb2dldGhlckN0eCBzbmFwc2hvdCBzb2Z0IHNvZnRNb2Qgc29mdE1vZEN0eCBzb3J0IHNvdW5kICcgK1xuICAgICAgJ3NvdW5kQ29udHJvbCBzb3VyY2Ugc3BhY2VMb2NhdG9yIHNwaGVyZSBzcGhyYW5kIHNwb3RMaWdodCBzcG90TGlnaHRQcmV2aWV3UG9ydCAnICtcbiAgICAgICdzcHJlYWRTaGVldEVkaXRvciBzcHJpbmcgc3FydCBzcXVhcmVTdXJmYWNlIHNydENvbnRleHQgc3RhY2tUcmFjZSBzdGFydFN0cmluZyAnICtcbiAgICAgICdzdGFydHNXaXRoIHN0aXRjaEFuZEV4cGxvZGVTaGVsbCBzdGl0Y2hTdXJmYWNlIHN0aXRjaFN1cmZhY2VQb2ludHMgc3RyY21wICcgK1xuICAgICAgJ3N0cmluZ0FycmF5Q2F0ZW5hdGUgc3RyaW5nQXJyYXlDb250YWlucyBzdHJpbmdBcnJheUNvdW50IHN0cmluZ0FycmF5SW5zZXJ0QXRJbmRleCAnICtcbiAgICAgICdzdHJpbmdBcnJheUludGVyc2VjdG9yIHN0cmluZ0FycmF5UmVtb3ZlIHN0cmluZ0FycmF5UmVtb3ZlQXRJbmRleCAnICtcbiAgICAgICdzdHJpbmdBcnJheVJlbW92ZUR1cGxpY2F0ZXMgc3RyaW5nQXJyYXlSZW1vdmVFeGFjdCBzdHJpbmdBcnJheVRvU3RyaW5nICcgK1xuICAgICAgJ3N0cmluZ1RvU3RyaW5nQXJyYXkgc3RyaXAgc3RyaXBQcmVmaXhGcm9tTmFtZSBzdHJva2Ugc3ViZEF1dG9Qcm9qZWN0aW9uICcgK1xuICAgICAgJ3N1YmRDbGVhblRvcG9sb2d5IHN1YmRDb2xsYXBzZSBzdWJkRHVwbGljYXRlQW5kQ29ubmVjdCBzdWJkRWRpdFVWICcgK1xuICAgICAgJ3N1YmRMaXN0Q29tcG9uZW50Q29udmVyc2lvbiBzdWJkTWFwQ3V0IHN1YmRNYXBTZXdNb3ZlIHN1YmRNYXRjaFRvcG9sb2d5IHN1YmRNaXJyb3IgJyArXG4gICAgICAnc3ViZFRvQmxpbmQgc3ViZFRvUG9seSBzdWJkVHJhbnNmZXJVVnNUb0NhY2hlIHN1YmRpdiBzdWJkaXZDcmVhc2UgJyArXG4gICAgICAnc3ViZGl2RGlzcGxheVNtb290aG5lc3Mgc3Vic3RpdHV0ZSBzdWJzdGl0dXRlQWxsU3RyaW5nIHN1YnN0aXR1dGVHZW9tZXRyeSBzdWJzdHJpbmcgJyArXG4gICAgICAnc3VyZmFjZSBzdXJmYWNlU2FtcGxlciBzdXJmYWNlU2hhZGVyTGlzdCBzd2F0Y2hEaXNwbGF5UG9ydCBzd2l0Y2hUYWJsZSBzeW1ib2xCdXR0b24gJyArXG4gICAgICAnc3ltYm9sQ2hlY2tCb3ggc3lzRmlsZSBzeXN0ZW0gdGFiTGF5b3V0IHRhbiB0YW5nZW50Q29uc3RyYWludCB0ZXhMYXR0aWNlRGVmb3JtQ29udGV4dCAnICtcbiAgICAgICd0ZXhNYW5pcENvbnRleHQgdGV4TW92ZUNvbnRleHQgdGV4TW92ZVVWU2hlbGxDb250ZXh0IHRleFJvdGF0ZUNvbnRleHQgdGV4U2NhbGVDb250ZXh0ICcgK1xuICAgICAgJ3RleFNlbGVjdENvbnRleHQgdGV4U2VsZWN0U2hvcnRlc3RQYXRoQ3R4IHRleFNtdWRnZVVWQ29udGV4dCB0ZXhXaW5Ub29sQ3R4IHRleHQgJyArXG4gICAgICAndGV4dEN1cnZlcyB0ZXh0RmllbGQgdGV4dEZpZWxkQnV0dG9uR3JwIHRleHRGaWVsZEdycCB0ZXh0TWFuaXAgdGV4dFNjcm9sbExpc3QgJyArXG4gICAgICAndGV4dFRvU2hlbGYgdGV4dHVyZURpc3BsYWNlUGxhbmUgdGV4dHVyZUhhaXJDb2xvciB0ZXh0dXJlUGxhY2VtZW50Q29udGV4dCAnICtcbiAgICAgICd0ZXh0dXJlV2luZG93IHRocmVhZENvdW50IHRocmVlUG9pbnRBcmNDdHggdGltZUNvbnRyb2wgdGltZVBvcnQgdGltZXJYIHRvTmF0aXZlUGF0aCAnICtcbiAgICAgICd0b2dnbGUgdG9nZ2xlQXhpcyB0b2dnbGVXaW5kb3dWaXNpYmlsaXR5IHRva2VuaXplIHRva2VuaXplTGlzdCB0b2xlcmFuY2UgdG9sb3dlciAnICtcbiAgICAgICd0b29sQnV0dG9uIHRvb2xDb2xsZWN0aW9uIHRvb2xEcm9wcGVkIHRvb2xIYXNPcHRpb25zIHRvb2xQcm9wZXJ0eVdpbmRvdyB0b3J1cyB0b3VwcGVyICcgK1xuICAgICAgJ3RyYWNlIHRyYWNrIHRyYWNrQ3R4IHRyYW5zZmVyQXR0cmlidXRlcyB0cmFuc2Zvcm1Db21wYXJlIHRyYW5zZm9ybUxpbWl0cyB0cmFuc2xhdG9yICcgK1xuICAgICAgJ3RyaW0gdHJ1bmMgdHJ1bmNhdGVGbHVpZENhY2hlIHRydW5jYXRlSGFpckNhY2hlIHR1bWJsZSB0dW1ibGVDdHggdHVyYnVsZW5jZSAnICtcbiAgICAgICd0d29Qb2ludEFyY0N0eCB1aVJlcyB1aVRlbXBsYXRlIHVuYXNzaWduSW5wdXREZXZpY2UgdW5kbyB1bmRvSW5mbyB1bmdyb3VwIHVuaWZvcm0gdW5pdCAnICtcbiAgICAgICd1bmxvYWRQbHVnaW4gdW50YW5nbGVVViB1bnRpdGxlZEZpbGVOYW1lIHVudHJpbSB1cEF4aXMgdXBkYXRlQUUgdXNlckN0eCB1dkxpbmsgJyArXG4gICAgICAndXZTbmFwc2hvdCB2YWxpZGF0ZVNoZWxmTmFtZSB2ZWN0b3JpemUgdmlldzJkVG9vbEN0eCB2aWV3Q2FtZXJhIHZpZXdDbGlwUGxhbmUgJyArXG4gICAgICAndmlld0ZpdCB2aWV3SGVhZE9uIHZpZXdMb29rQXQgdmlld01hbmlwIHZpZXdQbGFjZSB2aWV3U2V0IHZpc29yIHZvbHVtZUF4aXMgdm9ydGV4ICcgK1xuICAgICAgJ3dhaXRDdXJzb3Igd2FybmluZyB3ZWJCcm93c2VyIHdlYkJyb3dzZXJQcmVmcyB3aGF0SXMgd2luZG93IHdpbmRvd1ByZWYgd2lyZSAnICtcbiAgICAgICd3aXJlQ29udGV4dCB3b3Jrc3BhY2Ugd3JpbmtsZSB3cmlua2xlQ29udGV4dCB3cml0ZVRha2UgeGJtTGFuZ1BhdGhMaXN0IHhmb3JtJyxcbiAgICBpbGxlZ2FsOiAnPC8nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ2AnLCBlbmQ6ICdgJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCRcXFxcZCcsXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1tcXFxcJFxcXFwlXFxcXEBcXFxcKl0oXFxcXF5cXFxcd1xcXFxifCNcXFxcdyt8W15cXFxcc1xcXFx3e118e1xcXFx3K318XFxcXHcrKSdcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFZBUlMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkXFxcXGQrJ1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkeycsIGVuZDogJ30nXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsIGJlZ2luOiAnW1xcXFwkXFxcXEBdJyArIGhsanMuVU5ERVJTQ09SRV9JREVOVF9SRVxuICAgIH1cbiAgXTtcbiAgdmFyIERFRkFVTFQgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgbGV4ZW1zOiAnW2Etei9fXSsnLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ29uIG9mZiB5ZXMgbm8gdHJ1ZSBmYWxzZSBub25lIGJsb2NrZWQgZGVidWcgaW5mbyBub3RpY2Ugd2FybiBlcnJvciBjcml0ICcgK1xuICAgICAgICAnc2VsZWN0IGJyZWFrIGxhc3QgcGVybWFuZW50IHJlZGlyZWN0IGtxdWV1ZSBydHNpZyBlcG9sbCBwb2xsIC9kZXYvcG9sbCdcbiAgICB9LFxuICAgIHJlbGV2YW5jZTogMCxcbiAgICBpbGxlZ2FsOiAnPT4nLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiBcIidcIiwgZW5kOiBcIidcIixcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd1cmwnLFxuICAgICAgICBiZWdpbjogJyhbYS16XSspOi8nLCBlbmQ6ICdcXFxccycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLCBleGNsdWRlRW5kOiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogXCJcXFxcc1xcXFxeXCIsIGVuZDogXCJcXFxcc3x7fDtcIiwgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpXG4gICAgICB9LFxuICAgICAgLy8gcmVnZXhwIGxvY2F0aW9ucyAofiwgfiopXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiBcIn5cXFxcKj9cXFxccytcIiwgZW5kOiBcIlxcXFxzfHt8O1wiLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXS5jb25jYXQoVkFSUylcbiAgICAgIH0sXG4gICAgICAvLyAqLmV4YW1wbGUuY29tXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgIGJlZ2luOiBcIlxcXFwqKFxcXFwuW2EtelxcXFwtXSspK1wiLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0uY29uY2F0KFZBUlMpXG4gICAgICB9LFxuICAgICAgLy8gc3ViLmV4YW1wbGUuKlxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICBiZWdpbjogXCIoW2EtelxcXFwtXStcXFxcLikrXFxcXCpcIixcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdLmNvbmNhdChWQVJTKVxuICAgICAgfSxcbiAgICAgIC8vIElQXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJcXFxcZHsxLDN9XFxcXC5cXFxcZHsxLDN9XFxcXC5cXFxcZHsxLDN9XFxcXC5cXFxcZHsxLDN9KDpcXFxcZHsxLDV9KT9cXFxcYidcbiAgICAgIH0sXG4gICAgICAvLyB1bml0c1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogJ1xcXFxiXFxcXGQrW2tLbU1nR2RzaGR3eV0qXFxcXGInLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdLmNvbmNhdChWQVJTKVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUgKyAnXFxcXHMnLCBlbmQ6ICc7fHsnLCByZXR1cm5CZWdpbjogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICd0aXRsZScsXG4gICAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFLFxuICAgICAgICAgICAgc3RhcnRzOiBERUZBVUxUXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSxcbiAgICBpbGxlZ2FsOiAnW15cXFxcc1xcXFx9XSdcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBPQkpDX0tFWVdPUkRTID0ge1xuICAgIGtleXdvcmQ6XG4gICAgICAnaW50IGZsb2F0IHdoaWxlIHByaXZhdGUgY2hhciBjYXRjaCBleHBvcnQgc2l6ZW9mIHR5cGVkZWYgY29uc3Qgc3RydWN0IGZvciB1bmlvbiAnICtcbiAgICAgICd1bnNpZ25lZCBsb25nIHZvbGF0aWxlIHN0YXRpYyBwcm90ZWN0ZWQgYm9vbCBtdXRhYmxlIGlmIHB1YmxpYyBkbyByZXR1cm4gZ290byB2b2lkICcgK1xuICAgICAgJ2VudW0gZWxzZSBicmVhayBleHRlcm4gY2xhc3MgYXNtIGNhc2Ugc2hvcnQgZGVmYXVsdCBkb3VibGUgdGhyb3cgcmVnaXN0ZXIgZXhwbGljaXQgJyArXG4gICAgICAnc2lnbmVkIHR5cGVuYW1lIHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSB3Y2hhcl90IGlubGluZSByZWFkb25seSBhc3NpZ24gcHJvcGVydHkgJyArXG4gICAgICAncHJvdG9jb2wgc2VsZiBzeW5jaHJvbml6ZWQgZW5kIHN5bnRoZXNpemUgaWQgb3B0aW9uYWwgcmVxdWlyZWQgaW1wbGVtZW50YXRpb24gJyArXG4gICAgICAnbm9uYXRvbWljIGludGVyZmFjZSBzdXBlciB1bmljaGFyIGZpbmFsbHkgZHluYW1pYyBJQk91dGxldCBJQkFjdGlvbiBzZWxlY3RvciBzdHJvbmcgJyArXG4gICAgICAnd2VhayByZWFkb25seScsXG4gICAgbGl0ZXJhbDpcbiAgICBcdCdmYWxzZSB0cnVlIEZBTFNFIFRSVUUgbmlsIFlFUyBOTyBOVUxMJyxcbiAgICBidWlsdF9pbjpcbiAgICAgICdOU1N0cmluZyBOU0RpY3Rpb25hcnkgQ0dSZWN0IENHUG9pbnQgVUlCdXR0b24gVUlMYWJlbCBVSVRleHRWaWV3IFVJV2ViVmlldyBNS01hcFZpZXcgJyArXG4gICAgICAnVUlTZWdtZW50ZWRDb250cm9sIE5TT2JqZWN0IFVJVGFibGVWaWV3RGVsZWdhdGUgVUlUYWJsZVZpZXdEYXRhU291cmNlIE5TVGhyZWFkICcgK1xuICAgICAgJ1VJQWN0aXZpdHlJbmRpY2F0b3IgVUlUYWJiYXIgVUlUb29sQmFyIFVJQmFyQnV0dG9uSXRlbSBVSUltYWdlVmlldyBOU0F1dG9yZWxlYXNlUG9vbCAnICtcbiAgICAgICdVSVRhYmxlVmlldyBCT09MIE5TSW50ZWdlciBDR0Zsb2F0IE5TRXhjZXB0aW9uIE5TTG9nIE5TTXV0YWJsZVN0cmluZyBOU011dGFibGVBcnJheSAnICtcbiAgICAgICdOU011dGFibGVEaWN0aW9uYXJ5IE5TVVJMIE5TSW5kZXhQYXRoIENHU2l6ZSBVSVRhYmxlVmlld0NlbGwgVUlWaWV3IFVJVmlld0NvbnRyb2xsZXIgJyArXG4gICAgICAnVUlOYXZpZ2F0aW9uQmFyIFVJTmF2aWdhdGlvbkNvbnRyb2xsZXIgVUlUYWJCYXJDb250cm9sbGVyIFVJUG9wb3ZlckNvbnRyb2xsZXIgJyArXG4gICAgICAnVUlQb3BvdmVyQ29udHJvbGxlckRlbGVnYXRlIFVJSW1hZ2UgTlNOdW1iZXIgVUlTZWFyY2hCYXIgTlNGZXRjaGVkUmVzdWx0c0NvbnRyb2xsZXIgJyArXG4gICAgICAnTlNGZXRjaGVkUmVzdWx0c0NoYW5nZVR5cGUgVUlTY3JvbGxWaWV3IFVJU2Nyb2xsVmlld0RlbGVnYXRlIFVJRWRnZUluc2V0cyBVSUNvbG9yICcgK1xuICAgICAgJ1VJRm9udCBVSUFwcGxpY2F0aW9uIE5TTm90Rm91bmQgTlNOb3RpZmljYXRpb25DZW50ZXIgTlNOb3RpZmljYXRpb24gJyArXG4gICAgICAnVUlMb2NhbE5vdGlmaWNhdGlvbiBOU0J1bmRsZSBOU0ZpbGVNYW5hZ2VyIE5TVGltZUludGVydmFsIE5TRGF0ZSBOU0NhbGVuZGFyICcgK1xuICAgICAgJ05TVXNlckRlZmF1bHRzIFVJV2luZG93IE5TUmFuZ2UgTlNBcnJheSBOU0Vycm9yIE5TVVJMUmVxdWVzdCBOU1VSTENvbm5lY3Rpb24gY2xhc3MgJyArXG4gICAgICAnVUlJbnRlcmZhY2VPcmllbnRhdGlvbiBNUE1vdmllUGxheWVyQ29udHJvbGxlciBkaXNwYXRjaF9vbmNlX3QgJyArXG4gICAgICAnZGlzcGF0Y2hfcXVldWVfdCBkaXNwYXRjaF9zeW5jIGRpc3BhdGNoX2FzeW5jIGRpc3BhdGNoX29uY2UnXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IE9CSkNfS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXFwnJyxcbiAgICAgICAgZW5kOiAnW15cXFxcXFxcXF1cXCcnLFxuICAgICAgICBpbGxlZ2FsOiAnW15cXFxcXFxcXF1bXlxcJ10nXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnI2ltcG9ydCcsXG4gICAgICAgIGVuZDogJyQnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGJlZ2luOiAnXFxcIicsXG4gICAgICAgICAgZW5kOiAnXFxcIidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBiZWdpbjogJzwnLFxuICAgICAgICAgIGVuZDogJz4nXG4gICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjJyxcbiAgICAgICAgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgZW5kOiAnKHt8JCknLFxuICAgICAgICBrZXl3b3JkczogJ2ludGVyZmFjZSBjbGFzcyBwcm90b2NvbCBpbXBsZW1lbnRhdGlvbicsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ2lkJyxcbiAgICAgICAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFwuJytobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIHN1Ykxhbmd1YWdlOiAneG1sJyxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdeIycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcXFxcXnJlbXsnLCBlbmQ6ICd9JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbJ3NlbGYnXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICdeQCg/OkJBU0V8VVNFfENMQVNTfE9QVElPTlMpJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgYmVnaW46ICdAW1xcXFx3XFxcXC1dK1xcXFxbW1xcXFx3XjtcXFxcLV0qXFxcXF0oPzpcXFxcW1tcXFxcd147XFxcXC1dKlxcXFxdKT8oPzouKikkJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgICBiZWdpbjogJ1xcXFwkXFxcXHs/W1xcXFx3XFxcXC1cXFxcLlxcXFw6XStcXFxcfT8nXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdrZXl3b3JkJyxcbiAgICAgICAgYmVnaW46ICdcXFxcXltcXFxcd1xcXFwtXFxcXC5cXFxcOl0rJ1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46ICdcXFxcXiNbMC05YS1mQS1GXSsnXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFBFUkxfS0VZV09SRFMgPSAnZ2V0cHdlbnQgZ2V0c2VydmVudCBxdW90ZW1ldGEgbXNncmN2IHNjYWxhciBraWxsIGRibWNsb3NlIHVuZGVmIGxjICcgK1xuICAgICdtYSBzeXN3cml0ZSB0ciBzZW5kIHVtYXNrIHN5c29wZW4gc2htd3JpdGUgdmVjIHF4IHV0aW1lIGxvY2FsIG9jdCBzZW1jdGwgbG9jYWx0aW1lICcgK1xuICAgICdyZWFkcGlwZSBkbyByZXR1cm4gZm9ybWF0IHJlYWQgc3ByaW50ZiBkYm1vcGVuIHBvcCBnZXRwZ3JwIG5vdCBnZXRwd25hbSByZXdpbmRkaXIgcXEnICtcbiAgICAnZmlsZW5vIHF3IGVuZHByb3RvZW50IHdhaXQgc2V0aG9zdGVudCBibGVzcyBzfDAgb3BlbmRpciBjb250aW51ZSBlYWNoIHNsZWVwIGVuZGdyZW50ICcgK1xuICAgICdzaHV0ZG93biBkdW1wIGNob21wIGNvbm5lY3QgZ2V0c29ja25hbWUgZGllIHNvY2tldHBhaXIgY2xvc2UgZmxvY2sgZXhpc3RzIGluZGV4IHNobWdldCcgK1xuICAgICdzdWIgZm9yIGVuZHB3ZW50IHJlZG8gbHN0YXQgbXNnY3RsIHNldHBncnAgYWJzIGV4aXQgc2VsZWN0IHByaW50IHJlZiBnZXRob3N0YnlhZGRyICcgK1xuICAgICd1bnNoaWZ0IGZjbnRsIHN5c2NhbGwgZ290byBnZXRuZXRieWFkZHIgam9pbiBnbXRpbWUgc3ltbGluayBzZW1nZXQgc3BsaWNlIHh8MCAnICtcbiAgICAnZ2V0cGVlcm5hbWUgcmVjdiBsb2cgc2V0c29ja29wdCBjb3MgbGFzdCByZXZlcnNlIGdldGhvc3RieW5hbWUgZ2V0Z3JuYW0gc3R1ZHkgZm9ybWxpbmUgJyArXG4gICAgJ2VuZGhvc3RlbnQgdGltZXMgY2hvcCBsZW5ndGggZ2V0aG9zdGVudCBnZXRuZXRlbnQgcGFjayBnZXRwcm90b2VudCBnZXRzZXJ2YnluYW1lIHJhbmQgJyArXG4gICAgJ21rZGlyIHBvcyBjaG1vZCB5fDAgc3Vic3RyIGVuZG5ldGVudCBwcmludGYgbmV4dCBvcGVuIG1zZ3NuZCByZWFkZGlyIHVzZSB1bmxpbmsgJyArXG4gICAgJ2dldHNvY2tvcHQgZ2V0cHJpb3JpdHkgcmluZGV4IHdhbnRhcnJheSBoZXggc3lzdGVtIGdldHNlcnZieXBvcnQgZW5kc2VydmVudCBpbnQgY2hyICcgK1xuICAgICd1bnRpZSBybWRpciBwcm90b3R5cGUgdGVsbCBsaXN0ZW4gZm9yayBzaG1yZWFkIHVjZmlyc3Qgc2V0cHJvdG9lbnQgZWxzZSBzeXNzZWVrIGxpbmsgJyArXG4gICAgJ2dldGdyZ2lkIHNobWN0bCB3YWl0cGlkIHVucGFjayBnZXRuZXRieW5hbWUgcmVzZXQgY2hkaXIgZ3JlcCBzcGxpdCByZXF1aXJlIGNhbGxlciAnICtcbiAgICAnbGNmaXJzdCB1bnRpbCB3YXJuIHdoaWxlIHZhbHVlcyBzaGlmdCB0ZWxsZGlyIGdldHB3dWlkIG15IGdldHByb3RvYnludW1iZXIgZGVsZXRlIGFuZCAnICtcbiAgICAnc29ydCB1YyBkZWZpbmVkIHNyYW5kIGFjY2VwdCBwYWNrYWdlIHNlZWtkaXIgZ2V0cHJvdG9ieW5hbWUgc2Vtb3Agb3VyIHJlbmFtZSBzZWVrIGlmIHF8MCAnICtcbiAgICAnY2hyb290IHN5c3JlYWQgc2V0cHdlbnQgbm8gY3J5cHQgZ2V0YyBjaG93biBzcXJ0IHdyaXRlIHNldG5ldGVudCBzZXRwcmlvcml0eSBmb3JlYWNoICcgK1xuICAgICd0aWUgc2luIG1zZ2dldCBtYXAgc3RhdCBnZXRsb2dpbiB1bmxlc3MgZWxzaWYgdHJ1bmNhdGUgZXhlYyBrZXlzIGdsb2IgdGllZCBjbG9zZWRpcicgK1xuICAgICdpb2N0bCBzb2NrZXQgcmVhZGxpbmsgZXZhbCB4b3IgcmVhZGxpbmUgYmlubW9kZSBzZXRzZXJ2ZW50IGVvZiBvcmQgYmluZCBhbGFybSBwaXBlICcgK1xuICAgICdhdGFuMiBnZXRncmVudCBleHAgdGltZSBwdXNoIHNldGdyZW50IGd0IGx0IG9yIG5lIG18MCBicmVhayBnaXZlbiBzYXkgc3RhdGUgd2hlbic7XG4gIHZhciBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46ICdbJEBdXFxcXHsnLCBlbmQ6ICdcXFxcfScsXG4gICAga2V5d29yZHM6IFBFUkxfS0VZV09SRFMsXG4gICAgcmVsZXZhbmNlOiAxMFxuICB9O1xuICB2YXIgVkFSMSA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdcXFxcJFxcXFxkJ1xuICB9O1xuICB2YXIgVkFSMiA9IHtcbiAgICBjbGFzc05hbWU6ICd2YXJpYWJsZScsXG4gICAgYmVnaW46ICdbXFxcXCRcXFxcJVxcXFxAXFxcXCpdKFxcXFxeXFxcXHdcXFxcYnwjXFxcXHcrKFxcXFw6XFxcXDpcXFxcdyspKnxbXlxcXFxzXFxcXHd7XXx7XFxcXHcrfXxcXFxcdysoXFxcXDpcXFxcOlxcXFx3KikqKSdcbiAgfTtcbiAgdmFyIFNUUklOR19DT05UQUlOUyA9IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNULCBWQVIxLCBWQVIyXTtcbiAgdmFyIE1FVEhPRCA9IHtcbiAgICBiZWdpbjogJy0+JyxcbiAgICBjb250YWluczogW1xuICAgICAge2JlZ2luOiBobGpzLklERU5UX1JFfSxcbiAgICAgIHtiZWdpbjogJ3snLCBlbmQ6ICd9J31cbiAgICBdXG4gIH07XG4gIHZhciBDT01NRU5UID0ge1xuICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgIGJlZ2luOiAnXihfX0VORF9ffF9fREFUQV9fKScsIGVuZDogJ1xcXFxuJCcsXG4gICAgcmVsZXZhbmNlOiA1XG4gIH1cbiAgdmFyIFBFUkxfREVGQVVMVF9DT05UQUlOUyA9IFtcbiAgICBWQVIxLCBWQVIyLFxuICAgIGhsanMuSEFTSF9DT01NRU5UX01PREUsXG4gICAgQ09NTUVOVCxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgIGJlZ2luOiAnXlxcXFw9XFxcXHcnLCBlbmQ6ICdcXFxcPWN1dCcsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgfSxcbiAgICBNRVRIT0QsXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcKCcsIGVuZDogJ1xcXFwpJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXFsnLCBlbmQ6ICdcXFxcXScsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxW3F3eHJdP1xcXFxzKlxcXFx7JywgZW5kOiAnXFxcXH0nLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAncVtxd3hyXT9cXFxccypcXFxcfCcsIGVuZDogJ1xcXFx8JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ3FbcXd4cl0/XFxcXHMqXFxcXDwnLCBlbmQ6ICdcXFxcPicsXG4gICAgICBjb250YWluczogU1RSSU5HX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiA1XG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICdxd1xcXFxzK3EnLCBlbmQ6ICdxJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJJTkdfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDVcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFNUUklOR19DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnYCcsIGVuZDogJ2AnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICd7XFxcXHcrfScsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1xcLT9cXFxcdytcXFxccypcXFxcPVxcXFw+JyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiAnKFxcXFxiMFswLTdfXSspfChcXFxcYjB4WzAtOWEtZkEtRl9dKyl8KFxcXFxiWzEtOV1bMC05X10qKFxcXFwuWzAtOV9dKyk/KXxbMF9dXFxcXGInLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7IC8vIHJlZ2V4cCBjb250YWluZXJcbiAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJ3xcXFxcYihzcGxpdHxyZXR1cm58cHJpbnR8cmV2ZXJzZXxncmVwKVxcXFxiKVxcXFxzKicsXG4gICAgICBrZXl3b3JkczogJ3NwbGl0IHJldHVybiBwcmludCByZXZlcnNlIGdyZXAnLFxuICAgICAgcmVsZXZhbmNlOiAwLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgICAgQ09NTUVOVCxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgYmVnaW46ICcoc3x0cnx5KS8oXFxcXFxcXFwufFteL10pKi8oXFxcXFxcXFwufFteL10pKi9bYS16XSonLFxuICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3JlZ2V4cCcsXG4gICAgICAgICAgYmVnaW46ICcobXxxcik/LycsIGVuZDogJy9bYS16XSonLFxuICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgICByZWxldmFuY2U6IDAgLy8gYWxsb3dzIGVtcHR5IFwiLy9cIiB3aGljaCBpcyBhIGNvbW1vbiBjb21tZW50IGRlbGltaXRlciBpbiBvdGhlciBsYW5ndWFnZXNcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3ViJyxcbiAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyhcXFxccypcXFxcKC4qP1xcXFwpKT9bO3tdJyxcbiAgICAgIGtleXdvcmRzOiAnc3ViJyxcbiAgICAgIHJlbGV2YW5jZTogNVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnb3BlcmF0b3InLFxuICAgICAgYmVnaW46ICctXFxcXHdcXFxcYicsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9XG4gIF07XG4gIFNVQlNULmNvbnRhaW5zID0gUEVSTF9ERUZBVUxUX0NPTlRBSU5TO1xuICBNRVRIT0QuY29udGFpbnNbMV0uY29udGFpbnMgPSBQRVJMX0RFRkFVTFRfQ09OVEFJTlM7XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogUEVSTF9LRVlXT1JEUyxcbiAgICBjb250YWluczogUEVSTF9ERUZBVUxUX0NPTlRBSU5TXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgVkFSSUFCTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLCBiZWdpbjogJ1xcXFwkK1thLXpBLVpfXFx4N2YtXFx4ZmZdW2EtekEtWjAtOV9cXHg3Zi1cXHhmZl0qJ1xuICB9O1xuICB2YXIgU1RSSU5HUyA9IFtcbiAgICBobGpzLmluaGVyaXQoaGxqcy5BUE9TX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ2JcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnYlxcJycsIGVuZDogJ1xcJycsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICB9XG4gIF07XG4gIHZhciBOVU1CRVJTID0gW2hsanMuQklOQVJZX05VTUJFUl9NT0RFLCBobGpzLkNfTlVNQkVSX01PREVdO1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHJldHVybiB7XG4gICAgY2FzZV9pbnNlbnNpdGl2ZTogdHJ1ZSxcbiAgICBrZXl3b3JkczpcbiAgICAgICdhbmQgaW5jbHVkZV9vbmNlIGxpc3QgYWJzdHJhY3QgZ2xvYmFsIHByaXZhdGUgZWNobyBpbnRlcmZhY2UgYXMgc3RhdGljIGVuZHN3aXRjaCAnICtcbiAgICAgICdhcnJheSBudWxsIGlmIGVuZHdoaWxlIG9yIGNvbnN0IGZvciBlbmRmb3JlYWNoIHNlbGYgdmFyIHdoaWxlIGlzc2V0IHB1YmxpYyAnICtcbiAgICAgICdwcm90ZWN0ZWQgZXhpdCBmb3JlYWNoIHRocm93IGVsc2VpZiBpbmNsdWRlIF9fRklMRV9fIGVtcHR5IHJlcXVpcmVfb25jZSBkbyB4b3IgJyArXG4gICAgICAncmV0dXJuIGltcGxlbWVudHMgcGFyZW50IGNsb25lIHVzZSBfX0NMQVNTX18gX19MSU5FX18gZWxzZSBicmVhayBwcmludCBldmFsIG5ldyAnICtcbiAgICAgICdjYXRjaCBfX01FVEhPRF9fIGNhc2UgZXhjZXB0aW9uIHBocF91c2VyX2ZpbHRlciBkZWZhdWx0IGRpZSByZXF1aXJlIF9fRlVOQ1RJT05fXyAnICtcbiAgICAgICdlbmRkZWNsYXJlIGZpbmFsIHRyeSB0aGlzIHN3aXRjaCBjb250aW51ZSBlbmRmb3IgZW5kaWYgZGVjbGFyZSB1bnNldCB0cnVlIGZhbHNlICcgK1xuICAgICAgJ25hbWVzcGFjZSB0cmFpdCBnb3RvIGluc3RhbmNlb2YgaW5zdGVhZG9mIF9fRElSX18gX19OQU1FU1BBQ0VfXyBfX2hhbHRfY29tcGlsZXInLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICcvXFxcXConLCBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BocGRvYycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFxzQFtBLVphLXpdKydcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlLFxuICAgICAgICAgIGJlZ2luOiAnX19oYWx0X2NvbXBpbGVyLis/OycsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJzw8PFtcXCdcIl0/XFxcXHcrW1xcJ1wiXT8kJywgZW5kOiAnXlxcXFx3KzsnLFxuICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnPFxcXFw/cGhwJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICdcXFxcPz4nXG4gICAgICB9LFxuICAgICAgVkFSSUFCTEUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnZnVuY3Rpb24nLFxuICAgICAgICBpbGxlZ2FsOiAnXFxcXCR8XFxcXFt8JScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgVElUTEUsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICAgICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgICAgICBjb250YWluczogW1xuICAgICAgICAgICAgICAnc2VsZicsXG4gICAgICAgICAgICAgIFZBUklBQkxFLFxuICAgICAgICAgICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFXG4gICAgICAgICAgICBdLmNvbmNhdChTVFJJTkdTKS5jb25jYXQoTlVNQkVSUylcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kOiAneycsXG4gICAgICAgIGtleXdvcmRzOiAnY2xhc3MnLFxuICAgICAgICBpbGxlZ2FsOiAnWzpcXFxcKFxcXFwkXScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSwgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMnLFxuICAgICAgICAgICAgY29udGFpbnM6IFtUSVRMRV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFRJVExFXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPT4nIC8vIE5vIG1hcmt1cCwganVzdCBhIHJlbGV2YW5jZSBib29zdGVyXG4gICAgICB9XG4gICAgXS5jb25jYXQoU1RSSU5HUykuY29uY2F0KE5VTUJFUlMpXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2J1aWx0aW4nLFxuICAgICAgICBiZWdpbjogJ3snLCBlbmQ6ICd9JCcsXG4gICAgICAgIGV4Y2x1ZGVCZWdpbjogdHJ1ZSwgZXhjbHVkZUVuZDogdHJ1ZSxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkFQT1NfU1RSSU5HX01PREUsIGhsanMuUVVPVEVfU1RSSU5HX01PREVdLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2ZpbGVuYW1lJyxcbiAgICAgICAgYmVnaW46ICdbYS16QS1aX11bXFxcXGRhLXpBLVpfXStcXFxcLltcXFxcZGEtekEtWl9dezEsM30nLCBlbmQ6ICc6JyxcbiAgICAgICAgZXhjbHVkZUVuZDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnaGVhZGVyJyxcbiAgICAgICAgYmVnaW46ICcobmNhbGxzfHRvdHRpbWV8Y3VtdGltZSknLCBlbmQ6ICckJyxcbiAgICAgICAga2V5d29yZHM6ICduY2FsbHMgdG90dGltZXwxMCBjdW10aW1lfDEwIGZpbGVuYW1lJyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnc3VtbWFyeScsXG4gICAgICAgIGJlZ2luOiAnZnVuY3Rpb24gY2FsbHMnLCBlbmQ6ICckJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkNfTlVNQkVSX01PREVdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5RVU9URV9TVFJJTkdfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCkkJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkUsXG4gICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgIH1dLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgUFJPTVBUID0ge1xuICAgIGNsYXNzTmFtZTogJ3Byb21wdCcsICBiZWdpbjogJ14oPj4+fFxcXFwuXFxcXC5cXFxcLikgJ1xuICB9XG4gIHZhciBTVFJJTkdTID0gW1xuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fGIpP3I/XFwnXFwnXFwnJywgZW5kOiAnXFwnXFwnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbUFJPTVBUXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fGIpP3I/XCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICAgIGNvbnRhaW5zOiBbUFJPTVBUXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fHJ8dXIpXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyh1fHJ8dXIpXCInLCBlbmQ6ICdcIicsXG4gICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV0sXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcoYnxicilcXCcnLCBlbmQ6ICdcXCcnLFxuICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICcoYnxicilcIicsIGVuZDogJ1wiJyxcbiAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgIH1cbiAgXS5jb25jYXQoW1xuICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFXG4gIF0pO1xuICB2YXIgVElUTEUgPSB7XG4gICAgY2xhc3NOYW1lOiAndGl0bGUnLCBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHZhciBQQVJBTVMgPSB7XG4gICAgY2xhc3NOYW1lOiAncGFyYW1zJyxcbiAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgIGNvbnRhaW5zOiBbJ3NlbGYnLCBobGpzLkNfTlVNQkVSX01PREUsIFBST01QVF0uY29uY2F0KFNUUklOR1MpXG4gIH07XG4gIHZhciBGVU5DX0NMQVNTX1BST1RPID0ge1xuICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJzonLFxuICAgIGlsbGVnYWw6ICdbJHs9O1xcXFxuXScsXG4gICAgY29udGFpbnM6IFtUSVRMRSwgUEFSQU1TXSxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBrZXl3b3Jkczoge1xuICAgICAga2V5d29yZDpcbiAgICAgICAgJ2FuZCBlbGlmIGlzIGdsb2JhbCBhcyBpbiBpZiBmcm9tIHJhaXNlIGZvciBleGNlcHQgZmluYWxseSBwcmludCBpbXBvcnQgcGFzcyByZXR1cm4gJyArXG4gICAgICAgICdleGVjIGVsc2UgYnJlYWsgbm90IHdpdGggY2xhc3MgYXNzZXJ0IHlpZWxkIHRyeSB3aGlsZSBjb250aW51ZSBkZWwgb3IgZGVmIGxhbWJkYSAnICtcbiAgICAgICAgJ25vbmxvY2FsfDEwJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnTm9uZSBUcnVlIEZhbHNlIEVsbGlwc2lzIE5vdEltcGxlbWVudGVkJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJyg8L3wtPnxcXFxcPyknLFxuICAgIGNvbnRhaW5zOiBTVFJJTkdTLmNvbmNhdChbXG4gICAgICBQUk9NUFQsXG4gICAgICBobGpzLkhBU0hfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5pbmhlcml0KEZVTkNfQ0xBU1NfUFJPVE8sIHtjbGFzc05hbWU6ICdmdW5jdGlvbicsIGtleXdvcmRzOiAnZGVmJ30pLFxuICAgICAgaGxqcy5pbmhlcml0KEZVTkNfQ0xBU1NfUFJPVE8sIHtjbGFzc05hbWU6ICdjbGFzcycsIGtleXdvcmRzOiAnY2xhc3MnfSksXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2RlY29yYXRvcicsXG4gICAgICAgIGJlZ2luOiAnQCcsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJ1xcXFxiKHByaW50fGV4ZWMpXFxcXCgnIC8vIGRvbuKAmXQgaGlnaGxpZ2h0IGtleXdvcmRzLXR1cm5lZC1mdW5jdGlvbnMgaW4gUHl0aG9uIDNcbiAgICAgIH1cbiAgICBdKVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIElERU5UX1JFID0gJyhbYS16QS1aXXxcXFxcLlthLXpBLVouXSlbYS16QS1aMC05Ll9dKic7XG5cbiAgcmV0dXJuIHtcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgYmVnaW46IElERU5UX1JFLFxuICAgICAgICBsZXhlbXM6IElERU5UX1JFLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgIGtleXdvcmQ6XG4gICAgICAgICAgICAnZnVuY3Rpb24gaWYgaW4gYnJlYWsgbmV4dCByZXBlYXQgZWxzZSBmb3IgcmV0dXJuIHN3aXRjaCB3aGlsZSB0cnkgdHJ5Q2F0Y2h8MTAgJyArXG4gICAgICAgICAgICAnc3RvcCB3YXJuaW5nIHJlcXVpcmUgbGlicmFyeSBhdHRhY2ggZGV0YWNoIHNvdXJjZSBzZXRNZXRob2Qgc2V0R2VuZXJpYyAnICtcbiAgICAgICAgICAgICdzZXRHcm91cEdlbmVyaWMgc2V0Q2xhc3MgLi4ufDEwJyxcbiAgICAgICAgICBsaXRlcmFsOlxuICAgICAgICAgICAgJ05VTEwgTkEgVFJVRSBGQUxTRSBUIEYgSW5mIE5hTiBOQV9pbnRlZ2VyX3wxMCBOQV9yZWFsX3wxMCBOQV9jaGFyYWN0ZXJffDEwICcgK1xuICAgICAgICAgICAgJ05BX2NvbXBsZXhffDEwJ1xuICAgICAgICB9LFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIGhleCB2YWx1ZVxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCIwW3hYXVswLTlhLWZBLUZdK1tMaV0/XFxcXGJcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICAvLyBleHBsaWNpdCBpbnRlZ2VyXG4gICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgIGJlZ2luOiBcIlxcXFxkKyg/OltlRV1bK1xcXFwtXT9cXFxcZCopP0xcXFxcYlwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIG51bWJlciB3aXRoIHRyYWlsaW5nIGRlY2ltYWxcbiAgICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgICAgYmVnaW46IFwiXFxcXGQrXFxcXC4oPyFcXFxcZCkoPzppXFxcXGIpP1wiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIG51bWJlclxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCJcXFxcZCsoPzpcXFxcLlxcXFxkKik/KD86W2VFXVsrXFxcXC1dP1xcXFxkKik/aT9cXFxcYlwiLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIG51bWJlciB3aXRoIGxlYWRpbmcgZGVjaW1hbFxuICAgICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgICBiZWdpbjogXCJcXFxcLlxcXFxkKyg/OltlRV1bK1xcXFwtXT9cXFxcZCopP2k/XFxcXGJcIixcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIC8vIGVzY2FwZWQgaWRlbnRpZmllclxuICAgICAgICBiZWdpbjogJ2AnLFxuICAgICAgICBlbmQ6ICdgJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgIGJlZ2luOiAnXCInLFxuICAgICAgICBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogXCInXCIsXG4gICAgICAgIGVuZDogXCInXCIsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczpcbiAgICAgICdBcmNoaXZlUmVjb3JkIEFyZWFMaWdodFNvdXJjZSBBdG1vc3BoZXJlIEF0dHJpYnV0ZSBBdHRyaWJ1dGVCZWdpbiBBdHRyaWJ1dGVFbmQgQmFzaXMgJyArXG4gICAgICAnQmVnaW4gQmxvYmJ5IEJvdW5kIENsaXBwaW5nIENsaXBwaW5nUGxhbmUgQ29sb3IgQ29sb3JTYW1wbGVzIENvbmNhdFRyYW5zZm9ybSBDb25lICcgK1xuICAgICAgJ0Nvb3JkaW5hdGVTeXN0ZW0gQ29vcmRTeXNUcmFuc2Zvcm0gQ3JvcFdpbmRvdyBDdXJ2ZXMgQ3lsaW5kZXIgRGVwdGhPZkZpZWxkIERldGFpbCAnICtcbiAgICAgICdEZXRhaWxSYW5nZSBEaXNrIERpc3BsYWNlbWVudCBEaXNwbGF5IEVuZCBFcnJvckhhbmRsZXIgRXhwb3N1cmUgRXh0ZXJpb3IgRm9ybWF0ICcgK1xuICAgICAgJ0ZyYW1lQXNwZWN0UmF0aW8gRnJhbWVCZWdpbiBGcmFtZUVuZCBHZW5lcmFsUG9seWdvbiBHZW9tZXRyaWNBcHByb3hpbWF0aW9uIEdlb21ldHJ5ICcgK1xuICAgICAgJ0hpZGVyIEh5cGVyYm9sb2lkIElkZW50aXR5IElsbHVtaW5hdGUgSW1hZ2VyIEludGVyaW9yIExpZ2h0U291cmNlICcgK1xuICAgICAgJ01ha2VDdWJlRmFjZUVudmlyb25tZW50IE1ha2VMYXRMb25nRW52aXJvbm1lbnQgTWFrZVNoYWRvdyBNYWtlVGV4dHVyZSBNYXR0ZSAnICtcbiAgICAgICdNb3Rpb25CZWdpbiBNb3Rpb25FbmQgTnVQYXRjaCBPYmplY3RCZWdpbiBPYmplY3RFbmQgT2JqZWN0SW5zdGFuY2UgT3BhY2l0eSBPcHRpb24gJyArXG4gICAgICAnT3JpZW50YXRpb24gUGFyYWJvbG9pZCBQYXRjaCBQYXRjaE1lc2ggUGVyc3BlY3RpdmUgUGl4ZWxGaWx0ZXIgUGl4ZWxTYW1wbGVzICcgK1xuICAgICAgJ1BpeGVsVmFyaWFuY2UgUG9pbnRzIFBvaW50c0dlbmVyYWxQb2x5Z29ucyBQb2ludHNQb2x5Z29ucyBQb2x5Z29uIFByb2NlZHVyYWwgUHJvamVjdGlvbiAnICtcbiAgICAgICdRdWFudGl6ZSBSZWFkQXJjaGl2ZSBSZWxhdGl2ZURldGFpbCBSZXZlcnNlT3JpZW50YXRpb24gUm90YXRlIFNjYWxlIFNjcmVlbldpbmRvdyAnICtcbiAgICAgICdTaGFkaW5nSW50ZXJwb2xhdGlvbiBTaGFkaW5nUmF0ZSBTaHV0dGVyIFNpZGVzIFNrZXcgU29saWRCZWdpbiBTb2xpZEVuZCBTcGhlcmUgJyArXG4gICAgICAnU3ViZGl2aXNpb25NZXNoIFN1cmZhY2UgVGV4dHVyZUNvb3JkaW5hdGVzIFRvcnVzIFRyYW5zZm9ybSBUcmFuc2Zvcm1CZWdpbiBUcmFuc2Zvcm1FbmQgJyArXG4gICAgICAnVHJhbnNmb3JtUG9pbnRzIFRyYW5zbGF0ZSBUcmltQ3VydmUgV29ybGRCZWdpbiBXb3JsZEVuZCcsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5IQVNIX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuQ19OVU1CRVJfTU9ERSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREVcbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICByZXR1cm4ge1xuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnZmxvYXQgY29sb3IgcG9pbnQgbm9ybWFsIHZlY3RvciBtYXRyaXggd2hpbGUgZm9yIGlmIGRvIHJldHVybiBlbHNlIGJyZWFrIGV4dGVybiBjb250aW51ZScsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ2FicyBhY29zIGFtYmllbnQgYXJlYSBhc2luIGF0YW4gYXRtb3NwaGVyZSBhdHRyaWJ1dGUgY2FsY3VsYXRlbm9ybWFsIGNlaWwgY2VsbG5vaXNlICcgK1xuICAgICAgICAnY2xhbXAgY29tcCBjb25jYXQgY29zIGRlZ3JlZXMgZGVwdGggRGVyaXYgZGlmZnVzZSBkaXN0YW5jZSBEdSBEdiBlbnZpcm9ubWVudCBleHAgJyArXG4gICAgICAgICdmYWNlZm9yd2FyZCBmaWx0ZXJzdGVwIGZsb29yIGZvcm1hdCBmcmVzbmVsIGluY2lkZW50IGxlbmd0aCBsaWdodHNvdXJjZSBsb2cgbWF0Y2ggJyArXG4gICAgICAgICdtYXggbWluIG1vZCBub2lzZSBub3JtYWxpemUgbnRyYW5zZm9ybSBvcHBvc2l0ZSBvcHRpb24gcGhvbmcgcG5vaXNlIHBvdyBwcmludGYgJyArXG4gICAgICAgICdwdGxpbmVkIHJhZGlhbnMgcmFuZG9tIHJlZmxlY3QgcmVmcmFjdCByZW5kZXJpbmZvIHJvdW5kIHNldGNvbXAgc2V0eGNvbXAgc2V0eWNvbXAgJyArXG4gICAgICAgICdzZXR6Y29tcCBzaGFkb3cgc2lnbiBzaW4gc21vb3Roc3RlcCBzcGVjdWxhciBzcGVjdWxhcmJyZGYgc3BsaW5lIHNxcnQgc3RlcCB0YW4gJyArXG4gICAgICAgICd0ZXh0dXJlIHRleHR1cmVpbmZvIHRyYWNlIHRyYW5zZm9ybSB2dHJhbnNmb3JtIHhjb21wIHljb21wIHpjb21wJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkFQT1NfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnIycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzaGFkZXInLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdcXFxcKCcsXG4gICAgICAgIGtleXdvcmRzOiAnc3VyZmFjZSBkaXNwbGFjZW1lbnQgbGlnaHQgdm9sdW1lIGltYWdlcidcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3NoYWRpbmcnLFxuICAgICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICdcXFxcKCcsXG4gICAgICAgIGtleXdvcmRzOiAnaWxsdW1pbmF0ZSBpbGx1bWluYW5jZSBnYXRoZXInXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFJVQllfSURFTlRfUkUgPSAnW2EtekEtWl9dW2EtekEtWjAtOV9dKihcXFxcIXxcXFxcPyk/JztcbiAgdmFyIFJVQllfTUVUSE9EX1JFID0gJ1thLXpBLVpfXVxcXFx3KlshPz1dP3xbLSt+XVxcXFxAfDw8fD4+fD1+fD09PT98PD0+fFs8Pl09P3xcXFxcKlxcXFwqfFstLyslXiYqfmB8XXxcXFxcW1xcXFxdPT8nO1xuICB2YXIgUlVCWV9LRVlXT1JEUyA9IHtcbiAgICBrZXl3b3JkOlxuICAgICAgJ2FuZCBmYWxzZSB0aGVuIGRlZmluZWQgbW9kdWxlIGluIHJldHVybiByZWRvIGlmIEJFR0lOIHJldHJ5IGVuZCBmb3IgdHJ1ZSBzZWxmIHdoZW4gJyArXG4gICAgICAnbmV4dCB1bnRpbCBkbyBiZWdpbiB1bmxlc3MgRU5EIHJlc2N1ZSBuaWwgZWxzZSBicmVhayB1bmRlZiBub3Qgc3VwZXIgY2xhc3MgY2FzZSAnICtcbiAgICAgICdyZXF1aXJlIHlpZWxkIGFsaWFzIHdoaWxlIGVuc3VyZSBlbHNpZiBvciBpbmNsdWRlJ1xuICB9O1xuICB2YXIgWUFSRE9DVEFHID0ge1xuICAgIGNsYXNzTmFtZTogJ3lhcmRvY3RhZycsXG4gICAgYmVnaW46ICdAW0EtWmEtel0rJ1xuICB9O1xuICB2YXIgQ09NTUVOVFMgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJyMnLCBlbmQ6ICckJyxcbiAgICAgIGNvbnRhaW5zOiBbWUFSRE9DVEFHXVxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICBiZWdpbjogJ15cXFxcPWJlZ2luJywgZW5kOiAnXlxcXFw9ZW5kJyxcbiAgICAgIGNvbnRhaW5zOiBbWUFSRE9DVEFHXSxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgYmVnaW46ICdeX19FTkRfXycsIGVuZDogJ1xcXFxuJCdcbiAgICB9XG4gIF07XG4gIHZhciBTVUJTVCA9IHtcbiAgICBjbGFzc05hbWU6ICdzdWJzdCcsXG4gICAgYmVnaW46ICcjXFxcXHsnLCBlbmQ6ICd9JyxcbiAgICBsZXhlbXM6IFJVQllfSURFTlRfUkUsXG4gICAga2V5d29yZHM6IFJVQllfS0VZV09SRFNcbiAgfTtcbiAgdmFyIFNUUl9DT05UQUlOUyA9IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXTtcbiAgdmFyIFNUUklOR1MgPSBbXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnXFwnJywgZW5kOiAnXFwnJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJ1wiJywgZW5kOiAnXCInLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/XFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT9cXFxcWycsIGVuZDogJ1xcXFxdJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlNcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddP3snLCBlbmQ6ICd9JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlNcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddPzwnLCBlbmQ6ICc+JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT8vJywgZW5kOiAnLycsXG4gICAgICBjb250YWluczogU1RSX0NPTlRBSU5TLFxuICAgICAgcmVsZXZhbmNlOiAxMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3RyaW5nJyxcbiAgICAgIGJlZ2luOiAnJVtxd10/JScsIGVuZDogJyUnLFxuICAgICAgY29udGFpbnM6IFNUUl9DT05UQUlOUyxcbiAgICAgIHJlbGV2YW5jZTogMTBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICBiZWdpbjogJyVbcXddPy0nLCBlbmQ6ICctJyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgYmVnaW46ICclW3F3XT9cXFxcfCcsIGVuZDogJ1xcXFx8JyxcbiAgICAgIGNvbnRhaW5zOiBTVFJfQ09OVEFJTlMsXG4gICAgICByZWxldmFuY2U6IDEwXG4gICAgfVxuICBdO1xuICB2YXIgRlVOQ1RJT04gPSB7XG4gICAgY2xhc3NOYW1lOiAnZnVuY3Rpb24nLFxuICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyB8JHw7JyxcbiAgICBrZXl3b3JkczogJ2RlZicsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGl0bGUnLFxuICAgICAgICBiZWdpbjogUlVCWV9NRVRIT0RfUkUsXG4gICAgICAgIGxleGVtczogUlVCWV9JREVOVF9SRSxcbiAgICAgICAga2V5d29yZHM6IFJVQllfS0VZV09SRFNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGxleGVtczogUlVCWV9JREVOVF9SRSxcbiAgICAgICAga2V5d29yZHM6IFJVQllfS0VZV09SRFNcbiAgICAgIH1cbiAgICBdLmNvbmNhdChDT01NRU5UUylcbiAgfTtcblxuICB2YXIgUlVCWV9ERUZBVUxUX0NPTlRBSU5TID0gQ09NTUVOVFMuY29uY2F0KFNUUklOR1MuY29uY2F0KFtcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICBiZWdpbldpdGhLZXl3b3JkOiB0cnVlLCBlbmQ6ICckfDsnLFxuICAgICAga2V5d29yZHM6ICdjbGFzcyBtb2R1bGUnLFxuICAgICAgY29udGFpbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICBiZWdpbjogJ1tBLVphLXpfXVxcXFx3Kig6OlxcXFx3KykqKFxcXFw/fFxcXFwhKT8nLFxuICAgICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2xhc3NOYW1lOiAnaW5oZXJpdGFuY2UnLFxuICAgICAgICAgIGJlZ2luOiAnPFxcXFxzKicsXG4gICAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdwYXJlbnQnLFxuICAgICAgICAgICAgYmVnaW46ICcoJyArIGhsanMuSURFTlRfUkUgKyAnOjopPycgKyBobGpzLklERU5UX1JFXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgXS5jb25jYXQoQ09NTUVOVFMpXG4gICAgfSxcbiAgICBGVU5DVElPTixcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsXG4gICAgICBiZWdpbjogJyg6Oik/KFxcXFxiW0EtWl1cXFxcdyooOjopPykrJyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnc3ltYm9sJyxcbiAgICAgIGJlZ2luOiAnOicsXG4gICAgICBjb250YWluczogU1RSSU5HUy5jb25jYXQoW3tiZWdpbjogUlVCWV9NRVRIT0RfUkV9XSksXG4gICAgICByZWxldmFuY2U6IDBcbiAgICB9LFxuICAgIHtcbiAgICAgIGNsYXNzTmFtZTogJ3N5bWJvbCcsXG4gICAgICBiZWdpbjogUlVCWV9JREVOVF9SRSArICc6JyxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICAgIGJlZ2luOiAnKFxcXFxiMFswLTdfXSspfChcXFxcYjB4WzAtOWEtZkEtRl9dKyl8KFxcXFxiWzEtOV1bMC05X10qKFxcXFwuWzAtOV9dKyk/KXxbMF9dXFxcXGInLFxuICAgICAgcmVsZXZhbmNlOiAwXG4gICAgfSxcbiAgICB7XG4gICAgICBjbGFzc05hbWU6ICdudW1iZXInLFxuICAgICAgYmVnaW46ICdcXFxcP1xcXFx3J1xuICAgIH0sXG4gICAge1xuICAgICAgY2xhc3NOYW1lOiAndmFyaWFibGUnLFxuICAgICAgYmVnaW46ICcoXFxcXCRcXFxcVyl8KChcXFxcJHxcXFxcQFxcXFxAPykoXFxcXHcrKSknXG4gICAgfSxcbiAgICB7IC8vIHJlZ2V4cCBjb250YWluZXJcbiAgICAgIGJlZ2luOiAnKCcgKyBobGpzLlJFX1NUQVJURVJTX1JFICsgJylcXFxccyonLFxuICAgICAgY29udGFpbnM6IENPTU1FTlRTLmNvbmNhdChbXG4gICAgICAgIHtcbiAgICAgICAgICBjbGFzc05hbWU6ICdyZWdleHAnLFxuICAgICAgICAgIGJlZ2luOiAnLycsIGVuZDogJy9bYS16XSonLFxuICAgICAgICAgIGlsbGVnYWw6ICdcXFxcbicsXG4gICAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEUsIFNVQlNUXVxuICAgICAgICB9XG4gICAgICBdKSxcbiAgICAgIHJlbGV2YW5jZTogMFxuICAgIH1cbiAgXSkpO1xuICBTVUJTVC5jb250YWlucyA9IFJVQllfREVGQVVMVF9DT05UQUlOUztcbiAgRlVOQ1RJT04uY29udGFpbnNbMV0uY29udGFpbnMgPSBSVUJZX0RFRkFVTFRfQ09OVEFJTlM7XG5cbiAgcmV0dXJuIHtcbiAgICBsZXhlbXM6IFJVQllfSURFTlRfUkUsXG4gICAga2V5d29yZHM6IFJVQllfS0VZV09SRFMsXG4gICAgY29udGFpbnM6IFJVQllfREVGQVVMVF9DT05UQUlOU1xuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFRJVExFID0ge1xuICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICBiZWdpbjogaGxqcy5VTkRFUlNDT1JFX0lERU5UX1JFXG4gIH07XG4gIHZhciBOVU1CRVIgPSB7XG4gICAgY2xhc3NOYW1lOiAnbnVtYmVyJyxcbiAgICBiZWdpbjogJ1xcXFxiKDBbeGJdW0EtWmEtejAtOV9dK3xbMC05X10rKFxcXFwuWzAtOV9dKyk/KFt1aWZdKDh8MTZ8MzJ8NjQpPyk/KScsXG4gICAgcmVsZXZhbmNlOiAwXG4gIH07XG4gIHZhciBLRVlXT1JEUyA9XG4gICAgJ2FsdCBhbnkgYXMgYXNzZXJ0IGJlIGJpbmQgYmxvY2sgYm9vbCBicmVhayBjaGFyIGNoZWNrIGNsYWltIGNvbnN0IGNvbnQgZGlyIGRvIGVsc2UgZW51bSAnICtcbiAgICAnZXhwb3J0IGYzMiBmNjQgZmFpbCBmYWxzZSBmbG9hdCBmbiBmb3IgaTE2IGkzMiBpNjQgaTggaWYgaWZhY2UgaW1wbCBpbXBvcnQgaW4gaW50IGxldCAnICtcbiAgICAnbG9nIG1vZCBtdXRhYmxlIG5hdGl2ZSBub3RlIG9mIHByb3ZlIHB1cmUgcmVzb3VyY2UgcmV0IHNlbGYgc3RyIHN5bnRheCB0cnVlIHR5cGUgdTE2IHUzMiAnICtcbiAgICAndTY0IHU4IHVpbnQgdW5jaGVja2VkIHVuc2FmZSB1c2UgdmVjIHdoaWxlJztcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogS0VZV09SRFMsXG4gICAgaWxsZWdhbDogJzwvJyxcbiAgICBjb250YWluczogW1xuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7aWxsZWdhbDogbnVsbH0pLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgTlVNQkVSLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdmdW5jdGlvbicsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyhcXFxcKHw8KScsXG4gICAgICAgIGtleXdvcmRzOiAnZm4nLFxuICAgICAgICBjb250YWluczogW1RJVExFXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAncHJlcHJvY2Vzc29yJyxcbiAgICAgICAgYmVnaW46ICcjXFxcXFsnLCBlbmQ6ICdcXFxcXSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyg9fDwpJyxcbiAgICAgICAga2V5d29yZHM6ICd0eXBlJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRV0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJyh7fDwpJyxcbiAgICAgICAga2V5d29yZHM6ICdpZmFjZSBlbnVtJyxcbiAgICAgICAgY29udGFpbnM6IFtUSVRMRV0sXG4gICAgICAgIGlsbGVnYWw6ICdcXFxcUydcbiAgICAgIH1cbiAgICBdXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgQU5OT1RBVElPTiA9IHtcbiAgICBjbGFzc05hbWU6ICdhbm5vdGF0aW9uJywgYmVnaW46ICdAW0EtWmEtel0rJ1xuICB9O1xuICB2YXIgU1RSSU5HID0ge1xuICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgYmVnaW46ICd1P3I/XCJcIlwiJywgZW5kOiAnXCJcIlwiJyxcbiAgICByZWxldmFuY2U6IDEwXG4gIH07XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6XG4gICAgICAndHlwZSB5aWVsZCBsYXp5IG92ZXJyaWRlIGRlZiB3aXRoIHZhbCB2YXIgZmFsc2UgdHJ1ZSBzZWFsZWQgYWJzdHJhY3QgcHJpdmF0ZSB0cmFpdCAnICtcbiAgICAgICdvYmplY3QgbnVsbCBpZiBmb3Igd2hpbGUgdGhyb3cgZmluYWxseSBwcm90ZWN0ZWQgZXh0ZW5kcyBpbXBvcnQgZmluYWwgcmV0dXJuIGVsc2UgJyArXG4gICAgICAnYnJlYWsgbmV3IGNhdGNoIHN1cGVyIGNsYXNzIGNhc2UgcGFja2FnZSBkZWZhdWx0IHRyeSB0aGlzIG1hdGNoIGNvbnRpbnVlIHRocm93cycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnamF2YWRvYycsXG4gICAgICAgIGJlZ2luOiAnL1xcXFwqXFxcXConLCBlbmQ6ICdcXFxcKi8nLFxuICAgICAgICBjb250YWluczogW3tcbiAgICAgICAgICBjbGFzc05hbWU6ICdqYXZhZG9jdGFnJyxcbiAgICAgICAgICBiZWdpbjogJ0BbQS1aYS16XSsnXG4gICAgICAgIH1dLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0xJTkVfQ09NTUVOVF9NT0RFLCBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFLCBTVFJJTkcsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NsYXNzJyxcbiAgICAgICAgYmVnaW46ICcoKGNhc2UgKT9jbGFzcyB8b2JqZWN0IHx0cmFpdCApJywgZW5kOiAnKHt8JCknLCAvLyBiZWdpbldpdGhLZXl3b3JkIHdvbid0IHdvcmsgYmVjYXVzZSBhIHNpbmdsZSBcImNhc2VcIiBzaG91bGRuJ3Qgc3RhcnQgdGhpcyBtb2RlXG4gICAgICAgIGlsbGVnYWw6ICc6JyxcbiAgICAgICAga2V5d29yZHM6ICdjYXNlIGNsYXNzIHRyYWl0IG9iamVjdCcsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYmVnaW5XaXRoS2V5d29yZDogdHJ1ZSxcbiAgICAgICAgICAgIGtleXdvcmRzOiAnZXh0ZW5kcyB3aXRoJyxcbiAgICAgICAgICAgIHJlbGV2YW5jZTogMTBcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3BhcmFtcycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcXFwoJywgZW5kOiAnXFxcXCknLFxuICAgICAgICAgICAgY29udGFpbnM6IFtcbiAgICAgICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLCBobGpzLlFVT1RFX1NUUklOR19NT0RFLCBTVFJJTkcsXG4gICAgICAgICAgICAgIEFOTk9UQVRJT05cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBBTk5PVEFUSU9OXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgdmFyIFZBUl9JREVOVF9SRSA9ICdbYS16XVthLXpBLVowLTlfXSonO1xuICB2YXIgQ0hBUiA9IHtcbiAgICBjbGFzc05hbWU6ICdjaGFyJyxcbiAgICBiZWdpbjogJ1xcXFwkLnsxfSdcbiAgfTtcbiAgdmFyIFNZTUJPTCA9IHtcbiAgICBjbGFzc05hbWU6ICdzeW1ib2wnLFxuICAgIGJlZ2luOiAnIycgKyBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBrZXl3b3JkczogJ3NlbGYgc3VwZXIgbmlsIHRydWUgZmFsc2UgdGhpc0NvbnRleHQnLCAvLyBvbmx5IDZcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luOiAnXFxcXGJbQS1aXVtBLVphLXowLTlfXSonLFxuICAgICAgICByZWxldmFuY2U6IDBcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ21ldGhvZCcsXG4gICAgICAgIGJlZ2luOiBWQVJfSURFTlRfUkUgKyAnOidcbiAgICAgIH0sXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICBTWU1CT0wsXG4gICAgICBDSEFSLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsb2NhbHZhcnMnLFxuICAgICAgICBiZWdpbjogJ1xcXFx8XFxcXHMqKCgnICsgVkFSX0lERU5UX1JFICsgJylcXFxccyopK1xcXFx8J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXJyYXknLFxuICAgICAgICBiZWdpbjogJ1xcXFwjXFxcXCgnLCBlbmQ6ICdcXFxcKScsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgaGxqcy5BUE9TX1NUUklOR19NT0RFLFxuICAgICAgICAgIENIQVIsXG4gICAgICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAgICAgIFNZTUJPTFxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ29wZXJhdG9yJyxcbiAgICAgICAgYmVnaW46ICcoYmVnaW58c3RhcnR8Y29tbWl0fHJvbGxiYWNrfHNhdmVwb2ludHxsb2NrfGFsdGVyfGNyZWF0ZXxkcm9wfHJlbmFtZXxjYWxsfGRlbGV0ZXxkb3xoYW5kbGVyfGluc2VydHxsb2FkfHJlcGxhY2V8c2VsZWN0fHRydW5jYXRlfHVwZGF0ZXxzZXR8c2hvd3xwcmFnbWF8Z3JhbnQpXFxcXGIoPyE6KScsIC8vIG5lZ2F0aXZlIGxvb2stYWhlYWQgaGVyZSBpcyBzcGVjaWZpY2FsbHkgdG8gcHJldmVudCBzdG9tcGluZyBvbiBTbWFsbFRhbGtcbiAgICAgICAgZW5kOiAnOycsIGVuZHNXaXRoUGFyZW50OiB0cnVlLFxuICAgICAgICBrZXl3b3Jkczoge1xuICAgICAgICAgIGtleXdvcmQ6ICdhbGwgcGFydGlhbCBnbG9iYWwgbW9udGggY3VycmVudF90aW1lc3RhbXAgdXNpbmcgZ28gcmV2b2tlIHNtYWxsaW50ICcgK1xuICAgICAgICAgICAgJ2luZGljYXRvciBlbmQtZXhlYyBkaXNjb25uZWN0IHpvbmUgd2l0aCBjaGFyYWN0ZXIgYXNzZXJ0aW9uIHRvIGFkZCBjdXJyZW50X3VzZXIgJyArXG4gICAgICAgICAgICAndXNhZ2UgaW5wdXQgbG9jYWwgYWx0ZXIgbWF0Y2ggY29sbGF0ZSByZWFsIHRoZW4gcm9sbGJhY2sgZ2V0IHJlYWQgdGltZXN0YW1wICcgK1xuICAgICAgICAgICAgJ3Nlc3Npb25fdXNlciBub3QgaW50ZWdlciBiaXQgdW5pcXVlIGRheSBtaW51dGUgZGVzYyBpbnNlcnQgZXhlY3V0ZSBsaWtlIGlsaWtlfDIgJyArXG4gICAgICAgICAgICAnbGV2ZWwgZGVjaW1hbCBkcm9wIGNvbnRpbnVlIGlzb2xhdGlvbiBmb3VuZCB3aGVyZSBjb25zdHJhaW50cyBkb21haW4gcmlnaHQgJyArXG4gICAgICAgICAgICAnbmF0aW9uYWwgc29tZSBtb2R1bGUgdHJhbnNhY3Rpb24gcmVsYXRpdmUgc2Vjb25kIGNvbm5lY3QgZXNjYXBlIGNsb3NlIHN5c3RlbV91c2VyICcgK1xuICAgICAgICAgICAgJ2ZvciBkZWZlcnJlZCBzZWN0aW9uIGNhc3QgY3VycmVudCBzcWxzdGF0ZSBhbGxvY2F0ZSBpbnRlcnNlY3QgZGVhbGxvY2F0ZSBudW1lcmljICcgK1xuICAgICAgICAgICAgJ3B1YmxpYyBwcmVzZXJ2ZSBmdWxsIGdvdG8gaW5pdGlhbGx5IGFzYyBubyBrZXkgb3V0cHV0IGNvbGxhdGlvbiBncm91cCBieSB1bmlvbiAnICtcbiAgICAgICAgICAgICdzZXNzaW9uIGJvdGggbGFzdCBsYW5ndWFnZSBjb25zdHJhaW50IGNvbHVtbiBvZiBzcGFjZSBmb3JlaWduIGRlZmVycmFibGUgcHJpb3IgJyArXG4gICAgICAgICAgICAnY29ubmVjdGlvbiB1bmtub3duIGFjdGlvbiBjb21taXQgdmlldyBvciBmaXJzdCBpbnRvIGZsb2F0IHllYXIgcHJpbWFyeSBjYXNjYWRlZCAnICtcbiAgICAgICAgICAgICdleGNlcHQgcmVzdHJpY3Qgc2V0IHJlZmVyZW5jZXMgbmFtZXMgdGFibGUgb3V0ZXIgb3BlbiBzZWxlY3Qgc2l6ZSBhcmUgcm93cyBmcm9tICcgK1xuICAgICAgICAgICAgJ3ByZXBhcmUgZGlzdGluY3QgbGVhZGluZyBjcmVhdGUgb25seSBuZXh0IGlubmVyIGF1dGhvcml6YXRpb24gc2NoZW1hICcgK1xuICAgICAgICAgICAgJ2NvcnJlc3BvbmRpbmcgb3B0aW9uIGRlY2xhcmUgcHJlY2lzaW9uIGltbWVkaWF0ZSBlbHNlIHRpbWV6b25lX21pbnV0ZSBleHRlcm5hbCAnICtcbiAgICAgICAgICAgICd2YXJ5aW5nIHRyYW5zbGF0aW9uIHRydWUgY2FzZSBleGNlcHRpb24gam9pbiBob3VyIGRlZmF1bHQgZG91YmxlIHNjcm9sbCB2YWx1ZSAnICtcbiAgICAgICAgICAgICdjdXJzb3IgZGVzY3JpcHRvciB2YWx1ZXMgZGVjIGZldGNoIHByb2NlZHVyZSBkZWxldGUgYW5kIGZhbHNlIGludCBpcyBkZXNjcmliZSAnICtcbiAgICAgICAgICAgICdjaGFyIGFzIGF0IGluIHZhcmNoYXIgbnVsbCB0cmFpbGluZyBhbnkgYWJzb2x1dGUgY3VycmVudF90aW1lIGVuZCBncmFudCAnICtcbiAgICAgICAgICAgICdwcml2aWxlZ2VzIHdoZW4gY3Jvc3MgY2hlY2sgd3JpdGUgY3VycmVudF9kYXRlIHBhZCBiZWdpbiB0ZW1wb3JhcnkgZXhlYyB0aW1lICcgK1xuICAgICAgICAgICAgJ3VwZGF0ZSBjYXRhbG9nIHVzZXIgc3FsIGRhdGUgb24gaWRlbnRpdHkgdGltZXpvbmVfaG91ciBuYXR1cmFsIHdoZW5ldmVyIGludGVydmFsICcgK1xuICAgICAgICAgICAgJ3dvcmsgb3JkZXIgY2FzY2FkZSBkaWFnbm9zdGljcyBuY2hhciBoYXZpbmcgbGVmdCBjYWxsIGRvIGhhbmRsZXIgbG9hZCByZXBsYWNlICcgK1xuICAgICAgICAgICAgJ3RydW5jYXRlIHN0YXJ0IGxvY2sgc2hvdyBwcmFnbWEgZXhpc3RzIG51bWJlcicsXG4gICAgICAgICAgYWdncmVnYXRlOiAnY291bnQgc3VtIG1pbiBtYXggYXZnJ1xuICAgICAgICB9LFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3N0cmluZycsXG4gICAgICAgICAgICBiZWdpbjogJ1xcJycsIGVuZDogJ1xcJycsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRSwge2JlZ2luOiAnXFwnXFwnJ31dLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICdcIicsIGVuZDogJ1wiJyxcbiAgICAgICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFLCB7YmVnaW46ICdcIlwiJ31dLFxuICAgICAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgYmVnaW46ICdgJywgZW5kOiAnYCcsXG4gICAgICAgICAgICBjb250YWluczogW2hsanMuQkFDS1NMQVNIX0VTQ0FQRV1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGhsanMuQ19OVU1CRVJfTU9ERVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaGxqcy5DX0JMT0NLX0NPTU1FTlRfTU9ERSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY29tbWVudCcsXG4gICAgICAgIGJlZ2luOiAnLS0nLCBlbmQ6ICckJ1xuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHZhciBDT01NQU5EMSA9IHtcbiAgICBjbGFzc05hbWU6ICdjb21tYW5kJyxcbiAgICBiZWdpbjogJ1xcXFxcXFxcW2EtekEtWtCwLdGP0JAt0Y9dK1tcXFxcKl0/J1xuICB9O1xuICB2YXIgQ09NTUFORDIgPSB7XG4gICAgY2xhc3NOYW1lOiAnY29tbWFuZCcsXG4gICAgYmVnaW46ICdcXFxcXFxcXFteYS16QS1a0LAt0Y/QkC3RjzAtOV0nXG4gIH07XG4gIHZhciBTUEVDSUFMID0ge1xuICAgIGNsYXNzTmFtZTogJ3NwZWNpYWwnLFxuICAgIGJlZ2luOiAnW3t9XFxcXFtcXFxcXVxcXFwmI35dJyxcbiAgICByZWxldmFuY2U6IDBcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7IC8vIHBhcmFtZXRlclxuICAgICAgICBiZWdpbjogJ1xcXFxcXFxcW2EtekEtWtCwLdGP0JAt0Y9dK1tcXFxcKl0/ICo9ICotP1xcXFxkKlxcXFwuP1xcXFxkKyhwdHxwY3xtbXxjbXxpbnxkZHxjY3xleHxlbSk/JyxcbiAgICAgICAgcmV0dXJuQmVnaW46IHRydWUsXG4gICAgICAgIGNvbnRhaW5zOiBbXG4gICAgICAgICAgQ09NTUFORDEsIENPTU1BTkQyLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ251bWJlcicsXG4gICAgICAgICAgICBiZWdpbjogJyAqPScsIGVuZDogJy0/XFxcXGQqXFxcXC4/XFxcXGQrKHB0fHBjfG1tfGNtfGlufGRkfGNjfGV4fGVtKT8nLFxuICAgICAgICAgICAgZXhjbHVkZUJlZ2luOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAgQ09NTUFORDEsIENPTU1BTkQyLFxuICAgICAgU1BFQ0lBTCxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybXVsYScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCRcXFxcJCcsIGVuZDogJ1xcXFwkXFxcXCQnLFxuICAgICAgICBjb250YWluczogW0NPTU1BTkQxLCBDT01NQU5EMiwgU1BFQ0lBTF0sXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybXVsYScsXG4gICAgICAgIGJlZ2luOiAnXFxcXCQnLCBlbmQ6ICdcXFxcJCcsXG4gICAgICAgIGNvbnRhaW5zOiBbQ09NTUFORDEsIENPTU1BTkQyLCBTUEVDSUFMXSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICclJywgZW5kOiAnJCcsXG4gICAgICAgIHJlbGV2YW5jZTogMFxuICAgICAgfVxuICAgIF1cbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihobGpzKSB7XG4gIHJldHVybiB7XG4gICAga2V5d29yZHM6IHtcbiAgICAgIGtleXdvcmQ6XG4gICAgICAgIC8vIFZhbHVlIHR5cGVzXG4gICAgICAgICdjaGFyIHVjaGFyIHVuaWNoYXIgaW50IHVpbnQgbG9uZyB1bG9uZyBzaG9ydCB1c2hvcnQgaW50OCBpbnQxNiBpbnQzMiBpbnQ2NCB1aW50OCAnICtcbiAgICAgICAgJ3VpbnQxNiB1aW50MzIgdWludDY0IGZsb2F0IGRvdWJsZSBib29sIHN0cnVjdCBlbnVtIHN0cmluZyB2b2lkICcgK1xuICAgICAgICAvLyBSZWZlcmVuY2UgdHlwZXNcbiAgICAgICAgJ3dlYWsgdW5vd25lZCBvd25lZCAnICtcbiAgICAgICAgLy8gTW9kaWZpZXJzXG4gICAgICAgICdhc3luYyBzaWduYWwgc3RhdGljIGFic3RyYWN0IGludGVyZmFjZSBvdmVycmlkZSAnICtcbiAgICAgICAgLy8gQ29udHJvbCBTdHJ1Y3R1cmVzXG4gICAgICAgICd3aGlsZSBkbyBmb3IgZm9yZWFjaCBlbHNlIHN3aXRjaCBjYXNlIGJyZWFrIGRlZmF1bHQgcmV0dXJuIHRyeSBjYXRjaCAnICtcbiAgICAgICAgLy8gVmlzaWJpbGl0eVxuICAgICAgICAncHVibGljIHByaXZhdGUgcHJvdGVjdGVkIGludGVybmFsICcgK1xuICAgICAgICAvLyBPdGhlclxuICAgICAgICAndXNpbmcgbmV3IHRoaXMgZ2V0IHNldCBjb25zdCBzdGRvdXQgc3RkaW4gc3RkZXJyIHZhcicsXG4gICAgICBidWlsdF9pbjpcbiAgICAgICAgJ0RCdXMgR0xpYiBDQ29kZSBHZWUgT2JqZWN0JyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICdmYWxzZSB0cnVlIG51bGwnXG4gICAgfSxcbiAgICBjb250YWluczogW1xuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjbGFzcycsXG4gICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsIGVuZDogJ3snLFxuICAgICAgICBrZXl3b3JkczogJ2NsYXNzIGludGVyZmFjZSBkZWxlZ2F0ZSBuYW1lc3BhY2UnLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJlZ2luV2l0aEtleXdvcmQ6IHRydWUsXG4gICAgICAgICAgICBrZXl3b3JkczogJ2V4dGVuZHMgaW1wbGVtZW50cydcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJyxcbiAgICAgICAgICAgIGJlZ2luOiBobGpzLlVOREVSU0NPUkVfSURFTlRfUkVcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBobGpzLkNfTElORV9DT01NRU5UX01PREUsXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdzdHJpbmcnLFxuICAgICAgICBiZWdpbjogJ1wiXCJcIicsIGVuZDogJ1wiXCJcIicsXG4gICAgICAgIHJlbGV2YW5jZTogNVxuICAgICAgfSxcbiAgICAgIGhsanMuQVBPU19TVFJJTkdfTU9ERSxcbiAgICAgIGhsanMuUVVPVEVfU1RSSU5HX01PREUsXG4gICAgICBobGpzLkNfTlVNQkVSX01PREUsXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3ByZXByb2Nlc3NvcicsXG4gICAgICAgIGJlZ2luOiAnXiMnLCBlbmQ6ICckJyxcbiAgICAgICAgcmVsZXZhbmNlOiAyXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb25zdGFudCcsXG4gICAgICAgIGJlZ2luOiAnIFtBLVpfXSsgJyxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnY2FsbCBjbGFzcyBjb25zdCBkaW0gZG8gbG9vcCBlcmFzZSBleGVjdXRlIGV4ZWN1dGVnbG9iYWwgZXhpdCBmb3IgZWFjaCBuZXh0IGZ1bmN0aW9uICcgK1xuICAgICAgICAnaWYgdGhlbiBlbHNlIG9uIGVycm9yIG9wdGlvbiBleHBsaWNpdCBuZXcgcHJpdmF0ZSBwcm9wZXJ0eSBsZXQgZ2V0IHB1YmxpYyByYW5kb21pemUgJyArXG4gICAgICAgICdyZWRpbSByZW0gc2VsZWN0IGNhc2Ugc2V0IHN0b3Agc3ViIHdoaWxlIHdlbmQgd2l0aCBlbmQgdG8gZWxzZWlmIGlzIG9yIHhvciBhbmQgbm90ICcgK1xuICAgICAgICAnY2xhc3NfaW5pdGlhbGl6ZSBjbGFzc190ZXJtaW5hdGUgZGVmYXVsdCBwcmVzZXJ2ZSBpbiBtZSBieXZhbCBieXJlZiBzdGVwIHJlc3VtZSBnb3RvJyxcbiAgICAgIGJ1aWx0X2luOlxuICAgICAgICAnbGNhc2UgbW9udGggdmFydHlwZSBpbnN0cnJldiB1Ym91bmQgc2V0bG9jYWxlIGdldG9iamVjdCByZ2IgZ2V0cmVmIHN0cmluZyAnICtcbiAgICAgICAgJ3dlZWtkYXluYW1lIHJuZCBkYXRlYWRkIG1vbnRobmFtZSBub3cgZGF5IG1pbnV0ZSBpc2FycmF5IGNib29sIHJvdW5kIGZvcm1hdGN1cnJlbmN5ICcgK1xuICAgICAgICAnY29udmVyc2lvbnMgY3NuZyB0aW1ldmFsdWUgc2Vjb25kIHllYXIgc3BhY2UgYWJzIGNsbmcgdGltZXNlcmlhbCBmaXhzIGxlbiBhc2MgJyArXG4gICAgICAgICdpc2VtcHR5IG1hdGhzIGRhdGVzZXJpYWwgYXRuIHRpbWVyIGlzb2JqZWN0IGZpbHRlciB3ZWVrZGF5IGRhdGV2YWx1ZSBjY3VyIGlzZGF0ZSAnICtcbiAgICAgICAgJ2luc3RyIGRhdGVkaWZmIGZvcm1hdGRhdGV0aW1lIHJlcGxhY2UgaXNudWxsIHJpZ2h0IHNnbiBhcnJheSBzbnVtZXJpYyBsb2cgY2RibCBoZXggJyArXG4gICAgICAgICdjaHIgbGJvdW5kIG1zZ2JveCB1Y2FzZSBnZXRsb2NhbGUgY29zIGNkYXRlIGNieXRlIHJ0cmltIGpvaW4gaG91ciBvY3QgdHlwZW5hbWUgdHJpbSAnICtcbiAgICAgICAgJ3N0cmNvbXAgaW50IGNyZWF0ZW9iamVjdCBsb2FkcGljdHVyZSB0YW4gZm9ybWF0bnVtYmVyIG1pZCBzY3JpcHRlbmdpbmVidWlsZHZlcnNpb24gJyArXG4gICAgICAgICdzY3JpcHRlbmdpbmUgc3BsaXQgc2NyaXB0ZW5naW5lbWlub3J2ZXJzaW9uIGNpbnQgc2luIGRhdGVwYXJ0IGx0cmltIHNxciAnICtcbiAgICAgICAgJ3NjcmlwdGVuZ2luZW1ham9ydmVyc2lvbiB0aW1lIGRlcml2ZWQgZXZhbCBkYXRlIGZvcm1hdHBlcmNlbnQgZXhwIGlucHV0Ym94IGxlZnQgYXNjdyAnICtcbiAgICAgICAgJ2NocncgcmVnZXhwIHNlcnZlciByZXNwb25zZSByZXF1ZXN0IGNzdHIgZXJyJyxcbiAgICAgIGxpdGVyYWw6XG4gICAgICAgICd0cnVlIGZhbHNlIG51bGwgbm90aGluZyBlbXB0eSdcbiAgICB9LFxuICAgIGlsbGVnYWw6ICcvLycsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIGhsanMuaW5oZXJpdChobGpzLlFVT1RFX1NUUklOR19NT0RFLCB7Y29udGFpbnM6IFt7YmVnaW46ICdcIlwiJ31dfSksXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJ1xcJycsIGVuZDogJyQnXG4gICAgICB9LFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFXG4gICAgXVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGhsanMpIHtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGtleXdvcmRzOiB7XG4gICAgICBrZXl3b3JkOlxuICAgICAgICAnYWJzIGFjY2VzcyBhZnRlciBhbGlhcyBhbGwgYW5kIGFyY2hpdGVjdHVyZSBhcnJheSBhc3NlcnQgYXR0cmlidXRlIGJlZ2luIGJsb2NrICcgK1xuICAgICAgICAnYm9keSBidWZmZXIgYnVzIGNhc2UgY29tcG9uZW50IGNvbmZpZ3VyYXRpb24gY29uc3RhbnQgY29udGV4dCBjb3ZlciBkaXNjb25uZWN0ICcgK1xuICAgICAgICAnZG93bnRvIGRlZmF1bHQgZWxzZSBlbHNpZiBlbmQgZW50aXR5IGV4aXQgZmFpcm5lc3MgZmlsZSBmb3IgZm9yY2UgZnVuY3Rpb24gZ2VuZXJhdGUgJyArXG4gICAgICAgICdnZW5lcmljIGdyb3VwIGd1YXJkZWQgaWYgaW1wdXJlIGluIGluZXJ0aWFsIGlub3V0IGlzIGxhYmVsIGxpYnJhcnkgbGlua2FnZSBsaXRlcmFsICcgK1xuICAgICAgICAnbG9vcCBtYXAgbW9kIG5hbmQgbmV3IG5leHQgbm9yIG5vdCBudWxsIG9mIG9uIG9wZW4gb3Igb3RoZXJzIG91dCBwYWNrYWdlIHBvcnQgJyArXG4gICAgICAgICdwb3N0cG9uZWQgcHJvY2VkdXJlIHByb2Nlc3MgcHJvcGVydHkgcHJvdGVjdGVkIHB1cmUgcmFuZ2UgcmVjb3JkIHJlZ2lzdGVyIHJlamVjdCAnICtcbiAgICAgICAgJ3JlbGVhc2UgcmVtIHJlcG9ydCByZXN0cmljdCByZXN0cmljdF9ndWFyYW50ZWUgcmV0dXJuIHJvbCByb3Igc2VsZWN0IHNlcXVlbmNlICcgK1xuICAgICAgICAnc2V2ZXJpdHkgc2hhcmVkIHNpZ25hbCBzbGEgc2xsIHNyYSBzcmwgc3Ryb25nIHN1YnR5cGUgdGhlbiB0byB0cmFuc3BvcnQgdHlwZSAnICtcbiAgICAgICAgJ3VuYWZmZWN0ZWQgdW5pdHMgdW50aWwgdXNlIHZhcmlhYmxlIHZtb2RlIHZwcm9wIHZ1bml0IHdhaXQgd2hlbiB3aGlsZSB3aXRoIHhub3IgeG9yJyxcbiAgICAgIHR5cGVuYW1lOlxuICAgICAgICAnYm9vbGVhbiBiaXQgY2hhcmFjdGVyIHNldmVyaXR5X2xldmVsIGludGVnZXIgdGltZSBkZWxheV9sZW5ndGggbmF0dXJhbCBwb3NpdGl2ZSAnICtcbiAgICAgICAgJ3N0cmluZyBiaXRfdmVjdG9yIGZpbGVfb3Blbl9raW5kIGZpbGVfb3Blbl9zdGF0dXMgc3RkX3Vsb2dpYyBzdGRfdWxvZ2ljX3ZlY3RvciAnICtcbiAgICAgICAgJ3N0ZF9sb2dpYyBzdGRfbG9naWNfdmVjdG9yIHVuc2lnbmVkIHNpZ25lZCBib29sZWFuX3ZlY3RvciBpbnRlZ2VyX3ZlY3RvciAnICtcbiAgICAgICAgJ3JlYWxfdmVjdG9yIHRpbWVfdmVjdG9yJ1xuICAgIH0sXG4gICAgaWxsZWdhbDogJ3snLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICBobGpzLkNfQkxPQ0tfQ09NTUVOVF9NT0RFLCAgICAgICAgLy8gVkhETC0yMDA4IGJsb2NrIGNvbW1lbnRpbmcuXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ2NvbW1lbnQnLFxuICAgICAgICBiZWdpbjogJy0tJywgZW5kOiAnJCdcbiAgICAgIH0sXG4gICAgICBobGpzLlFVT1RFX1NUUklOR19NT0RFLFxuICAgICAgaGxqcy5DX05VTUJFUl9NT0RFLFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdsaXRlcmFsJyxcbiAgICAgICAgYmVnaW46ICdcXCcoVXxYfDB8MXxafFd8THxIfC0pXFwnJyxcbiAgICAgICAgY29udGFpbnM6IFtobGpzLkJBQ0tTTEFTSF9FU0NBUEVdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdhdHRyaWJ1dGUnLFxuICAgICAgICBiZWdpbjogJ1xcJ1tBLVphLXpdKF8/W0EtWmEtejAtOV0pKicsXG4gICAgICAgIGNvbnRhaW5zOiBbaGxqcy5CQUNLU0xBU0hfRVNDQVBFXVxuICAgICAgfVxuICAgIF1cbiAgfTsgLy8gcmV0dXJuXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaGxqcykge1xuICB2YXIgWE1MX0lERU5UX1JFID0gJ1tBLVphLXowLTlcXFxcLl86LV0rJztcbiAgdmFyIFRBR19JTlRFUk5BTFMgPSB7XG4gICAgZW5kc1dpdGhQYXJlbnQ6IHRydWUsXG4gICAgY29udGFpbnM6IFtcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnYXR0cmlidXRlJyxcbiAgICAgICAgYmVnaW46IFhNTF9JREVOVF9SRSxcbiAgICAgICAgcmVsZXZhbmNlOiAwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz1cIicsIHJldHVybkJlZ2luOiB0cnVlLCBlbmQ6ICdcIicsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgICAgYmVnaW46ICdcIicsIGVuZHNXaXRoUGFyZW50OiB0cnVlXG4gICAgICAgIH1dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJz1cXCcnLCByZXR1cm5CZWdpbjogdHJ1ZSwgZW5kOiAnXFwnJyxcbiAgICAgICAgY29udGFpbnM6IFt7XG4gICAgICAgICAgY2xhc3NOYW1lOiAndmFsdWUnLFxuICAgICAgICAgIGJlZ2luOiAnXFwnJywgZW5kc1dpdGhQYXJlbnQ6IHRydWVcbiAgICAgICAgfV1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGJlZ2luOiAnPScsXG4gICAgICAgIGNvbnRhaW5zOiBbe1xuICAgICAgICAgIGNsYXNzTmFtZTogJ3ZhbHVlJyxcbiAgICAgICAgICBiZWdpbjogJ1teXFxcXHMvPl0rJ1xuICAgICAgICB9XVxuICAgICAgfVxuICAgIF1cbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBjYXNlX2luc2Vuc2l0aXZlOiB0cnVlLFxuICAgIGNvbnRhaW5zOiBbXG4gICAgICB7XG4gICAgICAgIGNsYXNzTmFtZTogJ3BpJyxcbiAgICAgICAgYmVnaW46ICc8XFxcXD8nLCBlbmQ6ICdcXFxcPz4nLFxuICAgICAgICByZWxldmFuY2U6IDEwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdkb2N0eXBlJyxcbiAgICAgICAgYmVnaW46ICc8IURPQ1RZUEUnLCBlbmQ6ICc+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMCxcbiAgICAgICAgY29udGFpbnM6IFt7YmVnaW46ICdcXFxcWycsIGVuZDogJ1xcXFxdJ31dXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICdjb21tZW50JyxcbiAgICAgICAgYmVnaW46ICc8IS0tJywgZW5kOiAnLS0+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAnY2RhdGEnLFxuICAgICAgICBiZWdpbjogJzxcXFxcIVxcXFxbQ0RBVEFcXFxcWycsIGVuZDogJ1xcXFxdXFxcXF0+JyxcbiAgICAgICAgcmVsZXZhbmNlOiAxMFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgLypcbiAgICAgICAgVGhlIGxvb2thaGVhZCBwYXR0ZXJuICg/PS4uLikgZW5zdXJlcyB0aGF0ICdiZWdpbicgb25seSBtYXRjaGVzXG4gICAgICAgICc8c3R5bGUnIGFzIGEgc2luZ2xlIHdvcmQsIGZvbGxvd2VkIGJ5IGEgd2hpdGVzcGFjZSBvciBhblxuICAgICAgICBlbmRpbmcgYnJha2V0LiBUaGUgJyQnIGlzIG5lZWRlZCBmb3IgdGhlIGxleGVtIHRvIGJlIHJlY29nbml6ZWRcbiAgICAgICAgYnkgaGxqcy5zdWJNb2RlKCkgdGhhdCB0ZXN0cyBsZXhlbXMgb3V0c2lkZSB0aGUgc3RyZWFtLlxuICAgICAgICAqL1xuICAgICAgICBiZWdpbjogJzxzdHlsZSg/PVxcXFxzfD58JCknLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IHt0aXRsZTogJ3N0eWxlJ30sXG4gICAgICAgIGNvbnRhaW5zOiBbVEFHX0lOVEVSTkFMU10sXG4gICAgICAgIHN0YXJ0czoge1xuICAgICAgICAgIGVuZDogJzwvc3R5bGU+JywgcmV0dXJuRW5kOiB0cnVlLFxuICAgICAgICAgIHN1Ykxhbmd1YWdlOiAnY3NzJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGFzc05hbWU6ICd0YWcnLFxuICAgICAgICAvLyBTZWUgdGhlIGNvbW1lbnQgaW4gdGhlIDxzdHlsZSB0YWcgYWJvdXQgdGhlIGxvb2thaGVhZCBwYXR0ZXJuXG4gICAgICAgIGJlZ2luOiAnPHNjcmlwdCg/PVxcXFxzfD58JCknLCBlbmQ6ICc+JyxcbiAgICAgICAga2V5d29yZHM6IHt0aXRsZTogJ3NjcmlwdCd9LFxuICAgICAgICBjb250YWluczogW1RBR19JTlRFUk5BTFNdLFxuICAgICAgICBzdGFydHM6IHtcbiAgICAgICAgICBlbmQ6ICc8L3NjcmlwdD4nLCByZXR1cm5FbmQ6IHRydWUsXG4gICAgICAgICAgc3ViTGFuZ3VhZ2U6ICdqYXZhc2NyaXB0J1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBiZWdpbjogJzwlJywgZW5kOiAnJT4nLFxuICAgICAgICBzdWJMYW5ndWFnZTogJ3Zic2NyaXB0J1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgY2xhc3NOYW1lOiAndGFnJyxcbiAgICAgICAgYmVnaW46ICc8Lz8nLCBlbmQ6ICcvPz4nLFxuICAgICAgICBjb250YWluczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNsYXNzTmFtZTogJ3RpdGxlJywgYmVnaW46ICdbXiAvPl0rJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgVEFHX0lOVEVSTkFMU1xuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9O1xufTsiLCJ2YXIgaW5zZXJ0ZWQgPSBbXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gICAgaWYgKGluc2VydGVkLmluZGV4T2YoY3NzKSA+PSAwKSByZXR1cm47XG4gICAgaW5zZXJ0ZWQucHVzaChjc3MpO1xuICAgIFxuICAgIHZhciBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICB2YXIgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG4gICAgZWxlbS5hcHBlbmRDaGlsZCh0ZXh0KTtcbiAgICBcbiAgICBpZiAoZG9jdW1lbnQuaGVhZC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBkb2N1bWVudC5oZWFkLmluc2VydEJlZm9yZShlbGVtLCBkb2N1bWVudC5oZWFkLmNoaWxkTm9kZXNbMF0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChlbGVtKTtcbiAgICB9XG59O1xuIiwiLy8gICAgIGtleW1hc3Rlci5qc1xuLy8gICAgIChjKSAyMDExIFRob21hcyBGdWNoc1xuLy8gICAgIGtleW1hc3Rlci5qcyBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuOyhmdW5jdGlvbihnbG9iYWwpe1xuICB2YXIgayxcbiAgICBfaGFuZGxlcnMgPSB7fSxcbiAgICBfbW9kcyA9IHsgMTY6IGZhbHNlLCAxODogZmFsc2UsIDE3OiBmYWxzZSwgOTE6IGZhbHNlIH0sXG4gICAgX3Njb3BlID0gJ2FsbCcsXG4gICAgLy8gbW9kaWZpZXIga2V5c1xuICAgIF9NT0RJRklFUlMgPSB7XG4gICAgICAn4oenJzogMTYsIHNoaWZ0OiAxNixcbiAgICAgICfijKUnOiAxOCwgYWx0OiAxOCwgb3B0aW9uOiAxOCxcbiAgICAgICfijIMnOiAxNywgY3RybDogMTcsIGNvbnRyb2w6IDE3LFxuICAgICAgJ+KMmCc6IDkxLCBjb21tYW5kOiA5MVxuICAgIH0sXG4gICAgLy8gc3BlY2lhbCBrZXlzXG4gICAgX01BUCA9IHtcbiAgICAgIGJhY2tzcGFjZTogOCwgdGFiOiA5LCBjbGVhcjogMTIsXG4gICAgICBlbnRlcjogMTMsICdyZXR1cm4nOiAxMyxcbiAgICAgIGVzYzogMjcsIGVzY2FwZTogMjcsIHNwYWNlOiAzMixcbiAgICAgIGxlZnQ6IDM3LCB1cDogMzgsXG4gICAgICByaWdodDogMzksIGRvd246IDQwLFxuICAgICAgZGVsOiA0NiwgJ2RlbGV0ZSc6IDQ2LFxuICAgICAgaG9tZTogMzYsIGVuZDogMzUsXG4gICAgICBwYWdldXA6IDMzLCBwYWdlZG93bjogMzQsXG4gICAgICAnLCc6IDE4OCwgJy4nOiAxOTAsICcvJzogMTkxLFxuICAgICAgJ2AnOiAxOTIsICctJzogMTg5LCAnPSc6IDE4NyxcbiAgICAgICc7JzogMTg2LCAnXFwnJzogMjIyLFxuICAgICAgJ1snOiAyMTksICddJzogMjIxLCAnXFxcXCc6IDIyMFxuICAgIH07XG5cbiAgZm9yKGs9MTtrPDIwO2srKykgX01PRElGSUVSU1snZicra10gPSAxMTEraztcblxuICAvLyBJRSBkb2Vzbid0IHN1cHBvcnQgQXJyYXkjaW5kZXhPZiwgc28gaGF2ZSBhIHNpbXBsZSByZXBsYWNlbWVudFxuICBmdW5jdGlvbiBpbmRleChhcnJheSwgaXRlbSl7XG4gICAgdmFyIGkgPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUoaS0tKSBpZihhcnJheVtpXT09PWl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBrZXlkb3duIGV2ZW50XG4gIGZ1bmN0aW9uIGRpc3BhdGNoKGV2ZW50KXtcbiAgICB2YXIga2V5LCB0YWdOYW1lLCBoYW5kbGVyLCBrLCBpLCBtb2RpZmllcnNNYXRjaDtcbiAgICB0YWdOYW1lID0gKGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50KS50YWdOYW1lO1xuICAgIGtleSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICAvLyBpZiBhIG1vZGlmaWVyIGtleSwgc2V0IHRoZSBrZXkuPG1vZGlmaWVya2V5bmFtZT4gcHJvcGVydHkgdG8gdHJ1ZSBhbmQgcmV0dXJuXG4gICAgaWYoa2V5ID09IDkzIHx8IGtleSA9PSAyMjQpIGtleSA9IDkxOyAvLyByaWdodCBjb21tYW5kIG9uIHdlYmtpdCwgY29tbWFuZCBvbiBHZWNrb1xuICAgIGlmKGtleSBpbiBfbW9kcykge1xuICAgICAgX21vZHNba2V5XSA9IHRydWU7XG4gICAgICAvLyAnYXNzaWduS2V5JyBmcm9tIGluc2lkZSB0aGlzIGNsb3N1cmUgaXMgZXhwb3J0ZWQgdG8gd2luZG93LmtleVxuICAgICAgZm9yKGsgaW4gX01PRElGSUVSUykgaWYoX01PRElGSUVSU1trXSA9PSBrZXkpIGFzc2lnbktleVtrXSA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWdub3JlIGtleXByZXNzZWQgaW4gYW55IGVsZW1lbnRzIHRoYXQgc3VwcG9ydCBrZXlib2FyZCBkYXRhIGlucHV0XG4gICAgaWYgKHRhZ05hbWUgPT0gJ0lOUFVUJyB8fCB0YWdOYW1lID09ICdTRUxFQ1QnIHx8IHRhZ05hbWUgPT0gJ1RFWFRBUkVBJykgcmV0dXJuO1xuXG4gICAgLy8gYWJvcnQgaWYgbm8gcG90ZW50aWFsbHkgbWF0Y2hpbmcgc2hvcnRjdXRzIGZvdW5kXG4gICAgaWYgKCEoa2V5IGluIF9oYW5kbGVycykpIHJldHVybjtcblxuICAgIC8vIGZvciBlYWNoIHBvdGVudGlhbCBzaG9ydGN1dFxuICAgIGZvciAoaSA9IDA7IGkgPCBfaGFuZGxlcnNba2V5XS5sZW5ndGg7IGkrKykge1xuICAgICAgaGFuZGxlciA9IF9oYW5kbGVyc1trZXldW2ldO1xuXG4gICAgICAvLyBzZWUgaWYgaXQncyBpbiB0aGUgY3VycmVudCBzY29wZVxuICAgICAgaWYoaGFuZGxlci5zY29wZSA9PSBfc2NvcGUgfHwgaGFuZGxlci5zY29wZSA9PSAnYWxsJyl7XG4gICAgICAgIC8vIGNoZWNrIGlmIG1vZGlmaWVycyBtYXRjaCBpZiBhbnlcbiAgICAgICAgbW9kaWZpZXJzTWF0Y2ggPSBoYW5kbGVyLm1vZHMubGVuZ3RoID4gMDtcbiAgICAgICAgZm9yKGsgaW4gX21vZHMpXG4gICAgICAgICAgaWYoKCFfbW9kc1trXSAmJiBpbmRleChoYW5kbGVyLm1vZHMsICtrKSA+IC0xKSB8fFxuICAgICAgICAgICAgKF9tb2RzW2tdICYmIGluZGV4KGhhbmRsZXIubW9kcywgK2spID09IC0xKSkgbW9kaWZpZXJzTWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgLy8gY2FsbCB0aGUgaGFuZGxlciBhbmQgc3RvcCB0aGUgZXZlbnQgaWYgbmVjY2Vzc2FyeVxuICAgICAgICBpZigoaGFuZGxlci5tb2RzLmxlbmd0aCA9PSAwICYmICFfbW9kc1sxNl0gJiYgIV9tb2RzWzE4XSAmJiAhX21vZHNbMTddICYmICFfbW9kc1s5MV0pIHx8IG1vZGlmaWVyc01hdGNoKXtcbiAgICAgICAgICBpZihoYW5kbGVyLm1ldGhvZChldmVudCwgaGFuZGxlcik9PT1mYWxzZSl7XG4gICAgICAgICAgICBpZihldmVudC5wcmV2ZW50RGVmYXVsdCkgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZWxzZSBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGlmKGV2ZW50LmNhbmNlbEJ1YmJsZSkgZXZlbnQuY2FuY2VsQnViYmxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblx0fVxuICB9O1xuXG4gIC8vIHVuc2V0IG1vZGlmaWVyIGtleXMgb24ga2V5dXBcbiAgZnVuY3Rpb24gY2xlYXJNb2RpZmllcihldmVudCl7XG4gICAgdmFyIGtleSA9IGV2ZW50LmtleUNvZGUsIGs7XG4gICAgaWYoa2V5ID09IDkzIHx8IGtleSA9PSAyMjQpIGtleSA9IDkxO1xuICAgIGlmKGtleSBpbiBfbW9kcykge1xuICAgICAgX21vZHNba2V5XSA9IGZhbHNlO1xuICAgICAgZm9yKGsgaW4gX01PRElGSUVSUykgaWYoX01PRElGSUVSU1trXSA9PSBrZXkpIGFzc2lnbktleVtrXSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICAvLyBwYXJzZSBhbmQgYXNzaWduIHNob3J0Y3V0XG4gIGZ1bmN0aW9uIGFzc2lnbktleShrZXksIHNjb3BlLCBtZXRob2Qpe1xuICAgIHZhciBrZXlzLCBtb2RzLCBpLCBtaTtcbiAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG1ldGhvZCA9IHNjb3BlO1xuICAgICAgc2NvcGUgPSAnYWxsJztcbiAgICB9XG4gICAga2V5ID0ga2V5LnJlcGxhY2UoL1xccy9nLCcnKTtcbiAgICBrZXlzID0ga2V5LnNwbGl0KCcsJyk7XG5cbiAgICBpZigoa2V5c1trZXlzLmxlbmd0aC0xXSk9PScnKVxuICAgICAga2V5c1trZXlzLmxlbmd0aC0yXSArPSAnLCc7XG4gICAgLy8gZm9yIGVhY2ggc2hvcnRjdXRcbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gc2V0IG1vZGlmaWVyIGtleXMgaWYgYW55XG4gICAgICBtb2RzID0gW107XG4gICAgICBrZXkgPSBrZXlzW2ldLnNwbGl0KCcrJyk7XG4gICAgICBpZihrZXkubGVuZ3RoID4gMSl7XG4gICAgICAgIG1vZHMgPSBrZXkuc2xpY2UoMCxrZXkubGVuZ3RoLTEpO1xuICAgICAgICBmb3IgKG1pID0gMDsgbWkgPCBtb2RzLmxlbmd0aDsgbWkrKylcbiAgICAgICAgICBtb2RzW21pXSA9IF9NT0RJRklFUlNbbW9kc1ttaV1dO1xuICAgICAgICBrZXkgPSBba2V5W2tleS5sZW5ndGgtMV1dO1xuICAgICAgfVxuICAgICAgLy8gY29udmVydCB0byBrZXljb2RlIGFuZC4uLlxuICAgICAga2V5ID0ga2V5WzBdXG4gICAgICBrZXkgPSBfTUFQW2tleV0gfHwga2V5LnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgICAgIC8vIC4uLnN0b3JlIGhhbmRsZXJcbiAgICAgIGlmICghKGtleSBpbiBfaGFuZGxlcnMpKSBfaGFuZGxlcnNba2V5XSA9IFtdO1xuICAgICAgX2hhbmRsZXJzW2tleV0ucHVzaCh7IHNob3J0Y3V0OiBrZXlzW2ldLCBzY29wZTogc2NvcGUsIG1ldGhvZDogbWV0aG9kLCBrZXk6IGtleXNbaV0sIG1vZHM6IG1vZHMgfSk7XG4gICAgfVxuICB9O1xuXG4gIC8vIGluaXRpYWxpemUga2V5Ljxtb2RpZmllcj4gdG8gZmFsc2VcbiAgZm9yKGsgaW4gX01PRElGSUVSUykgYXNzaWduS2V5W2tdID0gZmFsc2U7XG5cbiAgLy8gc2V0IGN1cnJlbnQgc2NvcGUgKGRlZmF1bHQgJ2FsbCcpXG4gIGZ1bmN0aW9uIHNldFNjb3BlKHNjb3BlKXsgX3Njb3BlID0gc2NvcGUgfHwgJ2FsbCcgfTtcblxuICAvLyBjcm9zcy1icm93c2VyIGV2ZW50c1xuICBmdW5jdGlvbiBhZGRFdmVudChvYmplY3QsIGV2ZW50LCBtZXRob2QpIHtcbiAgICBpZiAob2JqZWN0LmFkZEV2ZW50TGlzdGVuZXIpXG4gICAgICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbWV0aG9kLCBmYWxzZSk7XG4gICAgZWxzZSBpZihvYmplY3QuYXR0YWNoRXZlbnQpXG4gICAgICBvYmplY3QuYXR0YWNoRXZlbnQoJ29uJytldmVudCwgZnVuY3Rpb24oKXsgbWV0aG9kKHdpbmRvdy5ldmVudCkgfSk7XG4gIH07XG5cbiAgLy8gc2V0IHRoZSBoYW5kbGVycyBnbG9iYWxseSBvbiBkb2N1bWVudFxuICBhZGRFdmVudChkb2N1bWVudCwgJ2tleWRvd24nLCBkaXNwYXRjaCk7XG4gIGFkZEV2ZW50KGRvY3VtZW50LCAna2V5dXAnLCBjbGVhck1vZGlmaWVyKTtcblxuICAvLyBzZXQgd2luZG93LmtleSBhbmQgd2luZG93LmtleS5zZXRTY29wZVxuICBnbG9iYWwua2V5ID0gYXNzaWduS2V5O1xuICBnbG9iYWwua2V5LnNldFNjb3BlID0gc2V0U2NvcGU7XG5cbiAgaWYodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLmtleTtcblxufSkodGhpcyk7XG4iLCJ2YXIgZ2xvYmFsPXR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fTsvKipcbiAqIG1hcmtlZCAtIGEgbWFya2Rvd24gcGFyc2VyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMywgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGpqL21hcmtlZFxuICovXG5cbjsoZnVuY3Rpb24oKSB7XG5cbi8qKlxuICogQmxvY2stTGV2ZWwgR3JhbW1hclxuICovXG5cbnZhciBibG9jayA9IHtcbiAgbmV3bGluZTogL15cXG4rLyxcbiAgY29kZTogL14oIHs0fVteXFxuXStcXG4qKSsvLFxuICBmZW5jZXM6IG5vb3AsXG4gIGhyOiAvXiggKlstKl9dKXszLH0gKig/Olxcbit8JCkvLFxuICBoZWFkaW5nOiAvXiAqKCN7MSw2fSkgKihbXlxcbl0rPykgKiMqICooPzpcXG4rfCQpLyxcbiAgbnB0YWJsZTogbm9vcCxcbiAgbGhlYWRpbmc6IC9eKFteXFxuXSspXFxuICooPXwtKXszLH0gKlxcbiovLFxuICBibG9ja3F1b3RlOiAvXiggKj5bXlxcbl0rKFxcblteXFxuXSspKlxcbiopKy8sXG4gIGxpc3Q6IC9eKCAqKShidWxsKSBbXFxzXFxTXSs/KD86aHJ8XFxuezIsfSg/ISApKD8hXFwxYnVsbCApXFxuKnxcXHMqJCkvLFxuICBodG1sOiAvXiAqKD86Y29tbWVudHxjbG9zZWR8Y2xvc2luZykgKig/OlxcbnsyLH18XFxzKiQpLyxcbiAgZGVmOiAvXiAqXFxbKFteXFxdXSspXFxdOiAqPD8oW15cXHM+XSspPj8oPzogK1tcIihdKFteXFxuXSspW1wiKV0pPyAqKD86XFxuK3wkKS8sXG4gIHRhYmxlOiBub29wLFxuICBwYXJhZ3JhcGg6IC9eKCg/OlteXFxuXStcXG4/KD8haHJ8aGVhZGluZ3xsaGVhZGluZ3xibG9ja3F1b3RlfHRhZ3xkZWYpKSspXFxuKi8sXG4gIHRleHQ6IC9eW15cXG5dKy9cbn07XG5cbmJsb2NrLmJ1bGxldCA9IC8oPzpbKistXXxcXGQrXFwuKS87XG5ibG9jay5pdGVtID0gL14oICopKGJ1bGwpIFteXFxuXSooPzpcXG4oPyFcXDFidWxsIClbXlxcbl0qKSovO1xuYmxvY2suaXRlbSA9IHJlcGxhY2UoYmxvY2suaXRlbSwgJ2dtJylcbiAgKC9idWxsL2csIGJsb2NrLmJ1bGxldClcbiAgKCk7XG5cbmJsb2NrLmxpc3QgPSByZXBsYWNlKGJsb2NrLmxpc3QpXG4gICgvYnVsbC9nLCBibG9jay5idWxsZXQpXG4gICgnaHInLCAvXFxuKyg/PSg/OiAqWy0qX10pezMsfSAqKD86XFxuK3wkKSkvKVxuICAoKTtcblxuYmxvY2suX3RhZyA9ICcoPyEoPzonXG4gICsgJ2F8ZW18c3Ryb25nfHNtYWxsfHN8Y2l0ZXxxfGRmbnxhYmJyfGRhdGF8dGltZXxjb2RlJ1xuICArICd8dmFyfHNhbXB8a2JkfHN1YnxzdXB8aXxifHV8bWFya3xydWJ5fHJ0fHJwfGJkaXxiZG8nXG4gICsgJ3xzcGFufGJyfHdicnxpbnN8ZGVsfGltZylcXFxcYilcXFxcdysoPyE6L3xAKVxcXFxiJztcblxuYmxvY2suaHRtbCA9IHJlcGxhY2UoYmxvY2suaHRtbClcbiAgKCdjb21tZW50JywgLzwhLS1bXFxzXFxTXSo/LS0+LylcbiAgKCdjbG9zZWQnLCAvPCh0YWcpW1xcc1xcU10rPzxcXC9cXDE+LylcbiAgKCdjbG9zaW5nJywgLzx0YWcoPzpcIlteXCJdKlwifCdbXiddKid8W14nXCI+XSkqPz4vKVxuICAoL3RhZy9nLCBibG9jay5fdGFnKVxuICAoKTtcblxuYmxvY2sucGFyYWdyYXBoID0gcmVwbGFjZShibG9jay5wYXJhZ3JhcGgpXG4gICgnaHInLCBibG9jay5ocilcbiAgKCdoZWFkaW5nJywgYmxvY2suaGVhZGluZylcbiAgKCdsaGVhZGluZycsIGJsb2NrLmxoZWFkaW5nKVxuICAoJ2Jsb2NrcXVvdGUnLCBibG9jay5ibG9ja3F1b3RlKVxuICAoJ3RhZycsICc8JyArIGJsb2NrLl90YWcpXG4gICgnZGVmJywgYmxvY2suZGVmKVxuICAoKTtcblxuLyoqXG4gKiBOb3JtYWwgQmxvY2sgR3JhbW1hclxuICovXG5cbmJsb2NrLm5vcm1hbCA9IG1lcmdlKHt9LCBibG9jayk7XG5cbi8qKlxuICogR0ZNIEJsb2NrIEdyYW1tYXJcbiAqL1xuXG5ibG9jay5nZm0gPSBtZXJnZSh7fSwgYmxvY2subm9ybWFsLCB7XG4gIGZlbmNlczogL14gKihgezMsfXx+ezMsfSkgKihcXFMrKT8gKlxcbihbXFxzXFxTXSs/KVxccypcXDEgKig/Olxcbit8JCkvLFxuICBwYXJhZ3JhcGg6IC9eL1xufSk7XG5cbmJsb2NrLmdmbS5wYXJhZ3JhcGggPSByZXBsYWNlKGJsb2NrLnBhcmFncmFwaClcbiAgKCcoPyEnLCAnKD8hJyArIGJsb2NrLmdmbS5mZW5jZXMuc291cmNlLnJlcGxhY2UoJ1xcXFwxJywgJ1xcXFwyJykgKyAnfCcpXG4gICgpO1xuXG4vKipcbiAqIEdGTSArIFRhYmxlcyBCbG9jayBHcmFtbWFyXG4gKi9cblxuYmxvY2sudGFibGVzID0gbWVyZ2Uoe30sIGJsb2NrLmdmbSwge1xuICBucHRhYmxlOiAvXiAqKFxcUy4qXFx8LiopXFxuICooWy06XSsgKlxcfFstfCA6XSopXFxuKCg/Oi4qXFx8LiooPzpcXG58JCkpKilcXG4qLyxcbiAgdGFibGU6IC9eICpcXHwoLispXFxuICpcXHwoICpbLTpdK1stfCA6XSopXFxuKCg/OiAqXFx8LiooPzpcXG58JCkpKilcXG4qL1xufSk7XG5cbi8qKlxuICogQmxvY2sgTGV4ZXJcbiAqL1xuXG5mdW5jdGlvbiBMZXhlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW5zLmxpbmtzID0ge307XG4gIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgbWFya2VkLmRlZmF1bHRzO1xuICB0aGlzLnJ1bGVzID0gYmxvY2subm9ybWFsO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy50YWJsZXMpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBibG9jay50YWJsZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucnVsZXMgPSBibG9jay5nZm07XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRXhwb3NlIEJsb2NrIFJ1bGVzXG4gKi9cblxuTGV4ZXIucnVsZXMgPSBibG9jaztcblxuLyoqXG4gKiBTdGF0aWMgTGV4IE1ldGhvZFxuICovXG5cbkxleGVyLmxleCA9IGZ1bmN0aW9uKHNyYywgb3B0aW9ucykge1xuICB2YXIgbGV4ZXIgPSBuZXcgTGV4ZXIob3B0aW9ucyk7XG4gIHJldHVybiBsZXhlci5sZXgoc3JjKTtcbn07XG5cbi8qKlxuICogUHJlcHJvY2Vzc2luZ1xuICovXG5cbkxleGVyLnByb3RvdHlwZS5sZXggPSBmdW5jdGlvbihzcmMpIHtcbiAgc3JjID0gc3JjXG4gICAgLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpXG4gICAgLnJlcGxhY2UoL1xcdC9nLCAnICAgICcpXG4gICAgLnJlcGxhY2UoL1xcdTAwYTAvZywgJyAnKVxuICAgIC5yZXBsYWNlKC9cXHUyNDI0L2csICdcXG4nKTtcblxuICByZXR1cm4gdGhpcy50b2tlbihzcmMsIHRydWUpO1xufTtcblxuLyoqXG4gKiBMZXhpbmdcbiAqL1xuXG5MZXhlci5wcm90b3R5cGUudG9rZW4gPSBmdW5jdGlvbihzcmMsIHRvcCkge1xuICB2YXIgc3JjID0gc3JjLnJlcGxhY2UoL14gKyQvZ20sICcnKVxuICAgICwgbmV4dFxuICAgICwgbG9vc2VcbiAgICAsIGNhcFxuICAgICwgYnVsbFxuICAgICwgYlxuICAgICwgaXRlbVxuICAgICwgc3BhY2VcbiAgICAsIGlcbiAgICAsIGw7XG5cbiAgd2hpbGUgKHNyYykge1xuICAgIC8vIG5ld2xpbmVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5uZXdsaW5lLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMF0ubGVuZ3RoID4gMSkge1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnc3BhY2UnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNvZGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGNhcCA9IGNhcFswXS5yZXBsYWNlKC9eIHs0fS9nbSwgJycpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgID8gY2FwLnJlcGxhY2UoL1xcbiskLywgJycpXG4gICAgICAgICAgOiBjYXBcbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZmVuY2VzIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZmVuY2VzLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgIGxhbmc6IGNhcFsyXSxcbiAgICAgICAgdGV4dDogY2FwWzNdXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGhlYWRpbmdcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5oZWFkaW5nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgIGRlcHRoOiBjYXBbMV0ubGVuZ3RoLFxuICAgICAgICB0ZXh0OiBjYXBbMl1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGFibGUgbm8gbGVhZGluZyBwaXBlIChnZm0pXG4gICAgaWYgKHRvcCAmJiAoY2FwID0gdGhpcy5ydWxlcy5ucHRhYmxlLmV4ZWMoc3JjKSkpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG5cbiAgICAgIGl0ZW0gPSB7XG4gICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgIGhlYWRlcjogY2FwWzFdLnJlcGxhY2UoL14gKnwgKlxcfCAqJC9nLCAnJykuc3BsaXQoLyAqXFx8ICovKSxcbiAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBjZWxsczogY2FwWzNdLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpXG4gICAgICB9O1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgaXRlbS5hbGlnbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2xlZnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0uY2VsbHNbaV0gPSBpdGVtLmNlbGxzW2ldLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGxoZWFkaW5nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGhlYWRpbmcuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgZGVwdGg6IGNhcFsyXSA9PT0gJz0nID8gMSA6IDIsXG4gICAgICAgIHRleHQ6IGNhcFsxXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBoclxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmhyLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnaHInXG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGJsb2NrcXVvdGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5ibG9ja3F1b3RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdibG9ja3F1b3RlX3N0YXJ0J1xuICAgICAgfSk7XG5cbiAgICAgIGNhcCA9IGNhcFswXS5yZXBsYWNlKC9eICo+ID8vZ20sICcnKTtcblxuICAgICAgLy8gUGFzcyBgdG9wYCB0byBrZWVwIHRoZSBjdXJyZW50XG4gICAgICAvLyBcInRvcGxldmVsXCIgc3RhdGUuIFRoaXMgaXMgZXhhY3RseVxuICAgICAgLy8gaG93IG1hcmtkb3duLnBsIHdvcmtzLlxuICAgICAgdGhpcy50b2tlbihjYXAsIHRvcCk7XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnYmxvY2txdW90ZV9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbGlzdFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmxpc3QuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgYnVsbCA9IGNhcFsyXTtcblxuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdsaXN0X3N0YXJ0JyxcbiAgICAgICAgb3JkZXJlZDogYnVsbC5sZW5ndGggPiAxXG4gICAgICB9KTtcblxuICAgICAgLy8gR2V0IGVhY2ggdG9wLWxldmVsIGl0ZW0uXG4gICAgICBjYXAgPSBjYXBbMF0ubWF0Y2godGhpcy5ydWxlcy5pdGVtKTtcblxuICAgICAgbmV4dCA9IGZhbHNlO1xuICAgICAgbCA9IGNhcC5sZW5ndGg7XG4gICAgICBpID0gMDtcblxuICAgICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaXRlbSA9IGNhcFtpXTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaXRlbSdzIGJ1bGxldFxuICAgICAgICAvLyBzbyBpdCBpcyBzZWVuIGFzIHRoZSBuZXh0IHRva2VuLlxuICAgICAgICBzcGFjZSA9IGl0ZW0ubGVuZ3RoO1xuICAgICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9eICooWyorLV18XFxkK1xcLikgKy8sICcnKTtcblxuICAgICAgICAvLyBPdXRkZW50IHdoYXRldmVyIHRoZVxuICAgICAgICAvLyBsaXN0IGl0ZW0gY29udGFpbnMuIEhhY2t5LlxuICAgICAgICBpZiAofml0ZW0uaW5kZXhPZignXFxuICcpKSB7XG4gICAgICAgICAgc3BhY2UgLT0gaXRlbS5sZW5ndGg7XG4gICAgICAgICAgaXRlbSA9ICF0aGlzLm9wdGlvbnMucGVkYW50aWNcbiAgICAgICAgICAgID8gaXRlbS5yZXBsYWNlKG5ldyBSZWdFeHAoJ14gezEsJyArIHNwYWNlICsgJ30nLCAnZ20nKSwgJycpXG4gICAgICAgICAgICA6IGl0ZW0ucmVwbGFjZSgvXiB7MSw0fS9nbSwgJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG5leHQgbGlzdCBpdGVtIGJlbG9uZ3MgaGVyZS5cbiAgICAgICAgLy8gQmFja3BlZGFsIGlmIGl0IGRvZXMgbm90IGJlbG9uZyBpbiB0aGlzIGxpc3QuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc21hcnRMaXN0cyAmJiBpICE9PSBsIC0gMSkge1xuICAgICAgICAgIGIgPSBibG9jay5idWxsZXQuZXhlYyhjYXBbaSsxXSlbMF07XG4gICAgICAgICAgaWYgKGJ1bGwgIT09IGIgJiYgIShidWxsLmxlbmd0aCA+IDEgJiYgYi5sZW5ndGggPiAxKSkge1xuICAgICAgICAgICAgc3JjID0gY2FwLnNsaWNlKGkgKyAxKS5qb2luKCdcXG4nKSArIHNyYztcbiAgICAgICAgICAgIGkgPSBsIC0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBpdGVtIGlzIGxvb3NlIG9yIG5vdC5cbiAgICAgICAgLy8gVXNlOiAvKF58XFxuKSg/ISApW15cXG5dK1xcblxcbig/IVxccyokKS9cbiAgICAgICAgLy8gZm9yIGRpc2NvdW50IGJlaGF2aW9yLlxuICAgICAgICBsb29zZSA9IG5leHQgfHwgL1xcblxcbig/IVxccyokKS8udGVzdChpdGVtKTtcbiAgICAgICAgaWYgKGkgIT09IGwgLSAxKSB7XG4gICAgICAgICAgbmV4dCA9IGl0ZW1baXRlbS5sZW5ndGgtMV0gPT09ICdcXG4nO1xuICAgICAgICAgIGlmICghbG9vc2UpIGxvb3NlID0gbmV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICAgIHR5cGU6IGxvb3NlXG4gICAgICAgICAgICA/ICdsb29zZV9pdGVtX3N0YXJ0J1xuICAgICAgICAgICAgOiAnbGlzdF9pdGVtX3N0YXJ0J1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZWN1cnNlLlxuICAgICAgICB0aGlzLnRva2VuKGl0ZW0sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnbGlzdF9pdGVtX2VuZCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goe1xuICAgICAgICB0eXBlOiAnbGlzdF9lbmQnXG4gICAgICB9KTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gaHRtbFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmh0bWwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZVxuICAgICAgICAgID8gJ3BhcmFncmFwaCdcbiAgICAgICAgICA6ICdodG1sJyxcbiAgICAgICAgcHJlOiBjYXBbMV0gPT09ICdwcmUnIHx8IGNhcFsxXSA9PT0gJ3NjcmlwdCcsXG4gICAgICAgIHRleHQ6IGNhcFswXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBkZWZcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLmRlZi5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMubGlua3NbY2FwWzFdLnRvTG93ZXJDYXNlKCldID0ge1xuICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgIH07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0YWJsZSAoZ2ZtKVxuICAgIGlmICh0b3AgJiYgKGNhcCA9IHRoaXMucnVsZXMudGFibGUuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcblxuICAgICAgaXRlbSA9IHtcbiAgICAgICAgdHlwZTogJ3RhYmxlJyxcbiAgICAgICAgaGVhZGVyOiBjYXBbMV0ucmVwbGFjZSgvXiAqfCAqXFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICBhbGlnbjogY2FwWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgIGNlbGxzOiBjYXBbM10ucmVwbGFjZSgvKD86ICpcXHwgKik/XFxuJC8sICcnKS5zcGxpdCgnXFxuJylcbiAgICAgIH07XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBpdGVtLmFsaWduLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdyaWdodCc7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgIH0gZWxzZSBpZiAoL14gKjotKyAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbS5hbGlnbltpXSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW0uY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbS5jZWxsc1tpXSA9IGl0ZW0uY2VsbHNbaV1cbiAgICAgICAgICAucmVwbGFjZSgvXiAqXFx8ICp8ICpcXHwgKiQvZywgJycpXG4gICAgICAgICAgLnNwbGl0KC8gKlxcfCAqLyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5zLnB1c2goaXRlbSk7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRvcC1sZXZlbCBwYXJhZ3JhcGhcbiAgICBpZiAodG9wICYmIChjYXAgPSB0aGlzLnJ1bGVzLnBhcmFncmFwaC5leGVjKHNyYykpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGhpcy50b2tlbnMucHVzaCh7XG4gICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICB0ZXh0OiBjYXBbMV1bY2FwWzFdLmxlbmd0aC0xXSA9PT0gJ1xcbidcbiAgICAgICAgICA/IGNhcFsxXS5zbGljZSgwLCAtMSlcbiAgICAgICAgICA6IGNhcFsxXVxuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB0ZXh0XG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMudGV4dC5leGVjKHNyYykpIHtcbiAgICAgIC8vIFRvcC1sZXZlbCBzaG91bGQgbmV2ZXIgcmVhY2ggaGVyZS5cbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICB0aGlzLnRva2Vucy5wdXNoKHtcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICB0ZXh0OiBjYXBbMF1cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhyb3cgbmV3XG4gICAgICAgIEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMudG9rZW5zO1xufTtcblxuLyoqXG4gKiBJbmxpbmUtTGV2ZWwgR3JhbW1hclxuICovXG5cbnZhciBpbmxpbmUgPSB7XG4gIGVzY2FwZTogL15cXFxcKFtcXFxcYCp7fVxcW1xcXSgpIytcXC0uIV8+XSkvLFxuICBhdXRvbGluazogL148KFteID5dKyhAfDpcXC8pW14gPl0rKT4vLFxuICB1cmw6IG5vb3AsXG4gIHRhZzogL148IS0tW1xcc1xcU10qPy0tPnxePFxcLz9cXHcrKD86XCJbXlwiXSpcInwnW14nXSonfFteJ1wiPl0pKj8+LyxcbiAgbGluazogL14hP1xcWyhpbnNpZGUpXFxdXFwoaHJlZlxcKS8sXG4gIHJlZmxpbms6IC9eIT9cXFsoaW5zaWRlKVxcXVxccypcXFsoW15cXF1dKilcXF0vLFxuICBub2xpbms6IC9eIT9cXFsoKD86XFxbW15cXF1dKlxcXXxbXlxcW1xcXV0pKilcXF0vLFxuICBzdHJvbmc6IC9eX18oW1xcc1xcU10rPylfXyg/IV8pfF5cXCpcXCooW1xcc1xcU10rPylcXCpcXCooPyFcXCopLyxcbiAgZW06IC9eXFxiXygoPzpfX3xbXFxzXFxTXSkrPylfXFxifF5cXCooKD86XFwqXFwqfFtcXHNcXFNdKSs/KVxcKig/IVxcKikvLFxuICBjb2RlOiAvXihgKylcXHMqKFtcXHNcXFNdKj9bXmBdKVxccypcXDEoPyFgKS8sXG4gIGJyOiAvXiB7Mix9XFxuKD8hXFxzKiQpLyxcbiAgZGVsOiBub29wLFxuICB0ZXh0OiAvXltcXHNcXFNdKz8oPz1bXFxcXDwhXFxbXypgXXwgezIsfVxcbnwkKS9cbn07XG5cbmlubGluZS5faW5zaWRlID0gLyg/OlxcW1teXFxdXSpcXF18W15cXF1dfFxcXSg/PVteXFxbXSpcXF0pKSovO1xuaW5saW5lLl9ocmVmID0gL1xccyo8PyhbXlxcc10qPyk+Pyg/OlxccytbJ1wiXShbXFxzXFxTXSo/KVsnXCJdKT9cXHMqLztcblxuaW5saW5lLmxpbmsgPSByZXBsYWNlKGlubGluZS5saW5rKVxuICAoJ2luc2lkZScsIGlubGluZS5faW5zaWRlKVxuICAoJ2hyZWYnLCBpbmxpbmUuX2hyZWYpXG4gICgpO1xuXG5pbmxpbmUucmVmbGluayA9IHJlcGxhY2UoaW5saW5lLnJlZmxpbmspXG4gICgnaW5zaWRlJywgaW5saW5lLl9pbnNpZGUpXG4gICgpO1xuXG4vKipcbiAqIE5vcm1hbCBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5ub3JtYWwgPSBtZXJnZSh7fSwgaW5saW5lKTtcblxuLyoqXG4gKiBQZWRhbnRpYyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5wZWRhbnRpYyA9IG1lcmdlKHt9LCBpbmxpbmUubm9ybWFsLCB7XG4gIHN0cm9uZzogL15fXyg/PVxcUykoW1xcc1xcU10qP1xcUylfXyg/IV8pfF5cXCpcXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqXFwqKD8hXFwqKS8sXG4gIGVtOiAvXl8oPz1cXFMpKFtcXHNcXFNdKj9cXFMpXyg/IV8pfF5cXCooPz1cXFMpKFtcXHNcXFNdKj9cXFMpXFwqKD8hXFwqKS9cbn0pO1xuXG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5nZm0gPSBtZXJnZSh7fSwgaW5saW5lLm5vcm1hbCwge1xuICBlc2NhcGU6IHJlcGxhY2UoaW5saW5lLmVzY2FwZSkoJ10pJywgJ358XSknKSgpLFxuICB1cmw6IC9eKGh0dHBzPzpcXC9cXC9bXlxcczxdK1tePC4sOjtcIicpXFxdXFxzXSkvLFxuICBkZWw6IC9efn4oPz1cXFMpKFtcXHNcXFNdKj9cXFMpfn4vLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS50ZXh0KVxuICAgICgnXXwnLCAnfl18JylcbiAgICAoJ3wnLCAnfGh0dHBzPzovL3wnKVxuICAgICgpXG59KTtcblxuLyoqXG4gKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hclxuICovXG5cbmlubGluZS5icmVha3MgPSBtZXJnZSh7fSwgaW5saW5lLmdmbSwge1xuICBicjogcmVwbGFjZShpbmxpbmUuYnIpKCd7Mix9JywgJyonKSgpLFxuICB0ZXh0OiByZXBsYWNlKGlubGluZS5nZm0udGV4dCkoJ3syLH0nLCAnKicpKClcbn0pO1xuXG4vKipcbiAqIElubGluZSBMZXhlciAmIENvbXBpbGVyXG4gKi9cblxuZnVuY3Rpb24gSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpIHtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBtYXJrZWQuZGVmYXVsdHM7XG4gIHRoaXMubGlua3MgPSBsaW5rcztcbiAgdGhpcy5ydWxlcyA9IGlubGluZS5ub3JtYWw7XG5cbiAgaWYgKCF0aGlzLmxpbmtzKSB7XG4gICAgdGhyb3cgbmV3XG4gICAgICBFcnJvcignVG9rZW5zIGFycmF5IHJlcXVpcmVzIGEgYGxpbmtzYCBwcm9wZXJ0eS4nKTtcbiAgfVxuXG4gIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgIHRoaXMucnVsZXMgPSBpbmxpbmUuYnJlYWtzO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJ1bGVzID0gaW5saW5lLmdmbTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgdGhpcy5ydWxlcyA9IGlubGluZS5wZWRhbnRpYztcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBJbmxpbmUgUnVsZXNcbiAqL1xuXG5JbmxpbmVMZXhlci5ydWxlcyA9IGlubGluZTtcblxuLyoqXG4gKiBTdGF0aWMgTGV4aW5nL0NvbXBpbGluZyBNZXRob2RcbiAqL1xuXG5JbmxpbmVMZXhlci5vdXRwdXQgPSBmdW5jdGlvbihzcmMsIGxpbmtzLCBvcHRpb25zKSB7XG4gIHZhciBpbmxpbmUgPSBuZXcgSW5saW5lTGV4ZXIobGlua3MsIG9wdGlvbnMpO1xuICByZXR1cm4gaW5saW5lLm91dHB1dChzcmMpO1xufTtcblxuLyoqXG4gKiBMZXhpbmcvQ29tcGlsaW5nXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dCA9IGZ1bmN0aW9uKHNyYykge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGxpbmtcbiAgICAsIHRleHRcbiAgICAsIGhyZWZcbiAgICAsIGNhcDtcblxuICB3aGlsZSAoc3JjKSB7XG4gICAgLy8gZXNjYXBlXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZXNjYXBlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSBjYXBbMV07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBhdXRvbGlua1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmF1dG9saW5rLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICB0ZXh0ID0gY2FwWzFdWzZdID09PSAnOidcbiAgICAgICAgICA/IHRoaXMubWFuZ2xlKGNhcFsxXS5zdWJzdHJpbmcoNykpXG4gICAgICAgICAgOiB0aGlzLm1hbmdsZShjYXBbMV0pO1xuICAgICAgICBocmVmID0gdGhpcy5tYW5nbGUoJ21haWx0bzonKSArIHRleHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gZXNjYXBlKGNhcFsxXSk7XG4gICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgfVxuICAgICAgb3V0ICs9ICc8YSBocmVmPVwiJ1xuICAgICAgICArIGhyZWZcbiAgICAgICAgKyAnXCI+J1xuICAgICAgICArIHRleHRcbiAgICAgICAgKyAnPC9hPic7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyB1cmwgKGdmbSlcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy51cmwuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgdGV4dCA9IGVzY2FwZShjYXBbMV0pO1xuICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICBvdXQgKz0gJzxhIGhyZWY9XCInXG4gICAgICAgICsgaHJlZlxuICAgICAgICArICdcIj4nXG4gICAgICAgICsgdGV4dFxuICAgICAgICArICc8L2E+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIHRhZ1xuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRhZy5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5vcHRpb25zLnNhbml0aXplXG4gICAgICAgID8gZXNjYXBlKGNhcFswXSlcbiAgICAgICAgOiBjYXBbMF07XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsaW5rXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMubGluay5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gdGhpcy5vdXRwdXRMaW5rKGNhcCwge1xuICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgIH0pO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gcmVmbGluaywgbm9saW5rXG4gICAgaWYgKChjYXAgPSB0aGlzLnJ1bGVzLnJlZmxpbmsuZXhlYyhzcmMpKVxuICAgICAgICB8fCAoY2FwID0gdGhpcy5ydWxlcy5ub2xpbmsuZXhlYyhzcmMpKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIGxpbmsgPSAoY2FwWzJdIHx8IGNhcFsxXSkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgICAgbGluayA9IHRoaXMubGlua3NbbGluay50b0xvd2VyQ2FzZSgpXTtcbiAgICAgIGlmICghbGluayB8fCAhbGluay5ocmVmKSB7XG4gICAgICAgIG91dCArPSBjYXBbMF1bMF07XG4gICAgICAgIHNyYyA9IGNhcFswXS5zdWJzdHJpbmcoMSkgKyBzcmM7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgb3V0ICs9IHRoaXMub3V0cHV0TGluayhjYXAsIGxpbmspO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gc3Ryb25nXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuc3Ryb25nLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPHN0cm9uZz4nXG4gICAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzJdIHx8IGNhcFsxXSlcbiAgICAgICAgKyAnPC9zdHJvbmc+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGVtXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZW0uZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9ICc8ZW0+J1xuICAgICAgICArIHRoaXMub3V0cHV0KGNhcFsyXSB8fCBjYXBbMV0pXG4gICAgICAgICsgJzwvZW0+JztcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGNvZGVcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5jb2RlLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGNvZGU+J1xuICAgICAgICArIGVzY2FwZShjYXBbMl0sIHRydWUpXG4gICAgICAgICsgJzwvY29kZT4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYnJcbiAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5ici5leGVjKHNyYykpIHtcbiAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBvdXQgKz0gJzxicj4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gZGVsIChnZm0pXG4gICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuZGVsLmV4ZWMoc3JjKSkge1xuICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhjYXBbMF0ubGVuZ3RoKTtcbiAgICAgIG91dCArPSAnPGRlbD4nXG4gICAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzFdKVxuICAgICAgICArICc8L2RlbD4nO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gdGV4dFxuICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLnRleHQuZXhlYyhzcmMpKSB7XG4gICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKGNhcFswXS5sZW5ndGgpO1xuICAgICAgb3V0ICs9IGVzY2FwZSh0aGlzLnNtYXJ0eXBhbnRzKGNhcFswXSkpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNyYykge1xuICAgICAgdGhyb3cgbmV3XG4gICAgICAgIEVycm9yKCdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogQ29tcGlsZSBMaW5rXG4gKi9cblxuSW5saW5lTGV4ZXIucHJvdG90eXBlLm91dHB1dExpbmsgPSBmdW5jdGlvbihjYXAsIGxpbmspIHtcbiAgaWYgKGNhcFswXVswXSAhPT0gJyEnKSB7XG4gICAgcmV0dXJuICc8YSBocmVmPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay5ocmVmKVxuICAgICAgKyAnXCInXG4gICAgICArIChsaW5rLnRpdGxlXG4gICAgICA/ICcgdGl0bGU9XCInXG4gICAgICArIGVzY2FwZShsaW5rLnRpdGxlKVxuICAgICAgKyAnXCInXG4gICAgICA6ICcnKVxuICAgICAgKyAnPidcbiAgICAgICsgdGhpcy5vdXRwdXQoY2FwWzFdKVxuICAgICAgKyAnPC9hPic7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICc8aW1nIHNyYz1cIidcbiAgICAgICsgZXNjYXBlKGxpbmsuaHJlZilcbiAgICAgICsgJ1wiIGFsdD1cIidcbiAgICAgICsgZXNjYXBlKGNhcFsxXSlcbiAgICAgICsgJ1wiJ1xuICAgICAgKyAobGluay50aXRsZVxuICAgICAgPyAnIHRpdGxlPVwiJ1xuICAgICAgKyBlc2NhcGUobGluay50aXRsZSlcbiAgICAgICsgJ1wiJ1xuICAgICAgOiAnJylcbiAgICAgICsgJz4nO1xuICB9XG59O1xuXG4vKipcbiAqIFNtYXJ0eXBhbnRzIFRyYW5zZm9ybWF0aW9uc1xuICovXG5cbklubGluZUxleGVyLnByb3RvdHlwZS5zbWFydHlwYW50cyA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgaWYgKCF0aGlzLm9wdGlvbnMuc21hcnR5cGFudHMpIHJldHVybiB0ZXh0O1xuICByZXR1cm4gdGV4dFxuICAgIC5yZXBsYWNlKC8tLS9nLCAnXFx1MjAxNCcpXG4gICAgLnJlcGxhY2UoLycoW14nXSopJy9nLCAnXFx1MjAxOCQxXFx1MjAxOScpXG4gICAgLnJlcGxhY2UoL1wiKFteXCJdKilcIi9nLCAnXFx1MjAxQyQxXFx1MjAxRCcpXG4gICAgLnJlcGxhY2UoL1xcLnszfS9nLCAnXFx1MjAyNicpO1xufTtcblxuLyoqXG4gKiBNYW5nbGUgTGlua3NcbiAqL1xuXG5JbmxpbmVMZXhlci5wcm90b3R5cGUubWFuZ2xlID0gZnVuY3Rpb24odGV4dCkge1xuICB2YXIgb3V0ID0gJydcbiAgICAsIGwgPSB0ZXh0Lmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIGNoO1xuXG4gIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgY2ggPSB0ZXh0LmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcbiAgICAgIGNoID0gJ3gnICsgY2gudG9TdHJpbmcoMTYpO1xuICAgIH1cbiAgICBvdXQgKz0gJyYjJyArIGNoICsgJzsnO1xuICB9XG5cbiAgcmV0dXJuIG91dDtcbn07XG5cbi8qKlxuICogUGFyc2luZyAmIENvbXBpbGluZ1xuICovXG5cbmZ1bmN0aW9uIFBhcnNlcihvcHRpb25zKSB7XG4gIHRoaXMudG9rZW5zID0gW107XG4gIHRoaXMudG9rZW4gPSBudWxsO1xuICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IG1hcmtlZC5kZWZhdWx0cztcbn1cblxuLyoqXG4gKiBTdGF0aWMgUGFyc2UgTWV0aG9kXG4gKi9cblxuUGFyc2VyLnBhcnNlID0gZnVuY3Rpb24oc3JjLCBvcHRpb25zKSB7XG4gIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICByZXR1cm4gcGFyc2VyLnBhcnNlKHNyYyk7XG59O1xuXG4vKipcbiAqIFBhcnNlIExvb3BcbiAqL1xuXG5QYXJzZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24oc3JjKSB7XG4gIHRoaXMuaW5saW5lID0gbmV3IElubGluZUxleGVyKHNyYy5saW5rcywgdGhpcy5vcHRpb25zKTtcbiAgdGhpcy50b2tlbnMgPSBzcmMucmV2ZXJzZSgpO1xuXG4gIHZhciBvdXQgPSAnJztcbiAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgb3V0ICs9IHRoaXMudG9rKCk7XG4gIH1cblxuICByZXR1cm4gb3V0O1xufTtcblxuLyoqXG4gKiBOZXh0IFRva2VuXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRva2VuID0gdGhpcy50b2tlbnMucG9wKCk7XG59O1xuXG4vKipcbiAqIFByZXZpZXcgTmV4dCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy50b2tlbnMubGVuZ3RoLTFdIHx8IDA7XG59O1xuXG4vKipcbiAqIFBhcnNlIFRleHQgVG9rZW5zXG4gKi9cblxuUGFyc2VyLnByb3RvdHlwZS5wYXJzZVRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGJvZHkgPSB0aGlzLnRva2VuLnRleHQ7XG5cbiAgd2hpbGUgKHRoaXMucGVlaygpLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgIGJvZHkgKz0gJ1xcbicgKyB0aGlzLm5leHQoKS50ZXh0O1xuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5saW5lLm91dHB1dChib2R5KTtcbn07XG5cbi8qKlxuICogUGFyc2UgQ3VycmVudCBUb2tlblxuICovXG5cblBhcnNlci5wcm90b3R5cGUudG9rID0gZnVuY3Rpb24oKSB7XG4gIHN3aXRjaCAodGhpcy50b2tlbi50eXBlKSB7XG4gICAgY2FzZSAnc3BhY2UnOiB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNhc2UgJ2hyJzoge1xuICAgICAgcmV0dXJuICc8aHI+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnaGVhZGluZyc6IHtcbiAgICAgIHJldHVybiAnPGgnXG4gICAgICAgICsgdGhpcy50b2tlbi5kZXB0aFxuICAgICAgICArICc+J1xuICAgICAgICArIHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpXG4gICAgICAgICsgJzwvaCdcbiAgICAgICAgKyB0aGlzLnRva2VuLmRlcHRoXG4gICAgICAgICsgJz5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdjb2RlJzoge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KHRoaXMudG9rZW4udGV4dCwgdGhpcy50b2tlbi5sYW5nKTtcbiAgICAgICAgaWYgKGNvZGUgIT0gbnVsbCAmJiBjb2RlICE9PSB0aGlzLnRva2VuLnRleHQpIHtcbiAgICAgICAgICB0aGlzLnRva2VuLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMudG9rZW4udGV4dCA9IGNvZGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLnRva2VuLmVzY2FwZWQpIHtcbiAgICAgICAgdGhpcy50b2tlbi50ZXh0ID0gZXNjYXBlKHRoaXMudG9rZW4udGV4dCwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPHByZT48Y29kZSdcbiAgICAgICAgKyAodGhpcy50b2tlbi5sYW5nXG4gICAgICAgID8gJyBjbGFzcz1cIidcbiAgICAgICAgKyB0aGlzLm9wdGlvbnMubGFuZ1ByZWZpeFxuICAgICAgICArIHRoaXMudG9rZW4ubGFuZ1xuICAgICAgICArICdcIidcbiAgICAgICAgOiAnJylcbiAgICAgICAgKyAnPidcbiAgICAgICAgKyB0aGlzLnRva2VuLnRleHRcbiAgICAgICAgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ3RhYmxlJzoge1xuICAgICAgdmFyIGJvZHkgPSAnJ1xuICAgICAgICAsIGhlYWRpbmdcbiAgICAgICAgLCBpXG4gICAgICAgICwgcm93XG4gICAgICAgICwgY2VsbFxuICAgICAgICAsIGo7XG5cbiAgICAgIC8vIGhlYWRlclxuICAgICAgYm9keSArPSAnPHRoZWFkPlxcbjx0cj5cXG4nO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMudG9rZW4uaGVhZGVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhlYWRpbmcgPSB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi5oZWFkZXJbaV0pO1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4uYWxpZ25baV1cbiAgICAgICAgICA/ICc8dGggYWxpZ249XCInICsgdGhpcy50b2tlbi5hbGlnbltpXSArICdcIj4nICsgaGVhZGluZyArICc8L3RoPlxcbidcbiAgICAgICAgICA6ICc8dGg+JyArIGhlYWRpbmcgKyAnPC90aD5cXG4nO1xuICAgICAgfVxuICAgICAgYm9keSArPSAnPC90cj5cXG48L3RoZWFkPlxcbic7XG5cbiAgICAgIC8vIGJvZHlcbiAgICAgIGJvZHkgKz0gJzx0Ym9keT5cXG4nXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy50b2tlbi5jZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgICByb3cgPSB0aGlzLnRva2VuLmNlbGxzW2ldO1xuICAgICAgICBib2R5ICs9ICc8dHI+XFxuJztcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IHJvdy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGNlbGwgPSB0aGlzLmlubGluZS5vdXRwdXQocm93W2pdKTtcbiAgICAgICAgICBib2R5ICs9IHRoaXMudG9rZW4uYWxpZ25bal1cbiAgICAgICAgICAgID8gJzx0ZCBhbGlnbj1cIicgKyB0aGlzLnRva2VuLmFsaWduW2pdICsgJ1wiPicgKyBjZWxsICsgJzwvdGQ+XFxuJ1xuICAgICAgICAgICAgOiAnPHRkPicgKyBjZWxsICsgJzwvdGQ+XFxuJztcbiAgICAgICAgfVxuICAgICAgICBib2R5ICs9ICc8L3RyPlxcbic7XG4gICAgICB9XG4gICAgICBib2R5ICs9ICc8L3Rib2R5Plxcbic7XG5cbiAgICAgIHJldHVybiAnPHRhYmxlPlxcbidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvdGFibGU+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnYmxvY2txdW90ZV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnYmxvY2txdW90ZV9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8YmxvY2txdW90ZT5cXG4nXG4gICAgICAgICsgYm9keVxuICAgICAgICArICc8L2Jsb2NrcXVvdGU+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnbGlzdF9zdGFydCc6IHtcbiAgICAgIHZhciB0eXBlID0gdGhpcy50b2tlbi5vcmRlcmVkID8gJ29sJyA6ICd1bCdcbiAgICAgICAgLCBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9lbmQnKSB7XG4gICAgICAgIGJvZHkgKz0gdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8J1xuICAgICAgICArIHR5cGVcbiAgICAgICAgKyAnPlxcbidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvJ1xuICAgICAgICArIHR5cGVcbiAgICAgICAgKyAnPlxcbic7XG4gICAgfVxuICAgIGNhc2UgJ2xpc3RfaXRlbV9zdGFydCc6IHtcbiAgICAgIHZhciBib2R5ID0gJyc7XG5cbiAgICAgIHdoaWxlICh0aGlzLm5leHQoKS50eXBlICE9PSAnbGlzdF9pdGVtX2VuZCcpIHtcbiAgICAgICAgYm9keSArPSB0aGlzLnRva2VuLnR5cGUgPT09ICd0ZXh0J1xuICAgICAgICAgID8gdGhpcy5wYXJzZVRleHQoKVxuICAgICAgICAgIDogdGhpcy50b2soKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8bGk+J1xuICAgICAgICArIGJvZHlcbiAgICAgICAgKyAnPC9saT5cXG4nO1xuICAgIH1cbiAgICBjYXNlICdsb29zZV9pdGVtX3N0YXJ0Jzoge1xuICAgICAgdmFyIGJvZHkgPSAnJztcblxuICAgICAgd2hpbGUgKHRoaXMubmV4dCgpLnR5cGUgIT09ICdsaXN0X2l0ZW1fZW5kJykge1xuICAgICAgICBib2R5ICs9IHRoaXMudG9rKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGxpPidcbiAgICAgICAgKyBib2R5XG4gICAgICAgICsgJzwvbGk+XFxuJztcbiAgICB9XG4gICAgY2FzZSAnaHRtbCc6IHtcbiAgICAgIHJldHVybiAhdGhpcy50b2tlbi5wcmUgJiYgIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICA/IHRoaXMuaW5saW5lLm91dHB1dCh0aGlzLnRva2VuLnRleHQpXG4gICAgICAgIDogdGhpcy50b2tlbi50ZXh0O1xuICAgIH1cbiAgICBjYXNlICdwYXJhZ3JhcGgnOiB7XG4gICAgICByZXR1cm4gJzxwPidcbiAgICAgICAgKyB0aGlzLmlubGluZS5vdXRwdXQodGhpcy50b2tlbi50ZXh0KVxuICAgICAgICArICc8L3A+XFxuJztcbiAgICB9XG4gICAgY2FzZSAndGV4dCc6IHtcbiAgICAgIHJldHVybiAnPHA+J1xuICAgICAgICArIHRoaXMucGFyc2VUZXh0KClcbiAgICAgICAgKyAnPC9wPlxcbic7XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuXG5mdW5jdGlvbiBlc2NhcGUoaHRtbCwgZW5jb2RlKSB7XG4gIHJldHVybiBodG1sXG4gICAgLnJlcGxhY2UoIWVuY29kZSA/IC8mKD8hIz9cXHcrOykvZyA6IC8mL2csICcmYW1wOycpXG4gICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7JylcbiAgICAucmVwbGFjZSgvXCIvZywgJyZxdW90OycpXG4gICAgLnJlcGxhY2UoLycvZywgJyYjMzk7Jyk7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2UocmVnZXgsIG9wdCkge1xuICByZWdleCA9IHJlZ2V4LnNvdXJjZTtcbiAgb3B0ID0gb3B0IHx8ICcnO1xuICByZXR1cm4gZnVuY3Rpb24gc2VsZihuYW1lLCB2YWwpIHtcbiAgICBpZiAoIW5hbWUpIHJldHVybiBuZXcgUmVnRXhwKHJlZ2V4LCBvcHQpO1xuICAgIHZhbCA9IHZhbC5zb3VyY2UgfHwgdmFsO1xuICAgIHZhbCA9IHZhbC5yZXBsYWNlKC8oXnxbXlxcW10pXFxeL2csICckMScpO1xuICAgIHJlZ2V4ID0gcmVnZXgucmVwbGFjZShuYW1lLCB2YWwpO1xuICAgIHJldHVybiBzZWxmO1xuICB9O1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cbm5vb3AuZXhlYyA9IG5vb3A7XG5cbmZ1bmN0aW9uIG1lcmdlKG9iaikge1xuICB2YXIgaSA9IDFcbiAgICAsIHRhcmdldFxuICAgICwga2V5O1xuXG4gIGZvciAoOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldO1xuICAgIGZvciAoa2V5IGluIHRhcmdldCkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSB0YXJnZXRba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIE1hcmtlZFxuICovXG5cbmZ1bmN0aW9uIG1hcmtlZChzcmMsIG9wdCwgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrIHx8IHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdDtcbiAgICAgIG9wdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKG9wdCkgb3B0ID0gbWVyZ2Uoe30sIG1hcmtlZC5kZWZhdWx0cywgb3B0KTtcblxuICAgIHZhciBoaWdobGlnaHQgPSBvcHQuaGlnaGxpZ2h0XG4gICAgICAsIHRva2Vuc1xuICAgICAgLCBwZW5kaW5nXG4gICAgICAsIGkgPSAwO1xuXG4gICAgdHJ5IHtcbiAgICAgIHRva2VucyA9IExleGVyLmxleChzcmMsIG9wdClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZSk7XG4gICAgfVxuXG4gICAgcGVuZGluZyA9IHRva2Vucy5sZW5ndGg7XG5cbiAgICB2YXIgZG9uZSA9IGZ1bmN0aW9uKGhpKSB7XG4gICAgICB2YXIgb3V0LCBlcnI7XG5cbiAgICAgIGlmIChoaSAhPT0gdHJ1ZSkge1xuICAgICAgICBkZWxldGUgb3B0LmhpZ2hsaWdodDtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgb3V0ID0gUGFyc2VyLnBhcnNlKHRva2Vucywgb3B0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyID0gZTtcbiAgICAgIH1cblxuICAgICAgb3B0LmhpZ2hsaWdodCA9IGhpZ2hsaWdodDtcblxuICAgICAgcmV0dXJuIGVyclxuICAgICAgICA/IGNhbGxiYWNrKGVycilcbiAgICAgICAgOiBjYWxsYmFjayhudWxsLCBvdXQpO1xuICAgIH07XG5cbiAgICBpZiAoIWhpZ2hsaWdodCB8fCBoaWdobGlnaHQubGVuZ3RoIDwgMykge1xuICAgICAgcmV0dXJuIGRvbmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKCFwZW5kaW5nKSByZXR1cm4gZG9uZSgpO1xuXG4gICAgZm9yICg7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIChmdW5jdGlvbih0b2tlbikge1xuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gJ2NvZGUnKSB7XG4gICAgICAgICAgcmV0dXJuIC0tcGVuZGluZyB8fCBkb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhpZ2hsaWdodCh0b2tlbi50ZXh0LCB0b2tlbi5sYW5nLCBmdW5jdGlvbihlcnIsIGNvZGUpIHtcbiAgICAgICAgICBpZiAoY29kZSA9PSBudWxsIHx8IGNvZGUgPT09IHRva2VuLnRleHQpIHtcbiAgICAgICAgICAgIHJldHVybiAtLXBlbmRpbmcgfHwgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0b2tlbi50ZXh0ID0gY29kZTtcbiAgICAgICAgICB0b2tlbi5lc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAtLXBlbmRpbmcgfHwgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pKHRva2Vuc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG4gIHRyeSB7XG4gICAgaWYgKG9wdCkgb3B0ID0gbWVyZ2Uoe30sIG1hcmtlZC5kZWZhdWx0cywgb3B0KTtcbiAgICByZXR1cm4gUGFyc2VyLnBhcnNlKExleGVyLmxleChzcmMsIG9wdCksIG9wdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlLm1lc3NhZ2UgKz0gJ1xcblBsZWFzZSByZXBvcnQgdGhpcyB0byBodHRwczovL2dpdGh1Yi5jb20vY2hqai9tYXJrZWQuJztcbiAgICBpZiAoKG9wdCB8fCBtYXJrZWQuZGVmYXVsdHMpLnNpbGVudCkge1xuICAgICAgcmV0dXJuICc8cD5BbiBlcnJvciBvY2N1cmVkOjwvcD48cHJlPidcbiAgICAgICAgKyBlc2NhcGUoZS5tZXNzYWdlICsgJycsIHRydWUpXG4gICAgICAgICsgJzwvcHJlPic7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuLyoqXG4gKiBPcHRpb25zXG4gKi9cblxubWFya2VkLm9wdGlvbnMgPVxubWFya2VkLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHQpIHtcbiAgbWVyZ2UobWFya2VkLmRlZmF1bHRzLCBvcHQpO1xuICByZXR1cm4gbWFya2VkO1xufTtcblxubWFya2VkLmRlZmF1bHRzID0ge1xuICBnZm06IHRydWUsXG4gIHRhYmxlczogdHJ1ZSxcbiAgYnJlYWtzOiBmYWxzZSxcbiAgcGVkYW50aWM6IGZhbHNlLFxuICBzYW5pdGl6ZTogZmFsc2UsXG4gIHNtYXJ0TGlzdHM6IGZhbHNlLFxuICBzaWxlbnQ6IGZhbHNlLFxuICBoaWdobGlnaHQ6IG51bGwsXG4gIGxhbmdQcmVmaXg6ICdsYW5nLScsXG4gIHNtYXJ0eXBhbnRzOiBmYWxzZVxufTtcblxuLyoqXG4gKiBFeHBvc2VcbiAqL1xuXG5tYXJrZWQuUGFyc2VyID0gUGFyc2VyO1xubWFya2VkLnBhcnNlciA9IFBhcnNlci5wYXJzZTtcblxubWFya2VkLkxleGVyID0gTGV4ZXI7XG5tYXJrZWQubGV4ZXIgPSBMZXhlci5sZXg7XG5cbm1hcmtlZC5JbmxpbmVMZXhlciA9IElubGluZUxleGVyO1xubWFya2VkLmlubGluZUxleGVyID0gSW5saW5lTGV4ZXIub3V0cHV0O1xuXG5tYXJrZWQucGFyc2UgPSBtYXJrZWQ7XG5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBtYXJrZWQ7XG59IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBtYXJrZWQ7IH0pO1xufSBlbHNlIHtcbiAgdGhpcy5tYXJrZWQgPSBtYXJrZWQ7XG59XG5cbn0pLmNhbGwoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzIHx8ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbCk7XG59KCkpO1xuIl19
;