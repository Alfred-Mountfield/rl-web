'use strict';

let wasm$1;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}
/**
* @returns {number}
*/
function getAnswer() {
    const ret = wasm$1.getAnswer();
    return ret;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
* @param {any} bar
* @returns {any}
*/
function foo(bar) {
    try {
        const ret = wasm$1.foo(addBorrowedObject(bar));
        return takeObject(ret);
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };

    return imports;
}

function finalizeInit(instance, module) {
    wasm$1 = instance.exports;
    init.__wbindgen_wasm_module = module;


    return wasm$1;
}

function initSync(module) {
    const imports = getImports();

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('index_bg.wasm', "");
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

let wasmInit = undefined;
const setWasmInit = (arg) => {
    wasmInit = arg;
};
let initialized = undefined;
class WasmPackage {
    constructor() { }
    /**
     * Initializes the package. There is a one time global setup fee (sub 30ms), but subsequent
     * requests to initialize will be instantaneous, so it's not imperative to reuse the same parser.
     */
    static initialize = async (options) => {
        if (initialized === undefined) {
            //@ts-ignore
            const loadModule = options ?? wasmInit();
            initialized = init(loadModule).then(() => void 0);
        }
        await initialized;
        return new WasmPackage();
    };
    getAnswer = getAnswer;
}

function _loadWasmModule (sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

    if (imports) {
      return instantiateFunc(source, imports)
    } else {
      return compileFunc(source)
    }
  }

  
var buf = null;
var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
if (isNode) {
  
buf = Buffer.from(src, 'base64');

} else {
  
var raw = globalThis.atob(src);
var rawLength = raw.length;
buf = new Uint8Array(new ArrayBuffer(rawLength));
for(var i = 0; i < rawLength; i++) {
   buf[i] = raw.charCodeAt(i);
}

}


  if(sync) {
    var mod = new WebAssembly.Module(buf);
    return imports ? new WebAssembly.Instance(mod, imports) : mod
  } else {
    return _instantiateOrCompile(buf, imports, false)
  }
}

function wasm(imports){return _loadWasmModule(0, null, 'AGFzbQEAAAABCgJgAX8Bf2AAAX8CIwEDd2JnG19fd2JpbmRnZW5fb2JqZWN0X2Nsb25lX3JlZgAAAwMCAAEFAwEAEQccAwZtZW1vcnkCAAlnZXRBbnN3ZXIAAgNmb28AAQoNAgYAIAAQAAsEAEEqCwCDAQlwcm9kdWNlcnMCCGxhbmd1YWdlAQRSdXN0AAxwcm9jZXNzZWQtYnkDBXJ1c3RjJTEuNjcuMC1uaWdodGx5ICgxZWI2MmIxMjMgMjAyMi0xMS0yNykGd2FscnVzBjAuMTkuMAx3YXNtLWJpbmRnZW4SMC4yLjgzIChlYmE2OTFmMzgp', imports)}

// @ts-ignore
setWasmInit(() => wasm());

exports.WasmPackage = WasmPackage;
exports.foo = foo;
exports.getAnswer = getAnswer;
exports.init = init;
exports.initSync = initSync;
exports.setWasmInit = setWasmInit;
