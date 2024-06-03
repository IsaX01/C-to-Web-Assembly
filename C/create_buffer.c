#include <emscripten.h>
#include <stdint.h>

EMSCRIPTEN_KEEPALIVE
uint8_t** create_buffer(int num_strings, int max_length) {
  uint8_t** buffer = (uint8_t**)emscripten_malloc(num_strings * sizeof(uint8_t*));
  if (buffer == NULL) {
    // Handle allocation failure (e.g., return NULL or throw an exception)
    return NULL;
  }

  for (int i = 0; i < num_strings; i++) {
    buffer[i] = (uint8_t*)emscripten_malloc(max_length * sizeof(uint8_t));
    if (buffer[i] == NULL) {
      // Handle allocation failure for individual strings
      emscripten_free(buffer);  // Free previously allocated memory
      return NULL;
    }
  }

  return buffer;
}