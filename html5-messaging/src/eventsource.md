:data-bg:> images/5729640585_aa43786e64_b.jpg
:data-attribution:> http://www.flickr.com/photos/pasukaru76/

# Server Sent Events (EventSource)

---

## What are Server Sent Events?

- A simple way (I think) to add realtime updates to your web apps.
- A text stream of data (over HTTP/S) from the server that is fed back to the browser.

---

## Why Use SSE?

- Simple, clever implementation without browser hacks.
- While not as cool (or interactive) as websockets, less dependencies on network stack.

---
    
## Defining an EventSource

Like the other APIs covered in this talk, initialising a new `EventSource` is very simple:

[[code code/eventsource/simple.js]]

---

## Handling Generic Events

Like the cross-document messaging and websocket APIs, an `EventSource` will generate message events:

[[code code/eventsource/onmessage.js]]

And you can also can create and consume custom events too. Before we have a look at that though, let's take a quick look at the event stream format.

---

## Dive Into The Event Stream

The event stream is simply a plain text stream which contains textual event data:

```
data: This is the first message.

data: This is the second message, it
data: has two lines.

data: This is the third message.
```

---

## Custom Events in the Stream

Custom events in the stream have an `event` specifier:

```
event: add
data: 73857293

event: remove
data: 2153

event: add

data: 113411
```

---

## Handling Custom Events

Handling these custom events is as simple as registering listeners for those specific event names:

[[code code/eventsource/customevents.js]]

---

## Cross Domain Restrictions

It's important to note that Server Sent Events __are__ subject to cross-domain security policy, and CORS support is still emerging in most browsers.