// DOM元素篇
// 1、获取页面滚动距离
function getScrollOffset() {
	if (window.pageXoffset) {
		// 常见浏览器
		return {
			left: window.pageXoffset,
			top: window.pageYoffset
		}
	} else {
		// ie9及以下浏览器
		return {
			left: document.body.scrollLeft + document.documentElement.scrollLeft,
			top: document.body.scrollTop + document.documentElement.scrollTop
		}
	}
}

// 2、获取可视窗口区域大小
function getViewportSize() {
	if (window.innerWidth) {
		// 常见浏览器
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	} else {
		if (document.compatMode === 'CSS1Compat') {
			// 标准模式
			return {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			}
		} else {
			// 怪异模式
			return {
				width: document.body.clientWidth,
				height: document.body.clientHeight
			}
		}
	}
}

// 3、获取文档/页面正文宽高
function getScrollSize() {
	if (document.body.scrollWidth) {
		return {
			width: document.body.scrollWidth,
			height: document.body.scrollHeight
		}
	} else {
		return {
			width: document.documentElement.scrollWidth,
			height: document.documentElement.scrollHeight
		}
	}
}

// 3.1、判断页面是否滚动到x/y轴底部
function scrollFlag() {
	var pageWidth = getScrollSize().width,
		pageHeight = getScrollSize().height,
		scrollRight = getScrollOffset().left + getViewportSize().width,
		scrollBottom = getScrollOffset().top + getViewportSize().height,
		xFlag = false,
		yFlag = false;

	if (scrollRight >= pageWidth) {
		xFlag = true;
	}
	if (scrollBottom >= pageHeight) {
		yFlag = true;
	}

	return {
		xFlag,
		yFlag
	}
}

// 4、获取文档/页面偏移量
function getClientPosition() {
	return {
		left: document.documentElement.clientLeft || 0,
		top: document.documentElement.clientTop || 0
	}
}

// 5、获取相对body的距离
function getElemDocPosition(el) {
	var parent = el.offsetParent,
		offsetLeft = el.offsetLeft,
		offsetTop = el.offsetTop;

	while (parent) {
		offsetLeft += parent.offsetLeft;
		offsetTop += parent.offsetTop;
		parent = parent.offsetParent;
	}

	return {
		left: offsetLeft,
		top: offsetTop
	}
}

// 6、获取元素属性值
function getStyle(el, prop) {
	if (window.getComputedStyle) {
		if (prop) {
			return window.getComputedStyle(el, null)[prop];
		} else {
			return window.getComputedStyle(el, null);
		}
	} else {
		if (prop) {
			return el.currentStyle[prop];
		} else {
			return el.currentStyle;
		}
	}
}

// DOM事件篇
// 7、绑定事件处理函数
function addEvent(el, type, fn) {
	if (el.addEventListener) {
		el.addEventListener(type, fn, false);
	} else if (el.attachEvent) {
		el.attachEvent('on' + type, function () {
			fn.call(el);
		});
	} else {
		el['on' + type] = function () {
			fn();
		};
	}
}

// 8、解除事件处理函数
function removeEvent(el, type, fn) {
	if (el.removeEventListener) {
		el.removeEventListener(type, fn, false);
	} else if (el.detachEvent) {
		el.detachEvent('on' + type, fn);
	} else {
		el['on' + type] = null;
	}
}

// 9、取消事件冒泡
function cancelBubble(e) {
	var e = e || window.event;
	if (e.stopPropagation) {
		e.stopPropagation()
	} else {
		e.cancelBubble = true;
	}
}

// 10、阻止默认事件发生
function preventDefaultEvent(e) {
	var e = e || window.event;
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}

// DOM鼠标事件
// 11、获取鼠标相对文档的x/y轴的距离
function pagePos(e) {
	var scrollLeft = getScrollOffset().left,
		scrollTop = getScrollOffset().top,
		clientLeft = document.documentElement.clientLeft || 0,
		clientTop = document.documentElement.clientTop || 0;
	return {
		x: e.clientX + scrollLeft - clientLeft,
		y: e.clientY + scrollTop - clientTop
	}
}

// 获取滚动高度
function getScrollTop() {
	var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
	if (document.body) {
		bodyScrollTop = document.body.scrollTop;
	}
	if (document.documentElement) {
		documentScrollTop = document.documentElement.scrollTop;
	}
	scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
	return scrollTop;
}

// 获取页面高度
function getScrollHeight() {
	var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
	if (document.body) {
		bodyScrollHeight = document.body.scrollHeight;
	}
	if (document.documentElement) {
		documentScrollHeight = document.documentElement.scrollHeight;
	}
	scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
	return scrollHeight;
}

// 获取可视窗口高度
function getWindowHeight() {
	var windowHeight = 0;
	if (document.compatMode == "CSS1Compat") {
		windowHeight = document.documentElement.clientHeight;
	} else {
		windowHeight = document.body.clientHeight;
	}
	return windowHeight;
}



// JavaScript功能封装篇
// 12、深拷贝
function deepClone(origin, hashMap = new WeakMap()) {
	if (origin == undefined || typeof origin !== 'object') {
		return origin;
	}

	if (origin instanceof Date) {
		return new Date(origin);
	}

	if (origin instanceof RegExp) {
		return new RegExp(origin);
	}

	const hashKey = hashMap.get(origin);

	if (hashKey) {
		return hashKey;
	}

	const target = new origin.constructor();
	hashMap.set(origin, target);

	for (var k in origin) {
		if (origin.hasOwnProperty(k)) {
			target[k] = deepClone(origin[k], hashMap);
		}
	}

	return target;
}

/* 
 * 常用功能方法封装
 */
// 判断点是否在一个三角形内
function vec(a, b) {
	return {
		x: b.x - a.x,
		y: b.y - a.y
	}
}

function vecProduct(v1, v2) {
	return v1.x * v2.y - v2.x * v1.y;
}

function sameSymbols(a, b) {
	return (a ^ b) >= 0;
}
// p点是最后移动的一点，a点是移动的上一点，b、c两点是固定两点
function pointInTriangle(p, a, b, c) {
	var PA = vec(p, a),
		PB = vec(p, b),
		PC = vec(p, c),
		R1 = vecProduct(PA, PB),
		R2 = vecProduct(PB, PC),
		R3 = vecProduct(PC, PA);

	return sameSymbols(R1, R2) && sameSymbols(R2, R3);
}

// ajax
var xhr = (function () {

	function _doAjax(opt) {
		var o = window.XMLHttpRequest ?
			new XMLHttpRequest :
			new ActiveXObject('Microsoft.XMLHTTP');

		if (!o) {
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
			error = opt.error || function () { },
			success = opt.success || function () { },
			complete = opt.complete || function () { },
			t = null;

		if (!url) {
			throw new Error('您没有填写URL');
		}

		if (dataType.toUpperCase() === 'JSONP' && type !== 'GET') {
			throw new Error('如果dataType为JSONP，type请您设置GET或不设置');
		}

		if (dataType.toUpperCase() === 'JSONP') {
			var oScript = document.createElement('script');
			oScript.src = url.indexOf('?') === -1
				? url + '?' + jsonp + '=' + jsonpCallback
				: url + '&' + jsonp + '=' + jsonpCallback;
			document.body.appendChild(oScript);
			document.body.removeChild(oScript);
			window[jsonpCallback] = function (data) {
				success(data);
			};
			return;
		}

		o.onreadystatechange = function () {
			if (o.readyState === 4) {
				if ((o.status >= 200 && o.status < 300) || o.status === 304) {
					switch (dataType.toUpperCase()) {
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
				} else {
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

		t = setTimeout(function () {
			throw new Error('本次请求已超时，API地址：' + url);
			o.abort();
			clearTimeout(t);
			t = null;
			o = null;
		}, timeout);
	}

	function formatDatas(obj) {
		var str = '';
		for (var key in obj) {
			str += key + '=' + obj[key] + '&';
		}
		return str.replace(/&$/, '');
	}

	function randomNum() {
		var num = '';
		for (var i = 0; i < 20; i++) {
			num += Math.floor(Math.random() * 10);
		}
		return num;
	}

	return {
		ajax: function (opt) {
			_doAjax(opt);
		},

		post: function (url, data, dataType, successCB, errorCB, completeCB) {
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

		get: function (url, dataType, successCB, errorCB, completeCB) {
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

// 清除字符串中的空格
function trimSpace(str) {
	return str.replace(/\s+/gim, '');
}

// 管理cookies
var manageCookies = {
	set: function (key, value, expTime) {
		document.cookie = key + '=' + value + ';max-age=' + expTime;
		return this;
	},

	delete: function (key) {
		return this.set(key, '', -1);
	},

	get: function (key, cb) {
		var CookiesArray = document.cookie.split('; ');

		for (var i = 0; i < CookiesArray.length; i++) {
			var CookieItem = CookiesArray[i];

			var CookieItemArray = CookieItem.split('=');

			if (CookieItemArray[0] == key) {
				cb(CookieItemArray[1]);
				return this;
			}
		}
		cb(undefined);
		return this;
	}
}

// 节流函数
function throttle(fn, delay) {
	var t = null,
		begin = new Date().getTime();

	return function () {
		var _self = this,
			args = arguments,
			cur = new Date().getTime();

		clearTimeout(t);

		if (cur - begin >= delay) {
			fn.apply(_self, args);
			begin = cur;
		} else {
			t = setTimeout(function () {
				fn.apply(_self, args);
			}, delay);
		}
	}
}