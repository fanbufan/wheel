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
function cancelBubble(e){
  var e = e || window.event;
  if (e.stopPropagation) {
    e.stopPropagation()
  }else{
    e.cancelBubble = true;
  }
}

// 10、阻止默认事件发生
function preventDefaultEvent(e){
  var e = e || window.event;
  if (e.preventDefault) {
    e.preventDefault();
  }else{
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