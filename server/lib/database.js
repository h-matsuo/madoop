// Temporal implementation. Stub.

let db = [null];

const database = {

  addTask: (map, reduce, data) => {
    let element = {};
    element.map    = map;
    element.reduce = reduce;
    element.data   = data;
    let taskId = db.push(element) - 1;
    element.taskId = taskId;
  },

  getTask: (taskId) => {
    return db[taskId];
  }

};

module.exports = database;
