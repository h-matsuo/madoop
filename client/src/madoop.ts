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

  const ajaxGetScript = async (url: string): Promise<void> => {
    const response = await ajaxGet(url);
    const script = document.createElement('script');
    script.text = response;
    document.head.appendChild(script).parentNode.removeChild(script);
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


  const main = async (): Promise<void> => {
    while (true) {
      const next = await ajaxGet(`${ROOT}/tasks/next`);
      const task: {
        metaInfo: { jobId: string, phase: string },
        inputData: any,
        funcString: string
      } = JSON.parse(next);
      if (task.metaInfo === null) {
        await sleep(1000);
        continue;
      }
      let execFuncString = '';
      if (task.metaInfo.phase === 'map') {
        execFuncString = 'map(inputData, emitFunc);';
      } else if (task.metaInfo.phase === 'reduce') {
        execFuncString = 'reduce(inputData, emitFunc);';
        const inputDataObject = JSON.parse(task.inputData);
        task.inputData = convertObjectToMap(inputDataObject);
      } else {
        throw new Error(`[Madoop] invalid task phase provided: ${task.metaInfo.phase}`);
      }
      const func = new Function('inputData', 'emitFunc', `function ${task.funcString} ${execFuncString}`);
      const result = [];
      func(task.inputData, (key, value) => {
        const element = {
          'key': key,
          'value': value
        };
        result.push(element);
      });
      const jsonData = {
        metaInfo: JSON.stringify(task.metaInfo),
        result: JSON.stringify(result)
      };
      await ajaxPostJson(`${ROOT}/tasks/result`, jsonData);
    }
  };
  main();

})();
