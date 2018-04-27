import DataController from './DataController';
import AbstractInputData from './AbstractInputData';
import AbstractMapper from './AbstractMapper';
import AbstractReducer from './AbstractReducer';
import Task from './Task';

export default
class Job {

  private dataController: DataController;
  private jobId: string;
  private mapper: AbstractMapper;
  private reducer: AbstractReducer;
  private callbackWhenCompleted: (result?: any) => void;

  constructor(jobId: string) {
    this.jobId = jobId;
    this.dataController = new DataController();
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
    let task = new Task();
    const nextMapperInputData = this.dataController.getNextMapperInputData();
    if (nextMapperInputData) {
      task.setTaskId('map');
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
    } else {
      const nextReducerInputData = this.dataController.getNextReducerInputData();
      if (nextReducerInputData) {
        task.setTaskId('reduce');
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
      } else {
        task = null;
      }
    }
    return task;
  }

  completeTask(task: Task): void {
    if (task.getTaskId() === 'map') {
      task.result.forEach(element => {
        this.dataController.addMapperResultPair(element.key, element.value);
      });
    } else if (task.getTaskId() === 'reduce') {
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
