import * as fs from 'fs';

import Job from '../../lib/Job';
import Server from '../Server';
import MyInputData from '../../word-count/MyInputData';
import MyMapper from '../../word-count/MyMapper';
import MyReducer from '../../word-count/MyReducer';

const job = new Job('rain');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
const server = new Server();
job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setCallbackWhenCompleted(result => {
  console.log(result);
  process.exit(0);
});
server.setJob(job);
server.run();
