// Dependent node modules
const express    = require('express');
const app        = express();
const cors       = require('cors');
const bodyParser = require('body-parser');

// Utilities
const database = require('./lib/database.js');

// Constants
const ROUTE = process.env.MBBVC_ROUTE || '/mbbvc';
const PORT  = process.env.MBBVC_PORT  || 3000;

// Create router defined in 'express' module
const router = express.Router();

router.get('/tasks/todo', (req, res) => {
  console.log('[GET] /tasks/todo');
  res.json({
    task: '/tasks/1/map',
    data: '/tasks/1/data/1'
  });
});

router.get('/tasks/:taskId/map', (req, res) => {
  const taskId = req.params.taskId;
  console.log(`[GET] /tasks/${taskId}/map`);
  res.send(database.getTask(taskId).map);
});

router.get('/tasks/:taskId/data/:dataId', (req, res) => {
  const taskId = req.params.taskId;
  const dataId = req.params.dataId;
  console.log(`[GET] /tasks/${taskId}/data/${dataId}`);
    res.send(database.getTask(taskId).data);
});

router.post('/tasks/register', (req, res) => {
  console.log('[POST] /tasks/register');
  const map = `
  function map(data) {
    var result = null;
    ${req.body.map}
    return result;
  }
  `;
  const data = req.body.data;
  database.addTask(map, null, data);
  res.send('Your task has been successfully registered.');
});


// Settings for CORS: Cross-Origin Resource Sharing
app.use(cors());

// Settings for parsing JSON as request body
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(ROUTE, router);
app.use(ROUTE, express.static('public'));
app.listen(PORT);
console.log(`listen on port ${PORT}`);
