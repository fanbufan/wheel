var initPageBtns = function (totalPages, curPage) {
  var oBtnBox = document.getElementsByClassName('J_btnBox')[0],
    btnGroup = '';

  render();

  function pageBtnTpl(type, num, curPage) {
    switch (type) {
      case 'btn':
        if (curPage == num) {
          return '<span class="page-btn page-btn-cur">' + num + '</span>';
        } else {
          return '<a href="javascript:;" class="page-btn" data-field="btn" data-page="' + num + '">' + num + '</a>';
        }
        break;
      case 'prev':
        if (curPage == 1) {
          return '<span class="dir-btn prev-btn disabled"><i class="fa fa-angle-left"></i></span>';
        } else {
          return '<a href="javascript:;" class="dir-btn prev-btn" data-field="prev"><i class="fa fa-angle-left prev-btn" data-field="prev"></i></a>';
        }
        break;
      case 'next':
        if (curPage == totalPages) {
          return '<span class="dir-btn next-btn disabled"><i class="fa fa-angle-right"></i></span>';
        } else {
          return '<a href="javascript:;" class="dir-btn next-btn" data-field="next"><i class="fa fa-angle-right next-btn" data-field="next"></i></a>';
        }
        break;
      case 'points':
        return '<span>...</span>';
        break;
    }
  }

  function makeBtnGroup(start, end, curPage) {
    for (var i = start; i <= end; i++) {
      btnGroup += pageBtnTpl('btn', i, curPage);
    }
  }

  function render() {
    btnGroup += pageBtnTpl('prev', totalPages, curPage);

    if (totalPages > 7) {
      if (curPage < 3) {
        makeBtnGroup(1, 3, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(totalPages - 1, totalPages, curPage);
      } else if (curPage < 5) {
        makeBtnGroup(1, curPage + 1, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(totalPages - 1, totalPages, curPage);
      } else if (curPage < totalPages - 3) {
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 1, curPage + 1, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(totalPages - 1, totalPages, curPage);
      } else if (curPage < totalPages) {
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 1, totalPages, curPage);
      } else if (curPage == totalPages) {
        makeBtnGroup(1, 2, curPage);
        btnGroup += pageBtnTpl('points');
        makeBtnGroup(curPage - 2, totalPages, curPage);
      }
    } else {
      makeBtnGroup(1, totalPages, curPage);
    }

    btnGroup += pageBtnTpl('next', totalPages, curPage);

    oBtnBox.innerHTML = btnGroup;
  }
}

var initCommentModule = (function (doc, initPageBtns) {
  var oCommentEditBoard = doc.getElementsByClassName('J_commentEditBoard')[0],
    oCommentStarBox = doc.getElementsByClassName('J_stars')[0],
    oStarItems = oCommentStarBox.getElementsByClassName('fa-star'),
    oStarTip = doc.getElementsByClassName('J_starTip')[0],
    oTxtCount = doc.getElementsByClassName('J_txtCount')[0],
    oSubmitBtn = doc.getElementsByClassName('J_submitBtn')[0],
    oEditTxt = doc.getElementsByClassName('J_editTxt')[0],
    oRadioTabItems = doc.getElementsByClassName('tab-radio'),
    oStatisticsNum = doc.getElementsByClassName('J_statisticsNum')[0],
    oLoading = doc.getElementsByClassName('J_loading')[0],
    oCommentList = doc.getElementsByClassName('J_commentList')[0],
    oBtnBox = doc.getElementsByClassName('J_btnBox')[0],

    warningTip = doc.getElementById('J_warningTip').innerHTML,
    itemTpl = doc.getElementById('J_itemTpl').innerHTML,
    addCommentTpl = doc.getElementById('J_addCommentTpl').innerHTML;

  var starNum = 5,
    delayTime = 300,
    fieldId = 0,
    totalPages = 0,
    curPage = 1,
    t = null;

  // 获取评论列表、提交评论接口地址
  var APIs = {
    getComments: 'http://localhost/api_for_study/Comment/getComments',
    submitComment: 'http://localhost/api_for_study/Comment/submitComment'
  }

  return {
    // 显示提交评论窗口
    openBoard: function () {
      oCommentEditBoard.style.display = 'block';
    },

    // 关闭提交评论窗口
    closeBoard: function () {
      oCommentEditBoard.style.display = 'none';
    },

    // 提交评论窗口内，鼠标滑动评分stars的效果。
    // 鼠标移动到某个星星，当前星星及之前的星星高亮，更新星星评分和评分提示语
    starHover: function (e) {
      var e = event || window.event,
        tar = e.target || window.srcElement,
        tagName = tar.tagName.toLowerCase(tar);

      if (tagName === 'i') {
        var thisIdx = [].indexOf.call(oStarItems, tar),
          len = oStarItems.length,
          thisStarItem = oStarItems[thisIdx],
          item;

        oStarTip.innerHTML = thisStarItem.getAttribute('data-title');
        starNum = thisStarItem.getAttribute('data-count');

        for (var i = 0; i < len; i++) {
          item = oStarItems[i];
          if (i <= thisIdx) {
            item.className += ' active';
          } else {
            item.className = 'fa fa-star';
          }
        }
      }
    },

    // 输入评论的输入框效果
    editInput: function () {
      var val = trimSpace(oEditTxt.value),
        valLen = val.length;

      oTxtCount.innerHTML = valLen;

      if (valLen >= 15 && valLen <= 1000) {
        this.submitBtnChange({
          txtChange: false,
          isDisabled: false
        });
      } else {
        this.submitBtnChange({
          txtChange: false,
          isDisabled: true
        });
      }
    },

    // 提交评论方法
    submitComment: function (userId) {
      var val = trimSpace(oEditTxt.value),
        valLen = val.length,
        _self = this;

      if (valLen >= 15 && valLen <= 1000) {
        _self.submitBtnChange({
          txtChange: true,
          isDisabled: true
        });

        $.ajax({
          url: APIs.submitComment,
          type: 'POST',
          data: {
            userId: userId,
            starNum: starNum,
            comment: val
          },
          success: function (data) {
            var errorCode = data.error_code,
              oFirstCommentItem = oCommentList.getElementsByClassName('comment-item')[0];

            t = setTimeout(function () {
              _self.submitBtnChange({
                txtChange: false,
                isDisabled: false
              });
              clearTimeout(t);

              if (errorCode === '10010') {
                alert('您已对该课程进行了评价，感谢您。');
                return;
              } else {
                // 接口没返回uptime和add_comment数据，前端自己构造数据，用户写页面
                var fakeData = constructData(data.res, false),
                  dom;

                if (fakeData.is_add_comment == '0') {
                  dom = _self._makeItem(fakeData);

                  if (oFirstCommentItem) {
                    oCommentList.insertBefore(dom, oFirstCommentItem);
                  } else {
                    oCommentList.innerHTML = '';
                    oCommentList.appendChild(dom);
                  }
                } else if (fakeData.is_add_comment == '1') {
                  _self._appendAddComment(fakeData);
                }

                _self._setTabStarNum(data.num);
                _self._restoreBoardStatus();
              }
            }, delayTime);
          },
          error: function () {
            alert('对不起，提交评论失败，请重试');
            _self._restoreBoardStatus();
          }
        });
      }
    },

    // 获取评论列表
    getComments: function (opt) {
      var _self = this,
        // field是接口参数，从0开始，返回全部、好评、中评、差评数据
        field = opt.fieldId,
        // page是接口参数，从0开始，获取第几页数据
        page = opt.curPage - 1;

      oLoading.style.display = 'block';

      $.ajax({
        url: APIs.getComments,
        type: 'POST',
        data: {
          field: field,
          page: page
        },
        success: function (data) {
          var arrNum = data.num,
            res = data.res,
            len = res.length;

          totalPages = data.pages;

          t = setTimeout(function () {
            _self._setTabStarNum(arrNum);
            oLoading.style.display = 'none';
            oCommentList.innerHTML = '';

            clearTimeout(t);

            if (totalPages > 1) {
              initPageBtns(totalPages, curPage);
            } else {
              oBtnBox.innerHTML = '';
            }

            if (len <= 0) {
              _self._setWarningTip('暂无评论');
              return;
            }

            oCommentList.appendChild(_self._renderList(res));
          }, delayTime);
        },
        error: function () {
          oLoading.style.display = 'none';
          oCommentList.innerHTML = '';
          _self._setWarningTip('获取评论列表失败');
        }
      });
    },

    // 渲染评论列表comment-item
    _renderList: function (data) {
      var frag = doc.createDocumentFragment(),
        _self = this;

      data.forEach(function (elem) {
        // 接口没返回uptime和add_comment数据，前端自己构造数据，用户写页面
        var fakeData = constructData(elem, true),
          dom = _self._makeItem(fakeData);

        frag.appendChild(dom);
      });

      return frag;
    },

    // 创建评论列表项dom
    _makeItem: function (data) {
      var dom = doc.createElement('div'),
        starNum = data.star_num,
        count = 0,
        addComment;

      dom.className = 'comment-item';
      dom.setAttribute('data-id', data.id);

      // 创建评论列表项模板字符串
      dom.innerHTML = itemTpl.replace(/{{(.*?)}}/gim, function (node, key) {
        key === 'isActive' && count++;

        return {
          avatar: 'img/' + data.avatar,
          nickname: data.nickname,
          comment: data.comment,
          isActive: starNum >= count ? 'active' : '',
          uptime: getDateTime(data.uptime, 'date')
        }[key];
      });

      // 创建追加评论的模板字符串
      addComment = data.add_comment;

      if (addComment) {
        dom.innerHTML += addCommentTpl.replace(/{{(.*?)}}/gim, function (node, key) {
          return {
            comment: addComment.comment,
            uptime: getDateTime(data.uptime, 'date')
          }[key];
        });
      }

      return dom;
    },

    _appendAddComment: function (data) {
      var oCommentItems = doc.getElementsByClassName('comment-item'),
        itemLen = oCommentItems.length,
        item,
        itemDataId,
        resDataId = data.data_id;

      for (var i = 0; i < itemLen; i++) {
        item = oCommentItems[i];
        itemDataId = item.getAttribute('data-id');

        if (itemDataId == resDataId) {
          item.innerHTML += addCommentTpl.replace(/{{(.*?)}}/gim, function (node, key) {
            return {
              comment: data.comment,
              uptime: getDateTime(data.uptime, 'date')
            }[key];
          });

          return;
        }
      }
    },

    // 设置tab数字
    _setTabStarNum: function (arr) {
      var oRadioCount = null;
      arr.forEach(function (elem, idx) {
        oRadioCount = oRadioTabItems[idx].getElementsByClassName('radio-count')[0];
        oRadioCount.innerHTML = elem;
      });

      oStatisticsNum.innerHTML = arr[0] == 0 ? '-' : Math.floor(arr[1] / arr[0] * 100) + '%';
    },

    // 评论列表tab切换效果
    radioTabClick: function (e) {
      var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className,
        oParent,
        len,
        item;

      if (className == 'radio-txt' || className == 'radio-icon') {
        oParent = tar.parentNode;
      } else if (className == 'radio-count') {
        oParent = tar.parentNode.parentNode;
      } else {
        return;
      }

      len = oRadioTabItems.length;

      fieldId = oParent.getAttribute('data-id');

      for (var i = 0; i < len; i++) {
        item = oRadioTabItems[i];
        item.className = 'tab-radio';
      }

      oParent.className += ' cur';
      curPage = 1;

      this.getComments({
        fieldId: fieldId,
        curPage: curPage
      });
    },

    pageBtnClick: function (e) {
      var e = e || window.event,
        tar = e.target || e.srcElement,
        btnType = tar.getAttribute('data-field'),
        doGetComment = false;

      switch (btnType) {
        case 'btn':
          curPage = parseInt(tar.getAttribute('data-page'));
          initPageBtns(totalPages, curPage);
          doGetComment = true;
          break;
        case 'prev':
          curPage -= 1;
          initPageBtns(totalPages, curPage);
          doGetComment = true;
          break;
        case 'next':
          curPage += 1;
          initPageBtns(totalPages, curPage);
          doGetComment = true;
          break;
        default:
          break;
      }

      if (doGetComment) {
        this.getComments({
          fieldId: fieldId,
          curPage: curPage
        });
      }
    },

    // 请求提交评论接口时，按钮状态效果。可点击/不可点击、置灰/不置灰
    submitBtnChange: function (opt) {
      var txtChange = opt.txtChange,
        isDisabled = opt.isDisabled;

      // 提交按钮文字效果，加载效果/提交评论文本
      if (txtChange) {
        oSubmitBtn.innerHTML = '<i class="fa fa-spinner spin"></i>';
      } else {
        oSubmitBtn.innerHTML = '提交评论';
      }

      // 提交按钮状态效果，不可用/可用
      if (isDisabled) {
        oSubmitBtn.className = 'submit-btn submit J_submitBtn disabled';
        oSubmitBtn.setAttribute('disabled', 'disabled');
      } else {
        oSubmitBtn.className = 'submit-btn submit J_submitBtn';
        oSubmitBtn.removeAttribute('disabled');
      }
    },

    // 初始化提交评论窗口状态
    _restoreBoardStatus: function () {
      var starLen = oStarItems.length,
        starItem;

      oEditTxt.value = '';
      oTxtCount.innerHTML = 0;
      oSubmitBtn.innerHTML = '提交评论';
      this.submitBtnChange({
        txtChange: false,
        isDisabled: true
      });
      this.closeBoard();

      oStarTip.innerHTML = oStarItems[4].getAttribute('data-title');

      for (var i = 0; i < starLen; i++) {
        starItem = oStarItems[i];
        starItem.className = 'fa fa-star active';
      }
    },

    // 设置暂无评论提醒
    _setWarningTip: function (text) {
      var transWarningTip = warningTip.replace(/[\r\n]/gim, '');
      oCommentList.innerHTML = transWarningTip.replace(/{{(.*?)}}/gim, text);
    }

  };
})(document, initPageBtns);