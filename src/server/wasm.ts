import wasmModule from "../../crate/pkg/rl_wasm_bg.wasm?module";
import wasmModule2 from "wasm-package/index_bg.wasm?module";
import {WasmPackage} from "wasm-package/slim";
import { ReplayParser } from "@/features/worker/ReplayParser";
import init, * as RlMod from "../../crate/pkg/rl_wasm";

export async function instantiateParser() {
  await WasmPackage.initialize(wasmModule2);
  await init(wasmModule);
  return new ReplayParser(RlMod);
}
