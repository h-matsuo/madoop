import {Madoop, Job} from '../../';
import MyInputData from './MyInputData';
import MyMapper from './MyMapper';
import MyReducer from './MyReducer';
import MyShuffler from './MyShuffler';

const job = new Job('word-count');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
const shuffler = new MyShuffler();
const madoop = new Madoop();

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setShuffler(shuffler);
job.setCallbackWhenCompleted(result => {
  console.log(result);
});
madoop.setJob(job);
madoop.run();
