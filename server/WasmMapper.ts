import AbstractMapper from './AbstractMapper';

export default
class WasmMapper extends AbstractMapper {

  private wasmJs: string;
  private wasmBinary: Buffer;
  private wasmPreprocessJs: string;

  map(
    inputData: any,
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
