:data-bg:> images/5158715290_f0605b197a_b.jpg
:data-attribution:> http://www.flickr.com/photos/pedrovezini/5158715290/

# Web Sockets

---

### Why Websockets?

- Because you can't beat realtime.
- Bi-directional communication.
- Lightweight!

---

## Creating a Socket

Creating a new websocket connection (and attempting to open that connection) is __really, really__ easy:

[[code code/websockets/open-websocket.js]]

---

## Open Sesame

And, your newly created websocket object will fire an __open__ message when the connection is active:

[[code code/websockets/socket-onopen.js]]

---

## Sending Messages

Sending a message is as simple as calling the send method of a WebSocket instance:

[[code code/websockets/socket-send.js]]

---

## Receiving Messages

Listen for the message event:

[[code code/websockets/socket-onmessage.js]]

---

:data-bg:> images/2545465723_ac7ffc6e73_b.jpg
:data-attribution:> http://www.flickr.com/photos/tim_norris/2545465723/
:data-demo:> echo

# DEMO: Simple Echo

---

:data-bg:> images/6252678567_5625b237c3_b.jpg
:data-attribution:> http://www.flickr.com/photos/photography-andreas/6252678567/
:data-demo:> tweets

# DEMO: Twitter Feed

---

:data-bg:> images/4865872893_56d408f406_o.jpg
:data-attribution:> http://www.flickr.com/photos/azrasta/4865872893/

# Web sockets in Production

---

## Browser Support

Browser support for websockets is far from stable, and in these slides I have demonstrated the native browser interface to WebSockets.

If you are writing a production app, however, __you really need__ to include stable fallbacks to deal with non-existent or poor websocket support.

I'd recommend checking out something like [Socket.IO](http://socket.io/) or another similar framework that takes care of this for you.

---

## Server Support

There are quite a few server implementations of websockets in technologies from Node.js to Java.  

While application server support is progressing well, you also need to have a look at what other webservers, reverse proxies, security appliances, etc sit between your customers and your app server. Support for Websockets in these layers is definitely not as well progressed.