;(function(doc){
  
  var oNav = doc.getElementsByClassName('J_nav')[0],
      oNavItems = oNav.getElementsByClassName('nav-item'),
      oSearchRow = doc.getElementsByClassName('J_searchRow')[0],
      oWarningTip = doc.getElementsByClassName('J_tipRow')[0],
      oCourseList = doc.getElementsByClassName('J_courseList')[0],
      oSearchInput = doc.getElementById('J_searchInput'),
      oPageBtnRow = doc.getElementsByClassName('J_pageBtnRow')[0],
      oPageBtnList = doc.getElementsByClassName('J_pageBtnList')[0],
      oBtnItems = oPageBtnList.getElementsByClassName('btn-item'),
      oCourseInputs = oCourseList.getElementsByClassName('course-name-input'),
      oCourseSpans = oCourseList.getElementsByClassName('course-name'),
      
      listItemTpl = doc.getElementById('J_listItemTpl').innerHTML,
      pageBtnItemTpl = doc.getElementById('J_pageBtnItemTpl').innerHTML,

      oNavItemsLen = oNavItems.length,
      field = 'manage',
      pageNum = 0,
      curId = 0,
      curIdx = -1;

  var API = {
		getSearchList: 'http://localhost:8080/api_for_study/List/getSearchListForManage',
  	getCourseList: 'http://localhost:8080/api_for_study/List/getCourseListForManage',
    doListItem: 'http://localhost:8080/api_for_study/List/doListItemForManage',
    updateCourseName: 'http://localhost:8080/api_for_study/List/updateCourseNameForManage'
  }
  
  var init = function(){
  	getCourseList(field, pageNum);
  	bindEvent();
  }

  function bindEvent(){
    oNav.addEventListener('click', navClick, false);
    oSearchInput.addEventListener('input', throttle(courseSearch, 1000), false);
    oPageBtnList.addEventListener('click', changePage, false);
    oCourseList.addEventListener('click', listClick, false);
  }

  function showSearchInput(show){
    if(show){
      oSearchRow.className += ' show';
    }else{
      oSearchRow.className = 'J_searchRow search-row';
      oSearchInput.value = '';
    }
  }

  function showWarningTip(show){
    if(show){
      oWarningTip.className = 'J_tipRow tip-row';
      oCourseList.innerHTML = '';
    }else{
      oWarningTip.className += ' hide';
    }
  }

  function navClick(e){
    var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className;

    e.stopPropagation();

    if(className === 'nav-lk'){
    	var oParent = tar.parentNode,
          item;
    	    
    	field = oParent.getAttribute('data-field');
    	    

    	for(var i = 0; i < oNavItemsLen; i++){
    		item = oNavItems[i];
    		item.className = 'nav-item';
    	}
    	oParent.className += ' active';

    	if(field === 'search'){
    		showSearchInput(true);
    		showWarningTip(true);
        showPageBtnRow(false);
    		return;
    	}
    	getCourseList(field, pageNum);
    }
  }

  function courseSearch(e){
  	var e = e || window.event,
        val = this.value,
  	    valLen = val.length;

  	if(valLen > 0){
  		getSearchList(val);
  	}else{
  		showWarningTip(true);
  	}
  }

  function getCourseList(field, pageNum){
    showSearchInput(false);

    xhr.ajax({
      url: API.getCourseList,
      type: 'POST',
      dataType: 'JSON',
      data: {
        field: field,
        pageNum: pageNum
      },
      success: function(data){
        var res = data.res,
            pageCount = data.pages;

        _setDatas(field, res, pageCount, pageNum);
      },
      error: function(){
        alert('列表获取失败，请重试！');
      }
    });
  }

  function getSearchList(keyword){
    xhr.ajax({
      url: API.getSearchList,
      type: 'POST',
      dataType: 'JSON',
      data: {
        keyword: keyword
      },
      success: function(data){
        var res = data.res;
        _setDatas('manage', res);
      },
      error: function(){
        alert('搜索操作失败，请重试！');
      }
    })
  }

  function _setDatas(field, data, pageCount, pageNum){
    if(data && data.length > 0){
      oCourseList.innerHTML = renderList(field, data);
      showWarningTip(false);

      if(pageCount > 1 && field !== 'search'){
        oPageBtnList.innerHTML = renderPageBtns(pageCount, pageNum);
        showPageBtnRow(true);
      }else{
        oPageBtnList.innerHTML = '';
        showPageBtnRow(false);
      }
    }else{
      showWarningTip(true);
    }
  }

  function renderList(listField, data){
    var list = '';

    data.forEach(function(elem){
      list += listItemTpl.replace(/{{(.*?)}}/g, function(node, key){
        return {
          id: elem.id,
          course: elem.course,
          hour: elem.hour,
          teacher: elem.teacher,
          field: elem.field,
          type: listField == 'trash' ? 'regain' : 'delete',
          typeText: listField == 'trash' ? '恢 复' : '删 除'
        }[key];
      });
    });

    return list;
  }

  function renderPageBtns(pageCount, pageNum){
    var list = '';

    for(var i = 0; i < pageCount; i++){
      list += pageBtnItemTpl.replace(/{{(.*?)}}/g, function(node, key){
        return {
          pageNum: i + 1,
          isCur: i == pageNum && 'cur'
        }[key];
      });
    }

    return list;
  }

  function showPageBtnRow(show){
    if(show){
      oPageBtnRow.className += ' show';
    }else{
      oPageBtnRow.className = 'page-btn-row J_pageBtnRow';
    }
  }

  function changePage(e){
    var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className;

    e.stopPropagation();

    if(className === 'page-btn'){
      var oParent = tar.parentNode,
          oBtnItemsLen = oBtnItems.length,
          item;

      pageNum = [].indexOf.call(oBtnItems, oParent);

      for(var i = 0; i < oBtnItemsLen; i++){
        item = oBtnItems[i];
        item.className = 'btn-item';
      }
      oParent.className += ' cur';
      getCourseList(field, pageNum);
    }
  }

  function listClick(e){
    var e = e || window.event,
        tar = e.target || e.srcElement,
        className = tar.className,
        itemId = tar.getAttribute('data-id');

    e.stopPropagation();

    switch(className){
      case 'list-btn delete':
        var c = confirm('确认删除');
        c && doListItem('remove', pageNum, itemId);
        break;
      case 'list-btn regain':
        var c = confirm('确认恢复');
        c && doListItem('regain', pageNum, itemId);
        break;
      case 'course-name':
        showInput(tar);
        break;
      default:
        break;
    }
  }

  function updateCourseName(e){
    var e = e || window.event,
        eventType = e.type;

    if(eventType === 'keyup'){
      var keyCode = e.keyCode;
      if(keyCode === 13){
        submitNewCourseName(curId, curIdx);
      }
      return;
    }
    submitNewCourseName(curId, curIdx);
  }

  function doListItem(type, pageNum, itemId){
    xhr.ajax({
      url: API.doListItem,
      type: 'POST',
      dataType: 'JSON',
      data: {
        type: type,
        pageNum: pageNum,
        itemId: itemId
      },
      success: function(data){
        var res = data.res,
            pageCount = data.pages;

        _setDatas(field, res, pageCount, pageNum);
      },
      error: function(){
        alert('操作列表失败，请重试！');
      }
    });
  }

  function submitNewCourseName(curId, curIdx){
    hideAllInputs();
    var newVal = oCourseInputs[curIdx].value,
        thisCourseSpan = oCourseSpans[curIdx];

    if(newVal !== thisCourseSpan.innerHTML){
      xhr.ajax({
        url: API.updateCourseName,
        type: 'POST',
        dataType: 'JSON',
        data: {
          itemId: curId,
          newVal: newVal
        },
        success: function(data){
          if(data === 'success'){
            thisCourseSpan.innerHTML = newVal;
          }else{
            alert('更改课程名称失败，请重试');
          }

          curId = 0;
          curIdx = -1;
        },
        error: function(){
          alert('更改课程名称失败，请重试');
        }
      });
    }
  }

  function showInput(target){
    hideAllInputs();
    var oParent = target.parentNode,
        thisInput = oParent.getElementsByClassName('course-name-input')[0],
        thisInputLen = thisInput.value.length;

    curId = thisInput.getAttribute('data-id');
    curIdx = [].indexOf.call(oCourseInputs, thisInput);

    thisInput.className += ' show';
    thisInput.focus();
    thisInput.setSelectionRange(0, thisInputLen);

    document.addEventListener('click', updateCourseName, false);
    document.addEventListener('keyup', updateCourseName, false);
  }

  function hideAllInputs(){
    var inputsLen = oCourseInputs.length,
        item;

    for(var i = 0; i < inputsLen; i++){
      item = oCourseInputs[i];
      item.className = 'course-name-input';
      item.blur();
    }
    document.removeEventListener('click', updateCourseName, false);
    document.removeEventListener('keyup', updateCourseName, false);
  }


  init();

})(document);













