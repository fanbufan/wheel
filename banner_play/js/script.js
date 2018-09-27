// banner轮播区的img，是静态的。实际使用需要用js动态添加。
// 注意：需要分别在服务端返回的img列表中，添加额外的两张图片。
// 在列表首位之前，复制最后一张图片添加；在列表最后位之后，复制第一张图片添加。
// 即，若数据列表有a、b、c、d、e、f、g 这7张img，则需要在html中设置为g、a、b、c、d、e、f、g、a 这9张图。

window.onload = function(){
    var oContainer = document.getElementById('container');
    var oBox = oContainer.getElementsByClassName('box')[0];
    var oImgs = oBox.getElementsByTagName('img');
    var oTags = oContainer.getElementsByClassName('tags')[0];
    var oSpans = oTags.getElementsByTagName('span');
    var oPrev = document.getElementById('prev');
    var oNext = document.getElementById('next');
    var imgWidth = oImgs[0].offsetWidth;

    // 定义oPrev、oNext、oSpans的click定时器的返回值
    var timerClick = null;
    // 定义自动轮播play()定时器的返回值
    var timerPlay = null;
    // 动画不能叠加。flag为true表示没有动画正在执行，可以执行动画。false表示有动画正在执行，不能叠加执行。
    var flag = true;

    // 上一张、下一张按钮
    oPrev.onclick = function(){
        if (flag) {
            move(oBox, imgWidth);
        }
    }
    oNext.onclick = function(){
        if (flag) {
            move(oBox, -imgWidth);
        }
    }
    
    // 鼠标移入，停止轮播。鼠标移出，开始轮播。
    // （注意：oNext、oPrev、oSpans的点击，均需要移入oBox，所以不需要对这些函数做处理）
    oBox.onmouseenter = function(){
        clearInterval(timerPlay);
    }
    oBox.onmouseleave = function(){
        play();
    }
    // banner自动轮播，即每隔一段时间出发oNext.onclick
    function play(){
        var interval = 6000;
        timerPlay = setInterval(oNext.onclick,interval);
    }
    play();

    //点击圆点图标，切换banner
    for (var i=0;i<oSpans.length;i++){
        oSpans[i].onclick = function(){
            // 点击了第几个图标，想要切换到第几张图
            var myIndex = this.getAttribute('index');
            // 目的坐标-当前坐标=移动的距离
            // 目的坐标：-imgWidth*myIndex
            // 因为span的index属性是从1开始的，前面增加了额外一张图，正好相抵。如果span的index从0开始，index就需要+1乘imgWidth
            var distance = -imgWidth*myIndex-parseInt(oBox.offsetLeft);
            if (distance && flag) {
                move(oBox, distance);
            }
        }
    }

    var index = 1;
    //banner图片切换
    function move(obj, distance){
        // 动画正在执行，将flag更改为false，表示不能叠加动画
        flag = false;

        // banner循环切换时，从第一张图再prev和从最后一张再next均会产生闪白现象。
        // 前后各多添加一张图片。服务端返回图片为1~n，则banner图片设置n+2张图片。第一张为n，最后一张为1。从第二个位置显示，显示到第n+1个位置。
        // 定义左右范围标志，图片只能在leftSign、rightSign之间移动。
        var leftSign = -parseInt(imgWidth);
        var rightSign = -(oImgs.length-2)*parseInt(imgWidth);

        var playTime = 200;
        var interval = 10;
        var speed = distance/(playTime/interval);
        
        //移动的目标坐标
        var target = obj.offsetLeft + distance;

        timerClick = setInterval(function(){
            if ((speed<0 && parseInt(obj.offsetLeft)>target) || (speed>0 && parseInt(obj.offsetLeft)<target)) {
                obj.style.left = parseInt(obj.offsetLeft) + speed + 'px';
            }else{
                // 已移动到目标坐标，清除定时器
                clearInterval(timerClick);

                // 动画执行结束，flag更改为true，表示可以执行下一个动画
                flag = true;

                //超过右位标，回到第二个位置
                if (parseInt(obj.offsetLeft)<rightSign) {
                    obj.style.left = leftSign + 'px';
                }
                //超过左位标，回到第n+1位置
                if (parseInt(obj.offsetLeft)>leftSign) {
                    obj.style.left = rightSign + 'px';
                }

                //从第二个位置再prev，obj.offsetLeft为0，即index为0。
                // 从第n+1个位置再next，obj.offsetLeft为(oImgs.length-1)*imgWidth,即index为oImgs.length-1
                index = parseInt(obj.offsetLeft/-600);
                switch (index) {
                    case 0:
                        index = 6;
                        break;
                    case oImgs.length-1:
                        index = 1;
                        break;
                    default:
                        break;
                }
                changeTags(index);
            }
        },interval);
    }

    function changeTags(index){
        for(var i=0;i<oSpans.length;i++){
            oSpans[i].className = '';
        }
        oSpans[index-1].className = 'active';
    }
}
