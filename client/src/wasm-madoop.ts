declare var MADOOP_MODE_DEBUG: any;
declare var MADOOP_SERVER_ENDPOINT_URL: string;
declare var MADOOP_PING_INTERVAL: number;

// `Module` declared in js generated by Emscripten
declare var Module: any;

// Called by map/reduce in C++
let execEmit: Function = () => {
  throw new Error('[Madoop] function `execEmit` not defined.');
};

((): void => {

  const __SERVER_ENDPOINT_URL =
    typeof MADOOP_SERVER_ENDPOINT_URL === 'undefined' ?
      'http://localhost:3000/madoop' : MADOOP_SERVER_ENDPOINT_URL;

  const __PING_INTERVAL =
    typeof MADOOP_PING_INTERVAL === 'undefined' ?
      1000 : MADOOP_PING_INTERVAL;

  const printLog = (msg: string): void => {
    if (typeof MADOOP_MODE_DEBUG !== 'undefined') {
      console.log(`[${new Date().toISOString()}] [INFO] - ${msg}`);
    }
  };

  const ajaxGet = async (url: string): Promise<Response> => {
    printLog(`[GET] ${url}`);
    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      })
    });
  };

  const ajaxPostJson = async (url: string, data: Object): Promise<Response> => {
    printLog(`[POST] ${url}`);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'})
    });
  };

  const sleep = async (msec: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, msec);
    });
  };

  const applyScript = (script: string): void => {
    const element = document.createElement('script');
    element.text = script;
    document.head.appendChild(element).parentNode.removeChild(element);
  };

  const execFuncs = new Map<string, Function>();
  const getExecFunc = async (metaInfo: { jobId: string, phase: string }): Promise<Function> => {
    const metaInfoString = JSON.stringify(metaInfo);
    if (execFuncs.has(metaInfoString)) {
      return execFuncs.get(metaInfoString);
    }
    const wasmData: {
      wasmJs: string,
      wasmBinary: {type: string, data: Array<number>}
    } = await ajaxGet(`${__SERVER_ENDPOINT_URL}/wasmData/${metaInfo.phase}`).then(res => res.json());
    applyScript(wasmData.wasmJs);
    let func;
    if (metaInfo.phase === 'map') {
      await new Promise<void>((resolve, reject) => {
        let module;
        const moduleArgs = {
          'wasmBinary': new Uint8Array(wasmData.wasmBinary.data),
          'onRuntimeInitialized': () => {
            func = module.cwrap('map', null, ['string']);
            resolve();
          }
        };
        module = Module(moduleArgs);
      });
    } else if (metaInfo.phase === 'reduce') {
      await new Promise<void>((resolve, reject) => {
        let module;
        const moduleArgs = {
          'wasmBinary': new Uint8Array(wasmData.wasmBinary.data),
          'onRuntimeInitialized': () => {
            func = module.cwrap('reduce', null, ['string', 'string']);
            resolve();
          }
        };
        module = Module(moduleArgs);
      });
    } else {
      throw new Error(`[Madoop] invalid task phase provided: ${metaInfo.phase}`);
    }
    execFuncs.set(metaInfoString, func);
    return func;
  };


  const main = async (): Promise<void> => {
    while (true) {
      const nextTask: {
        metaInfo: { jobId: string, phase: string },
        inputData: any
      } = await ajaxGet(`${__SERVER_ENDPOINT_URL}/tasks/next`).then(res => res.json());
      if (nextTask.metaInfo === null) {
        await sleep(__PING_INTERVAL);
        continue;
      }
      const func = await getExecFunc(nextTask.metaInfo);
      const result = [];
      execEmit = (key, value) => { // called by map/reduce in C++
        const element = {
          'key': key,
          'value': value
        };
        result.push(element);
      };
      if (nextTask.metaInfo.phase === 'map') {
        func(nextTask.inputData); // call above `execEmit` inside
      } else if (nextTask.metaInfo.phase === 'reduce') {
        const inputDataObject: { key: any, values: any[] }[] = JSON.parse(nextTask.inputData);
        inputDataObject.forEach(element => {
          func(element.key, element.values.toString()); // call above `execEmit` inside
        });
      } else {
        throw new Error(`[Madoop] invalid task id provided: ${nextTask.metaInfo.phase}`);
      }
      const jsonData = {
        metaInfo: JSON.stringify(nextTask.metaInfo),
        result: JSON.stringify(result)
      };
      await ajaxPostJson(`${__SERVER_ENDPOINT_URL}/tasks/result`, jsonData);
    }
  };
  main();

})();
