declare var MADOOP_MODE_DEBUG: any;
declare var MADOOP_SERVER_URL: any;

declare var Module: any;
declare var execEmit: any;

((): void => {

  const ROOT =
    typeof MADOOP_SERVER_URL === 'undefined' ?
    'http://localhost:3000/madoop' :
    `${MADOOP_SERVER_URL}`;

  const printLog = (msg: string): void => {
    if (typeof MADOOP_MODE_DEBUG !== 'undefined') {
      console.log(`[${new Date().toISOString()}] [INFO] - ${msg}`);
    }
  };

  const ajaxGet = async (url: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.onreadystatechange = (): void => {
        if (req.readyState !== 4) { return; }
        if (req.status.toString().charAt(0) !== '2') {
          throw new Error('[Madoop] cannot communicate with server.');
        }
        printLog(`[GET] ${url}`);
        resolve(req.responseText);
      };
      req.open('GET', url, true); // true: ensure async request
      req.setRequestHeader('Pragma', 'no-cache'); // do not use cache
      req.setRequestHeader('Cache-Control', 'no-cache'); // do not use cache
      req.send();
    });
  };

  const ajaxPost = async (url: string, data: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.onreadystatechange = (): void => {
        if (req.readyState !== 4) { return; }
        if (req.status.toString().charAt(0) !== '2') {
          throw new Error('[Madoop] cannot communicate with server.');
        }
        printLog(`[POST] ${url}`);
        resolve(req.responseText);
      };
      req.open('POST', url, true);
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      req.send(data);
    });
  };

  const ajaxPostJson = async (url: string, jsonData: Object): Promise<string> => {
    let data = '';
    Object.keys(jsonData).forEach(function (key) {
      const val = this[key]; // `this` === `jsonData`
      data += `${key}=${val}&`;
    }, jsonData);
    const response = await ajaxPost(url, data);
    return response;
  };

  const sleep = async (msec: number = 1000) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, msec);
    });
  };

  const convertObjectToMap = (obj: { key: any, values: any[] }[]): Map<any, any[]> => {
    const result = new Map<any, any[]>();
    obj.forEach(element => {
      result.set(element.key, element.values);
    });
    return result;
  };

  const applyScript = (script: string): void => {
    const element = document.createElement('script');
    element.text = script;
    document.head.appendChild(element).parentNode.removeChild(element);
  };


  const main = async (): Promise<void> => {
    while (true) {
      const next = await ajaxGet(`${ROOT}/tasks/next`);
      const taskInfo: {
        taskId: string,
        inputData: any,
        funcString: string,
        wasmJs: string,
        wasmBinary: {type: string, data: Array<number>}
      } = JSON.parse(next);
      if (taskInfo.taskId === null) {
        await sleep(1000);
        continue;
      }
      let execFuncString = '';
      if (taskInfo.taskId === 'map') {
        // execFuncString = 'map(inputData, emitFunc);';
      } else if (taskInfo.taskId === 'reduce') {
        // execFuncString = 'reduce(inputData, emitFunc);';
        const inputDataObject = JSON.parse(taskInfo.inputData);
        taskInfo.inputData = convertObjectToMap(inputDataObject);
      } else {
        throw new Error(`[Madoop] invalid task id provided: ${taskInfo.taskId}`);
      }
      applyScript(taskInfo.wasmJs);
      const result = [];
      await new Promise<void>((resolve, reject) => {
        let module;
        const moduleArgs = {
          'wasmBinary': new Uint8Array(taskInfo.wasmBinary.data),
          'onRuntimeInitialized': () => {
            const map = module.cwrap('map', null, ['string']);
            execEmit = (key, value) => { // called by map in C++
              const element = {
                'key': key,
                'value': value
              };
              result.push(element);
            };
            map(taskInfo.inputData); // call above `execEmit` inside
            resolve();
          }
        };
        module = Module(moduleArgs);
      });
      const jsonData = {
        taskId: taskInfo.taskId,
        result: JSON.stringify(result)
      };
      await ajaxPostJson(`${ROOT}/tasks/result`, jsonData);
    }
  };
  main();

})();
