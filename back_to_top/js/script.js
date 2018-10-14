window.onload = function(){
    var backTop = document.getElementById('backTop');
    var scrollTimer = null;
    var backTopFlag = false;
    scrollToTop();

    backTop.onmouseenter = function(){
        backTop.style.backgroundPositionY = '-40px';
    }
    backTop.onmouseleave = function(){
        backTop.style.backgroundPositionY = 'top';
    }
    backTop.onclick = function(){
        if (scrollTimer) {
            clearInterval(scrollTimer);
        }

        scrollTimer = setInterval(function(){
            // 兼容chrome和ie的scrollTop属性，定时器发生时重新赋值
            var scroll = document.documentElement.scrollTop || document.body.scrollTop;
            // 滚动速度，指数递减
            var speed = Math.ceil(scroll/5);
            if (scroll <= 0) {
                clearInterval(scrollTimer);
            }
            document.documentElement.scrollTop -= speed;
            document.body.scrollTop -= speed;
            // backTop元素的onclick，发生时会触发onscroll()方法。
            // 此时将backTopFlag设置为true，不会清除定时器。
            // 而由其他动作所触发的onscroll()，backTopFlag还是默认的false，会清除定时器，停止backTop元素的向上滚动事件。
            backTopFlag = true;
        },20);
    }

    //每次页面滚动触发scroll()方法，判断返回顶部按钮是否需要显示
    window.onscroll = function(){
        if (!backTopFlag) {
            clearInterval(scrollTimer);
        }
        //
        backTopFlag = false;
        scrollToTop();
    }
}

//判断返回顶部按钮是否需要显示
function scrollToTop(){
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

    if (scroll > clientHeight) {
        backTop.style.display = 'block';
    }else{
        backTop.style.display = 'none';
    }
}