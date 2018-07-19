import {Job, WebServer} from '../../';
import MyInputData from './MyInputData';
import MyMapper from './MyMapper';
import MyReducer from './MyReducer';
import MyShuffler from './MyShuffler';

const job = new Job('rain');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
const shuffler = new MyShuffler();
const server = new WebServer();

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setShuffler(shuffler);
job.setCallbackWhenCompleted(result => {
  console.log(result);
  process.exit(0);
});
server.setJob(job);
server.setRoot('/madoop/js');
server.run();
