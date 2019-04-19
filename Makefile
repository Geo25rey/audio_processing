## DEFINED BY CONFIGURE // TODO add configure script to set pwd once
PROJECT := $(shell pwd)
WEBMDECODER_EXPORTED_FUNCTIONS := '_parseWebm' # TODO add to configure scirpt

## DEFINED BY STATIC
SRC := $(PROJECT)/src
CC := emcc
INCLUDE := $(SRC)/c/include
CFLAGS := -I$(INCLUDE)
RUN := emrun
PROJECT_NAME := $(shell basename $(PROJECT))

all: index.html c c/*.o js js/*.js js/libs js/libs/*.js js/WebmDecoderModule.wasm css css/*.css #* */*

js:
	mkdir -v js

js/libs:
	mkdir -v js/libs

css:
	mkdir -v css

%.html: $(SRC)/%.html
	cp -v $< $@

c:
	mkdir -v c

c/%.o: $(SRC)/c/%.c $(INCLUDE)/*.h
	$(CC) $(CFLAGS) -o $@ $<

js/WebmDecoderModule.wasm: c/*.o
	$(CC) $(CFLAGS) -s EXPORTED_FUNCTIONS="[$(WEBMDECODER_EXPORTED_FUNCTIONS)]" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall']" --emrun $< -o $@

js/%.js: $(SRC)/js/%.js
	cp -v $^ js/

js/libs/%.js: $(SRC)/js/libs/%.js
	cp -v $^ js/libs

css/%.css: $(SRC)/css/%.css
	cp -v $^ css/

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

