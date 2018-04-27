import Job from '../../madoop/Job';
import MyInputData from './MyInputData';
import MyMapper from './MyMapper';
import MyReducer from './MyReducer';

const job = new Job('word-count');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
while (true) {
  const task = job.getNextTask();
  if (!task) { break; }
  task.exec();
  job.completeTask(task);
}
console.log(job.getResult());
