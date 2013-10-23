# Prototyping Applications with Hoodie

---

## What is Hoodie?

[Hoodie](http://hood.ie) is an JS application development approach which has a focus on making applications with offline synchronization **just work**.

---

## Why Use (or even look at) Hoodie?

1. Because they are focused on solving hard problems (data sync) straight up, rather than giving you flashy things to distract you.

2. Leverages CouchDB for stuff it's really good at.

3. There's some really smart, experienced people working on it.

---

## Hoodie Core Concepts

- User Accounts and Authentication
- Generic Document Store
- Tasks
- Bus-like eventing (not as good as [eve](https://github.com/adobe-webplatform/eve), but good)

---

## Getting your Hoodie on

```js
var hoodie = new Hoodie();
```

This transparently creates a connection to the hoodie api running on the local machine in the background.  As you would expect, you can override the default endpoint.

---

## Authentication

```js
hoodie.account.signIn('me@test.com', 'supersecretpass');
```

Functions like the `signIn` function above return a promise.  While not my personal preference, it does make for a very clean looking API.

```js
hoodie.account.signIn('me@test.com', 'secret').then(function() {
	console.log(hoodie.account.username);
});
```

---

## Generic Document Store

This is very nicely done, and makes excellent use of Couch as a document store.

```js
hoodie.store.add('customer', { name: 'Bob' });
```

Data is added to a _user specific database_ in the couch backend if online.  Heck, you can even use "futon" (CouchDB's admin interface) to look at your data:

http://127.0.0.1:6001/_api/_utils

---

## Example: Capture Geo Tracks

So tracking a geo track could be as simple as:

```js
navigator.geolocation.watchPosition(function(pos) {
	hoodie.store.add('pos', pos.coords);
});
```

Which is pretty awesome.  Here's what the data looks like in couch:

```json
{
   "_id": "pos/3322231",
   "_rev": "1-121022121",
   "speed": null,
   "heading": null,
   "altitudeAccuracy": null,
   "accuracy": 18000,
   "altitude": null,
   "longitude": 151.20699,
   "latitude": -33.867487,
   "createdBy": "2122222",
   "updatedAt": "2013-10-23T03:31:07.059Z",
   "createdAt": "2013-10-23T03:31:07.059Z",
   "type": "pos"
}
```

---

## Hoodie Eventing

Hoodie uses a pubsub eventing model which allows for wonderful decoupling at the UI layer.

Handling account sign-in:

```js
hoodie.account.on('signin', function() {
});
```

Or when a new position is added:

```js
hoodie.store.on('add:pos', function(pos) {
	// I could do nifty geofencing stuff here :)
});
```

---

## Offline + Data Synchronization

All data is stored in `localStorage` (check your web inspector) and when online automatically synchronized with server.  If you want to know when synchronization is happening, then you can use events.

You could monitor your movements on a desktop display

```js
hoodie.remote.on('add:pos', function (pos) {
	// update your current position on your map
});
```
---

## Pros / Cons

- **PRO**: Tackling offline sync head on is great.
- **PRO**: Getting started fleshing out your app is really simple.
- **CON?**: Built on jQuery (at the moment)
- **CON?**: Feels a bit frameworky for my tastes.
- Be aware that storage implementation is pretty closely tied to [CouchDB](http://couchdb.apache.org) at the moment.  I **love** Couch so I don't consider this a problem, but you should be aware...

---

## Closing Thoughts

They have a dog wearing a hoodie - you should at least take a look.

It's great to see someone make a serious go of unlocking the potential of CouchDB + single page apps.