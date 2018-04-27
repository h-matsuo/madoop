import Job from '../../madoop/Job';
import WebServer from '../../madoop/webapi-extension/WebServer';
import MyInputData from './MyInputData';
import MyMapper from './MyMapper';
import MyReducer from './MyReducer';

const job = new Job('word-count');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
const server = new WebServer();

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setCallbackWhenCompleted(result => {
  console.log(result);
  process.exit(0);
});
server.setJob(job);
server.run();