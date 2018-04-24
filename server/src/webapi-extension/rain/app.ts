import * as bodyParser from 'body-parser';
import * as cors from 'cors'; // Cross-Origin Resource Sharing
import * as express from 'express';
import * as log4js from 'log4js';

// import DataBase from '../../lib/DataBase';
import Job from '../../lib/Job';

const app = express();
const router = express.Router();
// const db = new DataBase();
const logger = log4js.getLogger();
logger.level = 'debug';

const DOMAIN = process.env.MADOOP_DOMAIN || 'localhost';
const PORT   = process.env.MADOOP_PORT   || 3000;
const ROOT   = process.env.MADOOP_ROOT   || '/madoop';

const printInfo = (msg: any): void => {
  logger.info(msg);
}


///// Job Settings /////////////////////////////////////////////////////////////
import * as fs from 'fs';
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
////////////////////////////////////////////////////////////////////////////////


router.get('/tasks', (req, res): void => {
  printInfo('[GET] /tasks');
  res.sendStatus(500);
});

router.get('/tasks/next', (req, res): void => {
  printInfo('[GET] /tasks/next');
  let taskInfo = {
    taskId: <string> null,
    inputData: <any> null
  };
  const task = job.getNextTask();
  taskInfo.taskId = task.getTaskId();
  if (!task) { res.send(null); }
  res.send(task.);
});


// Settings for CORS: Cross-Origin Resource Sharing
app.use(cors());

// Settings for parsing JSON as request body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(ROOT, router);
app.use(ROOT, express.static('public'));
app.listen(PORT);
printInfo(`listen on port ${PORT}`);
