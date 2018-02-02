// Dependent Node.js modules
const fs       = require('fs');
const execSync = require('child_process').execSync;

// Dependent npm modules
const express    = require('express');
const app        = express();
const cors       = require('cors');
const bodyParser = require('body-parser');

// Utilities
const database = require('./lib/database.js');

// Constants
const DOMAIN = process.env.MADOOP_DOMAIN || 'localhost';
const PORT   = process.env.MADOOP_PORT   || 3000;
const ROOT   = process.env.MADOOP_ROOT   || '/madoop';

// Create router defined in 'express' module
const router = express.Router();

router.get('/tasks', (req, res) => {
  console.log('[GET] /tasks');
  res.json(database.getTaskList());
});

router.get('/tasks/todo', (req, res) => {
  console.log('[GET] /tasks/todo');
  const taskList = database.getTaskList();
  const todo = {
    task: null,
    data: null
  };
  for (let index = 1; index < taskList.length; index++) {
    const task = taskList[index];
    if (task.status === 'completed') { continue; }
    todo.task = `/tasks/${task.taskId}/map/js`;
    todo.data = `/tasks/${task.taskId}/map/data/1`;
    break;
  }
  res.json(todo);
});

router.get('/tasks/:taskId/map/js', (req, res) => {
  const taskId = req.params.taskId;
  console.log(`[GET] /tasks/${taskId}/map/js`);
  res.send(database.getTask(taskId).map.js);
});

router.get('/tasks/:taskId/map/wasm', (req, res) => {
  const taskId = req.params.taskId;
  console.log(`[GET] /tasks/${taskId}/map/wasm`);
  res.send(database.getTask(taskId).map.wasm);
});

router.get('/tasks/:taskId/map/data/:dataId', (req, res) => {
  const taskId = req.params.taskId;
  const dataId = req.params.dataId;
  console.log(`[GET] /tasks/${taskId}/map/data/${dataId}`);
  res.send(database.getTask(taskId).data);
});

router.post('/tasks/:taskId/map/data/:dataId', (req, res) => {
  const taskId = req.params.taskId;
  const dataId = req.params.dataId;
  console.log(`[POST] /tasks/${taskId}/map/data/${dataId}`);
  res.send(database.addResult(taskId, req.body.result));
});

router.post('/tasks/register', (req, res) => {
  console.log('[POST] /tasks/register');
  const task = {
    'language': req.body.language,
    'map'     : {
      'src' : req.body['map-src'],
      'js'  : null,
      'wasm': null
    },
    'reduce'  : null,
    'data'    : req.body.data
  };
  const taskId = database.reserveTaskId();
  if (task.language === 'js') {
    task.map.js = `
    let execMap;
    const fetchMap = () => {
      return new Promise(resolve => {
        execMap = (data, emit) => {
          ${task.map.src}
          map(data, emit);
        };
        resolve();
      });
    };`;
  }
  if (task.language === 'cpp') {
    fs.writeFileSync('./workdir/map.cpp', task.map.src);
    execSync('./workdir/docker-run.sh c++ map');
    let mapJs = fs.readFileSync('./workdir/map.js');
    mapJs += `
    let execMap;
    let module;
    const fetchMap = () => {
      return new Promise(resolve => {
        fetch('//${DOMAIN}:${PORT}${ROOT}/tasks/${taskId}/map/wasm')
          .then(response => response.arrayBuffer())
          .then(buffer => new Uint8Array(buffer))
          .then(binary => {
            const moduleArgs = {
              'wasmBinary': binary,
              'onRuntimeInitialized': () => {
                const map = module.cwrap('map', 'string', ['string']);
                execMap = (data, emit) => {
                  map(data);
                };
                resolve();
              }
            };
            module = Module(moduleArgs);
          })
      });
    };`;
    task.map.js = mapJs;
    task.map.wasm = fs.readFileSync('./workdir/map.wasm');
  }
  database.addTask(taskId, task);
  res.send('Your task has been successfully registered.');
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
console.log(`listen on port ${PORT}`);
