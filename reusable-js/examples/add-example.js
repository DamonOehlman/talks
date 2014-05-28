var add = require('./add');

console.log(add(1, 2));
// --> 3

console.log([1, 2, 3, 4].map(add(1)));
// --> [2, 3, 4, 5]
