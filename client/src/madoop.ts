declare var MADOOP_MODE_DEBUG: any;
declare var MADOOP_SERVER_URL: any;

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

  const execFuncs = new Map<string, (inputData: any, emitFunc: (key, value) => void) => void>();
  const getExecFunc = async (metaInfo: { jobId: string, phase: string }): Promise<(inputData: any, emitFunc: (key, value) => void) => void> => {
    const metaInfoString = JSON.stringify(metaInfo);
    if (execFuncs.has(metaInfoString)) {
      return execFuncs.get(metaInfoString);
    }
    const funcString = await ajaxGet(`${ROOT}/funcString/${metaInfo.phase}`).then(res => res.text());
    let execFuncString = '';
    if (metaInfo.phase === 'map') {
      execFuncString = 'map(inputData, emitFunc);';
    } else if (metaInfo.phase === 'reduce') {
      execFuncString = 'reduce(inputData, emitFunc);';
    } else {
      throw new Error(`[Madoop] invalid task phase provided: ${metaInfo.phase}`);
    }
    const func = new Function('inputData', 'emitFunc', `function ${funcString} ${execFuncString}`);
    execFuncs.set(metaInfoString, <any>func);
    return <any>func;
  };


  const main = async (): Promise<void> => {
    while (true) {
      const nextTask: {
        metaInfo: { jobId: string, phase: string },
        inputData: any
      } = await ajaxGet(`${ROOT}/tasks/next`).then(res => res.json());
      if (nextTask.metaInfo === null) {
        await sleep(1000);
        continue;
      }
      let execFuncString = '';
      if (nextTask.metaInfo.phase === 'map') {
      } else if (nextTask.metaInfo.phase === 'reduce') {
        const inputDataObject = JSON.parse(nextTask.inputData);
        nextTask.inputData = convertObjectToMap(inputDataObject);
      } else {
        throw new Error(`[Madoop] invalid task phase provided: ${nextTask.metaInfo.phase}`);
      }
      const func = await getExecFunc(nextTask.metaInfo);
      const result = [];
      func(nextTask.inputData, (key, value) => {
        const element = {
          'key': key,
          'value': value
        };
        result.push(element);
      });
      const jsonData = {
        metaInfo: JSON.stringify(nextTask.metaInfo),
        result: JSON.stringify(result)
      };
      await ajaxPostJson(`${ROOT}/tasks/result`, jsonData);
    }
  };
  main();

})();
