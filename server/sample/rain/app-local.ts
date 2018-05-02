import Madoop from '../../madoop/Madoop';
import Job from '../../madoop/Job';
import MyInputData from './MyInputData';
import MyMapper from './MyMapper';
import MyReducer from './MyReducer';

const job = new Job('rain');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
const madoop = new Madoop();

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setCallbackWhenCompleted(result => {
  console.log(result);
});
madoop.setJob(job);
madoop.run();
