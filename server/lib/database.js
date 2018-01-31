// Temporal implementation. Stub.

const db = [null];

const database = {

  reserveTaskId: () => {
    const taskId = db.push(null) - 1;
    return taskId;
  },

  addTask: (task) => {
    task.status = 'uncompleted';
    const taskId = db.push(task) - 1;
    task.taskId = taskId;
  },

  addTask: (taskId, task) => {
    task.status = 'uncompleted';
    task.taskId = taskId;
    db[taskId] = task;
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
