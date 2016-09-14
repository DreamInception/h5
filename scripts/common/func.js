var base = document.getElementById("base").href;
/*--------------------显示弹出窗口----------------------*/
function windowShow(id) {
	var domobj = $('#' + id);
	$("#" + id).css("display", "block");
	setTimeout(function() {
		$('#' + id).addClass("showWin");
	}, 200);
	showMask(domobj);
}
/*--------------------隐藏弹出窗口----------------------*/
function windowHide(id) {
	$("#" + id).removeClass("showWin");
	$("#maskBg").hide();
}
/*--------------------显示遮罩层----------------------*/
function showMask(dom) {
	if (!$.data(dom, "pageMask")) {
		var bgHtml = '<div id="maskBg" class="maskBg">请求提交中……</div>';
		$('body').append(bgHtml);
		$.data(dom, "pageMask", true);
	}
	$("#maskBg").show();
}
/*--------------------显示tab标签-----------------------*/
function tabShow(obj, className) {
	var $this = $(obj);
	elementId = $this.attr('id');
	showSecId = elementId.slice(0, elementId.indexOf('-tab'));
	// $this.css("background", "yellow").siblings().css("background",
	// "#ffffff");
	$this.addClass(className).siblings().removeClass(className);
	console.log("show tab area id is " + showSecId);
	$("#" + showSecId).show().siblings().hide();
}
/*--------------------创建图片二维码-----------------------*/
function createCode(id) {
	var length = 4;
	obj = $("#" + id);
	code = '';
	selectChar = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e',
			'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
			's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
			'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
			'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
	console.log(selectChar.length);
	for (var i = 0; i < length; i++) {
		var charIndex = Math.floor(Math.random() * 60);
		code = code + selectChar[charIndex];
	}

	obj.val(code);
	return code;
}

function validateIDNumber(obj, errorId, msg) {
	var $this = obj;
	if (/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($this.value)) {
		$("#" + errorId).css("visibility", "hidden");
		return true;
	} else {
		showErrorMsg(errorId, msg);
		return false;
	}
}
function validatePhoneNum(obj, errorId, msg) {
	var $this = obj;
	if (/^1[3|4|5|6|7|8]\d{9}$/.test($this.value)) {
		$("#" + errorId).css("visibility", "hidden");
		return true;
	} else {
		showErrorMsg(errorId, msg);
		return false;
	}
}
function validatePassword(obj, errorId, msg) {
	var $this = obj;
	if (/^(\w){1,16}$/.test($this.value)) {
		$("#" + errorId).css("visibility", "hidden");
		return true;
	} else {
		showErrorMsg(errorId, msg);
		return false;
	}
}
function validateTransactPsw(obj, errorId, msg) {
	var $this = obj;
	if (/^(\d){6}$/.test($this.value)) {
		$("#" + errorId).css("visibility", "hidden");
		return true;
	} else {
		showErrorMsg(errorId, msg);
		return false;
	}
}
function validateSecondPsw(obj, lastPsw, errorId, msg) {
	var $this = obj;
	if ($this.value == lastPsw) {
		$("#" + errorId).css("visibility", "hidden");
		return true;
	} else {
		showErrorMsg(errorId, msg);
		return false;
	}
}
function showErrorMsg(errorId, msg) {
	$("#" + errorId).css("visibility", "visible").html(msg);
}
/*--------------------发送短信二维码-----------------------*/
function sendMessage(phoneId, msgCodeId, errorId, msg, tpl, randImg) {
	var phoneObj = $("#" + phoneId), msgCodeObj = $("#" + msgCodeId);
	tplObj = $("#" + tpl);// 短信回执类型参数
	randImgObj = $("#" + randImg);
	intervalTimeObj = null,// timer变量，控制时间
	count = 60,// 间隔函数，1秒执行
	leftCount = 60,// 当前剩余秒数
	code = '',// 验证码
	codeLength = 6;// 验证码长度
	if (phoneObj.val() != "") {
		// 产生验证码
		for (var i = 0; i < codeLength; i++) {
			code = code + parseInt(Math.random() * 9).toString();
		}
		msgCodeObj.attr("disabled", "true").css("background", "#c2c2c2").css(
				"cursor", "pointer");
		msgCodeObj.val(count + "秒后重新获取");
		intervalTimeObj = window.setInterval(setRemainTime, 1000);
		console.log("pass phone num is " + phoneObj.val()
				+ "&short message code is " + code);
		$("#" + errorId).css("visibility", "hidden");
		// 向后台发送处理数据
		$.ajax({
			type : "POST", // 用POST方式传输
			dataType : "json", // 数据格式:JSON
			url : base + '/texting/getTexting', // 目标地址
			data : "phone=" + phoneObj.val() + "&code=" + code + "&tpl="
					+ tplObj.val() + "&randImg=" + randImgObj.val(),
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("出错！");
			},
			success : function(data) {
				if (data.errMsg == "操作成功！") {
					alert("短信已发送！");
					$('#ticket').val(data.rows[0]);
				} else {
					alert(data.errMsg);
				}
			}
		});
	} else {
		showErrorMsg(errorId, msg);
	}
	function setRemainTime() {
		if (leftCount == 0) {
			clearInterval(intervalTimeObj);
			msgCodeObj.removeAttr("disabled");
			msgCodeObj.val("重新获取验证码").css("background", "#e74d46").css(
					"cursor", "pointer");
			code = '';
		} else {
			leftCount--;
			msgCodeObj.val(leftCount + "秒后重新获取");
		}
	}
}
function validateMsgCode(obj, errorId, msg) {
	var $this = obj;
	if (/(^(\w){4}$)|(^(\d){6}$)/.test($this.value)) {
		$("#" + errorId).css("visibility", "hidden");
		return true;
	} else {
		showErrorMsg(errorId, msg);
		return false;
	}
}
/*--------------------鼠标滑到按钮上颜色改变-----------------------*/
function btnColorChange(classname, originColor, newColor) {
	$("." + classname).hover(function() {
		$(this).css("background", newColor);
	}, function() {
		$(this).css("background", originColor);
	});
};
/*--------------------获取字段的字节长度-----------------------*/
function getStrLength(str){
    // 如果是英文字符或数字或符合，长度加1；汉字字符，长度加2
    var length = str.length;
    var realLength = 0;
    var charCode = -1;
    for(var i=0;i<length;i++){
        charCode = str.charCodeAt(i);

        if(charCode>=0 && charCode <= 128){
            realLength = realLength + 1;
        }else{
            realLength = realLength + 2;
        }
    }
    return realLength;
}
/*--------------------截取字段的字节长度到指定长度-----------------------*/
function cutString(str,afterLen){
    var len = str.length;
    var cal_len = 0;
    var letter = 0;
    var newLetter = '';
    for(var i=0;i<len;i++){
        letter = str.charAt(i);
        cal_len++;
        newLetter = newLetter.concat(letter);
        if(cal_len >= afterLen){
            newLetter = newLetter.concat("...");
            return newLetter;
        }
    }
    if(len < afterLen){
        return str;
    }
}