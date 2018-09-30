import {Job, WasmMapper, WasmReducer, WasmWebServer} from '../../';
import MyInputData from './MyInputData';
import MyShuffler from './MyShuffler';

import * as fs from 'fs';

const job = new Job('preprocess');
const inputData = new MyInputData();
const mapper = new WasmMapper();
const reducer = new WasmReducer();
const shuffler = new MyShuffler();
const server = new WasmWebServer();

const wasmJsMap = fs.readFileSync('./map.js', 'utf8');
const wasmBinaryMap = fs.readFileSync('./map.wasm');
const wasmPreprocessJsMap = fs.readFileSync('./wasm_map_preprocess.js', 'utf8');
mapper.setWasmJs(wasmJsMap);
mapper.setWasmBinary(wasmBinaryMap);
mapper.setWasmPreprocessJs(wasmPreprocessJsMap);

const wasmJsReducer = fs.readFileSync('./reduce.js', 'utf8');
const wasmBinaryReducer = fs.readFileSync('./reduce.wasm');
const wasmPreprocessJsReducer = fs.readFileSync('./wasm_reduce_preprocess.js', 'utf8');
reducer.setWasmJs(wasmJsReducer);
reducer.setWasmBinary(wasmBinaryReducer);
reducer.setWasmPreprocessJs(wasmPreprocessJsReducer);

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setShuffler(shuffler);
job.setCallbackWhenCompleted(result => {
  console.log(result);
  process.exit(0);
});
server.setJob(job);
server.setRoot('/madoop/wasm');
server.run();
