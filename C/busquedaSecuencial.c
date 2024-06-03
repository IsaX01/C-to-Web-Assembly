#include <emscripten.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE
int busquedaSecuencial(int32_t *arreglo, int elemento, int longitud) {
  int indice = 0;
  while (indice < longitud && arreglo[indice] != elemento) {
    indice++;
  }
  if (indice < longitud) {
    return indice;
  } else {
    return -1;
  }
}

//  Recorre el arreglo desde el primer elemento hasta encontrar el elemento buscado o llegar al final del arreglo.