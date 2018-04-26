import * as bodyParser from 'body-parser';
import * as cors from 'cors'; // Cross-Origin Resource Sharing
import * as express from 'express';
import * as log4js from 'log4js';

// import DataBase from '../../lib/DataBase';
import Job from '../../lib/Job';
import Task from '../../lib/Task';

declare const ajaxPostJson: (url: string, jsonData: Object) => Promise<string>;

const app = express();
const router = express.Router();
// const db = new DataBase();
const logger = log4js.getLogger();
logger.level = 'debug';

const DOMAIN = process.env.MADOOP_DOMAIN || 'localhost';
const PORT   = process.env.MADOOP_PORT   || 3000;
const ROOT   = process.env.MADOOP_ROOT   || '/madoop';

const printLog = (msg: string): void => {
  logger.info(msg);
}

const convertMapToObject = (map: Map<any, any[]>): { key: any, values: any[] }[] => {
  const result: { key: any, values: any[] }[] = [];
  map.forEach((values, key) => {
    const element = {
      key: key,
      values: values
    };
    result.push(element);
  });
  return result;
};


///// Job Settings /////////////////////////////////////////////////////////////
import * as fs from 'fs';
import InputData from '../../lib/InputData';
import MyMapper from '../../rain/MyMapper';
import MyReducer from '../../rain/MyReducer';
import MadoopError from '../../lib/MadoopError';
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
////////////////////////////////////////////////////////////////////////////////


router.get('/tasks', (req, res): void => {
  printLog(`[GET] /tasks - from ${req.hostname} (${req.ip})`);
  res.sendStatus(500);
});

router.get('/tasks/next', (req, res): void => {
  printLog(`[GET] /tasks/next - from ${req.hostname} (${req.ip})`);
  let taskInfo = {
    taskId: <string> null,
    inputData: <any> null,
    funcString: <string> null
  };
  const task = job.getNextTask();
  if (!task) { res.send(taskInfo); return; }

  taskInfo.taskId = task.getTaskId();
  taskInfo.inputData = task.getTaskInputData();
  if (taskInfo.taskId === 'map') {
    taskInfo.funcString = job.getMapper().map.toString();
  } else if (taskInfo.taskId === 'reduce') {
    taskInfo.funcString = job.getReducer().reduce.toString();
    const inputDataObject = convertMapToObject(taskInfo.inputData);
    taskInfo.inputData = JSON.stringify(inputDataObject);
  } else {
    throw new MadoopError(`unknown task id: ${taskInfo.taskId}`);
  }
  res.send(taskInfo);
});

router.post('/tasks/result', (req, res): void => {
  printLog(`[POST] /tasks/result - from ${req.hostname} (${req.ip})`);
  const task = new Task();
  task.setTaskId(req.body.taskId);
  task.setResult(JSON.parse(req.body.result));
  job.completeTask(task);
  res.sendStatus(201);
});


// Settings for CORS: Cross-Origin Resource Sharing
app.use(cors());

// Settings for parsing JSON as request body
app.use(bodyParser.urlencoded({
  limit: '100mb', // to avoid `PayloadTooLargeError`
  extended: true
}));
app.use(bodyParser.json());

app.use(ROOT, router);
app.use(ROOT, express.static('public'));
app.listen(PORT);
printLog(`listen on port ${PORT}`);
