export { WasmPackage, setWasmInit } from "./common";
export { default as init } from "./wasm/index";
export * from "./wasm/index";

import { setWasmInit } from "./common";
import wasm from "./wasm/index_bg.wasm";

// @ts-ignore
setWasmInit(() => wasm());
