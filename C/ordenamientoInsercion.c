#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
void ordenamientoInsercion(int* arreglo, int longitud) {
  for (int i = 1; i < longitud; i++) {
    int valorActual = arreglo[i];
    int j = i - 1;
    while (j >= 0 && arreglo[j] > valorActual) {
      arreglo[j + 1] = arreglo[j];
      j--;
    }
    arreglo[j + 1] = valorActual;
  }
}

//  Inserta cada elemento del arreglo en su posición correcta en el subarreglo ordenado hasta ese momento.

// emcc busquedaBinaria.c -o busquedaBinaria.js -03 -s WASM=1