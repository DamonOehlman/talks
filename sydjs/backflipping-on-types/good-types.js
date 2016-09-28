/**
 * @param {number} bar
 * @param {{
 *   color: string
 * }} opts
 */
function foo(bar, opts) {
  console.log(opts.color);
  console.log(5 * bar);
}

foo(5, { color: 'blue' }); // ok
foo(5); // runtime error
foo('test', { color: 'blue' }); // NaN
