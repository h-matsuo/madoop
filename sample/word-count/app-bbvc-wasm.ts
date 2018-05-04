import {Job, WasmMapper, WasmReducer, WasmWebServer} from '../../';
import MyInputData from './MyInputData';

import * as fs from 'fs';

const job = new Job('word-count');
const inputData = new MyInputData();
const mapper = new WasmMapper();
const reducer = new WasmReducer();
const server = new WasmWebServer();

const wasmJsMap = fs.readFileSync('./map.js', 'utf8');
const wasmBinaryMap = fs.readFileSync('./map.wasm');
mapper.setWasmJs(wasmJsMap);
mapper.setWasmBinary(wasmBinaryMap);

const wasmJsReducer = fs.readFileSync('./reduce.js', 'utf8');
const wasmBinaryReducer = fs.readFileSync('./reduce.wasm');
reducer.setWasmJs(wasmJsReducer);
reducer.setWasmBinary(wasmBinaryReducer);

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setCallbackWhenCompleted(result => {
  console.log(result);
  process.exit(0);
});
server.setJob(job);
server.setRoot('/madoop/wasm');
server.run();
