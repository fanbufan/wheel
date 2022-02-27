window.onload = function() {
    initScroll();
}


var initScroll = (function() {
    var readLink = document.getElementsByClassName('read-link')[0],
        stopFlag = false,
        autoScrollTimer;
    return function() {
        readLink.onclick = function() {
            clearInterval(autoScrollTimer);
            if (!stopFlag) {
                autoScrollTimer = setInterval(() => {
                    stopFlag = true;
                    readLink.className += ' active';
                    readLink.innerText = '暂停阅读';
                    window.scrollBy(0, 1);
                    var scrollH = getScrollSize().height,
                        flagH = getViewportSize().height + getScrollOffset().top;
                    console.log(scrollH, flagH);
                    if (scrollH < flagH) {
                        window.scrollTo(0, flagH);
                        clearInterval(autoScrollTimer);
                        readLink.className = 'read-link';
                        readLink.innerText = '开始阅读';
                        stopFlag = false;
                    }
                }, 10);
            } else {
                clearInterval(autoScrollTimer);
                stopFlag = false;
                readLink.className = 'read-link';
                readLink.innerText = '开始阅读';
            }
        }
    }
})();