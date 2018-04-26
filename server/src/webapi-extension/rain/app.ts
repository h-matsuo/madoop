import * as fs from 'fs';

import Job from '../../lib/Job';
import Server from '../Server';
import InputData from '../../lib/InputData';
import MyMapper from '../../rain/MyMapper';
import MyReducer from '../../rain/MyReducer';

class MyInputData extends InputData {
  constructor() {
    super();
    const rawData = fs.readFileSync('../../../../data/data-all.csv', 'utf8');
    const data = rawData.split('\n');
    data.shift();
    const length = data.length;
    const step = 100;
    for (let i = 0; i < length % step; ++i) {
      const begin = step * i;
      const end = step * (i + 1);
      this.addInputData(data.slice(begin, end));
    }
    this.addInputData(data.slice(step * (length % step)));
  }
}

const job = new Job('rain');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);

const server = new Server(job);
server.run();
console.log(server.getResult());
