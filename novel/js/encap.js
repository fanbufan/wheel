// 页面滚动距离兼容封装，window.pageXOffset、window.pageYOffset
function getScrollOffset() {
    if (window.pageXOffset) {
        // 常见浏览器
        return {
            left: window.pageXOffset,
            top: window.pageYOffset
        }
    } else {
        // ie9及以下浏览器
        return {
            left: document.documentElement.scrollLeft + document.body.scrollLeft,
            top: document.documentElement.scrollTop + document.body.scrollTop
        }
    }
}

// 浏览器可视区域兼容封装，window.innerWidth、window.innerHeight
function getViewportSize() {
    if (window.innerWidth) {
        // 常见浏览器
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else {
        if (document.compatMode === 'BackCompat') {
            // 怪异模式
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        } else {
            // 标准模式
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        }
    }
}

// 页面正文宽高兼容封装，document.body.scrollWidth、document.body.scrollHeight
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