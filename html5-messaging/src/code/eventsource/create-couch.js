var url = 'http://localhost:5984/presentations/_changes?feed=eventsource&include_docs=true',
    remoteEvents = new EventSource(url);