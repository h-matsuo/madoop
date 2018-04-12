class MapResult {

  private pairs: Map<any, any[]>;

  constructor() {
    this.pairs = new Map();
  }

  getPairs(): Map<any, any[]> {
    return this.pairs;
  }

  addPair(key: any, value: any): void {
    if (this.pairs.has(key)) {
      this.pairs.get(key).push(value);
    } else {
      this.pairs.set(key, [value]);
    }
  }

}

export default MapResult;
