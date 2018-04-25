declare var MADOOP_MODE_DEBUG: any;

// ((): void => {

  const ROOT = 'http://localhost:3000/madoop';

  const ajaxGet = async (url: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.onreadystatechange = function(): void {
        if (req.readyState !== 4) { return; }
        if (req.status.toString().charAt(0) !== '2') {
          throw new Error('[Madoop] cannot communicate with server.');
        }
        resolve(req.responseText);
      }
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
      req.onreadystatechange = function(): void {
        if (req.readyState !== 4) { return; }
        if (req.status.toString().charAt(0) !== '2') {
          throw new Error('[Madoop] cannot communicate with server.');
        }
        resolve(req.responseText);
      }
      req.open('POST', url, true);
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
      req.send();
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

  const printDebugInfo = (info: any) => {
    if (typeof MADOOP_MODE_DEBUG !== 'undefined') {
      console.log(info);
    }
  };


  const main = async (): Promise<void> => {

    let debug = 1;

    while (true) {
      const next = await ajaxGet(`${ROOT}/tasks/next`);
      const taskInfo: {
        taskId: string,
        inputData: any,
        funcString: string
      } = JSON.parse(next);
      if (taskInfo.taskId === null) { break; }
      const func = new Function('inputData', 'emitFunc', `function ${taskInfo.funcString} map(inputData, emitFunc);`);
      const result = [];
      func(taskInfo.inputData, (key, value) => {
        const element = {
          'key': key,
          'value': value
        };
        result.push(element);
      });

      console.log('****************************************\n'+`[ATTEMPT ${debug++}]\n`+result)
    }
    // await ajaxGetScript(`${ROOT}${taskInfo.task}`);
    // const inputData = await ajaxGet(`${ROOT}${taskInfo.data}`);


  };
  main();

// })();
