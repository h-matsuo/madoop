import DataController from './DataController';
import InputData from './InputData';
import Mapper from './Mapper';
import Reducer from './Reducer';
import Task from './Task';

export default
class Job {

  private dataController: DataController;
  private jobId: string;
  private mapper: Mapper;
  private reducer: Reducer;

  constructor(jobId: string) {
    this.jobId = jobId;
  }

  getJobId(): string {
    return this.jobId;
  }

  getMapper(): Mapper {
    return this.mapper;
  }

  getReducer(): Reducer {
    return this.reducer;
  }

  setMapper(mapper: Mapper): void {
    this.mapper = mapper;
  }

  setReducer(reducer: Reducer): void {
    this.reducer = reducer;
  }

  getInputData(): InputData {
    return this.dataController.getInputData();
  }

  setInputData(inputData: InputData) {
    this.dataController.setInputData(inputData);
  }

  getNextTask(): Task {
    // TODO
  }

  completeTask(task: Task): void {
    // TODO
  }

  getResult(): any {
    // TODO
  }

}
