import Madoop from './server/Madoop';
import Job from './server/Job';
import Task from './server/Task';
import AbstractInputData from './server/AbstractInputData';
import AbstractMapper from './server/AbstractMapper';
import AbstractReducer from './server/AbstractReducer';
import WasmMapper from './server/WasmMapper';
import WasmReducer from './server/WasmReducer';
import MadoopError from './server/MadoopError';
import WebServer from './server/webapi-extension/WebServer';
import WasmWebServer from './server/webapi-extension/WasmWebServer';

export {
  Madoop,
  Job,
  Task,
  AbstractInputData,
  AbstractMapper,
  AbstractReducer,
  WasmMapper,
  WasmReducer,
  MadoopError
};

export {
  WebServer,
  WasmWebServer
}

// export module web {
//   export var WebServer: WebServer = WebServer;
//   export var WasmWebServer: WebServer = WasmWebServer;
// }
