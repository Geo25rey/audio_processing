#include <stdint.h>
#include <stdlib.h>
#include <stdbool.h>
#include <math.h>
#include <stdio.h>

void dfft(int len, float* in_data){
//    printf("Data: %p   Length: %d\n", in_data, len);
    int n,k;
    double sum;
    float input[len];
    float* output = in_data;

    for (n = 0; n < len; ++n)
        input[n] = in_data[n];

    for(n = 0; n < len; n++){
        sum = 0;
        for(k = 0; k < len; k++){
           sum += input[k]*cos((2*M_PI*k*n)/len);
        }
        output[n] = sum/len;
//        printf("in_data[%d]=%f\n", n, in_data[n]);
//        printf("input[%d]=%f\n", n, input[n]);
//        printf("output[%d]=%f\n", n, output[n]);
    }
}
