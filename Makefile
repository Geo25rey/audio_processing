## DEFINED BY CONFIGURE // TODO add configure script to set pwd once
PROJECT := $(shell pwd)
WEBMDECODER_EXPORTED_FUNCTIONS := '_parseWebm' # TODO add to configure scirpt

## DEFINED BY STATIC
SRC := $(PROJECT)/src
CC := emcc
RUN := emrun
PROJECT_NAME := $(shell basename $(PROJECT))

all: index.html js js/*.js js/libs js/libs/*.js js/WebmDecoderModule.wasm css css/*.css #* */*

js:
	mkdir -v js

js/libs:
	mkdir -v js/libs

css:
	mkdir -v css

%.html: $(SRC)/%.html
	cp -v $< $@

js/WebmDecoderModule.wasm: $(SRC)/c/WebmDecoder.c $(SRC)/c/dfa.h
	$(CC) -s EXPORTED_FUNCTIONS="[$(WEBMDECODER_EXPORTED_FUNCTIONS)]" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall']" $< -o $@

js/%.js: $(SRC)/js/%.js
	cp -v $^ js/

js/libs/%.js: $(SRC)/js/libs/%.js
	cp -v $^ js/libs

css/%.css: $(SRC)/css/%.css
	cp -v $^ css/

.PHONY: run zip clean superClean

clean:
	rm -rv *.html js/ css/

superClean: 
	rm -v $(PROJECT_NAME).zip
	rm -rv *.html js/ css/

zip: all
	zip -rouv $(PROJECT_NAME).zip . -i js/ js/* js/*/* css/ css/* *.html

run: all
	$(RUN) --port 8080 . 

