import Mapper from './Mapper';
import MapResult from './MapResult';
import Reducer from './Reducer';
import ReduceResult from './ReduceResult';
import Data from './Data';
import Result from './Result';

class Job {

  private mapper: Mapper;
  private mapResult: MapResult;
  private reducer: Reducer;
  private reduceResult: ReduceResult;
  private data: Data;
  private result: Result;

  constructor() {
    this.mapResult = new MapResult();
    this.reduceResult = new ReduceResult();
  }

  getMapper(): Mapper {
    return this.mapper;
  }

  getMapResult(): MapResult {
    return this.mapResult;
  }

  getReducer(): Reducer {
    return this.reducer;
  }

  getReduceResult(): ReduceResult {
    return this.reduceResult;
  }

  getData(): Data {
    return this.data;
  }

  getResult(): Result {
    return this.result;
  }

  setMapper(mapper: Mapper): void {
    this.mapper = mapper;
  }

  addMapResultPair(key: any, value: any): void {
    this.mapResult.addPair(key, value);
  }

  setReducer(reducer: Reducer): void {
    this.reducer = reducer;
  }

  addReduceResultPair(key: any, value: any): void {
    this.reduceResult.addPair(key, value);
  }

  setData(data: Data): void {
    this.data = data;
  }

  setResult(result: Result): void {
    this.result = result;
  }

}

export default Job;
