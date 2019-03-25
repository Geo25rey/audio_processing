
all: WebmDecoderModule.js

WebmDecoderModule.js: WebmDecoder.c
	emcc -s EXPORTED_FUNCTIONS="['_parseWebm']" -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall']" WebmDecoder.c -o WebmDecoderModule.js

.PHONY: run

run:
	emrun --port 8080 . 

