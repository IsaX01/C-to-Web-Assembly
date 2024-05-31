int particion(int arreglo[], int inicio, int fin) {
  int pivote = arreglo[fin];
  int i = (inicio - 1);

  for (int j = inicio; j < fin; j++) {
    if (arreglo[j] <= pivote) {
      i++;
      int temp = arreglo[i];
      arreglo[i] = arreglo[j];
      arreglo[j] = temp;
    }
  }

  int temp = arreglo[i + 1];
  arreglo[i + 1] = arreglo[fin];
  arreglo[fin] = temp;
  return i + 1;
}

void quickSort(int arreglo[], int inicio, int fin) {
  if (inicio < fin) {
    int pivote = particion(arreglo, inicio, fin);
    quickSort(arreglo, inicio, pivote - 1);
    quickSort(arreglo, pivote + 1, fin);
  }
}

// Selecciona un elemento pivote y divide el arreglo en dos subarreglos: elementos menores que el pivote y elementos mayores que el pivote. 
// Aplica recursivamente el algoritmo a los subarreglos hasta que el arreglo esté ordenado