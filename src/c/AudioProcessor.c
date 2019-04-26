#include <stdint.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>

float* dfft(int len, float* in_data){

    int n,k;
    float sum = 0;
    float* output = malloc(sizeof(float)*len);
    for(n = 0; n < len; n++){
        for(k = 0; k < len; k++){
           sum += in_data[k]*cos((2*M_PI*k*n)/len);
        }
        output[n] = sum/len;
        sum = 0;
    }
    return output;

}
