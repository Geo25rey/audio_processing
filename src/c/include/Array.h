#ifndef __ARRAY_H
#define __ARRAY_H

#include <stdint.h>
#include <stdbool.h>

#ifndef __ARRAY_IMPL
typedef struct {} * Array;
#endif

Array array_new(uint64_t arraySize);

bool array_free(Array);

bool array_set(Array, uint64_t index, void* value);

void* array_get(Array, uint64_t index);

uint64_t array_size(Array);

bool array_resize(Array, uint64_t newSize);

#endif
