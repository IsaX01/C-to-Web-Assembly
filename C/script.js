// // Obtener referencias a los elementos del HTML
// const arregloInput = document.getElementById('arregloInput');
// const radioBusqueda = document.getElementsByName('algoritmoBusqueda');
// const radioOrdenamiento = document.getElementsByName('algoritmoOrdenamiento');
// const ejecutarButton = document.getElementById('ejecutarButton');
// const tiempoEjecucion = document.getElementById('tiempoEjecucion');
// const elementoEncontrado = document.getElementById('elementoEncontrado');
// const arregloOrdenado = document.getElementById('arregloOrdenado');

// // Declarar variables para almacenar el módulo WASM y las funciones de búsqueda y ordenamiento
// let wasmModule;
// let busquedaSecuencialFunc;
// let busquedaBinariaFunc;
// let ordenamientoBurbujaFunc;
// let quickSortFunc;
// let ordenamientoInsercionFunc;

// // Cargar el módulo WASM
// fetch('wasmModule.wasm')
//   .then(response => response.arrayBuffer())
//   .then(buffer => WebAssembly.instantiate(buffer))
//   .then(module => {
//     wasmModule = module;

//     // Obtener las funciones de búsqueda y ordenamiento del módulo WASM
//     busquedaSecuencialFunc = wasmModule.instance.exports.busquedaSecuencial;
//     busquedaBinariaFunc = wasmModule.instance.exports.busquedaBinaria;
//     ordenamientoBurbujaFunc = wasmModule.instance.exports.ordenamientoBurbuja;
//     quickSortFunc = wasmModule.instance.exports.ordenamientoQuickSort;
//     ordenamientoInsercionFunc = wasmModule.instance.exports.ordenamientoInsercion;

//   });


// Obtener referencias a los elementos del HTML
const arregloInput = document.getElementById('arregloInput');
// ... (otros elementos)

// Declarar variables para almacenar las funciones de búsqueda y ordenamiento
let busquedaSecuencial;
let busquedaBinaria;
let ordenamientoBurbuja;
let quicksort;
let ordenamientoInsercion;

// Función para cargar un archivo WASM
function cargarWASM(nombreArchivo, funcion) {
  fetch(nombreArchivo)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.instantiate(buffer))
    .then(module => {
      const wasmModule = module.instance.exports;
      switch (funcion) {
        case 'busquedaSecuencial':
          busquedaSecuencial = wasmModule.busquedaSecuencial;
          break;
        case 'busquedaBinaria':
          busquedaBinaria = wasmModule.busquedaBinaria;
          break;
        case 'ordenamientoBurbuja':
          ordenamientoBurbuja = wasmModule.ordenamientoBurbuja;
          break;
        case 'ordenamientoQuickSort':
          quicksort = wasmModule.ordenamientoQuickSort;
          break;
        case 'ordenamientoInsercion':
          ordenamientoInsercion = wasmModule.ordenamientoInsercion;
          break;
        // Agrega más casos según tus funciones
        default:
          console.error(`Función desconocida: ${funcion}`);
      }
    });
}

// Manejador de clic en el botón "Ejecutar"
ejecutarButton.addEventListener('click', () => {
  const algoritmoBusqueda = obtenerAlgoritmoSeleccionado('algoritmoBusqueda');
  const algoritmoOrdenamiento = obtenerAlgoritmoSeleccionado('algoritmoOrdenamiento');

  cargarWASM('busquedaSecuencial.wasm', algoritmoBusqueda);
  cargarWASM('busquedaBinaria.wasm', algoritmoBusqueda);
  cargarWASM('ordenamientoBurbuja.wasm', algoritmoOrdenamiento);
  cargarWASM('ordenamientoQuickSort.wasm', algoritmoOrdenamiento);
  cargarWASM('ordenamientoInsercion.wasm', algoritmoOrdenamiento);

  // Ejecuta las funciones según las selecciones del usuario
  // ...
});

// Función para obtener el algoritmo seleccionado (búsqueda u ordenamiento)
function obtenerAlgoritmoSeleccionado(nombreRadioGroup) {
  const radios = document.getElementsByName(nombreRadioGroup);
  for (const radio of radios) {
    if (radio.checked) {
      return radio.value;
    }
  }
  return null;
}

