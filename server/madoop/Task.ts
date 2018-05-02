// import InputData from './InputData';

export default
class Task {

  private method: Function;
  public result: any;
  private taskInputData: any;
  private metaInfo: {
    jobId: string,
    phase: string
  };

  getMethod(): Function {
    return this.method;
  }

  getResult(): any {
    return this.result;
  }

  getMetaInfo(): { jobId: string, phase: string } {
    return this.metaInfo;
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

  setMetaInfo(metaInfo: { jobId: string, phase: string }): void {
    this.metaInfo = metaInfo;
  }

  setTaskInputData(taskInputData: any): void {
    this.taskInputData = taskInputData;
  }

  exec(): void {
    this.method();
  }

}
