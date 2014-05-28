# Reusable JS

![](icons/icon_3395/icon_3395.svg)

<small class="attribution">Lego designed by jon trillana from the Noun Project</small>

--

## Defining the Problem

- The widely adopted (and generally advertised) approaches to developing apps with JS are poor.
- When it comes to building the components of an app that require JS, many people abandon practices they would try and apply in a different language.

--

## Why is it so?

- Too much bad information
- Poor tooling support
- Not enough good information for good (well, better) approaches
- Just considered too hard


--

# The Quest for Reusability

![](icons/icon_45240/icon_45240.svg)

<small class="attribution">Mountain Climbing designed by johanna from the Noun Project</small>

--

## My Personal Goals

- Wanted to consider what I had experienced in other langs
- Also wanted to adopt an "environment appropriate" approaches
- Started about 4 years ago, and when through a number of stages

--

## Stage 1: The Beginning

- Started by looking at [Sprockets](https://github.com/sstephenson/sprockets) which introduces the concepts of "includes" via a special comment syntax:

  ```js
  //= require module1
  //= require module2
  ```

- Implemented a similar solution for pure JS solution with [rigger](https://github.com/buildjs/rigger) and [interleave](https://github.com/buildjs/interleave).  Was similar to Sprockets, but dropped the need for a "require" keyword:

  ```js
  //= module1
  //= module2
  ```

--

## Stage 1: Pros and Cons

__Pros:__

- Easy to apply to an existing (i.e. poorly structured codebase)
- Felt better than just "concatenating" js files together using filename ordering.

__Cons:__

- Very primitive with no sense of module encapsulation.
- How to deal with versioning

--

## Stage 2: Developing BuildJS Tools

- At this point, I started trying to improve the process to be more robust.
- This happened in the form of a number of [BuildJS](https://github.com/buildjs) tools.
- Looked to implement an approach that would with all module patterns (CommonJS, AMD and no module)

--

## Stage 2: Pros and Cons

__Pros:__

- Building JS apps started to feel reusable and process was nice and repeatable.
- Versioning and aggregation of external modules was achievable.
- Approach was "module pattern" agnostic.

__Cons:__

- Versioning was non trivial to solve.
- Package distribution required some setup.

--

## Stage 3: "Learning to love Browserify"

- Browserify V2 released which refined the approach of Browserify V1, and was no longer trying to bootstrap a node environment in the browser.
- Modules can be consumed from standard node modules, and thus [npm](https://npmjs.org) can he used for package distribution.
- Saw browserify in action with [voxel.js](http://voxeljs.com/) and was blown away.

--

## Stage 3: Pros and Cons

__Pros:__

- I was able to deprecate a whole suite of node packages.
- Development process is super smooth and pragmatic.
- Productivity Increases
- Modular thinking encouraged for front-end modules.

__Cons:__

- Opinionated apprach, which means using some existing JS modules is difficult (which to be fair is sometimes a good thing).

--

## Lessons Learned from the Journey

- It's more important to prioritize development process and modularisation over making a universally "requirable" module (i.e. [UMDjs](https://github.com/umdjs/umd)).
- Client side modules and npm do mix well, versioning is awesome.
- While a git repo could be effectively versioned, you can't trust a package author as far as you can throw them. Package managers must enforce versioning and handle publishing.

I'm sure there will be more...


--

# Getting Practical

![](icons/icon_4851/icon_4851.svg)

<small class="attribution">Saw designed by jon trillana from the Noun Project</small>

--

## The Basics

- NEVER, patch function into globals (`window`, etc)
- Avoid BIG whenever you can - I prefer to build with Lego Technic rather than Duplo.

--

## Use "CommonJS" Modules Everywhere

### Module Export as a Function

```js
module.exports = function() {
};
```

### Separate exports

```js
exports.add = function(a, b) {
  return a + b;
};

exports.mul = function(a, b) {
  return a * b;
};
```

--

## Create a `package.json` file

The best way to do this is through using the `npm init` command:

```
~ npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sane defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (test-project)
version: (0.0.0)
description: A Test project
entry point: (index.js)
test command: node test/all.js
git repository: https://github.com/DamonOehlman/test-project.git
keywords: example,project
author: Damon Oehlman <damon.oehlman@gmail.com>
license: (ISC) MIT
~
```

--

## Tweak the `package.json` file as required

```json
{
  "name": "test-project",
  "version": "0.0.1",
  "description": "A Test project",
  "main": "index.js",
  "scripts": {
    "test": "node test/all.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/DamonOehlman/test-project.git"
  },
  "keywords": [
    "example",
    "project"
  ],
  "author": "Damon Oehlman <damon.oehlman@gmail.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/DamonOehlman/test-project/issues"
  },
  "homepage": "https://github.com/DamonOehlman/test-project"
}

```

--

## Publishing to npm

```
~ npm version 0.0.1
v0.0.1
~ npm publish
```

This will kick off a publishing process to npm.  If you haven't already got a user account for npm, then you will need to follow the [npm-adduser](https://www.npmjs.org/doc/cli/npm-adduser.html) instructions.

--

## Browserify for the Web

Browserifying files is most easily done at a command-line level. For example you can browserify and then uglify code in a single command:

```
browserify -d main.js > main.bundled.js | uglify
```

Using a transform such as [brfs](https://github.com/substack/brfs):

```
browserify -d main.js -t brfs > main.bundled.js | uglify
```

--

## Browserify handbook

While documentation for browserify has been somewhat scarce in the past, [@substack](https://twitter.com/substack) has now put together an awesome handbook which covers a lot of great stuff:

[browserify-handbook](https://github.com/substack/browserify-handbook)

--

# Functions, Functions, Functions

![](icons/icon_24030/icon_24030.svg)

<small class="attribution">Algebra designed by Ilsur Aptukov from the Noun Project</small>

--

## Standard Functions = Maximum Reuse

- A well crafted function can be used anywhere
- A method generally cannot (without the help of `bind` that is)

--

## Strive for Immutability

- Both objects and arrays are pass by reference which can cause confusion
- If you __really must__ modify an array within a function (or want to ensure third-party code doesn't), take a copy:

  ```js
  function f(input) {
    input = [].concat(input || []);
  }
  ```

- Consider doing the same with objects. Look for implementations of `clone` or `extend` or just leave object references alone.

--

## Consider Partial Application

__An "add.js" module:__

```js
module.exports = function(a, b) {
  function _invoke(c) {
    return a + c;
  }

  return typeof b == 'number' ? _invoke(b) : _invoke;
};

```

__Usage:__

```js
var add = require('./add');

console.log(add(1, 2));
// --> 3

console.log([1, 2, 3, 4].map(add(1)));
// --> [2, 3, 4, 5]

```

--

# Abstractions that Work (Mostly)

--

## Good: Streams

- Allow you to "pipe" _readable_ streams into _writable_ streams.
- There are also _duplex_ (or _through_) streams which allow data transformation.
- Generally efficient with regards to memory.

--

## Streams Example

```js
var fs = require('fs');
var request = require('request');
var requestOpts = {
  method: 'GET',
  url: 'https://api.github.com/users/DamonOehlman/repos',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'reusable-js-stream-example'
  }
};

request(requestOpts)
  .pipe(fs.createWriteStream(__dirname + '/repos.json'));

```

--

## Streams Example (using Duplex Stream)

```js
var fs = require('fs');
var request = require('request');
var through = require('through');
var JSONStream = require('JSONStream');
var csv = require('csv-write-stream');
var requestOpts = {
  method: 'GET',
  url: 'https://api.github.com/users/DamonOehlman/repos',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'reusable-js-stream-example'
  }
};

request(requestOpts)
  .pipe(JSONStream.parse('.*'))
  .pipe(through(function(data) {
    this.emit('data', {
      name: data.name,
      open_issues_count: data.open_issues_count
    });
  }))
  .pipe(csv({ headers: ['name', 'open_issues_count']}))
  .pipe(fs.createWriteStream(__dirname + '/issues.csv'));

```

--

## Better: Pull-Streams

- Does less while doing more
- It's just functions used well
- Usable in the browser with a fairly light footprint

--

## Pull-Streams Example

```js
var geonames = require('geonames');
var path = require('path');
var pull = require('pull-stream');
var pluck = require('whisk/pluck');

pull(
  geonames.read(path.resolve(__dirname, 'data/AU.txt')),
  pull.filter(function(item) {
    return item.featureClass === 'P' && item.population > 50000
  }),
  pull.map(pluck('name', 'population')),
  pull.take(10),
  pull.log()
);

```


--

# Summary

--

## Striving for Reuse is a Journey

- Retrofitting these approaches to a current project is __not__ likely to work.
- Important to think about modularity and reusability as you move forward.
- Search for existing reusable code before writing your own (this can be tricky, but module search will improve)

--

## Good Examples of Reusable Modules

Listed below are a few that I think are well done:

- [montagejs/collections](https://github.com/montagejs/collections)

