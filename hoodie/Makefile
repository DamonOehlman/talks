MODULE_NAME=glue
REQUIRED_TOOLS=browserify st inotifywait

PHONY: dist

$(REQUIRED_TOOLS):
	@hash $@ 2>/dev/null || (echo "please install $@" && exit 1)

dist: $(REQUIRED_TOOLS)
	@echo "building"
	@browserify --debug -t brfs index.js > deck.js

devmode: dist
	st --port 8000 --no-cache &

	while true; do inotifywait -e create -e delete -e modify -q -r *.js node_modules || make dist; done