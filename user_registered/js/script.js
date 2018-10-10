window.onload = function () {
    var oInputs = document.getElementsByTagName('input');
    var oName = oInputs[0];
    var pwd = oInputs[1];
    var pwdCon = oInputs[2];
    var oPs = document.getElementsByTagName('p');
    var name_msg = oPs[0];
    var pwd_msg = oPs[1];
    var pwdCon_msg = oPs[2];
    var name_count = document.getElementById('count');
    var oEms = document.getElementsByTagName('em');
    var name_length = 0;


    //用户名检查
    oName.onfocus = function () {
        name_msg.style.display = "block";
        name_msg.innerHTML = '<i class="ati"></i>5-25个字符，1个汉字为两个字符，推荐使用中文会员名';
    }
    oName.onkeyup = function () {
        name_count.style.visibility = 'visible';
        name_length = getLength(this.value);
        if (name_length > 0) {
            name_count.innerHTML = name_length + '个字符';
        } else {
            name_count.style.visibility = 'hidden';
        }

    }
    oName.onblur = function () {
        //含有非法字符
        var re = /[^\w\u4e00-\u9fa5]/g;
        if (re.test(this.value)) {
            name_msg.innerHTML = '<i class="err"></i>含有非法字符！';
        }
        //不能为空
        else if (this.value == '') {
            name_msg.innerHTML = '<i class="err"></i>不能为空！';
        }
        //长度超过25字符
        else if (getLength(this.value) > 25) {
            name_msg.innerHTML = '<i class="err"></i>不能超过25个字符！';
        }
        //长度少于6个字符
        else if (getLength(this.value) < 6) {
            name_msg.innerHTML = '<i class="err"></i>不能少于6个字符！';
        }
        //OK👌
        else {
            name_msg.innerHTML = '<i class="ok"></i>ok！';
        }
    }

    // 密码输入框检查
    pwd.onfocus = function () {
        pwd_msg.style.display = 'block';
        pwd_msg.innerHTML = '<i class="ati"></i>6-16个字符，请使用字母加数字或符号的组合密码，不能单独使用字母、数字或符号';
    }
    pwd.onkeyup = function () {
        //大于5个字符为“中”
        if (getLength(this.value) > 5) {
            for (var i = 0; i < oEms.length; i++) {
                oEms[i].className = '';
            }
            oEms[1].className = 'active';
            pwdCon.disabled = false;
            pwdCon_msg.style.display = 'block';

        }
        // 大于10个字符为“强”
        if (getLength(this.value) > 10) {
            for (var i = 0; i < oEms.length; i++) {
                oEms[i].className = '';
            }
            oEms[2].className = 'active';
            pwdCon.disabled = false;
            pwdCon_msg.style.display = 'block';
        }
        //小于5个字符为“弱”
        if (getLength(this.value) <= 5) {
            for (var i = 0; i < oEms.length; i++) {
                oEms[i].className = '';
            }
            oEms[0].className = 'active';
            pwdCon.disabled = true;
            pwdCon.value = '';
            pwdCon_msg.style.display = 'none';
        }
    }
    pwd.onblur = function () {
        var pwdValue = this.value;
        var strLen = repeatStr(pwdValue, pwdValue.charAt(0));
        var re_n = /[^\d]/g;
        var re_w = /[^a-zA-Z_]/g;
        if (pwdValue.length < 6 || pwdValue.length > 16) {
            pwd_msg.innerHTML = '<i class="err"></i>长度应为6-16之间！';
        } else if (strLen == pwdValue.length) {
            pwd_msg.innerHTML = '<i class="err"></i>不能使用相同字符！';
        } else if (pwdValue == '') {
            pwd_msg.innerHTML = '<i class="err"></i>不能为空';
        } else if (!re_n.test(pwdValue)) {
            pwd_msg.innerHTML = '<i class="err"></i>不能全为数字';
        } else if (!re_w.test(pwdValue)) {
            pwd_msg.innerHTML = '<i class="err"></i>不能全为字母';
        } else {
            pwd_msg.innerHTML = '<i class="ok"></i>OK！';
        }

    }

    //确认密码输入框检查
    pwdCon.onblur = function () {
        if (this.value != pwd.value) {
            pwdCon_msg.innerHTML = '<i class="err"></i>两次输入的密码不一致！';
        } else {
            pwdCon_msg.innerHTML = '<i class="ok"></i>OK！';
        }
    }

    // 检查字符串是否完全由同一个字符组成，返回的长度与字符串长度是否一致，一致表示是由同一个字符组成
    function repeatStr(str, chr) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) == chr) {
                len++;
            }
        }
        return len;
    }

    //  检查返回字符串的字节长度，处理双字节字符长度
    function getLength(str) {
        return str.replace(/[^\x00-xff]/g, 'xx').length;
    }

}
