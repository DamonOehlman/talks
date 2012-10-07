:data-bg:> images/5742538697_6a042efd51_b.jpg
:data-attribution:> http://www.flickr.com/photos/eldave/5742538697/

# Web Intents

---

## What are Web Intents?

The __intention__ is to provide:

> DOM interfaces and markup used by client and service pages to create, receive, and reply to Web Intents messages, and the procedures the User Agent carries out to facilitate that process.

---

## What are Web Intents (Plain English)

- __Fact 1:__ You need something done on the web.
- __Fact 2:__ There are many services, plugins, etc that are capable of doing what you require.
- __Fact 3:__ The Web Intents project is a solid attempt to standardise both the __service definition__ and the __action invocation__.

---

## Intent Registration

The proposed markup for registering a Web Intent for use looks something like:

```html
<intent 
    action="http://webintents.org/share" 
    type="text/uri-list" 
    href="link.html" 
    disposition="inline"
    title="Link Share Intent" />
```
        
An intent used in the document is defined in the `head` of the document.
     
---

## Invoking a Web Intent

A Web Intent is invoked by creating a new `Intent` object, and then calling the `startActivity` method:

[[code code/webintents/invoke.js]]

---

## Web Intents Will Be Awesome

To keep an eye on their progress, check out:

<http://webintents.org/>


