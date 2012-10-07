socket.onmessage = function(evt) {
    // data is available in the data member
    console.log('received data: ' + evt.data);
};