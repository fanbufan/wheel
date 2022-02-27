var $ = (function () {
	function _doAjax(opt) {
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		if (!xhr) {
			throw new Error('您的浏览器不支持发起异步HTTP请求');
		}

		var opt = opt || {},
			type = (opt.type || 'GET').toUpperCase(),
			url = opt.url,
			async = '' + opt.async === 'false' ? false : true,
			dataType = opt.dataType || 'JSON',
			data = opt.data || null,
			timeout = opt.timeout || 30000,
			error = opt.error || function () { },
			success = opt.success || function () { },
			complete = opt.complete || function () { },
			t = null;

		if (!url) {
			throw new Error('您没有填写URL');
		}

		xhr.open(type, url, async);
		type === 'POST' && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(type === 'GET' ? null : formatData(data));

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
					switch (dataType.toUpperCase()) {
						case 'JSON':
							success(JSON.parse(xhr.responseText));
							break;
						case 'TEXT':
							success(xhr.responseText);
							break;
						case 'XML':
							success(xhr.responseXML);
							break;
						default:
							success(JSON.parse(xhr.responseText));
							break;
					}
				} else {
					error();
				}

				complete();
				clearTimeout(t);
				t = null;
				xhr = null;
			}
		}

		t = setTimeout(function () {
			xhr.abort();
			clearTimeout(t);
			t = null;
			xhr = null;
			complete();
		}, timeout);
	}

	function formatData(data) {
		var str = '';
		for (var key in data) {
			str += key + '=' + data[key] + '&';
		}

		return str.replace(/&$/, '');
	}

	return {
		ajax: function (opt) {
			_doAjax(opt);
		},
		get: function (url, dataType, successCB, errorCB, completeCB) {
			_doAjax({
				type: 'GET',
				url: url,
				dataType: dataType,
				success: successCB,
				error: errorCB,
				complete: completeCB
			});
		},
		post: function (url, data, dataType, successCB, errorCB, completeCB) {
			_doAjax({
				type: 'POST',
				url: url,
				data: data,
				dataType: dataType,
				success: successCB,
				error: errorCB,
				complete: completeCB
			});
		}
	}
})();

function trimSpace(str) {
	return str.replace(/\s+/gim, '');
}

function $get(target) {
	var _s = target.charAt(0),
		rTarget = target.replace(_s, '');

	switch (_s) {
		case '#':
			return document.getElementById(rTarget);
			break;
		case '.':
			return document.getElementsByClassName(rTarget);
			break;
		default:
			return document.getElementsByTagName(target);
			break;
	}
}

function getDateTime(date, type) {
	date = date.toString().length === 10 ? date * 1000 : date;

	var date = new Date(date),
		y = addZero(date.getFullYear(date)),
		m = addZero(date.getMonth(date) + 1),
		d = addZero(date.getDay(date)),
		h = addZero(date.getHours(date)),
		i = addZero(date.getMinutes(date)),
		s = addZero(date.getSeconds(date));

	switch (type) {
		case 'date':
			return y + '-' + m + '-' + d;
			break;
		case 'time':
			return h + ':' + i + ':' + s;
			break;
		default:
			return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
			break;
	}
}

function addZero(num) {
	return num < 10 ? '0' + num : num;
}

// 接口没返回uptime和add_comment数据，前端自己构造数据，用户写页面
function constructData(data, add_comment_flag) {
	data.uptime = '1548799268';
	data.data_id = '1';

	if (add_comment_flag) {
		data.add_comment = {
			add_id: "2",
			comment: "2222222222222222222",
			id: "27",
			is_add_comment: "0",
			star_num: "5",
			status: "1",
			uptime: "1548760268",
			user_id: "2"
		}
	}

	return data;
}