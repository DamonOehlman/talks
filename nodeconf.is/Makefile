NPMBIN = ../node_modules/.bin

build: bundle.js workshop-bundle.js

dev: clean
	@beefy index.js:bundle.js

bundle.js:
	browserify index.js > bundle.js

workshop-bundle.js:
	browserify workshop.js > workshop-bundle.js

clean:
	@rm -rf bundle.js
	@rm -rf workshop-bundle.js
