# Alternatives to MVC

---jade

h2 Use MVC, But Rage against Frameworks

ul
  li Look for good standalone libraries that provide comparable functionality to what you get in the framework.
  li.fragment While this is easy for some components, it's really hard (almost impossible) with other parts.

---

:data-bg:> images/2858932924_c58d067f90_o.jpg
:data-attribution:> http://www.flickr.com/photos/billward/2858932924/sizes/l/in/photostream/

# Message Bus

---jade

h2 A Bus provides Lightweight Coupling

ul
  li.fragment Provision for organic growth of software
  li.fragment Strong testability of application components
  li.fragment Well geared to dealing with increasingly realtime nature of the web
  li.fragment Personally I can worked with and can highly recommend 
    a(src="https://github.com/DmitryBaranovskiy/eve") eve

---

## Eve
### Reactive UI

Very simple, decoupled handler to keep the UI in sync with the data:

[[code ../examples/eventbus/js/update-todos.js]]

Personally, I feel more comfortable using this technique that using automatic UI/View bindings.

---

## Eve
### Decoupled "Controller" Actions

Using appropriate event namespacing with eve can provide flexible decoupled handling of application actions:

[[code ../examples/eventbus/js/todo-save.js]]

---

## Eve
### Event Handler Priority

Eve supports the ability to register a handler in a particular priority order.  For example, it is extremely simple to wire in validation for our add todo event:


[[code ../examples/eventbus/js/todo-validate.js]]

---

## Eve
### Wildcard Handling

Wildcard matching provides the ability to events matching a particular pattern with a centralized handler:

[[code ../examples/eventbus/js/generic-validate.js]]

---

:data-bg:> images/4812542623_36e6082f15_o.jpg
:data-attribution:> http://www.flickr.com/photos/nasawebbtelescope/4812542623/sizes/l/in/photostream/

# Cryogenics

---

## Future Developments

There is some great stuff coming down the pipe that makes an MVCesque approach more sensible.

- `Object.observe`
  [Article](http://weblog.bocoup.com/javascript-object-observe/) [Spec](http://wiki.ecmascript.org/doku.php?id=harmony:observe)

- [Model Driven Views](http://mdv.googlecode.com/git/docs/design_intro.html)