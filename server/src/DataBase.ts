import Job from './Job';
import MadoopError from './MadoopError';

class DataBase {

  private jobs: Job[];

  constructor() {
    this.jobs = [null];
  }

  getJob(id: number): Job {
    return this.jobs[id];
  }

  addJob(job: Job, id?: number): number {
    if (id) {
      if (this.jobs[id]) {
        throw new MadoopError(`job id ${id} is already registered`);
      }
      this.jobs[id] = job;
    } else {
      id = this.jobs.push(job) - 1;
    }
    return id;
  }


}

export default DataBase;
