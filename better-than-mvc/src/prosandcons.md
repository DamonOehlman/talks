## Clientside MVC
# The Good

---

## It's a structured approach

One of the main reasons people **advocate** using an MVC framework is that it helps to prevent your application turning into _spaghetti code_.

---

## A Proven Pattern

MVC is a proven pattern, and there is a lot of existing knowledge on how to implement it.

---

## Clientside MVC
# The Bad

---jade

h2 MVC is Misunderstood

blockquote There are over 40 JavaScript MVC frameworks to help.
  | ... many of which don't use MVC.
  
cite
    a(href="http://addyosmani.com/blog/digesting-javascript-mvc-pattern-abuse-or-evolution/") Addy Osmani

---

## It's a Square Peg

- MVC is a pattern that is best suited to a particular type of application (which admittedly are quite common) and interaction pattern.
- Bending the MVC patterns to fit applications that miss the sweet spot isn't a good idea.

---

## Tight Coupling

- Most MVC frameworks are very declarative in the parts of the system are made to talk to each other.
- While apps written like this are usually easy to comprehend, it's a pattern that limits extensibility.

---

## Noise

- The ability of clientside MVC (or MV*) to provide a portable, reusable pattern for web application development across different software projects and employers is limited.

- Knowledge and experience in a single framework (e.g. Backbone, Angular), however, would be portable.

---

## Clientside MVC
# The Ugly

---

## Some Frameworks Encourage HTML Abuse

Sometimes I feel like I'm the only person in the world who thinks the use of inline `<script>` tags to provide client-side templates is messy and wrong.

---jade

h2 On Inlining Templates

blockquote Embedding scripts in your page that have a unknown content-type (such is the case here - the browser doesn't know how to execute a text/html script) are simply ignored by the browser - and by search engines and screenreaders. It's a perfect cloaking device for sneaking templates into your page.

cite
  a(href="http://ejohn.org/blog/javascript-micro-templating/") John Resig

blockquote.fragment I like to use this technique for quick-and-dirty cases where I just need a little template or two on the page and want something light and fast.