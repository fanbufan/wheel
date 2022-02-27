; (function (doc, Comment) {
  var oOpen = doc.getElementsByClassName('J_openBtn')[0],
    oCloseBtn = doc.getElementsByClassName('J_closeBtn')[0],
    oStars = doc.getElementsByClassName('J_stars')[0],
    oEditTxt = doc.getElementsByClassName('J_editTxt')[0],
    oSubmitBtn = doc.getElementsByClassName('J_submitBtn')[0],
    oRadioTab = doc.getElementsByClassName('J_radioTabs')[0],
    oBtnBox = doc.getElementsByClassName('J_btnBox')[0];

  var userId = 200;

  var init = function () {
    bindEvent();
    Comment.getComments({
      fieldId: 0,
      pageNum: 1
    });
  }

  function bindEvent() {
    oOpen.addEventListener('click', Comment.openBoard, false);
    oCloseBtn.addEventListener('click', Comment.closeBoard, false);
    oStars.addEventListener('mouseover', Comment.starHover, false);
    oEditTxt.addEventListener('input', Comment.editInput.bind(Comment), false);
    oSubmitBtn.addEventListener('click', Comment.submitComment.bind(Comment, userId), false);
    oRadioTab.addEventListener('click', Comment.radioTabClick.bind(Comment), false);
    oBtnBox.addEventListener('click', Comment.pageBtnClick.bind(Comment), false);
  }

  init();

})(document, initCommentModule);