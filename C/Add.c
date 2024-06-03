#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int Add(int x, int y) {
    return x + y;
}