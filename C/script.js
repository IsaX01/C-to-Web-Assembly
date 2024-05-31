// Obtener referencias a los elementos del HTML
const arregloInput = document.getElementById('arregloInput');
const radioBusqueda = document.getElementsByName('algoritmoBusqueda');
const radioOrdenamiento = document.getElementsByName('algoritmoOrdenamiento');
const ejecutarButton = document.getElementById('ejecutarButton');
const tiempoEjecucion = document.getElementById('tiempoEjecucion');
const elementoEncontrado = document.getElementById('elementoEncontrado');
const arregloOrdenado = document.getElementById('arregloOrdenado');

// Declarar variables para almacenar el módulo WASM y las funciones de búsqueda y ordenamiento
let wasmModule;
let busquedaSecuencialFunc;
let busquedaBinariaFunc;
let ordenamientoBurbujaFunc;
let quickSortFunc;
let ordenamientoInsercionFunc;

// Cargar el módulo WASM
fetch('wasmModule.wasm')
  .then(response => response.arrayBuffer())
  .then(buffer => WebAssembly.instantiate(buffer))
  .then(module => {
    wasmModule = module;

    // Obtener las funciones de búsqueda y ordenamiento del módulo WASM
    busquedaSecuencialFunc = wasmModule.instance.exports.busquedaSecuencial;
    busquedaBinariaFunc = wasmModule.instance.exports.busquedaBinaria;
    ordenamientoBurbujaFunc = wasmModule.instance.exports.ordenamientoBurbuja;
    quickSortFunc = wasmModule.instance.exports.ordenamientoQuickSort;
    ordenamientoInsercionFunc = wasmModule.instance.exports.ordenamientoInsercion;

  });
