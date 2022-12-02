import { getAnswer } from "./wasm/index";
export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;
export declare const setWasmInit: (arg: () => InitInput) => void;
export declare class WasmPackage {
    private constructor();
    /**
     * Initializes the package. There is a one time global setup fee (sub 30ms), but subsequent
     * requests to initialize will be instantaneous, so it's not imperative to reuse the same parser.
     */
    static initialize: (options?: InitInput) => Promise<WasmPackage>;
    getAnswer: typeof getAnswer;
}
