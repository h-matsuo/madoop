import Map from './Map';
import MapResult from './MapResult';
import Shuffle from './Shuffle';
import Reduce from './Reduce';
import Data from './Data';
import Result from './Result';

class Job {

  private map: Map;
  private mapResult: MapResult;
  private shuffle: Shuffle;
  private reduce: Reduce;
  private data: Data;
  private result: Result;

  constructor() {
    this.mapResult = new MapResult();
  }

  getMap(): Map {
    return this.map;
  }

  getMapResult(): MapResult {
    return this.mapResult;
  }

  getShuffle(): Shuffle {
    return this.shuffle;
  }

  getReduce(): Reduce {
    return this.reduce;
  }

  getData(): Data {
    return this.data;
  }

  getResult(): Result {
    return this.result;
  }

  setMap(map: Map): void {
    this.map = map;
  }

  addMapResultPair(key: any, value: any): void {
    this.mapResult.addPair(key, value);
  }

  setShuffle(shuffle: Shuffle): void {
    this.shuffle = shuffle;
  }

  setReduce(reduce: Reduce): void {
    this.reduce = reduce;
  }

  setData(data: Data): void {
    this.data = data;
  }

  setResult(result: Result): void {
    this.result = result;
  }


}

export default Job;
