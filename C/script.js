const arregloInput = document.getElementById("arregloInput");
const inputBusqueda = document.getElementById("inputBusqueda");
const radioBusqueda = document.getElementsByName("algoritmoBusqueda");
const radioOrdenamiento = document.getElementsByName("algoritmoOrdenamiento");
const ejecutarButton = document.getElementById("ejecutarButton");

const tiempoEjecucion = document.getElementById("tiempoEjecucion");
const elementoEncontrado = document.getElementById("elementoEncontrado");
const arregloOrdenado = document.getElementById("arregloOrdenado");

var busquedaSecuencial;
var busquedaBinaria;
var ordenamientoBurbuja;
var quicksort;
var ordenamientoInsercion;
var Add;
var Arreglo;
var anotherSecuencial;
var createBuffer;
var destroyBuffer;

let wasmMemory = new WebAssembly.Memory({ initial: 10, maximum: 65536 });

let asmLibraryArg = {
  __handle_stack_overflow: () => {},
  emscripten_resize_heap: () => {},
  __lock: () => {},
  __unlock: () => {},
  memory: wasmMemory,
};

var info = {
  env: asmLibraryArg,
  wasi_snapshot_preview1: asmLibraryArg,
};

var wasmModule;

async function cargarWASM(nombreArchivo, funcion) {
  try {
    console.log(`Cargando módulo WASM: ${nombreArchivo}`);
    const response = await fetch(nombreArchivo);
    console.log("fetch", response);
    const buffer = await response.arrayBuffer();
    const module = await WebAssembly.instantiate(buffer, info);
    wasmModule = module.instance.exports;
    console.log(`Módulo WASM cargado: ${nombreArchivo}`);
    console.log(`Función exportada: ${funcion}`);
    console.log("moduels", module);
    console.log("instancia", module.instance);
    console.log("moduelswasm", wasmModule);
    switch (funcion) {
      case "busquedaSecuencial":
        busquedaSecuencial = wasmModule.busquedaSecuencial;
        console.log(busquedaSecuencial);
        break;
      case "busquedaBinaria":
        busquedaBinaria = wasmModule.busquedaBinaria;
        console.log(busquedaBinaria);
        break;
      case "ordenamientoBurbuja":
        ordenamientoBurbuja = wasmModule.ordenamientoBurbuja;
        console.log(ordenamientoBurbuja);
        break;
      case "ordenamientoQuickSort":
        quicksort = wasmModule.quicksort;
        console.log(quicksort);
        break;
      case "ordenamientoInsercion":
        ordenamientoInsercion = wasmModule.ordenamientoInsercion;
        console.log(ordenamientoInsercion);
        break;
      case "Add":
        Add = wasmModule.Add;
        console.log(Add);
        break;
      case "Arreglo":
        Arreglo = wasmModule.Arreglo;
        console.log(Arreglo);
        break;
      case "createBuffer":
        createBuffer = wasmModule.create_buffer;
        break;
      case "destroyBuffer":
        destroyBuffer = wasmModule.destroy_buffer;
        break;
      default:
        console.error(`Función desconocida: ${funcion}`);
    }
  } catch (error) {
    console.error(`Error al cargar ${nombreArchivo}:`, error);
  }
}

async function cargarTodasLasFuncionesWASM() {
  await Promise.all([
    cargarWASM("busquedaSecuencial.wasm", "busquedaSecuencial"),
    cargarWASM("busquedaBinaria.wasm", "busquedaBinaria"),
    cargarWASM("ordenamientoBurbuja.wasm", "ordenamientoBurbuja"),
    cargarWASM("ordenamientoQuickSort.wasm", "ordenamientoQuickSort"),
    cargarWASM("ordenamientoInsercion.wasm", "ordenamientoInsercion"),
    cargarWASM("Add.wasm", "Add"),
    cargarWASM("Arreglo.wasm", "Arreglo"),
    cargarWASM('create_buffer.wasm', 'createBuffer'),
    cargarWASM('destroy_buffer.wasm', 'destroyBuffer')
  ]);
}

ejecutarButton.addEventListener("click", async () => {
  limpiarResultados();

  const algoritmoBusqueda = obtenerAlgoritmoSeleccionado("algoritmoBusqueda");
  const algoritmoOrdenamiento = obtenerAlgoritmoSeleccionado(
    "algoritmoOrdenamiento"
  );

  await cargarTodasLasFuncionesWASM();

  const arreglo = obtenerArreglo();
  const elementoABuscar = obtenerElementoABuscar();
  const numStrings = arreglo.length;
  const maxLength = Math.max(...arreglo.map(str => str.length)) + 1; // +1 for null terminator

  // Create buffer for array of strings
  const bufferPointer = createBuffer(numStrings, maxLength);

  // Copy strings to the buffer
  const HEAPU8 = new Uint8Array(wasmMemory.buffer);
  const HEAP32 = new Uint32Array(wasmMemory.buffer);
  for (let i = 0; i < numStrings; i++) {
      const stringPointer = HEAP32[(bufferPointer / 4) + i];
      for (let j = 0; j < arreglo[i].length; j++) {
          HEAPU8[stringPointer + j] = arreglo[i].charCodeAt(j);
      }
      HEAPU8[stringPointer + arreglo[i].length] = 0; // Null terminator
  }

  let tiempoInicio;
  let tiempoFin;
  let indiceEncontrado = -1;

  console.log(algoritmoBusqueda, algoritmoOrdenamiento);
  console.log(ordenamientoBurbuja, busquedaSecuencial);
  console.log(Add(10, 8));
  console.log(Arreglo(bufferPointer));
  console.log("memory", wasmMemory.buffer);
  // Búsqueda
  tiempoInicio = performance.now();
  if (algoritmoBusqueda === "busquedaSecuencial" && busquedaSecuencial) {
    indiceEncontrado = busquedaSecuencial(
      bufferPointer,
      elementoABuscar,
      numStrings
    );
    console.log("indice", indiceEncontrado);
  } else if (algoritmoBusqueda === "busquedaBinaria" && busquedaBinaria) {
    indiceEncontrado = busquedaBinaria(
      bufferPointer,
      elementoABuscar,
      0,
      numStrings - 1
    );
  }
  tiempoFin = performance.now();
  mostrarTiempoEjecucion(tiempoFin - tiempoInicio, "Búsqueda");

  mostrarElementoEncontrado(indiceEncontrado);

  // Ordenamiento
  tiempoInicio = performance.now();
  if (algoritmoOrdenamiento === "ordenamientoBurbuja" && ordenamientoBurbuja) {
    console.log("burbuja");
    ordenamientoBurbuja(bufferPointer, numStrings);
  } else if (algoritmoOrdenamiento === "ordenamientoQuickSort" && quicksort) {
    quicksort(bufferPointer, 0, numStrings - 1);
  } else if (
    algoritmoOrdenamiento === "ordenamientoInsercion" &&
    ordenamientoInsercion
  ) {
    ordenamientoInsercion(bufferPointer, numStrings);
  }
  tiempoFin = performance.now();
  mostrarTiempoEjecucion(tiempoFin - tiempoInicio, "Ordenamiento");
  const sortedArray = [];
    for (let i = 0; i < numStrings; i++) {
        const stringPointer = HEAP32[(bufferPointer / 4) + i];
        let str = '';
        for (let j = 0; j < maxLength; j++) {
            const charCode = HEAPU8[stringPointer + j];
            if (charCode === 0) break; // Null terminator
            str += String.fromCharCode(charCode);
        }
        sortedArray.push(str);
    }
    mostrarArregloOrdenado(sortedArray);
    console.log("sortedArray: " + sortedArray)
    // Destroy the buffer
    destroyBuffer(bufferPointer, numStrings);

});

function limpiarResultados() {
  tiempoEjecucion.textContent = "";
  elementoEncontrado.textContent = "";
  arregloOrdenado.textContent = "";
}

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
  const arregloOrdenadoElement = document.getElementById("arregloOrdenado");
  const _arreglo = Array.from(arregloOrdenado);
  arregloOrdenadoElement.textContent = `Arreglo ordenado: ${_arreglo.join(
    ", "
  )}`;
}

function mostrarElementoEncontrado(elementoEncontrado) {
  const elementoEncontradoElement =
    document.getElementById("elementoEncontrado");
  if (elementoEncontrado !== -1) {
    elementoEncontradoElement.textContent = `Elemento encontrado en índice: ${elementoEncontrado}`;
  } else {
    elementoEncontradoElement.textContent = `Elemento no encontrado`;
  }
}

function mostrarTiempoEjecucion(tiempoEjecucion, tipo) {
  const tiempoEjecucionElement = document.getElementById("tiempoEjecucion");
  tiempoEjecucionElement.textContent += `${tipo} - Tiempo de ejecución: ${tiempoEjecucion.toFixed(
    2
  )} ms\n`;
}

function obtenerArreglo() {
  const arregloInput = document.getElementById("arregloInput").value;
  return arregloInput.split(",").map(Number);
}

function obtenerElementoABuscar() {
  const inputBusqueda = document.getElementById("inputBusqueda").value;
  return Number(inputBusqueda);
}
