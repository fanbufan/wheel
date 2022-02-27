import { userInfoTpl } from "./templates";

export function observer(userInfo, ViewDom) {
  var _storageInfo = JSON.parse(localStorage.getItem('userInfo') || '{}'),
    _retInfo = {};

  function init() {
    initData(_storageInfo, _retInfo, userInfo);
    initDom(_retInfo, ViewDom);
  }

  function initData(storageInfo, retInfo, userInfo) {
    for (var k in userInfo) {
      if (!userInfo[k]) {
        userInfo[k] = storageInfo[k];
      }
    }

    for (var k in userInfo) {
      (function (k) {
        Object.defineProperty(retInfo, k, {
          get() {
            return userInfo[k];
          },
          set(newVal) {
            userInfo[k] = newVal;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            document.querySelector(`.__${k}`).innerHTML = userInfo[k];
          }
        })
      })(k);
    }
  }

  function initDom(retInfo, dom) {
    dom.innerHTML = userInfoTpl(retInfo, dom);
  }

  init();

  return _retInfo;
}