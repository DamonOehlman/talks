var taskify = require('../'),
    request = require('request');

taskify('a', function() {
    console.log('a');
});

taskify('b', ['a'], function() {
    request.get('http://www.google.com/', this.async());
});

taskify.run('b').once('complete', function() {
    console.log('done');
});