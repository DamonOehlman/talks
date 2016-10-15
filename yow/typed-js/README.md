# The Past, Present and Future Of Typed JS (ECMAScript)

## Closure Compiler

<https://developers.google.com/closure/compiler/>

- (+) Uses annotations to provide type information rather than a specialised JS syntax.

- (-) Community quite small, limited "externs" support.


## TypeScript

<https://www.typescriptlang.org/>

- (+) Used node module resolution strategy by default now.  This is a significant advantage as you can connect and make use of a large collection of existing packages.

- (+) Strong community, lots of "externs" definitions.

- (-) Custom syntax while probably necessary does mean that the language *may* depart from the direction of ES? as things progress.  Not really a problem now, but could be a migration headache in the future.

## Flow

<https://flowtype.org/>

- (+) Build with OCaml rather than TypeScript (kudos though) or Java.  OCaml has a solid history of being able to construct compilers for alt languages (such as HaXe). 

## Overall Lessons

- Our dependence / use of libraries like jQuery is something we should significantly lessen or remove entirely.  jQuery has done a lot of good in the past, but it has almost no chance of ever being close to succesfully type checkable.

```js
// show jquery extern example
```