#include <emscripten.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
void ordenamientoBurbuja(int32_t* arreglo, int longitud) {
  for (int i = 0; i < longitud - 1; i++) {
    for (int j = 0; j < longitud - i - 1; j++) {
      if (arreglo[j] > arreglo[j + 1]) {
        int temp = arreglo[j];
        arreglo[j] = arreglo[j + 1];
        arreglo[j + 1] = temp;
      }
    }
  }
}

// Compara elementos adyacentes y los intercambia si están en el orden incorrecto. Repite el proceso hasta que no haya más intercambios.