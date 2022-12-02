import init, { getAnswer } from "./wasm/index";

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

let wasmInit: (() => InitInput) | undefined = undefined;
export const setWasmInit = (arg: () => InitInput) => {
  wasmInit = arg;
};

let initialized: Promise<void> | undefined = undefined;
export class WasmPackage {
  private constructor() {}

  /**
   * Initializes the package. There is a one time global setup fee (sub 30ms), but subsequent
   * requests to initialize will be instantaneous, so it's not imperative to reuse the same parser.
   */
  public static initialize = async (options?: InitInput) => {
      if (initialized === undefined) {
        //@ts-ignore
        const loadModule = options ?? wasmInit();
        initialized = init(loadModule).then(() => void 0);
      }

      await initialized;
      return new WasmPackage();
    };

  public getAnswer = getAnswer;
}