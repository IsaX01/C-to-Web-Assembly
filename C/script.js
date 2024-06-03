const arregloInput = document.getElementById('arregloInput');
const inputBusqueda = document.getElementById('inputBusqueda');
const radioBusqueda = document.getElementsByName('algoritmoBusqueda');
const radioOrdenamiento = document.getElementsByName('algoritmoOrdenamiento');
const ejecutarButton = document.getElementById('ejecutarButton');

const tiempoEjecucion = document.getElementById('tiempoEjecucion');
const elementoEncontrado = document.getElementById('elementoEncontrado');
const arregloOrdenado = document.getElementById('arregloOrdenado');

var busquedaSecuencial;
var busquedaBinaria;
var ordenamientoBurbuja;
var quicksort;
var ordenamientoInsercion;
var Add;
var Arreglo;
var anotherSecuencial;

let wasmMemory = new WebAssembly.Memory({ initial: 10, maximum: 65536 });

let wasmTable = new WebAssembly.Table({
    'initial': 1,
    'maximum': 10,
    'element': 'anyfunc'
});

let asmLibraryArg = {
    "__handle_stack_overflow": () => { },
    "emscripten_resize_heap": () => { },
    "__lock": () => { },
    "__unlock": () => { },
    "memory": wasmMemory,
    "table": wasmTable
};

var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg
};

var wasmModule;

async function cargarWASM(nombreArchivo, funcion) {
    try {
        console.log(`Cargando módulo WASM: ${nombreArchivo}`);
        const response = await fetch(nombreArchivo);
        console.log("fetch", response)
        const buffer = await response.arrayBuffer();
        const module = await WebAssembly.instantiate(buffer, info);
        wasmModule = module.instance.exports;
        console.log(`Módulo WASM cargado: ${nombreArchivo}`);
        console.log(`Función exportada: ${funcion}`);
        console.log("moduels", module)
        console.log("instancia", module.instance)
        console.log("moduelswasm", wasmModule)
        switch (funcion) {
            case 'busquedaSecuencial':
                busquedaSecuencial = wasmModule.c;
                console.log(busquedaSecuencial)
                break;
            case 'busquedaBinaria':
                busquedaBinaria = wasmModule.c;
                console.log(busquedaBinaria)
                break;
            case 'ordenamientoBurbuja':
                ordenamientoBurbuja = wasmModule.c;
                console.log(ordenamientoBurbuja)
                break;
            case 'ordenamientoQuickSort':
                quicksort = wasmModule.c;
                console.log(quicksort)
                break;
            case 'ordenamientoInsercion':
                ordenamientoInsercion = wasmModule.c;
                console.log(ordenamientoInsercion)
                break;
            case 'Add':
                Add = wasmModule.c;
                console.log(Add)
                break;
            case 'Arreglo':
                Arreglo = wasmModule.c;
                console.log(Arreglo)
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
        cargarWASM('busquedaSecuencial.wasm', 'busquedaSecuencial'),
        cargarWASM('busquedaBinaria.wasm', 'busquedaBinaria'),
        cargarWASM('ordenamientoBurbuja.wasm', 'ordenamientoBurbuja'),
        cargarWASM('ordenamientoQuickSort.wasm', 'ordenamientoQuickSort'),
        cargarWASM('ordenamientoInsercion.wasm', 'ordenamientoInsercion'),
        cargarWASM('Add.wasm', 'Add'),
        cargarWASM('Arreglo.wasm', 'Arreglo')
    ]);
}


ejecutarButton.addEventListener('click', async () => {
    limpiarResultados();

    const algoritmoBusqueda = obtenerAlgoritmoSeleccionado('algoritmoBusqueda');
    const algoritmoOrdenamiento = obtenerAlgoritmoSeleccionado('algoritmoOrdenamiento');

    await cargarTodasLasFuncionesWASM();

    const arreglo = obtenerArreglo();
    const elementoABuscar = obtenerElementoABuscar();

    const arregloLength = arreglo.length;
    const arregloMemorySize = arregloLength * 4; // Assuming each element is 4 bytes (integer)
    const arregloMemoryOffset = wasmMemory.grow(Math.ceil(arregloMemorySize / 65536));
    const arregloPointer = arregloMemoryOffset * 65536;
  
    // Copy the array data to WebAssembly memory
    const arregloView = new Uint32Array(wasmMemory.buffer, arregloPointer, arregloLength);
    arregloView.set(arreglo);

    let tiempoInicio;
    let tiempoFin;
    let indiceEncontrado = -1;

    console.log(algoritmoBusqueda, algoritmoOrdenamiento);
    console.log(ordenamientoBurbuja, busquedaSecuencial);
    console.log(Add(10, 8))
    console.log(Arreglo(arregloView))
    console.log("memory", wasmMemory.buffer)
    // Búsqueda
    tiempoInicio = performance.now();
    if (algoritmoBusqueda === 'busquedaSecuencial' && busquedaSecuencial) {
        console.log("secuencial", arreglo);
        indiceEncontrado = busquedaSecuencial(arregloView, elementoABuscar, arreglo.length);
        console.log("indice", indiceEncontrado)
    } else if (algoritmoBusqueda === 'busquedaBinaria' && busquedaBinaria) {
        indiceEncontrado = busquedaBinaria(arreglo, elementoABuscar, 0, arreglo.length - 1);
    }
    tiempoFin = performance.now();
    mostrarTiempoEjecucion(tiempoFin - tiempoInicio, 'Búsqueda');

    mostrarElementoEncontrado(indiceEncontrado);

    // Ordenamiento
    tiempoInicio = performance.now();
    if (algoritmoOrdenamiento === 'ordenamientoBurbuja' && ordenamientoBurbuja) {
        console.log("burbuja");
        ordenamientoBurbuja(arregloView, arreglo.length);
    } else if (algoritmoOrdenamiento === 'ordenamientoQuickSort' && quicksort) {
        quicksort(arreglo, 0, arreglo.length - 1);
    } else if (algoritmoOrdenamiento === 'ordenamientoInsercion' && ordenamientoInsercion) {
        ordenamientoInsercion(arreglo, arreglo.length);
    }
    tiempoFin = performance.now();
    mostrarTiempoEjecucion(tiempoFin - tiempoInicio, 'Ordenamiento');
    const sortedArray = Array.from(arregloView);
    mostrarArregloOrdenado(sortedArray);
    wasmMemory.grow(0);

});

function limpiarResultados() {
    tiempoEjecucion.textContent = '';
    elementoEncontrado.textContent = '';
    arregloOrdenado.textContent = '';
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
    const arregloOrdenadoElement = document.getElementById('arregloOrdenado');
    const _arreglo = Array.from(arregloOrdenado)
    arregloOrdenadoElement.textContent = `Arreglo ordenado: ${_arreglo.join(', ')}`;
}

function mostrarElementoEncontrado(elementoEncontrado) {
    const elementoEncontradoElement = document.getElementById('elementoEncontrado');
    if (elementoEncontrado !== -1) {
        elementoEncontradoElement.textContent = `Elemento encontrado en índice: ${elementoEncontrado}`;
    } else {
        elementoEncontradoElement.textContent = `Elemento no encontrado`;
    }
}

function mostrarTiempoEjecucion(tiempoEjecucion, tipo) {
    const tiempoEjecucionElement = document.getElementById('tiempoEjecucion');
    tiempoEjecucionElement.textContent += `${tipo} - Tiempo de ejecución: ${tiempoEjecucion.toFixed(2)} ms\n`;
}

function obtenerArreglo() {
    const arregloInput = document.getElementById('arregloInput').value;
    return arregloInput.split(',').map(Number);
}

function obtenerElementoABuscar() {
    const inputBusqueda = document.getElementById('inputBusqueda').value;
    return Number(inputBusqueda);
}
