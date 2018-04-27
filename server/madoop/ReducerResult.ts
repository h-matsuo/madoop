import MadoopError from './MadoopError';

export default
class ReducerResult {

  private pairs: Map<any, any>;

  constructor() {
    this.pairs = new Map();
  }

  getPairs(): Map<any, any> {
    return this.pairs;
  }

  addPair(key: any, value: any): void {
    if (this.pairs.has(key)) {
      throw new MadoopError(`key ${key} has already registered`);
    }
    this.pairs.set(key, value);
  }

}
