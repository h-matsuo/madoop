import Map from './Map';
import Reduce from './Reduce';
import Data from './Data';
import Result from './Result';

class Job {

  private map: Map;
  private reduce: Reduce;
  private data: Data;
  private result: Result;

  constructor() {
    //
  }

  getMap(): Map {
    return this.map;
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
