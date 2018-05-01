import Job from '../../madoop/Job';
import WasmWebServer from '../../madoop/webapi-extension/WasmWebServer';
import MyInputData from './MyInputData';
import WasmMapper from '../../madoop/WasmMapper';
import MyReducer from './MyReducer';

import * as fs from 'fs';

const job = new Job('rain');
const inputData = new MyInputData();
const mapper = new WasmMapper();
const reducer = new MyReducer();
const server = new WasmWebServer();

const wasmJs = fs.readFileSync('./map.js', 'utf8');
const wasmBinary = new Uint8Array(fs.readFileSync('./map.wasm'));
mapper.setWasmJs(wasmJs);
mapper.setWasmBinary(wasmBinary);

job.setInputData(inputData);
job.setMapper(mapper);
job.setReducer(reducer);
job.setCallbackWhenCompleted(result => {
  console.log(result);
  process.exit(0);
});
server.setJob(job);
server.run();
