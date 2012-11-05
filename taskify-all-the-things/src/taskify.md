# Task Centric Development

---

## Taskify: What is a Task?

- An atomic unit of work, either synchronous or asynchronous.
- May have one or more pre-requesites to execution.
- Similar conceptually to tasks in [jake](https://github.com/mde/jake) and [grunt](https://github.com/gruntjs/grunt).
- Not similar to Mozilla's experimental [task.js](https://taskjs.org) library.

---

## Taskify: Why?

- Because async coding can feel messy, and some of my application code didn't feel as clean as my [jake](https://github.com/mde/jake) builds.

- Experiment with flipping execution control to dependencies rather than execution order.

- Usable now in both node and modern browsers.

---

## Taskify: Simple Example

[[code code/js/taskify-simple.js]]

---

## Taskify: Simple Principles

- Specify dependencies using optional second argument.
- To flag a task as async make the `this.async` call within the task runner - provides the callback function to resolve execution (follows familiar node callback style pattern).
- Task runner results are made available in execution context results object: `this.context.results`
- When calling `taskify.run` optional arguments are passed through to the task runners.

---

## Taskify: Suprise Example

[[code code/js/taskify-http.js]]

---

### Fork the Source

<http://github.com/DamonOehlman/taskify>