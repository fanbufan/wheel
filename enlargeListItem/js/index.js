window.onload = function () {
  init();
}

function init() {

}

var Accordion = (function () {
  var oList = document.getElementsByClassName('list')[0],
    oItems = document.getElementsByClassName('list-item'),
    len = oItems.length,
    curIndex = 0,
    item;

  addEvent(oList, 'mouseover', function(){
    addEvent(this, 'mousemove', slide);
  })

  addEvent(oList, 'mouseout', function(){
    removeEvent(this, 'mousemove', slide);
  })

  function slide(e) {
    var e = e || window.event,
      tar = e.target || window.srcElement,
      oParent = findParent(tar),
      thisIndex = Array.prototype.indexOf.call(oItems, oParent);


    if (curIndex !== thisIndex) {
      curIndex = thisIndex;

      for (var i = 0; i < len; i++) {
        item = oItems[i];
        item.className = 'list-item';
      }

      oItems[curIndex].className += ' active';
    }

  }

  function findParent(target) {
    while (target.nodeName.toLowerCase() != 'li') {
      target = target.parentNode;
    }

    return target;
  }

})();