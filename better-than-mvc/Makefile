SHELL := /bin/bash

build:
	@/development/projects/DamonOehlman/boxit/bin/boxit
	@cp -r src/images/* "-/images/"

test:
	@mocha --reporter spec

.PHONY: test