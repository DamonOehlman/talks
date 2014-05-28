# Getting Practical

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

## Browserify for the Web

Browserifying files is most easily done at a command-line level. For example you can browserify and then uglify code in a single command:

```
browserify -d main.js > main.bundled.js | uglify
```

Using a transform such as [brfs](https://github.com/substack/brfs):

```
browserify -d main.js -t brfs > main.bundled.js | uglify
```

More information: [browserify-handbook](https://github.com/substack/browserify-handbook)

--

# Functions, Functions, Functions

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
