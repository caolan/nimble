PACKAGE = nimble
NODEJS = $(if $(shell test -f /usr/bin/nodejs && echo "true"),nodejs,node)

BUILDDIR = .

all: build

build: nimble.js
	uglifyjs -nc nimble.js > $(BUILDDIR)/nimble.min.js
	gzip -c nimble.min.js > nimble.min.js.gzip

test:
	nodeunit test/test.js

clean:
	rm $(BUILDDIR)/nimble.min.js
	rm $(BUILDDIR)/nimble.min.js.gzip

lint:
	nodelint --config nodelint.cfg nimble.js

.PHONY: clean test lint build all
