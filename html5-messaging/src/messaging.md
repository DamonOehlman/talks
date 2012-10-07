:data-bg:> images/5613865198_e62da9ab4b_o.jpg
:data-attribution:> http://www.flickr.com/photos/pasukaru76/

# Cross Document Messaging

---

## What is Cross Document Messaging?

- A method of allowing two browser windows to communicate without violating cross-domain restrictions.

- Comes in two flavours: 

    1. Simple and effective `postMessage` calls to a known `Window` instance.
    2. Channel Messaging.
    
---

## Why Use Cross Document Messaging?

Quite simply - because you want to talk to other browser window contexts.

---

## Example: Prepping Demo Code

[[code code/xdocmessaging/slidechange.js]]

---

## What about Channel Messaging?

- Can be used to facilitate communication between two windows with no knowledge of each other.

- While an interesting concept, I personally don't feel I'm getting bang for buck.

- Goes beyond what can be covered in this talk.