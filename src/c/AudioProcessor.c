#include <opus/opus.h>

#include <AudioProcessor.h>
#include <stdint.h>
#include <stdlib.h>
#include <stdbool.h>

static OpusDecoder* decoder = NULL;

#define CHANNELS 2
#define BITRATE 48000
#define DECODE_FORWARD_ERROR_CORRECTION false

static void init() {
    int error = OPUS_OK;
    do {
        decoder = opus_decoder_create (BITRATE, CHANNELS, &error);
    } while (error != OPUS_OK);
}

float* process_audio(uint8_t* unprocessed_data, int size, int frame_size) {
    if (decoder == NULL)
        init();
    float* result = malloc(CHANNELS * sizeof(float) * size);
    int error = opus_decode_float(decoder, unprocessed_data, size, result, frame_size, DECODE_FORWARD_ERROR_CORRECTION);
    if (error != OPUS_OK) {
        free(result);
        return NULL;
    }
    return result;
}
