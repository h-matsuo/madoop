// Dependent modules
const express    = require('express');
const app        = express();
const cors       = require('cors');
const bodyParser = require('body-parser');

// Constants
const ROUTE = process.env.MBBVC_ROUTE || '/mbbvc';
const PORT  = process.env.MBBVC_PORT  || 3000;

// Create router defined in 'express' module
const router = express.Router();

let task = {};

router.get('/tasks/todo', (req, res) => {
  console.log('[GET] /tasks/todo');
  res.json({
    task: '/tasks/1/map',
    data: '/tasks/1/data/1'
  });
});

router.get('/tasks/:taskid/map', (req, res) => {
  console.log(`[GET] /tasks/${req.param.taskid}/map`);
  res.send(task.map);
});

router.get('/tasks/:taskId/data/:dataId', (req, res) => {
  console.log(`[GET] /tasks/${req.param.taskId}/data/${req.param.dataId}`);
    res.send(task.data);
});

router.post('/tasks/register', (req, res) => {
  console.log('[POST] /tasks/register');
  task.map = `
  function map(data) {
    var result = null;
    ${req.body.map}
    return result;
  }
  `;
  task.data = req.body.data;
  res.send('Your task has been successfully registered.');
});


app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(ROUTE, router);
app.use(ROUTE, express.static('public'));
app.listen(PORT);
console.log(`listen on port ${PORT}`);
