import AbstractMapper from './AbstractMapper';

export default
class WasmMapper extends AbstractMapper {

  private wasmJs: string;
  private wasmBinary: Uint8Array;

  map(
    inputData: any,
    emitFunc: (key: any, value: any) => void
  ): void {
    return;
  }

  getWasmJs(): string {
    return this.wasmJs;
  }

  getWasmBinary(): Uint8Array {
    return this.wasmBinary;
  }

  setWasmJs(js: string) {
    this.wasmJs = js;
  }

  setWasmBinary(binary: Uint8Array) {
    this.wasmBinary = binary;
  }


}
