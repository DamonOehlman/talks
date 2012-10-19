SHELL := /bin/bash

build:
	@/development/projects/DamonOehlman/boxit/bin/boxit --path src --output .
	@cp -r src/assets/*.png "-/images/"

test:
	@mocha --reporter spec

.PHONY: test