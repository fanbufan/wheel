(function (doc) {
	var oNav = doc.getElementsByClassName('J_nav')[0],
		oNavItems = oNav.getElementsByClassName('nav-item'),
		oSearchRow = doc.getElementsByClassName('J_searchRow')[0],
		oSearchInput = doc.getElementById('J_searchInput'),
		oTipRow = doc.getElementsByClassName('J_tipRow')[0],
		oCourseList = doc.getElementsByClassName('J_courseList')[0],
		oCourseSpans = oCourseList.getElementsByClassName('course-name'),
		oCourseNameInputs = oCourseList.getElementsByClassName('course-name-input'),
		oPageBtnRow = doc.getElementsByClassName('J_pageBtnRow')[0],
		oBtnItems = doc.getElementsByClassName('btn-item'),
		oPageBtnList = oPageBtnRow.getElementsByClassName('J_pageBtnList')[0];

	var field = 'manage',
		pageNum = 0,
		curId = 0,
		curIndex = -1;

	var listItemTpl = doc.getElementById('J_listItemTpl').innerHTML,
		pageBtnItemTpl = doc.getElementById('J_pageBtnItemTpl').innerHTML;

	var APIs = {
		'getCourseListUrl': 'http://localhost:8080/api_for_study/List/getCourseListForManage',
		'getSearchListUrl': 'http://localhost:8080/api_for_study/List/getSearchListForManage',
		'doListItemUrl': 'http://localhost:8080/api_for_study/List/doListItemForManage',
		'updateCourseNameUrl': 'http://localhost:8080/api_for_study/List/updateCourseNameForManage'
	}

	var init = function () {
		// 页面加载时，初始化课程管理列表
		getCourseList(field, pageNum);
		bindEvent();
	}

	function bindEvent() {
		oNav.addEventListener('click', navClick, false);
		oSearchInput.addEventListener('input', throttle(courseSearch, 1000), false);
		oPageBtnList.addEventListener('click', changePage, false);
		oCourseList.addEventListener('click', listClick, false);
	}

	// 课程管理、垃圾箱、课程搜索tab按钮点击事件
	function navClick(e) {
		var e = e || window.event,
			tar = e.target || e.srcElement,
			className = tar.className;

		e.stopPropagation();

		if (className == 'nav-lk') {
			var oParent = tar.parentNode,
				itemLen = oNavItems.length,
				item;

			field = oParent.getAttribute('data-field');

			for (var i = 0; i < itemLen; i++) {
				item = oNavItems[i];
				item.className = 'nav-item';
			}

			oParent.className += ' active';

			if (field == 'search') {
				oSearchInput.value = '';
				showSearchInput(true);
				showWarningTip(true);
				showPageBtnRow(false);
			} else {
				showSearchInput(false);
				pageNum = 0;
				getCourseList(field, pageNum);
			}
		}
	}

	// 切换显示搜索输入框
	function showSearchInput(show) {
		if (show) {
			oSearchRow.className += ' show';
		} else {
			oSearchRow.className = 'search-row J_searchRow';
		}
	}

	// 切换显示暂无课程提示
	function showWarningTip(show) {
		if (show) {
			oTipRow.className = 'tip-row J_tipRow';
			oCourseList.innerHTML = '';
		} else {
			oTipRow.className += ' hide';
		}
	}

	// 切换显示分页栏
	function showPageBtnRow(show) {
		if (show) {
			oPageBtnRow.className += ' show';
		} else {
			oPageBtnRow.className = 'page-btn-row J_pageBtnRow';
		}
	}

	// 获取后端课程列表数据
	function getCourseList(field, pageNum) {
		xhr.ajax({
			url: APIs.getCourseListUrl,
			type: 'POST',
			dataType: 'JSON',
			data: {
				field: field,
				pageNum: pageNum
			},
			success: function (data) {
				var res = data.res,
					pageCount = data.pages;

				_setDatas(field, res, pageCount, pageNum);
			},
			error: function () {

			}
		});
	}

	// 课程搜索输入框input输入事件
	function courseSearch(e) {
		var e = e || window.event,
			val = trimSpace(this.value),
			valLen = val.length;

		if (valLen > 0) {
			getSearchList(val);
		} else {
			showWarningTip(true);
		}
	}

	// 获取课程搜索结果
	function getSearchList(keyword) {
		xhr.ajax({
			url: APIs.getSearchListUrl,
			type: 'POST',
			dataType: 'JSON',
			data: {
				keyword: keyword
			},
			success: function (data) {
				var res = data.res;

				_setDatas(field, res);
			},
			error: function () {

			}
		});
	}

	// 课程列表事件处理函数，删除、恢复、修改课程名称、更新课程名称
	function listClick(e) {
		var e = e || window.event,
			tar = e.target || e.srcElement,
			className = tar.className,
			itemId = tar.getAttribute('data-id');

		e.stopPropagation();

		switch (className) {
			case 'list-btn delete':
				var c = confirm('确认删除');
				c && doListItem('remove', pageNum, itemId);
				break;
			case 'list-btn regain':
				var c = confirm('确认恢复');
				c && doListItem('regain', pageNum, itemId);
				break;
			case 'course-name':
				showCourseInput(tar);
				break;
			default:
				break;
		}
	}

	// 恢复、删除课程
	function doListItem(type, pageNum, itemId) {
		xhr.ajax({
			url: APIs.doListItemUrl,
			type: 'POST',
			dataType: 'JSON',
			data: {
				type: type,
				pageNum: pageNum,
				itemId: itemId
			},
			success: function (data) {
				var res = data.res,
					pageCount = data.pages;

				_setDatas(field, res, pageCount, pageNum);
			}
		});
	}

	// 显示当前课程输入框
	function showCourseInput(target) {
		hideAllInputs(curIndex);

		var oParent = target.parentNode,
			thisInput = oParent.getElementsByClassName('course-name-input')[0],
			thisInputLen = thisInput.value.length;

		curId = thisInput.getAttribute('data-id');
		curIndex = [].indexOf.call(oCourseNameInputs, thisInput);

		thisInput.className += ' show';
		thisInput.focus();
		thisInput.setSelectionRange(0, thisInputLen);

		document.addEventListener('click', updateCourseName, false);
		document.addEventListener('keyup', updateCourseName, false);
	}

	// 隐藏所有课程输入框
	function hideAllInputs(curIndex) {
		var inputsLen = oCourseNameInputs.length,
			inputItem,
			spanItem;

		for (var i = 0; i < inputsLen; i++) {
			inputItem = oCourseNameInputs[i];
			spanItem = oCourseSpans[i];

			if (curIndex != i) {
				inputItem.value = trimSpace(spanItem.innerHTML);
			}
			inputItem.className = 'course-name-input';
		}

		document.removeEventListener('click', updateCourseName);
		document.removeEventListener('keyup', updateCourseName);
	}

	// 监控键盘抬起enter键、document点击时，提交更新课程名称
	function updateCourseName(e) {
		var e = e || window.event,
			eventType = e.type;

		if (eventType == 'keyup') {
			var keyCode = e.keyCode;

			if (keyCode == 13) {
				submitCourseName(curId, curIndex);
			}
			return;
		}
		submitCourseName(curId, curIndex);
	}

	// 向服务器提交更新的课程名称
	function submitCourseName(curId, curIndex) {
		hideAllInputs(curIndex);

		var newVal = trimSpace(oCourseNameInputs[curIndex].value),
			curCourseSpan = oCourseSpans[curIndex],
			curSpanVal = trimSpace(curCourseSpan.innerHTML);

		if (newVal != curSpanVal) {
			xhr.ajax({
				url: APIs.updateCourseNameUrl,
				type: 'POST',
				dataType: 'JSON',
				data: {
					itemId: curId,
					newVal: newVal
				},
				success: function (data) {
					if (data == 'success') {
						curCourseSpan.innerHTML = newVal;
					}

					curId = 0;
					curIndex = -1;
				},
				error: function () {

				}
			});
		}
	}

	// 处理获取课程列表数据，决定是否渲染课程列表、是否渲染分页
	function _setDatas(field, data, pageCount, pageNum) {
		// 获取到课程数据，判断是否有课程
		if (data && data.length > 0) {
			// 有课程，渲染课程列表
			showWarningTip(false);
			oCourseList.innerHTML = renderList(field, data);

			// 判断是否需要分页
			// 页码数<1 且 当前tab是manage、trash
			if (pageCount > 1 && field != 'search') {
				showPageBtnRow(true);
				oPageBtnList.innerHTML = renderPageBtns(pageCount, pageNum);
			} else {
				showPageBtnRow(false);
			}
		} else {
			// 未获取到课程数据，显示暂无课程
			showWarningTip(true);
		}
	}

	// 渲染课程列表模板
	function renderList(listField, data) {
		var list = '',
			type = listField == 'trash' ? 'regain' : 'delete',
			typeText = listField == 'trash' ? '恢复' : '删除';

		data.forEach(function (elem) {
			list += listItemTpl.replace(/{{(.*?)}}/g, function (node, key) {

				return {
					id: elem.id,
					course: elem.course,
					hour: elem.hour,
					teacher: elem.teacher,
					field: elem.field,
					type: type,
					typeText: typeText
				}[key];
			});
		})

		return list;
	}

	// 渲染分页模板
	function renderPageBtns(pageCount, pageNum) {
		var pageList = '';

		for (var i = 0; i < pageCount; i++) {
			pageList += pageBtnItemTpl.replace(/{{(.*?)}}/g, function (node, key) {
				return {
					isCur: pageNum == i ? 'cur' : '',
					pageNum: i + 1
				}[key];
			});
		}

		return pageList;
	}

	// 点击分页的事件处理函数
	function changePage(e) {
		var e = e || window.event,
			tar = e.target || e.srcElement,
			className = tar.className;

		e.stopPropagation();

		if (className == 'page-btn') {
			var oParent = tar.parentNode;

			pageNum = [].indexOf.call(oBtnItems, oParent);

			xhr.ajax({
				url: APIs.getCourseListUrl,
				type: 'POST',
				dataType: 'JSON',
				data: {
					field: field,
					pageNum: pageNum
				},
				success: function (data) {
					var res = data.res,
						pageCount = data.pages;

					_setDatas(field, res, pageCount, pageNum);
				},
				error: function () {

				}
			});
		}
	}

	init();
})(document);