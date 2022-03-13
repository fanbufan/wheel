var xhr = (function(){
  
  function _doAjax(opt){
    var o = window.XMLHttpRequest ? 
          new XMLHttpRequest :
          new ActiveXObject('Microsoft.XMLHTTP');
       
    if(!o){
      throw new Error('您的浏览器不支持异步发起HTTP请求');
    }
    
    var opt = opt || {},
        type = (opt.type || 'GET').toUpperCase(),
        async = '' + opt.async === 'false' ? false : true,
        dataType = opt.dataType || 'JSON',
        jsonp = opt.jsonp || 'cb',
        jsonpCallback = opt.jsonpCallback || 'jQuery' + randomNum() + '_' + new Date().getTime();
        url = opt.url,
        data = opt.data || null,
        timeout = opt.timeout || 30000,
        error = opt.error || function(){},
        success = opt.success || function(){},
        complete = opt.complete || function(){},
        t = null;

    if(!url){
      throw new Error('您没有填写URL');
    }

    if(dataType.toUpperCase() === 'JSONP' && type !== 'GET'){
      throw new Error('如果dataType为JSONP，type请您设置GET或不设置');
    }

    if(dataType.toUpperCase() === 'JSONP'){
      var oScript = document.createElement('script');
      oScript.src = url.indexOf('?') === -1  
                        ? url + '?' + jsonp + '=' + jsonpCallback
                        : url + '&' + jsonp + '=' + jsonpCallback;
      document.body.appendChild(oScript);
      document.body.removeChild(oScript);
      window[jsonpCallback] = function(data){
        success(data);
      };
      return;
    }

    o.onreadystatechange = function(){
      if(o.readyState === 4){
        if((o.status >= 200 && o.status < 300) || o.status === 304){
          switch(dataType.toUpperCase()){
            case 'JSON':
              success(JSON.parse(o.responseText)); 
              break;
            case 'TEXT':
              success(o.responseText);
              break;
            case 'XML':
              success(o.responseXML);
              break;
            default:
              success(JSON.parse(o.responseText)); 
          } 
        }else{
          error();
        }
        complete();
        clearTimeout(t);
        t = null;
        o = null;
      }
    }

    o.open(type, url, async);
    type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    o.send(type === 'GET' ? null : formatDatas(data));

    t = setTimeout(function(){
      throw new Error('本次请求已超时，API地址：' + url);
      o.abort();
      clearTimeout(t);
      t = null;
      o = null;
    }, timeout);
  }

  function formatDatas(obj){
    var str = '';
    for(var key in obj){
      str += key + '=' + obj[key] + '&';
    }
    return str.replace(/&$/, '');
  }

  function randomNum(){
    var num = '';
    for(var i = 0; i < 20; i++){
      num += Math.floor(Math.random() * 10);
    }
    return num;
  }

  return {
    ajax: function(opt){
      _doAjax(opt);
    },

    post: function(url, data, dataType, successCB, errorCB, completeCB){
      _doAjax({
        type: 'POST',
        url: url,
        data: data,
        dataType: dataType,
        success: csuccessCB,
        error: errorCB,
        complete: completeCB
      });
    },

    get: function(url, dataType, successCB, errorCB, completeCB){
      _doAjax({
        type: 'GET',
        url: url,
        dataType: dataType,
        success: csuccessCB,
        error: errorCB,
        complete: completeCB
      })
    }
  }
})();

function trimSpace(str){
	return str.replace(/\s+/gim, '');
}

var manageCookies = {
  set: function(key, value, expTime) {
    document.cookie = key + '=' + value + ';max-age=' + expTime;
    return this;
  },

  delete: function(key) {
    return this.set(key, '', -1);
  },
  
  get: function(key, cb) {
    var CookiesArray = document.cookie.split('; ');

    for(var i = 0; i < CookiesArray.length; i++) {
      var CookieItem = CookiesArray[i];

      var CookieItemArray = CookieItem.split('=');

      if(CookieItemArray[0] == key) {
        cb(CookieItemArray[1]);
        return this;
      }
    }
    cb(undefined);
    return this;
  }
}

function throttle(fn, delay){
  var t = null,
      begin = new Date().getTime();

  return function(){
    var _self = this,
        args = arguments,
        cur = new Date().getTime();

    clearTimeout(t);

    if(cur - begin >= delay){
      fn.apply(_self, args);
      begin = cur;
    }else{
      t = setTimeout(function(){
        fn.apply(_self, args);
      }, delay);
    }
  }
}








