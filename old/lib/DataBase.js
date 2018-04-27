// Temporal implementation. Stub.

export default class DataBase {

  constructor() {
    this.db = [null];
  }

  reserveTaskId() {
    const taskId = this.db.push(null) - 1;
    return taskId;
  }

  addTask(task) {
    task.status = 'uncompleted';
    const taskId = this.db.push(task) - 1;
    task.taskId = taskId;
  }

  addTask(taskId, task) {
    task.status = 'uncompleted';
    task.taskId = taskId;
    this.db[taskId] = task;
  }

  addResult(taskId, result) {
    const task = this.getTask(taskId)
    task.result = result;
    task.status = 'completed';
  }

  getTasl(taskId) {
    return this.db[taskId];
  }

  getTaskList() {
    return this.db;
  }

};
