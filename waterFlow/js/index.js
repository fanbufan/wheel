(function (doc) {
	var WaterFlow = function (wrapper, opt) {
		this.wrapper = doc.getElementsByClassName(wrapper)[0];
		this.column = opt.column;
		this.gap = opt.gap;
		this.itemWidth = (this.wrapper.offsetWidth - (this.column - 1) * this.gap) / this.column;
		this.pageNum = 0;
		this.pageSize = 0;
		this.heightArr = [];
	}

	WaterFlow.prototype = {
		init: function () {
			this.getImgDatas(this.pageNum);
			this.bindEvent();
		},

		bindEvent: function () {
			window.addEventListener('scroll', this.scrollToBottom.bind(this), false);
		},

		scrollToBottom: function () {
			if (getScrollTop() + getWindowHeight() >= getScrollHeight()) {
				this.pageNum++;
				if (this.pageNum < this.pageSize) {
					this.getImgDatas(this.pageNum);
				}
			}
		},

		getImgDatas: function (pageNum) {
			var _self = this;
			xhr.ajax({
				url: 'http://www.beanjunior.xyz/waterFlow/server/index.php',
				type: 'POST',
				dataType: 'JSON',
				data: {
					pageNum: pageNum
				},
				success: function (data) {
					if (data != 'NO DATA') {
						var pageData = JSON.parse(data.pageData);
						_self.pageSize = parseInt(data.pageSize);

						_self.renderList(pageData, pageNum);
					}
				}
			});
		},

		renderList: function (data, pageNum) {
			var oWrapper = this.wrapper,
				oFrag = document.createDocumentFragment(),
				itemWidth = this.itemWidth,
				heightArr = this.heightArr,
				gap = this.gap,
				itemHeight = 0,
				itemLeft = 0,
				minIndex = -1;

			data.forEach(function (elem, index) {
				var oItem = document.createElement('div'),
					oImg = new Image();

				oImg.src = elem.img;
				oItem.className = 'wf-item';
				oItem.style.width = itemWidth + 'px';
				oItem.appendChild(oImg);

				itemHeight = itemWidth * elem.height / elem.width;

				if (index < 5 && pageNum == 0) {
					itemLeft = (index % 5) == 0 ? 0 : index * (itemWidth + gap);
					oItem.style.left = itemLeft + 'px';
					heightArr.push(itemHeight);
				} else {
					minIndex = getMinIndex(this.heightArr);
					oItem.style.left = minIndex * (itemWidth + gap) + 'px';
					oItem.style.top = this.heightArr[minIndex] + gap + 'px';
					heightArr[minIndex] += itemHeight + gap;
				}

				oFrag.appendChild(oItem);
				oImg.style.opacity = '1';
			}, this);

			oWrapper.appendChild(oFrag);
		}
	}

	function getMinIndex(arr) {
		return [].indexOf.call(arr, Math.min.apply(null, arr));
	}

	window.WaterFlow = WaterFlow;
})(document);