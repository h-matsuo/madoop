// import InputData from './InputData';

export default
class Task {

  private method: Function;
  public result: any;
  private taskId: string;
  private taskInputData: any;

  getMethod(): Function {
    return this.method;
  }

  getResult(): any {
    return this.result;
  }

  getTaskId(): string {
    return this.taskId;
  }

  getTaskInputData(): any {
    return this.taskInputData;
  }

  setMethod(method: Function): void {
    this.method = method;
  }

  setResult(result: any): void {
    this.result = result;
  }

  setTaskId(taskId: string): void {
    this.taskId = taskId;
  }

  setTaskInputData(taskInputData: any): void {
    this.taskInputData = taskInputData;
  }

  exec(): void {
    this.method();
  }

}
