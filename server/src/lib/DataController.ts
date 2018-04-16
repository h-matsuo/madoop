import InputData from './InputData';

export default
class DataController {

  private inputData: InputData;
  private mapCompleted: boolean[];
  // private mapResultPairs: Map<any, any[]>;

  constructor(inputData: InputData = null) {
    if (inputData) {
      this.setInputData(inputData);
    }
  }

  getInputData(): InputData {
    return this.inputData;
  }

  setInputData(inputData: InputData): void {
    this.inputData = inputData;
    const dataLength = inputData.getInputDataList().length;
    this.mapCompleted = (new Array(dataLength)).fill(false);
  }

  getNextMapperInputDataId(): number {
    let id = -1;
    for (let i = 0; i < this.mapCompleted.length; ++i) {
      if (!this.mapCompleted[i]) {
        id = i;
        break;
      }
    }
    return id;
  }

  addMapperResult(): void {

  }

  addReducerResult(): void {

  }

}
