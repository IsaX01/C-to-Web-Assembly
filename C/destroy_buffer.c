#include <emscripten.h>
#include <stdint.h>

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t** buffer, int num_strings) {
    for (int i = 0; i < num_strings; i++) {
        free(buffer[i]);
    }
    free(buffer);
}