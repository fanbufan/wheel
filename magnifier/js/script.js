window.onload = function () {
    var demo = document.getElementsByClassName('demo')[0];
    var small_box = document.getElementsByClassName('small_box')[0];
    var mask = document.getElementsByClassName('mask')[0];
    var big_box = document.getElementsByClassName('big_box')[0];
    var big_img = big_box.getElementsByTagName('img')[0];

    //移入小图box，显示小图浮层框和大图显示框
    small_box.onmouseenter = function(){
        mask.style.display = 'block';
        big_box.style.display = 'block';
    }
    //移出小图box，隐藏小图内浮层框和大图的显示框
    small_box.onmouseleave = function(){
        mask.style.display = 'none';
        big_box.style.display = 'none';
    }
    // 在小图box移动，大图框内的大图跟随移动
    small_box.onmousemove = function(event){
        var e = event || window.event;
        var left = e.clientX - demo.offsetLeft - small_box.offsetLeft - mask.offsetWidth/2;
        var top = e.clientY - demo.offsetTop - small_box.offsetTop - mask.offsetHeight/2;

        // 鼠标移动时，小图框内的浮层不超过小图框范围
        if (left<0) {
            left = 0;
        }else if (left>small_box.offsetWidth-mask.offsetWidth) {
            left = small_box.offsetWidth-mask.offsetWidth;
        }
        if (top<0) {
            top = 0;
        }else if (top>small_box.offsetHeight-mask.offsetHeight) {
            top = small_box.offsetHeight-mask.offsetHeight;
        }
        
        // 鼠标移动时，小图框内浮层跟随移动
        mask.style.left = left + 'px';
        mask.style.top = top + 'px';

        // 大图跟随移动
        big_img.style.left = -left * big_img.offsetWidth / small_box.offsetWidth + 'px';
        big_img.style.top = -top * big_img.offsetHeight / small_box.offsetHeight + 'px';
    }
}
