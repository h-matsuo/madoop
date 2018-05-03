import AbstractReducer from './AbstractReducer';

export default
class WasmReducer extends AbstractReducer {

  private wasmJs: string;
  private wasmBinary: Buffer;

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

  setWasmJs(js: string) {
    this.wasmJs = js;
  }

  setWasmBinary(binary: Buffer) {
    this.wasmBinary = binary;
  }

}
