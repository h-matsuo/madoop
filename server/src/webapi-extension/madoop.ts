declare var MADOOP_MODE_DEBUG: any;
((): void => {

  const ROOT = '//localhost:3000/madoop';

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


})();
