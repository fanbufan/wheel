window.onload = function () {
  init();
}

var init = (function () {
  initMenu()
});

var initMenu = (function () {
  var oMenu = document.getElementsByClassName('menu-wrap')[0],
    oMain = oMenu.getElementsByClassName('main')[0],
    oMainItems = oMain.getElementsByClassName('main-item'),
    mainLen = oMainItems.length,
    oSub = oMenu.getElementsByClassName('sub')[0],
    oSubItems = oSub.getElementsByClassName('sub-item'),
    mainItem,
    subItem,
    isInSub = false,
    isFirst = true,
    mousePoses = [],
    t;

  // 主菜单列表项绑定移入事件，切换列表项
  for (var i = 0; i < mainLen; i++) {
    mainItem = oMainItems[i];
    addEvent(mainItem, 'mouseenter', menuItemMouseEnter);
  }

  // 菜单栏绑定移入移出事件，初始化主菜单，显示隐藏子菜单
  addEvent(oMenu, 'mouseenter', menuMouseIn);

  addEvent(oMenu, 'mouseleave', menuMouseOut);

  // 鼠标移入子菜单sub时，
  addEvent(oSub, 'mouseenter', function () {
    isInSub = true;
  });

  addEvent(oSub, 'mouseleave', function () {
    isInSub = false;
  });

  function menuItemMouseEnter(e) {
    var e = e || window.event,
      tar = e.target || window.srcElement,
      thisIdx = Array.prototype.indexOf.call(oMainItems, tar),
      curPos = mousePoses[mousePoses.length - 1] || { x: 0, y: 0 },
      lastPos = mousePoses[mousePoses.length - 2] || { x: 0, y: 0 },
      toDelay = doTimeout(curPos, lastPos);

    if (t) {
      clearTimeout(t);
    }

    oSub.className = 'sub';

    if (isFirst) {
      addActive(thisIdx);
      isFirst = false;
    }else{
      if (toDelay) {
        t = setTimeout(() => {
          if (!isInSub) {
            addActive(thisIdx);
          }
        }, 300);
      } else {
        addActive(thisIdx);
      }
    }
  }

  function menuMouseIn() {
    addEvent(document, 'mousemove', mouseMove);
  }

  function menuMouseOut() {
    removeAllActive();
    oSub.className += ' hide';
    removeEvent(document, 'mousemove', mouseMove);
    clearTimeout(t);
  }

  function mouseMove(e) {
    var e = e || window.event;

    mousePoses.push({
      x: pagePos(e).x,
      y: pagePos(e).y
    });

    if (mousePoses.length > 3) {
      mousePoses.shift();
    }
  }

  function doTimeout(curPos, lastPos) {
    var topLeft = {
      x: getElemDocPosition(oMain).left + parseInt(getStyle(oMain, 'width')),
      y: getElemDocPosition(oMain).top
    };

    var bottomLeft = {
      x: getElemDocPosition(oMain).left + parseInt(getStyle(oMain, 'width')),
      y: getElemDocPosition(oMain).top + parseInt(getStyle(oMain, 'height'))
    };

    return pointInTriangle({
      curPos,
      lastPos,
      topLeft,
      bottomLeft
    });
  }

  function addActive(index) {
    removeAllActive();
    oMainItems[index].className += ' active';
    oSubItems[index].className += ' active';

  }

  function removeAllActive() {
    for (var i = 0; i < mainLen; i++) {
      mainItem = oMainItems[i];
      subItem = oSubItems[i];
      mainItem.className = 'main-item';
      subItem.className = 'sub-item';
    }
  }
});