class MapResult {

  private pairs: Object[];

  constructor() {
    this.pairs = [];
  }

  getPairs(): Object[] {
    return this.pairs;
  }

  addPair(key: any, value: any): void {
    const element = {
      'key': key,
      'value': value
    };
    this.pairs.push(element);
  }

}

export default MapResult;
