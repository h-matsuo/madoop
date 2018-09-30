import AbstractReducer from './AbstractReducer';

export default
class WasmReducer extends AbstractReducer {

  private wasmJs: string;
  private wasmBinary: Buffer;
  private wasmPreprocessJs: string;

  reduce(
    inputData: Map<any, any[]>,
    emitFunc: (key: any, value: any) => void
  ): void {
    return;
  }

  getWasmJs(): string {
    return this.wasmJs;
  }

  getWasmBinary(): Buffer {
    return this.wasmBinary;
  }

  getWasmPreprocessJs(): string {
    return this.wasmPreprocessJs;
  }

  setWasmJs(js: string) {
    this.wasmJs = js;
  }

  setWasmBinary(binary: Buffer) {
    this.wasmBinary = binary;
  }

  setWasmPreprocessJs(js: string) {
    this.wasmPreprocessJs = js;
  }

}
