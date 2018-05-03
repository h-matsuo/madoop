import * as bodyParser from 'body-parser';
import * as cors from 'cors'; // Cross-Origin Resource Sharing
import * as express from 'express';
import * as http from 'http';
import * as log4js from 'log4js';

// import DataBase from '../lib/DataBase';
import Job from '../Job';
import Task from '../Task';
import MadoopError from '../MadoopError';

export default
class WebServer {

  private app: express.Express;
  private router: express.Router;
  private logger: log4js.Logger;
  private httpServer: http.Server;

  private job: Job;
  private port: string;
  private root: string;

  constructor(job?: Job) {
    this.app = express();
    this.router = express.Router();
    this.logger = log4js.getLogger();
    this.logger.level = 'debug';
    if (job) {
      this.job = job;
    }
    this.port = '3000';
    this.root = '/madoop';
  }

  private printLog(msg: string): void {
    this.logger.info(msg);
  }

  private convertMapToObject(map: Map<any, any[]>): { key: any, values: any[] }[] {
    const result: { key: any, values: any[] }[] = [];
    map.forEach((values, key) => {
      const element = {
        key: key,
        values: values
      };
      result.push(element);
    });
    return result;
  }

  setJob(job: Job): void {
    this.job = job;
  }

  setPort(port: string): void {
    this.port = port;
  }

  setRoot(root: string): void {
    this.root = root;
  }

  run(): http.Server {

    this.router.get('/tasks', (req, res): void => {
      this.printLog(`[GET] /tasks - from ${req.hostname} (${req.ip})`);
      res.sendStatus(500);
    });

    this.router.get('/funcString/map', (req, res): void => {
      this.printLog(`[GET] /funcString/map - from ${req.hostname} (${req.ip})`);
      res.send(this.job.getMapper().map.toString());
    });

    this.router.get('/funcString/reduce', (req, res): void => {
      this.printLog(`[GET] /funcString/reduce - from ${req.hostname} (${req.ip})`);
      res.send(this.job.getReducer().reduce.toString());
    });

    this.router.get('/tasks/next', (req, res): void => {
      this.printLog(`[GET] /tasks/next - from ${req.hostname} (${req.ip})`);
      let task = {
        metaInfo: <{ jobId: string, phase: string }> null,
        inputData: <any> null
      };
      const nextTask = this.job.getNextTask();
      if (!nextTask) { res.send(task); return; }

      task.metaInfo = nextTask.getMetaInfo();
      task.inputData = nextTask.getTaskInputData();
      if (task.metaInfo.phase === 'map') {
      } else if (task.metaInfo.phase === 'reduce') {
        const inputDataObject = this.convertMapToObject(task.inputData);
        task.inputData = JSON.stringify(inputDataObject);
      } else {
        throw new MadoopError(`unknown task phase: ${task.metaInfo.phase}`);
      }
      res.send(task);
    });

    this.router.post('/tasks/result', (req, res): void => {
      this.printLog(`[POST] /tasks/result - from ${req.hostname} (${req.ip})`);
      const task = new Task();
      task.setMetaInfo(JSON.parse(req.body.metaInfo));
      task.setResult(JSON.parse(req.body.result));
      this.job.completeTask(task);
      res.sendStatus(201);
    });

    // Settings for CORS: Cross-Origin Resource Sharing
    this.app.use(cors());

    // Settings for parsing JSON as request body
    this.app.use(bodyParser.urlencoded({
      limit: '100mb', // to avoid `PayloadTooLargeError`
      extended: true
    }));
    this.app.use(bodyParser.json({
      limit: '100mb' // to avoid status 413 (payload too large)
    }));

    this.app.use(this.root, this.router);
    // this.app.use(this.root, express.static('public'));
    this.httpServer = this.app.listen(this.port);
    this.printLog(`listen on \`<SERVER>:${this.port}${this.root}\`...`);

    return this.httpServer;

  }

  getResult(): any {
    return this.job.getResult();
  }

}
