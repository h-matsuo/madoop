import DataController from './DataController';
import AbstractInputData from './AbstractInputData';
import AbstractMapper from './AbstractMapper';
import AbstractReducer from './AbstractReducer';
import Task from './Task';
import { Madoop, MadoopError } from '..';

export default
class Job {

  private dataController: DataController;
  private jobId: string;
  private mapper: AbstractMapper;
  private reducer: AbstractReducer;
  private numMapCompleted: number;
  private callbackWhenCompleted: (result?: any) => void;

  constructor(jobId: string) {
    this.jobId = jobId;
    this.dataController = new DataController();
    this.numMapCompleted = 0;
    this.callbackWhenCompleted = () => {}; // default: do nothing
  }

  getJobId(): string {
    return this.jobId;
  }

  getMapper(): AbstractMapper {
    return this.mapper;
  }

  getReducer(): AbstractReducer {
    return this.reducer;
  }

  setMapper(mapper: AbstractMapper): void {
    this.mapper = mapper;
  }

  setReducer(reducer: AbstractReducer): void {
    this.reducer = reducer;
  }

  getInputData(): AbstractInputData {
    return this.dataController.getInputData();
  }

  setInputData(inputData: AbstractInputData) {
    this.dataController.setInputData(inputData);
  }

  getNextTask(): Task | null {
    let task: Task = null;
    if (!this.hasMapCompleted()) {
      const nextMapperInputData = this.dataController.getNextMapperInputData();
      if (nextMapperInputData) {
        task = new Task();
        task.setMetaInfo({
          jobId: this.jobId,
          phase: 'map'
        });
        task.setTaskInputData(nextMapperInputData);
        task.setMethod(() => {
          task.result = [];
          this.mapper.map(
            nextMapperInputData,
            (key, value) => {
              const element = {
                'key': key,
                'value': value
              };
              task.result.push(element);
            }
          );
        });
      }
    } else {
      const nextReducerInputData = this.dataController.getNextReducerInputData();
      if (nextReducerInputData) {
        task = new Task();
        task.setMetaInfo({
          jobId: this.jobId,
          phase: 'reduce'
        });
        task.setTaskInputData(nextReducerInputData);
        task.setMethod(() => {
          task.result = [];
          this.reducer.reduce(
            nextReducerInputData,
            (key, value) => {
              const element = {
                'key': key,
                'value': value
              };
              task.result.push(element);
            }
          );
        });
      }
    }
    return task;
  }

  hasMapCompleted(): boolean {
    const numMapTaskToDistribute = this.getInputData().getInputDataList().length;
    if (this.numMapCompleted < numMapTaskToDistribute) { return false; }
    if (this.numMapCompleted === numMapTaskToDistribute) { return true; }
    throw new MadoopError('too many map results.');
  }

  completeTask(task: Task): void {
    if (task.getMetaInfo().phase === 'map') {
      task.result.forEach(element => {
        this.dataController.addMapperResultPair(element.key, element.value);
      });
      this.dataController.finishAddingMapperResultPairs();
      this.numMapCompleted++;
    } else if (task.getMetaInfo().phase === 'reduce') {
      task.result.forEach(element => {
        this.dataController.addReducerResultPair(element.key, element.value);
      });
      if (!this.dataController.hasNextReducerInputData()) {
        this.callbackWhenCompleted(this.getResult());
      }
    }
  }

  getResult(): any {
    return this.dataController.getReducerResultPairs();
  }

  setCallbackWhenCompleted(callback: (result?: any) => void): void {
    this.callbackWhenCompleted = callback;
  }

}
