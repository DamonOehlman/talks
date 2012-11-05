async.series([
    steelmesh.connect.bind(steelmesh),
    monitor.start.bind(monitor),
    apploader.run.bind(apploader)
], function(err) {
    if (err) {
        out('!{red}{0}', err);
        return process.exit();
    }

    out('!{green}steelmesh started');
    meshEvents('status', 'online');
});