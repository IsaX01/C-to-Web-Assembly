// // Obtener referencias a los elementos del HTML


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


 const arregloInput = document.getElementById('arregloInput');
 const inputBusqueda = document.getElementById('inputBusqueda');
 const radioBusqueda = document.getElementsByName('algoritmoBusqueda');
 const radioOrdenamiento = document.getElementsByName('algoritmoOrdenamiento');
 const ejecutarButton = document.getElementById('ejecutarButton');


 const tiempoEjecucion = document.getElementById('tiempoEjecucion');
 const elementoEncontrado = document.getElementById('elementoEncontrado');
 const arregloOrdenado = document.getElementById('arregloOrdenado');


let busquedaSecuencial;
let busquedaBinaria;
let ordenamientoBurbuja;
let quicksort;
let ordenamientoInsercion;


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

ejecutarButton.addEventListener('click', () => {
  const algoritmoBusqueda = obtenerAlgoritmoSeleccionado('algoritmoBusqueda');
  const algoritmoOrdenamiento = obtenerAlgoritmoSeleccionado('algoritmoOrdenamiento');

  cargarWASM('busquedaSecuencial.wasm', algoritmoBusqueda);
  cargarWASM('busquedaBinaria.wasm', algoritmoBusqueda);
  cargarWASM('ordenamientoBurbuja.wasm', algoritmoOrdenamiento);
  cargarWASM('ordenamientoQuickSort.wasm', algoritmoOrdenamiento);
  cargarWASM('ordenamientoInsercion.wasm', algoritmoOrdenamiento);

  const arreglo = obtenerArreglo();
  const elementoABuscar = obtenerElementoABuscar();

  let tiempoInicio;
  let tiempoFin;

  // Búsqueda
  if (algoritmoBusqueda === 'busquedaSecuencial') {
    tiempoInicio = performance.now();
    const indiceEncontrado = busquedaSecuencial(arreglo, elementoABuscar);
    tiempoFin = performance.now();
  } else if (algoritmoBusqueda === 'busquedaBinaria') {
    tiempoInicio = performance.now();
    const indiceEncontrado = busquedaBinaria(arreglo, elementoABuscar);
    tiempoFin = performance.now();
  }

  // Ordenamiento
  if (algoritmoOrdenamiento === 'ordenamientoBurbuja') {
    tiempoInicio = performance.now();
    ordenamientoBurbuja(arreglo);
    tiempoFin = performance.now();
  } else if (algoritmoOrdenamiento === 'ordenamientoQuickSort') {
    tiempoInicio = performance.now();
    quicksort(arreglo);
    tiempoFin = performance.now();
  } else if (algoritmoOrdenamiento === 'ordenamientoInsercion') {
    tiempoInicio = performance.now();
    ordenamientoInsercion(arreglo);
    tiempoFin = performance.now();
  }

  mostrarTiempoEjecucion(tiempoFin - tiempoInicio);
  mostrarElementoEncontrado(indiceEncontrado);
  mostrarArregloOrdenado(arreglo);
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

function mostrarArregloOrdenado(arregloOrdenado) {
  const arregloOrdenadoElement = document.getElementById('arregloOrdenado');
  arregloOrdenadoElement.textContent = `Arreglo ordenado: ${arregloOrdenado.join(', ')}`;
}

function mostrarElementoEncontrado(elementoEncontrado) {
  const elementoEncontradoElement = document.getElementById('elementoEncontrado');
  if (elementoEncontrado !== -1) {
    elementoEncontradoElement.textContent = `Elemento encontrado: ${elementoEncontrado}`;
  } else {
    elementoEncontradoElement.textContent = `Elemento no encontrado`;
  }
}

function mostrarTiempoEjecucion(tiempoEjecucion) {
  const tiempoEjecucionElement = document.getElementById('tiempoEjecucion');
  tiempoEjecucionElement.textContent = `Tiempo de ejecución: ${tiempoEjecucion} ms`;
}

function obtenerArreglo() {
  const arregloInput = document.getElementById('arregloInput').value;
  return arregloInput.split(',').map(Number);
}

function obtenerElementoABuscar() {
  const inputBusqueda = document.getElementById('inputBusqueda').value;
  return Number(inputBusqueda);
}