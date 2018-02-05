import Job from './Job';

class DataBase {

  private jobs: [Job];

  constructor() {
    //
  }

  getJob(id: number) {
    return this.jobs[id];
  }

  addJob(job: Job) {
    this.jobs.push(job);
  }


}

export default DataBase;
