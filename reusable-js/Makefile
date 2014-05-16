NPMBIN = ../node_modules/.bin

default: bundle
	$(NPMBIN)/st -nc -p 8080 -i index.html

clean:
	@rm -rf bundle.js

gendocs:
	@echo "generating readme"
	@$(NPMBIN)/gendocs > README.md

dev: clean gendocs
	make watch &
	@$(NPMBIN)/beefy index.js:bundle.js -- -t brfs

watch:
	inotifywait -e modify index.js && make gendocs && make watch

bundle: clean gendocs
	$(NPMBIN)/browserify index -t brfs > bundle.js
