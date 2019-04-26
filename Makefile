## DEFINED BY CONFIGURE // TODO add configure script to set pwd once
PROJECT := $(shell pwd)
WEBASSEMBLY_EXPORTED_FUNCTIONS :=  # TODO add to configure scirpt

## DEFINED BY STATIC
BUILD_DIR := $(shell pwd)
SRC := $(PROJECT)/src
CC := emcc
INCLUDE := $(SRC)/c/include
CFLAGS := -I$(INCLUDE)
RUN := emrun
PROJECT_NAME := $(shell basename $(PROJECT))

all: index.html

js: 
	mkdir -v js

js/libs: js
	mkdir -v js/libs

css: 
	mkdir -v css

%.html: $(SRC)/%.html css/*.css js/AudioProcessorModule.js js/*.js js/libs/*.js
	cp -v $< $@

c: 
	mkdir -v c

c/%.o: $(SRC)/c/%.c $(INCLUDE)/*.h c
	$(CC) $(CFLAGS) -o $@ $<

js/AudioProcessorModule.js: c/AudioProcessor.o js
	$(CC) $(CFLAGS) -s EXPORTED_FUNCTIONS="[$(WEBASSEMBLY_EXPORTED_FUNCTIONS)]" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall']" -emrun $< -o $@

js/%.js: $(SRC)/js/%.js js
	cp -v $^ js/ || true

js/libs/%.js: $(SRC)/js/libs/%.js js/libs
	cp -v $^ js/libs || true

css/%.css: $(SRC)/css/%.css css
	cp -v $^ css/ || true

.PHONY: run zip clean superClean

clean:
	rm -rv *.html js/ css/ c/

superClean: 
	rm -v $(PROJECT_NAME).zip
	rm -rv *.html js/ css/ c/

zip: all
	zip -rouv $(PROJECT_NAME).zip . -i js/ js/* js/*/* css/ css/* *.html

run: all
	$(RUN) --port 8080 . 

