# Streaming The Web

![](icons/icon_22410/icon_22410.svg)

<small class="attribution">Creek by Dan Hetteix from The Noun Project</small>

---

# Streams Represent Freedom

![](icons/icon_26956/icon_26956.svg)

<small class="attribution">Skydiving by Juan Pablo Bravo from The Noun Project</small>

---

# Stream Flow and Back Pressure

![](icons/icon_44891/icon_44891.svg)

<small class="attribution">Public Domain available on The Noun Project</small>

---

# A Practical Demonstration

![](icons/icon_3756/icon_3756.svg)

<small class="attribution">Paper Plane by James Fenton from The Noun Project</small>

---

# Getting Streams to the Web

![](icons/icon_6223/icon_6223.svg)

<small class="attribution">Wizard Hat by Jasmine Rae Friedrich from The Noun Project</small>



---

## A Browserify Baseline

```js
// I don't do anything

```

```
~ browserify examples/empty.js | wc -c
485
```

---

## OK, Let's use Streams

```js
var Stream = require('stream');

```

```
~ browserify examples/stream.js | wc -c
105607
```

---

## Buffers in the Browser

```js
var bytes = new Buffer([0x0, 0xFF]);

```

```
~ browserify examples/simple-buffer.js | wc -c
36455
```

---

# Response to High Byte Count

![](//damonoehlman.github.io/streaming-the-web/icons/icon_22084/icon_22084.svg)

<small class="attribution">Sad by Adil Siddiqui from The Noun Project</small>


---

# The Pull-Streams Alternative

![](//damonoehlman.github.io/streaming-the-web/icons/icon_23535/icon_23535.svg)

<small class="attribution">Pull by Pavel Nikandrov from The Noun Project</small>

---

## Pull Streams Overhead

```js
var pull = require('pull-stream');

```

```
~ browserify examples/ps-require.js | wc -c
17923
```

---

## Pull Streams in Node

```js
var pull = require('pull-stream');
var flickr = require('stream-all-the-things')({ api_key: 'ca43d47b18b91ff639c9628f9cf828cd' });

// search for water buffalo and output the results to the console
// NOTE: because this is using a pull.log (which uses a pull.drain) all
// the results will be displayed
pull(
  flickr.search('water buffalo', { is_commons: true }),
  pull.log()
);

```

---

## Server Sent Events with Pull Streams

```js
var pull = require('pull-stream');
var flickr = require('stream-all-the-things')({ api_key: 'ca43d47b18b91ff639c9628f9cf828cd' });
var sse = require('pull-sse');
var http = require('http');

http.createServer(function(req, res) {
  pull(
    flickr.search('water buffalo', { is_commons: true }),
    sse(res)
  );
}).listen(3010);

```

---

## Server: LevelDB -> (Transformation) -> SSE

```js
var pull = require('pull-stream');
var pl = require('pull-level');
var sse = require('pull-sse');

module.exports = function(db) {
  return function(req, res) {
    pull(
      pl.live(db, { tail: true }),
      pull.map(function(item) {
        return item.value;
      }),
      pull.filter(function(item) {
        return true;
      }),
      sse(res)
    );
  };
};

```

---

## Client: SSE -> ?

```js
var pull = require('pull-stream');
var sse = require('pull-sse/client');

pull(
  sse('/cpu'),
  pull.log()
);

```

---

# WARNING: Streams are addictive

![](icons/icon_4112/icon_4112.svg)

<small class="attribution">Coffee by Jacob Halton from The Noun Project</small>

---

# Thanks

![](icons/icon_16919/icon_16919.svg)

<small class="attribution">Lego by Timur Zima from The Noun Project</small>
<small class="me">@DamonOehlman</small>

---

## Links of Interest

- [Stream Playground](http://nodestreams.com/)

  This is a great site from [@jeresig](https://twitter.com/jeresig) that gives you an opportunity to look at what the JS code looks like for composing streams.

- [Pull Stream Implementation](https://github.com/dominictarr/pull-stream)

  I'm a big fan of this "streaming pattern", which can be used for composing code in resuable ways.

- [rtc-mesh](https://github.com/rtc-io/rtc-mesh)

  The `rtc-mesh` module is an [`rtc-quickconnect`](https://github.com/rtc-io/rtc-quickconnect) plugin that makes use of [scuttlebutt](https://github.com/dominictarr/scuttlebutt) to synchronize data across browsers using [WebRTC](http://www.webrtc.org/) data channels.  Scuttlebutt's streaming interface makes this extremely simple.

If you have any questions, feel free to hit me up on [twitter](https://twitter.com/DamonOehlman)

