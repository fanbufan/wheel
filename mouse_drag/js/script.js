// ！【注意】！【注意】！【注意】！【注意】
// 将鼠标事件绑定到document中，若鼠标移动到浏览器窗口外在松开，浏览器也能检测到该事件。

window.onload = function () {
    var dragFlag = false;
    var mouseoffsetX = 0;
    var mouseoffsetY = 0;

    $('login').onclick = function () {
        autoCenter($('ui_dialog'));
    }
    $('close').onclick = function () {
        $('mask').style.display = 'none';
        $('ui_dialog').style.display = 'none';

    }


    // 鼠标事件1：在标题栏上按下，标记为可拖动状态。
    // 计算鼠标相对标题栏左上角的坐标：鼠标坐标-标题栏坐标
    $('ui_dialog_title').addEventListener('mousedown', function (event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;

        if (target.id != 'close') {
            dragFlag = true;
            mouseoffsetX = e.pageX - $('ui_dialog').offsetLeft;
            mouseoffsetY = e.pageY - $('ui_dialog').offsetTop;
        }
    });

    // 鼠标事件2：鼠标移动，标题栏跟随移动
    // 计算更新后的标题栏坐标：鼠标坐标-鼠标相对标题栏的坐标
    document.onmousemove = function (event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;

        if (target.id != 'close') {
            // 浮层跟随鼠标移动后的坐标
            var moveX = e.pageX - mouseoffsetX;
            var moveY = e.pageY - mouseoffsetY;

            // 浮层可移动范围限定
            // moveX > 0，且 moveX < (浏览器窗口宽度-浮层宽度)
            // moveY > 0，且 moveX < (浏览器窗口高度-浮层高度)
            var pageWidth = document.documentElement.clientWidth;
            var pageHeight = document.documentElement.clientHeight;

            var dialogWidth = $('ui_dialog').offsetWidth;
            var dialogHeight = $('ui_dialog').offsetHeight;

            var maxX = pageWidth - dialogWidth;
            var maxY = pageHeight - dialogHeight;

            // 移动限定条件，是否可移动限定，移动范围限定
            moveX = Math.min( maxX,Math.max(0,moveX));
            moveY = Math.min( maxY,Math.max(0,moveY));
            if (dragFlag === true) {
                $('ui_dialog').style.left = moveX + 'px';
                $('ui_dialog').style.top = moveY + 'px';
            }
        }
    }

    // 鼠标事件3：鼠标松下，标记为不可拖动状态
    document.onmouseup = function(){
        dragFlag = false;
    }
}

window.onresize = function () {
    if ($('mask').style.display == 'block') {
        autoCenter($('ui_dialog'));
    }
}

// 通过元素id获取元素
function $(id) {
    return document.getElementById(id);
}

// 模块自动在浏览器居中方法，且显示蒙层
function autoCenter(el, scrollX, scrollY) {
    // 必须先显示再计算，否则获取元素的宽和高均为零
    $('mask').style.display = 'block';
    $('ui_dialog').style.display = 'block';

    //蒙层显示，遮住页面全部内容
    document.documentElement.clientHeight > document.body.clientHeight ? $('mask').style.height = document.documentElement.clientHeight + 'px' : $('mask').style.height = document.body.clientHeight + 'px';

    var bodyW = document.documentElement.clientWidth;
    var bodyH = document.documentElement.clientHeight;

    var elW = el.offsetWidth;
    var elH = el.offsetHeight;

    el.style.left = (bodyW - elW) / 2 + 'px';
    el.style.top = (bodyH - elH) / 2 + 'px';
}