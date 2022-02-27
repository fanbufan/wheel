var Slider = function(mainSlider) {
    var sliderList = mainSlider.getElementsByClassName('main-slider-list')[0],
        sliderItems = sliderList.getElementsByClassName('main-slider-item'),
        nextBtn = mainSlider.getElementsByClassName('dir-forward')[0],
        previousBtn = mainSlider.getElementsByClassName('dir-backward')[0],
        indicatorItems = mainSlider.getElementsByClassName('indicator-item'),
        timerMove = null,
        _self = this,
        unitDistance = parseInt(sliderItems[0].offsetWidth);

    this.indicatorItems = indicatorItems;
    this.index = Math.abs(parseInt(sliderList.offsetLeft / unitDistance)) - 1;
    this.unitDistance = unitDistance;
    this.nextBtn = nextBtn;
    this.timerAuto = null;
    this.notMovingFlag = true;
    this.leftSign = -unitDistance;
    this.rightSign = -(sliderItems.length - 2) * unitDistance;

    nextBtn.onclick = function() {
        if (_self.notMovingFlag) {
            _self.move(sliderList, -unitDistance, timerMove);
        }
    };

    previousBtn.onclick = function() {
        if (_self.notMovingFlag) {
            _self.move(sliderList, unitDistance, timerMove);
        }
    };

    mainSlider.onmouseenter = function() {
        clearInterval(_self.timerAuto);
    };

    mainSlider.onmouseleave = function() {
        _self.autoPlay(nextBtn);
    };

    this.autoPlay(nextBtn);

    for (var i = 0; i < indicatorItems.length; i++) {
        (function(j) {
            indicatorItems[j].onclick = function() {
                distance = (_self.index - j) * unitDistance;
                _self.move(sliderList, distance, timerMove);
            }
        })(i);
    }

}

Slider.prototype.autoPlay = function(nextBtn) {
    if (this.notMovingFlag) {
        this.timerAuto = setInterval(() => {
            nextBtn.onclick();
        }, 2000);
    }
}

Slider.prototype.move = function(obj, distance, timerMove) {
    clearInterval(timerMove);

    this.notMovingFlag = false;

    var target = parseInt(obj.offsetLeft) + distance,
        speed = 0,
        playTime = 10,
        interval = 10,
        currentLeft = 0;

    timerMove = setInterval(() => {
        currentLeft = parseInt(obj.offsetLeft);
        speed = (target - currentLeft) / playTime;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

        if (currentLeft !== target) {
            obj.style.left = currentLeft + speed + 'px';
        } else {
            clearInterval(timerMove);

            this.notMovingFlag = true;

            if (currentLeft > this.leftSign) {
                obj.style.left = this.rightSign + 'px';
            } else if (currentLeft < this.rightSign) {
                obj.style.left = this.leftSign + 'px';
            }

            this.index = Math.abs(parseInt(obj.offsetLeft / this.unitDistance)) - 1;
            this.changeIndicator(this.indicatorItems);
        }
    }, interval);
}

Slider.prototype.changeIndicator = function(indicatorItems) {
    for (var i = 0; i < indicatorItems.length; i++) {
        indicatorItems[i].className = 'indicator-item';
    }
    indicatorItems[this.index].className += ' selected';
}


var oMainSlider = document.getElementsByClassName('main-slider')[0],
    sliderList = oMainSlider.getElementsByClassName('main-slider-list')[0],
    sliderItems = sliderList.getElementsByClassName('main-slider-item'),
    slider = new Slider(oMainSlider);

sliderList.style.width = parseInt(sliderItems[0].offsetWidth) * sliderItems.length + 'px';