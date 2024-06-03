#include <emscripten.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
int* Arreglo(int* arreglo) {
  return arreglo;
}