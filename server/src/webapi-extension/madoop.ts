declare var MADOOP_MODE_DEBUG: any;
((): void => {

  const ROOT = '//localhost:3000/madoop';

  const ajaxGet = (
    url: string,
    callback: (responseText: string) => any
  ): void => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function(): void {
      if (req.readyState !== 4) { return; }
      if (req.status !== 200) {
        throw new Error('[Madoop] cannot communicate with server.');
      }
      if (typeof callback !== 'undefined') { callback(req.responseText); }
    }
    req.open('GET', url, true); // true: ensure async request
    req.send();
  };

  const ajaxGetScript = (
    url: string,
    callback: Function
  ): void => {
    ajaxGet(url, data => {
      const script = document.createElement('script');
      script.text = data;
      document.head.appendChild(script).parentNode.removeChild(script);
      if (typeof callback !== 'undefined') { callback(); }
    });
  };

  const ajaxPost = (
    url: string,
    data: any,
    callback: (responseText: string) => any
  ): void => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function(): void {
      if (req.readyState !== 4) { return; }
      if (req.status !== 200) {
        throw new Error('[Madoop] cannot communicate with server.');
      }
      if (typeof callback !== 'undefined') { callback(req.responseText); }
    }
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    req.send(data);
  };

  const ajaxPostJson = (
    url: string,
    jsonData: Object,
    callback: Function
  ): void => {
    let data = '';
    Object.keys(jsonData).forEach(function (key) {
      const val = this[key]; // `this` === `jsonData`
      data += `${key}=${val}&`;
    }, jsonData);
    ajaxPost(url, data, function () {
      if (typeof callback !== 'undefined') { callback(); }
    });
  };

  const printDebugInfo = (info: any) => {
    if (typeof MADOOP_MODE_DEBUG !== 'undefined') {
      console.log(info);
    }
  };


})();
