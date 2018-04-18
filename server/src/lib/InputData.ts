import MadoopError from './MadoopError';

export default
abstract class InputData {

  protected dataList: any[];

  constructor(dataList: any[] = []) {
    this.dataList = dataList;
  }

  getInputData(id: number): any {
    if (!this.dataList[id]) {
      throw new MadoopError(`data id ${id} is not registered`);
    }
    return this.dataList[id];
  }

  getInputDataList(): any[] {
    return this.dataList;
  }

  addInputData(data: any, id?: number): number {
    if (id) {
      if (this.dataList[id]) {
        throw new MadoopError(`data id ${id} is already registered`);
      }
      this.dataList[id] = data;
    } else {
      id = this.dataList.push(data) - 1;
    }
    return id;
  }

}
