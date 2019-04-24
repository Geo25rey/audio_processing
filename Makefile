## DEFINED BY CONFIGURE // TODO add configure script to set pwd once
PROJECT := $(shell pwd)
WEBMDECODER_EXPORTED_FUNCTIONS := '_parseWebm' # TODO add to configure scirpt

## DEFINED BY STATIC
BUILD_DIR := $(shell pwd)
SRC := $(PROJECT)/src
CC := emcc
INCLUDE := $(SRC)/c/include
OPUS_INCLUDE := $(shell pwd)/opus-pkg/include
OPUS_LIBRARY := $(shell pwd)/opus-pkg/lib
CFLAGS := -I$(INCLUDE) -I$(OPUS_INCLUDE) -L$(OPUS_LIBRARY)
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

opus-build:
	mkdir -v opus-build
	cd opus-build && ../opus/autogen.sh && emconfigure ../opus/configure --prefix=$(BUILD_DIR)/opus-pkg --disable-intrinsics

opus-pkg: opus-build
	mkdir -v opus-pkg
	cd opus-build && emmake make && emmake make install

c: opus-pkg
	mkdir -v c

c/%.o: $(SRC)/c/%.c $(INCLUDE)/*.h c
	$(CC) $(CFLAGS) -o $@ $<

js/WebmDecoderModule.wasm: c/WebmDecoder.o c/AudioProcessor.o
	$(CC) $(CFLAGS) -s EXPORTED_FUNCTIONS="[$(WEBMDECODER_EXPORTED_FUNCTIONS)]" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall']" --emrun $< -o $@

js/%.js: $(SRC)/js/%.js
	cp -v $^ js/

js/libs/%.js: $(SRC)/js/libs/%.js
	cp -v $^ js/libs

css/%.css: $(SRC)/css/%.css
	cp -v $^ css/

.PHONY: run zip clean superClean

clean:
	rm -rv *.html js/ css/ c/ opus-pkg/

superClean: 
	rm -v $(PROJECT_NAME).zip
	rm -rv *.html js/ css/ c/ opus-pkg/

zip: all
	zip -rouv $(PROJECT_NAME).zip . -i js/ js/* js/*/* css/ css/* *.html

run: all
	$(RUN) --port 8080 . 

