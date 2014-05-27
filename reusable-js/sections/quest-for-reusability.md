## My Personal Quest for Reusability

- Wanted to consider what I had experienced in other langs
- Also wanted to adopt an "environment appropriate" approaches

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
- Modules can be consumed from standard node modules, and thus [NPM](https://npmjs.org) can he used for package distribution.
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

## Lessons Learned from the Journey (so far)

- Prioritize development process and modularisation over making a universally "requirable" module (i.e. [UMDjs](https://github.com/umdjs/umd)).
-
