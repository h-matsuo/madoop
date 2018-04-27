import AbstractInputData from './AbstractInputData';
import MapperResult from './MapperResult';
import ReducerResult from './ReducerResult';
import Reducer from './Reducer';

export default
class DataController {

  private inputData: AbstractInputData;
  private mapperResult: MapperResult;
  private reducerResult: ReducerResult;

  private mapCompleted: boolean[];
  private reduceInputData: Map<any, any[]>[];
  private reduceCompleted: boolean[];

  constructor(inputData: AbstractInputData = null) {
    if (inputData) {
      this.setInputData(inputData);
    }
    this.mapperResult = new MapperResult();
    this.reducerResult = new ReducerResult();
  }

  getInputData(): AbstractInputData {
    return this.inputData;
  }

  setInputData(inputData: AbstractInputData): void {
    this.inputData = inputData;
    const dataLength = inputData.getInputDataList().length;
    this.mapCompleted = (new Array(dataLength)).fill(false);
  }

  hasNextMapperInputData(): boolean {
    let id = -1;
    for (let i = 0; i < this.mapCompleted.length; ++i) {
      if (!this.mapCompleted[i]) {
        id = i;
        break;
      }
    }
    if (id >= 0) {
      return true;
    }
    return false;
  }

  getNextMapperInputData(): any | null {
    let id = -1;
    for (let i = 0; i < this.mapCompleted.length; ++i) {
      if (!this.mapCompleted[i]) {
        this.mapCompleted[i] = true;
        id = i;
        break;
      }
    }
    if (id >= 0) {
      return this.inputData.getInputData(id);
    } else {
      return null;
    }
  }

  getMapperResultPairs(): Map<any, any[]> {
    return this.mapperResult.getPairs();
  }

  addMapperResultPair(key: any, value: any): void {
    this.mapperResult.addPair(key, value);
    if (!this.hasNextMapperInputData()) {
      this.setUpReducerInputData();
    }
  }

  setUpReducerInputData(): void {
    const dataLength = this.mapperResult.getPairs().size;
    this.reduceInputData = [];
    this.reduceCompleted = (new Array(dataLength)).fill(false);
    this.mapperResult.getPairs().forEach((values, key) => {
      const data = new Map<any, any[]>();
      data.set(key, values);
      this.reduceInputData.push(data);
    });
  }

  hasNextReducerInputData(): boolean {
    if (this.hasNextMapperInputData()) {
      return false;
    }
    let id = -1;
    for (let i = 0; i < this.reduceCompleted.length; ++i) {
      if (!this.reduceCompleted[i]) {
        id = i;
        break;
      }
    }
    if (id >= 0) {
      return true;
    }
    return false;
  }

  getNextReducerInputData(): Map<any, any[]> | null {
    let id = -1;
    for (let i = 0; i < this.reduceCompleted.length; ++i) {
      if (!this.reduceCompleted[i]) {
        this.reduceCompleted[i] = true;
        id = i;
        break;
      }
    }
    if (id >= 0) {
      return this.reduceInputData[id];
    } else {
      return null;
    }
  }

  addReducerResultPair(key: any, value: any): void {
    this.reducerResult.addPair(key, value);
  }

  getReducerResultPairs(): Map<any, any> {
    return this.reducerResult.getPairs();
  }

}
