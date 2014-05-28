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

<<< examples/test-project/package.json

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

<<< examples/add.js

__Usage:__

<<< examples/add-example.js

--

# Abstractions that Work (Mostly)

--

## Good: Streams

- Allow you to "pipe" _readable_ streams into _writable_ streams.
- There are also _duplex_ (or _through_) streams which allow data transformation.
- Generally efficient with regards to memory.

--

## Streams Example

<<< examples/github-repos.js

--

## Streams Example (using Duplex Stream)

<<< examples/github-issues.js

--

## Better: Pull-Streams

- Does less while doing more
- It's just functions used well
- Usable in the browser with a fairly light footprint

--

## Pull-Streams Example

<<< examples/geonames-processing.js
