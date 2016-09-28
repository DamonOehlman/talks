/**
 * @param {string|number} bar
 * @param {{
 *  color: string
 * }=} opts
 */
function foo(bar, opts) {
  if (opts) {
    console.log(opts.color);
  }

  if (typeof bar == 'number') {
    console.log(5 * bar);
  }
}

foo(5, { color: 'blue' });
foo(5);
foo('test', { color: 'blue' });
