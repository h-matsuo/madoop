import MapMethod from './MapMethod';
import MapResult from './MapResult';
import Reduce from './Reduce';
import Data from './Data';
import Result from './Result';

class Job {

  private map: MapMethod;
  private mapResult: MapResult;
  private reduce: Reduce;
  private data: Data;
  private result: Result;

  constructor() {
    this.mapResult = new MapResult();
  }

  getMapMethod(): MapMethod {
    return this.map;
  }

  getMapResult(): MapResult {
    return this.mapResult;
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

  setMapMethod(map: MapMethod): void {
    this.map = map;
  }

  addMapResultPair(key: any, value: any): void {
    this.mapResult.addPair(key, value);
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
