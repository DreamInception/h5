/*-----------------------------获取url参数后面的字符串方法-------------------------------*/
 function getUrlParam() {
     var result = new Object();
     var url = window.location.search;
     if(url.indexOf('?')!=-1){
         var str = url.substr(1);
         var strs = str.split("&");
         for(var i=0; i< strs.length; i++){
             var key = strs[i].split('=')[0];
             var value = strs[i].split('=')[1];
             result[key] = value;
         }
         return result;
     } else {
    	 return {};
     }
 }
 
 function injectHeaders(headers){
	 var h = headers || {};
	 h['Doro-Client']='H5';
	 return h;
 }
/*--------------------显示或隐藏遮罩层----------------------*/
function showMask() {
	var bgHtml = '<div id="popularMask" class="popularMask"></div>';
	$('body').append(bgHtml);
	$("#popularMask").show();
	var outtime= setTimeout(function (){
		outtime=null;
		var bgText = '<p style="margin-top: 45%;">请求处理中……</p>';
		$("#popularMask").append(bgText);
		$("#popularMask").show();
	},1000);
	return outtime;
}
function hideMask(outtime){
	if(outtime!=null){
		clearTimeout(outtime);
	}
	$("#popularMask").remove();
}

 var rest = new function(){
	 var successCode = '0000';
	 var invalidSession= '4001';
	 
	 this.post = function(request, dataHandler, errorHandler){
		 var outtime=showMask();
		 Vue.http.post(request.url, request.data, {
			 headers: injectHeaders(request.headers),
			 params : request.params
		 }).then(function (response) {
         	rest.response(response, dataHandler);
			 hideMask(outtime);
        },function (response) {
        	rest.error(response, errorHandler);
			 hideMask(outtime);
          });
	 };
	 
	 this.get = function(request, dataHandler, errorHandler){
		 var outtime=showMask();
		 Vue.http.get(request.url, {
			 headers: injectHeaders(request.headers),
			 params : request.params
		 }).then(function (response) {
         	rest.response(response, dataHandler);
			 hideMask(outtime);
        },function (response) {
        	rest.error(response, errorHandler);
			 hideMask(outtime);
          });
	 };
	 
	 this.put = function(request, dataHandler, errorHandler){
		 var outtime=showMask();
		 Vue.http.put(request.url, request.data, {
			 headers: injectHeaders(request.headers),
			 params : request.params
		 }).then(function (response) {
         	rest.response(response, dataHandler);
			 hideMask(outtime);
        },function (response) {
        	rest.error(response, errorHandler);
			 hideMask(outtime);
		 });
	 };
	 
	 this.response = function(response, dataHandler, errorHandler){
		 var responseData = response.data;
		 if(dataHandler){
			 dataHandler(responseData);
		 }
	 };

	 this.error = function(response, errorHandler){
		 var responseData = response.data;
		 if( responseData==null){
			 return;
		 }
		 if(responseData.error){
			 var err = responseData.error;
			 if(errorHandler){
				 errorHandler(responseData);
			 } else {
			 	alert(err.message + '('+err.code+')');
			 }
			 if(err.code == invalidSession){
				 storage.set('userId', null);
				 storage.set('user', null);
				 window.location.href = '/h5/html/user/login.html?from='+ encodeURIComponent(window.location.pathname+window.location.search);
			 }
		 } else if (responseData.status){
			 alert(responseData.statusText+'('+responseData.status+')');
		 }
	 }
 }
 
 
 var storage = new function(){
	 this.get = function(key){
		 var raw = sessionStorage[key];
		 if(raw != null){
			 return JSON.parse(raw);
		 }
		 return null;
	 };
	 this.set = function(key, val){
		 if(val != null){
			 sessionStorage[key] = JSON.stringify(val);
		 } else {
			 sessionStorage[key] = null;
		 }
	 };
	 
 };
 
function getFromUrl(){
	 var from = getUrlParam().from;
	 if(from != null){
		 return decodeURIComponent(from);
	 }
	 return null;
 }
 
 var userSession = new function(){
	 this.checkId = function(){
		 var userId = storage.get('userId');
		 if(userId == null){
    		window.location.href = '/h5/html/user/login.html?from='+ encodeURIComponent(window.location.pathname+window.location.search);
    		return false;
   		 }
		 return true;
	 };
	 

	this.checkRealName = function() {
		var user = storage.get('user');
		if (!user.realNameChecked) {
			window.location.href = '/h5/html/myCenter/bindCard.html?from=' + encodeURIComponent(window.location.pathname+window.location.search);
			return false;
		}
		return true;
	};
 };

var sendMsgTxt = new function () {
	this.show = function(setTxt){

		var timer = null;
		var leftSecond = 60;
		var prop = true;
		var defaultBg = false;
		setTxt(leftSecond+'s',prop,defaultBg);
		timer = setInterval(setRemainTime, 1000);

		function setRemainTime() {
			if (leftSecond > 0) {
				prop = true;
				defaultBg = false;
				setTxt(leftSecond+'s',prop,defaultBg);
				leftSecond--;
			}
			else{
				clearInterval(timer);
				prop = false;
				defaultBg = true;
				setTxt('重发',prop,defaultBg);
			}
		}
	}
	
}

var alertWin = new function () {
	this.show = function (showhandler) {
		var maskDisplay = true;
		var winDisplay = true;
		showhandler(maskDisplay,winDisplay);
	};
	this.close = function (closehandler) {
		var maskDisplay = false;
		var winDisplay = false;
		closehandler(maskDisplay,winDisplay);
	}
}

function doWechatTokenLogin() {
	var wechatToken = getUrlParam().wechatToken || storage.get('wechatToken');
	if(!wechatToken){
		return;
	}
	
	storage.set('wechatToken',wechatToken);
	
	var user = storage.get('user');
	var userId = storage.get('userId');
	
	// if user has logining, then return
	if(user && userId){
		return;
	}
	
	// if do once, then return;
	if(storage.get('hasDoWechatTokenLogin')){
		return;
	}
	
	storage.set('hasDoWechatTokenLogin',true);
	
	$.ajax({
		type :'post',
		url : '/api/auth/wechat',
		data : wechatToken,
		dataType : 'json',
		contentType:'application/json',
		async:false,
		success:function(successRtnData){
			storage.set('user', successRtnData);
	        storage.set('userId', successRtnData.userId);
	        if(wechatLoginCallback){
	        	wechatLoginCallback();	
	        }
		},
		error:function(errorRtnData){
			console.log(errorRtnData);
		}
	})
}

doWechatTokenLogin();

function getChannel(){
	var channel = getUrlParam().channel;
	if(!channel){
		return;
	}
	
	storage.set('channel',channel);
}

getChannel();

Date.prototype.format = function(fmt) { 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

var checkInput=new function(){
	this.validatePhoneNum=function(obj, errorId) {
		var $this = obj;
		if (/^1[3|4|5|6|7|8]\d{9}$/.test($this)) {
			$("#" + errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
			return true;
		} else {
			$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
			return false;
		}
	}
	this.validatePassword=function(obj, errorId) {
		var $this = obj;
		if (/^(\w){6,16}$/.test($this)) {
			$("#" + errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
			return true;
		} else {
			$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
			return false;
		}
	}
	this.validateIDNumber=function(obj, errorId) {
		var $this = obj;
		if (/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test($this)) {
			$("#" + errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
			return true;
		} else {
			$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
			return false;
		}
	}
	this.validateAmountNum=function(obj,errorId){
		if(obj==''|| obj==null || (!(/(^[1-9]\d*$)/.test(obj))) || parseInt(obj)<100){
			$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
			return false;
		}else{
			$("#" + errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
			return true;
		}
	}
	this.combinedCheck=function(a,b,c,d,errorId){
		if(a && b && c & d){
			$("#"+errorId).css("background", "#ac9354").css("color","#ffffff").removeAttr("disabled");
		}else{
			$("#" + errorId).css("background", "#c3b38a").css("color","#fff").attr("disabled",true);
		}
	}
}

function NumberFixed(num, fixedVal){
	var newFixedVal = fixedVal + 1;
	var newNum = num.toFixed(newFixedVal);
	return newNum.substring(0, newNum.lastIndexOf('.') + newFixedVal);
}

/**
 * 格式化日期字符串/日期对象
 * @param datetime
 * @param pattern
 * @returns {String}
 */

function formatDate(datetime, pattern){
    var _d = new Date();
    if(typeof datetime == 'object'){
        _d = datetime;
    }else if(typeof datetime == 'string'){
        _d = parseDate(datetime);
    }
    
    var y = _d.getFullYear();
    var M = _d.getMonth() + 1;
    var d = _d.getDate();
    var h = _d.getHours();
    var m = _d.getMinutes();
    var s = _d.getSeconds();
    
    var yyyy = y;
    var MM = (M < 10 ? ('0' + M) : M);
    var dd = (d < 10 ? ('0' + d) : d);
    var HH = (h < 10 ? ('0' + h) : h);
    var mm = (m < 10 ? ('0' + m) : m);
    var ss = (s < 10 ? ('0' + s) : s);
    
    var fmt = new String(pattern).replace(/yyyy/gi, yyyy).replace(/MM/g, MM).replace(/dd/gi, dd).replace(/HH/gi, HH).replace(/mm/g, mm).replace(/ss/gi, ss);
    fmt = fmt.replace(/y/gi, y).replace(/M/g, M).replace(/d/gi, d).replace(/h/gi, h).replace(/m/g, m).replace(/s/gi, s);
    
    return fmt;
}

/**
 * 转化日期字符串
 */
function parseDate(dateStr){
    if(dateStr=='')
        return null;
    var _dateStr = new String(dateStr).replace(/\-/g, '/').replace(/\.\d+$/, '');
    var date = new Date(_dateStr);
    if(date.toString() !== 'Invalid Date'){
        return date;
    }
    return null;
}

function scrollInit(callback) {
    var pullUpEl = document.getElementById('pullUp'),
	    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        scrollbarClass: 'myScrollbar', 
        useTransition: false, 
        onRefresh: function () {
            if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
            if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...'; 
                if($('#pullUp').css("display") == "block"){
                	callback();
                }               
            }
        }

    });
}


var enycryptPhoneNum = function(phone){
	/*var phoneNum = phone.toString();
	var startIndex = 3;
	var endIndex = 7;
	var newPhone = phoneNum.replace(phoneNum.substring(startIndex,endIndex),'****');*/
	if(!phone){
		return phone;
	}
	var mobileArray = phone.split('');
	mobileArray.splice(3, 4, '****');
	var newPhone  =mobileArray.join('');
	
	return newPhone;
}



function getDeviceinfo() {
	var u = navigator.userAgent,
		app = navigator.appVersion;
	var result = {};
	result.trident = u.indexOf('Trident') > -1, //IE内核
		result.presto = u.indexOf('Presto') > -1, //opera内核
		result.gecko = u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
		result.mobile = !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
		result.ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		result.android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,//安卓终端
		result.iPhone = u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
		result.iPad = u.indexOf('iPad') > -1, //是否iPad
		result.webApp = u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
	result.language = (navigator.browserLanguage || navigator.language).toLowerCase();

	return result;
}

/*--------------------截取两位小数，不四舍五入----------------------*/
function cutFloat(value){
/*	var split1 = value.split(".");
	if(split1.length == 1){
		return value+'.00';
	}
	else if(split1.length == 2){
		return value+'';
	}
	else if(split1.length > 2){
		var point = split1.substring(0,1)
	}*/
	NumberFixed(currentAmount, 2);
}
