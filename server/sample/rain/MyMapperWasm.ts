// import AbstractMapperWasm from '../../madoop/AbstractMapperWasm';

declare var Module: any;
declare var execEmit: any;

// export default
// class MyMapperWasm extends AbstractMapperWasm {

  function map(
    inputData: string[],
    emitFunc: (key: string, value: string) => void
  ): void {

    const exec = async () => {
      let module;
      const response = await fetch('sample.wasm');
      const buffer = await response.arrayBuffer();
      const binary = new Uint8Array(buffer);
      const moduleArgs = {
        'wasmBinary': binary,
        'onRuntimeInitialized': () => {
          const map = module.cwrap('map', null, ['string']);
          execEmit = emitFunc; // execEmit: defined in lib_emit_func.js; called by C++
          map(inputData);
        }
      };
      module = Module(moduleArgs);
    };

  }

// }
