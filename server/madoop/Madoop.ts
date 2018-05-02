import Job from './Job';

export default
class Madoop {

  private job: Job;

  constructor(job?: Job) {
    if (job) {
      this.job = job;
    }
  }

  setJob(job: Job): void {
    this.job = job;
  }

  run(): void {
    while (true) {
      const task = this.job.getNextTask();
      if (!task) { break; }
      task.exec();
      this.job.completeTask(task);
    }
  }

  getResult(): any {
    return this.job.getResult();
  }

}
