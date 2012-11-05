var taskify = require('taskify'),
    app = require('tako')();

// define a task that tells us the twitter handle of the user
taskify('writeHandle', ['auth'], function(req, res) {
    res.end(this.context.user.twitterHandle);
});

// define a task that says hi
taskify('sayHi', function(req, res) {
    res.end('hi');
});

// wire up the application routes
app.route('/hi', taskify.select('sayHi'));
app.route('/handle', taskify.select('writeHandle'));