// import Job from '../lib/Job';
import MyInputData from './MyInputData';
import MyMapper from './MyMapper';

// const job = new Job();
const inputData = new MyInputData();
const mapper = new MyMapper();

inputData.getInputDataList().forEach(inputData => {
  mapper.map(inputData, (key, value) => {
    console.log(key, value);
  })
});
