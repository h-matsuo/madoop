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
    task.map.js = task.map.src;
  }
  if (task.language === 'cpp') {
    fs.writeFileSync('./tmp/map.cpp', task.map.src);
    execSync('./docker-run.sh c++ ./tmp/map');
    let mapJs     = fs.readFileSync('./tmp/map.js');
    mapJs += `
    var module;
    fetch('//${DOMAIN}:${PORT}${ROOT}/tasks/${taskId}/map/wasm')
      .then(response => response.arrayBuffer())
      .then(buffer => new Uint8Array(buffer))
      .then(binary => {
        var moduleArgs = {
          'wasmBinary': binary,
          'onRuntimeInitialized': function () {
            var map = module.cwrap('map', 'string', ['string']);
            var data = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
            var result = map(data);
            console.log(JSON.parse(result));
          }
        };
        module = Module(moduleArgs);
      })`;
    task.map.js = mapJs;
    task.map.wasm = fs.readFileSync('./tmp/map.wasm');
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
