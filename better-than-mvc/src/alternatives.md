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

---

## Eve

Very simple, decoupled handler to keep the UI in sync with the data:

[[code ../examples/eventbus/js/update-todos.js]]

---

:data-bg:> images/4812542623_36e6082f15_o.jpg
:data-attribution:> http://www.flickr.com/photos/nasawebbtelescope/4812542623/sizes/l/in/photostream/

# Cryogenics

---

## Future Developments

- `Object.observe`
  [Article](http://weblog.bocoup.com/javascript-object-observe/) [Spec](http://wiki.ecmascript.org/doku.php?id=harmony:observe)

- [Model Driven Views](http://mdv.googlecode.com/git/docs/design_intro.html)