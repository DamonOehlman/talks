// initialise our db connection
var level = require('levelup');
var db = level('./data', { valueEncoding: 'json' });

// start our cpu recorder
require('./cpu-recorder')(db);

// start our webserver component
require('./webserver')(db);
