#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int busquedaBinaria(int* arreglo, int elemento, int inicio, int fin) {
  if (inicio > fin) {
    return -1;
  }
  int medio = (inicio + fin) / 2;
  if (arreglo[medio] == elemento) {
    return medio;
  } else if (arreglo[medio] < elemento) {
    return busquedaBinaria(arreglo, elemento, medio + 1, fin);
  } else {
    return busquedaBinaria(arreglo, elemento, inicio, medio - 1);
  }
}

//  Divide el arreglo en dos mitades repetidamente hasta encontrar el elemento buscado o determinar que no está presente.