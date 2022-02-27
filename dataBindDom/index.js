import {observer} from "./observer";

; (function (doc) {
  var oUsername = doc.querySelector('#username'),
      oAge = doc.querySelector('#age'),
      oEmail = doc.querySelector('#email'),
      oTel = doc.querySelector('#tel'),
      oSubmitBtn = doc.querySelector('#submitBtn'),
      oInfoTable = doc.querySelector('#infoTable');

  var userInfo = observer({
    username: '',
    age: '',
    email: '',
    tel: ''
  }, oInfoTable);

  console.log(userInfo);

  function init() {
    bindEvent();
  }

  function bindEvent() {
    oSubmitBtn.addEventListener('click', handleSubmitBtnClick, false);
  }

  function handleSubmitBtnClick() {
    var _username = oUsername.value.trim(),
        _age = oAge.value.trim(),
        _email = oEmail.value.trim(),
        _tel = oTel.value.trim();

    _username && (_username !== userInfo.username) && (userInfo.username = _username);
    _age && (_age !== userInfo.age) && (userInfo.age = _age);
    _email && (_email !== userInfo.email) && (userInfo.email = _email);
    _tel && (_tel !== userInfo.tel) && (userInfo.tel = _tel);

    oUsername.value = '';
    oAge.value = '';
    oEmail.value = '';
    oTel.value = '';
  }

  init();

})(document);