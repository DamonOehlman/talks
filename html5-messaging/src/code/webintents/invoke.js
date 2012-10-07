var intent = new Intent(
    "http://webintents.org/share",
    "text/uri-list",
    [ 'http://code12melb.webdirections.org/' ]
);

window.navigator.startActivity(intent);