import Madoop from './server/madoop/Madoop';
import Job from './server/madoop/Job';
import Task from './server/madoop/Task';
import AbstractInputData from './server/madoop/AbstractInputData';
import AbstractMapper from './server/madoop/AbstractMapper';
import AbstractReducer from './server/madoop/AbstractReducer';
import WasmMapper from './server/madoop/WasmMapper';
import WasmReducer from './server/madoop/WasmReducer';
import MadoopError from './server/madoop/MadoopError';
import WebServer from './server/madoop/webapi-extension/WebServer';
import WasmWebServer from './server/madoop/webapi-extension/WasmWebServer';

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
