(function (doc) {
	var column = 5,
		gap = 10,
		itemWidth = (1200 - (column - 1) * gap) / column,
		minArr = [],
		minIndex = -1;

	var oWrap = doc.getElementsByClassName('js_wrap')[0],
		oItems = oWrap.getElementsByClassName('wf-item'),
		itemLen = oItems.length,
		item;

	var init = function () {
		bindEvent();
	}

	function bindEvent() {
		setImgPos();
	}

	function setImgPos() {
		for (var i = 0; i < itemLen; i++) {
			item = oItems[i];
			item.style.width = itemWidth + 'px';

			if (i < column) {
				item.style.top = 0;
				item.style.left = (i % column) * (itemWidth + gap) + 'px';
				minArr.push(item.offsetHeight);
			} else {
				minIndex = getMinIndex(minArr);
				item.style.left = oItems[minIndex].offsetLeft + 'px';
				item.style.top = minArr[minIndex] + gap + 'px';
				minArr[minIndex] += item.offsetHeight + gap;
			}
		}
	}

	function getMinIndex(arr) {
		return [].indexOf.call(arr, Math.min.apply(null, arr));
	}

	window.onload = function(){
		init();
	}
})(document);