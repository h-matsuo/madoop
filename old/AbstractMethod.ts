import * as fs from 'fs';
import * as childProcess from 'child_process';

import Language from './Language';
import MadoopError from './MadoopError';

abstract class AbstractMethod {

  private language: Language = null;
  private source: string = null;
  private js: Function = null;
  private wasm: Uint8Array = null;

  constructor(language?: Language,
              source?: string,
              js?: Function,
              wasm?: Uint8Array) {
    if (language) { this.language = language; }
    if (source) { this.source = source; }
    if (js) { this.js = js; }
    if (wasm) { this.wasm = wasm; }
  }

  getLanguage(): Language {
    return this.language;
  }

  getSource(): string {
    return this.source;
  }

  getJs(): Function {
    return this.js;
  }

  getWasm(): Uint8Array {
    return this.wasm;
  }

  setLanguage(language: Language): void {
    this.language = language;
  }

  setSource(source: string): void {
    this.source = source;
  }

  setJs(js: Function): void {
    this.js = js;
  }

  setWasm(wasm: Uint8Array): void {
    this.wasm = wasm;
  }

  compile(options?: [string]): void {
    switch (this.language) {
      case Language.JavaScript:
        // do nothing
        break;
      case Language.C:
        break;
      case Language.Cpp:
        const WORKDIR = '../workdir';
        fs.writeFileSync(`${WORKDIR}/code.cpp`, this.source);
        childProcess.execSync(`${WORKDIR}/docker-run.sh c++ code`);
        this.wasm = fs.readFileSync(`${WORKDIR}/code.wasm`);
        break;
      default:
        throw new MadoopError(`unknown language ${this.language} detected`);
    }
  }

}

export default AbstractMethod;
