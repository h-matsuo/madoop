(function () {

  var ROOT = '//localhost:3000/madoop';

  var ajaxGet = function (url, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState !== 4 || req.status !== 200) return;
      if (typeof callback !== 'undefined') { callback(req.responseText); }
    };
    req.open('GET', url, true);
    req.send(null);
  };

  var ajaxGetScript = function (url, callback) {
    ajaxGet(url, function (data) {
      var script = document.createElement('script');
      script.text = data;
      document.head.appendChild(script).parentNode.removeChild(script);
      if (typeof callback !== 'undefined') { callback(); }
    });
  };

  var ajaxPost = function (url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState !== 4 || req.status !== 200) return;
      if (typeof callback !== 'undefined') { callback(req.responseText); }
    };
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type',
  'application/x-www-form-urlencoded;charset=UTF-8');
    req.send(data);
  };

  var ajaxPostJson = function (url, jsonData, callback) {
    var data = '';
    Object.keys(jsonData).forEach(function(key) {
      var val = this[key]; // this は jsonData
      data += `${key}=${val}&`;
    }, jsonData);
    ajaxPost(url, data, function () {
      if (typeof callback !== 'undefined') { callback(); }
    });
  };

  var printDebugInfoToConsole = function (info) {
    if (typeof MADOOP_MODE_DEBUG !== 'undefined') {
      console.log(info);
    }
  };


  ajaxGet(`${ROOT}/tasks/todo`, function (data) {
    var taskInfo = JSON.parse(data);
    if (taskInfo.task === null) { return; }
    ajaxGetScript(`${ROOT}${taskInfo.task}`, function () {
      ajaxGet(`${ROOT}${taskInfo.data}`, function (data) {
        fetchMap().then(() => {
          var result = map(data);
          var postData = { result: result };
          ajaxPostJson(`${ROOT}${taskInfo.data}`, postData, function () {
            printDebugInfoToConsole(result);
          });
        });
      });
    });
  });


})();
