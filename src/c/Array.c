#include <stdint.h>
#include <stdbool.h>
#include <stdlib.h>

typedef struct Array {
    uint64_t size;
    void** elements;
} * Array;


#define __ARRAY_IMPL
#include <Array.h>


Array array_new(uint64_t arraySize) {
    Array result = calloc(sizeof(struct Array), 1);
    if (!result)
        return NULL;
    if (array_resize(result, arraySize))
        return result;
    else {
        array_free(result);
        return NULL;
    }
}

bool array_free(Array array) {
    if (!array)
        return false;
    if (array->elements)
        free(array->elements);
    free(array);
    return true;
}

bool array_set(Array array, uint64_t index, void* value) {
    if (!array)
        return false;
    if (index >= array->size)
        return false;
    array->elements[index] = value;
    return true;
}

void* array_get(Array array, uint64_t index) {
    if (!array)
        return NULL;
    if (index >= array->size)
        return NULL;
    return array->elements[index];
}

uint64_t array_size(Array array) {
    if (!array)
        return 0;
    return array->size;
}

bool array_resize(Array array, uint64_t newSize) {
    if (!array)
        return false;
    void* temp = realloc(array->elements, sizeof(void*) * newSize);
    if (!temp)
        return false;
    array->elements = temp;
    for (uint64_t i = array->size; i < newSize; ++i)
        array->elements[i] = 0;
    array->size = newSize;
    return true;
}
