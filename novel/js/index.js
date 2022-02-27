window.onload = function() {
    initToTop();
}

var initToTop = (function() {
    return function() {
        var toTop = document.getElementsByClassName('to-top')[0];
        toTop.onclick = function() {
            window.scrollTo(0, 0)
        }
    }
})();