import * as express    from 'express';
import * as cors       from 'cors'; // Cross-Origin Resource Sharing
import * as bodyParser from 'body-parser';

// import DataBase from '../../lib/DataBase';
import Job from '../../lib/Job';
import MyInputData from '../../rain/MyInputData';
import MyMapper from '../../rain/MyMapper';
import MyReducer from '../../rain/MyReducer';

const app = express();
const router = express.Router();
// const db = new DataBase();

const DOMAIN = process.env.MADOOP_DOMAIN || 'localhost';
const PORT   = process.env.MADOOP_PORT   || 3000;
const ROOT   = process.env.MADOOP_ROOT   || '/madoop';

const printInfo = (msg: any): void => {
  console.log(msg);
}


const job = new Job('rain');
const inputData = new MyInputData();
const mapper = new MyMapper();
const reducer = new MyReducer();
job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);


router.get('/tasks', (req, res): void => {
  printInfo('[GET] /tasks');
  res.sendStatus(500);
});

router.get('/tasks/next', (req, res): void => {
  let taskInfo = {
    task: null,
    data: null
  };
  const task = job.getNextTask();
  if (!task) return null; // TODO
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
