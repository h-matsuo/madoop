// Temporal implementation. Stub.

const db = [null];

const database = {

  addTask: (map, reduce, data) => {
    const task = {};
    task.status = 'uncompleted';
    task.map    = map;
    task.reduce = reduce;
    task.data   = data;
    const taskId = db.push(task) - 1;
    task.taskId = taskId;
  },

  addResult: function (taskId, result) {
    const task = this.getTask(taskId)
    task.result = result;
    task.status = 'completed';
  },

  getTask: (taskId) => {
    return db[taskId];
  },

  getTaskList: () => {
    return db;
  }

};

module.exports = database;
