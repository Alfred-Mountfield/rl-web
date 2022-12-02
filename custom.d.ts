declare module "*.replay" {
  const content: string;
  export default content;
}

declare module "*?module" {
  const content: WebAssembly.Module;
  export default content;
}

declare module "wasm-package/index_bg.wasm?module" {
  const content: WebAssembly.Module;
  export default content;
}
