export default class DataBase {

  constructor() {
    this.taskId = null;
    this.map = {
      language: null,
      original: {
        src : null,
        data: null
      },
      dist: {
        js  : null,
        wasm: null,
        data: [null]
      },
      result: [null]
    };
    this.reduce = {
      language: null,
      original: {
        src : null,
        data: null
      },
      dist: {
        js  : null,
        wasm: null,
        data: [null]
      },
      result: [null]
    };
    this.result = null;
  }

  getTaskId() {
    return this.taskId;
  }



};
