import AbstractInputData from './AbstractInputData';
import MapperResult from './MapperResult';
import ReducerResult from './ReducerResult';
import Job from './Job';

export default
class DataController {

  private job: Job;
  private inputData: AbstractInputData;
  private mapperResult: MapperResult;
  private reducerResult: ReducerResult;

  private mapTaskDistributed: boolean[];
  private reduceInputData: Map<any, any[]>[];
  private reduceTaskDistributed: boolean[];

  constructor(job: Job) {
    this.job = job;
    this.mapperResult = new MapperResult();
    this.reducerResult = new ReducerResult();
  }

  getInputData(): AbstractInputData {
    return this.inputData;
  }

  setInputData(inputData: AbstractInputData): void {
    this.inputData = inputData;
    const dataLength = inputData.getInputDataList().length;
    this.mapTaskDistributed = (new Array(dataLength)).fill(false);
  }

  hasNextMapperInputData(): boolean {
    let id = -1;
    for (let i = 0; i < this.mapTaskDistributed.length; ++i) {
      if (!this.mapTaskDistributed[i]) {
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
    for (let i = 0; i < this.mapTaskDistributed.length; ++i) {
      if (!this.mapTaskDistributed[i]) {
        this.mapTaskDistributed[i] = true;
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
  }

  finishAddingMapperResultPairs(): void {
    if (!this.hasNextMapperInputData()) {
        this.setUpReducerInputData();
    }
  }

  setUpReducerInputData(): void {
    this.reduceInputData = this.job.getShuffler().setUpReducerInputData(this.mapperResult.getPairs());
    this.reduceTaskDistributed = (new Array(this.reduceInputData.length)).fill(false);
  }

  hasNextReducerInputData(): boolean {
    if (this.hasNextMapperInputData()) {
      return false;
    }
    let id = -1;
    for (let i = 0; i < this.reduceTaskDistributed.length; ++i) {
      if (!this.reduceTaskDistributed[i]) {
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
    for (let i = 0; i < this.reduceTaskDistributed.length; ++i) {
      if (!this.reduceTaskDistributed[i]) {
        this.reduceTaskDistributed[i] = true;
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
