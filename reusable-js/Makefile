NPMBIN = ../node_modules/.bin

default: bundle
	$(NPMBIN)/st -nc -p 8080 -i index.html

clean:
	@rm -rf bundle.js

gendocs:
	@echo "generating readme"
	@$(NPMBIN)/gendocs > README.md

bundle: clean gendocs
	$(NPMBIN)/browserify index.js -t brfs > bundle.js

dev: bundle
	st --port 8000 --no-cache &
	while true; do inotifywait -e modify index.js sections/*.md && make bundle; done
